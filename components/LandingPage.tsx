import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './Hero';
import Services from './Services';
import Projects from './Projects';
import Contact from './Contact';
import Testimonials from './Testimonials';
import StatsSection from './Stats';
import NetworkAndTrends from './NetworkAndTrends';
import ProcessSection from './ProcessSection';
import ScrollFillSection from './ScrollFillSection';
import CodeShowcase from './CodeShowcase';
import GrowthChart from './GrowthChart';
import Marquee from './Marquee';
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

const LandingPage: React.FC = () => {
  const location = useLocation();
  const mainRef  = useRef<HTMLDivElement>(null);
  const orbRefs  = useRef<Record<OrbKey, HTMLDivElement | null>>({ orange: null, violet: null, cyan: null });

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
  // Each [data-grade] zone tweens the page background to its tint and
  // fades the fixed ambient orbs to the mix declared in [data-orbs]
  // (e.g. "orange:0.14,violet:0.06") as the zone crosses mid-viewport.
  useLayoutEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

        const apply = () => {
          gsap.to(root, { backgroundColor: bg, duration: 1.1, ease: 'power2.out', overwrite: 'auto' });
          (Object.keys(targets) as OrbKey[]).forEach((k) => {
            const orb = orbRefs.current[k];
            if (orb) gsap.to(orb, { opacity: targets[k], duration: 1.4, ease: 'power2.out', overwrite: 'auto' });
          });
        };

        ScrollTrigger.create({
          trigger: zone,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: apply,
          onEnterBack: apply,
        });
      });

      // Slow ambient drift so the "lighting" never feels frozen
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
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative z-[2] bg-black">

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

      <div data-grade="#050505" data-orbs="orange:0.10,violet:0.05">
        <Hero />
      </div>

      {/* ── Pinned outline→fill statement (Dentsu-style scrollytelling) ── */}
      <div data-grade="#0A0604" data-orbs="orange:0.16">
        <ScrollFillSection />
      </div>

      {/* ── Kinetic marquee #1 — after hero ── */}
      <Marquee
        items={['Strategy', 'Design', 'Engineering', 'Growth', 'Brand', 'Content', 'Digital']}
        speed={30}
        className="border-y border-white/[0.06] py-4 md:py-6 text-[9vw] md:text-[5vw] font-black uppercase tracking-[-0.02em] text-white/80"
      />

      <div data-grade="#050505" data-orbs="orange:0.08,cyan:0.06">
        <StatsSection />
      </div>

      {/* ── Scroll-scrubbed code editor — software development story ── */}
      <div data-grade="#06060E" data-orbs="violet:0.18,cyan:0.10">
        <CodeShowcase />
      </div>

      <div data-grade="#04080A" data-orbs="cyan:0.14,violet:0.08">
        <ProcessSection />
      </div>

      {/* ── Kinetic marquee #2 — between process and services ── */}
      <Marquee
        items={['Accepting New Projects', '4AM Global Media', "Let's Build Something", 'Available Worldwide', 'Est. 2024']}
        speed={45}
        direction="right"
        separator="—"
        className="border-y border-white/[0.06] py-4 md:py-6 text-[4vw] md:text-[2vw] font-black uppercase tracking-[0.08em] text-white/25"
      />

      <div data-grade="#0A0505" data-orbs="orange:0.14,violet:0.06">
        <Services />
      </div>

      <div data-grade="#050505" data-orbs="orange:0.08">
        <Projects />
      </div>

      {/* ── Scroll-drawn growth curve — digital marketing story ── */}
      <div data-grade="#0A0703" data-orbs="orange:0.18,cyan:0.06">
        <GrowthChart />
      </div>

      {/* ── Clients strip ── */}
      <div className="border-t border-white/[0.06] py-8 md:py-10">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 mb-5">
          <p className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-white/15">
            Brands We've Worked With
          </p>
        </div>
        <Marquee
          items={CLIENTS}
          speed={55}
          separator="·"
          scrollVelocity={false}
          className="text-[3.5vw] md:text-[1.6vw] font-black uppercase tracking-[0.08em] text-white/12"
        />
      </div>

      <div data-grade="#04070A" data-orbs="cyan:0.12,violet:0.10">
        <NetworkAndTrends />
      </div>

      <div data-grade="#070409" data-orbs="violet:0.14,orange:0.06">
        <Testimonials />
      </div>

      <div data-grade="#0A0502" data-orbs="orange:0.16">
        <Contact />
      </div>
    </div>
  );
};

export default LandingPage;
