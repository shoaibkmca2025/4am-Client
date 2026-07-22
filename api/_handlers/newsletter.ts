import type { ApiRequest, ApiResponse } from '../../lib/server/http';
import { allowMethods, clientIp, json } from '../../lib/server/http';
import { supabaseAdmin } from '../../lib/server/supabaseAdmin';
import { newsletterSchema } from '../../lib/server/validation';
import { rateLimit } from '../../lib/server/ratelimit';

// POST   /api/newsletter  → subscribe (idempotent; re-subscribes a lapsed email)
// DELETE /api/newsletter  → unsubscribe
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['POST', 'DELETE'])) return;

  const rl = rateLimit('newsletter', clientIp(req), 10, 10 * 60 * 1000);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    return json(res, 429, { error: 'Too many requests. Please try again shortly.' });
  }

  const source = req.method === 'DELETE' && !req.body ? { email: req.query.email } : req.body;
  const parsed = newsletterSchema.safeParse(source);
  if (!parsed.success) return json(res, 400, { error: 'Please enter a valid email address.' });

  const email = parsed.data.email.toLowerCase();
  const db = supabaseAdmin();
  const status = req.method === 'POST' ? 'subscribed' : 'unsubscribed';

  const { error } = await db
    .from('newsletter_subscribers')
    .upsert({ email, status }, { onConflict: 'email' });

  if (error) {
    console.error('[newsletter] upsert failed:', error);
    return json(res, 500, { error: 'Something went wrong. Please try again.' });
  }

  return json(res, 200, {
    ok: true,
    message: status === 'subscribed' ? "You're subscribed." : "You've been unsubscribed.",
  });
}
