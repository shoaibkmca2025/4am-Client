// Careers module acceptance: openings CRUD, public SSR page, application
// intake (incl. résumé upload), admin pipeline, notifications degrade.
//   npm run test:careers
import { createClient } from '@supabase/supabase-js';
import { loadEnvLocal } from '../lib/server/loadEnv';

loadEnvLocal();

const ROOT = new URL('..', import.meta.url);
const load = async (rel: string) => (await import(new URL(rel, ROOT).href)).default;
const openingsApi = await load('api/admin/openings.ts');
const applicationsApi = await load('api/admin/applications.ts');
const applyApi = await load('api/careers/apply.ts');
const careersPage = await load('api/careers-page.ts');

interface Res { code: number; body: any }
const call = async (
  handler: (req: any, res: any) => Promise<void> | void,
  opts: { method: string; token?: string; body?: unknown; query?: Record<string, string>; ip?: string },
): Promise<Res> => {
  const out: Res = { code: 200, body: null };
  const req = {
    method: opts.method,
    headers: { authorization: opts.token ? `Bearer ${opts.token}` : undefined, 'x-forwarded-for': opts.ip ?? '10.4.4.4' },
    query: opts.query ?? {}, body: opts.body, cookies: {}, socket: { remoteAddress: opts.ip ?? '10.4.4.4' },
  };
  const res = {
    statusCode: 200,
    setHeader: () => res,
    status: (c: number) => { out.code = c; return res; },
    json: (d: unknown) => { out.body = d; },
    send: (d: unknown) => { out.body = d; },
    end: (d: unknown) => { out.body = d; out.code = out.code === 200 ? res.statusCode : out.code; },
  };
  await handler(req, res);
  return out;
};

let failures = 0;
const t = (name: string, ok: boolean, detail = '') => {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};

const admin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const anon = () => createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, { auth: { persistSession: false } });

const stamp = Date.now();
const PASS = 'Careers-test-123!';
const cleanup: Array<() => Promise<unknown>> = [];

