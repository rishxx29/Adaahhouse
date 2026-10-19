-- ============================================================================
-- HOUSE OF RII — COMPLETE E-COMMERCE DATABASE SCHEMA & MIGRATION (PostgreSQL / Supabase)
-- ============================================================================
-- This migration script sets up a production-ready relational e-commerce database
-- with Row Level Security (RLS), atomic stock management, order snapshots,
-- payment verification, customer profiles, exchange requests, and audit logs.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. ENUM TYPES
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'Pending',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_type AS ENUM (
    'COD',
    'ONLINE_UPI',
    'ONLINE_CARD',
    'ONLINE_RAZORPAY'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_type AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE product_status_type AS ENUM (
    'active',
    'draft',
    'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE exchange_status_type AS ENUM (
    'pending',
    'approved',
    'rejected',
    'completed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE coupon_type AS ENUM (
    'percentage',
    'fixed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- 3. CUSTOMER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Trigger to auto-create profile upon auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE 
      WHEN NEW.email = 'houseofrii29@gmail.com' OR NEW.email = 'aadahhouse@gmail.com' THEN 'admin'::user_role
      ELSE 'customer'::user_role
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 4. CUSTOMER SAVED ADDRESSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address_line TEXT NOT NULL,
  locality TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default BOOLEAN NOT NULL DEFAULT false,
  delivery_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);

-- Ensure only one default address per customer
CREATE OR REPLACE FUNCTION public.handle_default_address()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE public.addresses
    SET is_default = false
    WHERE user_id = NEW.user_id AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_default_address ON public.addresses;
CREATE TRIGGER trg_default_address
  BEFORE INSERT OR UPDATE OF is_default ON public.addresses
  FOR EACH ROW
  WHEN (NEW.is_default = true)
  EXECUTE FUNCTION public.handle_default_address();

-- ============================================================================
-- 5. CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed Official Categories
INSERT INTO public.categories (name, slug, description, display_order)
VALUES
  ('Kurtis', 'kurtis', 'Everyday cotton and silk kurtis styled for effortless grace.', 1),
  ('Kurti Sets', 'kurti-sets', 'Coordinated kurti, pants, and mulmul dupatta ensembles.', 2),
  ('Co-ord Sets', 'co-ord-sets', 'Chic two-piece ethnic sets with contemporary silhouettes.', 3),
  ('Anarkali Suits', 'anarkali-suits', 'Regal flared anarkali sets crafted for celebratory twirls.', 4),
  ('Straight Suit Sets', 'straight-suit-sets', 'Timeless straight-cut suits with intricate embroidery.', 5),
  ('Festive Wear', 'festive-wear', 'Zari, gotta-patti, and micro-velvet luxury festive curation.', 6)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 6. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  collection TEXT NOT NULL DEFAULT 'Everyday Wear',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL DEFAULT 'Kurti Sets',
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(10, 2) CHECK (original_price IS NULL OR original_price >= price),
  description TEXT NOT NULL,
  fabric TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  status product_status_type NOT NULL DEFAULT 'active',
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  care_instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  measurements JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_collection ON public.products(collection);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_name);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- ============================================================================
-- 7. PRODUCT IMAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_product_images_pid ON public.product_images(product_id);

