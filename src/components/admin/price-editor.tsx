'use client';

import React, { useState } from 'react';
import { AdminLayout } from './admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign,
  Tag,
  Percent,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Save,
  Eye,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Clock,
  Users,
  Zap,
  Star,
  TrendingUp,
  RefreshCw,
  FileText,
  Globe
} from 'lucide-react';

// Currency options
const CURRENCIES = [
  { code: 'TTD', symbol: 'TT$', name: 'Dólar Trinitense', rate: 1 },
  { code: 'USD', symbol: '$', name: 'Dólar Americano', rate: 0.148 },
  { code: 'GYD', symbol: 'GY$', name: 'Dólar Guyanés', rate: 31.03 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.136 },
];

// Plan features
const PLAN_FEATURES = {
  starter: [
    'Hasta 100 pacientes',
    'Citas básicas',
    'Historial médico simple',
    'Facturación básica',
    '1 usuario',
    'Soporte por email'
  ],
  growth: [
    'Hasta 500 pacientes',
    'Gestión de citas avanzada',
    'Historial médico completo',
    'Facturación y pagos',
    '5 usuarios',
    'Reportes básicos',
    'Soporte prioritario'
  ],
  premium: [
    'Pacientes ilimitados',
    'Todas las funciones',
    'API access',
    'Integraciones',
    'Usuarios ilimitados',
    'Reportes avanzados',
    'Soporte 24/7',
    'Account manager'
  ]
};

// Initial pricing data
const INITIAL_PRICING = {
  plans: {
    starter: {
      name: 'Starter',
      description: 'Para consultorios pequeños',
      monthly: 500,
      annual: 400,
      activation: 1250,
      features: PLAN_FEATURES.starter,
      popular: false,
      active: true
    },
    growth: {
      name: 'Growth',
      description: 'Para clínicas en crecimiento',
      monthly: 1200,
      annual: 960,
      activation: 1250,
      features: PLAN_FEATURES.growth,
      popular: true,
      active: true
    },
    premium: {
      name: 'Premium',
      description: 'Para organizaciones grandes',
      monthly: 2500,
      annual: 2000,
      activation: 1250,
      features: PLAN_FEATURES.premium,
      popular: false,
      active: true
    }
  },
  settings: {
    currency: 'TTD',
    taxRate: 12.5,
    taxName: 'IVA',
    annualDiscount: 20,
    trialDays: 14,
    gracePeriod: 7
  }
};

// Coupon template
interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  maxUses: number;
  currentUses: number;
  expiresAt: string;
  active: boolean;
  applicablePlans: string[];
}

const INITIAL_COUPONS: Coupon[] = [
  {
    id: '1',
    code: 'EARLYBIRD',
    type: 'fixed',
    value: 250,
    description: 'Descuento de activación temprana',
    maxUses: 50,
    currentUses: 12,
    expiresAt: '2026-06-30',
    active: true,
    applicablePlans: ['starter', 'growth', 'premium']
  },
  {
    id: '2',
    code: 'GROWTH20',
    type: 'percentage',
    value: 20,
    description: '20% de descuento primer mes',
    maxUses: 100,
    currentUses: 45,
    expiresAt: '2026-12-31',
    active: true,
    applicablePlans: ['growth', 'premium']
  }
];

