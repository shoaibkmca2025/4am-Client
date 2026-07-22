import type { ApiRequest, ApiResponse } from '../../../lib/server/http';
import { allowMethods, json } from '../../../lib/server/http';
import { requireStaff } from '../../../lib/server/auth';
import { supabaseAdmin } from '../../../lib/server/supabaseAdmin';
import { courseSchema } from '../../../lib/server/validation';
import { writeAudit } from '../../../lib/server/audit';

// GET  /api/admin/courses  → list courses (newest first)
// POST /api/admin/courses  → create a course
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET', 'POST'])) return;

  const user = await requireStaff(req, res);
  if (!user) return;

  const db = supabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await db
      .from('courses')
      .select('*, enrollments(count)')
      .order('created_at', { ascending: false });
    if (error) return json(res, 500, { error: 'Could not load courses.' });
    return json(res, 200, { courses: data });
  }

  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) {
    return json(res, 400, {
      error: 'Please check the form.',
      issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }

  const { data, error } = await db
    .from('courses')
    .insert({ ...parsed.data, created_by: user.id })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return json(res, 409, { error: 'That slug is already used.' });
    return json(res, 500, { error: 'Could not create the course.' });
  }

  await writeAudit({
    actorId: user.id, action: 'course.create', entity: 'course',
    entityId: data.id, meta: { title: data.title },
  });
  return json(res, 201, { course: data });
}
