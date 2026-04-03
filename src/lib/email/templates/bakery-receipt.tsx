/**
 * Bakery Receipt Email Template
 * 
 * Professional email template for bakery receipts with:
 * - Bilingual support (English/Spanish)
 * - Responsive HTML design
 * - Plain text fallback
 * - Caribbean business branding
 */

// Types
export interface BakeryReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variant?: string;
  notes?: string;
}

export interface BakeryReceiptData {
  // Order information
  orderNumber: string;
  orderDate: string;
  orderType?: string;

  // Customer information
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;

  // Items
  items: BakeryReceiptItem[];

  // Totals
  subtotal: number;
  discount?: number;
  deliveryFee?: number;
  tax?: number;
  total: number;
  currency: string;
  currencySymbol: string;

  // Payment
  paymentMethod: string;
  paymentStatus: string;
  paymentReference?: string;

  // Delivery
  deliveryType: string;
  deliveryAddress?: string;
  deliveryDate?: string;
  deliveryTime?: string;

  // Bakery information
  bakeryName: string;
  bakeryPhone?: string;
  bakeryEmail?: string;
  bakeryAddress?: string;
  bakeryWebsite?: string;
  bakeryWhatsapp?: string;

  // Links
  orderViewUrl?: string;

  // Custom order details
  isCustomOrder?: boolean;
  customDetails?: string;

  // Additional
  notes?: string;
}

// Translations
const translations = {
  en: {
    receipt: 'Receipt',
    orderNumber: 'Order Number',
    orderDate: 'Order Date',
    orderType: 'Order Type',
    soldTo: 'Sold To',
    items: 'Items',
    item: 'Item',
    quantity: 'Qty',
    unitPrice: 'Unit Price',
    totalPrice: 'Total',
    subtotal: 'Subtotal',
    discount: 'Discount',
    deliveryFee: 'Delivery Fee',
    tax: 'Tax',
    total: 'Total',
    paymentMethod: 'Payment Method',
    paymentStatus: 'Payment Status',
    paymentReference: 'Reference',
    deliveryType: 'Delivery',
    deliveryAddress: 'Delivery Address',
    deliveryDate: 'Delivery Date',
    deliveryTime: 'Delivery Time',
    pickup: 'Pickup',
    delivery: 'Delivery',
    dineIn: 'Dine In',
    pos: 'Point of Sale',
    customOrder: 'Custom Order',
    customDetails: 'Custom Details',
    notes: 'Notes',
    viewOrderOnline: 'View Order Online',
    thankYou: 'Thank you for your purchase!',
    contactUs: 'Contact Us',
    paid: 'Paid',
    pending: 'Pending',
    partial: 'Partial',
    cash: 'Cash',
    card: 'Card',
    transfer: 'Bank Transfer',
    wiPay: 'WiPay',
    phone: 'Phone',
    email: 'Email',
    website: 'Website',
    whatsapp: 'WhatsApp',
    poweredBy: 'Powered by NexusOS',
    orderTypes: {
      POS: 'Point of Sale',
      ONLINE: 'Online Order',
      PHONE: 'Phone Order',
      CUSTOM: 'Custom Order',
    },
  },
  es: {
    receipt: 'Recibo',
    orderNumber: 'Número de Orden',
    orderDate: 'Fecha de Orden',
    orderType: 'Tipo de Orden',
    soldTo: 'Cliente',
    items: 'Artículos',
    item: 'Artículo',
    quantity: 'Cant.',
    unitPrice: 'Precio Unit.',
    totalPrice: 'Total',
    subtotal: 'Subtotal',
    discount: 'Descuento',
    deliveryFee: 'Costo de Entrega',
    tax: 'Impuesto',
    total: 'Total',
    paymentMethod: 'Método de Pago',
    paymentStatus: 'Estado del Pago',
    paymentReference: 'Referencia',
    deliveryType: 'Entrega',
    deliveryAddress: 'Dirección de Entrega',
    deliveryDate: 'Fecha de Entrega',
    deliveryTime: 'Hora de Entrega',
    pickup: 'Recogida',
    delivery: 'Entrega a Domicilio',
    dineIn: 'Consumo en Local',
    pos: 'Punto de Venta',
    customOrder: 'Pedido Personalizado',
    customDetails: 'Detalles Personalizados',
    notes: 'Notas',
    viewOrderOnline: 'Ver Orden en Línea',
    thankYou: '¡Gracias por su compra!',
    contactUs: 'Contáctenos',
    paid: 'Pagado',
    pending: 'Pendiente',
    partial: 'Parcial',
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
    wiPay: 'WiPay',
    phone: 'Teléfono',
    email: 'Correo',
    website: 'Sitio Web',
    whatsapp: 'WhatsApp',
    poweredBy: 'Desarrollado por NexusOS',
    orderTypes: {
      POS: 'Punto de Venta',
      ONLINE: 'Orden en Línea',
      PHONE: 'Orden Telefónica',
      CUSTOM: 'Pedido Especial',
    },
  },
};

