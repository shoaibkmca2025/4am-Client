
import React, { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MonkeyThemeToggle from './MonkeyThemeToggle';
import LogoImage from '../assets/logo.jpeg';
import { scrollToSection } from '../utils/scroll';

const ConnectButton: React.FC<{ className?: string; onClick?: () => void }> = ({ className, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative group px-3 md:px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden cursor-pointer shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 text-white border border-white/10 hover:border-white/20 ${className || 'w-auto'}`}
    >
      <div className="flex items-center gap-1.5 relative z-20">
        <Zap className={`w-3 h-3 transition-transform duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`} />
        <span className="font-mono relative top-[1px] whitespace-nowrap">
          <span className="hidden xl:inline">Get Free </span>
          <span className="hidden md:inline xl:hidden">Let's Talk</span>
          <span className="md:hidden">Book</span>
        </span>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.button>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>('home');
  const lastScrollY = React.useRef(0);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
    setIsOpen(false);
  };

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, item: (typeof NAV_ITEMS)[number]) => {
    event.preventDefault();

    if (item.sectionId) {
      if (location.pathname === '/') {
        scrollToSection(item.sectionId);
      } else {
        navigate('/', { state: { scrollTo: item.sectionId } });
      }
      setIsOpen(false);
      return;
    }

    if (item.href === '/') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
    } else if (location.pathname !== item.href) {
      navigate(item.href);
    }

    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Auto-hide logic
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100 && !isOpen) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
      setScrolled(currentScrollY > 20);

      if (location.pathname === '/' && currentScrollY < 120) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection(null);
      return;
    }

    const sectionIds = ['home', 'services', 'about', 'work', 'insights', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: 0.35 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9999] transform-gpu transition-all duration-300 ease-in-out ${
        scrolled ? 'py-1.5' : 'py-2.5'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        <div className="flex w-full items-center justify-between gap-2 md:gap-4 lg:gap-6 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.30)] px-4 py-2">

        {/* 1. Left Section: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-zinc-900/90 dark:bg-black flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-105">
              <img
                src={LogoImage}
                alt="4AM Global Media logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden lg:block">
              <span className="text-lg font-display font-semibold text-zinc-900 dark:text-white uppercase tracking-wide block">
                4AM Global Media
              </span>
            </div>
          </Link>
        </div>

        {/* 2. Center Section: Navigation Links (Desktop) */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-8">
          {NAV_ITEMS.map((item) => {
            const isHomeItem = item.label.toLowerCase() === 'home';
            let active = false;

            if (item.sectionId) {
              active = location.pathname === '/' && activeSection === item.sectionId;
            } else if (isHomeItem) {
              active =
                location.pathname === '/' &&
                (!activeSection || activeSection === 'home');
            } else {
              active = location.pathname === item.href;
            }

            if (item.sectionId && location.pathname === '/') {
              return (
                <button
                  key={item.label}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.sectionId!);
                    setIsOpen(false);
                  }}
                  className={`group relative text-[11px] font-semibold tracking-[0.24em] uppercase transition-colors duration-300 cursor-pointer ${
                    active
                      ? 'text-zinc-900 dark:text-white'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span
                    className={`absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent origin-center transform-gpu transition-all duration-300 ease-out ${
                      active ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50'
                    }`}
                  />
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={(event) => handleNavClick(event, item)}
                className={`group relative text-[11px] font-semibold tracking-[0.24em] uppercase transition-colors duration-300 cursor-pointer ${
                  active
                    ? 'text-zinc-900 dark:text-white'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  className={`absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent origin-center transform-gpu transition-all duration-300 ease-out ${
                    active
                      ? 'scale-x-100 opacity-100'
                      : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* 3. Right Section: Utils & CTA */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="hidden md:block scale-90">
            <MonkeyThemeToggle compact={true} />
          </div>

          <div className="hidden md:block">
            <ConnectButton onClick={() => scrollToSection('contact')} />
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute top-full left-0 right-0 md:hidden px-4 pb-4 max-h-[calc(100vh-80px)] overflow-y-auto pointer-events-auto"
          >
            <div className="glass bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-zinc-200/80 dark:border-white/5 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.3)] p-4 flex flex-col gap-3">
              {NAV_ITEMS.map((item) => {
                if (item.sectionId && location.pathname === '/') {
                  return (
                    <button
                      key={item.label}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                        scrollToSection(item.sectionId!); 
                      }}
                      className="text-sm font-semibold uppercase tracking-[0.22em] text-center text-zinc-600 dark:text-zinc-200 py-3 hover:text-brand-primary active:bg-zinc-100 dark:active:bg-white/5 rounded-xl transition-colors w-full"
                    >
                      {item.label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={(event) => handleNavClick(event, item)}
                    className="text-sm font-semibold uppercase tracking-[0.22em] text-center text-zinc-600 dark:text-zinc-200 py-3 hover:text-brand-primary active:bg-zinc-100 dark:active:bg-white/5 rounded-xl transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-zinc-100 dark:border-white/10 flex flex-col gap-3">
                <div className="w-full">
                  <ConnectButton 
                    className="w-full py-2.5" 
                    onClick={() => {
                      setIsOpen(false);
                      scrollToSection('contact');
                    }}
                  />
                </div>
                <div className="flex justify-center py-2">
                  <MonkeyThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
