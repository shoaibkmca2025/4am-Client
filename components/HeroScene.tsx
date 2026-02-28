import React from 'react';
import { Activity, TrendingUp, Target } from 'lucide-react';
import TiltCard from './TiltCard';
import logo from '../assets/logo.jpeg';

const HeroScene: React.FC = () => {
  return (
    <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[520px] flex items-center justify-center perspective-1000 overflow-visible">
      {/* Cinematic Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-[#3B82F6]/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" 
        />
        <div 
          className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-[#6C63FF]/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" 
        />
        <div 
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-500/5 dark:bg-[#EC4899]/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" 
        />
      </div>

      {/* Main 3D Container */}
      <div 
        className="relative w-full max-w-[500px] h-[320px] sm:h-[400px] preserve-3d overflow-visible"
      >
        


        {/* === LAPTOP LAYER === */}
        <div
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <TiltCard 
            className="relative w-full max-w-[520px] group preserve-3d" 
            scale={1.02} 
            maxTilt={5}
            glow={true}
          >
             {/* Laptop Lid/Screen */}
            <div className="relative w-full aspect-[16/10] bg-white dark:bg-[#0f1115] rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden transform-gpu ring-1 ring-black/5 dark:ring-white/5">
               {/* Screen Gloss & Reflection */}
               <div 
                 className="absolute inset-0 bg-gradient-to-tr from-white/40 dark:from-white/10 via-transparent to-transparent z-20 pointer-events-none mix-blend-overlay opacity-40"
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
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-black">
                        <img src={logo} alt="4am" className="w-full h-full object-cover" />
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
                              <path 
                                d="M0,50 L0,35 C10,32 15,20 25,25 C35,30 40,40 50,35 C60,30 65,15 75,20 C85,25 90,10 100,5 L100,50 Z" 
                                fill="url(#chartGradient)" 
                              />
                              <path 
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
                             <div className="mt-6 text-xl font-bold text-slate-900 dark:text-white">+24.5%</div>
                             <div className="text-[10px] text-slate-500 dark:text-zinc-400">Growth Rate</div>
                          </div>
                          <div className="rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-3 relative overflow-hidden group shadow-sm dark:shadow-none">
                             <div className="absolute top-3 right-3 p-1.5 rounded-md bg-blue-500/10 text-blue-500">
                               <Target className="w-3 h-3" />
                             </div>
                             <div className="mt-6 text-xl font-bold text-slate-900 dark:text-white">892</div>
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
          </TiltCard>
        </div>

      </div>
    </div>
  );
};

export default HeroScene;
