
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { Search, Layers, Code2, ShieldCheck, Rocket, Cpu, ChevronRight, Binary, Fingerprint, Radio } from 'lucide-react';

const steps = [
  {
    title: "The Signal Capture",
    phase: "01",
    subtitle: "DISCOVERY & AUDIT",
    desc: "We dive deep into your business DNA. Our architects capture market signals, user intent, and technical constraints to define the mission parameters.",
    icon: Search,
    color: "from-blue-600 to-indigo-600",
    tech: ["Market Audit", "User Research", "Technical Specs"],
    narrative: "Every great engine starts with a single spark of data. We map the terrain before we build the fortress."
  },
  {
    title: "Neural Architecture",
    phase: "02",
    subtitle: "SYSTEM DESIGN",
    desc: "Building the digital blueprint. We map out stateless architectures and high-velocity conversion funnels that ensure horizontal scalability from day zero.",
    icon: Layers,
    color: "from-indigo-600 to-purple-600",
    tech: ["System Design", "UI/UX Logic", "Schema Planning"],
    narrative: "Logic is the language of growth. We design systems that don't just work—they scale infinitely."
  },
  {
    title: "The Core Forge",
    phase: "03",
    subtitle: "ENGINEERING",
    desc: "Raw logic meets high-performance code. Our engineers build your product using a world-class stack optimized for sub-1ms execution and maximum stability.",
    icon: Code2,
    color: "from-purple-600 to-pink-600",
    tech: ["Clean Code", "API Integration", "CI/CD Setup"],
    narrative: "Turning blueprints into reality. We forge the core using the world's most robust development protocols."
  },
  {
    title: "Security Hardening",
    phase: "04",
    subtitle: "VALIDATION",
    desc: "No weak links. Every asset undergoes military-grade testing and conversion-friction analysis to ensure your software is a fortress of ROI.",
    icon: ShieldCheck,
    color: "from-pink-600 to-rose-600",
    tech: ["Unit Testing", "Penetration Scan", "CRO Audit"],
    narrative: "Growth without security is a liability. We harden every node to ensure your ROI is protected."
  },
  {
    title: "Orbital Deployment",
    phase: "05",
    subtitle: "LAUNCH & SCALE",
    desc: "Mission go. We push your platform to the global edge network, ensuring instant access for your users across every coordinate on the planet.",
    icon: Rocket,
    color: "from-rose-600 to-orange-500",
    tech: ["Edge Delivery", "DNS Propagation", "Live Monitoring"],
    narrative: "The world is your terminal. We deploy at the speed of light to the global edge network."
  }
];

