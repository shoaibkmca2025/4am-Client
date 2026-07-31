import React, { useEffect, useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { PROJECTS } from '../constants';
import RevealText from './RevealText';
import type { Project } from '../types';

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Five featured case studies fan out of the folder (offset -2 … +2).
const FEATURED = PROJECTS.slice(0, 5);

// The stage is authored at this pixel footprint (full open-fan width) and
// then uniformly scaled to fit the viewport — so the geometry is identical
// on every device and the fan never overflows on phones.
const STAGE_W = 740;

const projectImg = (p: Project) =>
  `https://picsum.photos/seed/${encodeURIComponent(p.title)}/600/760`;

const Projects: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [scale, setScale] = useState(1);
  const draggingRef = React.useRef(false);

  // Scale the whole stage down to fit narrow screens.
  useEffect(() => {
    const fit = () => {
      const avail = Math.min(window.innerWidth - 40, STAGE_W);
      setScale(Math.max(0.5, Math.min(1, avail / STAGE_W)));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const openProject = (p: Project) => {
    if (draggingRef.current) return; // it was a drag-to-close, not a tap
    window.open(p.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="work" className="relative py-16 md:py-24 bg-transparent overflow-hidden">
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 md:mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: E }}
              className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-primary/80 block mb-5"
            >
              06 · Latest Projects
            </motion.span>
            <RevealText as="h2" className="text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95] text-white">
              WORK THAT
            </RevealText>
            <RevealText as="h2" className="text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95]" wordClassName="text-gradient-brand" delay={0.12}>
              DELIVERS
            </RevealText>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: E, delay: 0.2 }}
            className="text-white/60 text-base leading-relaxed font-medium md:max-w-xs md:text-right md:pb-2"
          >
            Real clients, real results — open the folder to explore our work.
          </motion.p>
        </div>

        {/* ── Interactive folder gallery ──
             Motion is re-enabled here (the app disables framer transforms on
             touch for perf, but this small interactive piece needs them). */}
        <MotionConfig reducedMotion="never">
          <div className="relative w-full min-h-[520px] flex flex-col items-center justify-center select-none">
            <div
              className="relative flex justify-center pointer-events-none"
              style={{ width: STAGE_W, height: 520, transform: `scale(${scale})`, transformOrigin: 'center' }}
            >

              {/* Folder back pocket */}
              <motion.div
                className="absolute bottom-6 w-80 h-56 drop-shadow-2xl"
                animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.9 : 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute top-0 left-0 w-32 h-10 bg-gradient-to-t from-[#1e1e1e] to-[#2a2a2a] rounded-t-xl border-t border-l border-r border-white/10" />
                <div className="absolute top-8 left-0 right-0 bottom-0 bg-gradient-to-b from-[#1e1e1e] to-[#0a0a0a] rounded-b-xl rounded-tr-xl border border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" />
                <div className="absolute top-10 left-2 right-2 bottom-2 bg-black rounded-lg shadow-inner" />
              </motion.div>

              {/* Project cards */}
              <div className="absolute bottom-10 z-10 flex justify-center">
                {FEATURED.map((project, i) => {
                  const offset = i - 2;
                  const stackY = hover ? offset * -10 - 40 : offset * -5;
                  const stackX = hover ? offset * 34 : offset * 3;
                  const stackRotate = hover ? offset * 8 : offset * 3;
                  const stackScale = 1 - Math.abs(offset) * 0.03;

                  return (
                    <motion.div
                      key={project.id}
                      drag={isOpen}
                      dragSnapToOrigin
                      onDragStart={() => { draggingRef.current = true; }}
                      onDragEnd={(_e, info) => {
                        if (info.offset.y > 100 && isOpen) { setIsOpen(false); setHover(false); }
                        setTimeout(() => { draggingRef.current = false; }, 60);
                      }}
                      onClick={() => isOpen && openProject(project)}
                      className={`absolute bottom-0 w-52 h-72 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 origin-bottom ${
                        isOpen ? 'cursor-pointer active:cursor-grabbing pointer-events-auto' : 'pointer-events-none'
                      }`}
                      animate={!isOpen
                        ? { y: stackY, x: stackX, rotate: stackRotate, scale: stackScale, zIndex: i + 10 }
                        : { y: -120, x: offset * 130, rotate: 0, scale: 1.05, zIndex: 50 }}
                      whileHover={isOpen ? { y: -140, scale: 1.1, zIndex: 100 } : {}}
                      whileDrag={isOpen ? { scale: 1.15, rotate: 4, zIndex: 150 } : {}}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    >
                      <img
                        src={projectImg(project)}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />
                      <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 bg-black/70 px-2.5 py-1 rounded-full">
                        {project.industry ?? project.category}
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                        <h3 className="text-sm font-black uppercase tracking-[0.02em] text-white leading-tight">
                          {project.title}
                        </h3>
                        {project.result && (
                          <span className="mt-2 inline-block text-[9px] font-bold tracking-[0.15em] uppercase text-brand-secondary border border-brand-secondary/40 rounded-full px-2.5 py-1">
                            {project.result}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Folder front flap — click to open */}
              <motion.div
                className="absolute bottom-0 w-[340px] h-44 drop-shadow-[0_-20px_40px_rgba(0,0,0,0.8)] cursor-pointer z-20 pointer-events-auto"
                style={{ transformOrigin: 'bottom' }}
                animate={{
                  opacity: isOpen ? 0 : 1,
                  rotateX: hover ? -25 : 0,
                  y: hover ? 10 : 0,
                  pointerEvents: isOpen ? 'none' : 'auto',
                }}
                transition={{ duration: 0.4 }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => setIsOpen(true)}
              >
                <div className="w-full h-full bg-gradient-to-b from-[#2a2a2a] to-[#111] rounded-2xl border border-white/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)] relative overflow-hidden flex items-end justify-center pb-8">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <div className="px-5 py-2.5 bg-black rounded-lg border border-white/10 shadow-inner flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span className="text-white/90 text-sm font-bold tracking-wide uppercase">Our Work</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Hint text — swaps between "click to open" and "drag to close" */}
            <div className="absolute bottom-2 px-6 py-3 rounded-full border border-white/10 bg-white/[0.03] text-white/50 text-[10px] font-bold uppercase tracking-[0.25em] pointer-events-none">
              {isOpen ? 'Drag any card down to close · tap to open project' : 'Click the folder to open'}
            </div>
          </div>
        </MotionConfig>

      </div>
    </section>
  );
};

export default Projects;
