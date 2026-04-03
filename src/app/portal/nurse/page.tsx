'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CheckCircle, 
  Heart, 
  Users, 
  ClipboardList,
  Activity,
  Calendar,
  Clock,
  FileText,
  Star,
  ChevronRight,
  AlertTriangle,
  Pill
} from 'lucide-react';

// Precios para Portal de Enfermería (Home Care / Independent)
const plans = {
  starter: {
    name: 'STARTER',
    priceMonthly: 500,
    priceAnnual: 425,
    users: '1-2 enfermeras',
    patients: 50,
    description: 'Para enfermeras independientes',
    features: [
      'Hasta 50 pacientes',
      'Signos vitales básico',
      'Notas de enfermería',
      'Calendario básico',
      'Soporte por email'
    ]
  },
  growth: {
    name: 'GROWTH',
    priceMonthly: 900,
    priceAnnual: 765,
    users: '3-5 enfermeras',
    patients: 'Ilimitados',
    description: 'Para agencias de home care',
    popular: true,
    features: [
      'Pacientes ilimitados',
      'SBAR completo',
      'MAR (Medicación)',
      'Turnos y horarios',
      'Alertas automáticas',
      'Soporte prioritario'
    ]
  },
  premium: {
    name: 'PREMIUM',
    priceMonthly: 1500,
    priceAnnual: 1275,
    users: '6-15 enfermeras',
    patients: 'Ilimitados',
    description: 'Para servicios grandes',
    features: [
      'Todo en GROWTH',
      'Protocolos personalizados',
      'Integración con clínicas',
      'Reportes avanzados',
      'Multi-equipo',
      'API access',
      'Soporte 24/7'
    ]
  }
};

const modules = [
  { icon: ClipboardList, name: 'SBAR', desc: 'Comunicación estructurada' },
  { icon: Activity, name: 'Signos Vitales', desc: 'Monitoreo y alertas' },
  { icon: Pill, name: 'MAR', desc: 'Administración de medicamentos' },
  { icon: Heart, name: 'Cuidados', desc: 'Planes de cuidado' },
  { icon: Clock, name: 'Turnos', desc: 'Gestión de horarios' },
  { icon: FileText, name: 'Notas', desc: 'Documentación clínica' },
  { icon: Calendar, name: 'Citas', desc: 'Visitas programadas' },
  { icon: AlertTriangle, name: 'Alertas', desc: 'Notificaciones críticas' },
];

