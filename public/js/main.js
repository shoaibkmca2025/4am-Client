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
  // after the first frame, so this never forces a layout of its own
  requestAnimationFrame(() => $$('.rv, .sk.draw:not(.rv .sk)').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) { el.classList.add('on'); return; }  // already in view
    $$('[data-count]', el).forEach((c) => { c.textContent = '0'; });
    io.observe(el);
  }));
}

/* gentle 3D tilt toward the pointer (+ a spotlight on service cards) */
if (fine && !rm) {
  const tilt = (card, k) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((x - .5) * k).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((.5 - y) * k).toFixed(2) + 'deg');
      card.style.setProperty('--ty', ((x - .5) * k).toFixed(2) + 'deg');
      card.style.setProperty('--tx', ((.5 - y) * k * .7).toFixed(2) + 'deg');
      card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    });
    card.addEventListener('pointerleave', () => ['--ry', '--rx', '--ty', '--tx'].forEach((p) => card.style.removeProperty(p)));
  };
  $$('.scard').forEach((c) => tilt(c, 10));
  $$('.card, .person').forEach((c) => tilt(c, 6));
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

/* ---------- one-line card rows that slide right-to-left with the scroll ----------
   The section is made as tall as the row is wide (plus a screen), the row is
   pinned, and 1px of scroll moves it 1px — so it tracks the scroll exactly and
   reverses the instant you scroll back. Reduced motion keeps a native,
   swipeable row instead (no html.hs). */
