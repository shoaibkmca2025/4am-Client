
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Save, Loader2, User, Mail, Camera, MapPin, Globe, Sparkles, Shield, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    jobTitle: '',
    location: '',
    phone: '',
    website: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: String(user.name || ''),
        bio: String(user.bio || ''),
        jobTitle: String(user.jobTitle || ''),
        location: String(user.location || ''),
        phone: String(user.phone || ''),
        website: String(user.website || '')
      });
    }
  }, [user]);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Profile sync failure:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-16">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Overview
        </button>
        <div className="flex items-center gap-4 mb-4">
           <div className="w-10 h-[1px] bg-brand-primary" />
           <span className="text-brand-primary font-mono font-bold tracking-[0.5em] uppercase text-xs">Uplink Config</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tighter uppercase">Identity <br/> Hub.</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="glass rounded-[3rem] p-10 text-center sticky top-32 border border-white/50 dark:border-white/5 shadow-2xl">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-brand-primary blur-3xl opacity-20 rounded-full" />
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=user`} 
                alt="Profile" 
                className="w-40 h-40 rounded-3xl bg-slate-100 dark:bg-white/10 border-4 border-white dark:border-white/10 shadow-2xl relative z-10"
              />
              <button className="absolute -bottom-2 -right-2 p-4 bg-brand-primary text-white rounded-2xl hover:scale-110 transition-all shadow-xl z-20">
                <Camera className="w-6 h-6" />
              </button>
            </div>
            <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">{formData.name || 'Member'}</h3>
            <p className="text-brand-primary font-mono font-bold text-xs tracking-widest uppercase mb-8">{formData.jobTitle || 'Verified Operator'}</p>
            
            <div className="space-y-4 pt-8 border-t border-slate-100 dark:border-white/5">
               <div className="flex items-center gap-4 text-xs font-bold text-slate-500 justify-center">
                 <Shield className="w-4 h-4 text-emerald-500" />
                 LEVEL 1 CLEARANCE
               </div>
               <div className="flex items-center gap-4 text-xs font-mono text-slate-400 justify-center">
                 <MapPin className="w-4 h-4 text-brand-primary" />
                 {formData.location || 'GLOBAL_NODE'}
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="glass rounded-[3rem] p-10 md:p-12 border border-white/50 dark:border-white/5 shadow-xl space-y-12">
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">DISPLAY_NAME</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all font-sans text-sm"
                      placeholder="YOUR NAME"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">FUNCTIONAL_ROLE</label>
                    <input 
                      type="text" 
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all font-sans text-sm"
                      placeholder="e.g. CORE ARCHITECT"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">PERSONAL_MISSION_LOG</label>
                  <textarea 
                    rows={5}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 rounded-2xl p-6 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all font-sans text-sm resize-none"
                    placeholder="DESCRIBE YOUR OBJECTIVES..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">COORDINATES</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-brand-primary transition-all"
                        placeholder="CITY, REGION"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">DIGITAL_LINK</label>
                    <div className="relative">
                      <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="url" 
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-brand-primary transition-all"
                        placeholder="https://yourlink.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <AnimatePresence>
                    {success && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                        <Sparkles className="w-5 h-5" /> IDENTITY_SYNCED
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-12 py-5 bg-brand-primary text-white font-bold rounded-full hover:shadow-2xl hover:shadow-brand-primary/30 transition-all flex items-center gap-4 active:scale-95 disabled:opacity-50 text-xs tracking-[0.2em] uppercase"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Deploy Updates
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