function getTranslation(lang: 'en' | 'es', key: string): string {
  const t = translations[lang];
  return t[key as keyof typeof t] || key;
}

function formatCurrency(amount: number, symbol: string): string {
  return `${symbol}${amount.toFixed(2)}`;
}

function formatDate(dateString: string, lang: 'en' | 'es'): string {
  try {
    const date = new Date(dateString);
    const locale = lang === 'en' ? 'en-US' : 'es-ES';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

function getPaymentMethodLabel(method: string, lang: 'en' | 'es'): string {
  const t = translations[lang];
  const methodMap: Record<string, string> = {
    CASH: t.cash,
    CARD: t.card,
    TRANSFER: t.transfer,
    WIPAY: t.wiPay,
    cash: t.cash,
    card: t.card,
    transfer: t.transfer,
    wipay: t.wiPay,
  };
  return methodMap[method] || method;
}

function getPaymentStatusLabel(status: string, lang: 'en' | 'es'): string {
  const t = translations[lang];
  const statusMap: Record<string, string> = {
    PAID: t.paid,
    PENDING: t.pending,
    PARTIAL: t.partial,
    paid: t.paid,
    pending: t.pending,
    partial: t.partial,
  };
  return statusMap[status] || status;
}

function getDeliveryTypeLabel(type: string, lang: 'en' | 'es'): string {
  const t = translations[lang];
  const typeMap: Record<string, string> = {
    PICKUP: t.pickup,
    DELIVERY: t.delivery,
    DINE_IN: t.dineIn,
    pickup: t.pickup,
    delivery: t.delivery,
    dine_in: t.dineIn,
  };
  return typeMap[type] || type;
}

function getOrderTypeLabel(type: string, lang: 'en' | 'es'): string {
  const t = translations[lang];
  const orderTypes = t.orderTypes as Record<string, string>;
  return orderTypes[type] || type;
}

/**
 * Generate HTML email for bakery receipt
 */
export function generateBakeryReceiptHTML(data: BakeryReceiptData, lang: 'en' | 'es' = 'es'): string {
  const t = translations[lang];
  const primaryColor = '#F97316'; // Orange for bakery
  const secondaryColor = '#FBBF24';
  const accentColor = '#78350F';

  const itemsHTML = data.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
        <div style="font-weight: 500; color: #1F2937;">${item.name}</div>
        ${item.variant ? `<div style="font-size: 12px; color: #6B7280;">${item.variant}</div>` : ''}
        ${item.notes ? `<div style="font-size: 12px; color: #9CA3AF; font-style: italic;">${item.notes}</div>` : ''}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #E5E7EB; text-align: center; color: #6B7280;">${item.quantity}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #E5E7EB; text-align: right; color: #6B7280;">${formatCurrency(item.unitPrice, data.currencySymbol)}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; text-align: right; font-weight: 500; color: #1F2937;">${formatCurrency(item.totalPrice, data.currencySymbol)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.receipt} #${data.orderNumber}</title>
  <style>
    /* Reset styles */
    body { margin: 0; padding: 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    
    /* Container */
    .email-container { max-width: 600px; margin: 0 auto; background: #FFFFFF; }
    
    /* Header */
    .header { background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); padding: 32px 24px; text-align: center; }
    .bakery-name { font-size: 24px; font-weight: 700; color: #FFFFFF; margin: 0 0 4px; }
    .receipt-label { font-size: 14px; color: rgba(255, 255, 255, 0.9); margin: 0; }
    
    /* Order number banner */
    .order-banner { background: ${accentColor}; padding: 16px 24px; text-align: center; }
    .order-number { font-size: 18px; font-weight: 600; color: #FFFFFF; margin: 0; }
    
    /* Body */
    .body { padding: 24px; background: #FAFAFA; }
    
    /* Info sections */
    .info-section { background: #FFFFFF; border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid #E5E7EB; }
    .section-title { font-size: 12px; font-weight: 600; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px; }
    
    /* Customer info */
    .customer-name { font-size: 18px; font-weight: 600; color: #1F2937; margin: 0 0 8px; }
    .customer-detail { font-size: 14px; color: #6B7280; margin: 4px 0; }
    
    /* Items table */
    .items-table { width: 100%; border-collapse: collapse; }
    .items-table th { font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px; border-bottom: 2px solid #E5E7EB; }
    .items-table th:first-child { text-align: left; }
    .items-table th:nth-child(2) { text-align: center; }
    .items-table th:nth-child(3) { text-align: right; }
    .items-table th:last-child { text-align: right; }
    
    /* Totals */
    .totals-section { background: #FFFFFF; border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid #E5E7EB; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .total-row.subtotal { color: #6B7280; }
    .total-row.discount { color: #059669; }
    .total-row.fee { color: #6B7280; }
    .total-row.tax { color: #6B7280; }
    .total-row.grand-total { font-size: 18px; font-weight: 700; color: #1F2937; border-top: 2px solid #E5E7EB; margin-top: 8px; padding-top: 16px; }
    
    /* Payment status badge */
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status-paid { background: #D1FAE5; color: #059669; }
    .status-pending { background: #FEF3C7; color: #D97706; }
    .status-partial { background: #DBEAFE; color: #2563EB; }
    
    /* Custom order section */
    .custom-order-section { background: #FFF7ED; border: 1px solid ${primaryColor}; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
    
    /* Delivery section */
    .delivery-section { background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
    .delivery-icon { font-size: 24px; margin-right: 12px; }
    
    /* Button */
    .button { display: inline-block; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); color: #FFFFFF; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
    
    /* Footer */
    .footer { background: #1F2937; padding: 24px; text-align: center; }
    .footer-bakery { font-size: 16px; font-weight: 600; color: #FFFFFF; margin: 0 0 8px; }
    .footer-info { font-size: 13px; color: #9CA3AF; margin: 4px 0; }
    .footer-info a { color: ${secondaryColor}; text-decoration: none; }
    .footer-powered { font-size: 11px; color: #6B7280; margin-top: 16px; padding-top: 16px; border-top: 1px solid #374151; }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1 class="bakery-name">${data.bakeryName}</h1>
      <p class="receipt-label">${t.receipt}</p>
    </div>
    
    <!-- Order Number Banner -->
    <div class="order-banner">
      <p class="order-number">${t.orderNumber}: #${data.orderNumber}</p>
    </div>
    
    <!-- Body -->
    <div class="body">
      <!-- Order Info -->
      <div class="info-section">
        <p class="section-title">${t.orderDate}</p>
        <p style="font-size: 16px; color: #1F2937; margin: 0;">${formatDate(data.orderDate, lang)}</p>
        ${data.orderType ? `<p style="font-size: 14px; color: #6B7280; margin: 8px 0 0;">${t.orderType}: ${getOrderTypeLabel(data.orderType, lang)}</p>` : ''}
      </div>
      
      <!-- Customer Info -->
      <div class="info-section">
        <p class="section-title">${t.soldTo}</p>
        <p class="customer-name">${data.customerName}</p>
        ${data.customerPhone ? `<p class="customer-detail">${t.phone}: ${data.customerPhone}</p>` : ''}
        ${data.customerEmail ? `<p class="customer-detail">${t.email}: ${data.customerEmail}</p>` : ''}
      </div>
      
      <!-- Custom Order Details -->
      ${data.isCustomOrder && data.customDetails ? `
      <div class="custom-order-section">
        <p class="section-title" style="color: ${primaryColor};">🎨 ${t.customOrder}</p>
        <p style="font-size: 14px; color: #1F2937; margin: 0; white-space: pre-wrap;">${data.customDetails}</p>
      </div>
      ` : ''}
      
      <!-- Delivery Info -->
      <div class="delivery-section">
        <p class="section-title" style="color: #059669;">📦 ${t.deliveryType}: ${getDeliveryTypeLabel(data.deliveryType, lang)}</p>
        ${data.deliveryAddress ? `<p style="font-size: 14px; color: #1F2937; margin: 8px 0;">${data.deliveryAddress}</p>` : ''}
        ${data.deliveryDate ? `<p style="font-size: 14px; color: #6B7280; margin: 4px 0;">${t.deliveryDate}: ${formatDate(data.deliveryDate, lang)}</p>` : ''}
        ${data.deliveryTime ? `<p style="font-size: 14px; color: #6B7280; margin: 4px 0;">${t.deliveryTime}: ${data.deliveryTime}</p>` : ''}
      </div>
      
      <!-- Items -->
      <div class="info-section">
        <p class="section-title">${t.items}</p>
        <table class="items-table">
          <thead>
            <tr>
              <th>${t.item}</th>
              <th>${t.quantity}</th>
              <th>${t.unitPrice}</th>
              <th>${t.totalPrice}</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>
      
      <!-- Totals -->
      <div class="totals-section">
        <div class="total-row subtotal">
          <span>${t.subtotal}</span>
          <span>${formatCurrency(data.subtotal, data.currencySymbol)}</span>
        </div>
        ${data.discount && data.discount > 0 ? `
        <div class="total-row discount">
          <span>${t.discount}</span>
          <span>-${formatCurrency(data.discount, data.currencySymbol)}</span>
        </div>
        ` : ''}
        ${data.deliveryFee && data.deliveryFee > 0 ? `
        <div class="total-row fee">
          <span>${t.deliveryFee}</span>
          <span>${formatCurrency(data.deliveryFee, data.currencySymbol)}</span>
        </div>
        ` : ''}
        ${data.tax && data.tax > 0 ? `
        <div class="total-row tax">
          <span>${t.tax}</span>
          <span>${formatCurrency(data.tax, data.currencySymbol)}</span>
        </div>
        ` : ''}
        <div class="total-row grand-total">
          <span>${t.total}</span>
          <span>${formatCurrency(data.total, data.currencySymbol)}</span>
        </div>
      </div>
      
      <!-- Payment Info -->
      <div class="info-section">
        <p class="section-title">${t.paymentMethod}</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 16px; color: #1F2937;">${getPaymentMethodLabel(data.paymentMethod, lang)}</span>
          <span class="status-badge status-${data.paymentStatus.toLowerCase()}">${getPaymentStatusLabel(data.paymentStatus, lang)}</span>
        </div>
        ${data.paymentReference ? `<p style="font-size: 12px; color: #6B7280; margin: 8px 0 0;">${t.paymentReference}: ${data.paymentReference}</p>` : ''}
      </div>
      
      ${data.notes ? `
      <!-- Notes -->
      <div class="info-section" style="background: #FEF3C7; border-color: #FCD34D;">
        <p class="section-title" style="color: #92400E;">📝 ${t.notes}</p>
        <p style="font-size: 14px; color: #78350F; margin: 0;">${data.notes}</p>
      </div>
      ` : ''}
      
      <!-- View Order Button -->
      ${data.orderViewUrl ? `
      <div style="text-align: center; margin: 24px 0;">
        <a href="${data.orderViewUrl}" class="button">${t.viewOrderOnline}</a>
      </div>
      ` : ''}
      
      <!-- Thank You -->
      <div style="text-align: center; padding: 16px 0;">
        <p style="font-size: 16px; color: ${primaryColor}; font-weight: 600; margin: 0;">${t.thankYou}</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p class="footer-bakery">${data.bakeryName}</p>
      ${data.bakeryAddress ? `<p class="footer-info">${data.bakeryAddress}</p>` : ''}
      ${data.bakeryPhone ? `<p class="footer-info">${t.phone}: ${data.bakeryPhone}</p>` : ''}
      ${data.bakeryEmail ? `<p class="footer-info">${t.email}: <a href="mailto:${data.bakeryEmail}">${data.bakeryEmail}</a></p>` : ''}
      ${data.bakeryWhatsapp ? `<p class="footer-info">${t.whatsapp}: ${data.bakeryWhatsapp}</p>` : ''}
      ${data.bakeryWebsite ? `<p class="footer-info"><a href="${data.bakeryWebsite}">${data.bakeryWebsite}</a></p>` : ''}
      <p class="footer-powered">${t.poweredBy}</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate plain text email for bakery receipt
 * Used as fallback for email clients that don't support HTML
 */
export function generateBakeryReceiptText(data: BakeryReceiptData, lang: 'en' | 'es' = 'es'): string {
  const t = translations[lang];
  
  const divider = '═'.repeat(50);
  const subDivider = '─'.repeat(50);
  
  const itemsText = data.items.map(item => {
    let text = `  ${item.name}`;
    if (item.variant) text += ` (${item.variant})`;
    text += `\n    ${item.quantity} x ${formatCurrency(item.unitPrice, data.currencySymbol)} = ${formatCurrency(item.totalPrice, data.currencySymbol)}`;
    if (item.notes) text += `\n    Note: ${item.notes}`;
    return text;
  }).join('\n');

  return `
${divider}
                    ${data.bakeryName.toUpperCase()}
                         ${t.receipt.toUpperCase()}
${divider}

${t.orderNumber}: #${data.orderNumber}
${t.orderDate}: ${formatDate(data.orderDate, lang)}
${data.orderType ? `${t.orderType}: ${getOrderTypeLabel(data.orderType, lang)}` : ''}

${subDivider}
${t.soldTo.toUpperCase()}
${subDivider}
${data.customerName}
${data.customerPhone ? `${t.phone}: ${data.customerPhone}` : ''}
${data.customerEmail ? `${t.email}: ${data.customerEmail}` : ''}

${data.isCustomOrder && data.customDetails ? `
${subDivider}
🎨 ${t.customOrder.toUpperCase()}
${subDivider}
${data.customDetails}
` : ''}

${subDivider}
📦 ${t.deliveryType.toUpperCase()}: ${getDeliveryTypeLabel(data.deliveryType, lang)}
${subDivider}
${data.deliveryAddress ? data.deliveryAddress : ''}
${data.deliveryDate ? `${t.deliveryDate}: ${formatDate(data.deliveryDate, lang)}` : ''}
${data.deliveryTime ? `${t.deliveryTime}: ${data.deliveryTime}` : ''}

${subDivider}
${t.items.toUpperCase()}
${subDivider}
${itemsText}

${subDivider}
${t.subtotal}: ${formatCurrency(data.subtotal, data.currencySymbol)}
${data.discount && data.discount > 0 ? `${t.discount}: -${formatCurrency(data.discount, data.currencySymbol)}` : ''}
${data.deliveryFee && data.deliveryFee > 0 ? `${t.deliveryFee}: ${formatCurrency(data.deliveryFee, data.currencySymbol)}` : ''}
${data.tax && data.tax > 0 ? `${t.tax}: ${formatCurrency(data.tax, data.currencySymbol)}` : ''}
${subDivider}
${t.total.toUpperCase()}: ${formatCurrency(data.total, data.currencySymbol)}
${subDivider}

${t.paymentMethod}: ${getPaymentMethodLabel(data.paymentMethod, lang)}
${t.paymentStatus}: ${getPaymentStatusLabel(data.paymentStatus, lang)}
${data.paymentReference ? `${t.paymentReference}: ${data.paymentReference}` : ''}

${data.notes ? `
${subDivider}
📝 ${t.notes.toUpperCase()}
${subDivider}
${data.notes}
` : ''}

${divider}
          ${t.thankYou}
${divider}

${data.bakeryName}
${data.bakeryAddress || ''}
${data.bakeryPhone ? `${t.phone}: ${data.bakeryPhone}` : ''}
${data.bakeryEmail ? `${t.email}: ${data.bakeryEmail}` : ''}
${data.bakeryWhatsapp ? `${t.whatsapp}: ${data.bakeryWhatsapp}` : ''}
${data.bakeryWebsite ? `${t.website}: ${data.bakeryWebsite}` : ''}

${data.orderViewUrl ? `${t.viewOrderOnline}: ${data.orderViewUrl}` : ''}

${t.poweredBy}
`.trim();
}

const bakeryReceiptTemplate = {
  generateHTML: generateBakeryReceiptHTML,
  generateText: generateBakeryReceiptText,
};

export default bakeryReceiptTemplate;
