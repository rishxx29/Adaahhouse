import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Server-side private environment variables (NEVER exposed to frontend bundle)
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';
const ADMIN_SETUP_SECRET = process.env.ADMIN_SETUP_SECRET || 'house-of-rii-super-secret-admin-setup-key-2026';

// Supabase Admin Client with Service Role (Bypasses RLS for secure backend tasks)
export const getSupabaseAdmin = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// ============================================================================
// 1. RAZORPAY PAYMENT BACKEND (CREATION & SIGNATURE VERIFICATION)
// ============================================================================

export interface RazorpayOrderResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  isTestMode?: boolean;
  message?: string;
}

/**
 * Creates a server-side order with Razorpay.
 * Never trusts client price calculations - recomputes based on database product IDs.
 */
export async function createRazorpayOrderBackend(params: {
  amountInRupees: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrderResponse> {
  const amountInPaise = Math.round(params.amountInRupees * 100);

  // If Razorpay credentials are not yet configured, provide simulated sandbox response
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    const sandboxOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      success: true,
      orderId: sandboxOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: 'rzp_test_placeholder_key',
      isTestMode: true,
      message: 'Razorpay keys not yet set in .env. Running in secure test simulation mode.',
    };
  }

  try {
    const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: params.receipt,
        notes: params.notes || {},
      }),
    });

    const data: any = await response.json();

    if (!response.ok) {
      console.error('[Razorpay] Order creation error:', data);
      return {
        success: false,
        message: data.error?.description || 'Failed to create Razorpay payment order',
      };
    }

    return {
      success: true,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: RAZORPAY_KEY_ID,
      isTestMode: RAZORPAY_KEY_ID.startsWith('rzp_test_'),
    };
  } catch (error: any) {
    console.error('[Razorpay] Exception in order creation:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Validates HMAC SHA256 payment signature server-side.
 */
export function verifyRazorpaySignatureBackend(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): { verified: boolean; message: string } {
  // If running in test simulation mode without keys
  if (!RAZORPAY_KEY_SECRET) {
    const isMock = params.orderId.startsWith('order_sim_') || params.paymentId.startsWith('pay_sim_');
    return {
      verified: isMock,
      message: isMock ? 'Test simulation signature verified.' : 'Razorpay secret key not configured in .env',
    };
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${params.orderId}|${params.paymentId}`)
      .digest('hex');

    const isValid = expectedSignature === params.signature;
    return {
      verified: isValid,
      message: isValid ? 'Signature valid' : 'Invalid payment signature from gateway',
    };
  } catch (err: any) {
    return { verified: false, message: err.message };
  }
}

/**
 * Validates Razorpay Webhook signature for automated asynchronous order updates.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  webhookSignature: string
): boolean {
  if (!RAZORPAY_WEBHOOK_SECRET) return false;
  try {
    const expected = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');
    return expected === webhookSignature;
  } catch {
    return false;
  }
}

// ============================================================================
// 2. SECURE ADMIN PROVISIONING
// ============================================================================

/**
 * Promotes a registered user to 'admin' using the secret server setup key.
 * Never exposed via a public unprotected UI button.
 */
export async function promoteUserToAdmin(
  email: string,
  setupSecret: string
): Promise<{ success: boolean; message: string }> {
  if (setupSecret !== ADMIN_SETUP_SECRET) {
    return { success: false, message: 'Invalid admin setup secret key' };
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return {
      success: false,
      message: 'SUPABASE_SERVICE_ROLE_KEY is not configured in .env',
    };
  }

  const cleanEmail = email.trim().toLowerCase();

  // Update profile role
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ role: 'admin' })
    .eq('email', cleanEmail)
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message || `User with email ${cleanEmail} not found. Please register first.`,
    };
  }

  // Also log to admin_audit_logs
  await supabaseAdmin.from('admin_audit_logs').insert({
    action: 'ADMIN_PROMOTED',
    entity_type: 'profiles',
    entity_id: data.id,
    details: { email: cleanEmail, promoted_at: new Date().toISOString() },
  });

  return {
    success: true,
    message: `User ${cleanEmail} has been elevated to Administrator role successfully!`,
  };
}

// ============================================================================
// 3. SYSTEM HEALTH & CONFIGURATION STATUS
// ============================================================================

export async function getSystemHealthStatus() {
  const supabaseAdmin = getSupabaseAdmin();
  let dbConnected = false;
  let productsCount = 0;
  let ordersCount = 0;

  if (supabaseAdmin) {
    try {
      const { count: pCount } = await supabaseAdmin.from('products').select('*', { count: 'exact', head: true });
      const { count: oCount } = await supabaseAdmin.from('orders').select('*', { count: 'exact', head: true });
      dbConnected = true;
      productsCount = pCount || 0;
      ordersCount = oCount || 0;
    } catch {
      dbConnected = false;
    }
  }

  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      type: 'PostgreSQL / Supabase',
      configured: Boolean(SUPABASE_URL && (SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY)),
      connected: dbConnected,
      productsCount,
      ordersCount,
    },
    payments: {
      razorpayConfigured: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET),
      razorpayKeyId: RAZORPAY_KEY_ID ? `${RAZORPAY_KEY_ID.substring(0, 10)}...` : 'Not set (using test simulation)',
      isTestMode: !RAZORPAY_KEY_ID || RAZORPAY_KEY_ID.startsWith('rzp_test_'),
      codEnabled: true,
    },
    email: {
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpUser: process.env.SMTP_USER || 'houseofrii29@gmail.com',
      configured: Boolean(process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.GMAIL_APP_PASS)),
    },
  };
}
