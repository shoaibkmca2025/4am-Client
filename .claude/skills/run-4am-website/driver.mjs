#!/usr/bin/env node
// Agent driver for the 4AM Global Media website.
//
//   node .claude/skills/run-4am-website/driver.mjs <command> [options]
//
//   serve [--dev] [--port N] [--no-build] [--force]
//                                           build + start the server in the background
//                                           (--force kills whatever already holds the port)
//   stop                                    stop whatever `serve` started
//   smoke [--base URL]                      HTTP + browser checks; exit 1 on any failure
//   shot <out.png> [--route /] [--at 0.4] [--mobile] [--base URL]
//                                           screenshot; --at = fraction down the page (0..1)
//   hero [--base URL]                       landing checks: intro played, pins per device, no overflow
//
// Drives the app with playwright-core + the system Chrome (no `chromium-cli`
// on this machine). playwright-core is installed on first use into a cache
// under the user's home — NOT into the project — so package.json is untouched.
//
// Defaults: production = `vite preview` of dist/ (the site is static — no
// backend) on port 8787. NOT 8080: an Apache service owns 8080 on the dev
// machine and Node fails with EACCES there. `--dev` runs the Vite dev server
// on 3000.

import { spawn, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const UNIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const CACHE = path.join(os.homedir(), '.cache', 'run-4am-website');
const PIDFILE = path.join(CACHE, 'server.json');
const IS_WIN = process.platform === 'win32';

const argv = process.argv.slice(2);
const cmd = argv[0];
const opt = (name, dflt) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : dflt; };
const has = (name) => argv.includes(name);
const positional = argv.slice(1).filter((a, i, arr) => !a.startsWith('--') && !(arr[i - 1] || '').startsWith('--'));

const log = (...a) => console.log(...a);
const fail = (msg) => { console.error('FAIL:', msg); process.exit(1); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── browser bootstrap ─────────────────────────────────────────────── */
const chromePath = () => {
  const c = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(os.homedir(), 'AppData/Local/Google/Chrome/Application/chrome.exe'),
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ].find((p) => fs.existsSync(p));
  if (!c) fail('no Chrome/Edge found — install Google Chrome or set CHROME=<path>');
  return process.env.CHROME || c;
};

const playwright = async () => {
  fs.mkdirSync(CACHE, { recursive: true });
  const req = createRequire(path.join(CACHE, 'package.json'));
  try { return req('playwright-core'); } catch { /* not installed yet */ }
  log(`installing playwright-core into ${CACHE} (one-time)…`);
  execSync(`npm install --prefix "${CACHE}" playwright-core --no-audit --no-fund --silent`, { stdio: 'inherit', shell: true });
  return req('playwright-core');
};

