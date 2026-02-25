import React, { useEffect, useState, useRef } from 'react';
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Facebook, Instagram, BarChart3, Target, Activity, TrendingUp, Search, MessageSquare, Zap } from 'lucide-react';

const HeroScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  // Mouse parallax state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Layered springs for depth perception (Parallax effect)
  const springConfig = { stiffness: 40, damping: 30, mass: 1 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const backLayerX = useTransform(mouseXSpring, [-1, 1], [-20, 20]);
  const backLayerY = useTransform(mouseYSpring, [-1, 1], [-10, 10]);
  
  const midLayerX = useTransform(mouseXSpring, [-1, 1], [-40, 40]);
  const midLayerY = useTransform(mouseYSpring, [-1, 1], [-20, 20]);
  
  const frontLayerX = useTransform(mouseXSpring, [-1, 1], [-70, 70]);
  const frontLayerY = useTransform(mouseYSpring, [-1, 1], [-35, 35]);

  // 3D Rotations
  const rotateX = useTransform(mouseYSpring, [-1, 1], [5, -5]);
  const rotateY = useTransform(mouseXSpring, [-1, 1], [-5, 5]);

  // Lighting effects
  const lightX = useTransform(mouseXSpring, [-1, 1], [0, 100]);
  const lightOpacity = useTransform(mouseYSpring, [-1, 1], [0.3, 0.6]);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      // Calculate responsive scale for mobile/tablet
      const newScale = Math.min(Math.max(window.innerWidth / 600, 0.5), 1);
      setScale(newScale);

      if (window.innerWidth < 1024) {
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Floating icons configuration
  const icons = [
    { Icon: Facebook, color: 'text-[#3B82F6]', bg: 'bg-blue-50 dark:bg-[#3B82F6]/10', x: -140, y: -90, delay: 0, scale: 1 },
    { Icon: Instagram, color: 'text-[#EC4899]', bg: 'bg-pink-50 dark:bg-[#EC4899]/10', x: 160, y: -110, delay: 1.5, scale: 0.9 },
    { Icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10', x: -160, y: 80, delay: 0.5, scale: 1.1 },
    { Icon: Target, color: 'text-[#6C63FF]', bg: 'bg-indigo-50 dark:bg-[#6C63FF]/10', x: 180, y: 70, delay: 2, scale: 0.95 },
  ];

  return (
    <div ref={containerRef} className="relative w-full h-[600px] flex items-center justify-center perspective-1000 overflow-visible">
      {/* Cinematic Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-[#3B82F6]/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" 
        />
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-[#6C63FF]/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-500/5 dark:bg-[#EC4899]/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" 
        />
      </div>

      {/* Main 3D Container */}
      <motion.div 
        animate={{ scale }}
        transition={{ duration: 0.5 }}
        className="relative w-[500px] h-[400px] preserve-3d overflow-visible"
      >
        
        {/* === LAPTOP LAYER === */}
        <motion.div
          style={{ 
            x: midLayerX, 
            y: midLayerY,
            rotateX: rotateX,
            rotateY: rotateY,
          }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="relative w-[520px] group preserve-3d">
             {/* Laptop Lid/Screen */}
            <div className="relative w-full aspect-[16/10] bg-white dark:bg-[#0f1115] rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden transform-gpu ring-1 ring-black/5 dark:ring-white/5">
               {/* Screen Gloss & Reflection */}
               <motion.div 
                 style={{ opacity: lightOpacity, x: lightX }}
                 className="absolute inset-0 bg-gradient-to-tr from-white/40 dark:from-white/10 via-transparent to-transparent z-20 pointer-events-none mix-blend-overlay"
               />
               
               {/* Inner Bezel */}
               <div className="absolute inset-0 border-[6px] border-zinc-100 dark:border-[#1a1d24] rounded-2xl z-10 pointer-events-none">
                 {/* Webcam */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-200 dark:bg-[#1a1d24] rounded-b-lg flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 dark:bg-[#0f1115] ring-1 ring-white/10" />
                 </div>
               </div>

               {/* Dashboard UI Content */}
               <div className="absolute inset-0 bg-slate-50 dark:bg-[#0B0F19] p-6 pt-8 flex flex-col gap-4 overflow-hidden">
                 {/* Top Nav */}
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-brand-primary" />
                      </div>
                      <div className="h-2 w-24 bg-slate-200 dark:bg-white/10 rounded-full" />
                    </div>
                    <div className="flex gap-2">
                       <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20" />
                       <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20" />
                    </div>
                 </div>

                 {/* Main Content Grid */}
                 <div className="grid grid-cols-12 gap-4 h-full">
                    {/* Sidebar */}
                    <div className="col-span-3 h-full rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-3 flex flex-col gap-3">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full opacity-50" />
                       ))}
                    </div>
                    
                    {/* Main Chart Area */}
                    <div className="col-span-9 flex flex-col gap-4">
                       <div className="flex-1 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-4 relative overflow-hidden">
                          {/* Grid Background */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
                          
                          {/* Animated Graph Lines - SVG Area Chart */}
                          <div className="absolute bottom-0 left-0 right-0 h-40 px-4 pb-4">
                            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
                                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <motion.path 
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                d="M0,50 L0,35 C10,32 15,20 25,25 C35,30 40,40 50,35 C60,30 65,15 75,20 C85,25 90,10 100,5 L100,50 Z" 
                                fill="url(#chartGradient)" 
                              />
                              <motion.path 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                d="M0,35 C10,32 15,20 25,25 C35,30 40,40 50,35 C60,30 65,15 75,20 C85,25 90,10 100,5" 
                                fill="none" 
                                stroke="#3B82F6" 
                                strokeWidth="1.5" 
                                strokeLinecap="round" 
                              />
                            </svg>
                          </div>
                       </div>
                       
                       <div className="h-1/3 grid grid-cols-2 gap-4">
                          <div className="rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-3 relative overflow-hidden group shadow-sm dark:shadow-none">
                             <div className="absolute top-3 right-3 p-1.5 rounded-md bg-emerald-500/10 text-emerald-500">
                               <TrendingUp className="w-3 h-3" />
                             </div>
                             <div className="mt-6 text-xl font-bold text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">+24.5%</div>
                             <div className="text-[10px] text-slate-500 dark:text-zinc-400">Growth Rate</div>
                          </div>
                          <div className="rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-3 relative overflow-hidden group shadow-sm dark:shadow-none">
                             <div className="absolute top-3 right-3 p-1.5 rounded-md bg-blue-500/10 text-blue-500">
                               <Target className="w-3 h-3" />
                             </div>
                             <div className="mt-6 text-xl font-bold text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">892</div>
                             <div className="text-[10px] text-slate-500 dark:text-zinc-400">New Leads</div>
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Laptop Base (Keyboard Deck) */}
            <div 
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[110%] h-[16px] bg-zinc-200 dark:bg-[#1a1d24] rounded-b-xl shadow-2xl origin-top"
              style={{ transform: 'rotateX(-90deg) translateZ(10px)' }}
            >
               {/* Front Lip Highlight */}
               <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50 dark:bg-white/20" />
               {/* Shadow underneath */}
               <div className="absolute top-full left-[5%] w-[90%] h-12 bg-black/40 dark:bg-black/60 blur-xl rounded-[100%]" />
            </div>
          </div>
        </motion.div>

        {/* === PHONE LAYER === */}
        <motion.div
          style={{ 
            x: frontLayerX, 
            y: frontLayerY,
            rotateX: rotateX,
            rotateY: rotateY,
          }}
          className="absolute -bottom-16 -right-16 z-30 pointer-events-none"
        >
          <div className="relative w-[150px] h-[300px] bg-white dark:bg-[#0f1115] rounded-[2.5rem] border-[6px] border-zinc-200 dark:border-[#2a2e36] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.6)] overflow-hidden ring-1 ring-black/10 dark:ring-black/50">
            {/* Side Buttons */}
            <div className="absolute top-24 -right-[8px] w-[2px] h-10 bg-zinc-300 dark:bg-[#2a2e36] rounded-r-md" />
            <div className="absolute top-36 -right-[8px] w-[2px] h-10 bg-zinc-300 dark:bg-[#2a2e36] rounded-r-md" />
            
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-white dark:bg-[#0f1115] rounded-b-xl z-20 flex justify-center pt-1.5">
               <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-[#1a1d24]" />
            </div>

            {/* Screen Content */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-[#0B0F19] flex flex-col">
              {/* Status Bar */}
              <div className="h-8 w-full flex justify-between px-5 pt-3 items-center">
                 <div className="text-[8px] text-slate-900 dark:text-white font-mono">9:41</div>
                 <div className="flex gap-1">
                    <div className="w-3 h-1.5 border border-slate-400 dark:border-white/40 rounded-[1px]" />
                 </div>
              </div>

              {/* App UI */}
              <div className="flex-1 p-3 space-y-3 mt-2 overflow-hidden">
                 {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 2 + i * 0.2, type: "spring", stiffness: 100 }}
                    className="bg-white dark:bg-white/5 rounded-xl p-2 border border-slate-200 dark:border-white/5 backdrop-blur-sm flex gap-3 items-center shadow-sm dark:shadow-none"
                  >
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 ${
                        i === 1 ? 'bg-gradient-to-tr from-[#3B82F6] to-cyan-400' :
                        i === 2 ? 'bg-gradient-to-tr from-[#EC4899] to-rose-400' :
                        'bg-gradient-to-tr from-[#6C63FF] to-violet-400'
                    }`} />
                    <div className="space-y-1.5 w-full">
                        <div className="flex justify-between items-center w-full">
                            <div className="h-1.5 w-12 bg-slate-300 dark:bg-white/30 rounded-full" />
                            <div className="h-1 w-4 bg-slate-200 dark:bg-white/10 rounded-full" />
                        </div>
                        <div className="h-1.5 w-24 bg-slate-200 dark:bg-white/10 rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Bottom Home Indicator */}
              <div className="h-6 w-full flex justify-center items-end pb-2">
                 <div className="w-16 h-1 bg-slate-300 dark:bg-white/20 rounded-full" />
              </div>
            </div>

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-30 mix-blend-overlay" />
          </div>
        </motion.div>

        {/* === ATMOSPHERIC PARTICLES === */}
        <div className="absolute inset-0 pointer-events-none z-0">
             {[...Array(6)].map((_, i) => (
               <motion.div
                 key={i}
                 className="absolute w-1 h-1 bg-slate-400/40 dark:bg-white/40 rounded-full"
                 initial={{ 
                   x: Math.random() * 400 - 200, 
                   y: Math.random() * 300 - 150,
                   opacity: 0 
                 }}
                 animate={{ 
                   y: [0, -100], 
                   opacity: [0, 0.5, 0] 
                 }}
                 transition={{
                   duration: 5 + Math.random() * 5,
                   repeat: Infinity,
                   delay: Math.random() * 5,
                   ease: "linear"
                 }}
               />
             ))}
        </div>

      </motion.div>

      {/* === FLOATING ICONS LAYER (MOVED OUTSIDE 3D CONTAINER TO FIX CLIPPING) === */}
      <motion.div animate={{ scale: scale * 0.9 }}>
        {icons.map((icon, index) => (
          <motion.div
          key={index}
          style={{ 
            x: useTransform(mouseXSpring, [-1, 1], [icon.x - 30, icon.x + 30]),
            y: useTransform(mouseYSpring, [-1, 1], [icon.y - 30, icon.y + 30]),
          }}
          className="absolute left-1/2 top-1/2 z-50 pointer-events-none"
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5 + index,
              repeat: Infinity,
              ease: [0.25, 1, 0.5, 1], // Custom snappy ease for cinematic motion
              delay: icon.delay,
            }}
          >
            <div 
              className={`
                ${icon.bg} backdrop-blur-xl border border-zinc-200 dark:border-white/10 
                p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                transform transition-all duration-300
                ring-1 ring-black/5 dark:ring-white/30
              `}
              style={{ scale: icon.scale }}
            >
              <icon.Icon className={`w-8 h-8 ${icon.color} drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]`} strokeWidth={1.5} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HeroScene;
