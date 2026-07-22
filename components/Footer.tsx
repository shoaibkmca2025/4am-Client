import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToSection } from '../utils/scroll';
import RevealText from './RevealText';

gsap.registerPlugin(ScrollTrigger);

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FOOTER_NAV = [
  { label: 'Work',     sectionId: 'work' },
  { label: 'Services', sectionId: 'services' },
  { label: 'About',    sectionId: 'about' },
  { label: 'News',     sectionId: 'testimonials' },
  { label: 'Contact',  sectionId: 'contact' },
];

const FOOTER_SERVICES = [
  { label: 'Digital Marketing', href: '/services/digital-marketing' },
  { label: 'Branding',          href: '/services/branding' },
  { label: 'Social Media',      href: '/services/social-media-growth' },
  { label: 'SEO',               href: '/services/seo' },
  { label: 'Web Development',   href: '/services/web-development' },
  { label: 'Content Creation',  href: '/services/content-creation' },
  { label: 'Marketplace Onboarding', href: '/services/marketplace-product-onboarding' },
];

const FOOTER_SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/reel/DUBIUl5DfBU/?utm_source=ig_web_copy_link' },
  { label: 'Email',     href: 'mailto:Info@4amglobalmedia.com' },
];

const colVariant = {
  hidden: { y: 24, opacity: 0 },
  show:   { y: 0,  opacity: 1 },
};

