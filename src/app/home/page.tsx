'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/theme-context';
import { 
  Shield,
  ArrowRight,
  Globe,
  Hospital, 
  Heart,
  Users,
  Calendar,
  DollarSign,
  Pill,
  FlaskConical,
  Package,
  BarChart3,
  User,
  Scissors,
  Scale,
  Cookie,
  Building2,
  Sun,
  Moon,
  Languages,
  Menu,
  X
} from 'lucide-react';

export default function HubPage() {
  const { theme, toggleTheme, language, toggleLanguage } = useTheme();

  const t = {
    es: {
      title: 'Centro de Control',
      subtitle: 'Accede a todos los módulos del sistema desde un solo lugar. Selecciona el área que necesitas gestionar.',
      login: 'Iniciar Sesión',
      portalSales: 'Portal de Ventas',
      towerControl: 'Torre de Control',
      towerDesc: 'Panel de administración del dueño.',
      patientPortal: 'Portal de Pacientes',
      patientDesc: 'Citas, resultados, recetas, facturas.',
      clinic: 'Clínica',
      clinicDesc: 'Pacientes, citas, facturación.',
      nurse: 'Enfermería',
      nurseDesc: 'SBAR, signos vitales, MAR.',
      beauty: 'Salón de Belleza',
      beautyDesc: 'Citas, POS, finanzas.',
      lawfirm: 'Bufete de Abogados',
      lawfirmDesc: 'Casos, clientes, documentos.',
      bakery: 'Panadería',
      bakeryDesc: 'POS, producción, pedidos.',
      pharmacy: 'Farmacia',
      pharmacyDesc: 'Inventario, recetas, ventas.',
      insurance: 'Seguros',
      insuranceDesc: 'Pólizas, reclamaciones, clientes.',
      complete: 'Completo',
      sbar: 'SBAR',
      beautyTag: 'Beauty',
      nuevo: 'Nuevo',
      autoService: 'Autoservicio',
      marketing: 'Marketing',
      active: 'Activo',
      admin: 'Admin',
      credentials: 'Credenciales de Acceso (Demo)',
      superAdmin: 'Super Admin (Dueño)',
      superAdminDesc: 'Acceso total: Torre de Control + todo',
      clinicAdmin: 'Admin de Clínica (Tenant)',
      clinicAdminDesc: 'Acceso: Sistema de Clínica + Portal Enfermería',
      copyright: 'NexusOS © 2024 — Sistema de Gestión Empresarial para el Caribe'
    },
    en: {
      title: 'Control Center',
      subtitle: 'Access all system modules from one place. Select the area you need to manage.',
      login: 'Log In',
      portalSales: 'Sales Portal',
      towerControl: 'Control Tower',
      towerDesc: 'Owner administration panel.',
      patientPortal: 'Patient Portal',
      patientDesc: 'Appointments, results, prescriptions, invoices.',
      clinic: 'Clinic',
      clinicDesc: 'Patients, appointments, billing.',
      nurse: 'Nursing',
      nurseDesc: 'SBAR, vital signs, MAR.',
      beauty: 'Beauty Salon',
      beautyDesc: 'Appointments, POS, finance.',
      lawfirm: 'Law Firm',
      lawfirmDesc: 'Cases, clients, documents.',
      bakery: 'Bakery',
      bakeryDesc: 'POS, production, orders.',
      pharmacy: 'Pharmacy',
      pharmacyDesc: 'Inventory, prescriptions, sales.',
      insurance: 'Insurance',
      insuranceDesc: 'Policies, claims, clients.',
      complete: 'Complete',
      sbar: 'SBAR',
      beautyTag: 'Beauty',
      nuevo: 'New',
      autoService: 'Self-service',
      marketing: 'Marketing',
      active: 'Active',
      admin: 'Admin',
      credentials: 'Access Credentials (Demo)',
      superAdmin: 'Super Admin (Owner)',
      superAdminDesc: 'Full access: Control Tower + everything',
      clinicAdmin: 'Clinic Admin (Tenant)',
      clinicAdminDesc: 'Access: Clinic System + Nursing Portal',
      copyright: 'NexusOS © 2024 — Business Management System for the Caribbean'
    }
  };

  const currentT = t[language];

  const industries = [
    { 
      icon: Hospital, 
      name: currentT.clinic, 
      desc: currentT.clinicDesc, 
      color: '#22D3EE', 
      href: '/clinic',
      tag: currentT.complete,
      tagColor: 'bg-[#22D3EE]/20 text-[#22D3EE]'
    },
    { 
      icon: Heart, 
      name: currentT.nurse, 
      desc: currentT.nurseDesc, 
      color: '#34D399', 
      href: '/nurse',
      tag: currentT.sbar,
      tagColor: 'bg-[#34D399]/20 text-[#34D399]'
    },
    { 
      icon: Scissors, 
      name: currentT.beauty, 
      desc: currentT.beautyDesc, 
      color: '#EC4899', 
      href: '/beauty',
      tag: currentT.beautyTag,
      tagColor: 'bg-[#EC4899]/20 text-[#EC4899]'
    },
    { 
      icon: Scale, 
      name: currentT.lawfirm, 
      desc: currentT.lawfirmDesc, 
      color: '#C4A35A', 
      href: '/lawfirm',
      tag: currentT.complete,
      tagColor: 'bg-[#C4A35A]/20 text-[#C4A35A]'
    },
    { 
      icon: Cookie, 
      name: currentT.bakery, 
      desc: currentT.bakeryDesc, 
      color: '#F97316', 
      href: '/bakery',
      tag: currentT.complete,
      tagColor: 'bg-[#F97316]/20 text-[#F97316]'
    },
    { 
      icon: Pill, 
      name: currentT.pharmacy, 
      desc: currentT.pharmacyDesc, 
      color: '#10B981', 
      href: '/pharmacy',
      tag: currentT.nuevo,
      tagColor: 'bg-[#10B981]/20 text-[#10B981]'
    },
    { 
      icon: Building2, 
      name: currentT.insurance, 
      desc: currentT.insuranceDesc, 
      color: '#2563EB', 
      href: '/insurance',
      tag: currentT.nuevo,
      tagColor: 'bg-[#2563EB]/20 text-[#2563EB]'
    },
  ];

  return (
    <div className={`min-h-screen transition-colors ${theme === 'dark' ? 'bg-[#050410]' : 'bg-gray-50'}`}>
      {/* Aurora Background */}
      <div className="aurora-bg" />
      
      {/* Header */}
      <header className={`relative z-10 border-b transition-colors ${theme === 'dark' ? 'border-[rgba(167,139,250,0.1)] bg-[#0A0820]/80' : 'border-gray-200 bg-white/80'} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-colors ${theme === 'dark' ? 'text-[#EDE9FE]' : 'text-gray-900'}`} style={{ fontFamily: 'var(--font-cormorant)' }}>
                NexusOS
              </h1>
              <p className={`text-xs transition-colors ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-500'}`}>
                {language === 'es' ? 'Sistema de Gestión Empresarial' : 'Business Management System'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                theme === 'dark' 
                  ? 'bg-[rgba(108,63,206,0.2)] text-[#EDE9FE] hover:bg-[rgba(108,63,206,0.3)]' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Languages className="w-4 h-4" />
              {language === 'es' ? 'ES' : 'EN'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${
                theme === 'dark' 
                  ? 'bg-[rgba(108,63,206,0.2)] text-[#FBBF24] hover:bg-[rgba(108,63,206,0.3)]' 
                  : 'bg-gray-100 text-[#F97316] hover:bg-gray-200'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link 
              href="/login" 
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {currentT.login}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${theme === 'dark' ? 'text-[#EDE9FE]' : 'text-gray-900'}`} style={{ fontFamily: 'var(--font-cormorant)' }}>
            {currentT.title}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto transition-colors ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-600'}`}>
            {currentT.subtitle}
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Portal de Pacientes */}
          <Link href="/portal-paciente" className="group">
            <div className={`p-6 rounded-xl h-full transition-colors hover:scale-[1.02] ${
              theme === 'dark' 
                ? 'bg-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)] hover:border-[#F87171]/50' 
                : 'bg-white border border-gray-200 hover:border-red-300 hover:shadow-lg'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F87171] to-[#dc2626] flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 transition-colors ${theme === 'dark' ? 'text-[#EDE9FE]' : 'text-gray-900'}`}>{currentT.patientPortal}</h3>
              <p className={`text-sm mb-4 transition-colors ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-500'}`}>{currentT.patientDesc}</p>
              <span className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-[#F87171]/20 text-[#F87171]' : 'bg-red-100 text-red-600'}`}>{currentT.autoService}</span>
            </div>
          </Link>

          {/* Portal de Ventas */}
          <Link href="/portal" className="group">
            <div className={`p-6 rounded-xl h-full transition-colors hover:scale-[1.02] ${
              theme === 'dark' 
                ? 'bg-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)] hover:border-[#6C3FCE]/50' 
                : 'bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 transition-colors ${theme === 'dark' ? 'text-[#EDE9FE]' : 'text-gray-900'}`}>{currentT.portalSales}</h3>
              <p className={`text-sm mb-4 transition-colors ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-500'}`}>{language === 'es' ? 'Sitio público para captar clientes.' : 'Public site to attract customers.'}</p>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-[#6C3FCE]/20 text-[#B197FC]' : 'bg-purple-100 text-purple-600'}`}>{currentT.marketing}</span>
                <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">{currentT.active}</span>
              </div>
            </div>
          </Link>

          {/* Torre de Control */}
          <Link href="/admin" className="group">
            <div className={`p-6 rounded-xl h-full transition-colors hover:scale-[1.02] ${
              theme === 'dark' 
                ? 'bg-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)] hover:border-[#F0B429]/50' 
                : 'bg-white border border-gray-200 hover:border-amber-300 hover:shadow-lg'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F0B429] to-[#d97706] flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 transition-colors ${theme === 'dark' ? 'text-[#EDE9FE]' : 'text-gray-900'}`}>{currentT.towerControl}</h3>
              <p className={`text-sm mb-4 transition-colors ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-500'}`}>{currentT.towerDesc}</p>
              <span className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-[#F0B429]/20 text-[#F0B429]' : 'bg-amber-100 text-amber-600'}`}>{currentT.admin}</span>
            </div>
          </Link>
        </div>

        {/* All Industries Section */}
        <div className="mb-12">
          <h3 className={`text-2xl font-bold mb-6 transition-colors ${theme === 'dark' ? 'text-[#EDE9FE]' : 'text-gray-900'}`} style={{ fontFamily: 'var(--font-cormorant)' }}>
            {language === 'es' ? 'Las 7 Industrias' : 'The 7 Industries'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <Link key={index} href={industry.href} className="group">
                <div className={`p-5 rounded-xl h-full transition-all hover:scale-[1.02] ${
                  theme === 'dark' 
                    ? 'bg-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)] hover:border-[rgba(167,139,250,0.3)]' 
                    : 'bg-white border border-gray-200 hover:shadow-lg'
                }`}>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${industry.color}20` }}
                  >
                    <industry.icon className="w-6 h-6" style={{ color: industry.color }} />
                  </div>
                  <h4 className={`font-semibold mb-1 transition-colors ${theme === 'dark' ? 'text-[#EDE9FE]' : 'text-gray-900'}`}>{industry.name}</h4>
                  <p className={`text-sm mb-3 transition-colors ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-500'}`}>{industry.desc}</p>
                  <span className={`text-xs px-2 py-1 rounded ${industry.tagColor}`}>{industry.tag}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Credentials */}
        <div className={`p-6 rounded-xl transition-colors ${
          theme === 'dark' 
            ? 'bg-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)]' 
            : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 transition-colors ${theme === 'dark' ? 'text-[#EDE9FE]' : 'text-gray-900'}`}>
            <Shield className="w-5 h-5 text-[#F0B429]" />
            {currentT.credentials}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[rgba(240,180,41,0.1)] border border-[#F0B429]/20' : 'bg-amber-50 border border-amber-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#F0B429]" />
                <span className={`font-medium ${theme === 'dark' ? 'text-[#EDE9FE]' : 'text-gray-900'}`}>{currentT.superAdmin}</span>
              </div>
              <p className={`text-sm font-mono ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-600'}`}>admin@nexusos.tt</p>
              <p className={`text-sm font-mono ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-600'}`}>admin123</p>
              <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-[rgba(167,139,250,0.5)]' : 'text-gray-400'}`}>{currentT.superAdminDesc}</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[rgba(34,211,238,0.1)] border border-[#22D3EE]/20' : 'bg-cyan-50 border border-cyan-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Hospital className="w-4 h-4 text-[#22D3EE]" />
                <span className={`font-medium ${theme === 'dark' ? 'text-[#EDE9FE]' : 'text-gray-900'}`}>{currentT.clinicAdmin}</span>
              </div>
              <p className={`text-sm font-mono ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-600'}`}>clinic@demo.tt</p>
              <p className={`text-sm font-mono ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-600'}`}>demo123</p>
              <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-[rgba(167,139,250,0.5)]' : 'text-gray-400'}`}>{currentT.clinicAdminDesc}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 border-t mt-12 transition-colors ${theme === 'dark' ? 'border-[rgba(167,139,250,0.1)] bg-[#0A0820]/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-[#9D7BEA]' : 'text-gray-500'}`}>
            {currentT.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}
