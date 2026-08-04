import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { scrollToSection } from '../utils/scroll';

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SERIF = { fontFamily: 'Caprasimo, Georgia, serif' } as const;

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

const Footer: React.FC = () => {
  const ctaBtnRef = useRef<HTMLButtonElement>(null);

  // Newsletter capture → /api/newsletter
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

  useLayoutEffect(() => {
    const btn = ctaBtnRef.current;
    if (!btn) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onEnter = () => gsap.to(btn, { rotate: 45, duration: 0.4, ease: 'expo.out' });
    const onLeave = () => gsap.to(btn, { rotate: 0, duration: 0.35, ease: 'expo.out' });
    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mouseleave', onLeave);
    return () => { btn.removeEventListener('mouseenter', onEnter); btn.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <footer className="relative z-50 bg-[#ebddc5] text-[#201e1d] border-t border-[#201e1d]/10">

      {/* ── Giant CTA ── */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: E }}
          >
            <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.28em] uppercase text-[#8c491a] block mb-5">
              Ready to start?
            </span>
            <h2 style={SERIF} className="text-[10vw] md:text-[6.5vw] lg:text-[5vw] leading-[0.98] tracking-[-0.01em] text-[#201e1d]">
              Let’s create<br />something <span className="text-[#c67139]">great.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: E, delay: 0.2 }}
          >
            <button
              ref={ctaBtnRef}
              onClick={() => scrollToSection('contact')}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-[#201e1d]/20 flex items-center justify-center text-[#201e1d]/60 hover:bg-[#c67139] hover:text-[#f5ead8] hover:border-[#c67139] transition-colors duration-300 shrink-0"
              aria-label="Contact us"
            >
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      <div className="h-px bg-[#201e1d]/10" />

      {/* ── Nav row ── */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 py-5">
        <nav className="flex flex-wrap items-center gap-5 md:gap-8">
          {FOOTER_NAV.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.sectionId)}
              className="hover-underline text-[11px] font-semibold tracking-[0.2em] uppercase text-[#201e1d]/50 hover:text-[#c67139] transition-colors duration-300"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="h-px bg-[#201e1d]/10" />

      {/* ── Grid ── */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-14">
          <div className="col-span-2 md:col-span-1">
            <img
              src="/logo-mark.png"
              alt="4AM Global Media"
              className="h-11 w-auto rounded-lg bg-[#1d1d1d] px-2.5 py-1.5 mb-4"
            />
            <p className="text-[#201e1d]/55 text-xs leading-relaxed max-w-xs">
              The growth engine that never sleeps. A creative network made for today and tomorrow.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#201e1d]/40 mb-4">Services</h4>
            <ul className="space-y-2.5">
              {FOOTER_SERVICES.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover-underline text-xs text-[#201e1d]/55 hover:text-[#c67139] transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#201e1d]/40 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {FOOTER_NAV.map((link) => (
                <li key={link.label}>
                  <button onClick={() => scrollToSection(link.sectionId)} className="hover-underline text-xs text-[#201e1d]/55 hover:text-[#c67139] transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
              <li><a href="/portal" className="hover-underline text-xs text-[#201e1d]/55 hover:text-[#c67139] transition-colors">Student Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#201e1d]/40 mb-4">Connect</h4>
            <ul className="space-y-2.5">
              {FOOTER_SOCIALS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} className="hover-underline text-xs text-[#201e1d]/55 hover:text-[#c67139] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-[#201e1d]/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7a8a5e] animate-pulse" />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#201e1d]/40">Available</span>
            </div>

            {/* Newsletter */}
            <form onSubmit={subscribe} noValidate className="mt-6">
              <label htmlFor="nl-email" className="block text-[10px] font-semibold tracking-[0.28em] uppercase text-[#201e1d]/40 mb-3">
                Newsletter
              </label>
              {nlStatus === 'done' ? (
                <p className="text-xs text-[#56633f] font-medium">You’re subscribed.</p>
              ) : (
                <>
                  <div className="flex items-center gap-2 border-b border-[#201e1d]/15 focus-within:border-[#c67139] transition-colors duration-300 pb-2">
                    <input
                      id="nl-email"
                      type="email"
                      value={nlEmail}
                      onChange={(e) => setNlEmail(e.currentTarget.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      className="w-full bg-transparent text-xs text-[#201e1d] placeholder:text-[#201e1d]/35 focus:outline-none"
                    />
                    <button type="submit" disabled={nlStatus === 'sending'} aria-label="Subscribe" className="shrink-0 text-[#201e1d]/40 hover:text-[#c67139] transition-colors duration-300 disabled:opacity-40">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  {nlStatus === 'error' && <p className="mt-2 text-[10px] text-[#a23] font-medium">Please enter a valid email.</p>}
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="h-px bg-[#201e1d]/10" />

      {/* ── Bottom bar ── */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#201e1d]/35">
          &copy; {new Date().getFullYear()} 4AM Global Media. All rights reserved.
        </p>
        <div className="flex items-center gap-5 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#201e1d]/35">
          <button className="hover:text-[#c67139] transition-colors duration-200">Privacy</button>
          <button className="hover:text-[#c67139] transition-colors duration-200">Terms</button>
          <button className="hover:text-[#c67139] transition-colors duration-200">Cookies</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
