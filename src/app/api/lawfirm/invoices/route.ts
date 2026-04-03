import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List invoices
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'demo-tenant';
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');
    const caseId = searchParams.get('caseId');

    const where: any = {
      tenantId,
      isDeleted: false,
    };

    if (status) {
      where.status = status;
    }
    if (clientId) {
      where.clientId = clientId;
    }
    if (caseId) {
      where.caseId = caseId;
    }

    const invoices = await db.lawInvoice.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate totals
    const totalOutstanding = invoices
      .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
      .reduce((sum, inv) => sum + (inv.balanceDue || 0), 0);
    const totalPaid = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + (inv.total || 0), 0);
    const overdue = invoices.filter(inv => {
      if (inv.status === 'paid' || inv.status === 'cancelled') return false;
      const dueDate = new Date(inv.dueDate);
      return dueDate < new Date();
    });

    return NextResponse.json({
      success: true,
      data: invoices,
      count: invoices.length,
      summary: {
        totalOutstanding,
        totalPaid,
        overdueCount: overdue.length,
        overdueAmount: overdue.reduce((sum, inv) => sum + (inv.balanceDue || 0), 0),
      },
    });
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST - Create invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId = 'demo-tenant',
      invoiceNumber,
      clientId,
      caseId,
      issueDate,
      dueDate,
      items = [],
      subtotal,
      discount = 0,
      tax = 0,
      total,
      notes,
    } = body;

    // Generate invoice number if not provided
    const generatedInvoiceNumber = invoiceNumber || `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

    const invoice = await db.lawInvoice.create({
      data: {
        tenantId,
        invoiceNumber: generatedInvoiceNumber,
        clientId,
        caseId,
        issueDate: issueDate || new Date().toISOString().split('T')[0],
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: JSON.stringify(items),
        subtotal,
        discount,
        tax,
        total,
        amountPaid: 0,
        balanceDue: total,
        status: 'draft',
        notes,
      },
    });

    return NextResponse.json({
      success: true,
      data: invoice,
      message: 'Invoice created successfully',
    });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
