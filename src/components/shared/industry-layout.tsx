'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Home, Settings, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface IndustryLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  iconColor?: string;
  industryPath: string;
  showBackToControl?: boolean;
}

/**
 * IndustryLayout - Layout reutilizable para todas las páginas de industria
 * Incluye navegación con botón "atrás" a la Torre de Control
 */
export function IndustryLayout({ 
  children, 
  title, 
  subtitle, 
  icon: Icon, 
  iconColor = '#6C3FCE',
  industryPath,
  showBackToControl = true
}: IndustryLayoutProps) {
  const { theme, toggleTheme, language, toggleLanguage } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Back button + Logo */}
          <div className="flex items-center gap-4">
            {showBackToControl && (
              <Link 
                href="/admin" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                title="Volver a Torre de Control"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Torre de Control</span>
              </Link>
            )}
            
            <div className="flex items-center gap-3">
              {Icon && (
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${iconColor}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: iconColor }} />
                </div>
              )}
              <div>
                <h1 className="font-semibold text-foreground">{title}</h1>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
              </div>
            </div>
          </div>

          {/* Right: Theme/Language toggles + Quick links */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors text-sm"
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">{language.toUpperCase()}</span>
            </button>
            <Link 
              href={`/${industryPath}`}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Dashboard"
            >
              <Home className="w-5 h-5" />
            </Link>
            <Link 
              href={`/${industryPath}?tab=settings`}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Configuración"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

/**
 * BackToControl - Botón flotante para volver a la Torre de Control
 * Útil para páginas que no usan el layout completo
 */
export function BackToControl({ className = '' }: { className?: string }) {
  return (
    <Link 
      href="/admin" 
      className={`fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-[var(--nexus-gold)] text-white shadow-lg shadow-[var(--nexus-gold)]/20 hover:opacity-90 transition-opacity ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">Torre de Control</span>
    </Link>
  );
}

/**
 * IndustryNavbar - Navbar simple para páginas internas de industria
 */
export function IndustryNavbar({ 
  items, 
  activePath 
}: { 
  items: { label: string; href: string; icon?: React.ElementType }[];
  activePath: string;
}) {
  return (
    <nav className="flex items-center gap-1 px-4 py-2 overflow-x-auto">
      {items.map((item) => {
        const isActive = activePath === item.href || activePath.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            {item.icon && <item.icon className="w-4 h-4" />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * BreadcrumbNavigation - Navegación de migas de pan
 */
export function BreadcrumbNavigation({ 
  items 
}: { 
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex items-center gap-2 text-sm px-4 py-2">
      <Link href="/" className="text-muted-foreground hover:text-foreground">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="text-muted-foreground">/</span>
          {item.href ? (
            <Link href={item.href} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default IndustryLayout;
