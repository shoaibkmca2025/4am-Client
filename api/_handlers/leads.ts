import type { ApiRequest, ApiResponse } from '../../lib/server/http.js';
import { allowMethods, clientIp, json } from '../../lib/server/http.js';
import { supabaseAdmin } from '../../lib/server/supabaseAdmin.js';
import { leadSchema } from '../../lib/server/validation.js';
import { rateLimit } from '../../lib/server/ratelimit.js';
import { env } from '../../lib/server/env.js';
import { leadNotificationHtml, sendEmail } from '../../lib/server/email.js';
import { notifyChat } from '../../lib/server/notify.js';

// POST /api/leads — public contact/enquiry submissions.
// Persistence is the source of truth; email is a best-effort notification.
// A failing/unconfigured mailer never costs you the lead.
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['POST'])) return;

  const rl = rateLimit('leads', clientIp(req), 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    return json(res, 429, { error: 'Too many submissions. Please try again shortly.' });
  }

  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    return json(res, 400, {
      error: 'Please check the form and try again.',
      issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }
  const lead = parsed.data;

  const { data, error } = await supabaseAdmin()
    .from('leads')
    .insert({
      name: lead.name,
      email: lead.email.toLowerCase(),
      phone: lead.phone || null,
      company: lead.company || null,
      service: lead.service || null,
      budget: lead.budget || null,
      message: lead.message,
      source: lead.source,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[leads] insert failed:', error);
    return json(res, 500, { error: 'We could not save your message. Please email Info@4amglobalmedia.com.' });
  }

  // Notify the team; the visitor's success does not depend on any of this.
  let notified = false;
  const [emailResult] = await Promise.all([
    env.leadNotifyTo
      ? sendEmail({
          to: env.leadNotifyTo,
          subject: `New enquiry from ${lead.name}${lead.service ? ` — ${lead.service}` : ''}`,
          html: leadNotificationHtml(lead),
          replyTo: lead.email,
        })
      : Promise.resolve({ sent: false, reason: 'LEAD_NOTIFY_TO not set' }),
    notifyChat({
      title: '📥 New website enquiry',
      lines: [
        ['Name', lead.name],
        ['Email', lead.email],
        ['Phone', lead.phone],
        ['Company', lead.company],
        ['Service', lead.service],
        ['Budget', lead.budget],
      ],
      body: lead.message,
    }),
  ]);
  notified = emailResult.sent;
  if (!emailResult.sent) console.warn('[leads] saved but not emailed:', emailResult.reason);

  return json(res, 201, { ok: true, id: data.id, notified });
}
