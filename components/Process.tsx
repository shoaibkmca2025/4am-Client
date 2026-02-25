import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Zap, Rocket, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Audit & Logic',
    description: 'We disassemble your current stack and identify the friction points slowing down your velocity.',
    metric: '100% Transparency'
  },
  {
    icon: Zap,
    title: 'Strategy Protocol',
    description: 'Custom-engineering a growth algorithm tailored to your market position and goals.',
    metric: 'Precision Targeting'
  },
  {
    icon: Rocket,
    title: 'Execution & Deployment',
    description: 'Launching the campaign with military precision. Continuous monitoring and optimization.',
    metric: 'High Velocity'
  },
  {
    icon: CheckCircle2,
    title: 'Scale & Loop',
    description: 'Analyzing the data feedback loop to iterate and scale what works.',
    metric: 'Recursive Growth'
  }
];

const Process: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-32 bg-zinc-50 dark:bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24">

          {/* Left: Sticky Header */}
          <div className="md:w-1/3">
            <div className="sticky top-32">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[2px] bg-brand-primary" />
                <span className="text-brand-primary font-mono font-bold tracking-[0.3em] uppercase text-xs">Operating System</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-display font-bold text-zinc-900 dark:text-white uppercase leading-[0.9] mb-8">
                HOW WE <br /> <span className="text-zinc-400">COMPILE</span> <br /> SUCCESS.
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                A deterministic process for probabilistic markets. We remove the guesswork.
              </p>
            </div>
          </div>

          {/* Right: Steps */}
          <div ref={containerRef} className="md:w-2/3 relative pl-8 md:pl-0" style={{ position: 'relative' }}>
            {/* Connecting Line */}
            <div className="absolute left-0 md:left-8 top-0 bottom-0 w-[1px] bg-zinc-200 dark:bg-zinc-800">
              <motion.div
                style={{ height: lineHeight }}
                className="w-full bg-brand-primary origin-top shadow-[0_0_15px_#2563EB]"
              />
            </div>

            <div className="space-y-24">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative pl-12 md:pl-20"
                >
                  {/* Node Dot */}
                  <div className="absolute left-[-5px] md:left-[27px] top-0 w-3 h-3 rounded-full border-2 border-brand-primary bg-white dark:bg-black z-10" />

                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-brand-primary shadow-sm">
                      <step.icon size={24} />
                    </div>
                    <h4 className="text-2xl font-display font-bold text-zinc-900 dark:text-white uppercase">{step.title}</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.description}</p>
                    <div className="inline-flex items-center gap-2 mt-2">
                      <span className="h-[1px] w-8 bg-brand-primary/50" />
                      <span className="text-xs font-mono font-bold text-brand-primary uppercase tracking-widest">{step.metric}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
