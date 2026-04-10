'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuroraBackground, CondoHeader, StatCard, PageLoader, EmptyState } from '@/components/condo';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList, Wrench, FileBarChart, Calendar } from 'lucide-react';

function MaintenanceContent() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId') || 'default';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, [propertyId]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-[#050410]">
      <AuroraBackground />
      <CondoHeader 
        title="Maintenance" 
        subtitle="Panel de maintenance"
        rightContent={
          <Button className="btn-nexus">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo
          </Button>
        }
      />
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon={ClipboardList}
          title="Sin datos"
          description="No hay datos disponibles para mostrar"
        />
      </main>
    </div>
  );
}

export default function MaintenancePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <MaintenanceContent />
    </Suspense>
  );
}
