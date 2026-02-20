import React from 'react';
import { motion } from 'framer-motion';
import { List, Shield, Zap, Globe, Cpu, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignalLog: React.FC = () => {
  const navigate = useNavigate();
  const logs = [
    { type: 'auth', msg: 'System integrity verified. Identity uplink confirmed.', time: '02:14:55', status: 'secure' },
    { type: 'network', msg: 'Syncing with Tokyo Node-7. Payload: 45.2 MB', time: '02:12:30', status: 'sync' },
    { type: 'alert', msg: 'Anomalous access attempt blocked from IP: 192.168.x.x', time: '01:55:12', status: 'blocked' },
    { type: 'deploy', msg: 'Production release "Nexus-v2.4" deployed to edge clusters.', time: '01:40:00', status: 'success' },
    { type: 'auth', msg: 'Session refreshed for node admin: shoaib', time: '01:10:22', status: 'secure' },
    { type: 'network', msg: 'Background worker optimized database indices.', time: '00:45:10', status: 'sync' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'secure': return 'text-emerald-500';
      case 'blocked': return 'text-rose-500';
      case 'sync': return 'text-blue-500';
      default: return 'text-brand-primary';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Overview
          </button>
          <h2 className="text-3xl font-display font-bold tracking-tight">Signal Stream</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Real-time monitoring of your digital footprint across the network.</p>
        </div>
        <button className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:rotate-180 transition-transform duration-700">
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Network Load', value: '14%', icon: Globe, color: 'text-blue-500' },
          { label: 'Security Level', value: 'Ultra', icon: Shield, color: 'text-emerald-500' },
          { label: 'CPU Usage', value: '22%', icon: Cpu, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/5 rounded-3xl p-6 flex items-center gap-5">
             <div className={`p-3 rounded-xl bg-gray-50 dark:bg-white/5 ${stat.color}`}>
               <stat.icon className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
               <p className="text-2xl font-display font-bold">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center">
          <h3 className="font-bold font-display text-lg">System Audit Log</h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest">Active</span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded-full border border-blue-500/20 uppercase tracking-widest">Live Sync</span>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {logs.map((log, i) => (
                <tr key={i} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span className="text-[10px] font-mono font-bold text-gray-400">{log.time}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(log.status)} shadow-[0_0_8px_currentColor] animate-pulse`}></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{log.msg}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500`}>
                      {log.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 text-center">
           <button className="text-[11px] font-bold text-brand-primary hover:underline uppercase tracking-widest">Load Archived Signals</button>
        </div>
      </div>
    </div>
  );
};

export default SignalLog;