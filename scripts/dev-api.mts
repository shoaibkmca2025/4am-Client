// Local Vercel emulator: serves dist/ and routes /api/* + /verify/:serial
// to the real handlers in api/, adding the same req/res sugar Vercel does.
// Lets the whole platform be exercised in a browser without deploying.
//
//   npm run build && npm run dev:api      → http://localhost:4180
import { createServer } from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvLocal } from '../lib/server/loadEnv';

loadEnvLocal();

const PORT = Number(process.env.PORT ?? 4180);
const ROOT = new URL('..', import.meta.url);
// fileURLToPath (not .pathname) — the project path contains spaces, which
// stay percent-encoded in a URL pathname.
const DIST = fileURLToPath(new URL('dist/', ROOT));

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.splinecode': 'application/octet-stream',
};

// Route table built by SCANNING api/ — mirrors Vercel's file-based routing,
// so a new endpoint file is picked up automatically (a hand-written list
// silently 404s new routes into the SPA fallback, which answers 200).
interface Route { pattern: RegExp; file: string; params: string[] }

const scanRoutes = async (dir = 'api', prefix = '/api'): Promise<Route[]> => {
  const abs = fileURLToPath(new URL(`${dir}/`, ROOT));
  const out: Route[] = [];
  for (const entry of await readdir(abs, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      out.push(...(await scanRoutes(`${dir}/${entry.name}`, `${prefix}/${entry.name}`)));
      continue;
    }
    if (!entry.name.endsWith('.ts')) continue;
    const base = entry.name.replace(/\.ts$/, '');
    const urlPath = base === 'index' ? prefix : `${prefix}/${base}`;
    const params: string[] = [];
    const source =
      '^' +
      urlPath
        .split('/')
        .map((seg) => {
          const dyn = seg.match(/^\[(.+)\]$/);
          if (!dyn) return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          params.push(dyn[1]);
          return '([^/]+)';
        })
        .join('/') +
      '$';
    out.push({ pattern: new RegExp(source), file: `${dir}/${entry.name}`, params });
  }
  return out;
};

/**
 * Mirrors the `rewrites` in vercel.json so local routing can't drift from
 * production. Handles `/blog/:slug` → `/api/blog-page?slug=:slug`.
 */
const rewriteRoutes = async (): Promise<Route[]> => {
  const cfg = JSON.parse(await readFile(fileURLToPath(new URL('vercel.json', ROOT)), 'utf8'));
  const out: Route[] = [];
  for (const rw of cfg.rewrites ?? []) {
    const dest: string = rw.destination;
    if (!dest.startsWith('/api/')) continue; // SPA catch-all handled below
    const params: string[] = [];
    const source = '^' + String(rw.source).replace(/:(\w+)/g, (_m, name: string) => {
      params.push(name);
      return '([^/]+)';
    }) + '$';
    const file = `api/${dest.slice('/api/'.length).split('?')[0]}.ts`;
    // Query-string params in the destination map positionally to source params.
    out.push({ pattern: new RegExp(source), file, params });
  }
  return out;
};

const ROUTES: Route[] = [...(await rewriteRoutes()), ...(await scanRoutes())];
console.log(`routes: ${ROUTES.length} (${ROUTES.filter((r) => !r.pattern.source.startsWith('^\\/api')).length} from vercel.json rewrites)`);

const readBody = (req: any): Promise<unknown> =>
  new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve(undefined);
      try { resolve(JSON.parse(raw)); } catch { resolve(raw); }
    });
  });

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const path = decodeURIComponent(url.pathname);

  // ── API + verify routes ──
  for (const { pattern, file, params } of ROUTES) {
    const m = path.match(pattern);
    if (!m) continue;

    const query: Record<string, string> = Object.fromEntries(url.searchParams);
    params.forEach((name, i) => { query[name] = m[i + 1]; });

    const anyReq = req as any;
    anyReq.query = query;
    anyReq.cookies = {};
    anyReq.body = ['POST', 'PATCH', 'PUT'].includes(req.method ?? '') ? await readBody(req) : undefined;

    const anyRes = res as any;
    anyRes.status = (c: number) => { res.statusCode = c; return anyRes; };
    anyRes.json = (d: unknown) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(d));
    };
    anyRes.send = (d: string | Buffer) => res.end(d);

    try {
      const mod = await import(new URL(file, ROOT).href);
      await mod.default(anyReq, anyRes);
    } catch (err) {
      console.error(`[${path}]`, err);
      if (!res.writableEnded) { res.statusCode = 500; anyRes.json({ error: 'Handler error', detail: String(err) }); }
    }
    return;
  }

  // ── static files, SPA fallback ──
  const rel = path === '/' ? 'index.html' : path.replace(/^\//, '');
  let file = join(DIST, normalize(rel));
  try {
    const s = await stat(file);
    if (s.isDirectory()) file = join(file, 'index.html');
  } catch {
    file = join(DIST, 'index.html'); // SPA fallback
  }
  try {
    const buf = await readFile(file);
    res.setHeader('Content-Type', MIME[extname(file).toLowerCase()] ?? 'application/octet-stream');
    res.end(buf);
  } catch {
    res.statusCode = 404;
    res.end('Not found');
  }
}).listen(PORT, () => console.log(`local vercel emulator → http://localhost:${PORT}`));
