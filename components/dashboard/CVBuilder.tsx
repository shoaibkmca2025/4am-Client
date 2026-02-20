import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Layout, Palette, Type, Check, Wand2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CVBuilder: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const navigate = useNavigate();

  const templates = [
    { id: 1, name: 'Minimalist', color: 'bg-gray-900' },
    { id: 2, name: 'Modern Blue', color: 'bg-blue-600' },
    { id: 3, name: 'Creative Grid', color: 'bg-purple-600' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Overview
          </button>
          <h2 className="text-3xl font-display font-bold tracking-tight">CV Architect</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Design your professional uplink profile for global nodes.</p>
        </div>
        <button className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" />
          Export to PDF
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Editor Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <Layout className="w-4 h-4 text-brand-primary" />
              Templates
            </h4>
            <div className="space-y-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    selectedTemplate === t.id 
                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' 
                    : 'border-gray-100 dark:border-white/5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm font-bold">{t.name}</span>
                  {selectedTemplate === t.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-amber-500" />
              AI Enhancement
            </h4>
            <p className="text-xs text-gray-500 mb-6">Let our AI optimize your descriptions for recruitment algorithms.</p>
            <button className="w-full py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-brand-primary hover:text-white transition-all">
              Initialize Optimizer
            </button>
          </div>
        </div>

        {/* Live Preview Pane */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white dark:bg-[#080808] border border-gray-200 dark:border-white/5 rounded-3xl shadow-xl p-12 min-h-[800px] relative overflow-hidden">
             {/* Simulated Resume Layout */}
             <div className="max-w-2xl mx-auto space-y-12">
                <header className="border-b-2 border-brand-primary pb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Shoaib</h1>
                    <p className="text-brand-primary font-bold tracking-widest text-xs mt-1 uppercase">Software Engineer / Node Architect</p>
                  </div>
                  <div className="text-right text-[10px] text-gray-400 font-bold space-y-1">
                    <p>SHOAIB@4AMGLOBAL.MEDIA</p>
                    <p>REMOTE OPERATIONS</p>
                    <p>WWW.4AMGLOBAL.MEDIA</p>
                  </div>
                </header>

                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 border-b border-gray-100 dark:border-white/5 pb-2">Operational Background</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
                    "High-velocity engineer specialized in deploying scalable digital architectures and signal optimization across decentralized networks."
                  </p>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 border-b border-gray-100 dark:border-white/5 pb-2">Deployments</h3>
                  <div className="space-y-6">
                    <div className="relative pl-6 border-l border-brand-primary/20">
                      <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-brand-primary"></div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-sm">4AM GLOBAL MEDIA</h4>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">2023 - Present</span>
                      </div>
                      <p className="text-[11px] font-bold text-brand-primary mb-2 uppercase">Lead UI Architect</p>
                      <ul className="text-xs text-gray-500 space-y-2 list-disc ml-4">
                        <li>Optimized global dashboard latency by 45% using Nexus-7 caching protocols.</li>
                        <li>Directed the deployment of 50+ high-traffic digital assets for Fortune 500 nodes.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 border-b border-gray-100 dark:border-white/5 pb-2">Technical Array</h3>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Node.js', 'Decentralized Architecture', 'Signal Processing'].map(skill => (
                      <span key={skill} className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded text-[10px] font-bold text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-white/5">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
             </div>
             
             {/* Watermark Overlay */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none rotate-45">
               <span className="text-[12rem] font-bold">4AM</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;