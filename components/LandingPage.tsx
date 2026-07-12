import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './Hero';
import Services from './Services';
import Projects from './Projects';
import Contact from './Contact';
import Testimonials from './Testimonials';
import StatsSection from './Stats';
import ProcessSection from './ProcessSection';
import CodeShowcase from './CodeShowcase';
import GrowthChart from './GrowthChart';
import Founder from './Founder';
import Marquee from './Marquee';
import ScrollCanvasBackground, { ACCENT_EVENT } from './ScrollCanvasBackground';
import SectionNav from './SectionNav';
import ScrollCTA from './ScrollCTA';
import { SplineScene } from './ui/splite';
import { scrollToSection } from '../utils/scroll';

gsap.registerPlugin(ScrollTrigger);

const HOME_PAGE_TITLE = 'A Creative Network made for today & tomorrow | 4AM Global Media';
const HOME_PAGE_DESCRIPTION =
  '4AM Global Media provides digital marketing and software development services including web and mobile app solutions to help businesses grow online.';

// Client / partner names shown in the scrolling strip
const CLIENTS = [
  'Nike', 'Spotify', 'Shopify', 'Airbnb', 'Notion', 'Stripe',
  'Linear', 'Figma', 'Vercel', 'Framer', 'Arc', 'Loom',
];

type OrbKey = 'orange' | 'violet' | 'cyan';

// Self-hosted (public/assets): rides our own CDN edge after deployment —
// no third-party DNS/TLS handshake, cached alongside the site.
const SPLINE_SCENE = '/assets/robot.splinecode';