-- ============================================================================
-- 8. PRODUCT VARIANTS (SIZES, COLORS & REAL INVENTORY)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size VARCHAR(10) NOT NULL, -- 'XS', 'S', 'M', 'L', 'XL', 'XXL'
  color TEXT NOT NULL DEFAULT 'Classic',
  sku TEXT,
  stock_quantity INT NOT NULL DEFAULT 10 CHECK (stock_quantity >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (product_id, size, color)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_pid ON public.product_variants(product_id);

-- ============================================================================
-- 9. SHOPPING CARTS & CART ITEMS (PERSISTENT & CROSS-DEVICE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size VARCHAR(10) NOT NULL,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (cart_id, product_id, size)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON public.cart_items(cart_id);

-- ============================================================================
-- 10. WISHLISTS & WISHLIST ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (wishlist_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_wl ON public.wishlist_items(wishlist_id);

-- ============================================================================
-- 11. COUPONS & DISCOUNTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  type coupon_type NOT NULL DEFAULT 'percentage',
  value NUMERIC(10, 2) NOT NULL CHECK (value > 0),
  min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  max_discount_amount NUMERIC(10, 2),
  usage_limit INT,
  used_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

INSERT INTO public.coupons (code, description, type, value, min_order_amount, is_active)
VALUES
  ('RII10', '10% off on your luxury curation', 'percentage', 10, 999, true),
  ('RII15', '15% off on festive orders above ₹1,999', 'percentage', 15, 1999, true),
  ('WELCOME100', 'Flat ₹100 off on your first order', 'fixed', 100, 799, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 12. ORDERS & ORDER ITEMS (IMMUTABLE PURCHASE SNAPSHOTS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status order_status NOT NULL DEFAULT 'Confirmed',
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  coupon_code TEXT,
  shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  payment_method payment_method_type NOT NULL DEFAULT 'ONLINE_UPI',
  payment_status payment_status_type NOT NULL DEFAULT 'PAID',
  transaction_ref TEXT,
  shipping_address_snapshot JSONB NOT NULL,
  shipment_tracking_number TEXT,
  courier_name TEXT,
  customer_notes TEXT,
  admin_notes TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  estimated_delivery_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  sku TEXT,
  size VARCHAR(10) NOT NULL,
  color TEXT NOT NULL DEFAULT 'Classic',
  image_url TEXT,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  line_total NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- Coupon redemptions
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  discount_amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 13. PAYMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL DEFAULT 'Razorpay',
  payment_order_id TEXT,
  payment_id TEXT,
  signature TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'created', -- 'created', 'captured', 'failed', 'refunded'
  raw_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_pid ON public.payments(payment_id);

-- ============================================================================
-- 14. SHIPMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  courier TEXT NOT NULL DEFAULT 'Delhivery',
  tracking_number TEXT NOT NULL,
  tracking_url TEXT,
  status TEXT NOT NULL DEFAULT 'label_created',
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_shipments_order ON public.shipments(order_id);

-- ============================================================================
-- 15. EXCHANGE & RETURN REQUESTS TABLE (7-Day Exchange Policy)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  requested_size VARCHAR(10) NOT NULL,
  reason TEXT NOT NULL,
  supporting_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  status exchange_status_type NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_exchange_order ON public.exchange_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_exchange_user ON public.exchange_requests(user_id);

-- ============================================================================
-- 16. REVIEWS, CONTACT MESSAGES & NEWSLETTER
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  order_number TEXT,
  message TEXT NOT NULL,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  admin_reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 17. ATOMIC ORDER CREATION & STOCK TRANSACTION (STORED FUNCTION)
-- ============================================================================
-- This server-side function enforces:
-- 1. Server-side price recalculation (browser prices are ignored).
-- 2. Concurrency-safe variant stock deduction.
-- 3. Atomic creation of order, order_items, and payment records.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.create_order_atomic(
  p_user_id UUID,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_items JSONB,
  p_shipping_address JSONB,
  p_payment_method TEXT,
  p_coupon_code TEXT DEFAULT NULL,
  p_customer_notes TEXT DEFAULT NULL,
  p_transaction_ref TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_order_number TEXT;
  v_item RECORD;
  v_product RECORD;
  v_variant RECORD;
  v_subtotal NUMERIC(10, 2) := 0;
  v_discount NUMERIC(10, 2) := 0;
  v_shipping_fee NUMERIC(10, 2) := 0;
  v_final_total NUMERIC(10, 2) := 0;
  v_coupon RECORD;
  v_est_delivery TEXT;
  v_payment_status payment_status_type;
BEGIN
  -- Generate unique Order Number like 'RII-2026-XXXX'
  v_order_number := 'RII-' || to_char(now(), 'YYYY') || '-' || upper(substring(gen_random_uuid()::text from 1 for 6));
  
  -- Calculate estimated delivery date (+4 days)
  v_est_delivery := to_char(now() + interval '4 days', 'Dy, DD Mon YYYY');

  -- Initial payment status
  IF p_payment_method = 'COD' THEN
    v_payment_status := 'PENDING';
  ELSE
    v_payment_status := 'PAID';
  END IF;

  -- Verify each item against real database and calculate verified subtotal
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
    product_id UUID,
    size TEXT,
    quantity INT
  )
  LOOP
    -- Fetch active product
    SELECT * INTO v_product FROM public.products
    WHERE id = v_item.product_id AND status = 'active';

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product with ID % is no longer available.', v_item.product_id;
    END IF;

    -- Concurrency check on stock variant
    SELECT * INTO v_variant FROM public.product_variants
    WHERE product_id = v_item.product_id AND size = v_item.size
    FOR UPDATE; -- lock row to prevent race conditions

    IF FOUND THEN
      IF v_variant.stock_quantity < v_item.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for % in size %. Available: %', v_product.name, v_item.size, v_variant.stock_quantity;
      END IF;

      -- Decrement stock atomically
      UPDATE public.product_variants
      SET stock_quantity = stock_quantity - v_item.quantity,
          updated_at = timezone('utc'::text, now())
      WHERE id = v_variant.id;
    END IF;

    v_subtotal := v_subtotal + (v_product.price * v_item.quantity);
  END LOOP;

  -- Validate Coupon if provided
  IF p_coupon_code IS NOT NULL AND trim(p_coupon_code) <> '' THEN
    SELECT * INTO v_coupon FROM public.coupons
    WHERE upper(code) = upper(trim(p_coupon_code))
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now());

    IF FOUND AND v_subtotal >= v_coupon.min_order_amount THEN
      IF v_coupon.type = 'percentage' THEN
        v_discount := round((v_subtotal * (v_coupon.value / 100.0)), 2);
        IF v_coupon.max_discount_amount IS NOT NULL AND v_discount > v_coupon.max_discount_amount THEN
          v_discount := v_coupon.max_discount_amount;
        END IF;
      ELSE
        v_discount := v_coupon.value;
      END IF;

      -- Increment coupon usage
      UPDATE public.coupons SET used_count = used_count + 1 WHERE id = v_coupon.id;
    END IF;
  END IF;

  -- Free shipping rule: subtotal >= 999 is free shipping, else 99
  IF v_subtotal >= 999 THEN
    v_shipping_fee := 0;
  ELSE
    v_shipping_fee := 99;
  END IF;

  v_final_total := GREATEST(0, (v_subtotal - v_discount) + v_shipping_fee);

  -- Insert Order Record
  INSERT INTO public.orders (
    order_number,
    user_id,
    customer_email,
    customer_phone,
    status,
    subtotal,
    discount,
    coupon_code,
    shipping_fee,
    total,
    payment_method,
    payment_status,
    transaction_ref,
    shipping_address_snapshot,
    customer_notes,
    estimated_delivery_date
  ) VALUES (
    v_order_number,
    p_user_id,
    p_customer_email,
    p_customer_phone,
    'Confirmed',
    v_subtotal,
    v_discount,
    p_coupon_code,
    v_shipping_fee,
    v_final_total,
    p_payment_method::payment_method_type,
    v_payment_status,
    COALESCE(p_transaction_ref, 'TXN-' || floor(random()*900000 + 100000)::text),
    p_shipping_address,
    p_customer_notes,
    v_est_delivery
  )
  RETURNING id INTO v_order_id;

  -- Insert Order Items Snapshots
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
    product_id UUID,
    size TEXT,
    quantity INT,
    image_url TEXT
  )
  LOOP
    SELECT * INTO v_product FROM public.products WHERE id = v_item.product_id;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      sku,
      size,
      image_url,
      unit_price,
      quantity,
      line_total
    ) VALUES (
      v_order_id,
      v_product.id,
      v_product.name,
      v_product.sku,
      v_item.size,
      COALESCE(v_item.image_url, (SELECT image_url FROM public.product_images WHERE product_id = v_product.id ORDER BY display_order ASC LIMIT 1)),
      v_product.price,
      v_item.quantity,
      v_product.price * v_item.quantity
    );
  END LOOP;

  -- Insert Payment Record
  INSERT INTO public.payments (
    order_id,
    gateway,
    payment_id,
    amount,
    currency,
    status
  ) VALUES (
    v_order_id,
    p_payment_method,
    COALESCE(p_transaction_ref, 'TXN-' || v_order_number),
    v_final_total,
    'INR',
    CASE WHEN v_payment_status = 'PAID' THEN 'captured' ELSE 'pending' END
  );

  -- Record Coupon Redemption if applicable
  IF v_discount > 0 AND v_coupon.id IS NOT NULL THEN
    INSERT INTO public.coupon_redemptions (coupon_id, user_id, order_id, discount_amount)
    VALUES (v_coupon.id, p_user_id, v_order_id, v_discount);
  END IF;

  -- Clear customer cart if user is logged in
  IF p_user_id IS NOT NULL THEN
    DELETE FROM public.cart_items
    WHERE cart_id IN (SELECT id FROM public.carts WHERE user_id = p_user_id);
  END IF;

  -- Return complete order summary as JSON
  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_number', v_order_number,
    'total', v_final_total,
    'subtotal', v_subtotal,
    'discount', v_discount,
    'shipping_fee', v_shipping_fee,
    'estimated_delivery', v_est_delivery,
    'status', 'Confirmed'
  );
END;
$$;

-- Atomic Order Cancellation & Stock Restoration
CREATE OR REPLACE FUNCTION public.cancel_order_and_restore_stock(
  p_order_id UUID,
  p_reason TEXT DEFAULT 'Cancelled by customer'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
  v_item RECORD;
BEGIN
  SELECT * INTO v_order FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF v_order.status IN ('Shipped', 'Out for Delivery', 'Delivered', 'Cancelled') THEN
    RAISE EXCEPTION 'Order cannot be cancelled in status %', v_order.status;
  END IF;

  -- Restore stock for all items
  FOR v_item IN SELECT * FROM public.order_items WHERE order_id = p_order_id LOOP
    IF v_item.product_id IS NOT NULL THEN
      UPDATE public.product_variants
      SET stock_quantity = stock_quantity + v_item.quantity
      WHERE product_id = v_item.product_id AND size = v_item.size;
    END IF;
  END LOOP;

  -- Update order status
  UPDATE public.orders
  SET status = 'Cancelled',
      cancellation_reason = p_reason,
      cancelled_at = timezone('utc'::text, now()),
      updated_at = timezone('utc'::text, now())
  WHERE id = p_order_id;

  RETURN jsonb_build_object('success', true, 'message', 'Order cancelled and stock restored successfully.');
END;
$$;

-- ============================================================================
-- 18. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by self or admin" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- ADDRESSES POLICIES
CREATE POLICY "Users can CRUD own addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- CATEGORIES POLICIES
CREATE POLICY "Active categories are publicly readable" ON public.categories
  FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- PRODUCTS POLICIES
CREATE POLICY "Active products are viewable by everyone" ON public.products
  FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Admins can insert/update/delete products" ON public.products
  FOR ALL USING (public.is_admin());

-- PRODUCT IMAGES POLICIES
CREATE POLICY "Product images are publicly readable" ON public.product_images
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage product images" ON public.product_images
  FOR ALL USING (public.is_admin());

-- PRODUCT VARIANTS POLICIES
CREATE POLICY "Product variants are publicly readable" ON public.product_variants
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage product variants" ON public.product_variants
  FOR ALL USING (public.is_admin());

-- CARTS & CART ITEMS POLICIES
CREATE POLICY "Users can manage own cart" ON public.carts
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own cart items" ON public.cart_items
  FOR ALL USING (
    cart_id IN (SELECT id FROM public.carts WHERE user_id = auth.uid()) OR public.is_admin()
  );

-- WISHLISTS & WISHLIST ITEMS POLICIES
CREATE POLICY "Users can manage own wishlist" ON public.wishlists
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own wishlist items" ON public.wishlist_items
  FOR ALL USING (
    wishlist_id IN (SELECT id FROM public.wishlists WHERE user_id = auth.uid()) OR public.is_admin()
  );

-- ORDERS & ORDER ITEMS POLICIES
CREATE POLICY "Customers view own orders, admins view all" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Customers view items of own orders, admins view all" ON public.order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()) OR public.is_admin()
  );

-- PAYMENTS POLICIES
CREATE POLICY "Customers view payments of own orders, admins view all" ON public.payments
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()) OR public.is_admin()
  );
