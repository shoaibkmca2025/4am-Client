
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, Loader2, Lock, Mail, Github, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 23 23">
    <path fill="#f3f3f3" d="M0 0h11v11H0z" />
    <path fill="#f3f3f3" d="M12 0h11v11H12z" />
    <path fill="#f3f3f3" d="M0 12h11v11H0z" />
    <path fill="#f3f3f3" d="M12 12h11v11H12z" />
  </svg>
);

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const { login, loginWithSocial, user } = useAuth();
  const navigate = useNavigate();

  // Handle immediate navigation on auth state change
  useEffect(() => {
    if (user) {
      // Use replace: true to prevent back-button loops
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'microsoft') => {
    setSocialLoading(provider);
    setError('');
    try {
      await loginWithSocial(provider);
    } catch (err) {
      setError(`Failed to connect via ${provider}.`);
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden bg-gray-50 dark:bg-brand-dark transition-colors duration-300">
       <div className="absolute inset-0 bg-radial-gradient from-brand-primary/5 via-transparent to-transparent pointer-events-none" />
       
       {/* Floating Back Button */}
       <div className="absolute top-8 left-8 z-20">
         <Link 
           to="/"
           className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-primary transition-all group px-4 py-2 glass rounded-full"
         >
           <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
           Back to Home
         </Link>
       </div>

       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="w-full max-w-md bg-white dark:bg-black/40 backdrop-blur-md border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
       >
         <div className="flex flex-col items-center mb-8">
           <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
             <Rocket className="w-6 h-6 text-brand-primary" />
           </div>
           <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">Identity Check</h2>
           <p className="text-gray-500 text-sm">Secure access to 4AM Node</p>
         </div>

         {error && (
           <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center font-medium">
             {error}
           </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-5">
           <div>
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Terminal ID</label>
             <div className="relative">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input 
                 type="email" 
                 autoComplete="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                 placeholder="name@example.com"
                 required
               />
             </div>
           </div>
           
           <div>
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Passkey</label>
             <div className="relative">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input 
                 type="password" 
                 autoComplete="current-password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                 placeholder="••••••••"
                 required
               />
             </div>
           </div>

           <button 
             type="submit" 
             disabled={loading || !!socialLoading}
             className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-primary/25 flex items-center justify-center gap-2 mt-4 active:scale-[0.98] disabled:opacity-50"
           >
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authorize Connection'}
           </button>
         </form>

         {/* Social Logins */}
         <div className="mt-8">
           <div className="relative mb-8">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
             </div>
             <div className="relative flex justify-center text-xs uppercase tracking-widest">
               <span className="px-4 bg-white dark:bg-brand-dark text-gray-400 font-bold">Or connect via</span>
             </div>
           </div>

           <div className="grid grid-cols-3 gap-4">
             <button
               onClick={() => handleSocialLogin('google')}
               disabled={loading || !!socialLoading}
               className="flex items-center justify-center p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all group disabled:opacity-50"
               title="Google Login"
             >
               {socialLoading === 'google' ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
             </button>
             <button
               onClick={() => handleSocialLogin('github')}
               disabled={loading || !!socialLoading}
               className="flex items-center justify-center p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all group disabled:opacity-50"
               title="GitHub Login"
             >
               {socialLoading === 'github' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
             </button>
             <button
               onClick={() => handleSocialLogin('microsoft')}
               disabled={loading || !!socialLoading}
               className="flex items-center justify-center p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all group disabled:opacity-50"
               title="Microsoft Login"
             >
               {socialLoading === 'microsoft' ? <Loader2 className="w-5 h-5 animate-spin" /> : <MicrosoftIcon />}
             </button>
           </div>
         </div>

         <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
           <p className="text-gray-500 text-sm">
             New to the network?{' '}
             <Link to="/register" className="text-brand-primary font-bold hover:underline">
               Register Node
             </Link>
           </p>
         </div>
       </motion.div>
    </div>
  );
};

export default Login;
