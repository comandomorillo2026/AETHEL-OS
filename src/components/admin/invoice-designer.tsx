'use client';

import React, { useState, useRef } from 'react';
import { AdminLayout } from './admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Palette,
  Type,
  LayoutTemplate,
  Upload,
  Save,
  Eye,
  Undo,
  Redo,
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  CheckCircle,
  Download
} from 'lucide-react';

// Color presets
const COLOR_PRESETS = [
  { name: 'Nexus Violet', primary: '#6C3FCE', secondary: '#8B5CF6', accent: '#C026D3' },
  { name: 'Ocean Blue', primary: '#3B82F6', secondary: '#22D3EE', accent: '#06B6D4' },
  { name: 'Forest Green', primary: '#10B981', secondary: '#34D399', accent: '#059669' },
  { name: 'Sunset Gold', primary: '#F0B429', secondary: '#FCD34D', accent: '#D97706' },
  { name: 'Rose Pink', primary: '#EC4899', secondary: '#F472B6', accent: '#DB2777' },
  { name: 'Slate Gray', primary: '#475569', secondary: '#64748B', accent: '#334155' },
];

// Font options
const FONT_OPTIONS = [
  { name: 'DM Sans', label: 'DM Sans (Modern)' },
  { name: 'Cormorant Garamond', label: 'Cormorant (Elegant)' },
  { name: 'DM Mono', label: 'DM Mono (Technical)' },
  { name: 'Georgia', label: 'Georgia (Classic)' },
  { name: 'Arial', label: 'Arial (Clean)' },
];

// Template definitions
const TEMPLATES = [
  { 
    id: 'modern', 
    name: 'Moderno', 
    description: 'Diseño limpio y minimalista',
    layout: 'left-aligned',
    style: 'borderless'
  },
  { 
    id: 'classic', 
    name: 'Clásico', 
    description: 'Estilo tradicional profesional',
    layout: 'centered',
    style: 'bordered'
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    description: 'Solo lo esencial',
    layout: 'right-aligned',
    style: 'compact'
  },
];

// Mock invoice data for preview
const PREVIEW_DATA = {
  invoiceNumber: 'INV-2026-0001',
  date: '25/03/2026',
  dueDate: '25/04/2026',
  from: {
    name: 'NexusOS',
    address: 'Tower D, International Waterfront Centre',
    city: 'Port of Spain, Trinidad & Tobago',
    email: 'billing@nexusos.tt',
    phone: '+1 868 555-0100'
  },
  to: {
    name: 'Clínica San Fernando',
    address: '123 Calle Principal',
    city: 'San Fernando, Trinidad & Tobago',
    email: 'admin@clinicaf.tt',
    phone: '+1 868 555-0200'
  },
  items: [
    { description: 'Plan Growth - Mensual', quantity: 1, price: 1200, total: 1200 },
    { description: 'Activación Inicial', quantity: 1, price: 1250, total: 1250 },
  ],
  subtotal: 2450,
  tax: 306.25,
  taxRate: 12.5,
  total: 2756.25
};

interface InvoiceTemplate {
  name: string;
  template: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  logo: {
    url: string | null;
    position: 'left' | 'center' | 'right';
    size: 'small' | 'medium' | 'large';
  };
  header: {
    showInvoiceNumber: boolean;
    showDate: boolean;
    showDueDate: boolean;
    customText: string;
  };
  footer: {
    showBankInfo: boolean;
    showTerms: boolean;
    customText: string;
    bankName: string;
    accountNumber: string;
  };
}

