'use client';

import React, { useState } from 'react';
import { AdminLayout } from './admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Building2, 
  Activity,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Search,
  X,
  ChevronRight,
  Stethoscope,
  Heart,
  Scale,
  Scissors,
  Shield,
  Pill,
  ChefHat,
  ExternalLink,
  Pause,
  Play,
} from 'lucide-react';
import Link from 'next/link';
import { CompetitiveAnalysis } from './competitive-analysis';

// ============================================
// STAT CARD COMPONENT
// ============================================
function StatCard({ title, value, change, trend, icon: Icon, color = '#F0B429' }: {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ElementType;
  color?: string;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#9D7BEA] text-sm">{title}</p>
          <p className="text-2xl font-bold text-[#EDE9FE] mt-1" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {value}
          </p>
          {change && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${trend === 'up' ? 'text-[#34D399]' : 'text-[#F87171]'}`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {change}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

// ============================================
// TENANTS MANAGEMENT
// ============================================
function TenantsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Demo tenants data
  const tenants = [
    {
      id: '1',
      name: 'Clínica San Fernando',
      industry: 'clinic',
      owner: 'Dr. Juan Martínez',
      email: 'contacto@clinicasanfernando.tt',
      plan: 'GROWTH',
      status: 'active',
      users: 5,
      createdAt: '15/01/2026',
      lastLogin: 'Hoy, 9:45 AM',
      location: 'San Fernando, Trinidad',
      monthlyFee: 2200,
    },
    {
      id: '2',
      name: 'Bufete Pérez & Asociados',
      industry: 'lawfirm',
      owner: 'Carlos Pérez',
      email: 'info@bufeteperez.tt',
      plan: 'PREMIUM',
      status: 'active',
      users: 8,
      createdAt: '20/12/2025',
      lastLogin: 'Ayer, 4:30 PM',
      location: 'Port of Spain, Trinidad',
      monthlyFee: 4500,
    },
    {
      id: '3',
      name: 'Salón Bella Vista',
      industry: 'beauty',
      owner: 'Ana Gómez',
      email: 'bella@vistatt.com',
      plan: 'STARTER',
      status: 'pending',
      users: 2,
      createdAt: '01/04/2026',
      lastLogin: 'Nunca',
      location: 'Chaguanas, Trinidad',
      monthlyFee: 600,
    },
  ];

  const industryIcons: Record<string, React.ElementType> = {
    clinic: Stethoscope,
    nurse: Heart,
    beauty: Scissors,
    lawfirm: Scale,
    pharmacy: Pill,
    insurance: Shield,
    bakery: ChefHat,
  };

  const industryColors: Record<string, string> = {
    clinic: '#22D3EE',
    nurse: '#34D399',
    beauty: '#EC4899',
    lawfirm: '#C4A35A',
    pharmacy: '#8B5CF6',
    insurance: '#F59E0B',
    bakery: '#F97316',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-[#34D399]/10 text-[#34D399]',
    pending: 'bg-[#F0B429]/10 text-[#F0B429]',
    suspended: 'bg-[#F87171]/10 text-[#F87171]'
  };

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#EDE9FE]">Gestión de Inquilinos</h2>
          <p className="text-sm text-[#9D7BEA]">Administra todos los espacios de trabajo</p>
        </div>
        <Button className="btn-gold">
          <Plus className="w-4 h-4 mr-2" />
          Crear Inquilino
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9D7BEA]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, propietario o email..."
            className="pl-10 bg-[rgba(108,63,206,0.07)] border-[rgba(167,139,250,0.2)] text-[#EDE9FE]"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'pending', 'suspended'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                statusFilter === status
                  ? 'bg-[#F0B429] text-white'
                  : 'bg-[rgba(108,63,206,0.07)] text-[#9D7BEA] hover:text-[#EDE9FE]'
              }`}
            >
              {status === 'all' ? 'Todos' : status === 'active' ? 'Activos' : status === 'pending' ? 'Pendientes' : 'Suspendidos'}
            </button>
          ))}
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid gap-6">
        {filteredTenants.map((tenant) => {
          const IconComponent = industryIcons[tenant.industry] || Building2;
          const iconColor = industryColors[tenant.industry] || '#9D7BEA';
          
          return (
            <div key={tenant.id} className="p-6 rounded-xl bg-[rgba(14,12,31,0.7)] border border-[rgba(167,139,250,0.12)] hover:border-[rgba(167,139,250,0.3)] transition-all">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${iconColor}20` }}>
                    <IconComponent className="w-7 h-7" style={{ color: iconColor }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-[#EDE9FE]">{tenant.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${statusColors[tenant.status]}`}>
                        {tenant.status === 'active' ? 'Activo' : tenant.status === 'pending' ? 'Pendiente' : 'Suspendido'}
                      </span>
                    </div>
                    <p className="text-sm text-[#9D7BEA]">{tenant.owner} • {tenant.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {tenant.status === 'pending' && (
                    <Button className="btn-gold" size="sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Activar
                    </Button>
                  )}
                  {tenant.status === 'active' && (
                    <Button variant="outline" size="sm" className="text-[#F87171] border-[#F87171]/30 hover:bg-[#F87171]/10">
                      <Pause className="w-4 h-4 mr-1" />
                      Suspender
                    </Button>
                  )}
                  <Link
                    href={`/${tenant.industry}`}
                    className="p-2 rounded-lg hover:bg-[rgba(108,63,206,0.1)] text-[#9D7BEA] hover:text-[#EDE9FE]"
                    title="Ver espacio"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-[rgba(108,63,206,0.05)]">
                <div>
                  <p className="text-xs text-[#9D7BEA] mb-1">Plan</p>
                  <p className="text-sm font-medium text-[#F0B429]">{tenant.plan}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9D7BEA] mb-1">Mensualidad</p>
                  <p className="text-sm font-medium text-[#EDE9FE]">TT${tenant.monthlyFee}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9D7BEA] mb-1">Usuarios</p>
                  <p className="text-sm font-medium text-[#EDE9FE]">{tenant.users}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9D7BEA] mb-1">Ubicación</p>
                  <p className="text-sm font-medium text-[#EDE9FE]">{tenant.location}</p>
                </div>
              </div>

              {/* Activity Row */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(167,139,250,0.1)]">
                <div className="flex items-center gap-6 text-xs text-[#9D7BEA]">
                  <span>📅 Ingreso: {tenant.createdAt}</span>
                  <span>🕐 Último acceso: {tenant.lastLogin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-[#9D7BEA] border-[rgba(167,139,250,0.2)]">
                    Crear Factura
                  </Button>
                  <Button variant="outline" size="sm" className="text-[#9D7BEA] border-[rgba(167,139,250,0.2)]">
                    Ver Historial
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 mx-auto text-[#9D7BEA]" />
          <p className="text-[#9D7BEA] mt-4">No se encontraron inquilinos</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// ORDERS MANAGEMENT
// ============================================
function OrdersManagement() {
  const orders = [
    { id: 'NXS-2026-0001', business: 'Clínica San Fernando', plan: 'GROWTH', amount: 'TT$2,750', status: 'paid', date: '2026-03-15' },
    { id: 'NXS-2026-0002', business: 'Bufete Pérez & Asoc.', plan: 'PREMIUM', amount: 'TT$4,050', status: 'pending', date: '2026-03-14' },
    { id: 'NXS-2026-0003', business: 'Salón Bella Vista', plan: 'STARTER', amount: 'TT$750', status: 'paid', date: '2026-03-13' },
  ];

  const statusColors: Record<string, string> = {
    paid: 'bg-[#34D399]/10 text-[#34D399]',
    pending: 'bg-[#F0B429]/10 text-[#F0B429]',
    failed: 'bg-[#F87171]/10 text-[#F87171]'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#EDE9FE]">Órdenes de Compra</h2>
        <p className="text-sm text-[#9D7BEA]">Historial de transacciones y pagos</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(167,139,250,0.1)] bg-[rgba(108,63,206,0.05)]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9D7BEA]">Orden</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9D7BEA]">Negocio</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9D7BEA]">Plan</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9D7BEA]">Monto</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9D7BEA]">Fecha</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9D7BEA]">Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[rgba(167,139,250,0.05)] last:border-0 hover:bg-[rgba(108,63,206,0.03)]">
                  <td className="py-3 px-4 text-sm text-[#B197FC] font-mono">{order.id}</td>
                  <td className="py-3 px-4 text-sm text-[#EDE9FE]">{order.business}</td>
                  <td className="py-3 px-4 text-sm text-[#9D7BEA]">{order.plan}</td>
                  <td className="py-3 px-4 text-sm text-[#EDE9FE] font-mono">{order.amount}</td>
                  <td className="py-3 px-4 text-sm text-[#9D7BEA]">{order.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${statusColors[order.status]}`}>
                      {order.status === 'paid' ? 'Pagado' : order.status === 'pending' ? 'Pendiente' : 'Fallido'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// INDUSTRIES PREVIEW
// ============================================
function IndustriesPreview() {
  const industries = [
    { id: 'clinic', name: 'Clínica', icon: Stethoscope, color: '#22D3EE', href: '/clinic' },
    { id: 'lawfirm', name: 'Bufete', icon: Scale, color: '#C4A35A', href: '/lawfirm' },
    { id: 'beauty', name: 'Belleza', icon: Scissors, color: '#EC4899', href: '/beauty' },
    { id: 'nurse', name: 'Enfermería', icon: Heart, color: '#34D399', href: '/nurse' },
    { id: 'bakery', name: 'Panadería', icon: ChefHat, color: '#F97316', href: '/bakery' },
    { id: 'pharmacy', name: 'Farmacia', icon: Pill, color: '#8B5CF6', href: '/pharmacy' },
    { id: 'insurance', name: 'Aseguradora', icon: Shield, color: '#F59E0B', href: '/insurance' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#EDE9FE]">Industrias</h2>
        <p className="text-sm text-[#9D7BEA]">Acceso directo a módulos de prueba</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {industries.map((ind) => (
          <Link
            key={ind.id}
            href={ind.href}
            className="p-6 rounded-xl bg-[rgba(14,12,31,0.7)] border border-[rgba(167,139,250,0.12)] hover:border-[rgba(167,139,250,0.3)] transition-all hover:scale-[1.02] text-center"
          >
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${ind.color}20` }}>
              <ind.icon className="w-6 h-6" style={{ color: ind.color }} />
            </div>
            <p className="text-[#EDE9FE] font-medium">{ind.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============================================
// PRICING CONFIGURATION
// ============================================
function PricingConfiguration() {
  const industryPrices = [
    { industry: 'Panadería', starter: 500, growth: 900, premium: 1500 },
    { industry: 'Belleza', starter: 600, growth: 1100, premium: 1900 },
    { industry: 'Enfermería', starter: 800, growth: 1500, premium: 2500 },
    { industry: 'Clínica', starter: 1200, growth: 2200, premium: 3800 },
    { industry: 'Bufete', starter: 1500, growth: 2800, premium: 4500 },
    { industry: 'Farmacia', starter: 1800, growth: 3200, premium: 5000 },
    { industry: 'Aseguradora', starter: 8000, growth: 15000, premium: 28000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#EDE9FE]">Configuración de Precios por Industria</h2>
        <p className="text-sm text-[#9D7BEA]">Precios mensuales en TT$</p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(167,139,250,0.1)] bg-[rgba(108,63,206,0.05)]">
              <th className="text-left py-3 px-4 text-sm font-medium text-[#9D7BEA]">Industria</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-[#9D7BEA]">Starter</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-[#F0B429]">Growth</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-[#9D7BEA]">Premium</th>
            </tr>
          </thead>
          <tbody>
            {industryPrices.map((item, idx) => (
              <tr key={idx} className="border-b border-[rgba(167,139,250,0.05)] last:border-0 hover:bg-[rgba(108,63,206,0.03)]">
                <td className="py-3 px-4 text-sm text-[#EDE9FE] font-medium">{item.industry}</td>
                <td className="py-3 px-4 text-center">
                  <input
                    type="number"
                    defaultValue={item.starter}
                    className="w-24 text-center bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.2)] rounded px-2 py-1 text-sm text-[#EDE9FE]"
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  <input
                    type="number"
                    defaultValue={item.growth}
                    className="w-24 text-center bg-[rgba(240,180,41,0.05)] border border-[#F0B429]/30 rounded px-2 py-1 text-sm text-[#F0B429] font-medium"
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  <input
                    type="number"
                    defaultValue={item.premium}
                    className="w-24 text-center bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.2)] rounded px-2 py-1 text-sm text-[#EDE9FE]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Button className="btn-gold">
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}

// ============================================
// PLACEHOLDER MODULES
// ============================================
function PlaceholderModule({ name, description }: { name: string; description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#EDE9FE]">{name}</h2>
        <p className="text-sm text-[#9D7BEA]">{description}</p>
      </div>
      <div className="glass-card p-12 text-center">
        <p className="text-[#9D7BEA]">Módulo en desarrollo...</p>
      </div>
    </div>
  );
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Listen for navigation events from sidebar
  React.useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('adminTabChange', handleTabChange as EventListener);
    return () => window.removeEventListener('adminTabChange', handleTabChange as EventListener);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Inquilinos Activos" value="12" change="+2 este mes" trend="up" icon={Users} color="#34D399" />
              <StatCard title="Ingresos Mensuales" value="TT$45,200" change="+15%" trend="up" icon={DollarSign} color="#F0B429" />
              <StatCard title="Órdenes Pendientes" value="3" icon={Activity} color="#22D3EE" />
              <StatCard title="Industrias" value="7" icon={Building2} color="#EC4899" />
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-[#EDE9FE] mb-4">Actividad Reciente</h3>
              <div className="space-y-3">
                {[
                  { action: 'Nuevo inquilino registrado', business: 'Salón Bella Vista', time: 'Hace 2 horas' },
                  { action: 'Pago recibido', business: 'Clínica San Fernando', time: 'Hace 5 horas' },
                  { action: 'Cuenta activada', business: 'Bufete Pérez & Asoc.', time: 'Hace 1 día' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-[rgba(167,139,250,0.1)] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#34D399]" />
                      <span className="text-sm text-[#EDE9FE]">{item.action}</span>
                      <span className="text-sm text-[#F0B429]">{item.business}</span>
                    </div>
                    <span className="text-xs text-[#9D7BEA]">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'orders':
        return <OrdersManagement />;
      case 'tenants':
        return <TenantsManagement />;
      case 'industries':
        return <IndustriesPreview />;
      case 'competitive':
        return <CompetitiveAnalysis />;
      case 'pricing':
        return <PricingConfiguration />;
      case 'templates':
        return <PlaceholderModule name="Templates" description="Plantillas de facturas, recibos y emails" />;
      case 'broadcasts':
        return <PlaceholderModule name="Comunicados" description="Envía mensajes masivos a inquilinos" />;
      case 'scalability':
        return <PlaceholderModule name="Escalabilidad" description="Métricas y plan de escalabilidad" />;
      case 'database':
        return <PlaceholderModule name="Base de Datos" description="Monitoreo de base de datos" />;
      case 'users':
        return <PlaceholderModule name="Usuarios" description="Gestión de usuarios del sistema" />;
      case 'settings':
        return <PlaceholderModule name="Configuración" description="Ajustes del sistema" />;
      case 'create-tenant':
        return <PlaceholderModule name="Crear Inquilino" description="Wizard de creación de inquilinos" />;
      default:
        return <OrdersManagement />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
}

export default AdminDashboard;
