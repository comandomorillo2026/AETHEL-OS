'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if user was remembered
    const wasRemembered = document.cookie.includes('aethel_remember=true');
    if (wasRemembered) {
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (data.success) {
        // Success - redirect based on role
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(data.redirectPath || '/clinic');
        }
      } else {
        setError(data.error || 'Credenciales incorrectas. Verifica tu email y contraseña.');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050410]">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050410] p-4">
      <div className="aurora-bg" />
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#EDE9FE]" style={{ fontFamily: 'var(--font-cormorant)' }}>
            AETHEL OS
          </h1>
          <p className="text-[#9D7BEA] text-sm mt-1">Acceso al Sistema</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#F87171]/10 border border-[#F87171]/20 text-[#F87171] text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-[#9D7BEA]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(167,139,250,0.5)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.2)] text-[#EDE9FE] placeholder-[rgba(167,139,250,0.3)] focus:border-[#6C3FCE] focus:outline-none transition-colors"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#9D7BEA]">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(167,139,250,0.5)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-[rgba(108,63,206,0.07)] border border-[rgba(167,139,250,0.2)] text-[#EDE9FE] placeholder-[rgba(167,139,250,0.3)] focus:border-[#6C3FCE] focus:outline-none transition-colors"
                  placeholder="••••••••"
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                    rememberMe
                      ? 'bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] border-transparent'
                      : 'border-[rgba(167,139,250,0.3)] group-hover:border-[#9D7BEA]'
                  }`}>
                    {rememberMe && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-[#9D7BEA] group-hover:text-[#EDE9FE] transition-colors">
                  Recordarme
                </span>
              </label>

              {/* Forgot Password Link */}
              <a
                href="/forgot-password"
                className="text-sm text-[#9D7BEA] hover:text-[#EDE9FE] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-[rgba(167,139,250,0.1)]">
            <p className="text-xs text-[rgba(167,139,250,0.5)] text-center mb-3">Credenciales de demostración:</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => { setEmail('admin@aethel.tt'); setPassword('Aethel2024!'); }}
                className="w-full text-left p-2 rounded bg-[rgba(108,63,206,0.1)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.2)] text-sm transition-colors"
              >
                👑 Admin: admin@aethel.tt
              </button>
              <button
                type="button"
                onClick={() => { setEmail('clinic@aethel.tt'); setPassword('Demo2024!'); }}
                className="w-full text-left p-2 rounded bg-[rgba(108,63,206,0.1)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.2)] text-sm transition-colors"
              >
                🏥 Clínica: clinic@aethel.tt
              </button>
              <button
                type="button"
                onClick={() => { setEmail('lawfirm@aethel.tt'); setPassword('Demo2024!'); }}
                className="w-full text-left p-2 rounded bg-[rgba(108,63,206,0.1)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.2)] text-sm transition-colors"
              >
                ⚖️ Bufete: lawfirm@aethel.tt
              </button>
              <button
                type="button"
                onClick={() => { setEmail('beauty@aethel.tt'); setPassword('Demo2024!'); }}
                className="w-full text-left p-2 rounded bg-[rgba(108,63,206,0.1)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.2)] text-sm transition-colors"
              >
                💇 Salón: beauty@aethel.tt
              </button>
              <button
                type="button"
                onClick={() => { setEmail('nurse@aethel.tt'); setPassword('Demo2024!'); }}
                className="w-full text-left p-2 rounded bg-[rgba(108,63,206,0.1)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.2)] text-sm transition-colors"
              >
                💉 Enfermería: nurse@aethel.tt
              </button>
            </div>
          </div>
        </div>

        {/* Security note */}
        <p className="text-center text-xs text-[rgba(167,139,250,0.3)] mt-4">
          🔒 Tu sesión está protegida con encriptación de extremo a extremo
        </p>
      </div>
    </div>
  );
}
