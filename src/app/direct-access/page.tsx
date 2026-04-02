'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Shield, CheckCircle, XCircle } from 'lucide-react';
import { DEMO_USERS, DEMO_PASSWORDS, getRedirectPath } from '@/lib/auth/demo-auth';

// Quick access credentials for demo
const QUICK_ACCESS_TYPES = ['admin', 'clinic', 'lawfirm', 'beauty', 'nurse', 'bakery', 'pharmacy', 'insurance'] as const;
type QuickAccessType = typeof QUICK_ACCESS_TYPES[number];

const QUICK_ACCESS: Record<QuickAccessType, { email: string; password: string }> = {
  admin: { email: 'admin@nexusos.tt', password: 'admin123' },
  clinic: { email: 'clinic@demo.tt', password: 'demo123' },
  lawfirm: { email: 'lawfirm@demo.tt', password: 'demo123' },
  beauty: { email: 'beauty@demo.tt', password: 'demo123' },
  nurse: { email: 'nurse@demo.tt', password: 'demo123' },
  bakery: { email: 'bakery@demo.tt', password: 'demo123' },
  pharmacy: { email: 'pharmacy@demo.tt', password: 'demo123' },
  insurance: { email: 'insurance@demo.tt', password: 'demo123' },
};

export default function DirectAccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Conectando...');

  useEffect(() => {
    const autoLogin = async () => {
      const type = (searchParams.get('type') || 'admin') as QuickAccessType;

      if (!QUICK_ACCESS_TYPES.includes(type)) {
        setStatus('error');
        setMessage(`Tipo de acceso inválido: ${type}. Use: ${QUICK_ACCESS_TYPES.join(', ')}`);
        return;
      }

      const credentials = QUICK_ACCESS[type];
      const demoUser = DEMO_USERS[credentials.email];

      setMessage(`Accediendo como ${credentials.email}...`);

      try {
        const result = await signIn('credentials', {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
        });

        if (result?.error) {
          console.error('[DIRECT_ACCESS] Error:', result.error);
          setStatus('error');
          setMessage(`Error de autenticación: ${result.error}`);
          setTimeout(() => router.push('/login'), 3000);
        } else {
          setStatus('success');
          setMessage('¡Acceso autorizado! Redirigiendo...');

          const redirectPath = demoUser ? getRedirectPath(demoUser) : '/admin';

          setTimeout(() => {
            router.push(redirectPath);
            router.refresh();
          }, 500);
        }
      } catch (err) {
        console.error('[DIRECT_ACCESS] Exception:', err);
        setStatus('error');
        setMessage('Error de conexión');
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    autoLogin();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050410]">
      <div className="aurora-bg" />
      <div className="relative z-10 flex flex-col items-center gap-6 p-8">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center shadow-lg shadow-purple-500/20">
          {status === 'loading' && <Loader2 className="w-12 h-12 text-white animate-spin" />}
          {status === 'success' && <CheckCircle className="w-12 h-12 text-green-400" />}
          {status === 'error' && <XCircle className="w-12 h-12 text-red-400" />}
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#EDE9FE] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
            NexusOS
          </h1>
          <p className={`text-sm font-medium ${status === 'error' ? 'text-red-400' : status === 'success' ? 'text-green-400' : 'text-[#9D7BEA]'}`}>
            {message}
          </p>
        </div>

        {/* Quick access buttons for all types */}
        {status === 'error' && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {QUICK_ACCESS_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => router.push(`/direct-access?type=${t}`)}
                className="px-3 py-1.5 text-xs rounded-lg bg-[rgba(108,63,206,0.2)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.4)] transition-colors border border-[rgba(167,139,250,0.2)]"
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
