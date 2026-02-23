import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Code, Terminal, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const testimonials = [
  {
    id: 1,
    quote: 'Client testimonial goes here',
    author: 'Client Name',
    role: 'Company Name',
    icon: Code,
  },
  {
    id: 2,
    quote: 'The 4AM team brought clarity to our growth strategy and execution.',
    author: 'Sarah J.',
    role: 'Head of Marketing, SaaS Brand',
    icon: Terminal,
  },
  {
    id: 3,
    quote: 'We saw a meaningful lift in qualified pipeline within the first quarter.',
    author: 'Michael R.',
    role: 'Founder, DTC Brand',
    icon: Zap,
  },
  {
    id: 4,
    quote: 'Data, creative, and execution all feel aligned in a way they never did before.',
    author: 'David K.',
    role: 'Director, B2B Services',
    icon: Star,
  },
];

const Testimonials: React.FC = () => {
  const [index, setIndex] = React.useState(0);
  const active = testimonials[index];

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-32 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-brand-obsidian dark:via-[#050816] dark:to-brand-dark overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <ScrollReveal className="max-w-3xl mx-auto mb-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-brand-primary" />
            <span className="text-brand-primary font-mono font-bold tracking-[0.3em] uppercase text-xs">
              Testimonials
            </span>
            <div className="w-12 h-[2px] bg-brand-primary" />
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-zinc-50 leading-[1.1]">
            Teams trust 4AM
            <br />
            to handle the signal, not the noise.
          </h3>
        </ScrollReveal>

        <ScrollReveal className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              aria-label="Previous testimonial"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-200 hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex-1" />
            <button
              aria-label="Next testimonial"
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-200 hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="p-10 glass rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-white/5 backdrop-blur-md text-center transition-colors duration-500"
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-primary/30 via-brand-accent/30 to-brand-signal/30 flex items-center justify-center text-white">
                    <active.icon size={22} />
                  </div>
                  <p className="text-xl md:text-2xl font-medium text-slate-900 dark:text-zinc-50 leading-relaxed max-w-2xl">
                    “{active.quote}”
                  </p>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 dark:text-zinc-100 text-sm uppercase tracking-wide">
                      {active.author}
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">
                      {active.role}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {testimonials.map((t, i) => (
                      <span
                        key={t.id}
                        className={`h-1.5 rounded-full transition-all ${
                          i === index ? 'w-4 bg-brand-primary' : 'w-2 bg-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Testimonials;
