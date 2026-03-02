import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, ChevronDown } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LogoImage from '../assets/logo.jpeg';
import { scrollToSection } from '../utils/scroll';

const ConnectButton: React.FC<{ className?: string; onClick?: () => void }> = ({ className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 md:px-5 py-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-brand-dark shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-white/40 transition-all duration-300 ${className || 'w-auto'}`}
    >
      <div className="flex items-center justify-center">
        <Zap className="w-3.5 h-3.5 mr-2 fill-black/10" />
        <span className="font-bold text-[11px] tracking-wide uppercase">
          <span className="hidden xl:inline">Get Started</span>
          <span className="hidden md:inline xl:hidden">Let's Talk</span>
          <span className="md:hidden">Book</span>
        </span>
      </div>
    </button>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>('home');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
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

  const handleContactClick = () => {
    if (location.pathname === '/') {
      scrollToSection('contact');
    } else {
      navigate('/', { state: { scrollTo: 'contact' } });
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

    const sectionIds = ['home', 'services', 'about', 'work', 'contact'];
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
      className={`fixed top-0 left-0 right-0 z-[9999] transform-gpu transition-all duration-500 ease-in-out ${
        scrolled ? 'py-2' : 'py-4'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        <div className={`flex w-full items-center justify-between gap-2 md:gap-4 lg:gap-6 rounded-full px-4 py-2.5 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-lg border border-white/50' 
            : 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]'
        }`}>

        {/* 1. Left Section: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/90 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 ring-1 ring-white/50">
              <img
                src={LogoImage}
                alt="4AM Global Media logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden lg:block">
              <span className={`text-lg font-display font-bold uppercase tracking-wide block transition-colors duration-300 ${scrolled ? 'text-brand-dark' : 'text-white'}`}>
                4AM Global Media
              </span>
            </div>
          </Link>
        </div>

        {/* 2. Center Section: Navigation Links (Desktop) */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-8">
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

            return (
              <div key={item.label} className="relative group">
                <Link
                  to={item.href}
                  onClick={(event) => handleNavClick(event, item)}
                  className={`flex items-center gap-1 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer px-3 py-1.5 rounded-full ${
                    active
                      ? 'text-brand-primary bg-white/20 shadow-inner'
                      : scrolled 
                        ? 'text-brand-gray hover:text-brand-primary hover:bg-brand-primary/5' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                  {item.subItems && <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />}
                </Link>

                {/* Desktop Dropdown */}
                {item.subItems && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl p-2 w-64 flex flex-col gap-1 overflow-hidden ring-1 ring-black/5">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.href}
                          onClick={(event) => handleNavClick(event, subItem)}
                          className="text-xs font-bold text-brand-gray px-4 py-3 hover:bg-brand-primary/10 hover:text-brand-primary rounded-xl transition-all duration-200 text-left block tracking-wide uppercase"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* 3. Right Section: CTA & Mobile Menu */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <ConnectButton 
            onClick={handleContactClick}
            className="hidden sm:flex"
          />
          
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm border border-transparent ${scrolled ? 'text-brand-gray hover:text-brand-primary hover:bg-brand-bg' : 'text-white hover:bg-white/10 hover:border-white/20'}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 px-4 pb-4">
          <div className="bg-brand-surface border border-white/60 rounded-[32px] shadow-clay p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="w-full">
                <div className="flex items-center justify-between w-full">
                  <Link
                    to={item.href}
                    onClick={(event) => handleNavClick(event, item)}
                    className="flex-1 text-sm font-bold uppercase tracking-[0.2em] text-brand-dark py-3 hover:text-brand-primary active:bg-brand-bg rounded-xl transition-colors text-center"
                  >
                    {item.label}
                  </Link>
                  {item.subItems && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setExpandedItem(expandedItem === item.label ? null : item.label);
                      }}
                      className="p-3 text-brand-gray hover:text-brand-dark"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          expandedItem === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>
                
                {/* Mobile Submenu */}
                {item.subItems && expandedItem === item.label && (
                  <div className="bg-brand-bg/50 rounded-2xl p-2 mb-2 space-y-1 mt-2">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.href}
                        onClick={(event) => handleNavClick(event, subItem)}
                        className="block text-xs font-bold text-brand-gray py-3 px-4 hover:text-brand-primary hover:bg-white rounded-xl transition-all text-center uppercase tracking-wider shadow-sm hover:shadow-md"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="pt-4 border-t border-brand-gray/10 flex flex-col gap-3">
              <ConnectButton 
                onClick={handleContactClick}
                className="w-full justify-center py-4 text-sm"
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </header>
  );
};

export default Navbar;
