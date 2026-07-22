import type { ApiRequest, ApiResponse } from '../lib/server/http';
import { json } from '../lib/server/http';

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
// Handlers are imported statically so the bundler definitely includes them.

import health from './_handlers/health';
import leads from './_handlers/leads';
import newsletter from './_handlers/newsletter';
import verify from './_handlers/verify';
import verifyPage from './_handlers/verify-page';
import blogPage from './_handlers/blog-page';
import careersPage from './_handlers/careers-page';
import contentTestimonials from './_handlers/content/testimonials';
import careersApply from './_handlers/careers/apply';
import portalClaim from './_handlers/portal/claim';
import portalCertificates from './_handlers/portal/certificates';
import portalDownload from './_handlers/portal/certificate-download';
import adminCourses from './_handlers/admin/courses';
import adminEnrollments from './_handlers/admin/enrollments';
import adminEnrollmentsBulk from './_handlers/admin/enrollments-bulk';
import adminCertificates from './_handlers/admin/certificates';
import adminLeads from './_handlers/admin/leads';
import adminTestimonials from './_handlers/admin/testimonials';
import adminMetrics from './_handlers/admin/metrics';
import adminPosts from './_handlers/admin/posts';
import adminAudit from './_handlers/admin/audit';
import adminOpenings from './_handlers/admin/openings';
import adminApplications from './_handlers/admin/applications';

type Handler = (req: ApiRequest, res: ApiResponse) => Promise<void> | void;

/** Exact paths (after the leading /api/). */
const STATIC_ROUTES: Record<string, Handler> = {
  'health': health,
  'leads': leads,
  'newsletter': newsletter,
  'verify': verify,
  'verify-page': verifyPage,
  'blog-page': blogPage,
  'careers-page': careersPage,
  'content/testimonials': contentTestimonials,
  'careers/apply': careersApply,
  'portal/claim': portalClaim,
  'portal/certificates': portalCertificates,
  'admin/courses': adminCourses,
  'admin/enrollments': adminEnrollments,
  'admin/enrollments-bulk': adminEnrollmentsBulk,
  'admin/certificates': adminCertificates,
  'admin/leads': adminLeads,
  'admin/testimonials': adminTestimonials,
  'admin/metrics': adminMetrics,
  'admin/posts': adminPosts,
  'admin/audit': adminAudit,
  'admin/openings': adminOpenings,
  'admin/applications': adminApplications,
};

/** Paths with parameters; captured groups are merged into req.query. */
const DYNAMIC_ROUTES: Array<{ pattern: RegExp; params: string[]; handler: Handler }> = [
  {
    pattern: /^portal\/certificates\/([^/]+)\/download$/,
    params: ['id'],
    handler: portalDownload,
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
    if (exact) return await exact(req, res);

    for (const { pattern, params, handler: h } of DYNAMIC_ROUTES) {
      const m = route.match(pattern);
      if (!m) continue;
      params.forEach((name, i) => { req.query[name] = m[i + 1]; });
      return await h(req, res);
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
