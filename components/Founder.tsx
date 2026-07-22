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

const SHOAIB_ROLES = [
  'Co-Founder',
  'Software Developer',
  'Technology Strategist',
  'AI Solutions',
];

const SHOAIB_EXPERTISE = [
  'Full-Stack Development',
  'Python',
  'MERN Stack',
  'React Native',
  'AI-Powered Solutions',
  'Cloud Technologies',
  'Modern Web Technologies',
  'Scalable Product Architecture',
  'Technology Strategy',
];

const CTO_ROLES = [
  'Chief Technology Officer',
  'Android Development',
  'Java & .NET Technologies',
  'Product Engineering',
];

const CTO_EXPERTISE = [
  'Android Application Development',
  'Java & Advanced Java',
  'Microsoft .NET Technologies',
  'Enterprise Software Development',
  'REST API Design & Integration',
  'Database Design & Management',
  'Software Architecture & System Design',
  'Cloud-Ready Application Development',
  'Performance Optimization',
  'Agile Development Methodologies',
  'Product Engineering & Technical Leadership',
  'Technology Strategy & Digital Transformation',
];

const FEATURED_IN = [
  { name: 'Dailyhunt',              icon: '/assets/press/dailyhunt.png',          href: 'https://m.dailyhunt.in/news/india/english/punjabbytes-epaper-dhb7faabc774324241990251ac4336f653/-newsid-dhb7faabc774324241990251ac4336f653_9e048369b0044e30a55581dd34c09d1f' },
  { name: 'Smart Bharat News',      icon: '/assets/press/smart-bharat.png',       href: 'https://www.smartbharatnews.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'National Outlook Daily', icon: '/assets/press/national-outlook.png',   href: 'https://www.nationaloutlookdaily.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'Bharat Biz Wire',        icon: '/assets/press/bharat-biz-wire.png',    href: 'https://www.bharatbizwire.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'Saga of India',          icon: '/assets/press/saga-of-india.png',      href: 'https://www.sagaofindia.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'The Republic News',      icon: '/assets/press/republic-news.png',      href: 'https://www.therepublicnews.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'Indian Economics News',  icon: '/assets/press/indian-economics.png',   href: 'https://www.indianeconomicsnews.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'Times News Express',     icon: '/assets/press/times-news-express.png', href: 'http://www.timesnewsexpress.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
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
      // Cinematic zoom-out reveal on each leadership portrait
      section.querySelectorAll('.founder-photo img').forEach((img) => {
        gsap.fromTo(img, { scale: 1.15 }, {
          scale: 1, duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: img, start: 'top 85%', once: true },
        });
      });
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
            08 · Leadership
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
                src="/assets/vaibhav-pasi.jpg"
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
                  className="text-white/60 text-base leading-relaxed font-medium text-justify"
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
                className="group inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.02] pl-2.5 pr-4 py-1.5 text-[11px] font-bold text-white/60 hover:border-brand-secondary/50 hover:text-brand-secondary transition-colors duration-300"
              >
                <img
                  src={outlet.icon}
                  alt=""
                  width={18}
                  height={18}
                  loading="lazy"
                  className="w-[18px] h-[18px] rounded-[4px] object-cover shrink-0"
                />
                {outlet.name}
                <svg className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* ══ Co-Founder — Shoaib Khatik ══ */}
        <div className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-white/[0.06]">
          <div className="mb-10 md:mb-14">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: E }}
              className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-accent/80 block mb-5"
            >
              Co-Founder
            </motion.span>
            <RevealText as="h3" className="block text-[8vw] md:text-[4.2vw] lg:text-[3.2vw] font-black uppercase tracking-[-0.03em] leading-[0.95]" wordClassName="text-gradient-tech">
              SHOAIB KHATIK
            </RevealText>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">

            {/* Portrait */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: E }}
              className="lg:sticky lg:top-28"
            >
              <div className="founder-photo relative rounded-2xl overflow-hidden border border-white/[0.08] max-w-md">
                <img
                  src="/assets/shoaib-khatik-web.jpg"
                  alt="Shoaib Khatik — Co-Founder of 4AM Global Media"
                  loading="lazy"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-xl md:text-2xl font-black uppercase tracking-[-0.01em] text-white">
                    Shoaib Khatik
                  </div>
                  <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand-accent mt-1">
                    Co-Founder · 4AM Global Media
                  </div>
                </div>
              </div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
                className="mt-5 flex flex-wrap gap-2 max-w-md"
              >
                {SHOAIB_ROLES.map((role) => (
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

            {/* Story */}
            <div>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
                className="space-y-5"
              >
                {[
                  'Shoaib Khatik is the Co-Founder of 4AM Global Media, where he leads the company’s technology vision and digital innovation initiatives. With a strong background in full-stack software development, AI-powered solutions, and modern web technologies, he is dedicated to building scalable, user-focused digital products that help businesses grow.',
                  'He specializes in Python, the MERN Stack, React Native, and cloud-based technologies, combining technical expertise with strategic thinking to deliver high-quality digital experiences. His passion for innovation and continuous learning enables 4AM Global Media to stay ahead in an ever-evolving digital landscape.',
                  'As Co-Founder, Shoaib is committed to transforming ideas into impactful digital solutions while fostering creativity, collaboration, and excellence across every project.',
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
                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: E }}
                  className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-4"
                >
                  Core Expertise
                </motion.h4>
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
                  className="flex flex-wrap gap-2"
                >
                  {SHOAIB_EXPERTISE.map((skill) => (
                    <motion.span
                      key={skill}
                      variants={chipVariant}
                      transition={{ duration: 0.45, ease: E }}
                      className="rounded-full border border-brand-accent/20 bg-brand-accent/[0.05] px-3.5 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase text-brand-accent/90"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ CTO — Abhishek Prasad ══ */}
        <div className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-white/[0.06]">
          <div className="mb-10 md:mb-14">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: E }}
              className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-cyan/80 block mb-5"
            >
              Chief Technology Officer
            </motion.span>
            <RevealText as="h3" className="block text-[8vw] md:text-[4.2vw] lg:text-[3.2vw] font-black uppercase tracking-[-0.03em] leading-[0.95]" wordClassName="text-gradient-tech">
              ABHISHEK PRASAD
            </RevealText>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-start">

            {/* Portrait first in DOM (mobile order), right column on desktop */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: E }}
              className="lg:sticky lg:top-28 lg:order-2"
            >
              <div className="founder-photo relative rounded-2xl overflow-hidden border border-white/[0.08] max-w-md lg:ml-auto">
                <img
                  src="/assets/abhishek-prasad-web.jpg"
                  alt="Abhishek Prasad — Chief Technology Officer of 4AM Global Media"
                  loading="lazy"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-xl md:text-2xl font-black uppercase tracking-[-0.01em] text-white">
                    Abhishek Prasad
                  </div>
                  <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand-cyan mt-1">
                    CTO · 4AM Global Media
                  </div>
                </div>
              </div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
                className="mt-5 flex flex-wrap gap-2 max-w-md lg:ml-auto lg:justify-end"
              >
                {CTO_ROLES.map((role) => (
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

            {/* Story */}
            <div className="lg:order-1">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
                className="space-y-5"
              >
                {[
                  'Abhishek Prasad is the Chief Technology Officer at 4AM Global Media, where he leads the company’s technology vision, product engineering, and digital innovation initiatives. With a strong foundation in software engineering and mobile application development, he plays a key role in delivering scalable, secure, and future-ready technology solutions.',
                  'Specializing in Android application development, Java, and .NET technologies, Abhishek has extensive experience building high-performance mobile and enterprise applications. His expertise covers end-to-end software development, system architecture, API integration, database design, cloud-ready applications, and performance optimization.',
                  'As the technology leader, he is responsible for defining the technical roadmap, implementing modern development practices, and ensuring the delivery of reliable, user-centric digital products. His focus on clean architecture, code quality, security, and emerging technologies enables businesses to accelerate digital transformation and achieve sustainable growth.',
                  'Abhishek believes that technology should not only solve today’s challenges but also prepare organizations for tomorrow’s opportunities. His commitment to innovation, continuous learning, and engineering excellence drives the development of intelligent, scalable solutions that create lasting business value.',
                ].map((para, i) => (
                  <motion.p
                    key={i}
                    variants={{ hidden: { y: 24, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                    transition={{ duration: 0.8, ease: E }}
                    className="text-white/60 text-base leading-relaxed font-medium text-justify"
                  >
                    {para}
                  </motion.p>
                ))}
              </motion.div>

              {/* Expertise chips */}
              <div className="mt-8">
                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: E }}
                  className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-4"
                >
                  Areas of Expertise
                </motion.h4>
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
                  className="flex flex-wrap gap-2"
                >
                  {CTO_EXPERTISE.map((skill) => (
                    <motion.span
                      key={skill}
                      variants={chipVariant}
                      transition={{ duration: 0.45, ease: E }}
                      className="rounded-full border border-brand-cyan/20 bg-brand-cyan/[0.05] px-3.5 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase text-brand-cyan/80"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* Quote */}
              <motion.blockquote
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: E, delay: 0.1 }}
                className="mt-8 border-l-2 border-brand-cyan/60 pl-5"
              >
                <p className="text-white/70 text-base md:text-lg leading-relaxed font-medium italic">
                  "Innovation begins with strong engineering, and great engineering creates
                  exceptional digital experiences."
                </p>
              </motion.blockquote>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Founder;
