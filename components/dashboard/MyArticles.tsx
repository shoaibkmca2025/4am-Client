
import React, { useState } from 'react';
import { useArticles } from '../ArticleContext';
import { useAuth } from '../AuthContext';
import { Plus, Trash2, Edit2, Loader2, X, FileText, Calendar, Tag, ArrowLeft } from 'lucide-react';
import { Article } from '../../types';
import { useNavigate } from 'react-router-dom';

const MyArticles: React.FC = () => {
  const { articles = [], addArticle, deleteArticle } = useArticles();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const myArticles = Array.isArray(articles) ? articles : [];

  const [newArticle, setNewArticle] = useState({
    title: '',
    category: '',
    content: ''
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const content = typeof newArticle.content === 'string' ? newArticle.content : '';
    const wordsCount = content.trim().split(/\s+/).filter(Boolean).length;
    const readingMinutes = Math.max(1, Math.ceil(wordsCount / 200));

    // Simulate API delay
    setTimeout(() => {
      const article: Article = {
        id: Date.now().toString(),
        title: (newArticle.title || '').trim() || 'Untitled Insight',
        content: content,
        excerpt: content.length > 100 ? content.substring(0, 100) + '...' : content,
        author: user?.name || 'Authorized Architect',
        date: new Date().toLocaleDateString(),
        category: newArticle.category || 'Software Engineering',
        readTime: `${readingMinutes} min read`
      };
      addArticle(article);
      setLoading(false);
      setIsCreating(false);
      setNewArticle({ title: '', category: '', content: '' });
    }, 800);
  };

  if (isCreating) {
    return (
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-display text-gray-900 dark:text-white">Publish New Insight</h2>
          <button onClick={() => setIsCreating(false)} className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-full hover:scale-110 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleCreate} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-10 space-y-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Article Title</label>
              <input 
                required
                type="text" 
                value={newArticle.title}
                onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary"
                placeholder="The Future of Distributed Computing..."
              />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Industry Category</label>
               <select
                  required
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary [&>option]:text-black"
                >
                  <option value="">Select Domain</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Growth Marketing">Growth Marketing</option>
                  <option value="AI / ML Systems">AI / ML Systems</option>
                  <option value="Digital Strategy">Digital Strategy</option>
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Content Core</label>
            <textarea 
              required
              rows={12}
              value={newArticle.content}
              onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary"
              placeholder="Write your technical or marketing case study..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => setIsCreating(false)} className="px-8 py-4 text-gray-500 font-bold hover:text-gray-900">Cancel</button>
            <button 
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary/90 transition-all flex items-center gap-3 font-display shadow-lg shadow-brand-primary/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Publish to Network
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Overview
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-bold font-display text-gray-900 dark:text-white">Internal Insights</h2>
          <p className="text-gray-500 font-medium">Manage and monitor your professional publications.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-8 py-3.5 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary/90 transition-all flex items-center gap-3 font-display shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Article
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {myArticles.map((article) => (
          <div key={article.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 flex flex-col group hover:border-brand-primary/30 transition-all">
             <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                 <FileText className="w-6 h-6" />
               </div>
               <div className="flex gap-2">
                 <button className="p-2 text-gray-400 hover:text-brand-primary transition-colors bg-gray-50 dark:bg-white/5 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                 <button onClick={() => deleteArticle(article.id)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors bg-gray-50 dark:bg-white/5 rounded-lg"><Trash2 className="w-4 h-4" /></button>
               </div>
             </div>
             
             <h3 className="text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">{article.title}</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 flex-grow line-clamp-2">{article.excerpt}</p>
             
             <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                     <Calendar className="w-3.5 h-3.5" />
                     {article.date}
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                     <Tag className="w-3.5 h-3.5" />
                     {article.category}
                   </div>
                </div>
                <span className="text-[10px] font-bold text-gray-500">{article.readTime}</span>
             </div>
          </div>
        ))}

        {myArticles.length === 0 && (
          <div className="lg:col-span-2 py-32 text-center bg-white dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Network Archive Empty</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">Ready to share your technical knowledge or marketing results?</p>
            <button onClick={() => setIsCreating(true)} className="text-brand-primary font-bold hover:underline font-display uppercase tracking-widest text-sm">Start Writing Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArticles;
