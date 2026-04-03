'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { PharmacyRoute } from '@/components/auth/protected-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Pill,
  Package,
  Users,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
  ShoppingCart,
  FileText,
  Settings,
  BarChart3,
  FlaskConical,
  Truck,
  ClipboardList
} from 'lucide-react';

// Pharmacy Dashboard Component
function PharmacyDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ventas del Día</p>
                <p className="text-2xl font-bold mt-1">TT$12,450</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+15.2%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl text-white bg-emerald-500">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Recetas Procesadas</p>
                <p className="text-2xl font-bold mt-1">87</p>
                <p className="text-sm text-gray-400 mt-2">Hoy</p>
              </div>
              <div className="p-3 rounded-xl text-white bg-blue-500">
                <ClipboardList className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Alertas de Stock</p>
                <p className="text-2xl font-bold mt-1 text-amber-500">12</p>
                <p className="text-sm text-amber-500 mt-2">Requieren atención</p>
              </div>
              <div className="p-3 rounded-xl text-white bg-amber-500">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Clientes Hoy</p>
                <p className="text-2xl font-bold mt-1">156</p>
                <p className="text-sm text-gray-400 mt-2">Únicos</p>
              </div>
              <div className="p-3 rounded-xl text-white bg-purple-500">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: ShoppingCart, label: 'Nueva Venta', color: 'bg-emerald-500' },
          { icon: ClipboardList, label: 'Procesar Receta', color: 'bg-blue-500' },
          { icon: Package, label: 'Inventario', color: 'bg-purple-500' },
          { icon: Truck, label: 'Proveedores', color: 'bg-amber-500' }
        ].map((action, i) => (
          <Button key={i} variant="outline" className="h-20 flex flex-col gap-2">
            <action.icon className={`w-6 h-6 p-1 rounded ${action.color} text-white`} />
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Stock Bajo
            </CardTitle>
            <Badge variant="destructive">12 productos</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Amoxicilina 500mg', stock: 15, min: 50 },
                { name: 'Ibuprofeno 400mg', stock: 23, min: 100 },
                { name: 'Omeprazol 20mg', stock: 8, min: 75 },
                { name: 'Loratadina 10mg', stock: 12, min: 60 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Pill className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-amber-600">Quedan {item.stock} unidades</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                    Reordenar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              Recetas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { patient: 'María González', items: 3, status: 'completed', time: '10:30 AM' },
                { patient: 'Carlos Rodríguez', items: 5, status: 'pending', time: '10:15 AM' },
                { patient: 'Ana Martínez', items: 2, status: 'completed', time: '9:45 AM' },
                { patient: 'José López', items: 4, status: 'verifying', time: '9:30 AM' },
              ].map((rx, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FlaskConical className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{rx.patient}</p>
                      <p className="text-sm text-gray-500">{rx.items} medicamentos • {rx.time}</p>
                    </div>
                  </div>
                  <Badge className={
                    rx.status === 'completed' ? 'bg-green-100 text-green-700' :
                    rx.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }>
                    {rx.status === 'completed' ? 'Completado' : 
                     rx.status === 'pending' ? 'Pendiente' : 'Verificando'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Soon */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-red-500" />
            Productos por Vencer (30 días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-gray-500">Producto</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">Lote</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">Vence</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">Stock</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-500">Acción</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { product: 'Paracetamol 500mg', lot: 'LOT-2024-001', expires: '15 Abr 2024', stock: 45 },
                  { product: 'Aspirina 100mg', lot: 'LOT-2024-015', expires: '22 Abr 2024', stock: 120 },
                  { product: 'Vitamina C 1g', lot: 'LOT-2024-023', expires: '28 Abr 2024', stock: 78 },
                ].map((item, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 flex items-center gap-2">
                      <Pill className="h-4 w-4 text-gray-400" />
                      {item.product}
                    </td>
                    <td className="py-3 text-sm text-gray-500">{item.lot}</td>
                    <td className="py-3 text-sm text-red-500">{item.expires}</td>
                    <td className="py-3 text-sm">{item.stock} uds</td>
                    <td className="py-3 text-right">
                      <Button size="sm" variant="outline" className="text-red-500 border-red-200">
                        Marcar Descuento
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'pos', label: 'Punto de Venta', icon: 'ShoppingCart' },
  { id: 'products', label: 'Inventario', icon: 'Package' },
  { id: 'prescriptions', label: 'Recetas', icon: 'ClipboardList' },
  { id: 'customers', label: 'Clientes', icon: 'Users' },
  { id: 'suppliers', label: 'Proveedores', icon: 'Truck' },
  { id: 'reports', label: 'Reportes', icon: 'BarChart3' },
  { id: 'settings', label: 'Configuración', icon: 'Settings' },
];

function PharmacyPageContent() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <PharmacyDashboard />;
      default:
        return <PharmacyDashboard />;
    }
  };

  return (
    <DashboardLayout
      title="NexusOS Pharmacy"
      subtitle="Sistema de Gestión para Farmacias"
      menuItems={menuItems}
      activeModule={activeModule}
      onModuleChange={setActiveModule}
      primaryColor="#10B981"
      secondaryColor="#34D399"
    >
      {renderContent()}
    </DashboardLayout>
  );
}

export default function PharmacyPage() {
  return (
    <PharmacyRoute>
      <PharmacyPageContent />
    </PharmacyRoute>
  );
}
