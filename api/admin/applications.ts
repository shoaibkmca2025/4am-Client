import { z } from 'zod';
import type { ApiRequest, ApiResponse } from '../../lib/server/http';
import { allowMethods, json } from '../../lib/server/http';
import { requireStaff } from '../../lib/server/auth';
import { supabaseAdmin } from '../../lib/server/supabaseAdmin';
import { writeAudit } from '../../lib/server/audit';

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['new', 'reviewing', 'shortlisted', 'rejected', 'hired']),
});

const RESUME_TTL_SEC = 300;

// GET   /api/admin/applications?opening_id=…  → candidate list (+ résumé links)
// PATCH /api/admin/applications               → move a candidate through stages
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET', 'PATCH'])) return;

  const user = await requireStaff(req, res);
  if (!user) return;

  const db = supabaseAdmin();

  if (req.method === 'GET') {
    let q = db
      .from('job_applications')
      .select('*, job_openings(title, slug)')
      .order('created_at', { ascending: false })
      .limit(300);
    const openingId = typeof req.query.opening_id === 'string' ? req.query.opening_id : null;
    if (openingId) q = q.eq('opening_id', openingId);

    const { data, error } = await q;
    if (error) return json(res, 500, { error: 'Could not load applications.' });

    // Résumés live in a private bucket — hand out short-lived signed links.
    const withResumes = await Promise.all(
      (data ?? []).map(async (a) => {
        if (!a.resume_path) return { ...a, resume_url: null };
        const { data: signed } = await db.storage
          .from('resumes').createSignedUrl(a.resume_path, RESUME_TTL_SEC);
        return { ...a, resume_url: signed?.signedUrl ?? null };
      }),
    );
    return json(res, 200, { applications: withResumes });
  }

  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) return json(res, 400, { error: 'Invalid request.' });

  const { error } = await db
    .from('job_applications').update({ status: parsed.data.status }).eq('id', parsed.data.id);
  if (error) return json(res, 500, { error: 'Could not update the application.' });

  await writeAudit({
    actorId: user.id, action: 'application.status', entity: 'job_application',
    entityId: parsed.data.id, meta: { status: parsed.data.status },
  });
  return json(res, 200, { ok: true });
}
