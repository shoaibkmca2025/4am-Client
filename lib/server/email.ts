import { Resend } from 'resend';
import { env } from './env.js';

// Transactional email. Degrades gracefully: if RESEND_API_KEY is absent the
// send is skipped and reported as such — a lead is NEVER lost because email
// is unconfigured or the provider is down (it is already saved to the DB).
export const isEmailConfigured = (): boolean => Boolean(env.resendApiKey && env.leadNotifyTo);

export interface SendResult { sent: boolean; reason?: string }

export const sendEmail = async (opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendResult> => {
  if (!env.resendApiKey) return { sent: false, reason: 'RESEND_API_KEY not set' };
  try {
    const resend = new Resend(env.resendApiKey);
    const { error } = await resend.emails.send({
      // Until a domain is verified in Resend, onboarding@resend.dev is the
      // only usable sender. Swap to notifications@4amglobalmedia.com after
      // verifying the domain.
      from: process.env.EMAIL_FROM ?? '4AM Global Media <onboarding@resend.dev>',
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    if (error) {
      console.error('[email] send failed:', error);
      return { sent: false, reason: error.message };
    }
    return { sent: true };
  } catch (err) {
    console.error('[email] threw:', err);
    return { sent: false, reason: err instanceof Error ? err.message : 'unknown' };
  }
};

const row = (label: string, value?: string | null): string =>
  value
    ? `<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.1em;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:8px 0;color:#fff;font-size:15px">${value}</td></tr>`
    : '';

/** Branded internal notification for a new website enquiry. */
export const leadNotificationHtml = (lead: {
  name: string; email: string; phone?: string; company?: string;
  service?: string; budget?: string; message: string; source: string;
}): string => `
<div style="background:#000;padding:32px;font-family:Inter,system-ui,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#0A0A0A;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:32px">
    <p style="margin:0 0 4px;color:#FF6A3D;font-size:11px;font-weight:700;letter-spacing:.3em;text-transform:uppercase">New enquiry</p>
    <h1 style="margin:0 0 24px;color:#fff;font-size:26px;font-weight:900;letter-spacing:-.02em">${lead.name}</h1>
    <table style="border-collapse:collapse;width:100%">
      ${row('Email', lead.email)}
      ${row('Phone', lead.phone)}
      ${row('Company', lead.company)}
      ${row('Service', lead.service)}
      ${row('Budget', lead.budget)}
      ${row('Source', lead.source)}
    </table>
    <div style="margin-top:24px;padding-top:24px;border-top:1px solid rgba(255,255,255,.08)">
      <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.1em">Message</p>
      <p style="margin:0;color:#fff;font-size:15px;line-height:1.7;white-space:pre-wrap">${lead.message}</p>
    </div>
    <p style="margin:28px 0 0;color:#555;font-size:12px">Reply directly to this email to respond to ${lead.name}.</p>
  </div>
</div>`;