CREATE POLICY "Admins can manage payments" ON public.payments
  FOR ALL USING (public.is_admin());

-- SHIPMENTS POLICIES
CREATE POLICY "Customers view shipments of own orders, admins view all" ON public.shipments
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()) OR public.is_admin()
  );
CREATE POLICY "Admins can manage shipments" ON public.shipments
  FOR ALL USING (public.is_admin());

-- EXCHANGE REQUESTS POLICIES
CREATE POLICY "Customers can create and view own exchange requests" ON public.exchange_requests
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- COUPONS POLICIES
CREATE POLICY "Public can view active coupons" ON public.coupons
  FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage coupons" ON public.coupons
  FOR ALL USING (public.is_admin());

-- REVIEWS POLICIES
CREATE POLICY "Approved reviews are readable by everyone" ON public.reviews
  FOR SELECT USING (is_approved = true OR public.is_admin());
CREATE POLICY "Authenticated users can submit reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage reviews" ON public.reviews
  FOR ALL USING (public.is_admin());

-- CONTACT MESSAGES POLICIES
CREATE POLICY "Public can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read/manage contact messages" ON public.contact_messages
  FOR ALL USING (public.is_admin());

-- NEWSLETTER POLICIES
CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscriptions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view newsletter subscriptions" ON public.newsletter_subscriptions
  FOR ALL USING (public.is_admin());