const Footer: React.FC = () => {
  const ctaBtnRef = useRef<HTMLButtonElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);

  // Newsletter capture → /api/newsletter (footer-only UI state)
  const [nlEmail, setNlEmail] = useState('');
  const [nlStatus, setNlStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(nlEmail.trim())) { setNlStatus('error'); return; }
    setNlStatus('sending');
    try {
      const r = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nlEmail.trim() }),
      });
      const d = await r.json().catch(() => null);
      setNlStatus(r.ok && d?.ok ? 'done' : 'error');
    } catch {
      setNlStatus('error');
    }
  };

  // CTA heading zooms in from slightly below on scroll-enter
  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaSectionRef,
    offset: ['start end', 'center center'],
  });
  const ctaScale  = useTransform(ctaProgress, [0, 1], [0.88, 1]);
  const ctaBlurPx = useTransform(ctaProgress, [0, 0.7], [8, 0]);
  const ctaFilter = useMotionTemplate`blur(${ctaBlurPx}px)`;

  useLayoutEffect(() => {
    const btn = ctaBtnRef.current;
    if (!btn) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const onEnter = () => gsap.to(btn, { rotate: 45, scale: 1.1, duration: 0.4, ease: 'expo.out' });
    const onLeave = () => gsap.to(btn, { rotate: 0,  scale: 1,   duration: 0.35, ease: 'expo.out' });

    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      btn.removeEventListener('mouseenter', onEnter);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <footer className="relative z-50 bg-black text-white">

      {/* ── Giant CTA ── */}
      <div className="border-t border-white/[0.06]" ref={ctaSectionRef}>
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 py-14 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              style={{ scale: ctaScale, filter: ctaFilter }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1, ease: E }}
            >
              <span className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-white/20 block mb-5">
                Ready to start?
              </span>
              <RevealText as="h2" className="block text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-white">
                LET'S CREATE
              </RevealText>
              <RevealText as="h2" className="block text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.1)' }} delay={0.1}>
                SOMETHING
              </RevealText>
              <RevealText as="h2" className="block text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-white" delay={0.2}>
                GREAT
              </RevealText>
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: E, delay: 0.3 }}
            >
              <button
                ref={ctaBtnRef}
                onClick={() => scrollToSection('contact')}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/[0.12] flex items-center justify-center text-white/50 hover:bg-white hover:text-black hover:border-white transition-colors duration-300 shrink-0"
                aria-label="Contact us"
              >
                <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                  <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: E }}
        className="h-px bg-white/[0.06] origin-left"
      />

      {/* ── Nav row ── */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 py-5">
        <motion.nav
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="flex flex-wrap items-center gap-5 md:gap-8"
        >
          {FOOTER_NAV.map((item) => (
            <motion.button
              key={item.label}
              variants={{ hidden: { y: 12, opacity: 0 }, show: { y: 0, opacity: 1 } }} transition={{ duration: 0.55, ease: E }}
              onClick={() => scrollToSection(item.sectionId)}
              className="relative text-[11px] font-bold tracking-[0.2em] uppercase text-white/35 hover:text-white transition-colors duration-300 hover-underline"
            >
              {item.label}
            </motion.button>
          ))}
        </motion.nav>
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* ── Grid ── */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 py-10 md:py-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-14"
        >
          <motion.div variants={colVariant} transition={{ duration: 0.7, ease: E }} className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <img
                src="/assets/logo-4am-nav.png"
                alt="4AM Global Media"
                className="h-12 w-auto"
              />
            </div>
            <p className="text-white/25 text-xs leading-relaxed font-medium max-w-xs">
              The growth engine that never sleeps. A creative network made for today and tomorrow.
            </p>
          </motion.div>

          <motion.div variants={colVariant} transition={{ duration: 0.7, ease: E }}>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mb-4">Services</h4>
            <ul className="space-y-2.5">
              {FOOTER_SERVICES.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-xs text-white/30 hover:text-white transition-colors font-medium hover-underline">{link.label}</a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={colVariant} transition={{ duration: 0.7, ease: E }}>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {FOOTER_NAV.map((link) => (
                <li key={link.label}>
                  <button onClick={() => scrollToSection(link.sectionId)} className="text-xs text-white/30 hover:text-white transition-colors font-medium hover-underline">
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <a href="/blog" className="text-xs text-white/30 hover:text-white transition-colors font-medium hover-underline">Insights</a>
              </li>
              <li>
                <a href="/careers" className="text-xs text-white/30 hover:text-white transition-colors font-medium hover-underline">Careers</a>
              </li>
              <li>
                <a href="/portal" className="text-xs text-white/30 hover:text-white transition-colors font-medium hover-underline">Student Portal</a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={colVariant} transition={{ duration: 0.7, ease: E }}>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mb-4">Connect</h4>
            <ul className="space-y-2.5">
              {FOOTER_SOCIALS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} className="text-xs text-white/30 hover:text-white transition-colors font-medium hover-underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20">Available</span>
            </div>

            {/* Newsletter — quiet, in the footer's own visual register */}
            <form onSubmit={subscribe} noValidate className="mt-6">
              <label htmlFor="nl-email" className="block text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mb-3">
                Newsletter
              </label>
              {nlStatus === 'done' ? (
                <p className="text-xs text-brand-lime/80 font-medium">You're subscribed.</p>
              ) : (
                <>
                  <div className="flex items-center gap-2 border-b border-white/[0.08] focus-within:border-brand-primary/40 transition-colors duration-300 pb-2">
                    <input
                      id="nl-email"
                      type="email"
                      value={nlEmail}
                      onChange={(e) => setNlEmail(e.currentTarget.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      className="w-full bg-transparent text-xs text-white/70 placeholder:text-white/20 focus:outline-none font-medium"
                    />
                    <button
                      type="submit"
                      disabled={nlStatus === 'sending'}
                      aria-label="Subscribe to the newsletter"
                      className="shrink-0 text-white/30 hover:text-brand-secondary transition-colors duration-300 disabled:opacity-40"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  {nlStatus === 'error' && (
                    <p className="mt-2 text-[10px] text-red-400/80 font-medium">Please enter a valid email.</p>
                  )}
                </>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>

      <div className="h-px bg-white/[0.04]" />

      {/* ── Bottom bar ── */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/15">
          &copy; {new Date().getFullYear()} 4AM Global Media. All rights reserved.
        </p>
        <div className="flex items-center gap-5 text-[10px] font-bold tracking-[0.2em] uppercase text-white/15">
          <button className="hover:text-white/40 transition-colors duration-200">Privacy</button>
          <button className="hover:text-white/40 transition-colors duration-200">Terms</button>
          <button className="hover:text-white/40 transition-colors duration-200">Cookies</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
