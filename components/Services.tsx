import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import SpotlightSection from './SpotlightSection';
import { SERVICES } from '../constants';
import { Service } from '../types';

const ServiceCard: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  return (
    <ScrollReveal delay={index * 80}>
      <Link 
        to={`/services/${service.slug}`}
        className="block group relative h-[360px] w-full overflow-hidden rounded-[28px] bg-brand-surface shadow-clay hover:shadow-clay-hover transition-all duration-300 transform hover:-translate-y-2 scroll-mt-24 cursor-pointer"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
        </div>

        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Content Container */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="flex items-end justify-between gap-4">
            
            {/* Text Content */}
            <div className="flex-1 transform transition-transform duration-300 group-hover:-translate-y-2">
              <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-md tracking-tight">
                {service.title}
              </h3>
              <p className="text-brand-surface/90 text-sm leading-relaxed font-medium line-clamp-3 text-pretty">
                {service.description}
              </p>
            </div>

            {/* CTA Button */}
            <div className="shrink-0 transform transition-all duration-300 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="h-10 w-10 rounded-full bg-brand-surface shadow-soft flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
};

const Services: React.FC = () => {
  return (
    <SpotlightSection id="services" className="py-24 relative overflow-hidden bg-brand-bg">
      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-brand-surface shadow-clay text-brand-gray text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              Our Capabilities
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark tracking-tight mb-6">
              Comprehensive Digital Solutions
            </h2>
            <p className="text-brand-gray text-lg leading-relaxed font-medium">
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
