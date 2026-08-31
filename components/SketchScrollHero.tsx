import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { scrollToSection } from '../utils/scroll';

/**
 * Pencil-sketch scroll sequence — the landing page's opening act.
 *
 * A hand-drawn whiteboard animation (extracted from the source artboard by
 * `scripts/extract-sketch-frames.mjs` into `public/scroll-frames/`) painted
 * to a fixed canvas and scrubbed by the page scroll. The drawing IS the
 * background; the sections below scroll over it.
 *
 * Why fixed and not sticky: `LayoutWrapper` and `<main>` both carry
 * `overflow-x: hidden`, which promotes them to scroll containers and makes
 * `position: sticky` stick to the wrong box. The app already uses a fixed
 * z-0 backdrop for the same reason (`#o-scene` in index.css).
 *
 * ── Canvas resolution ────────────────────────────────────────────────
 * The backing store matches the DEVICE pixels of the area the drawing
 * occupies, so the compositor never rescales the canvas — the only resample
 * is the one inside `drawImage`, which is the sharpest option available.
 *
 * A 1:1 source-sized backing was tried instead (letting the compositor do the
 * upscale). It is cheaper, but the compositor filters bilinearly and the
 * result is visibly soft, so it is not worth the trade.
 *
 * Resampling runs at 'high'. That was previously blamed for a p90 of 158ms
 * on a throttled CPU, but benchmarking the call directly showed drawImage at
 * 3200x1800 costs 0.008-0.021ms and is indistinguishable across low/medium/
 * high — Chrome defers the work. The frame-time swings came from the harness,
 * not the quality setting, so the sharpest option is simply free.
 *
 * ── Playback follows the scroll directly ─────────────────────────────
 * An earlier build eased the shown frame toward the scrolled-to frame. That
 * was a mistake: Lenis (components/SmoothScroll.tsx) already smooths scrollY,
 * so easing again on top of it made the drawing visibly trail the wheel —
 * indistinguishable from lag. Smoothness comes from the scroll runway being
 * long enough per frame, not from a second smoothing pass.
 *
 * ── Loading ──────────────────────────────────────────────────────────
 * Priority order, highest first:
 *   1. sharp frames within a few of the one on screen
 *   2. the low-res understudy pass, as a stopgap for scrubbing far ahead
 *   3. the rest of the sharp frames
 *
 * Order matters: fetching the ENTIRE understudy set first meant everything on
 * screen was the 960px version for the first several seconds, so the drawing
 * looked soft exactly while it was being scrolled. Sharp-where-you-are-looking
 * has to outrank blanket coverage.
 *
 * Frames are also decoded before being marked ready. `drawImage` on an
 * undecoded <img> decodes synchronously on the main thread: most draws are
 * free but the occasional one measured 57-72ms, which is precisely the
 * periodic hitch that reads as scroll lag.
 */

/** Frame sets. `sd` is half-resolution and plays every 2nd frame. */
const SETS = {
  hd: { dir: 'hd', count: 140, w: 1600, h: 900 },
  sd: { dir: 'sd', count: 70, w: 960, h: 540 },
  // Phones get a genuinely portrait REFRAME, not the landscape frame
  // letterboxed. Each frame is cropped around its own ink-weighted centre by
  // `scripts/extract-sketch-frames.mjs`, so the window follows the action.
  pt: { dir: 'pt', count: 70, w: 760, h: 1056 },
} as const;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/**
 * The drawing does not move the instant the page does. The opening headline
 * needs a beat to be read and must be GONE before the pencil starts, or the
 * artwork develops under half-faded text.
 *
 *   0 → HOLD_IN     frame 0 holds, headline reads then clears
 *   HOLD_IN → tail  the sequence plays
 *   tail → 1        the closing frame rests before the handoff to Work
 */
const HOLD_IN = 0.04;
const HOLD_OUT = 0.03;
const INTRO_OUT = 0.032;
const INTRO_HOLD = 0.008;

/**
 * The source animation CROSS-DISSOLVES between scenes: for a few frames the
 * outgoing scene's hand-lettered title is still ghosted over the incoming one
 * (clearest around frame 98, where "Social Media Handling & Marketing"
 * appears twice). Scrubbing that linearly parks the reader on the doubled
 * text, which reads as the scenes overlapping each other.
 *
 * So playback is paced non-linearly: it RESTS where each scene is fully drawn
 * and moves briskly through the dissolves. Marks are against the 140-frame
 * master and rescaled per set.
 */
