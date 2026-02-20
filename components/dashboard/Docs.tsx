import React from 'react';
import { FileText, Search, ChevronRight, Book, Code, Shield, Cpu, ExternalLink, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Docs: React.FC = () => {
  const navigate = useNavigate();
  const categories = [
    { title: 'Core Concepts', icon: Book, items: ['Node Architecture', 'Signal Processing', 'Network Layers', 'Identity Verification'] },
    { title: 'Developer API', icon: Code, items: ['Authentication', 'Real-time Webhooks', 'Data Export', 'Rate Limiting'] },
    { title: 'Security Protocol', icon: Shield, items: ['Encrypted Uplinks', 'Biometric Access', 'Audit Logs', 'Compliance'] },
    { title: 'System Status', icon: Cpu, items: ['Regional Clusters', 'Load Balancing', 'Maintenance Schedule', 'Incident Reports'] },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Overview
          </button>
          <h2 className="text-4xl font-display font-bold tracking-tight">Technical Library</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Full documentation for the 4AM Nexus Ecosystem.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search documentation..." className="w-full bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary shadow-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <div key={i} className="bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm h-full flex flex-col">
            <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-6">
              <cat.icon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-6">{cat.title}</h4>
            <div className="space-y-3 flex-1">
              {cat.items.map((item, j) => (
                <button key={j} className="w-full flex items-center justify-between group">
                  <span className="text-xs font-medium text-gray-500 group-hover:text-brand-primary transition-colors">{item}</span>
                  <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-brand-primary transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
            <button className="mt-8 pt-6 border-t border-gray-50 dark:border-white/5 w-full flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-primary transition-colors">
              Explore All <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-brand-primary to-blue-700 rounded-[3rem] p-12 text-white relative overflow-hidden">
         <div className="relative z-10 max-w-2xl">
           <h3 className="text-3xl font-display font-bold mb-4">Quick Start Guide</h3>
           <p className="text-white/80 font-medium mb-8">Deploy your first node cluster in under 5 minutes with our streamlined CLI tools and automated setup protocols.</p>
           <div className="flex flex-wrap gap-4">
             <button className="px-8 py-4 bg-white text-brand-primary font-bold rounded-xl hover:scale-105 transition-all shadow-xl shadow-black/20">
               Initialize Onboarding
             </button>
             <button className="px-8 py-4 bg-black/20 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl hover:bg-black/30 transition-all">
               View API Reference
             </button>
           </div>
         </div>
         {/* Decorative Element */}
         <div className="absolute top-0 right-0 h-full w-1/3 opacity-20 hidden md:block">
           <Cpu className="w-64 h-64 absolute top-10 right-10" />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="flex gap-6 p-8 bg-white dark:bg-[#080808] border border-gray-100 dark:border-white/5 rounded-3xl items-center shadow-sm">
           <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
             <Shield className="w-7 h-7" />
           </div>
           <div>
             <h5 className="font-bold text-sm mb-1">Security Standards</h5>
             <p className="text-xs text-gray-500 font-medium">Learn about our SOC2 compliant encryption protocols and data residency nodes.</p>
           </div>
         </div>
         <div className="flex gap-6 p-8 bg-white dark:bg-[#080808] border border-gray-100 dark:border-white/5 rounded-3xl items-center shadow-sm">
           <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
             <Cpu className="w-7 h-7" />
           </div>
           <div>
             <h5 className="font-bold text-sm mb-1">Compute Infrastructure</h5>
             <p className="text-xs text-gray-500 font-medium">Deep dive into our globally distributed edge-computing network and latency optimization.</p>
           </div>
         </div>
      </div>
    </div>
  );
};

export default Docs;