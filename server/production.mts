// ── Self-hosted production server (Hostinger VPS) ────────────────────
// Serves the built SPA (dist/) AND runs the whole API + SSR backend in one
// Node process, same-origin — so no CORS and relative /api/* URLs just work,
// exactly like the app expects. Put nginx (TLS) in front and PM2 around it.
//
//   npm run build && npm start        → http://127.0.0.1:8080
//
// Routing mirrors vercel.json (single source of truth): /api/* and the SSR
// pages (/verify, /blog, /careers) go to the one router; everything else is
// a static file or the SPA fallback.
import { createServer } from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvLocal } from '../lib/server/loadEnv.js';

loadEnvLocal('.env', '.env.local');

const PORT = Number(process.env.PORT ?? 8080);
const HOST = process.env.HOST ?? '127.0.0.1'; // behind nginx; use 0.0.0.0 to expose directly
const ROOT = new URL('..', import.meta.url);
const DIST = fileURLToPath(new URL('dist/', ROOT));

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json',
  '.splinecode': 'application/octet-stream', '.map': 'application/json',
};

// The one backend function (same file that runs on any platform).
const apiRouter = (await import(new URL('api/router.ts', ROOT).href)).default;

interface Rewrite { pattern: RegExp; params: string[]; destQuery: Record<string, string> }

/** Mirrors vercel.json rewrites → /api/router?__path=…&param=… */
const rewrites: Rewrite[] = await (async () => {
  const cfg = JSON.parse(await readFile(fileURLToPath(new URL('vercel.json', ROOT)), 'utf8'));
  const out: Rewrite[] = [];
  for (const rw of cfg.rewrites ?? []) {
    const dest: string = rw.destination;
    if (!dest.startsWith('/api/router')) continue;
    const params: string[] = [];
    const source = '^' + String(rw.source)
      .replace(/:(\w+)\*/g, (_m, n: string) => { params.push(n); return '(.*)'; })
      .replace(/:(\w+)/g, (_m, n: string) => { params.push(n); return '([^/]+)'; }) + '$';
    const destQuery: Record<string, string> = {};
    for (const pair of (dest.split('?')[1] ?? '').split('&').filter(Boolean)) {
      const [k, v] = pair.split('=');
      destQuery[k] = decodeURIComponent(v ?? '');
    }
    out.push({ pattern: new RegExp(source), params, destQuery });
  }
  return out;
})();

// Security headers applied to every response (mirrors vercel.json headers).
const setSecurityHeaders = (res: any): void => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  // HSTS: only meaningful over HTTPS (nginx terminates TLS). Harmless on http.
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
};

const readBody = (req: any): Promise<unknown> =>
  new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve(undefined);
      try { resolve(JSON.parse(raw)); } catch { resolve(raw); }
    });
    req.on('error', () => resolve(undefined));
  });

const DIST_RESOLVED = resolve(DIST);
const serveStatic = async (res: any, absPath: string, urlPath: string): Promise<boolean> => {
  // Containment guard: never serve anything resolving outside dist/.
  let file = resolve(absPath);
  if (file !== DIST_RESOLVED && !file.startsWith(DIST_RESOLVED + sep)) return false;
  try {
    const s = await stat(file);
    if (s.isDirectory()) file = join(file, 'index.html');
  } catch {
    return false;
  }
  let buf: Buffer;
  try { buf = await readFile(file); } catch { return false; }

  const ext = extname(file).toLowerCase();
  res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');
  // Hashed build assets are immutable; everything else must revalidate.
  if (urlPath.startsWith('/assets/')) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  else res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.statusCode = 200;
  res.end(buf);
  return true;
};

const server = createServer(async (req, res) => {
  try {
    setSecurityHeaders(res);
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? HOST}`);
    const path = decodeURIComponent(url.pathname);

    // ── API + SSR routing (same router as every other platform) ──
    let isApi = false;
    const query: Record<string, string> = Object.fromEntries(url.searchParams);

    if (path === '/api/router') {
      isApi = true;
    } else if (path.startsWith('/api/')) {
      isApi = true;
      query.__path = path.slice('/api/'.length);
    } else {
      for (const rw of rewrites) {
        const m = path.match(rw.pattern);
        if (!m) continue;
        for (const [k, tmpl] of Object.entries(rw.destQuery)) {
          const idx = rw.params.indexOf(tmpl.replace(/^:/, ''));
          query[k] = tmpl.startsWith(':') && idx >= 0 ? m[idx + 1] : tmpl;
        }
        isApi = true;
        break;
      }
    }

    if (isApi) {
      res.setHeader('Cache-Control', 'no-store'); // handlers may override
      const anyReq = req as any;
      anyReq.query = query;
      anyReq.cookies = {};
      anyReq.body = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method ?? '') ? await readBody(req) : undefined;
      await apiRouter(anyReq, res);
      return;
    }

    // ── static file ──
    const rel = path === '/' ? 'index.html' : path.replace(/^\/+/, '');
    const safe = normalize(rel).replace(/^(\.\.[/\\])+/, ''); // no path traversal
    if (await serveStatic(res, join(DIST, safe), path)) return;

    // ── SPA fallback → index.html ──
    if (await serveStatic(res, join(DIST, 'index.html'), '/index.html')) return;

    res.statusCode = 404;
    res.end('Not found');
  } catch (err) {
    console.error('[server]', err);
    if (!res.writableEnded) { res.statusCode = 500; res.end('Server error'); }
  }
});

server.listen(PORT, HOST, () => {
  console.log(`4AM Global Media server running at http://${HOST}:${PORT} (${rewrites.length} SSR rewrites)`);
});

// Graceful shutdown for PM2/systemd restarts.
for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, () => { server.close(() => process.exit(0)); });
}
