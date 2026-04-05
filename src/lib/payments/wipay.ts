// WiPay Integration for Caribbean Payments
// https://wipaycaribbean.com/

export interface WiPayConfig {
  accountId: string;
  apiKey: string;
  countryCode: 'TT' | 'BB' | 'GD' | 'JM' | 'LC';
  environment: 'sandbox' | 'production';
}

export interface WiPayPaymentRequest {
  amount: number;
  currency: 'TTD' | 'USD' | 'BBD' | 'JMD';
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
  returnUrl: string;
  cancelUrl: string;
  isRecurring?: boolean;
  recurringInterval?: 'monthly' | 'annual' | 'biannual';
}

export interface WiPayPaymentResponse {
  success: boolean;
  transactionId?: string;
  redirectUrl?: string;
  error?: string;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
}

export interface WiPayWebhookPayload {
  transaction_id: string;
  order_id: string;
  status: 'success' | 'failed' | 'cancelled';
  amount: string;
  currency: string;
  customer_email: string;
  timestamp: string;
  signature: string;
}

// WiPay API URLs
const WIPAY_URLS = {
  sandbox: 'https://sandbox.wipaycaribbean.com/v2',
  production: 'https://wipaycaribbean.com/v2',
};

// Generate signature for WiPay requests
function generateWiPaySignature(apiKey: string, data: string): string {
  const crypto = require('crypto');
  return crypto
    .createHmac('sha256', apiKey)
    .update(data)
    .digest('hex');
}

// Generate payment URL for WiPay redirect
export function generateWiPayPaymentUrl(
  config: WiPayConfig,
  request: WiPayPaymentRequest
): string {
  const baseUrl = WIPAY_URLS[config.environment];
  
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

  if (request.isRecurring && request.recurringInterval) {
    params.append('recurring', 'true');
    params.append('recurring_interval', request.recurringInterval);
  }

  const signature = generateWiPaySignature(config.apiKey, params.toString());
  params.append('signature', signature);

  return `${baseUrl}/payment?${params.toString()}`;
}

// Verify WiPay webhook signature
export function verifyWiPayWebhook(
  apiKey: string,
  payload: WiPayWebhookPayload
): boolean {
  const data = `${payload.transaction_id}${payload.order_id}${payload.status}${payload.amount}${payload.currency}${payload.timestamp}`;
  const expectedSignature = generateWiPaySignature(apiKey, data);
  return payload.signature === expectedSignature;
}

// Process payment result from WiPay redirect
export function processWiPayResult(
  queryParams: URLSearchParams
): WiPayPaymentResponse {
  const status = queryParams.get('status');
  const transactionId = queryParams.get('transaction_id');
  const error = queryParams.get('error');

  if (status === 'success' && transactionId) {
    return {
      success: true,
      transactionId,
      status: 'completed',
    };
  }

  if (status === 'cancelled') {
    return {
      success: false,
      status: 'cancelled',
      error: 'Payment was cancelled by user',
    };
  }

  return {
    success: false,
    status: 'failed',
    error: error || 'Payment failed',
  };
}

// Calculate WiPay fees
export function calculateWiPayFees(amount: number): {
  platformFee: number;
  processingFee: number;
  totalFee: number;
} {
  // WiPay fees: 3.5% + TT$2.50 per transaction
  const processingFee = amount * 0.035;
  const platformFee = 2.50;
  return {
    platformFee,
    processingFee,
    totalFee: processingFee + platformFee,
  };
}

// Create a WiPay payment (wrapper for generateWiPayPaymentUrl)
export function createWiPayPayment(
  config: WiPayConfig,
  request: WiPayPaymentRequest
): { success: boolean; paymentUrl?: string; error?: string } {
  try {
    const paymentUrl = generateWiPayPaymentUrl(config, request);
    return { success: true, paymentUrl };
  } catch (error) {
    return { success: false, error: 'Failed to create payment' };
  }
}
