
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, User, MapPin, GraduationCap, ShoppingBag, ArrowRight } from 'lucide-react';

const audiences = [
  {
    title: 'Startups & Scale-ups',
    desc: 'High-performance infrastructure and aggressive acquisition tactics for companies ready to dominate their category.',
    icon: Rocket
  },
  {
    title: 'Personal Brands & Creators',
    desc: 'Conversion-optimized ecosystems that establish definitive authority and capture high-value audience segments.',
    icon: User
  },
  {
    title: 'Local Service Providers',
    desc: 'Strategic SEO and local ad systems designed to convert community intent into consistent, high-ROI business.',
    icon: MapPin
  },
  {
    title: 'Coaches & Consultants',
    desc: 'Scalable lead generation funnels and authority-building content that automates your client acquisition pipeline.',
    icon: GraduationCap
  },
  {
    title: 'E-commerce & D2C',
    desc: 'Deep funnel optimization and ROAS-focused ad management for direct-to-consumer brands looking for massive scale.',
    icon: ShoppingBag
  }
];

const TargetAudience: React.FC = () => {
  return (
    <section className="py-32 bg-slate-50 dark:bg-brand-dark relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-24 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-4 mb-4"
            >
              <div className="w-8 h-[1px] bg-brand-primary" />
              <span className="text-brand-primary font-mono font-bold tracking-[0.4em] uppercase text-[10px]">Ecosystem Partners</span>
              <div className="w-8 h-[1px] bg-brand-primary" />
            </motion.div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tighter leading-[1.1]">
              Built for teams who
              <br />
              care about the details.
            </h3>
            <p className="mt-6 text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-light">
              We work best with founders and product leaders who see design, engineering, and growth as one connected system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {audiences.map((audience, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="glass p-10 rounded-[2.5rem] border border-white/40 dark:border-white/5 hover:border-brand-primary/30 transition-all group flex flex-col h-full"
              >
                <div className="w-14 h-14 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary mb-8 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shadow-inner">
                  <audience.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-display font-bold uppercase tracking-tight mb-4 leading-tight flex-grow">{audience.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">{audience.desc}</p>
                <div className="pt-4 mt-auto border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-brand-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                   <span className="text-[10px] font-bold uppercase tracking-widest">Connect</span>
                   <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
