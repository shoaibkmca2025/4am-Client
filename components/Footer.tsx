
import React from 'react';
import { Rocket, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="py-24 border-t border-zinc-200 dark:border-white/5 bg-white dark:bg-brand-obsidian">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-24">
          <div className="md:col-span-4 lg:col-span-5 space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold text-zinc-900 dark:text-white uppercase tracking-tight">4AM Global</span>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm text-lg leading-relaxed font-light">
              Engineering high-velocity digital assets for the next generation of category leaders.
            </p>
          </div>

          <div className="md:col-span-4 lg:col-span-3 lg:col-start-8 space-y-8">
            <h4 className="text-xs font-mono font-bold text-brand-primary uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="w-8 h-[2px] bg-brand-primary" />
              Network
            </h4>
            <div className="flex flex-col gap-4 text-base font-medium">
              <Link to="/services" className="text-zinc-500 hover:text-brand-primary transition-colors">Capabilities</Link>
              <Link to="/work" className="text-zinc-500 hover:text-brand-primary transition-colors">Archive</Link>
              <Link to="/insights" className="text-zinc-500 hover:text-brand-primary transition-colors">Intelligence</Link>
            </div>
          </div>

          <div className="md:col-span-4 lg:col-span-2 space-y-8">
            <h4 className="text-xs font-mono font-bold text-brand-primary uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="w-8 h-[2px] bg-brand-primary" />
              Social
            </h4>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-primary hover:border-brand-primary/30 transition-all hover:-translate-y-1">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} 4AM Global Media. All Rights Reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-xs font-bold text-zinc-400 hover:text-brand-primary transition-colors uppercase tracking-widest"
          >
            Back to top
            <div className="p-3 glass rounded-full group-hover:-translate-y-1 transition-transform border border-zinc-200 dark:border-white/10">
              <ArrowUp className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
