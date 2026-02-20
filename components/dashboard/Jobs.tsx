
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar, ArrowRight, DollarSign, Building2, Terminal, ArrowLeft } from 'lucide-react';
import { Opportunity } from '../../types';
import { useNavigate } from 'react-router-dom';

const MOCK_JOBS: Opportunity[] = [
  {
    id: 'job-001',
    title: 'Senior Systems Architect',
    department: 'Core Engineering',
    location: 'Zurich / Remote',
    type: 'Full-time',
    salary: '$140k - $190k',
    postedDate: 'Oct 10, 2024',
    status: 'Open',
    description: 'Spearhead the design and implementation of our next-gen stateless node clusters and decentralized data persistence layers.',
    requirements: ['8+ years in Systems Arch', 'Deep Rust/Go expertise', 'Experience with Global Edge Networks']
  },
  {
    id: 'job-002',
    title: 'Growth Marketing Director',
    department: 'Growth Ops',
    location: 'London / Hybrid',
    type: 'Full-time',
    salary: '£90k - £120k',
    postedDate: 'Oct 08, 2024',
    status: 'Open',
    description: 'Lead our multi-channel marketing strategy for high-tier FinTech and Web3 startups. Focus on data-driven signal optimization.',
    requirements: ['Proven ROAS track record', 'Team leadership experience', 'Advanced Analytics Mastery']
  }
];

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
           <button 
             onClick={() => navigate('/dashboard')}
             className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors mb-4"
           >
             <ArrowLeft className="w-3 h-3" />
             Back to Overview
           </button>
           <div className="flex items-center gap-4 mb-2">
             <div className="w-10 h-[1px] bg-brand-primary" />
             <span className="text-brand-primary font-mono font-bold tracking-[0.5em] uppercase text-xs">Growth Nodes</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tighter uppercase">Career <br/> Openings.</h2>
        </div>
        
        <div className="flex items-center gap-3 px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl">
          <Terminal className="w-5 h-5" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Hiring_Status: CRITICAL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {MOCK_JOBS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-[3rem] overflow-hidden border border-white/50 dark:border-white/5 group flex flex-col lg:flex-row hover:border-brand-primary/40 transition-all duration-700 hover:shadow-3xl"
          >
            {/* Left Info Panel */}
            <div className="p-10 lg:w-2/3 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-3xl font-display font-bold uppercase tracking-tight group-hover:text-brand-primary transition-colors">{item.title}</h3>
                  <div className="flex flex-wrap gap-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> {item.department}</span>
                    <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                   <span className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-white/10">{item.type}</span>
                   <span className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-[10px] font-bold uppercase tracking-widest border border-brand-primary/20">{item.salary}</span>
                </div>
              </div>

              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {item.requirements.map(req => (
                  <span key={req} className="px-4 py-2 bg-brand-primary/5 text-brand-primary rounded-xl text-[10px] font-bold border border-brand-primary/10">
                    {req.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Action Panel */}
            <div className="lg:w-1/3 p-10 bg-slate-50 dark:bg-white/[0.02] border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-white/5 flex flex-col justify-between gap-10">
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    <span>Signal Date</span>
                    <span>{item.postedDate}</span>
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    <span>Clearance Required</span>
                    <span className="text-brand-primary">TIER 2+</span>
                 </div>
              </div>

              <button className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-[2rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 uppercase tracking-[0.4em] text-[10px]">
                Submit Intel
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-12 glass rounded-[3rem] border-2 border-dashed border-brand-primary/20 text-center space-y-6">
        <h4 className="text-2xl font-display font-bold uppercase">Speculative Application?</h4>
        <p className="text-slate-500 max-w-lg mx-auto font-medium">If you don't see your specific module listed but possess elite engineering or growth capabilities, transmit your data via the support node.</p>
        <button className="text-brand-primary font-bold uppercase tracking-[0.2em] text-xs hover:underline">Connect with Recruitment Core</button>
      </div>
    </div>
  );
};

export default Jobs;
