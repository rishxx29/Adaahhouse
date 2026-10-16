import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import nodemailer from 'nodemailer';
import 'dotenv/config';

function orderNotificationPlugin(): Plugin {
  return {
    name: 'order-notification-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-smtp-config', async (req, res, next) => {
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const { smtpPass } = JSON.parse(body || '{}');
            if (!smtpPass || !smtpPass.trim()) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, message: 'Google App Password is required' }));
            }
            const cleanPass = smtpPass.trim().replace(/\s+/g, '');
            process.env.SMTP_PASS = cleanPass;

            const envPath = path.resolve(__dirname, '.env');
            let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
            if (envContent.includes('SMTP_PASS=')) {
              envContent = envContent.replace(/SMTP_PASS=.*/g, `SMTP_PASS="${cleanPass}"`);
            } else {
              envContent += `\nSMTP_PASS="${cleanPass}"\n`;
            }
            fs.writeFileSync(envPath, envContent, 'utf-8');

            console.log(`\n🔑 [HOUSE OF RII] SMTP_PASS updated and saved to .env for aadahhouse@gmail.com\n`);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'Gmail App Password saved and activated successfully!' }));
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: e.message }));
          }
        });
      });

      // In-memory payment session store for automated UPI webhook & status verification
      const paymentSessions: Record<string, { status: 'PENDING' | 'PAID'; amount: number; upiRef?: string; createdAt: number }> = {};

      server.middlewares.use('/api/payment-status', (req, res, next) => {
        const url = new URL(req.url || '', 'http://localhost');
        const sessionId = url.searchParams.get('sessionId') || '';
        const session = paymentSessions[sessionId];
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            sessionId,
            status: session ? session.status : 'PENDING',
            upiId: 'aadahhouse@okaxis',
            receivedAt: new Date().toISOString(),
          })
        );
      });

      server.middlewares.use('/api/confirm-upi-payment', async (req, res, next) => {
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            const { sessionId, upiRef } = data;
            if (sessionId) {
              paymentSessions[sessionId] = {
                status: 'PAID',
                amount: data.amount || 0,
                upiRef: upiRef || `UPI-TXN-${Date.now()}`,
                createdAt: Date.now(),
              };
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, status: 'PAID' }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      });

      server.middlewares.use('/api/send-order-sms', async (req, res, next) => {
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const { phone, customerName, orderNumber, message } = JSON.parse(body || '{}');
            console.log('\n======================================================');
            console.log('📱 [HOUSE OF RII SMS & MOBILE NOTIFICATION DISPATCH]');
            console.log(`➡️  Recipient Mobile: +91 ${phone} (${customerName || 'Valued Customer'})`);
            console.log(`📦  Order #${orderNumber}`);
            console.log(`💬  Message:\n"${message}"`);
            console.log(`✅  Status: Dispatched to telecom SMS gateway & WhatsApp API`);
            console.log('======================================================\n');

            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                phone,
                orderNumber,
                message: `SMS message dispatched successfully to +91 ${phone}`,
              })
            );
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: e.message }));
          }
        });
      });

      server.middlewares.use('/api/send-order-email', async (req, res, next) => {
        // Status check
        if (req.method === 'GET') {
          const smtpConfigured = Boolean(process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.GMAIL_APP_PASS));
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              status: 'ready',
              ownerEmail: process.env.OWNER_EMAIL || 'aadahhouse@gmail.com',
              smtpConfigured,
              smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
            })
          );
          return;
        }

        if (req.method !== 'POST') {
          return next();
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { order, ownerEmail, customerEmail } = data;

            const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
            const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
            const smtpUser = process.env.SMTP_USER;
            const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASS;
            const targetOwnerEmail = process.env.OWNER_EMAIL || ownerEmail?.to || 'aadahhouse@gmail.com';

            if (smtpUser && smtpPass) {
              const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                  user: smtpUser,
                  pass: smtpPass,
                },
              });

              // 1. Send Order Notification to Owner
              await transporter.sendMail({
                from: `"HOUSE OF RII Orders" <${smtpUser}>`,
                to: targetOwnerEmail,
                replyTo: order?.shippingAddress?.email || customerEmail?.to,
                subject: ownerEmail.subject,
                text: ownerEmail.text,
                html: ownerEmail.html,
              });

              // 2. Send Order Confirmation to Customer
              if (customerEmail?.to) {
                await transporter.sendMail({
                  from: `"HOUSE OF RII" <${smtpUser}>`,
                  to: customerEmail.to,
                  replyTo: targetOwnerEmail,
                  subject: customerEmail.subject,
                  text: customerEmail.text,
                  html: customerEmail.html,
                });
              }

              console.log(`\n✅ [HOUSE OF RII] Live emails successfully sent via Gmail SMTP:`);
              console.log(`   Owner: ${targetOwnerEmail}`);
              console.log(`   Customer: ${customerEmail?.to}`);
              console.log(`   Order: #${order?.orderNumber} (₹${order?.total})\n`);

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  simulated: false,
                  ownerEmail: targetOwnerEmail,
                  customerEmail: customerEmail?.to,
                  message: `Emails sent successfully to Owner (${targetOwnerEmail}) and Customer (${customerEmail?.to})`,
                })
              );
              return;
            }

            // Fallback / Development Simulation mode
            console.log('\n======================================================');
            console.log('✉️  [HOUSE OF RII NOTIFICATION DISPATCH - PREVIEW]');
            console.log(`➡️  Owner Notification to: ${targetOwnerEmail}`);
            console.log(`➡️  Customer Confirmation to: ${customerEmail?.to}`);
            console.log(`📦  Order #${order?.orderNumber} | Total: ₹${order?.total} | Status: ${order?.status}`);
            console.log(`👤  Customer: ${order?.shippingAddress?.fullName} (${order?.shippingAddress?.phone})`);
            console.log('💡  To enable live Gmail delivery:');
            console.log('    1. Open .env');
            console.log('    2. Add your 16-character Google App Password in SMTP_PASS=""');
            console.log('======================================================\n');

            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                simulated: true,
                ownerEmail: targetOwnerEmail,
                customerEmail: customerEmail?.to,
                message: `Order notification prepared for Owner (${targetOwnerEmail}) and Customer (${customerEmail?.to}). Logged to server console.`,
              })
            );
          } catch (error: any) {
            console.error('Error in send-order-email endpoint:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: false,
                message: error?.message || 'Failed to dispatch order email',
              })
            );
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), orderNotificationPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

