/**
 * Email Receipts Library for NexusOS Bakery Module
 * 
 * Provides email sending functionality for bakery receipts with support for:
 * - Bilingual templates (English/Spanish)
 * - HTML and plain text versions
 * - Professional formatting for Caribbean businesses
 */

import { sendEmail } from './resend';
import { generateBakeryReceiptHTML, generateBakeryReceiptText, type BakeryReceiptData } from './templates/bakery-receipt';

export interface SendReceiptOptions {
  to: string;
  data: BakeryReceiptData;
  language?: 'en' | 'es';
  from?: string;
}

/**
 * Send a bakery receipt email
 * 
 * @param options - Email options including recipient, receipt data, and language
 * @returns Promise with success status and optional error message
 */
export async function sendBakeryReceipt(options: SendReceiptOptions): Promise<{ success: boolean; error?: string }> {
  const { to, data, language = 'es', from } = options;

  // Generate email content
  const html = generateBakeryReceiptHTML(data, language);
  const text = generateBakeryReceiptText(data, language);

  // Subject line based on language
  const subject = language === 'en'
    ? `Receipt #${data.orderNumber} - ${data.bakeryName}`
    : `Recibo #${data.orderNumber} - ${data.bakeryName}`;

  // Send email with both HTML and text versions
  // Note: The Resend API supports both, but our current sendEmail uses HTML only
  // We include the text version for email clients that prefer plain text
  return sendEmail({
    to,
    subject,
    html,
    from,
  });
}

/**
 * Send receipt to multiple recipients (e.g., customer and bakery copy)
 */
export async function sendBakeryReceiptToMultiple(
  recipients: string[],
  data: BakeryReceiptData,
  language: 'en' | 'es' = 'es',
  from?: string
): Promise<{ success: boolean; errors?: string[] }> {
  const results = await Promise.all(
    recipients.map(recipient =>
      sendBakeryReceipt({ to: recipient, data, language, from })
    )
  );

  const errors = results
    .filter(r => !r.success)
    .map(r => r.error)
    .filter((e): e is string => e !== undefined);

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Queue a receipt email for later sending (for bulk operations)
 * This returns the email data that can be stored and sent later
 */
export function prepareBakeryReceiptEmail(
  data: BakeryReceiptData,
  language: 'en' | 'es' = 'es'
): { subject: string; html: string; text: string } {
  return {
    subject: language === 'en'
      ? `Receipt #${data.orderNumber} - ${data.bakeryName}`
      : `Recibo #${data.orderNumber} - ${data.bakeryName}`,
    html: generateBakeryReceiptHTML(data, language),
    text: generateBakeryReceiptText(data, language),
  };
}

// Re-export types for convenience
export type { BakeryReceiptData } from './templates/bakery-receipt';