const MASTER = 140;
/**
 * Read off the frames rather than estimated. Each is a frame where the scene
 * is fully drawn and its lettering is clean and singular.
 *   30  "Got a Business Idea?" complete
 *   52  4AM logo with the Web Design / Software Designing arrows
 *   70  the desk / web-design workstation
 *   90  social media scene, title still single (it doubles from 93)
 *  134  the tree, 4AM lockup and footer — the payoff
 */
const BEATS = [30, 52, 70, 90, 134];
/**
 * The spans where the artwork genuinely overlaps ITSELF as one hand-lettered
 * title cross-fades into the next. An earlier guess put a beat at 97 — right
 * in the middle of the second one — so the sequence stopped and held for the
 * best part of a screen on doubled text. These are the frames to move
 * through, never to rest on.
 */
const DISSOLVES: [number, number][] = [[37, 41], [93, 103]];

/**
 * Weights are scroll distance per frame. The frame where a scene finishes
 * gets a long HOLD so its hand-lettering can actually be read before the
 * next scene starts drawing — scenes were completing and moving on inside a
 * few wheel notches. The frames leading into it settle, the dissolves rush.
 */
/*
 * Pacing is near-LINEAR on purpose. An earlier pass parked the sequence on
 * each finished scene for ~400px so its lettering could be read, but a hold
 * is a dead zone: four wheel notches where the drawing does not move at all,
 * which reads as the scroll being out of sync with the animation and as
 * having to over-scroll to get anywhere.
 *
 * So scene-complete frames now get only twice the distance of an ordinary
 * one — enough to register as a beat, small enough that every scroll
 * increment visibly moves the drawing. The cross-dissolves still go by
 * faster, since those are the frames where the artwork overlaps itself, but
 * they are never frozen either.
 *
 * Total hero scroll is a budget: frames x distance-per-frame, plus whatever
 * the beats take. Keeping the ratio near 1 is what buys the shorter page.
 */
const HOLD_W = 2;      // a scene-complete frame — a beat, not a stop
const SETTLE_W = 1;    // no special treatment easing into one
const RUSH_W = 0.4;    // inside a cross-dissolve
const NORMAL_W = 1;

/**
 * Portrait uses the `pt` reframe, fitted so nothing is clipped at the screen
 * edge. The reframe keeps ~40% of the original frame's width: enough for each
 * scene's drawn subject, not enough for the lettering around it, which the
 * beat line underneath carries instead. A taller crop would fill more of the
 * phone but starts cutting the illustration itself in half.
 */
const BEAT_LINES = [
  'You bring the idea.',
  'We shape the brand.',
  'We design and build it.',
  'We put it in front of people.',
  'And we grow it.',
];

/** Per-frame scroll weight, then an inverse LUT so lookup stays O(1). */
const buildSchedule = (count: number) => {
  const k = count / MASTER;
  const beats = BEATS.map((f) => Math.round(f * k));
  const rushes = DISSOLVES.map(([a, b]) => [Math.round(a * k), Math.round(b * k)] as const);
  const settle = Math.max(2, Math.round(6 * k));

  const w = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    const onBeat = beats.includes(i);
    const rushing = rushes.some(([a, b]) => i >= a && i <= b);
    const settling = beats.some((f) => i < f && i > f - settle);
    w[i] = onBeat ? HOLD_W : rushing ? RUSH_W : settling ? SETTLE_W : NORMAL_W;
  }
  let total = 0;
  for (let i = 0; i < count; i++) total += w[i];

  // Range EDGES, not midpoints. Indexing by midpoint gave each frame a span
  // equal to the average of its neighbours' weights, which quietly halved
  // every hold — a beat weighted 18 was resting for about a third of the
  // scroll it had been given.
  const edge = new Float64Array(count + 1);
  let acc = 0;
  for (let i = 0; i < count; i++) { edge[i] = acc / total; acc += w[i]; }
  edge[count] = 1;

  const LUT_N = 2048;
  const lut = new Uint16Array(LUT_N);
  let j = 0;
  for (let n = 0; n < LUT_N; n++) {
    const t = n / (LUT_N - 1);
    while (j < count - 1 && edge[j + 1] <= t) j++;
    lut[n] = j;
  }
  return (t: number) => lut[Math.round(clamp01(t) * (LUT_N - 1))];
};

