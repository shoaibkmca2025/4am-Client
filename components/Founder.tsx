import React, { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealText from './RevealText';
import DrawRule from './DrawRule';

gsap.registerPlugin(ScrollTrigger);

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ROLES = [
  'Co-Founder',
  'Digital Marketing Strategist',
  'Software Developer',
  'AI Consultant',
  'Product Onboarding Expert',
];

const EXPERTISE = [
  'Digital Marketing Strategy',
  'AI & Business Automation',
  'Software & Web Development',
  'Website Design & Development',
  'Search Engine Optimization',
  'Performance Marketing',
  'Branding & Creative Strategy',
  'Product Onboarding & Marketplaces',
  'Quick Commerce & E-commerce',
  'Marketplace Compliance & Catalogs',
  'UI/UX & Website Optimization',
  'Startup Growth Consulting',
  'Technology Consulting',
  'AI Workshops & Corporate Training',
  'Digital Transformation Strategy',
];

const FEATURED_IN = [
  { name: 'Smart Bharat News',      href: 'https://www.smartbharatnews.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'National Outlook Daily', href: 'https://www.nationaloutlookdaily.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'Bharat Biz Wire',        href: 'https://www.bharatbizwire.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'Saga of India',          href: 'https://www.sagaofindia.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'The Republic News',      href: 'https://www.therepublicnews.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'Indian Economics News',  href: 'https://www.indianeconomicsnews.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'Times News Express',     href: 'http://www.timesnewsexpress.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'Dailyhunt',              href: 'https://m.dailyhunt.in/news/india/english/punjabbytes-epaper-dhb7faabc774324241990251ac4336f653/-newsid-dhb7faabc774324241990251ac4336f653_9e048369b0044e30a55581dd34c09d1f' },
];

const chipVariant = {
  hidden: { y: 14, opacity: 0, scale: 0.92 },
  show:   { y: 0,  opacity: 1, scale: 1 },
};

const Founder: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Cinematic zoom-out reveal on the portrait
      const img = section.querySelector('.founder-photo img');
      if (img) {
        gsap.fromTo(img, { scale: 1.15 }, {
          scale: 1, duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: img, start: 'top 85%', once: true },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="founder"
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-transparent border-t border-white/[0.06] overflow-hidden"
    >
      <DrawRule />
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">

        {/* ── Header ── */}
        <div className="mb-10 md:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: E }}
            className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-secondary/80 block mb-5"
          >
            08 · Meet the Founder
          </motion.span>
          <RevealText as="h2" className="block text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95] text-white">
            THE VISION BEHIND
          </RevealText>
          <RevealText as="h2" className="block text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95]" wordClassName="text-gradient-brand" delay={0.12}>
            4AM GLOBAL MEDIA
          </RevealText>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">

          {/* ── Left: portrait + identity ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: E }}
            className="lg:sticky lg:top-28"
          >
            <div className="founder-photo relative rounded-2xl overflow-hidden border border-white/[0.08] max-w-md">
              <img
                src="/assets/vaibhav-pasi.png"
                alt="Vaibhav Pasi — Co-Founder of 4AM Global Media"
                loading="lazy"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-xl md:text-2xl font-black uppercase tracking-[-0.01em] text-white">
                  Vaibhav Pasi
                </div>
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand-secondary mt-1">
                  Co-Founder · 4AM Global Media
                </div>
              </div>
            </div>

            {/* Role chips */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
              className="mt-5 flex flex-wrap gap-2 max-w-md"
            >
              {ROLES.map((role) => (
                <motion.span
                  key={role}
                  variants={chipVariant}
                  transition={{ duration: 0.5, ease: E }}
                  className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3.5 py-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-white/60"
                >
                  {role}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: story ── */}
          <div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
              className="space-y-5"
            >
              {[
                'Vaibhav Pasi is a technology entrepreneur, digital marketing strategist, software developer, AI consultant, and product onboarding expert dedicated to helping businesses scale through innovation, technology, and data-driven growth strategies.',
                'As Co-Founder of 4AM Global Media, he leads the company’s vision of delivering next-generation digital solutions that combine creativity, technology, and business intelligence — collaborating with startups, SMEs, enterprises, and educational institutions to build high-performance websites, scalable software, AI-powered business systems, and result-oriented marketing campaigns.',
                'A recognized Product Onboarding Expert, Vaibhav helps brands launch and scale across India’s leading e-commerce and quick-commerce platforms — from seller setup and compliance to catalog optimization and growth consulting — and actively drives AI adoption through workshops, corporate training programs, and Vibe Coding sessions.',
              ].map((para, i) => (
                <motion.p
                  key={i}
                  variants={{ hidden: { y: 24, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                  transition={{ duration: 0.8, ease: E }}
                  className="text-white/60 text-base leading-relaxed font-medium"
                >
                  {para}
                </motion.p>
              ))}
            </motion.div>

            {/* Expertise chips */}
            <div className="mt-8">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: E }}
                className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-4"
              >
                Core Expertise
              </motion.h3>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
                className="flex flex-wrap gap-2"
              >
                {EXPERTISE.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={chipVariant}
                    transition={{ duration: 0.45, ease: E }}
                    className="rounded-full border border-brand-primary/20 bg-brand-primary/[0.05] px-3.5 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase text-brand-secondary/80"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Vision + Mission */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                {
                  label: 'Vision',
                  color: 'text-brand-primary',
                  text: 'To build globally recognized technology-driven businesses that leverage artificial intelligence, software innovation, and digital transformation to create meaningful impact for organizations, entrepreneurs, and communities.',
                },
                {
                  label: 'Mission',
                  color: 'text-brand-cyan',
                  text: 'To empower businesses with innovative technology, intelligent automation, strategic digital marketing, and scalable software solutions that accelerate growth, enhance customer experiences, and drive long-term success.',
                },
              ].map((card) => (
                <motion.div
                  key={card.label}
                  variants={{ hidden: { y: 28, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                  transition={{ duration: 0.8, ease: E }}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
                >
                  <div className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-3 ${card.color}`}>
                    {card.label}
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed font-medium">
                    {card.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: E, delay: 0.1 }}
              className="mt-8 border-l-2 border-brand-primary/60 pl-5"
            >
              <p className="text-white/70 text-base md:text-lg leading-relaxed font-medium italic">
                "Innovation begins with vision, technology transforms possibilities, and execution
                creates lasting impact. My mission is to help businesses embrace the future through
                intelligent digital solutions and transformative growth strategies."
              </p>
            </motion.blockquote>
          </div>
        </div>

        {/* ── Featured in ── */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-white/[0.06]">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: E }}
            className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-5"
          >
            As Featured In
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            className="flex flex-wrap gap-2.5"
          >
            {FEATURED_IN.map((outlet) => (
              <motion.a
                key={outlet.name}
                href={outlet.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={chipVariant}
                transition={{ duration: 0.45, ease: E }}
                className="group inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.02] px-4 py-2 text-[11px] font-bold text-white/60 hover:border-brand-secondary/50 hover:text-brand-secondary transition-colors duration-300"
              >
                {outlet.name}
                <svg className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.a>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Founder;
