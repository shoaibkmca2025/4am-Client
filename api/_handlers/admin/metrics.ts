import type { ApiRequest, ApiResponse } from '../../../lib/server/http.js';
import { allowMethods, json } from '../../../lib/server/http.js';
import { requireStaff } from '../../../lib/server/auth.js';
import { supabaseAdmin } from '../../../lib/server/supabaseAdmin.js';

// GET /api/admin/metrics — dashboard counters.
// Uses head-only count queries: no rows travel over the wire.
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET'])) return;

  const user = await requireStaff(req, res);
  if (!user) return;

  const db = supabaseAdmin();
  const head = { count: 'exact' as const, head: true };

  const [courses, students, issued, claimed, revoked, leadsNew, leadsTotal, subscribers] =
    await Promise.all([
      db.from('courses').select('*', head),
      db.from('enrollments').select('*', head),
      db.from('certificates').select('*', head),
      db.from('enrollments').select('*', head).eq('claim_status', 'claimed'),
      db.from('certificates').select('*', head).eq('status', 'revoked'),
      db.from('leads').select('*', head).eq('status', 'new'),
      db.from('leads').select('*', head),
      db.from('newsletter_subscribers').select('*', head).eq('status', 'subscribed'),
    ]);

  return json(res, 200, {
    metrics: {
      courses: courses.count ?? 0,
      students: students.count ?? 0,
      issued: issued.count ?? 0,
      claimed: claimed.count ?? 0,
      revoked: revoked.count ?? 0,
      leadsNew: leadsNew.count ?? 0,
      leadsTotal: leadsTotal.count ?? 0,
      subscribers: subscribers.count ?? 0,
    },
  });
}
