import type { ApiRequest, ApiResponse } from '../../../lib/server/http';
import { allowMethods, json } from '../../../lib/server/http';
import { requireUser } from '../../../lib/server/auth';
import { supabaseAdmin } from '../../../lib/server/supabaseAdmin';
import { writeAudit } from '../../../lib/server/audit';

const SIGNED_URL_TTL_SEC = 300; // 5 minutes — download links expire fast

// GET /api/portal/certificates/:id/download
// Ownership-checked, short-lived signed URL to the private file.
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET'])) return;

  const user = await requireUser(req, res);
  if (!user) return;

  const id = typeof req.query.id === 'string' ? req.query.id : '';
  if (!/^[0-9a-f-]{36}$/i.test(id)) return json(res, 400, { error: 'Invalid certificate id.' });

  const db = supabaseAdmin();
  const { data: cert } = await db
    .from('certificates')
    .select('id, file_path, status, certificate_serial, enrollments!inner(student_profile_id)')
    .eq('id', id)
    .single();

  // Same 404 whether it's missing or someone else's — no existence oracle.
  const owner = (cert?.enrollments as unknown as { student_profile_id: string } | null)?.student_profile_id;
  if (!cert || owner !== user.id) return json(res, 404, { error: 'Certificate not found.' });
  if (cert.status !== 'active') return json(res, 410, { error: 'This certificate has been revoked.' });

  const { data: signed, error } = await db.storage
    .from('certificates')
    .createSignedUrl(cert.file_path, SIGNED_URL_TTL_SEC, { download: true });
  if (error || !signed?.signedUrl) return json(res, 500, { error: 'Could not prepare the download.' });

  await writeAudit({
    actorId: user.id, action: 'certificate.download', entity: 'certificate',
    entityId: cert.id, meta: { serial: cert.certificate_serial },
  });
  return json(res, 200, { url: signed.signedUrl, expiresInSec: SIGNED_URL_TTL_SEC });
}
