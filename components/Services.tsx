import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import SpotlightSection from './SpotlightSection';
import TiltCard from './TiltCard';
import { SERVICES } from '../constants';
import { Service } from '../types';

const ServiceCard: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  return (
    <ScrollReveal delay={index * 80}>
      <TiltCard className="h-full">
        <Link 
          to={`/services/${service.slug}`}
          className="block group relative h-[240px] md:h-[280px] w-full overflow-hidden rounded-[24px] bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 scroll-mt-24 cursor-pointer backdrop-blur-sm"
        >
          {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Content Container */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="flex items-end justify-between gap-3">
            
            {/* Text Content */}
            <div className="flex-1 transform transition-transform duration-300 group-hover:-translate-y-2">
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md tracking-tight">
                {service.title}
              </h3>
              <p className="text-brand-surface/90 text-sm leading-relaxed font-medium line-clamp-2 text-pretty">
                {service.description}
              </p>
            </div>

            {/* CTA Button */}
            <div className="shrink-0 transform transition-all duration-300 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="h-8 w-8 rounded-full bg-brand-surface shadow-soft flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
      </TiltCard>
    </ScrollReveal>
  );
};

const Services: React.FC = () => {
  return (
    <SpotlightSection id="services" className="py-20 md:py-24 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-lg text-gray-300 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              Our Capabilities
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Comprehensive Digital Solutions
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              Designed to scale your business with precision and authority.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </SpotlightSection>
  );
};

export default Services;
