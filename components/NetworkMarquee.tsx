import React from 'react';
import { PROJECTS } from '../constants';

const NetworkMarquee: React.FC = () => {
  return (
    <section
      id="clients"
      className="py-16 border-y border-zinc-100 dark:border-white/10 bg-gradient-to-r from-slate-50 via-white to-slate-100 dark:from-brand-dark dark:via-[#050816] dark:to-brand-obsidian transition-colors duration-500"
    >
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="text-center mb-8">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-zinc-500">
            Trusted by growing brands
          </p>
        </div>
        <div className="relative overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-10 py-2">
            {PROJECTS.map((project) => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.25em] text-zinc-700 dark:text-zinc-300 hover:border-brand-primary hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
              >
                <span className="w-1 h-1 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(129,140,248,0.9)]" />
                <span>{project.title}</span>
              </a>
            ))}
            {PROJECTS.map((project) => (
              <a
                key={`dup-${project.id}`}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.25em] text-zinc-700 dark:text-zinc-300 hover:border-brand-primary hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
              >
                <span className="w-1 h-1 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(129,140,248,0.9)]" />
                <span>{project.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkMarquee;
