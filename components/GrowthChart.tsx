import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealText from './RevealText';

gsap.registerPlugin(ScrollTrigger);

// Chart geometry — viewBox 0 0 800 420, baseline y=400
const POINTS: [number, number][] = [
  [40, 360], [160, 330], [280, 300], [400, 240], [520, 190], [640, 120], [760, 60],
];

const LINE_D =
  'M40,360 C100,352 120,340 160,330 C210,318 240,315 280,300 C330,281 360,262 400,240 C445,215 480,208 520,190 C570,167 600,148 640,120 C685,89 720,78 760,60';
const AREA_D = `${LINE_D} L760,400 L40,400 Z`;

// Milestone chips anchored to curve points (index → label)
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

const GrowthChart: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const kpiRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Static final state for mobile / reduced-motion — JSX already renders it
    if (reduced || isMobile) return;

    const ctx = gsap.context(() => {
      const line = lineRef.current;
      const area = areaRef.current;
      const dots = gsap.utils.toArray<HTMLElement>('.growth-dot', section);
      const chips = gsap.utils.toArray<HTMLElement>('.growth-chip', section);
      const channels = gsap.utils.toArray<HTMLElement>('.growth-channel', section);

      const len = line ? line.getTotalLength() : 0;
      if (line && len > 0) {
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      }
      if (area) gsap.set(area, { opacity: 0 });
      gsap.set(dots, { scale: 0, transformOrigin: 'center center' });
      gsap.set(chips, { autoAlpha: 0, y: 10 });
      gsap.set(channels, { autoAlpha: 0.25 });

      // Zero the KPI counters before the scrub drives them
      KPIS.forEach((kpi, i) => {
        const el = kpiRefs.current[i];
        if (el) el.textContent = kpi.fmt(0);
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Curve draws across most of the pin
      if (line && len > 0) tl.to(line, { strokeDashoffset: 0, duration: 6, ease: 'none' }, 0);
      if (area) tl.to(area, { opacity: 1, duration: 2.5, ease: 'none' }, 1.5);

      // Data points pop as the line reaches them
      dots.forEach((dot, i) => {
        tl.to(dot, { scale: 1, duration: 0.35, ease: 'back.out(2.5)' }, (i / (dots.length - 1)) * 6);
      });

      // Milestone chips follow their anchor points
      MILESTONES.forEach((m, idx) => {
        const chip = chips[idx];
        if (!chip) return;
        tl.to(chip, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, (m.i / (POINTS.length - 1)) * 6 + 0.15);
      });

      // Channel chips light up one by one
      channels.forEach((ch, i) => {
        tl.to(ch, { autoAlpha: 1, duration: 0.3 }, 1 + i * 0.9);
      });

      // KPI counters run through the second half
      KPIS.forEach((kpi, i) => {
        const el = kpiRefs.current[i];
        if (!el) return;
        const proxy = { val: 0 };
        tl.to(proxy, {
          val: kpi.to,
          duration: 3,
          ease: 'power1.inOut',
          onUpdate: () => { el.textContent = kpi.fmt(proxy.val); },
        }, 2 + i * 0.5);
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="growth"
      className="relative bg-transparent border-t border-white/[0.06] md:min-h-screen flex flex-col justify-center py-16 md:py-20 overflow-hidden"
    >
      {/* Ghost word */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span
          className="text-[20vw] font-black uppercase leading-none whitespace-nowrap tracking-[-0.05em] text-transparent"
          style={{ WebkitTextStroke: '1px rgba(255,106,61,0.045)' }}
        >
          GROWTH
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-primary/60 block mb-5">
              Digital Marketing
            </span>
            <RevealText as="h2" className="block text-[8vw] md:text-[5.5vw] lg:text-[4.5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-white">
              MARKETING THAT
            </RevealText>
            <RevealText as="h2" className="block text-[8vw] md:text-[5.5vw] lg:text-[4.5vw] font-black uppercase tracking-[-0.03em] leading-[0.9]" wordClassName="text-gradient-brand" delay={0.12}>
              COMPOUNDS
            </RevealText>
          </div>
          <p className="text-white/30 text-sm md:text-base leading-relaxed font-medium md:max-w-sm md:text-right md:pb-2">
            Every channel wired to revenue. Watch a typical 4AM engagement curve — drawn by your scroll.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {/* ── Chart ── */}
          <div className="lg:col-span-3 relative rounded-xl border border-white/[0.08] bg-white/[0.015] backdrop-blur-sm p-4 md:p-8">
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

                {/* Grid */}
                {[60, 120, 180, 240, 300, 360].map((y) => (
                  <line key={y} x1="40" y1={y} x2="760" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                ))}
                {/* Baseline */}
                <line x1="40" y1="400" x2="760" y2="400" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

                {/* Area + line */}
                <path ref={areaRef} d={AREA_D} fill="url(#growthFill)" />
                <path
                  ref={lineRef}
                  d={LINE_D}
                  fill="none"
                  stroke="url(#growthStroke)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Data points */}
                {POINTS.map(([x, y], i) => (
                  <g key={i} className="growth-dot">
                    <circle cx={x} cy={y} r="10" fill="rgba(255,106,61,0.15)" />
                    <circle cx={x} cy={y} r="4.5" fill="#0A0A0A" stroke="#FF8A5C" strokeWidth="2.5" />
                  </g>
                ))}
              </svg>

              {/* Milestone chips — HTML overlay anchored to chart coordinates */}
              {MILESTONES.map((m) => {
                const [x, y] = POINTS[m.i];
                return (
                  <div
                    key={m.label}
                    className={`growth-chip absolute -translate-x-1/2 -translate-y-[135%] whitespace-nowrap rounded-full border px-3 py-1 text-[9px] md:text-[10px] font-bold tracking-[0.15em] uppercase backdrop-blur-sm ${
                      m.big
                        ? 'border-brand-primary/50 bg-brand-primary/15 text-brand-secondary'
                        : 'border-white/10 bg-black/60 text-white/60'
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
                <div className="mt-2.5 text-[9px] md:text-[10px] font-bold tracking-[0.22em] uppercase text-white/25">
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
