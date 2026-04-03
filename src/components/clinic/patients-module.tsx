'use client';

import React, { useState } from 'react';
import { ClinicLayout } from './clinic-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  MoreVertical,
  User,
  Filter
} from 'lucide-react';

// Demo patients data
const DEMO_PATIENTS = [
  { id: '1', patientNumber: 'PAT-001', firstName: 'María', lastName: 'González', phone: '+1 868 555-0001', email: 'maria@email.com', lastVisit: '2026-03-20', status: 'active' },
  { id: '2', patientNumber: 'PAT-002', firstName: 'Carlos', lastName: 'Rodríguez', phone: '+1 868 555-0002', email: 'carlos@email.com', lastVisit: '2026-03-19', status: 'active' },
  { id: '3', patientNumber: 'PAT-003', firstName: 'Ana', lastName: 'Martínez', phone: '+1 868 555-0003', email: 'ana@email.com', lastVisit: '2026-03-18', status: 'active' },
  { id: '4', patientNumber: 'PAT-004', firstName: 'José', lastName: 'Pérez', phone: '+1 868 555-0004', email: 'jose@email.com', lastVisit: '2026-03-15', status: 'inactive' },
  { id: '5', patientNumber: 'PAT-005', firstName: 'Laura', lastName: 'Sánchez', phone: '+1 868 555-0005', email: 'laura@email.com', lastVisit: '2026-03-10', status: 'active' },
];

export function PatientsModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const filteredPatients = DEMO_PATIENTS.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm) ||
    p.patientNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ClinicLayout activeTab="patients">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pacientes</h1>
          <p className="text-[var(--text-mid)] text-sm">Gestiona la información de tus pacientes</p>
        </div>
        <Button className="btn-gold" onClick={() => setShowNewPatientForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
          <Input
            placeholder="Buscar por nombre, teléfono o número de paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-[var(--text-mid)] text-xs">Total Pacientes</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_PATIENTS.length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-[var(--text-mid)] text-xs">Activos</p>
          <p className="text-2xl font-bold text-[var(--success)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_PATIENTS.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-[var(--text-mid)] text-xs">Nuevos este mes</p>
          <p className="text-2xl font-bold text-[var(--nexus-aqua)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            12
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-[var(--text-mid)] text-xs">Visitas este mes</p>
          <p className="text-2xl font-bold text-[var(--nexus-gold)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            48
          </p>
        </div>
      </div>

      {/* Patients Table/Cards */}
      <div className="glass-card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--glass-border)]">
                <th className="text-left p-4 text-sm font-medium text-[var(--text-mid)]">Paciente</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-mid)]">Contacto</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-mid)]">Nº Paciente</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-mid)]">Última Visita</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-mid)]">Estado</th>
                <th className="text-right p-4 text-sm font-medium text-[var(--text-mid)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr 
                  key={patient.id} 
                  className="border-b border-[var(--glass-border)] last:border-0 hover:bg-[var(--glass)] transition-colors cursor-pointer"
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-[var(--text-primary)] font-medium">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-xs text-[var(--text-dim)]">{patient.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
                      <Phone className="w-4 h-4" />
                      {patient.phone}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-[var(--nexus-violet-lite)] font-mono">{patient.patientNumber}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
                      <Calendar className="w-4 h-4" />
                      {patient.lastVisit}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      patient.status === 'active' 
                        ? 'bg-[var(--success)]/10 text-[var(--success)]' 
                        : 'bg-[var(--text-dim)]/10 text-[var(--text-dim)]'
                    }`}>
                      {patient.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 rounded hover:bg-[var(--glass)] transition-colors">
                      <MoreVertical className="w-4 h-4 text-[var(--text-mid)]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {filteredPatients.map((patient) => (
            <div 
              key={patient.id} 
              className="p-4 rounded-lg bg-[var(--glass)] cursor-pointer"
              onClick={() => setSelectedPatient(patient.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center">
                  <span className="text-white font-bold">
                    {patient.firstName[0]}{patient.lastName[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[var(--text-primary)] font-medium">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-xs text-[var(--nexus-violet-lite)] font-mono">{patient.patientNumber}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  patient.status === 'active' 
                    ? 'bg-[var(--success)]/10 text-[var(--success)]' 
                    : 'bg-[var(--text-dim)]/10 text-[var(--text-dim)]'
                }`}>
                  {patient.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-mid)]">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {patient.phone}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {patient.lastVisit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Patient Modal */}
      {showNewPatientForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Nuevo Paciente</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Nombre</Label>
                  <Input placeholder="Nombre" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Apellido</Label>
                  <Input placeholder="Apellido" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[var(--text-mid)]">Teléfono *</Label>
                <Input placeholder="+1 868 XXX-XXXX" />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[var(--text-mid)]">Email</Label>
                <Input type="email" placeholder="correo@ejemplo.com" />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[var(--text-mid)]">Fecha de Nacimiento</Label>
                <Input type="date" />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[var(--text-mid)]">Género</Label>
                <select className="w-full h-10 px-3 rounded-lg">
                  <option value="">Seleccionar</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[var(--text-mid)]">Dirección</Label>
                <Input placeholder="Dirección completa" />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[var(--text-mid)]">Notas / Alergias</Label>
                <Input placeholder="Alergias conocidas, notas importantes..." />
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowNewPatientForm(false)}
              >
                Cancelar
              </Button>
              <Button className="flex-1 btn-gold" onClick={() => setShowNewPatientForm(false)}>
                Guardar Paciente
              </Button>
            </div>
          </div>
        </div>
      )}
    </ClinicLayout>
  );
}
