import React from 'react';
import { PROJECTS } from '../constants';
import LogoImage from '../4am logo.jpeg';

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
        <div className="relative overflow-hidden py-4">
          <div className="animate-marquee-ltr whitespace-nowrap flex items-center gap-10">
            {PROJECTS.map((project) => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-tr from-[#6366F1] via-[#7C3AED] to-[#22D3EE] shadow-md shadow-indigo-500/40 relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-full bg-white/10 dark:bg-white/5 mix-blend-screen animate-pulse" />
                <div className="absolute inset-0 rounded-full border border-white/40 dark:border-white/30 animate-spin" />
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 dark:bg-slate-900/95 shadow-sm overflow-hidden">
                  <img
                    src={LogoImage}
                    alt="4AM Global Media logo"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="sr-only">{project.title}</span>
              </a>
            ))}
            {PROJECTS.map((project) => (
              <a
                key={`dup-${project.id}`}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-tr from-[#6366F1] via-[#7C3AED] to-[#22D3EE] shadow-md shadow-indigo-500/40 relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-full bg-white/10 dark:bg-white/5 mix-blend-screen animate-pulse" />
                <div className="absolute inset-0 rounded-full border border-white/40 dark:border-white/30 animate-spin" />
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 dark:bg-slate-900/95 shadow-sm overflow-hidden">
                  <img
                    src={LogoImage}
                    alt="4AM Global Media logo"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="sr-only">{project.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkMarquee;
