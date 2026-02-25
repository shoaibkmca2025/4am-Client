import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { ArrowUpRight, Code2, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import TiltCard from './TiltCard';
import SpotlightSection from './SpotlightSection';
import ParallaxLayer from './ParallaxLayer';

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const getFaviconUrl = (url: string, title: string) => {
    return `https://picsum.photos/seed/${encodeURIComponent(title)}/800/1000`;
  };

  const primaryImage =
    project.image ||
    getFaviconUrl(project.url, project.title);

  const [imageSrc, setImageSrc] = useState(primaryImage);

  const handleClick = () => {
    window.open(project.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <ScrollReveal delay={index * 80}>
      <TiltCard
        onClick={handleClick}
        className="group cursor-pointer w-full h-full"
      >
        <div className="absolute -inset-1 bg-brand-primary/5 rounded-[1rem] opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 pointer-events-none" />

        <div className="relative glass rounded-[2rem] overflow-hidden border border-slate-300/70 dark:border-slate-50/20 bg-gradient-to-b from-slate-800 via-slate-950 to-slate-900 transform transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:border-brand-primary/60">
          <div className="relative aspect-[3/4] w-full flex items-center justify-center px-2 pt-5 pb-6">
            <div className="absolute top-2 inset-x-0 flex justify-center items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-500 shadow-sm" />
              <span className="w-10 h-1.5 rounded-full bg-slate-700/80" />
            </div>
            <div className="relative w-[92%] h-[88%] rounded-[1.4rem] overflow-hidden bg-black shadow-[0_0_0_1px_rgba(148,163,184,0.35)]">
              <motion.img
                src={imageSrc}
                alt={project.title}
                className="w-full h-full object-cover transform scale-[1.01] group-hover:scale-[1.05] transition-transform duration-[0.8s] ease-out"
                onError={() => {
                  if (!imageSrc.includes('picsum.photos')) {
                    setImageSrc(`https://picsum.photos/seed/${encodeURIComponent(project.title)}/800/1000`);
                  }
                }}
              />
            </div>
          </div>

          <div className="px-3 py-3 bg-white/85 dark:bg-black/70 backdrop-blur-md flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-xs md:text-sm font-display font-semibold text-slate-900 dark:text-white truncate">
                {project.title}
              </h4>
              <p className="text-[9px] md:text-[10px] font-mono tracking-[0.16em] text-slate-500 dark:text-slate-400 truncate">
                {project.url}
              </p>
            </div>

            <div className="flex -space-x-1 shrink-0">
              {project.technologies.slice(0, 2).map((tech) => (
                <div key={tech} className="w-4 h-4 rounded-full border border-white/80 dark:border-brand-obsidian bg-slate-100 dark:bg-white/10 flex items-center justify-center shadow-xs">
                  <Code2 className="w-1.5 h-1.5 text-brand-primary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>
    </ScrollReveal>
  );
};

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const sectionY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (direction: 'left' | 'right') => {
    const container = marqueeRef.current;
    if (!container) return;
    const amount = 260 * 2;
    container.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <SpotlightSection ref={containerRef} id="projects" className="relative py-32 bg-slate-50 dark:bg-brand-obsidian overflow-hidden transition-colors duration-500">
      <ParallaxLayer strength={0.16} className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-24 w-[420px] h-[420px] bg-brand-primary/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-[-10%] w-[520px] h-[520px] bg-brand-accent/8 rounded-full blur-3xl" />
      </ParallaxLayer>
      <div ref={containerRef} className="container mx-auto px-6 max-w-[1200px] relative z-10" style={{ position: 'relative' }}>
        <motion.div style={{ y: sectionY }} className="w-full">
          <ScrollReveal className="mb-8 flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[2px] bg-brand-primary" />
              <span className="text-brand-primary font-mono font-bold tracking-[0.3em] uppercase text-xs">Work Archive</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-[1.05]">
                Our Work
              </h3>
              <div className="flex items-end justify-between md:justify-end gap-4 w-full md:w-auto">
                <p className="md:max-w-xs text-sm md:text-base text-slate-500 font-light leading-relaxed md:text-right">
                  A moving snapshot of long-term client partnerships across web, brand, and growth.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollByAmount('left')}
                    className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full glass border border-zinc-200/80 dark:border-white/10 text-zinc-600 dark:text-zinc-200 hover:border-brand-primary hover:text-brand-primary transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollByAmount('right')}
                    className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full glass border border-zinc-200/80 dark:border-white/10 text-zinc-600 dark:text-zinc-200 hover:border-brand-primary hover:text-brand-primary transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="relative">
            <div
              ref={marqueeRef}
              className="overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent"
            >
              <div className="flex items-stretch gap-6 pr-6">
                {PROJECTS.map((project, index) => (
                  <div key={project.id} className="w-[260px] shrink-0">
                    <ProjectCard project={project} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SpotlightSection>
  );
};

export default Projects;
