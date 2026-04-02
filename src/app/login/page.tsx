'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Demo credentials - works without backend
const DEMO_CREDENTIALS: Record<string, { password: string; redirect: string; name: string }> = {
  'admin@nexusos.tt': { password: 'admin123', redirect: '/admin', name: 'Super Admin' },
  'clinic@demo.tt': { password: 'demo123', redirect: '/clinic', name: 'Dr. Juan Martínez' },
  'lawfirm@demo.tt': { password: 'demo123', redirect: '/lawfirm', name: 'Carlos Pérez' },
  'beauty@demo.tt': { password: 'demo123', redirect: '/beauty', name: 'Ana Gómez' },
  'nurse@demo.tt': { password: 'demo123', redirect: '/nurse', name: 'María Rodríguez' },
  'bakery@demo.tt': { password: 'demo123', redirect: '/bakery', name: 'Pedro González' },
  'pharmacy@demo.tt': { password: 'demo123', redirect: '/pharmacy', name: 'Laura Fernández' },
  'insurance@demo.tt': { password: 'demo123', redirect: '/insurance', name: 'Roberto Trinidad' },
};

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simple client-side authentication
    const emailLower = email.toLowerCase().trim();
    const creds = DEMO_CREDENTIALS[emailLower];

    if (!creds) {
      setError('Email no registrado. Usa las credenciales de demostración.');
      setIsSubmitting(false);
      return;
    }

    if (password !== creds.password) {
      setError('Contraseña incorrecta.');
      setIsSubmitting(false);
      return;
    }

    // Store auth in localStorage
    const authData = {
      email: emailLower,
      name: creds.name,
      redirect: creds.redirect,
      authenticatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('nexusos-demo-auth', JSON.stringify(authData));
      
      // Small delay for UX
      await new Promise(r => setTimeout(r, 500));
      
      // Redirect
      router.push(creds.redirect);
    } catch (err) {
      setError('Error al guardar la sesión.');
    } finally {
      setIsSubmitting(false);
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
            NexusOS
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
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
                onClick={() => { setEmail('admin@nexusos.tt'); setPassword('admin123'); }}
                className="w-full text-left p-2 rounded bg-[rgba(108,63,206,0.1)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.2)] text-sm transition-colors"
                disabled={isSubmitting}
              >
                👑 Admin: admin@nexusos.tt / admin123
              </button>
              <button
                type="button"
                onClick={() => { setEmail('clinic@demo.tt'); setPassword('demo123'); }}
                className="w-full text-left p-2 rounded bg-[rgba(108,63,206,0.1)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.2)] text-sm transition-colors"
                disabled={isSubmitting}
              >
                🏥 Clínica: clinic@demo.tt / demo123
              </button>
              <button
                type="button"
                onClick={() => { setEmail('lawfirm@demo.tt'); setPassword('demo123'); }}
                className="w-full text-left p-2 rounded bg-[rgba(108,63,206,0.1)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.2)] text-sm transition-colors"
                disabled={isSubmitting}
              >
                ⚖️ Bufete: lawfirm@demo.tt / demo123
              </button>
              <button
                type="button"
                onClick={() => { setEmail('beauty@demo.tt'); setPassword('demo123'); }}
                className="w-full text-left p-2 rounded bg-[rgba(108,63,206,0.1)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.2)] text-sm transition-colors"
                disabled={isSubmitting}
              >
                💇 Salón: beauty@demo.tt / demo123
              </button>
            </div>
          </div>
        </div>

        {/* Register link */}
        <div className="text-center mt-4">
          <p className="text-sm text-[rgba(167,139,250,0.5)]">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-[#9D7BEA] hover:text-[#EDE9FE] font-medium transition-colors">
              Crear cuenta
            </Link>
          </p>
        </div>

        {/* Back link */}
        <p className="text-center text-xs text-[rgba(167,139,250,0.3)] mt-4">
          <Link href="/" className="hover:text-[#9D7BEA]">← Volver al inicio</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
