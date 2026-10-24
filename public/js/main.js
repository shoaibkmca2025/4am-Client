/* 4AM Global Media — site script (plain JavaScript, no libraries).

   Every page: menu, reveal-on-scroll (sketches draw themselves), counters,
   3D tilt on cards, copy buttons, and the contact form, which hands the
   brief to the visitor's email app or WhatsApp (there is no server).

   Home (body.home): the film engine. A fixed canvas scrubs a pre-rendered
   3D film of an interface plant growing, from the top of the page to the
   first solid section. Frames stream in coarse-to-fine; only the few
   frames around the playhead are kept decoded, so memory stays small. */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);
const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;
if (!rm && 'IntersectionObserver' in window) root.classList.add('anim');

const EMAIL = 'Info@4amglobalmedia.com';
const WHATSAPP = '918826406545';

/* heavy, non-essential media (hero video, film frames) waits for the page to
   load AND paint its first content, so it never competes with the copy */
const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
const afterPaint = new Promise((res) => {
  const loaded = new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })));
  const painted = new Promise((r) => {
    if (performance.getEntriesByName('first-contentful-paint').length) return r();
    try { new PerformanceObserver((list, obs) => { if (list.getEntries().some((e) => e.name === 'first-contentful-paint')) { obs.disconnect(); r(); } }).observe({ type: 'paint', buffered: true }); } catch { r(); }
    setTimeout(r, 4000);  // never wait forever
  });
  Promise.all([loaded, painted]).then(res);
});

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

/* counters: count up once when they come into view */
const count = (el) => {
  const to = +el.dataset.count, t0 = performance.now();
  const step = (now) => { const p = clamp((now - t0) / 1600, 0, 1); el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
};

/* reveal on first sight: .rv fades up; sketches inside draw themselves */
if (root.classList.contains('anim')) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('on');
    $$('[data-count]', e.target).forEach(count);
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -12% 0px' });
  // after the first frame; all positions are read before anything is written,
  // and only inside sections that are on screen: reading geometry inside an
  // off-screen content-visibility section forces the browser to lay it out
  requestAnimationFrame(() => {
    const els = $$('.rv, .sk.draw:not(.rv .sk)'), vh = innerHeight;
    const shows = (r) => r.top < vh && r.bottom > 0;
    const inView = els.map((el) => { const sec = el.closest('.solid > .sec'); return (!sec || shows(sec.getBoundingClientRect())) && shows(el.getBoundingClientRect()); });
    els.forEach((el, k) => {
      if (inView[k]) { el.classList.add('on'); return; }  // already in view
      $$('[data-count]', el).forEach((c) => { c.textContent = '0'; });
      io.observe(el);
    });
  });
}

/* gentle 3D tilt toward the pointer (founder cards, service-page photos;
   cards inside moving rows stay still) */
if (fine && !rm) {
  const tilt = (card, k) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ty', ((x - .5) * k).toFixed(2) + 'deg');
      card.style.setProperty('--tx', ((.5 - y) * k * .7).toFixed(2) + 'deg');
    });
    card.addEventListener('pointerleave', () => ['--ty', '--tx'].forEach((p) => card.style.removeProperty(p)));
  };
  $$('.person').forEach((c) => tilt(c, 6));
  $$('.sp-photo .frame').forEach((c) => tilt(c, 12));
}

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

/* ---------- card rows that drift right-to-left (services, work) ----------
   A seamless loop: each row's cards are cloned once and the row wraps at half
   its width. It drifts at a calm speed; hover, keyboard focus, the Pause
   button or leaving the screen ease it to a stop (never a hard stop). Drag or
   swipe to take over: the row follows the finger 1:1, keeps the flick's
   velocity on release, then eases back into its drift. The page scroll is
   never touched. Reduced motion (no html.loops): a plain swipeable row. */
