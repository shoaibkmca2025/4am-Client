
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Rocket, Bot, Sparkles, User, Terminal } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Uplink established. I am the 4AM Tactical Assistant. How can I help you engineer your growth today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key not found in environment variables");
      }
      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are the 4AM Global AI Assistant. 
          Professional, high-performance, and tech-savvy. 
          4AM Global Media is an elite agency specializing in:
          1. Custom Software Engineering (React, Node, Rust, Mobile).
          2. AR & VR Motion Systems (Spatial UI, Immersive Storytelling, 3D Assets).
          3. Digital Growth & Ads (Meta, Google, ROAS optimization).
          4. Content & SEO Mastery.
          5. Web3 & Blockchain.
          Help users with inquiries about our services, tech trends, or business growth. 
          Keep responses concise, insightful, and professional. 
          Address the user as 'Operator' or by their name: ${user?.name || 'Guest'}.`,
        }
      });

      // Simple history conversion for Gemini API
      const response = await chat.sendMessage({ message: input });

      const modelMessage: Message = {
        role: 'model',
        text: response.text || "Connection interrupted. Please resend signal.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Signal interference detected. Ensure your API Uplink is active and try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (location.pathname === '/contact') {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[200] md:bottom-8 md:right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[380px] md:w-[420px] max-h-[600px] flex flex-col glass rounded-[2.5rem] shadow-3xl border border-white/40 dark:border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-brand-primary text-white flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-indigo-600 to-brand-accent opacity-90" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold uppercase tracking-tight text-sm">4AM AI Assistant</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-80">Signal: Active</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[300px] max-h-[400px] bg-slate-50/50 dark:bg-black/40 no-scrollbar"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-brand-primary text-white'
                      }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                        ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white rounded-tr-none border border-slate-100 dark:border-white/5'
                        : 'bg-brand-primary/10 text-slate-800 dark:text-slate-200 rounded-tl-none border border-brand-primary/20'
                      }`}>
                      {msg.text}
                      <div className="mt-2 text-[9px] font-mono opacity-40 uppercase">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-brand-primary/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
                    <span className="text-xs font-mono font-bold text-brand-primary animate-pulse">SENSING...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-[#050505] border-t border-slate-100 dark:border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Transmit your message..."
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-brand-primary transition-all text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-brand-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-brand-primary/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-12 h-12 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center transition-all relative ${isOpen ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-brand-primary text-white'
          }`}
      >
        <div className="absolute inset-0 bg-brand-primary rounded-full animate-ping opacity-20 pointer-events-none" />
        {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />}

        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent rounded-full border-2 border-white dark:border-brand-dark flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default AIChatbot;
