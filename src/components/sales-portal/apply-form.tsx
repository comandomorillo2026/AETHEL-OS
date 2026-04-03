'use client';

import React, { useState } from 'react';
import { useLanguage } from './language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Check, 
  CreditCard, 
  Building2, 
  ArrowLeft, 
  ArrowRight, 
  Upload,
  CheckCircle,
  Loader2,
  Zap,
  ExternalLink,
  Copy,
  AlertCircle
} from 'lucide-react';

interface FormData {
  businessName: string;
  legalName: string;
  businessAddress: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  country: string;
  languagePreference: string;
  industrySlug: string;
  planTier: 'starter' | 'growth' | 'premium';
  billingCycle: 'monthly' | 'annual';
  couponCode: string;
  paymentMethod: 'wipay' | 'artim' | 'bank_transfer';
}

const initialFormData: FormData = {
  businessName: '',
  legalName: '',
  businessAddress: '',
  ownerName: '',
  ownerEmail: '',
  ownerPhone: '',
  country: 'Trinidad & Tobago',
  languagePreference: 'Español',
  industrySlug: '',
  planTier: 'growth',
  billingCycle: 'monthly',
  couponCode: '',
  paymentMethod: 'wipay',
};

// Prices aligned with Portal/Translations
const PLAN_PRICES = {
  starter: { monthly: 500, annual: 400 },
  growth: { monthly: 1200, annual: 960 },
  premium: { monthly: 2500, annual: 2000 },
};

const ACTIVATION_FEE = 1250;
const COUPONS: Record<string, number> = {
  'EARLYBIRD': 250,
  'LAUNCH50': 500,
  'NEXUS2024': 300,
};

