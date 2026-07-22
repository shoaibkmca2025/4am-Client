import { z } from 'zod';
import type { ApiRequest, ApiResponse } from '../../../lib/server/http.js';
import { allowMethods, json } from '../../../lib/server/http.js';
import { requireStaff } from '../../../lib/server/auth.js';
import { supabaseAdmin } from '../../../lib/server/supabaseAdmin.js';
import { writeAudit } from '../../../lib/server/audit.js';

const createSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  department: z.string().trim().max(80).optional().or(z.literal('')),
  location: z.string().trim().max(120).optional().or(z.literal('')),
  employment_type: z.enum(['full-time', 'part-time', 'internship', 'contract']).default('full-time'),
  description: z.string().trim().max(20000).optional().or(z.literal('')),
  requirements: z.array(z.string().trim().min(1).max(200)).max(20).default([]),
  salary_range: z.string().trim().max(80).optional().or(z.literal('')),
  status: z.enum(['draft', 'open', 'closed']).default('draft'),
});
const updateSchema = createSchema.partial().extend({ id: z.string().uuid() });
const deleteSchema = z.object({ id: z.string().uuid() });

// GET/POST/PATCH/DELETE /api/admin/openings
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET', 'POST', 'PATCH', 'DELETE'])) return;

  const user = await requireStaff(req, res);
  if (!user) return;

  const db = supabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await db
      .from('job_openings')
      .select('*, job_applications(count)')
      .order('created_at', { ascending: false });
    if (error) return json(res, 500, { error: 'Could not load openings.' });
    return json(res, 200, { openings: data });
  }

  if (req.method === 'POST') {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return json(res, 400, {
        error: 'Please check the form.',
        issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
    }
    const { data, error } = await db
      .from('job_openings').insert({ ...parsed.data, created_by: user.id }).select().single();
    if (error) {
      if (error.code === '23505') return json(res, 409, { error: 'That slug is already used.' });
      return json(res, 500, { error: 'Could not create the opening.' });
    }
    await writeAudit({ actorId: user.id, action: 'opening.create', entity: 'job_opening', entityId: data.id, meta: { slug: data.slug } });
    return json(res, 201, { opening: data });
  }

  if (req.method === 'PATCH') {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return json(res, 400, { error: 'Invalid request.' });
    const { id, ...fields } = parsed.data;
    const { data, error } = await db.from('job_openings').update(fields).eq('id', id).select().single();
    if (error) return json(res, 500, { error: 'Could not update the opening.' });
    await writeAudit({ actorId: user.id, action: 'opening.update', entity: 'job_opening', entityId: id, meta: { status: data.status } });
    return json(res, 200, { opening: data });
  }

  const parsed = deleteSchema.safeParse(req.body);
  if (!parsed.success) return json(res, 400, { error: 'Invalid request.' });
  const { error } = await db.from('job_openings').delete().eq('id', parsed.data.id);
  if (error) return json(res, 500, { error: 'Could not delete the opening.' });
  await writeAudit({ actorId: user.id, action: 'opening.delete', entity: 'job_opening', entityId: parsed.data.id });
  return json(res, 200, { ok: true });
}
