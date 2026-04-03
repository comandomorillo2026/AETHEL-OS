'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: string; redirectPath?: string; error?: string }>;
  logout: () => void;
  isSuperAdmin: boolean;
  isTenant: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'nexusos-auth-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load user from localStorage after mount (client-side only)
  useEffect(() => {
    setMounted(true);
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
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        const authenticatedUser: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          tenantId: data.user.tenantId,
          tenantSlug: data.user.tenantSlug,
        };

        setUser(authenticatedUser);
        
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
        } catch (e) {
          // Ignore
        }
        
        setIsLoading(false);
        return { 
          success: true, 
          role: data.user.role, 
          redirectPath: data.redirectPath 
        };
      }
      
      setIsLoading(false);
      return { 
        success: false, 
        error: data.error || 'Credenciales inválidas' 
      };
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: 'Error de conexión. Intenta de nuevo.' 
      };
    }
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
