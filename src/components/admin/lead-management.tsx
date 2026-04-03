'use client';

import React, { useState } from 'react';
import { AdminLayout } from './admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Mail,
  Phone,
  Building2,
  Calendar,
  MessageSquare,
  UserPlus,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  MoreVertical,
  Send,
  Bell,
  BellOff,
  Edit3,
  Trash2,
  User,
  Star,
  FileText,
  Plus,
  ChevronRight,
  AlertCircle,
  Sparkles
} from 'lucide-react';

// Lead status definitions
const LEAD_STATUSES = {
  new: { label: 'Nuevo', color: 'bg-[var(--nexus-aqua)]/10 text-[var(--nexus-aqua)]', icon: Sparkles },
  contacted: { label: 'Contactado', color: 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]', icon: Mail },
  qualified: { label: 'Calificado', color: 'bg-[var(--nexus-violet)]/10 text-[var(--nexus-violet-lite)]', icon: CheckCircle },
  converted: { label: 'Convertido', color: 'bg-[var(--success)]/10 text-[var(--success)]', icon: Star },
  lost: { label: 'Perdido', color: 'bg-[var(--error)]/10 text-[var(--error)]', icon: XCircle },
};

// Sales representatives
const SALES_REPS = [
  { id: '1', name: 'María González', email: 'maria@nexusos.tt', leads: 8 },
  { id: '2', name: 'Carlos Rodríguez', email: 'carlos@nexusos.tt', leads: 5 },
  { id: '3', name: 'Ana Martínez', email: 'ana@nexusos.tt', leads: 3 },
];

// Demo leads data
const DEMO_LEADS = [
  { 
    id: '1', 
    businessName: 'Clínica San Fernando', 
    ownerName: 'Dr. Roberto Martínez', 
    email: 'drmartinez@clinicaf.tt', 
    phone: '+1 868 555-0101', 
    industry: 'clinic', 
    plan: 'growth', 
    status: 'new', 
    date: '2026-03-25',
    source: 'Portal Web',
    notes: 'Interesado en módulo de citas y facturación',
    assignedTo: null,
    emailNotifications: true,
    followUps: [
      { date: '2026-03-26', note: 'Llamar para agendar demo' }
    ]
  },
  { 
    id: '2', 
    businessName: 'Centro Médico Norte', 
    ownerName: 'Dra. Carmen Rodríguez', 
    email: 'drodriguez@centromedico.tt', 
    phone: '+1 868 555-0102', 
    industry: 'clinic', 
    plan: 'premium', 
    status: 'contacted', 
    date: '2026-03-24',
    source: 'Referido',
    notes: 'Clínica grande con múltiples ubicaciones',
    assignedTo: '1',
    emailNotifications: true,
    followUps: [
      { date: '2026-03-24', note: 'Email enviado con información' },
      { date: '2026-03-25', note: 'Llamada programada para el 27/03' }
    ]
  },
  { 
    id: '3', 
    businessName: 'Spa Bella Vista', 
    ownerName: 'Ana Gómez', 
    email: 'ana@bellavista.tt', 
    phone: '+1 868 555-0103', 
    industry: 'salon', 
    plan: 'starter', 
    status: 'qualified', 
    date: '2026-03-23',
    source: 'Redes Sociales',
    notes: 'Negocio pequeño, listo para comenzar',
    assignedTo: '2',
    emailNotifications: true,
    followUps: [
      { date: '2026-03-23', note: 'Demo completada - muy interesado' },
      { date: '2026-03-24', note: 'Enviada propuesta comercial' }
    ]
  },
  { 
    id: '4', 
    businessName: 'Panadería El Sol', 
    ownerName: 'Carlos Pérez', 
    email: 'carlos@elsol.tt', 
    phone: '+1 868 555-0104', 
    industry: 'bakery', 
    plan: 'growth', 
    status: 'converted', 
    date: '2026-03-22',
    source: 'Portal Web',
    notes: 'Convertido exitosamente',
    assignedTo: '1',
    emailNotifications: false,
    followUps: [
      { date: '2026-03-22', note: '¡Convertido a inquilino!' }
    ]
  },
  { 
    id: '5', 
    businessName: 'Restaurante La Mesa', 
    ownerName: 'Pedro Hernández', 
    email: 'pedro@lamesa.tt', 
    phone: '+1 868 555-0105', 
    industry: 'restaurant', 
    plan: 'growth', 
    status: 'lost', 
    date: '2026-03-20',
    source: 'Google Ads',
    notes: 'Decidió no continuar por presupuesto',
    assignedTo: '3',
    emailNotifications: false,
    followUps: [
      { date: '2026-03-20', note: 'No interesado por ahora' },
      { date: '2026-03-21', note: 'Recontactar en 6 meses' }
    ]
  },
];

// Industry labels
const INDUSTRY_LABELS: Record<string, string> = {
  clinic: 'Clínica',
  salon: 'Salón',
  bakery: 'Panadería',
  restaurant: 'Restaurante',
  retail: 'Retail',
  other: 'Otro'
};

