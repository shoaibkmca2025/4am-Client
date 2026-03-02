import React from 'react';
import { Instagram, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import LogoImage from '../assets/logo.jpeg';
import { scrollToSection } from '../utils/scroll';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-50 border-t border-white/10 bg-black/20 backdrop-blur-md text-white transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-[1200px] py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 mb-12">
          <div className="md:col-span-4 space-y-6">
            <a 
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
              className="inline-flex items-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src={LogoImage}
                  alt="4AM Global Media logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-display font-bold uppercase tracking-tight text-white">
                4AM Global Media
              </span>
            </a>
            <p className="text-sm md:text-base text-gray-400 max-w-sm leading-relaxed">
              The growth engine that never sleeps. Powering founders, operators, and teams across the globe.
            </p>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gray-300 font-bold">
                Systems online
              </span>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="space-y-6">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-primary/80">
                Services
              </h4>
              <div className="space-y-3 text-sm">
                <a
                  href="#services"
                  onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
                  className="inline-flex items-center gap-1 text-white font-bold hover:text-brand-primary transition-colors"
                >
                  Full service menu
                  <ArrowRight className="w-3 h-3" />
                </a>
                <a 
                  href="#services"
                  onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Product & web
                </a>
                <a 
                  href="#services"
                  onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Paid growth
                </a>
                <a 
                  href="#services"
                  onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  SEO & content
                </a>
                <a 
                  href="#services"
                  onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Brand systems
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-primary/80">
                Resources
              </h4>
              <div className="space-y-3 text-sm">
                <a 
                  href="#work"
                  onClick={(e) => { e.preventDefault(); scrollToSection('work'); }}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Case studies
                </a>
                <a 
                  href="#services"
                  onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Service overview
                </a>
                <span className="block text-brand-gray/60 cursor-not-allowed">
                  ROI & performance reports
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-primary/80">
                Company
              </h4>
              <div className="space-y-3 text-sm">
                <a 
                  href="#work"
                  onClick={(e) => { e.preventDefault(); scrollToSection('work'); }}
                  className="block text-brand-gray hover:text-brand-dark transition-colors"
                >
                  Our Work
                </a>
                <a 
                  href="#services"
                  onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
                  className="block text-brand-gray hover:text-brand-dark transition-colors"
                >
                  Pricing
                </a>
                <a 
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                  className="block text-brand-gray hover:text-brand-dark transition-colors"
                >
                  Partner with us
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-primary/80">
              Contact
            </h4>

            <div className="flex gap-3">
              <a
                href="mailto:4amhustles@gmail.com"
                aria-label="Email us"
                className="w-14 h-14 rounded-2xl bg-brand-surface border border-white/60 shadow-clay hover:shadow-clay-hover hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
                title="Email"
              >
                <Mail className="w-6 h-6 text-brand-gray group-hover:text-brand-primary transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/reel/DUBIUl5DfBU/?utm_source=ig_web_copy_link"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-14 h-14 rounded-2xl bg-brand-surface border border-white/60 shadow-clay hover:shadow-clay-hover hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
                title="Instagram"
              >
                <Instagram className="w-6 h-6 text-brand-gray group-hover:text-brand-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-4 border-t border-brand-gray/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-brand-gray/60">
          <p className="font-mono uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} 4AM Global Media. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span className="font-medium text-brand-gray">Secure</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-brand-gray/30" />
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-brand-gray/50" />
              <span>Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
