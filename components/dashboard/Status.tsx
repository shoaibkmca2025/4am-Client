
import React from 'react';
import { Activity, Radio, Globe, Zap, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Status: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Overview
          </button>
          <h2 className="text-4xl font-display font-bold uppercase tracking-tight">System <br/> Integrity.</h2>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]" />
          <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Global Ops: Normal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Uptime (30d)', value: '99.998%', icon: Activity },
          { label: 'Avg Latency', value: '1.2ms', icon: Zap },
          { label: 'Traffic / Sec', value: '45.2K', icon: Radio },
          { label: 'Nodes Active', value: '128 / 128', icon: Globe },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-[2rem] p-8 border border-white/40 dark:border-white/5">
            <stat.icon className="w-6 h-6 text-brand-primary mb-6" />
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-display font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-[3rem] p-10 border border-white/40 dark:border-white/5">
        <h4 className="font-bold mb-10 flex items-center gap-3 text-xl">
          Regional Health Matrix
        </h4>
        <div className="space-y-6">
          {[
            { region: 'US-EAST-1 (N. Virginia)', status: 'Operational', latency: '0.8ms' },
            { region: 'EU-CENTRAL-1 (Frankfurt)', status: 'Operational', latency: '1.4ms' },
            { region: 'AP-NORTHEAST-1 (Tokyo)', status: 'Operational', latency: '2.1ms' },
            { region: 'SA-EAST-1 (São Paulo)', status: 'Operational', latency: '1.9ms' },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-white dark:border-white/10 group">
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm mb-0.5">{r.region}</h5>
                  <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest">{r.status}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono font-bold text-slate-400">{r.latency}</p>
                <div className="h-1 w-24 bg-slate-200 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-emerald-500 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Status;
