'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // Check role restriction
      if (allowedRoles && !allowedRoles.includes(session.user.role)) {
        // Redirect to appropriate dashboard based on role
        if (session.user.role === 'SUPER_ADMIN') {
          router.push('/admin');
        } else {
          const industryRoutes: Record<string, string> = {
            clinic: '/clinic',
            nurse: '/nurse',
            lawfirm: '/lawfirm',
            beauty: '/beauty',
            bakery: '/bakery',
            pharmacy: '/pharmacy',
            insurance: '/insurance',
          };
          const route = industryRoutes[session.user.industrySlug || ''];
          router.push(route || '/login');
        }
        return;
      }

      // Check industry restriction
      if (
        allowedIndustries &&
        session.user.role !== 'SUPER_ADMIN' &&
        !allowedIndustries.includes(session.user.industrySlug || '')
      ) {
        // Redirect to their correct dashboard
        const industryRoutes: Record<string, string> = {
          clinic: '/clinic',
          nurse: '/nurse',
          lawfirm: '/lawfirm',
          beauty: '/beauty',
          bakery: '/bakery',
          pharmacy: '/pharmacy',
          insurance: '/insurance',
        };
        const correctRoute = industryRoutes[session.user.industrySlug || ''];
        if (correctRoute) {
          router.push(correctRoute);
        } else {
          router.push('/login');
        }
        return;
      }
    }
  }, [status, session, router, allowedRoles, allowedIndustries]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050410]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#6C3FCE]" />
          <p className="text-[#9D7BEA] text-sm">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  // Check restrictions again before rendering
  if (session?.user) {
    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      return null;
    }
    if (
      allowedIndustries &&
      session.user.role !== 'SUPER_ADMIN' &&
      !allowedIndustries.includes(session.user.industrySlug || '')
    ) {
      return null;
    }
  }

  return <>{children}</>;
}

// Convenience wrappers for specific industries
export function ClinicRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedIndustries={['clinic']} allowedRoles={['SUPER_ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function LawfirmRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedIndustries={['lawfirm']} allowedRoles={['SUPER_ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function BeautyRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedIndustries={['beauty']} allowedRoles={['SUPER_ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function NurseRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedIndustries={['nurse']} allowedRoles={['SUPER_ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function BakeryRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedIndustries={['bakery']} allowedRoles={['SUPER_ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function PharmacyRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedIndustries={['pharmacy']} allowedRoles={['SUPER_ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function InsuranceRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedIndustries={['insurance']} allowedRoles={['SUPER_ADMIN', 'TENANT_ADMIN', 'TENANT_USER']}>
      {children}
    </ProtectedRoute>
  );
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>{children}</ProtectedRoute>;
}
