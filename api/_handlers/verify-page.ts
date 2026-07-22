import type { ApiRequest, ApiResponse } from '../../lib/server/http';
import { allowMethods, clientIp } from '../../lib/server/http';
import { supabaseAdmin } from '../../lib/server/supabaseAdmin';
import { serialSchema } from '../../lib/server/validation';
import { verifyHash } from '../../lib/server/crypto';
import { rateLimit } from '../../lib/server/ratelimit';
import { brandPage, esc } from '../../lib/server/brandPage';

// GET /verify/:serial (rewritten here by vercel.json)
//
// Server-rendered so a QR scan on a phone paints a complete, styled page in
// ONE request — no SPA bundle, no client fetch waterfall (prd.md §8: verify
// loads in under 1s). Shell + brand tokens come from lib/server/brandPage.

const fmtDate = (d: string | null): string =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

const page = (bodyInner: string, title: string): string =>
  brandPage({ title, bodyInner, eyebrow: 'Certificate Verification', noindex: true });


const notFound = (serial: string): string =>
  page(
    `<div class="card">
      <span class="badge unknown"><span class="dot"></span>Not verified</span>
      <h1>NO MATCHING<br><span class="grad">CERTIFICATE</span></h1>
      <p class="sub">We could not verify a certificate with this reference. Check the serial for typos, or rescan the QR code on the certificate.</p>
      ${serial ? `<dl><div><dt>Reference checked</dt><dd class="mono">${esc(serial)}</dd></div></dl>` : ''}
      <p class="note">If you believe this certificate is genuine, contact <a href="mailto:Info@4amglobalmedia.com">Info@4amglobalmedia.com</a>.</p>
      <a class="cta" href="/">Visit 4AM Global Media</a>
    </div>`,
    'Certificate not verified',
  );

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET'])) return;

  const html = (code: number, body: string) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Fresh enough that a revocation shows up quickly, cached enough to be instant.
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
    res.end(body);
  };

  const rl = rateLimit('verify-page', clientIp(req), 60, 60 * 1000);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    return html(429, page('<div class="card"><h1>TOO MANY<br><span class="grad">REQUESTS</span></h1><p class="sub">Please wait a moment and try again.</p></div>', 'Slow down'));
  }

  const raw = typeof req.query.serial === 'string' ? req.query.serial.toUpperCase() : '';
  const parsed = serialSchema.safeParse(raw);
  if (!parsed.success) return html(404, notFound(raw));

  const { data: cert } = await supabaseAdmin()
    .from('certificates')
    .select(`
      certificate_serial, issue_date, status, revoked_reason, verification_hash, enrollment_id,
      enrollments!inner ( student_name, courses!inner ( title, start_date, end_date, venue, college ) )
    `)
    .eq('certificate_serial', parsed.data)
    .maybeSingle();

  // Unknown serial and tampered hash are indistinguishable to the caller.
  if (!cert || !verifyHash(cert.certificate_serial, cert.enrollment_id, cert.verification_hash)) {
    return html(404, notFound(parsed.data));
  }

  const e = cert.enrollments as unknown as {
    student_name: string;
    courses: { title: string; start_date: string | null; end_date: string | null; venue: string | null; college: string | null };
  };
  const revoked = cert.status === 'revoked';

  const body = `<div class="card">
    <span class="badge ${revoked ? 'bad' : 'ok'}"><span class="dot"></span>${revoked ? 'Revoked' : 'Verified — Genuine'}</span>
    <h1>${esc(e.student_name)}</h1>
    <p class="sub">${revoked
      ? 'This certificate was issued by 4AM Global Media but has since been revoked.'
      : 'This certificate was issued by 4AM Global Media and is valid.'}</p>
    <dl>
      <div><dt>Course</dt><dd>${esc(e.courses.title)}</dd></div>
      <div><dt>Issued on</dt><dd>${esc(fmtDate(cert.issue_date))}</dd></div>
      ${e.courses.college ? `<div><dt>Institution</dt><dd>${esc(e.courses.college)}</dd></div>` : ''}
      ${e.courses.venue ? `<div><dt>Venue</dt><dd>${esc(e.courses.venue)}</dd></div>` : ''}
      ${e.courses.start_date || e.courses.end_date
        ? `<div><dt>Course dates</dt><dd>${esc(fmtDate(e.courses.start_date))} – ${esc(fmtDate(e.courses.end_date))}</dd></div>` : ''}
      <div><dt>Issued by</dt><dd>4AM Global Media</dd></div>
      <div><dt>Certificate serial</dt><dd class="mono">${esc(cert.certificate_serial)}</dd></div>
    </dl>
    ${revoked && cert.revoked_reason ? `<p class="revoked-note"><strong>Reason:</strong> ${esc(cert.revoked_reason)}</p>` : ''}
    <p class="note">Verified against 4AM Global Media's certificate register. Authenticity is confirmed by a cryptographic signature — the details above cannot be altered without invalidating this page.</p>
    <a class="cta" href="/">Visit 4AM Global Media</a>
  </div>`;

  return html(200, page(body, `${e.student_name} — ${revoked ? 'Revoked' : 'Verified'}`));
}
