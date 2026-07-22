import type { ApiRequest, ApiResponse } from '../lib/server/http.js';
import { json } from '../lib/server/http.js';

// ── Single entry point for every /api/* request ──────────────────────
// The Hobby plan allows 12 Serverless Functions; we have 23 endpoints, so
// the whole backend ships as ONE plainly-named function. All handlers live
// in api/_handlers/ (Vercel ignores paths beginning with an underscore).
//
// Routing is done with EXPLICIT rewrites in vercel.json — every /api/* path
// (and the SSR pages /verify, /blog, /careers) is rewritten to
// `/api/router?__path=<the-route>`. We do NOT use a `[...catch-all].ts`
// filename: that spread syntax is a Next.js feature and does NOT reliably
// register as a plain Vercel Function, which left the whole API returning
// the SPA's HTML (404-as-index) in production.
//
// Handlers are LAZY-loaded (dynamic import) so that a failing import in one
// handler can't take down module initialisation for the whole API — the
// error is caught per-request and returned as JSON instead of an opaque
// FUNCTION_INVOCATION_FAILED. Dynamic imports with literal paths are still
// traced and bundled by Vercel.

type Handler = (req: ApiRequest, res: ApiResponse) => Promise<void> | void;
type Loader = () => Promise<{ default: Handler }>;

/** Exact paths (after the leading /api/). */
const STATIC_ROUTES: Record<string, Loader> = {
  'health': () => import('./_handlers/health.js'),
  'leads': () => import('./_handlers/leads.js'),
  'newsletter': () => import('./_handlers/newsletter.js'),
  'verify': () => import('./_handlers/verify.js'),
  'verify-page': () => import('./_handlers/verify-page.js'),
  'blog-page': () => import('./_handlers/blog-page.js'),
  'careers-page': () => import('./_handlers/careers-page.js'),
  'content/testimonials': () => import('./_handlers/content/testimonials.js'),
  'careers/apply': () => import('./_handlers/careers/apply.js'),
  'portal/claim': () => import('./_handlers/portal/claim.js'),
  'portal/certificates': () => import('./_handlers/portal/certificates.js'),
  'admin/courses': () => import('./_handlers/admin/courses.js'),
  'admin/enrollments': () => import('./_handlers/admin/enrollments.js'),
  'admin/enrollments-bulk': () => import('./_handlers/admin/enrollments-bulk.js'),
  'admin/certificates': () => import('./_handlers/admin/certificates.js'),
  'admin/leads': () => import('./_handlers/admin/leads.js'),
  'admin/testimonials': () => import('./_handlers/admin/testimonials.js'),
  'admin/metrics': () => import('./_handlers/admin/metrics.js'),
  'admin/posts': () => import('./_handlers/admin/posts.js'),
  'admin/audit': () => import('./_handlers/admin/audit.js'),
  'admin/openings': () => import('./_handlers/admin/openings.js'),
  'admin/applications': () => import('./_handlers/admin/applications.js'),
};

/** Paths with parameters; captured groups are merged into req.query. */
const DYNAMIC_ROUTES: Array<{ pattern: RegExp; params: string[]; loader: Loader }> = [
  {
    pattern: /^portal\/certificates\/([^/]+)\/download$/,
    params: ['id'],
    loader: () => import('./_handlers/portal/certificate-download.js'),
  },
];

/** Resolve the logical route from (in priority) the rewrite's __path, a
 *  legacy `route` param, or the raw URL — so it works behind vercel.json
 *  rewrites AND when called directly (local emulator, /api/router?...). */
const resolveRoute = (req: ApiRequest): string => {
  const pick = (v: unknown): string =>
    Array.isArray(v) ? v.join('/') : typeof v === 'string' ? v : '';
  const fromQuery = pick(req.query.__path) || pick(req.query.route);
  const fromUrl = (req.url ?? '')
    .split('?')[0]
    .replace(/^\/api\/(router|index)\b/, '')
    .replace(/^\/api\/?/, '')
    .replace(/^\/+|\/+$/g, '');
  return (fromQuery || fromUrl).replace(/^\/+|\/+$/g, '');
};

/** Read + JSON-parse the request body when the runtime hasn't already. */
const readBody = (req: ApiRequest): Promise<unknown> =>
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

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  try {
    // Normalise the request without assuming Vercel's helper layer populated
    // req.query / req.body (it usually does, but not depending on it is what
    // makes this resilient across runtimes).
    if (!req.query || typeof req.query !== 'object') {
      const qs = (req.url ?? '').split('?')[1] ?? '';
      req.query = Object.fromEntries(new URLSearchParams(qs));
    }
    if (req.body === undefined && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method ?? '')) {
      req.body = await readBody(req);
    }

    const route = resolveRoute(req);

    const exact = STATIC_ROUTES[route];
    if (exact) {
      const mod = await exact();
      return await mod.default(req, res);
    }

    for (const { pattern, params, loader } of DYNAMIC_ROUTES) {
      const m = route.match(pattern);
      if (!m) continue;
      params.forEach((name, i) => { req.query[name] = m[i + 1]; });
      const mod = await loader();
      return await mod.default(req, res);
    }

    return json(res, 404, { error: `Not found: ${route || '(empty)'}` });
  } catch (err) {
    // Never let an unhandled throw surface as FUNCTION_INVOCATION_FAILED —
    // return a clean JSON 500 with the message so failures are diagnosable.
    console.error('[api] handler error:', err);
    if (!res.writableEnded) {
      json(res, 500, { error: 'Server error.', detail: err instanceof Error ? err.message : String(err) });
    }
  }
}
