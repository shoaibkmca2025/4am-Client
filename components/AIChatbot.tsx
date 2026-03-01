
import React, { useState, useRef, useEffect } from 'react';
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
    <div className="fixed bottom-5 right-5 z-[9999] md:bottom-8 md:right-8 font-sans">
      {isOpen && (
        <div
          className="absolute bottom-20 right-0 w-[calc(100vw-40px)] max-w-[380px] md:w-[420px] md:max-w-[420px] max-h-[600px] flex flex-col bg-brand-surface rounded-[24px] shadow-clay border border-white/40 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">4AM Assistant</h3>
                <p className="text-xs text-white/80 font-medium">Powered by Gemini AI</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="relative z-10 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[260px] max-h-[380px] bg-brand-bg scroll-smooth custom-scrollbar"
          >
            {messages.length === 0 && (
              <div className="text-center text-brand-muted mt-8 space-y-2">
                <div className="w-16 h-16 bg-brand-surface rounded-2xl mx-auto flex items-center justify-center shadow-clay mb-4 text-brand-primary">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium">How can we help you today?</p>
                <p className="text-xs opacity-70">Ask about our services, pricing, or process.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-tr-sm'
                      : 'bg-brand-surface border border-white/60 text-brand-dark rounded-tl-sm shadow-clay-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-brand-surface border border-white/60 p-4 rounded-2xl rounded-tl-sm shadow-clay-sm flex gap-2 items-center">
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Footer / Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-brand-surface border-t border-brand-border/50">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-brand-bg border-none rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-brand-muted focus:ring-2 focus:ring-brand-primary/20 focus:outline-none shadow-inner-clay transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl shadow-clay hover:shadow-clay-hover hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-full shadow-clay hover:shadow-clay-hover flex items-center justify-center transition-all duration-300 relative z-[200] ${
          isOpen 
            ? 'bg-brand-dark text-white rotate-90' 
            : 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:-translate-y-1'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        
        {/* Pulse effect when closed */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-brand-primary/30 animate-ping opacity-75 -z-10" />
        )}
      </button>
    </div>
  );
};

export default AIChatbot;
