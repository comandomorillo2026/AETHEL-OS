'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/lib/auth/simple-auth';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useSimpleAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050410]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#6C3FCE]" />
          <p className="text-[#9D7BEA] text-sm">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AdminDashboard />;
}
