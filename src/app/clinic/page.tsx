'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ClinicLayout } from '@/components/clinic/clinic-layout';
import { ClinicDashboard } from '@/components/clinic/clinic-dashboard';
import { PatientsModule } from '@/components/clinic/patients-module';
import { AppointmentsModule } from '@/components/clinic/appointments-module';
import { BillingModule } from '@/components/clinic/billing-module';
import { PrescriptionsModule } from '@/components/clinic/prescriptions-module';
import { LabModule } from '@/components/clinic/lab-module';
import { InventoryModule } from '@/components/clinic/inventory-module';
import { ReportsModule } from '@/components/clinic/reports-module';
import { ClinicSettingsModule } from '@/components/clinic/settings-module';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function ClinicPageContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if user is authenticated
    const user = localStorage.getItem('nexus_user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    if (tab === 'nurse') {
      router.push('/nurse');
    } else {
      setActiveTab(tab);
    }
  };

  // Render the appropriate module based on activeTab
  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ClinicDashboard />;
      case 'patients':
        return <PatientsModule />;
      case 'appointments':
        return <AppointmentsModule />;
      case 'billing':
        return <BillingModule />;
      case 'prescriptions':
        return <PrescriptionsModule />;
      case 'lab':
        return <LabModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'reports':
        return <ReportsModule />;
      case 'settings':
      case 'records':
        return <ClinicSettingsModule />;
      default:
        return <ClinicDashboard />;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050410]">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] animate-pulse" />
      </div>
    );
  }

  return (
    <ClinicLayout activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="module-container" data-tab={activeTab}>
        {renderModule()}
      </div>
    </ClinicLayout>
  );
}

export default function ClinicPage() {
  return <ClinicPageContent />;
}
