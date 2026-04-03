import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      businessName,
      legalName,
      businessAddress,
      ownerName,
      ownerEmail,
      ownerPhone,
      country,
      languagePreference,
      industrySlug,
      industryName,
      planTier,
      planName,
      billingCycle,
      planPriceTtd,
      totalChargedTtd,
      paymentMethod,
      couponCode,
      discountAmountTtd,
    } = body;

    // Generate order number
    const year = new Date().getFullYear();
    const existingOrders = await db.salesOrder.count();
    const orderNumber = `NXS-${year}-${String(existingOrders + 1).padStart(4, '0')}`;

    // Generate invoice number
    const invoiceNumber = `NXS-INV-${year}-${String(existingOrders + 1).padStart(4, '0')}`;

    // Create Sales Order
    const salesOrder = await db.salesOrder.create({
      data: {
        orderNumber,
        status: paymentMethod === 'bank_transfer' ? 'pending_verification' : 'paid',
        businessName,
        legalName: legalName || null,
        businessAddress: businessAddress || null,
        ownerName,
        ownerEmail,
        ownerPhone,
        country,
        languagePreference,
        industrySlug,
        industryName,
        planSlug: planTier,
        planName,
        planTier,
        billingCycle,
        planPriceTtd: parseFloat(planPriceTtd) || 0,
        activationFeeTtd: 1250,
        totalChargedTtd: parseFloat(totalChargedTtd) || 0,
        paymentMethod,
        couponCode: couponCode || null,
        discountAmountTtd: parseFloat(discountAmountTtd) || 0,
        invoiceNumber,
      },
    });

    // Create Payment Verification record
    await db.paymentVerification.create({
      data: {
        salesOrderId: salesOrder.id,
        orderNumber: salesOrder.orderNumber,
        verificationMethod: paymentMethod === 'wipay' ? 'wipay_api' : paymentMethod === 'stripe' ? 'stripe_webhook' : 'receipt_upload',
        status: paymentMethod === 'bank_transfer' ? 'pending' : 'verified',
        amountDeclared: parseFloat(totalChargedTtd) || 0,
        currency: 'TTD',
      },
    });

    // Create Provisioning Job
    await db.provisioningJob.create({
      data: {
        salesOrderId: salesOrder.id,
        orderNumber: salesOrder.orderNumber,
        status: paymentMethod === 'bank_transfer' ? 'queued' : 'in_progress',
      },
    });

    // Create Audit Log
    await db.salesAuditLog.create({
      data: {
        action: 'order_created',
        orderNumber: salesOrder.orderNumber,
        salesOrderId: salesOrder.id,
        performedByEmail: ownerEmail,
        details: `Order created via ${paymentMethod}`,
        severity: 'info',
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: salesOrder.orderNumber,
      invoiceNumber: salesOrder.invoiceNumber,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await db.salesOrder.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
