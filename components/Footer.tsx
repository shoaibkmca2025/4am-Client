
import React from 'react';
import { Twitter, Instagram, Linkedin, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LogoImage from '../4am logo.jpeg';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800 bg-brand-obsidian text-zinc-100">
      <div className="container mx-auto px-6 max-w-7xl py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-12">
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-lg shadow-brand-primary/40">
                <img
                  src={LogoImage}
                  alt="4AM Global Media logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-display font-bold uppercase tracking-tight">
                4AM Global Media
              </span>
            </Link>
            <p className="text-sm md:text-base text-zinc-400 max-w-sm leading-relaxed">
              The growth engine that never sleeps. Powering founders, operators, and teams across the globe.
            </p>
              <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-200">
                Systems online
              </span>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500">
                Services
              </h4>
              <div className="space-y-2 text-sm">
                <Link
                  to="/services"
                  className="flex items-center gap-1 text-zinc-100 font-semibold hover:text-brand-primary transition-colors"
                >
                  Full service menu
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link to="/services" className="block text-zinc-400 hover:text-zinc-100 transition-colors">
                  Product & web
                </Link>
                <Link to="/services" className="block text-zinc-400 hover:text-zinc-100 transition-colors">
                  Paid growth
                </Link>
                <Link to="/services" className="block text-zinc-400 hover:text-zinc-100 transition-colors">
                  SEO & content
                </Link>
                <Link to="/services" className="block text-zinc-400 hover:text-zinc-100 transition-colors">
                  Brand systems
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500">
                Industries
              </h4>
              <div className="space-y-2 text-sm">
                <span className="block text-zinc-400">SaaS & B2B software</span>
                <span className="block text-zinc-400">AI & data products</span>
                <span className="block text-zinc-400">Fintech & payments</span>
                <span className="block text-zinc-400">Education & community</span>
                <span className="block text-zinc-400">Premium e‑commerce</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500">
                Company
              </h4>
              <div className="space-y-2 text-sm">
                <Link to="/work" className="block text-zinc-400 hover:text-zinc-100 transition-colors">
                  Case studies
                </Link>
                <Link to="/insights" className="block text-zinc-400 hover:text-zinc-100 transition-colors">
                  Insights
                </Link>
                <Link to="/services" className="block text-zinc-400 hover:text-zinc-100 transition-colors">
                  Pricing overview
                </Link>
                <Link to="/contact" className="block text-zinc-400 hover:text-zinc-100 transition-colors">
                  Partner with us
                </Link>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500">
              Get in touch
            </h4>

            <div className="space-y-4">
              <a
                href="mailto:hello@4amglobal.media"
                className="block rounded-2xl border border-zinc-700/80 bg-zinc-900/40 px-4 py-3 hover:border-brand-primary hover:bg-brand-primary/10 transition-colors"
              >
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-1">
                  Email
                </p>
                <p className="text-sm font-medium text-zinc-100">
                  4amhustles@gmail.com
                </p>
              </a>

              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/reel/DUBIUl5DfBU/?utm_source=ig_web_copy_link"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-2xl border border-zinc-700/80 bg-zinc-900/40 px-4 py-3 hover:border-brand-primary hover:bg-brand-primary/10 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-1">
                      Instagram
                    </p>
                    <p className="text-sm font-medium text-zinc-100">
                      @4amglobalmedia
                    </p>
                  </div>
                  <Instagram className="w-4 h-4 text-zinc-400" />
                </a>
              </div>

              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-2xl border border-zinc-700/80 bg-zinc-900/40 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:border-brand-primary hover:bg-brand-primary/10 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-2xl border border-zinc-700/80 bg-zinc-900/40 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:border-brand-primary hover:bg-brand-primary/10 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-4 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p className="font-mono uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} 4AM Global Media. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" />
              <span>256‑bit SSL</span>
            </span>
            <span className="hidden md:inline-block h-3 w-px bg-zinc-700" />
            <span className="hidden md:inline-block">
              Satisfaction focused
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center gap-1 hover:text-zinc-300 transition-colors">
              <Lock className="w-3 h-3" />
              <span>Privacy</span>
            </button>
            <button className="hover:text-zinc-300 transition-colors">
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
