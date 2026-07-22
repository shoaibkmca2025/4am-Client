import type { ApiRequest, ApiResponse } from '../../lib/server/http';
import { allowMethods, json } from '../../lib/server/http';
import { requireAdmin } from '../../lib/server/auth';
import { supabaseAdmin } from '../../lib/server/supabaseAdmin';

// GET /api/admin/audit?action=…&limit=… — admin-only activity trail.
// Deliberately admin-only (not staff): it records who did what.
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET'])) return;

  const user = await requireAdmin(req, res);
  if (!user) return;

  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const db = supabaseAdmin();

  let q = db
    .from('audit_log')
    .select('id, action, entity, entity_id, meta, created_at, actor_id')
    .order('created_at', { ascending: false })
    .limit(limit);

  const action = typeof req.query.action === 'string' ? req.query.action : null;
  if (action) q = q.like('action', `${action}%`);

  const { data, error } = await q;
  if (error) return json(res, 500, { error: 'Could not load the audit log.' });

  // Resolve actor names in one round-trip.
  const ids = [...new Set((data ?? []).map((r) => r.actor_id).filter(Boolean))] as string[];
  const names = new Map<string, string>();
  if (ids.length) {
    const { data: profiles } = await db.from('profiles').select('id, full_name, role').in('id', ids);
    for (const p of profiles ?? []) names.set(p.id, p.full_name || p.role);
  }

  return json(res, 200, {
    entries: (data ?? []).map((r) => ({ ...r, actor: r.actor_id ? names.get(r.actor_id) ?? 'Unknown' : 'System' })),
  });
}
