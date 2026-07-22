import type { ApiRequest, ApiResponse } from '../../../lib/server/http.js';
import { allowMethods, clientIp, json } from '../../../lib/server/http.js';
import { requireUser } from '../../../lib/server/auth.js';
import { supabaseAdmin } from '../../../lib/server/supabaseAdmin.js';
import { claimSchema } from '../../../lib/server/validation.js';
import { hashClaimKey } from '../../../lib/server/crypto.js';
import { rateLimit } from '../../../lib/server/ratelimit.js';
import { writeAudit } from '../../../lib/server/audit.js';

// POST /api/portal/claim — link a signed-in student to an enrollment
// via their one-time claim key. Single-use by construction: the UPDATE
// only matches rows still in claim_status='pending' (atomic).
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['POST'])) return;

  const user = await requireUser(req, res);
  if (!user) return;

  // Brute-force damping: keys have ~8×10^14 combinations; 10 tries/hour
  // per user+IP makes guessing meaningless.
  const rl = rateLimit('claim', `${user.id}:${clientIp(req)}`, 10, 60 * 60 * 1000);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    return json(res, 429, { error: 'Too many attempts. Please try again later.' });
  }

  const parsed = claimSchema.safeParse(req.body);
  if (!parsed.success) {
    return json(res, 400, { error: 'That key does not look right. Check the format: 4AM-XXXXX-XXXXX' });
  }

  const db = supabaseAdmin();
  const keyHash = hashClaimKey(parsed.data.claimKey);

  // Atomic claim: matches only if the key is real AND still unclaimed.
  const { data: claimed, error } = await db
    .from('enrollments')
    .update({
      student_profile_id: user.id,
      claim_status: 'claimed',
      claimed_at: new Date().toISOString(),
    })
    .eq('claim_key_hash', keyHash)
    .eq('claim_status', 'pending')
    .select('id, student_name, course_id, courses(title), certificates(certificate_serial, status)')
    .maybeSingle();

  if (error) return json(res, 500, { error: 'Something went wrong. Please try again.' });

  if (!claimed) {
    // Distinguish "used" from "invalid" for a clear user message (prd §5.2).
    const { data: used } = await db
      .from('enrollments').select('id').eq('claim_key_hash', keyHash).maybeSingle();
    return json(res, 404, {
      error: used
        ? 'This key has already been used.'
        : 'Invalid key. Check for typos and try again.',
    });
  }

  await writeAudit({
    actorId: user.id, action: 'enrollment.claim', entity: 'enrollment',
    entityId: claimed.id, meta: { course_id: claimed.course_id },
  });
  return json(res, 200, { ok: true, enrollment: claimed });
}
