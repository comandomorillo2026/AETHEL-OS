'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  FileText, 
  Pill, 
  CreditCard, 
  Bell, 
  User,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  MessageCircle,
  Phone,
  MapPin,
  Heart,
  Activity,
  Droplets,
  Thermometer
} from 'lucide-react';

// Mock patient data
const mockPatient = {
  name: 'María González',
  patientId: 'PAT-2024-0042',
  email: 'maria.gonzalez@email.com',
  phone: '+1 868-123-4567',
  birthDate: '15 Marzo 1985',
  bloodType: 'O+',
  allergies: ['Penicilina', 'Mariscos'],
  clinic: {
    name: 'Clínica Demo',
    address: '123 Frederick St, Port of Spain',
    phone: '+1 868-555-0123'
  }
};

const mockAppointments = [
  { id: 1, date: '27 Mar 2024', time: '10:00 AM', doctor: 'Dr. Carlos Reyes', specialty: 'Medicina General', status: 'confirmed', type: 'Consulta' },
  { id: 2, date: '03 Abr 2024', time: '09:30 AM', doctor: 'Dra. Ana Martínez', specialty: 'Cardiología', status: 'pending', type: 'Seguimiento' },
  { id: 3, date: '15 Abr 2024', time: '02:00 PM', doctor: 'Dr. Luis Fernández', specialty: 'Laboratorio', status: 'pending', type: 'Examen de Sangre' },
];

const mockResults = [
  { id: 1, date: '20 Mar 2024', type: 'Hemograma Completo', status: 'ready', doctor: 'Dr. Carlos Reyes' },
  { id: 2, date: '15 Mar 2024', type: 'Perfil Lipídico', status: 'ready', doctor: 'Dra. Ana Martínez' },
  { id: 3, date: '10 Mar 2024', type: 'Glucosa en Ayunas', status: 'ready', doctor: 'Dr. Carlos Reyes' },
];

const mockPrescriptions = [
  { id: 1, medication: 'Metformina 500mg', frequency: '2 veces al día', duration: '30 días', remaining: 22, status: 'active' },
  { id: 2, medication: 'Losartán 50mg', frequency: '1 vez al día', duration: '30 días', remaining: 15, status: 'active' },
  { id: 3, medication: 'Omeprazol 20mg', frequency: '1 vez al día', duration: '14 días', remaining: 0, status: 'completed' },
];

const mockInvoices = [
  { id: 'INV-2024-0012', date: '20 Mar 2024', amount: 850, status: 'paid', description: 'Consulta + Laboratorios' },
  { id: 'INV-2024-0010', date: '15 Mar 2024', amount: 450, status: 'paid', description: 'Consulta General' },
  { id: 'INV-2024-0008', date: '01 Mar 2024', amount: 1200, status: 'pending', description: 'Consulta Especializada + Exámenes' },
];

const mockVitals = [
  { date: '20 Mar', bp: '120/80', hr: 72, temp: 36.5, glucose: 95, weight: 68 },
  { date: '15 Mar', bp: '118/78', hr: 70, temp: 36.3, glucose: 98, weight: 68.5 },
  { date: '10 Mar', bp: '122/82', hr: 75, temp: 36.4, glucose: 102, weight: 69 },
];

