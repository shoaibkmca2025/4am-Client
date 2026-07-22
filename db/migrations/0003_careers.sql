-- ============================================================
-- Phase 3 (optional module): careers — openings + applications
-- ============================================================

create table if not exists public.job_openings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  department text,
  location text,
  employment_type text not null default 'full-time'
    check (employment_type in ('full-time', 'part-time', 'internship', 'contract')),
  description text,
  requirements text[] not null default '{}',
  salary_range text,
  status text not null default 'draft' check (status in ('draft', 'open', 'closed')),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.job_openings enable row level security;
create trigger job_openings_updated_at before update on public.job_openings
  for each row execute function public.set_updated_at();
create index if not exists job_openings_status_idx on public.job_openings (status, created_at desc);

-- Open roles are readable by anyone; everything else is staff-only.
create policy "openings: anyone reads open" on public.job_openings
  for select using (status = 'open');
create policy "openings: staff full access" on public.job_openings
  for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  opening_id uuid references public.job_openings (id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  portfolio_url text,
  resume_path text,                       -- private storage path
  cover_note text,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  created_at timestamptz not null default now()
);
alter table public.job_applications enable row level security;
create index if not exists job_applications_opening_idx on public.job_applications (opening_id, created_at desc);

-- Applications hold personal data: staff read/update only. Inserts arrive
-- exclusively through /api/careers/apply (service role, validated + rate-limited).
create policy "applications: staff read" on public.job_applications
  for select using (public.is_staff());
create policy "applications: staff update" on public.job_applications
  for update using (public.is_staff()) with check (public.is_staff());

-- ---------- private résumé storage ----------
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

create policy "resumes bucket: staff manage" on storage.objects
  for all using (bucket_id = 'resumes' and public.is_staff())
  with check (bucket_id = 'resumes' and public.is_staff());
