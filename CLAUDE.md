# CLAUDE.md

Guidance for AI coding agents working in this repository.

## What this is

A static website: hand-written HTML, CSS and plain JavaScript in `public/`. No framework, no npm, no build step, no backend. The owner explicitly wants it kept that way (fast load, no backend or admin panel). The previous React/Vite app and its API (portal, admin, blog, careers, certificates) were removed in October 2026; they are recoverable from git history before that change.

## Run and deploy

- Preview: `npx serve public` (clean URLs: `/services/seo` → `services/seo.html`).
- Deploy: Vercel serves `public/` directly. `vercel.json` sets `framework: null`, empty install and build commands, `outputDirectory: "public"`, `cleanUrls`, and redirects the removed backend routes (`/portal`, `/admin`, `/blog`, `/careers`, `/verify`) to `/`.

## Structure

- `public/index.html` — home page. Opens with `.vhero`: a full-screen looping night video (`public/assets/hero/`: `night-1080.mp4` landscape, `night-portrait.mp4` for portrait phones) over a `<picture>` still, Instrument Serif headline, Inter copy, liquid-glass button, and a pause button (WCAG 2.2.2). While the hero or the launch scene is under the header, `html.at-hero` gives the header its dark glass look. Below the hero, `section.scene#launch` (after the free Scrollhaus "Zenith" direction): a pinned stage holding one tall photograph, `public/assets/launch/night-launch.webp` (Zenith's violet moon-and-rocket photo, hue-shifted to the hero's night navy, 74 KB). Scroll drives one camera pan + push-in from the launch to the moon; the launch copy rises, blurs and fades, then "Marketing you can measure." and a glass results window (`.dash`, real client numbers from the Work section; an `.sr` sentence carries them for screen readers) arrive. Then `.solid` bone sections: services and work are `.loop` rows (one line of compact cards drifting right-to-left on their own; they ease to a stop on hover, focus, the Pause button or off screen; people move them with trackpad/Shift+wheel, the ‹ › buttons, arrow keys, or drag/swipe; reduced motion gets a native scroll row), plus marketplaces, numbers, all 100 projects, process, team, contact.
- `public/services/<slug>.html` — seven service pages, each with its own `<title>`, meta description, canonical, Open Graph tags and JSON-LD (`Service`, `BreadcrumbList`, `FAQPage`). Keep these in sync with the home page service list, the footer on every page, and `sitemap.xml`.
- `public/css/site.css` — every style. Owner palette on `:root`: `--bone` #EBE9DF, `--sage` #A9B887, `--forest` #2E3D28. Text is forest on light surfaces and bone (or light sage #C9D6AB) on forest; sage itself is too light for text on bone (1.7:1). Sketch inks (`--tomato`, `--gold`, `--sky`) are decoration only. Gradient text on bone uses `--grad-ink`.
- `public/js/main.js` — ES module. Every page: menu, reveal-on-scroll (`.rv` → `.on`; inline SVG sketches with `pathLength="1"` draw in), counters (`data-count`), card tilt, copy buttons, contact form. Home only: the hero (video source picked by aspect ratio and set only after first paint, paused off screen, fades in on `playing`; header `at-hero` state), the loop rows, and the launch scene — progress p from the section bounds; the timeline eases toward it (settle 9/s) capped at 0.4/s so a flick plays out; it writes `--cam-*`, `--hero-*`, `--glow-o`, `--plat-*` on the section and stops its rAF loop when settled; the headline lines are uncovered when the scene arrives. Nav highlight: the section in view, nothing over the hero and scene.

## Rules that matter

- Home sections (`.solid > .sec`, except `#numbers`) use `content-visibility: auto`, so their height changes when they first render and their lazy images wait until they are near. Never read geometry inside an off-screen section (check the section's own box first, as the reveal code does): it forces the browser to lay that section out. The loop rows clone their cards and measure their width only when they first come on screen — don't move that earlier.
- No layout reads during start-up script: use `matchMedia` for viewport checks, not `innerWidth` (one such read cost 85 ms on a mid-range phone). The scene measures itself in its first animation frame.
- Launch scene: one photo, never a crossfade; filters only while the copy is mid-exit (`.is-blurring`), never at rest; `will-change` only under `.is-moving`. The dashboard is decorative (`aria-hidden`) and never reflows: it scales as one unit (`--s`). Its figures are real client results — keep them in sync with the Work cards, and don't invent numbers.
- Card rows: only a horizontal-dominant wheel (or Shift+wheel) is captured; vertical wheel always scrolls the page. After any manual move the row holds for 5 s before drifting again.
- The hero headline is the LCP element: it only rises, it never fades from opacity 0 (Chrome doesn't count text that starts invisible). The still is a `<picture>` (portrait source at `max-aspect-ratio: 4/5`); never give the `<video>` a `poster` or change it from JS — swapping the poster on phones held the first paint for 1–2 s. Keep the video download deferred until after load and first paint.
- Sketch draw-in CSS matches strokes by ink class (`.s-t` etc.), not `[pathLength]`: Chrome lowercases that selector and misses restyles when `.on` lands on the `<svg>` itself.
- Respect `prefers-reduced-motion` (engine and CSS already branch on it) and gate hover effects behind `@media (hover: hover) and (pointer: fine)`.
- The contact form has no server: it validates, then opens `mailto:` or `wa.me` with the brief. Don't add a backend unless asked.
- Images are WebP with explicit `width`/`height`; below-the-fold images use `loading="lazy"`.