const framePath = (dir: string, i: number) =>
  `/scroll-frames/${dir}/${String(i).padStart(4, '0')}.webp`;

/**
 * A phone held sideways has ~390px of height. The sequence needs the screen,
 * and an 850vh track of it would be a long scroll through a letterbox slot,
 * so landscape phones get a static hero instead — and skip the frame
 * downloads altogether. Tablets in landscape are tall enough to keep it,
 * hence the height gate rather than a plain orientation check.
 */
const PHONE_LANDSCAPE = '(pointer: coarse) and (orientation: landscape) and (max-height: 560px)';

const isStaticMode = () =>
  typeof window !== 'undefined' && (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia(PHONE_LANDSCAPE).matches
  );

/**
 * Portrait viewports get the portrait reframe. Otherwise phones, save-data and
 * weak CPUs get the lighter landscape set, and everything else the full one.
 */
const pickSet = () => {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (window.innerWidth / window.innerHeight < 1.15) return SETS.pt;
  if (
    nav.connection?.saveData ||
    window.matchMedia('(max-width: 900px)').matches ||
    (navigator.hardwareConcurrency || 8) < 4
  ) return SETS.sd;
  return SETS.hd;
};

/** Coarse pass first, then fill in — so scrubbing works before all of it lands. */
const loadOrder = (count: number): number[] => {
  const seen = new Set<number>();
  const order: number[] = [];
  const push = (i: number) => {
    if (i >= 0 && i < count && !seen.has(i)) { seen.add(i); order.push(i); }
  };
  push(0); push(count - 1);
  for (let i = 0; i < count; i += 10) push(i);
  for (let i = 0; i < count; i += 1) push(i);
  return order;
};

