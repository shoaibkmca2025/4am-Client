/* 4AM Global Media — site script (plain JavaScript, no libraries).

   Every page: mobile menu, reveal-on-scroll, current year.
   Landing (body.home): the scene engine — one rAF loop that reads scrollY
   and drives the header clock (04:00 → 06:12), the WebGL Earth, the pinned
   Services / Method / Work scenes and the 3D project coverflow — plus the
   contact form, which hands the brief to the visitor's email app or
   WhatsApp (there is no server).
   Service pages (body.sp): a gentle 3D tilt on the hero photo. */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);
const RMQ = matchMedia('(prefers-reduced-motion: reduce)');
let rm = RMQ.matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

const EMAIL = 'Info@4amglobalmedia.com';
const WHATSAPP = '918826406545';

/* ---------- every page ---------- */
$$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

const menuBtn = $('.menu-btn'), nav = $('#nav');
if (menuBtn && nav) {
  const setMenu = (open) => { nav.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.textContent = open ? 'Close' : 'Menu'; };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });
}

const skip = $('.skip');
if (skip) skip.addEventListener('click', () => setTimeout(() => { const m = $('#main'); if (m) m.focus({ preventScroll: true }); }, 0));

/* reveal on first sight (only what starts below the fold) */
if (!rm && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  // After the first frame, so this read never forces a layout of its own.
  requestAnimationFrame(() => $$('.rv').forEach((el) => {
    // Read the section's box, not the element's: off-screen sections skip
    // layout (content-visibility), and measuring inside one forces it.
    const sec = el.closest('.scene, .sp-sec') || el;
    if (sec.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); io.observe(el); }
  }));
}

/* gentle 3D tilt toward the pointer */
const tilt = (card, kx, ky) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--ty', (((e.clientX - r.left) / r.width - .5) * ky).toFixed(2) + 'deg');
    card.style.setProperty('--tx', (-((e.clientY - r.top) / r.height - .5) * kx).toFixed(2) + 'deg');
  });
  card.addEventListener('pointerleave', () => { card.style.removeProperty('--tx'); card.style.removeProperty('--ty'); });
};
if (fine && !rm) $$('.person').forEach((c) => tilt(c, 6, 8));
if (fine && !rm) $$('.sp-photo .frame').forEach((c) => tilt(c, 8, 12));

/* copy buttons */
$$('[data-copy]').forEach((btn) => {
  const label = btn.getAttribute('aria-label') || '';
  btn.addEventListener('click', async () => {
    let ok = true;
    try { await navigator.clipboard.writeText(btn.dataset.copy); } catch { ok = false; }
    btn.textContent = ok ? 'Copied' : 'Copy failed';
    btn.setAttribute('aria-label', ok ? label.replace(/^Copy (.*)$/, (m, what) => what[0].toUpperCase() + what.slice(1) + ' copied') : label);
    setTimeout(() => { btn.textContent = 'Copy'; btn.setAttribute('aria-label', label); }, 1600);
  });
});

