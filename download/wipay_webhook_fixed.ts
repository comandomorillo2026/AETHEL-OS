import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyWiPayWebhook } from '@/lib/payments/wipay';

// ============================================================================
// WIPAY IP WHITELIST - IPs oficiales de WiPay
// ============================================================================

// IPs permitidas de WiPay (actualizar con las IPs reales de producción)
const WIPAY_IPS_PRODUCTION = [
  '52.42.70.206',      // WiPay Production US-West-2
  '54.70.135.92',      // WiPay Production US-West-2
  '44.234.231.178',    // WiPay Production US-West-2
  '35.163.210.225',    // WiPay Production US-West-2
];

const WIPAY_IPS_SANDBOX = [
  // IPs de sandbox de WiPay (agregar cuando estén disponibles)
  '0.0.0.0',           // Placeholder - actualizar con IPs reales
];

// Obtener IPs permitidas según ambiente
function getAllowedIPs(): string[] {
  const environment = process.env.WIPAY_ENVIRONMENT || 'sandbox';
  return environment === 'production' ? WIPAY_IPS_PRODUCTION : WIPAY_IPS_SANDBOX;
}

// ============================================================================
// IP EXTRACTION - Obtener IP real del cliente
// ============================================================================

function getClientIP(req: NextRequest): string {
  // Vercel y otros proxies usan estos headers
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Cloudflare
  const cfIP = req.headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP;
  }
  
  return 'unknown';
}

// ============================================================================
// IP VALIDATION - Verificar que la petición viene de WiPay
// ============================================================================

function isValidWiPayIP(ip: string): boolean {
  // En desarrollo/sandbox, permitir todas las IPs
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }
  
  // En producción, validar IP
  const allowedIPs = getAllowedIPs();
  
  // Si no hay IPs configuradas, permitir (para no romper integración)
  if (allowedIPs.length === 0 || allowedIPs[0] === '0.0.0.0') {
    console.warn('[WIPAY_WEBHOOK] IP validation disabled - no IPs configured');
    return true;
  }
  
  return allowedIPs.includes(ip);
}

// ============================================================================
// IDEMPOTENCY - Evitar procesamiento duplicado
// ============================================================================

async function checkIdempotency(transactionId: string): Promise<{ processed: boolean; orderId?: string }> {
  // Verificar si ya existe un registro con este transactionId
  const existingPayment = await prisma.paymentVerification.findFirst({
    where: { transactionId },
    include: { salesOrder: { select: { orderNumber: true } } },
  });
  
  if (existingPayment) {
    return { 
      processed: true, 
      orderId: existingPayment.orderNumber 
    };
  }
  
  return { processed: false };
}

