'use client';

import React, { useState } from 'react';
import { 
  Video, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Clock, 
  Users, 
  Settings,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  ScreenShare,
  UserPlus,
  FileText,
  Pill,
  Send,
  Search,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Mock data
const mockAppointments = [
  { id: 1, patient: 'María González', time: '10:00 AM', type: 'Seguimiento', status: 'waiting', photo: 'MG' },
  { id: 2, patient: 'Carlos Reyes', time: '10:30 AM', type: 'Consulta General', status: 'scheduled', photo: 'CR' },
  { id: 3, patient: 'Ana Martínez', time: '11:00 AM', type: 'Resultados Lab', status: 'scheduled', photo: 'AM' },
];

const mockChat = [
  { from: 'doctor', message: 'Hola María, ¿cómo se siente hoy?', time: '10:01' },
  { from: 'patient', message: 'Hola Doctor, me siento mejor. El dolor disminuyó.', time: '10:02' },
  { from: 'doctor', message: 'Excelente. ¿Ha tomado el medicamento como se lo receté?', time: '10:03' },
];

export default function TelemedicinaPage() {
  const [activeTab, setActiveTab] = useState('lobby');
  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const renderLobby = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EDE9FE]">Sala de Espera Virtual</h2>
        <div className="flex items-center gap-2 text-[#34D399]">
          <div className="w-3 h-3 rounded-full bg-[#34D399] animate-pulse" />
          <span className="text-sm">Sistema Activo</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <Users className="w-6 h-6 mx-auto text-[#6C3FCE] mb-2" />
          <p className="text-2xl font-bold text-[#EDE9FE]">1</p>
          <p className="text-xs text-[#9D7BEA]">En espera</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Video className="w-6 h-6 mx-auto text-[#22D3EE] mb-2" />
          <p className="text-2xl font-bold text-[#EDE9FE]">0</p>
          <p className="text-xs text-[#9D7BEA]">En consulta</p>
        </div>
        <div className="glass-card p-4 text-center">
          <CheckCircle className="w-6 h-6 mx-auto text-[#34D399] mb-2" />
          <p className="text-2xl font-bold text-[#EDE9FE]">5</p>
          <p className="text-xs text-[#9D7BEA]">Completadas hoy</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Clock className="w-6 h-6 mx-auto text-[#F0B429] mb-2" />
          <p className="text-2xl font-bold text-[#EDE9FE]">~5 min</p>
          <p className="text-xs text-[#9D7BEA]">Tiempo espera</p>
        </div>
      </div>

      {/* Waiting Queue */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-[#EDE9FE] mb-4">Pacientes en Espera</h3>
        <div className="space-y-3">
          {mockAppointments.map((apt) => (
            <div key={apt.id} className={`p-4 rounded-lg flex items-center justify-between ${
              apt.status === 'waiting' 
                ? 'bg-[#34D399]/10 border border-[#34D399]/30' 
                : 'bg-[rgba(108,63,206,0.07)]'
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center">
                  <span className="text-white font-bold">{apt.photo}</span>
                </div>
                <div>
                  <p className="font-medium text-[#EDE9FE]">{apt.patient}</p>
                  <p className="text-sm text-[#9D7BEA]">{apt.type} • {apt.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {apt.status === 'waiting' && (
                  <span className="px-3 py-1 rounded-full bg-[#34D399]/20 text-[#34D399] text-sm animate-pulse">
                    En sala virtual
                  </span>
                )}
                <button
                  onClick={() => { setInCall(true); setActiveTab('call'); }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] text-white text-sm hover:opacity-90"
                >
                  Iniciar Consulta
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="glass-card p-4 hover:border-[#6C3FCE]/50 transition-all text-left">
          <Calendar className="w-6 h-6 text-[#6C3FCE] mb-2" />
          <p className="font-medium text-[#EDE9FE]">Programar Consulta</p>
          <p className="text-xs text-[#9D7BEA]">Crear nueva cita virtual</p>
        </button>
        <button className="glass-card p-4 hover:border-[#22D3EE]/50 transition-all text-left">
          <UserPlus className="w-6 h-6 text-[#22D3EE] mb-2" />
          <p className="font-medium text-[#EDE9FE]">Invitar Paciente</p>
          <p className="text-xs text-[#9D7BEA]">Enviar link de videollamada</p>
        </button>
        <button className="glass-card p-4 hover:border-[#F0B429]/50 transition-all text-left">
          <Settings className="w-6 h-6 text-[#F0B429] mb-2" />
          <p className="font-medium text-[#EDE9FE]">Configuración</p>
          <p className="text-xs text-[#9D7BEA]">Audio, video, dispositivos</p>
        </button>
      </div>
    </div>
  );

  const renderCall = () => (
    <div className="h-[calc(100vh-200px)] flex">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Main Video (Patient) */}
        <div className="absolute inset-0 bg-[#1a1a2e] rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-white">MG</span>
            </div>
            <p className="text-xl text-[#EDE9FE]">María González</p>
            <p className="text-[#9D7BEA]">Paciente</p>
          </div>
        </div>
        
        {/* Self Video (Doctor) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 rounded-xl bg-[#0A0820] border border-[rgba(167,139,250,0.2)] flex items-center justify-center">
          <div className="text-center">
            <Video className="w-8 h-8 text-[#9D7BEA] mx-auto mb-1" />
            <p className="text-xs text-[#9D7BEA]">Usted</p>
          </div>
        </div>

        {/* Call Duration */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[#34D399]/20 text-[#34D399] text-sm">
          ● En llamada • 05:23
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button 
            onClick={() => setMuted(!muted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              muted ? 'bg-[#F87171]' : 'bg-[rgba(108,63,206,0.3)]'
            }`}
          >
            {muted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
          </button>
          <button 
            onClick={() => setVideoOff(!videoOff)}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              videoOff ? 'bg-[#F87171]' : 'bg-[rgba(108,63,206,0.3)]'
            }`}
          >
            {videoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
          </button>
          <button 
            onClick={() => { setInCall(false); setActiveTab('lobby'); }}
            className="w-14 h-14 rounded-full bg-[#F87171] flex items-center justify-center hover:bg-[#dc2626]"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
          <button className="w-12 h-12 rounded-full bg-[rgba(108,63,206,0.3)] flex items-center justify-center">
            <ScreenShare className="w-5 h-5 text-white" />
          </button>
          <button className="w-12 h-12 rounded-full bg-[rgba(108,63,206,0.3)] flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-80 border-l border-[rgba(167,139,250,0.1)] p-4 flex flex-col">
        <div className="flex border-b border-[rgba(167,139,250,0.1)] mb-4">
          <button className="flex-1 py-2 text-sm text-[#B197FC] border-b-2 border-[#6C3FCE]">Chat</button>
          <button className="flex-1 py-2 text-sm text-[#9D7BEA]">Notas</button>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-auto space-y-3 mb-4">
          {mockChat.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'doctor' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                msg.from === 'doctor' 
                  ? 'bg-[#6C3FCE]/20 text-[#EDE9FE]' 
                  : 'bg-[rgba(108,63,206,0.07)] text-[#9D7BEA]'
              }`}>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs text-[rgba(167,139,250,0.4)] mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Escribir mensaje..."
            className="flex-1 px-3 py-2 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.1)] text-[#EDE9FE] text-sm"
          />
          <button className="p-2 rounded-lg bg-[#6C3FCE]">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#EDE9FE]">Programar Consulta Virtual</h2>
      
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-[#9D7BEA]">Paciente</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(167,139,250,0.4)]" />
              <input
                type="text"
                placeholder="Buscar paciente..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.1)] text-[#EDE9FE]"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-[#9D7BEA]">Tipo de Consulta</label>
            <select className="w-full mt-1 px-4 py-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.1)] text-[#EDE9FE]">
              <option>Consulta General</option>
              <option>Seguimiento</option>
              <option>Resultados de Laboratorio</option>
              <option>Receta/Recarga</option>
              <option>Segunda Opinión</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm text-[#9D7BEA]">Fecha</label>
            <input
              type="date"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.1)] text-[#EDE9FE]"
            />
          </div>
          
          <div>
            <label className="text-sm text-[#9D7BEA]">Hora</label>
            <input
              type="time"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.1)] text-[#EDE9FE]"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="text-sm text-[#9D7BEA]">Notas previas</label>
            <textarea
              rows={3}
              placeholder="Motivo de consulta, síntomas, etc."
              className="w-full mt-1 px-4 py-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.1)] text-[#EDE9FE]"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 rounded-lg border border-[rgba(167,139,250,0.2)] text-[#9D7BEA]">
            Cancelar
          </button>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] text-white">
            Programar y Enviar Invitación
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="glass-card p-4 border-l-4 border-l-[#22D3EE]">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#22D3EE] flex-shrink-0" />
          <div>
            <p className="font-medium text-[#EDE9FE]">El paciente recibirá:</p>
            <ul className="text-sm text-[#9D7BEA] mt-1 space-y-1">
              <li>• Email con link de la videollamada</li>
              <li>• Recordatorio 1 hora antes</li>
              <li>• SMS/WhatsApp (si está configurado)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const navItems = [
    { id: 'lobby', label: 'Sala de Espera', icon: Users },
    { id: 'schedule', label: 'Programar', icon: Calendar },
    { id: 'history', label: 'Historial', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050410]">
      <div className="aurora-bg" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0820]/90 backdrop-blur-xl border-b border-[rgba(167,139,250,0.1)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#EDE9FE]">Telemedicina</h1>
              <p className="text-xs text-[#9D7BEA]">NexusOS</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  activeTab === item.id 
                    ? 'bg-[#6C3FCE]/20 text-[#B197FC]' 
                    : 'text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.07)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <a href="/home" className="text-xs text-[#9D7BEA] hover:text-[#EDE9FE]">
            ← Volver
          </a>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'lobby' && renderLobby()}
        {activeTab === 'call' && renderCall()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'history' && (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 mx-auto text-[#9D7BEA] mb-4" />
            <p className="text-[#9D7BEA]">Historial de consultas virtuales</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-center py-20">
            <Settings className="w-12 h-12 mx-auto text-[#9D7BEA] mb-4" />
            <p className="text-[#9D7BEA]">Configuración de audio, video y dispositivos</p>
          </div>
        )}
      </main>
    </div>
  );
}