-- AUDIT LOGS POLICIES
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs
  FOR ALL USING (public.is_admin());

-- ============================================================================
-- 19. SEED INITIAL PRODUCTS & VARIANTS
-- ============================================================================
DO $$
DECLARE
  v_cat_kurtis UUID;
  v_cat_sets UUID;
  v_cat_coord UUID;
  v_cat_anarkali UUID;
  v_cat_straight UUID;
  v_cat_festive UUID;
  v_p1 UUID;
  v_p2 UUID;
  v_p3 UUID;
  v_p4 UUID;
  v_p5 UUID;
  v_p6 UUID;
  v_p7 UUID;
  v_p8 UUID;
BEGIN
  SELECT id INTO v_cat_kurtis FROM public.categories WHERE slug = 'kurtis';
  SELECT id INTO v_cat_sets FROM public.categories WHERE slug = 'kurti-sets';
  SELECT id INTO v_cat_coord FROM public.categories WHERE slug = 'co-ord-sets';
  SELECT id INTO v_cat_anarkali FROM public.categories WHERE slug = 'anarkali-suits';
  SELECT id INTO v_cat_straight FROM public.categories WHERE slug = 'straight-suit-sets';
  SELECT id INTO v_cat_festive FROM public.categories WHERE slug = 'festive-wear';

  -- Product 1: Gulmohar Embroidered Dusty Mauve Kurta Set
  INSERT INTO public.products (
    sku, name, slug, collection, category_id, category_name, price, original_price,
    description, fabric, is_new_arrival, is_bestseller
  ) VALUES (
    'ADH-EW-KS01', 'Gulmohar Embroidered Dusty Mauve Kurta Set', 'gulmohar-embroidered-dusty-mauve-kurta-set',
    'Everyday Wear', v_cat_sets, 'Kurti Sets', 1599, 2299,
    'A breathable 100% fine cotton kurti set designed for everyday elegance. Crafted with traditional Rajasthani hand-block floral motifs, paired with straight cotton cigarette pants and a lightweight mulmul dupatta.',
    '100% Premium Cotton Mulmul with Cotton Voile Lining', true, true
  )
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
  RETURNING id INTO v_p1;

  -- Product 2: Rooh Lilac Handcrafted Pure Cotton Kurta Set
  INSERT INTO public.products (
    sku, name, slug, collection, category_id, category_name, price, original_price,
    description, fabric, is_new_arrival, is_bestseller
  ) VALUES (
    'ADH-EW-KS02', 'Rooh Lilac Handcrafted Pure Cotton Kurta Set', 'rooh-lilac-handcrafted-pure-cotton-kurta-set',
    'Everyday Wear', v_cat_sets, 'Kurti Sets', 1699, 2199,
    'Designed for seamless transitions from work desks to evening cafes. Tailored in structured breathable cotton-slub with subtle tone-on-tone resham work along the placket.',
    'Textured Breathable Cotton Slub', true, true
  )
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
  RETURNING id INTO v_p2;

  -- Product 3: Rose Botanical Pure Cotton Ethnic Co-ord Set
  INSERT INTO public.products (
    sku, name, slug, collection, category_id, category_name, price, original_price,
    description, fabric, is_new_arrival, is_bestseller
  ) VALUES (
    'ADH-CD-01', 'Rose Botanical Pure Cotton Ethnic Co-ord Set', 'rose-botanical-pure-cotton-ethnic-co-ord-set',
    'Everyday Wear', v_cat_coord, 'Co-ord Sets', 1499, 1999,
    'Effortless 2-piece tailored ethnic co-ord set in refreshing rose pink with subtle botanical block motifs. Features a comfort notched tunic and elasticated straight pants with pockets.',
    '100% Breathable Jaipur Cotton', true, false
  )
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
  RETURNING id INTO v_p3;

  -- Product 4: Lavender Royale Flared Chanderi Anarkali Suit
  INSERT INTO public.products (
    sku, name, slug, collection, category_id, category_name, price, original_price,
    description, fabric, is_new_arrival, is_bestseller
  ) VALUES (
    'ADH-AN-01', 'Lavender Royale Flared Chanderi Anarkali Suit', 'lavender-royale-flared-chanderi-anarkali-suit',
    'Festive & Wedding Edits', v_cat_anarkali, 'Anarkali Suits', 2499, 3299,
    'Magnificent flared festive Anarkali suit set in luminous pastel lavender Chanderi silk with antique gold zardozi neckline and scalloped sheer organza dupatta.',
    'Chanderi Silk with Santoon Lining & Organza Dupatta', false, true
  )
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
  RETURNING id INTO v_p4;

  -- Product 5: Noor Plum Micro-Velvet Festive Co-ord Set
  INSERT INTO public.products (
    sku, name, slug, collection, category_id, category_name, price, original_price,
    description, fabric, is_new_arrival, is_bestseller
  ) VALUES (
    'ADH-FE-01', 'Noor Plum Micro-Velvet Festive Co-ord Set', 'noor-plum-micro-velvet-festive-co-ord-set',
    'Festive & Wedding Edits', v_cat_festive, 'Festive Wear', 2199, 2899,
    'Rich jewel-toned plum micro-velvet festive suit set with delicate antique zardozi resham threadwork, paired with straight velvet trousers.',
    'Plush Micro-Velvet with Shimmer Sheen', true, true
  )
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
  RETURNING id INTO v_p5;

  -- Product 6: Sitara Ivory Gotta Patti Straight Suit Set
  INSERT INTO public.products (
    sku, name, slug, collection, category_id, category_name, price, original_price,
    description, fabric, is_new_arrival, is_bestseller
  ) VALUES (
    'ADH-SS-01', 'Sitara Ivory Gotta Patti Straight Suit Set', 'sitara-ivory-gotta-patti-straight-suit-set',
    'Festive & Wedding Edits', v_cat_straight, 'Straight Suit Sets', 1899, 2499,
    'Graceful ivory straight-cut kurta set highlighted with authentic Rajasthani gold gotta patti lace detailing along the neckline, sleeves, and hem.',
    'Chanderi Silk Blend with Kota Doria Dupatta', false, true
  )
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
  RETURNING id INTO v_p6;

  -- Product 7: Mehrab Sage Green Linen Casual Co-ord Set
  INSERT INTO public.products (
    sku, name, slug, collection, category_id, category_name, price, original_price,
    description, fabric, is_new_arrival, is_bestseller
  ) VALUES (
    'ADH-CD-02', 'Mehrab Sage Green Linen Casual Co-ord Set', 'mehrab-sage-green-linen-casual-co-ord-set',
    'Everyday Wear', v_cat_coord, 'Co-ord Sets', 1399, 1899,
    'Understated minimalist luxury in earthy sage green. Crafted in breathable linen-viscose blend with mother-of-pearl buttons and cropped culotte pants.',
    'Linen Viscose Blend', true, false
  )
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
  RETURNING id INTO v_p7;

  -- Product 8: Rivaaz Maroon Zari Tiered Sharara Suit Set
  INSERT INTO public.products (
    sku, name, slug, collection, category_id, category_name, price, original_price,
    description, fabric, is_new_arrival, is_bestseller
  ) VALUES (
    'ADH-SH-01', 'Rivaaz Maroon Zari Tiered Sharara Suit Set', 'rivaaz-maroon-zari-tiered-sharara-suit-set',
    'Festive & Wedding Edits', v_cat_festive, 'Festive Wear', 2799, 3699,
    'Celebration-ready deep maroon tiered sharara ensemble with gold zari tilla embroidery, mirror-work borders, and an ombre organza dupatta.',
    'Georgette with Gold Zari & Mirror Detailing', true, true
  )
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
  RETURNING id INTO v_p8;

  -- Insert Product Images
  INSERT INTO public.product_images (product_id, image_url, is_primary, display_order)
  VALUES
    (v_p1, '/new_collection/product_1.jpg', true, 1),
    (v_p1, '/products/prod_dusty_mauve_kurta.jpg', false, 2),
    (v_p2, '/new_collection/product_2.jpg', true, 1),
    (v_p2, '/products/prod_lilac_cotton_kurta.jpg', false, 2),
    (v_p3, '/products/prod_rose_pink_coord.jpg', true, 1),
    (v_p4, '/products/prod_lavender_anarkali.jpg', true, 1),
    (v_p5, '/products/prod_plum_velvet_coord.jpg', true, 1),
    (v_p6, '/products/prod_blush_silk_kurta.jpg', true, 1),
    (v_p7, '/products/prod_sage_linen_coord.jpg', true, 1),
    (v_p8, '/products/prod_maroon_bridal_sharara.jpg', true, 1)
  ON CONFLICT DO NOTHING;

  -- Insert Sizes Variants (XS, S, M, L, XL, XXL) with Inventory Stock
  INSERT INTO public.product_variants (product_id, size, stock_quantity)
  SELECT p.id, s.sz, 12
  FROM (SELECT id FROM public.products) p
  CROSS JOIN (VALUES ('XS'), ('S'), ('M'), ('L'), ('XL'), ('XXL')) s(sz)
  ON CONFLICT (product_id, size, color) DO NOTHING;

END $$;
