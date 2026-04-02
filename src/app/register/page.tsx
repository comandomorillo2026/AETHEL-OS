'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  Building2,
  User,
  Phone,
  ArrowLeft,
} from 'lucide-react';

const industries = [
  { slug: 'clinic', name: 'Clínica Médica', icon: '🏥' },
  { slug: 'nurse', name: 'Cuidados de Enfermería', icon: '💉' },
  { slug: 'lawfirm', name: 'Bufete de Abogados', icon: '⚖️' },
  { slug: 'beauty', name: 'Salón de Belleza', icon: '💇‍♀️' },
  { slug: 'bakery', name: 'Panadería / Pastelería', icon: '🥐' },
  { slug: 'pharmacy', name: 'Farmacia', icon: '💊' },
  { slug: 'insurance', name: 'Compañía de Seguros', icon: '🛡️' },
];

const plans = [
  { slug: 'starter', name: 'Inicial', price: 'TT$800/mes', users: 2 },
  { slug: 'growth', name: 'Crecimiento', price: 'TT$1,500/mes', users: 5, popular: true },
  { slug: 'premium', name: 'Premium', price: 'TT$2,800/mes', users: 15 },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    industrySlug: '',
    planSlug: 'growth',
    phone: '',
    country: 'Trinidad & Tobago',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.name) {
      setError('Completa todos los campos requeridos');
      return false;
    }
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.businessName || !formData.industrySlug) {
      setError('Completa todos los campos requeridos');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al registrar');
        return;
      }

      setSuccess(true);

      // Auto-login after successful registration
      const loginResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (loginResult?.ok) {
        // Redirect to appropriate dashboard
        const industryPaths: Record<string, string> = {
          clinic: '/clinic',
          nurse: '/nurse',
          lawfirm: '/lawfirm',
          beauty: '/beauty',
          bakery: '/bakery',
          pharmacy: '/pharmacy',
          insurance: '/insurance',
        };
        setTimeout(() => {
          router.push(industryPaths[formData.industrySlug] || '/clinic');
        }, 1500);
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050410]">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] animate-pulse" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050410] p-4">
        <div className="aurora-bg" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-full bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#22C55E]" />
          </div>
          <h2 className="text-2xl font-bold text-[#EDE9FE] mb-2">¡Registro Exitoso!</h2>
          <p className="text-[#9D7BEA]">Redirigiendo a tu panel de control...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050410] p-4">
      <div className="aurora-bg" />
      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center mx-auto mb-3">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#EDE9FE]" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Crear Cuenta
          </h1>
          <p className="text-[#9D7BEA] text-sm">Paso {step} de 3</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-gradient-to-r from-[#6C3FCE] to-[#C026D3]' : 'bg-[rgba(108,63,206,0.2)]'
              }`}
            />
          ))}
        </div>

        {/* Form */}
        <div className="glass-card p-6">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#F87171]/10 border border-[#F87171]/20 text-[#F87171] text-sm mb-4">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Step 1: Account Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-[#9D7BEA]">Nombre completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(167,139,250,0.5)]" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.2)] text-[#EDE9FE] placeholder-[rgba(167,139,250,0.3)] focus:border-[#6C3FCE] focus:outline-none transition-colors"
                      placeholder="Dr. Juan Pérez"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#9D7BEA]">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(167,139,250,0.5)]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.2)] text-[#EDE9FE] placeholder-[rgba(167,139,250,0.3)] focus:border-[#6C3FCE] focus:outline-none transition-colors"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#9D7BEA]">Contraseña *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(167,139,250,0.5)]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.2)] text-[#EDE9FE] placeholder-[rgba(167,139,250,0.3)] focus:border-[#6C3FCE] focus:outline-none transition-colors"
                      placeholder="Mínimo 8 caracteres"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(167,139,250,0.5)] hover:text-[#9D7BEA]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#9D7BEA]">Confirmar contraseña *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(167,139,250,0.5)]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.2)] text-[#EDE9FE] placeholder-[rgba(167,139,250,0.3)] focus:border-[#6C3FCE] focus:outline-none transition-colors"
                      placeholder="Repite tu contraseña"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Business Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-[#9D7BEA]">Nombre del negocio *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(167,139,250,0.5)]" />
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.2)] text-[#EDE9FE] placeholder-[rgba(167,139,250,0.3)] focus:border-[#6C3FCE] focus:outline-none transition-colors"
                      placeholder="Clínica San Fernando"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#9D7BEA]">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(167,139,250,0.5)]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.2)] text-[#EDE9FE] placeholder-[rgba(167,139,250,0.3)] focus:border-[#6C3FCE] focus:outline-none transition-colors"
                      placeholder="+1 868 123 4567"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-[#9D7BEA]">Tipo de negocio *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {industries.map((ind) => (
                      <button
                        key={ind.slug}
                        type="button"
                        onClick={() => setFormData({ ...formData, industrySlug: ind.slug })}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          formData.industrySlug === ind.slug
                            ? 'border-[#6C3FCE] bg-[rgba(108,63,206,0.15)]'
                            : 'border-[rgba(167,139,250,0.2)] bg-[rgba(108,63,206,0.07)] hover:border-[rgba(167,139,250,0.4)]'
                        }`}
                      >
                        <span className="text-lg">{ind.icon}</span>
                        <p className="text-sm text-[#EDE9FE] mt-1">{ind.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Plan Selection */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm text-[#9D7BEA]">Selecciona tu plan</label>
                  <div className="space-y-2">
                    {plans.map((plan) => (
                      <button
                        key={plan.slug}
                        type="button"
                        onClick={() => setFormData({ ...formData, planSlug: plan.slug })}
                        className={`w-full p-4 rounded-lg border text-left transition-all relative ${
                          formData.planSlug === plan.slug
                            ? 'border-[#6C3FCE] bg-[rgba(108,63,206,0.15)]'
                            : 'border-[rgba(167,139,250,0.2)] bg-[rgba(108,63,206,0.07)] hover:border-[rgba(167,139,250,0.4)]'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2 right-4 px-2 py-0.5 rounded-full bg-[#F0B429] text-xs text-black font-medium">
                            Popular
                          </span>
                        )}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-[#EDE9FE]">{plan.name}</p>
                            <p className="text-sm text-[#9D7BEA]">Hasta {plan.users} usuarios</p>
                          </div>
                          <p className="text-lg font-bold text-[#EDE9FE]">{plan.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.2)]">
                  <p className="text-xs text-[#9D7BEA]">
                    💳 No se requiere tarjeta de crédito. Tienes 14 días de prueba gratis.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[rgba(167,139,250,0.2)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.1)] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Continuar
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6 pt-6 border-t border-[rgba(167,139,250,0.1)] text-center">
            <p className="text-sm text-[rgba(167,139,250,0.5)]">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-[#9D7BEA] hover:text-[#EDE9FE] transition-colors"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
