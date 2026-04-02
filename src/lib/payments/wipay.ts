// WiPay Integration for Caribbean Payments
// https://wipaycaribbean.com/
// SERVER-SIDE FUNCTIONS ONLY

import crypto from 'crypto';

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
  // For subscriptions
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

// Generate payment URL for WiPay redirect
export function generateWiPayPaymentUrl(
  config: WiPayConfig,
  request: WiPayPaymentRequest
): string {
  const baseUrl = WIPAY_URLS[config.environment];
  
  // Build query parameters
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

  // Add recurring parameters if subscription
  if (request.isRecurring && request.recurringInterval) {
    params.append('recurring', 'true');
    params.append('recurring_interval', request.recurringInterval);
  }

  // Generate signature for security
  const signature = generateWiPaySignature(config.apiKey, params.toString());
  params.append('signature', signature);

  return `${baseUrl}/payment?${params.toString()}`;
}

// Generate signature for WiPay requests
function generateWiPaySignature(apiKey: string, data: string): string {
  return crypto
    .createHmac('sha256', apiKey)
    .update(data)
    .digest('hex');
}

// Verify WiPay webhook signature
export function verifyWiPayWebhook(
  apiKey: string,
  payload: WiPayWebhookPayload
): boolean {
  // Reconstruct the data string
  const data = `${payload.transaction_id}${payload.order_id}${payload.status}${payload.amount}${payload.currency}${payload.timestamp}`;
  
  // Calculate expected signature
  const expectedSignature = generateWiPaySignature(apiKey, data);
  
  // Compare signatures
  return payload.signature === expectedSignature;
}

// Process payment result from WiPay redirect
export function processWiPayResult(
  queryParams: URLSearchParams
): WiPayPaymentResponse {
  const status = queryParams.get('status');
  const transactionId = queryParams.get('transaction_id');
  const orderId = queryParams.get('order_id');
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

// Get WiPay configuration from environment
export function getWiPayConfig(): WiPayConfig {
  return {
    accountId: process.env.WIPAY_ACCOUNT_ID || '',
    apiKey: process.env.WIPAY_API_KEY || '',
    countryCode: 'TT',
    environment: (process.env.WIPAY_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  };
}

// Check if WiPay is configured
export function isWiPayConfigured(): boolean {
  const config = getWiPayConfig();
  return !!(config.accountId && config.apiKey);
}

// Calculate WiPay fees (3% + TT$1 per transaction)
export function calculateWiPayFees(amount: number): { fee: number; total: number } {
  const percentageFee = amount * 0.03; // 3%
  const fixedFee = 1; // TT$1
  const fee = Math.round((percentageFee + fixedFee) * 100) / 100;
  const total = Math.round((amount + fee) * 100) / 100;
  return { fee, total };
}

// Create a WiPay payment session
export async function createWiPayPayment(params: {
  amount: number;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
}): Promise<{
  status: 'success' | 'error';
  transaction_id?: string;
  url?: string;
  error?: string;
}> {
  const config = getWiPayConfig();
  
  // Check if WiPay is configured
  if (!config.accountId || !config.apiKey) {
    return {
      status: 'error',
      error: 'WiPay no está configurado. Contacta al administrador.',
    };
  }

  // Generate return and cancel URLs
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nexus-os-alpha.vercel.app';
  const returnUrl = `${baseUrl}/checkout/success`;
  const cancelUrl = `${baseUrl}/checkout/cancel`;

  // Generate payment URL
  const paymentUrl = generateWiPayPaymentUrl(config, {
    amount: params.amount,
    currency: 'TTD',
    description: params.description,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    customerPhone: params.customerPhone,
    orderId: params.orderId,
    returnUrl,
    cancelUrl,
  });

  // Generate a transaction ID for tracking
  const transactionId = `WIP-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  return {
    status: 'success',
    transaction_id: transactionId,
    url: paymentUrl,
  };
}
