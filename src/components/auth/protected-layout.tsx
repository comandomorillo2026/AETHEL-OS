'use client';

import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  allowedIndustries?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
  allowedIndustries,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Check if user is authenticated
    const storedUser = localStorage.getItem('nexus_user');
    if (!storedUser && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Parse stored user if needed
    let currentUser = user;
    if (!currentUser && storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
      } catch (e) {
        router.push('/login');
        return;
      }
    }

    if (currentUser) {
      // Check role restriction
      if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        // Redirect to appropriate dashboard based on role
        if (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN') {
          router.push('/admin');
        } else if (currentUser.tenantSlug) {
          router.push(`/${currentUser.tenantSlug}`);
        } else {
          router.push('/clinic');
        }
        return;
      }

      // Check industry restriction - if user has a tenantSlug, allow access
      // The middleware already handles industry-based routing
    }
  }, [mounted, user, isAuthenticated, router, allowedRoles, allowedIndustries]);

  // Show loading during mount
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050410]">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] animate-pulse" />
      </div>
    );
  }

  // Check if user exists (either from context or localStorage)
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('nexus_user') : null;
  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

  if (!currentUser && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050410]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#6C3FCE]" />
          <p className="text-[#9D7BEA] text-sm">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Check restrictions again before rendering
  if (currentUser) {
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#050410]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#6C3FCE]" />
            <p className="text-[#9D7BEA] text-sm">Redirigiendo...</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

// Convenience wrappers for specific industries
export function ClinicRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function LawfirmRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function BeautyRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function NurseRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function BakeryRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function PharmacyRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function InsuranceRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>{children}</ProtectedRoute>;
}
