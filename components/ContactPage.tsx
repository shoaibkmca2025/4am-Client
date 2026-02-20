
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Contact from './Contact';
import Services from './Services';
import Projects from './Projects';
import Testimonials from './Testimonials';
import { Shield, Globe, Cpu, ArrowRight } from 'lucide-react';

const ContactPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-48 relative overflow-hidden bg-white dark:bg-brand-dark transition-colors duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.03),transparent_70%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto mb-32 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-[1px] bg-brand-primary" />
              <span className="text-brand-primary font-mono font-bold tracking-[0.5em] uppercase text-xs">Uplink_Initialization</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9] heading-interactive"
            >
              We help ambitious teams <br/>
              <span className="heading-gradient heading-gradient-animated text-brand-primary">
                design, build, and scale digital products.
              </span>
            </motion.h1>

            <div>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-4 inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-signal text-white font-bold rounded-2xl shadow-xl hover:shadow-brand-primary/40 hover:-translate-y-1 transition-all text-xs uppercase tracking-[0.2em]"
              >
                Start a Project
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-7">
               {[
                 { icon: Globe, label: 'Clients worldwide', text: 'We work with teams in 12+ regions.' },
                 { icon: Shield, label: 'Secure by default', text: 'Your first message is encrypted end-to-end.' },
                 { icon: Cpu, label: 'Senior review', text: 'Senior engineers review your project and map next steps.' },
               ].map((item, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.1 * i }}
                   className="flex items-center gap-6"
                 >
                   <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary border border-slate-100 dark:border-white/10">
                     <item.icon className="w-6 h-6" />
                   </div>
                   <div>
                     <p className="text-sm font-bold uppercase tracking-tight">{item.label}</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400 italic">{item.text}</p>
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative aspect-square">
               <div className="absolute inset-0 bg-brand-primary/8 blur-[120px] rounded-full" />
               <div className="absolute inset-0 border-2 border-dashed border-brand-primary/15 rounded-full" />
               <div className="absolute inset-10 border border-brand-primary/10 rounded-full" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-slate-900 dark:bg-white rounded-[2.5rem] flex items-center justify-center shadow-3xl">
                    <Globe className="w-16 h-16 text-brand-primary" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <Services />
      <Projects />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default ContactPage;
