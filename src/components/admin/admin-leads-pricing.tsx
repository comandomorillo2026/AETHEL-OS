'use client';

import React, { useState } from 'react';
import { AdminLayout } from './admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar,
  Mail,
  Phone,
  Building2,
  Tag,
  Settings,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

// Demo data
const DEMO_LEADS = [
  { id: '1', businessName: 'Clínica San Fernando', ownerName: 'Dr. Martínez', email: 'drmartinez@email.com', phone: '+1 868 555-0101', industry: 'clinic', plan: 'growth', status: 'new', date: '2026-03-25' },
  { id: '2', businessName: 'Centro Médico Norte', ownerName: 'Dra. Rodríguez', email: 'drodriguez@email.com', phone: '+1 868 555-0102', industry: 'clinic', plan: 'premium', status: 'contacted', date: '2026-03-24' },
  { id: '3', businessName: 'Spa Bella Vista', ownerName: 'Ana Gómez', email: 'ana@bellavista.tt', phone: '+1 868 555-0103', industry: 'salon', plan: 'starter', status: 'qualified', date: '2026-03-23' },
  { id: '4', businessName: 'Panadería El Sol', ownerName: 'Carlos Pérez', email: 'carlos@elsol.tt', phone: '+1 868 555-0104', industry: 'bakery', plan: 'growth', status: 'converted', date: '2026-03-22' },
];

const DEMO_PRICES = {
  starter: { monthly: 500, annual: 400, activation: 1250 },
  growth: { monthly: 1200, annual: 960, activation: 1250 },
  premium: { monthly: 2500, annual: 2000, activation: 1250 },
};

