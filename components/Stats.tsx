import React from 'react';
import ScrollReveal from './ScrollReveal';
import TiltCard from './TiltCard';

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
    <section id="about" className="py-16 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <TiltCard className="w-full">
          <div className="bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm rounded-[32px] p-10 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center justify-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="relative group text-center py-4 md:py-0"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="text-4xl md:text-5xl font-bold text-white tracking-tight group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                      {values[index]}{stat.suffix}
                    </div>
                    <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
};

export default StatsSection;
