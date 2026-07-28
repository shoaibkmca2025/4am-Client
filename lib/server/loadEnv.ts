import { readFileSync } from 'node:fs';

// Loads a dotenv file into process.env for local scripts/tests and for the
// self-hosted production server (VPS). On platforms that inject env vars
// (Vercel), a missing file is ignored silently. Quoted values win; unquoted
// values stop at an inline `#` comment. Existing process.env wins.
export const loadEnvFile = (path: string): boolean => {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    return false;
  }
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const raw = m[2].trim();
    const quoted = raw.match(/^"([^"]*)"|^'([^']*)'/);
    const value = quoted ? (quoted[1] ?? quoted[2]) : raw.split(/\s+#/)[0].trim();
    if (value && process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
  return true;
};

/** Loads the first dotenv file that exists (production `.env` preferred,
 *  then `.env.local` for local dev). */
export const loadEnvLocal = (...paths: string[]): void => {
  const candidates = paths.length ? paths : ['.env', '.env.local'];
  for (const p of candidates) loadEnvFile(p);
};
