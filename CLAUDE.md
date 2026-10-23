# CLAUDE.md

Guidance for AI coding agents working in this repository.

## What this is

A static website: hand-written HTML, CSS and plain JavaScript in `public/`. No framework, no npm, no build step, no backend. The owner explicitly wants it kept that way (fast load, no backend or admin panel). The previous React/Vite app and its API (portal, admin, blog, careers, certificates) were removed in October 2026; they are recoverable from git history before that change.

## Run and deploy

- Preview: `npx serve public` (clean URLs: `/services/seo` → `services/seo.html`).
- Deploy: Vercel serves `public/` directly. `vercel.json` sets `framework: null`, empty install and build commands, `outputDirectory: "public"`, `cleanUrls`, and redirects the removed backend routes (`/portal`, `/admin`, `/blog`, `/careers`, `/verify`) to `/`.

## Structure

- `public/index.html` — home page. Ten `<section class="scene" data-scene="…">` blocks drive the scroll engine.
- `public/services/<slug>.html` — seven service pages, each with its own `<title>`, meta description, canonical, Open Graph tags and JSON-LD (`Service`, `BreadcrumbList`, `FAQPage`). Keep these in sync with the home page service list, the footer on every page, and `sitemap.xml`.
- `public/css/site.css` — every style. Palette tokens on `:root`: `--bg` platinum `#E5E4E2`, `--surface` lavender `#E6E0F0`, `--ink` coffee `#6F4E37`. Coffee is the only text colour (5.8:1 on both backgrounds); don't use lavender for text.
- `public/js/main.js` — ES module. Every page: menu, reveal-on-scroll, copy buttons, contact form. Home page only (`body.home`): the scene engine (one rAF loop reading `scrollY`) — header clock 04:00 → 06:12, keyframes `K` (landscape) and `P` (portrait) for the globe, pinned Services/Method/Work scenes (`html.pin`, desktop ≥ 900×560 and no reduced motion), project coverflow.
- `public/js/globe.js` — WebGL Earth, dynamically imported after `requestIdleCallback`. A full-screen ray-traced sphere shaded from NASA textures in `public/assets/earth/` (1k set on phones and weak devices, 4k day map on desktop) plus a point pass for arcs, satellites and city markers.

## Rules that matter

- Off-screen home scenes use `content-visibility: auto`. In the engine, check a section's own box (`near()`) before reading geometry inside it, or the browser is forced to lay it out.
- The hero `<h1>` has fixed `<br>` line breaks so the web-font swap cannot change its line count (no layout shift). Keep them.
- Respect `prefers-reduced-motion` (engine and CSS already branch on it) and gate hover effects behind `@media (hover: hover) and (pointer: fine)`.
- The contact form has no server: it validates, then opens `mailto:` or `wa.me` with the brief. Don't add a backend unless asked.
- Images are WebP with explicit `width`/`height`; below-the-fold images use `loading="lazy"`.
