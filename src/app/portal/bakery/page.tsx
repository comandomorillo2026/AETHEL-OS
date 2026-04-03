'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  ArrowRight,
  CheckCircle,
  Cookie,
  Calendar,
  Users,
  FileText,
  ShoppingCart,
  BarChart3,
  Building2,
  Phone,
  Clock,
  TrendingUp,
  DollarSign,
  Package,
  CreditCard,
  ChefHat,
  Truck,
  Bell,
  Settings,
  Plus
} from 'lucide-react';

export default function BakeryPortalPage() {
  const features = [
    {
      icon: Cookie,
      title: 'Productos & Recetas',
      description: 'Catálogo completo con variantes, recetas, costos y alérgenos. Control de inventario en tiempo real.'
    },
    {
      icon: ShoppingCart,
      title: 'POS Inteligente',
      description: 'Punto de venta rápido con modo offline. Acepta efectivo, tarjeta y transferencia. Facturación automática.'
    },
    {
      icon: ChefHat,
      title: 'Producción',
      description: 'Planifica tu producción diaria. Control de horneado, tiempos y rendimiento por lote.'
    },
    {
      icon: Calendar,
      title: 'Pedidos Especiales',
      description: 'Gestión de tortas personalizadas, fechas de entrega, diseños y recordatorios automáticos.'
    },
    {
      icon: Truck,
      title: 'Entregas',
      description: 'Rutas de entrega, seguimiento en tiempo real y notificaciones a clientes.'
    },
    {
      icon: BarChart3,
      title: 'Contabilidad Legal',
      description: 'Libro diario, balance, impuestos (VAT/IVA) y reportes listos para el contador.'
    },
    {
      icon: Users,
      title: 'Clientes & Fidelidad',
      description: 'Base de clientes, puntos de recompensa, promociones de cumpleaños y marketing.'
    },
    {
      icon: Building2,
      title: 'Multi-sucursal',
      description: 'Gestiona múltiples locales desde un solo sistema. Consolidación automática de reportes.'
    }
  ];

  const plans = [
    {
      name: 'Inicial',
      price: 'TT$500',
      period: '/mes',
      users: '1-2 usuarios',
      description: 'Para emprendedores',
      features: [
        'POS básico',
        'Hasta 50 productos',
        'Facturación simple',
        'Reportes básicos',
        'Soporte por email'
      ]
    },
    {
      name: 'Crecimiento',
      price: 'TT$900',
      period: '/mes',
      users: '3-5 usuarios',
      popular: true,
      description: 'Para panaderías establecidas',
      features: [
        'Todo en Inicial',
        'Productos ilimitados',
        'Pedidos especiales',
        'Contabilidad legal',
        'Portal del cliente',
        'Soporte prioritario'
      ]
    },
    {
      name: 'Premium',
      price: 'TT$1,500',
      period: '/mes',
      users: '6+ usuarios',
      description: 'Para franquicias',
      features: [
        'Todo en Crecimiento',
        'Multi-sucursal',
        'IA especializada',
        'API integrations',
        'App móvil propia',
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center">
              <Cookie className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#EDE9FE]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                NexusOS Bakery
              </h1>
              <p className="text-xs text-[#F97316]">Sistema para Panaderías</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-[#9D7BEA] hover:text-[#EDE9FE] transition-colors text-sm">Características</a>
            <a href="#pricing" className="text-[#9D7BEA] hover:text-[#EDE9FE] transition-colors text-sm">Precios</a>
            <a href="#demo" className="text-[#9D7BEA] hover:text-[#EDE9FE] transition-colors text-sm">Demo</a>
          </nav>
          
          <Link
            href="/portal?industry=bakery"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Comenzar Ahora
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(249,115,22,0.1)] border border-[#F97316]/20 text-[#F97316] text-sm mb-6">
                <ChefHat className="w-4 h-4" />
                <span>Sistema Especializado para Panaderías</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#EDE9FE] mb-6 leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Tu panadería,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#FBBF24]">
                  profesionalizada
                </span>
              </h1>
              
              <p className="text-lg text-[#9D7BEA] mb-8 max-w-xl">
                El sistema integral diseñado específicamente para panaderías y pastelerías del Caribe. 
                POS, producción, pedidos especiales, contabilidad legal y más.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/portal?industry=bakery"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold text-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[#F97316]/20"
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
            
            {/* Stats & Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F97316]/20 to-[#FBBF24]/20 rounded-3xl blur-3xl" />
              <div className="relative p-6 rounded-2xl bg-[#0A0820] border border-[rgba(167,139,250,0.2)]">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-[rgba(249,115,22,0.05)] border border-[rgba(249,115,22,0.2)]">
                    <Cookie className="w-6 h-6 text-[#F97316] mb-2" />
                    <p className="text-2xl font-bold text-[#EDE9FE]">40+</p>
                    <p className="text-sm text-[#9D7BEA]">Panaderías Activas</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[rgba(249,115,22,0.05)] border border-[rgba(249,115,22,0.2)]">
                    <Users className="w-6 h-6 text-[#F97316] mb-2" />
                    <p className="text-2xl font-bold text-[#EDE9FE]">150+</p>
                    <p className="text-sm text-[#9D7BEA]">Usuarios</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[rgba(249,115,22,0.05)] border border-[rgba(249,115,22,0.2)]">
                    <ShoppingCart className="w-6 h-6 text-[#F97316] mb-2" />
                    <p className="text-2xl font-bold text-[#EDE9FE]">50K+</p>
                    <p className="text-sm text-[#9D7BEA]">Pedidos/Mes</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[rgba(249,115,22,0.05)] border border-[rgba(249,115,22,0.2)]">
                    <Clock className="w-6 h-6 text-[#F97316] mb-2" />
                    <p className="text-2xl font-bold text-[#EDE9FE]">Offline</p>
                    <p className="text-sm text-[#9D7BEA]">100% Funcional</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[rgba(167,139,250,0.5)]">Demo credentials</p>
                  <p className="text-sm text-[#9D7BEA] font-mono">bakery@demo.tt / demo123</p>
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
              Todo para tu Panadería
            </h2>
            <p className="text-[#9D7BEA] max-w-2xl mx-auto">
              Un sistema completo diseñado con feedback de más de 40 panaderías del Caribe.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-2xl bg-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)] hover:border-[#F97316]/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center mb-4">
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
              Planes para Panaderías
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
                    ? 'bg-gradient-to-b from-[rgba(249,115,22,0.1)] to-[rgba(249,115,22,0.05)] border-2 border-[#F97316]' 
                    : 'bg-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)]'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#F97316] text-black text-xs font-bold">
                    Más Popular
                  </span>
                )}
                
                <h3 className="text-xl font-bold text-[#EDE9FE] mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-[#F97316]">{plan.price}</span>
                  <span className="text-[#9D7BEA]">{plan.period}</span>
                </div>
                <p className="text-sm text-[#9D7BEA] mb-2">{plan.users}</p>
                <p className="text-xs text-[#9D7BEA] mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-sm text-[#9D7BEA]">
                      <CheckCircle className="w-4 h-4 text-[#F97316] mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={`/portal?industry=bakery&plan=${plan.name.toLowerCase()}`}
                  className={`block w-full py-3 rounded-lg text-center font-medium transition-all ${
                    plan.popular 
                      ? 'bg-[#F97316] text-white hover:bg-[#EA580C]' 
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
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[rgba(249,115,22,0.2)] to-[rgba(251,191,36,0.2)] border border-[rgba(249,115,22,0.3)]">
            <h2 className="text-3xl md:text-4xl font-bold text-[#EDE9FE] mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
              ¿Listo para profesionalizar tu panadería?
            </h2>
            <p className="text-[#9D7BEA] mb-6 max-w-xl mx-auto">
              Únete a más de 40 panaderías que ya usan NexusOS. 
              Implementación en 48 horas, sin contratos largos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/portal?industry=bakery"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-[#F97316]/20"
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
            © 2024 NexusOS Bakery. Hecho con ❤️ en Trinidad & Tobago 🇹🇹
          </p>
        </div>
      </footer>
    </div>
  );
}
