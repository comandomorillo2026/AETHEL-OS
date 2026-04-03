import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createWiPayPayment, calculateWiPayFees } from '@/lib/payments/wipay';
import { createArtimPayment, calculateArtimFees } from '@/lib/payments/artim';
import { z } from 'zod';

// ============================================
// CHECKOUT API - Crea orden y genera pago
// ============================================

const checkoutSchema = z.object({
  // Business Info
  businessName: z.string().min(2),
  legalName: z.string().optional(),
  businessAddress: z.string().optional(),
  ownerName: z.string().min(2),
  ownerEmail: z.string().email(),
  ownerPhone: z.string().min(7),
  country: z.string().default('Trinidad & Tobago'),
  languagePreference: z.enum(['Español', 'English']).default('Español'),

  // Plan Selection
  industrySlug: z.enum(['clinic', 'nurse', 'lawfirm', 'beauty', 'bakery', 'pharmacy', 'insurance']),
  planTier: z.enum(['starter', 'growth', 'premium']),
  billingCycle: z.enum(['monthly', 'annual']),

  // Payment
  paymentMethod: z.enum(['wipay', 'artim', 'bank_transfer']),
  couponCode: z.string().optional(),
});

// Plan prices in TTD
const PLAN_PRICES = {
  starter: { monthly: 800, annual: 640 },   // 20% off annual
  growth: { monthly: 1500, annual: 1200 },   // 20% off annual
  premium: { monthly: 2800, annual: 2240 },  // 20% off annual
};

const ACTIVATION_FEE = 1250;

