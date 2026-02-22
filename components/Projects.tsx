import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { ArrowUpRight, X, Code2, ChevronRight } from 'lucide-react';

const ProjectCard: React.FC<{ project: Project; index: number; onClick: () => void }> = ({ project, index, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [2, -2]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-2, 2]), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover="hover"
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-10px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="relative group cursor-pointer w-full h-full"
    >
      <div className="absolute -inset-1 bg-brand-primary/5 rounded-[1rem] opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 pointer-events-none" />

      <div className="relative glass rounded-[1rem] overflow-hidden border border-white/20 dark:border-white/5 transition-all duration-400 shadow-md group-hover:shadow-lg group-hover:border-brand-primary/20">
        {/* Ultra-Cinematic wide aspect ratio (2.6:1) to keep cards short */}
        <div className="relative aspect-[2.6/1] overflow-hidden">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transform scale-100 group-hover:scale-102 transition-transform duration-[0.8s] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 transition-opacity duration-500" />

          <div className="absolute top-2 left-2">
            <motion.span
              variants={{
                hover: { scale: 1.15, opacity: 1, y: 0 },
                initial: { scale: 1, opacity: 0.7, y: 2 }
              }}
              initial="initial"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="px-1.5 py-0.5 bg-brand-primary/80 backdrop-blur-md border border-white/10 rounded-full text-[5px] font-mono font-bold text-white uppercase tracking-[0.1em] shadow-md inline-block"
            >
              {project.category}
            </motion.span>
          </div>

          <div className="absolute bottom-2 left-3 right-3 text-white">
            <h4 className="text-base md:text-lg font-display font-bold uppercase tracking-tight leading-none mb-0.5">
              {project.title}
            </h4>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <span className="text-[4px] font-mono font-bold uppercase tracking-widest text-brand-primary">View case study</span>
              <ArrowUpRight className="w-1 h-1 text-brand-primary" />
            </div>
          </div>
        </div>

        <div className="px-3 py-2 bg-white/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-between">
          <p className="text-slate-500 dark:text-slate-400 text-[8px] leading-tight font-medium line-clamp-1 max-w-[80%]">
            {project.description}
          </p>

          <div className="flex -space-x-1 shrink-0">
            {project.technologies.slice(0, 3).map((tech) => (
              <div key={tech} className="w-4 h-4 rounded-full border border-white dark:border-brand-obsidian bg-slate-100 dark:bg-white/10 flex items-center justify-center shadow-xs" title={tech}>
                <Code2 className="w-1.5 h-1.5 text-brand-primary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const sectionY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section id="projects" ref={containerRef} className="py-32 bg-slate-50 dark:bg-brand-obsidian relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div style={{ y: sectionY }} className="w-full">
          <div className="mb-24 flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[2px] bg-brand-primary" />
              <span className="text-brand-primary font-mono font-bold tracking-[0.3em] uppercase text-xs">Work Archive</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-8">
              <h3 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tighter leading-[1.05]">
                Selected work
              </h3>
              <p className="md:max-w-xs text-sm md:text-base text-slate-500 font-light leading-relaxed md:text-right pb-4">
                A few examples of long-term partnerships across product, brand, and growth.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {PROJECTS.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} onClick={() => setSelectedProject(project)} />
            ))}

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="w-full lg:mt-4">
              <div className="h-full min-h-[120px] glass rounded-[1rem] px-8 py-6 border border-dashed border-brand-primary/20 flex flex-col items-center justify-center text-center gap-4 group hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all duration-300">
                <div className="space-y-1">
                  <h4 className="text-lg font-display font-bold uppercase tracking-tight">Merge Module?</h4>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Engineer your custom growth stack.</p>
                </div>
                <button
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-xs uppercase tracking-[0.1em] transition-all hover:scale-105 shadow-md flex items-center gap-2"
                >
                  START_LINK <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setSelectedProject(null)} />
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="relative w-full max-w-2xl glass rounded-[1.2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10 max-h-[70vh]">
              <div className="w-full md:w-5/12 relative h-32 md:h-auto overflow-hidden bg-slate-900 shrink-0">
                <img src={selectedProject.image} alt="" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h2 className="text-lg md:text-xl font-display font-bold uppercase tracking-tighter leading-tight text-white">{selectedProject.title}</h2>
                </div>
                <button onClick={() => setSelectedProject(null)} className="absolute top-2 right-2 p-1 bg-white/10 hover:bg-brand-primary rounded text-white transition-all backdrop-blur-sm">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="w-full md:w-7/12 p-5 overflow-y-auto bg-white dark:bg-[#050505]">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[5px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Briefing</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{selectedProject.description}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[5px] font-mono font-bold text-brand-primary uppercase tracking-widest block">Core_Stack</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedProject.technologies.map((tech) => (
                        <span key={tech} className="px-1 py-0.5 bg-slate-100 dark:bg-white/5 rounded text-[5px] font-bold text-slate-500 border border-slate-200 dark:border-white/10">{tech.toUpperCase()}</span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2">
                    <button className="w-full py-2 bg-brand-primary text-white font-bold rounded text-[6px] uppercase tracking-[0.15em] flex items-center justify-center gap-2">
                      Full Case Specs <ChevronRight className="w-2 h-2" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
