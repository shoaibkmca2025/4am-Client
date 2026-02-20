
import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../constants';
import { Service } from '../types';
import { Share2, Search, Code, Zap, Palette, ArrowRight, Cpu } from 'lucide-react';

const iconMap: any = {
  'share-2': <Share2 className="w-6 h-6" />,
  'search': <Search className="w-6 h-6" />,
  'code': <Code className="w-6 h-6" />,
  'zap': <Zap className="w-6 h-6" />,
  'palette': <Palette className="w-6 h-6" />,
};

const ServiceCard: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  /* 
   * Enhanced 3D Tilt Effect 
   * Using stiffer spring physics for a more "software" feel.
   */
  const rotateX = useSpring(useTransform(mouseY, [0, 400], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [0, 400], [-8, 8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={() => navigate(`/services/${service.id}`)}
      style={{ rotateX, rotateY, perspective: 1000, transformStyle: "preserve-3d" }}
      className="group relative glass premium-card cursor-pointer border border-zinc-200 dark:border-white/5 h-full flex flex-col overflow-hidden shadow-sm hover:shadow-2xl dark:hover:shadow-brand-primary/10 transition-shadow duration-500 will-change-transform"
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="w-14 h-14 bg-brand-primary/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary mb-8 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-inner">
          {iconMap[service.icon] || <Cpu className="w-7 h-7" />}
        </div>

        <h4 className="text-xl md:text-2xl font-display font-bold text-zinc-900 dark:text-white tracking-tight mb-3 leading-snug group-hover:text-brand-primary transition-colors">
          {service.title}
        </h4>

        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">
          {service.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-8 border-t border-zinc-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isHovered ? 'bg-brand-primary shadow-[0_0_8px_#2563EB]' : 'bg-zinc-300 dark:bg-white/10'}`} />
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
    </motion.div>
  );
};

const Services: React.FC = () => {
  return (
    <section id="services" className="py-32 relative bg-white dark:bg-brand-dark transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="max-w-4xl mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-brand-primary" />
            <span className="text-brand-primary font-mono font-bold tracking-[0.3em] uppercase text-xs">What we do</span>
          </div>
          <motion.h3
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-zinc-900 dark:text-white tracking-tighter leading-[1.05]"
          >
            <span className="heading-interactive">
              Product, brand, and growth
            </span>
            <br />
            <span className="heading-interactive heading-gradient heading-gradient-animated">
              for modern software teams.
            </span>
          </motion.h3>
          <p className="mt-6 text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed max-w-2xl">
            From first impression to final conversion, we design full journeys – not just pages – tuned for your customers and your team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
