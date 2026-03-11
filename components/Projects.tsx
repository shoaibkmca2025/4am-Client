import React, { useRef, useState, useEffect } from 'react';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import SpotlightSection from './SpotlightSection';
import TiltCard from './TiltCard';
import { optimizeImageUrl } from '../utils/image';

const FEATURED_PROJECTS = PROJECTS.slice(0, 18);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const getProjectPreviewUrl = (title: string) => {
    return optimizeImageUrl(`https://picsum.photos/seed/${encodeURIComponent(title)}/800/1000`, {
      width: 800,
      height: 1000,
      quality: 68,
      format: 'webp',
    });
  };

  const primaryImage =
    (project.image
      ? optimizeImageUrl(project.image, { width: 800, height: 1000, quality: 70, format: 'webp' })
      : '') || getProjectPreviewUrl(project.title);

  const [imageSrc, setImageSrc] = useState(primaryImage);

  const handleClick = () => {
    window.open(project.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="snap-center shrink-0 w-[85vw] max-w-[320px] md:w-[340px] lg:w-[380px] h-[420px] md:h-[480px] relative group cursor-pointer"
      onClick={handleClick}
    >
      <TiltCard className="h-full w-full">
        <div className="w-full h-full rounded-[32px] overflow-hidden bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col backdrop-blur-sm">
          {/* Image Section - Top 50% */}
        <div className="relative h-[50%] overflow-hidden">
          <img
            src={imageSrc}
            alt={project.title}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            width={800}
            height={1000}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={() => {
              if (!imageSrc.includes('picsum.photos')) {
                setImageSrc(getProjectPreviewUrl(project.title));
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Industry Tag Floating */}
          <div className="absolute top-4 left-4">
             <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                {project.industry || 'Development'}
             </span>
          </div>
        </div>

        {/* Content Section - Bottom 50% */}
        <div className="h-[50%] p-8 flex flex-col justify-between bg-transparent relative z-10">
          <div>
            {/* Tech Stack */}
            <div className="flex -space-x-2 mb-4">
               {project.technologies.slice(0, 3).map((tech, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-black/50 border-2 border-white/10 flex items-center justify-center text-[10px] text-gray-300 font-bold shadow-sm backdrop-blur-md" title={tech}>
                    {tech.charAt(0)}
                  </div>
                ))}
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-brand-primary transition-colors duration-300">
              {project.title}
            </h3>
            
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed font-medium">
              {project.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
            <span className="text-xs font-bold text-brand-primary flex items-center gap-2">
               {project.result && (
                 <>
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                  {project.result}
                 </>
               )}
            </span>
            
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-soft border border-white/10">
               <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
      </TiltCard>
    </div>
  );
};

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setAutoScrollEnabled(!isMobile && !prefersReducedMotion);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (!autoScrollEnabled || isHovered) return;

    const interval = window.setInterval(() => {
      if (document.hidden || !containerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const cardWidth = containerRef.current.children[0]?.clientWidth || 300;
        containerRef.current.scrollBy({ left: cardWidth + 32, behavior: 'smooth' });
      }
    }, 4000);

    return () => {
      window.clearInterval(interval);
    };
  }, [autoScrollEnabled, isHovered]);

  const scrollLeft = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.children[0]?.clientWidth || 300;
      containerRef.current.scrollBy({ left: -(cardWidth + 32), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.children[0]?.clientWidth || 300;
      containerRef.current.scrollBy({ left: cardWidth + 32, behavior: 'smooth' });
    }
  };

  return (
    <SpotlightSection id="work" className="py-20 md:py-24 bg-transparent overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-brand-primary/10 blur-[120px]" />
         <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-brand-secondary/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-lg text-gray-300 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              Selected Work
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Featured Case Studies
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
             <div className="flex gap-4">
               <button 
                 onClick={scrollLeft}
                 className="w-12 h-12 rounded-full bg-white/10 shadow-soft flex items-center justify-center text-white hover:bg-brand-primary hover:text-white hover:shadow-lg transition-all duration-300 border border-white/10"
                 aria-label="Previous projects"
               >
                 <ChevronLeft className="w-5 h-5" />
               </button>
               <button 
                 onClick={scrollRight}
                 className="w-12 h-12 rounded-full bg-white/10 shadow-soft flex items-center justify-center text-white hover:bg-brand-primary hover:text-white hover:shadow-lg transition-all duration-300 border border-white/10"
                 aria-label="Next projects"
               >
                 <ChevronRight className="w-5 h-5" />
               </button>
             </div>
          </ScrollReveal>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
          className="relative -mx-6 px-6 md:mx-0 md:px-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            ref={containerRef}
            className="flex gap-6 md:gap-8 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {FEATURED_PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
             
             {/* View All Card (Last item) */}
             <div className="snap-center shrink-0 w-[85vw] max-w-[320px] md:w-[340px] lg:w-[380px] h-[420px] md:h-[480px] flex items-center justify-center">
                <a href="#" className="group flex flex-col items-center justify-center text-center p-8 rounded-[32px] bg-white/5 border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 w-full h-full backdrop-blur-sm">
                   <div className="w-20 h-20 rounded-full bg-black/20 shadow-inner flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                     <ArrowRight className="w-8 h-8 text-brand-primary" />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">View All Projects</h3>
                   <p className="text-gray-400 text-base max-w-xs font-medium">Explore our complete portfolio.</p>
                </a>
             </div>
          </div>
        </div>

      </div>
    </SpotlightSection>
  );
};

export default Projects;
