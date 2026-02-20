
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

// FIX: Updated AuthContextType to include missing login, register, logout, and update methods
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  loginWithSocial: (provider: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if a guest profile exists or set a default session
    const checkSession = () => {
      try {
        const stored = localStorage.getItem('guest_session');
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          // Default anonymous session for the AI chatbot context
          const guest: User = { 
            id: 'guest_1',
            name: 'Operator', 
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
            jobTitle: 'Verified Operator',
            location: 'GLOBAL_NODE'
          };
          setUser(guest);
        }
      } catch (e) {
        console.warn("Session check failed.");
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // FIX: Implemented missing auth methods used by consumer components
  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const loggedUser: User = { 
        id: 'user_123',
        name: 'Shoaib', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shoaib',
        jobTitle: 'Core Architect',
        location: 'London Node'
      };
      setUser(loggedUser);
      localStorage.setItem('guest_session', JSON.stringify(loggedUser));
      setIsLoading(false);
    }, 1000);
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newUser: User = { 
        id: 'user_' + Date.now(),
        name, 
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        jobTitle: 'New Operator'
      };
      setUser(newUser);
      localStorage.setItem('guest_session', JSON.stringify(newUser));
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('guest_session');
  };

  const loginWithSocial = async (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const socialUser: User = { 
        id: 'social_' + provider,
        name: 'Social Operator', 
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`
      };
      setUser(socialUser);
      localStorage.setItem('guest_session', JSON.stringify(socialUser));
      setIsLoading(false);
    }, 1000);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('guest_session', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout, 
      loginWithSocial, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};