/* ---------- contact form ---------- */
const form = $('form.brief');
if (form) {
  const indian = (() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return true;
      return (navigator.languages || [navigator.language]).some((l) => /-IN$/i.test(l || ''));
    } catch { return false; }
  })();
  if (indian) {
    const sel = $('#f-budget', form);
    ['Under ₹40,000', '₹40,000 – ₹1,25,000', '₹1,25,000 – ₹4,00,000', '₹4,00,000 – ₹12,00,000', '₹12,00,000+'].forEach((t, i) => { sel.options[i + 1].text = t; sel.options[i + 1].value = t; });
  }
  const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const ORDER = ['name', 'email', 'phone', 'service', 'budget', 'message'];
  const val = (k) => ($('#f-' + k, form).value || '').trim();
  const validate = () => {
    const e = {};
    if (val('name').length < 2) e.name = 'Enter your name.';
    if (!EMAIL_RE.test(val('email'))) e.email = 'Enter a work email like name@company.com.';
    if (val('phone')) { const d = val('phone').replace(/\D/g, ''); if (d.length < 7 || d.length > 15) e.phone = 'Enter a valid phone number, or leave it blank.'; }
    if (!val('service')) e.service = 'Choose the service you need.';
    if (!val('budget')) e.budget = 'Choose a budget range.';
    if (val('message').length < 10) e.message = 'Tell us a little about the project (at least 10 characters).';
    return e;
  };
  let tried = false;
  const show = (errs) => {
    ORDER.forEach((k) => {
      const input = $('#f-' + k, form), msg = $('#e-' + k, form);
      input.closest('.field').classList.toggle('bad', !!errs[k]);
      msg.textContent = errs[k] || '';
      if (errs[k]) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', 'e-' + k); }
      else { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
    });
  };
  // after a failed attempt, clear each error as soon as it is fixed
  form.addEventListener('input', () => { if (tried) show(validate()); });
  form.addEventListener('change', () => { if (tried) show(validate()); });
  const status = $('.status', form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    tried = true;
    const errs = validate();
    show(errs);
    const first = ORDER.find((k) => errs[k]);
    if (first) { $('#f-' + first, form).focus(); status.hidden = true; return; }
    const body = [
      `Name: ${val('name')}`, `Email: ${val('email')}`,
      val('phone') ? `Phone: ${val('phone')}` : null, val('company') ? `Company: ${val('company')}` : null,
      `Service: ${val('service')}`, `Budget: ${val('budget')}`, '', val('message'),
    ].filter((l) => l !== null).join('\n');
    const subject = `Project brief: ${val('service')} — ${val('company') || val('name')}`;
    const viaWhatsApp = e.submitter && e.submitter.value === 'whatsapp';
    const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(subject + '\n\n' + body)}`;
    const mail = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (viaWhatsApp) window.open(wa, '_blank', 'noopener');
    else location.href = mail;
    const first2 = val('name').split(/\s+/)[0];
    status.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = viaWhatsApp ? `Thanks, ${first2}. WhatsApp opened with your brief.` : `Thanks, ${first2}. Your email app opened with the brief ready to send.`;
    const rest = document.createElement('span');
    rest.append(' Press send there and we reply within 24 hours. Nothing opened? ');
    const alt = document.createElement('a');
    alt.href = viaWhatsApp ? mail : wa;
    alt.textContent = viaWhatsApp ? `Email ${EMAIL}` : 'Send it on WhatsApp';
    if (!viaWhatsApp) { alt.target = '_blank'; alt.rel = 'noopener'; }
    rest.append(alt, '.');
    status.append(b, rest);
    status.hidden = false;
  });
}

/* ══════════ landing: the scene engine ══════════ */
if (document.body.classList.contains('home')) {
  /* lon/lat: point of the Earth facing the camera (deg) · x,y: globe centre in screen units (-1..1)
     s: globe radius as a share of half the screen height · dawn: longitude of the sunrise line
     arcs/sats/india/mk: layer visibility · dim: globe strength · rise: sunrise glow · m: minutes after 04:00 */
  const K = {
    hero:     { m: 0,   lon: 100, lat: 14, x: .42,  y: 0,     s: .80, dawn: 145, arcs: 0, sats: 0, india: 0,  mk: 0, dim: 1,   rise: 0 },
    why:      { m: 10,  lon: 120, lat: 20, x: -.44, y: 0,     s: .72, dawn: 132, arcs: 0, sats: 0, india: 0,  mk: 0, dim: .95, rise: 0 },
    services: { m: 20,  lon: 138, lat: 8,  x: -.46, y: -.02,  s: .52, dawn: 122, arcs: 0, sats: 1, india: 0,  mk: 0, dim: .95, rise: 0 },
    software: { m: 35,  lon: 150, lat: 12, x: .62,  y: -.62,  s: .34, dawn: 110, arcs: 0, sats: 0, india: 0,  mk: 0, dim: .8,  rise: 0 },
    reach:    { m: 50,  lon: 10,  lat: 40, x: .34,  y: -.08,  s: .78, dawn: 98,  arcs: 1, sats: 0, india: 0,  mk: 0, dim: 1,   rise: 0 },
    market:   { m: 65,  lon: 80,  lat: 21, x: .56,  y: 0,     s: .98, dawn: 83,  arcs: 0, sats: 0, india: 1,  mk: 1, dim: 1,   rise: .1 },
    method:   { m: 80,  lon: 72,  lat: 20, x: .84,  y: .70,   s: .15, dawn: 70,  arcs: 0, sats: 0, india: .4, mk: 0, dim: .9,  rise: .2 },
    work:     { m: 100, lon: 78,  lat: 55, x: 0,    y: -1.5,  s: 1.22, dawn: 50, arcs: 0, sats: 0, india: 0,  mk: 0, dim: 1,   rise: 1 },
    team:     { m: 115, lon: 78,  lat: 52, x: 0,    y: -1.58, s: 1.22, dawn: 40, arcs: 0, sats: 0, india: 0,  mk: 0, dim: .9,  rise: 1 },
    contact:  { m: 132, lon: 78,  lat: 50, x: 0,    y: -1.62, s: 1.22, dawn: 22, arcs: 0, sats: 0, india: 0,  mk: 0, dim: .95, rise: .7 },
  };
  /* portrait screens: copy fills the screen, so the planet stays clear of it —
     large above the hero copy, then a small planet in the top corner, then
     the sunrise horizon under the cards at the end */
  const P = {
    hero: { x: .28, y: .64, s: .44, dim: 1 }, why: { x: .62, y: .72, s: .2, dim: 1 }, services: { x: .62, y: .72, s: .2, dim: 1 },
    software: { x: .62, y: .72, s: .18, dim: 1 }, reach: { x: .56, y: .7, s: .24, dim: 1 }, market: { x: .56, y: .7, s: .26, dim: 1 },
    method: { x: .6, y: .74, s: .15, dim: 1 }, work: { x: 0, y: -1.25, s: .95, dim: .6 }, team: { x: 0, y: -1.2, s: .95, dim: .6 },
    contact: { x: 0, y: -1.32, s: .95, dim: .6 },
  };
  const KEYS = ['lon', 'lat', 'x', 'y', 's', 'dawn', 'arcs', 'sats', 'india', 'mk', 'dim', 'rise'];
  const root = document.documentElement;
  const scrollToY = (top, instant) => window.scrollTo({ top, behavior: instant ? 'auto' : 'smooth' });

  const scenes = $$('[data-scene]');
  let marks = [], vh = innerHeight, vw = innerWidth, portrait = false, pinOn = false;
  function layout() {
    vh = innerHeight; vw = innerWidth;
    portrait = vw / vh < .85;
    pinOn = !rm && vw >= 900 && vh >= 560;
    root.classList.toggle('pin', pinOn);
    marks = scenes.map((el) => {
      const r = el.getBoundingClientRect(), top = r.top + scrollY, h = el.offsetHeight;
      const a = top - .18 * vh, b = Math.max(a, top + h - .82 * vh);
      const name = el.dataset.scene;
      return { el, top, h, a, b, k: Object.assign({}, K[name], portrait ? P[name] : null), label: el.dataset.label || '' };
    });
  }
  const mark = (id) => marks.find((x) => x.el.id === id);

  function sceneState(y) {
    if (y <= marks[0].b) return { k: marks[0].k, i: 0 };
    for (let i = 0; i < marks.length - 1; i++) {
      const A = marks[i], B = marks[i + 1];
      if (y <= A.b) return { k: A.k, i };
      if (y < B.a) {
        const t = smooth(clamp((y - A.b) / (B.a - A.b), 0, 1)), k = { m: 0 };
        for (const n of KEYS) k[n] = A.k[n] + (B.k[n] - A.k[n]) * t;
        return { k, i: t < .5 ? i : i + 1 };
      }
    }
    return { k: marks[marks.length - 1].k, i: marks.length - 1 };
  }
  function clockMinutes(y) {
    const c = y + vh * .5;
    if (c <= marks[0].top + vh * .5) return 0;
    for (let i = 0; i < marks.length - 1; i++) {
      const A = marks[i], B = marks[i + 1];
      if (c < B.top) return A.k.m + (B.k.m - A.k.m) * clamp((c - A.top) / (B.top - A.top), 0, 1);
    }
    return K.contact.m;
  }
  /* Off-screen scenes skip layout (content-visibility: auto). Reading the
     geometry of anything INSIDE a skipped scene forces the browser to lay it
     out after all, so every per-frame read first checks the scene's own box. */
  const near = (sec, margin = .25) => { const r = sec.getBoundingClientRect(); return r.bottom > -vh * margin && r.top < vh * (1 + margin); };

  /* header: clock, nav highlight, dawn progress */
  const topEl = $('.top'), clockT = $('.clock .t'), clockL = $('.clock .lbl'), sunDot = $('.clock .sun');
  const navLinks = $$('.nav a');
  let lastClock = '', lastScene = -1, lastP = -1;
  function updateHeader(y) {
    const docH = root.scrollHeight;
    const end = y + vh >= docH - 4;
    const m = end ? K.contact.m : Math.round(clockMinutes(y));
    const txt = String(4 + Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
    if (txt !== lastClock) { clockT.textContent = txt; lastClock = txt; sunDot.classList.toggle('up', m >= 95); }
    const p = Math.round(clamp(y / Math.max(1, docH - vh), 0, 1) * 1000) / 1000;
    if (p !== lastP) { topEl.style.setProperty('--dawn-p', String(p)); lastP = p; }
    const st = sceneState(y);
    if (st.i !== lastScene) {
      lastScene = st.i; clockL.textContent = marks[st.i].label;
      const id = marks[st.i].el.id;
      navLinks.forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === '#' + id ? 'true' : 'false'));
    }
    return st;
  }

  /* services: the active satellite */
  const svcs = $$('.svc'), svcN = $('#svc-n'), svcSec = $('#services');
  let hoverSvc = -1, activeSvc = 0;
  svcs.forEach((li, i) => {
    li.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hoverSvc = i; });
    li.addEventListener('pointerleave', () => { hoverSvc = -1; });
    li.addEventListener('focusin', () => { hoverSvc = i; });
    li.addEventListener('focusout', () => { hoverSvc = -1; });
  });
  function updateServices(y) {
    const m = mark('services');
    let idx;
    if (pinOn) { const p = clamp((y - m.top) / (m.h - vh), 0, .9999); idx = Math.floor(p * svcs.length); }
    else {
      if (hoverSvc < 0 && !near(svcSec, 0)) return;
      let best = 1e9; idx = 0;
      svcs.forEach((li, i) => { const r = li.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - vh * .55); if (d < best) { best = d; idx = i; } });
    }
    if (hoverSvc >= 0) idx = hoverSvc;
    if (idx !== activeSvc) { svcs[activeSvc].classList.remove('on'); svcs[idx].classList.add('on'); activeSvc = idx; svcN.textContent = String(idx + 1); }
  }

  /* software rig */
  const rig = $('#rig'), stage = $('#stage'), softSec = $('#software');
  let tiltX = 0, tiltY = 0;
  if (matchMedia('(pointer:fine)').matches) {
    stage.parentElement.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      tiltY = clamp((e.clientX - r.left) / r.width - .5, -.5, .5) * 12;
      tiltX = -clamp((e.clientY - r.top) / r.height - .5, -.5, .5) * 8;
    });
    stage.parentElement.addEventListener('pointerleave', () => { tiltX = tiltY = 0; });
  }
  function updateRig() {
    if (rm) { rig.style.setProperty('--ry', '-12deg'); rig.style.setProperty('--rx', '5deg'); return; }
    if (!near(softSec)) return;
    const r = stage.getBoundingClientRect();
    const p = clamp(1 - (r.top + r.height / 2) / vh, 0, 1);
    rig.style.setProperty('--ry', (-26 + p * 30 + tiltY).toFixed(2) + 'deg');
    rig.style.setProperty('--rx', (8 - p * 6 + tiltX).toFixed(2) + 'deg');
  }

  /* method track */
  const track = $('#track'), hz = $('#hz');
  function updateMethod(y) {
    const m = mark('method');
    if (!pinOn) { if (track.style.transform) track.style.transform = ''; return; }
    if (y < m.top - vh || y > m.top + m.h) return;
    const p = clamp(((y - m.top) / (m.h - vh) - .08) / .84, 0, 1);
    const max = Math.max(0, track.scrollWidth - vw);
    track.style.transform = `translate3d(${(-max * smooth(p)).toFixed(1)}px,0,0)`;
    hz.style.transform = `scaleX(${p.toFixed(4)})`;
  }

  /* work coverflow */
  const flow = $('#flow'), cards = $$('#flow .card');
  let flowF = 0;
  function updateWork(y) {
    const m = mark('work');
    if (!pinOn) { if (cards[0].style.transform) cards.forEach((c) => { c.style.transform = ''; c.style.opacity = ''; c.style.zIndex = ''; c.style.pointerEvents = ''; }); return; }
    if (y < m.top - vh || y > m.top + m.h && Math.abs(flowF - (cards.length - 1)) < .001) return;
    const p = clamp((y - m.top) / (m.h - vh), 0, 1);
    const target = p * (cards.length - 1);
    flowF += (target - flowF) * .2;
    if (Math.abs(target - flowF) < .001) flowF = target;
    const gap = Math.min(300, vw * .2);
    cards.forEach((c, i) => {
      const o = i - flowF, ao = Math.abs(o), s = clamp(o, -1, 1);
      c.style.transform = `translate3d(${(o * gap * (ao > 1 ? .78 + .22 / ao : 1)).toFixed(1)}px,0,${(-ao * 160).toFixed(1)}px) rotateY(${(-s * 38).toFixed(2)}deg)`;
      c.style.opacity = clamp(1 - (ao - 1) * .55, 0, 1).toFixed(3);
      c.style.zIndex = String(100 - Math.round(ao * 10));
      c.style.pointerEvents = ao < .5 ? 'auto' : 'none';
    });
  }
  function stepWork(dir) {
    const m = mark('work');
    if (pinOn) {
      const cur = Math.round(clamp((scrollY - m.top) / (m.h - vh), 0, 1) * (cards.length - 1));
      const n = clamp(cur + dir, 0, cards.length - 1);
      scrollToY(m.top + (n / (cards.length - 1)) * (m.h - vh) + 1, rm);
    } else flow.scrollBy({ left: dir * (cards[0].offsetWidth + 16), behavior: rm ? 'auto' : 'smooth' });
  }
  $('#prev').addEventListener('click', () => stepWork(-1));
  $('#next').addEventListener('click', () => stepWork(1));

  /* "Browse all" opens the full index */
  const allWork = $('#all-work details');
  $$('a[href="#all-work"]').forEach((a) => a.addEventListener('click', () => { allWork.open = true; }));
  if (location.hash === '#all-work') allWork.open = true;

  /* WebGL Earth — loaded and started once the browser is idle */
  const canvas = $('#globe'), sky = $('#sky');
  let globe = null;
  const cur = Object.assign({}, K.hero);
  let spin = Math.PI / 2, alive = true;
  const startGL = () => {
    import('./globe.js').then(({ createGlobe }) => {
      if (!alive) return;
      try {
        // the canvas fades in on the first frame actually drawn (shaders may still be compiling)
        globe = createGlobe(canvas, () => { globe = null; canvas.classList.remove('on'); }, () => canvas.classList.add('on'));
      } catch (e) { console.warn(e); }
    }).catch(() => {});
  };
  if (window.requestIdleCallback) requestIdleCallback(startGL, { timeout: 900 }); else setTimeout(startGL, 200);

  /* main loop */
  let last = performance.now(), clockTime = 0, running = false, skipF = false;
  const lowFps = (navigator.hardwareConcurrency || 8) <= 4;
  function frame(now) {
    running = true;
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    if (!rm) clockTime += dt;
    const y = scrollY;
    const st = updateHeader(y);
    updateServices(y); updateMethod(y); updateWork(y); updateRig();
    if (globe && !(lowFps && (skipF = !skipF))) {
      let tgt = st.k;
      if (rm) tgt = Object.assign({}, tgt, { lon: 92, lat: 16, x: portrait ? 0 : .5, y: portrait ? .45 : 0, s: portrait ? .42 : .7 });
      const f = rm ? 1 : 1 - Math.exp(-dt * 5.5);
      for (const n of KEYS) cur[n] += (tgt[n] - cur[n]) * f;
      const drift = rm ? 0 : Math.sin(clockTime * .12) * 3;
      const spinT = Math.PI / 2 - activeSvc / svcs.length * Math.PI * 2;
      let ds = spinT - spin; ds = Math.atan2(Math.sin(ds), Math.cos(ds));
      spin += ds * (rm ? 1 : 1 - Math.exp(-dt * 4));
      sky.style.opacity = (cur.rise * .9).toFixed(3);
      globe.draw(Object.assign({}, cur, { lon: cur.lon + drift }), clockTime, { activeSvc, spin, motion: rm ? 0 : 1 });
    }
    if (!document.hidden) requestAnimationFrame(frame); else running = false;
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !running && alive) { last = performance.now(); requestAnimationFrame(frame); } });

  let rz = 0;
  const onResize = () => { clearTimeout(rz); rz = setTimeout(() => { layout(); if (globe) globe.resize(); }, 120); };
  addEventListener('resize', onResize);
  RMQ.addEventListener && RMQ.addEventListener('change', (e) => { rm = e.matches; layout(); });
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(document.body);

  // Measure inside the first frame, where the browser lays out anyway.
  requestAnimationFrame((t) => { layout(); frame(t); });
}
