
import React from 'react';
import { useTheme } from '../ThemeContext';
import { Sun, Moon, Palette, Type, Layout, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ThemeSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [accent, setAccent] = React.useState('#3B82F6');

  const accents = [
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Purple', color: '#8B5CF6' },
    { name: 'Cyan', color: '#06B6D4' },
    { name: 'Emerald', color: '#10B981' },
    { name: 'Rose', color: '#F43F5E' },
  ];

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
        <h2 className="text-4xl font-display font-bold uppercase tracking-tight">Visual <br/> Architecture.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mode Selector */}
        <div className="glass rounded-[2.5rem] p-10 border border-white/40 dark:border-white/5 space-y-8">
          <div className="flex items-center gap-3">
            <Sun className="w-5 h-5 text-brand-primary" />
            <h4 className="font-bold uppercase tracking-tight">Display Mode</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${theme === 'light' ? 'border-brand-primary bg-brand-primary/5' : 'border-transparent bg-slate-100 dark:bg-white/5'}`}
            >
              <Sun className="w-8 h-8" />
              <span className="text-xs font-bold">Daylight</span>
            </button>
            <button 
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${theme === 'dark' ? 'border-brand-primary bg-brand-primary/5' : 'border-transparent bg-slate-100 dark:bg-white/5'}`}
            >
              <Moon className="w-8 h-8" />
              <span className="text-xs font-bold">Midnight</span>
            </button>
          </div>
        </div>

        {/* Accent Color */}
        <div className="glass rounded-[2.5rem] p-10 border border-white/40 dark:border-white/5 space-y-8">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-brand-primary" />
            <h4 className="font-bold uppercase tracking-tight">Accent Signal</h4>
          </div>
          <div className="flex flex-wrap gap-4">
            {accents.map((a) => (
              <button
                key={a.color}
                onClick={() => setAccent(a.color)}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
                style={{ backgroundColor: a.color }}
              >
                {accent === a.color && <Check className="w-6 h-6 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Text Scaling */}
        <div className="glass rounded-[2.5rem] p-10 border border-white/40 dark:border-white/5 space-y-8">
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-brand-primary" />
            <h4 className="font-bold uppercase tracking-tight">Typography Scale</h4>
          </div>
          <input type="range" className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary" min="12" max="20" defaultValue="14" />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>COMPACT</span>
            <span>STANDARD</span>
            <span>MAGNIFIED</span>
          </div>
        </div>

        {/* Interface Density */}
        <div className="glass rounded-[2.5rem] p-10 border border-white/40 dark:border-white/5 space-y-8">
          <div className="flex items-center gap-3">
            <Layout className="w-5 h-5 text-brand-primary" />
            <h4 className="font-bold uppercase tracking-tight">Grid Density</h4>
          </div>
          <div className="flex gap-4">
            {['Cozy', 'Compact'].map(d => (
              <button key={d} className={`flex-1 py-4 rounded-2xl border-2 text-xs font-bold ${d === 'Cozy' ? 'border-brand-primary bg-brand-primary/5' : 'border-transparent bg-slate-100 dark:bg-white/5'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
