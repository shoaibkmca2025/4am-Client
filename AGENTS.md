# AGENTS.md

Guidance for AI coding agents working in this repository.

## What this is

A static website: hand-written HTML, CSS and plain JavaScript in `public/`. No framework, no npm, no build step, no backend. The owner explicitly wants it kept that way (fast load, no backend or admin panel). The previous React/Vite app and its API (portal, admin, blog, careers, certificates) were removed in October 2026; they are recoverable from git history before that change.

## Run and deploy

- Preview: `npx serve public` (clean URLs: `/services/seo` → `services/seo.html`).
- Deploy: Vercel serves `public/` directly. `vercel.json` sets `framework: null`, empty install and build commands, `outputDirectory: "public"`, `cleanUrls`, and redirects the removed backend routes (`/portal`, `/admin`, `/blog`, `/careers`, `/verify`) to `/`.

## Structure

- `public/index.html` — home page. A fixed `<canvas id="film">` scrubs a pre-rendered 3D film (an interface plant growing; frames from the Scrollhaus "Kelpware" free direction, re-encoded and self-hosted in `public/assets/film/d/` — desktop, every 2nd frame, 1600px — and `film/m/` — phones, every 3rd frame, 1024px) behind three `.beat` story cards; then `.solid` bone sections: services, marketplaces, numbers, work (100 projects), process, team, contact.
- `public/services/<slug>.html` — seven service pages, each with its own `<title>`, meta description, canonical, Open Graph tags and JSON-LD (`Service`, `BreadcrumbList`, `FAQPage`). Keep these in sync with the home page service list, the footer on every page, and `sitemap.xml`.
- `public/css/site.css` — every style. Owner palette on `:root`: `--bone` #EBE9DF, `--sage` #A9B887, `--forest` #2E3D28. Text is forest on light surfaces and bone (or light sage #C9D6AB) on forest; sage itself is too light for text on bone (1.7:1). Sketch inks (`--tomato`, `--gold`, `--sky`) are decoration only. Gradient text on bone uses `--grad-ink`.
- `public/js/main.js` — ES module. Every page: menu, reveal-on-scroll (`.rv` → `.on`; inline SVG sketches with `pathLength="1"` draw in), counters (`data-count`), card tilt, copy buttons, contact form. Home only: the film engine — frames fetched coarse-to-fine after load/idle or on first scroll, decoded with `createImageBitmap`, only ~10 kept around the playhead (memory-safe), camera keyframes `CAM`, pointer parallax, progress rail, beat word-rise.

## Rules that matter

- Off-screen home scenes use `content-visibility: auto`; avoid reading geometry inside them from per-frame code, or the browser is forced to lay them out.
- The first story beat renders visible at load (no reveal): it is the LCP element. Don't add `.rv` or the word-rise to it, and keep the film download deferred until after load or the first scroll.
- Sketch draw-in CSS matches strokes by ink class (`.s-t` etc.), not `[pathLength]`: Chrome lowercases that selector and misses restyles when `.on` lands on the `<svg>` itself.
- Respect `prefers-reduced-motion` (engine and CSS already branch on it) and gate hover effects behind `@media (hover: hover) and (pointer: fine)`.
- The contact form has no server: it validates, then opens `mailto:` or `wa.me` with the brief. Don't add a backend unless asked.
- Images are WebP with explicit `width`/`height`; below-the-fold images use `loading="lazy"`.