export function AdminLeadsModule() {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const statusColors: Record<string, string> = {
    new: 'bg-[var(--nexus-aqua)]/10 text-[var(--nexus-aqua)]',
    contacted: 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]',
    qualified: 'bg-[var(--nexus-violet)]/10 text-[var(--nexus-violet-lite)]',
    converted: 'bg-[var(--success)]/10 text-[var(--success)]',
    lost: 'bg-[var(--error)]/10 text-[var(--error)]',
  };

  const statusLabels: Record<string, string> = {
    new: 'Nuevo',
    contacted: 'Contactado',
    qualified: 'Calificado',
    converted: 'Convertido',
    lost: 'Perdido',
  };

  const filteredLeads = statusFilter === 'all' 
    ? DEMO_LEADS 
    : DEMO_LEADS.filter(l => l.status === statusFilter);

  return (
    <AdminLayout activeTab="orders">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Leads del Portal</h1>
          <p className="text-[var(--text-mid)] text-sm">Personas que llenaron el formulario de registro</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="glass-card p-4 cursor-pointer hover:border-[var(--nexus-aqua)]/50 transition-colors" onClick={() => setStatusFilter('all')}>
          <p className="text-[var(--text-mid)] text-xs">Total</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_LEADS.length}
          </p>
        </div>
        <div className="glass-card p-4 cursor-pointer hover:border-[var(--nexus-aqua)]/50 transition-colors" onClick={() => setStatusFilter('new')}>
          <p className="text-[var(--text-mid)] text-xs">Nuevos</p>
          <p className="text-2xl font-bold text-[var(--nexus-aqua)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_LEADS.filter(l => l.status === 'new').length}
          </p>
        </div>
        <div className="glass-card p-4 cursor-pointer hover:border-[var(--nexus-gold)]/50 transition-colors" onClick={() => setStatusFilter('contacted')}>
          <p className="text-[var(--text-mid)] text-xs">Contactados</p>
          <p className="text-2xl font-bold text-[var(--nexus-gold)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_LEADS.filter(l => l.status === 'contacted').length}
          </p>
        </div>
        <div className="glass-card p-4 cursor-pointer hover:border-[var(--success)]/50 transition-colors" onClick={() => setStatusFilter('converted')}>
          <p className="text-[var(--text-mid)] text-xs">Convertidos</p>
          <p className="text-2xl font-bold text-[var(--success)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_LEADS.filter(l => l.status === 'converted').length}
          </p>
        </div>
        <div className="glass-card p-4 cursor-pointer hover:border-[var(--error)]/50 transition-colors" onClick={() => setStatusFilter('lost')}>
          <p className="text-[var(--text-mid)] text-xs">Perdidos</p>
          <p className="text-2xl font-bold text-[var(--error)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_LEADS.filter(l => l.status === 'lost').length}
          </p>
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--glass-border)]">
                <th className="text-left p-4 text-sm font-medium text-[var(--text-mid)]">Negocio</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-mid)]">Contacto</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-mid)]">Plan</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-mid)]">Estado</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-mid)]">Fecha</th>
                <th className="text-right p-4 text-sm font-medium text-[var(--text-mid)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="border-b border-[var(--glass-border)] last:border-0 hover:bg-[var(--glass)] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[var(--text-primary)] font-medium">{lead.businessName}</p>
                        <p className="text-xs text-[var(--text-dim)]">{lead.ownerName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-[var(--nexus-violet-lite)] capitalize">{lead.plan}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${statusColors[lead.status]}`}>
                      {statusLabels[lead.status]}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-[var(--text-mid)]">{lead.date}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Contactar
                      </Button>
                      <Button size="sm" className="btn-gold">
                        Convertir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export function AdminPricingModule() {
  const [prices, setPrices] = useState(DEMO_PRICES);

  return (
    <AdminLayout activeTab="settings">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Configuración de Precios</h1>
        <p className="text-[var(--text-mid)] text-sm">Ajusta los precios de los planes desde tu Torre de Control</p>
      </div>

      {/* Plans Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(prices).map(([plan, pricing]) => (
          <div key={plan} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)] uppercase">{plan}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                plan === 'growth' ? 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]' : 'bg-[var(--glass)] text-[var(--text-mid)]'
              }`}>
                {plan === 'growth' ? 'Popular' : plan === 'premium' ? 'Enterprise' : 'Básico'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[var(--text-mid)] text-sm">Precio Mensual (TT$)</Label>
                <Input
                  type="number"
                  value={pricing.monthly}
                  onChange={(e) => setPrices(prev => ({
                    ...prev,
                    [plan]: { ...prev[plan as keyof typeof prev], monthly: parseFloat(e.target.value) }
                  }))}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--text-mid)] text-sm">Precio Anual (TT$)</Label>
                <Input
                  type="number"
                  value={pricing.annual}
                  onChange={(e) => setPrices(prev => ({
                    ...prev,
                    [plan]: { ...prev[plan as keyof typeof prev], annual: parseFloat(e.target.value) }
                  }))}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--text-mid)] text-sm">Activación (TT$)</Label>
                <Input
                  type="number"
                  value={pricing.activation}
                  onChange={(e) => setPrices(prev => ({
                    ...prev,
                    [plan]: { ...prev[plan as keyof typeof prev], activation: parseFloat(e.target.value) }
                  }))}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
              <p className="text-xs text-[var(--text-dim)]">
                USD aproximado: ${(pricing.monthly / 6.75).toFixed(0)}/mes
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Global Settings */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Configuración Global</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Moneda Principal</Label>
            <select className="w-full h-10 px-3 rounded-lg">
              <option value="TTD">TTD - Dólar Trinitense</option>
              <option value="USD">USD - Dólar Americano</option>
              <option value="GYD">GYD - Dólar Guyanés</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Tasa de Cambio TTD/USD</Label>
            <Input
              type="number"
              defaultValue="6.75"
              step="0.01"
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Descuento Anual (%)</Label>
            <Input
              type="number"
              defaultValue="20"
              className="font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button className="btn-gold">
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Coupons */}
      <div className="glass-card p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Cupones de Descuento</h3>
          <Button className="btn-nexus">
            <Tag className="w-4 h-4 mr-2" />
            Nuevo Cupón
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--glass)]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--nexus-gold)]/20 flex items-center justify-center">
                <Tag className="w-5 h-5 text-[var(--nexus-gold)]" />
              </div>
              <div>
                <p className="font-mono font-bold text-[var(--nexus-gold)]">EARLYBIRD</p>
                <p className="text-xs text-[var(--text-mid)]">TT$250 de descuento en activación</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-[var(--text-mid)]">12/50 usados</p>
              <span className="px-2 py-1 rounded text-xs bg-[var(--success)]/10 text-[var(--success)]">
                Activo
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
