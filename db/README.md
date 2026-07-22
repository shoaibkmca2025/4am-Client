# Database — schema & migrations

Postgres on Supabase. Migrations are plain SQL, applied in filename order.

## Applying a migration

```
node db/migrate.mjs            # apply pending migrations
node db/migrate.mjs --status   # list applied / pending, change nothing
```

The runner reads `DIRECT_URL` from `.env.local` (session-mode pooler — DDL
needs it; the transaction pooler on :6543 can't run migrations), applies
each `migrations/*.sql` in filename order inside a transaction, and records
it in `public.schema_migrations`. A failing file rolls back completely.

> **No ORM.** Security here rests on Postgres RLS. Prisma and similar ORMs
> connect as an owner role that **bypasses RLS**, and their migration engine
> conflicts with these files. Queries go through `supabase-js`
> (`lib/server/supabaseAdmin.ts`); schema changes go through this runner.

### Gotcha for new migrations
SQL-language function bodies are validated **at creation time**, so a helper
like `is_staff()` must be declared *after* the tables it references.

## Ground rules (rules.md §5)
- Every schema change is a new numbered file in `db/migrations/` — never edit an applied migration, never make undocumented manual edits.
- RLS is enabled on every table; the service-role key (server only) bypasses it.
- Claim keys are stored **hashed only** (`enrollments.claim_key_hash`).
- Certificate files live in the **private** `certificates` storage bucket; students receive short-lived signed URLs from the server.

## Migrations
| File | Purpose |
|---|---|
| `0001_init.sql` | Full Phase-0 schema: profiles (+signup trigger), courses, enrollments, certificates, leads, blog_posts, testimonials, newsletter_subscribers, audit_log, RLS policies, private storage bucket. |
