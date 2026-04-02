/**
 * API Endpoint: Send Bakery Receipt Email
 * 
 * POST /api/bakery/email/receipt
 * 
 * Sends a receipt email to customers after a completed purchase.
 * Supports both English and Spanish languages.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendBakeryReceipt, type BakeryReceiptData } from '@/lib/email/receipts';
import { getServerSession } from 'next-auth';

interface SendReceiptRequest {
  orderId: string;
  recipientEmail?: string; // Optional: override customer email
  language?: 'en' | 'es';
  sendCopyToBakery?: boolean; // Also send to bakery email
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: SendReceiptRequest = await request.json();
    const { orderId, recipientEmail, language = 'es', sendCopyToBakery = false } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order with items
    const order = await db.bakeryOrder.findUnique({
      where: { id: orderId },
      include: {
        // Note: Prisma relations might need adjustment based on actual schema relations
      }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Fetch order items
    const orderItems = await db.bakeryOrderItem.findMany({
      where: { orderId: orderId }
    });

    // Fetch bakery settings
    const settings = await db.bakerySettings.findFirst({
      where: { tenantId: order.tenantId }
    });

    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'Bakery settings not found' },
        { status: 404 }
      );
    }

    // Determine recipient email
    const toEmail = recipientEmail || order.customerEmail;
    if (!toEmail) {
      return NextResponse.json(
        { success: false, error: 'No recipient email address available' },
        { status: 400 }
      );
    }

    // Build receipt data
    const receiptData: BakeryReceiptData = {
      orderNumber: order.orderNumber,
      orderDate: order.createdAt.toISOString(),
      orderType: order.orderType,
      
      customerName: order.customerName,
      customerEmail: order.customerEmail || undefined,
      customerPhone: order.customerPhone || undefined,
      
      items: orderItems.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        variant: item.variantName || undefined,
        notes: item.notes || undefined,
      })),
      
      subtotal: order.subtotal,
      discount: order.discount || undefined,
      deliveryFee: order.deliveryFee || undefined,
      tax: order.tax || undefined,
      total: order.total,
      currency: order.currency,
      currencySymbol: settings.currencySymbol || 'TT$',
      
      paymentMethod: order.paymentMethod || 'CASH',
      paymentStatus: order.paymentStatus,
      paymentReference: order.paymentReference || undefined,
      
      deliveryType: order.deliveryType,
      deliveryAddress: order.deliveryAddress || undefined,
      deliveryDate: order.deliveryDate || undefined,
      deliveryTime: order.deliveryTime || undefined,
      
      bakeryName: settings.bakeryName,
      bakeryPhone: settings.phone || undefined,
      bakeryEmail: settings.email || undefined,
      bakeryAddress: settings.address || undefined,
      bakeryWebsite: settings.website || undefined,
      bakeryWhatsapp: settings.whatsapp || undefined,
      
      orderViewUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://nexusos.tt'}/bakery/orders/${order.id}`,
      
      isCustomOrder: order.isCustomOrder,
      customDetails: order.customDetails || undefined,
      notes: order.notes || undefined,
    };

    // Send receipt email
    const result = await sendBakeryReceipt({
      to: toEmail,
      data: receiptData,
      language,
      from: settings.email ? `${settings.bakeryName} <${settings.email}>` : undefined,
    });

    if (!result.success) {
      console.error('[BAKERY RECEIPT ERROR]', result.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send receipt email', details: result.error },
        { status: 500 }
      );
    }

    // Optionally send a copy to the bakery
    if (sendCopyToBakery && settings.email && settings.email !== toEmail) {
      await sendBakeryReceipt({
        to: settings.email,
        data: receiptData,
        language: 'es', // Bakery copy always in Spanish
        from: undefined,
      });
    }

    // Log email sent activity
    await db.activityLog.create({
      data: {
        tenantId: order.tenantId,
        action: 'RECEIPT_EMAIL_SENT',
        entityType: 'BakeryOrder',
        entityId: order.id,
        description: `Receipt email sent to ${toEmail} for order #${order.orderNumber}`,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Receipt email sent successfully',
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        recipientEmail: toEmail,
        sentAt: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('[BAKERY RECEIPT API ERROR]', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if a receipt can be sent for an order
 * Useful for UI to show/hide "Send Receipt" button
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order
    const order = await db.bakeryOrder.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        customerEmail: true,
        customerName: true,
        paymentStatus: true,
        tenantId: true,
      }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const canSendReceipt = !!order.customerEmail;
    const customerEmail = order.customerEmail;

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: canSendReceipt ? customerEmail : null,
        canSendReceipt,
        paymentStatus: order.paymentStatus,
      }
    });

  } catch (error) {
    console.error('[BAKERY RECEIPT CHECK ERROR]', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check receipt status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
