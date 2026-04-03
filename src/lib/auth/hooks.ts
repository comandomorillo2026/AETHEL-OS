'use client';

import { useAuth } from './context';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Role-based redirect paths
const ROLE_PATHS: Record<string, string> = {
  SUPER_ADMIN: '/admin',
  ADMIN: '/admin',
  TENANT_ADMIN: '/clinic',
  TENANT_USER: '/clinic',
};

// Industry-based paths
const INDUSTRY_PATHS: Record<string, string> = {
  clinic: '/clinic',
  nurse: '/nurse',
  lawfirm: '/lawfirm',
  beauty: '/beauty',
  bakery: '/bakery',
  pharmacy: '/pharmacy',
  insurance: '/insurance',
};

export function useAuthHook() {
  const { user, isAuthenticated, isLoading, login: contextLogin, logout: contextLogout } = useAuth();
  const router = useRouter();

  const login = useCallback(async (email: string, password: string) => {
    const result = await contextLogin(email, password);
    
    if (result.success) {
      // Determine redirect path
      let redirectPath = '/clinic';
      
      if (result.role === 'SUPER_ADMIN' || result.role === 'ADMIN') {
        redirectPath = '/admin';
      } else if (result.redirectPath) {
        redirectPath = result.redirectPath;
      }
      
      return { success: true, redirectPath };
    }
    
    return { success: false, error: result.error || 'Authentication failed' };
  }, [contextLogin]);

  const logout = useCallback(async () => {
    contextLogout();
    router.push('/login');
  }, [contextLogout, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    // Convenience properties
    role: user?.role,
    tenantId: user?.tenantId,
    tenantSlug: user?.tenantSlug,
  };
}

// Hook for checking if user is authenticated
export function useRequireAuth(allowedRoles?: string[]) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/clinic');
      }
    }
  }, [mounted, user, isAuthenticated, isLoading, router, allowedRoles]);

  return { user, isLoading: isLoading || !mounted };
}
