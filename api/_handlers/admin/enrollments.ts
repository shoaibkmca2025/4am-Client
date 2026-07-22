import type { ApiRequest, ApiResponse } from '../../../lib/server/http';
import { allowMethods, json } from '../../../lib/server/http';
import { requireStaff } from '../../../lib/server/auth';
import { supabaseAdmin } from '../../../lib/server/supabaseAdmin';
import { enrollmentSchema } from '../../../lib/server/validation';
import { generateClaimKey, hashClaimKey } from '../../../lib/server/crypto';
import { writeAudit } from '../../../lib/server/audit';

// GET  /api/admin/enrollments?course_id=…  → roster + claim/cert status
// POST /api/admin/enrollments              → add student, mint claim key
//
// SECURITY: the plaintext claim key is returned in the POST response ONCE
// and never persisted — only its sha256 hash is stored. It cannot be
// recovered later; losing it means issuing a replacement enrollment.
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET', 'POST'])) return;

  const user = await requireStaff(req, res);
  if (!user) return;

  const db = supabaseAdmin();

  if (req.method === 'GET') {
    const courseId = typeof req.query.course_id === 'string' ? req.query.course_id : null;
    let q = db
      .from('enrollments')
      .select('id, student_name, student_email, claim_status, claimed_at, created_at, course_id, certificates(id, certificate_serial, status, issue_date)')
      .order('created_at', { ascending: false });
    if (courseId) q = q.eq('course_id', courseId);

    const { data, error } = await q;
    if (error) return json(res, 500, { error: 'Could not load enrollments.' });
    return json(res, 200, { enrollments: data });
  }

  const parsed = enrollmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return json(res, 400, {
      error: 'Please check the form.',
      issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }

  const { data: course } = await db
    .from('courses').select('id').eq('id', parsed.data.course_id).single();
  if (!course) return json(res, 404, { error: 'That course no longer exists.' });

  // Retry on the (astronomically unlikely) hash collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const claimKey = generateClaimKey();
    const { data, error } = await db
      .from('enrollments')
      .insert({
        course_id: parsed.data.course_id,
        student_name: parsed.data.student_name,
        student_email: parsed.data.student_email.toLowerCase(),
        claim_key_hash: hashClaimKey(claimKey),
      })
      .select('id, student_name, student_email, claim_status, created_at')
      .single();

    if (!error) {
      await writeAudit({
        actorId: user.id, action: 'enrollment.create', entity: 'enrollment',
        entityId: data.id, meta: { course_id: parsed.data.course_id, email: data.student_email },
      });
      // claimKey is surfaced exactly here, exactly once.
      return json(res, 201, { enrollment: data, claimKey });
    }
    if (error.code !== '23505') {
      return json(res, 500, { error: 'Could not add the student.' });
    }
  }
  return json(res, 500, { error: 'Could not generate a unique claim key. Try again.' });
}
