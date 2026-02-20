
import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MonkeyThemeToggle from './MonkeyThemeToggle';
import LogoImage from '../4am logo.jpeg';

const ConnectButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: number;
    if (isHovered) {
      setStep(1);
      interval = window.setInterval(() => {
        setStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 700);
    } else {
      setStep(0);
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  const steps = [
    { label: "Establish Uplink", icon: Zap },
    { label: "Authenticating", icon: Loader2, animate: true },
    { label: "Syncing Nodes", icon: Loader2, animate: true },
    { label: "Access Granted", icon: CheckCircle2 }
  ];

  const current = steps[step];

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/contact')}
      className={`relative px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden ${isHovered
          ? 'bg-brand-primary text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)]'
          : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-transparent dark:border-white/10 shadow-sm'
        }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex items-center gap-2 relative z-20"
        >
          <current.icon className={`w-3.5 h-3.5 ${current.animate ? 'animate-spin' : ''}`} />
          <span className="font-mono">{current.label}</span>
        </motion.div>
      </AnimatePresence>
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-brand-obsidian/90 backdrop-blur-md border-b border-zinc-200 dark:border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* 1. Left Section: Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900/90 dark:bg-black flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-105">
              <img
                src={LogoImage}
                alt="4AM Global Media logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden lg:block">
              <span className="text-lg font-display font-bold text-zinc-900 dark:text-white uppercase tracking-tight block">4AM Global</span>
            </div>
          </Link>
        </div>

        {/* 2. Center Section: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`relative text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${active ? 'text-brand-primary' : 'text-zinc-500 dark:text-zinc-400 hover:text-brand-primary dark:hover:text-white'
                  }`}
              >
                {item.label}
                {active && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-brand-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 3. Right Section: Utils & CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block scale-90">
            <MonkeyThemeToggle compact={true} />
          </div>

          <div className="hidden sm:block">
            <ConnectButton />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-900 dark:text-white transition-all border border-zinc-200 dark:border-white/10"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-brand-obsidian border-b border-zinc-200 dark:border-white/10 shadow-2xl p-6 md:hidden flex flex-col gap-4"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300 hover:text-brand-primary py-2"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-zinc-400">Theme</span>
              <MonkeyThemeToggle compact={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
