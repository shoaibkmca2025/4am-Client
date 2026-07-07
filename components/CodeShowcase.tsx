import React, { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealText from './RevealText';
import DrawRule from './DrawRule';

gsap.registerPlugin(ScrollTrigger);

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Syntax token model ──────────────────────────────────────────────
type Tok = { t: string; c?: string };

const KW = 'text-[#B79CFF]';        // keywords — violet
const STR = 'text-[#FFC56A]';       // strings — gold
const FN = 'text-[#7DE3F4]';        // functions/classes — cyan
const CM = 'text-white/25';         // comments
const OR = 'text-[#FF8A5C]';        // values — orange
const PL = 'text-white/85';         // plain
const PU = 'text-white/40';         // punctuation

const CODE: Tok[][] = [
  [{ t: '// 4AM Global Media — growth-engine.ts', c: CM }],
  [{ t: 'import', c: KW }, { t: ' { ', c: PU }, { t: 'Brand', c: FN }, { t: ' } ', c: PU }, { t: 'from', c: KW }, { t: ' ', c: PL }, { t: "'@4am/core'", c: STR }, { t: ';', c: PU }],
  [],
  [{ t: 'const', c: KW }, { t: ' client ', c: PL }, { t: '= ', c: PU }, { t: 'new', c: KW }, { t: ' ', c: PL }, { t: 'Brand', c: FN }, { t: '(', c: PU }, { t: "'YourCompany'", c: STR }, { t: ');', c: PU }],
  [],
  [{ t: 'const', c: KW }, { t: ' stack ', c: PL }, { t: '= client.', c: PU }, { t: 'build', c: FN }, { t: '({', c: PU }],
  [{ t: '  web:    ', c: PL }, { t: "'fast + conversion-first'", c: STR }, { t: ',', c: PU }],
  [{ t: '  mobile: ', c: PL }, { t: "'iOS + Android'", c: STR }, { t: ',', c: PU }],
  [{ t: '  seo:    ', c: PL }, { t: "'technical + content'", c: STR }, { t: ',', c: PU }],
  [{ t: '});', c: PU }],
  [],
  [{ t: 'await', c: KW }, { t: ' stack.', c: PL }, { t: 'deploy', c: FN }, { t: '({ region: ', c: PU }, { t: "'global'", c: STR }, { t: ' });', c: PU }],
  [],
  [{ t: '// → +312% qualified pipeline', c: CM }],
  [{ t: 'export default', c: KW }, { t: ' client.', c: PL }, { t: 'scale', c: FN }, { t: '(', c: PU }, { t: '∞', c: OR }, { t: ');', c: PU }],
];

const FEATURES = [
  'High-performance websites & web apps',
  'iOS & Android mobile applications',
  'E-commerce & booking platforms',
  'Automation, APIs & integrations',
];

const LINE_H = 24; // px — must match leading-[24px] below

// The editor "types itself" ONCE when it scrolls into view — a short,
// self-playing moment instead of a pinned scroll-hijack.
const CodeShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      if (liveRef.current) gsap.set(liveRef.current, { autoAlpha: 1 });
      if (statusRef.current) statusRef.current.textContent = 'deployed ✓';
      return;
    }

    const ctx = gsap.context(() => {
      const codeLines = gsap.utils.toArray<HTMLElement>('.code-line', section);
      const toasts = gsap.utils.toArray<HTMLElement>('.code-toast', section);
      const marker = markerRef.current;
      const live = liveRef.current;

      gsap.set(codeLines, { autoAlpha: 0, x: -14 });
      gsap.set(toasts, { autoAlpha: 0, y: 16, scale: 0.85 });
      if (live) gsap.set(live, { autoAlpha: 0, scale: 0.6 });
      if (marker) gsap.set(marker, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 62%',
          once: true,
        },
        onUpdate() {
          if (statusRef.current) {
            statusRef.current.textContent = `shipping ${Math.round(tl.progress() * 100)}%`;
          }
        },
        onComplete() {
          if (statusRef.current) statusRef.current.textContent = 'deployed ✓';
        },
      });

      if (marker) tl.to(marker, { autoAlpha: 1, duration: 0.15 }, 0);
      codeLines.forEach((line, i) => {
        const pos = i * 0.14;
        tl.to(line, { autoAlpha: 1, x: 0, duration: 0.3, ease: 'power2.out' }, pos);
        if (marker) tl.to(marker, { y: i * LINE_H, duration: 0.12, ease: 'power2.out' }, pos);
      });
      // Notification toasts pop in as the "build" progresses
      const end = codeLines.length * 0.14;
      if (toasts[0]) tl.to(toasts[0], { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, end * 0.55);
      if (live) {
        tl.to(live, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.5)' }, end + 0.2);
      }
      if (toasts[1]) tl.to(toasts[1], { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, end + 0.45);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="engineering"
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-transparent border-t border-white/[0.06] overflow-hidden"
    >
      <DrawRule />
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: what we build ── */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: E }}
              className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-accent/80 block mb-5"
            >
              03 · Software Development
            </motion.span>
            <RevealText as="h2" className="block text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95] text-white">
              WE ENGINEER
            </RevealText>
            <RevealText as="h2" className="block text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95]" wordClassName="text-gradient-tech" delay={0.12}>
              GROWTH SYSTEMS
            </RevealText>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: E, delay: 0.2 }}
              className="mt-5 text-white/60 text-base leading-relaxed font-medium max-w-lg"
            >
              Websites, apps, and automation built like products — typed, tested,
              and shipped to production.
            </motion.p>

            {/* Feature checklist */}
            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } }}
              className="mt-8 space-y-3.5"
            >
              {FEATURES.map((feature) => (
                <motion.li
                  key={feature}
                  variants={{ hidden: { x: -20, opacity: 0 }, show: { x: 0, opacity: 1 } }}
                  transition={{ duration: 0.6, ease: E }}
                  className="flex items-center gap-3.5 text-sm md:text-base text-white/75 font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-brand-accent/15 border border-brand-accent/40 flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path d="M3.5 8.5l3 3 6-7" stroke="#B79CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {feature}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* ── Right: self-typing editor card + pop-in toasts ── */}
          <div className="relative">
            {/* Toast: build passed */}
            <div className="code-toast absolute -top-4 right-4 md:right-6 z-10 flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0D0D14] px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-brand-lime" />
              <span className="text-[11px] font-bold text-white/80">Build passed</span>
              <span className="text-[10px] font-mono text-white/30">1.2s</span>
            </div>
            {/* Toast: deployed */}
            <div className="code-toast absolute -bottom-5 left-4 md:left-6 z-10 flex items-center gap-2.5 rounded-xl border border-brand-primary/30 bg-[#120B07] px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 13V3M4 7l4-4 4 4" stroke="#FF8A5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[11px] font-bold text-white/80">Deployed to production</span>
            </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: E, delay: 0.15 }}
            className="rounded-xl border border-white/[0.08] bg-[#0A0A12] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-4 text-[11px] font-mono text-white/40">growth-engine.ts</span>
              <span
                ref={liveRef}
                className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-brand-lime"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse" />
                LIVE
              </span>
            </div>
            {/* Code body */}
            <div className="relative px-4 md:px-6 py-5 font-mono text-[12px] md:text-[13px] leading-[24px] overflow-x-auto no-scrollbar">
              <div
                ref={markerRef}
                className="absolute left-0 top-5 w-full h-[24px] bg-brand-accent/[0.07] border-l-2 border-brand-accent/60 pointer-events-none opacity-0"
                aria-hidden="true"
              />
              {CODE.map((line, i) => (
                <div key={i} className="code-line relative flex whitespace-pre min-h-[24px]">
                  <span className="w-8 shrink-0 text-right pr-4 text-white/15 select-none">{i + 1}</span>
                  <span>
                    {line.map((tok, j) => (
                      <span key={j} className={tok.c ?? PL}>{tok.t}</span>
                    ))}
                    {line.length === 0 ? ' ' : ''}
                  </span>
                </div>
              ))}
            </div>
            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] text-[10px] font-mono text-white/25">
              <span>TypeScript · main ✓</span>
              <span ref={statusRef} className="text-brand-cyan/70">shipping 0%</span>
            </div>
            {/* KPI footer */}
            <div className="grid grid-cols-3 border-t border-white/[0.06] text-center">
              {[
                { v: '99', l: 'Lighthouse' },
                { v: '<1.3s', l: 'Load Time' },
                { v: '0', l: 'Errors' },
              ].map((kpi) => (
                <div key={kpi.l} className="py-3 border-r border-white/[0.06] last:border-r-0">
                  <div className="text-base md:text-lg font-black text-white tabular-nums">{kpi.v}</div>
                  <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/20 mt-0.5">{kpi.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CodeShowcase;