export default function PatientPortal() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Inicio', icon: User },
    { id: 'appointments', label: 'Citas', icon: Calendar },
    { id: 'results', label: 'Resultados', icon: FileText },
    { id: 'prescriptions', label: 'Recetas', icon: Pill },
    { id: 'billing', label: 'Facturas', icon: CreditCard },
  ];

  const renderHome = () => (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center">
            <span className="text-2xl font-bold text-white">MG</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#EDE9FE]">¡Hola, {mockPatient.name}!</h2>
            <p className="text-sm text-[#9D7BEA]">Paciente ID: {mockPatient.patientId}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs bg-[#22D3EE]/20 text-[#22D3EE] px-2 py-1 rounded">
                Sangre: {mockPatient.bloodType}
              </span>
              {mockPatient.allergies.map((allergy, i) => (
                <span key={i} className="text-xs bg-[#F87171]/20 text-[#F87171] px-2 py-1 rounded">
                  ⚠️ {allergy}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <Calendar className="w-6 h-6 mx-auto text-[#6C3FCE] mb-2" />
          <p className="text-2xl font-bold text-[#EDE9FE]">3</p>
          <p className="text-xs text-[#9D7BEA]">Próximas Citas</p>
        </div>
        <div className="glass-card p-4 text-center">
          <FileText className="w-6 h-6 mx-auto text-[#22D3EE] mb-2" />
          <p className="text-2xl font-bold text-[#EDE9FE]">3</p>
          <p className="text-xs text-[#9D7BEA]">Resultados Listos</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Pill className="w-6 h-6 mx-auto text-[#34D399] mb-2" />
          <p className="text-2xl font-bold text-[#EDE9FE]">2</p>
          <p className="text-xs text-[#9D7BEA]">Recetas Activas</p>
        </div>
        <div className="glass-card p-4 text-center">
          <CreditCard className="w-6 h-6 mx-auto text-[#F0B429] mb-2" />
          <p className="text-2xl font-bold text-[#F0B429]">TT$1,200</p>
          <p className="text-xs text-[#9D7BEA]">Pendiente</p>
        </div>
      </div>

      {/* Next Appointment */}
      <div className="glass-card p-6 border-l-4 border-l-[#6C3FCE]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#EDE9FE] mb-2">Próxima Cita</h3>
            <p className="text-[#22D3EE] font-medium">{mockAppointments[0].date} a las {mockAppointments[0].time}</p>
            <p className="text-[#9D7BEA]">{mockAppointments[0].doctor}</p>
            <p className="text-sm text-[rgba(167,139,250,0.5)]">{mockAppointments[0].specialty} - {mockAppointments[0].type}</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#34D399]/20 text-[#34D399] text-sm">
            Confirmada
          </span>
        </div>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-2 rounded-lg bg-[#6C3FCE]/20 text-[#B197FC] text-sm hover:bg-[#6C3FCE]/30 transition-colors">
            Reprogramar
          </button>
          <button className="flex-1 py-2 rounded-lg bg-[#F87171]/20 text-[#F87171] text-sm hover:bg-[#F87171]/30 transition-colors">
            Cancelar
          </button>
        </div>
      </div>

      {/* Recent Vitals */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-[#EDE9FE] mb-4">Últimos Signos Vitales</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 rounded-lg bg-[rgba(108,63,206,0.07)]">
            <Activity className="w-5 h-5 mx-auto text-[#F87171] mb-1" />
            <p className="text-lg font-bold text-[#EDE9FE]">{mockVitals[0].bp}</p>
            <p className="text-xs text-[#9D7BEA]">Presión</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-[rgba(108,63,206,0.07)]">
            <Heart className="w-5 h-5 mx-auto text-[#F87171] mb-1" />
            <p className="text-lg font-bold text-[#EDE9FE]">{mockVitals[0].hr}</p>
            <p className="text-xs text-[#9D7BEA]">Pulso</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-[rgba(108,63,206,0.07)]">
            <Thermometer className="w-5 h-5 mx-auto text-[#22D3EE] mb-1" />
            <p className="text-lg font-bold text-[#EDE9FE]">{mockVitals[0].temp}°C</p>
            <p className="text-xs text-[#9D7BEA]">Temp</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-[rgba(108,63,206,0.07)]">
            <Droplets className="w-5 h-5 mx-auto text-[#F0B429] mb-1" />
            <p className="text-lg font-bold text-[#EDE9FE]">{mockVitals[0].glucose}</p>
            <p className="text-xs text-[#9D7BEA]">Glucosa</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-[rgba(108,63,206,0.07)]">
            <User className="w-5 h-5 mx-auto text-[#34D399] mb-1" />
            <p className="text-lg font-bold text-[#EDE9FE]">{mockVitals[0].weight}kg</p>
            <p className="text-xs text-[#9D7BEA]">Peso</p>
          </div>
        </div>
        <p className="text-xs text-[rgba(167,139,250,0.5)] mt-3">Tomado el {mockVitals[0].date}</p>
      </div>

      {/* Clinic Info */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-[#EDE9FE] mb-4">Tu Clínica</h3>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22D3EE] to-[#3B82F6] flex items-center justify-center">
            <span className="text-white font-bold">CD</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-[#EDE9FE]">{mockPatient.clinic.name}</p>
            <div className="flex items-center gap-2 text-sm text-[#9D7BEA] mt-1">
              <MapPin className="w-4 h-4" />
              {mockPatient.clinic.address}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#9D7BEA] mt-1">
              <Phone className="w-4 h-4" />
              {mockPatient.clinic.phone}
            </div>
          </div>
          <button className="p-3 rounded-lg bg-[#34D399]/20 text-[#34D399] hover:bg-[#34D399]/30">
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#EDE9FE]">Mis Citas</h2>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] text-white text-sm">
          Agendar Nueva Cita
        </button>
      </div>

      <div className="space-y-4">
        {mockAppointments.map((apt) => (
          <div key={apt.id} className="glass-card p-4 hover:border-[rgba(167,139,250,0.3)] transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 text-center">
                  <p className="text-sm text-[#9D7BEA]">{apt.date.split(' ')[0]}</p>
                  <p className="text-lg font-bold text-[#6C3FCE]">{apt.date.split(' ')[1]}</p>
                </div>
                <div className="w-px h-12 bg-[rgba(167,139,250,0.2)]" />
                <div>
                  <p className="font-medium text-[#EDE9FE]">{apt.doctor}</p>
                  <p className="text-sm text-[#9D7BEA]">{apt.specialty}</p>
                  <p className="text-xs text-[rgba(167,139,250,0.5)]">{apt.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#F0B429] font-mono">{apt.time}</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                  apt.status === 'confirmed' 
                    ? 'bg-[#34D399]/20 text-[#34D399]' 
                    : 'bg-[#F0B429]/20 text-[#F0B429]'
                }`}>
                  {apt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#EDE9FE]">Resultados de Laboratorio</h2>
      
      <div className="space-y-4">
        {mockResults.map((result) => (
          <div key={result.id} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#EDE9FE]">{result.type}</p>
                <p className="text-sm text-[#9D7BEA]">Solicitado por: {result.doctor}</p>
                <p className="text-xs text-[rgba(167,139,250,0.5)]">{result.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-[#34D399]/20 text-[#34D399] text-xs flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Listo
                </span>
                <button className="p-2 rounded-lg bg-[#6C3FCE]/20 text-[#B197FC] hover:bg-[#6C3FCE]/30">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#EDE9FE]">Mis Recetas</h2>
      
      <div className="space-y-4">
        {mockPrescriptions.map((rx) => (
          <div key={rx.id} className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-[#EDE9FE]">{rx.medication}</p>
                <p className="text-sm text-[#9D7BEA]">{rx.frequency} • {rx.duration}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                rx.status === 'active' 
                  ? 'bg-[#34D399]/20 text-[#34D399]' 
                  : 'bg-[rgba(167,139,250,0.1)] text-[#9D7BEA]'
              }`}>
                {rx.status === 'active' ? 'Activa' : 'Completada'}
              </span>
            </div>
            {rx.status === 'active' && (
              <div>
                <div className="flex justify-between text-xs text-[#9D7BEA] mb-1">
                  <span>Dosis restantes</span>
                  <span>{rx.remaining} días</span>
                </div>
                <div className="h-2 rounded-full bg-[rgba(108,63,206,0.1)]">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#6C3FCE] to-[#C026D3]"
                    style={{ width: `${(rx.remaining / 30) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#EDE9FE]">Mis Facturas</h2>
      
      <div className="glass-card p-4 border-l-4 border-l-[#F0B429]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#F0B429] font-medium">Balance Pendiente</p>
            <p className="text-2xl font-bold text-[#EDE9FE]">TT$1,200</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#F0B429] to-[#d97706] text-white text-sm">
            Pagar Ahora
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {mockInvoices.map((invoice) => (
          <div key={invoice.id} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm text-[#9D7BEA]">{invoice.id}</p>
                <p className="font-medium text-[#EDE9FE]">{invoice.description}</p>
                <p className="text-xs text-[rgba(167,139,250,0.5)]">{invoice.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#EDE9FE]">TT${invoice.amount}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  invoice.status === 'paid' 
                    ? 'bg-[#34D399]/20 text-[#34D399]' 
                    : 'bg-[#F0B429]/20 text-[#F0B429]'
                }`}>
                  {invoice.status === 'paid' ? 'Pagada' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return renderHome();
      case 'appointments': return renderAppointments();
      case 'results': return renderResults();
      case 'prescriptions': return renderPrescriptions();
      case 'billing': return renderBilling();
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-[#050410]">
      {/* Aurora Background */}
      <div className="aurora-bg" />
      
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0A0820]/90 backdrop-blur-xl border-b border-[rgba(167,139,250,0.1)]">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <User className="w-6 h-6 text-[#9D7BEA]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#3B82F6] flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-[#EDE9FE]">Portal Paciente</span>
          </div>
          <button className="relative">
            <Bell className="w-5 h-5 text-[#9D7BEA]" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#F0B429]" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-[#0A0820]" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-[rgba(167,139,250,0.1)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center">
                  <span className="text-white font-bold">MG</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#EDE9FE]">{mockPatient.name}</p>
                  <p className="text-xs text-[#9D7BEA]">{mockPatient.patientId}</p>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    activeTab === item.id ? 'bg-[#6C3FCE]/20 text-[#B197FC]' : 'text-[#9D7BEA]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen sticky top-0 bg-[#0A0820]/80 backdrop-blur-xl border-r border-[rgba(167,139,250,0.1)]">
          <div className="p-6 border-b border-[rgba(167,139,250,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22D3EE] to-[#3B82F6] flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-[#EDE9FE]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Portal Paciente
                </h1>
                <p className="text-xs text-[#34D399]">NexusOS</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-[rgba(167,139,250,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center">
                <span className="text-white font-bold">MG</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#EDE9FE]">{mockPatient.name}</p>
                <p className="text-xs text-[#9D7BEA]">{mockPatient.patientId}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#6C3FCE]/20 text-[#B197FC]' 
                    : 'text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.07)]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-[rgba(167,139,250,0.1)]">
            <a href="/home" className="text-xs text-[#9D7BEA] hover:text-[#EDE9FE]">
              ← Volver al inicio
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
