import { z } from 'zod';
import type { ApiRequest, ApiResponse } from '../../../lib/server/http';
import { allowMethods, json } from '../../../lib/server/http';
import { requireStaff } from '../../../lib/server/auth';
import { supabaseAdmin } from '../../../lib/server/supabaseAdmin';
import { generateClaimKey, hashClaimKey } from '../../../lib/server/crypto';
import { writeAudit } from '../../../lib/server/audit';

const MAX_ROWS = 500;

const schema = z.object({
  course_id: z.string().uuid(),
  csv: z.string().min(1).max(200_000),
});

const rowSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
});

/** Minimal RFC-4180 parser: quoted fields, escaped quotes, CRLF. */
const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += c;
      continue;
    }
    if (c === '"') { quoted = true; continue; }
    if (c === ',') { row.push(field); field = ''; continue; }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f.trim() !== '')) rows.push(row);
      row = [];
      continue;
    }
    field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== '')) rows.push(row);
  return rows;
};

// POST /api/admin/enrollments-bulk — add a whole roster at once.
// Returns every generated claim key ONCE (they are stored hashed only).
// Duplicates within the course are reported, not silently overwritten.
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['POST'])) return;

  const user = await requireStaff(req, res);
  if (!user) return;

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return json(res, 400, { error: 'Provide a course and CSV content.' });

  const { data: course } = await supabaseAdmin()
    .from('courses').select('id, title').eq('id', parsed.data.course_id).single();
  if (!course) return json(res, 404, { error: 'That course no longer exists.' });

  const rows = parseCsv(parsed.data.csv);
  if (rows.length === 0) return json(res, 400, { error: 'The file appears to be empty.' });

  // Skip a header row if present.
  const first = rows[0].map((c) => c.trim().toLowerCase());
  const body = first.includes('name') || first.includes('email') ? rows.slice(1) : rows;
  if (body.length === 0) return json(res, 400, { error: 'No data rows found below the header.' });
  if (body.length > MAX_ROWS) return json(res, 400, { error: `Too many rows (${body.length}). Limit is ${MAX_ROWS} per import.` });

  const db = supabaseAdmin();
  const created: Array<{ name: string; email: string; claimKey: string }> = [];
  const skipped: Array<{ row: number; reason: string }> = [];

  for (let i = 0; i < body.length; i++) {
    const cols = body[i];
    const candidate = rowSchema.safeParse({ name: cols[0] ?? '', email: cols[1] ?? '' });
    if (!candidate.success) {
      skipped.push({ row: i + 1, reason: candidate.error.issues[0]?.message ?? 'Invalid row' });
      continue;
    }
    const claimKey = generateClaimKey();
    const { error } = await db.from('enrollments').insert({
      course_id: parsed.data.course_id,
      student_name: candidate.data.name,
      student_email: candidate.data.email.toLowerCase(),
      claim_key_hash: hashClaimKey(claimKey),
    });
    if (error) {
      // 23505 = the (course_id, lower(email)) uniqueness index
      skipped.push({ row: i + 1, reason: error.code === '23505' ? 'Already enrolled in this course' : 'Could not add' });
      continue;
    }
    created.push({ name: candidate.data.name, email: candidate.data.email, claimKey });
  }

  await writeAudit({
    actorId: user.id, action: 'enrollment.bulk_import', entity: 'course',
    entityId: parsed.data.course_id, meta: { created: created.length, skipped: skipped.length },
  });

  return json(res, 201, { created, skipped, course: course.title });
}
