'use client';

import React, { useState, useMemo } from 'react';
import { ClinicLayout } from './clinic-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Plus,
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  X,
  AlertCircle,
  Phone,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Users
} from 'lucide-react';

// Types
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  providerId: string;
  providerName: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  color: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

// Demo data
const DEMO_PROVIDERS: Provider[] = [
  { id: '1', name: 'Dr. Ana García', specialty: 'Medicina General', color: '#6C3FCE' },
  { id: '2', name: 'Dr. Carlos Mendez', specialty: 'Cardiología', color: '#C026D3' },
  { id: '3', name: 'Dra. Laura Torres', specialty: 'Pediatría', color: '#F0B429' },
];

const DEMO_APPOINTMENTS: Appointment[] = [
  { id: '1', patientId: 'PAT-001', patientName: 'María González', patientPhone: '+1 868 555-0001', providerId: '1', providerName: 'Dr. Ana García', date: '2026-03-20', time: '09:00', duration: 30, type: 'Consulta General', status: 'confirmed' },
  { id: '2', patientId: 'PAT-002', patientName: 'Carlos Rodríguez', patientPhone: '+1 868 555-0002', providerId: '1', providerName: 'Dr. Ana García', date: '2026-03-20', time: '10:30', duration: 30, type: 'Seguimiento', status: 'confirmed' },
  { id: '3', patientId: 'PAT-003', patientName: 'Ana Martínez', patientPhone: '+1 868 555-0003', providerId: '2', providerName: 'Dr. Carlos Mendez', date: '2026-03-20', time: '11:00', duration: 45, type: 'Cardiología', status: 'scheduled' },
  { id: '4', patientId: 'PAT-004', patientName: 'José Pérez', patientPhone: '+1 868 555-0004', providerId: '1', providerName: 'Dr. Ana García', date: '2026-03-20', time: '14:00', duration: 30, type: 'Consulta Especializada', status: 'confirmed' },
  { id: '5', patientId: 'PAT-005', patientName: 'Laura Sánchez', patientPhone: '+1 868 555-0005', providerId: '3', providerName: 'Dra. Laura Torres', date: '2026-03-20', time: '15:30', duration: 30, type: 'Revisión', status: 'scheduled' },
  { id: '6', patientId: 'PAT-001', patientName: 'María González', patientPhone: '+1 868 555-0001', providerId: '1', providerName: 'Dr. Ana García', date: '2026-03-21', time: '10:00', duration: 30, type: 'Laboratorio', status: 'completed' },
  { id: '7', patientId: 'PAT-002', patientName: 'Carlos Rodríguez', patientPhone: '+1 868 555-0002', providerId: '2', providerName: 'Dr. Carlos Mendez', date: '2026-03-19', time: '09:30', duration: 45, type: 'Cardiología', status: 'cancelled' },
  { id: '8', patientId: 'PAT-003', patientName: 'Ana Martínez', patientPhone: '+1 868 555-0003', providerId: '1', providerName: 'Dr. Ana García', date: '2026-03-18', time: '14:30', duration: 30, type: 'Consulta General', status: 'no-show' },
];

const APPOINTMENT_TYPES = [
  'Consulta General',
  'Consulta Especializada',
  'Seguimiento',
  'Laboratorio',
  'Cardiología',
  'Pediatría',
  'Revisión',
  'Urgencia'
];

const STATUS_CONFIG = {
  scheduled: { label: 'Programada', color: 'bg-[var(--nexus-aqua)]/10 text-[var(--nexus-aqua)]', icon: Clock },
  confirmed: { label: 'Confirmada', color: 'bg-[var(--success)]/10 text-[var(--success)]', icon: Check },
  completed: { label: 'Completada', color: 'bg-[var(--nexus-violet)]/10 text-[var(--nexus-violet-lite)]', icon: Check },
  cancelled: { label: 'Cancelada', color: 'bg-[var(--error)]/10 text-[var(--error)]', icon: X },
  'no-show': { label: 'No Asistió', color: 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]', icon: AlertCircle },
};

