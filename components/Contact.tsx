import React, { useState } from 'react';
import { Mail, Phone, MapPin, Zap, Loader2, Send } from 'lucide-react';
import SpotlightSection from './SpotlightSection';
import TiltCard from './TiltCard';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <SpotlightSection id="contact" className="py-24 relative bg-transparent overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-brand-primary/5 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-brand-secondary/5 blur-[80px]" />
      </div>

      <div className="container mx-auto px-6 max-w-[1000px] relative z-10">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-lg mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">Contact Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Let’s build something <br />
            <span className="text-transparent bg-clip-text bg-gradient-primary">ambitious</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-lg mx-auto leading-relaxed font-medium">
            Share a bit about your team, your timelines, and what a great outcome looks like. We’ll reply with a clear next step.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Contact Info */}
          <div className="space-y-6">
            <TiltCard className="h-full">
            <div className="rounded-[32px] p-8 bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm h-full">
              <h3 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-8">
                Contact Details
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Email', value: '4amhustles@gmail.com', icon: Mail, href: 'mailto:4amhustles@gmail.com' },
                  { label: 'Phone', value: '+91 90005 98600', icon: Phone, href: 'tel:+919000598600' },
                  { label: 'Location', value: 'Global / Remote team', icon: MapPin },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex items-start gap-5 p-5 rounded-2xl hover:bg-white/5 transition-colors group ${!item.href ? 'pointer-events-none' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-black/20 shadow-inner flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform duration-300 border border-white/5">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        {item.label}
                      </p>
                      <p className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            </TiltCard>
          </div>

          {/* Contact Form */}
          <div className="relative h-full">
            <TiltCard className="h-full">
            <div className="relative h-full bg-white/5 border border-white/10 rounded-[32px] p-8 shadow-lg backdrop-blur-sm">
              {status === 'success' ? (
                <div 
                  className="flex flex-col items-center justify-center h-full py-12 text-center"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 shadow-inner border border-emerald-500/20">
                    <Zap className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Signal Received.</h3>
                  <p className="text-gray-400 mb-8 max-w-xs text-base font-medium">
                    Our growth architects will analyze your coordinates and reach out within 24 hours.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')} 
                    className="text-brand-primary font-bold uppercase tracking-widest text-xs hover:text-brand-accent transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        className="w-full bg-black/20 rounded-xl px-5 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all duration-300 shadow-inner focus:shadow-inner-light text-sm font-medium border border-white/10" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">Work Email</label>
                      <input 
                        required 
                        type="email" 
                        className="w-full bg-black/20 rounded-xl px-5 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all duration-300 shadow-inner focus:shadow-inner-light text-sm font-medium border border-white/10" 
                        placeholder="john@company.com" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">Message</label>
                    <textarea 
                      required 
                      rows={4} 
                      className="w-full bg-black/20 rounded-xl px-5 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all duration-300 shadow-inner focus:shadow-inner-light resize-none text-sm font-medium border border-white/10" 
                      placeholder="Tell us about your project..." 
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full px-8 py-4 rounded-full bg-gradient-primary text-white font-bold tracking-wide uppercase text-xs hover:shadow-xl shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 hover:-translate-y-1"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
            </TiltCard>
          </div>
        </div>

      </div>
    </SpotlightSection>
  );
};

export default Contact;
