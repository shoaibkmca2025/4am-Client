import type { ApiRequest, ApiResponse } from '../../../lib/server/http.js';
import { allowMethods, json } from '../../../lib/server/http.js';
import { requireUser } from '../../../lib/server/auth.js';
import { supabaseAdmin } from '../../../lib/server/supabaseAdmin.js';

// GET /api/portal/certificates — the signed-in student's certificates.
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET'])) return;

  const user = await requireUser(req, res);
  if (!user) return;

  const { data, error } = await supabaseAdmin()
    .from('enrollments')
    .select(`
      id, student_name, claim_status, claimed_at,
      courses ( title, start_date, end_date, venue, college ),
      certificates ( id, certificate_serial, issue_date, status )
    `)
    .eq('student_profile_id', user.id)
    .order('claimed_at', { ascending: false });

  if (error) return json(res, 500, { error: 'Could not load your certificates.' });
  return json(res, 200, { enrollments: data });
}
