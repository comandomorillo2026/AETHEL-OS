'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User } from './types';
import { DEMO_USERS, DEMO_PASSWORDS } from './types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: string; redirectPath?: string }>;
  logout: () => void;
  isSuperAdmin: boolean;
  isTenant: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'nexusos-auth-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user from localStorage on mount only
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      // Ignore errors
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    
    const emailLower = email.toLowerCase();
    const demoUser = DEMO_USERS[emailLower];
    const demoPassword = DEMO_PASSWORDS[emailLower];
    
    if (demoUser && demoPassword === password) {
      setUser(demoUser);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
      } catch (e) {
        // Ignore
      }
      setIsLoading(false);
      
      const redirectPath = (demoUser.role === 'SUPER_ADMIN' || demoUser.role === 'ADMIN') 
        ? '/admin' 
        : demoUser.tenantSlug || '/clinic';
      
      return { success: true, role: demoUser.role, redirectPath };
    }
    
    setIsLoading(false);
    return { success: false };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      isSuperAdmin: user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN',
      isTenant: user?.role === 'TENANT_ADMIN' || user?.role === 'TENANT_USER',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
