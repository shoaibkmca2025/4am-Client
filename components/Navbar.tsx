import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { scrollToSection, scrollToTop } from '../utils/scroll';
import { useActiveSection } from '../utils/useActiveSection';

// `to` links navigate to their own route; `sectionId` links scroll the
// landing page (and route home first when we are somewhere else).
type NavLink = { label: string; sectionId?: string; to?: string };

const NAV_LINKS: NavLink[] = [
  { label: 'WORK',     sectionId: 'work' },
  { label: 'SERVICES', to: '/services' },
  { label: 'ABOUT',    sectionId: 'about' },
  { label: 'CONTACT',  sectionId: 'contact' },
];

const NAV_IDS = NAV_LINKS.map((l) => l.sectionId).filter(Boolean) as string[];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const headerRef    = useRef<HTMLElement>(null);
  const logoRef      = useRef<HTMLDivElement>(null);
  const desktopNav   = useRef<HTMLElement>(null);
  const ctaRef       = useRef<HTMLButtonElement>(null);
  const menuOverlay  = useRef<HTMLDivElement>(null);
  const menuLinks    = useRef<HTMLButtonElement[]>([]);
  const menuTl       = useRef<gsap.core.Timeline | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';
  // The active-link underline only exists in the desktop nav (hidden lg) —
  // skip the per-scroll layout reads entirely on phones.
  const [trackSections] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );
  const activeSection = useActiveSection(onHome && trackSections ? NAV_IDS : []);

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
    setIsOpen(false);
  };

  const handleNavClick = (link: NavLink) => {
    if (link.to) {
      navigate(link.to);
    } else if (location.pathname === '/') {
      scrollToSection(link.sectionId!);
    } else {
      navigate('/', { state: { scrollTo: link.sectionId } });
    }
    setIsOpen(false);
  };

  const isActive = (link: NavLink) =>
    link.to ? location.pathname.startsWith(link.to) : onHome && activeSection === link.sectionId;

  // Always transparent: the scrolled cream fill + blur + bottom rule painted
  // an opaque band across the top of the scroll sequence and every section
  // behind it. The full-screen mobile menu below keeps its own solid
  // background — that one has to be readable.
  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-[9990] bg-transparent"
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-[70px] md:h-[80px]">

          {/* Logo */}
          <div ref={logoRef}>
            <Link
              to="/"
              onClick={handleLogoClick}
              className="flex items-center shrink-0 group"
              aria-label="4AM Global Media — home"
            >
              <img
                src="/logo-mark.png"
                alt="4AM Global Media"
                className="h-9 md:h-11 w-auto rounded-lg bg-[#1d1d1d] px-2.5 py-1.5 shadow-[0_2px_12px_rgba(32,30,29,0.18)] group-hover:opacity-90 transition-opacity duration-300"
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav ref={desktopNav} className="hidden lg:flex items-center gap-8 xl:gap-10">
            {NAV_LINKS.map((link) => (
              <NavButton
                key={link.label}
                label={link.label}
                active={isActive(link)}
                onClick={() => handleNavClick(link)}
              />
            ))}
          </nav>

          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-4">
            <button
              ref={ctaRef}
              className="flex items-center justify-center px-5 py-2 max-md:px-3.5 max-md:py-1.5 rounded-full bg-[#c67139] text-[#f5ead8] text-[11px] max-md:text-[10px] font-semibold tracking-[0.12em] uppercase hover:bg-[#b2622d] active:scale-95 transition-all duration-200"
              onClick={() => handleNavClick({ label: 'CONTACT', sectionId: 'contact' })}
            >
              Let's Talk
            </button>

            {/* Hamburger — animated bars */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="nav-legible-bar lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] group z-50"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <span className={`block w-6 h-[1.5px] bg-[#201e1d] origin-center transition-all duration-300 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block h-[1.5px] bg-[#201e1d] transition-all duration-300 ${isOpen ? 'w-0 opacity-0' : 'w-6'}`} />
              <span className={`block w-6 h-[1.5px] bg-[#201e1d] origin-center transition-all duration-300 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile full-screen overlay — GSAP clip-path wipe */}
      <div
        ref={menuOverlay}
        className="fixed inset-0 bg-[#f5ead8] z-40 flex flex-col items-center justify-center opacity-0 pointer-events-none"
        style={{ clipPath: 'inset(0 0 100% 0)' }}
      >
        {/* Background giant text */}
        <span
          className="absolute text-[40vw] text-[#201e1d]/[0.05] leading-none select-none pointer-events-none"
          style={{ fontFamily: 'Caprasimo, Georgia, serif' }}
          aria-hidden="true"
        >
          4AM
        </span>

        <nav className="flex flex-col items-center gap-6 relative z-10">
          {NAV_LINKS.map((link, i) => (
            <button
              key={link.label}
              ref={(el) => { if (el) menuLinks.current[i] = el; }}
              onClick={() => handleNavClick(link)}
              className="group flex items-baseline gap-4 text-[9vw] sm:text-5xl tracking-[-0.01em] text-[#201e1d] hover:text-[#c67139] transition-colors duration-300 leading-none"
              style={{ fontFamily: 'Caprasimo, Georgia, serif' }}
            >
              <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#c67139]/60 group-hover:text-[#c67139] transition-colors duration-300" style={{ fontFamily: 'Figtree, sans-serif' }}>
                0{i + 1}
              </span>
              {link.label}
            </button>
          ))}
        </nav>

        {/* Bottom bar */}
        <div className="absolute bottom-10 left-6 right-6 flex items-center justify-between text-[10px] font-semibold tracking-[0.25em] uppercase text-[#201e1d]/40">
          <span>4AM Global Media</span>
          <a href="mailto:Info@4amglobalmedia.com" className="hover:text-[#c67139] transition-colors">
            Info@4amglobalmedia.com
          </a>
        </div>
      </div>
    </header>
  );
};

/* Animated underline nav button — persistent underline + color when active */
const NavButton: React.FC<{ label: string; active?: boolean; onClick: () => void }> = ({ label, active = false, onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  // Active state owns the underline; hover only animates it when inactive
  useEffect(() => {
    if (!lineRef.current) return;
    gsap.to(lineRef.current, {
      scaleX: active ? 1 : 0,
      transformOrigin: 'left center',
      duration: 0.4,
      ease: 'expo.out',
      overwrite: 'auto',
    });
  }, [active]);

  const onEnter = () => {
    if (!lineRef.current || active) return;
    gsap.fromTo(lineRef.current, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.35, ease: 'expo.out' });
  };
  const onLeave = () => {
    if (!lineRef.current || active) return;
    gsap.to(lineRef.current, { scaleX: 0, transformOrigin: 'right center', duration: 0.3, ease: 'expo.in' });
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-current={active ? 'true' : undefined}
      className={`nav-legible relative text-[11px] font-semibold tracking-[0.2em] transition-colors duration-300 uppercase py-1 ${
        active ? 'text-[#c67139]' : 'text-[#201e1d]/60 hover:text-[#201e1d]'
      }`}
    >
      {label}
      <span
        ref={lineRef}
        className={`absolute bottom-0 left-0 w-full h-px scale-x-0 ${active ? 'bg-[#c67139]' : 'bg-[#201e1d]'}`}
      />
    </button>
  );
};

export default Navbar;
