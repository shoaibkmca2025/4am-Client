import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const particles = useMemo(
    () =>
      Array.from({ length: 5 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 10 + Math.random() * 10,
        delay: Math.random() * 5,
      })),
    []
  );

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

  // Framer Motion variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
      }
    })
  };

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  return (
    <section id="testimonials" className="relative py-16 md:py-20 overflow-hidden bg-slate-50 dark:bg-[#050816] transition-colors duration-500">
      
      {/* 1️⃣ BACKGROUND ANIMATION: Animated Gradient Waves & Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cinematic Dark Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 dark:from-[#0B0F19] dark:via-[#050816] dark:to-[#020617] opacity-100" />
        
        {/* Slow Moving Glow Orbs */}
        <motion.div 
          animate={{ 
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            x: [0, -70, 70, 0],
            y: [0, 50, -50, 0],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
        />
        
        {/* Floating Particles */}
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-slate-400/30 dark:bg-white/20 rounded-full"
            initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0 }}
            animate={{ 
              y: [0, -100], 
              opacity: [0, 0.5, 0] 
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <ScrollReveal className="max-w-3xl mx-auto mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-brand-primary" />
            <span className="text-brand-primary font-mono font-bold tracking-[0.3em] uppercase text-xs">
              Testimonials
            </span>
            <div className="w-12 h-[2px] bg-brand-primary" />
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-zinc-50 leading-[1.15]">
            Teams trust 4AM
            <br />
            to handle the signal, not the noise.
          </h3>
        </ScrollReveal>

        <ScrollReveal className="max-w-4xl mx-auto" delay={200}>
          <div 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4 mb-8 px-4 sm:px-0">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm flex items-center justify-center text-slate-600 dark:text-zinc-200 hover:border-brand-primary/50 dark:hover:border-white/30 transition-colors shadow-sm dark:shadow-none group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </motion.button>
            
            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-colors duration-300 ${i === index ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-zinc-700 hover:bg-slate-400 dark:hover:bg-zinc-600'}`}
                  initial={false}
                  animate={{ width: i === index ? 24 : 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm flex items-center justify-center text-slate-600 dark:text-zinc-200 hover:border-brand-primary/50 dark:hover:border-white/30 transition-colors shadow-sm dark:shadow-none group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>

          {/* 2️⃣ TESTIMONIAL CARD ANIMATION */}
          <div className="relative h-auto min-h-[320px] sm:min-h-[300px] flex items-center justify-center perspective-1000">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full"
              >
                <motion.div 
                  whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(124, 58, 237, 0.15)" }}
                  className="relative p-5 sm:p-6 md:p-8 glass rounded-2xl border border-slate-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-white/5 backdrop-blur-xl text-center shadow-xl dark:shadow-2xl overflow-hidden group"
                >
                  {/* Soft Radial Glow behind card content */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand-primary/5 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Gradient Border Glow on Hover */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-brand-primary/20 transition-colors duration-500 pointer-events-none" />

                  <div className="relative z-10 flex flex-col items-center gap-8">
                    {/* Icon & Quote Symbol */}
                    <div className="relative">
                      <motion.div 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-primary/10 to-brand-accent/10 flex items-center justify-center text-brand-primary ring-1 ring-brand-primary/20 shadow-lg shadow-brand-primary/10"
                      >
                        <active.icon size={24} strokeWidth={1.5} />
                      </motion.div>
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-brand-dark rounded-full flex items-center justify-center shadow-md border border-slate-100 dark:border-white/10"
                      >
                        <Quote size={10} className="text-brand-primary fill-current" />
                      </motion.div>
                    </div>

                    {/* 3️⃣ TEXT ANIMATION: Staggered Fade In */}
                    <motion.div 
                      variants={textContainerVariants}
                      initial="hidden"
                      animate="visible"
                      className="max-w-2xl"
                    >
                      <p className="text-lg sm:text-xl md:text-2xl font-medium text-slate-900 dark:text-zinc-50 leading-relaxed font-display">
                        {active.quote.split(" ").map((word, i) => (
                          <motion.span key={i} variants={wordVariants} className="inline-block mr-1.5 origin-bottom">
                            {word}
                          </motion.span>
                        ))}
                      </p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-1"
                    >
                      <h4 className="font-bold text-slate-900 dark:text-zinc-100 text-sm uppercase tracking-wide">
                        {active.author}
                      </h4>
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-[1px] w-4 bg-brand-primary/50" />
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono uppercase tracking-widest">
                          {active.role}
                        </p>
                        <div className="h-[1px] w-4 bg-brand-primary/50" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Testimonials;
