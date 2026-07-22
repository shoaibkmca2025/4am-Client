// End-to-end acceptance test for the Phase 1 certificate system.
// Drives the REAL api/ handlers (mocked req/res, real Supabase auth
// tokens, real database, real storage) through every prd.md §5 flow:
//   admin issue → student claim → public verify → revoke → reissue
// Creates its own throwaway users/course and cleans up after itself.
//
//   npm run test:cert
import { createClient } from '@supabase/supabase-js';
import { loadEnvLocal } from '../lib/server/loadEnv';

loadEnvLocal();

// Import handlers via file URLs (paths contain [id], safe in URLs)
const ROOT = new URL('..', import.meta.url);
const load = async (rel: string) => (await import(new URL(rel, ROOT).href)).default;
const coursesApi = await load('api/admin/courses.ts');
const enrollApi = await load('api/admin/enrollments.ts');
const certApi = await load('api/admin/certificates.ts');
const claimApi = await load('api/portal/claim.ts');
const listApi = await load('api/portal/certificates/index.ts');
const downloadApi = await load('api/portal/certificates/[id]/download.ts');
const verifyApi = await load('api/verify.ts');

// ── mock req/res ────────────────────────────────────────────────
interface Res { code: number; body: any }
const call = async (
  handler: (req: any, res: any) => Promise<void> | void,
  opts: { method: string; token?: string; body?: unknown; query?: Record<string, string> },
): Promise<Res> => {
  const out: Res = { code: 0, body: null };
  const req = {
    method: opts.method,
    headers: {
      authorization: opts.token ? `Bearer ${opts.token}` : undefined,
      'x-forwarded-for': '127.0.0.1',
    },
    query: opts.query ?? {},
    body: opts.body,
    cookies: {},
    socket: { remoteAddress: '127.0.0.1' },
  };
  const res = {
    setHeader: () => res,
    status: (c: number) => { out.code = c; return res; },
    json: (d: unknown) => { out.body = d; },
    send: (d: unknown) => { out.body = d; },
  };
  await handler(req, res);
  return out;
};

let failures = 0;
const t = (name: string, ok: boolean, detail = '') => {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};

// ── setup: real users with real sessions ───────────────────────
const admin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const anon = () => createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, { auth: { persistSession: false } });

const stamp = Date.now();
const adminEmail = `e2e-admin-${stamp}@test.4am.local`;
const studentEmail = `e2e-student-${stamp}@test.4am.local`;
const PASS = 'E2e-test-pass-123!';
const cleanup: Array<() => Promise<unknown>> = [];

const makeUser = async (email: string, role: string) => {
  const { data, error } = await admin.auth.admin.createUser({ email, password: PASS, email_confirm: true });
  if (error) throw new Error(`createUser ${email}: ${error.message}`);
  const id = data.user.id;
  cleanup.push(() => admin.auth.admin.deleteUser(id));
  await admin.from('profiles').upsert({ id, role, full_name: `E2E ${role}` });
  const { data: session, error: sErr } = await anon().auth.signInWithPassword({ email, password: PASS });
  if (sErr) throw new Error(`signIn ${email}: ${sErr.message}`);
  return { id, token: session.session!.access_token };
};

