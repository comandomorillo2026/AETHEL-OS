'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      setSuccess(true);
    } catch (err) {
      setError('Error al enviar el email. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050410] p-4">
        <div className="aurora-bg" />
        <div className="relative z-10 w-full max-w-md">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
            </div>
            <h1 className="text-2xl font-bold text-[#EDE9FE] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Email Enviado
            </h1>
            <p className="text-[#9D7BEA] mb-6">
              Si existe una cuenta con <strong>{email}</strong>, recibirás un email con instrucciones para restablecer tu contraseña.
            </p>
            <Link
              href="/login"
              className="text-[#9D7BEA] hover:text-[#EDE9FE] transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al login
            </Link>
          </div>
        </div>
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
            Recuperar Contraseña
          </h1>
          <p className="text-[#9D7BEA] text-sm mt-1">Te enviaremos un email para restablecerla</p>
        </div>

        {/* Form */}
        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-[#F87171]/10 border border-[#F87171]/20 text-[#F87171] text-sm">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Email'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[rgba(167,139,250,0.1)] text-center">
            <Link
              href="/login"
              className="text-[#9D7BEA] hover:text-[#EDE9FE] transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