const openPage = async (pw, { mobile = false, dpr } = {}) => {
  const browser = await pw.chromium.launch({ executablePath: chromePath(), headless: true });
  const ctx = await browser.newContext(mobile
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: dpr ?? 3, isMobile: true, hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' }
    : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: dpr ?? 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`); });
  return { browser, page, errors };
};

/** Scroll to a fraction of the page in steps (ScrollTrigger pins need to
 *  see the scroll happen, not just the end value) and let it settle. */
const scrollHero = (page, at) => page.evaluate(async (f) => {
  const span = document.documentElement.scrollHeight - innerHeight;
  const target = Math.round(span * f);
  for (let y = 0; y < target; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
  scrollTo(0, target);
  await new Promise((r) => setTimeout(r, 1200));
}, at);

/** PIDs listening on a port — Windows netstat or lsof elsewhere. */
const portOwners = (port) => {
  try {
    if (IS_WIN) {
      const out = execSync('netstat -ano', { encoding: 'utf8', windowsHide: true });
      const onPort = new RegExp('[:.]' + port + '\\s');
      return [...new Set(out.split(/\r?\n/)
        .filter((l) => /LISTENING/.test(l) && onPort.test(l))
        .map((l) => l.trim().split(/\s+/).pop()))].filter(Boolean);
    }
    return execSync(`lsof -ti :${port}`, { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
  } catch { return []; }
};

const waitUp = async (url, ms = 60000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try { const r = await fetch(url); if (r.status === 200) return true; } catch { /* not yet */ }
    await sleep(500);
  }
  return false;
};

/* ── serve / stop ──────────────────────────────────────────────────── */
const serve = async () => {
  const dev = has('--dev');
  const port = Number(opt('--port', dev ? 3000 : 8787));
  fs.mkdirSync(CACHE, { recursive: true });
  if (fs.existsSync(PIDFILE)) { log('a server is already recorded — running `stop` first'); await stop(); }

  // Pre-flight the port. A stale Vite from an earlier session sitting on
  // [::1]:3000 is the classic way this fails: the new one cannot bind, and a
  // 127.0.0.1 probe never sees the old one, so it just looks "down".
  const owners = portOwners(port);
  if (owners.length) {
    if (has('--force')) {
      for (const pid of owners) { try { IS_WIN ? execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' }) : process.kill(Number(pid), 'SIGTERM'); } catch { /* gone */ } }
      log(`--force: killed pid(s) ${owners.join(', ')} that were holding :${port}`);
      await sleep(800);
    } else {
      fail(`port ${port} is already held by pid(s) ${owners.join(', ')} — a stale server from an earlier session. Re-run with --force to kill it, or pick --port <n>.`);
    }
  }

  if (!dev && !has('--no-build')) {
    log('building (tsc + vite build)…');
    execSync('npm run build', { cwd: UNIT, stdio: 'inherit', shell: true });
  }

  // Vite is told --host 127.0.0.1 explicitly: left to itself it binds
  // `localhost`, which resolves to ::1 on this Node/Windows combination, and
  // an IPv4 probe then never connects even though Vite says it is "ready".
  const vite = path.join(UNIT, 'node_modules/vite/bin/vite.js');
  const args = [vite, ...(dev ? [] : ['preview']), '--port', String(port), '--strictPort', '--host', '127.0.0.1'];
  const out = fs.openSync(path.join(CACHE, 'server.log'), 'w');
  // `detached` on EVERY platform. On Windows a non-detached child is torn
  // down with its parent's console the moment this command returns — the
  // server logged "running at …" and then silently vanished before `smoke`
  // could connect. detached + windowsHide gives it its own process group.
  const child = spawn(process.execPath, args, {
    cwd: UNIT, detached: true, windowsHide: true, stdio: ['ignore', out, out],
    env: { ...process.env },
  });
  child.unref();
  const base = `http://127.0.0.1:${port}`;
  fs.writeFileSync(PIDFILE, JSON.stringify({ pid: child.pid, base, dev }));

  if (!(await waitUp(base + '/'))) {
    log(fs.readFileSync(path.join(CACHE, 'server.log'), 'utf8').slice(-1500));
    fail(`server did not answer on ${base} — see ${path.join(CACHE, 'server.log')}`);
  }
  log(`${dev ? 'dev' : 'production'} server up: ${base}  (pid ${child.pid}, log ${path.join(CACHE, 'server.log')})`);
};

const stop = async () => {
  if (!fs.existsSync(PIDFILE)) { log('nothing recorded as running'); return; }
  const { pid, base } = JSON.parse(fs.readFileSync(PIDFILE, 'utf8'));
  try {
    if (IS_WIN) execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' });
    else process.kill(-pid, 'SIGTERM');
  } catch { /* already gone */ }
  fs.unlinkSync(PIDFILE);
  log(`stopped ${base} (pid ${pid})`);
};

const baseUrl = () => {
  const b = opt('--base');
  if (b) return b.replace(/\/$/, '');
  if (fs.existsSync(PIDFILE)) return JSON.parse(fs.readFileSync(PIDFILE, 'utf8')).base;
  return 'http://127.0.0.1:8787';
};

/* ── smoke ─────────────────────────────────────────────────────────── */
const smoke = async () => {
  const base = baseUrl();
  let bad = 0;
  const check = (ok, label) => { log(`${ok ? '  ok ' : ' FAIL'}  ${label}`); if (!ok) bad++; };

  log(`smoke against ${base}`);
  for (const [p, want] of [['/', 'text/html'], ['/sitemap.xml', 'xml'], ['/robots.txt', 'text/plain']]) {
    const r = await fetch(base + p).catch(() => null);
    check(r && r.status === 200 && (r.headers.get('content-type') || '').includes(want), `GET ${p} → 200 ${want}`);
  }

  const pw = await playwright();
  const { browser, page, errors } = await openPage(pw);
  await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(5500);   // preloader (~2.9s) + hero intro (~1.8s)

  // The whole site is the awwwards page (components/AwwwardsLanding.tsx):
  // one route, black, own nav/footer, GSAP + Lenis only.
  const order = await page.evaluate(() => [...document.querySelectorAll('.aww main section[id]')].map((s) => s.id));
  check(order.join(',') === 'hero,about,gallery,fullbleed,process,testimonial', `section order = ${order.join(' → ')}`);
  check(await page.evaluate(() => getComputedStyle(document.body).backgroundColor === 'rgb(0, 0, 0)'), 'body is black');
  check(await page.evaluate(() => !document.getElementById('boot-splash') && document.getElementById('preloader').style.display === 'none'), 'boot splash removed, preloader finished');
  check(await page.evaluate(() => {
    const w = document.querySelector('#heroTitle .word');
    return w && Math.abs(new DOMMatrix(getComputedStyle(w).transform).f) < 1;
  }), 'hero words revealed (intro played)');
  check(await page.evaluate(() => document.querySelectorAll('#galleryTrack .g-card').length) === 7, '7 service cards in the gallery');
  check(await page.evaluate(() => document.querySelectorAll('#stack .p-card').length) === 4, '4 process cards');
  check(await page.evaluate(() => !document.querySelector('script[src*="cdn.jsdelivr"], script[src*="unpkg"], script[src*="cdnjs"]')), 'no CDN scripts (GSAP/Lenis bundled)');
  const js = await page.evaluate(() => performance.getEntriesByType('resource').filter((r) => /[.]js([?]|$)/.test(r.name)).map((r) => r.name.split('/').pop()));
  check(js.length <= 4 && js.every((n) => /^(index|react-vendor|gsap-vendor)-/.test(n)), `only app + react + gsap chunks load (${js.join(', ')})`);
  await scrollHero(page, 0.5);
  check(await page.evaluate(() => document.querySelectorAll('.pin-spacer').length) >= 2, 'gallery + process pinned on desktop');

  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(800);
  await page.click('#nav a[href="#process"]'); await page.waitForTimeout(2500);
  check(await page.evaluate(() => Math.abs(document.getElementById('process').getBoundingClientRect().top) < innerHeight), 'nav anchor "Process" scrolls to the section');
  check(await page.evaluate(() => document.querySelector('#fMagnet').getAttribute('href').startsWith('mailto:')), 'footer CTA is a mailto link');
  const r404 = await fetch(base + '/no-such-page').catch(() => null);
  check(r404 && r404.status === 200 && (await r404.text()).includes('id="root"'), 'unknown path falls through to the SPA (vercel.json rewrite)');

  check(errors.length === 0, `no console errors / failed requests` + (errors.length ? '\n        ' + [...new Set(errors)].slice(0, 6).join('\n        ') : ''));
  await browser.close();
  if (bad) fail(`${bad} check(s) failed`);
  log('smoke: all good');
};

/* ── shot ──────────────────────────────────────────────────────────── */
const shot = async () => {
  const out = positional[0];
  if (!out) fail('usage: shot <out.png> [--route /] [--at 0.4] [--mobile]');
  const base = baseUrl();
  let route = opt('--route', '/');
  // Git Bash (MSYS) rewrites a leading-slash argument into a Windows path,
  // so `--route /services` arrives as "C:/Program Files/Git/services". Catch
  // it rather than navigate somewhere silly; the slash-less form is safe.
  if (/^[A-Za-z]:[\/]/.test(route)) fail(`--route was mangled by Git Bash into "${route}". Pass it without the leading slash (--route services) or run with MSYS_NO_PATHCONV=1.`);
  if (!route.startsWith('/')) route = '/' + route;
  const at = Number(opt('--at', '0'));
  const pw = await playwright();
  const { browser, page, errors } = await openPage(pw, { mobile: has('--mobile') });
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });
  // The landing's preloader + hero intro take ~4.7s; other routes settle sooner.
  await page.waitForTimeout(route === '/' ? 5500 : 3000);
  if (at > 0) await scrollHero(page, at);
  await page.screenshot({ path: path.resolve(out) });
  await browser.close();
  log(`wrote ${path.resolve(out)}  (${route} @ ${at}${has('--mobile') ? ', mobile' : ''})` + (errors.length ? `\n  ${errors.length} error(s): ${[...new Set(errors)].slice(0, 3).join(' | ')}` : ''));
};

