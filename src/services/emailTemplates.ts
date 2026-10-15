import { Order } from '../types';
import { BRAND_CONFIG } from '../config/brand';

/**
 * Generate formatted HTML and Plaintext email for the Owner (aadahhouse@gmail.com)
 */
export function generateOwnerOrderEmail(order: Order) {
  const itemsRowsHtml = order.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #E8DED2;">
      <td style="padding: 10px; font-size: 13px; color: #292522;">
        <strong>${item.product.name}</strong><br/>
        <span style="font-size: 11px; color: #9E897A;">SKU: ${item.product.sku} | Size: <strong>${item.selectedSize}</strong></span>
      </td>
      <td style="padding: 10px; text-align: center; font-size: 13px; color: #292522;">${item.quantity}</td>
      <td style="padding: 10px; text-align: right; font-size: 13px; color: #292522;">₹${item.product.price.toLocaleString('en-IN')}</td>
      <td style="padding: 10px; text-align: right; font-size: 13px; font-weight: bold; color: #5B1E22;">₹${(item.product.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>`
    )
    .join('');

  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (SKU: ${item.product.sku}) - Size: ${item.selectedSize} x Qty: ${item.quantity} = ₹${item.product.price * item.quantity}`
    )
    .join('\n');

  const customerPhoneClean = order.shippingAddress.phone.replace(/\D/g, '');
  const customerWhatsAppLink = `https://wa.me/91${customerPhoneClean}`;

  const subject = `🚨 New Order #${order.orderNumber} (₹${order.total.toLocaleString('en-IN')}) - ${order.shippingAddress.fullName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Order Alert - ADAAH HOUSE</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; color: #292522;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8DED2; border-top: 4px solid #5B1E22; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    
    <!-- Header Banner -->
    <div style="padding: 24px; background-color: #5B1E22; color: #FAF7F2; text-align: center;">
      <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; letter-spacing: 0.15em; text-transform: uppercase;">ADAAH HOUSE</h1>
      <p style="margin: 4px 0 0; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #C9A76A;">Boutique Owner Order Notification</p>
    </div>

    <div style="padding: 24px;">
      <!-- Order Banner -->
      <div style="background-color: #F7EFE3; border-left: 4px solid #C9A76A; padding: 14px; margin-bottom: 20px;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #5B1E22; font-weight: bold;">New Order Received</span>
        <div style="font-size: 20px; font-weight: bold; margin-top: 4px; color: #292522;">Order #${order.orderNumber}</div>
        <div style="font-size: 12px; color: #7A8061; margin-top: 2px;">Status: <strong>${order.status}</strong> · Estimated Delivery: <strong>${order.estimatedDeliveryDate}</strong></div>
      </div>

      <!-- Customer Details Card -->
      <h3 style="font-family: Georgia, serif; font-size: 16px; border-bottom: 1px solid #E8DED2; padding-bottom: 6px; margin: 20px 0 12px; color: #5B1E22;">Customer & Shipping Details</h3>
      <table style="width: 100%; font-size: 13px; line-height: 1.6;">
        <tr>
          <td style="width: 32%; color: #9E897A; font-weight: 500;">Customer Name:</td>
          <td style="font-weight: 600; color: #292522;">${order.shippingAddress.fullName}</td>
        </tr>
        <tr>
          <td style="color: #9E897A; font-weight: 500;">Mobile Phone:</td>
          <td>
            <a href="tel:${order.shippingAddress.phone}" style="color: #5B1E22; font-weight: 600; text-decoration: none;">${order.shippingAddress.phone}</a>
            &nbsp;(<a href="${customerWhatsAppLink}" style="color: #25D366; font-weight: bold; text-decoration: none;">Chat on WhatsApp</a>)
          </td>
        </tr>
        <tr>
          <td style="color: #9E897A; font-weight: 500;">Email Address:</td>
          <td><a href="mailto:${order.shippingAddress.email}" style="color: #5B1E22; text-decoration: none;">${order.shippingAddress.email}</a></td>
        </tr>
        <tr>
          <td style="vertical-align: top; color: #9E897A; font-weight: 500;">Delivery Address:</td>
          <td style="color: #292522;">
            ${order.shippingAddress.addressLine}${order.shippingAddress.locality ? `, ${order.shippingAddress.locality}` : ''}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} - <strong>${order.shippingAddress.pincode}</strong>
          </td>
        </tr>
      </table>

      <!-- Order Items Table -->
      <h3 style="font-family: Georgia, serif; font-size: 16px; border-bottom: 1px solid #E8DED2; padding-bottom: 6px; margin: 24px 0 12px; color: #5B1E22;">Ordered Garments (${order.items.length})</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <thead>
          <tr style="background-color: #F2ECE1; font-size: 11px; text-transform: uppercase; color: #5B1E22; letter-spacing: 0.05em;">
            <th style="padding: 8px 10px; text-align: left;">Garment</th>
            <th style="padding: 8px 10px; text-align: center;">Qty</th>
            <th style="padding: 8px 10px; text-align: right;">Rate</th>
            <th style="padding: 8px 10px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRowsHtml}
        </tbody>
      </table>

      <!-- Financial Summary -->
      <div style="background-color: #FAF7F2; border: 1px solid #E8DED2; padding: 14px; margin-bottom: 24px;">
        <table style="width: 100%; font-size: 13px;">
          <tr>
            <td style="color: #9E897A;">Subtotal:</td>
            <td style="text-align: right; color: #292522;">₹${order.subtotal.toLocaleString('en-IN')}</td>
          </tr>
          ${
            order.discount > 0
              ? `<tr>
            <td style="color: #7A8061;">Discount (${order.couponCode || 'Coupon'}):</td>
            <td style="text-align: right; color: #7A8061; font-weight: 600;">-₹${order.discount.toLocaleString('en-IN')}</td>
          </tr>`
              : ''
          }
          <tr>
            <td style="color: #9E897A;">Shipping Fee:</td>
            <td style="text-align: right; color: #292522;">${order.shippingFee === 0 ? '<strong style="color: #7A8061;">FREE</strong>' : `₹${order.shippingFee}`}</td>
          </tr>
          <tr style="border-top: 1px solid #E8DED2;">
            <td style="padding-top: 8px; font-size: 16px; font-weight: bold; color: #5B1E22;">Total Amount:</td>
            <td style="padding-top: 8px; text-align: right; font-size: 18px; font-weight: bold; color: #5B1E22;">₹${order.total.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td style="color: #9E897A; font-size: 12px;">Payment Mode:</td>
            <td style="text-align: right; font-size: 12px; font-weight: 600; color: ${order.paymentMethod === 'COD' ? '#C9A76A' : '#7A8061'};">
              ${order.paymentMethod === 'COD' ? 'Cash on Delivery (Pending)' : `Paid via Online UPI (${order.transactionRef || BRAND_CONFIG.payment.upiId})`}
            </td>
          </tr>
        </table>
      </div>

      <!-- Quick Action Buttons -->
      <div style="text-align: center; padding: 12px 0;">
        <a href="${customerWhatsAppLink}" style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-size: 13px; font-weight: bold; padding: 10px 20px; text-decoration: none; border-radius: 2px; margin-right: 8px;">
          Message Customer on WhatsApp
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #F2ECE1; padding: 16px 24px; font-size: 11px; color: #9E897A; text-align: center; border-top: 1px solid #E8DED2;">
      ADAAH HOUSE Boutique Order Notification • Official Store Email: ${BRAND_CONFIG.contact.email} • WhatsApp: +91 ${BRAND_CONFIG.contact.phone}
    </div>
  </div>
</body>
</html>
`;

  const text = `
=============================================
ADAAH HOUSE — NEW ORDER RECEIVED
=============================================
Order ID: #${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleString('en-IN')}
Status: ${order.status}
Estimated Delivery: ${order.estimatedDeliveryDate}

CUSTOMER DETAILS:
Name: ${order.shippingAddress.fullName}
Phone: ${order.shippingAddress.phone}
Email: ${order.shippingAddress.email}
Address:
${order.shippingAddress.addressLine}${order.shippingAddress.locality ? `, ${order.shippingAddress.locality}` : ''}
${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}

ORDERED GARMENTS:
${itemsText}

FINANCIALS:
Subtotal: ₹${order.subtotal}
${order.discount > 0 ? `Discount (${order.couponCode}): -₹${order.discount}\n` : ''}Shipping: ${order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
TOTAL AMOUNT: ₹${order.total}
Payment Mode: ${order.paymentMethod} (${order.paymentStatus})

Chat with Customer on WhatsApp: https://wa.me/91${customerPhoneClean}
=============================================
`;

  return { subject, html, text, recipient: BRAND_CONFIG.contact.email };
}

/**
 * Generate formatted HTML and Plaintext email for the Customer
 */
export function generateCustomerOrderEmail(order: Order) {
  const itemsRowsHtml = order.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #E8DED2;">
      <td style="padding: 12px 10px; font-size: 13px; color: #292522;">
        <strong style="color: #5B1E22;">${item.product.name}</strong><br/>
        <span style="font-size: 12px; color: #9E897A;">Size: <strong style="color: #5B1E22;">${item.selectedSize}</strong> | Fabric: ${item.product.fabric}</span>
      </td>
      <td style="padding: 12px 10px; text-align: center; font-size: 13px; color: #292522;">${item.quantity}</td>
      <td style="padding: 12px 10px; text-align: right; font-size: 13px; font-weight: 600; color: #292522;">₹${(item.product.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>`
    )
    .join('');

  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (Size: ${item.selectedSize}, Qty: ${item.quantity}) - ₹${item.product.price * item.quantity}`
    )
    .join('\n');

  const subject = `🌸 Order Confirmed! #${order.orderNumber} - ADAAH HOUSE`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your ADAAH HOUSE Order is Confirmed</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; color: #292522;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8DED2; border-top: 4px solid #5B1E22; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    
    <!-- Brand Header -->
    <div style="padding: 32px 24px 24px; background-color: #5B1E22; color: #FAF7F2; text-align: center;">
      <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; letter-spacing: 0.18em; text-transform: uppercase;">ADAAH HOUSE</h1>
      <p style="margin: 6px 0 0; font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: #C9A76A;">Grace in every thread</p>
    </div>

    <!-- Body -->
    <div style="padding: 30px 24px;">
      
      <p style="font-size: 16px; margin: 0 0 12px; color: #292522;">Namaste <strong>${order.shippingAddress.fullName}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #292522; margin: 0 0 20px;">
        Thank you for choosing <strong>ADAAH HOUSE</strong>. We have received your order and our team is already preparing your curated pieces with love and our signature brand packaging.
      </p>

      <!-- Order ID Banner -->
      <div style="background-color: #FAF7F2; border: 1px solid #E8DED2; padding: 16px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #C9A76A; font-weight: bold;">Order Confirmation</span>
        <div style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #5B1E22; margin: 4px 0;">
          #${order.orderNumber}
        </div>
        <p style="margin: 4px 0 0; font-size: 13px; color: #292522;">
          Estimated Delivery by <strong style="color: #7A8061;">${order.estimatedDeliveryDate}</strong>
        </p>
      </div>

      <!-- Garments Summary -->
      <h3 style="font-family: Georgia, serif; font-size: 16px; border-bottom: 1px solid #E8DED2; padding-bottom: 6px; margin: 0 0 12px; color: #5B1E22;">
        Your Selected Garments
      </h3>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #F2ECE1; font-size: 11px; text-transform: uppercase; color: #5B1E22; letter-spacing: 0.05em;">
            <th style="padding: 8px 10px; text-align: left;">Kurti Details</th>
            <th style="padding: 8px 10px; text-align: center;">Qty</th>
            <th style="padding: 8px 10px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRowsHtml}
        </tbody>
      </table>

      <!-- Total Breakdown -->
      <div style="background-color: #FAF7F2; border: 1px solid #E8DED2; padding: 14px; margin-bottom: 24px;">
        <table style="width: 100%; font-size: 13px;">
          <tr>
            <td style="color: #9E897A;">Garment Total:</td>
            <td style="text-align: right; color: #292522;">₹${order.subtotal.toLocaleString('en-IN')}</td>
          </tr>
          ${
            order.discount > 0
              ? `<tr>
            <td style="color: #7A8061;">Savings (${order.couponCode}):</td>
            <td style="text-align: right; color: #7A8061; font-weight: bold;">-₹${order.discount.toLocaleString('en-IN')}</td>
          </tr>`
              : ''
          }
          <tr>
            <td style="color: #9E897A;">Express Shipping:</td>
            <td style="text-align: right; color: #7A8061; font-weight: bold;">FREE</td>
          </tr>
          <tr style="border-top: 1px solid #E8DED2;">
            <td style="padding-top: 8px; font-size: 16px; font-weight: bold; color: #5B1E22;">Total Amount:</td>
            <td style="padding-top: 8px; text-align: right; font-size: 18px; font-weight: bold; color: #5B1E22;">₹${order.total.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td style="color: #9E897A; font-size: 12px;">Payment Method:</td>
            <td style="text-align: right; font-size: 12px; font-weight: 600; color: #292522;">
              ${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid via Online UPI'}
            </td>
          </tr>
        </table>
      </div>

      <!-- Shipping Address -->
      <div style="border-left: 3px solid #C9A76A; padding-left: 12px; margin-bottom: 24px; font-size: 13px; line-height: 1.5;">
        <strong style="color: #5B1E22; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; display: block; margin-bottom: 4px;">Delivering To:</strong>
        <span style="font-weight: 600;">${order.shippingAddress.fullName}</span><br/>
        ${order.shippingAddress.addressLine}${order.shippingAddress.locality ? `, ${order.shippingAddress.locality}` : ''}<br/>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} - <strong>${order.shippingAddress.pincode}</strong><br/>
        Phone: ${order.shippingAddress.phone}
      </div>

      <!-- Boutique Promise & Care -->
      <div style="background-color: #F2ECE1; padding: 14px; border: 1px dashed #C9A76A; font-size: 12px; line-height: 1.5; color: #292522; margin-bottom: 24px;">
        <strong style="color: #5B1E22;">✦ 7-Day Size Exchange Guarantee:</strong><br/>
        If you need a different fit or alteration, reply to this email or message our styling concierge on WhatsApp within 7 days of delivery.
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 20px 0;">
        <a href="${BRAND_CONFIG.social.whatsappUrl}?text=${encodeURIComponent(`Hi ADAAH HOUSE, I have a question regarding my order #${order.orderNumber}`)}" style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-size: 13px; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 2px;">
          Chat with Styling Concierge on WhatsApp
        </a>
      </div>

    </div>

    <!-- Sign-off & Footer -->
    <div style="background-color: #FAF7F2; padding: 20px 24px; font-size: 12px; color: #9E897A; text-align: center; border-top: 1px solid #E8DED2;">
      <p style="margin: 0 0 6px; font-style: italic; color: #5B1E22;">"A little Adaah in every outfit."</p>
      <p style="margin: 0; color: #292522;">With love & grace,<br/><strong>Team ADAAH HOUSE</strong></p>
      <p style="margin: 12px 0 0; font-size: 11px;">Queries? Call/WhatsApp: +91 ${BRAND_CONFIG.contact.phone} • Email: ${BRAND_CONFIG.contact.email}</p>
    </div>
  </div>
</body>
</html>
`;

  const text = `
=============================================
ADAAH HOUSE — ORDER CONFIRMATION
=============================================
Dear ${order.shippingAddress.fullName},

Thank you for choosing ADAAH HOUSE! We're delighted to confirm your order.

Order ID: #${order.orderNumber}
Estimated Delivery: ${order.estimatedDeliveryDate}
Payment: ${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid via Online UPI'}

YOUR GARMENTS:
${itemsText}

TOTAL BREAKDOWN:
Subtotal: ₹${order.subtotal}
${order.discount > 0 ? `Savings: -₹${order.discount}\n` : ''}Shipping: FREE
TOTAL: ₹${order.total}

DELIVERY ADDRESS:
${order.shippingAddress.fullName}
${order.shippingAddress.addressLine}${order.shippingAddress.locality ? `, ${order.shippingAddress.locality}` : ''}
${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
Phone: ${order.shippingAddress.phone}

7-DAY SIZE EXCHANGE:
We offer hassle-free size exchanges within 7 days of delivery.

Need styling or order help?
WhatsApp: +91 ${BRAND_CONFIG.contact.phone}
Email: ${BRAND_CONFIG.contact.email}

"A little Adaah in every outfit."
With love, Team ADAAH HOUSE
=============================================
`;

  return { subject, html, text, recipient: order.shippingAddress.email };
}

/**
 * Generate formatted WhatsApp message for Customer
 */
export function generateCustomerWhatsAppMessage(order: Order): string {
  const itemsText = order.items
    .map((item) => `• *${item.product.name}* (Size: ${item.selectedSize}, Qty: ${item.quantity})`)
    .join('\n');

  return `🌸 *ADAAH HOUSE — Order Confirmation*

Dear *${order.shippingAddress.fullName}*,

Thank you for shopping with ADAAH HOUSE! Your order *#${order.orderNumber}* has been confirmed.

📦 *Garments in your Order:*
${itemsText}

💰 *Total Amount:* ₹${order.total.toLocaleString('en-IN')}
💳 *Payment Mode:* ${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid via UPI'}
🚚 *Estimated Delivery:* ${order.estimatedDeliveryDate}

📍 *Shipping Address:*
${order.shippingAddress.addressLine}, ${order.shippingAddress.city} - ${order.shippingAddress.pincode}

✨ *7-Day Size Exchange:* If you ever need a fit adjustment, simply reply to this chat.

With love & grace,
*ADAAH HOUSE*
_Grace in every thread._`;
}

/**
 * Generate formatted WhatsApp message for Owner
 */
export function generateOwnerWhatsAppMessage(order: Order): string {
  const itemsText = order.items
    .map((item) => `• ${item.product.name} (Size: ${item.selectedSize}, Qty: ${item.quantity}) - ₹${item.product.price * item.quantity}`)
    .join('\n');

  return `🚨 *NEW ADAAH HOUSE ORDER #${order.orderNumber}*

👤 *Customer:* ${order.shippingAddress.fullName}
📞 *Phone:* ${order.shippingAddress.phone}
✉️ *Email:* ${order.shippingAddress.email}

📍 *Address:*
${order.shippingAddress.addressLine}, ${order.shippingAddress.city} - ${order.shippingAddress.pincode}

🛍️ *Garments:*
${itemsText}

💵 *Total:* ₹${order.total.toLocaleString('en-IN')} (${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid via Online UPI'})
🚚 *Est. Delivery:* ${order.estimatedDeliveryDate}

Official Email Alert dispatched to *${BRAND_CONFIG.contact.email}*`;
}
