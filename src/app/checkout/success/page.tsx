'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('order_id');
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    // Simulate processing
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050410]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#6C3FCE] mx-auto" />
          <p className="text-[#9D7BEA] mt-4">Procesando pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050410] p-4">
      <div className="aurora-bg" />
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-[#EDE9FE] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
            ¡Pago Exitoso!
          </h1>
          <p className="text-[#9D7BEA] mb-6">
            Tu suscripción ha sido activada correctamente.
          </p>

          {/* Order Details */}
          {orderId && (
            <div className="bg-[rgba(108,63,206,0.07)] rounded-lg p-4 mb-6">
              <div className="text-sm text-[#9D7BEA] mb-2">Detalles de la transacción</div>
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-[rgba(167,139,250,0.7)]">Orden:</span>
                  <span className="text-[#EDE9FE] font-mono text-sm">{orderId}</span>
                </div>
                {transactionId && (
                  <div className="flex justify-between">
                    <span className="text-[rgba(167,139,250,0.7)]">Transacción:</span>
                    <span className="text-[#EDE9FE] font-mono text-sm">{transactionId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="text-left mb-6">
            <p className="text-sm text-[#9D7BEA] mb-3">Lo que sigue:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-[#EDE9FE]">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                Acceso completo a tu panel de control
              </li>
              <li className="flex items-center gap-2 text-sm text-[#EDE9FE]">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                Soporte técnico prioritario
              </li>
              <li className="flex items-center gap-2 text-sm text-[#EDE9FE]">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                Factura enviada a tu email
              </li>
            </ul>
          </div>

          {/* CTA */}
          <Link
            href="/clinic"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Ir a mi Panel de Control
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[rgba(167,139,250,0.3)] mt-6">
          ¿Preguntas? Contacta a{' '}
          <a href="mailto:soporte@nexusos.tt" className="text-[#9D7BEA] hover:underline">
            soporte@nexusos.tt
          </a>
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050410]">
          <Loader2 className="w-12 h-12 animate-spin text-[#6C3FCE]" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
