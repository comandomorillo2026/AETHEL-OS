// ============================================
// ARTIM PAYMENT GATEWAY INTEGRATION
// ============================================

import crypto from 'crypto';

interface ArtimPaymentParams {
  amount: number;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderId: string;
}

interface ArtimPaymentResult {
  success: boolean;
  sessionId?: string;
  paymentUrl?: string;
  error?: string;
}

interface ArtimWebhookPayload {
  session_id: string;
  order_id: string;
  status: 'completed' | 'failed' | 'pending';
  amount: number;
  currency: string;
  customer_email: string;
  timestamp: string;
  signature: string;
}

// Artim API configuration
const ARTIM_API_URL = process.env.ARTIM_API_URL || 'https://api.artim.com/v1';
const ARTIM_API_KEY = process.env.ARTIM_API_KEY || '';
const ARTIM_MERCHANT_ID = process.env.ARTIM_MERCHANT_ID || '';

// Fee structure (Artim charges 2.5% + TT$2.00)
export function calculateArtimFees(amount: number): { fee: number; total: number } {
  const percentageFee = amount * 0.025;
  const fixedFee = 2.00;
  const fee = Math.round((percentageFee + fixedFee) * 100) / 100;
  const total = Math.round((amount + fee) * 100) / 100;
  return { fee, total };
}

// Create a payment session
export async function createArtimPayment(params: ArtimPaymentParams): Promise<ArtimPaymentResult> {
  try {
    // If API key is not configured, return mock for development
    if (!ARTIM_API_KEY) {
      console.log('[ARTIM] No API key configured, using mock mode');
      const mockSessionId = `ARTIM-MOCK-${Date.now()}`;
      return {
        success: true,
        sessionId: mockSessionId,
        paymentUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success?order=${params.orderId}&mock=artim`,
      };
    }

    const response = await fetch(`${ARTIM_API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ARTIM_API_KEY}`,
        'X-Merchant-ID': ARTIM_MERCHANT_ID,
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: 'TTD',
        description: params.description,
        customer: {
          name: params.customerName,
          email: params.customerEmail,
          phone: params.customerPhone,
        },
        order_id: params.orderId,
        return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success`,
        cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/cancel`,
        webhook_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/webhooks/artim`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[ARTIM] API error:', errorData);
      return {
        success: false,
        error: errorData.message || 'Failed to create Artim payment session',
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      sessionId: data.session_id || data.id,
      paymentUrl: data.payment_url || data.checkout_url,
    };
  } catch (error) {
    console.error('[ARTIM] Error creating payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Verify webhook signature
export function verifyArtimWebhook(
  payload: string,
  signature: string,
  secret: string = process.env.ARTIM_WEBHOOK_SECRET || ''
): boolean {
  if (!secret) {
    console.warn('[ARTIM] Webhook secret not configured');
    return true; // Allow in development
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error('[ARTIM] Error verifying webhook:', error);
    return false;
  }
}

// Parse webhook payload
export function parseArtimWebhook(payload: ArtimWebhookPayload): {
  orderId: string;
  status: 'paid' | 'failed' | 'pending';
  amount: number;
  currency: string;
  customerEmail: string;
  transactionId: string;
} {
  return {
    orderId: payload.order_id,
    status: payload.status === 'completed' ? 'paid' : payload.status === 'failed' ? 'failed' : 'pending',
    amount: payload.amount,
    currency: payload.currency,
    customerEmail: payload.customer_email,
    transactionId: payload.session_id,
  };
}

// Get payment status
export async function getArtimPaymentStatus(sessionId: string): Promise<{
  status: 'completed' | 'failed' | 'pending';
  amount: number;
} | null> {
  try {
    if (!ARTIM_API_KEY) {
      return { status: 'completed', amount: 0 };
    }

    const response = await fetch(`${ARTIM_API_URL}/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ARTIM_API_KEY}`,
        'X-Merchant-ID': ARTIM_MERCHANT_ID,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      status: data.status || 'pending',
      amount: data.amount || 0,
    };
  } catch (error) {
    console.error('[ARTIM] Error getting payment status:', error);
    return null;
  }
}

// Create refund
export async function createArtimRefund(params: {
  sessionId: string;
  amount?: number;
  reason?: string;
}): Promise<{ success: boolean; refundId?: string; error?: string }> {
  try {
    if (!ARTIM_API_KEY) {
      return { success: true, refundId: `REFUND-MOCK-${Date.now()}` };
    }

    const response = await fetch(`${ARTIM_API_URL}/refunds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ARTIM_API_KEY}`,
        'X-Merchant-ID': ARTIM_MERCHANT_ID,
      },
      body: JSON.stringify({
        session_id: params.sessionId,
        amount: params.amount,
        reason: params.reason,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || 'Failed to create refund',
      };
    }

    const data = await response.json();
    return {
      success: true,
      refundId: data.refund_id || data.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