export function ApplyForm() {
  const { t, lang } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  const industries = [
    { slug: 'clinic', name: lang === 'en' ? 'Medical Clinic' : 'Clínica Médica', icon: '🏥' },
    { slug: 'nurse', name: lang === 'en' ? 'Nursing Care' : 'Cuidados de Enfermería', icon: '💉' },
    { slug: 'lawfirm', name: lang === 'en' ? 'Law Firm' : 'Bufete de Abogados', icon: '⚖️' },
    { slug: 'beauty', name: lang === 'en' ? 'Beauty Salon' : 'Salón de Belleza', icon: '💇‍♀️' },
    { slug: 'bakery', name: lang === 'en' ? 'Bakery & Pastry' : 'Panadería & Pastelería', icon: '🥐' },
    { slug: 'pharmacy', name: lang === 'en' ? 'Pharmacy' : 'Farmacia', icon: '💊' },
    { slug: 'insurance', name: lang === 'en' ? 'Insurance Company' : 'Compañía de Seguros', icon: '🛡️' },
  ];
  const plans = ['starter', 'growth', 'premium'] as const;

  // Pricing calculation
  const planPrice = PLAN_PRICES[formData.planTier][formData.billingCycle];
  const subtotal = planPrice + ACTIVATION_FEE;
  const discount = couponApplied ? couponDiscount : 0;
  const total = subtotal - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setCheckoutError('');
  };

  const applyCoupon = () => {
    setCouponError('');
    const code = formData.couponCode.toUpperCase();
    
    if (COUPONS[code]) {
      setCouponApplied(true);
      setCouponDiscount(COUPONS[code]);
    } else {
      setCouponError(lang === 'en' ? 'Invalid coupon code' : 'Código de cupón inválido');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setCheckoutError('');

    try {
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          couponCode: couponApplied ? formData.couponCode : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCheckoutError(data.error || (lang === 'en' ? 'Payment creation failed' : 'Error al crear el pago'));
        setIsSubmitting(false);
        return;
      }

      // Save order info
      setOrderNumber(data.orderNumber);
      setInvoiceNumber(data.invoiceNumber);

      if (data.paymentMethod === 'wipay' || data.paymentMethod === 'artim') {
        // Redirect to payment gateway
        setPaymentUrl(data.paymentUrl);
        setCurrentStep(4); // Show payment redirect screen
      } else {
        // Bank transfer - show confirmation
        setOrderComplete(true);
        setCurrentStep(4);
      }

    } catch (err) {
      setCheckoutError(lang === 'en' ? 'Connection error. Please try again.' : 'Error de conexión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {t.form.steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div
              className={`step-dot ${
                currentStep > index + 1
                  ? 'completed'
                  : currentStep === index + 1
                  ? 'active'
                  : 'inactive'
              }`}
            >
              {currentStep > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span className={`ml-2 text-sm hidden sm:inline ${
              currentStep === index + 1 ? 'text-[var(--text-primary)]' : 'text-[var(--text-dim)]'
            }`}>
              {step}
            </span>
          </div>
          {index < t.form.steps.length - 1 && (
            <div className={`step-line mx-4 ${currentStep > index + 1 ? 'completed' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Step 1: Business Info
  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
        {t.form.step1.title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-[var(--text-mid)]">
            {t.form.step1.businessName} *
          </Label>
          <Input
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder={t.form.step1.businessNamePlaceholder}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="legalName" className="text-[var(--text-mid)]">
            {t.form.step1.legalName}
          </Label>
          <Input
            id="legalName"
            name="legalName"
            value={formData.legalName}
            onChange={handleInputChange}
            placeholder={t.form.step1.legalNameHint}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="businessAddress" className="text-[var(--text-mid)]">
            {t.form.step1.businessAddress} *
          </Label>
          <Textarea
            id="businessAddress"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleInputChange}
            placeholder={t.form.step1.businessAddressPlaceholder}
            rows={2}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerName" className="text-[var(--text-mid)]">
            {t.form.step1.ownerName} *
          </Label>
          <Input
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            placeholder={t.form.step1.ownerNamePlaceholder}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerEmail" className="text-[var(--text-mid)]">
            {t.form.step1.ownerEmail} *
          </Label>
          <Input
            id="ownerEmail"
            name="ownerEmail"
            type="email"
            value={formData.ownerEmail}
            onChange={handleInputChange}
            placeholder={t.form.step1.ownerEmailPlaceholder}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerPhone" className="text-[var(--text-mid)]">
            {t.form.step1.ownerPhone} *
          </Label>
          <Input
            id="ownerPhone"
            name="ownerPhone"
            type="tel"
            value={formData.ownerPhone}
            onChange={handleInputChange}
            placeholder={t.form.step1.ownerPhonePlaceholder}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-[var(--text-mid)]">
            {t.form.step1.country} *
          </Label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full h-10 px-3 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text-primary)]"
          >
            {t.form.step1.countryOptions.map((country) => (
              <option key={country} value={country} className="bg-[var(--obsidian)]">
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="languagePreference" className="text-[var(--text-mid)]">
            {t.form.step1.languagePreference}
          </Label>
          <select
            id="languagePreference"
            name="languagePreference"
            value={formData.languagePreference}
            onChange={handleInputChange}
            className="w-full h-10 px-3 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text-primary)]"
          >
            <option value="Español" className="bg-[var(--obsidian)]">Español</option>
            <option value="English" className="bg-[var(--obsidian)]">English</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={() => setCurrentStep(2)}
          className="btn-gold"
          disabled={!formData.businessName || !formData.ownerName || !formData.ownerEmail || !formData.ownerPhone}
        >
          {t.form.step1.nextButton}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Step 2: Industry & Plan
  const renderStep2 = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
        {t.form.step2.title}
      </h3>

      {/* Industry Selection */}
      <div>
        <Label className="text-[var(--text-mid)] mb-4 block">{t.form.step2.selectIndustry}</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {industries.map((industry) => (
            <button
              key={industry.slug}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, industrySlug: industry.slug }))}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                formData.industrySlug === industry.slug
                  ? 'border-[var(--nexus-violet)] bg-[var(--nexus-violet)]/10'
                  : 'border-[var(--glass-border)] bg-[var(--glass)] hover:border-[var(--nexus-violet)]/50'
              }`}
            >
              <span className="text-3xl mb-2 block">{industry.icon}</span>
              <span className="text-sm text-[var(--text-primary)]">{industry.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Billing Cycle */}
      <div>
        <Label className="text-[var(--text-mid)] mb-4 block">{t.form.step2.billingCycle}</Label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, billingCycle: 'monthly' }))}
            className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
              formData.billingCycle === 'monthly'
                ? 'border-[var(--nexus-violet)] bg-[var(--nexus-violet)]/10'
                : 'border-[var(--glass-border)] bg-[var(--glass)] hover:border-[var(--nexus-violet)]/50'
            }`}
          >
            {t.form.step2.monthly}
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, billingCycle: 'annual' }))}
            className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
              formData.billingCycle === 'annual'
                ? 'border-[var(--nexus-gold)] bg-[var(--nexus-gold)]/10'
                : 'border-[var(--glass-border)] bg-[var(--glass)] hover:border-[var(--nexus-gold)]/50'
            }`}
          >
            {t.form.step2.annualSave}
          </button>
        </div>
      </div>

      {/* Plan Selection */}
      <div>
        <Label className="text-[var(--text-mid)] mb-4 block">{lang === 'en' ? 'Select Plan' : 'Seleccionar Plan'}</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((planKey) => {
            const plan = t.pricing.plans[planKey];
            const price = formData.billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
            const isPopular = planKey === 'growth';

            return (
              <button
                key={planKey}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, planTier: planKey }))}
                className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                  formData.planTier === planKey
                    ? isPopular
                      ? 'border-[var(--nexus-gold)] bg-[var(--nexus-gold)]/10'
                      : 'border-[var(--nexus-violet)] bg-[var(--nexus-violet)]/10'
                    : 'border-[var(--glass-border)] bg-[var(--glass)] hover:border-[var(--nexus-violet)]/50'
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[var(--nexus-gold)] text-[var(--obsidian)] text-xs font-bold">
                    {plan.badge}
                  </span>
                )}
                <p className="font-bold text-[var(--text-primary)]">{plan.name}</p>
                <p className="text-2xl font-bold text-gradient-gold mt-2" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                  TT${price}
                </p>
                <p className="text-xs text-[var(--text-dim)]">{plan.period}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Coupon Code */}
      <div>
        <Label className="text-[var(--text-mid)] mb-2 block">{t.form.step2.couponCode}</Label>
        <div className="flex gap-2">
          <Input
            name="couponCode"
            value={formData.couponCode}
            onChange={(e) => {
              handleInputChange(e);
              setCouponApplied(false);
              setCouponError('');
            }}
            placeholder={t.form.step2.couponPlaceholder}
            disabled={couponApplied}
          />
          <Button
            onClick={applyCoupon}
            variant="outline"
            disabled={couponApplied || !formData.couponCode}
            className={couponApplied ? 'bg-[var(--success)]/20 border-[var(--success)] text-[var(--success)]' : ''}
          >
            {couponApplied ? <Check className="w-4 h-4" /> : t.form.step2.couponApply}
          </Button>
        </div>
        {couponError && (
          <p className="text-[var(--error)] text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {couponError}
          </p>
        )}
        {couponApplied && (
          <p className="text-[var(--success)] text-sm mt-2">
            {t.form.step2.couponApplied}{couponDiscount}{t.form.step2.couponOff}
          </p>
        )}
      </div>

      {/* Order Summary */}
      <div className="glass-card p-6">
        <h4 className="font-bold text-[var(--text-primary)] mb-4">{t.form.step2.orderSummary}</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-mid)]">{t.form.step2.selectedIndustry}</span>
            <span className="text-[var(--text-primary)]">
              {industries.find((i) => i.slug === formData.industrySlug)?.name || '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-mid)]">{t.form.step2.selectedPlan}</span>
            <span className="text-[var(--text-primary)]">{t.pricing.plans[formData.planTier].name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-mid)]">{t.form.step2.planPrice}</span>
            <span className="text-[var(--text-primary)]">TT${planPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-mid)]">{t.form.step2.activationFee}</span>
            <span className="text-[var(--text-primary)]">TT${ACTIVATION_FEE}</span>
          </div>
          {couponApplied && (
            <div className="flex justify-between text-[var(--success)]">
              <span>{t.form.step2.discount}</span>
              <span>-TT${couponDiscount}</span>
            </div>
          )}
          <div className="border-t border-[var(--glass-border)] pt-3 flex justify-between font-bold">
            <span className="text-[var(--text-primary)]">{t.form.step2.totalDue}</span>
            <span className="text-gradient-gold text-lg" style={{ fontFamily: 'var(--font-dm-mono)' }}>
              TT${total}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={() => setCurrentStep(1)} className="btn-ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.form.step2.backButton}
        </Button>
        <Button
          onClick={() => setCurrentStep(3)}
          className="btn-gold"
          disabled={!formData.industrySlug}
        >
          {t.form.step2.nextButton}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Step 3: Payment
  const renderStep3 = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
        {t.form.step3.title}
      </h3>

      {checkoutError && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)]">
          <AlertCircle className="w-5 h-5" />
          {checkoutError}
        </div>
      )}

      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WiPay */}
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'wipay' }))}
          className={`p-6 rounded-xl border-2 text-left transition-all ${
            formData.paymentMethod === 'wipay'
              ? 'border-[var(--nexus-gold)] bg-[var(--nexus-gold)]/10'
              : 'border-[var(--glass-border)] bg-[var(--glass)] hover:border-[var(--nexus-violet)]/50'
          }`}
        >
          <CreditCard className="w-8 h-8 text-[var(--nexus-gold)] mb-3" />
          <p className="font-bold text-[var(--text-primary)]">{t.form.step3.wipay.name}</p>
          <p className="text-xs text-[var(--nexus-gold)]">{t.form.step3.wipay.recommended}</p>
          <p className="text-sm text-[var(--text-mid)] mt-2">{t.form.step3.wipay.description}</p>
        </button>

        {/* Artim */}
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'artim' }))}
          className={`p-6 rounded-xl border-2 text-left transition-all ${
            formData.paymentMethod === 'artim'
              ? 'border-[var(--nexus-violet)] bg-[var(--nexus-violet)]/10'
              : 'border-[var(--glass-border)] bg-[var(--glass)] hover:border-[var(--nexus-violet)]/50'
          }`}
        >
          <CreditCard className="w-8 h-8 text-[var(--nexus-violet-lite)] mb-3" />
          <p className="font-bold text-[var(--text-primary)]">Artim</p>
          <p className="text-xs text-[var(--nexus-aqua)]">{lang === 'en' ? 'Digital Payments' : 'Pagos Digitales'}</p>
          <p className="text-sm text-[var(--text-mid)] mt-2">{lang === 'en' ? 'Cards & mobile money' : 'Tarjetas y dinero móvil'}</p>
        </button>

        {/* Bank Transfer */}
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'bank_transfer' }))}
          className={`p-6 rounded-xl border-2 text-left transition-all ${
            formData.paymentMethod === 'bank_transfer'
              ? 'border-[var(--success)] bg-[var(--success)]/10'
              : 'border-[var(--glass-border)] bg-[var(--glass)] hover:border-[var(--nexus-violet)]/50'
          }`}
        >
          <Building2 className="w-8 h-8 text-[var(--success)] mb-3" />
          <p className="font-bold text-[var(--text-primary)]">{t.form.step3.bankTransfer.name}</p>
          <p className="text-xs text-[var(--success)]">{t.form.step3.bankTransfer.local}</p>
          <p className="text-sm text-[var(--text-mid)] mt-2">{t.form.step3.bankTransfer.description}</p>
        </button>
      </div>

      {/* Payment Notice */}
      <div className="glass-card p-6 border-l-4 border-l-[var(--nexus-gold)]">
        <p className="text-sm text-[var(--text-mid)]">
          {formData.paymentMethod === 'wipay' 
            ? t.form.step3.wipay.redirectNotice 
            : formData.paymentMethod === 'artim'
            ? (lang === 'en' ? 'You will be redirected to Artim\'s secure payment page.' : 'Serás redirigido a la página de pago seguro de Artim.')
            : t.form.step3.bankTransfer.processingTime}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={() => setCurrentStep(2)} className="btn-ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.form.step3.backButton}
        </Button>
        <Button
          onClick={handleSubmit}
          className="btn-gold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t.common.loading}
            </>
          ) : formData.paymentMethod === 'wipay' ? (
            `${t.form.step3.wipay.button}${total}${t.form.step3.wipay.buttonSuffix}`
          ) : formData.paymentMethod === 'artim' ? (
            `${lang === 'en' ? 'Pay' : 'Pagar'} TT$${total} ${lang === 'en' ? 'with Artim' : 'con Artim'}`
          ) : (
            t.form.step3.bankTransfer.button
          )}
        </Button>
      </div>
    </div>
  );

  // Step 4: Confirmation / Payment Redirect
  const renderStep4 = () => {
    if (paymentUrl && (formData.paymentMethod === 'wipay' || formData.paymentMethod === 'artim')) {
      return (
        <div className="text-center space-y-8">
          <div className="w-20 h-20 rounded-full bg-[var(--nexus-gold)]/20 flex items-center justify-center mx-auto">
            <CreditCard className="w-10 h-10 text-[var(--nexus-gold)]" />
          </div>

          <div>
            <h3 className="text-3xl font-bold text-gradient-gold mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {lang === 'en' ? 'Complete Your Payment' : 'Completa Tu Pago'}
            </h3>
            <p className="text-[var(--text-mid)]">
              {lang === 'en' 
                ? 'Click the button below to be redirected to the secure payment page.' 
                : 'Haz clic en el botón para ser redirigido a la página de pago seguro.'}
            </p>
          </div>

          <div className="glass-card p-6 max-w-md mx-auto text-left">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[var(--text-mid)]">{lang === 'en' ? 'Order Number' : 'Número de Orden'}</span>
                <span className="text-[var(--nexus-gold)] font-mono font-bold">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-mid)]">{lang === 'en' ? 'Amount' : 'Monto'}</span>
                <span className="text-gradient-gold font-bold" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                  TT${total}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
              <Button className="btn-gold text-lg px-8 py-6">
                {lang === 'en' ? 'Pay Now' : 'Pagar Ahora'}
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>

          <p className="text-[var(--text-dim)] text-sm">
            {lang === 'en' 
              ? 'Your order has been created. Complete payment to activate your account.' 
              : 'Tu orden ha sido creada. Completa el pago para activar tu cuenta.'}
          </p>
        </div>
      );
    }

    // Bank transfer or completed
    return (
      <div className="text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-[var(--success)]/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-[var(--success)]" />
        </div>

        <div>
          <h3 className="text-3xl font-bold text-gradient-gold mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
            {t.form.step4.title}
          </h3>
          <p className="text-[var(--text-mid)]">
            {formData.paymentMethod === 'bank_transfer' ? t.form.step4.bankTransfer : t.form.step4.provisioning}
          </p>
        </div>

        {/* Order Details */}
        <div className="glass-card p-6 max-w-md mx-auto text-left">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-mid)]">{t.form.step4.orderNumber}</span>
              <div className="flex items-center gap-2">
                <span className="text-[var(--nexus-gold)] font-mono font-bold">{orderNumber}</span>
                <button onClick={() => copyToClipboard(orderNumber)} className="text-[var(--text-dim)] hover:text-[var(--nexus-violet-lite)]">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-mid)]">{t.form.step4.business}</span>
              <span className="text-[var(--text-primary)]">{formData.businessName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-mid)]">{t.form.step4.plan}</span>
              <span className="text-[var(--text-primary)]">{t.pricing.plans[formData.planTier].name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-mid)]">{t.form.step4.totalPaid}</span>
              <span className="text-gradient-gold font-bold" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                TT${total}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[var(--text-mid)]">
          {t.form.step4.checkEmail} <span className="text-[var(--nexus-violet-lite)]">{formData.ownerEmail}</span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="btn-ghost">
            {t.form.step4.downloadInvoice}
          </Button>
          <a href="https://wa.me/18681234567" target="_blank" rel="noopener noreferrer">
            <Button className="btn-nexus">
              {t.form.step4.whatsappSupport}
            </Button>
          </a>
        </div>

        <p className="text-[var(--text-dim)] text-sm pt-8">
          {t.form.step4.thankYou}
        </p>
      </div>
    );
  };

  return (
    <section className="section-padding relative" id="apply">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {t.form.title}
          </h2>
          <p className="text-[var(--text-mid)] text-lg">
            {t.form.subtitle}
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-card p-6 sm:p-8">
          {!orderComplete && !paymentUrl && renderStepIndicator()}
          
          {currentStep === 1 && !orderComplete && !paymentUrl && renderStep1()}
          {currentStep === 2 && !orderComplete && !paymentUrl && renderStep2()}
          {currentStep === 3 && !orderComplete && !paymentUrl && renderStep3()}
          {(currentStep === 4 || orderComplete || paymentUrl) && renderStep4()}
        </div>
      </div>
    </section>
  );
}