const StepSlide: React.FC<{ step: typeof steps[0], index: number }> = ({ step, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [7, -7]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-7, 7]), { stiffness: 100, damping: 20 });
  const innerX = useSpring(useTransform(mouseX, [-200, 200], [-15, 15]), { stiffness: 100, damping: 20 });
  const innerY = useSpring(useTransform(mouseY, [-200, 200], [-15, 15]), { stiffness: 100, damping: 20 });
  const glintX = useTransform(mouseX, [-200, 200], ["0%", "100%"]);
  const glintY = useTransform(mouseY, [-200, 200], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-6 md:p-20 relative overflow-hidden">
      <motion.span 
        style={{ x: innerX, y: innerY }}
        className="absolute -bottom-20 -left-20 text-[35rem] md:text-[45rem] font-display font-bold text-slate-100 dark:text-white/5 pointer-events-none select-none leading-none z-0"
      >
        {step.phase}
      </motion.span>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-brand-primary" />
              <span className="text-brand-primary font-mono font-bold tracking-[0.4em] uppercase text-xs">Phase_{step.phase}</span>
            </div>
            
            <h3 className="text-4xl md:text-7xl lg:text-8xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
              {step.title.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h3>

            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-light italic leading-relaxed max-w-md">
              "{step.narrative}"
            </p>

            <div className="flex flex-wrap gap-3">
              {step.tech.map((t) => (
                <span key={t} className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-white/10">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center lg:justify-end">
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
              rotateX, 
              rotateY, 
              perspective: 1200,
              transformStyle: "preserve-3d" 
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="glass w-full max-w-2xl p-8 md:p-14 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-3xl relative group overflow-hidden cursor-none"
          >
            <motion.div 
              style={{ left: glintX, top: glintY }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-brand-primary/10 via-brand-accent/5 to-transparent blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
            />
            
            <div className="relative z-10 space-y-10" style={{ transform: "translateZ(50px)" }}>
              <div className="flex justify-between items-start">
                <motion.div 
                  style={{ x: innerX, y: innerY }}
                  className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-2xl shadow-brand-primary/20 transition-transform`}
                >
                  <step.icon className="w-10 h-10" />
                </motion.div>
                <div className="text-right">
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Module_Status</p>
                  <p className="text-sm font-bold text-emerald-500 uppercase flex items-center gap-2 justify-end">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Synchronized
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold text-brand-primary uppercase tracking-[0.4em]">{step.subtitle}</h4>
                <p className="text-xl md:text-3xl text-slate-700 dark:text-slate-200 font-medium leading-relaxed tracking-tight">
                  {step.desc}
                </p>
              </div>

              <div className="pt-10 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Input_Stream</span>
                    <span className="text-[10px] font-bold">STABLE</span>
                  </div>
                  <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Throughput</span>
                    <span className="text-[10px] font-bold">1.2GB/S</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-brand-primary group-hover:translate-x-2 transition-transform">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Next Phase</span>
                  <ChevronRight className="w-4 h-4 animate-bounce-x" />
                </div>
              </div>
            </div>

            <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
              <Binary className="w-32 h-32" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const DevelopmentJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(1);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate the active step based on scroll progress (0 to 1)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // There are 5 steps. We map the range 0-1 to 1-5.
    // 0.2 is the threshold for each step.
    const step = Math.min(steps.length, Math.floor(latest * steps.length) + 1);
    if (step !== activeStep && step > 0) {
      setActiveStep(step);
    }
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(steps.length - 1) * 100}%`]);
  const smoothX = useSpring(x, { stiffness: 50, damping: 20 });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);

  return (
    <section 
      ref={containerRef} 
      className="relative bg-white dark:bg-brand-obsidian"
      style={{ height: `${steps.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
          <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0.8, 0.4, 0.8, 0.4, 0.8, 0.4]) }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.04),transparent_70%)]" 
          />
        </div>

        <motion.div 
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute top-20 left-10 md:left-20 z-[60] pointer-events-none"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-brand-primary" />
            <span className="text-brand-primary font-mono font-bold tracking-[0.4em] uppercase text-xs">The Roadmap</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
            OUR STORY<br/>IN <span className="text-brand-primary">STEPS.</span>
          </h2>
        </motion.div>

        <motion.div 
          style={{ x: smoothX }}
          className="flex h-full w-max"
        >
          {steps.map((step, i) => (
            <StepSlide key={i} step={step} index={i} />
          ))}
        </motion.div>

        <div className="absolute bottom-12 left-10 right-10 md:left-20 md:right-20 flex flex-col gap-6 z-[60]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Navigation_Protocol</span>
                <span className="text-[10px] font-bold text-brand-primary animate-pulse">SCROLL_TO_ADVANCE</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-200 dark:bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Active_Phase</span>
                <span className="text-[10px] font-bold text-slate-900 dark:text-white font-mono">
                  PHASE_0{activeStep}
                </span>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-8">
               <div className="flex items-center gap-3">
                 <Fingerprint className="w-4 h-4 text-brand-primary" />
                 <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Identity_Verified</span>
               </div>
               <div className="flex items-center gap-3">
                 <Radio className="w-4 h-4 text-brand-primary animate-pulse" />
                 <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Neural_Sync_Active</span>
               </div>
            </div>
          </div>

          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden relative border border-slate-200 dark:border-white/5 shadow-inner">
             <motion.div 
               style={{ width: progressWidth }}
               className="h-full bg-brand-primary shadow-[0_0_15px_#2563EB] relative z-10"
             />
             {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
               <div key={i} className="absolute top-0 bottom-0 w-[1px] bg-slate-300 dark:bg-white/20" style={{ left: `${p * 100}%` }} />
             ))}
          </div>
        </div>

        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-brand-obsidian to-transparent z-50 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-brand-obsidian to-transparent z-50 pointer-events-none" />
      </div>
    </section>
  );
};

export default DevelopmentJourney;
