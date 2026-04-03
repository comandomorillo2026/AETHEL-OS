/**
 * Bakery Invoices API
 * Handles listing, creating, and downloading invoices
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import {
  getInvoices,
  createInvoiceFromOrder,
  generateInvoiceNumber,
  generateInvoiceHTML,
  getInvoiceData,
  getBakerySettings,
} from '@/lib/pdf/bakery-invoice';

// GET /api/bakery/invoices - List all invoices
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tenant ID from user's session or query params
    const tenantId = (session.user as { tenantId?: string })?.tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;
    const download = searchParams.get('download');
    const invoiceId = searchParams.get('id');

    // Download specific invoice as PDF (HTML for printing)
    if (download === 'pdf' && invoiceId) {
      const invoiceData = await getInvoiceData(invoiceId, tenantId);
      const settings = await getBakerySettings(tenantId);

      if (!invoiceData || !settings) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }

      const html = generateInvoiceHTML(invoiceData, settings, 'es');

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `inline; filename="invoice-${invoiceData.invoiceNumber}.html"`,
        },
      });
    }

    // Download all invoices as report
    if (download === 'report') {
      const { invoices } = await getInvoices(tenantId, { limit: 1000 });
      const settings = await getBakerySettings(tenantId);

      // Generate simple report HTML
      const reportHtml = generateReportHTML(invoices, settings);

      return new NextResponse(reportHtml, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `inline; filename="invoices-report.html"`,
        },
      });
    }

    // List invoices
    const result = await getInvoices(tenantId, {
      status,
      search,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST /api/bakery/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = (session.user as { tenantId?: string })?.tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
    }

    const body = await request.json();
    const { orderId, customerTaxId, notes } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Create invoice from order
    const invoice = await createInvoiceFromOrder(orderId, tenantId, {
      customerTaxId,
      notes,
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Failed to create invoice. Order not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

// Generate report HTML for multiple invoices
function generateReportHTML(
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    customerName: string;
    customerTaxId?: string;
    subtotal: number;
    taxAmount: number;
    total: number;
    currency: string;
    status: string;
    createdAt: string;
    paidAt?: string;
  }>,
  settings: { bakeryName: string; primaryColor?: string } | null
): string {
  const primaryColor = settings?.primaryColor || '#F97316';
  const currencySymbol = 'TT$';

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString('en-TT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statusLabels: Record<string, string> = {
    PAID: 'Pagada',
    PENDING: 'Pendiente',
    PARTIAL: 'Parcial',
    CANCELLED: 'Cancelada',
    DRAFT: 'Borrador',
  };

  const statusColors: Record<string, string> = {
    PAID: '#16a34a',
    PENDING: '#ca8a04',
    PARTIAL: '#2563eb',
    CANCELLED: '#dc2626',
    DRAFT: '#6b7280',
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices
    .filter(inv => inv.status === 'PENDING' || inv.status === 'PARTIAL')
    .reduce((sum, inv) => sum + inv.total, 0);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte de Facturas</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: #1f2937;
      background: #ffffff;
      padding: 40px;
    }
    
    .report-container {
      max-width: 900px;
      margin: 0 auto;
    }
    
    .header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid ${primaryColor};
    }
    
    .title {
      font-size: 24px;
      font-weight: 700;
      color: ${primaryColor};
    }
    
    .subtitle {
      color: #6b7280;
      margin-top: 5px;
    }
    
    .summary {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .summary-card {
      flex: 1;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
      border-left: 4px solid ${primaryColor};
    }
    
    .summary-label {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .summary-value {
      font-size: 20px;
      font-weight: 700;
      color: ${primaryColor};
      margin-top: 5px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    thead {
      background: ${primaryColor}15;
    }
    
    th {
      padding: 12px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: ${primaryColor};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid ${primaryColor}40;
    }
    
    th.text-right {
      text-align: right;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    td.text-right {
      text-align: right;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 11px;
    }
    
    @media print {
      body { padding: 20px; }
      @page { margin: 1cm; size: A4; }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="header">
      <div class="title">Reporte de Facturas</div>
      <div class="subtitle">${settings?.bakeryName || 'Panadería'} - Generado el ${new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}</div>
    </div>
    
    <div class="summary">
      <div class="summary-card">
        <div class="summary-label">Total Facturas</div>
        <div class="summary-value">${invoices.length}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Monto Total</div>
        <div class="summary-value">${formatCurrency(totalAmount)}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Cobrado</div>
        <div class="summary-value" style="color: #16a34a">${formatCurrency(paidAmount)}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Pendiente</div>
        <div class="summary-value" style="color: #ca8a04">${formatCurrency(pendingAmount)}</div>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Factura</th>
          <th>Cliente</th>
          <th>RIF/NIT</th>
          <th>Fecha</th>
          <th class="text-right">Total</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        ${invoices.map(inv => `
          <tr>
            <td style="font-weight: 500">${inv.invoiceNumber}</td>
            <td>${inv.customerName}</td>
            <td>${inv.customerTaxId || '-'}</td>
            <td>${formatDate(inv.createdAt)}</td>
            <td class="text-right" style="font-weight: 500">${formatCurrency(inv.total)}</td>
            <td>
              <span class="status-badge" style="background: ${statusColors[inv.status]}20; color: ${statusColors[inv.status]}">
                ${statusLabels[inv.status] || inv.status}
              </span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div class="footer">
      Generado por NexusOS - Sistema de Gestión para Panaderías
    </div>
  </div>
</body>
</html>
`;
}
