import { z } from 'zod';
import type { ApiRequest, ApiResponse } from '../../lib/server/http';
import { allowMethods, json } from '../../lib/server/http';
import { requireStaff } from '../../lib/server/auth';
import { supabaseAdmin } from '../../lib/server/supabaseAdmin';
import { writeAudit } from '../../lib/server/audit';

const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const createSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().regex(slugRe, 'Use lowercase words separated by hyphens').max(120),
  excerpt: z.string().trim().max(400).optional().or(z.literal('')),
  content: z.string().trim().max(60000).optional().or(z.literal('')),
  cover_image: z.string().trim().url().max(600).optional().or(z.literal('')),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  seo_title: z.string().trim().max(200).optional().or(z.literal('')),
  seo_description: z.string().trim().max(320).optional().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('draft'),
});
const updateSchema = createSchema.partial().extend({ id: z.string().uuid() });
const deleteSchema = z.object({ id: z.string().uuid() });

/** ~200 wpm, min 1 — shown as "N min read" on the public page. */
const readingMinutes = (content: string): number =>
  Math.max(1, Math.round(content.trim().split(/\s+/).filter(Boolean).length / 200));

// GET/POST/PATCH/DELETE /api/admin/posts
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET', 'POST', 'PATCH', 'DELETE'])) return;

  const user = await requireStaff(req, res);
  if (!user) return;

  const db = supabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await db
      .from('blog_posts')
      .select('id, title, slug, excerpt, status, published_at, tags, reading_minutes, created_at')
      .order('created_at', { ascending: false });
    if (error) return json(res, 500, { error: 'Could not load posts.' });
    return json(res, 200, { posts: data });
  }

  if (req.method === 'POST') {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return json(res, 400, {
        error: 'Please check the form.',
        issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
    }
    const p = parsed.data;
    const { data, error } = await db
      .from('blog_posts')
      .insert({
        ...p,
        author_id: user.id,
        reading_minutes: readingMinutes(p.content ?? ''),
        published_at: p.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();
    if (error) {
      if (error.code === '23505') return json(res, 409, { error: 'That slug is already used.' });
      return json(res, 500, { error: 'Could not save the post.' });
    }
    await writeAudit({ actorId: user.id, action: 'post.create', entity: 'blog_post', entityId: data.id, meta: { slug: data.slug } });
    return json(res, 201, { post: data });
  }

  if (req.method === 'PATCH') {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return json(res, 400, { error: 'Invalid request.' });
    const { id, ...fields } = parsed.data;

    const { data: current } = await db
      .from('blog_posts').select('status, published_at, content').eq('id', id).single();
    if (!current) return json(res, 404, { error: 'Post not found.' });

    const patch: Record<string, unknown> = { ...fields };
    if (fields.content !== undefined) patch.reading_minutes = readingMinutes(fields.content ?? '');
    // Stamp published_at the first time it goes live; keep the original after.
    if (fields.status === 'published' && !current.published_at) {
      patch.published_at = new Date().toISOString();
    }

    const { data, error } = await db.from('blog_posts').update(patch).eq('id', id).select().single();
    if (error) {
      if (error.code === '23505') return json(res, 409, { error: 'That slug is already used.' });
      return json(res, 500, { error: 'Could not update the post.' });
    }
    await writeAudit({ actorId: user.id, action: 'post.update', entity: 'blog_post', entityId: id, meta: { status: data.status } });
    return json(res, 200, { post: data });
  }

  const parsed = deleteSchema.safeParse(req.body);
  if (!parsed.success) return json(res, 400, { error: 'Invalid request.' });
  const { error } = await db.from('blog_posts').delete().eq('id', parsed.data.id);
  if (error) return json(res, 500, { error: 'Could not delete the post.' });
  await writeAudit({ actorId: user.id, action: 'post.delete', entity: 'blog_post', entityId: parsed.data.id });
  return json(res, 200, { ok: true });
}