// Coupon discounts
const COUPONS: Record<string, number> = {
  'EARLYBIRD': 250,
  'LAUNCH50': 500,
  'NEXUS2024': 300,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = checkoutSchema.parse(body);

    // Calculate pricing
    const planPrice = PLAN_PRICES[validated.planTier][validated.billingCycle];
    const subtotal = planPrice + ACTIVATION_FEE;
    const discount = validated.couponCode && COUPONS[validated.couponCode.toUpperCase()]
      ? COUPONS[validated.couponCode.toUpperCase()]
      : 0;
    const total = subtotal - discount;

    // Generate order number
    const year = new Date().getFullYear();
    const existingOrders = await prisma.salesOrder.count();
    const orderNumber = `NXS-${year}-${String(existingOrders + 1).padStart(4, '0')}`;
    const invoiceNumber = `NXS-INV-${year}-${String(existingOrders + 1).padStart(4, '0')}`;

    // Get industry display name
    const industryNames: Record<string, string> = {
      clinic: 'Clínica Médica',
      nurse: 'Cuidados de Enfermería',
      lawfirm: 'Bufete de Abogados',
      beauty: 'Salón de Belleza',
      bakery: 'Panadería & Pastelería',
      pharmacy: 'Farmacia',
      insurance: 'Compañía de Seguros',
    };

    const planNames: Record<string, string> = {
      starter: 'Inicial',
      growth: 'Crecimiento',
      premium: 'Premium',
    };

    // Create Sales Order
    const salesOrder = await prisma.salesOrder.create({
      data: {
        orderNumber,
        status: 'pending_payment',
        businessName: validated.businessName,
        legalName: validated.legalName || null,
        businessAddress: validated.businessAddress || null,
        ownerName: validated.ownerName,
        ownerEmail: validated.ownerEmail,
        ownerPhone: validated.ownerPhone,
        country: validated.country,
        languagePreference: validated.languagePreference,
        industrySlug: validated.industrySlug,
        industryName: industryNames[validated.industrySlug],
        planSlug: validated.planTier,
        planName: planNames[validated.planTier],
        planTier: validated.planTier,
        billingCycle: validated.billingCycle,
        planPriceTtd: planPrice,
        activationFeeTtd: ACTIVATION_FEE,
        totalChargedTtd: total,
        paymentMethod: validated.paymentMethod,
        couponCode: validated.couponCode || null,
        discountAmountTtd: discount,
        invoiceNumber,
      },
    });

    // Create Payment Verification record
    await prisma.paymentVerification.create({
      data: {
        salesOrderId: salesOrder.id,
        orderNumber: salesOrder.orderNumber,
        verificationMethod: validated.paymentMethod === 'wipay' ? 'wipay_api' : 
                            validated.paymentMethod === 'artim' ? 'artim_api' : 'receipt_upload',
        status: 'pending',
        amountDeclared: total,
        currency: 'TTD',
      },
    });

    // Create Provisioning Job (queued until payment verified)
    await prisma.provisioningJob.create({
      data: {
        salesOrderId: salesOrder.id,
        orderNumber: salesOrder.orderNumber,
        status: 'queued',
      },
    });

    // Create Audit Log
    await prisma.salesAuditLog.create({
      data: {
        action: 'checkout_initiated',
        orderNumber: salesOrder.orderNumber,
        salesOrderId: salesOrder.id,
        performedByEmail: validated.ownerEmail,
        details: `Checkout initiated via ${validated.paymentMethod} for ${validated.industrySlug}`,
        severity: 'info',
      },
    });

    // Handle payment based on method
    if (validated.paymentMethod === 'wipay') {
      // Create WiPay payment
      const { fee, total: totalWithFee } = calculateWiPayFees(total);

      const paymentResult = await createWiPayPayment({
        amount: totalWithFee,
        description: `NexusOS ${planNames[validated.planTier]} - ${validated.industrySlug}`,
        customerName: validated.ownerName,
        customerEmail: validated.ownerEmail,
        customerPhone: validated.ownerPhone,
        orderId: orderNumber,
      });

      if (paymentResult.status === 'error') {
        // Update order to failed
        await prisma.salesOrder.update({
          where: { id: salesOrder.id },
          data: { status: 'payment_failed' },
        });

        return NextResponse.json(
          { error: paymentResult.error || 'Error al crear el pago' },
          { status: 400 }
        );
      }

      // Update order with payment session
      await prisma.salesOrder.update({
        where: { id: salesOrder.id },
        data: { paymentGatewaySessionId: paymentResult.transaction_id },
      });

      return NextResponse.json({
        success: true,
        orderNumber,
        invoiceNumber,
        paymentMethod: 'wipay',
        paymentUrl: paymentResult.url,
        transactionId: paymentResult.transaction_id,
        amount: totalWithFee,
        fees: fee,
      });

    } else if (validated.paymentMethod === 'artim') {
      const { fee, total: totalWithFee } = calculateArtimFees(total);

      const paymentResult = await createArtimPayment({
        amount: totalWithFee,
        description: `NexusOS ${planNames[validated.planTier]} - ${validated.industrySlug}`,
        customerName: validated.ownerName,
        customerEmail: validated.ownerEmail,
        customerPhone: validated.ownerPhone,
        orderId: orderNumber,
      });

      if (!paymentResult.success) {
        await prisma.salesOrder.update({
          where: { id: salesOrder.id },
          data: { status: 'payment_failed' },
        });

        return NextResponse.json(
          { error: paymentResult.error || 'Error al crear el pago con Artim' },
          { status: 400 }
        );
      }

      await prisma.salesOrder.update({
        where: { id: salesOrder.id },
        data: { paymentGatewaySessionId: paymentResult.sessionId },
      });

      return NextResponse.json({
        success: true,
        orderNumber,
        invoiceNumber,
        paymentMethod: 'artim',
        paymentUrl: paymentResult.paymentUrl,
        sessionId: paymentResult.sessionId,
        amount: totalWithFee,
        fees: fee,
      });

    } else {
      // Bank transfer - return bank details
      return NextResponse.json({
        success: true,
        orderNumber,
        invoiceNumber,
        paymentMethod: 'bank_transfer',
        amount: total,
        bankDetails: {
          bank: 'First Citizens Bank',
          accountName: 'NexusOS Caribbean Ltd',
          accountNumber: '****-****-****-1234', // Masked for security
          routingNumber: '****',
          reference: orderNumber,
        },
        instructions: 'Transfer the exact amount and upload your receipt. We will verify and activate your account within 24 hours.',
      });
    }

  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al procesar el checkout' },
      { status: 500 }
    );
  }
}