try {
  const adm = await makeUser(adminEmail, 'admin');
  const stu = await makeUser(studentEmail, 'student');
  console.log('setup: admin + student users created, signed in\n');

  // ── RBAC gates ──
  t('unauthenticated blocked from admin API',
    (await call(coursesApi, { method: 'GET' })).code === 401);
  t('student blocked from admin API',
    (await call(coursesApi, { method: 'GET', token: stu.token })).code === 403);

  // ── course ──
  const courseRes = await call(coursesApi, {
    method: 'POST', token: adm.token,
    body: { title: 'E2E Vibe Coding Workshop', slug: `e2e-vibe-${stamp}`, status: 'active', venue: 'Test Hall', college: 'Test College' },
  });
  t('admin creates course', courseRes.code === 201, `code=${courseRes.code}`);
  const courseId = courseRes.body?.course?.id;
  cleanup.push(() => admin.from('courses').delete().eq('id', courseId));

  t('course validation rejects bad slug',
    (await call(coursesApi, { method: 'POST', token: adm.token, body: { title: 'x y', slug: 'BAD SLUG!!' } })).code === 400);

  // ── enrollment + claim key ──
  const enrollRes = await call(enrollApi, {
    method: 'POST', token: adm.token,
    body: { course_id: courseId, student_name: 'Test Student', student_email: studentEmail },
  });
  t('admin adds student, gets one-time claim key', enrollRes.code === 201 && !!enrollRes.body?.claimKey);
  const claimKey: string = enrollRes.body.claimKey;
  const enrollmentId: string = enrollRes.body.enrollment.id;
  t('claim key format', /^4AM-[A-Z2-9]{5}-[A-Z2-9]{5}$/.test(claimKey), claimKey);

  const { data: enrRow } = await admin.from('enrollments').select('claim_key_hash').eq('id', enrollmentId).single();
  t('DB stores only the hash (plaintext absent)',
    !!enrRow && enrRow.claim_key_hash !== claimKey && /^[a-f0-9]{64}$/.test(enrRow.claim_key_hash));

  // ── issue: upload file first, then certificate ──
  const pdfBytes = Buffer.from(`%PDF-1.4\n% e2e test certificate ${stamp}\n%%EOF`);
  const filePath = `certs/e2e-${stamp}.pdf`;
  const { error: upErr } = await admin.storage.from('certificates').upload(filePath, pdfBytes, { contentType: 'application/pdf' });
  t('certificate file uploaded to private bucket', !upErr, upErr?.message);
  cleanup.push(() => admin.storage.from('certificates').remove([filePath]));

  t('issue refuses a missing file',
    (await call(certApi, { method: 'POST', token: adm.token, body: { enrollment_id: enrollmentId, file_path: 'certs/nope.pdf', show_file_publicly: false } })).code === 400);

  const issueRes = await call(certApi, {
    method: 'POST', token: adm.token,
    body: { enrollment_id: enrollmentId, file_path: filePath, show_file_publicly: false },
  });
  t('admin issues certificate', issueRes.code === 201, `code=${issueRes.code} ${issueRes.body?.error ?? ''}`);
  const serial: string = issueRes.body?.certificate?.certificate_serial;
  const certId: string = issueRes.body?.certificate?.id;
  t('serial format', /^4AM-\d{4}-[A-Z2-9]{6}$/.test(serial ?? ''), serial);
  t('verify URL returned', issueRes.body?.verifyUrl?.includes(`/verify/${serial}`));
  if (issueRes.body?.certificate?.qr_path) {
    const { data: qr } = await admin.storage.from('certificates').download(issueRes.body.certificate.qr_path);
    t('QR code generated in storage', !!qr && (await qr.arrayBuffer()).byteLength > 500);
    cleanup.push(() => admin.storage.from('certificates').remove([issueRes.body.certificate.qr_path]));
  } else t('QR code generated in storage', false, 'qr_path missing');

  t('double-issue blocked (409)',
    (await call(certApi, { method: 'POST', token: adm.token, body: { enrollment_id: enrollmentId, file_path: filePath, show_file_publicly: false } })).code === 409);

  // ── public verify ──
  const v1 = await call(verifyApi, { method: 'GET', query: { serial } });
  t('public verify: valid + correct data',
    v1.body?.valid === true && v1.body.holder === 'Test Student' && v1.body.course === 'E2E Vibe Coding Workshop' && v1.body.status === 'active');
  t('public verify: fabricated serial rejected',
    (await call(verifyApi, { method: 'GET', query: { serial: '4AM-2026-ZZZZZ9' } })).body?.valid === false);
  t('public verify: malformed serial rejected',
    (await call(verifyApi, { method: 'GET', query: { serial: 'DROP TABLE;' } })).body?.valid === false);

  // ── student claim ──
  t('claim with wrong key → clear invalid message',
    (await call(claimApi, { method: 'POST', token: stu.token, body: { claimKey: '4AM-22222-33333' } })).body?.error?.includes('Invalid key'));

  const claimRes = await call(claimApi, { method: 'POST', token: stu.token, body: { claimKey } });
  t('student claims with real key', claimRes.code === 200 && claimRes.body?.ok === true);

  const reclaim = await call(claimApi, { method: 'POST', token: stu.token, body: { claimKey } });
  t('key is single-use (second claim rejected)',
    reclaim.code === 404 && reclaim.body?.error?.includes('already been used'));

  // ── student portal list + download ──
  const list = await call(listApi, { method: 'GET', token: stu.token });
  // one-to-one embed: PostgREST returns an object (guard array shape too)
  const embedded = list.body?.enrollments?.[0]?.certificates;
  const listedSerial = Array.isArray(embedded) ? embedded[0]?.certificate_serial : embedded?.certificate_serial;
  t('student sees their certificate', list.code === 200 && listedSerial === serial);

  const dl = await call(downloadApi, { method: 'GET', token: stu.token, query: { id: certId } });
  t('student gets short-lived signed URL', dl.code === 200 && !!dl.body?.url && dl.body.expiresInSec === 300);
  if (dl.body?.url) {
    const fetched = await fetch(dl.body.url);
    const text = await fetched.text();
    t('signed URL actually serves the file', fetched.ok && text.includes(`e2e test certificate ${stamp}`));
  }
  t('non-owner cannot download (404, no oracle)',
    (await call(downloadApi, { method: 'GET', token: adm.token, query: { id: certId } })).code === 404);

  // ── revoke ──
  const rev = await call(certApi, { method: 'PATCH', token: adm.token, body: { action: 'revoke', certificate_id: certId, reason: 'E2E revocation test' } });
  t('admin revokes', rev.code === 200);
  const v2 = await call(verifyApi, { method: 'GET', query: { serial } });
  t('verify shows revoked + reason', v2.body?.valid === true && v2.body.status === 'revoked' && v2.body.revokedReason === 'E2E revocation test');
  t('revoked cert not downloadable (410)',
    (await call(downloadApi, { method: 'GET', token: stu.token, query: { id: certId } })).code === 410);

  // ── reissue ──
  const re = await call(certApi, { method: 'PATCH', token: adm.token, body: { action: 'reissue', certificate_id: certId } });
  t('admin reissues (new serial, active)', re.code === 200 && re.body?.certificate?.status === 'active');
  const newSerial = re.body?.certificate?.certificate_serial;
  t('old serial no longer verifies',
    (await call(verifyApi, { method: 'GET', query: { serial } })).body?.valid === false);
  t('new serial verifies as active',
    (await call(verifyApi, { method: 'GET', query: { serial: newSerial } })).body?.valid === true);
  if (re.body?.certificate?.qr_path) cleanup.push(() => admin.storage.from('certificates').remove([re.body.certificate.qr_path]));

  // ── audit trail ──
  const { data: audits } = await admin
    .from('audit_log').select('action').in('action',
      ['course.create', 'enrollment.create', 'certificate.issue', 'enrollment.claim', 'certificate.download', 'certificate.revoke', 'certificate.reissue'])
    .gte('created_at', new Date(stamp - 1000).toISOString());
  const actions = new Set((audits ?? []).map((a) => a.action));
  t('audit log captured all sensitive actions', actions.size >= 7, [...actions].join(', '));
} finally {
  // Supabase builders are thenables without .catch — wrap in try/await.
  for (const fn of cleanup.reverse()) {
    try { await fn(); } catch { /* best-effort cleanup */ }
  }
  console.log('\ncleanup: test users, course, files removed');
}

console.log(failures === 0 ? '\nALL E2E CHECKS PASSED' : `\n${failures} E2E FAILURES`);
process.exit(failures === 0 ? 0 : 1);
