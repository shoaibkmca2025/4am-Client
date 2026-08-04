
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello. I'm the 4AM assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<ReturnType<typeof import("@google/genai").GoogleGenAI.prototype.chats.create> | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return;
    const ai = new GoogleGenAI({ apiKey });
    chatRef.current = ai.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: `You are the 4AM Global AI Assistant. Professional and concise.
          4AM Global Media specializes in:
          1. Digital Marketing & Paid Ads
          2. Branding & Visual Identity
          3. Social Media Growth
          4. SEO & Content Strategy
          5. Web Development
          6. Content Creation
          Help users with inquiries about services, pricing, or process. Keep responses brief and professional.`,
      }
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) throw new Error("Chat not initialized");
      const response = await chatRef.current.sendMessage({ message: userMessage.text });
      setMessages(prev => [...prev, {
        role: 'model',
        text: response.text || "Something went wrong. Please try again.",
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Connection error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] md:bottom-8 md:right-8 font-sans">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[calc(100vw-40px)] max-w-[380px] md:w-[420px] max-h-[600px] flex flex-col bg-[#f5ead8] border border-[#201e1d]/12 rounded-2xl shadow-[0_12px_40px_rgba(46,43,37,0.28)] overflow-hidden">
          {/* Header */}
          <div className="p-5 bg-[#c67139] text-[#f5ead8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f5ead8] flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#c67139]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-[0.1em]">4AM Assistant</h3>
                <p className="text-[10px] text-[#f5ead8]/70 font-semibold uppercase tracking-wider">Powered by AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-[#f5ead8]/15 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[260px] max-h-[380px] bg-[#f5ead8]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-sm leading-relaxed rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-[#c67139] text-[#f5ead8]'
                    : 'bg-[#ebddc5] border border-[#201e1d]/10 text-[#201e1d]'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#ebddc5] border border-[#201e1d]/10 rounded-2xl p-4 flex gap-2 items-center">
                  <div className="w-1.5 h-1.5 bg-[#c67139] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#c67139] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#c67139] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-[#ebddc5] border-t border-[#201e1d]/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#f5ead8] border border-[#201e1d]/12 rounded-full px-4 py-3 text-sm text-[#201e1d] placeholder-[#201e1d]/35 focus:outline-none focus:border-[#c67139] transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 rounded-full bg-[#c67139] text-[#f5ead8] hover:bg-[#b2622d] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
        className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 relative z-[200] bg-[#c67139] text-[#f5ead8] shadow-[0_6px_20px_rgba(198,113,57,0.4)] hover:bg-[#b2622d] hover:-translate-y-1"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default AIChatbot;
