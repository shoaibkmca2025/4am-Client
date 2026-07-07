import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { scrollToSection } from '../utils/scroll';

gsap.registerPlugin(ScrollTrigger);

const DISMISS_KEY = '4am-cta-dismissed';

// Scroll-triggered conversion popup: slides in once the visitor has read
// deep into the page (testimonials), dismissible, shows once per session.
const ScrollCTA: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    const trigger = ScrollTrigger.create({
      trigger: '#testimonials',
      start: 'top 65%',
      once: true,
      onEnter: () => {
        if (!sessionStorage.getItem(DISMISS_KEY)) setVisible(true);
      },
    });
    return () => trigger.kill();
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, '1');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="fixed bottom-24 right-4 md:right-6 z-[9985] w-[calc(100vw-2rem)] max-w-[320px] rounded-2xl border border-brand-primary/30 bg-[#0C0806] shadow-[0_18px_50px_rgba(0,0,0,0.6)] p-5"
          role="dialog"
          aria-label="Book a free strategy call"
        >
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/40">
              Ready when you are
            </span>
          </div>
          <p className="text-sm font-bold text-white leading-snug mb-4">
            Get a free growth plan for your business — no strings attached.
          </p>
          <button
            onClick={() => { dismiss(); scrollToSection('contact'); }}
            className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-black text-[10px] font-black tracking-[0.18em] uppercase hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            Book a free call
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M4 8h8M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollCTA;
