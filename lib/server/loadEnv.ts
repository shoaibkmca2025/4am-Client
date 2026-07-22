import { readFileSync } from 'node:fs';

// Loads .env.local for LOCAL scripts/tests only. On Vercel the variables
// come from the platform, so the missing file is ignored silently.
// Quoted values win; unquoted values stop at an inline `#` comment.
export const loadEnvLocal = (path = '.env.local'): void => {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    return;
  }
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const raw = m[2].trim();
    const quoted = raw.match(/^"([^"]*)"|^'([^']*)'/);
    const value = quoted ? (quoted[1] ?? quoted[2]) : raw.split(/\s+#/)[0].trim();
    if (value && process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
};
