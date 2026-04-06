'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRestoringSession: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; role?: string; redirectPath?: string; error?: string }>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
  isSuperAdmin: boolean;
  isTenant: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'aethel-auth-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Restore session from cookies on mount
  const restoreSession = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.valid && data.user) {
        const restoredUser: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          tenantId: data.user.tenantId,
          tenantSlug: data.user.tenantSlug,
        };

        setUser(restoredUser);

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(restoredUser));
        } catch (e) {
          // Ignore
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('[AUTH] Session restore error:', error);
      return false;
    }
  }, []);

  // Load user from localStorage or restore from cookies after mount
  useEffect(() => {
    setMounted(true);

    const initAuth = async () => {
      // First try localStorage for quick render
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        // Ignore
      }

      // Then verify/restore session from server cookies
      const restored = await restoreSession();
      if (!restored) {
        // Clear localStorage if session is invalid
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          // Ignore
        }
        setUser(null);
      }

      setIsRestoringSession(false);
    };

    initAuth();
  }, [restoreSession]);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
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

  const logout = useCallback(async () => {
    try {
      // Clear server session
      await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (e) {
      // Ignore
    }

    setUser(null);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  }, []);

  // Show loading during hydration
  if (!mounted) {
    return (
      <AuthContext.Provider value={{
        user: null,
        isAuthenticated: false,
        isLoading: true,
        isRestoringSession: true,
        login: async () => ({ success: false }),
        logout: async () => {},
        isSuperAdmin: false,
        isTenant: false,
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      isRestoringSession,
      login,
      logout,
      restoreSession,
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
