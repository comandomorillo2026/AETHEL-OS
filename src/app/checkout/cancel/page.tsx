'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

function CancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050410] p-4">
      <div className="aurora-bg" />
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 rounded-full bg-[#F87171]/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-[#F87171]" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-[#EDE9FE] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Pago Cancelado
          </h1>
          <p className="text-[#9D7BEA] mb-6">
            La transacción fue cancelada. No se realizó ningún cargo.
          </p>

          {/* Order Info */}
          {orderId && (
            <div className="bg-[rgba(108,63,206,0.07)] rounded-lg p-4 mb-6">
              <div className="flex justify-between">
                <span className="text-[rgba(167,139,250,0.7)]">Orden:</span>
                <span className="text-[#EDE9FE] font-mono text-sm">{orderId}</span>
              </div>
            </div>
          )}

          {/* Help Text */}
          <p className="text-sm text-[rgba(167,139,250,0.7)] mb-6">
            Si experimentaste problemas con el pago, por favor intenta de nuevo o contacta a soporte.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Intentar de Nuevo
            </Link>
            <Link
              href="/"
              className="w-full py-3 rounded-lg border border-[rgba(167,139,250,0.2)] text-[#9D7BEA] font-medium hover:bg-[rgba(108,63,206,0.07)] transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Inicio
            </Link>
          </div>
        </div>

        {/* Support */}
        <p className="text-center text-xs text-[rgba(167,139,250,0.3)] mt-6">
          ¿Necesitas ayuda?{' '}
          <a href="mailto:soporte@nexusos.tt" className="text-[#9D7BEA] hover:underline">
            soporte@nexusos.tt
          </a>
        </p>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  );
}
