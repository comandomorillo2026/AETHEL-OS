'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/contexts/theme-context';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  Menu,
  X,
  DollarSign,
  Pill,
  FlaskConical,
  Package,
  BarChart3,
  Heart,
  ClipboardList,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import { useState } from 'react';

interface ClinicLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function ClinicLayout({ children, activeTab = 'dashboard', onTabChange }: ClinicLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, language, toggleLanguage } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    setSidebarOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'appointments', label: 'Citas', icon: Calendar },
    { id: 'records', label: 'Expedientes', icon: FileText },
    { id: 'billing', label: 'Facturación', icon: DollarSign },
    { id: 'prescriptions', label: 'Recetas', icon: Pill },
    { id: 'lab', label: 'Laboratorio', icon: FlaskConical },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'nurse', label: 'Portal Enfermería', icon: Heart },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-card border-b border-border flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)} className="text-foreground">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-foreground">NexusOS</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-muted-foreground" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
          </button>
          <button 
            onClick={toggleLanguage}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            <Globe className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[var(--nexus-gold)]" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 h-full bg-card" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 flex items-center justify-between border-b border-border">
              <span className="font-bold text-foreground">Menú</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <nav className="p-4">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === item.id
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-card border-r border-border flex-col hidden md:flex min-h-screen">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <div>
                <h1 className="font-bold text-foreground" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  NexusOS
                </h1>
                <p className="text-xs text-[var(--success)]">🏥 Clínica</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      activeTab === item.id
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--nexus-aqua)] to-[var(--nexus-blue)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">{user?.name?.charAt(0) || 'C'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Admin Clínica</p>
              </div>
              <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Desktop Header */}
          <header className="h-16 bg-card/50 border-b border-border items-center justify-between px-6 hidden md:flex">
            <h2 className="text-lg font-semibold text-foreground">
              {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-muted-foreground" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
              </button>
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              >
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">{language.toUpperCase()}</span>
              </button>
              <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--nexus-gold)]" />
              </button>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 overflow-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
