
import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { scrollToSection } from '../utils/scroll';
import GlobalNetworkBackground from './GlobalNetworkBackground';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="home" ref={containerRef} className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-12 overflow-hidden bg-[#050B12]">
      {/* Background Elements */}
      <GlobalNetworkBackground />

      <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6 text-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg text-gray-300 text-sm font-medium tracking-wide uppercase animate-fade-in-up">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_12px_rgba(255,138,61,0.8)]" />
            Accepting New Projects
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1] animate-fade-in-up animation-delay-100 drop-shadow-2xl">
            We Build <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-[length:200%_auto] animate-text-shimmer">
              Digital Legacies
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 font-medium">
            Elevate your brand with premium web design, strategic marketing, and content that converts. 
            We turn vision into authority.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 animate-fade-in-up animation-delay-300">
            <button 
              onClick={() => scrollToSection('work')}
              className="group relative px-8 py-4 bg-gradient-primary text-white rounded-full font-bold tracking-wide shadow-[0_0_20px_rgba(255,138,61,0.4)] hover:shadow-[0_0_30px_rgba(255,138,61,0.6)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center justify-center gap-2 drop-shadow-md">
                View Our Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-full font-bold tracking-wide shadow-lg hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
            >
              Start a Project
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40 hidden md:block">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
          <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-scroll shadow-[0_0_8px_rgba(255,138,61,0.8)]" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
