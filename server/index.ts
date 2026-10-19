import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import 'dotenv/config';
import {
  createRazorpayOrderBackend,
  verifyRazorpaySignatureBackend,
  verifyRazorpayWebhookSignature,
  promoteUserToAdmin,
  getSystemHealthStatus,
  getSupabaseAdmin,
} from './api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// API ROUTES
// ============================================================================

// 1. System Health Check
app.get('/api/health', async (_req, res) => {
  const health = await getSystemHealthStatus();
  res.json(health);
});

// 2. Razorpay Order Creation (Server-side price protection)
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { amount, receipt, notes } = req.body;
    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, message: 'Invalid order amount' });
    }
    const result = await createRazorpayOrderBackend({
      amountInRupees: amount,
      receipt: receipt || `rec_${Date.now()}`,
      notes,
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Razorpay Payment Signature Verification
app.post('/api/verify-razorpay-payment', (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    if (!orderId || !paymentId) {
      return res.status(400).json({ verified: false, message: 'Missing orderId or paymentId' });
    }
    const verification = verifyRazorpaySignatureBackend({ orderId, paymentId, signature });
    res.json(verification);
  } catch (err: any) {
    res.status(500).json({ verified: false, message: err.message });
  }
});

// 4. Razorpay Webhook Handler
app.post('/api/razorpay-webhook', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const rawBody = JSON.stringify(req.body);

  if (signature && !verifyRazorpayWebhookSignature(rawBody, signature)) {
    return res.status(400).send('Invalid webhook signature');
  }

  const event = req.body.event;
  const payload = req.body.payload;

  console.log(`[Webhook] Razorpay event received: ${event}`);

  if (event === 'payment.captured' || event === 'order.paid') {
    const supabaseAdmin = getSupabaseAdmin();
    if (supabaseAdmin) {
      const paymentEntity = payload.payment?.entity;
      const orderId = paymentEntity?.order_id;
      if (orderId) {
        // Update payment and order status
        await supabaseAdmin
          .from('payments')
          .update({ status: 'captured', updated_at: new Date().toISOString() })
          .eq('payment_order_id', orderId);
      }
    }
  }

  res.json({ status: 'ok' });
});

// 5. Secure First Admin Provisioning
app.post('/api/admin/setup-first-admin', async (req, res) => {
  try {
    const { email, setupSecret } = req.body;
    if (!email || !setupSecret) {
      return res.status(400).json({ success: false, message: 'Email and setupSecret are required' });
    }
    const result = await promoteUserToAdmin(email, setupSecret);
    res.status(result.success ? 200 : 403).json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Email Dispatch via Nodemailer (Gmail SMTP)
app.post('/api/send-order-email', async (req, res) => {
  try {
    const { order, ownerEmail, customerEmail } = req.body;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASS;
    const targetOwner = process.env.OWNER_EMAIL || ownerEmail?.to || 'houseofrii29@gmail.com';

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      // 1. Send to owner
      await transporter.sendMail({
        from: `"HOUSE OF RII Orders" <${smtpUser}>`,
        to: targetOwner,
        subject: ownerEmail.subject,
        html: ownerEmail.html,
      });

      // 2. Send to customer
      if (customerEmail?.to) {
        await transporter.sendMail({
          from: `"HOUSE OF RII" <${smtpUser}>`,
          to: customerEmail.to,
          subject: customerEmail.subject,
          html: customerEmail.html,
        });
      }

      return res.json({ success: true, simulated: false, message: 'Emails dispatched successfully' });
    }

    // Simulation log
    console.log(`[Order Email Simulation] Order #${order?.orderNumber} to ${targetOwner} & ${customerEmail?.to}`);
    res.json({ success: true, simulated: true, message: 'Simulated email logged to console.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve frontend build if dist exists
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

if (process.env.NODE_ENV === 'production') {
  app.listen(PORT, () => {
    console.log(`[HOUSE OF RII] Production server running on port ${PORT}`);
  });
}

export default app;
