// Phase 2 acceptance: leads, newsletter, testimonials, metrics.
// Drives the real api/ handlers against the live database.
//   npm run test:phase2
import { createClient } from '@supabase/supabase-js';
import { loadEnvLocal } from '../lib/server/loadEnv';

loadEnvLocal();

const ROOT = new URL('..', import.meta.url);
const load = async (rel: string) => (await import(new URL(rel, ROOT).href)).default;
const leadsApi = await load('api/_handlers/leads.ts');
const newsletterApi = await load('api/_handlers/newsletter.ts');
const publicTestimonials = await load('api/_handlers/content/testimonials.ts');
const adminLeads = await load('api/_handlers/admin/leads.ts');
const adminTestimonials = await load('api/_handlers/admin/testimonials.ts');
const metricsApi = await load('api/_handlers/admin/metrics.ts');

interface Res { code: number; body: any; headers: Record<string, string> }
const call = async (
  handler: (req: any, res: any) => Promise<void> | void,
  opts: { method: string; token?: string; body?: unknown; query?: Record<string, string>; ip?: string },
): Promise<Res> => {
  const out: Res = { code: 200, body: null, headers: {} };
  const req = {
    method: opts.method,
    headers: { authorization: opts.token ? `Bearer ${opts.token}` : undefined, 'x-forwarded-for': opts.ip ?? '10.0.0.1' },
    query: opts.query ?? {}, body: opts.body, cookies: {}, socket: { remoteAddress: opts.ip ?? '10.0.0.1' },
  };
  const res: any = {
    statusCode: 200,
    _h: {} as Record<string,string>,
    setHeader(k: string, v: string) { this._h[k.toLowerCase()] = v; if ((out as any).headers) (out as any).headers[k.toLowerCase()] = v; return this; },
    getHeader(k: string) { return this._h[k.toLowerCase()]; },
    status(c: number) { this.statusCode = c; return this; },
    json(d: unknown) { out.code = this.statusCode; out.body = d; this.writableEnded = true; },
    send(d: unknown) { out.code = this.statusCode; out.body = d; this.writableEnded = true; },
    end(d?: unknown) {
      out.code = this.statusCode;
      if (typeof d === 'string') { try { out.body = JSON.parse(d); } catch { out.body = d; } }
      else if (d !== undefined) out.body = d;
      this.writableEnded = true;
    },
    writableEnded: false,
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
const PASS = 'P2-test-pass-123!';
const cleanup: Array<() => Promise<unknown>> = [];

try {
  // staff user
  const email = `p2-staff-${stamp}@test.4am.local`;
  const { data: u } = await admin.auth.admin.createUser({ email, password: PASS, email_confirm: true });
  cleanup.push(() => admin.auth.admin.deleteUser(u!.user.id));
  await admin.from('profiles').upsert({ id: u!.user.id, role: 'staff', full_name: 'P2 Staff' });
  const { data: sess } = await anon().auth.signInWithPassword({ email, password: PASS });
  const token = sess!.session!.access_token;

  const studentEmail = `p2-lead-${stamp}@test.4am.local`;

  // ── LEADS ──
  const bad = await call(leadsApi, { method: 'POST', body: { name: 'x', email: 'nope', message: 'short' } });
  t('lead: invalid payload rejected with field issues', bad.code === 400 && Array.isArray(bad.body.issues));

  const good = await call(leadsApi, {
    method: 'POST',
    body: { name: 'Phase Two Tester', email: studentEmail, phone: '9876543210', company: 'Acme',
            service: 'web-development', budget: '₹40,000 – ₹1,25,000',
            message: 'This is an automated Phase 2 test enquiry, please ignore.', source: 'e2e' },
  });
  t('lead: valid enquiry stored', good.code === 201 && good.body.ok === true);
  const leadId = good.body?.id;
  cleanup.push(() => admin.from('leads').delete().eq('id', leadId));

  const { data: leadRow } = await admin.from('leads').select('*').eq('id', leadId).single();
  t('lead: persisted with all fields', leadRow?.email === studentEmail && leadRow?.budget?.includes('₹') && leadRow?.status === 'new');
  t('lead: email lowercased', leadRow?.email === studentEmail.toLowerCase());
  t('lead: survives email being unconfigured', good.body.notified === false);

  // rate limit — 5 per 10 min per IP
  const ip = `10.9.9.${stamp % 200}`;
  let limited = false;
  for (let i = 0; i < 7; i++) {
    const r = await call(leadsApi, {
      method: 'POST', ip,
      body: { name: 'Rate Limit', email: `rl-${i}-${stamp}@test.4am.local`, message: 'Rate limit probe message.', source: 'e2e' },
    });
    if (r.code === 429) { limited = true; break; }
  }
  t('lead: rate limited after burst', limited);
  cleanup.push(() => admin.from('leads').delete().like('email', `rl-%-${stamp}@test.4am.local`));

  // ── ADMIN LEADS ──
  t('admin leads: requires auth', (await call(adminLeads, { method: 'GET' })).code === 401);
  const inbox = await call(adminLeads, { method: 'GET', token, query: { status: 'new' } });
  t('admin leads: inbox lists new enquiry', inbox.code === 200 && inbox.body.leads.some((l: any) => l.id === leadId));

  const upd = await call(adminLeads, { method: 'PATCH', token, body: { id: leadId, status: 'contacted' } });
  const { data: afterUpd } = await admin.from('leads').select('status').eq('id', leadId).single();
  t('admin leads: status update works', upd.code === 200 && afterUpd?.status === 'contacted');

  // ── NEWSLETTER ──
  const subEmail = `p2-sub-${stamp}@test.4am.local`;
  const sub = await call(newsletterApi, { method: 'POST', body: { email: subEmail } });
  t('newsletter: subscribe', sub.code === 200 && sub.body.ok);
  cleanup.push(() => admin.from('newsletter_subscribers').delete().eq('email', subEmail));

  const dupe = await call(newsletterApi, { method: 'POST', body: { email: subEmail } });
  t('newsletter: duplicate subscribe is idempotent', dupe.code === 200);

  const unsub = await call(newsletterApi, { method: 'DELETE', body: { email: subEmail } });
  const { data: subRow } = await admin.from('newsletter_subscribers').select('status').eq('email', subEmail).single();
  t('newsletter: unsubscribe', unsub.code === 200 && subRow?.status === 'unsubscribed');
  t('newsletter: rejects bad email', (await call(newsletterApi, { method: 'POST', body: { email: 'not-an-email' } })).code === 400);

  // ── TESTIMONIALS ──
  const before = await call(publicTestimonials, { method: 'GET' });
  const beforeCount = before.body.testimonials.length;
  t('testimonials: public endpoint reachable', before.code === 200 && Array.isArray(before.body.testimonials));

  const created = await call(adminTestimonials, {
    method: 'POST', token,
    body: { client_name: `P2 Client ${stamp}`, company: 'Test Co', quote: 'An automated Phase 2 testimonial for verification purposes.', is_published: false },
  });
  t('testimonials: staff creates draft', created.code === 201 && created.body.testimonial.is_published === false);
  const tId = created.body?.testimonial?.id;
  cleanup.push(() => admin.from('testimonials').delete().eq('id', tId));

  const stillHidden = await call(publicTestimonials, { method: 'GET' });
  t('testimonials: draft NOT public', stillHidden.body.testimonials.length === beforeCount);

  await call(adminTestimonials, { method: 'PATCH', token, body: { id: tId, is_published: true } });
  const afterPublish = await call(publicTestimonials, { method: 'GET' });
  t('testimonials: published appears publicly',
    afterPublish.body.testimonials.length === beforeCount + 1 &&
    afterPublish.body.testimonials.some((x: any) => x.id === tId));
  t('testimonials: public payload has no private columns',
    !Object.keys(afterPublish.body.testimonials[0] ?? {}).some((k) => ['is_published', 'sort_order'].includes(k)));

  const del = await call(adminTestimonials, { method: 'DELETE', token, body: { id: tId } });
  const afterDelete = await call(publicTestimonials, { method: 'GET' });
  t('testimonials: delete removes it publicly', del.code === 200 && afterDelete.body.testimonials.length === beforeCount);

  // anon must not write testimonials directly
  const { error: anonWrite } = await anon().from('testimonials').insert({ client_name: 'hacker', quote: 'should not work' });
  t('testimonials: anon cannot insert (RLS)', !!anonWrite);

  // ── METRICS ──
  t('metrics: requires staff', (await call(metricsApi, { method: 'GET' })).code === 401);
  const m = await call(metricsApi, { method: 'GET', token });
  t('metrics: returns all counters',
    m.code === 200 && ['courses', 'students', 'issued', 'claimed', 'leadsNew', 'subscribers']
      .every((k) => typeof m.body.metrics[k] === 'number'));
  t('metrics: lead count reflects reality', m.body.metrics.leadsTotal >= 1, `leadsTotal=${m.body.metrics.leadsTotal}`);

  // ── AUDIT ──
  const { data: audits } = await admin.from('audit_log').select('action')
    .in('action', ['lead.status', 'testimonial.create', 'testimonial.update', 'testimonial.delete'])
    .gte('created_at', new Date(stamp - 1000).toISOString());
  t('audit: phase 2 actions logged', new Set((audits ?? []).map((a) => a.action)).size >= 4);
} finally {
  for (const fn of cleanup.reverse()) { try { await fn(); } catch { /* best effort */ } }
  console.log('\ncleanup: test leads, subscriber, testimonial, user removed');
}

console.log(failures === 0 ? '\nALL PHASE 2 CHECKS PASSED' : `\n${failures} PHASE 2 FAILURES`);
process.exit(failures === 0 ? 0 : 1);
