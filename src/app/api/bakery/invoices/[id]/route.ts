/**
 * Bakery Invoice by ID API
 * Handles getting, updating, and downloading specific invoices
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {
  getInvoiceData,
  getBakerySettings,
  generateInvoiceHTML,
  updateInvoiceStatus,
  deleteInvoice,
} from '@/lib/pdf/bakery-invoice';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/bakery/invoices/[id] - Get or download specific invoice
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = (session.user as { tenantId?: string })?.tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const download = searchParams.get('download');
    const lang = (searchParams.get('lang') || 'es') as 'en' | 'es';

    // Get invoice data
    const invoiceData = await getInvoiceData(id, tenantId);
    const settings = await getBakerySettings(tenantId);

    if (!invoiceData) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Download as PDF (HTML for printing)
    if (download === 'pdf' || download === 'html') {
      const html = generateInvoiceHTML(invoiceData, settings || { bakeryName: 'Panadería' }, lang);

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `inline; filename="invoice-${invoiceData.invoiceNumber}.html"`,
        },
      });
    }

    // Return JSON data
    return NextResponse.json({
      invoice: invoiceData,
      settings: settings ? {
        bakeryName: settings.bakeryName,
        logoUrl: settings.logoUrl,
        primaryColor: settings.primaryColor,
      } : null,
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

// PATCH /api/bakery/invoices/[id] - Update invoice status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = (session.user as { tenantId?: string })?.tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, paymentMethod, customerTaxId, customerAddress, notes } = body;

    // Update invoice in database
    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status.toUpperCase();
      if (status.toUpperCase() === 'PAID') {
        updateData.paidAt = new Date().toISOString();
      }
    }

    if (customerTaxId !== undefined) {
      updateData.customerTaxId = customerTaxId;
    }

    if (customerAddress !== undefined) {
      updateData.customerAddress = customerAddress;
    }

    // Update invoice
    const invoice = await db.bakeryInvoice.updateMany({
      where: { id, tenantId },
      data: updateData,
    });

    if (invoice.count === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // If marking as paid, also update related order if exists
    if (status?.toUpperCase() === 'PAID') {
      const invoiceRecord = await db.bakeryInvoice.findFirst({
        where: { id, tenantId },
      });

      if (invoiceRecord?.orderId) {
        await db.bakeryOrder.update({
          where: { id: invoiceRecord.orderId },
          data: {
            paymentStatus: 'PAID',
            paymentMethod: paymentMethod || 'cash',
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully',
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

// DELETE /api/bakery/invoices/[id] - Delete a draft invoice
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = (session.user as { tenantId?: string })?.tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
    }

    const { id } = await params;

    const deleted = await deleteInvoice(id, tenantId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Cannot delete invoice. Only draft invoices can be deleted.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}

// PUT /api/bakery/invoices/[id] - Record payment for invoice
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = (session.user as { tenantId?: string })?.tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
    }

    const { id } = await params;
    const body = await request.json();
    const { amount, paymentMethod, reference, notes } = body;

    // Get invoice
    const invoice = await db.bakeryInvoice.findFirst({
      where: { id, tenantId },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // For now, just mark as paid if amount matches total
    // In a full implementation, you'd track partial payments
    const paymentAmount = amount || invoice.total;

    if (paymentAmount >= invoice.total) {
      await db.bakeryInvoice.update({
        where: { id },
        data: {
          status: 'PAID',
          paidAt: new Date().toISOString(),
        },
      });

      // Update order if exists
      if (invoice.orderId) {
        await db.bakeryOrder.update({
          where: { id: invoice.orderId },
          data: {
            paymentStatus: 'PAID',
            paymentMethod: paymentMethod || 'cash',
            paymentReference: reference,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Payment recorded and invoice marked as paid',
        paidAmount: paymentAmount,
      });
    } else {
      // Partial payment
      await db.bakeryInvoice.update({
        where: { id },
        data: {
          status: 'PARTIAL',
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Partial payment recorded',
        paidAmount: paymentAmount,
        remaining: invoice.total - paymentAmount,
      });
    }
  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json(
      { error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}
