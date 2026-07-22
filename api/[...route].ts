import type { ApiRequest, ApiResponse } from '../lib/server/http';
import { json } from '../lib/server/http';

// ── Single entry point for every /api/* request ──────────────────────
// Vercel turns each file under api/ into its own Serverless Function, and
// the Hobby plan allows 12. Twenty-three endpoints therefore failed to
// deploy. Everything now lives in api/_handlers/ (Vercel ignores paths
// beginning with an underscore) and this catch-all dispatches to them, so
// the whole backend ships as ONE function — no limit, one warm instance,
// shared dependency bundle.
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

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  // Vercel supplies the catch-all segments in req.query.route; fall back to
  // parsing the URL so local emulation and edge cases behave identically.
  const raw = req.query.route;
  const fromQuery = Array.isArray(raw) ? raw.join('/') : typeof raw === 'string' ? raw : '';
  const fromUrl = (req.url ?? '').split('?')[0].replace(/^\/api\/?/, '').replace(/\/$/, '');
  const route = (fromQuery || fromUrl).replace(/^\/+|\/+$/g, '');

  const exact = STATIC_ROUTES[route];
  if (exact) return exact(req, res);

  for (const { pattern, params, handler: h } of DYNAMIC_ROUTES) {
    const m = route.match(pattern);
    if (!m) continue;
    params.forEach((name, i) => { req.query[name] = m[i + 1]; });
    return h(req, res);
  }

  return json(res, 404, { error: 'Not found' });
}
