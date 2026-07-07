import React, { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealText from './RevealText';
import DrawRule from './DrawRule';

gsap.registerPlugin(ScrollTrigger);

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Chart geometry — viewBox 0 0 800 420, baseline y=400
const POINTS: [number, number][] = [
  [40, 360], [160, 330], [280, 300], [400, 240], [520, 190], [640, 120], [760, 60],
];

const LINE_D =
  'M40,360 C100,352 120,340 160,330 C210,318 240,315 280,300 C330,281 360,262 400,240 C445,215 480,208 520,190 C570,167 600,148 640,120 C685,89 720,78 760,60';
const AREA_D = `${LINE_D} L760,400 L40,400 Z`;

const MILESTONES: { i: number; label: string; big?: boolean }[] = [
  { i: 0, label: 'Launch' },
  { i: 2, label: 'SEO compounds' },
  { i: 4, label: 'Paid scale' },
  { i: 6, label: '4.2x ROAS', big: true },
];

const KPIS = [
  { label: 'Return on Ad Spend', to: 4.2, fmt: (v: number) => `${v.toFixed(1)}x`, color: 'text-brand-primary' },
  { label: 'Click-Through Rate', to: 186, fmt: (v: number) => `+${Math.round(v)}%`, color: 'text-brand-secondary' },
  { label: 'Acquisition Cost', to: 38, fmt: (v: number) => `−${Math.round(v)}%`, color: 'text-brand-lime' },
  { label: 'Qualified Pipeline', to: 312, fmt: (v: number) => `+${Math.round(v)}%`, color: 'text-brand-cyan' },
];

const CHANNELS = ['SEO', 'Paid Ads', 'Social', 'Email', 'Content'];

// The chart draws itself ONCE when scrolled into view (~2.2s) —
// a self-playing data story instead of a pinned scroll section.
const GrowthChart: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const kpiRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return; // JSX already renders the final state

    const ctx = gsap.context(() => {
      const line = lineRef.current;
      const area = areaRef.current;
      const dots = gsap.utils.toArray<HTMLElement>('.growth-dot', section);
      const chips = gsap.utils.toArray<HTMLElement>('.growth-chip', section);
      const channels = gsap.utils.toArray<HTMLElement>('.growth-channel', section);
      const toasts = gsap.utils.toArray<HTMLElement>('.growth-toast', section);

      const len = line ? line.getTotalLength() : 0;
      if (line && len > 0) gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      if (area) gsap.set(area, { opacity: 0 });
      gsap.set(dots, { scale: 0, transformOrigin: 'center center' });
      gsap.set(chips, { autoAlpha: 0, y: 10 });
      gsap.set(channels, { autoAlpha: 0.25 });
      gsap.set(toasts, { autoAlpha: 0, y: 16, scale: 0.85 });

      KPIS.forEach((kpi, i) => {
        const el = kpiRefs.current[i];
        if (el) el.textContent = kpi.fmt(0);
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 58%',
          once: true,
        },
      });

      if (line && len > 0) tl.to(line, { strokeDashoffset: 0, duration: 2, ease: 'power1.inOut' }, 0);
      if (area) tl.to(area, { opacity: 1, duration: 1.2, ease: 'none' }, 0.6);

      dots.forEach((dot, i) => {
        tl.to(dot, { scale: 1, duration: 0.3, ease: 'back.out(2.5)' }, (i / (dots.length - 1)) * 2);
      });

      MILESTONES.forEach((m, idx) => {
        const chip = chips[idx];
        if (!chip) return;
        tl.to(chip, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, (m.i / (POINTS.length - 1)) * 2 + 0.1);
      });

      channels.forEach((ch, i) => {
        tl.to(ch, { autoAlpha: 1, duration: 0.25 }, 0.4 + i * 0.25);
      });

      KPIS.forEach((kpi, i) => {
        const el = kpiRefs.current[i];
        if (!el) return;
        const proxy = { val: 0 };
        tl.to(proxy, {
          val: kpi.to,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = kpi.fmt(proxy.val); },
        }, 0.5 + i * 0.2);
      });

      // CRM-style notification toasts pop over the chart mid-growth
      if (toasts[0]) tl.to(toasts[0], { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, 0.9);
      if (toasts[1]) tl.to(toasts[1], { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, 1.7);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="growth"
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-transparent border-t border-white/[0.06] overflow-hidden"
    >
      <DrawRule />
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: E }}
              className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-primary/80 block mb-5"
            >
              04 · Digital Marketing
            </motion.span>
            <RevealText as="h2" className="block text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95] text-white">
              MARKETING THAT
            </RevealText>
            <RevealText as="h2" className="block text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95]" wordClassName="text-gradient-brand" delay={0.12}>
              COMPOUNDS
            </RevealText>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: E, delay: 0.2 }}
            className="text-white/60 text-base leading-relaxed font-medium md:max-w-sm md:text-right md:pb-2"
          >
            Every channel wired to revenue — here's what a typical 4AM engagement curve looks like.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {/* ── Chart ── */}
          <div className="lg:col-span-3 relative rounded-xl border border-white/[0.08] bg-white/[0.015] p-4 md:p-8">
            <div className="relative">
              <svg viewBox="0 0 800 420" className="w-full h-auto" role="img" aria-label="Growth curve — revenue rising from launch to 4.2x return on ad spend">
                <defs>
                  <linearGradient id="growthStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FF6A3D" />
                    <stop offset="100%" stopColor="#FFC56A" />
                  </linearGradient>
                  <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6A3D" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#FF6A3D" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[60, 120, 180, 240, 300, 360].map((y) => (
                  <line key={y} x1="40" y1={y} x2="760" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                ))}
                <line x1="40" y1="400" x2="760" y2="400" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

                <path ref={areaRef} d={AREA_D} fill="url(#growthFill)" />
                <path
                  ref={lineRef}
                  d={LINE_D}
                  fill="none"
                  stroke="url(#growthStroke)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {POINTS.map(([x, y], i) => (
                  <g key={i} className="growth-dot">
                    <circle cx={x} cy={y} r="10" fill="rgba(255,106,61,0.15)" />
                    <circle cx={x} cy={y} r="4.5" fill="#0A0A0A" stroke="#FF8A5C" strokeWidth="2.5" />
                  </g>
                ))}
              </svg>

              {/* CRM-style pop-in notifications */}
              <div className="growth-toast absolute left-[6%] top-[14%] z-10 hidden sm:flex items-center gap-2.5 rounded-xl border border-brand-cyan/25 bg-[#06090B] px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <span className="w-6 h-6 rounded-full bg-brand-cyan/15 border border-brand-cyan/40 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                    <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM2.5 14a5.5 5.5 0 0111 0" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <div>
                  <div className="text-[11px] font-bold text-white/85 leading-tight">New qualified lead</div>
                  <div className="text-[9px] text-white/30 font-medium">via Google Ads · just now</div>
                </div>
              </div>
              <div className="growth-toast absolute left-[34%] top-[46%] z-10 hidden sm:flex items-center gap-2.5 rounded-xl border border-brand-lime/25 bg-[#080A05] px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <span className="w-6 h-6 rounded-full bg-brand-lime/15 border border-brand-lime/40 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                    <path d="M3.5 8.5l3 3 6-7" stroke="#A3E635" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <div className="text-[11px] font-bold text-white/85 leading-tight">Deal closed</div>
                  <div className="text-[9px] text-white/30 font-medium">from paid campaign</div>
                </div>
              </div>

              {MILESTONES.map((m) => {
                const [x, y] = POINTS[m.i];
                return (
                  <div
                    key={m.label}
                    className={`growth-chip absolute -translate-x-1/2 -translate-y-[135%] whitespace-nowrap rounded-full border px-3 py-1 text-[9px] md:text-[10px] font-bold tracking-[0.15em] uppercase ${
                      m.big
                        ? 'border-brand-primary/50 bg-brand-primary/15 text-brand-secondary'
                        : 'border-white/10 bg-black/80 text-white/60'
                    }`}
                    style={{ left: `${(x / 800) * 100}%`, top: `${(y / 420) * 100}%` }}
                  >
                    {m.label}
                  </div>
                );
              })}
            </div>

            {/* Channel chips */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/20 mr-2">Channels</span>
              {CHANNELS.map((ch) => (
                <span
                  key={ch}
                  className="growth-channel rounded-full border border-brand-primary/25 bg-brand-primary/[0.06] px-3.5 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-brand-secondary/80"
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>

          {/* ── KPI column ── */}
          <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-px bg-white/[0.06] rounded-xl overflow-hidden border border-white/[0.08]">
            {KPIS.map((kpi, i) => (
              <div key={kpi.label} className="bg-[#0A0806] p-5 md:p-6 flex flex-col justify-center">
                <div
                  ref={(el) => { kpiRefs.current[i] = el; }}
                  className={`text-3xl md:text-4xl font-black tracking-[-0.03em] tabular-nums leading-none ${kpi.color}`}
                >
                  {kpi.fmt(kpi.to)}
                </div>
                <div className="mt-2.5 text-[9px] md:text-[10px] font-bold tracking-[0.22em] uppercase text-white/50">
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthChart;