// Invoice Preview Component - defined outside to avoid the lint error
function InvoicePreview({ template }: { template: InvoiceTemplate }) {
  return (
    <div 
      className="bg-white text-gray-900 rounded-lg shadow-xl overflow-hidden"
      style={{ minHeight: '700px' }}
    >
      {/* Header */}
      <div 
        className="p-6"
        style={{ 
          backgroundColor: template.colors.primary,
          background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`
        }}
      >
        <div className={`flex items-center justify-${template.logo.position === 'left' ? 'between' : template.logo.position === 'right' ? 'start' : 'center'} gap-4`}>
          {template.logo.position !== 'right' && (
            <div className="flex items-center gap-4">
              {template.logo.url ? (
                <img 
                  src={template.logo.url} 
                  alt="Logo" 
                  className={template.logo.size === 'small' ? 'h-8' : template.logo.size === 'large' ? 'h-16' : 'h-12'}
                />
              ) : (
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
              )}
              <div className="text-white">
                <h1 style={{ fontFamily: template.fonts.heading }} className="text-2xl font-bold">
                  {PREVIEW_DATA.from.name}
                </h1>
                <p className="text-white/80 text-sm">{PREVIEW_DATA.from.address}</p>
              </div>
            </div>
          )}
          
          <div className="text-white text-right">
            {template.header.showInvoiceNumber && (
              <p className="text-lg font-bold">FACTURA</p>
            )}
            {template.header.showInvoiceNumber && (
              <p className="text-white/80">{PREVIEW_DATA.invoiceNumber}</p>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 style={{ fontFamily: template.fonts.heading, color: template.colors.primary }} className="font-semibold mb-2">
              Facturar a:
            </h3>
            <p className="font-medium">{PREVIEW_DATA.to.name}</p>
            <p className="text-gray-600 text-sm">{PREVIEW_DATA.to.address}</p>
            <p className="text-gray-600 text-sm">{PREVIEW_DATA.to.city}</p>
            <p className="text-gray-600 text-sm">{PREVIEW_DATA.to.email}</p>
          </div>
          <div className="text-right">
            <div className="space-y-1">
              {template.header.showDate && (
                <p className="text-sm"><span className="text-gray-500">Fecha:</span> {PREVIEW_DATA.date}</p>
              )}
              {template.header.showDueDate && (
                <p className="text-sm"><span className="text-gray-500">Vence:</span> {PREVIEW_DATA.dueDate}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="p-6">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: template.colors.primary + '10' }}>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Descripción</th>
              <th className="text-center py-3 px-4 text-gray-700 font-semibold">Cantidad</th>
              <th className="text-right py-3 px-4 text-gray-700 font-semibold">Precio</th>
              <th className="text-right py-3 px-4 text-gray-700 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {PREVIEW_DATA.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700">{item.description}</td>
                <td className="py-3 px-4 text-center text-gray-700">{item.quantity}</td>
                <td className="py-3 px-4 text-right text-gray-700 font-mono">TT${item.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-right text-gray-700 font-mono">TT${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-mono">TT${PREVIEW_DATA.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>IVA ({PREVIEW_DATA.taxRate}%):</span>
              <span className="font-mono">TT${PREVIEW_DATA.tax.toFixed(2)}</span>
            </div>
            <div 
              className="flex justify-between text-lg font-bold py-2 border-t-2"
              style={{ 
                borderColor: template.colors.primary,
                color: template.colors.primary
              }}
            >
              <span>Total:</span>
              <span className="font-mono">TT${PREVIEW_DATA.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="p-6 border-t border-gray-200"
        style={{ backgroundColor: template.colors.primary + '05' }}
      >
        {template.header.customText && (
          <p className="text-gray-600 text-center mb-4 italic">{template.header.customText}</p>
        )}
        
        {template.footer.showBankInfo && (
          <div className="text-center text-sm text-gray-500 mb-4">
            <p><strong>Transferencia bancaria:</strong> {template.footer.bankName}</p>
            <p>Cuenta: {template.footer.accountNumber}</p>
          </div>
        )}
        
        {template.footer.showTerms && (
          <p className="text-center text-xs text-gray-400">{template.footer.customText}</p>
        )}
      </div>
    </div>
  );
}

export function InvoiceDesigner() {
  const [template, setTemplate] = useState<InvoiceTemplate>({
    name: 'Mi Plantilla',
    template: 'modern',
    colors: {
      primary: '#6C3FCE',
      secondary: '#8B5CF6',
      accent: '#C026D3'
    },
    fonts: {
      heading: 'DM Sans',
      body: 'DM Sans'
    },
    logo: {
      url: null,
      position: 'left',
      size: 'medium'
    },
    header: {
      showInvoiceNumber: true,
      showDate: true,
      showDueDate: true,
      customText: 'Gracias por su preferencia'
    },
    footer: {
      showBankInfo: true,
      showTerms: true,
      customText: 'Pago dentro de 30 días',
      bankName: 'First Citizens Bank',
      accountNumber: '**** **** 1234'
    }
  });

  const [savedTemplates] = useState([
    { id: '1', name: 'Estándar', lastModified: '2026-03-25' },
    { id: '2', name: 'Premium Clientes', lastModified: '2026-03-20' },
  ]);

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('template');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTemplate(prev => ({
          ...prev,
          logo: { ...prev.logo, url: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTemplate = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleColorPresetSelect = (preset: typeof COLOR_PRESETS[0]) => {
    setTemplate(prev => ({
      ...prev,
      colors: {
        primary: preset.primary,
        secondary: preset.secondary,
        accent: preset.accent
      }
    }));
  };

  return (
    <AdminLayout activeTab="settings">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Diseñador de Facturas</h1>
          <p className="text-[var(--text-mid)] text-sm">Personaliza tus facturas con tu marca</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[var(--glass-border)]">
            <Undo className="w-4 h-4 mr-2" />
            Deshacer
          </Button>
          <Button variant="outline" className="border-[var(--glass-border)]">
            <Redo className="w-4 h-4 mr-2" />
            Rehacer
          </Button>
          <Button onClick={handleSaveTemplate} className="btn-gold">
            <Save className="w-4 h-4 mr-2" />
            Guardar Plantilla
          </Button>
        </div>
      </div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 text-[var(--success)] text-sm glass-card p-3">
          <CheckCircle className="w-4 h-4" />
          Plantilla guardada exitosamente
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4 bg-[var(--obsidian-3)] h-auto">
                <TabsTrigger value="template" className="p-2 data-[state=active]:bg-[var(--nexus-violet)]/20">
                  <LayoutTemplate className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="colors" className="p-2 data-[state=active]:bg-[var(--nexus-violet)]/20">
                  <Palette className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="fonts" className="p-2 data-[state=active]:bg-[var(--nexus-violet)]/20">
                  <Type className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="content" className="p-2 data-[state=active]:bg-[var(--nexus-violet)]/20">
                  <FileText className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>

              {/* Template Tab */}
              <TabsContent value="template" className="mt-0 space-y-4">
                <div>
                  <Label className="text-[var(--text-mid)] text-sm mb-3 block">Plantilla Base</Label>
                  <div className="space-y-2">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTemplate(prev => ({ ...prev, template: t.id }))}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          template.template === t.id
                            ? 'border-[var(--nexus-violet)] bg-[var(--nexus-violet)]/10'
                            : 'border-[var(--glass-border)] bg-[var(--glass)] hover:border-[var(--nexus-violet)]/50'
                        }`}
                      >
                        <p className="text-[var(--text-primary)] font-medium">{t.name}</p>
                        <p className="text-[var(--text-dim)] text-xs">{t.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-[var(--text-mid)] text-sm mb-3 block">Logo</Label>
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed border-2 h-20"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-5 h-5 text-[var(--text-dim)]" />
                        <span className="text-sm text-[var(--text-dim)]">
                          {template.logo.url ? 'Cambiar Logo' : 'Subir Logo'}
                        </span>
                      </div>
                    </Button>

                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-[var(--text-mid)] text-xs">Posición</Label>
                      {(['left', 'center', 'right'] as const).map((pos) => (
                        <button
                          key={pos}
                          onClick={() => setTemplate(prev => ({
                            ...prev,
                            logo: { ...prev.logo, position: pos }
                          }))}
                          className={`p-2 rounded text-xs ${
                            template.logo.position === pos
                              ? 'bg-[var(--nexus-violet)] text-white'
                              : 'bg-[var(--glass)] text-[var(--text-mid)]'
                          }`}
                        >
                          {pos === 'left' ? <AlignLeft className="w-4 h-4 mx-auto" /> : 
                           pos === 'center' ? <AlignCenter className="w-4 h-4 mx-auto" /> : 
                           <AlignRight className="w-4 h-4 mx-auto" />}
                        </button>
                      ))}
                    </div>

                    <div>
                      <Label className="text-[var(--text-mid)] text-xs mb-2 block">Tamaño</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['small', 'medium', 'large'] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() => setTemplate(prev => ({
                              ...prev,
                              logo: { ...prev.logo, size }
                            }))}
                            className={`p-2 rounded text-xs capitalize ${
                              template.logo.size === size
                                ? 'bg-[var(--nexus-violet)] text-white'
                                : 'bg-[var(--glass)] text-[var(--text-mid)]'
                            }`}
                          >
                            {size === 'small' ? 'Pequeño' : size === 'medium' ? 'Mediano' : 'Grande'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Colors Tab */}
              <TabsContent value="colors" className="mt-0 space-y-4">
                <div>
                  <Label className="text-[var(--text-mid)] text-sm mb-3 block">Preajustes de Color</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleColorPresetSelect(preset)}
                        className={`p-3 rounded-lg border transition-all ${
                          template.colors.primary === preset.primary
                            ? 'border-[var(--nexus-violet)]'
                            : 'border-[var(--glass-border)]'
                        }`}
                      >
                        <div className="flex gap-1 mb-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.primary }} />
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.secondary }} />
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.accent }} />
                        </div>
                        <p className="text-[var(--text-primary)] text-xs">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-[var(--text-mid)] text-sm mb-2 block">Color Primario</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={template.colors.primary}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          colors: { ...prev.colors, primary: e.target.value }
                        }))}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent"
                      />
                      <Input
                        value={template.colors.primary}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          colors: { ...prev.colors, primary: e.target.value }
                        }))}
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[var(--text-mid)] text-sm mb-2 block">Color Secundario</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={template.colors.secondary}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          colors: { ...prev.colors, secondary: e.target.value }
                        }))}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent"
                      />
                      <Input
                        value={template.colors.secondary}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          colors: { ...prev.colors, secondary: e.target.value }
                        }))}
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[var(--text-mid)] text-sm mb-2 block">Color de Acento</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={template.colors.accent}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          colors: { ...prev.colors, accent: e.target.value }
                        }))}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent"
                      />
                      <Input
                        value={template.colors.accent}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          colors: { ...prev.colors, accent: e.target.value }
                        }))}
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Fonts Tab */}
              <TabsContent value="fonts" className="mt-0 space-y-4">
                <div>
                  <Label className="text-[var(--text-mid)] text-sm mb-2 block">Fuente de Títulos</Label>
                  <select
                    value={template.fonts.heading}
                    onChange={(e) => setTemplate(prev => ({
                      ...prev,
                      fonts: { ...prev.fonts, heading: e.target.value }
                    }))}
                    className="w-full h-10 px-3 rounded-lg bg-[var(--obsidian-3)] border border-[var(--glass-border)] text-[var(--text-primary)]"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.name} value={font.name}>{font.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-[var(--text-mid)] text-sm mb-2 block">Fuente del Cuerpo</Label>
                  <select
                    value={template.fonts.body}
                    onChange={(e) => setTemplate(prev => ({
                      ...prev,
                      fonts: { ...prev.fonts, body: e.target.value }
                    }))}
                    className="w-full h-10 px-3 rounded-lg bg-[var(--obsidian-3)] border border-[var(--glass-border)] text-[var(--text-primary)]"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.name} value={font.name}>{font.label}</option>
                    ))}
                  </select>
                </div>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="mt-0 space-y-4">
                <div>
                  <Label className="text-[var(--text-mid)] text-sm mb-3 block">Encabezado</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-2 rounded bg-[var(--glass)]">
                      <input
                        type="checkbox"
                        checked={template.header.showInvoiceNumber}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          header: { ...prev.header, showInvoiceNumber: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <span className="text-[var(--text-primary)] text-sm">Mostrar número de factura</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded bg-[var(--glass)]">
                      <input
                        type="checkbox"
                        checked={template.header.showDate}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          header: { ...prev.header, showDate: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <span className="text-[var(--text-primary)] text-sm">Mostrar fecha</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded bg-[var(--glass)]">
                      <input
                        type="checkbox"
                        checked={template.header.showDueDate}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          header: { ...prev.header, showDueDate: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <span className="text-[var(--text-primary)] text-sm">Mostrar fecha de vencimiento</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label className="text-[var(--text-mid)] text-sm mb-2 block">Texto Personalizado</Label>
                  <Input
                    value={template.header.customText}
                    onChange={(e) => setTemplate(prev => ({
                      ...prev,
                      header: { ...prev.header, customText: e.target.value }
                    }))}
                    placeholder="Mensaje de agradecimiento..."
                  />
                </div>

                <div>
                  <Label className="text-[var(--text-mid)] text-sm mb-3 block">Pie de Página</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-2 rounded bg-[var(--glass)]">
                      <input
                        type="checkbox"
                        checked={template.footer.showBankInfo}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          footer: { ...prev.footer, showBankInfo: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <span className="text-[var(--text-primary)] text-sm">Mostrar información bancaria</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded bg-[var(--glass)]">
                      <input
                        type="checkbox"
                        checked={template.footer.showTerms}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          footer: { ...prev.footer, showTerms: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <span className="text-[var(--text-primary)] text-sm">Mostrar términos</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label className="text-[var(--text-mid)] text-sm mb-2 block">Nombre del Banco</Label>
                  <Input
                    value={template.footer.bankName}
                    onChange={(e) => setTemplate(prev => ({
                      ...prev,
                      footer: { ...prev.footer, bankName: e.target.value }
                    }))}
                    placeholder="Nombre del banco"
                  />
                </div>

                <div>
                  <Label className="text-[var(--text-mid)] text-sm mb-2 block">Número de Cuenta</Label>
                  <Input
                    value={template.footer.accountNumber}
                    onChange={(e) => setTemplate(prev => ({
                      ...prev,
                      footer: { ...prev.footer, accountNumber: e.target.value }
                    }))}
                    placeholder="**** **** 1234"
                  />
                </div>

                <div>
                  <Label className="text-[var(--text-mid)] text-sm mb-2 block">Términos y Condiciones</Label>
                  <Input
                    value={template.footer.customText}
                    onChange={(e) => setTemplate(prev => ({
                      ...prev,
                      footer: { ...prev.footer, customText: e.target.value }
                    }))}
                    placeholder="Pago dentro de 30 días"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Saved Templates */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-[var(--text-mid)] text-sm">Plantillas Guardadas</Label>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Nueva
              </Button>
            </div>
            <div className="space-y-2">
              {savedTemplates.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded bg-[var(--glass)]">
                  <div>
                    <p className="text-[var(--text-primary)] text-sm">{t.name}</p>
                    <p className="text-[var(--text-dim)] text-xs">{t.lastModified}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-2">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Eye className="w-5 h-5 text-[var(--nexus-violet-lite)]" />
                Vista Previa
              </h3>
              <Button variant="outline" size="sm" className="border-[var(--glass-border)]">
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
            <ScrollArea className="h-[800px] pr-4">
              <InvoicePreview template={template} />
            </ScrollArea>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
