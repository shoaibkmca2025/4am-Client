
import React, { useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { Zap } from 'lucide-react';

const MonkeyThemeToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { theme, toggleTheme } = useTheme();
  const [isPulling, setIsPulling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pullControls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction values for the "swing" effect
  const mouseX = useMotionValue(0);
  const smoothRotation = useSpring(useTransform(mouseX, [-60, 60], [-18, 18]), {
    stiffness: 120,
    damping: 12
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isPulling) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const offset = e.clientX - centerX;
    mouseX.set(offset);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
  };

  const handlePull = async () => {
    if (isPulling) return;
    setIsPulling(true);

    // Pull down animation
    await pullControls.start({
      y: 45,
      transition: { duration: 0.18, ease: "circOut" }
    });

    toggleTheme();

    // Snap back
    await pullControls.start({
      y: 0,
      transition: { type: "spring", stiffness: 700, damping: 12 }
    });

    setIsPulling(false);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col items-center select-none z-50 transition-transform duration-300 ${compact ? 'scale-[0.8]' : 'scale-100'}`}
      style={{ height: compact ? '80px' : '140px', width: '100px' }}
    >
      {/* HUD Telemetry */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: (isHovered && !compact) ? 1 : 0, 
          x: isHovered ? 55 : 20 
        }}
        className="absolute top-4 right-[-110px] pointer-events-none hidden lg:block z-50"
      >
        <div className="glass px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 flex flex-col gap-0.5 shadow-3xl">
           <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">OPTIC_SIGNAL</span>
           <span className={`text-xs font-mono font-bold uppercase ${theme === 'dark' ? 'text-brand-signal' : 'text-amber-500'}`}>
             {theme === 'dark' ? 'MIDNIGHT_MODE' : 'DAYLIGHT_MODE'}
           </span>
        </div>
      </motion.div>

      {/* The Swinging Assembly */}
      <motion.div
        style={{ 
          rotate: smoothRotation,
          originY: "-50px" 
        }}
        className="relative cursor-pointer flex flex-col items-center group/pull"
        onClick={handlePull}
      >
        {/* Support Rope */}
        <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[1.5px] h-[50px] bg-gradient-to-b from-transparent via-slate-400/40 to-slate-400/80" />

        {/* Monkey Head */}
        <div className="relative">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-3xl filter transition-all duration-300">
            <circle cx="30" cy="30" r="24" fill={theme === 'dark' ? '#1E293B' : '#F1F5F9'} stroke={theme === 'dark' ? '#334155' : '#cbd5e1'} strokeWidth="1.5"/>
            <path d="M30 48C40 48 48 40 48 30C48 20 40 12 30 12C20 12 12 20 12 30C12 40 20 48 30 48Z" fill={theme === 'dark' ? '#0F172A' : '#ffffff'} />
            
            {/* Interactive Eyes */}
            <motion.circle 
              animate={{ 
                fill: theme === 'dark' ? '#00F0FF' : '#2563EB',
                r: isHovered ? 3 : 2.5,
              }}
              cx="22" cy="28" r="2.5" 
            />
            <motion.circle 
              animate={{ 
                fill: theme === 'dark' ? '#00F0FF' : '#2563EB',
                r: isHovered ? 3 : 2.5,
              }}
              cx="38" cy="28" r="2.5" 
            />
            
            {/* Mouth */}
            <motion.path 
              animate={{ d: isHovered ? "M24 40 Q30 45 36 40" : "M25 40 Q30 41 35 40" }}
              stroke={theme === 'dark' ? '#334155' : '#94a3b8'} 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round" 
            />
            
            {/* Ears */}
            <circle cx="8" cy="30" r="7" fill={theme === 'dark' ? '#1E293B' : '#E2E8F0'} />
            <circle cx="52" cy="30" r="7" fill={theme === 'dark' ? '#1E293B' : '#E2E8F0'} />
          </svg>
        </div>

        {/* The Vertical Pull Cord */}
        <motion.div
          animate={pullControls}
          className="absolute left-1/2 -translate-x-1/2 top-[45px] flex flex-col items-center px-4"
        >
          {/* Extended Hit Area */}
          <div className="absolute inset-0 w-full h-[80px] cursor-pointer" />
          
          <motion.div 
            style={{ originY: 0 }}
            animate={{ height: isPulling ? 55 : 38 }}
            className="w-[2px] bg-gradient-to-b from-slate-400 via-slate-500 to-slate-800 dark:from-slate-600 dark:via-slate-700 dark:to-slate-900 shadow-xl" 
          />
          
          {/* Handle */}
          <div className="relative group/handle">
            <motion.div 
              animate={{ 
                scale: isPulling ? 0.75 : 1,
                backgroundColor: theme === 'dark' ? '#00F0FF' : '#2563EB',
                boxShadow: theme === 'dark' ? '0 0 25px #00F0FF' : '0 0 20px rgba(37,99,235,0.4)'
              }}
              className="w-5 h-8 rounded-2xl border border-white/40 flex items-center justify-center transition-all shadow-2xl"
            >
              <Zap className="w-2.5 h-2.5 text-white fill-white" />
            </motion.div>
            
            {/* Interactive Pulse */}
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute inset-[-6px] rounded-full border border-dashed ${theme === 'dark' ? 'border-brand-signal' : 'border-brand-primary'}`}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Flare Transition */}
      <AnimatePresence>
        {isPulling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/10 dark:bg-brand-signal/5 pointer-events-none z-[300] mix-blend-overlay"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MonkeyThemeToggle;
