import type { ApiRequest, ApiResponse } from '../../lib/server/http.js';
import { allowMethods, clientIp } from '../../lib/server/http.js';
import { supabaseAdmin } from '../../lib/server/supabaseAdmin.js';
import { rateLimit } from '../../lib/server/ratelimit.js';
import { env } from '../../lib/server/env.js';
import { brandPage, esc, renderMarkdown } from '../../lib/server/brandPage.js';

// GET /blog and /blog/:slug (rewritten here by vercel.json)
// Server-rendered for real SEO: crawlable content, per-post meta/OG tags and
// Article structured data — none of which a client-rendered SPA route gives.

const fmtDate = (d: string | null): string =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

const notFound = (): string =>
  brandPage({
    title: 'Article not found',
    eyebrow: 'Insights',
    noindex: true,
    bodyInner: `<div class="card">
      <span class="badge unknown"><span class="dot"></span>Not found</span>
      <h1>THIS ARTICLE<br><span class="grad">ISN'T HERE</span></h1>
      <p class="sub">The article you're looking for may have been moved or unpublished.</p>
      <a class="cta" href="/blog">Browse all articles</a>
    </div>`,
  });

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET'])) return;

  const html = (code: number, body: string) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600');
    res.end(body);
  };

  const rl = rateLimit('blog-page', clientIp(req), 120, 60 * 1000);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    return html(429, brandPage({ title: 'Slow down', noindex: true, bodyInner: '<div class="card"><h1>TOO MANY<br><span class="grad">REQUESTS</span></h1></div>' }));
  }

  const db = supabaseAdmin();
  const slug = typeof req.query.slug === 'string' ? req.query.slug.trim() : '';

  // ── single post ──
  if (slug) {
    if (!/^[a-z0-9-]{1,120}$/i.test(slug)) return html(404, notFound());

    const { data: post } = await db
      .from('blog_posts')
      .select('title, slug, excerpt, content, cover_image, tags, seo_title, seo_description, reading_minutes, published_at')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (!post) return html(404, notFound());

    const url = `${env.siteUrl}/blog/${post.slug}`;
    const desc = post.seo_description || post.excerpt || '';
    const head = `
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(post.seo_title || post.title)}">
${desc ? `<meta property="og:description" content="${esc(desc)}">` : ''}
${post.cover_image ? `<meta property="og:image" content="${esc(post.cover_image)}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: desc || undefined,
      image: post.cover_image || undefined,
      datePublished: post.published_at,
      author: { '@type': 'Organization', name: '4AM Global Media' },
      publisher: {
        '@type': 'Organization',
        name: '4AM Global Media',
        logo: { '@type': 'ImageObject', url: `${env.siteUrl}/assets/logo-4am.png` },
      },
      mainEntityOfPage: url,
    }).replace(/</g, '\\u003c')}</script>`;

    const tags = (post.tags ?? []) as string[];
    const body = `<article class="article">
      <a class="back" href="/blog">← All articles</a>
      <span class="meta">${esc(fmtDate(post.published_at))}${post.reading_minutes ? ` · ${post.reading_minutes} min read` : ''}</span>
      <h1>${esc(post.title)}</h1>
      ${post.excerpt ? `<p class="sub">${esc(post.excerpt)}</p>` : ''}
      ${post.cover_image ? `<div class="cover"><img src="${esc(post.cover_image)}" alt="${esc(post.title)}"></div>` : ''}
      <div class="article-body">${renderMarkdown(post.content ?? '')}</div>
      ${tags.length ? `<div class="tags">${tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
      <p class="note">Written by the team at 4AM Global Media.</p>
      <a class="cta" href="/#contact">Work with us</a>
    </article>`;

    return html(200, brandPage({
      title: post.seo_title || post.title,
      description: desc,
      eyebrow: 'Insights',
      head,
      bodyInner: body,
    }));
  }

  // ── index ──
  const { data: posts } = await db
    .from('blog_posts')
    .select('title, slug, excerpt, tags, reading_minutes, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50);

  const list = (posts ?? []);
  const body = `
    <h1>INSIGHTS FROM<br><span class="grad">4AM GLOBAL MEDIA</span></h1>
    <p class="sub">Notes on digital marketing, software engineering, marketplace growth and AI — from the team building them.</p>
    ${list.length === 0
      ? `<div class="card"><p class="sub" style="margin:0">No articles published yet. Check back soon.</p></div>`
      : `<div class="posts">${list.map((p) => `
        <a class="post-card" href="/blog/${esc(p.slug)}">
          <span class="meta">${esc(fmtDate(p.published_at))}${p.reading_minutes ? ` · ${p.reading_minutes} min read` : ''}</span>
          <h2>${esc(p.title)}</h2>
          ${p.excerpt ? `<p>${esc(p.excerpt)}</p>` : ''}
        </a>`).join('')}</div>`}
    <a class="cta" href="/">Back to 4AM Global Media</a>`;

  return html(200, brandPage({
    title: 'Insights',
    description: 'Articles on digital marketing, software development, marketplace onboarding and AI from 4AM Global Media.',
    eyebrow: 'Insights',
    wide: true,
    head: `<link rel="canonical" href="${esc(`${env.siteUrl}/blog`)}">`,
    bodyInner: body,
  }));
}
