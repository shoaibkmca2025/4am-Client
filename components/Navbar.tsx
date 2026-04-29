import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { scrollToSection, scrollToTop } from '../utils/scroll';

const NAV_LINKS = [
  { label: 'WORK',     sectionId: 'work' },
  { label: 'SERVICES', sectionId: 'services' },
  { label: 'ABOUT',    sectionId: 'about' },
  { label: 'NEWS',     sectionId: 'testimonials' },
  { label: 'CONTACT',  sectionId: 'contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const headerRef    = useRef<HTMLElement>(null);
  const logoRef      = useRef<HTMLDivElement>(null);
  const desktopNav   = useRef<HTMLElement>(null);
  const ctaRef       = useRef<HTMLButtonElement>(null);
  const menuOverlay  = useRef<HTMLDivElement>(null);
  const menuLinks    = useRef<HTMLButtonElement[]>([]);
  const menuTl       = useRef<gsap.core.Timeline | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // ── entrance on mount ──────────────────────────────────────────────
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const navItems = desktopNav.current
        ? gsap.utils.toArray<HTMLElement>('button', desktopNav.current)
        : [];

      gsap.set([logoRef.current, ...navItems, ctaRef.current], { y: -20, autoAlpha: 0 });

      gsap.to(logoRef.current, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', delay: 0.1 });
      gsap.to(navItems, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', stagger: 0.07, delay: 0.25 });
      if (ctaRef.current) {
        gsap.to(ctaRef.current, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', delay: 0.6 });
      }
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // ── scroll detection ───────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── mobile menu GSAP timeline ──────────────────────────────────────
  useEffect(() => {
    const overlay = menuOverlay.current;
    const links   = menuLinks.current.filter(Boolean);
    if (!overlay) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    menuTl.current = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' } });

    if (prefersReducedMotion) {
      menuTl.current
        .set(overlay, { autoAlpha: 1, pointerEvents: 'auto' })
        .set(links, { autoAlpha: 1, y: 0 });
    } else {
      menuTl.current
        .set(overlay, { autoAlpha: 1, pointerEvents: 'auto', clipPath: 'inset(0 0 100% 0)' })
        .to(overlay, { clipPath: 'inset(0 0 0% 0)', duration: 0.7 })
        .fromTo(links, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.07 }, '-=0.3');
    }

    return () => { menuTl.current?.kill(); };
  }, []);

  useEffect(() => {
    if (!menuTl.current) return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      menuTl.current.play();
    } else {
      document.body.style.overflow = '';
      menuTl.current.reverse();
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── close on route change ──────────────────────────────────────────
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const handleLogoClick = () => {
    if (location.pathname === '/') scrollToTop();
    else navigate('/');
    setIsOpen(false);
  };

  const handleNavClick = (sectionId: string) => {
    if (location.pathname === '/') scrollToSection(sectionId);
    else navigate('/', { state: { scrollTo: sectionId } });
    setIsOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-500 ${
        scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-[70px] md:h-[80px]">

          {/* Logo */}
          <div ref={logoRef}>
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 shrink-0 group">
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img src="/assets/logo.jpeg" alt="4AM Global Media" className="w-full h-full object-cover" />
              </div>
              <span className="text-white text-sm font-black tracking-[0.15em] uppercase hidden md:block group-hover:opacity-70 transition-opacity duration-300">
                4AM
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav ref={desktopNav} className="hidden lg:flex items-center gap-8 xl:gap-10">
            {NAV_LINKS.map((link) => (
              <NavButton key={link.label} label={link.label} onClick={() => handleNavClick(link.sectionId)} />
            ))}
          </nav>

          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-4">
            <button
              ref={ctaRef}
              className="hidden md:flex items-center justify-center px-5 py-2 rounded-full bg-white text-black text-[11px] font-black tracking-[0.15em] uppercase hover:bg-white/80 active:scale-95 transition-all duration-200"
              onClick={() => handleNavClick('contact')}
            >
              Let's Talk
            </button>

            {/* Hamburger — animated bars */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] group z-50"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <span className={`block w-6 h-[1.5px] bg-white origin-center transition-all duration-400 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block h-[1.5px] bg-white transition-all duration-300 ${isOpen ? 'w-0 opacity-0' : 'w-6'}`} />
              <span className={`block w-6 h-[1.5px] bg-white origin-center transition-all duration-400 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile full-screen overlay — GSAP clip-path wipe */}
      <div
        ref={menuOverlay}
        className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center opacity-0 pointer-events-none"
        style={{ clipPath: 'inset(0 0 100% 0)' }}
      >
        {/* Background giant text */}
        <span
          className="absolute text-[40vw] font-black text-white/[0.03] uppercase leading-none select-none pointer-events-none"
          aria-hidden="true"
        >
          4AM
        </span>

        <nav className="flex flex-col items-center gap-6 relative z-10">
          {NAV_LINKS.map((link, i) => (
            <button
              key={link.label}
              ref={(el) => { if (el) menuLinks.current[i] = el; }}
              onClick={() => handleNavClick(link.sectionId)}
              className="text-[10vw] sm:text-6xl font-black tracking-[-0.02em] text-white uppercase hover:text-white/40 transition-colors duration-300 leading-none"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Bottom bar */}
        <div className="absolute bottom-10 left-6 right-6 flex items-center justify-between text-[10px] font-bold tracking-[0.25em] uppercase text-white/20">
          <span>4AM Global Media</span>
          <a href="mailto:4amglobalmedia@gmail.com" className="hover:text-white/60 transition-colors">
            4amglobalmedia@gmail.com
          </a>
        </div>
      </div>
    </header>
  );
};

/* Animated underline nav button */
const NavButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    if (!lineRef.current) return;
    gsap.fromTo(lineRef.current, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.35, ease: 'expo.out' });
  };
  const onLeave = () => {
    if (!lineRef.current) return;
    gsap.to(lineRef.current, { scaleX: 0, transformOrigin: 'right center', duration: 0.3, ease: 'expo.in' });
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative text-[11px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-300 uppercase py-1"
    >
      {label}
      <span ref={lineRef} className="absolute bottom-0 left-0 w-full h-px bg-white scale-x-0" />
    </button>
  );
};

export default Navbar;
