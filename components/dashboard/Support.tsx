import React from 'react';
import { MessageSquare, LifeBuoy, BookOpen, Send, HelpCircle, ChevronRight, Zap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Support: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors mb-4 mx-auto"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Overview
        </button>
        <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto text-brand-primary mb-6">
          <LifeBuoy className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-display font-bold tracking-tight">Support Node</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-medium">
          Encountering issues in the network? Our tactical support team is standing by to resolve any operational friction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Live Chat', desc: 'Average response: < 5m', icon: MessageSquare, color: 'text-blue-500' },
          { title: 'Knowledge Base', desc: '150+ Technical Guides', icon: BookOpen, color: 'text-emerald-500' },
          { title: 'FAQ Hub', desc: 'Instant resolutions', icon: HelpCircle, color: 'text-amber-500' },
        ].map((item, i) => (
          <button key={i} className="bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm hover:border-brand-primary/50 transition-all text-left group">
            <div className={`w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center ${item.color} mb-6 transition-transform group-hover:scale-110`}>
              <item.icon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-1">{item.title}</h4>
            <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm">
          <h3 className="text-2xl font-display font-bold mb-8">Open Support Ticket</h3>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Issue Priority</label>
              <div className="flex gap-4">
                {['Low', 'Medium', 'Critical'].map(p => (
                   <button key={p} type="button" className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${p === 'Medium' ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-gray-100 dark:border-white/5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                     {p}
                   </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Module</label>
               <input type="text" placeholder="e.g. Dashboard, Billing, Network" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-primary" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Problem Description</label>
               <textarea rows={4} placeholder="Detail your encounter..." className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-primary" />
            </div>
            <button className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Transmit Ticket
            </button>
          </form>
        </div>

        <div className="space-y-8">
           <h3 className="text-2xl font-display font-bold">Priority FAQs</h3>
           <div className="space-y-4">
             {[
               "How do I sync my global node settings?",
               "Where can I access my performance logs?",
               "How do I upgrade to Tier 2 clearance?",
               "Connecting to the Tokyo Cluster failover"
             ].map((q, i) => (
               <button key={i} className="w-full p-6 bg-white dark:bg-[#080808] border border-gray-100 dark:border-white/5 rounded-2xl flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left">
                 <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{q}</span>
                 <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
               </button>
             ))}
           </div>

           <div className="p-8 bg-brand-primary/5 border border-brand-primary/20 rounded-[2rem] flex items-center gap-6">
              <div className="w-16 h-16 shrink-0 bg-brand-primary rounded-2xl flex items-center justify-center text-white">
                <Zap className="w-8 h-8 fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-brand-primary mb-1">Nexus Priority Support</h4>
                <p className="text-xs text-gray-500 font-medium">Unlock instant human support and enterprise SLA's.</p>
                <button className="mt-3 text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] hover:underline">Upgrade Today</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Support;