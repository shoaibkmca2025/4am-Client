
import React from 'react';
import { Shield, Key, CreditCard, Users, ArrowLeft, ChevronRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SystemSettings: React.FC = () => {
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
        <h2 className="text-4xl font-display font-bold uppercase tracking-tight">Security & <br/> Parameters.</h2>
      </div>

      <div className="space-y-4">
        {[
          { icon: Lock, title: 'Authentication Protocol', desc: 'Password and multi-factor authorization setup', label: 'Tier 1' },
          { icon: Key, title: 'API Access Keys', desc: 'Generate and manage external integration tokens', label: '4 Active' },
          { icon: CreditCard, title: 'Billing & Quotas', desc: 'Manage compute usage and subscription nodes', label: 'Pro' },
          { icon: Users, title: 'Team Access Control', desc: 'Delegate permissions to sub-network operators', label: '0 Members' },
        ].map((item, i) => (
          <button key={i} className="w-full glass rounded-[2rem] p-8 flex items-center justify-between border border-white/40 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left group">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-brand-primary transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <span className="text-[10px] font-mono font-bold bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded uppercase">{item.label}</span>
                </div>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SystemSettings;
