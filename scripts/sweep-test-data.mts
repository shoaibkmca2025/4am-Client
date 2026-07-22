// Removes anything left behind by the automated test suites
// (users @test.4am.local, their courses, and orphaned storage files).
//   npm run test:sweep
import { createClient } from '@supabase/supabase-js';
import { loadEnvLocal } from '../lib/server/loadEnv';

loadEnvLocal();
const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

const { data: users } = await db.auth.admin.listUsers({ perPage: 200 });
const stale = (users?.users ?? []).filter((u) => u.email?.endsWith('@test.4am.local'));
for (const u of stale) await db.auth.admin.deleteUser(u.id);

const { data: courses } = await db.from('courses').select('id, title');
const testCourses = (courses ?? []).filter(
  (c) => /^(UI Workshop|E2E )/.test(c.title) || /^e2e-/.test((c as { slug?: string }).slug ?? ''),
);
for (const c of testCourses) await db.from('courses').delete().eq('id', c.id);

// Phase 2 artefacts
await db.from('leads').delete().like('email', '%@test.4am.local');
await db.from('newsletter_subscribers').delete().like('email', '%@test.4am.local');

// Careers artefacts
await db.from('job_applications').delete().like('email', '%@test.4am.local');
const { data: staleOpenings } = await db.from('job_openings').select('id, slug');
for (const o of (staleOpenings ?? []).filter((x) => /^(test-|demo-)/.test(x.slug))) {
  await db.from('job_openings').delete().eq('id', o.id);
}
const { data: resumeFiles } = await db.storage.from('resumes').list('applications');
const stalePaths = (resumeFiles ?? []).map((f) => `applications/${f.name}`);
if (stalePaths.length) await db.storage.from('resumes').remove(stalePaths);
const { data: allTestimonials } = await db.from('testimonials').select('id, client_name');
const testTestimonials = (allTestimonials ?? []).filter((t) => /(Phase2|P2) Client /.test(t.client_name));
for (const t of testTestimonials) await db.from('testimonials').delete().eq('id', t.id);

const { data: certs } = await db.storage.from('certificates').list('certs');
const { data: qrs } = await db.storage.from('certificates').list('qr');
const paths = [
  ...(certs ?? []).map((f) => `certs/${f.name}`),
  ...(qrs ?? []).map((f) => `qr/${f.name}`),
];
if (paths.length) await db.storage.from('certificates').remove(paths);

const count = async (t: string) =>
  (await db.from(t).select('*', { count: 'exact', head: true })).count;

console.log(`removed ${stale.length} test users, ${testCourses.length} courses, ${testTestimonials.length} testimonials, ${paths.length} files`);
console.log(
  `remaining → ${await count('courses')} courses, ${await count('enrollments')} enrollments, ` +
  `${await count('certificates')} certificates, ${await count('leads')} leads, ` +
  `${await count('testimonials')} testimonials, ${await count('newsletter_subscribers')} subscribers`,
);