const LandingPage: React.FC = () => {
  const location = useLocation();
  const mainRef  = useRef<HTMLDivElement>(null);
  const bgRef    = useRef<HTMLDivElement>(null);
  const orbRefs  = useRef<Record<OrbKey, HTMLDivElement | null>>({ orange: null, violet: null, cyan: null });
  const heroZoneRef  = useRef<HTMLDivElement>(null);
  const robotWrapRef = useRef<HTMLDivElement>(null);
  const robotRef     = useRef<HTMLDivElement>(null);
  const [show3D, setShow3D] = useState(false);

  // NOTE: no stop()/play() scroll-freezing here — Spline's play() replays
  // the scene's camera intro, which showed up as a zoom pulse every time
  // scrolling paused. The scene runs continuously so head-tracking and
  // the idle pose stay stable in backdrop mode.

  // Head-tracking everywhere: section containers sit above the robot
  // layer and swallow pointer events, so we mirror every window mouse
  // move to the robot's canvas as a synthetic event. Clicks/hovers on
  // real UI are untouched — we only forward the movement signal.
  useEffect(() => {
    if (!show3D) return;
    let canvas: HTMLCanvasElement | null = null;
    const forward = (e: PointerEvent) => {
      if (!canvas || !canvas.isConnected) {
        canvas = robotWrapRef.current?.querySelector('canvas') ?? null;
      }
      if (!canvas || e.target === canvas) return;
      canvas.dispatchEvent(new PointerEvent('pointermove', {
        clientX: e.clientX,
        clientY: e.clientY,
        pointerId: e.pointerId,
        pointerType: 'mouse',
        bubbles: false,
      }));
      canvas.dispatchEvent(new MouseEvent('mousemove', {
        clientX: e.clientX,
        clientY: e.clientY,
        bubbles: false,
      }));
    };
    window.addEventListener('pointermove', forward, { passive: true });
    return () => window.removeEventListener('pointermove', forward);
  }, [show3D]);

  // Robot loading strategy — everything in PARALLEL, starting NOW:
  //   1. The scene file (multi-MB, third-party CDN — the slowest link)
  //      starts downloading immediately via <link rel="preload">.
  //   2. The Spline runtime chunk is warmed with a dynamic import so it
  //      fetches + background-compiles alongside the scene.
  //   3. The component mounts at the first idle moment (≤1.2s), by which
  //      time both downloads are usually already done or in flight.
  // Desktop-only: phones never pay a byte of this.
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 1024px)').matches ||
      // Touch devices in "desktop site" mode pass the width check, but
      // Spline's canvas sets touch-action:none — a finger dragging on the
      // robot (which backdrops every section) can't scroll the page. The
      // robot is strictly for real fine-pointer desktops.
      window.matchMedia('(pointer: coarse)').matches ||
      (navigator.hardwareConcurrency || 8) < 4 ||
      nav.connection?.saveData
    ) return;

    // 1) Scene file: fire the network request right away
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'fetch';
    preload.crossOrigin = 'anonymous';
    preload.href = SPLINE_SCENE;
    preload.setAttribute('fetchpriority', 'high');
    document.head.appendChild(preload);

    // 2) Runtime chunk: fetch + compile in parallel (resolves the same
    //    lazy chunk SplineScene imports, so mounting is instant later)
    import('@splinetool/react-spline').catch(() => { /* retried on mount */ });

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const enable = () => {
      // Cap devicePixelRatio before the Spline runtime initializes: on
      // 1.5×/2× Windows displays this cuts WebGL pixels ~40-60% with no
      // change to camera framing. (Our own canvas already caps itself.)
      if (window.devicePixelRatio > 1.25) {
        try {
          Object.defineProperty(window, 'devicePixelRatio', {
            get: () => 1.25,
            configurable: true,
          });
        } catch { /* read-only in some browsers — full-res fallback */ }
      }
      setShow3D(true);
    };
    // 3) Mount at the first breather — not after a long artificial wait
    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(enable, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(enable, 800);
    }
    return () => {
      if (idleId !== undefined && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  // ── Robot: hero companion → page backdrop ──────────────────────────
  // Starts positioned exactly over the hero's right column. As the hero
  // scrolls away, a scrub morphs it to screen center, scales it up and
  // dims it — it then lives fixed behind every section's content.
  useLayoutEffect(() => {
    if (!show3D) return;
    const wrap = robotWrapRef.current;
    const robot = robotRef.current;
    const heroZone = heroZoneRef.current;
    if (!wrap || !robot || !heroZone) return;

    const ctx = gsap.context(() => {
      // Hero position: centered on the right column (~25vw right of center)
      gsap.set(robot, { xPercent: -50, yPercent: -50, x: '25vw', y: '1vh' });

      // Entrance (matches the old hero fade-in)
      gsap.fromTo(wrap, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.1, ease: 'power2.out', delay: 0.25 });

      // Morph to backdrop as the hero leaves the viewport
      gsap.timeline({
        scrollTrigger: {
          trigger: heroZone,
          start: 'bottom 92%',
          end: 'bottom 30%',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
        .to(robot, { x: '0vw', y: '0vh', scale: 1.45, ease: 'none' }, 0)
        .to(robot, { opacity: 0.15, ease: 'none' }, 0.15);

      // The robot keeps pointer events in backdrop mode too, so its
      // head follows the cursor everywhere. Real UI (buttons, links,
      // cards) lives in positioned containers that paint above this
      // layer, so clicks on content are unaffected.

      // Gentle ambient drift once it's a backdrop (composited transform)
      gsap.to(wrap, {
        y: '1.2vh',
        duration: 7,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, [show3D]);

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (!state || !state.scrollTo) return;
    setTimeout(() => { scrollToSection(state.scrollTo!); }, 100);
  }, [location.state]);

  useEffect(() => {
    document.title = HOME_PAGE_TITLE;
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) descriptionTag.setAttribute('content', HOME_PAGE_DESCRIPTION);
  }, []);

  // ── Scroll color grading ────────────────────────────────────────────
  // Each [data-grade] zone tweens the FIXED viewport underlay's tint and
  // fades the ambient orbs to the mix in [data-orbs] as the zone crosses
  // mid-viewport. The underlay keeps repaints viewport-sized.
  useLayoutEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Touch-first devices count as mobile even at desktop widths
    // ("desktop site" mode on Android) — same repaint constraints apply.
    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(pointer: coarse)').matches;

    if (reduced) {
      const orange = orbRefs.current.orange;
      if (orange) gsap.set(orange, { opacity: 0.08 });
      return;
    }

    const ctx = gsap.context(() => {
      const zones = gsap.utils.toArray<HTMLElement>('[data-grade]', root);

      zones.forEach((zone) => {
        const bg = zone.dataset.grade!;
        const targets: Record<OrbKey, number> = { orange: 0, violet: 0, cyan: 0 };
        (zone.dataset.orbs ?? '').split(',').forEach((pair) => {
          const [key, val] = pair.split(':');
          const k = key?.trim() as OrbKey;
          if (k && k in targets) targets[k] = parseFloat(val) || 0;
        });

        const accent = zone.dataset.accent;
        const apply = () => {
          if (bgRef.current) {
            // Phones: snap the tint in one repaint — a 1.1s background tween
            // repaints the whole viewport every frame and stutters touch scroll.
            if (isMobile) gsap.set(bgRef.current, { backgroundColor: bg });
            else gsap.to(bgRef.current, { backgroundColor: bg, duration: 1.1, ease: 'power2.out', overwrite: 'auto' });
          }
          if (!isMobile) {
            (Object.keys(targets) as OrbKey[]).forEach((k) => {
              const orb = orbRefs.current[k];
              if (orb) gsap.to(orb, { opacity: targets[k], duration: 1.4, ease: 'power2.out', overwrite: 'auto' });
            });
          }
          if (accent) window.dispatchEvent(new CustomEvent(ACCENT_EVENT, { detail: accent }));
        };

        ScrollTrigger.create({
          trigger: zone,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: apply,
          onEnterBack: apply,
        });
      });

      // Slow ambient drift (desktop only — large moving layers cost on phones)
      if (!isMobile) {
        (Object.keys(orbRefs.current) as OrbKey[]).forEach((k, i) => {
          const orb = orbRefs.current[k];
          if (!orb) return;
          gsap.to(orb, {
            x: i % 2 === 0 ? '6vw' : '-6vw',
            y: '4vh',
            duration: 9 + i * 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative z-[2] bg-black">

      {/* ── Fixed viewport underlay — color grading tweens THIS, not the
           full-height root (viewport-sized repaints only) ── */}
      <div
        ref={bgRef}
        className="fixed inset-0 pointer-events-none"
        style={{ backgroundColor: '#050505' }}
        aria-hidden="true"
      />

      {/* ── Scroll-reactive canvas background (particle network + grid) ── */}
      <ScrollCanvasBackground />

      {/* ── Right-edge section dot navigation (desktop) ── */}
      <SectionNav />

      {/* ── Scroll-triggered "book a call" popup (once per session) ── */}
      <ScrollCTA />

      {/* ── Fixed ambient color-grade orbs (behind all sections) ── */}
      <div className="pointer-events-none" aria-hidden="true">
        <div
          ref={(el) => { orbRefs.current.orange = el; }}
          className="glow-orb fixed -top-[15vh] -left-[12vw] w-[60vw] h-[60vw] opacity-0"
          style={{ background: 'radial-gradient(circle, rgba(255,106,61,0.55) 0%, transparent 62%)' }}
        />
        <div
          ref={(el) => { orbRefs.current.violet = el; }}
          className="glow-orb fixed top-[20vh] -right-[18vw] w-[65vw] h-[65vw] opacity-0"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 62%)' }}
        />
        <div
          ref={(el) => { orbRefs.current.cyan = el; }}
          className="glow-orb fixed -bottom-[20vh] left-[10vw] w-[55vw] h-[55vw] opacity-0"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.4) 0%, transparent 62%)' }}
        />
      </div>

      {/* ── Robot: fixed layer — hero companion on load, then morphs into
           the backdrop behind every section (desktop only, idle-loaded).
           Painted before all sections, so their content covers it. ── */}
      {show3D && (
        <div
          ref={robotWrapRef}
          className="fixed inset-0 pointer-events-none hidden lg:block opacity-0"
          aria-hidden="true"
        >
          <div
            ref={robotRef}
            className="absolute left-1/2 top-1/2 w-[44vw] max-w-[720px] h-[62vh] xl:h-[66vh] min-h-[440px] will-change-transform"
            style={{ pointerEvents: 'auto' }}
          >
            <SplineScene
              scene={SPLINE_SCENE}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* 1 ── Hero (unchanged text/entrance; robot floats in the fixed layer) */}
      <div ref={heroZoneRef} data-grade="#050505" data-orbs="orange:0.10,violet:0.05" data-accent="#FF6A3D">
        <Hero />
      </div>

      {/* 2 ── Clients strip */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="border-y border-white/[0.06] py-7 md:py-9"
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 mb-4">
          <p className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-white/40 text-center">
            Trusted by ambitious brands worldwide
          </p>
        </div>
        <Marquee
          items={CLIENTS}
          speed={55}
          separator="·"
          scrollVelocity={false}
          className="text-[4.5vw] md:text-[1.8vw] font-black uppercase tracking-[0.08em] text-white/30"
        />
      </motion.div>

      {/* 3 ── Impact stats */}
      <div data-grade="#0A0604" data-orbs="orange:0.14" data-accent="#FF6A3D">
        <StatsSection />
      </div>

      {/* 4 ── Services */}
      <div data-grade="#0A0505" data-orbs="orange:0.14,violet:0.06" data-accent="#FF6A3D">
        <Services />
      </div>

      {/* 5 ── Software development */}
      <div data-grade="#06060E" data-orbs="violet:0.18,cyan:0.10" data-accent="#8B5CF6">
        <CodeShowcase />
      </div>

      {/* 6 ── Digital marketing */}
      <div data-grade="#0A0703" data-orbs="orange:0.18,cyan:0.06" data-accent="#FFC56A">
        <GrowthChart />
      </div>

      {/* 7 ── Process */}
      <div data-grade="#04080A" data-orbs="cyan:0.14,violet:0.08" data-accent="#22D3EE">
        <ProcessSection />
      </div>

      {/* 8 ── Work */}
      <div data-grade="#050505" data-orbs="orange:0.10" data-accent="#FF6A3D">
        <Projects />
      </div>

      {/* 9 ── Testimonials */}
      <div data-grade="#070409" data-orbs="violet:0.14,orange:0.06" data-accent="#8B5CF6">
        <Testimonials />
      </div>

      {/* 10 ── Founder */}
      <div data-grade="#0A0703" data-orbs="orange:0.14,violet:0.06" data-accent="#FFC56A">
        <Founder />
      </div>

      {/* 11 ── Contact */}
      <div data-grade="#0A0502" data-orbs="orange:0.16" data-accent="#FF6A3D">
        <Contact />
      </div>
    </div>
  );
};

export default LandingPage;