export function PriceEditor() {
  const [pricing, setPricing] = useState(INITIAL_PRICING);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [selectedCurrency, setSelectedCurrency] = useState('TTD');
  const [saved, setSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [newCouponOpen, setNewCouponOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    description: '',
    maxUses: 100,
    expiresAt: '',
    applicablePlans: [] as string[]
  });

  const currency = CURRENCIES.find(c => c.code === pricing.settings.currency) || CURRENCIES[0];

  // Handle plan price change
  const handlePlanPriceChange = (plan: string, field: string, value: number) => {
    setPricing(prev => ({
      ...prev,
      plans: {
        ...prev.plans,
        [plan]: {
          ...prev.plans[plan as keyof typeof prev.plans],
          [field]: value
        }
      }
    }));
  };

  // Handle settings change
  const handleSettingsChange = (field: string, value: string | number) => {
    setPricing(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }));
  };

  // Handle save
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Calculate prices with currency conversion
  const convertPrice = (price: number, toCurrency: string) => {
    const targetCurrency = CURRENCIES.find(c => c.code === toCurrency);
    if (!targetCurrency || toCurrency === 'TTD') return price;
    return price * targetCurrency.rate;
  };

  // Format price
  const formatPrice = (price: number, currencyCode: string = pricing.settings.currency) => {
    const curr = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
    const convertedPrice = convertPrice(price, currencyCode);
    return `${curr.symbol}${convertedPrice.toFixed(2)}`;
  };

  // Calculate price with tax
  const calculateWithTax = (price: number) => {
    return price * (1 + pricing.settings.taxRate / 100);
  };

  // Handle coupon toggle
  const handleCouponToggle = (id: string) => {
    setCoupons(prev => prev.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    ));
  };

  // Handle add coupon
  const handleAddCoupon = () => {
    if (newCoupon.code && newCoupon.value > 0) {
      setCoupons(prev => [...prev, {
        ...newCoupon,
        id: Date.now().toString(),
        currentUses: 0,
        active: true
      }]);
      setNewCoupon({
        code: '',
        type: 'percentage',
        value: 0,
        description: '',
        maxUses: 100,
        expiresAt: '',
        applicablePlans: []
      });
      setNewCouponOpen(false);
    }
  };

  // Copy coupon code
  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  // Plan Card Component
  const PlanCard = ({ planId, plan }: { planId: string; plan: typeof INITIAL_PRICING.plans.starter }) => {
    const isEditing = editingPlan === planId;
    
    return (
      <div className={`glass-card p-6 relative ${plan.popular ? 'border-2 border-[var(--nexus-gold)]' : ''}`}>
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="px-3 py-1 rounded-full bg-[var(--nexus-gold)] text-[var(--obsidian)] text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3" />
              Popular
            </span>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{plan.name}</h3>
            <p className="text-sm text-[var(--text-dim)]">{plan.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={plan.active}
              onCheckedChange={(checked) => setPricing(prev => ({
                ...prev,
                plans: {
                  ...prev.plans,
                  [planId]: { ...plan, active: checked }
                }
              }))}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingPlan(isEditing ? null : planId)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Monthly Price */}
          <div className="p-3 rounded-lg bg-[var(--glass)]">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-[var(--text-mid)] text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Mensual
              </Label>
              <span className="text-xs text-[var(--text-dim)]">
                {formatPrice(calculateWithTax(plan.monthly))} c/imp
              </span>
            </div>
            {isEditing ? (
              <Input
                type="number"
                value={plan.monthly}
                onChange={(e) => handlePlanPriceChange(planId, 'monthly', parseFloat(e.target.value))}
                className="font-mono text-lg"
              />
            ) : (
              <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">
                {formatPrice(plan.monthly)}
                <span className="text-sm font-normal text-[var(--text-dim)]">/mes</span>
              </p>
            )}
          </div>

          {/* Annual Price */}
          <div className="p-3 rounded-lg bg-[var(--glass)]">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-[var(--text-mid)] text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Anual
              </Label>
              <span className="text-xs text-[var(--success)]">
                Ahorra {pricing.settings.annualDiscount}%
              </span>
            </div>
            {isEditing ? (
              <Input
                type="number"
                value={plan.annual}
                onChange={(e) => handlePlanPriceChange(planId, 'annual', parseFloat(e.target.value))}
                className="font-mono text-lg"
              />
            ) : (
              <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">
                {formatPrice(plan.annual)}
                <span className="text-sm font-normal text-[var(--text-dim)]">/mes</span>
              </p>
            )}
            <p className="text-xs text-[var(--text-dim)] mt-1">
              {formatPrice(plan.annual * 12)} facturado anualmente
            </p>
          </div>

          {/* Activation Fee */}
          <div className="p-3 rounded-lg bg-[var(--glass)]">
            <Label className="text-[var(--text-mid)] text-sm flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4" />
              Activación
            </Label>
            {isEditing ? (
              <Input
                type="number"
                value={plan.activation}
                onChange={(e) => handlePlanPriceChange(planId, 'activation', parseFloat(e.target.value))}
                className="font-mono"
              />
            ) : (
              <p className="text-lg font-bold text-[var(--text-primary)] font-mono">
                {formatPrice(plan.activation)}
                <span className="text-sm font-normal text-[var(--text-dim)]"> único</span>
              </p>
            )}
          </div>

          {/* Features */}
          <div className="pt-4 border-t border-[var(--glass-border)]">
            <p className="text-sm text-[var(--text-mid)] mb-2">Incluye:</p>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-[var(--text-primary)]">
                  <CheckCircle className="w-4 h-4 text-[var(--success)] mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Preview Component
  const PricingPreview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(pricing.plans).map(([planId, plan]) => (
        <div key={planId} className={`bg-white rounded-xl shadow-xl overflow-hidden ${plan.popular ? 'ring-2 ring-amber-400' : ''}`}>
          <div className={`p-6 ${plan.popular ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600'}`}>
            {plan.popular && (
              <span className="inline-block px-2 py-1 bg-white/20 rounded text-white text-xs font-bold mb-2">
                Más Popular
              </span>
            )}
            <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
            <p className="text-white/80 text-sm">{plan.description}</p>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <span className="text-4xl font-bold text-gray-900">{formatPrice(plan.monthly)}</span>
              <span className="text-gray-500">/mes</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.slice(0, 5).map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-lg font-semibold ${
              plan.popular 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}>
              Comenzar
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <AdminLayout activeTab="settings">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Editor de Precios</h1>
          <p className="text-[var(--text-mid)] text-sm">Gestiona planes, precios y descuentos</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-[var(--glass-border)]"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
          <Button onClick={handleSave} className="btn-gold">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 text-[var(--success)] text-sm glass-card p-3">
          <CheckCircle className="w-4 h-4" />
          Precios actualizados exitosamente
        </div>
      )}

      {previewMode ? (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Vista Previa del Portal</h3>
          <PricingPreview />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-[var(--obsidian-3)]">
            <TabsTrigger value="plans" className="flex items-center gap-2 data-[state=active]:bg-[var(--nexus-violet)]/20">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Planes</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2 data-[state=active]:bg-[var(--nexus-violet)]/20">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Facturación</span>
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center gap-2 data-[state=active]:bg-[var(--nexus-violet)]/20">
              <Tag className="w-4 h-4" />
              <span className="hidden sm:inline">Cupones</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-[var(--nexus-violet)]/20">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(pricing.plans).map(([planId, plan]) => (
                <PlanCard key={planId} planId={planId} plan={plan} />
              ))}
            </div>

            {/* Quick Stats */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--nexus-violet-lite)]" />
                Resumen de Precios
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-[var(--glass)]">
                  <p className="text-[var(--text-dim)] text-sm">Plan más económico</p>
                  <p className="text-xl font-bold text-[var(--text-primary)] font-mono">
                    {formatPrice(pricing.plans.starter.monthly)}/mes
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass)]">
                  <p className="text-[var(--text-dim)] text-sm">Plan más popular</p>
                  <p className="text-xl font-bold text-[var(--nexus-gold)] font-mono">
                    {formatPrice(pricing.plans.growth.monthly)}/mes
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass)]">
                  <p className="text-[var(--text-dim)] text-sm">Activación promedio</p>
                  <p className="text-xl font-bold text-[var(--text-primary)] font-mono">
                    {formatPrice(pricing.plans.growth.activation)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass)]">
                  <p className="text-[var(--text-dim)] text-sm">Ahorro anual</p>
                  <p className="text-xl font-bold text-[var(--success)] font-mono">
                    {pricing.settings.annualDiscount}%
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="mt-0 space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[var(--nexus-violet-lite)]" />
                Configuración de Facturación
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Moneda Principal</Label>
                  <select
                    value={pricing.settings.currency}
                    onChange={(e) => handleSettingsChange('currency', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[var(--obsidian-3)] border border-[var(--glass-border)] text-[var(--text-primary)]"
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.code} - {curr.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)]">Nombre del Impuesto</Label>
                  <Input
                    value={pricing.settings.taxName}
                    onChange={(e) => handleSettingsChange('taxName', e.target.value)}
                    placeholder="IVA, ITBIS, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)] flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    Tasa de Impuesto (%)
                  </Label>
                  <Input
                    type="number"
                    value={pricing.settings.taxRate}
                    onChange={(e) => handleSettingsChange('taxRate', parseFloat(e.target.value))}
                    step="0.1"
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)] flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    Descuento Anual (%)
                  </Label>
                  <Input
                    type="number"
                    value={pricing.settings.annualDiscount}
                    onChange={(e) => handleSettingsChange('annualDiscount', parseFloat(e.target.value))}
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)] flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Días de Prueba
                  </Label>
                  <Input
                    type="number"
                    value={pricing.settings.trialDays}
                    onChange={(e) => handleSettingsChange('trialDays', parseInt(e.target.value))}
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[var(--text-mid)] flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Período de Gracia (días)
                  </Label>
                  <Input
                    type="number"
                    value={pricing.settings.gracePeriod}
                    onChange={(e) => handleSettingsChange('gracePeriod', parseInt(e.target.value))}
                    className="font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Currency Converter */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Conversión de Monedas</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--glass-border)]">
                      <th className="text-left py-3 text-sm font-medium text-[var(--text-mid)]">Plan</th>
                      {CURRENCIES.map((curr) => (
                        <th key={curr.code} className="text-right py-3 text-sm font-medium text-[var(--text-mid)]">
                          {curr.code}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(pricing.plans).map(([planId, plan]) => (
                      <tr key={planId} className="border-b border-[var(--glass-border)] last:border-0">
                        <td className="py-3 text-[var(--text-primary)] font-medium">{plan.name}</td>
                        {CURRENCIES.map((curr) => (
                          <td key={curr.code} className="py-3 text-right font-mono text-[var(--text-primary)]">
                            {formatPrice(plan.monthly, curr.code)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Coupons Tab */}
          <TabsContent value="coupons" className="mt-0 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[var(--nexus-violet-lite)]" />
                  Cupones de Descuento
                </h3>
                <Button onClick={() => setNewCouponOpen(!newCouponOpen)} className="btn-nexus">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Cupón
                </Button>
              </div>

              {/* New Coupon Form */}
              {newCouponOpen && (
                <div className="mb-6 p-4 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)]">
                  <h4 className="text-[var(--text-primary)] font-medium mb-4">Crear Nuevo Cupón</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[var(--text-mid)] text-sm">Código</Label>
                      <Input
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="CODIGO20"
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[var(--text-mid)] text-sm">Tipo</Label>
                      <select
                        value={newCoupon.type}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, type: e.target.value as 'percentage' | 'fixed' }))}
                        className="w-full h-10 px-3 rounded-lg bg-[var(--obsidian-3)] border border-[var(--glass-border)] text-[var(--text-primary)]"
                      >
                        <option value="percentage">Porcentaje (%)</option>
                        <option value="fixed">Monto Fijo ({currency.symbol})</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[var(--text-mid)] text-sm">Valor</Label>
                      <Input
                        type="number"
                        value={newCoupon.value}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
                        placeholder={newCoupon.type === 'percentage' ? '20' : '500'}
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[var(--text-mid)] text-sm">Usos Máximos</Label>
                      <Input
                        type="number"
                        value={newCoupon.maxUses}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, maxUses: parseInt(e.target.value) }))}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setNewCouponOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddCoupon} className="btn-gold">
                      Crear Cupón
                    </Button>
                  </div>
                </div>
              )}

              {/* Coupons List */}
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between p-4 rounded-lg bg-[var(--glass)]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[var(--nexus-gold)]/10 flex items-center justify-center">
                        <Tag className="w-6 h-6 text-[var(--nexus-gold)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-mono font-bold text-[var(--nexus-gold)]">{coupon.code}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyCouponCode(coupon.code)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-[var(--text-mid)]">{coupon.description}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-dim)]">
                          <span>
                            {coupon.type === 'percentage' ? `${coupon.value}% de descuento` : `${currency.symbol}${coupon.value} de descuento`}
                          </span>
                          <span>•</span>
                          <span>{coupon.currentUses}/{coupon.maxUses} usados</span>
                          <span>•</span>
                          <span>Vence: {coupon.expiresAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`text-sm ${coupon.active ? 'text-[var(--success)]' : 'text-[var(--text-dim)]'}`}>
                          {coupon.active ? 'Activo' : 'Inactivo'}
                        </p>
                        <p className="text-xs text-[var(--text-dim)]">
                          {Math.round((coupon.currentUses / coupon.maxUses) * 100)}% usado
                        </p>
                      </div>
                      <Switch
                        checked={coupon.active}
                        onCheckedChange={() => handleCouponToggle(coupon.id)}
                      />
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[var(--error)]">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0 space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[var(--nexus-violet-lite)]" />
                Configuración Regional
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-[var(--text-mid)] font-medium">Conversión Automática</h4>
                  <div className="space-y-3">
                    {CURRENCIES.filter(c => c.code !== 'TTD').map((curr) => (
                      <div key={curr.code} className="flex items-center justify-between p-3 rounded bg-[var(--glass)]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[var(--text-primary)]">{curr.code}</span>
                          <span className="text-sm text-[var(--text-dim)]">{curr.name}</span>
                        </div>
                        <Input
                          type="number"
                          defaultValue={curr.rate}
                          step="0.001"
                          className="w-24 font-mono text-right"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[var(--text-mid)] font-medium">Ajustes de Facturación</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded bg-[var(--glass)]">
                      <span className="text-sm text-[var(--text-primary)]">Recordatorios de pago</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded bg-[var(--glass)]">
                      <span className="text-sm text-[var(--text-primary)]">Auto-renovación</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded bg-[var(--glass)]">
                      <span className="text-sm text-[var(--text-primary)]">Descuentos por volumen</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </AdminLayout>
  );
}
