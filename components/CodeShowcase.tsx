import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealText from './RevealText';

gsap.registerPlugin(ScrollTrigger);

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
  [{ t: 'import', c: KW }, { t: ' { ', c: PU }, { t: 'Brand', c: FN }, { t: ', ', c: PU }, { t: 'Campaign', c: FN }, { t: ' } ', c: PU }, { t: 'from', c: KW }, { t: ' ', c: PL }, { t: "'@4am/core'", c: STR }, { t: ';', c: PU }],
  [],
  [{ t: 'const', c: KW }, { t: ' client ', c: PL }, { t: '= ', c: PU }, { t: 'new', c: KW }, { t: ' ', c: PL }, { t: 'Brand', c: FN }, { t: '(', c: PU }, { t: "'YourCompany'", c: STR }, { t: ');', c: PU }],
  [],
  [{ t: 'const', c: KW }, { t: ' stack ', c: PL }, { t: '= client.', c: PU }, { t: 'build', c: FN }, { t: '({', c: PU }],
  [{ t: '  web:    ', c: PL }, { t: "'high-performance + conversion-first'", c: STR }, { t: ',', c: PU }],
  [{ t: '  seo:    ', c: PL }, { t: "'technical + content engine'", c: STR }, { t: ',', c: PU }],
  [{ t: '  ads:    ', c: PL }, { t: '[', c: PU }, { t: "'Meta'", c: STR }, { t: ', ', c: PU }, { t: "'Google'", c: STR }, { t: ', ', c: PU }, { t: "'LinkedIn'", c: STR }, { t: ']', c: PU }, { t: ',', c: PU }],
  [{ t: '  social: ', c: PL }, { t: "'always-on content'", c: STR }, { t: ',', c: PU }],
  [{ t: '});', c: PU }],
  [],
  [{ t: 'await', c: KW }, { t: ' stack.', c: PL }, { t: 'deploy', c: FN }, { t: '({ region: ', c: PU }, { t: "'global'", c: STR }, { t: ' });', c: PU }],
  [{ t: 'client.', c: PL }, { t: 'track', c: FN }, { t: '([', c: PU }, { t: "'traffic'", c: STR }, { t: ', ', c: PU }, { t: "'leads'", c: STR }, { t: ', ', c: PU }, { t: "'revenue'", c: STR }, { t: ']);', c: PU }],
  [],
  [{ t: '// output → +312% qualified pipeline', c: CM }],
  [{ t: 'export default', c: KW }, { t: ' client.', c: PL }, { t: 'scale', c: FN }, { t: '(', c: PU }, { t: '∞', c: OR }, { t: ');', c: PU }],
];

const TERMINAL: { cmd?: string; ok?: string }[] = [
  { cmd: 'npm run build' },
  { ok: 'compiled in 1.24s — 0 errors' },
  { cmd: 'vitest run' },
  { ok: '48 tests passed' },
  { cmd: 'lighthouse ./production' },
  { ok: 'performance 99 · seo 100 · a11y 100' },
  { cmd: 'git push origin main' },
  { ok: 'deployed → production' },
];

const LINE_H = 24; // px — must match leading-[24px] below

const CodeShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Static render (final state) — mobile and reduced-motion users
    if (reduced || isMobile) {
      if (liveRef.current) gsap.set(liveRef.current, { autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const codeLines = gsap.utils.toArray<HTMLElement>('.code-line', section);
      const termLines = gsap.utils.toArray<HTMLElement>('.term-line', section);
      const marker = markerRef.current;
      const live = liveRef.current;

      gsap.set(codeLines, { autoAlpha: 0, x: -14 });
      gsap.set(termLines, { autoAlpha: 0, y: 8 });
      if (live) gsap.set(live, { autoAlpha: 0, scale: 0.6 });
      if (marker) gsap.set(marker, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=170%',
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            if (statusRef.current) {
              statusRef.current.textContent = `shipping ${Math.round(self.progress * 100)}%`;
            }
          },
        },
      });

      // Editor lines type in across the first ~60% of the pin
      if (marker) tl.to(marker, { autoAlpha: 1, duration: 0.2 }, 0);
      codeLines.forEach((line, i) => {
        const pos = (i / codeLines.length) * 6;
        tl.to(line, { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power2.out' }, pos);
        if (marker) tl.to(marker, { y: i * LINE_H, duration: 0.25, ease: 'power2.out' }, pos);
      });

      // Terminal output streams in across the last ~40%
      termLines.forEach((line, i) => {
        tl.to(line, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 6.4 + i * 0.42);
      });

      if (live) {
        tl.to(live, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.5)' }, 9.9);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="engineering"
      className="relative bg-transparent border-t border-white/[0.06] md:min-h-screen flex flex-col justify-center py-16 md:py-20 overflow-hidden"
    >
      {/* Ghost word */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span
          className="text-[22vw] font-black uppercase leading-none whitespace-nowrap tracking-[-0.05em] text-transparent"
          style={{ WebkitTextStroke: '1px rgba(139,92,246,0.05)' }}
        >
          CODE
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-accent/60 block mb-5">
              Software Development
            </span>
            <RevealText as="h2" className="block text-[8vw] md:text-[5.5vw] lg:text-[4.5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-white">
              WE ENGINEER
            </RevealText>
            <RevealText as="h2" className="block text-[8vw] md:text-[5.5vw] lg:text-[4.5vw] font-black uppercase tracking-[-0.03em] leading-[0.9]" wordClassName="text-gradient-tech" delay={0.12}>
              GROWTH SYSTEMS
            </RevealText>
          </div>
          <p className="text-white/30 text-sm md:text-base leading-relaxed font-medium md:max-w-sm md:text-right md:pb-2">
            Websites, apps, and automation built like products — typed, tested, and shipped to production. Keep scrolling to run the build.
          </p>
        </div>

        {/* Editor + terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
          {/* ── Code editor ── */}
          <div className="lg:col-span-3 rounded-xl border border-white/[0.08] bg-[#0A0A12] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-4 text-[11px] font-mono text-white/40">growth-engine.ts</span>
              <span className="ml-auto text-[10px] font-mono text-brand-accent/70">● 4am-global</span>
            </div>
            {/* Code body */}
            <div className="relative px-4 md:px-6 py-5 font-mono text-[12px] md:text-[13px] leading-[24px] overflow-x-auto no-scrollbar">
              {/* Active-line marker */}
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
              <span>TypeScript · UTF-8 · main ✓</span>
              <span ref={statusRef} className="text-brand-cyan/70">shipping 0%</span>
            </div>
          </div>

          {/* ── Terminal ── */}
          <div className="lg:col-span-2 rounded-xl border border-white/[0.08] bg-[#060608] overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <span className="text-[11px] font-mono text-white/40">zsh — deploy</span>
              <span
                ref={liveRef}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-brand-lime"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="flex-1 px-4 md:px-5 py-5 font-mono text-[12px] md:text-[13px] leading-[26px]">
              {TERMINAL.map((line, i) => (
                <div key={i} className="term-line whitespace-pre-wrap break-words">
                  {line.cmd ? (
                    <><span className="text-brand-primary">$ </span><span className="text-white/80">{line.cmd}</span></>
                  ) : (
                    <><span className="text-brand-lime">✓ </span><span className="text-white/45">{line.ok}</span></>
                  )}
                </div>
              ))}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeShowcase;
