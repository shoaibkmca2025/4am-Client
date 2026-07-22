import { z } from 'zod';
import type { ApiRequest, ApiResponse } from '../../../lib/server/http.js';
import { allowMethods, json } from '../../../lib/server/http.js';
import { requireStaff } from '../../../lib/server/auth.js';
import { supabaseAdmin } from '../../../lib/server/supabaseAdmin.js';
import { writeAudit } from '../../../lib/server/audit.js';

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['new', 'contacted', 'closed']),
});

// GET   /api/admin/leads?status=new  → enquiry inbox
// PATCH /api/admin/leads             → update a lead's status
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET', 'PATCH'])) return;

  const user = await requireStaff(req, res);
  if (!user) return;

  const db = supabaseAdmin();

  if (req.method === 'GET') {
    let q = db.from('leads').select('*').order('created_at', { ascending: false }).limit(200);
    const status = typeof req.query.status === 'string' ? req.query.status : null;
    if (status && ['new', 'contacted', 'closed'].includes(status)) q = q.eq('status', status);

    const { data, error } = await q;
    if (error) return json(res, 500, { error: 'Could not load leads.' });
    return json(res, 200, { leads: data });
  }

  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) return json(res, 400, { error: 'Invalid request.' });

  const { error } = await db
    .from('leads').update({ status: parsed.data.status }).eq('id', parsed.data.id);
  if (error) return json(res, 500, { error: 'Could not update the lead.' });

  await writeAudit({
    actorId: user.id, action: 'lead.status', entity: 'lead',
    entityId: parsed.data.id, meta: { status: parsed.data.status },
  });
  return json(res, 200, { ok: true });
}
