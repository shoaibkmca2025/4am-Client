import React, { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../constants';
import RevealText from './RevealText';

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];
const FEATURED = PROJECTS.slice(0, 8);

const cardVariant = {
  hidden: { y: 60, opacity: 0, scale: 0.94 },
  show:   { y: 0,  opacity: 1, scale: 1 },
};

const Projects: React.FC = () => {
  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const cards = section.querySelectorAll<HTMLElement>('.project-card');
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const inner = card.querySelector<HTMLElement>('.card-inner');
      if (!inner) return;

      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        inner.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale(1.02)`;
      };
      const onLeave = () => {
        inner.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
        inner.style.transform  = '';
        setTimeout(() => { inner.style.transition = ''; }, 600);
      };

      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const scrollLeft  = () => containerRef.current?.scrollBy({ left: -440, behavior: 'smooth' });
  const scrollRight = () => containerRef.current?.scrollBy({ left: 440,  behavior: 'smooth' });

  return (
    <section id="work" ref={sectionRef} className="relative py-16 md:py-24 bg-black overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 md:mb-14">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: E }}
              className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-white/30 block mb-5"
            >
              Latest Projects
            </motion.span>
            <RevealText as="h2" className="text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-white">OUR</RevealText>
            <RevealText as="h2" className="text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }} delay={0.15}>WORK</RevealText>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: E, delay: 0.2 }}
            className="flex gap-3"
          >
            <button onClick={scrollLeft} className="w-12 h-12 rounded-full border border-white/[0.1] flex items-center justify-center text-white/40 hover:bg-white hover:text-black hover:border-white transition-all duration-300" aria-label="Previous">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 8H4M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={scrollRight} className="w-12 h-12 rounded-full border border-white/[0.1] flex items-center justify-center text-white/40 hover:bg-white hover:text-black hover:border-white transition-all duration-300" aria-label="Next">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8h8M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </motion.div>
        </div>
      </div>

      <motion.div
        ref={containerRef}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="horizontal-scroll gap-6 md:gap-8 pl-6 md:pl-10 pr-6 md:pr-10 pb-4"
      >
        {FEATURED.map((project) => (
          <motion.div
            key={project.id}
            variants={cardVariant} transition={{ duration: 0.9, ease: E }}
            className="project-card w-[80vw] max-w-[420px] md:w-[370px] lg:w-[420px] shrink-0 cursor-pointer"
            onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
          >
            <div className="card-inner group" style={{ transformStyle: 'preserve-3d' }}>
              <motion.div
                className="relative aspect-[4/5] overflow-hidden bg-white/[0.02] mb-4"
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.9, ease: E }}
              >
                <img
                  src={`https://picsum.photos/seed/${encodeURIComponent(project.title)}/800/1000`}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/5 transition-colors duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 bg-black/50 backdrop-blur-sm px-3 py-1.5">
                    {project.industry || project.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </motion.div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-[0.05em] group-hover:text-white/60 transition-colors duration-300">{project.title}</h3>
                <p className="text-white/25 text-xs mt-1.5 font-medium leading-relaxed">{project.description}</p>
                {project.result && (
                  <span className="inline-block mt-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">{project.result}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div variants={cardVariant} transition={{ duration: 0.9, ease: E }} className="w-[60vw] max-w-[280px] shrink-0 flex items-center justify-center">
          <div className="flex flex-col items-center text-center gap-4 p-6">
            <div className="w-16 h-16 rounded-full border border-white/[0.1] flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 cursor-pointer text-white/40">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M4 8h8M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">View All</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Projects;
