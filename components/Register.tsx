
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, Loader2, Lock, Mail, User, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      // Redirecting to home page instead of dashboard per user request
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden bg-gray-50 dark:bg-brand-dark transition-colors">
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
           <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">Join the Mission</h2>
           <p className="text-gray-500 text-sm">Start your journey with 4AM</p>
         </div>

         {error && (
           <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center">
             {error}
           </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
             <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
             <div className="relative">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input 
                 type="text" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary transition-colors"
                 placeholder="John Doe"
                 required
               />
             </div>
           </div>

           <div>
             <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
             <div className="relative">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary transition-colors"
                 placeholder="name@example.com"
                 required
               />
             </div>
           </div>
           
           <div>
             <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
             <div className="relative">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary transition-colors"
                 placeholder="••••••••"
                 required
               />
             </div>
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 mt-2"
           >
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
           </button>
         </form>

         <div className="mt-8 text-center">
           <p className="text-gray-500 text-sm">
             Already have an account?{' '}
             <Link to="/login" className="text-brand-primary font-medium hover:underline">
               Sign In
             </Link>
           </p>
         </div>
       </motion.div>
    </div>
  );
};

export default Register;