// Helper functions - Using deterministic availability pattern
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  // Deterministic pattern based on hour (no random - avoids hydration mismatch)
  const availabilityPattern = [true, true, false, true, false, true, true, false, true, true, false, true, false, true, true, true, false, true, true, false, true];
  let patternIndex = 0;
  for (let h = 8; h <= 18; h++) {
    slots.push({ time: `${h.toString().padStart(2, '0')}:00`, available: availabilityPattern[patternIndex++ % availabilityPattern.length] });
    if (h < 18) {
      slots.push({ time: `${h.toString().padStart(2, '0')}:30`, available: availabilityPattern[patternIndex++ % availabilityPattern.length] });
    }
  }
  return slots;
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

// Calendar Component
function CalendarView({ 
  appointments, 
  selectedDate, 
  onSelectDate, 
  selectedProvider,
  viewMode 
}: { 
  appointments: Appointment[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  selectedProvider: string;
  viewMode: 'month' | 'week' | 'day';
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(apt => 
      apt.date === date && 
      (selectedProvider === 'all' || apt.providerId === selectedProvider)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDate = (day: number) => {
    return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  const isSelected = (day: number) => {
    return selectedDate.getDate() === day &&
           selectedDate.getMonth() === month &&
           selectedDate.getFullYear() === year;
  };

  // Week view
  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  if (viewMode === 'week') {
    const weekDates = getWeekDates();
    const timeSlots = generateTimeSlots();

    return (
      <div className="glass-card p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigateMonth('prev')} className="p-2 rounded hover:bg-[var(--glass)]">
            <ChevronLeft className="w-5 h-5 text-[var(--text-mid)]" />
          </button>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {monthNames[month]} {year}
          </h3>
          <button onClick={() => navigateMonth('next')} className="p-2 rounded hover:bg-[var(--glass)]">
            <ChevronRight className="w-5 h-5 text-[var(--text-mid)]" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="p-2"></div>
              {weekDates.map((date, i) => (
                <div 
                  key={i} 
                  className={`p-2 text-center cursor-pointer rounded ${date.toDateString() === selectedDate.toDateString() ? 'bg-[var(--nexus-violet)]/20' : ''}`}
                  onClick={() => onSelectDate(date)}
                >
                  <div className="text-xs text-[var(--text-dim)]">{dayNames[date.getDay()]}</div>
                  <div className={`text-sm font-medium ${isToday(date.getDate()) && date.getMonth() === month ? 'text-[var(--nexus-gold)]' : 'text-[var(--text-primary)]'}`}>
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {timeSlots.map((slot, idx) => (
                <div key={idx} className="grid grid-cols-8 gap-1 border-b border-[var(--glass-border)]">
                  <div className="p-2 text-xs text-[var(--text-dim)] font-mono">{slot.time}</div>
                  {weekDates.map((date, i) => {
                    const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                    const apts = getAppointmentsForDate(dateStr).filter(a => a.time === slot.time);
                    return (
                      <div key={i} className="p-1 min-h-[40px] border-l border-[var(--glass-border)]">
                        {apts.map(apt => (
                          <div 
                            key={apt.id} 
                            className="text-xs p-1 rounded mb-1 truncate cursor-pointer"
                            style={{ backgroundColor: `${DEMO_PROVIDERS.find(p => p.id === apt.providerId)?.color}20`, color: DEMO_PROVIDERS.find(p => p.id === apt.providerId)?.color }}
                          >
                            {apt.patientName}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'day') {
    const dateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
    const dayAppointments = getAppointmentsForDate(dateStr);
    const timeSlots = generateTimeSlots();

    return (
      <div className="glass-card p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() - 1);
            onSelectDate(newDate);
          }} className="p-2 rounded hover:bg-[var(--glass)]">
            <ChevronLeft className="w-5 h-5 text-[var(--text-mid)]" />
          </button>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {dayNames[selectedDate.getDay()]}, {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
            </h3>
            <p className="text-sm text-[var(--text-mid)]">{dayAppointments.length} citas</p>
          </div>
          <button onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() + 1);
            onSelectDate(newDate);
          }} className="p-2 rounded hover:bg-[var(--glass)]">
            <ChevronRight className="w-5 h-5 text-[var(--text-mid)]" />
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto space-y-2">
          {timeSlots.map((slot, idx) => {
            const slotApts = dayAppointments.filter(a => a.time === slot.time);
            return (
              <div key={idx} className="flex gap-4">
                <div className="w-14 flex-shrink-0 py-2">
                  <span className="text-sm font-mono text-[var(--nexus-violet-lite)]">{slot.time}</span>
                </div>
                <div className="flex-1 min-h-[50px] border-l border-[var(--glass-border)] pl-4 py-1">
                  {slotApts.map(apt => (
                    <div 
                      key={apt.id} 
                      className="p-2 rounded-lg mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: `${DEMO_PROVIDERS.find(p => p.id === apt.providerId)?.color}15` }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{apt.patientName}</p>
                          <p className="text-xs text-[var(--text-mid)]">{apt.type} • {apt.providerName}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${STATUS_CONFIG[apt.status].color}`}>
                          {STATUS_CONFIG[apt.status].label}
                        </span>
                      </div>
                    </div>
                  ))}
                  {slotApts.length === 0 && slot.available && (
                    <div className="h-[40px] border border-dashed border-[var(--glass-border)] rounded-lg flex items-center justify-center text-xs text-[var(--text-dim)] hover:border-[var(--nexus-violet)] hover:text-[var(--nexus-violet-lite)] cursor-pointer transition-colors">
                      Disponible
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Month view (default)
  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigateMonth('prev')} className="p-2 rounded hover:bg-[var(--glass)]">
          <ChevronLeft className="w-5 h-5 text-[var(--text-mid)]" />
        </button>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {monthNames[month]} {year}
        </h3>
        <button onClick={() => navigateMonth('next')} className="p-2 rounded hover:bg-[var(--glass)]">
          <ChevronRight className="w-5 h-5 text-[var(--text-mid)]" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-[var(--text-mid)]">
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2 min-h-[80px]"></div>
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDate(day);
          const dayApts = getAppointmentsForDate(dateStr);
          
          return (
            <div
              key={day}
              onClick={() => onSelectDate(new Date(year, month, day))}
              className={`p-2 min-h-[80px] rounded-lg cursor-pointer transition-colors ${
                isSelected(day) 
                  ? 'bg-[var(--nexus-violet)]/20 border border-[var(--nexus-violet)]' 
                  : 'hover:bg-[var(--glass)]'
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday(day) ? 'text-[var(--nexus-gold)]' : 'text-[var(--text-primary)]'
              }`}>
                {day}
              </div>
              <div className="space-y-1">
                {dayApts.slice(0, 2).map(apt => (
                  <div 
                    key={apt.id}
                    className="text-xs p-1 rounded truncate"
                    style={{ backgroundColor: `${DEMO_PROVIDERS.find(p => p.id === apt.providerId)?.color}20` }}
                  >
                    {apt.time} {apt.patientName.split(' ')[0]}
                  </div>
                ))}
                {dayApts.length > 2 && (
                  <div className="text-xs text-[var(--text-dim)]">+{dayApts.length - 2} más</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Appointment List Component
function AppointmentList({ 
  appointments, 
  onSelectAppointment,
  statusFilter,
  setStatusFilter
}: { 
  appointments: Appointment[];
  onSelectAppointment: (apt: Appointment) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.providerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
          <Input
            placeholder="Buscar por paciente o proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg min-w-[150px]"
        >
          <option value="all">Todos los estados</option>
          <option value="scheduled">Programadas</option>
          <option value="confirmed">Confirmadas</option>
          <option value="completed">Completadas</option>
          <option value="cancelled">Canceladas</option>
          <option value="no-show">No asistió</option>
        </select>
      </div>

      <div className="max-h-[500px] overflow-y-auto space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-mid)]">
            No se encontraron citas
          </div>
        ) : (
          filteredAppointments.map(apt => {
            const StatusIcon = STATUS_CONFIG[apt.status].icon;
            return (
              <div
                key={apt.id}
                onClick={() => onSelectAppointment(apt)}
                className="p-4 rounded-lg bg-[var(--glass)] hover:bg-[var(--nexus-violet)]/5 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {apt.patientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)] font-medium">{apt.patientName}</p>
                      <p className="text-xs text-[var(--text-mid)]">{apt.type}</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${STATUS_CONFIG[apt.status].color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {STATUS_CONFIG[apt.status].label}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[var(--text-mid)]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {apt.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {apt.time} ({apt.duration} min)
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {apt.providerName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {apt.patientPhone}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Appointment Form Component
function AppointmentForm({ 
  appointment, 
  onSave, 
  onCancel 
}: { 
  appointment?: Appointment | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    patientName: appointment?.patientName || '',
    patientPhone: appointment?.patientPhone || '',
    providerId: appointment?.providerId || '',
    date: appointment?.date || '',
    time: appointment?.time || '',
    duration: appointment?.duration || 30,
    type: appointment?.type || '',
    notes: appointment?.notes || '',
  });

  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientSearch, setShowPatientSearch] = useState(false);

  // Mock patient search results
  const mockPatients = [
    { id: 'PAT-001', name: 'María González', phone: '+1 868 555-0001' },
    { id: 'PAT-002', name: 'Carlos Rodríguez', phone: '+1 868 555-0002' },
    { id: 'PAT-003', name: 'Ana Martínez', phone: '+1 868 555-0003' },
    { id: 'PAT-004', name: 'José Pérez', phone: '+1 868 555-0004' },
    { id: 'PAT-005', name: 'Laura Sánchez', phone: '+1 868 555-0005' },
  ];

  const filteredPatients = mockPatients.filter(p => 
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const selectPatient = (patient: typeof mockPatients[0]) => {
    setFormData(prev => ({ ...prev, patientName: patient.name, patientPhone: patient.phone }));
    setShowPatientSearch(false);
    setPatientSearch('');
  };

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
        {appointment ? 'Editar Cita' : 'Nueva Cita'}
      </h2>

      <div className="space-y-4">
        {/* Patient Search */}
        <div className="space-y-2">
          <Label className="text-[var(--text-mid)]">Paciente *</Label>
          <div className="relative">
            <Input
              placeholder="Buscar paciente por nombre o ID..."
              value={patientSearch || formData.patientName}
              onChange={(e) => {
                setPatientSearch(e.target.value);
                setShowPatientSearch(true);
              }}
              onFocus={() => setShowPatientSearch(true)}
            />
            {showPatientSearch && patientSearch && (
              <div className="absolute z-10 w-full mt-1 glass-card max-h-48 overflow-y-auto">
                {filteredPatients.map(patient => (
                  <div
                    key={patient.id}
                    onClick={() => selectPatient(patient)}
                    className="p-3 hover:bg-[var(--glass)] cursor-pointer border-b border-[var(--glass-border)] last:border-0"
                  >
                    <p className="text-sm text-[var(--text-primary)]">{patient.name}</p>
                    <p className="text-xs text-[var(--text-mid)]">{patient.id} • {patient.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Provider Selection */}
        <div className="space-y-2">
          <Label className="text-[var(--text-mid)]">Proveedor *</Label>
          <select
            value={formData.providerId}
            onChange={(e) => setFormData(prev => ({ ...prev, providerId: e.target.value }))}
            className="w-full h-10 px-3 rounded-lg"
          >
            <option value="">Seleccionar proveedor</option>
            {DEMO_PROVIDERS.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name} - {provider.specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Fecha *</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Hora *</Label>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>
        </div>

        {/* Duration and Type */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Duración (min)</Label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full h-10 px-3 rounded-lg"
            >
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={60}>60 minutos</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Tipo de Cita *</Label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full h-10 px-3 rounded-lg"
            >
              <option value="">Seleccionar tipo</option>
              {APPOINTMENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label className="text-[var(--text-mid)]">Notas</Label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Notas adicionales..."
            className="w-full h-24 px-3 py-2 rounded-lg resize-none"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button className="flex-1 btn-gold" onClick={onSave}>
          {appointment ? 'Actualizar Cita' : 'Crear Cita'}
        </Button>
      </div>
    </div>
  );
}

// Time Slots Visualization
function TimeSlotsVisualization({ selectedProvider }: { selectedProvider: string }) {
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Disponibilidad de Hoy</h3>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {timeSlots.map((slot, idx) => (
          <div
            key={idx}
            className={`p-2 text-center rounded-lg text-xs font-mono cursor-pointer transition-colors ${
              slot.available
                ? 'bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20'
                : 'bg-[var(--error)]/10 text-[var(--error)]/50 line-through'
            }`}
          >
            {slot.time}
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[var(--success)]/20"></div>
          <span className="text-[var(--text-mid)]">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[var(--error)]/20"></div>
          <span className="text-[var(--text-mid)]">Ocupado</span>
        </div>
      </div>
    </div>
  );
}

// Main Appointments Module
export function AppointmentsModule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

  const handleSelectAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowAppointmentDetails(true);
  };

  const updateAppointmentStatus = (status: Appointment['status']) => {
    // In real app, this would update the database
    console.log('Updating status to:', status);
    setShowAppointmentDetails(false);
  };

  return (
    <ClinicLayout activeTab="appointments">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Gestión de Citas</h1>
          <p className="text-[var(--text-mid)] text-sm">Administra las citas de la clínica</p>
        </div>
        <Button className="btn-gold" onClick={() => setShowNewAppointment(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = DEMO_APPOINTMENTS.filter(a => a.status === key).length;
          return (
            <div key={key} className="glass-card p-4 cursor-pointer hover:border-[var(--nexus-violet)] transition-colors"
                 onClick={() => setStatusFilter(key)}>
              <p className="text-xs text-[var(--text-mid)]">{config.label}</p>
              <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-dm-mono)', color: `var(--${key === 'scheduled' ? 'nexus-aqua' : key === 'confirmed' ? 'success' : key === 'completed' ? 'nexus-violet-lite' : key === 'cancelled' ? 'error' : 'nexus-gold'})` }}>
                {count}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          className="h-10 px-3 rounded-lg min-w-[200px]"
        >
          <option value="all">Todos los proveedores</option>
          {DEMO_PROVIDERS.map(provider => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'month' | 'week' | 'day')} className="w-auto">
          <TabsList className="glass-card">
            <TabsTrigger value="month">Mes</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="day">Día</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CalendarView
            appointments={DEMO_APPOINTMENTS}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedProvider={selectedProvider}
            viewMode={viewMode}
          />
        </div>
        <div className="space-y-6">
          <TimeSlotsVisualization selectedProvider={selectedProvider} />
          
          {/* Provider Legend */}
          <div className="glass-card p-4">
            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">Proveedores</h4>
            <div className="space-y-2">
              {DEMO_PROVIDERS.map(provider => (
                <div key={provider.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: provider.color }} />
                  <span className="text-sm text-[var(--text-mid)]">{provider.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment List */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Lista de Citas</h2>
        <AppointmentList
          appointments={DEMO_APPOINTMENTS}
          onSelectAppointment={handleSelectAppointment}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <AppointmentForm
            onSave={() => setShowNewAppointment(false)}
            onCancel={() => setShowNewAppointment(false)}
          />
        </div>
      )}

      {/* Appointment Details Modal */}
      {showAppointmentDetails && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Detalles de la Cita</h2>
              <button onClick={() => setShowAppointmentDetails(false)} className="p-2 rounded hover:bg-[var(--glass)]">
                <X className="w-5 h-5 text-[var(--text-mid)]" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {selectedAppointment.patientName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{selectedAppointment.patientName}</p>
                  <p className="text-sm text-[var(--text-mid)]">{selectedAppointment.patientPhone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-[var(--glass)]">
                <div>
                  <p className="text-xs text-[var(--text-dim)]">Fecha</p>
                  <p className="text-sm text-[var(--text-primary)]">{selectedAppointment.date}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-dim)]">Hora</p>
                  <p className="text-sm text-[var(--text-primary)]">{selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-dim)]">Tipo</p>
                  <p className="text-sm text-[var(--text-primary)]">{selectedAppointment.type}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-dim)]">Duración</p>
                  <p className="text-sm text-[var(--text-primary)]">{selectedAppointment.duration} min</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-[var(--text-dim)]">Proveedor</p>
                  <p className="text-sm text-[var(--text-primary)]">{selectedAppointment.providerName}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-[var(--text-dim)] mb-2">Estado</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => updateAppointmentStatus(key as Appointment['status'])}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedAppointment.status === key
                          ? config.color
                          : 'bg-[var(--glass)] text-[var(--text-mid)] hover:bg-[var(--nexus-violet)]/10'
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowAppointmentDetails(false)}>
                Cerrar
              </Button>
              <Button className="flex-1 btn-nexus" onClick={() => {
                setShowAppointmentDetails(false);
                setShowNewAppointment(true);
              }}>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      )}
    </ClinicLayout>
  );
}
