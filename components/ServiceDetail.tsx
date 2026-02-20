
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SERVICES } from '../constants';
import { 
  Share2, Search, Code, Zap, 
  Palette, ArrowLeft, CheckCircle, 
  Rocket, Terminal, Target, BarChart3, Shield
} from 'lucide-react';

const iconMap: any = {
  'share-2': <Share2 className="w-10 h-10" />,
  'search': <Search className="w-10 h-10" />,
  'code': <Code className="w-10 h-10" />,
  'zap': <Zap className="w-10 h-10" />,
  'palette': <Palette className="w-10 h-10" />,
};

const ServiceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = SERVICES.find(s => s.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-display font-bold">Protocol Not Found</h2>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-brand-primary text-white rounded-full font-bold">
            Return to Core
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-48 relative overflow-hidden min-h-screen bg-white dark:bg-brand-dark transition-colors duration-500">
      {/* Background Decorative */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-brand-accent/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs & Back Navigation */}
          <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <nav className="flex items-center gap-4">
              <Link to="/" className="text-xs font-bold text-slate-400 hover:text-brand-primary uppercase tracking-widest transition-colors">Home</Link>
              <span className="text-slate-300">/</span>
              <Link to="/services" className="text-xs font-bold text-slate-400 hover:text-brand-primary uppercase tracking-widest transition-colors">Capabilities</Link>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">{service.title}</span>
            </nav>
            <button 
              onClick={() => navigate('/services')}
              className="flex items-center gap-2 text-xs font-bold text-brand-primary hover:underline uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Services
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-7 space-y-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center text-brand-primary border border-white/50 shadow-xl mb-12">
                  {iconMap[service.icon]}
                </div>
                <h1 className="text-6xl md:text-8xl font-display font-bold text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.85]">
                  {service.title.split(' ').map((word, i) => (
                    <span key={i} className={i === service.title.split(' ').length - 1 ? "text-brand-primary" : "block"}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                <p className="text-2xl md:text-3xl text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-2xl italic">
                  {service.longDescription}
                </p>
              </motion.div>

              {/* Methodology Section */}
              {service.methodology && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-100 dark:border-white/10"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-[1px] bg-brand-primary" />
                    <h3 className="text-xs font-mono font-bold text-brand-primary uppercase tracking-widest">Methodology Protocol</h3>
                  </div>
                  <p className="text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {service.methodology}
                  </p>
                </motion.div>
              )}

              {/* Deep Features Grid */}
              <div className="space-y-8">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Core Capabilities Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.features?.map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="glass rounded-2xl p-6 border border-white/40 dark:border-white/5 group hover:border-brand-primary/30 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                          <Zap className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{feature}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Business Outcomes Section */}
              {service.outcomes && (
                <div className="space-y-8">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Expected Mission Outcomes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {service.outcomes.map((outcome, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">{outcome}</p>
                          <p className="text-xs text-slate-500 mt-1 italic">Verified Benchmark</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:col-span-5">
              <div className="sticky top-32 space-y-8">
                <div className="glass rounded-[2.5rem] p-10 border border-white/50 shadow-2xl space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl pointer-events-none" />
                   
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <Terminal className="w-5 h-5 text-brand-primary" />
                       <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Protocol inquiry</span>
                     </div>
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   </div>

                   <h3 className="text-3xl font-display font-bold uppercase tracking-tight">Engineer Your Success.</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                     Ready to deploy {service.title} for your enterprise cluster? Our core team is standing by to bridge the gap between vision and reality.
                   </p>

                   <div className="space-y-4">
                      {[
                        { label: 'Uptime Commitment', value: '99.9%', icon: Shield },
                        { label: 'Growth Target', value: '3x - 10x', icon: Target },
                        { label: 'Data Latency', value: '< 1.2ms', icon: BarChart3 }
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-white dark:border-white/10">
                          <div className="flex items-center gap-3">
                            <item.icon className="w-3.5 h-3.5 text-brand-primary" />
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                          </div>
                          <span className="text-xs font-bold text-brand-primary">{item.value}</span>
                        </div>
                      ))}
                   </div>

                   <button 
                     onClick={() => navigate('/contact')}
                     className="w-full py-6 bg-brand-primary text-white font-bold rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] text-xs"
                   >
                     Initialize Uplink
                     <Rocket className="w-4 h-4" />
                   </button>
                </div>

                <div className="p-8 bg-slate-900 dark:bg-white rounded-[2rem] text-white dark:text-slate-900 flex items-center gap-6 shadow-xl">
                   <div className="p-4 bg-white/10 dark:bg-slate-900/10 rounded-2xl">
                     <CheckCircle className="w-8 h-8" />
                   </div>
                   <div>
                     <p className="text-[10px] font-mono font-bold opacity-60 uppercase tracking-widest mb-1">Status: Secured</p>
                     <p className="font-display font-bold uppercase tracking-tight">Verified Solution Partner</p>
                   </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