const SketchScrollHero: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Re-evaluated on rotation, so turning the phone upright starts the
  // sequence and turning it sideways drops back to the static hero.
  const [staticMode, setStaticMode] = useState(isStaticMode);

  useEffect(() => {
    const queries = ['(prefers-reduced-motion: reduce)', PHONE_LANDSCAPE].map((q) => window.matchMedia(q));
    const onChange = () => setStaticMode(isStaticMode());
    queries.forEach((m) => m.addEventListener('change', onChange));
    return () => queries.forEach((m) => m.removeEventListener('change', onChange));
  }, []);

  useLayoutEffect(() => {
    if (staticMode) return;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!canvas || !stage || !track) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const set = pickSet();
    const frameAt = buildSchedule(set.count);
    const images = new Array<HTMLImageElement | undefined>(set.count);
    const ready = new Array<boolean>(set.count).fill(false);
    const requested = new Array<boolean>(set.count).fill(false);

    // Low-resolution understudy, used only when the display set is `hd`.
    const usesBase = set === SETS.hd;
    const baseN = SETS.sd.count;
    const baseImages = new Array<HTMLImageElement | undefined>(baseN);
    const baseReady = new Array<boolean>(baseN).fill(false);
    const baseRequested = new Array<boolean>(baseN).fill(false);
    let baseLoaded = 0;
    const toBase = (i: number) =>
      Math.min(baseN - 1, Math.round((i * (baseN - 1)) / (set.count - 1)));

    let disposed = false;
    let paintedKey = '';
    let bw = 0, bh = 0;          // backing-store size, in device pixels

    /* ── Layout: CSS places the canvas, the compositor does the scaling ── */
    let trackTop = 0, trackSpan = 1;
    let wide = true;
    let lastLayout = '';

    const layout = (introA: number) => {
      const cw = window.innerWidth, ch = window.innerHeight;
      const NAV = cw <= 900 ? 70 : 80;

      wide = cw / ch >= 1.15;

      let w: number, h: number, x: number, y: number;

      if (wide) {
        // Landscape runs FULL BLEED — the whole viewport, not the area below
        // the nav. The navbar is transparent and its labels carry their own
        // halo, so it can sit over the drawing.
        const s = Math.max(cw / set.w, ch / set.h);
        w = Math.round(set.w * s);
        h = Math.round(set.h * s);
        x = Math.round((cw - w) / 2);
        // Bias the vertical crop: the hand-lettered titles live near the top
        // of the frame, the ground line near the bottom, so take 30% of the
        // overflow off the top and 70% off the bottom.
        y = Math.round(Math.min(0, Math.max(ch - h, -(h - ch) * 0.3)));
      } else {
        // Portrait FITS rather than covers. The frames are already reframed to
        // 1:2 so they nearly fill a phone as-is, and covering the last few
        // percent meant trimming the reframed artwork a second time at the
        // edges — content the crop had already been chosen to keep. Whatever
        // margin is left over is the same cream as the page (the frames are
        // graded to --color-bg), so it does not read as a letterbox.
        const s = Math.min(cw / set.w, ch / set.h);
        w = Math.round(set.w * s);
        h = Math.round(set.h * s);
        x = Math.round((cw - w) / 2);
        y = Math.round((ch - h) / 2);
      }

      const key = `${w}|${h}|${x}|${y}|${wide}`;
      if (key === lastLayout) return;
      lastLayout = key;

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.style.left = `${x}px`;
      canvas.style.top = `${y}px`;

      // Backing store in DEVICE pixels so the compositor has nothing to
      // rescale. Capped at 2x: past that the upscale from the source adds
      // cost without adding detail.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nw = Math.round(w * dpr), nh = Math.round(h * dpr);
      if (nw !== bw || nh !== bh) {
        bw = nw; bh = nh;
        canvas.width = bw; canvas.height = bh;
        // Resizing the backing store resets context state.
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }
      paintedKey = '';                      // force a repaint at the new geometry

      const root = document.documentElement.style;
      root.setProperty('--sk-band-top', `${y}px`);
      root.setProperty('--sk-band-bottom', `${y + h}px`);
      stage.classList.toggle('sk-wide', wide);
    };

    const measure = () => {
      const r = track.getBoundingClientRect();
      trackTop = r.top + window.scrollY;
      trackSpan = Math.max(1, r.height - window.innerHeight);
    };

    /* ── Painting ───────────────────────────────────────────────────── */
    /** Sharp frame if it has arrived, else the low-res stand-in, else the
     *  nearest sharp frame either side. */
    const bestFor = (i: number): { img: HTMLImageElement; key: string } | null => {
      if (ready[i]) return { img: images[i]!, key: `h${i}` };
      if (usesBase) {
        const b = toBase(i);
        if (baseReady[b]) return { img: baseImages[b]!, key: `b${b}` };
      }
      for (let d = 1; d < set.count; d++) {
        if (i - d >= 0 && ready[i - d]) return { img: images[i - d]!, key: `h${i - d}` };
        if (i + d < set.count && ready[i + d]) return { img: images[i + d]!, key: `h${i + d}` };
      }
      return null;
    };

    const paint = (best: { img: HTMLImageElement; key: string }) => {
      if (!bw) return;
      ctx.drawImage(best.img, 0, 0, bw, bh);
      paintedKey = best.key;
    };

    /* ── Playback: the shown frame follows the scroll 1:1 ──────────── */
    let wanted = 0;      // frame the scroll position asks for

    const showFrame = () => {
      if (disposed) return;
      const best = bestFor(wanted);
      if (best && best.key !== paintedKey) paint(best);
    };

    /* ── Scroll sync: everything that must respond immediately ─────── */
    let pending = false;
    let lastOut = -1, lastIntro = -1, lastBeat = -1, lastBeatOpacity = -1;

    const sync = () => {
      pending = false;
      if (disposed) return;

      const p = clamp01((window.scrollY - trackTop) / trackSpan);

      // Opening-copy alpha is read by the band placement, the headline and the
      // beat line, so it is computed once, up front. (Renders only happen on
      // scroll — a value written later in the same pass stayed one frame stale
      // forever once the scroll stopped.)
      const raw = clamp01((INTRO_OUT - p) / (INTRO_OUT - INTRO_HOLD));
      const introA = raw * raw * (3 - 2 * raw);          // smoothstep

      layout(introA);

      const t = clamp01((p - HOLD_IN) / (1 - HOLD_IN - HOLD_OUT));
      wanted = frameAt(t);
      showFrame();

      // The stage sits behind everything, so it hides once the story is told.
      const out = p >= 1 ? 0 : p > 0.94 ? 1 - (p - 0.94) / 0.06 : 1;
      if (out !== lastOut) {
        lastOut = out;
        stage.style.opacity = String(out);
        stage.style.visibility = out <= 0.01 ? 'hidden' : 'visible';
      }

      if (introRef.current && introA !== lastIntro) {
        lastIntro = introA;
        introRef.current.style.opacity = String(introA);
        introRef.current.style.transform = `translateY(${(1 - introA) * -22}px)`;
        introRef.current.style.visibility = introA <= 0.01 ? 'hidden' : 'visible';
      }

      const k = set.count / MASTER;
      let beat = 0;
      while (beat < BEATS.length - 1 && wanted > Math.round(BEATS[beat] * k)) beat++;
      if (beat !== lastBeat && capRef.current) {
        lastBeat = beat;
        capRef.current.textContent = BEAT_LINES[beat];
      }

      // The beat line and CTA are fixed, so they fade out with the stage — and
      // only belong on portrait, once the opening copy has cleared their space.
      const bo = wide ? 0 : out * (1 - introA);
      if (bo !== lastBeatOpacity) {
        lastBeatOpacity = bo;
        for (const el of [capRef.current, ctaRef.current]) {
          if (!el) continue;
          el.style.opacity = String(bo);
          el.style.visibility = bo <= 0.01 ? 'hidden' : 'visible';
          el.style.pointerEvents = bo > 0.9 ? 'auto' : 'none';
        }
      }

      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };

    const onScroll = () => {
      if (!pending) { pending = true; requestAnimationFrame(sync); }
    };

    /* ── Progressive fetch, with the frame in view jumped to the front ─ */
    const queue = loadOrder(set.count);
    let cursor = 0;
    let inFlight = 0;
    let loaded = 0;

    /**
     * Whatever the reader is actually looking at outranks the queue —
     * otherwise a fast scroll sits on a distant fallback frame, which is what
     * made the scenes look like they were jumping over each other.
     */
    const pickNext = (): number => {
      for (let d = 0; d < 8; d++) {
        if (wanted + d < set.count && !requested[wanted + d]) return wanted + d;
        if (wanted - d >= 0 && !requested[wanted - d]) return wanted - d;
      }
      while (cursor < queue.length && requested[queue[cursor]]) cursor++;
      return cursor < queue.length ? queue[cursor++] : -1;
    };

    /** Same idea for the understudy pass, in the reader's own neighbourhood. */
    const baseQueue = loadOrder(baseN);
    let baseCursor = 0;
    const pickNextBase = (): number => {
      const here = toBase(wanted);
      for (let d = 0; d < 6; d++) {
        if (here + d < baseN && !baseRequested[here + d]) return here + d;
        if (here - d >= 0 && !baseRequested[here - d]) return here - d;
      }
      while (baseCursor < baseQueue.length && baseRequested[baseQueue[baseCursor]]) baseCursor++;
      return baseCursor < baseQueue.length ? baseQueue[baseCursor++] : -1;
    };

    const fetchOne = (dir: string, i: number, onDone: (img: HTMLImageElement) => void) => {
      inFlight++;
      const img = new Image();
      img.decoding = 'async';
      const finish = (ok: boolean) => {
        inFlight--;
        if (disposed) return;
        if (ok) onDone(img);
        pump();
      };
      img.onload = () => {
        if (!img.naturalWidth) { finish(false); return; }
        // Decode BEFORE publishing it, so no drawImage ever stalls the
        // scroll waiting on a decode.
        if (typeof img.decode === 'function') {
          img.decode().then(() => finish(true)).catch(() => finish(true));
        } else finish(true);
      };
      img.onerror = () => finish(false);
      img.src = framePath(dir, i);
    };

    /** A sharp frame close to the one on screen, if any is still missing. */
    const nearbySharp = (): number => {
      for (let d = 0; d < 7; d++) {
        if (wanted + d < set.count && !requested[wanted + d]) return wanted + d;
        if (wanted - d >= 0 && !requested[wanted - d]) return wanted - d;
      }
      return -1;
    };

    const pump = () => {
      if (disposed) return;
      while (inFlight < 5) {
        // 1. sharp, where the reader is looking
        const near = nearbySharp();
        if (near >= 0) {
          requested[near] = true;
          fetchOne(set.dir, near, (img) => {
            images[near] = img; ready[near] = true; loaded++;
            if (loaded === 1 && baseLoaded === 0) { measure(); sync(); }
            showFrame();
          });
          continue;
        }
        // 2. the understudy pass, so scrubbing ahead still shows something
        if (usesBase && baseLoaded < baseN) {
          const b = pickNextBase();
          if (b >= 0) {
            baseRequested[b] = true;
            fetchOne(SETS.sd.dir, b, (img) => {
              baseImages[b] = img; baseReady[b] = true; baseLoaded++;
              if (baseLoaded === 1 && loaded === 0) { measure(); sync(); }
              showFrame();
            });
            continue;
          }
        }
        // 3. everything else, sharp
        const i = pickNext();
        if (i < 0) return;
        requested[i] = true;
        fetchOne(set.dir, i, (img) => {
          images[i] = img; ready[i] = true; loaded++;
          showFrame();
        });
      }
    };

    const onResize = () => { measure(); lastLayout = ''; sync(); };

    measure();
    layout(1);
    pump();
    sync();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);

    return () => {
      disposed = true;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      [...images, ...baseImages].forEach((im) => {
        if (im) { im.onload = null; im.onerror = null; im.src = ''; }
      });
    };
  }, [staticMode]);

  /* Static hero: no scrub and no multi-megabyte download. Frame 0 is used
     rather than the closing frame because its right half is empty paper,
     which is exactly where the headline sits. */
  useEffect(() => {
    if (!staticMode) return;
    const canvas = canvasRef.current;
    const stage  = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const set = SETS.sd;
    let img: HTMLImageElement | null = null;

    const place = () => {
      const cw = window.innerWidth, ch = window.innerHeight;
      const NAV = cw <= 900 ? 70 : 80;
      const boxH = ch - NAV;
      const s = Math.min(cw / set.w, boxH / set.h);
      const w = set.w * s, h = set.h * s;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.style.left = `${(cw - w) / 2}px`;
      canvas.style.top = `${NAV + (boxH - h) / 2}px`;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      if (img) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // A sideways phone is cramped enough that the copy has to win, so the
      // drawing drops back to a backdrop there.
      stage.classList.toggle('sk-dim', window.matchMedia(PHONE_LANDSCAPE).matches);
    };

    const poster = new Image();
    poster.onload = () => { img = poster; place(); };
    poster.src = framePath(set.dir, 0);
    place();

    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('resize', place);
      stage.classList.remove('sk-dim');
      poster.onload = null;
    };
  }, [staticMode]);

  return (
    <>
      {/* Fixed drawing surface — behind every section (z 0), never clickable. */}
      <div className="sk-stage" ref={stageRef} aria-hidden="true">
        <canvas className="sk-canvas" ref={canvasRef} />

        <div className="sk-hud">
          <div className="sk-progress"><span ref={barRef} /></div>
        </div>
      </div>

      {/* Beat line — under the drawing on portrait, where the band can only
          fill the width. Hidden on landscape, which fills the frame. */}
      <p className="sk-beat" ref={capRef}>{BEAT_LINES[0]}</p>

      <div className="sk-beat-cta" ref={ctaRef}>
        <button className="o-btn o-btn-primary" onClick={() => scrollToSection('contact')}>
          Start a project
        </button>
      </div>

      {/* The scroll track. Its height is what gives the sequence its runway. */}
      <section
        id="home"
        className={`sk-track${staticMode ? ' is-static' : ''}`}
        ref={trackRef}
        aria-label="4AM Global Media — how we work"
      >
        {/* Opening headline, over the near-empty first frames. */}
        <div className="sk-intro" ref={introRef}>
          <p className="kicker"><span className="rule" />4AM Global Media</p>
          <h1>A creative network made for today &amp; tomorrow.</h1>
          <p className="lede">
            Strategy, design, engineering and growth marketing — drawn out, start to finish.
          </p>
          <div className="sk-intro-actions">
            <button className="o-btn o-btn-primary" onClick={() => scrollToSection('contact')}>
              Start a project
            </button>
            <button className="o-btn o-btn-ghost" onClick={() => scrollToSection('work')}>
              See the work →
            </button>
          </div>
          <span className="sk-cue" aria-hidden="true">
            <i />scroll to draw
          </span>
        </div>

        {/* Real text for crawlers and screen readers — the canvas is decorative. */}
        <p className="sr-only">
          A hand-drawn sequence: a founder brings 4AM Global Media a business idea, the team
          sketches out web design and software, handles social media and marketing, launches it,
          and grows it into a network of marketing, web, products and PR.
        </p>
      </section>
    </>
  );
};

export default SketchScrollHero;
