'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { 
  WiPayConfig, 
  WiPayPaymentRequest, 
  WiPayPaymentResponse,
  generateWiPayPaymentUrl 
} from './wipay';

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
  onCancel,
  onError,
}: WiPayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState(request.customerName);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentUrl = generateWiPayPaymentUrl(config, {
        ...request,
        customerName: cardholderName,
      });
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('WiPay payment error:', error);
      onError?.('Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold">Pago Seguro</h2>
        <p className="text-sm text-muted-foreground">Powered by WiPay Caribbean</p>
      </div>

      <div className="p-4 rounded-xl bg-muted border mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">{request.description}</p>
            <p className="text-2xl font-bold">
              {request.currency} ${request.amount.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-xs text-green-500">SSL Secured</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Nombre del Titular</Label>
          <Input
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="JUAN PÉREZ"
            className="uppercase"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Número de Tarjeta</Label>
          <Input
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Expiración</Label>
            <Input
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>CVV</Label>
            <Input
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="123"
              maxLength={4}
              type="password"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#6C3FCE] to-[#C026D3] text-white py-6"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pagar {request.currency} ${request.amount.toFixed(2)}
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">Pagos procesados de forma segura por</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-lg font-bold text-[#6366F1]">WiPay</span>
          <span className="text-sm text-muted-foreground">Caribbean</span>
        </div>
      </div>

      {onCancel && (
        <Button variant="ghost" onClick={onCancel} className="w-full mt-4">
          Cancelar
        </Button>
      )}
    </div>
  );
}

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
      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">¡Pago Exitoso!</h2>
      <p className="text-muted-foreground mb-6">
        Tu suscripción a {businessName} ha sido activada.
      </p>

      <div className="p-4 rounded-xl bg-muted border mb-6 text-left">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monto:</span>
            <span className="font-medium">{currency} ${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transacción:</span>
            <span className="font-mono text-sm">{transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fecha:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <Button onClick={onContinue} className="w-full">
        Continuar al Dashboard
      </Button>
    </div>
  );
}
