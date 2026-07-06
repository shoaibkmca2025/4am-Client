# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server on **port 3000** (configured in `vite.config.ts`, not the Vite default 5173).
- `npm run build` — runs `tsc` (type-check, no emit) then `vite build`. TS errors will fail the build.
- `npm run lint` — ESLint with `--max-warnings 0`. Note: `.eslintrc.cjs` disables `@typescript-eslint/no-unused-vars`, `react-hooks/exhaustive-deps`, `@typescript-eslint/no-explicit-any`, and a few other rules — lint is intentionally permissive.
- `npm run preview` — serve the built `dist/`.
- **Required env**: `VITE_GEMINI_API_KEY` in `.env.local` (consumed by `components/AIChatbot.tsx` via `@google/genai`). Without it the chatbot fails silently when opened.

There is no test runner configured.

## Architecture

### Entry chain
`index.tsx` → `<ErrorBoundary>` → `App.tsx` → `<Router>` → `<ScrollToTop>` → `<SmoothScroll>` (Lenis + GSAP provider) → `<Navbar>` + `<LayoutWrapper>{<Suspense><Routes/></Suspense>}</LayoutWrapper>` → optional `<AIChatbot>`.

Routes are just two: `/` renders `LandingPage`, `/services/:slug` renders `ServicePage`, anything else redirects to `/`. Both route components are `lazy()` — the `Suspense` fallback is the "Loading…" screen in `App.tsx`.

### The scroll stack (important — don't fight it)
Scrolling is owned by **Lenis** inside `components/SmoothScroll.tsx`, driven by `gsap.ticker`, and bridged to `ScrollTrigger` via `lenis.on('scroll', ScrollTrigger.update)`. Two consequences:

1. `index.css` intentionally does **not** set `scroll-behavior: smooth` on `html`. Re-adding it will desync Lenis. Native anchor jumps are intercepted by a click handler in `SmoothScroll` that calls `lenis.scrollTo`.
2. There is also a legacy `utils/scroll.ts` (`scrollToSection`, `smoothScrollTo`) with its own `requestAnimationFrame` loop and retry-until-element-mounts logic. It's used by `Navbar`, `Hero` CTAs, and `LandingPage` route-state-driven scroll. This runs independently of Lenis — both work, but pick one per call site and stay consistent.

### Entrance animations
GSAP animations live inside components and follow this pattern: `useLayoutEffect` → `gsap.context(() => { ... }, rootRef)` → `return () => ctx.revert()`. Always scope selectors to the component root (pass the element as the second `gsap.context` arg). Always branch on `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and render the final state immediately when true.

### Performance gating
Non-critical features defer themselves until the browser is idle, and opt out entirely on low-capability devices. The pattern recurs in `App.tsx` (chatbot) and `LandingPage.tsx` (3D background):

- `requestIdleCallback` with a timeout, falling back to `setTimeout`
- Skip entirely if `navigator.connection.saveData`, `prefers-reduced-motion`, `hardwareConcurrency < 4`, or `matchMedia('(max-width: 1024px)')`
- `LandingPage` also pauses `GlobalNetworkBackground` during active scroll via a 140ms debounce

Respect these gates when adding new heavy effects. `vite.config.ts` manual-chunks `three` + `@react-three/fiber` into `three-vendor` so the 3D bundle is split out.

### Data & types
`constants.ts` (~33KB) is the single source of truth for `NAV_ITEMS`, `SERVICES` (drives `/services/:slug`), `PROJECTS` (client case studies, ~97 entries), and `CLIENTS`. `types.ts` defines the shapes. `data/` and `components/dashboard/` exist but are currently empty. Adding a new service means: add entry to `SERVICES` in `constants.ts` — `ServicePage` picks it up by `slug` from the route param. Adding a nav link means editing `NAV_ITEMS`.

### Auth
`components/AuthContext.tsx` wraps the app (inside `AuthProvider`). `types.ts` has `User` and `Opportunity` shapes that look like placeholders for a dashboard/careers feature that isn't wired up yet — treat as aspirational unless asked to build it.

### Styling
Tailwind with a custom `brand` palette in `tailwind.config.js` (`brand.primary` electric orange `#FF6A3D`, `brand.secondary` gold `#FFC56A`, `brand.accent` violet `#8B5CF6`, `brand.cyan` `#22D3EE`, `brand.lime` `#A3E635`, plus `dark`, `gray`, `bg`, `surface`).

**Scroll color grading**: `LandingPage.tsx` wraps each section in a `[data-grade]`/`[data-orbs]` div; a ScrollTrigger per zone tweens the page background tint and cross-fades three fixed radial-gradient "glow orbs" (orange/violet/cyan). Sections therefore use `bg-transparent`, NOT `bg-black` — re-adding an opaque background on a section breaks the grading.

**Gradient text gotcha**: `background-clip: text` does not paint through child spans that carry transforms (GSAP-animated words/chars). Gradient headlines must put the gradient class on the animated span itself — `wordClassName="text-gradient-brand"` on `RevealText`, or the `.hero-grad .hero-char` per-character rule in `index.css`. Putting `text-gradient-*` on the parent of animated spans renders invisible text.

**Signature scroll sections**: `CodeShowcase.tsx` (pinned, scrub-typed code editor + terminal — software dev story) and `GrowthChart.tsx` (pinned, scrub-drawn SVG growth curve + KPI counters — marketing story). Both skip pinning and render final state on mobile/reduced-motion. Custom fonts registered as `font-sans` (Inter), `font-display` (DM Sans), `font-mono` (JetBrains Mono). `index.css` also defines hand-rolled utilities for the Dentsu-inspired redesign: `text-massive`, `text-display`, `text-section-title`, `btn-line`, `btn-pill`, `ring-3d`, `horizontal-scroll`, `animate-reveal-up`. Use these before reaching for ad-hoc CSS.

### Deployment
`vercel.json` is a pure SPA rewrite — every path falls through to `/index.html`. Build output is `dist/` (also in `.gitignore` but `dist/` is currently checked in — don't commit rebuilt artifacts as part of unrelated changes).