/* ── hero ──────────────────────────────────────────────────────────── */
const hero = async () => {
  const base = baseUrl();
  const pw = await playwright();
  let bad = 0;
  const check = (ok, label) => { log(`${ok ? '  ok ' : ' FAIL'}  ${label}`); if (!ok) bad++; };

  // Per device class: the intro must finish, the hero title must fit the
  // viewport, nothing may overflow horizontally, and the gallery is pinned
  // (horizontal) on desktop but a vertical list on phones.
  const DEV = [['laptop 1440x900', 1440, 900, false], ['user window 1535x699', 1535, 699, false],
               ['iPhone 13 portrait', 390, 844, true], ['iPad portrait', 744, 1133, true], ['phone landscape', 844, 390, true]];
  log(`landing against ${base}`);
  for (const [name, w, h, mob] of DEV) {
    const browser = await pw.chromium.launch({ executablePath: chromePath(), headless: true });
    const page = await (await browser.newContext(mob
      ? { viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' }
      : { viewport: { width: w, height: h } })).newPage();
    await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(5500);   // preloader (~2.9s) + hero intro (~1.8s)
    const top = await page.evaluate(() => {
      const t = document.getElementById('heroTitle').getBoundingClientRect();
      const w = document.querySelector('#heroTitle .word');
      return { introDone: document.getElementById('preloader').style.display === 'none' && Math.abs(new DOMMatrix(getComputedStyle(w).transform).f) < 1,
               titleFits: t.left >= -1 && t.right <= innerWidth + 1 && t.bottom <= innerHeight + 1 };
    });
    await scrollHero(page, 0.45);
    const r = await page.evaluate(() => ({
      pins: document.querySelectorAll('.pin-spacer').length,
      galleryPinned: !!document.querySelector('#gallery')?.closest('.pin-spacer'),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      screens: +(document.documentElement.scrollHeight / innerHeight).toFixed(1),
    }));
    await browser.close();
    const desktop = w >= 769;
    const ok = top.introDone && top.titleFits && !r.overflow && (desktop ? r.galleryPinned && r.pins >= 5 : !r.galleryPinned);
    check(ok, `${name.padEnd(22)} intro ${top.introDone ? 'done' : 'STUCK'}, title ${top.titleFits ? 'fits' : 'CLIPPED'}, ${desktop ? `gallery ${r.galleryPinned ? 'pinned' : 'NOT pinned'}, ${r.pins} pins` : `gallery ${r.galleryPinned ? 'PINNED (should be vertical)' : 'vertical'}`}, ${r.screens} screens${r.overflow ? '  H-OVERFLOW' : ''}`);
  }
  if (bad) fail(`${bad} landing check(s) failed`);
  log('hero: all good');
};

/* ── dispatch ──────────────────────────────────────────────────────── */
const commands = { serve, stop, smoke, shot, hero };
if (!commands[cmd]) {
  log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 12).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(cmd ? 1 : 0);
}
await commands[cmd]();
