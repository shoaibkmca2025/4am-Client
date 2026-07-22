#!/usr/bin/env node
// Migration runner — applies db/migrations/*.sql in filename order over the
// session-mode pooler (DIRECT_URL), tracking what ran in schema_migrations.
// Each file runs inside a transaction: a failure rolls back cleanly.
//
//   node db/migrate.mjs            apply pending migrations
//   node db/migrate.mjs --status   list applied / pending, apply nothing
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(here, 'migrations');

// Minimal .env.local loader (no dotenv dependency)
const loadEnv = () => {
  try {
    for (const line of readFileSync(join(here, '..', '.env.local'), 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
      if (!m) continue;
      const raw = m[2].trim();
      // Quoted values win; unquoted values stop at an inline # comment.
      const quoted = raw.match(/^"([^"]*)"|^'([^']*)'/);
      const value = quoted ? (quoted[1] ?? quoted[2]) : raw.split(/\s+#/)[0].trim();
      if (value && !process.env[m[1]]) process.env[m[1]] = value;
    }
  } catch { /* env may come from the shell instead */ }
};
loadEnv();

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) {
  console.error('Missing DIRECT_URL (or DATABASE_URL) — check .env.local');
  process.exit(1);
}

const statusOnly = process.argv.includes('--status');
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(`
    create table if not exists public.schema_migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    );
  `);

  const { rows } = await client.query('select name from public.schema_migrations');
  const applied = new Set(rows.map((r) => r.name));
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  if (statusOnly) {
    for (const f of files) console.log(`${applied.has(f) ? 'applied ' : 'PENDING '} ${f}`);
    process.exit(0);
  }

  const pending = files.filter((f) => !applied.has(f));
  if (pending.length === 0) {
    console.log('No pending migrations.');
    process.exit(0);
  }

  for (const file of pending) {
    const sql = readFileSync(join(migrationsDir, file), 'utf8');
    process.stdout.write(`applying ${file} ... `);
    try {
      await client.query('begin');
      await client.query(sql);
      await client.query('insert into public.schema_migrations (name) values ($1)', [file]);
      await client.query('commit');
      console.log('ok');
    } catch (err) {
      await client.query('rollback');
      console.log('FAILED');
      console.error(`\n${file}: ${err.message}`);
      if (err.position) {
        const upto = sql.slice(0, Number(err.position));
        console.error(`  at line ${upto.split('\n').length}`);
      }
      process.exit(1);
    }
  }
  console.log(`\nApplied ${pending.length} migration(s).`);
} finally {
  await client.end().catch(() => {});
}
