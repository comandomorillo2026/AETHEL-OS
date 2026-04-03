import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createWiPayPayment, calculateWiPayFees } from '@/lib/payments/wipay';
import { z } from 'zod';

const paymentSchema = z.object({
  type: z.enum(['subscription', 'activation', 'addon']),
  planSlug: z.string().optional(),
  billingCycle: z.enum(['monthly', 'biannual', 'annual']).optional(),
  amount: z.number().optional(),
  userId: z.string().optional(), // Temporal: se usará hasta implementar sesión server-side
});

export async function POST(request: NextRequest) {
  try {
    // TODO: Implement proper server-side auth
    // Temporalmente usamos userId del body hasta implementar sesión server-side
    const body = await request.json();
    const validated = paymentSchema.parse(body);
    
    // Por ahora, usamos un usuario demo para desarrollo
    const userId = validated.userId || 'demo-user';
    const user = await prisma.systemUser.findFirst({
      include: { tenant: true },
    });

    if (!user?.tenant) {
      return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
    }

    const tenant = user.tenant;
    let amount = 0;
    let description = '';
    let orderId = '';

    if (validated.type === 'subscription') {
      const plan = await prisma.plan.findUnique({
        where: { slug: validated.planSlug || tenant.planSlug },
      });

      if (!plan) {
        return NextResponse.json({ error: 'Plan not found' }, { status: 400 });
      }

      switch (validated.billingCycle) {
        case 'annual':
          amount = plan.priceAnnualTtd * 12;
          break;
        case 'biannual':
          amount = plan.priceBiannualTtd * 6;
          break;
        default:
          amount = plan.priceMonthlyTtd;
      }

      description = `NexusOS ${plan.nameEn} - ${validated.billingCycle || 'monthly'} subscription`;
      orderId = `SUB-${tenant.slug.toUpperCase()}-${Date.now()}`;
    } else if (validated.type === 'activation') {
      amount = validated.amount || 1250;
      description = 'NexusOS Activation Fee';
      orderId = `ACT-${tenant.slug.toUpperCase()}-${Date.now()}`;
    } else {
      amount = validated.amount || 0;
      description = 'NexusOS Add-on Purchase';
      orderId = `ADD-${tenant.slug.toUpperCase()}-${Date.now()}`;
    }

    const { fee, total } = calculateWiPayFees(amount);

    const salesOrder = await prisma.salesOrder.create({
      data: {
        orderNumber: orderId,
        status: 'pending_payment',
        businessName: tenant.businessName,
        legalName: tenant.legalName,
        ownerName: user.name,
        ownerEmail: user.email,
        ownerPhone: tenant.ownerPhone,
        industrySlug: tenant.industrySlug,
        industryName: tenant.industrySlug,
        country: 'Trinidad & Tobago',
        planSlug: validated.planSlug || tenant.planSlug,
        planName: tenant.planSlug,
        planTier: validated.planSlug || tenant.planSlug,
        billingCycle: validated.billingCycle || 'monthly',
        planPriceTtd: amount,
        activationFeeTtd: validated.type === 'activation' ? amount : 0,
        totalChargedTtd: total,
        paymentMethod: 'wipay',
      },
    });

    const paymentResult = await createWiPayPayment({
      amount: total,
      description,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: tenant.ownerPhone,
      orderId: salesOrder.orderNumber,
    });

    if (paymentResult.status === 'error') {
      return NextResponse.json(
        { error: paymentResult.error || 'Payment creation failed' },
        { status: 400 }
      );
    }

    await prisma.salesOrder.update({
      where: { id: salesOrder.id },
      data: { paymentGatewaySessionId: paymentResult.transaction_id },
    });

    return NextResponse.json({
      success: true,
      orderId: salesOrder.orderNumber,
      paymentUrl: paymentResult.url,
      amount,
      fees: fee,
      total,
    });
  } catch (error) {
    console.error('[PAYMENT_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
