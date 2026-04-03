'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import {
  CreditCard,
  Shield,
  Check,
  ArrowLeft,
  Loader2,
  Lock,
  Building2,
  User,
  Mail,
  Phone,
  Zap,
  Crown,
  AlertCircle
} from 'lucide-react';

// Payment Configuration
// When payment is not configured, show contact message instead of redirecting to payment gateway
const PAYMENT_CONFIG = {
  // Set to true when you have real payment credentials
  isConfigured: process.env.NEXT_PUBLIC_PAYMENT_CONFIGURED === 'true',
  
  // WiPay Configuration (set these in Vercel environment variables)
  wipayAccountId: process.env.NEXT_PUBLIC_WIPAY_ACCOUNT_ID || '',
  wipayApiKey: process.env.NEXT_PUBLIC_WIPAY_API_KEY || '',
  wipayEnvironment: (process.env.NEXT_PUBLIC_WIPAY_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production',
  
  // Airtm Configuration (recommended for no-bank users)
  // Get your link at: https://airtm.me (format: https://airtm.me/your-username)
  airtmPaymentUrl: process.env.NEXT_PUBLIC_AIRTM_PAYMENT_URL || '',
  
  // ArtIM Configuration (alternative)
  artimPaymentUrl: process.env.NEXT_PUBLIC_ARTIM_PAYMENT_URL || '',
  
  // Support contact info (shown when payment not configured)
  supportEmail: 'soporte@nexusos.com',
  supportWhatsapp: '+1 868 000-0000', // Update this with your real number
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');

  // Get plan from URL params
  const planSlug = searchParams.get('plan') || 'growth';
  const cycleSlug = searchParams.get('cycle') || 'monthly';

  // Form state
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    planSlug,
    billingCycle: cycleSlug,
  });

  // Plans
  const plans = [
    { slug: 'starter', name: 'Starter', price: 250, icon: Zap, color: '#22D3EE' },
    { slug: 'growth', name: 'Growth', price: 500, icon: Crown, color: '#F59E0B', popular: true },
    { slug: 'premium', name: 'Premium', price: 1000, icon: Shield, color: '#A855F7' },
  ];

  // Billing cycles
  const cycles = [
    { slug: 'monthly', name: 'Mensual', discount: 0 },
    { slug: 'annual', name: 'Anual', discount: 10 },
    { slug: 'biannual', name: 'Bienal', discount: 20 },
  ];

  const plan = plans.find(p => p.slug === formData.planSlug) || plans[1];
  const cycle = cycles.find(c => c.slug === formData.billingCycle) || cycles[0];
  const discount = cycle.discount;
  const finalPrice = plan.price * (1 - discount / 100);
  const activationFee = 1250;
  const total = finalPrice + activationFee;

  // Handle payment - redirect to gateway or show contact info
  const handlePayment = async () => {
    setLoading(true);
    
    // Priority 1: Airtm (best for no-bank users in Caribbean)
    if (PAYMENT_CONFIG.airtmPaymentUrl) {
      // Redirect to Airtm payment link
      const url = new URL(PAYMENT_CONFIG.airtmPaymentUrl);
      // Airtm allows passing amount and description via URL params
      window.location.href = `${PAYMENT_CONFIG.airtmPaymentUrl}?amount=${total.toFixed(2)}&description=${encodeURIComponent(`NexusOS ${plan.name} - ${cycle.name}`)}&reference=${`NEX-${Date.now()}`}`;
      return;
    }
    
    // Priority 2: ArtIM payment URL
    if (PAYMENT_CONFIG.artimPaymentUrl) {
      const url = new URL(PAYMENT_CONFIG.artimPaymentUrl);
      url.searchParams.set('amount', total.toFixed(2));
      url.searchParams.set('customer_name', formData.ownerName);
      url.searchParams.set('customer_email', formData.email);
      url.searchParams.set('reference', `NEX-${Date.now()}`);
      window.location.href = url.toString();
      return;
    }
    
    // Priority 3: WiPay (requires bank account)
    if (PAYMENT_CONFIG.wipayAccountId && PAYMENT_CONFIG.wipayApiKey) {
      const baseUrl = PAYMENT_CONFIG.wipayEnvironment === 'sandbox' 
        ? 'https://sandbox.wipaycaribbean.com/v2/payment'
        : 'https://wipaycaribbean.com/v2/payment';

      const params = new URLSearchParams({
        account_number: PAYMENT_CONFIG.wipayAccountId,
        amount: total.toFixed(2),
        currency: 'TTD',
        description: `NexusOS ${plan.name} Plan - ${cycle.name}`,
        customer_name: formData.ownerName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        order_id: `NEX-${Date.now()}`,
        return_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/checkout/cancel`,
        environment: PAYMENT_CONFIG.wipayEnvironment,
      });

      window.location.href = `${baseUrl}?${params.toString()}`;
      return;
    }
    
    // No payment configured - redirect to success page with mock payment
    console.log('[Checkout] Payment not configured, using mock mode');
    window.location.href = `${window.location.origin}/checkout/success?mock=true&plan=${plan.slug}&cycle=${cycle.slug}&total=${total.toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-[var(--obsidian-1)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--text-primary)] mb-6">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Finalizar Compra
          </h1>
          <p className="text-[var(--text-mid)]">
            Completa tu suscripción a NexusOS
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Details */}
            {step === 'details' && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                  Información de la Cuenta
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[var(--text-mid)]">Nombre del Negocio</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
                      <Input
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="Mi Negocio"
                        className="pl-10 bg-[var(--glass)] border-[var(--glass-border)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[var(--text-mid)]">Nombre Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
                        <Input
                          value={formData.ownerName}
                          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                          placeholder="Juan Pérez"
                          className="pl-10 bg-[var(--glass)] border-[var(--glass-border)]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[var(--text-mid)]">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 868 555-0100"
                          className="pl-10 bg-[var(--glass)] border-[var(--glass-border)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--text-mid)]">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tu@email.com"
                        className="pl-10 bg-[var(--glass)] border-[var(--glass-border)]"
                      />
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div className="pt-4 border-t border-[var(--glass-border)]">
                    <Label className="text-[var(--text-mid)] mb-3 block">Selecciona tu Plan</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {plans.map((p) => {
                        const Icon = p.icon;
                        const isSelected = formData.planSlug === p.slug;
                        return (
                          <button
                            key={p.slug}
                            onClick={() => setFormData({ ...formData, planSlug: p.slug })}
                            className={`relative p-3 rounded-lg border transition-all text-center ${
                              isSelected 
                                ? 'border-[var(--nexus-violet)] bg-[var(--nexus-violet)]/10' 
                                : 'border-[var(--glass-border)] bg-[var(--glass)] hover:border-[var(--nexus-violet)]/50'
                            }`}
                          >
                            {p.popular && (
                              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[var(--nexus-gold)] text-black text-[10px]">
                                Popular
                              </Badge>
                            )}
                            <Icon className="w-5 h-5 mx-auto mb-1" style={{ color: p.color }} />
                            <p className="text-sm text-[var(--text-primary)]">{p.name}</p>
                            <p className="text-xs text-[var(--text-mid)]">TT${p.price}/mes</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Billing Cycle */}
                  <div>
                    <Label className="text-[var(--text-mid)] mb-3 block">Ciclo de Facturación</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {cycles.map((c) => (
                        <button
                          key={c.slug}
                          onClick={() => setFormData({ ...formData, billingCycle: c.slug })}
                          className={`p-3 rounded-lg border transition-all ${
                            formData.billingCycle === c.slug 
                              ? 'border-[var(--nexus-violet)] bg-[var(--nexus-violet)]/10' 
                              : 'border-[var(--glass-border)] bg-[var(--glass)] hover:border-[var(--nexus-violet)]/50'
                          }`}
                        >
                          <p className="text-sm text-[var(--text-primary)]">{c.name}</p>
                          {c.discount > 0 && (
                            <p className="text-xs text-[var(--success)]">-{c.discount}%</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep('payment')}
                    disabled={!formData.businessName || !formData.ownerName || !formData.email}
                    className="w-full btn-nexus py-6"
                  >
                    Continuar al Pago
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 'payment' && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                  Método de Pago
                </h2>

                {/* Payment Gateway Info */}
                {PAYMENT_CONFIG.airtmPaymentUrl ? (
                  // Airtm is configured (recommended for no-bank)
                  <div className="p-4 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#00D4FF]/20 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-[#00D4FF]" />
                      </div>
                      <div>
                        <p className="text-[var(--text-primary)] font-semibold">Airtm</p>
                        <p className="text-xs text-[var(--text-mid)]">Cuenta virtual USA - Sin banco requerido</p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-mid)]">
                      Serás redirigido a Airtm para completar el pago. Aceptamos tarjetas, transferencias y cripto.
                    </p>
                  </div>
                ) : PAYMENT_CONFIG.artimPaymentUrl ? (
                  // ArtIM is configured
                  <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <div>
                        <p className="text-[var(--text-primary)] font-semibold">ArtIM</p>
                        <p className="text-xs text-[var(--text-mid)]">Pago seguro sin cuenta bancaria</p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-mid)]">
                      Serás redirigido a ArtIM para completar el pago. Aceptamos tarjetas, transferencias y más.
                    </p>
                  </div>
                ) : PAYMENT_CONFIG.wipayAccountId && PAYMENT_CONFIG.wipayApiKey ? (
                  // WiPay is configured
                  <div className="p-4 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/30 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#6366F1]/20 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-[#6366F1]" />
                      </div>
                      <div>
                        <p className="text-[var(--text-primary)] font-semibold">WiPay Caribbean</p>
                        <p className="text-xs text-[var(--text-mid)]">Pasarela de pago segura</p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-mid)]">
                      Serás redirigido a WiPay para completar el pago de forma segura.
                      Aceptamos tarjetas Visa, Mastercard y más.
                    </p>
                  </div>
                ) : (
                  // No payment configured - Demo mode
                  <div className="p-4 rounded-xl bg-[var(--nexus-gold)]/10 border border-[var(--nexus-gold)]/30 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--nexus-gold)]/20 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-[var(--nexus-gold)]" />
                      </div>
                      <div>
                        <p className="text-[var(--text-primary)] font-semibold">Modo Demostración</p>
                        <p className="text-xs text-[var(--text-mid)]">Pasarela de pago en configuración</p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-mid)] mb-3">
                      Nuestro sistema de pagos está siendo configurado. Puedes continuar para ver el flujo completo.
                    </p>
                    <p className="text-xs text-[var(--text-dim)]">
                      📧 Soporte: {PAYMENT_CONFIG.supportEmail}
                    </p>
                  </div>
                )}

                {/* Security Info */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--glass)] mb-6">
                  <Lock className="w-8 h-8 text-[var(--success)]" />
                  <div>
                    <p className="text-[var(--text-primary)] font-medium">Pago 100% Seguro</p>
                    <p className="text-xs text-[var(--text-mid)]">
                      Tus datos están protegidos con encriptación SSL de 256 bits
                    </p>
                  </div>
                </div>

                {/* Terms */}
                <div className="p-4 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)] mb-6">
                  <p className="text-sm text-[var(--text-mid)]">
                    Al continuar, aceptas nuestros{' '}
                    <Link href="/terms" className="text-[var(--nexus-violet-lite)] hover:underline">
                      Términos y Condiciones
                    </Link>{' '}
                    y{' '}
                    <Link href="/terms" className="text-[var(--nexus-violet-lite)] hover:underline">
                      Política de Privacidad
                    </Link>.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('details')}
                    className="border-[var(--glass-border)]"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Atrás
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 btn-gold py-6"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Redirigiendo...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        {PAYMENT_CONFIG.airtmPaymentUrl || PAYMENT_CONFIG.artimPaymentUrl || (PAYMENT_CONFIG.wipayAccountId && PAYMENT_CONFIG.wipayApiKey)
                          ? `Pagar TT$${total.toFixed(0)}`
                          : `Continuar (Demo)`}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Resumen del Pedido
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[var(--text-mid)]">Plan {plan.name}</span>
                  <span className="text-[var(--text-primary)]">TT${plan.price}/mes</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[var(--success)]">
                    <span>Descuento ({cycle.name})</span>
                    <span>-{discount}%</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-[var(--text-mid)]">Precio Ajustado</span>
                  <span className="text-[var(--text-primary)]">TT${finalPrice.toFixed(0)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[var(--text-mid)]">Fee de Activación</span>
                  <span className="text-[var(--text-primary)]">TT${activationFee}</span>
                </div>

                <div className="border-t border-[var(--glass-border)] pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-primary)] font-bold">Total</span>
                    <span className="text-2xl font-bold text-[var(--nexus-gold)]">
                      TT${total.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 pt-4 border-t border-[var(--glass-border)]">
                <p className="text-sm text-[var(--text-mid)] mb-3">Incluye:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                    <Check className="w-4 h-4 text-[var(--success)]" />
                    Acceso completo a NexusOS
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                    <Check className="w-4 h-4 text-[var(--success)]" />
                    Soporte técnico
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                    <Check className="w-4 h-4 text-[var(--success)]" />
                    Actualizaciones incluidas
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                    <Check className="w-4 h-4 text-[var(--success)]" />
                    Sin contrato fijo
                  </li>
                </ul>
              </div>

              {/* Guarantee */}
              <div className="mt-6 p-3 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/30">
                <p className="text-sm text-[var(--success)] text-center">
                  ✓ Garantía de devolución de 7 días
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--obsidian-1)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--nexus-violet-lite)]" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
