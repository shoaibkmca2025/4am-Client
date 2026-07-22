-- ============================================================
-- 4AM Global Media Platform — Phase 0 foundation schema
-- Apply via Supabase SQL editor or `supabase db push`.
-- Every table has RLS ENABLED. The service-role key (server only)
-- bypasses RLS; anon/authenticated clients get least privilege.
-- ============================================================

-- ---------- helpers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'student' check (role in ('admin', 'staff', 'student')),
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Role checks live in SECURITY DEFINER functions so RLS policies can
-- consult profiles without recursive RLS evaluation. Declared after the
-- table because SQL-language function bodies are validated at creation.
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'staff')
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create policy "profiles: read own" on public.profiles
  for select using (id = auth.uid());
create policy "profiles: staff read all" on public.profiles
  for select using (public.is_staff());
-- No client insert/update/delete policies: profile rows are created by
-- the signup trigger below; role changes go through the service role only.

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- courses ----------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  venue text,
  college text,
  start_date date,
  end_date date,
  status text not null default 'draft' check (status in ('draft', 'active', 'completed')),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.courses enable row level security;
create trigger courses_updated_at before update on public.courses
  for each row execute function public.set_updated_at();

create policy "courses: staff full access" on public.courses
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- enrollments ----------
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  student_profile_id uuid references public.profiles (id),
  student_name text not null,
  student_email text not null,
  claim_key_hash text not null unique,          -- sha256; plaintext never stored
  claim_status text not null default 'pending' check (claim_status in ('pending', 'claimed')),
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.enrollments enable row level security;
create index if not exists enrollments_course_idx on public.enrollments (course_id);
create index if not exists enrollments_student_idx on public.enrollments (student_profile_id);

create policy "enrollments: staff full access" on public.enrollments
  for all using (public.is_staff()) with check (public.is_staff());
create policy "enrollments: student reads own" on public.enrollments
  for select using (student_profile_id = auth.uid());
-- Claiming (matching a key hash to a pending row) mutates via the service
-- role inside /api/portal/claim — clients never update enrollments directly.

-- ---------- certificates ----------
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null unique references public.enrollments (id) on delete cascade,
  certificate_serial text not null unique,      -- public, e.g. 4AM-2026-A7K3M2
  file_path text not null,                      -- private storage path
  issue_date date not null default current_date,
  verification_hash text not null,              -- HMAC(secret, serial:enrollment_id)
  qr_path text,                                 -- storage path of QR png
  show_file_publicly boolean not null default false,
  status text not null default 'active' check (status in ('active', 'revoked')),
  revoked_reason text,
  issued_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.certificates enable row level security;
create index if not exists certificates_serial_idx on public.certificates (certificate_serial);
create trigger certificates_updated_at before update on public.certificates
  for each row execute function public.set_updated_at();

create policy "certificates: staff full access" on public.certificates
  for all using (public.is_staff()) with check (public.is_staff());
create policy "certificates: student reads own" on public.certificates
  for select using (
    exists (
      select 1 from public.enrollments e
      where e.id = certificates.enrollment_id
        and e.student_profile_id = auth.uid()
    )
  );
-- Public verification goes through /api (service role + HMAC check):
-- anon clients get no direct row access.

-- ---------- leads ----------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  service text,
  budget text,
  message text not null,
  source text not null default 'website',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);
alter table public.leads enable row level security;
create policy "leads: staff read/update" on public.leads
  for select using (public.is_staff());
create policy "leads: staff update" on public.leads
  for update using (public.is_staff()) with check (public.is_staff());
-- Inserts come only from /api/leads via service role (rate-limited, Zod-validated).

-- ---------- blog_posts ----------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image text,
  author_id uuid references public.profiles (id),
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.blog_posts enable row level security;
create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

create policy "blog: anyone reads published" on public.blog_posts
  for select using (status = 'published');
create policy "blog: staff full access" on public.blog_posts
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- testimonials ----------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company text,
  quote text not null,
  avatar text,
  rating smallint check (rating between 1 and 5),
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.testimonials enable row level security;
create policy "testimonials: anyone reads published" on public.testimonials
  for select using (is_published = true);
create policy "testimonials: staff full access" on public.testimonials
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- newsletter_subscribers ----------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
create policy "newsletter: staff read" on public.newsletter_subscribers
  for select using (public.is_staff());
-- Subscribe/unsubscribe mutate via /api/newsletter (service role).

-- ---------- audit_log ----------
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles (id),
  action text not null,                          -- e.g. certificate.issue / revoke / reissue
  entity text not null,
  entity_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_log enable row level security;
create policy "audit: admin read" on public.audit_log
  for select using (public.is_admin());
-- Writes happen via service role only.

-- ---------- storage: private certificates bucket ----------
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', false)
on conflict (id) do nothing;

-- Staff can manage files in the bucket from the dashboard; students never
-- touch storage directly — downloads are short-lived signed URLs minted
-- by the server after an ownership check.
create policy "certs bucket: staff manage" on storage.objects
  for all using (bucket_id = 'certificates' and public.is_staff())
  with check (bucket_id = 'certificates' and public.is_staff());
