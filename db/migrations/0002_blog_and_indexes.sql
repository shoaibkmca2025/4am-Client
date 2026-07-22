-- ============================================================
-- Phase 3: blog/CMS support + query indexes
-- ============================================================

-- ---------- blog_posts: fields the CMS needs ----------
alter table public.blog_posts
  add column if not exists tags text[] not null default '{}',
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists reading_minutes int;

-- Published-feed ordering
create index if not exists blog_posts_published_idx
  on public.blog_posts (status, published_at desc);

-- ---------- audit_log: admin viewer ----------
create index if not exists audit_log_created_idx on public.audit_log (created_at desc);
create index if not exists audit_log_action_idx  on public.audit_log (action);

-- ---------- leads: inbox filtering ----------
create index if not exists leads_status_created_idx on public.leads (status, created_at desc);

-- ---------- enrollments: bulk-import dedupe within a course ----------
create unique index if not exists enrollments_course_email_uniq
  on public.enrollments (course_id, lower(student_email));
