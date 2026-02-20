
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, Settings2, Palette, Settings, 
  Bell, HelpCircle, LogOut, ShieldCheck, 
  Zap, Terminal, Fingerprint, Activity,
  Database, User as UserIcon, Lock
} from 'lucide-react';
import { User } from '../types';
import { Link, useNavigate } from 'react-router-dom';

interface UserMenuProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();

  // Generate a pseudo-random operator serial for aesthetic
  const operatorId = useMemo(() => {
    return `OP-${Math.floor(1000 + Math.random() * 9000)}-${user.id.slice(0, 4).toUpperCase()}`;
  }, [user.id]);

  const modules = [
    { label: 'Command', path: '/dashboard', icon: LayoutGrid, color: 'text-brand-primary' },
    { label: 'Tactical', path: '/dashboard/signals', icon: Activity, color: 'text-brand-signal' },
    { label: 'Identity', path: '/dashboard/profile', icon: UserIcon, color: 'text-indigo-400' },
    { label: 'Security', path: '/dashboard/status', icon: ShieldCheck, color: 'text-emerald-400' },
    { label: 'Config', path: '/dashboard/theme', icon: Palette, color: 'text-amber-400' },
    { label: 'Support', path: '/dashboard/support', icon: HelpCircle, color: 'text-rose-400' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute right-0 top-full mt-6 w-[360px] glass rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/5 overflow-hidden z-[70]"
          >
            {/* 1. Biometric Header (The Identity Card) */}
            <div className="p-8 border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-brand-primary/10 to-transparent">
              {/* Scanline Animation */}
              <motion.div 
                initial={{ top: '-10%' }}
                animate={{ top: '110%' }}
                transition={{ duration: 1.5, ease: "linear", repeat: 0 }}
                className="absolute left-0 right-0 h-1 bg-brand-primary/50 blur-sm z-20 pointer-events-none"
              />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative group mb-4">
                   <div className="absolute -inset-2 bg-brand-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="w-24 h-24 rounded-3xl border-2 border-brand-primary p-1 bg-brand-obsidian overflow-hidden shadow-2xl relative">
                     <img 
                       src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                       alt="" 
                       className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500"
                     />
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_50%,rgba(59,130,246,0.3))] pointer-events-none" />
                   </div>
                   <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white p-2 rounded-xl shadow-lg border border-white/20">
                     <Fingerprint className="w-4 h-4" />
                   </div>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tighter">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-3 justify-center">
                    <span className="text-[10px] font-mono font-bold text-brand-primary uppercase tracking-[0.2em]">{operatorId}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Tactical Module Grid */}
            <div className="p-4 grid grid-cols-3 gap-3">
              {modules.map((mod, i) => (
                <Link
                  key={mod.label}
                  to={mod.path}
                  onClick={onClose}
                  className="group relative flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                >
                  <div className={`mb-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 ${mod.color} group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner`}>
                    <mod.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white">
                    {mod.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* 3. Session Telemetry & Auth */}
            <div className="p-6 bg-slate-50/50 dark:bg-black/20 border-t border-white/10">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    <Database className="w-3 h-3 text-brand-primary" />
                    Encrypted Uplink
                  </div>
                  <div className="flex items-center gap-2 text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    <Lock className="w-3 h-3 text-brand-primary" />
                    RSA_4096 Active
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end text-[8px] font-mono font-bold text-brand-signal uppercase tracking-widest">
                    <Zap className="w-3 h-3" />
                    Sync: 100%
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => { navigate('/dashboard/settings'); onClose(); }}
                  className="flex-1 py-4 glass rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white dark:hover:bg-white/5 transition-all border border-white/10 flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Core Config
                </button>
                <button 
                  onClick={onLogout}
                  className="px-6 py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border border-rose-500/20 shadow-xl group"
                >
                  <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Decorative Corner Element */}
            <div className="absolute bottom-2 right-2 opacity-5 pointer-events-none">
              <Terminal className="w-24 h-24" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserMenu;