try {
  const email = `careers-admin-${stamp}@test.4am.local`;
  const { data: u } = await admin.auth.admin.createUser({ email, password: PASS, email_confirm: true });
  cleanup.push(() => admin.auth.admin.deleteUser(u!.user.id));
  await admin.from('profiles').upsert({ id: u!.user.id, role: 'staff', full_name: 'Careers Staff' });
  const { data: sess } = await anon().auth.signInWithPassword({ email, password: PASS });
  const token = sess!.session!.access_token;

  // ── openings CRUD ──
  t('openings: requires staff', (await call(openingsApi, { method: 'GET' })).code === 401);

  const slug = `test-frontend-engineer-${stamp}`;
  const created = await call(openingsApi, {
    method: 'POST', token,
    body: {
      title: 'Frontend Engineer (Test)', slug, department: 'Engineering', location: 'Remote — India',
      employment_type: 'full-time',
      description: '## About the role\n\nBuild **fast** marketing sites and dashboards.',
      requirements: ['3+ years React', 'GSAP or motion experience'],
      status: 'draft',
    },
  });
  t('openings: staff creates draft', created.code === 201);
  const openingId = created.body?.opening?.id;
  cleanup.push(() => admin.from('job_openings').delete().eq('id', openingId));

  // draft not public
  const draftPage = await call(careersPage, { method: 'GET', query: { slug } });
  t('careers SSR: draft role 404s', draftPage.code === 404);

  const draftApply = await call(applyApi, {
    method: 'POST',
    body: { opening_id: openingId, name: 'Early Bird', email: `early-${stamp}@test.4am.local` },
  });
  t('apply: draft role rejects applications', draftApply.code === 400);

  // publish
  await call(openingsApi, { method: 'PATCH', token, body: { id: openingId, status: 'open' } });
  const livePage = await call(careersPage, { method: 'GET', query: { slug } });
  const liveHtml = String(livePage.body);
  t('careers SSR: open role renders', livePage.code === 200 && liveHtml.includes('Frontend Engineer (Test)'));
  t('careers SSR: JobPosting structured data', liveHtml.includes('"@type":"JobPosting"'));
  t('careers SSR: apply form present', liveHtml.includes('apply-form') && liveHtml.includes(openingId));
  t('careers SSR: markdown description rendered', liveHtml.includes('<strong>fast</strong>'));

  const index = await call(careersPage, { method: 'GET', query: {} });
  t('careers SSR: index lists open role', String(index.body).includes(`/careers/${slug}`));

  // ── application intake ──
  t('apply: validation rejects bad payload',
    (await call(applyApi, { method: 'POST', body: { name: 'x', email: 'nope' } })).code === 400);

  const resumePdf = Buffer.from(`%PDF-1.4\n% careers test resume ${stamp}\n%%EOF`);
  const applied = await call(applyApi, {
    method: 'POST',
    body: {
      opening_id: openingId,
      name: 'Test Candidate',
      email: `candidate-${stamp}@test.4am.local`,
      phone: '9876501234',
      portfolio_url: 'https://example.com/portfolio',
      cover_note: 'Automated careers test application.',
      resume: { filename: 'resume.pdf', contentType: 'application/pdf', data: resumePdf.toString('base64') },
    },
  });
  t('apply: valid application accepted', applied.code === 201 && applied.body.ok === true);

  const { data: appRow } = await admin
    .from('job_applications').select('*').eq('email', `candidate-${stamp}@test.4am.local`).single();
  t('apply: stored with resume path', !!appRow?.resume_path);
  if (appRow) cleanup.push(() => admin.from('job_applications').delete().eq('id', appRow.id));
  if (appRow?.resume_path) cleanup.push(() => admin.storage.from('resumes').remove([appRow.resume_path]));

  const { data: resumeFile } = await admin.storage.from('resumes').download(appRow.resume_path);
  t('apply: résumé really in private bucket',
    !!resumeFile && (await resumeFile.text()).includes(`careers test resume ${stamp}`));

  t('apply: rejects wrong file type',
    (await call(applyApi, {
      method: 'POST',
      body: { name: 'Bad File', email: `badfile-${stamp}@test.4am.local`,
        resume: { filename: 'x.exe', contentType: 'application/x-msdownload', data: 'aGVsbG8=' } },
    })).code === 400);

  // anon cannot read applications directly (RLS)
  const { data: anonRead, error: anonErr } = await anon().from('job_applications').select('id').limit(1);
  t('RLS: anon cannot read applications', !!anonErr || (anonRead ?? []).length === 0);

  // ── admin pipeline ──
  const list = await call(applicationsApi, { method: 'GET', token, query: { opening_id: openingId } });
  t('admin: lists application with signed résumé URL',
    list.code === 200 && list.body.applications.length === 1 && !!list.body.applications[0].resume_url);

  const moved = await call(applicationsApi, {
    method: 'PATCH', token, body: { id: appRow.id, status: 'shortlisted' },
  });
  const { data: afterMove } = await admin.from('job_applications').select('status').eq('id', appRow.id).single();
  t('admin: pipeline stage updates', moved.code === 200 && afterMove?.status === 'shortlisted');

  // ── close → hidden again ──
  await call(openingsApi, { method: 'PATCH', token, body: { id: openingId, status: 'closed' } });
  t('careers SSR: closed role 404s', (await call(careersPage, { method: 'GET', query: { slug } })).code === 404);

  // ── audit ──
  const { data: audits } = await admin.from('audit_log').select('action')
    .in('action', ['opening.create', 'opening.update', 'application.status'])
    .gte('created_at', new Date(stamp - 1000).toISOString());
  t('audit: careers actions logged', new Set((audits ?? []).map((a) => a.action)).size >= 3);
} finally {
  for (const fn of cleanup.reverse()) { try { await fn(); } catch { /* best effort */ } }
  console.log('\ncleanup: test opening, application, résumé, user removed');
}

console.log(failures === 0 ? '\nALL CAREERS CHECKS PASSED' : `\n${failures} CAREERS FAILURES`);
process.exit(failures === 0 ? 0 : 1);
