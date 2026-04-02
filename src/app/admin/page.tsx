'use client';

import { AdminRoute } from '@/components/auth/protected-layout';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

function AdminContent() {
  return <AdminDashboard />;
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminContent />
    </AdminRoute>
  );
}
