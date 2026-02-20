
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Navigate, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Activity, FileText, 
  User, Bell, ChevronLeft, 
  Zap, Rocket, LogOut,
  LayoutGrid, Sun, Moon, ArrowLeft,
  HelpCircle, FileCode, Radio, Home,
  Settings, Palette, Settings2, GraduationCap,
  Cpu, Shield, Globe, Terminal, Box,
  Network, Signal, Command, Search, 
  Dna, Target, Map
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Profile from './dashboard/Profile';
import MyArticles from './dashboard/MyArticles';
import CVBuilder from './dashboard/CVBuilder';
import SignalLog from './dashboard/SignalLog';
import Support from './dashboard/Support';
import Docs from './dashboard/Docs';
import Internships from './dashboard/Internships';
import Jobs from './dashboard/Jobs';
import { useTheme } from './ThemeContext';
import ThemeToggle from './ThemeToggle';

const Dashboard: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-brand-obsidian">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border-2 border-brand-primary/20 rounded-full flex items-center justify-center"
          >
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-t-2 border-brand-primary rounded-full" 
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Rocket className="w-8 h-8 text-brand-primary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const menuItems = [
    { label: 'Control Deck', icon: LayoutGrid, path: '/dashboard' },
    { label: 'Insight Lab', icon: FileText, path: '/dashboard/publishing' },
    { label: 'CV Architect', icon: FileCode, path: '/dashboard/cv' },
    { label: 'Growth Hub', icon: Briefcase, path: '/dashboard/jobs' },
    { label: 'Neural Link', icon: Radio, path: '/dashboard/signals' },
    { label: 'Operator ID', icon: User, path: '/dashboard/profile' },
  ];

  const hudMetrics = [
    { label: 'CORE_LOAD', value: '24%', status: 'NOMINAL', icon: Cpu },
    { label: 'NET_SYNC', value: '0.8ms', status: 'STABLE', icon: Signal },
    { label: 'CRYPTO_ID', value: 'AES_256', status: 'SECURE', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-white relative font-sans selection:bg-brand-primary/30 overflow-x-hidden transition-colors duration-500">
      {/* 1. Holographic HUD Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      {/* 2. Tactical Command Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed left-6 top-6 bottom-6 w-20 lg:w-64 glass rounded-[2.5rem] z-[100] flex flex-col border border-slate-200 dark:border-white/10 shadow-2xl transition-all duration-500"
      >
        <div className="p-6 flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative">
             <div className="absolute inset-0 bg-brand-primary blur-md opacity-20 group-hover:opacity-100 transition-opacity" />
             <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-brand-primary/40 relative z-10 group-hover:rotate-90 transition-transform duration-500 shadow-inner">
               <Command className="w-5 h-5 text-brand-primary" />
             </div>
          </div>
          <div className="hidden lg:block">
            <p className="font-display font-bold text-lg tracking-tighter uppercase leading-none">4AM <span className="text-brand-primary">CORE</span></p>
            <p className="text-[7px] font-mono text-slate-500 uppercase tracking-widest mt-1">v4.0_SYS</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-4 rounded-2xl transition-all relative group ${
                  active 
                  ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon size={18} className={`shrink-0 ${active ? 'text-brand-primary' : ''}`} />
                <span className="font-bold text-[11px] hidden lg:block tracking-tight uppercase">{item.label}</span>
                {active && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-primary rounded-full shadow-[0_0_15px_#3B82F6]" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-5 border-t border-slate-100 dark:border-white/5 space-y-2">
          {/* Dashboard specific text-based theme button */}
          <div className="flex items-center justify-center py-1">
             <ThemeToggle compact={true} />
          </div>

          <Link to="/" className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all rounded-2xl group">
            <Home size={18} className="group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block font-bold text-[9px] uppercase tracking-widest">Base</span>
          </Link>
          <button onClick={() => logout()} className="w-full flex items-center gap-3.5 px-4 py-3 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all">
            <LogOut size={18} />
            <span className="hidden lg:block font-bold text-[9px] uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* 3. Operational Content Area */}
      <main className="flex-1 ml-28 lg:ml-72 mr-6 py-4 min-h-screen relative z-10">
        
        {/* HUD Telemetry Header */}
        <header className="sticky top-4 z-[90] glass rounded-[2rem] px-6 py-3 flex items-center justify-between shadow-xl mb-10 border border-slate-200 dark:border-white/10 backdrop-blur-3xl transition-colors">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Clock</span>
              <span className="text-xs font-display font-bold text-slate-900 dark:text-white tracking-widest">
                {currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10 hidden md:block" />

            <div className="hidden md:flex items-center gap-6">
              {hudMetrics.map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
                    <m.icon size={14} className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-[7px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">{m.label}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-900 dark:text-white">{m.value}</span>
                      <span className="text-[7px] font-bold text-emerald-500 uppercase">{m.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
               <div className="text-right hidden sm:block">
                <p className="text-[10px] font-display font-bold text-slate-900 dark:text-white uppercase group-hover:text-brand-primary transition-colors">{user?.name}</p>
                <p className="text-[7px] font-mono text-slate-500 uppercase tracking-widest">Clearance_Lvl_4</p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-brand-primary blur-sm opacity-20 rounded-xl" />
                <img 
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=user`} 
                  alt="" 
                  className="w-8 h-8 rounded-xl border border-slate-200 dark:border-white/10 relative z-10 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Routes>
              <Route index element={
                <div className="space-y-10 pb-20">
                  {/* Hero HUD Block */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
                    <div className="xl:col-span-8 glass rounded-[3rem] p-10 border border-slate-200 dark:border-white/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03] dark:opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                         <Network className="w-56 h-56 text-brand-primary" />
                      </div>
                      <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20">
                           <Zap size={12} className="text-brand-primary fill-brand-primary" />
                           <span className="text-[8px] font-mono font-bold text-brand-primary uppercase tracking-[0.3em]">Signal_Locked</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.85]">
                          STRATEGIC <br/>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-signal to-brand-accent">COMMAND.</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl font-medium leading-relaxed">
                          Your distributed nodes are operating at peak efficiency. Real-time signal propagation confirmed across all clusters.
                        </p>
                        <div className="flex gap-4 pt-2">
                           <button className="px-8 py-4 bg-brand-primary text-white font-bold rounded-[1.5rem] shadow-lg hover:scale-105 transition-all text-[9px] uppercase tracking-[0.3em] flex items-center gap-3">
                             Launch Module <Rocket size={14} />
                           </button>
                           <button className="px-8 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.5rem] text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-slate-600 dark:text-slate-400">
                             Diagnostics
                           </button>
                        </div>
                      </div>
                    </div>

                    <div className="xl:col-span-4 flex flex-col gap-8">
                       <div className="flex-1 glass rounded-[3rem] p-8 border border-emerald-500/20 bg-emerald-500/[0.02] flex flex-col justify-between">
                         <div className="flex justify-between items-start">
                           <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-500/10">
                             <Shield size={20} />
                           </div>
                           <div className="text-right">
                             <p className="text-[8px] font-mono font-bold text-slate-500 uppercase">Uptime</p>
                             <p className="text-xl font-display font-bold text-emerald-500">99.9%</p>
                           </div>
                         </div>
                         <div className="space-y-1">
                           <h4 className="text-base font-display font-bold uppercase tracking-tight">Shields</h4>
                           <p className="text-[10px] text-slate-500 leading-tight font-medium">All firewalls active. Encrypted packet relay nominal.</p>
                         </div>
                       </div>
                       <div className="flex-1 glass rounded-[3rem] p-8 border border-brand-primary/20 bg-brand-primary/[0.02] flex flex-col justify-between">
                         <div className="flex justify-between items-start">
                           <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-sm border border-brand-primary/10">
                             <Zap size={20} />
                           </div>
                           <div className="text-right">
                             <p className="text-[8px] font-mono font-bold text-slate-500 uppercase">Latency</p>
                             <p className="text-xl font-display font-bold text-brand-primary">0.8ms</p>
                           </div>
                         </div>
                         <div className="space-y-1">
                           <h4 className="text-base font-display font-bold uppercase tracking-tight">Flux</h4>
                           <p className="text-[10px] text-slate-500 leading-tight font-medium">Optimized signal path via LDN-02 node cluster.</p>
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Operational Matrix Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Live Neural Stream */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-0.5 rounded-full bg-brand-primary shadow-[0_0_10px_#3B82F6]" />
                           <h3 className="text-lg font-display font-bold uppercase tracking-tight">Stream Feed</h3>
                        </div>
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">RealTime_IO</span>
                      </div>
                      
                      <div className="glass rounded-[3rem] border border-slate-200 dark:border-white/5 overflow-hidden">
                        {[
                          { node: 'LDN_04', action: 'Auth_Verified', time: 'Just now', color: 'text-emerald-500' },
                          { node: 'NYC_12', action: 'Packet_Relay', time: '2s ago', color: 'text-brand-primary' },
                          { node: 'TKY_01', action: 'Sync_Request', time: '12s ago', color: 'text-amber-500' },
                        ].map((log, i) => (
                          <div key={i} className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                             <div className="flex items-center gap-5">
                               <div className={`w-1.5 h-1.5 rounded-full ${log.color.replace('text', 'bg')} animate-pulse shadow-[0_0_8px_currentColor]`} />
                               <div>
                                 <p className="text-xs font-bold uppercase tracking-tight">
                                   <span className="text-slate-500">{log.node}</span> // <span className="text-slate-900 dark:text-white">{log.action}</span>
                                 </p>
                                 <p className="text-[9px] font-mono text-slate-500 dark:text-slate-600 uppercase mt-0.5">{log.time}</p>
                               </div>
                             </div>
                             <button className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                               <ChevronLeft size={14} className="rotate-180" />
                             </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Secondary HUD Tiles */}
                    <div className="lg:col-span-5 grid grid-cols-1 gap-8">
                       <div className="glass rounded-[3rem] p-8 border border-slate-200 dark:border-white/5 relative overflow-hidden group">
                         <div className="flex items-center gap-4 mb-6">
                           <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:border-brand-primary/40 transition-colors">
                              <Map size={18} className="text-brand-primary" />
                           </div>
                           <div>
                             <h4 className="text-base font-display font-bold uppercase tracking-tight">Topology</h4>
                             <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Global Edge</p>
                           </div>
                         </div>
                         <div className="relative aspect-video bg-slate-200 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center justify-center overflow-hidden">
                           <Globe size={48} className="text-brand-primary/20 animate-spin-slow" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 border border-brand-primary/40 rounded-full animate-ping opacity-20" />
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              } />
              <Route path="profile" element={<Profile />} />
              <Route path="publishing" element={<MyArticles />} />
              <Route path="cv" element={<CVBuilder />} />
              <Route path="internships" element={<Internships />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="signals" element={<SignalLog />} />
              <Route path="support" element={<Support />} />
              <Route path="docs" element={<Docs />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
