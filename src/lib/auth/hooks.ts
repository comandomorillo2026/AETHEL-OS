'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

// Role-based redirect paths
const ROLE_PATHS: Record<string, string> = {
  SUPER_ADMIN: '/admin',
  TENANT_ADMIN: '/clinic',
  TENANT_USER: '/clinic',
};

// Industry-based paths
const INDUSTRY_PATHS: Record<string, string> = {
  clinic: '/clinic',
  nurse: '/nurse',
  lawfirm: '/lawfirm',
  beauty: '/beauty',
  retail: '/retail',
  bakery: '/bakery',
};

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const user = session?.user;

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('[AUTH] signIn result:', result);

      // Check for errors
      if (result?.error) {
        console.log('[AUTH] Error:', result.error);
        return { success: false, error: result.error };
      }

      // Check if login was successful (result.ok is true)
      if (result?.ok === false) {
        console.log('[AUTH] result.ok is false');
        return { success: false, error: 'Authentication failed' };
      }

      // Determine redirect path based on email
      let redirectPath = '/clinic';

      if (email === 'admin@nexusos.tt') {
        redirectPath = '/admin';
      } else if (user?.industrySlug && INDUSTRY_PATHS[user.industrySlug]) {
        redirectPath = INDUSTRY_PATHS[user.industrySlug];
      } else if (user?.role && ROLE_PATHS[user.role]) {
        redirectPath = ROLE_PATHS[user.role];
      }

      console.log('[AUTH] Login successful, redirecting to:', redirectPath);

      return { success: true, redirectPath };
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [user]);

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/login');
  }, [router]);

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
    tenantName: user?.tenantName,
    industrySlug: user?.industrySlug,
  };
}

// Auth provider component - wraps SessionProvider
export { SessionProvider as AuthProvider } from 'next-auth/react';
