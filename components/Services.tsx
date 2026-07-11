import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  { number: '07', title: 'Marketplace Onboarding', description: 'Seller setup, product listings, and catalog support for leading platforms.', slug: 'marketplace-product-onboarding' },
];

const cardVariant = {
  hidden: { y: 36, opacity: 0 },
  show:   { y: 0,  opacity: 1 },
};

const Services: React.FC = () => {
  return (
    <section id="services" className="relative py-16 md:py-24 bg-transparent overflow-hidden">
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10">

        {/* ── Header ── */}
        <div className="mb-10 md:mb-14 max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: E }}
            className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-primary/80 block mb-5"
          >
            02 · Our Services
          </motion.span>
          <RevealText as="h2" className="block text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95] text-white">
            EVERYTHING YOU NEED
          </RevealText>
          <RevealText as="h2" className="block text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95]" wordClassName="text-gradient-brand" delay={0.12}>
            TO GROW ONLINE
          </RevealText>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: E, delay: 0.2 }}
            className="mt-5 text-white/60 text-base leading-relaxed font-medium"
          >
            Seven services, one team, one goal — measurable growth for your business.
            Pick what you need or let us build the full engine.
          </motion.p>
        </div>

        {/* ── Card grid — simple, scannable, tappable ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5"
        >
          {SERVICES_DATA.map((service) => (
            <motion.div key={service.slug} variants={cardVariant} transition={{ duration: 0.7, ease: E }}>
              <Link
                to={`/services/${service.slug}`}
                className="group relative flex flex-col h-full rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 transition-colors duration-300 hover:border-brand-primary/40 hover:bg-white/[0.04] max-lg:active:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between mb-8 md:mb-12">
                  <span className="text-[11px] font-bold tracking-[0.25em] text-brand-primary/80">{service.number}</span>
                  <span className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center text-white/40 transition-all duration-300 group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-black group-hover:rotate-45">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase tracking-[-0.01em] text-white mb-2.5">
                  {service.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed font-medium">
                  {service.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: E, delay: 0.15 }}
          className="mt-10 md:mt-14 flex items-center justify-center"
        >
          <button
            onClick={() => scrollToSection('contact')}
            data-ripple
            className="inline-flex items-center gap-4 px-10 py-4 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-black text-[11px] font-bold tracking-[0.2em] uppercase hover:shadow-[0_0_30px_rgba(255,106,61,0.35)] hover:brightness-110 transition-all duration-300 group"
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
