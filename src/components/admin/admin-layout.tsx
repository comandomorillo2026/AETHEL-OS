'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CreditCard, 
  Settings,
  Bell,
  ChevronRight,
  Globe,
  DollarSign,
  Shield,
  Plus,
  Menu,
  X,
  Home,
  TrendingUp,
  Target,
  Sun,
  Moon,
  Database,
  FileText,
  Megaphone,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function AdminLayout({ children, activeTab = 'dashboard', onTabChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('es');

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const toggleLanguage = () => setLanguage(l => l === 'es' ? 'en' : 'es');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Órdenes', icon: CreditCard },
    { id: 'tenants', label: 'Inquilinos', icon: Building2 },
    { id: 'industries', label: 'Industrias', icon: Globe },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'broadcasts', label: 'Comunicados', icon: Megaphone },
    { id: 'competitive', label: 'Análisis Competitivo', icon: Target },
    { id: 'scalability', label: 'Escalabilidad', icon: TrendingUp },
    { id: 'database', label: 'Base de Datos', icon: Database },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'pricing', label: 'Precios', icon: DollarSign },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050410] flex">
      {/* Aurora Background */}
      <div className="aurora-bg" />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-72 bg-[#0A0820]/95 border-r border-[rgba(167,139,250,0.1)] 
        flex flex-col transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        backdrop-blur-xl
      `}>
        {/* Logo Header */}
        <div className="p-4 border-b border-[rgba(167,139,250,0.1)]">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F0B429] to-[#d97706] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-[#EDE9FE]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  NexusOS
                </h1>
                <p className="text-xs text-[#F0B429]">Torre de Control</p>
              </div>
            </Link>
            <button 
              className="md:hidden text-[#9D7BEA]"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {/* Main Navigation */}
          <div className="mb-4">
            <p className="text-xs font-medium text-[#9D7BEA] uppercase px-3 mb-2">Principal</p>
            <ul className="space-y-1">
              {navItems.slice(0, 6).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      activeTab === item.id
                        ? 'bg-[#F0B429]/10 text-[#F0B429] border border-[#F0B429]/20'
                        : 'text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.1)] hover:text-[#EDE9FE]'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Analysis */}
          <div className="mb-4">
            <p className="text-xs font-medium text-[#9D7BEA] uppercase px-3 mb-2">Herramientas</p>
            <ul className="space-y-1">
              {navItems.slice(6, 9).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      activeTab === item.id
                        ? 'bg-[#F0B429]/10 text-[#F0B429] border border-[#F0B429]/20'
                        : 'text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.1)] hover:text-[#EDE9FE]'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Configuration */}
          <div>
            <p className="text-xs font-medium text-[#9D7BEA] uppercase px-3 mb-2">Configuración</p>
            <ul className="space-y-1">
              {navItems.slice(9).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      activeTab === item.id
                        ? 'bg-[#F0B429]/10 text-[#F0B429] border border-[#F0B429]/20'
                        : 'text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.1)] hover:text-[#EDE9FE]'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Quick Actions */}
        <div className="p-3 border-t border-[rgba(167,139,250,0.1)]">
          <button
            onClick={() => handleNavClick('create-tenant')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#F0B429] to-[#d97706] text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            <span>Crear Inquilino</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-[rgba(167,139,250,0.1)]">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(108,63,206,0.07)]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F0B429] to-[#C026D3] flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#EDE9FE] truncate">Administrador</p>
              <p className="text-xs text-[#F0B429]">Super Admin</p>
            </div>
            <div className="flex items-center gap-1">
              <Link 
                href="/portal" 
                className="p-2 rounded-lg hover:bg-[rgba(108,63,206,0.1)] text-[#9D7BEA] hover:text-[#EDE9FE] transition-colors"
                title="Portal de Ventas"
              >
                <Home className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Header */}
        <header className="h-14 bg-[#0A0820]/80 border-b border-[rgba(167,139,250,0.1)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-[rgba(108,63,206,0.1)] text-[#9D7BEA]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <Link href="/admin" className="text-[#9D7BEA] hover:text-[#EDE9FE]">
                Torre de Control
              </Link>
              <ChevronRight className="w-4 h-4 text-[#9D7BEA]" />
              <span className="text-[#EDE9FE] font-medium">
                {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[rgba(108,63,206,0.1)] transition-colors"
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-[#9D7BEA]" /> : <Moon className="w-5 h-5 text-[#9D7BEA]" />}
            </button>
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[rgba(108,63,206,0.1)] transition-colors text-sm"
            >
              <Globe className="w-4 h-4 text-[#9D7BEA]" />
              <span className="font-medium text-[#9D7BEA]">{language.toUpperCase()}</span>
            </button>
            <button className="relative p-2 rounded-lg hover:bg-[rgba(108,63,206,0.1)] transition-colors">
              <Bell className="w-5 h-5 text-[#9D7BEA]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F0B429]" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
