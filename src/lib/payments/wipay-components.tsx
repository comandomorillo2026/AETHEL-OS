'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import type { WiPayConfig, WiPayPaymentRequest, WiPayPaymentResponse } from './wipay';

// WiPay Checkout Component
interface WiPayCheckoutProps {
  config: WiPayConfig;
  request: WiPayPaymentRequest;
  onSuccess?: (response: WiPayPaymentResponse) => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
}

export function WiPayCheckout({
  config,
  request,
  onSuccess,
  onCancel,
  onError,
}: WiPayCheckoutProps) {
  const [loading, setLoading] = useState(false);

  // Handle payment - redirects to WiPay
  const handlePayment = async () => {
    setLoading(true);

    try {
      // Build WiPay URL
      const baseUrl = config.environment === 'sandbox' 
        ? 'https://sandbox.wipaycaribbean.com/v2/payment'
        : 'https://wipaycaribbean.com/v2/payment';

      const params = new URLSearchParams({
        account_number: config.accountId,
        amount: request.amount.toFixed(2),
        currency: request.currency,
        description: request.description,
        customer_name: request.customerName,
        customer_email: request.customerEmail,
        customer_phone: request.customerPhone,
        order_id: request.orderId,
        return_url: request.returnUrl,
        cancel_url: request.cancelUrl,
        environment: config.environment,
      });

      // Redirect to WiPay
      window.location.href = `${baseUrl}?${params.toString()}`;

    } catch (error) {
      console.error('WiPay payment error:', error);
      onError?.('Failed to initialize payment');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Pago Seguro
        </h2>
        <p className="text-sm text-[var(--text-mid)]">
          Powered by WiPay Caribbean
        </p>
      </div>

      {/* Order Summary */}
      <div className="p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-[var(--text-mid)]">{request.description}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {request.currency} ${request.amount.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--success)]" />
            <span className="text-xs text-[var(--success)]">SSL Secured</span>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <Button
        onClick={handlePayment}
        disabled={loading || !config.accountId || !config.apiKey}
        className="w-full bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] text-white py-6"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Redirigiendo...
          </>
        ) : !config.accountId || !config.apiKey ? (
          <>
            <AlertTriangle className="w-5 h-5 mr-2" />
            WiPay No Configurado
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pagar {request.currency} ${request.amount.toFixed(2)}
          </>
        )}
      </Button>

      {/* WiPay Logo */}
      <div className="mt-6 text-center">
        <p className="text-xs text-[var(--text-dim)]">
          Pagos procesados de forma segura por
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-lg font-bold text-[#6366F1]">WiPay</span>
          <span className="text-sm text-[var(--text-dim)]">Caribbean</span>
        </div>
      </div>

      {/* Cancel Button */}
      {onCancel && (
        <Button
          variant="ghost"
          onClick={onCancel}
          className="w-full mt-4 text-[var(--text-mid)]"
        >
          Cancelar
        </Button>
      )}
    </div>
  );
}

// WiPay Not Configured Component
export function WiPayNotConfigured({ 
  onManualPayment 
}: { 
  onManualPayment?: () => void;
}) {
  return (
    <div className="max-w-md mx-auto p-6 glass-card text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--nexus-gold)]/20 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-[var(--nexus-gold)]" />
      </div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
        Pago Manual Requerido
      </h2>
      <p className="text-sm text-[var(--text-mid)] mb-4">
        La pasarela de pago automática aún no está configurada. 
        Puedes contactarnos para completar tu activación manualmente.
      </p>
      <div className="p-4 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)] mb-4 text-left">
        <p className="text-xs text-[var(--text-dim)] mb-2">Contacta a soporte:</p>
        <p className="text-sm text-[var(--text-primary)]">📧 soporte@nexusos.tt</p>
        <p className="text-sm text-[var(--text-primary)]">📱 +1 868-XXX-XXXX</p>
      </div>
      {onManualPayment && (
        <Button onClick={onManualPayment} className="btn-gold">
          Solicitar Activación Manual
        </Button>
      )}
    </div>
  );
}

// WiPay Success Component
export function WiPaySuccess({
  transactionId,
  amount,
  currency,
  businessName,
  onContinue,
}: {
  transactionId: string;
  amount: number;
  currency: string;
  businessName: string;
  onContinue?: () => void;
}) {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="w-20 h-20 rounded-full bg-[var(--success)]/20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-[var(--success)]" />
      </div>
      
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
        ¡Pago Exitoso!
      </h2>
      <p className="text-[var(--text-mid)] mb-6">
        Tu suscripción a {businessName} ha sido activada.
      </p>

      <div className="p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] mb-6 text-left">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[var(--text-dim)]">Monto:</span>
            <span className="text-[var(--text-primary)] font-medium">
              {currency} ${amount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-dim)]">Transacción:</span>
            <span className="text-[var(--text-primary)] font-mono text-sm">
              {transactionId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-dim)]">Fecha:</span>
            <span className="text-[var(--text-primary)]">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <Button onClick={onContinue} className="btn-nexus">
        Continuar al Dashboard
      </Button>
    </div>
  );
}
