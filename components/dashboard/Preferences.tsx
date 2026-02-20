
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Clock, DollarSign, Database, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Preferences: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-12">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Overview
        </button>
        <h2 className="text-4xl font-display font-bold uppercase tracking-tight">Regional <br/> Preferences.</h2>
      </div>

      <div className="space-y-6">
        {[
          { icon: Globe, label: 'System Language', value: 'English (US)', options: ['English (US)', 'German', 'Japanese', 'French'] },
          { icon: Clock, label: 'Timezone / Node Sync', value: 'UTC -05:00 (EST)', options: ['UTC', 'EST', 'PST', 'GMT'] },
          { icon: DollarSign, label: 'Default Currency', value: 'USD ($)', options: ['USD', 'EUR', 'GBP', 'JPY'] },
          { icon: Database, label: 'Data Processing Region', value: 'US-East (N. Virginia)', options: ['US-East', 'EU-West', 'Asia-North'] },
        ].map((item, i) => (
          <div key={i} className="glass rounded-3xl p-8 flex items-center justify-between border border-white/40 dark:border-white/5">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="font-bold text-lg">{item.value}</p>
              </div>
            </div>
            <select className="bg-slate-100 dark:bg-white/5 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-brand-primary/20 cursor-pointer">
              {item.options.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-8 bg-brand-primary/5 rounded-[2.5rem] border border-brand-primary/20">
        <h4 className="font-bold mb-2">Protocol Note:</h4>
        <p className="text-sm text-slate-500">Regional preferences affect how your data modules are formatted and synchronized across the 4AM Global edge network.</p>
      </div>
    </div>
  );
};

export default Preferences;