export default function NursePortalPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const activationFee = 800;

  return (
    <div className="min-h-screen bg-[#050410]">
      <div className="aurora-bg" />
      
      {/* Header */}
      <header className="relative z-50 border-b border-[rgba(167,139,250,0.1)] bg-[#0A0820]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/portal" className="flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--nexus-gold)] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Portal de Ventas</span>
            </Link>
            <div className="w-px h-6 bg-[var(--glass-border)]" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#34D399]/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#34D399]" />
              </div>
              <div>
                <h1 className="font-bold text-[#EDE9FE]">NexusOS Enfermería</h1>
                <p className="text-xs text-[#9D7BEA]">Portal de Cuidados</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-3 py-1.5 rounded-lg border border-[rgba(167,139,250,0.2)] text-[#9D7BEA] text-sm hover:bg-[rgba(108,63,206,0.1)] transition-all">
              Iniciar Sesión
            </Link>
            <a href="#precios" className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#F0B429] to-[#d97706] text-white text-sm font-medium hover:opacity-90">
              Ver Precios
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#34D399]/10 border border-[#34D399]/20 text-[#34D399] text-sm mb-6">
                <Heart className="w-4 h-4" />
                <span>Incluido con Clínicas</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-[#EDE9FE] mb-6 leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Portal de <span className="text-[#34D399]">Enfermería</span>
              </h1>
              
              <p className="text-lg text-[#9D7BEA] mb-8">
                Sistema especializado para enfermeras y servicios de home care. 
                SBAR, signos vitales, MAR (administración de medicamentos), 
                gestión de turnos y más. <strong className="text-[#22D3EE]">Incluido gratis con cada clínica.</strong>
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#precios" className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#F0B429] to-[#d97706] text-white font-semibold hover:opacity-90 transition-all">
                  Ver Planes
                </a>
                <Link href="/portal/clinic" className="px-8 py-4 rounded-xl border border-[#22D3EE]/30 text-[#22D3EE] hover:bg-[rgba(34,211,238,0.1)] transition-all">
                  Ver Clínicas
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'SBAR', label: 'Comunicación' },
                { value: 'MAR', label: 'Medicación' },
                { value: 'Gratis', label: 'Con Clínicas' },
                { value: '48h', label: 'Activación' },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-xl bg-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)]">
                  <p className="text-3xl font-bold text-[#34D399]">{stat.value}</p>
                  <p className="text-sm text-[#9D7BEA]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Note about inclusion */}
      <section className="relative z-10 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[rgba(34,211,238,0.1)] to-[rgba(52,211,153,0.1)] border border-[#34D399]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#34D399]/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-[#34D399]" />
              </div>
              <div>
                <h3 className="font-bold text-[#EDE9FE] mb-2">¿Tienes una clínica? Ya lo tienes.</h3>
                <p className="text-[#9D7BEA]">
                  El Portal de Enfermería está incluido sin costo adicional con cualquier plan de 
                  <Link href="/portal/clinic" className="text-[#22D3EE] hover:underline"> NexusOS Clínicas</Link>.
                  Los precios aquí son para servicios independientes de home care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="relative z-10 py-16 px-4 bg-[rgba(108,63,206,0.03)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#EDE9FE] mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Módulos Especializados
            </h2>
            <p className="text-[#9D7BEA] max-w-xl mx-auto">
              Herramientas diseñadas para el cuidado de pacientes
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modules.map((mod, i) => (
              <div key={i} className="p-4 rounded-xl bg-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)] hover:border-[#34D399]/30 transition-all">
                <mod.icon className="w-8 h-8 text-[#34D399] mb-3" />
                <h4 className="font-medium text-[#EDE9FE] mb-1">{mod.name}</h4>
                <p className="text-xs text-[#9D7BEA]">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#EDE9FE] mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Planes para Home Care
            </h2>
            <p className="text-[#9D7BEA]">Para servicios independientes de enfermería a domicilio</p>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={() => setBillingCycle('monthly')} className={`px-4 py-2 rounded-lg transition-all ${billingCycle === 'monthly' ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30' : 'text-[#9D7BEA] hover:text-[#EDE9FE]'}`}>
                Mensual
              </button>
              <button onClick={() => setBillingCycle('annual')} className={`px-4 py-2 rounded-lg transition-all ${billingCycle === 'annual' ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30' : 'text-[#9D7BEA] hover:text-[#EDE9FE]'}`}>
                Anual <span className="text-xs ml-1">(Ahorra 15%)</span>
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(plans).map(([key, plan]) => {
              const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual;
              
              return (
                <div key={key} className={`p-6 rounded-2xl border transition-all ${plan.popular ? 'bg-[rgba(52,211,153,0.05)] border-[#34D399]/30 scale-105' : 'bg-[rgba(108,63,206,0.05)] border-[rgba(167,139,250,0.1)]'}`}>
                  {plan.popular && (
                    <div className="text-center mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#34D399] text-[#050410] text-xs font-bold">MÁS POPULAR</span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-[#9D7BEA] mb-1">{plan.name}</h3>
                    <p className="text-sm text-[#9D7BEA] mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-[#EDE9FE]">TT${price}</span>
                      <span className="text-[#9D7BEA]">/mes</span>
                    </div>
                    <p className="text-xs text-[#9D7BEA] mt-2">{plan.users}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#EDE9FE]">
                        <CheckCircle className="w-4 h-4 text-[#34D399] mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <a href="/portal#apply" className={`block w-full py-3 rounded-lg text-center font-medium transition-all ${plan.popular ? 'bg-gradient-to-r from-[#34D399] to-[#059669] text-white hover:opacity-90' : 'border border-[rgba(167,139,250,0.3)] text-[#EDE9FE] hover:bg-[rgba(108,63,206,0.1)]'}`}>
                    Seleccionar Plan
                  </a>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-[#9D7BEA]">
              <span className="font-semibold text-[#F0B429]">Activación:</span> TT${activationFee} único pago
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[rgba(52,211,153,0.1)] to-[rgba(34,211,238,0.1)] border border-[rgba(167,139,250,0.2)]">
            <h2 className="text-2xl font-bold text-[#EDE9FE] mb-4">¿Listo para mejorar tu servicio de cuidados?</h2>
            <p className="text-[#9D7BEA] mb-6">Únete a más de 20 servicios de home care que ya usan NexusOS</p>
            <a href="/portal#apply" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#F0B429] to-[#d97706] text-white font-semibold hover:opacity-90">
              Solicitar Demo Gratis <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(167,139,250,0.1)] bg-[#0A0820]/50 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[#9D7BEA]">© 2024 NexusOS Enfermería — Hecho con ❤️ en Trinidad & Tobago 🇹🇹</p>
        </div>
      </footer>
    </div>
  );
}
