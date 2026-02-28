import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { ArrowRight, Clock, User, X, Tag, BookOpen, Calendar, Search, Sparkles, Globe, ExternalLink, Loader2, Bookmark } from 'lucide-react';
import { Article } from '../types';
import { useArticles } from './ArticleContext';
import { GoogleGenAI } from "@google/genai";

const Articles: React.FC = () => {
  const { articles } = useArticles();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResult, setAiResult] = useState<{ text: string; sources: any[] } | null>(null);

  const handleRead = (article: Article) => setSelectedArticle(article);
  const handleClose = () => setSelectedArticle(null);

  const handleAiResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setAiResult(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setAiResult({ text: "Neural Link Offline: API Configuration Required (VITE_GEMINI_API_KEY)", sources: [] });
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a detailed up-to-date professional insight about: ${searchQuery}. Focus on current trends and industry impact.`,
        config: { tools: [{ googleSearch: {} }] },
      });

      const text = response.text || "No insights found.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.filter((chunk: any) => chunk.web).map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

      setAiResult({ text, sources });
    } catch (error) {
      setAiResult({ text: "System error. Check uplink.", sources: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const safeArticles = Array.isArray(articles) ? articles : [];

  return (
    <section id="insights" className="py-16 md:py-20 relative bg-slate-50 dark:bg-brand-obsidian transition-colors">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="max-w-5xl mx-auto">
          
          <ScrollReveal>
             <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white mb-8 text-center">
               Insights
             </h2>
          </ScrollReveal>

          {/* AI Research Portal */}
          <div className="max-w-xl mx-auto mb-10">
            <form onSubmit={handleAiResearch} className="relative group">
              <div className="absolute -inset-1 bg-brand-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass rounded-full p-2 flex border border-white/40 dark:border-white/10 shadow-xl items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Request AI Insight..."
                  className="flex-1 bg-transparent border-none py-2 px-4 text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 font-mono text-base tracking-wide"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="p-2 bg-brand-primary text-white rounded-full hover:scale-105 transition-all shadow-lg shadow-brand-primary/20 flex-shrink-0"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>

          <AnimatePresence>
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-10 glass rounded-2xl p-6 md:p-8 border border-brand-primary/30 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Sparkles className="w-48 h-48" />
                </div>
                <div className="relative z-10 max-w-4xl">
                  <h4 className="text-[10px] font-mono font-bold text-brand-primary uppercase tracking-[0.2em] mb-4">Generated_Response_V.4</h4>
                  <p className="text-lg md:text-xl text-slate-800 dark:text-slate-200 leading-relaxed font-light mb-8 italic">
                    {aiResult.text}
                  </p>

                  {aiResult.sources.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100 dark:border-white/5">
                      {aiResult.sources.slice(0, 3).map((s, i) => (
                        <a key={i} href={s.uri} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all">
                          <Globe className="w-3 h-3" />
                          {s.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => setAiResult(null)} className="absolute top-6 right-6 p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => handleRead(article)}
                className="group glass rounded-2xl p-5 md:p-6 border border-white/40 dark:border-white/5 hover:border-brand-primary/30 transition-all duration-500 cursor-pointer flex flex-col h-full hover:shadow-2xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-brand-primary border border-slate-200 dark:border-white/10 group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">{article.readTime}</span>
                </div>

                <h4 className="text-lg font-display font-bold text-slate-900 dark:text-white uppercase leading-tight tracking-tight mb-4 group-hover:text-brand-primary transition-colors">
                  {article.title}
                </h4>

                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-8 flex-grow line-clamp-3 italic">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-[9px] font-bold">
                      {article.author.charAt(0)}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest">{article.author}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-brand-primary group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Reading Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-brand-obsidian/90 backdrop-blur-2xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-4xl glass rounded-2xl overflow-hidden relative z-[160] border border-white/20 shadow-3xl max-h-[90vh] flex flex-col"
            >
              <div className="p-6 md:p-8 overflow-y-auto no-scrollbar">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-mono font-bold text-brand-primary uppercase tracking-[0.5em]">{selectedArticle.category}</span>
                    <button onClick={handleClose} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase tracking-tight mb-8 leading-[1.05]">{selectedArticle.title}</h2>
                  <div className="flex flex-wrap items-center gap-6 mb-10 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest border-y border-slate-100 dark:border-white/5 py-3">
                    <span className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> {selectedArticle.author}</span>
                    <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {selectedArticle.date}</span>
                    <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {selectedArticle.readTime}</span>
                  </div>
                  <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed font-light italic">
                    {selectedArticle.content.split('\n').filter(p => p.trim() !== '').map((p, i) => <p key={i} className="mb-6">{p}</p>)}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Articles;
