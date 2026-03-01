import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Star, Terminal, Zap, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const testimonials = [
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
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const active = testimonials[index];

  // Auto-slide logic
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 6000); // 6 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, []);

  return (
    <section id="testimonials" className="relative py-24 overflow-hidden bg-brand-bg transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-brand-secondary/10 blur-[80px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-brand-primary/10 blur-[60px]" />
      </div>
      
      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <ScrollReveal className="max-w-3xl mx-auto mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-brand-surface shadow-clay text-brand-gray text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            Client Feedback
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold text-brand-dark leading-tight tracking-tight">
            Teams trust 4AM to handle the signal, not the noise.
          </h3>
        </ScrollReveal>

        <ScrollReveal className="max-w-4xl mx-auto" delay={100}>
          <div 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4 mb-8 px-4 sm:px-0">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-brand-surface shadow-soft flex items-center justify-center text-brand-dark hover:bg-brand-primary hover:text-white hover:shadow-clay-hover transition-all duration-300 group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            {/* Pagination Dots */}
            <div className="flex items-center gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-brand-primary w-8 shadow-sm' : 'bg-brand-gray/20 hover:bg-brand-gray/40 w-2'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-brand-surface shadow-soft flex items-center justify-center text-brand-dark hover:bg-brand-primary hover:text-white hover:shadow-clay-hover transition-all duration-300 group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* 2️⃣ TESTIMONIAL CARD ANIMATION */}
          <div className="relative h-auto min-h-[320px] sm:min-h-[300px] flex items-center justify-center">
            <div
              key={index}
              className="absolute w-full"
            >
              <div 
                className="relative p-8 sm:p-12 bg-brand-surface rounded-[32px] shadow-clay overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-clay-hover"
              >
                {/* Decorative Quote Mark */}
                <div className="absolute top-6 left-8 text-brand-primary/5">
                  <Quote size={80} fill="currentColor" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-8">
                  {/* Icon & Quote Symbol */}
                  <div className="relative">
                    <div 
                      className="w-16 h-16 rounded-2xl bg-brand-bg shadow-inner flex items-center justify-center text-brand-primary"
                    >
                      <active.icon size={28} strokeWidth={1.5} />
                    </div>
                    <div 
                      className="absolute -top-2 -right-2 w-8 h-8 bg-brand-surface rounded-full flex items-center justify-center shadow-clay border border-white/50"
                    >
                      <Quote size={12} className="text-brand-primary fill-current" />
                    </div>
                  </div>

                  {/* 3️⃣ TEXT ANIMATION: Staggered Fade In */}
                  <div 
                    className="max-w-2xl text-center"
                  >
                    <p className="text-xl sm:text-2xl font-medium text-brand-dark leading-relaxed">
                      "{active.quote}"
                    </p>
                  </div>

                  <div 
                    className="space-y-2 text-center"
                  >
                    <h4 className="font-bold text-brand-dark text-base uppercase tracking-widest">
                      {active.author}
                    </h4>
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-[1px] w-4 bg-brand-primary/30" />
                      <p className="text-xs text-brand-gray font-bold uppercase tracking-widest">
                        {active.role}
                      </p>
                      <div className="h-[1px] w-4 bg-brand-primary/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Testimonials;
