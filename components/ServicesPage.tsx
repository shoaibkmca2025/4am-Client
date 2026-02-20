import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import { Instagram, Target, Code, TrendingUp, PenTool, Bitcoin, ArrowRight, Zap, Shield, Cpu, Globe, ArrowLeft, Check, Minus } from 'lucide-react';

const iconMap: any = {
  instagram: <Instagram className="w-6 h-6" />,
  target: <Target className="w-6 h-6" />,
  code: <Code className="w-6 h-6" />,
  'trending-up': <TrendingUp className="w-6 h-6" />,
  'pen-tool': <PenTool className="w-6 h-6" />,
  bitcoin: <Bitcoin className="w-6 h-6" />,
};

const pricingTiers = [
  { 
    name: 'Growth', 
    price: 'From $2,500', 
    desc: 'Foundational growth for scaling startups.',
    features: ['Custom Landing Page', 'Basic SEO Setup', 'Single Ad Channel', 'Weekly Reporting', 'Core Maintenance']
  },
  { 
    name: 'Scale', 
    price: 'From $7,500', 
    desc: 'Aggressive multi-channel expansion.',
    features: ['Full Web App Suite', 'Technical SEO Audit', 'Multi-channel Ads', 'Bi-weekly Strategy Sync', 'Conversion Optimization', 'Creative Direction']
  },
  { 
    name: 'Enterprise', 
    price: 'Custom', 
    desc: 'Total digital dominance for industry leaders.',
    features: ['Custom Tech Infrastructure', 'Global Organic Strategy', 'Unlimited Ad Management', 'Dedicated Architect Team', 'Real-time Signal Dashboards', 'Full Content Studio']
  }
];

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-48 relative overflow-hidden bg-white dark:bg-brand-dark transition-colors duration-500">
      {/* Decorative Orbs */}
      <div className="absolute top-[10%] -left-48 w-[600px] h-[600px] bg-brand-primary/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] -right-48 w-[500px] h-[500px] bg-brand-accent/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-12">
            <Link 
              to="/"
              className="inline-flex items-center gap-3 text-[10px] font-bold text-slate-400 hover:text-brand-primary uppercase tracking-[0.3em] transition-all group"
            >
              <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-brand-primary/5 transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Core
            </Link>
          </div>

          {/* Hero Section */}
          <div className="mb-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-12 h-[1px] bg-brand-primary" />
              <span className="text-brand-primary font-mono font-bold tracking-[0.5em] uppercase text-xs">Capability Spectrum</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.85] mb-12 heading-interactive"
            >
              THE CORE <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-indigo-500 to-brand-accent heading-gradient-animated">
                OFFERING.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-light max-w-2xl leading-relaxed italic"
            >
              From custom code to viral growth, we provide the full-stack infrastructure required for category leadership.
            </motion.p>
          </div>

          {/* Detailed Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 mb-48">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/services/${service.id}`)}
                className="group glass rounded-[2.5rem] p-10 cursor-pointer border border-white/40 dark:border-white/5 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 h-full"
              >
                <div className="flex flex-col h-full">
                  <div className="w-14 h-14 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary shadow-sm mb-8 group-hover:scale-110 transition-transform duration-500 border border-slate-100 dark:border-white/5">
                    {iconMap[service.icon] || <Zap className="w-6 h-6" />}
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-4 group-hover:text-brand-primary transition-colors">
                    {service.title}
                  </h2>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8">
                    {service.description}
                  </p>

                  <div className="space-y-4 mb-12 flex-grow">
                    {service.features?.slice(0, 4).map((feature) => (
                      <div key={feature} className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Protocol Active</span>
                    </div>
                    <div className="flex items-center gap-3 text-brand-primary">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Full Spec</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pricing Matrix Section */}
          <div className="mb-48">
            <div className="text-center mb-24">
              <h2 className="text-sm font-mono font-bold text-brand-primary uppercase tracking-[0.5em] mb-4">Engagement Architecture</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tighter">Choose Your <br /> <span className="text-brand-primary">Growth Tier.</span></h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {pricingTiers.map((tier, i) => (
                <div 
                  key={tier.name}
                  className={`glass rounded-[3rem] p-10 border transition-all duration-500 flex flex-col ${
                    i === 1 ? 'border-brand-primary/50 shadow-3xl scale-105 z-10' : 'border-white/40 dark:border-white/5'
                  }`}
                >
                  <div className="mb-10">
                    <h4 className="text-2xl font-display font-bold uppercase mb-2">{tier.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">{tier.desc}</p>
                    <div className="text-4xl font-display font-bold text-brand-primary">{tier.price}</div>
                  </div>

                  <div className="space-y-4 mb-12 flex-grow">
                    {tier.features.map(f => (
                      <div key={f} className="flex items-center gap-4">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">{f}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all ${
                      i === 1 ? 'bg-brand-primary text-white shadow-xl' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    }`}
                  >
                    Select Mission
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-24 border-t border-slate-100 dark:border-white/5">
             {[
               { icon: Shield, label: 'Enterprise Security', text: 'Military-grade encryption for all client data modules.' },
               { icon: Cpu, label: 'Compute Power', text: 'Stateless architecture scaling across global edge nodes.' },
               { icon: Globe, label: 'Global Reach', text: 'Local presence optimization in over 40+ markets.' }
             ].map((item, i) => (
               <div key={i} className="space-y-6">
                 <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <item.icon className="w-6 h-6" />
                 </div>
                 <h4 className="text-xl font-display font-bold uppercase tracking-tight">{item.label}</h4>
                 <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
