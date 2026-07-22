import { z } from 'zod';
import type { ApiRequest, ApiResponse } from '../../../lib/server/http';
import { allowMethods, json } from '../../../lib/server/http';
import { requireStaff } from '../../../lib/server/auth';
import { supabaseAdmin } from '../../../lib/server/supabaseAdmin';
import { writeAudit } from '../../../lib/server/audit';

const createSchema = z.object({
  client_name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  quote: z.string().trim().min(10).max(1000),
  rating: z.number().int().min(1).max(5).optional(),
  is_published: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(9999).default(0),
});
const updateSchema = createSchema.partial().extend({ id: z.string().uuid() });
const deleteSchema = z.object({ id: z.string().uuid() });

// GET/POST/PATCH/DELETE /api/admin/testimonials
// Published rows feed the marketing carousel via /api/content/testimonials.
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET', 'POST', 'PATCH', 'DELETE'])) return;

  const user = await requireStaff(req, res);
  if (!user) return;

  const db = supabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await db
      .from('testimonials').select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) return json(res, 500, { error: 'Could not load testimonials.' });
    return json(res, 200, { testimonials: data });
  }

  if (req.method === 'POST') {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return json(res, 400, {
        error: 'Please check the form.',
        issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
    }
    const { data, error } = await db.from('testimonials').insert(parsed.data).select().single();
    if (error) return json(res, 500, { error: 'Could not save the testimonial.' });
    await writeAudit({ actorId: user.id, action: 'testimonial.create', entity: 'testimonial', entityId: data.id });
    return json(res, 201, { testimonial: data });
  }

  if (req.method === 'PATCH') {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return json(res, 400, { error: 'Invalid request.' });
    const { id, ...fields } = parsed.data;
    const { data, error } = await db.from('testimonials').update(fields).eq('id', id).select().single();
    if (error) return json(res, 500, { error: 'Could not update the testimonial.' });
    await writeAudit({ actorId: user.id, action: 'testimonial.update', entity: 'testimonial', entityId: id, meta: fields });
    return json(res, 200, { testimonial: data });
  }

  const parsed = deleteSchema.safeParse(req.body);
  if (!parsed.success) return json(res, 400, { error: 'Invalid request.' });
  const { error } = await db.from('testimonials').delete().eq('id', parsed.data.id);
  if (error) return json(res, 500, { error: 'Could not delete the testimonial.' });
  await writeAudit({ actorId: user.id, action: 'testimonial.delete', entity: 'testimonial', entityId: parsed.data.id });
  return json(res, 200, { ok: true });
}
