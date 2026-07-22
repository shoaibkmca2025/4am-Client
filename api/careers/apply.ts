import { z } from 'zod';
import type { ApiRequest, ApiResponse } from '../../lib/server/http';
import { allowMethods, clientIp, json } from '../../lib/server/http';
import { supabaseAdmin } from '../../lib/server/supabaseAdmin';
import { rateLimit } from '../../lib/server/ratelimit';
import { notifyChat } from '../../lib/server/notify';
import { sendEmail } from '../../lib/server/email';
import { env } from '../../lib/server/env';

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const schema = z.object({
  opening_id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(32).optional().or(z.literal('')),
  portfolio_url: z.string().trim().url().max(500).optional().or(z.literal('')),
  cover_note: z.string().trim().max(4000).optional().or(z.literal('')),
  // Résumé arrives base64-encoded so the whole application is one JSON request.
  resume: z.object({
    filename: z.string().trim().max(200),
    contentType: z.string().trim().max(120),
    data: z.string().max(Math.ceil(MAX_RESUME_BYTES * 1.4)),
  }).optional(),
});

// POST /api/careers/apply — public job application intake.
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['POST'])) return;

  const rl = rateLimit('apply', clientIp(req), 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    return json(res, 429, { error: 'Too many applications submitted. Please try again later.' });
  }

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return json(res, 400, {
      error: 'Please check the form and try again.',
      issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }
  const a = parsed.data;
  const db = supabaseAdmin();

  // Resolve the role (if any) so we can name it in notifications.
  let openingTitle: string | null = null;
  if (a.opening_id) {
    const { data: opening } = await db
      .from('job_openings').select('title, status').eq('id', a.opening_id).maybeSingle();
    if (!opening || opening.status !== 'open') {
      return json(res, 400, { error: 'That role is no longer accepting applications.' });
    }
    openingTitle = opening.title;
  }

  // Optional résumé → private bucket.
  let resumePath: string | null = null;
  if (a.resume?.data) {
    if (!ALLOWED.includes(a.resume.contentType)) {
      return json(res, 400, { error: 'Résumé must be a PDF or Word document.' });
    }
    const bytes = Buffer.from(a.resume.data, 'base64');
    if (bytes.byteLength > MAX_RESUME_BYTES) {
      return json(res, 400, { error: 'Résumé is too large (5 MB maximum).' });
    }
    const ext = (a.resume.filename.split('.').pop() ?? 'pdf').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `applications/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await db.storage
      .from('resumes').upload(path, bytes, { contentType: a.resume.contentType, upsert: false });
    if (upErr) console.warn('[apply] résumé upload failed:', upErr.message);
    else resumePath = path;
  }

  const { data, error } = await db
    .from('job_applications')
    .insert({
      opening_id: a.opening_id ?? null,
      name: a.name,
      email: a.email.toLowerCase(),
      phone: a.phone || null,
      portfolio_url: a.portfolio_url || null,
      cover_note: a.cover_note || null,
      resume_path: resumePath,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[apply] insert failed:', error);
    return json(res, 500, { error: 'We could not submit your application. Please email Info@4amglobalmedia.com.' });
  }

  // Best-effort notifications — never block the applicant's confirmation.
  await Promise.all([
    notifyChat({
      title: '👤 New job application',
      lines: [
        ['Role', openingTitle ?? 'General application'],
        ['Name', a.name],
        ['Email', a.email],
        ['Phone', a.phone],
        ['Portfolio', a.portfolio_url],
        ['Résumé', resumePath ? 'attached' : 'not provided'],
      ],
      body: a.cover_note,
    }),
    env.leadNotifyTo
      ? sendEmail({
          to: env.leadNotifyTo,
          subject: `New application: ${openingTitle ?? 'General'} — ${a.name}`,
          replyTo: a.email,
          html: `<div style="background:#000;padding:32px;font-family:Inter,system-ui,sans-serif">
            <div style="max-width:600px;margin:0 auto;background:#0A0A0A;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:32px">
              <p style="margin:0 0 4px;color:#FF6A3D;font-size:11px;font-weight:700;letter-spacing:.3em;text-transform:uppercase">New application</p>
              <h1 style="margin:0 0 8px;color:#fff;font-size:26px;font-weight:900">${a.name}</h1>
              <p style="margin:0 0 24px;color:#888">${openingTitle ?? 'General application'}</p>
              <p style="color:#fff;font-size:15px">${a.email}${a.phone ? ` · ${a.phone}` : ''}</p>
              ${a.cover_note ? `<p style="color:#ccc;font-size:15px;line-height:1.7;white-space:pre-wrap">${a.cover_note}</p>` : ''}
              <p style="margin-top:24px;color:#555;font-size:12px">Résumé and full details are in the admin panel under Careers.</p>
            </div></div>`,
        })
      : Promise.resolve(null),
  ]);

  return json(res, 201, { ok: true, id: data.id });
}
