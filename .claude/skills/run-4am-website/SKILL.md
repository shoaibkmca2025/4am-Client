---
name: run-4am-website
description: Build, run, smoke-test and screenshot the 4AM Global Media website (single-page Vite + React + GSAP site, no backend). Use when asked to run / start / serve the site, screenshot it, verify the landing page, or check the hero / pinned sections on phone vs desktop.
---

# Run the 4AM website

All paths below are relative to the repo root (the directory with `package.json`).

The site is one static page: `components/AwwwardsLanding.tsx` (+ `.css`) inside
`App.tsx`. There is no API and no other route — every path serves `index.html`.
There is no `chromium-cli` on the dev machine; the driver at
`.claude/skills/run-4am-website/driver.mjs` drives the site with
**playwright-core + the system Chrome**. It installs playwright-core on first
use into `~/.cache/run-4am-website/` — outside the repo — so `package.json`
is never touched.

Verified on Windows 11 / Node 24 / Git Bash. Other platforms have Chrome
path fallbacks in the driver but are unverified.

## Prerequisites

- Node 24 (`node --version`), deps installed (`npm install` — nothing extra for the driver).
- Google Chrome installed (`C:/Program Files/Google/Chrome/Application/chrome.exe`). Or set `CHROME=<path>`.

## Run (agent path)

```bash
# build (tsc + vite build) and serve dist/ with `vite preview` on http://127.0.0.1:8787
node .claude/skills/run-4am-website/driver.mjs serve

# 16 checks: static files, section order, boot splash → preloader → hero intro,
# 7 service cards, 4 process cards, no CDN scripts, only 3 JS chunks, pins on
# desktop, nav anchor scroll, mailto CTA, SPA fallback, no console errors
node .claude/skills/run-4am-website/driver.mjs smoke

# screenshots — --at is the fraction down the page (0..1).
# Write them OUTSIDE the repo (the path is relative to cwd otherwise).
node .claude/skills/run-4am-website/driver.mjs shot "$TEMP/top.png"
node .claude/skills/run-4am-website/driver.mjs shot "$TEMP/gallery.png" --at 0.3
node .claude/skills/run-4am-website/driver.mjs shot "$TEMP/mobile.png" --at 0.3 --mobile

# per device (laptop, short window, iPhone, iPad, phone landscape): intro
# played, hero title fits, gallery pinned on desktop / vertical on phones,
# no horizontal overflow
node .claude/skills/run-4am-website/driver.mjs hero

node .claude/skills/run-4am-website/driver.mjs stop
```

`serve --no-build` skips the rebuild when `dist/` is current. `serve --dev`
runs the Vite dev server on `http://127.0.0.1:3000` instead. `--port N` and
`--base URL` override the defaults everywhere.

Server stdout/stderr goes to `~/.cache/run-4am-website/server.log`.

## Run (human path)

`npm run dev` opens Vite on port 3000; `npm run build && npm run preview`
serves the production build.

## Test / lint

There is no unit test runner; `smoke` + `hero` above are the checks.
`npm run lint` should be clean.

## Gotchas

- **Timing.** The landing plays a ~2.9s preloader and then a ~1.8s hero
  intro. The driver waits 5.5s after `networkidle` on `/` before asserting
  or screenshotting; an earlier screenshot shows words still masked.
- **Pins need real scrolling.** ScrollTrigger only builds pin state when the
  scroll position actually moves through the trigger, so `scrollHero` steps
  to the target in 400px increments rather than jumping.
- **Port 8080 is taken by Apache.** An `httpd.exe` Windows service listens on
  `0.0.0.0:8080`; probing it returns Apache "Not Found" pages that look like
  a broken app. The driver defaults to 8787.
- **Stale Vite on `[::1]:3000`.** A dev server left over from an earlier
  session keeps the port and an IPv4 probe never sees it. `serve` pre-flights
  the port and names the PID; `serve --force` kills it. Same reason the driver
  passes `--host 127.0.0.1`: `localhost` resolves to `::1` here.
- **Spawned server dies with its parent on Windows** unless spawned
  `detached: true`. Already handled; don't remove it.
- **Git Bash mangles `--route /x`** into `C:/Program Files/Git/x`. Pass it
  without the leading slash; the driver refuses the mangled form.
- **Unknown routes return 200**, not 404 — SPA fallback mirroring
  `vercel.json`. Don't write a check that expects a 404.
- **Files vanish from `node_modules`.** Native binaries have gone missing
  before (`@esbuild/win32-x64/esbuild.exe`, a stripped `playwright-core`) —
  likely antivirus quarantine. See Troubleshooting.
- **Dev vs prod render differently for GSAP reveals.** React StrictMode's
  double effect can leave text masked in `--dev` only. Confirm on the
  production build before chasing it.

## Troubleshooting

- `failed to load config from vite.config.ts … You installed esbuild for
  another platform` → the esbuild binary is gone or `@esbuild/win32-x64` is
  the wrong version. Compare
  `node -p "require('./node_modules/esbuild/package.json').version"` with
  `node -p "require('./node_modules/@esbuild/win32-x64/package.json').version"`
  and `npm install @esbuild/win32-x64@<esbuild version> --no-save`.
- `page.goto: net::ERR_CONNECTION_REFUSED` right after `serve` said "up" →
  the server died; check `server.log` and re-run `serve --no-build --force`.
- `port 3000 is already held by pid(s) …` → stale Vite. `serve --dev --force`.
- `Cannot find package '…/playwright-core/index.js'` → the cached install
  was stripped. Delete `~/.cache/run-4am-website/node_modules` and re-run.
