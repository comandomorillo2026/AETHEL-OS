'use client';

import React, { useState, useMemo } from 'react';
import { ClinicLayout } from './clinic-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Activity,
  PieChart,
  BarChart3,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Printer,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Types
interface RevenueData {
  date: string;
  revenue: number;
  appointments: number;
}

interface PatientDemographics {
  ageGroup: string;
  male: number;
  female: number;
}

interface ServiceStats {
  name: string;
  count: number;
  revenue: number;
  percentage: number;
}

interface OutstandingInvoice {
  invoiceNumber: string;
  patientName: string;
  date: string;
  dueDate: string;
  amount: number;
  daysOverdue: number;
}

// Demo data
const REVENUE_DATA: RevenueData[] = [
  { date: '2026-03-01', revenue: 2500, appointments: 15 },
  { date: '2026-03-02', revenue: 3200, appointments: 18 },
  { date: '2026-03-03', revenue: 2800, appointments: 16 },
  { date: '2026-03-04', revenue: 4100, appointments: 22 },
  { date: '2026-03-05', revenue: 3800, appointments: 20 },
  { date: '2026-03-06', revenue: 1900, appointments: 10 },
  { date: '2026-03-07', revenue: 1200, appointments: 6 },
  { date: '2026-03-08', revenue: 2600, appointments: 14 },
  { date: '2026-03-09', revenue: 3400, appointments: 19 },
  { date: '2026-03-10', revenue: 3100, appointments: 17 },
  { date: '2026-03-11', revenue: 4500, appointments: 25 },
  { date: '2026-03-12', revenue: 4200, appointments: 23 },
  { date: '2026-03-13', revenue: 2000, appointments: 11 },
  { date: '2026-03-14', revenue: 1500, appointments: 8 },
  { date: '2026-03-15', revenue: 2800, appointments: 16 },
  { date: '2026-03-16', revenue: 3600, appointments: 20 },
  { date: '2026-03-17', revenue: 3900, appointments: 21 },
  { date: '2026-03-18', revenue: 4400, appointments: 24 },
  { date: '2026-03-19', revenue: 4100, appointments: 22 },
  { date: '2026-03-20', revenue: 4800, appointments: 26 },
  { date: '2026-03-21', revenue: 2200, appointments: 12 },
];

const PATIENT_DEMOGRAPHICS: PatientDemographics[] = [
  { ageGroup: '0-17', male: 45, female: 52 },
  { ageGroup: '18-29', male: 68, female: 82 },
  { ageGroup: '30-44', male: 95, female: 110 },
  { ageGroup: '45-59', male: 72, female: 88 },
  { ageGroup: '60+', male: 45, female: 62 },
];

const TOP_SERVICES: ServiceStats[] = [
  { name: 'Consulta General', count: 245, revenue: 49000, percentage: 28 },
  { name: 'Consulta Especializada', count: 128, revenue: 38400, percentage: 22 },
  { name: 'Laboratorio', count: 186, revenue: 27900, percentage: 16 },
  { name: 'Cardiología', count: 85, revenue: 25500, percentage: 15 },
  { name: 'Ultrasonido', count: 42, revenue: 16800, percentage: 10 },
  { name: 'Rayos X', count: 38, revenue: 7600, percentage: 4 },
  { name: 'Otros', count: 95, revenue: 8550, percentage: 5 },
];

const OUTSTANDING_INVOICES: OutstandingInvoice[] = [
  { invoiceNumber: 'INV-2026-003', patientName: 'Ana Martínez', date: '2026-03-15', dueDate: '2026-03-25', amount: 207, daysOverdue: 0 },
  { invoiceNumber: 'INV-2026-006', patientName: 'Pedro Ramírez', date: '2026-03-10', dueDate: '2026-03-20', amount: 450, daysOverdue: 1 },
  { invoiceNumber: 'INV-2026-008', patientName: 'Carmen López', date: '2026-03-05', dueDate: '2026-03-15', amount: 320, daysOverdue: 6 },
  { invoiceNumber: 'INV-2026-010', patientName: 'Roberto Díaz', date: '2026-02-28', dueDate: '2026-03-10', amount: 580, daysOverdue: 11 },
  { invoiceNumber: 'INV-2026-012', patientName: 'Lucía Morales', date: '2026-02-20', dueDate: '2026-03-02', amount: 275, daysOverdue: 19 },
];

const APPOINTMENT_STATS = {
  total: 312,
  completed: 245,
  cancelled: 28,
  noShow: 18,
  pending: 21,
  avgWaitTime: 12,
  avgDuration: 28,
};

