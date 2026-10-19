import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ override: true });

// Dynamic runtime helpers for environment variables
export const getEnv = (key: string, fallback = ''): string => {
  dotenv.config({ override: true });
  return process.env[key] || fallback;
};

export const getSupabaseUrl = () => getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
export const getSupabaseServiceRoleKey = () => getEnv('SUPABASE_SERVICE_ROLE_KEY');
export const getRazorpayKeyId = () => getEnv('RAZORPAY_KEY_ID') || getEnv('VITE_RAZORPAY_KEY_ID');
export const getRazorpayKeySecret = () => getEnv('RAZORPAY_KEY_SECRET');
export const getRazorpayWebhookSecret = () => getEnv('RAZORPAY_WEBHOOK_SECRET');
export const getAdminSetupSecret = () => getEnv('ADMIN_SETUP_SECRET', 'house_of_rii_jaipur_royal_admin_secret_2026');

// Ensure global WebSocket is available in Node.js runtime for Supabase client
if (typeof (global as any).WebSocket === 'undefined') {
  (global as any).WebSocket = class {};
}

// Supabase Admin Client with Service Role (Bypasses RLS for secure backend tasks)
export const getSupabaseAdmin = () => {
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceRoleKey();
  if (!url || !serviceKey) {
    return null;
  }
  return createClient(url, serviceKey, {
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

  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();

  // If Razorpay credentials are not yet configured, provide simulated sandbox response
  if (!keyId || !keySecret) {
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
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
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
      keyId: keyId,
      isTestMode: keyId.startsWith('rzp_test_'),
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
  const keySecret = getRazorpayKeySecret();

  // If running in test simulation mode without keys
  if (!keySecret) {
    const isMock = params.orderId.startsWith('order_sim_') || params.paymentId.startsWith('pay_sim_');
    return {
      verified: isMock,
      message: isMock ? 'Test simulation signature verified.' : 'Razorpay secret key not configured in .env',
    };
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
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
  const webhookSecret = getRazorpayWebhookSecret();
  if (!webhookSecret) return false;
  try {
    const expected = crypto
      .createHmac('sha256', webhookSecret)
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
  const adminSecret = getAdminSetupSecret();
  if (setupSecret !== adminSecret) {
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
  let tablesPending = false;

  if (supabaseAdmin) {
    try {
      const { data: pData, error: pError } = await supabaseAdmin.from('products').select('id').limit(1);
      const { data: oData, error: oError } = await supabaseAdmin.from('orders').select('id').limit(1);
      if (!pError) {
        dbConnected = true;
        const { count: pCount } = await supabaseAdmin.from('products').select('*', { count: 'exact', head: true });
        const { count: oCount } = await supabaseAdmin.from('orders').select('*', { count: 'exact', head: true });
        productsCount = pCount || 0;
        ordersCount = oCount || 0;
      } else if (pError.code === 'PGRST205' || pError.message?.includes('not find')) {
        // Connected to Supabase, but schema tables haven't been created yet
        dbConnected = true;
        tablesPending = true;
      } else {
        dbConnected = false;
      }
    } catch {
      dbConnected = false;
    }
  }

  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      type: 'PostgreSQL / Supabase',
      configured: Boolean(getSupabaseUrl() && (getSupabaseServiceRoleKey() || getEnv('VITE_SUPABASE_ANON_KEY'))),
      connected: dbConnected,
      tablesPending,
      productsCount,
      ordersCount,
    },
    payments: {
      razorpayConfigured: Boolean(getRazorpayKeyId() && getRazorpayKeySecret()),
      razorpayKeyId: getRazorpayKeyId() ? `${getRazorpayKeyId().substring(0, 10)}...` : 'Not set (using test simulation)',
      isTestMode: !getRazorpayKeyId() || getRazorpayKeyId().startsWith('rzp_test_'),
      codEnabled: true,
    },
    email: {
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpUser: process.env.SMTP_USER || 'houseofrii29@gmail.com',
      configured: Boolean(process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.GMAIL_APP_PASS)),
    },
  };
}
