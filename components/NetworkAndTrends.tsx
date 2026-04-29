import React, { useRef, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, MotionConfig } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealText from './RevealText';

gsap.registerPlugin(ScrollTrigger);

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LOCATIONS = ['New Delhi', 'Dubai', 'London', 'New York', 'Singapore', 'Sydney'];

const TRENDS = [
  { number: '01', title: 'The Rise of AI-Driven Marketing',  category: 'Technology', excerpt: 'How artificial intelligence is reshaping how brands connect with their audiences at scale.' },
  { number: '02', title: 'Short-Form Video Dominance',       category: 'Content',    excerpt: 'Why sub-60 second video content is outperforming every other format in engagement metrics.' },
  { number: '03', title: 'First-Party Data Strategy',        category: 'Strategy',   excerpt: 'Building sustainable growth without relying on third-party cookies or invasive tracking.' },
  { number: '04', title: 'Community-Led Growth',             category: 'Growth',     excerpt: 'The shift from funnel-based to community-based marketing and its impact on brand loyalty.' },
];

const trendVariant = {
  hidden: { y: 30, opacity: 0 },
  show:   { y: 0,  opacity: 1 },
};

const NetworkAndTrends: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const ringRef    = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const globalBgX  = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const trendsBgX  = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const ring    = ringRef.current;
    if (!section || !ring) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Ring scroll-scrub rotation (kept in GSAP for scrub)
      gsap.to(ring, {
        rotate: 30,
        ease: 'none',
        scrollTrigger: { trigger: ring, start: 'top bottom', end: 'bottom top', scrub: 2 },
      });
    }, section);

    // Trend row hover
    const trendEls = section.querySelectorAll<HTMLElement>('.trend-item');
    const cleanups: Array<() => void> = [];

    trendEls.forEach((item) => {
      const title = item.querySelector<HTMLElement>('.trend-title');
      const arrow = item.querySelector<HTMLElement>('.trend-arrow');
      const line  = item.querySelector<HTMLElement>('.trend-line');

      const onEnter = () => {
        if (title) gsap.to(title, { x: 14, duration: 0.45, ease: 'expo.out' });
        if (arrow) gsap.to(arrow, { rotate: 45, scale: 1.1, duration: 0.4, ease: 'expo.out' });
        if (line)  gsap.to(line,  { scaleX: 1, duration: 0.6, ease: 'expo.out', transformOrigin: 'left center' });
      };
      const onLeave = () => {
        if (title) gsap.to(title, { x: 0, duration: 0.4, ease: 'expo.out' });
        if (arrow) gsap.to(arrow, { rotate: 0, scale: 1, duration: 0.35, ease: 'expo.out' });
        if (line)  gsap.to(line,  { scaleX: 0, duration: 0.4, ease: 'expo.in', transformOrigin: 'right center' });
      };

      item.addEventListener('mouseenter', onEnter);
      item.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        item.removeEventListener('mouseenter', onEnter);
        item.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
  <MotionConfig reducedMotion="user">
    <section ref={sectionRef} className="relative bg-black overflow-hidden">

      {/* ── Global Network ── */}
      <div className="relative py-16 md:py-24 border-t border-white/[0.06] overflow-hidden">
        {/* Scroll-parallax ghost word */}
        <motion.div
          className="absolute inset-0 flex items-center justify-start pl-[3%] pointer-events-none select-none"
          style={{ x: globalBgX }}
          aria-hidden="true"
        >
          <span className="text-[14vw] font-black uppercase leading-none tracking-[-0.05em] text-transparent whitespace-nowrap"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.022)' }}>
            NETWORK
          </span>
        </motion.div>
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — text slides in from left */}
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1, ease: E }}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: E }}
                className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-white/25 block mb-5"
              >
                Global Network
              </motion.span>
              <RevealText as="h2" className="block text-[8vw] md:text-[5vw] lg:text-[4vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-white">
                POWERED BY
              </RevealText>
              <RevealText as="h2" className="block text-[8vw] md:text-[5vw] lg:text-[4vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-transparent mb-6" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.12)' }} delay={0.12}>
                A GLOBAL TEAM
              </RevealText>
              <p className="text-white/30 text-sm md:text-base leading-relaxed font-medium max-w-md mb-8">
                Our distributed team spans multiple time zones, ensuring your campaigns never sleep. When you work with 4AM, you work with the world.
              </p>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                className="flex flex-wrap gap-x-5 gap-y-2.5"
              >
                {LOCATIONS.map((loc) => (
                  <motion.span
                    key={loc}
                    variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.5, ease: E }}
                    className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/20 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20" />{loc}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — ring slides from right + continuous float */}
            <motion.div
              initial={{ x: 60, opacity: 0, scale: 0.9 }}
              whileInView={{ x: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.1, ease: E, delay: 0.1 }}
              className="flex items-center justify-center"
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
              <div ref={ringRef} className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px]">
                <div className="absolute inset-0 rounded-full border border-white/[0.07]" />
                <div className="absolute inset-[13%] rounded-full border border-white/[0.05]" />
                <div className="absolute inset-[27%] rounded-full border border-white/[0.04]" />
                <div className="absolute inset-[41%] rounded-full bg-white/[0.03]" />

                {LOCATIONS.map((loc, i) => {
                  const angle = (i / LOCATIONS.length) * 360 - 90;
                  const rad   = (angle * Math.PI) / 180;
                  const r     = 47;
                  return (
                    <motion.div
                      key={loc}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                      className="absolute flex flex-col items-center"
                      style={{ left: `${50 + r * Math.cos(rad)}%`, top: `${50 + r * Math.sin(rad)}%`, transform: 'translate(-50%,-50%)' }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white/50 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                      <span className="mt-1.5 text-[7px] font-bold tracking-[0.15em] uppercase text-white/25 whitespace-nowrap">{loc}</span>
                    </motion.div>
                  );
                })}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-black text-white/80 tracking-[-0.03em]">4AM</div>
                    <div className="text-[9px] font-bold tracking-[0.35em] uppercase text-white/20 mt-1">GLOBAL</div>
                  </div>
                </div>
              </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Trends ── */}
      <div className="relative py-16 md:py-24 border-t border-white/[0.06] overflow-hidden">
        {/* Scroll-parallax ghost word — drifts opposite direction */}
        <motion.div
          className="absolute inset-0 flex items-center justify-end pr-[3%] pointer-events-none select-none"
          style={{ x: trendsBgX }}
          aria-hidden="true"
        >
          <span className="text-[14vw] font-black uppercase leading-none tracking-[-0.05em] text-transparent whitespace-nowrap"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.022)' }}>
            INSIGHTS
          </span>
        </motion.div>
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 md:mb-14">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: E }}
                className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-white/25 block mb-5"
              >
                Latest Thinking
              </motion.span>
              <RevealText as="h2" className="block text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-white">
                TRENDS
              </RevealText>
              <RevealText as="h2" className="block text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.12)' }} delay={0.12}>
                & INSIGHTS
              </RevealText>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: E, delay: 0.2 }}
              className="text-white/30 text-sm md:text-base max-w-sm leading-relaxed font-medium md:text-right md:pb-2"
            >
              Our perspective on the forces shaping digital marketing, technology, and brand growth.
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="border-t border-white/[0.06]"
          >
            {TRENDS.map((trend) => (
              <motion.div key={trend.number} variants={trendVariant} transition={{ duration: 0.7, ease: E }}>
                <div className="trend-item group relative flex items-start md:items-center gap-6 md:gap-10 py-7 md:py-9 border-b border-white/[0.06] cursor-pointer">
                  <span className="trend-line absolute left-0 right-0 bottom-0 h-px bg-white/20 origin-left scale-x-0 pointer-events-none" />
                  <span className="text-xs font-bold tracking-[0.2em] text-white/15 w-10 shrink-0 pt-1 md:pt-0">{trend.number}</span>
                  <span className="hidden md:block text-[10px] font-bold tracking-[0.2em] uppercase text-white/20 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 shrink-0">{trend.category}</span>
                  <h3 className="trend-title text-lg md:text-2xl lg:text-3xl font-bold text-white group-hover:text-white/60 transition-colors duration-300 flex-1 tracking-tight">{trend.title}</h3>
                  <p className="hidden xl:block text-white/20 text-xs max-w-xs leading-relaxed font-medium text-right">{trend.excerpt}</p>
                  <div className="trend-arrow w-10 h-10 rounded-full border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-white transition-colors duration-300 text-white/30 group-hover:text-black">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  </MotionConfig>
  );
};

export default NetworkAndTrends;
