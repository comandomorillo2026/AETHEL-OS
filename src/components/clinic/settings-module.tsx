'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  Palette, 
  FileText, 
  Bell, 
  CreditCard,
  Clock,
  Upload,
  Eye,
  Save,
  RotateCcw
} from 'lucide-react';

export function ClinicSettingsModule() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    clinicName: 'Clínica Demo',
    legalName: 'Clínica Demo S.A.',
    email: 'info@clinicademo.tt',
    phone: '+1 868 555-0100',
    address: '123 Calle Principal, Puerto España',
    primaryColor: '#6C3FCE',
    secondaryColor: '#F0B429',
    accentColor: '#C026D3',
    invoicePrefix: 'INV',
    invoiceNotes: 'Gracias por su preferencia',
    currency: 'TTD',
    taxRate: '12.5',
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'invoice', label: 'Facturas', icon: FileText },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'reminders', label: 'Recordatorios', icon: Bell },
    { id: 'schedule', label: 'Horarios', icon: Clock },
  ];

  const colorPresets = [
    { name: 'Violeta', primary: '#6C3FCE', secondary: '#F0B429', accent: '#C026D3' },
    { name: 'Azul', primary: '#3B82F6', secondary: '#22D3EE', accent: '#6366F1' },
    { name: 'Verde', primary: '#10B981', secondary: '#34D399', accent: '#059669' },
    { name: 'Rojo', primary: '#EF4444', secondary: '#F87171', accent: '#DC2626' },
    { name: 'Naranja', primary: '#F59E0B', secondary: '#FBBF24', accent: '#D97706' },
    { name: 'Rosa', primary: '#EC4899', secondary: '#F472B6', accent: '#DB2777' },
  ];

  const handleColorPreset = (preset: typeof colorPresets[0]) => {
    setSettings(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    }));
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Configuración</h1>
        <p className="text-[var(--text-mid)] text-sm">Personaliza tu clínica según tus necesidades</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:w-48 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[var(--nexus-violet)]/20 text-[var(--nexus-violet-lite)]'
                  : 'text-[var(--text-mid)] hover:bg-[var(--glass)]'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 glass-card p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Información General</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Nombre de la Clínica</Label>
                  <Input
                    value={settings.clinicName}
                    onChange={(e) => setSettings(prev => ({ ...prev, clinicName: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Nombre Legal</Label>
                  <Input
                    value={settings.legalName}
                    onChange={(e) => setSettings(prev => ({ ...prev, legalName: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Email</Label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Teléfono</Label>
                  <Input
                    value={settings.phone}
                    onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[var(--text-mid)]">Dirección</Label>
                  <Input
                    value={settings.address}
                    onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Branding Settings */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Branding y Colores</h2>
              
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="text-[var(--text-mid)]">Logo de la Clínica</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-[var(--text-dim)]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Subir Logo
                    </Button>
                    <p className="text-xs text-[var(--text-dim)]">PNG, JPG hasta 2MB</p>
                  </div>
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-2">
                <Label className="text-[var(--text-mid)]">Colores Predefinidos</Label>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleColorPreset(preset)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)] hover:border-[var(--nexus-violet)] transition-colors"
                    >
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <span className="text-xs text-[var(--text-mid)]">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Color Primario</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Color Secundario</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Color de Acento</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label className="text-[var(--text-mid)]">Vista Previa</Label>
                <div 
                  className="p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: `${settings.primaryColor}10`,
                    borderColor: `${settings.primaryColor}30`
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      <span className="text-white font-bold">N</span>
                    </div>
                    <div>
                      <p className="font-bold" style={{ color: settings.primaryColor }}>{settings.clinicName}</p>
                      <p className="text-xs text-[var(--text-dim)]">Vista previa del branding</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="px-4 py-2 rounded text-sm font-medium"
                      style={{ backgroundColor: settings.secondaryColor, color: '#000' }}
                    >
                      Botón Primario
                    </button>
                    <button 
                      className="px-4 py-2 rounded text-sm font-medium border"
                      style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
                    >
                      Botón Secundario
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoice Settings */}
          {activeTab === 'invoice' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Configuración de Facturas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Prefijo de Factura</Label>
                  <Input
                    value={settings.invoicePrefix}
                    onChange={(e) => setSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))}
                    placeholder="INV"
                  />
                  <p className="text-xs text-[var(--text-dim)]">Las facturas serán: {settings.invoicePrefix}-2026-0001</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Moneda</Label>
                  <select 
                    className="w-full h-10 px-3 rounded-lg"
                    value={settings.currency}
                    onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                  >
                    <option value="TTD">TTD - Dólar Trinitense</option>
                    <option value="USD">USD - Dólar Americano</option>
                    <option value="GYD">GYD - Dólar Guyanés</option>
                    <option value="BBD">BBD - Dólar Barbadense</option>
                    <option value="JMD">JMD - Dólar Jamaiquino</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Tasa de Impuesto (%)</Label>
                  <Input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => setSettings(prev => ({ ...prev, taxRate: e.target.value }))}
                    placeholder="12.5"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[var(--text-mid)]">Nota en Facturas</Label>
                  <Input
                    value={settings.invoiceNotes}
                    onChange={(e) => setSettings(prev => ({ ...prev, invoiceNotes: e.target.value }))}
                    placeholder="Gracias por su preferencia"
                  />
                </div>
              </div>

              {/* Invoice Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[var(--text-mid)]">Vista Previa de Factura</Label>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    Ver PDF
                  </Button>
                </div>
                <div className="p-6 rounded-lg bg-white text-black">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: settings.primaryColor }}
                      >
                        <span className="text-white font-bold">N</span>
                      </div>
                      <div>
                        <p className="font-bold text-lg" style={{ color: settings.primaryColor }}>{settings.clinicName}</p>
                        <p className="text-xs text-gray-500">{settings.address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">FACTURA</p>
                      <p className="text-sm text-gray-500">{settings.invoicePrefix}-2026-0001</p>
                      <p className="text-xs text-gray-400">Fecha: 26/03/2026</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <p className="text-xs text-gray-500 mb-1">FACTURAR A:</p>
                    <p className="font-medium">María González</p>
                    <p className="text-sm text-gray-500">+1 868 555-0001</p>
                  </div>
                  
                  <table className="w-full mb-4">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-xs text-gray-500">Descripción</th>
                        <th className="text-right py-2 text-xs text-gray-500">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2">Consulta General</td>
                        <td className="py-2 text-right">TT$200.00</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>TT$200.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Impuesto ({settings.taxRate}%):</span>
                      <span>TT$25.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                      <span>Total:</span>
                      <span style={{ color: settings.primaryColor }}>TT$225.00</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-400">{settings.invoiceNotes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-[var(--glass-border)]">
            <Button variant="outline" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Restablecer
            </Button>
            <Button className="btn-gold flex items-center gap-2">
              <Save className="w-4 h-4" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
