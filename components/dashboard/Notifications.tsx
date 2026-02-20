
import React from 'react';
import { Bell, Mail, Smartphone, Globe, ArrowLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications: React.FC = () => {
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
        <h2 className="text-4xl font-display font-bold uppercase tracking-tight">Signal <br/> Routing.</h2>
      </div>

      <div className="glass rounded-[3rem] overflow-hidden border border-white/40 dark:border-white/5">
        <div className="p-8 border-b border-white/40 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
          <h4 className="font-bold uppercase tracking-widest text-xs text-slate-400">Core Notification Matrix</h4>
        </div>
        <div className="p-8 space-y-10">
          {[
            { icon: Mail, title: 'Deployment Digests', desc: 'Weekly technical summary of all successful node deployments.', default: true },
            { icon: Zap, title: 'Instant Performance Alerts', desc: 'Immediate notification if any regional node latency exceeds 2ms.', default: true },
            { icon: Smartphone, title: 'Mobile Signal Uplink', desc: 'SMS alerts for critical system security incidents.', default: false },
            { icon: Globe, title: 'Global Network Updates', desc: 'Broadcasts concerning major hardware or software protocol shifts.', default: true },
          ].map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-lg mb-1">{item.title}</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-2">
                <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
