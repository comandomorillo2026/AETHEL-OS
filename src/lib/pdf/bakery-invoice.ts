/**
 * Bakery Invoice PDF Generation Library
 * Generates HTML invoices that can be printed to PDF via browser
 * Supports English and Spanish labels based on bakery settings
 */

import { db } from '@/lib/db';

// Types for invoice generation
export interface InvoiceLineItem {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InvoiceCustomer {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  taxId?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  customer: InvoiceCustomer;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  currencySymbol: string;
  status: string;
  notes?: string;
  paymentMethod?: string;
  paidAt?: string;
}

export interface BakerySettingsData {
  bakeryName: string;
  legalName?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  currency?: string;
  currencySymbol?: string;
  taxEnabled?: boolean;
  taxRate?: number;
  taxName?: string;
  taxNumber?: string;
}

// Translations for bilingual support
const translations = {
  en: {
    invoice: 'INVOICE',
    invoiceNumber: 'Invoice No.',
    date: 'Date',
    dueDate: 'Due Date',
    billTo: 'Bill To',
    taxId: 'Tax ID',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    item: 'Item',
    description: 'Description',
    quantity: 'Qty',
    unitPrice: 'Unit Price',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    amountDue: 'Amount Due',
    paymentStatus: 'Payment Status',
    paid: 'PAID',
    pending: 'PENDING',
    partial: 'PARTIAL',
    cancelled: 'CANCELLED',
    draft: 'DRAFT',
    thankYou: 'Thank you for your business!',
    contactInfo: 'Contact Information',
    notes: 'Notes',
    paymentMethod: 'Payment Method',
    paidOn: 'Paid On',
  },
  es: {
    invoice: 'FACTURA',
    invoiceNumber: 'No. Factura',
    date: 'Fecha',
    dueDate: 'Fecha de Vencimiento',
    billTo: 'Facturar a',
    taxId: 'RIF/NIT',
    phone: 'Teléfono',
    email: 'Correo',
    address: 'Dirección',
    item: 'Artículo',
    description: 'Descripción',
    quantity: 'Cant.',
    unitPrice: 'Precio Unit.',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Impuesto',
    amountDue: 'Monto a Pagar',
    paymentStatus: 'Estado de Pago',
    paid: 'PAGADA',
    pending: 'PENDIENTE',
    partial: 'PARCIAL',
    cancelled: 'CANCELADA',
    draft: 'BORRADOR',
    thankYou: '¡Gracias por su preferencia!',
    contactInfo: 'Información de Contacto',
    notes: 'Notas',
    paymentMethod: 'Método de Pago',
    paidOn: 'Pagado el',
  },
};

type Language = 'en' | 'es';

/**
 * Generate HTML invoice for printing/PDF conversion
 */
export function generateInvoiceHTML(
  invoice: InvoiceData,
  settings: BakerySettingsData,
  language: Language = 'es'
): string {
  const t = translations[language];
  const primaryColor = settings.primaryColor || '#F97316';
  const secondaryColor = settings.secondaryColor || '#FBBF24';

  const formatCurrency = (amount: number) => {
    return `${invoice.currencySymbol}${amount.toLocaleString('en-TT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      paid: t.paid,
      pending: t.pending,
      partial: t.partial,
      cancelled: t.cancelled,
      draft: t.draft,
    };
    return statusMap[status.toLowerCase()] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      paid: '#16a34a',
      pending: '#ca8a04',
      partial: '#2563eb',
      cancelled: '#dc2626',
      draft: '#6b7280',
    };
    return colorMap[status.toLowerCase()] || '#6b7280';
  };

  const paymentMethodLabels: Record<string, string> = {
    cash: language === 'es' ? 'Efectivo' : 'Cash',
    card: language === 'es' ? 'Tarjeta' : 'Card',
    transfer: language === 'es' ? 'Transferencia' : 'Transfer',
    check: language === 'es' ? 'Cheque' : 'Check',
  };

  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.invoice} ${invoice.invoiceNumber}</title>
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
    
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid ${primaryColor};
    }
    
    .company-info {
      flex: 1;
    }
    
    .company-logo {
      max-width: 150px;
      max-height: 80px;
      margin-bottom: 10px;
    }
    
    .company-name {
      font-size: 24px;
      font-weight: 700;
      color: ${primaryColor};
      margin-bottom: 5px;
    }
    
    .company-legal {
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 10px;
    }
    
    .company-details {
      font-size: 11px;
      color: #4b5563;
      line-height: 1.6;
    }
    
    .invoice-info {
      text-align: right;
    }
    
    .invoice-title {
      font-size: 32px;
      font-weight: 700;
      color: ${primaryColor};
      letter-spacing: 2px;
    }
    
    .invoice-number {
      font-size: 14px;
      color: #6b7280;
      margin-top: 5px;
    }
    
    .invoice-date {
      font-size: 12px;
      color: #4b5563;
      margin-top: 10px;
    }
    
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1px;
      margin-top: 15px;
      background: ${getStatusColor(invoice.status)}20;
      color: ${getStatusColor(invoice.status)};
      border: 1px solid ${getStatusColor(invoice.status)}40;
    }
    
    .content {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    
    .bill-to {
      flex: 1;
    }
    
    .section-title {
      font-size: 11px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    
    .customer-name {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8px;
    }
    
    .customer-details {
      font-size: 12px;
      color: #4b5563;
      line-height: 1.6;
    }
    
    .customer-detail {
      margin-bottom: 4px;
    }
    
    .customer-detail-label {
      color: #6b7280;
      font-size: 11px;
    }
    
    .table-container {
      margin-bottom: 30px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    thead {
      background: ${primaryColor}15;
    }
    
    th {
      padding: 12px 15px;
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
      padding: 12px 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    td.text-right {
      text-align: right;
    }
    
    .item-name {
      font-weight: 500;
      color: #1f2937;
    }
    
    .item-description {
      font-size: 11px;
      color: #6b7280;
      margin-top: 2px;
    }
    
    .totals {
      margin-left: auto;
      width: 300px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .total-row:last-child {
      border-bottom: none;
    }
    
    .total-label {
      color: #4b5563;
    }
    
    .total-value {
      font-weight: 500;
      color: #1f2937;
    }
    
    .total-row.grand-total {
      background: ${primaryColor}10;
      padding: 15px;
      margin-top: 10px;
      border-radius: 8px;
      border-bottom: none;
    }
    
    .total-row.grand-total .total-label {
      font-weight: 600;
      font-size: 14px;
      color: #1f2937;
    }
    
    .total-row.grand-total .total-value {
      font-weight: 700;
      font-size: 18px;
      color: ${primaryColor};
    }
    
    .payment-info {
      margin-top: 30px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
      border-left: 4px solid ${primaryColor};
    }
    
    .payment-info-title {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 10px;
    }
    
    .payment-detail {
      font-size: 12px;
      color: #4b5563;
      margin-bottom: 5px;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .thank-you {
      font-size: 14px;
      color: ${primaryColor};
      font-weight: 500;
    }
    
    .contact-section {
      text-align: right;
    }
    
    .contact-title {
      font-size: 11px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    
    .contact-item {
      font-size: 11px;
      color: #4b5563;
      margin-bottom: 4px;
    }
    
    .notes-section {
      margin-top: 20px;
      padding: 15px;
      background: #fffbeb;
      border-radius: 8px;
      border: 1px solid #fcd34d;
    }
    
    .notes-title {
      font-size: 11px;
      font-weight: 600;
      color: #92400e;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    
    .notes-content {
      font-size: 12px;
      color: #78350f;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .invoice-container {
        max-width: 100%;
      }
      
      @page {
        margin: 1cm;
        size: A4;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="company-info">
        ${settings.logoUrl ? `<img src="${settings.logoUrl}" alt="${settings.bakeryName}" class="company-logo" />` : ''}
        <div class="company-name">${settings.bakeryName}</div>
        ${settings.legalName ? `<div class="company-legal">${settings.legalName}</div>` : ''}
        <div class="company-details">
          ${settings.address ? `<div>${settings.address}${settings.city ? `, ${settings.city}` : ''}</div>` : ''}
          ${settings.taxId ? `<div>${t.taxId}: ${settings.taxId}</div>` : ''}
        </div>
      </div>
      <div class="invoice-info">
        <div class="invoice-title">${t.invoice}</div>
        <div class="invoice-number">${t.invoiceNumber}: ${invoice.invoiceNumber}</div>
        <div class="invoice-date">${t.date}: ${formatDate(invoice.invoiceDate)}</div>
        ${invoice.dueDate ? `<div class="invoice-date">${t.dueDate}: ${formatDate(invoice.dueDate)}</div>` : ''}
        <div class="status-badge">${getStatusLabel(invoice.status)}</div>
      </div>
    </div>
    
    <!-- Bill To -->
    <div class="content">
      <div class="bill-to">
        <div class="section-title">${t.billTo}</div>
        <div class="customer-name">${invoice.customer.name}</div>
        <div class="customer-details">
          ${invoice.customer.taxId ? `<div class="customer-detail"><span class="customer-detail-label">${t.taxId}:</span> ${invoice.customer.taxId}</div>` : ''}
          ${invoice.customer.address ? `<div class="customer-detail">${invoice.customer.address}</div>` : ''}
          ${invoice.customer.phone ? `<div class="customer-detail"><span class="customer-detail-label">${t.phone}:</span> ${invoice.customer.phone}</div>` : ''}
          ${invoice.customer.email ? `<div class="customer-detail"><span class="customer-detail-label">${t.email}:</span> ${invoice.customer.email}</div>` : ''}
        </div>
      </div>
    </div>
    
    <!-- Line Items Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 40%">${t.item}</th>
            <th style="width: 20%" class="text-right">${t.quantity}</th>
            <th style="width: 20%" class="text-right">${t.unitPrice}</th>
            <th style="width: 20%" class="text-right">${t.total}</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.lineItems.map(item => `
            <tr>
              <td>
                <div class="item-name">${item.name}</div>
                ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
              </td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">${formatCurrency(item.unitPrice)}</td>
              <td class="text-right">${formatCurrency(item.totalPrice)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <!-- Totals -->
    <div class="totals">
      <div class="total-row">
        <span class="total-label">${t.subtotal}</span>
        <span class="total-value">${formatCurrency(invoice.subtotal)}</span>
      </div>
      ${invoice.taxAmount > 0 ? `
      <div class="total-row">
        <span class="total-label">${t.tax} (${(invoice.taxRate * 100).toFixed(1)}%)</span>
        <span class="total-value">${formatCurrency(invoice.taxAmount)}</span>
      </div>
      ` : ''}
      <div class="total-row grand-total">
        <span class="total-label">${t.amountDue}</span>
        <span class="total-value">${formatCurrency(invoice.total)}</span>
      </div>
    </div>
    
    ${invoice.status === 'paid' ? `
    <!-- Payment Info -->
    <div class="payment-info">
      <div class="payment-info-title">${t.paymentStatus}: ${t.paid}</div>
      ${invoice.paymentMethod ? `<div class="payment-detail">${t.paymentMethod}: ${paymentMethodLabels[invoice.paymentMethod] || invoice.paymentMethod}</div>` : ''}
      ${invoice.paidAt ? `<div class="payment-detail">${t.paidOn}: ${formatDate(invoice.paidAt)}</div>` : ''}
    </div>
    ` : ''}
    
    ${invoice.notes ? `
    <!-- Notes -->
    <div class="notes-section">
      <div class="notes-title">${t.notes}</div>
      <div class="notes-content">${invoice.notes}</div>
    </div>
    ` : ''}
    
    <!-- Footer -->
    <div class="footer">
      <div class="thank-you">${t.thankYou}</div>
      <div class="contact-section">
        <div class="contact-title">${t.contactInfo}</div>
        ${settings.phone ? `<div class="contact-item">${settings.phone}</div>` : ''}
        ${settings.email ? `<div class="contact-item">${settings.email}</div>` : ''}
        ${settings.website ? `<div class="contact-item">${settings.website}</div>` : ''}
        ${settings.whatsapp ? `<div class="contact-item">WhatsApp: ${settings.whatsapp}</div>` : ''}
      </div>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Get bakery settings for invoice generation
 */
export async function getBakerySettings(tenantId: string): Promise<BakerySettingsData | null> {
  const settings = await db.bakerySettings.findUnique({
    where: { tenantId },
  });

  if (!settings) return null;

  return {
    bakeryName: settings.bakeryName,
    legalName: settings.legalName || undefined,
    taxId: settings.taxId || undefined,
    email: settings.email || undefined,
    phone: settings.phone || undefined,
    website: settings.website || undefined,
    whatsapp: settings.whatsapp || undefined,
    address: settings.address || undefined,
    city: settings.city || undefined,
    country: settings.country || undefined,
    logoUrl: settings.logoUrl || undefined,
    primaryColor: settings.primaryColor || undefined,
    secondaryColor: settings.secondaryColor || undefined,
    currency: settings.currency || 'TTD',
    currencySymbol: settings.currencySymbol || 'TT$',
    taxEnabled: settings.taxEnabled,
    taxRate: settings.taxRate,
    taxName: settings.taxName || undefined,
    taxNumber: settings.taxNumber || undefined,
  };
}

/**
 * Get invoice data from database
 */
export async function getInvoiceData(invoiceId: string, tenantId: string): Promise<InvoiceData | null> {
  const invoice = await db.bakeryInvoice.findFirst({
    where: {
      id: invoiceId,
      tenantId,
    },
  });

  if (!invoice) return null;

  // Get order items if orderId exists
  let lineItems: InvoiceLineItem[] = [];
  if (invoice.orderId) {
    const orderItems = await db.bakeryOrderItem.findMany({
      where: { orderId: invoice.orderId },
    });

    lineItems = orderItems.map(item => ({
      name: item.productName,
      description: item.variantName || undefined,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));
  }

  // Get settings for currency
  const settings = await getBakerySettings(tenantId);

  return {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.createdAt.toISOString(),
    customer: {
      name: invoice.customerName,
      address: invoice.customerAddress || undefined,
      taxId: invoice.customerTaxId || undefined,
    },
    lineItems,
    subtotal: invoice.subtotal,
    taxRate: invoice.taxRate,
    taxAmount: invoice.taxAmount,
    total: invoice.total,
    currency: invoice.currency || settings?.currency || 'TTD',
    currencySymbol: settings?.currencySymbol || 'TT$',
    status: invoice.status,
    paidAt: invoice.paidAt || undefined,
  };
}

/**
 * Generate next invoice number for a tenant
 */
export async function generateInvoiceNumber(tenantId: string): Promise<string> {
  const lastInvoice = await db.bakeryInvoice.findFirst({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  });

  let nextNumber = 1;
  if (lastInvoice) {
    // Extract number from last invoice number (format: FAC-000001)
    const match = lastInvoice.invoiceNumber.match(/(\d+)$/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `FAC-${nextNumber.toString().padStart(6, '0')}`;
}

/**
 * Create a new invoice from an order
 */
export async function createInvoiceFromOrder(
  orderId: string,
  tenantId: string,
  options?: {
    customerTaxId?: string;
    notes?: string;
  }
): Promise<{ id: string; invoiceNumber: string } | null> {
  // Get order
  const order = await db.bakeryOrder.findFirst({
    where: { id: orderId, tenantId },
    include: {
      BakeryOrderItem: true,
    },
  });

  if (!order) return null;

  // Get settings for tax rate
  const settings = await getBakerySettings(tenantId);
  const taxRate = settings?.taxEnabled ? (settings.taxRate || 0) / 100 : 0;

  // Calculate totals
  const subtotal = order.subtotal;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  // Generate invoice number
  const invoiceNumber = await generateInvoiceNumber(tenantId);

  // Create invoice
  const invoice = await db.bakeryInvoice.create({
    data: {
      tenantId,
      invoiceNumber,
      orderId,
      customerTaxId: options?.customerTaxId,
      customerName: order.customerName,
      customerAddress: order.deliveryAddress,
      subtotal,
      taxRate,
      taxAmount,
      total,
      currency: order.currency,
      status: order.paymentStatus === 'PAID' ? 'PAID' : 'PENDING',
    },
  });

  return { id: invoice.id, invoiceNumber: invoice.invoiceNumber };
}

/**
 * Get all invoices for a tenant
 */
export async function getInvoices(
  tenantId: string,
  options?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }
) {
  const where: Record<string, unknown> = { tenantId };

  if (options?.status && options.status !== 'all') {
    where.status = options.status.toUpperCase();
  }

  if (options?.search) {
    where.OR = [
      { invoiceNumber: { contains: options.search, mode: 'insensitive' } },
      { customerName: { contains: options.search, mode: 'insensitive' } },
    ];
  }

  const [invoices, total] = await Promise.all([
    db.bakeryInvoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    }),
    db.bakeryInvoice.count({ where }),
  ]);

  return {
    invoices: invoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      customerName: inv.customerName,
      customerTaxId: inv.customerTaxId,
      subtotal: inv.subtotal,
      taxAmount: inv.taxAmount,
      total: inv.total,
      currency: inv.currency,
      status: inv.status,
      createdAt: inv.createdAt.toISOString(),
      paidAt: inv.paidAt,
    })),
    total,
  };
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(
  invoiceId: string,
  tenantId: string,
  status: string,
  paymentMethod?: string
): Promise<boolean> {
  const updateData: Record<string, unknown> = { status: status.toUpperCase() };

  if (status.toUpperCase() === 'PAID') {
    updateData.paidAt = new Date().toISOString();
  }

  const result = await db.bakeryInvoice.updateMany({
    where: { id: invoiceId, tenantId },
    data: updateData,
  });

  return result.count > 0;
}

/**
 * Delete an invoice (only draft status)
 */
export async function deleteInvoice(invoiceId: string, tenantId: string): Promise<boolean> {
  const result = await db.bakeryInvoice.deleteMany({
    where: {
      id: invoiceId,
      tenantId,
      status: 'DRAFT',
    },
  });

  return result.count > 0;
}
