import QRCode from 'qrcode';
import type { ApiRequest, ApiResponse } from '../../../lib/server/http.js';
import { allowMethods, json } from '../../../lib/server/http.js';
import { requireStaff } from '../../../lib/server/auth.js';
import { supabaseAdmin } from '../../../lib/server/supabaseAdmin.js';
import { issueCertificateSchema, revokeCertificateSchema } from '../../../lib/server/validation.js';
import { generateCertificateSerial, verificationHash } from '../../../lib/server/crypto.js';
import { env } from '../../../lib/server/env.js';
import { writeAudit } from '../../../lib/server/audit.js';
import { z } from 'zod';

const BUCKET = 'certificates';

const reissueSchema = z.object({
  certificate_id: z.string().uuid(),
  file_path: z.string().trim().min(3).max(500).optional(),
});

const patchSchema = z.discriminatedUnion('action', [
  revokeCertificateSchema.extend({ action: z.literal('revoke') }),
  reissueSchema.extend({ action: z.literal('reissue') }),
]);

/** Serial + HMAC + QR for an enrollment; QR lands in the private bucket. */
const mintSerialAssets = async (enrollmentId: string) => {
  const db = supabaseAdmin();
  for (let attempt = 0; attempt < 5; attempt++) {
    const serial = generateCertificateSerial();
    const { data: clash } = await db
      .from('certificates').select('id').eq('certificate_serial', serial).maybeSingle();
    if (clash) continue;

    const qrPng = await QRCode.toBuffer(`${env.siteUrl}/verify/${serial}`, {
      type: 'png', width: 512, margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
    });
    const qrPath = `qr/${serial}.png`;
    const { error: upErr } = await db.storage
      .from(BUCKET)
      .upload(qrPath, qrPng, { contentType: 'image/png', upsert: true });

    return {
      serial,
      hash: verificationHash(serial, enrollmentId),
      qrPath: upErr ? null : qrPath,
    };
  }
  return null;
};

// POST  /api/admin/certificates  → issue for an enrollment
// PATCH /api/admin/certificates  → { action: 'revoke' | 'reissue', … }
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['POST', 'PATCH'])) return;

  const user = await requireStaff(req, res);
  if (!user) return;

  const db = supabaseAdmin();

  if (req.method === 'POST') {
    const parsed = issueCertificateSchema.safeParse(req.body);
    if (!parsed.success) {
      return json(res, 400, {
        error: 'Please check the form.',
        issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
    }
    const { enrollment_id, file_path, issue_date, show_file_publicly } = parsed.data;

    const { data: enrollment } = await db
      .from('enrollments')
      .select('id, student_name, certificates(id)')
      .eq('id', enrollment_id)
      .single();
    if (!enrollment) return json(res, 404, { error: 'Enrollment not found.' });
    // certificates ↔ enrollments is one-to-one, so PostgREST embeds an
    // object (or null) — but guard the array shape too.
    const existing = enrollment.certificates;
    if (Array.isArray(existing) ? existing.length > 0 : !!existing) {
      return json(res, 409, { error: 'A certificate already exists for this student. Use reissue instead.' });
    }

    // The uploaded file must really exist before we issue against it.
    const { error: fileErr } = await db.storage.from(BUCKET).createSignedUrl(file_path, 60);
    if (fileErr) return json(res, 400, { error: 'Certificate file not found in storage. Upload it first.' });

    const minted = await mintSerialAssets(enrollment_id);
    if (!minted) return json(res, 500, { error: 'Could not generate a unique serial. Try again.' });

    const { data: cert, error } = await db
      .from('certificates')
      .insert({
        enrollment_id,
        certificate_serial: minted.serial,
        file_path,
        issue_date: issue_date ?? undefined,
        verification_hash: minted.hash,
        qr_path: minted.qrPath,
        show_file_publicly,
        issued_by: user.id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return json(res, 409, { error: 'A certificate already exists for this student.' });
      return json(res, 500, { error: 'Could not issue the certificate.' });
    }

    await writeAudit({
      actorId: user.id, action: 'certificate.issue', entity: 'certificate',
      entityId: cert.id, meta: { serial: minted.serial, enrollment_id },
    });
    return json(res, 201, {
      certificate: cert,
      verifyUrl: `${env.siteUrl}/verify/${minted.serial}`,
    });
  }

  // PATCH — revoke / reissue
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) return json(res, 400, { error: 'Invalid request.' });

  const { data: cert } = await db
    .from('certificates')
    .select('id, enrollment_id, certificate_serial, status, file_path')
    .eq('id', parsed.data.certificate_id)
    .single();
  if (!cert) return json(res, 404, { error: 'Certificate not found.' });

  if (parsed.data.action === 'revoke') {
    if (cert.status === 'revoked') return json(res, 409, { error: 'Already revoked.' });
    const { error } = await db
      .from('certificates')
      .update({ status: 'revoked', revoked_reason: parsed.data.reason })
      .eq('id', cert.id);
    if (error) return json(res, 500, { error: 'Could not revoke.' });

    await writeAudit({
      actorId: user.id, action: 'certificate.revoke', entity: 'certificate',
      entityId: cert.id, meta: { serial: cert.certificate_serial, reason: parsed.data.reason },
    });
    return json(res, 200, { ok: true, status: 'revoked' });
  }

  // reissue: fresh serial + hash + QR (old serial verifies as unknown)
  const minted = await mintSerialAssets(cert.enrollment_id);
  if (!minted) return json(res, 500, { error: 'Could not generate a unique serial. Try again.' });

  const { data: updated, error } = await db
    .from('certificates')
    .update({
      certificate_serial: minted.serial,
      verification_hash: minted.hash,
      qr_path: minted.qrPath,
      file_path: parsed.data.file_path ?? cert.file_path,
      status: 'active',
      revoked_reason: null,
      issue_date: new Date().toISOString().slice(0, 10),
      issued_by: user.id,
    })
    .eq('id', cert.id)
    .select()
    .single();
  if (error) return json(res, 500, { error: 'Could not reissue.' });

  await writeAudit({
    actorId: user.id, action: 'certificate.reissue', entity: 'certificate',
    entityId: cert.id, meta: { old_serial: cert.certificate_serial, new_serial: minted.serial },
  });
  return json(res, 200, {
    certificate: updated,
    verifyUrl: `${env.siteUrl}/verify/${minted.serial}`,
  });
}
