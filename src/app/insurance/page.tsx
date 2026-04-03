'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { InsuranceRoute } from '@/components/auth/protected-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Car,
  Home,
  Heart,
  Briefcase,
  Settings,
  BarChart3,
  CreditCard
} from 'lucide-react';

// Insurance Dashboard Component
function InsuranceDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pólizas Activas</p>
                <p className="text-2xl font-bold mt-1">1,247</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+23 este mes</span>
                </div>
              </div>
              <div className="p-3 rounded-xl text-white bg-blue-600">
                <Shield className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Reclamaciones Pendientes</p>
                <p className="text-2xl font-bold mt-1 text-amber-500">38</p>
                <p className="text-sm text-gray-400 mt-2">Requieren revisión</p>
              </div>
              <div className="p-3 rounded-xl text-white bg-amber-500">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Primas del Mes</p>
                <p className="text-2xl font-bold mt-1">TT$847,500</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+8.3%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl text-white bg-green-500">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Siniestros Pagados</p>
                <p className="text-2xl font-bold mt-1">TT$234,800</p>
                <p className="text-sm text-gray-400 mt-2">Este mes</p>
              </div>
              <div className="p-3 rounded-xl text-white bg-purple-500">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Car, label: 'Auto', count: 423, color: 'bg-blue-500' },
          { icon: Home, label: 'Hogar', count: 312, color: 'bg-green-500' },
          { icon: Heart, label: 'Salud', count: 389, color: 'bg-red-500' },
          { icon: Briefcase, label: 'Negocio', count: 123, color: 'bg-purple-500' }
        ].map((type, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 rounded-xl ${type.color} flex items-center justify-center mx-auto mb-2`}>
                <type.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900">{type.label}</p>
              <p className="text-sm text-gray-500">{type.count} pólizas</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Claims */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-500" />
              Reclamaciones Pendientes
            </CardTitle>
            <Badge variant="destructive">38 pendientes</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { claimant: 'María Santos', type: 'Salud', amount: 'TT$15,400', date: 'Hoy', priority: 'high' },
                { claimant: 'Carlos Mendoza', type: 'Auto', amount: 'TT$8,200', date: 'Ayer', priority: 'medium' },
                { claimant: 'Ana Rodríguez', type: 'Hogar', amount: 'TT$23,500', date: '2 días', priority: 'high' },
                { claimant: 'Pedro Jiménez', type: 'Salud', amount: 'TT$5,800', date: '3 días', priority: 'low' },
              ].map((claim, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-10 rounded-full ${
                      claim.priority === 'high' ? 'bg-red-500' :
                      claim.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{claim.claimant}</p>
                      <p className="text-sm text-gray-500">{claim.type} • {claim.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{claim.amount}</p>
                    <div className="flex gap-1 mt-1">
                      <Button size="sm" variant="outline" className="h-7 text-green-600">
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-red-600">
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Policies */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Pólizas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { client: 'Roberto Fernández', type: 'Auto', premium: 'TT$3,200/año', status: 'active' },
                { client: 'Laura García', type: 'Salud', premium: 'TT$8,400/año', status: 'active' },
                { client: 'Miguel Torres', type: 'Hogar', premium: 'TT$4,800/año', status: 'pending' },
                { client: 'Sofia Reyes', type: 'Negocio', premium: 'TT$15,600/año', status: 'active' },
              ].map((policy, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{policy.client}</p>
                      <p className="text-sm text-gray-500">{policy.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{policy.premium}</p>
                    <Badge className={
                      policy.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }>
                      {policy.status === 'active' ? 'Activa' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Resumen del Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">156</p>
              <p className="text-sm text-gray-600">Pólizas Nuevas</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">89</p>
              <p className="text-sm text-gray-600">Renovaciones</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">23</p>
              <p className="text-sm text-gray-600">Por Vencer</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">5</p>
              <p className="text-sm text-gray-600">Canceladas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'policies', label: 'Pólizas', icon: 'Shield' },
  { id: 'claims', label: 'Reclamaciones', icon: 'FileText' },
  { id: 'clients', label: 'Clientes', icon: 'Users' },
  { id: 'products', label: 'Productos', icon: 'Package' },
  { id: 'billing', label: 'Facturación', icon: 'CreditCard' },
  { id: 'reports', label: 'Reportes', icon: 'BarChart3' },
  { id: 'settings', label: 'Configuración', icon: 'Settings' },
];

function InsurancePageContent() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <InsuranceDashboard />;
      default:
        return <InsuranceDashboard />;
    }
  };

  return (
    <DashboardLayout
      title="NexusOS Insurance"
      subtitle="Sistema de Gestión para Aseguradoras"
      menuItems={menuItems}
      activeModule={activeModule}
      onModuleChange={setActiveModule}
      primaryColor="#2563EB"
      secondaryColor="#3B82F6"
    >
      {renderContent()}
    </DashboardLayout>
  );
}

export default function InsurancePage() {
  return (
    <InsuranceRoute>
      <InsurancePageContent />
    </InsuranceRoute>
  );
}