const rows = $$('.hscroll');
if (rows.length && !rm) {
  root.classList.add('hs');
  const R = rows.map((sec) => ({ sec, view: $('.hs-view', sec), track: $('.track', sec), bar: $('.hs-bar i', sec), top: 0, dist: 0, last: -1 }));
  const measure = () => R.forEach((r) => {
    r.dist = Math.max(0, r.track.scrollWidth - r.view.clientWidth);
    r.sec.style.height = `${r.dist + innerHeight}px`;
  });
  const tops = () => R.forEach((r) => { r.top = r.sec.getBoundingClientRect().top + scrollY; });
  const apply = () => {
    R.forEach((r) => {
      // read the section's live position: anything above it may change height
      const p = r.dist ? clamp(-r.sec.getBoundingClientRect().top / r.dist, 0, 1) : 0;
      if (Math.abs(p - r.last) < .0005) return;
      r.last = p;
      r.track.style.transform = `translate3d(${(-p * r.dist).toFixed(1)}px,0,0)`;
      if (r.bar) r.bar.style.transform = `scaleX(${p.toFixed(4)})`;
    });
  };
  let queued = false;
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; apply(); }); } };
  const relayout = () => { measure(); tops(); R.forEach((r) => { r.last = -1; }); apply(); };
  addEventListener('scroll', schedule, { passive: true });
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(relayout, 120); });
  addEventListener('load', relayout);
  if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(relayout, 120); }); R.forEach((r) => ro.observe(r.track)); }
  requestAnimationFrame(relayout);  // measure inside the first frame, not during script start-up
  // keyboard: bring a focused card into view by scrolling the page to it
  R.forEach((r) => r.track.addEventListener('focusin', (e) => {
    const li = e.target.closest('.track > li');
    if (!li) return;
    const x = clamp(li.offsetLeft - (r.view.clientWidth - li.offsetWidth) / 2, 0, r.dist);
    scrollTo({ top: r.sec.getBoundingClientRect().top + scrollY + x, behavior: 'instant' });
  }));
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
    if (!EMAIL_RE.test(val('email'))) e.email = 'Enter a work email like name@company.com.';
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
  const canvas = $('#film'), solid = $('.solid'), rail = $('.progress'), bars = rail ? $$('i', rail) : [];
  const beats = $$('.beat');
  const LAST = 286;  // frames 0…286 of the original film

  /* story beats: words rise when a beat is a third on screen */
  if (root.classList.contains('anim')) {
    const bio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); bio.unobserve(e.target); } }), { threshold: .3 });
    beats.forEach((b) => bio.observe(b));
  } else beats.forEach((b) => b.classList.add('in'));

  /* nav: highlight the section in view */
  const links = $$('.nav a');
  const navIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false'));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['services', 'work', 'process', 'team', 'contact'].forEach((id) => { const s = document.getElementById(id); if (s) navIO.observe(s); });

  const conn = navigator.connection;
  const still = rm || (conn && conn.saveData) || !canvas.getContext;
  if (!still) {
    // Phones in portrait only ever see a narrow slice of the 16:9 film, so they
    // get that slice at full source height (sharp, and a third of the bytes).
    const mobile = innerWidth < 640 && innerWidth / innerHeight < .8;
    const set = mobile ? { dir: 'm', step: 3, x0: 896 / 2560, w: 1178 / 2560 } : { dir: 'd', step: 2, x0: 0, w: 1 };
    const frames = []; for (let f = 1; f <= 287; f += set.step) frames.push(f);
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
      fetch(url(i)).then((r) => (r.ok ? r.blob() : null)).then((b) => { if (b) { blobs[i] = b; if (Math.abs(i - playhead) < 4) dirty = true; } }).catch(() => {}).finally(pump);
    };
    // The poster covers the first screen, so the film can wait: start streaming
    // once the page has loaded and gone idle, or as soon as the visitor scrolls.
    const start = () => { if (started) return; started = true; for (let k = 0; k < 6; k++) pump(); };
    addEventListener('scroll', start, { once: true, passive: true });
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
    // Wait for both the load event and the first contentful paint, so the
    // frames can never compete with the copy the visitor is about to read.
    const loaded = new Promise((res) => (document.readyState === 'complete' ? res() : addEventListener('load', res, { once: true })));
    const painted = new Promise((res) => {
      const has = () => performance.getEntriesByName('first-contentful-paint').length > 0;
      if (has()) return res();
      try {
        new PerformanceObserver((list, obs) => { if (list.getEntries().some((e) => e.name === 'first-contentful-paint')) { obs.disconnect(); res(); } }).observe({ type: 'paint', buffered: true });
      } catch { res(); }
      setTimeout(res, 4000);  // never wait forever
    });
    Promise.all([loaded, painted]).then(() => idle(start, { timeout: 2500 }));

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

    /* camera: [frame, zoom, focusX, focusY] — close on the plant while the clip's
       own baked-in title fades (it sits left of x≈.37 until ~frame 124), then pull
       out and push gently back in. With the 2560px source the close-up is ~1:1. */
    const CAM = [[0, 1.62, .66, .42], [100, 1.7, .67, .4], [124, 1.6, .64, .45], [168, 1.0, .52, .5], [230, 1.05, .55, .48], [286, 1.18, .6, .42]];
    const camera = (p) => {
      for (let k = 0; k < CAM.length - 1; k++) {
        const A = CAM[k], B = CAM[k + 1];
        if (p <= B[0]) { const t = smooth(clamp((p - A[0]) / (B[0] - A[0]), 0, 1)); return [1, 2, 3].map((j) => A[j] + (B[j] - A[j]) * t); }
      }
      return CAM[CAM.length - 1].slice(1);
    };

    let W = 0, H = 0, dirty = true, end = 1, solidTop = 0;
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2, Math.sqrt((mobile ? 3.4e6 : 5.6e6) / Math.max(1, innerWidth * innerHeight)));
      W = canvas.width = Math.round(innerWidth * dpr); H = canvas.height = Math.round(innerHeight * dpr);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      solidTop = solid.getBoundingClientRect().top + scrollY;
      end = Math.max(1, solidTop - innerHeight);
      dirty = true;
    };
    size();
    let rz = 0;
    addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(size, 120); });

    /* pointer parallax nudges the framing slightly (never reveals an edge) */
    let px = 0, py = 0, tpx = 0, tpy = 0;
    if (fine) addEventListener('pointermove', (e) => { tpx = e.clientX / innerWidth - .5; tpy = e.clientY / innerHeight - .5; }, { passive: true });

    let pos = 0, last = { pos: -1, px: 9, py: 9, w: 0 }, shown = false;
    const frame = () => {
      if (!alive) return;
      const y = scrollY;
      const hp = clamp(y / end, 0, 1);
      // ease the playhead toward the scroll position: steady film even with stepped wheels
      const target = hp * LAST;
      pos += (target - pos) * .18;
      if (Math.abs(target - pos) < .01) pos = target;
      px += (tpx - px) * .06; py += (tpy - py) * .06;
      if (rail) { bars.forEach((b, i) => b.style.setProperty('--f', clamp(hp * 3 - i, 0, 1).toFixed(3))); rail.style.setProperty('--done', hp > .98 ? '1' : '0'); }
      const covered = y > solidTop + 4;
      const q = pos / set.step, i = Math.min(N - 1, Math.floor(q)), frac = q - i;
      playhead = i;
      want(i); want(i + 1); want(i - 1); want(i + 2);
      const changed = dirty || Math.abs(last.pos - pos) > .005 || Math.abs(last.px - px) > .0005 || Math.abs(last.py - py) > .0005 || last.w !== W;
      if (!covered && changed) {
        const n0 = nearest(i);
        if (n0 >= 0) {
          const b0 = bitmaps.get(n0), iw = b0.width, ih = b0.height;
          let [z, fx, fy] = camera(pos);
          if (W < H) z = 1 + (z - 1) * .5;  // portrait already crops hard: zoom less, stay sharp
          fx = (fx - set.x0) / set.w;       // focus in the phone slice's own coordinates
          const s = Math.max(W / iw, H / ih) * z, dw = iw * s, dh = ih * s;
          const ox = clamp(W / 2 - (fx + px * .012) * dw, W - dw, 0), oy = clamp(H / 2 - (fy + py * .012) * dh, H - dh, 0);
          ctx.globalAlpha = 1; ctx.drawImage(b0, ox, oy, dw, dh);
          const b1 = n0 === i && frac > .02 ? bitmaps.get(i + 1) : null;
          if (b1) { ctx.globalAlpha = frac; ctx.drawImage(b1, ox, oy, dw, dh); ctx.globalAlpha = 1; }
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
