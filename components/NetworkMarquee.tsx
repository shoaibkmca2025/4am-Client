import React from 'react';
import { CLIENTS } from '../constants';

const NetworkMarquee: React.FC = () => {
  return (
    <section id="clients" className="py-20 border-y border-gray-200 dark:border-white/5 bg-gradient-to-r from-brand-primary/5 via-gray-100/70 to-brand-accent/5 dark:from-brand-dark dark:via-black/40 dark:to-brand-obsidian overflow-hidden relative transition-colors duration-300">
      <div className="container mx-auto px-6 mb-10 text-center">
        <h2 className="text-2xl font-display font-bold text-gray-500 dark:text-gray-400">Trusted by 100+ Global Partners</h2>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center group-hover:[animation-play-state:paused]">
          {/* First set of clients */}
          {CLIENTS.map((client) => (
            <a 
              key={client.id} 
              href={client.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-2xl font-display font-bold text-gray-400 hover:text-brand-primary dark:text-gray-700 dark:hover:text-white transition-colors duration-300 uppercase tracking-tight flex-shrink-0"
            >
              {client.name}
            </a>
          ))}
          {/* Duplicate set for seamless loop */}
          {CLIENTS.map((client) => (
            <a 
              key={`dup-${client.id}`} 
              href={client.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-2xl font-display font-bold text-gray-400 hover:text-brand-primary dark:text-gray-700 dark:hover:text-white transition-colors duration-300 uppercase tracking-tight flex-shrink-0"
            >
              {client.name}
            </a>
          ))}
        </div>

        {/* Gradient fade on edges - Theme Aware */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-100 dark:from-brand-dark to-transparent z-10 pointer-events-none transition-colors duration-300"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-100 dark:from-brand-dark to-transparent z-10 pointer-events-none transition-colors duration-300"></div>
      </div>
    </section>
  );
};

export default NetworkMarquee;
