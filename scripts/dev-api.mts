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

// Production ships ONE serverless function (api/router.ts) that dispatches
// internally. The emulator delegates to the very same router, parsing the
// SAME vercel.json rewrites, so local and production routing are identical
// by construction.
const apiRouter = (await import(new URL('api/router.ts', ROOT).href)).default;

interface Rewrite { pattern: RegExp; params: string[]; destQuery: Record<string, string> }

/** Mirrors vercel.json rewrites, e.g.
 *  /blog/:slug → /api/router?__path=blog-page&slug=:slug */
const rewrites: Rewrite[] = await (async () => {
  const cfg = JSON.parse(await readFile(fileURLToPath(new URL('vercel.json', ROOT)), 'utf8'));
  const out: Rewrite[] = [];
  for (const rw of cfg.rewrites ?? []) {
    const dest: string = rw.destination;
    if (!dest.startsWith('/api/router')) continue; // SPA catch-all handled separately
    const params: string[] = [];
    const source = '^' + String(rw.source)
      .replace(/:(\w+)\*/g, (_m, name: string) => { params.push(name); return '(.*)'; })
      .replace(/:(\w+)/g, (_m, name: string) => { params.push(name); return '([^/]+)'; }) + '$';
    // Capture the destination's query template (__path, slug=:slug, …)
    const destQuery: Record<string, string> = {};
    const q = dest.split('?')[1] ?? '';
    for (const pair of q.split('&').filter(Boolean)) {
      const [k, v] = pair.split('=');
      destQuery[k] = decodeURIComponent(v ?? '');
    }
    out.push({ pattern: new RegExp(source), params, destQuery });
  }
  return out;
})();
console.log(`api: 1 function (api/router.ts) · ${rewrites.length} vercel.json rewrites`);

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

  // ── API: resolve to the single router, exactly like production ──
  // Direct /api/* → __path is the sub-path. Otherwise a vercel.json rewrite
  // (/blog, /verify, /careers) supplies __path + extra params.
  let isApi = false;
  const query: Record<string, string> = Object.fromEntries(url.searchParams);

  if (path === '/api/router') {
    isApi = true; // __path already in the query string
  } else if (path.startsWith('/api/')) {
    isApi = true;
    query.__path = path.slice('/api/'.length);
  } else {
    for (const rw of rewrites) {
      const m = path.match(rw.pattern);
      if (!m) continue;
      // Fill destination-query template, substituting :captures positionally
      for (const [k, tmpl] of Object.entries(rw.destQuery)) {
        const idx = rw.params.indexOf(tmpl.replace(/^:/, ''));
        query[k] = tmpl.startsWith(':') && idx >= 0 ? m[idx + 1] : tmpl;
      }
      isApi = true;
      break;
    }
  }

  if (isApi) {
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
      await apiRouter(anyReq, anyRes);
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
