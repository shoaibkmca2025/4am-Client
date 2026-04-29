import React, { useRef, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { scrollToSection } from '../utils/scroll';
import RevealText from './RevealText';

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SERVICES_DATA = [
  { number: '01', title: 'Digital Marketing',   description: 'Paid and organic campaigns that convert attention into predictable pipeline.', slug: 'digital-marketing' },
  { number: '02', title: 'Branding & Identity', description: 'Visual systems that position you as the obvious choice in any room.',           slug: 'branding' },
  { number: '03', title: 'Social Media Growth', description: 'Always-on content for engagement, authority, and community.',                   slug: 'social-media-growth' },
  { number: '04', title: 'SEO & Content',       description: 'Search strategies that compound and bring high-intent traffic.',               slug: 'seo' },
  { number: '05', title: 'Web Development',     description: 'Conversion-focused sites built for speed and clarity.',                        slug: 'web-development' },
  { number: '06', title: 'Content Creation',    description: 'Video, copy, and assets that keep your brand impactful everywhere.',           slug: 'content-creation' },
];

const rowVariant = {
  hidden: { opacity: 0, x: -30, filter: 'blur(4px)' },
  show:   { opacity: 1, x: 0,   filter: 'blur(0px)' },
};

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked background text — drifts from right to left as you scroll down
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgX    = useTransform(scrollYProgress, [0, 1], ['8%', '-12%']);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const items = section.querySelectorAll<HTMLElement>('.service-item');
    const cleanups: Array<() => void> = [];

    items.forEach((item) => {
      const title = item.querySelector<HTMLElement>('.service-title');
      const arrow = item.querySelector<HTMLElement>('.service-arrow');
      const num   = item.querySelector<HTMLElement>('.service-num');
      const line  = item.querySelector<HTMLElement>('.service-item-line');
      const desc  = item.querySelector<HTMLElement>('.service-desc');

      const onEnter = () => {
        if (title) gsap.to(title, { x: 18, duration: 0.5, ease: 'expo.out' });
        if (arrow) gsap.to(arrow, { rotate: 45, scale: 1.1, duration: 0.4, ease: 'expo.out' });
        if (num)   gsap.to(num,   { opacity: 0.8, duration: 0.25 });
        if (desc)  gsap.to(desc,  { opacity: 0.7, duration: 0.3 });
        if (line)  gsap.to(line,  { scaleX: 1, duration: 0.65, ease: 'expo.out', transformOrigin: 'left center' });
      };
      const onLeave = () => {
        if (title) gsap.to(title, { x: 0,  duration: 0.4,  ease: 'expo.out' });
        if (arrow) gsap.to(arrow, { rotate: 0, scale: 1, duration: 0.35, ease: 'expo.out' });
        if (num)   gsap.to(num,   { opacity: 0.2, duration: 0.25 });
        if (desc)  gsap.to(desc,  { opacity: 0.3, duration: 0.3 });
        if (line)  gsap.to(line,  { scaleX: 0, duration: 0.4, ease: 'expo.in', transformOrigin: 'right center' });
      };

      item.addEventListener('mouseenter', onEnter);
      item.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        item.removeEventListener('mouseenter', onEnter);
        item.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative py-16 md:py-24 bg-black overflow-hidden">

      {/* Scroll-parallax ghost word — drifts left as you scroll */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex items-center pointer-events-none select-none"
        style={{ x: bgX, opacity: bgOpacity }}
        aria-hidden="true"
      >
        <span
          className="text-[16vw] font-black uppercase leading-none tracking-[-0.05em] whitespace-nowrap text-transparent"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.025)' }}
        >
          SERVICES
        </span>
      </motion.div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 md:mb-14">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: E }}
              className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-white/30 block mb-5"
            >
              Our Services
            </motion.span>
            <RevealText as="h2" className="block text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-white">
              WHAT WE
            </RevealText>
            <RevealText as="h2" className="block text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.18)' }} delay={0.12}>
              DO
            </RevealText>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: E, delay: 0.2 }}
            className="text-white/35 text-sm md:text-base leading-relaxed font-medium md:max-w-sm md:text-right md:pb-2"
          >
            Comprehensive digital solutions designed to scale your business with precision and measurable impact.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="border-t border-white/[0.07]"
        >
          {SERVICES_DATA.map((service) => (
            <motion.div key={service.slug} variants={rowVariant} transition={{ duration: 0.75, ease: E }}>
              <a
                href={`/services/${service.slug}`}
                className="service-item group relative flex items-center gap-6 md:gap-10 py-6 md:py-8 border-b border-white/[0.07] block"
                onClick={(e) => { e.preventDefault(); window.location.href = `/services/${service.slug}`; }}
              >
                <span className="service-item-line absolute left-0 right-0 bottom-0 h-px bg-white/25 origin-left scale-x-0 pointer-events-none" />
                <span className="service-num text-xs md:text-sm font-bold tracking-[0.2em] text-white/20 w-10 md:w-14 shrink-0 opacity-20">{service.number}</span>
                <h3 className="service-title text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-[-0.02em] text-white flex-1">{service.title}</h3>
                <p className="service-desc hidden lg:block text-white/30 text-sm max-w-xs leading-relaxed font-medium text-right opacity-30">{service.description}</p>
                <div className="service-arrow w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-white transition-colors duration-300 text-white/40 group-hover:text-black">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: E, delay: 0.2 }}
          className="mt-12 md:mt-16 flex items-center justify-center"
        >
          <button
            onClick={() => scrollToSection('contact')}
            data-ripple
            className="inline-flex items-center gap-4 px-10 py-4 rounded-full border border-white/15 text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300 group"
          >
            Start a project
            <svg className="group-hover:translate-x-1 transition-transform duration-300" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 8h8M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default Services;