// ============================================================================
// WEBHOOK HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = getClientIP(request);
  
  try {
    // ========================================================================
    // 1. VALIDACIÓN DE IP
    // ========================================================================
    if (!isValidWiPayIP(clientIP)) {
      console.error(`[WIPAY_WEBHOOK] Invalid IP: ${clientIP}`);
      return NextResponse.json(
        { error: 'Unauthorized source' },
        { status: 403 }
      );
    }

    // ========================================================================
    // 2. PARSEAR BODY
    // ========================================================================
    const body = await request.json();
    
    console.log('[WIPAY_WEBHOOK] Received from IP:', clientIP);
    console.log('[WIPAY_WEBHOOK] Payload:', JSON.stringify(body, null, 2));

    const {
      transaction_id,
      order_id,
      status,
      amount,
      currency,
      customer_email,
      customer_name,
      payment_method,
      timestamp,
      hash,
    } = body;

    // ========================================================================
    // 3. VALIDACIÓN DE DATOS REQUERIDOS
    // ========================================================================
    if (!transaction_id || !order_id || !status) {
      console.error('[WIPAY_WEBHOOK] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: transaction_id, order_id, status' },
        { status: 400 }
      );
    }

    // ========================================================================
    // 4. VALIDACIÓN DE FIRMA (HMAC)
    // ========================================================================
    const apiKey = process.env.WIPAY_API_KEY;
    
    if (apiKey && apiKey !== 'your_wipay_api_key_here' && apiKey.length > 10) {
      const isValid = verifyWiPayWebhook(body, apiKey);
      if (!isValid) {
        console.error('[WIPAY_WEBHOOK] Invalid hash signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        );
      }
      console.log('[WIPAY_WEBHOOK] Signature verified');
    } else {
      console.warn('[WIPAY_WEBHOOK] Skipping signature verification - no valid API key');
    }

    // ========================================================================
    // 5. IDEMPOTENCY CHECK - Evitar duplicados
    // ========================================================================
    const idempotency = await checkIdempotency(transaction_id);
    
    if (idempotency.processed) {
      console.log(`[WIPAY_WEBHOOK] Transaction ${transaction_id} already processed (order: ${idempotency.orderId})`);
      return NextResponse.json({ 
        received: true, 
        message: 'Transaction already processed',
        orderId: idempotency.orderId 
      });
    }

    // ========================================================================
    // 6. BUSCAR ORDEN
    // ========================================================================
    const salesOrder = await prisma.salesOrder.findUnique({
      where: { orderNumber: order_id },
    });

    if (!salesOrder) {
      console.error('[WIPAY_WEBHOOK] Order not found:', order_id);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // ========================================================================
    // 7. VALIDACIÓN DE MONTO
    // ========================================================================
    if (amount && salesOrder.amount) {
      const expectedAmount = Number(salesOrder.amount);
      const receivedAmount = Number(amount);
      
      // Permitir pequeña diferencia por redondeo (1%)
      const tolerance = expectedAmount * 0.01;
      const difference = Math.abs(expectedAmount - receivedAmount);
      
      if (difference > tolerance) {
        console.error(`[WIPAY_WEBHOOK] Amount mismatch: expected ${expectedAmount}, got ${receivedAmount}`);
        // Log pero no rechazar - solo alertar
        await prisma.salesAuditLog.create({
          data: {
            action: 'amount_mismatch_warning',
            orderNumber: salesOrder.orderNumber,
            salesOrderId: salesOrder.id,
            performedByEmail: 'system',
            details: `Amount mismatch: expected TT$${expectedAmount}, received TT$${receivedAmount}`,
            severity: 'warning',
          },
        });
      }
    }

    // ========================================================================
    // 8. PROCESAMIENTO POR ESTADO
    // ========================================================================
    if (status === 'approved') {
      await handleApprovedPayment({
        salesOrder,
        transaction_id,
        amount,
        currency,
        customer_email,
        customer_name,
        payment_method,
        body,
      });
      
      console.log(`[WIPAY_WEBHOOK] Payment approved: ${transaction_id} for order ${order_id}`);
      
    } else if (status === 'declined' || status === 'cancelled') {
      await handleFailedPayment({
        salesOrder,
        transaction_id,
        status,
        body,
      });
      
      console.log(`[WIPAY_WEBHOOK] Payment ${status}: ${transaction_id}`);
      
    } else if (status === 'pending') {
      // Payment pendiente - solo registrar
      await prisma.salesOrder.update({
        where: { id: salesOrder.id },
        data: {
          transactionId: transaction_id,
          notes: `Payment pending: ${transaction_id}`,
        },
      });
      
      console.log(`[WIPAY_WEBHOOK] Payment pending: ${transaction_id}`);
    }

    // ========================================================================
    // 9. RESPUESTA EXITOSA
    // ========================================================================
    const processingTime = Date.now() - startTime;
    console.log(`[WIPAY_WEBHOOK] Processed in ${processingTime}ms`);
    
    return NextResponse.json({ 
      received: true,
      transactionId: transaction_id,
      orderId: order_id,
      status: status,
      processingTimeMs: processingTime,
    });
    
  } catch (error) {
    console.error('[WIPAY_WEBHOOK_ERROR]', error);
    
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// HANDLERS
// ============================================================================

interface PaymentData {
  salesOrder: { id: string; orderNumber: string; ownerEmail: string; amount?: unknown };
  transaction_id: string;
  amount?: number | string;
  currency?: string;
  customer_email?: string;
  customer_name?: string;
  payment_method?: string;
  body: Record<string, unknown>;
}

async function handleApprovedPayment(data: PaymentData) {
  const { salesOrder, transaction_id, amount, currency, customer_email, customer_name, payment_method, body } = data;
  
  await prisma.$transaction(async (tx) => {
    // 1. Actualizar orden
    await tx.salesOrder.update({
      where: { id: salesOrder.id },
      data: {
        status: 'paid',
        transactionId: transaction_id,
        paymentVerifiedAt: new Date().toISOString(),
        paymentMethod: payment_method || 'wipay',
      },
    });

    // 2. Crear registro de verificación (IDEMPOTENT)
    await tx.paymentVerification.create({
      data: {
        salesOrderId: salesOrder.id,
        orderNumber: salesOrder.orderNumber,
        verificationMethod: 'wipay_webhook',
        status: 'verified',
        transactionId: transaction_id,
        gatewayResponse: JSON.stringify(body),
        amountDeclared: amount ? Number(amount) : null,
        amountVerified: amount ? Number(amount) : null,
        currency: currency || 'TTD',
      },
    });

    // 3. Actualizar tenant
    const tenant = await tx.tenant.findFirst({
      where: { ownerEmail: salesOrder.ownerEmail },
    });

    if (tenant) {
      await tx.tenant.update({
        where: { id: tenant.id },
        data: {
          status: 'active',
          activatedAt: tenant.activatedAt || new Date().toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      });
    }

    // 4. Log de auditoría
    await tx.salesAuditLog.create({
      data: {
        action: 'payment_received',
        orderNumber: salesOrder.orderNumber,
        salesOrderId: salesOrder.id,
        performedByEmail: customer_email || 'unknown',
        details: `Payment of TT$${amount || 'N/A'} received via ${payment_method || 'WiPay'}`,
        severity: 'info',
      },
    });
  });
}

interface FailedPaymentData {
  salesOrder: { id: string; orderNumber: string };
  transaction_id: string;
  status: string;
  body: Record<string, unknown>;
}

async function handleFailedPayment(data: FailedPaymentData) {
  const { salesOrder, transaction_id, status, body } = data;
  
  await prisma.$transaction(async (tx) => {
    // 1. Actualizar orden
    await tx.salesOrder.update({
      where: { id: salesOrder.id },
      data: {
        status: 'failed',
        transactionId: transaction_id,
      },
    });

    // 2. Crear registro de verificación (IDEMPOTENT)
    await tx.paymentVerification.create({
      data: {
        salesOrderId: salesOrder.id,
        orderNumber: salesOrder.orderNumber,
        verificationMethod: 'wipay_webhook',
        status: 'rejected',
        transactionId: transaction_id,
        gatewayResponse: JSON.stringify(body),
        rejectionReason: status,
      },
    });

    // 3. Log de auditoría
    await tx.salesAuditLog.create({
      data: {
        action: 'payment_failed',
        orderNumber: salesOrder.orderNumber,
        salesOrderId: salesOrder.id,
        performedByEmail: 'system',
        details: `Payment ${status}: ${transaction_id}`,
        severity: 'warning',
      },
    });
  });
}

// ============================================================================
// GET HANDLER - Callback redirect
// ============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');
  const status = searchParams.get('status');
  const transactionId = searchParams.get('transaction_id');

  const appUrl = process.env.NEXTAUTH_URL || process.env.APP_URL || 'https://nexus-os-alpha.vercel.app';

  if (status === 'success' || status === 'approved') {
    return Response.redirect(`${appUrl}/checkout/success?order_id=${orderId}&transaction_id=${transactionId}`);
  } else {
    return Response.redirect(`${appUrl}/checkout/cancel?order_id=${orderId}`);
  }
}
