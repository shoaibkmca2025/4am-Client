import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Article } from '../types';
import { INITIAL_ARTICLES } from '../constants';

interface ArticleContextType {
  articles: Article[];
  addArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  updateArticle: (article: Article) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(Array.isArray(INITIAL_ARTICLES) ? INITIAL_ARTICLES : []);

  const addArticle = (article: Article) => {
    if (!article) return;
    setArticles(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return [article, ...safePrev];
    });
  };

  const deleteArticle = (id: string) => {
    if (!id) return;
    setArticles(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.filter(a => a && a.id !== id);
    });
  };

  const updateArticle = (article: Article) => {
    if (!article || !article.id) return;
    setArticles(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.map(a => (a && a.id === article.id ? article : a));
    });
  };

  return (
    <ArticleContext.Provider value={{ 
      articles: Array.isArray(articles) ? articles : [], 
      addArticle, 
      deleteArticle, 
      updateArticle 
    }}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};