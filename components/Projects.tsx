import React, { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../constants';
import RevealText from './RevealText';

gsap.registerPlugin(ScrollTrigger);

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];
const FEATURED = PROJECTS.slice(0, 6);

const cardVariant = {
  hidden: { y: 40, opacity: 0 },
  show:   { y: 0,  opacity: 1 },
};

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Cinematic zoom-out reveal on each project image
      gsap.utils.toArray<HTMLElement>('.project-card img', section).forEach((img) => {
        gsap.fromTo(img, { scale: 1.18 }, {
          scale: 1, duration: 1.3, ease: 'power3.out',
          scrollTrigger: { trigger: img, start: 'top 88%', once: true },
        });
      });

      // Subtle depth: middle column drifts on desktop 3-col layout
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1280px)', () => {
        gsap.utils.toArray<HTMLElement>('.project-card', section).forEach((card, i) => {
          if (i % 3 !== 1) return;
          gsap.fromTo(card, { y: 28 }, {
            y: -28, ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          });
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

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

        {/* ── Project grid ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6"
        >
          {FEATURED.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariant}
              transition={{ duration: 0.8, ease: E }}
            >
              <button
                type="button"
                onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
                className="project-card group block w-full text-left cursor-pointer"
                aria-label={`Open case study: ${project.title}`}
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
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Projects;
