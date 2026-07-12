import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { PROJECTS } from '../constants';
import RevealText from './RevealText';
import type { Project } from '../types';

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];
const FEATURED = PROJECTS.slice(0, 10);

const ProjectCard: React.FC<{ project: Project; ghost?: boolean }> = ({ project, ghost }) => (
  <button
    type="button"
    onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
    className="project-card group block text-left cursor-pointer shrink-0 w-[78vw] sm:w-[340px] md:w-[380px] mr-5 md:mr-6"
    aria-label={`Open case study: ${project.title}`}
    aria-hidden={ghost || undefined}
    tabIndex={ghost ? -1 : undefined}
  >
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/[0.04] mb-4">
      <img
        src={`https://picsum.photos/seed/${encodeURIComponent(project.title)}/900/675`}
        alt={project.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 bg-black/70 px-3 py-1.5 rounded-full">
        {project.industry ?? project.category}
      </span>
      <span className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white flex items-center justify-center text-black opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </div>
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-base font-bold text-white uppercase tracking-[0.04em] group-hover:text-brand-secondary transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-white/55 text-xs mt-1.5 leading-relaxed max-w-[36ch]">{project.description}</p>
      </div>
      {project.result && (
        <span className="shrink-0 text-[10px] font-bold tracking-[0.15em] uppercase text-brand-secondary/90 border border-brand-secondary/25 rounded-full px-3 py-1.5 whitespace-nowrap">
          {project.result}
        </span>
      )}
    </div>
  </button>
);

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  // Reduced motion: no auto-flow — the same strip becomes a manual
  // horizontal scroller instead.
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  // ── Infinite right-to-left project flow ────────────────────────────
  // The track holds the card list twice; a wrapped x-tween glides it
  // leftward forever. Hovering pauses the flow so cards are easy to click.
  useLayoutEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    let cleanup: (() => void) | undefined;
    // Wait a frame so scrollWidth is measured after images/layout settle
    const raf = requestAnimationFrame(() => {
      const half = track.scrollWidth / 2;
      if (half <= 0) return;

      const tween = gsap.to(track, {
        x: -half,
        duration: 60,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((raw: number) => -((-raw % half + half) % half)),
        },
      });

      const pause  = () => { gsap.to(tween, { timeScale: 0, duration: 0.5, overwrite: true }); };
      const resume = () => { gsap.to(tween, { timeScale: 1, duration: 0.5, overwrite: true }); };
      track.addEventListener('mouseenter', pause);
      track.addEventListener('mouseleave', resume);

      cleanup = () => {
        track.removeEventListener('mouseenter', pause);
        track.removeEventListener('mouseleave', resume);
        tween.kill();
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      cleanup?.();
    };
  }, [reduced]);

  return (
    <section id="work" ref={sectionRef} className="relative py-16 md:py-24 bg-transparent overflow-hidden">
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
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
            Real clients, real results — every project ships with a number we're proud of.
          </motion.p>
        </div>
      </div>

      {/* ── Flowing project strip (right → left, pauses on hover) ── */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: E }}
        className="relative z-10"
      >
        {/* Edge fades so cards dissolve at the viewport borders */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-28 bg-gradient-to-r from-black/70 to-transparent z-10" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-28 bg-gradient-to-l from-black/70 to-transparent z-10" aria-hidden="true" />

        <div className={reduced ? 'overflow-x-auto no-scrollbar' : 'overflow-hidden'}>
          <div ref={trackRef} className="flex will-change-transform">
            {FEATURED.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {/* Second copy makes the loop seamless */}
            {FEATURED.map((project) => (
              <ProjectCard key={`ghost-${project.id}`} project={project} ghost />
            ))}
          </div>
        </div>
      </motion.div>

    </section>
  );
};

export default Projects;
