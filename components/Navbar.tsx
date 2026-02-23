
import React, { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MonkeyThemeToggle from './MonkeyThemeToggle';
import LogoImage from '../4am logo.jpeg';

const ConnectButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/contact')}
      className={`relative group w-full md:w-auto px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ease-out flex items-center justify-center gap-3 overflow-hidden cursor-pointer shadow-[0_14px_30px_rgba(15,23,42,0.24)] ${
        isHovered
          ? 'bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 text-white border border-transparent shadow-[0_0_20px_rgba(108,99,255,0.35)]'
          : 'bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 text-white border border-white/10'
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isHovered ? 'hover' : 'idle'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex items-center gap-2 relative z-20"
        >
          <Zap className={`w-3.5 h-3.5 ${isHovered ? 'animate-pulse' : ''}`} />
          <span className="font-mono">Get Free Consultation</span>
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const header = document.querySelector('header');
    const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 80;
    const rect = element.getBoundingClientRect();
    const offset = rect.top + window.scrollY - headerHeight - 8;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  };

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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[120] transition-all duration-300 ${
        scrolled ? 'py-1.5' : 'py-2.5'
      }`}
    >
      <div className="max-w-[1120px] mx-auto px-4">
        <div className="flex w-full items-center justify-between gap-6 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.30)] px-5 py-1">

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
        <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
          {NAV_ITEMS.map((item) => {
            const active = !item.sectionId
              ? location.pathname === item.href
              : location.pathname === '/' && item.href === '/';
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
                  className={`pointer-events-none absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent origin-center transform-gpu transition-all duration-300 ease-out ${
                    active
                      ? 'scale-x-100 opacity-100'
                      : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
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

          <ConnectButton />

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-900/70 flex items-center justify-center text-zinc-900 dark:text-white transition-all border border-zinc-200/70 dark:border-white/10 shadow-sm"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
            className="absolute top-full left-0 right-0 md:hidden px-4 pb-4"
          >
            <div className="glass bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-zinc-200/80 dark:border-white/5 rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.3)] p-5 flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={(event) => handleNavClick(event, item)}
                  className="text-sm font-semibold uppercase tracking-[0.22em] text-center text-zinc-600 dark:text-zinc-200 py-2 hover:text-brand-primary"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-zinc-100 dark:border-white/10 flex flex-col gap-4">
                <div className="w-full">
                  <ConnectButton />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-zinc-400">Theme</span>
                  <MonkeyThemeToggle compact={true} />
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
