import React, { useLayoutEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroWord: React.FC<{ text: string; className: string; style?: React.CSSProperties }> = ({
  text,
  className,
  style,
}) => (
  <span className={`hero-word ${className}`} style={style}>
    {[...text].map((char, i) => (
      <span
        key={i}
        className="hero-char"
        style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : undefined }}
      >
        {char === ' ' ? ' ' : char}
      </span>
    ))}
  </span>
);

const Hero: React.FC = () => {
  const rootRef       = useRef<HTMLElement>(null);
  const subtitleRef   = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0.35, 0.9], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const bgScale     = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const bgOpacity   = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const chars    = gsap.utils.toArray<HTMLElement>('.hero-char', root);
      const subtitle = subtitleRef.current;
      const badge    = root.querySelector('.hero-badge');
      const bottomBar = root.querySelector('.hero-bottom');
      const bgLetter = root.querySelector('.hero-bg-letter');

      if (reduced) {
        gsap.set([chars, subtitle, badge, bottomBar, bgLetter], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(chars, { y: '110%', autoAlpha: 0 });
      if (subtitle)  gsap.set(subtitle,  { y: 28, autoAlpha: 0 });
      if (badge)     gsap.set(badge,     { y: 16, autoAlpha: 0 });
      if (bottomBar) gsap.set(bottomBar, { y: 16, autoAlpha: 0 });
      if (bgLetter)  gsap.set(bgLetter,  { autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      if (bgLetter) tl.to(bgLetter, { autoAlpha: 1, duration: 1.8 }, 0);

      // Character stagger across all words
      tl.to(chars, {
        y: '0%',
        autoAlpha: 1,
        duration: 1.1,
        stagger: { each: 0.022, from: 'start' },
      }, 0.1);

      if (badge)     tl.to(badge,     { y: 0, autoAlpha: 1, duration: 1.1 }, 0.4);
      if (subtitle)  tl.to(subtitle,  { y: 0, autoAlpha: 1, duration: 1.1 }, 0.65);
      if (bottomBar) tl.to(bottomBar, { y: 0, autoAlpha: 1, duration: 1   }, 0.85);

      if (scrollHintRef.current) {
        gsap.to(scrollHintRef.current, {
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: '+=250', scrub: 1 },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <motion.section
      id="home"
      ref={rootRef}
      style={{ opacity: heroOpacity, y: heroY }}
      // pointer-events-none: the hero has no clickable elements, and its
      // transparent box otherwise sits above the fixed robot layer and
      // swallows the mouse events the robot needs for head-tracking.
      className="relative min-h-screen supports-[height:100svh]:min-h-[100svh] flex items-center justify-center overflow-hidden bg-transparent pt-[70px] md:pt-[80px] pointer-events-none"
    >
      {/* Giant "4AM" background letter */}
      <motion.div
        className="hero-bg-letter absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ scale: bgScale, opacity: bgOpacity }}
        aria-hidden="true"
      >
        <span
          className="text-[40vw] md:text-[35vw] font-black text-transparent uppercase leading-none"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.04)', letterSpacing: '-0.05em' }}
        >
          4AM
        </span>
      </motion.div>

      {/* Concentric rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full border border-white/[0.03]" />
        <div className="absolute w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] rounded-full border border-white/[0.02]" />
      </div>

      <div className="hero-title-container relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10 text-center lg:text-left">
        <div className="lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">

          {/* Left — headline stack */}
          <div>
            {/* Badge */}
            <div className="hero-badge mb-6 md:mb-10">
              <span className="inline-block text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-white/40">
                A Creative Network Made For Today & Tomorrow
              </span>
            </div>

            {/* Main title — characters split for per-char stagger */}
            <h1 className="flex flex-col items-center lg:items-start gap-1 md:gap-2 overflow-hidden">
              <HeroWord
                text="WE BUILD"
                className="block text-[12vw] md:text-[10vw] lg:text-[6.2vw] font-black leading-[0.85] tracking-[-0.04em] uppercase text-white"
              />
              <HeroWord
                text="GROWTH"
                className="hero-grad block text-[12vw] md:text-[10vw] lg:text-[6.2vw] font-black leading-[0.85] tracking-[-0.04em] uppercase"
              />
              <HeroWord
                text="THROUGH"
                className="block text-[12vw] md:text-[10vw] lg:text-[6.2vw] font-black leading-[0.85] tracking-[-0.04em] uppercase text-white"
              />
              <HeroWord
                text="DIGITAL"
                className="block text-[12vw] md:text-[10vw] lg:text-[6.2vw] font-black leading-[0.85] tracking-[-0.04em] uppercase italic text-white/50"
              />
            </h1>

            {/* Subtitle */}
            <div ref={subtitleRef} className="mt-10 md:mt-16 lg:mt-8 max-w-2xl mx-auto lg:mx-0">
              <p className="text-white/40 text-sm md:text-base font-medium leading-relaxed">
                Powering founders, operators, and teams across the globe with strategy, design, engineering, and growth marketing that compounds.
              </p>
            </div>
          </div>

          {/* Right — layout spacer. The robot itself lives in a fixed
              layer in LandingPage (RobotBackdrop) positioned exactly
              here on load, so it can morph into the page background
              when the visitor scrolls. */}
          <div className="hidden lg:block relative h-[62vh] xl:h-[66vh] min-h-[440px]" aria-hidden="true" />
        </div>

        {/* Bottom bar */}
        <div className="hero-bottom mt-10 md:mt-14 lg:mt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] md:text-[11px] font-bold tracking-[0.25em] uppercase text-white/25 border-t border-white/[0.06] pt-6">
          <span>Strategy · Design · Engineering · Growth</span>
          <span className="flex items-center gap-2">
            Scroll to explore
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="animate-bounce">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-40"
        aria-hidden="true"
      >
        <div className="w-[1px] h-16 bg-white/20 scroll-line" />
        <div className="w-1 h-1 rounded-full bg-brand-primary" />
      </div>
    </motion.section>
  );
};

export default Hero;
