
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Search, Code, Zap, Palette, ArrowRight, Cpu } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import TiltCard from './TiltCard';
import SpotlightSection from './SpotlightSection';

type HomepageService = {
  title: string;
  description: string;
  icon: 'digital' | 'branding' | 'social' | 'seo' | 'web' | 'content';
};

const homepageServices: HomepageService[] = [
  {
    title: 'Digital Marketing',
    description: 'Paid and organic campaigns engineered to turn attention into predictable pipeline.',
    icon: 'digital',
  },
  {
    title: 'Branding',
    description: 'Visual identity and messaging systems that position you as the obvious choice.',
    icon: 'branding',
  },
  {
    title: 'Social Media Growth',
    description: 'Always-on content and social strategy designed for engagement and authority.',
    icon: 'social',
  },
  {
    title: 'SEO',
    description: 'Search strategies that compound over time and bring in high-intent, ready-to-buy traffic.',
    icon: 'seo',
  },
  {
    title: 'Web Development',
    description: 'Conversion-focused websites and landing pages built for speed and clarity.',
    icon: 'web',
  },
  {
    title: 'Content Creation',
    description: 'Video, copy, and creative assets that keep your brand present everywhere.',
    icon: 'content',
  },
];

const iconMap: Record<HomepageService['icon'], JSX.Element> = {
  digital: <Zap className="w-6 h-6" />,
  branding: <Palette className="w-6 h-6" />,
  social: <Share2 className="w-6 h-6" />,
  seo: <Search className="w-6 h-6" />,
  web: <Code className="w-6 h-6" />,
  content: <Cpu className="w-6 h-6" />,
};

const ServiceCard: React.FC<{ service: HomepageService; index: number }> = ({ service, index }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <ScrollReveal delay={index * 80}>
      <TiltCard
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate('/services')}
        className="group glass premium-card cursor-pointer border border-zinc-200 dark:border-white/5 h-full flex flex-col overflow-hidden shadow-sm hover:shadow-2xl dark:hover:shadow-brand-primary/10 transition-shadow duration-500"
      >
        <div className="relative z-10 flex flex-col h-full">
        <div className="w-14 h-14 bg-brand-primary/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary mb-8 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-inner">
          {iconMap[service.icon]}
        </div>

        <h4 className="text-xl md:text-2xl font-display font-bold text-zinc-900 dark:text-white tracking-tight mb-3 leading-snug group-hover:text-brand-primary transition-colors">
          {service.title}
        </h4>

        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">
          {service.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-8 border-t border-zinc-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isHovered ? 'bg-brand-primary shadow-[0_0_8px_#7C3AED]' : 'bg-zinc-300 dark:bg-white/10'}`} />
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.16em]">Made for real teams</span>
          </div>
          <div className="flex items-center gap-3 text-brand-primary opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
            <span className="text-[10px] font-bold uppercase tracking-widest">Full_Spec</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
        </div>

        {/* Ambient Gradient Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </TiltCard>
    </ScrollReveal>
  );
};

const Services: React.FC = () => {
  return (
    <SpotlightSection id="services" className="py-32 bg-white dark:bg-brand-dark transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <ScrollReveal className="max-w-4xl mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-brand-primary" />
            <span className="text-brand-primary font-mono font-bold tracking-[0.3em] uppercase text-xs">
              Our Services
            </span>
          </div>
          <h3
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-zinc-900 dark:text-white tracking-tight leading-[1.1]"
          >
            <span className="heading-interactive">
              Full-funnel growth
            </span>
            <br />
            <span className="heading-interactive heading-gradient heading-gradient-animated">
              for brands that want real results.
            </span>
          </h3>
          <p className="mt-6 text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed max-w-2xl">
            From strategy to execution, 4AM Global Media helps you show up where it matters and turn that attention into measurable growth.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {homepageServices.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </SpotlightSection>
  );
};

export default Services;
