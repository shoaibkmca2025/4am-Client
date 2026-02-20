
import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, ArrowRight, Sparkles, Building2, ArrowLeft } from 'lucide-react';
import { Opportunity } from '../../types';
import { useNavigate } from 'react-router-dom';

const MOCK_INTERNSHIPS: Opportunity[] = [
  {
    id: 'int-001',
    title: 'Frontend Architecture Intern',
    department: 'Engineering',
    location: 'Remote / Global Node',
    type: 'Internship',
    postedDate: 'Oct 12, 2024',
    status: 'Open',
    description: 'Work with our core UI team to architect high-performance glassmorphism interfaces using React and Framer Motion.',
    requirements: ['Proficiency in React', 'Deep understanding of CSS/Tailwind', 'Portfolio of creative experiments']
  },
  {
    id: 'int-002',
    title: 'Digital Strategy & Growth Intern',
    department: 'Marketing',
    location: 'Hybrid / Tokyo Node',
    type: 'Internship',
    postedDate: 'Oct 15, 2024',
    status: 'Interviewing',
    description: 'Analyze multi-channel marketing signals and assist in ROAS optimization for global FinTech clients.',
    requirements: ['Analytical mindset', 'Interest in Google Ads/Meta Ads', 'Excellent communication']
  }
];

const Internships: React.FC = () => {
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
             <span className="text-brand-primary font-mono font-bold tracking-[0.5em] uppercase text-xs">Knowledge Node</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tighter uppercase">Internship <br/> Programs.</h2>
        </div>
        
        <div className="p-4 bg-brand-primary/10 rounded-2xl border border-brand-primary/20 flex items-center gap-4">
          <Sparkles className="w-6 h-6 text-brand-primary" />
          <p className="text-xs font-bold text-brand-primary uppercase tracking-widest">Applications: ACTIVE</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {MOCK_INTERNSHIPS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-[3rem] p-10 border border-white/50 dark:border-white/5 group hover:border-brand-primary/30 transition-all duration-500 hover:shadow-2xl"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border ${
                item.status === 'Open' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              }`}>
                {item.status}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-tight group-hover:text-brand-primary transition-colors">{item.title}</h3>
                <div className="flex flex-wrap gap-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> {item.department}</span>
                  <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                  <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Posted: {item.postedDate}</span>
                </div>
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                {item.description}
              </p>

              <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">Core Requirements</h4>
                <div className="flex flex-wrap gap-2">
                  {item.requirements.map(req => (
                    <span key={req} className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full py-5 bg-brand-primary text-white font-bold rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[10px] mt-4">
                Initialize Application
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Internships;
