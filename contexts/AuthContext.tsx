// Authentication context and provider
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const checkSession = () => {
      const sessionToken = localStorage.getItem('gym_admin_session');
      const sessionExpiry = localStorage.getItem('gym_admin_expiry');
      
      if (sessionToken && sessionExpiry) {
        const now = new Date().getTime();
        const expiry = parseInt(sessionExpiry);
        
        if (now < expiry) {
          setIsAuthenticated(true);
        } else {
          // Session expired
          localStorage.removeItem('gym_admin_session');
          localStorage.removeItem('gym_admin_expiry');
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Use API route for authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        const now = new Date().getTime();
        const expiry = now + (24 * 60 * 60 * 1000); // 24 hours
        
        localStorage.setItem('gym_admin_session', 'authenticated');
        localStorage.setItem('gym_admin_expiry', expiry.toString());
        
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('gym_admin_session');
    localStorage.removeItem('gym_admin_expiry');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
