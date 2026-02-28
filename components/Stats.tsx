import React from 'react';
import ScrollReveal from './ScrollReveal';

const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Projects launched', value: 120, suffix: '+' },
    { label: 'Average client growth', value: 3.4, suffix: 'x' },
    { label: 'Campaign reach', value: 18, suffix: 'M' }
  ];

  const [values, setValues] = React.useState(stats.map(() => 0));

  React.useEffect(() => {
    const duration = 1200;
    const frameRate = 24;
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let frame = 0;

    const interval = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);

      setValues(
        stats.map((stat) =>
          Number((stat.value * progress).toFixed(stat.value % 1 === 0 ? 0 : 1))
        )
      );

      if (progress === 1) {
        window.clearInterval(interval);
      }
    }, 1000 / frameRate);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-16 md:py-20 bg-gradient-to-b from-slate-50 via-white to-transparent dark:from-brand-dark dark:via-[#050816] dark:to-transparent">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500">
              Results / Stats
            </p>
            <h2 className="mt-3 text-2xl md:text-[32px] font-display font-semibold text-slate-900 dark:text-white">
              Numbers from 4AM Global Media clients
            </h2>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
            We focus on visibility that converts: measurable lifts in traffic, trust,
            and qualified pipeline for founders and teams.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal
              key={stat.label}
              delay={index * 80}
              className="glass rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 md:p-6 flex flex-col gap-2"
            >
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </span>
              <span className="text-2xl md:text-3xl font-display font-semibold text-slate-900 dark:text-white">
                {values[index]}
                {stat.suffix}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
