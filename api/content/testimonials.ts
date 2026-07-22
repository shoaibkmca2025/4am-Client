import type { ApiRequest, ApiResponse } from '../../lib/server/http';
import { allowMethods, json } from '../../lib/server/http';
import { supabaseAdmin } from '../../lib/server/supabaseAdmin';

// GET /api/content/testimonials — published testimonials for the marketing
// page. Public, cached at the edge. Returns an empty array on any failure so
// the marketing section can fall back to its built-in copy and never breaks.
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET'])) return;

  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600');

  const { data, error } = await supabaseAdmin()
    .from('testimonials')
    .select('id, client_name, company, quote, avatar, rating')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[testimonials] load failed:', error);
    return json(res, 200, { testimonials: [] });
  }
  return json(res, 200, { testimonials: data ?? [] });
}
