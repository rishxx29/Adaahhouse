import { Order } from '../types';
import {
  generateOwnerOrderEmail,
  generateCustomerOrderEmail,
  generateCustomerWhatsAppMessage,
  generateOwnerWhatsAppMessage,
} from './emailTemplates';
import { BRAND_CONFIG } from '../config/brand';

export interface NotificationResult {
  success: boolean;
  simulated?: boolean;
  ownerEmailSent?: boolean;
  customerEmailSent?: boolean;
  message: string;
}

/**
 * Sends order emails to both owner (aadahhouse@gmail.com) and customer.
 * Uses the backend /api/send-order-email endpoint.
 */
export async function sendOrderEmails(order: Order): Promise<NotificationResult> {
  const ownerEmailData = generateOwnerOrderEmail(order);
  const customerEmailData = generateCustomerOrderEmail(order);

  try {
    const response = await fetch('/api/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order,
        ownerEmail: {
          to: BRAND_CONFIG.contact.email,
          subject: ownerEmailData.subject,
          html: ownerEmailData.html,
          text: ownerEmailData.text,
        },
        customerEmail: {
          to: order.shippingAddress.email,
          subject: customerEmailData.subject,
          html: customerEmailData.html,
          text: customerEmailData.text,
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        simulated: data.simulated ?? false,
        ownerEmailSent: true,
        customerEmailSent: true,
        message: data.message || 'Emails dispatched to owner and customer successfully.',
      };
    } else {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        simulated: true,
        message: errData.message || 'Server returned an error when dispatching emails.',
      };
    }
  } catch (err: any) {
    console.warn('API call to /api/send-order-email could not reach server:', err);
    return {
      success: true,
      simulated: true,
      message: 'Email templates prepared. Fallback client-side mailto available.',
    };
  }
}

/**
 * Fallback mailto URL for Owner notification
 */
export function getOwnerMailtoUrl(order: Order): string {
  const emailData = generateOwnerOrderEmail(order);
  return `mailto:${BRAND_CONFIG.contact.email}?subject=${encodeURIComponent(
    emailData.subject
  )}&body=${encodeURIComponent(emailData.text)}`;
}

/**
 * 1-Click Web Gmail Compose URL for Owner notification
 */
export function getOwnerGmailWebUrl(order: Order): string {
  const emailData = generateOwnerOrderEmail(order);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    BRAND_CONFIG.contact.email
  )}&su=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.text)}`;
}

/**
 * Fallback mailto URL for Customer confirmation
 */
export function getCustomerMailtoUrl(order: Order): string {
  const emailData = generateCustomerOrderEmail(order);
  return `mailto:${order.shippingAddress.email}?subject=${encodeURIComponent(
    emailData.subject
  )}&body=${encodeURIComponent(emailData.text)}`;
}

/**
 * 1-Click Web Gmail Compose URL for Customer confirmation
 */
export function getCustomerGmailWebUrl(order: Order): string {
  const emailData = generateCustomerOrderEmail(order);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    order.shippingAddress.email
  )}&su=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.text)}`;
}

/**
 * Save Gmail App Password to backend /api/save-smtp-config
 */
export async function saveSmtpPassword(appPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/save-smtp-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ smtpPass: appPassword }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to save App Password' };
  }
}

/**
 * Direct WhatsApp link for Customer with order summary
 */
export function getCustomerWhatsAppUrl(order: Order): string {
  const cleanPhone = order.shippingAddress.phone.replace(/\D/g, '');
  const msg = generateCustomerWhatsAppMessage(order);
  return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`;
}

/**
 * Direct WhatsApp link for Owner with order alert
 */
export function getOwnerWhatsAppUrl(order: Order): string {
  const msg = generateOwnerWhatsAppMessage(order);
  return `https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(msg)}`;
}
