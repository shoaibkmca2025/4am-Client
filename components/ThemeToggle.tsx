
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';

const ThemeToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 overflow-hidden ${
        compact ? 'w-full px-2 py-3' : 'w-full px-6 py-4'
      } bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-brand-primary/50 group shadow-sm hover:shadow-brand-primary/10`}
      aria-label="Toggle Theme"
    >
      <div className="relative z-10 flex items-center gap-3">
        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
          theme === 'light' ? 'bg-amber-500 shadow-[0_0_8px_#F59E0B]' : 'bg-brand-signal shadow-[0_0_8px_#00F0FF]'
        }`} />
        
        <AnimatePresence mode="wait">
          {theme === 'light' ? (
            <motion.span
              key="light-text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-600 dark:text-slate-400"
            >
              DAYLIGHT
            </motion.span>
          ) : (
            <motion.span
              key="dark-text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-signal"
            >
              MIDNIGHT
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      {/* Tactical Background Scanline */}
      <motion.div 
        className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      
      {/* Subtle border glow for current active state */}
      <div className={`absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-r ${
        theme === 'light' ? 'from-amber-500/5 to-transparent' : 'from-brand-signal/5 to-transparent'
      }`} />
    </button>
  );
};

export default ThemeToggle;