const loops = $$('.loop');
if (loops.length && !rm) {
  root.classList.add('loops');
  loops.forEach((loop) => {
    const track = $('.loop-track', loop);
    const btn = document.querySelector(`.loop-btn[aria-controls="${loop.id}"]`);
    const SPEED = matchMedia('(max-width: 639px)').matches ? 26 : 34;  // px per second
    let built = false, half = 0, x = 0, v = 0, hover = false, focus = false, paused = false, seen = false, drag = false, last = 0, raf = 0, moved = false;
    const build = () => $$(':scope > li', track).forEach((li) => {
      const c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true'); c.setAttribute('inert', '');
      $$('[id]', c).forEach((el) => el.removeAttribute('id'));
      track.appendChild(c);
    });
    const measure = () => { half = track.scrollWidth / 2; };
    const wrap = () => { if (half) x = -((((-x) % half) + half) % half); };
    const render = () => { if (!focus) wrap(); track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`; };
    const resting = () => hover || focus || paused || !seen;
    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now;
      if (!drag) {
        const target = resting() ? 0 : -SPEED;
        v += (target - v) * (1 - Math.exp(-dt * 3.2));   // ease toward the drift (or a stop)
        if (Math.abs(v - target) < .05) v = target;
        x += v * dt;
      }
      render();
      if (drag || v !== 0 || !resting()) raf = requestAnimationFrame(tick); else last = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen && !built) { built = true; build(); measure(); } kick(); }).observe(loop);
    let rz = 0;
    addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (built) { measure(); render(); } }, 150); });

    loop.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hover = true; kick(); } });
    loop.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { hover = false; kick(); } });
    // keyboard: stop, and slide the focused card fully into view
    loop.addEventListener('focusin', (e) => {
      focus = true; v = 0;
      const li = e.target.closest('li');
      if (li) {
        const lr = loop.getBoundingClientRect(), r = li.getBoundingClientRect(), pad = 32;
        if (r.left < lr.left + pad) x += lr.left + pad - r.left;
        else if (r.right > lr.right - pad) x -= r.right - (lr.right - pad);
        render();
      }
      kick();
    });
    loop.addEventListener('focusout', (e) => { if (!loop.contains(e.relatedTarget)) { focus = false; kick(); } });

    // drag / swipe: follows 1:1 after an 8px threshold; vertical moves stay with the page
    loop.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || drag) return;
      const sx = e.clientX, sy = e.clientY, hist = [];
      let active = false, base = 0;
      moved = false;
      const move = (ev) => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!active) {
          if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
          if (Math.abs(dy) > Math.abs(dx)) { end(); return; }
          active = true; moved = true; drag = true; base = x - dx; v = 0;
          loop.classList.add('dragging');
          try { loop.setPointerCapture(ev.pointerId); } catch {}
          kick();
        }
        x = base + dx; const before = x; wrap(); base += x - before;
        hist.push([ev.timeStamp, ev.clientX]); if (hist.length > 5) hist.shift();
      };
      const end = () => {
        loop.removeEventListener('pointermove', move); loop.removeEventListener('pointerup', end); loop.removeEventListener('pointercancel', end);
        if (!active) return;
        const [t0, p0] = hist[0] || [0, 0], [t1, p1] = hist[hist.length - 1] || [0, 0];
        v = t1 > t0 ? clamp((p1 - p0) / ((t1 - t0) / 1000), -3000, 3000) : 0;  // hand the flick's velocity on
        drag = false; loop.classList.remove('dragging'); kick();
      };
      loop.addEventListener('pointermove', move); loop.addEventListener('pointerup', end); loop.addEventListener('pointercancel', end);
    });
    loop.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    loop.addEventListener('dragstart', (e) => e.preventDefault());

    if (btn) btn.addEventListener('click', () => { paused = !paused; btn.setAttribute('aria-pressed', String(paused)); btn.textContent = paused ? 'Play' : 'Pause'; kick(); });
  });
}

/* ---------- home hero: the night video, and the header's hero look ---------- */
const hero = $('#hero');
if (hero) {
  const setHero = () => root.classList.toggle('at-hero', hero.getBoundingClientRect().bottom > 76);
  let hq = false;
  addEventListener('scroll', () => { if (!hq) { hq = true; requestAnimationFrame(() => { hq = false; setHero(); }); } }, { passive: true });
  requestAnimationFrame(setHero);
  const vid = $('video', hero), vbtn = $('.vpause', hero);
  const conn = navigator.connection;
  const tall = matchMedia('(max-aspect-ratio: 4/5)').matches;  // same split as the <picture> still
  vid.addEventListener('playing', () => vid.classList.add('on'), { once: true });
  if (conn && conn.saveData) vbtn.hidden = true;   // data saver: the still poster only
  else {
    let wantPlay = !rm, visible = true;
    const sync = () => {
      if (wantPlay && visible) { if (!vid.src) vid.src = tall ? vid.dataset.tall : vid.dataset.wide; vid.play().catch(() => {}); }
      else vid.pause();
      vbtn.setAttribute('aria-pressed', String(!wantPlay));
      vbtn.setAttribute('aria-label', wantPlay ? 'Pause background video' : 'Play background video');
    };
    vbtn.addEventListener('click', () => { wantPlay = !wantPlay; sync(); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (vid.src) sync(); }).observe(hero);
    if (wantPlay) afterPaint.then(() => idle(sync, { timeout: 1500 })); else sync();
  }
}

/* "Browse all" opens the full project index */
const allWork = $('#all-work details');
if (allWork) {
  $$('a[href="#all-work"]').forEach((a) => a.addEventListener('click', () => { allWork.open = true; }));
  if (location.hash === '#all-work') allWork.open = true;
}

/* ---------- contact form (no server: hands off to email or WhatsApp) ---------- */
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
    if (!EMAIL_RE.test(val('email'))) e.email = 'Enter an email like name@company.com.';
    if (val('phone')) { const d = val('phone').replace(/\D/g, ''); if (d.length < 7 || d.length > 15) e.phone = 'Enter a valid phone number, or leave it blank.'; }
    if (!val('service')) e.service = 'Choose the service you need.';
    if (!val('budget')) e.budget = 'Choose a budget range.';
    if (val('message').length < 10) e.message = 'Tell us a little about the project (at least 10 characters).';
    return e;
  };
  let tried = false;
  const show = (errs) => ORDER.forEach((k) => {
    const input = $('#f-' + k, form), msg = $('#e-' + k, form);
    input.closest('.field').classList.toggle('bad', !!errs[k]);
    msg.textContent = errs[k] || '';
    if (errs[k]) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', 'e-' + k); }
    else { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
  });
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
    if (viaWhatsApp) window.open(wa, '_blank', 'noopener'); else location.href = mail;
    status.innerHTML = '';
    const b = document.createElement('b');
    const first2 = val('name').split(/\s+/)[0];
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

/* ══════════ home: the film ══════════ */
const stage = $('.stage');
if (stage) {
  const canvas = $('#film'), solid = $('.solid');
  const beats = $$('.beat');
  // source frames 125…287 of the original film: before 125 the clip carries its
  // own baked-in title, which used to force a heavy (blurry) zoom to hide
  const FIRST = 125, LAST = 287;

  /* story beats: words rise when a beat is a third on screen, and the rest of
     its card (text, buttons) arrives with them, so the card never shows a gap */
  if (root.classList.contains('anim')) {
    const bio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); $$('.rv', e.target).forEach((el) => el.classList.add('on'));
      bio.unobserve(e.target);
    }), { threshold: .3 });
    beats.forEach((b) => bio.observe(b));
  } else beats.forEach((b) => b.classList.add('in'));

  /* nav: highlight the section in view; over the hero and the film nothing is
     current (it used to keep the last section lit after scrolling back up) */
  const links = $$('.nav a');
  const navIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false'));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['services', 'work', 'process', 'team', 'contact'].forEach((id) => { const s = document.getElementById(id); if (s) navIO.observe(s); });
  [hero, ...beats].forEach((s) => s && navIO.observe(s));

  const conn = navigator.connection;
  const still = rm || (conn && conn.saveData) || !canvas.getContext;
  if (!still) {
    // Phones in portrait only ever see a narrow slice of the 16:9 film, so they
    // get that slice at full source height (sharp, and a third of the bytes).
    // (matchMedia, not innerWidth: that read forced an 85 ms layout at start-up)
    const mobile = matchMedia('(max-width: 639px) and (max-aspect-ratio: 4/5)').matches;
    const set = mobile ? { dir: 'm', step: 2, x0: 896 / 2560, w: 1178 / 2560 } : { dir: 'd', step: 2, x0: 0, w: 1 };
    const frames = []; for (let f = FIRST; f <= LAST; f += set.step) frames.push(f);
    const N = frames.length;
    const url = (i) => `/assets/film/${set.dir}/${String(frames[i]).padStart(3, '0')}.webp`;
    const ctx = canvas.getContext('2d', { alpha: false });

    /* loading: coarse to fine (every 16th frame first, then 8th …), 6 at a time */
    const blobs = new Array(N), order = [], seen = new Set();
    for (const stride of [16, 8, 4, 2, 1]) for (let i = 0; i < N; i += stride) if (!seen.has(i)) { seen.add(i); order.push(i); }
    if (!seen.has(N - 1)) order.push(N - 1);
    let next = 0, alive = true, started = false;
    const pump = () => {
      if (!alive || next >= order.length) return;
      const i = order[next++];
      fetch(url(i), { priority: 'low' }).then((r) => (r.ok ? r.blob() : null)).then((b) => { if (b) { blobs[i] = b; if (Math.abs(i - playhead) < 4) dirty = true; } }).catch(() => {}).finally(pump);
    };
    // The poster covers the first screen, so the film can wait: start streaming
    // once the page has loaded and gone idle, or as soon as the visitor scrolls.
    const start = () => { if (started) return; started = true; for (let k = 0; k < 6; k++) pump(); };
    addEventListener('scroll', start, { once: true, passive: true });
    afterPaint.then(() => idle(start, { timeout: 3000 }));

    /* decoding: keep only the frames around the playhead as bitmaps */
    const KEEP = 6;  // full-resolution bitmaps are 7–15 MB each decoded
    const bitmaps = new Map(), decoding = new Set();
    const canBitmap = typeof createImageBitmap === 'function';
    const want = (i) => {
      if (i < 0 || i >= N || !blobs[i] || bitmaps.has(i) || decoding.has(i)) return;
      decoding.add(i);
      const done = (bm) => { decoding.delete(i); if (!bm) return; bitmaps.set(i, bm); dirty = true; evict(); };
      if (canBitmap) createImageBitmap(blobs[i]).then(done, () => decoding.delete(i));
      else { const img = new Image(); img.src = URL.createObjectURL(blobs[i]); img.decode().then(() => done(img), () => decoding.delete(i)); }
    };
    let playhead = 0;
    const evict = () => {
      if (bitmaps.size <= KEEP) return;
      const far = [...bitmaps.keys()].sort((a, b) => Math.abs(b - playhead) - Math.abs(a - playhead));
      for (const i of far.slice(0, bitmaps.size - KEEP)) { const bm = bitmaps.get(i); if (bm.close) bm.close(); bitmaps.delete(i); }
    };
    const nearest = (i) => { for (let d = 0; d < N; d++) { if (bitmaps.has(i - d)) return i - d; if (bitmaps.has(i + d)) return i + d; } return -1; };

    /* camera: [frame, zoom, focusX, focusY] — kept near 1:1 so the soft source is
       shown at or below its own size (sharpest), with the plant right of the
       story cards, which sit on the left */
    const CAM = [[FIRST, 1.1, .62, .5], [200, 1.03, .6, .5], [LAST, 1.1, .62, .45]];
    const camera = (p) => {
      for (let k = 0; k < CAM.length - 1; k++) {
        const A = CAM[k], B = CAM[k + 1];
        if (p <= B[0]) { const t = smooth(clamp((p - A[0]) / (B[0] - A[0]), 0, 1)); return [1, 2, 3].map((j) => A[j] + (B[j] - A[j]) * t); }
      }
      return CAM[CAM.length - 1].slice(1);
    };

    let W = 0, H = 0, dirty = true, end = 1, solidTop = 0, filmStart = 0;
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2, Math.sqrt((mobile ? 3.4e6 : 5.6e6) / Math.max(1, innerWidth * innerHeight)));
      W = canvas.width = Math.round(innerWidth * dpr); H = canvas.height = Math.round(innerHeight * dpr);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      solidTop = solid.getBoundingClientRect().top + scrollY;
      filmStart = hero ? hero.offsetHeight * .5 : 0;  // the film plays once the hero scrolls away
      end = Math.max(filmStart + 1, solidTop - innerHeight);
      dirty = true;
    };
    let rz = 0;
    addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(size, 120); });

    /* pointer parallax nudges the framing slightly (never reveals an edge) */
    let px = 0, py = 0, tpx = 0, tpy = 0;
    if (fine) addEventListener('pointermove', (e) => { tpx = e.clientX / innerWidth - .5; tpy = e.clientY / innerHeight - .5; }, { passive: true });

    let pos = FIRST, last = { pos: -1, px: 9, py: 9, w: 0 }, shown = false;
    const frame = () => {
      if (!alive) return;
      if (!W) size();  // first frame: measured here, where the page is laid out anyway
      const y = scrollY;
      const hp = clamp((y - filmStart) / (end - filmStart), 0, 1);
      // ease the playhead toward the scroll position: steady film even with stepped wheels
      const target = FIRST + hp * (LAST - FIRST);
      pos += (target - pos) * .18;
      if (Math.abs(target - pos) < .01) pos = target;
      px += (tpx - px) * .06; py += (tpy - py) * .06;
      const covered = y > solidTop + 4 || (hero && y < 1);  // the bone sections, or the full-screen hero, hide the film
      // always one whole frame: blending two neighbours read as a soft double image
      const i = Math.min(N - 1, Math.round((pos - FIRST) / set.step));
      playhead = i;
      want(i); want(i + 1); want(i - 1); want(i + 2);
      const changed = dirty || Math.abs(last.pos - pos) > .005 || Math.abs(last.px - px) > .0005 || Math.abs(last.py - py) > .0005 || last.w !== W;
      if (!covered && changed) {
        const n0 = nearest(i);
        if (n0 >= 0) {
          const b0 = bitmaps.get(n0), iw = b0.width, ih = b0.height;
          let [z, fx, fy] = camera(pos);
          if (W < H) z = 1;              // portrait already crops hard: no zoom, stay sharp
          fx = (fx - set.x0) / set.w;    // focus in the phone slice's own coordinates
          const s = Math.max(W / iw, H / ih) * z, dw = iw * s, dh = ih * s;
          const ox = clamp(W / 2 - (fx + px * .012) * dw, W - dw, 0), oy = clamp(H / 2 - (fy + py * .012) * dh, H - dh, 0);
          ctx.drawImage(b0, ox, oy, dw, dh);
          if (!shown) { shown = true; stage.classList.add('live'); }
          last = { pos, px, py, w: W }; dirty = false;
        }
      }
      if (!document.hidden) requestAnimationFrame(frame); else running = false;
    };
    let running = true;
    requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && !running) { running = true; requestAnimationFrame(frame); } });
    if ('ResizeObserver' in window) new ResizeObserver(() => { clearTimeout(rz); rz = setTimeout(size, 120); }).observe(document.body);
  }
}
