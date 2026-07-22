import type { ApiRequest, ApiResponse } from '../lib/server/http';
import { allowMethods, clientIp, json } from '../lib/server/http';
import { supabaseAdmin } from '../lib/server/supabaseAdmin';
import { serialSchema } from '../lib/server/validation';
import { verifyHash } from '../lib/server/crypto';
import { rateLimit } from '../lib/server/ratelimit';

// GET /api/verify?serial=4AM-2026-XXXXXX — public, no login.
// Server-side HMAC validation means a fabricated serial can never present
// as an issued certificate (prd §5.4). Only certificate-visible data is
// returned; a "not found" and a "tampered" result are indistinguishable.
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET'])) return;

  const rl = rateLimit('verify', clientIp(req), 30, 60 * 1000);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    return json(res, 429, { error: 'Too many requests. Please slow down.' });
  }

  const parsed = serialSchema.safeParse(
    typeof req.query.serial === 'string' ? req.query.serial.toUpperCase() : '',
  );
  if (!parsed.success) return json(res, 200, { valid: false });

  const { data: cert } = await supabaseAdmin()
    .from('certificates')
    .select(`
      certificate_serial, issue_date, status, revoked_reason, verification_hash,
      enrollment_id,
      enrollments!inner (
        student_name,
        courses!inner ( title, start_date, end_date, venue, college )
      )
    `)
    .eq('certificate_serial', parsed.data)
    .maybeSingle();

  if (!cert) return json(res, 200, { valid: false });
  if (!verifyHash(cert.certificate_serial, cert.enrollment_id, cert.verification_hash)) {
    return json(res, 200, { valid: false });
  }

  const enrollment = cert.enrollments as unknown as {
    student_name: string;
    courses: { title: string; start_date: string | null; end_date: string | null; venue: string | null; college: string | null };
  };

  return json(res, 200, {
    valid: true,
    status: cert.status,                       // 'active' | 'revoked'
    revokedReason: cert.status === 'revoked' ? cert.revoked_reason : null,
    serial: cert.certificate_serial,
    holder: enrollment.student_name,
    course: enrollment.courses.title,
    courseDates: {
      start: enrollment.courses.start_date,
      end: enrollment.courses.end_date,
    },
    venue: enrollment.courses.venue,
    college: enrollment.courses.college,
    issueDate: cert.issue_date,
    issuer: '4AM Global Media',
  });
}