// Revenue Chart Component
function RevenueChart({ data, period }: { data: RevenueData[]; period: 'daily' | 'weekly' | 'monthly' }) {
  const maxValue = Math.max(...data.map(d => d.revenue));
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const avgRevenue = totalRevenue / data.length;

  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Ingresos</h3>
          <p className="text-sm text-[var(--text-mid)]">
            Total: <span className="text-[var(--nexus-gold)] font-bold">TT${totalRevenue.toLocaleString()}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[var(--text-mid)]">Promedio {period === 'daily' ? 'diario' : period === 'weekly' ? 'semanal' : 'mensual'}</p>
          <p className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            TT${avgRevenue.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end gap-1">
        {data.map((item, index) => {
          const height = (item.revenue / maxValue) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div className="w-full relative flex-1 flex items-end">
                <div 
                  className="w-full bg-gradient-to-t from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ height: `${height}%` }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="glass-card px-2 py-1 text-xs whitespace-nowrap">
                    <p className="text-[var(--text-primary)]">TT${item.revenue.toLocaleString()}</p>
                    <p className="text-[var(--text-dim)]">{item.appointments} citas</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-[var(--text-dim)]">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

// Patient Demographics Chart
function DemographicsChart({ data }: { data: PatientDemographics[] }) {
  const maxValue = Math.max(...data.map(d => d.male + d.female));

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Demografía de Pacientes</h3>
      
      <div className="space-y-4">
        {data.map((group, index) => {
          const total = group.male + group.female;
          const malePercent = (group.male / total) * 100;
          const femalePercent = (group.female / total) * 100;
          
          return (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-primary)]">{group.ageGroup} años</span>
                <span className="text-[var(--text-mid)]">{total} pacientes</span>
              </div>
              <div className="flex h-4 rounded-full overflow-hidden">
                <div 
                  className="bg-[var(--nexus-violet)] transition-all"
                  style={{ width: `${malePercent}%` }}
                />
                <div 
                  className="bg-[var(--nexus-fuchsia)] transition-all"
                  style={{ width: `${femalePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--text-dim)] mt-0.5">
                <span>M: {group.male}</span>
                <span>F: {group.female}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 pt-4 border-t border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[var(--nexus-violet)]" />
          <span className="text-xs text-[var(--text-mid)]">Masculino</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[var(--nexus-fuchsia)]" />
          <span className="text-xs text-[var(--text-mid)]">Femenino</span>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-[var(--glass)]">
        <p className="text-xs text-[var(--text-mid)]">Total Pacientes</p>
        <p className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
          {data.reduce((sum, d) => sum + d.male + d.female, 0)}
        </p>
      </div>
    </div>
  );
}

// Top Services Component
function TopServicesChart({ services }: { services: ServiceStats[] }) {
  const totalRevenue = services.reduce((sum, s) => sum + s.revenue, 0);

  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Servicios Populares</h3>
        <p className="text-sm text-[var(--text-mid)]">Top {services.length}</p>
      </div>

      {/* Pie-like visualization */}
      <div className="flex gap-4 mb-6">
        <div className="w-24 h-24 rounded-full relative" style={{
          background: `conic-gradient(
            var(--nexus-violet) 0% ${services[0].percentage}%,
            var(--nexus-fuchsia) ${services[0].percentage}% ${services[0].percentage + services[1].percentage}%,
            var(--nexus-gold) ${services[0].percentage + services[1].percentage}% ${services[0].percentage + services[1].percentage + services[2].percentage}%,
            var(--nexus-aqua) ${services[0].percentage + services[1].percentage + services[2].percentage}% ${services[0].percentage + services[1].percentage + services[2].percentage + services[3].percentage}%,
            var(--nexus-blue) ${services[0].percentage + services[1].percentage + services[2].percentage + services[3].percentage}% 100%
          )`
        }}>
          <div className="absolute inset-2 rounded-full bg-[var(--ink-card)] flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-[var(--text-mid)]">Total</p>
              <p className="text-sm font-bold text-[var(--nexus-gold)]">TT${(totalRevenue / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {services.slice(0, 5).map((service, index) => {
            const colors = ['var(--nexus-violet)', 'var(--nexus-fuchsia)', 'var(--nexus-gold)', 'var(--nexus-aqua)', 'var(--nexus-blue)'];
            return (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[index] }} />
                <span className="text-xs text-[var(--text-mid)] flex-1 truncate">{service.name}</span>
                <span className="text-xs font-mono text-[var(--text-primary)]">{service.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {services.map((service, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[var(--glass)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[var(--nexus-violet)]/20 flex items-center justify-center text-sm text-[var(--nexus-violet-lite)]">
                {index + 1}
              </div>
              <div>
                <p className="text-sm text-[var(--text-primary)]">{service.name}</p>
                <p className="text-xs text-[var(--text-mid)]">{service.count} procedimientos</p>
              </div>
            </div>
            <p className="font-mono text-[var(--nexus-gold)]">TT${service.revenue.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Outstanding Invoices Component
function OutstandingInvoices({ invoices }: { invoices: OutstandingInvoice[] }) {
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  const getOverdueStatus = (days: number) => {
    if (days === 0) return { label: 'Por vencer', color: 'bg-[var(--nexus-aqua)]/10 text-[var(--nexus-aqua)]' };
    if (days <= 7) return { label: `${days} día${days > 1 ? 's' : ''}`, color: 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]' };
    return { label: `${days} días`, color: 'bg-[var(--error)]/10 text-[var(--error)]' };
  };

  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Facturas Pendientes</h3>
        <div className="text-right">
          <p className="text-xs text-[var(--text-mid)]">Total por Cobrar</p>
          <p className="text-lg font-bold text-[var(--error)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            TT${totalOutstanding.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {invoices.map((invoice, index) => {
          const status = getOverdueStatus(invoice.daysOverdue);
          return (
            <div key={index} className="p-3 rounded-lg bg-[var(--glass)]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-mono text-sm text-[var(--nexus-violet-lite)]">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-[var(--text-primary)]">{invoice.patientName}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-mid)]">
                <span>Vence: {invoice.dueDate}</span>
                <span className="font-mono text-[var(--nexus-gold)]">TT${invoice.amount}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Appointments Analytics Component
function AppointmentsAnalytics({ stats }: { stats: typeof APPOINTMENT_STATS }) {
  const completionRate = ((stats.completed / stats.total) * 100).toFixed(1);

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Análisis de Citas</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-[var(--glass)] text-center">
          <p className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {stats.total}
          </p>
          <p className="text-xs text-[var(--text-mid)]">Total Citas</p>
        </div>
        <div className="p-4 rounded-lg bg-[var(--success)]/10 text-center">
          <p className="text-3xl font-bold text-[var(--success)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {completionRate}%
          </p>
          <p className="text-xs text-[var(--text-mid)]">Tasa Completado</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--success)]/10">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[var(--success)]" />
            <span className="text-sm text-[var(--text-primary)]">Completadas</span>
          </div>
          <span className="font-mono text-[var(--success)]">{stats.completed}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--error)]/10">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-[var(--error)]" />
            <span className="text-sm text-[var(--text-primary)]">Canceladas</span>
          </div>
          <span className="font-mono text-[var(--error)]">{stats.cancelled}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nexus-gold)]/10">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[var(--nexus-gold)]" />
            <span className="text-sm text-[var(--text-primary)]">No Asistió</span>
          </div>
          <span className="font-mono text-[var(--nexus-gold)]">{stats.noShow}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nexus-aqua)]/10">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--nexus-aqua)]" />
            <span className="text-sm text-[var(--text-primary)]">Pendientes</span>
          </div>
          <span className="font-mono text-[var(--nexus-aqua)]">{stats.pending}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--glass-border)]">
        <div className="text-center">
          <p className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {stats.avgWaitTime} min
          </p>
          <p className="text-xs text-[var(--text-mid)]">Tiempo Espera Prom.</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {stats.avgDuration} min
          </p>
          <p className="text-xs text-[var(--text-mid)]">Duración Prom.</p>
        </div>
      </div>
    </div>
  );
}

// Summary Cards
function SummaryCards() {
  const cards = [
    { 
      label: 'Ingresos del Mes', 
      value: 'TT$52,800', 
      change: '+8.2%', 
      trend: 'up',
      icon: DollarSign,
      color: 'from-[var(--nexus-gold)] to-[#d97706]'
    },
    { 
      label: 'Nuevos Pacientes', 
      value: '48', 
      change: '+12', 
      trend: 'up',
      icon: Users,
      color: 'from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)]'
    },
    { 
      label: 'Citas Completadas', 
      value: '245', 
      change: '78.5%', 
      trend: 'up',
      icon: Calendar,
      color: 'from-[var(--nexus-aqua)] to-[var(--nexus-blue)]'
    },
    { 
      label: 'Tiempo Promedio', 
      value: '12 min', 
      change: '-3 min', 
      trend: 'down',
      icon: Activity,
      color: 'from-[var(--success)] to-[#059669]'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="glass-card p-4">
          <div className="flex items-start justify-between mb-2">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <span className={`flex items-center gap-1 text-xs ${card.trend === 'up' ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
              {card.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {card.change}
            </span>
          </div>
          <p className="text-xs text-[var(--text-mid)]">{card.label}</p>
          <p className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// Export Functions
function ExportPanel() {
  const handleExport = (format: 'csv' | 'pdf') => {
    // In real app, this would generate and download the file
    console.log(`Exporting reports as ${format.toUpperCase()}...`);
    alert(`Exportando reportes en formato ${format.toUpperCase()}...`);
  };

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FileText className="w-5 h-5 text-[var(--nexus-violet-lite)]" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Exportar Reportes</p>
            <p className="text-xs text-[var(--text-mid)]">Descarga reportes en CSV o PDF</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-1" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <Printer className="w-4 h-4 mr-1" />
            PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Reports Module
export function ReportsModule() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <ClinicLayout activeTab="settings">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reportes y Análisis</h1>
          <p className="text-[var(--text-mid)] text-sm">Visualiza el rendimiento de la clínica</p>
        </div>
        <div className="flex gap-2">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as 'daily' | 'weekly' | 'monthly')} className="w-auto">
            <TabsList className="glass-card">
              <TabsTrigger value="daily">Diario</TabsTrigger>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Export Panel */}
      <ExportPanel />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="glass-card">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          <TabsTrigger value="patients">Pacientes</TabsTrigger>
          <TabsTrigger value="appointments">Citas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <RevenueChart data={REVENUE_DATA} period={period} />
            <TopServicesChart services={TOP_SERVICES} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <DemographicsChart data={PATIENT_DEMOGRAPHICS} />
            <AppointmentsAnalytics stats={APPOINTMENT_STATS} />
            <OutstandingInvoices invoices={OUTSTANDING_INVOICES} />
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueChart data={REVENUE_DATA} period={period} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopServicesChart services={TOP_SERVICES} />
            <OutstandingInvoices invoices={OUTSTANDING_INVOICES} />
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DemographicsChart data={PATIENT_DEMOGRAPHICS} />
            <div className="glass-card p-4 md:p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Estadísticas de Pacientes</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[var(--glass)]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--text-mid)]">Total Pacientes</span>
                    <span className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>487</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass)]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--text-mid)]">Pacientes Activos</span>
                    <span className="text-2xl font-bold text-[var(--success)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>412</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass)]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--text-mid)]">Nuevos este mes</span>
                    <span className="text-2xl font-bold text-[var(--nexus-aqua)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>48</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass)]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--text-mid)]">Promedio visitas/paciente</span>
                    <span className="text-2xl font-bold text-[var(--nexus-gold)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>3.2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AppointmentsAnalytics stats={APPOINTMENT_STATS} />
            <div className="glass-card p-4 md:p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Tendencia de Citas</h3>
              <div className="h-48 flex items-end gap-1">
                {[45, 52, 48, 65, 58, 32, 18, 42, 55, 50, 72, 68, 35, 22, 48, 58, 62, 70, 65, 78, 38].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-[var(--nexus-aqua)] to-[var(--nexus-blue)] rounded-t opacity-80 hover:opacity-100 transition-opacity"
                      style={{ height: `${value}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-[var(--text-dim)]">
                <span>Mar 1</span>
                <span>Mar 21</span>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-[var(--glass)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-mid)]">Promedio diario</span>
                  <span className="font-mono text-[var(--text-primary)]">48.6 citas</span>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Horarios con Mayor Demanda</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { time: '09:00 - 10:00', count: 42, percent: 85 },
                { time: '10:00 - 11:00', count: 38, percent: 76 },
                { time: '11:00 - 12:00', count: 35, percent: 70 },
                { time: '14:00 - 15:00', count: 32, percent: 64 },
              ].map((slot, index) => (
                <div key={index} className="p-3 rounded-lg bg-[var(--glass)]">
                  <p className="text-sm text-[var(--text-primary)] mb-1">{slot.time}</p>
                  <div className="h-2 bg-[var(--nexus-violet)]/20 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-[var(--nexus-violet)] rounded-full" style={{ width: `${slot.percent}%` }} />
                  </div>
                  <p className="text-xs text-[var(--text-mid)]">{slot.count} citas</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ClinicLayout>
  );
}
