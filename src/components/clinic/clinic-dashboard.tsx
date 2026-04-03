'use client';

import React from 'react';
import { TrendingUp, Users, Calendar, DollarSign, Clock, AlertCircle } from 'lucide-react';

function StatCard({ title, value, subtitle, icon: Icon, color }: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  color: 'violet' | 'gold' | 'aqua' | 'success';
}) {
  const colors = {
    violet: 'from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)]',
    gold: 'from-[var(--nexus-gold)] to-[#d97706]',
    aqua: 'from-[var(--nexus-aqua)] to-[var(--nexus-blue)]',
    success: 'from-[var(--success)] to-[#059669]',
  };

  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[var(--text-mid)] text-sm">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mt-1" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {value}
          </p>
          {subtitle && <p className="text-xs text-[var(--text-dim)] mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function TodayAppointments() {
  const appointments = [
    { time: '09:00', patient: 'María González', type: 'Consulta General', status: 'confirmed' },
    { time: '10:30', patient: 'Carlos Rodríguez', type: 'Seguimiento', status: 'confirmed' },
    { time: '11:00', patient: 'Ana Martínez', type: 'Laboratorio', status: 'pending' },
    { time: '14:00', patient: 'José Pérez', type: 'Consulta Especializada', status: 'confirmed' },
    { time: '15:30', patient: 'Laura Sánchez', type: 'Revisión', status: 'pending' },
  ];

  const statusColors: Record<string, string> = {
    confirmed: 'bg-[var(--success)]/10 text-[var(--success)]',
    pending: 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]',
    cancelled: 'bg-[var(--error)]/10 text-[var(--error)]',
  };

  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Citas de Hoy</h3>
        <span className="text-sm text-[var(--text-dim)]">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
      </div>
      <div className="space-y-3">
        {appointments.map((apt, index) => (
          <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--glass)] hover:bg-[var(--nexus-violet)]/5 transition-colors">
            <div className="w-14 text-center">
              <span className="text-sm font-mono text-[var(--nexus-violet-lite)]">{apt.time}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{apt.patient}</p>
              <p className="text-xs text-[var(--text-dim)]">{apt.type}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${statusColors[apt.status]}`}>
              {apt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentPatients() {
  const patients = [
    { name: 'María González', lastVisit: 'Hoy', avatar: 'MG' },
    { name: 'Carlos Rodríguez', lastVisit: 'Ayer', avatar: 'CR' },
    { name: 'Ana Martínez', lastVisit: 'Hace 3 días', avatar: 'AM' },
    { name: 'José Pérez', lastVisit: 'Hace 1 semana', avatar: 'JP' },
  ];

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Pacientes Recientes</h3>
      <div className="space-y-3">
        {patients.map((patient, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--glass)] transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center">
              <span className="text-white font-medium text-sm">{patient.avatar}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">{patient.name}</p>
              <p className="text-xs text-[var(--text-dim)]">Última visita: {patient.lastVisit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: 'Nueva Cita', icon: Calendar, color: 'nexus-violet' },
    { label: 'Nuevo Paciente', icon: Users, color: 'nexus-aqua' },
    { label: 'Nueva Factura', icon: DollarSign, color: 'nexus-gold' },
  ];

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Acciones Rápidas</h3>
      <div className="space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-[var(--glass)] hover:bg-[var(--nexus-violet)]/10 transition-colors text-left"
          >
            <div className={`w-10 h-10 rounded-lg bg-[var(--${action.color})]/20 flex items-center justify-center`}>
              <action.icon className="w-5 h-5 text-[var(--${action.color})]" />
            </div>
            <span className="text-[var(--text-primary)]">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Alerts() {
  return (
    <div className="glass-card p-4 border-l-4 border-l-[var(--nexus-gold)] bg-[var(--nexus-gold)]/5">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[var(--nexus-gold)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">Recordatorios</p>
          <ul className="text-xs text-[var(--text-mid)] mt-1 space-y-1">
            <li>• 3 pacientes con citas pendientes de confirmar</li>
            <li>• 2 facturas vencidas por cobrar</li>
            <li>• 1 resultado de laboratorio pendiente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ClinicDashboard() {
  return (
    <>
      {/* Alerts */}
      <div className="mb-6">
        <Alerts />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard
          title="Citas Hoy"
          value="12"
          subtitle="3 pendientes"
          icon={Calendar}
          color="violet"
        />
        <StatCard
          title="Pacientes"
          value="487"
          subtitle="+15 este mes"
          icon={Users}
          color="aqua"
        />
        <StatCard
          title="Ingresos Mes"
          value="TT$24,500"
          subtitle="+8% vs anterior"
          icon={DollarSign}
          color="gold"
        />
        <StatCard
          title="Tiempo Espera"
          value="12 min"
          subtitle="Promedio"
          icon={Clock}
          color="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <TodayAppointments />
        </div>
        <div className="space-y-4 md:space-y-6">
          <QuickActions />
          <RecentPatients />
        </div>
      </div>
    </>
  );
}
