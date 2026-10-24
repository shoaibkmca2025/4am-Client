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
   button or leaving the screen ease it to a stop (never a hard stop). People
   can move it themselves: a horizontal trackpad swipe or Shift+wheel, the
   arrow buttons (one card per press, lined up with the heading), the arrow
   keys (card to card), or drag / swipe, which follows 1:1 and keeps the
   flick's velocity. After any of these the row waits before drifting again.
   Vertical scrolling always stays with the page. Reduced motion (no
   html.loops): a plain, natively scrollable row. */
const loops = $$('.loop');
const HOLD = 5000;  // ms the row stays put after someone moves it
if (loops.length && !rm) {
  root.classList.add('loops');
  loops.forEach((loop) => {
    const track = $('.loop-track', loop);
    const btn = document.querySelector(`.loop-btn[aria-controls="${loop.id}"]`);
    const SPEED = matchMedia('(max-width: 639px)').matches ? 26 : 34;  // px per second
    let built = false, half = 0, x = 0, v = 0, hover = false, focus = false, paused = false, seen = false, drag = false, last = 0, raf = 0, moved = false;
    let glideTo = null, hold = 0;
    const build = () => $$(':scope > li', track).forEach((li) => {
      const c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true'); c.setAttribute('inert', '');
      $$('[id]', c).forEach((el) => el.removeAttribute('id'));
      track.appendChild(c);
    });
    const measure = () => { half = track.scrollWidth / 2; };
    const wrap = () => {
      if (!half) return;
      const before = x; x = -((((-x) % half) + half) % half);
      if (glideTo !== null) glideTo += x - before;  // a glide in progress wraps with the row
    };
    const render = () => { if (!focus) wrap(); track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`; };
    const resting = () => hover || focus || paused || !seen || performance.now() < hold;
    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now;
      if (glideTo !== null) {
        x += (glideTo - x) * (1 - Math.exp(-dt * 9));   // ease to the chosen card
        if (Math.abs(glideTo - x) < .5) { x = glideTo; glideTo = null; }
      } else if (!drag) {
        const target = resting() ? 0 : -SPEED;
        v += (target - v) * (1 - Math.exp(-dt * 3.2));   // ease toward the drift (or a stop)
        if (Math.abs(v - target) < .05) v = target;
        x += v * dt;
      }
      render();
      if (drag || glideTo !== null || v !== 0 || !resting()) raf = requestAnimationFrame(tick); else last = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const holdOn = () => { hold = performance.now() + HOLD; setTimeout(kick, HOLD + 30); };
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen && !built) { built = true; build(); measure(); } kick(); }).observe(loop);
    let rz = 0;
    addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (built) { measure(); render(); } }, 150); });

    // one card per press, landing with a card's left edge on the heading's
    loop.nudge = (dir) => {
      const first = track.firstElementChild; if (!first) return;
      const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
      const head = $('.sec-head', loop.closest('section'));
      const off = head ? head.getBoundingClientRect().left - loop.getBoundingClientRect().left : 0;
      const from = glideTo ?? x, k = (from - off) / step;  // the next card edge in the pressed direction
      glideTo = (dir > 0 ? Math.floor(k - .15) : Math.ceil(k + .15)) * step + off;
      v = 0; holdOn(); kick();
    };
    // trackpad: horizontal swipes (and Shift+wheel) move the row, vertical ones scroll the page
    loop.addEventListener('wheel', (e) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (!d) return;
      e.preventDefault();
      glideTo = null; v = 0; x -= d * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? loop.clientWidth : 1);
      holdOn(); render(); kick();
    }, { passive: false });

    loop.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hover = true; kick(); } });
    loop.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { hover = false; kick(); } });
    // keyboard: stop, and slide the focused card fully into view
    loop.addEventListener('focusin', (e) => {
      focus = true; v = 0; glideTo = null;
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
          active = true; moved = true; drag = true; glideTo = null; base = x - dx; v = 0;
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
        drag = false; loop.classList.remove('dragging'); holdOn(); kick();
      };
      loop.addEventListener('pointermove', move); loop.addEventListener('pointerup', end); loop.addEventListener('pointercancel', end);
    });
    loop.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    loop.addEventListener('dragstart', (e) => e.preventDefault());

    if (btn) btn.addEventListener('click', () => { paused = !paused; btn.setAttribute('aria-pressed', String(paused)); btn.textContent = paused ? 'Play' : 'Pause'; kick(); });
  });
}
// arrow buttons and arrow keys, in both modes (the reduced-motion row scrolls natively)
loops.forEach((loop) => {
  const step = () => (loop.querySelector('.loop-track > li')?.getBoundingClientRect().width || 260) + 14;
  $$(`.loop-nav[aria-controls="${loop.id}"]`).forEach((b) => b.addEventListener('click', () => {
    const dir = +b.dataset.dir;
    if (loop.nudge) loop.nudge(dir); else loop.scrollBy({ left: dir * step(), behavior: rm ? 'auto' : 'smooth' });
  }));
  loop.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const li = e.target.closest('li'); if (!li) return;
    const sib = e.key === 'ArrowRight' ? li.nextElementSibling : li.previousElementSibling;
    const to = sib && !sib.hasAttribute('inert') && sib.querySelector('a[href], button');
    if (to) { e.preventDefault(); to.focus(); }
  });
});

/* ---------- home hero: the night video, and the header's hero look ---------- */
const hero = $('#hero');
if (hero) {
  // the header keeps its dark glass look over the hero and the launch scene below it
  const dark = $('#launch') || hero;
  const setHero = () => root.classList.toggle('at-hero', dark.getBoundingClientRect().bottom > 76);
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

/* ══════════ home: nav highlight and the launch scene ══════════ */
const scene = $('#launch');

/* nav: highlight the section in view; over the hero and the launch scene
   nothing is current */
const navLinks = $$('.nav a[href^="#"]');
if (hero && navLinks.length) {
  const navIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false'));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['services', 'work', 'process', 'team', 'contact'].forEach((id) => { const s = document.getElementById(id); if (s) navIO.observe(s); });
  [hero, scene].forEach((s) => s && navIO.observe(s));
}

/* The scene (after the Scrollhaus "Zenith" direction): one photograph, two
   framings. Scroll progress p drives a single camera pan + push-in from the
   launch to the moon (never a crossfade); the launch copy rises, blurs, then
   fades; the results window arrives behind its heading, at a different rate.
   The timeline eases toward the scroll position (settle 9/s) and is capped at
   0.4/s, so even a hard flick plays out; the loop stops once it settles. */
if (scene) {
  const S = scene.style, set = (k, v) => S.setProperty(k, v);
  const out3 = (t) => 1 - (1 - t) ** 3, out4 = (t) => 1 - (1 - t) ** 4, io3 = (t) => (t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
  const track = (p, a, b, f = (t) => t) => f(clamp((p - a) / (b - a), 0, 1));
  const apply = (p) => {
    const q = clamp(p / .86, 0, 1);  // the framing lands at 86% of the travel and holds
    set('--cam-x', (-47.957 - 2.043 * q).toFixed(3) + '%');
    set('--cam-y', (-80.097 + 43.381 * q).toFixed(3) + '%');
    set('--cam-z', rm ? '1' : (1 + .11 * Math.sin(Math.PI * q)).toFixed(4));
    const exit = track(p, .297, .508);
    set('--hero-out', (exit ** 1.75).toFixed(4));
    set('--hero-o', ((1 - clamp((exit - .38) / .62, 0, 1)) ** 1.25).toFixed(4));
    set('--hero-blur', (18 * exit ** .9).toFixed(2));
    scene.classList.toggle('is-blurring', exit > 0 && exit < 1);
    scene.classList.toggle('is-gone', exit >= 1);
    set('--glow-o', (1 - track(p, .55, .95, io3)).toFixed(4));
    set('--plat-o', track(p, .557, .623, out3).toFixed(4));
    set('--plat-text', track(p, .563, .967, out4).toFixed(4));
    set('--plat-shot', track(p, .557, .984, out3).toFixed(4));
    scene.classList.toggle('plat-on', p > .54);
    scene.classList.toggle('is-moving', p > .001 && p < .999);
    if (p > .05) scene.classList.add('is-open');
  };
  let top = 0, span = 1, measured = false, target = 0, cur = -1, last = 0, raf = 0;
  const measure = () => { top = scene.offsetTop; span = Math.max(1, scene.offsetHeight - innerHeight); measured = true; };
  const step = (now) => {
    raf = 0;
    if (!measured) measure();  // first frame: the page is laid out here anyway
    target = clamp((scrollY - top) / span, 0, 1);
    const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now;
    if (rm || cur < 0) cur = target;
    else {
      const cap = .4 * dt;
      cur += clamp((target - cur) * (1 - Math.exp(-9 * dt)), -cap, cap);
      if (Math.abs(target - cur) < .0004) cur = target;
    }
    apply(cur);
    if (cur !== target) raf = requestAnimationFrame(step); else last = 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
  addEventListener('scroll', kick, { passive: true });
  let rz = 0;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { measured = false; kick(); }, 150); });
  kick();

  /* intro: the headline lines are uncovered when the scene arrives */
  const open = () => scene.classList.add('is-open');
  if (!root.classList.contains('anim')) { scene.classList.add('in'); open(); }
  else {
    const intro = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      intro.disconnect(); scene.classList.add('in');
      $('.launch__sub', scene).addEventListener('animationend', open, { once: true });
      setTimeout(open, 1800);  // backstop
    }, { threshold: .6 });
    intro.observe($('.launch__title', scene));
  }
}
