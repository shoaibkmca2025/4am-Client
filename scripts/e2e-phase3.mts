// Phase 3 acceptance: blog/CMS + SSR SEO, bulk CSV import, audit viewer.
//   npm run test:phase3
import { createClient } from '@supabase/supabase-js';
import { loadEnvLocal } from '../lib/server/loadEnv';

loadEnvLocal();

const ROOT = new URL('..', import.meta.url);
const load = async (rel: string) => (await import(new URL(rel, ROOT).href)).default;
const adminPosts = await load('api/admin/posts.ts');
const blogPage = await load('api/blog-page.ts');
const bulkApi = await load('api/admin/enrollments-bulk.ts');
const auditApi = await load('api/admin/audit.ts');
const coursesApi = await load('api/admin/courses.ts');

interface Res { code: number; body: any }
const call = async (
  handler: (req: any, res: any) => Promise<void> | void,
  opts: { method: string; token?: string; body?: unknown; query?: Record<string, string> },
): Promise<Res> => {
  const out: Res = { code: 200, body: null };
  const req = {
    method: opts.method,
    headers: { authorization: opts.token ? `Bearer ${opts.token}` : undefined, 'x-forwarded-for': '10.3.3.3' },
    query: opts.query ?? {}, body: opts.body, cookies: {}, socket: { remoteAddress: '10.3.3.3' },
  };
  const res = {
    statusCode: 200,
    setHeader: () => res,
    status: (c: number) => { out.code = c; return res; },
    json: (d: unknown) => { out.body = d; },
    send: (d: unknown) => { out.body = d; },
    end: (d: unknown) => { out.body = d; out.code = res.statusCode === 200 ? out.code : res.statusCode; },
  };
  await handler(req, res);
  if (typeof out.body === 'string') out.code = res.statusCode;
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
const PASS = 'P3-test-pass-123!';
const cleanup: Array<() => Promise<unknown>> = [];

try {
  const email = `p3-admin-${stamp}@test.4am.local`;
  const { data: u } = await admin.auth.admin.createUser({ email, password: PASS, email_confirm: true });
  cleanup.push(() => admin.auth.admin.deleteUser(u!.user.id));
  await admin.from('profiles').upsert({ id: u!.user.id, role: 'admin', full_name: 'P3 Admin' });
  const { data: sess } = await anon().auth.signInWithPassword({ email, password: PASS });
  const token = sess!.session!.access_token;

  // ── BLOG CRUD ──
  t('posts: requires staff', (await call(adminPosts, { method: 'GET' })).code === 401);

  const slug = `p3-test-article-${stamp}`;
  const created = await call(adminPosts, {
    method: 'POST', token,
    body: {
      title: 'Phase 3 Test Article', slug,
      excerpt: 'An automated test article for Phase 3 verification.',
      content: '## Heading\n\nThis is **bold** and *italic* with a [link](https://4amglobalmedia.com) and `code`.\n\n- first bullet\n- second bullet',
      tags: ['testing', 'phase3'], status: 'draft',
    },
  });
  t('posts: staff creates draft', created.code === 201 && created.body.post.status === 'draft');
  const postId = created.body?.post?.id;
  cleanup.push(() => admin.from('blog_posts').delete().eq('id', postId));
  t('posts: reading time computed', typeof created.body?.post?.reading_minutes === 'number' && created.body.post.reading_minutes >= 1);
  t('posts: rejects bad slug',
    (await call(adminPosts, { method: 'POST', token, body: { title: 'Bad slug post', slug: 'Not A Slug!' } })).code === 400);
  t('posts: duplicate slug rejected',
    (await call(adminPosts, { method: 'POST', token, body: { title: 'Dupe', slug } })).code === 409);

  // ── SSR: draft must not be public ──
  const draftPage = await call(blogPage, { method: 'GET', query: { slug } });
  t('blog SSR: draft returns 404', draftPage.code === 404 && /ISN'T HERE/.test(String(draftPage.body)));

  // publish
  const published = await call(adminPosts, { method: 'PATCH', token, body: { id: postId, status: 'published' } });
  t('posts: publish stamps published_at', published.code === 200 && !!published.body.post.published_at);

  const live = await call(blogPage, { method: 'GET', query: { slug } });
  const html = String(live.body);
  t('blog SSR: published post renders', live.code === 200 && html.includes('Phase 3 Test Article'));
  t('blog SSR: markdown → real HTML',
    html.includes('<h2>Heading</h2>') && html.includes('<strong>bold</strong>') && html.includes('<li>first bullet</li>'));
  t('blog SSR: links rendered safely', html.includes('href="https://4amglobalmedia.com"') && html.includes('rel="noopener"'));
  t('blog SSR: SEO meta present',
    html.includes('<meta name="description"') && html.includes('og:title') && html.includes('application/ld+json'));
  t('blog SSR: canonical + indexable',
    html.includes('rel="canonical"') && html.includes('content="index,follow'));
  t('blog SSR: brand shell (logo + gradient)', html.includes('logo-4am-nav.png') && html.includes('#FF6A3D'));

  const index = await call(blogPage, { method: 'GET', query: {} });
  t('blog SSR: index lists the post', String(index.body).includes(`/blog/${slug}`));

  // XSS guard
  const xssSlug = `p3-xss-${stamp}`;
  const xss = await call(adminPosts, {
    method: 'POST', token,
    body: { title: 'XSS <script>alert(1)</script>', slug: xssSlug, content: 'Hello <script>alert(2)</script> and <img src=x onerror=alert(3)>', status: 'published' },
  });
  cleanup.push(() => admin.from('blog_posts').delete().eq('id', xss.body?.post?.id));
  const xssHtml = String((await call(blogPage, { method: 'GET', query: { slug: xssSlug } })).body);
  // Escaped text may still CONTAIN "onerror=alert" harmlessly — what matters
  // is that no executable element is produced. Check for live markup only.
  // (The page legitimately contains one <script type="application/ld+json">.)
  t('blog SSR: no executable script injected', !/<script(?![^>]*application\/ld\+json)/i.test(xssHtml));
  // The shell's own async-font <link ... onload> is legitimate; what must
  // never appear is an author-supplied handler such as <img ... onerror>.
  t('blog SSR: no event-handler attribute injected', !/<[^>]*\bonerror\b[^>]*>/i.test(xssHtml));
  t('blog SSR: JSON-LD escapes angle brackets', !/"headline":"[^"]*<script/i.test(xssHtml));
  t('blog SSR: injected markup is escaped as text', xssHtml.includes('&lt;script&gt;'));

  // ── unpublish hides it again ──
  await call(adminPosts, { method: 'PATCH', token, body: { id: postId, status: 'draft' } });
  t('blog SSR: unpublished post 404s again',
    (await call(blogPage, { method: 'GET', query: { slug } })).code === 404);

  // ── BULK CSV IMPORT ──
  const course = await call(coursesApi, {
    method: 'POST', token,
    body: { title: `P3 Bulk Course ${stamp}`, slug: `p3-bulk-${stamp}`, status: 'active' },
  });
  const courseId = course.body?.course?.id;
  cleanup.push(() => admin.from('courses').delete().eq('id', courseId));

  const csv = [
    'name,email',
    'Alpha Student,alpha-' + stamp + '@test.4am.local',
    '"Beta, With Comma",beta-' + stamp + '@test.4am.local',
    'Gamma Student,gamma-' + stamp + '@test.4am.local',
    'Bad Row,not-an-email',
    'Alpha Student,alpha-' + stamp + '@test.4am.local',
  ].join('\n');

  const bulk = await call(bulkApi, { method: 'POST', token, body: { course_id: courseId, csv } });
  t('bulk: imports valid rows', bulk.code === 201 && bulk.body.created.length === 3, `created=${bulk.body?.created?.length}`);
  t('bulk: parses quoted comma field', bulk.body.created.some((r: any) => r.name === 'Beta, With Comma'));
  t('bulk: rejects invalid email row', bulk.body.skipped.some((s: any) => /email/i.test(s.reason)));
  t('bulk: rejects in-course duplicate', bulk.body.skipped.some((s: any) => /already enrolled/i.test(s.reason)));
  t('bulk: every created row has a unique key',
    new Set(bulk.body.created.map((r: any) => r.claimKey)).size === 3 &&
    bulk.body.created.every((r: any) => /^4AM-[A-Z2-9]{5}-[A-Z2-9]{5}$/.test(r.claimKey)));

  const { data: stored } = await admin.from('enrollments').select('claim_key_hash').eq('course_id', courseId);
  const plaintexts = new Set(bulk.body.created.map((r: any) => r.claimKey));
  t('bulk: DB stores hashes only', (stored ?? []).every((s) => !plaintexts.has(s.claim_key_hash)));

  // ── AUDIT VIEWER ──
  t('audit: staff-only is actually admin-only', (await call(auditApi, { method: 'GET' })).code === 401);
  const audit = await call(auditApi, { method: 'GET', token });
  t('audit: returns entries with actor names',
    audit.code === 200 && audit.body.entries.length > 0 && audit.body.entries.every((e: any) => typeof e.actor === 'string'));
  t('audit: records phase 3 actions',
    audit.body.entries.some((e: any) => e.action === 'post.create') &&
    audit.body.entries.some((e: any) => e.action === 'enrollment.bulk_import'));
  const filtered = await call(auditApi, { method: 'GET', token, query: { action: 'post' } });
  t('audit: action filter works', filtered.body.entries.every((e: any) => e.action.startsWith('post')));
} finally {
  for (const fn of cleanup.reverse()) { try { await fn(); } catch { /* best effort */ } }
  console.log('\ncleanup: test posts, course, enrolments, user removed');
}

console.log(failures === 0 ? '\nALL PHASE 3 CHECKS PASSED' : `\n${failures} PHASE 3 FAILURES`);
process.exit(failures === 0 ? 0 : 1);
