'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  ArrowRight,
  CheckCircle,
  Stethoscope,
  Calendar,
  Users,
  FileText,
  TestTube,
  Pill,
  CreditCard,
  BarChart3,
  Building2,
  Phone,
  Clock,
  Activity
} from 'lucide-react';

export default function ClinicPortalPage() {
  const features = [
    {
      icon: Users,
      title: 'Gestión de Pacientes',
      description: 'Historiales médicos completos, alergias, medicamentos, antecedentes familiares y más.'
    },
    {
      icon: Calendar,
      title: 'Citas Inteligentes',
      description: 'Agenda con recordatorios automáticos por SMS/email. Gestión de disponibilidad de doctores.'
    },
    {
      icon: FileText,
      title: 'Recetas Digitales',
      description: 'Recetas electrónicas con códigos QR. Impresión automática y control de medicamentos controlados.'
    },
    {
      icon: TestTube,
      title: 'Laboratorio Integrado',
      description: 'Órdenes de laboratorio, seguimiento de resultados y notificaciones automáticas al paciente.'
    },
    {
      icon: Pill,
      title: 'Inventario Farmacéutico',
      description: 'Control de inventario de medicamentos, alertas de stock bajo y fechas de vencimiento.'
    },
    {
      icon: CreditCard,
      title: 'Facturación Médica',
      description: 'Facturas profesionales, múltiples métodos de pago, reportes de ingresos por doctor.'
    },
    {
      icon: BarChart3,
      title: 'Reportes y Analytics',
      description: 'Dashboard con métricas clave: pacientes atendidos, ingresos, ocupación de consultorios.'
    },
    {
      icon: Building2,
      title: 'Multi-sede',
      description: 'Gestiona múltiples clínicas desde un solo sistema con consolidación de reportes.'
    }
  ];

  const plans = [
    {
      name: 'Inicial',
      price: 'TT$800',
      period: '/mes',
      users: '2 usuarios',
      features: [
        'Gestión de pacientes',
        'Citas básicas',
        'Recetas simples',
        'Facturación',
        'Soporte por email'
      ]
    },
    {
      name: 'Crecimiento',
      price: 'TT$1,500',
      period: '/mes',
      users: '5 usuarios',
      popular: true,
      features: [
        'Todo en Inicial',
        'Laboratorio integrado',
        'Inventario básico',
        'Reportes avanzados',
        'Portal del paciente',
        'Soporte prioritario'
      ]
    },
    {
      name: 'Premium',
      price: 'TT$2,800',
      period: '/mes',
      users: '15 usuarios',
      features: [
        'Todo en Crecimiento',
        'Multi-sede',
        'Telemedicina',
        'API integrations',
        'Auditoría médica',
        'Soporte 24/7'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050410]">
      <div className="aurora-bg" />
      
      {/* Header */}
      <header className="relative z-50 border-b border-[rgba(167,139,250,0.1)] bg-[#0A0820]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#EDE9FE]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                NexusOS Clinic
              </h1>
              <p className="text-xs text-[#22D3EE]">Sistema para Clínicas</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-[#9D7BEA] hover:text-[#EDE9FE] transition-colors text-sm">Características</a>
            <a href="#pricing" className="text-[#9D7BEA] hover:text-[#EDE9FE] transition-colors text-sm">Precios</a>
            <a href="#demo" className="text-[#9D7BEA] hover:text-[#EDE9FE] transition-colors text-sm">Demo</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link
              href="/portal?industry=clinic"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Comenzar Ahora
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(34,211,238,0.1)] border border-[#22D3EE]/20 text-[#22D3EE] text-sm mb-6">
                <Stethoscope className="w-4 h-4" />
                <span>Sistema Especializado para Clínicas</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#EDE9FE] mb-6 leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Gestiona tu Clínica<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#06B6D4]">
                  como un profesional
                </span>
              </h1>
              
              <p className="text-lg text-[#9D7BEA] mb-8 max-w-xl">
                El sistema integral diseñado específicamente para clínicas médicas del Caribe. 
                Pacientes, citas, recetas, laboratorio y facturación en un solo lugar.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/portal?industry=clinic"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-white font-semibold text-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[#22D3EE]/20"
                >
                  Solicitar Demo
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 rounded-xl border border-[rgba(167,139,250,0.3)] text-[#EDE9FE] font-medium hover:bg-[rgba(108,63,206,0.1)] transition-all"
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
            
            {/* Stats */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#22D3EE]/20 to-[#06B6D4]/20 rounded-3xl blur-3xl" />
              <div className="relative p-6 rounded-2xl bg-[#0A0820] border border-[rgba(167,139,250,0.2)]">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-[rgba(34,211,238,0.05)] border border-[rgba(34,211,238,0.2)]">
                    <Activity className="w-6 h-6 text-[#22D3EE] mb-2" />
                    <p className="text-2xl font-bold text-[#EDE9FE]">50+</p>
                    <p className="text-sm text-[#9D7BEA]">Clínicas Activas</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[rgba(34,211,238,0.05)] border border-[rgba(34,211,238,0.2)]">
                    <Users className="w-6 h-6 text-[#22D3EE] mb-2" />
                    <p className="text-2xl font-bold text-[#EDE9FE]">200+</p>
                    <p className="text-sm text-[#9D7BEA]">Doctores</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[rgba(34,211,238,0.05)] border border-[rgba(34,211,238,0.2)]">
                    <Calendar className="w-6 h-6 text-[#22D3EE] mb-2" />
                    <p className="text-2xl font-bold text-[#EDE9FE]">10K+</p>
                    <p className="text-sm text-[#9D7BEA]">Citas Mensuales</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[rgba(34,211,238,0.05)] border border-[rgba(34,211,238,0.2)]">
                    <Clock className="w-6 h-6 text-[#22D3EE] mb-2" />
                    <p className="text-2xl font-bold text-[#EDE9FE]">99.9%</p>
                    <p className="text-sm text-[#9D7BEA]">Disponibilidad</p>
                  </div>
                </div>
                
                {/* Demo credentials */}
                <div className="p-4 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.2)]">
                  <p className="text-xs text-[#9D7BEA] mb-2">🔑 Credenciales de Demo:</p>
                  <p className="text-sm text-[#EDE9FE] font-mono">clinic@demo.tt / demo123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-16 px-4 bg-[rgba(108,63,206,0.03)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#EDE9FE] mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Todo lo que tu Clínica Necesita
            </h2>
            <p className="text-[#9D7BEA] max-w-2xl mx-auto">
              Un sistema completo diseñado con feedback de más de 50 clínicas del Caribe.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-2xl bg-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)] hover:border-[#22D3EE]/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22D3EE] to-[#06B6D4] flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#EDE9FE] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#9D7BEA]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#EDE9FE] mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Planes para Clínicas
            </h2>
            <p className="text-[#9D7BEA]">
              Precios en TT$ sin sorpresas. Sin tarifas ocultas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-2xl relative ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-[rgba(34,211,238,0.1)] to-[rgba(34,211,238,0.05)] border-2 border-[#22D3EE]' 
                    : 'bg-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)]'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#22D3EE] text-black text-xs font-bold">
                    Más Popular
                  </span>
                )}
                
                <h3 className="text-xl font-bold text-[#EDE9FE] mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-[#22D3EE]">{plan.price}</span>
                  <span className="text-[#9D7BEA]">{plan.period}</span>
                </div>
                <p className="text-sm text-[#9D7BEA] mb-6">{plan.users}</p>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-sm text-[#9D7BEA]">
                      <CheckCircle className="w-4 h-4 text-[#22D3EE] mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={`/portal?industry=clinic&plan=${plan.name.toLowerCase()}`}
                  className={`block w-full py-3 rounded-lg text-center font-medium transition-all ${
                    plan.popular 
                      ? 'bg-[#22D3EE] text-black hover:bg-[#06B6D4]' 
                      : 'border border-[rgba(167,139,250,0.3)] text-[#EDE9FE] hover:bg-[rgba(108,63,206,0.1)]'
                  }`}
                >
                  Comenzar
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[rgba(34,211,238,0.2)] to-[rgba(6,182,212,0.2)] border border-[rgba(34,211,238,0.3)]">
            <h2 className="text-3xl md:text-4xl font-bold text-[#EDE9FE] mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
              ¿Listo para transformar tu clínica?
            </h2>
            <p className="text-[#9D7BEA] mb-6 max-w-xl mx-auto">
              Únete a más de 50 clínicas que ya usan NexusOS. 
              Implementación en 48 horas, sin contratos largos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/portal?industry=clinic"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-[#22D3EE]/20"
              >
                Solicitar Demo Gratuita
              </Link>
              <a
                href="https://wa.me/18681234567"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl border border-[rgba(167,139,250,0.3)] text-[#EDE9FE] font-medium hover:bg-[rgba(108,63,206,0.1)] transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(167,139,250,0.1)] bg-[#0A0820]/50 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[#9D7BEA]">
            © 2024 NexusOS Clinic. Hecho con ❤️ en Trinidad & Tobago 🇹🇹
          </p>
        </div>
      </footer>
    </div>
  );
}
