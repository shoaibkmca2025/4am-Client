import { supabaseAdmin } from './supabaseAdmin';

/**
 * Append-only record of sensitive actions (rules.md §3): certificate
 * issue / revoke / reissue, claim, role changes. Never throws — an audit
 * failure must not roll back the user-facing action, but it is logged.
 */
export const writeAudit = async (entry: {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: Record<string, unknown>;
}): Promise<void> => {
  try {
    await supabaseAdmin().from('audit_log').insert({
      actor_id: entry.actorId ?? null,
      action: entry.action,
      entity: entry.entity,
      entity_id: entry.entityId ?? null,
      meta: entry.meta ?? {},
    });
  } catch (err) {
    console.error('[audit] failed to record', entry.action, err);
  }
};
