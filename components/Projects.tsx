import React, { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../constants';
import RevealText from './RevealText';

gsap.registerPlugin(ScrollTrigger);

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];
const FEATURED = PROJECTS.slice(0, 8);

const Projects: React.FC = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section) return;

    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const cleanups: (() => void)[] = [];

    // 3D tilt on all project cards
    if (!reduced) {
      section.querySelectorAll<HTMLElement>('.project-card').forEach((card) => {
        const inner = card.querySelector<HTMLElement>('.card-inner');
        if (!inner) return;
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width  - 0.5;
          const y = (e.clientY - r.top)  / r.height - 0.5;
          inner.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
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
    }

    // Mobile: no pin, use native overflow scroll
    if (isMobile || !track) {
      return () => cleanups.forEach((fn) => fn());
    }

    const ctx = gsap.context(() => {
      // Total horizontal distance = full track width minus one viewport
      const scrollDist = () => Math.max(0, track.scrollWidth - window.innerWidth);

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        // Half-viewport of breathing room at end before unpin
        end: () => `+=${scrollDist() + window.innerHeight * 0.3}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate(self) {
          // Drive track left as user scrolls down
          gsap.set(track, { x: -self.progress * scrollDist(), force3D: true });

          // Progress bar
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
        },
      });
    }, section);

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      // md:h-screen fills the viewport when pinned; no overflow-hidden on section
      className="relative bg-transparent md:h-screen md:flex md:flex-col"
    >
      {/* ── Header ── */}
      <div className="md:shrink-0 relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-6 md:pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4 md:mb-6">
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
            <RevealText
              as="h2"
              className="text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-white"
            >
              OUR
            </RevealText>
            <RevealText
              as="h2"
              className="text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9]"
              wordClassName="text-gradient-brand"
              delay={0.15}
            >
              WORK
            </RevealText>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: E, delay: 0.2 }}
            className="text-white/30 text-sm leading-relaxed font-medium md:max-w-xs md:text-right md:pb-1"
          >
            Scroll to explore our latest case studies and delivered results.
          </motion.p>
        </div>

        {/* Progress bar — desktop only */}
        <div className="hidden md:flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.06] overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/15 shrink-0">
            Scroll →
          </span>
        </div>
      </div>

      {/* ── Mobile: native horizontal scroll with snap ── */}
      <div className="block md:hidden pb-8">
        <div className="flex gap-5 overflow-x-auto no-scrollbar pl-6 pr-6 snap-x snap-mandatory scroll-pl-6">
          {FEATURED.map((project) => (
            <div
              key={project.id}
              className="project-card w-[75vw] max-w-[320px] shrink-0 cursor-pointer snap-start"
              onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
            >
              <div className="card-inner group">
                <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.04] mb-3">
                  <img
                    src={`https://picsum.photos/seed/${encodeURIComponent(project.title)}/800/1000`}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 bg-black/70 px-2.5 py-1">
                      {project.industry ?? project.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-[0.05em]">
                  {project.title}
                </h3>
                <p className="text-white/25 text-xs mt-1 leading-relaxed">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*
        Desktop: overflow-hidden is on this inner wrapper, NOT on the section,
        so GSAP pin works cleanly while the 400vw+ track is clipped.
      */}
      <div className="hidden md:block flex-1 overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-full items-center gap-6 lg:gap-8 will-change-transform pb-6"
          style={{ width: 'max-content', paddingLeft: '5vw', paddingRight: '12vw' }}
        >
          {FEATURED.map((project) => (
            <div
              key={project.id}
              className="project-card shrink-0 cursor-pointer"
              style={{ width: 'clamp(260px, 20vw, 360px)' }}
              onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
            >
              <div className="card-inner group" style={{ transformStyle: 'preserve-3d' }}>
                <div
                  className="relative overflow-hidden bg-white/[0.04] mb-4"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img
                    src={`https://picsum.photos/seed/${encodeURIComponent(project.title)}/800/1000`}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 bg-black/70 px-3 py-1.5">
                      {project.industry ?? project.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black">
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4 12L12 4M12 4H6M12 4v6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-[0.05em] group-hover:text-white/60 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-white/25 text-xs mt-1.5 leading-relaxed">{project.description}</p>
                {project.result && (
                  <span className="inline-block mt-2 text-[10px] font-bold tracking-[0.2em] uppercase text-brand-secondary/90">
                    {project.result}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