// Plan labels
const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  growth: 'Growth',
  premium: 'Premium'
};

export function LeadManagement() {
  const [leads, setLeads] = useState(DEMO_LEADS);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      lead.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get selected lead details
  const selectedLeadData = leads.find(l => l.id === selectedLead);

  // Handle status change
  const handleStatusChange = (leadId: string, newStatus: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  // Handle assign to rep
  const handleAssign = (leadId: string, repId: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, assignedTo: repId } : lead
    ));
  };

  // Handle add note
  const handleAddNote = () => {
    if (selectedLead && newNote.trim()) {
      setLeads(prev => prev.map(lead => 
        lead.id === selectedLead ? {
          ...lead,
          followUps: [...lead.followUps, { date: new Date().toISOString().split('T')[0], note: newNote }]
        } : lead
      ));
      setNewNote('');
    }
  };

  // Handle toggle notifications
  const handleToggleNotifications = (leadId: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, emailNotifications: !lead.emailNotifications } : lead
    ));
  };

  // Stats calculation
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
    lost: leads.filter(l => l.status === 'lost').length,
  };

  return (
    <AdminLayout activeTab="orders">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Gestión de Leads</h1>
          <p className="text-[var(--text-mid)] text-sm">Administra leads del portal de ventas</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar leads..."
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`glass-card p-4 text-left transition-all ${
            statusFilter === 'all' ? 'border-[var(--nexus-violet)] ring-1 ring-[var(--nexus-violet)]/50' : ''
          }`}
        >
          <p className="text-[var(--text-mid)] text-xs">Total</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {stats.total}
          </p>
        </button>
        {Object.entries(LEAD_STATUSES).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`glass-card p-4 text-left transition-all ${
                statusFilter === status ? 'border-[var(--nexus-violet)] ring-1 ring-[var(--nexus-violet)]/50' : ''
              }`}
            >
              <p className="text-[var(--text-mid)] text-xs">{config.label}</p>
              <p className={`text-2xl font-bold ${config.color.split(' ')[1]}`} style={{ fontFamily: 'var(--font-dm-mono)' }}>
                {stats[status as keyof typeof stats]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads List */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-[var(--glass-border)]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Leads ({filteredLeads.length})
                </h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-[var(--glass-border)]">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[600px]">
              <div className="divide-y divide-[var(--glass-border)]">
                {filteredLeads.map((lead) => {
                  const StatusIcon = LEAD_STATUSES[lead.status].icon;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead.id)}
                      className={`p-4 cursor-pointer transition-all hover:bg-[var(--glass)] ${
                        selectedLead === lead.id ? 'bg-[var(--nexus-violet)]/10 border-l-2 border-[var(--nexus-violet)]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[var(--text-primary)] font-medium truncate">{lead.businessName}</p>
                              <span className={`px-2 py-0.5 rounded text-xs ${LEAD_STATUSES[lead.status].color}`}>
                                {LEAD_STATUSES[lead.status].label}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--text-dim)]">{lead.ownerName}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-mid)]">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {lead.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {lead.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="outline" className="border-[var(--glass-border)]">
                            {PLAN_LABELS[lead.plan]}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-[var(--text-dim)]" />
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 mt-3 ml-15">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(lead.id, lead.status === 'new' ? 'contacted' : 
                              lead.status === 'contacted' ? 'qualified' : 
                              lead.status === 'qualified' ? 'converted' : lead.status);
                          }}
                        >
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Avanzar
                        </Button>
                        {lead.status !== 'converted' && lead.status !== 'lost' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-[var(--success)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(lead.id, 'converted');
                            }}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Convertir
                          </Button>
                        )}
                        {lead.assignedTo && (
                          <span className="text-xs text-[var(--text-dim)] ml-2">
                            Asignado a: {SALES_REPS.find(r => r.id === lead.assignedTo)?.name}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Lead Details Panel */}
        <div className="lg:col-span-1">
          {selectedLeadData ? (
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-[var(--glass-border)] bg-gradient-to-r from-[var(--nexus-violet)]/10 to-[var(--nexus-fuchsia)]/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[var(--text-primary)] font-semibold">{selectedLeadData.businessName}</h3>
                      <p className="text-xs text-[var(--text-mid)]">{selectedLeadData.ownerName}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[550px]">
                <div className="p-4 space-y-4">
                  {/* Status Workflow */}
                  <div>
                    <Label className="text-[var(--text-mid)] text-sm mb-3 block">Estado del Lead</Label>
                    <div className="flex items-center gap-1">
                      {Object.entries(LEAD_STATUSES).map(([status, config], index) => {
                        const isActive = Object.keys(LEAD_STATUSES).indexOf(selectedLeadData.status) >= index;
                        const Icon = config.icon;
                        return (
                          <React.Fragment key={status}>
                            <button
                              onClick={() => handleStatusChange(selectedLeadData.id, status)}
                              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                                selectedLeadData.status === status 
                                  ? 'bg-[var(--nexus-violet)]/20 ring-1 ring-[var(--nexus-violet)]' 
                                  : isActive ? 'bg-[var(--glass)]' : 'opacity-50'
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${config.color.split(' ')[1]}`} />
                              <span className="text-[10px] text-[var(--text-dim)] mt-1">{config.label}</span>
                            </button>
                            {index < Object.entries(LEAD_STATUSES).length - 1 && (
                              <ChevronRight className="w-3 h-3 text-[var(--text-dim)]" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <Label className="text-[var(--text-mid)] text-sm">Contacto</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 rounded bg-[var(--glass)]">
                        <Mail className="w-4 h-4 text-[var(--text-dim)]" />
                        <span className="text-sm text-[var(--text-primary)]">{selectedLeadData.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded bg-[var(--glass)]">
                        <Phone className="w-4 h-4 text-[var(--text-dim)]" />
                        <span className="text-sm text-[var(--text-primary)]">{selectedLeadData.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-[var(--glass)]">
                      <p className="text-xs text-[var(--text-dim)]">Industria</p>
                      <p className="text-sm text-[var(--text-primary)]">{INDUSTRY_LABELS[selectedLeadData.industry]}</p>
                    </div>
                    <div className="p-3 rounded bg-[var(--glass)]">
                      <p className="text-xs text-[var(--text-dim)]">Plan Interesado</p>
                      <p className="text-sm text-[var(--nexus-violet-lite)]">{PLAN_LABELS[selectedLeadData.plan]}</p>
                    </div>
                    <div className="p-3 rounded bg-[var(--glass)]">
                      <p className="text-xs text-[var(--text-dim)]">Fuente</p>
                      <p className="text-sm text-[var(--text-primary)]">{selectedLeadData.source}</p>
                    </div>
                    <div className="p-3 rounded bg-[var(--glass)]">
                      <p className="text-xs text-[var(--text-dim)]">Fecha</p>
                      <p className="text-sm text-[var(--text-primary)]">{selectedLeadData.date}</p>
                    </div>
                  </div>

                  {/* Assign to Sales Rep */}
                  <div>
                    <Label className="text-[var(--text-mid)] text-sm mb-2 block">Asignar a Vendedor</Label>
                    <select
                      value={selectedLeadData.assignedTo || ''}
                      onChange={(e) => handleAssign(selectedLeadData.id, e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-[var(--obsidian-3)] border border-[var(--glass-border)] text-[var(--text-primary)]"
                    >
                      <option value="">Sin asignar</option>
                      {SALES_REPS.map((rep) => (
                        <option key={rep.id} value={rep.id}>
                          {rep.name} ({rep.leads} leads)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label className="text-[var(--text-mid)] text-sm mb-2 block">Notas</Label>
                    <p className="text-sm text-[var(--text-primary)] p-3 rounded bg-[var(--glass)]">
                      {selectedLeadData.notes}
                    </p>
                  </div>

                  {/* Follow-ups */}
                  <div>
                    <Label className="text-[var(--text-mid)] text-sm mb-3 block">Seguimientos</Label>
                    <div className="space-y-2 mb-3">
                      {selectedLeadData.followUps.map((followUp, index) => (
                        <div key={index} className="flex gap-3 p-2 rounded bg-[var(--glass)]">
                          <div className="w-8 h-8 rounded-full bg-[var(--nexus-violet)]/20 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 text-[var(--nexus-violet-lite)]" />
                          </div>
                          <div>
                            <p className="text-xs text-[var(--text-dim)]">{followUp.date}</p>
                            <p className="text-sm text-[var(--text-primary)]">{followUp.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Agregar nota..."
                        className="flex-1"
                      />
                      <Button onClick={handleAddNote} size="sm" className="btn-nexus">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-3 rounded bg-[var(--glass)]">
                    <div className="flex items-center gap-3">
                      {selectedLeadData.emailNotifications ? (
                        <Bell className="w-4 h-4 text-[var(--nexus-violet-lite)]" />
                      ) : (
                        <BellOff className="w-4 h-4 text-[var(--text-dim)]" />
                      )}
                      <div>
                        <p className="text-sm text-[var(--text-primary)]">Notificaciones Email</p>
                        <p className="text-xs text-[var(--text-dim)]">
                          {selectedLeadData.emailNotifications ? 'Activadas' : 'Desactivadas'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={selectedLeadData.emailNotifications}
                      onCheckedChange={() => handleToggleNotifications(selectedLeadData.id)}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-[var(--glass-border)]">
                    <Button className="flex-1 btn-nexus">
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Email
                    </Button>
                    {selectedLeadData.status !== 'converted' && (
                      <Button className="flex-1 btn-gold">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Convertir
                      </Button>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="glass-card p-8 text-center h-[600px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[var(--glass)] flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[var(--text-dim)]" />
              </div>
              <h3 className="text-[var(--text-primary)] font-semibold mb-2">Selecciona un Lead</h3>
              <p className="text-[var(--text-mid)] text-sm">
                Haz clic en un lead para ver sus detalles
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
