import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, KurtiSize, CartItem, CustomerAddress, Order, Coupon } from '../types';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder')
  );
};

// Initialize Supabase client
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// ============================================================================
// 1. AUTHENTICATION & CUSTOMER PROFILES
// ============================================================================

export interface ProfileRecord {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export const getCurrentSession = async () => {
  if (!isSupabaseConfigured()) return null;
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session;
};

export const fetchUserProfile = async (userId: string): Promise<ProfileRecord | null> => {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.warn('[Supabase] Failed to fetch profile:', error.message);
    return null;
  }
  return data as ProfileRecord;
};

export const signUpCustomer = async (data: {
  email: string;
  password?: string;
  fullName: string;
  phone: string;
}) => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase credentials are not configured in .env. Please see .env.example.',
    };
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email.trim().toLowerCase(),
    password: data.password || 'TemporaryPass@2026',
    options: {
      data: {
        full_name: data.fullName,
        phone: data.phone,
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    user: authData.user,
    session: authData.session,
    message: 'Account created successfully! Welcome to HOUSE OF RII.',
  };
};

export const signInCustomer = async (email: string, password?: string) => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase credentials are not configured in .env. Please see .env.example.',
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: password || '',
  });

  if (error) {
    return { success: false, message: error.message };
  }

  const profile = await fetchUserProfile(data.user.id);
  return {
    success: true,
    user: data.user,
    session: data.session,
    profile,
    message: 'Signed in successfully!',
  };
};

export const signOutCustomer = async () => {
  if (!isSupabaseConfigured()) return;
  await supabase.auth.signOut();
};

export const sendPasswordResetEmail = async (email: string) => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Database not configured. Check .env.example.',
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${window.location.origin}#account`,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: 'Password reset link dispatched to your email address.',
  };
};

export const updateUserPassword = async (newPassword: string) => {
  if (!isSupabaseConfigured()) return { success: false, message: 'Database not connected' };
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { success: false, message: error.message };
  return { success: true, message: 'Password updated successfully!' };
};

export const updateUserProfileData = async (userId: string, updates: Partial<ProfileRecord>) => {
  if (!isSupabaseConfigured()) return { success: false, message: 'Database not connected' };
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) return { success: false, message: error.message };
  return { success: true, message: 'Profile updated successfully!' };
};

// ============================================================================
// 2. SAVED CUSTOMER ADDRESSES
// ============================================================================

export const fetchCustomerAddresses = async (userId: string): Promise<CustomerAddress[]> => {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });

  if (error) {
    console.warn('[Supabase] Failed to fetch addresses:', error.message);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    addressLine: row.address_line,
    locality: row.locality,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    isDefault: row.is_default,
  }));
};

export const saveCustomerAddressInDB = async (userId: string, address: CustomerAddress) => {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from('addresses')
    .insert({
      user_id: userId,
      full_name: address.fullName,
      phone: address.phone,
      email: address.email,
      address_line: address.addressLine,
      locality: address.locality || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      is_default: true,
    })
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Failed to save address:', error.message);
    return null;
  }
  return data;
};

// ============================================================================
// 3. PRODUCT CATALOGUE & VARIANTS
// ============================================================================

export const fetchProductsFromDB = async (): Promise<Product[] | null> => {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(image_url, is_primary, display_order),
        variants:product_variants(size, color, stock_quantity)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error || !dbProducts || dbProducts.length === 0) {
      if (error) console.warn('[Supabase] Products query error:', error.message);
      return null;
    }

    return dbProducts.map((p: any): Product => {
      // Sort images by display_order
      const sortedImages = (p.images || [])
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((img: any) => img.image_url);

      const sizes: KurtiSize[] = (p.variants || [])
        .map((v: any) => v.size as KurtiSize)
        .filter((v: any, idx: number, arr: any[]) => arr.indexOf(v) === idx);

      const totalStock = (p.variants || []).reduce((acc: number, v: any) => acc + (v.stock_quantity || 0), 0);

      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        collection: p.collection,
        category: p.category_name,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        images: sortedImages.length > 0 ? sortedImages : ['/about_col_kurti_sets_hd.jpg'],
        description: p.description,
        fabric: p.fabric,
        sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL', 'XXL'],
        measurements: p.measurements && Object.keys(p.measurements).length > 0 ? p.measurements : {
          S: { bust: '36"', waist: '32"', hip: '38"', length: '44"', shoulder: '14.5"' },
          M: { bust: '38"', waist: '34"', hip: '40"', length: '44"', shoulder: '15"' },
          L: { bust: '40"', waist: '36"', hip: '42"', length: '44.5"', shoulder: '15.5"' },
          XL: { bust: '42"', waist: '38"', hip: '44"', length: '45"', shoulder: '16"' },
          XXL: { bust: '44"', waist: '40"', hip: '46"', length: '45"', shoulder: '16.5"' },
        },
        colors: ['Multi / Classic'],
        careInstructions: Array.isArray(p.care_instructions) ? p.care_instructions : [
          'Gentle hand wash cold with mild detergent',
          'Line dry in shade',
          'Iron on low heat on reverse',
        ],
        inStock: p.in_stock && totalStock > 0,
        inventoryCount: totalStock,
        isNewArrival: p.is_new_arrival,
        isBestseller: p.is_bestseller,
        status: p.status,
        specifications: p.specifications || {
          weave: 'Handpicked Quality Weave',
          pattern: 'Embroidered / Printed',
          neckline: 'Comfort Traditional Neck',
          sleeves: 'Three-Quarter Sleeves',
          fit: 'Standard Indian Ethnic Fit',
        },
      };
    });
  } catch (err) {
    console.warn('[Supabase] Exception fetching products:', err);
    return null;
  }
};

export const createProductInDB = async (productData: Omit<Product, 'id' | 'sku'>): Promise<Product | null> => {
  if (!isSupabaseConfigured()) return null;

  const sku = 'RII-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Insert product record
  const { data: p, error } = await supabase
    .from('products')
    .insert({
      sku,
      name: productData.name,
      slug,
      collection: productData.collection,
      category_name: productData.category,
      price: productData.price,
      original_price: productData.originalPrice || null,
      description: productData.description,
      fabric: productData.fabric,
      in_stock: productData.inStock,
      status: productData.status || 'active',
      is_new_arrival: productData.isNewArrival || false,
      is_bestseller: productData.isBestseller || false,
      specifications: productData.specifications,
      care_instructions: productData.careInstructions,
      measurements: productData.measurements,
    })
    .select()
    .single();

  if (error || !p) {
    console.error('[Supabase] Create product failed:', error?.message);
    throw new Error(error?.message || 'Failed to create product');
  }

  // Insert images
  if (productData.images && productData.images.length > 0) {
    const imagesToInsert = productData.images.map((imgUrl, idx) => ({
      product_id: p.id,
      image_url: imgUrl,
      is_primary: idx === 0,
      display_order: idx + 1,
    }));
    await supabase.from('product_images').insert(imagesToInsert);
  }

  // Insert variants
  const variantsToInsert = (productData.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((sz) => ({
    product_id: p.id,
    size: sz,
    color: 'Classic',
    stock_quantity: Math.max(1, Math.floor(productData.inventoryCount / (productData.sizes.length || 1))),
  }));
  await supabase.from('product_variants').insert(variantsToInsert);

  return {
    ...productData,
    id: p.id,
    sku,
    slug,
  };
};

export const updateProductInDB = async (product: Product): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  const { error } = await supabase
    .from('products')
    .update({
      name: product.name,
      slug: product.slug,
      collection: product.collection,
      category_name: product.category,
      price: product.price,
      original_price: product.originalPrice || null,
      description: product.description,
      fabric: product.fabric,
      in_stock: product.inStock,
      status: product.status,
      is_new_arrival: product.isNewArrival,
      is_bestseller: product.isBestseller,
      specifications: product.specifications,
      updated_at: new Date().toISOString(),
    })
    .eq('id', product.id);

  if (error) {
    console.error('[Supabase] Update product failed:', error.message);
    return false;
  }

  // Update images
  if (product.images && product.images.length > 0) {
    await supabase.from('product_images').delete().eq('product_id', product.id);
    const imagesToInsert = product.images.map((imgUrl, idx) => ({
      product_id: product.id,
      image_url: imgUrl,
      is_primary: idx === 0,
      display_order: idx + 1,
    }));
    await supabase.from('product_images').insert(imagesToInsert);
  }

  return true;
};

export const deleteProductInDB = async (productId: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);
  return !error;
};

// ============================================================================
// 4. PERSISTENT SHOPPING CART & WISHLIST
// ============================================================================

export const syncUserCartFromDB = async (userId: string): Promise<CartItem[]> => {
  if (!isSupabaseConfigured()) return [];

  // Get or create cart for user
  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!cart) {
    const { data: newCart } = await supabase
      .from('carts')
      .insert({ user_id: userId })
      .select('id')
      .single();
    cart = newCart;
  }

  if (!cart) return [];

  const { data: items } = await supabase
    .from('cart_items')
    .select(`
      id,
      size,
      quantity,
      product:products(
        id, sku, name, slug, collection, category_name, price, original_price,
        description, fabric, in_stock, status, is_new_arrival, is_bestseller,
        images:product_images(image_url, display_order)
      )
    `)
    .eq('cart_id', cart.id);

  if (!items) return [];

  return items.map((row: any) => {
    const p = row.product;
    const sortedImages = (p?.images || [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((img: any) => img.image_url);

    return {
      id: row.id,
      selectedSize: row.size as KurtiSize,
      quantity: row.quantity,
      product: {
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        collection: p.collection,
        category: p.category_name,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        images: sortedImages.length > 0 ? sortedImages : ['/about_col_kurti_sets_hd.jpg'],
        description: p.description,
        fabric: p.fabric,
        sizes: [row.size as KurtiSize],
        measurements: {} as any,
        colors: ['Classic'],
        careInstructions: [],
        inStock: p.in_stock,
        inventoryCount: 15,
        status: p.status,
        specifications: {} as any,
      },
    };
  });
};

export const saveCartItemInDB = async (userId: string, productId: string, size: KurtiSize, quantity: number) => {
  if (!isSupabaseConfigured()) return;

  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!cart) {
    const { data: newCart } = await supabase
      .from('carts')
      .insert({ user_id: userId })
      .select('id')
      .single();
    cart = newCart;
  }

  if (!cart) return;

  await supabase
    .from('cart_items')
    .upsert({
      cart_id: cart.id,
      product_id: productId,
      size,
      quantity,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'cart_id,product_id,size' });
};

export const removeCartItemFromDB = async (cartItemId: string) => {
  if (!isSupabaseConfigured()) return;
  await supabase.from('cart_items').delete().eq('id', cartItemId);
};

export const clearCartInDB = async (userId: string) => {
  if (!isSupabaseConfigured()) return;
  try {
    const { data: cart } = await supabase.from('carts').select('id').eq('user_id', userId).single();
    if (cart) {
      await supabase.from('cart_items').delete().eq('cart_id', cart.id);
    }
  } catch (err) {
    console.warn('[Supabase] Failed to clear cart:', err);
  }
};

// Wishlist DB Sync
export const syncWishlistFromDB = async (userId: string): Promise<string[]> => {
  if (!isSupabaseConfigured()) return [];

  let { data: wl } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!wl) {
    const { data: newWl } = await supabase
      .from('wishlists')
      .insert({ user_id: userId })
      .select('id')
      .single();
    wl = newWl;
  }

  if (!wl) return [];

  const { data: items } = await supabase
    .from('wishlist_items')
    .select('product_id')
    .eq('wishlist_id', wl.id);

  return (items || []).map((row: any) => row.product_id);
};

export const toggleWishlistInDB = async (userId: string, productId: string, shouldAdd: boolean) => {
  if (!isSupabaseConfigured()) return;

  let { data: wl } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!wl) {
    const { data: newWl } = await supabase
      .from('wishlists')
      .insert({ user_id: userId })
      .select('id')
      .single();
    wl = newWl;
  }

  if (!wl) return;

  if (shouldAdd) {
    await supabase.from('wishlist_items').insert({ wishlist_id: wl.id, product_id: productId });
  } else {
    await supabase.from('wishlist_items').delete().eq('wishlist_id', wl.id).eq('product_id', productId);
  }
};

// ============================================================================
// 5. ATOMIC ORDER CREATION & MANAGEMENT
// ============================================================================

export const createOrderInDatabase = async (params: {
  userId?: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  shippingAddress: CustomerAddress;
  paymentMethod: string;
  couponCode?: string;
  customerNotes?: string;
  transactionRef?: string;
}): Promise<Order | null> => {
  if (!isSupabaseConfigured()) {
    return null; // Fallback to client generator if DB is not connected
  }

  try {
    const rpcPayload = {
      p_user_id: params.userId || null,
      p_customer_email: params.customerEmail,
      p_customer_phone: params.customerPhone,
      p_items: params.items.map((it) => ({
        product_id: it.product.id,
        size: it.selectedSize,
        quantity: it.quantity,
        image_url: it.product.images[0] || '',
      })),
      p_shipping_address: params.shippingAddress,
      p_payment_method: params.paymentMethod,
      p_coupon_code: params.couponCode || null,
      p_customer_notes: params.customerNotes || null,
      p_transaction_ref: params.transactionRef || null,
    };

    const { data, error } = await supabase.rpc('create_order_atomic', rpcPayload);

    if (error) {
      console.error('[Supabase] create_order_atomic error:', error.message);
      throw new Error(error.message);
    }

    if (!data || !data.success) {
      throw new Error(data?.message || 'Failed to place order in database');
    }

    // Build hydrated Order model
    return {
      id: data.order_id,
      orderNumber: data.order_number,
      createdAt: new Date().toISOString(),
      userId: params.userId,
      items: params.items,
      subtotal: Number(data.subtotal),
      discount: Number(data.discount),
      couponCode: params.couponCode,
      shippingFee: Number(data.shipping_fee),
      total: Number(data.total),
      paymentMethod: params.paymentMethod as any,
      paymentStatus: params.paymentMethod === 'COD' ? 'PENDING_COD' : 'PAID',
      transactionRef: params.transactionRef,
      shippingAddress: params.shippingAddress,
      status: 'CONFIRMED',
      estimatedDeliveryDate: data.estimated_delivery,
    };
  } catch (err: any) {
    console.error('[Supabase] Exception in createOrderInDatabase:', err);
    throw err;
  }
};

export const fetchOrdersFromDB = async (userId?: string): Promise<Order[]> => {
  if (!isSupabaseConfigured()) return [];

  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items:order_items(*)
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data: dbOrders, error } = await query;

  if (error || !dbOrders) {
    console.warn('[Supabase] Orders query error:', error?.message);
    return [];
  }

  return dbOrders.map((ord: any): Order => ({
    id: ord.id,
    orderNumber: ord.order_number,
    createdAt: ord.created_at,
    userId: ord.user_id,
    items: (ord.order_items || []).map((it: any) => ({
      id: it.id,
      selectedSize: it.size as KurtiSize,
      quantity: it.quantity,
      product: {
        id: it.product_id || it.id,
        sku: it.sku || 'RII-LEGACY',
        name: it.product_name,
        slug: it.product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        collection: 'Everyday Wear',
        category: 'Kurti Sets',
        price: Number(it.unit_price),
        images: it.image_url ? [it.image_url] : ['/about_col_kurti_sets_hd.jpg'],
        description: '',
        fabric: 'Pure Cotton Mulmul',
        sizes: [it.size as KurtiSize],
        measurements: {} as any,
        colors: ['Classic'],
        careInstructions: [],
        inStock: true,
        inventoryCount: 10,
        status: 'active',
        specifications: {} as any,
      },
    })),
    subtotal: Number(ord.subtotal),
    discount: Number(ord.discount || 0),
    couponCode: ord.coupon_code,
    shippingFee: Number(ord.shipping_fee || 0),
    total: Number(ord.total),
    paymentMethod: ord.payment_method,
    paymentStatus: ord.payment_status === 'PAID' ? 'PAID' : 'PENDING_COD',
    transactionRef: ord.transaction_ref,
    shippingAddress: ord.shipping_address_snapshot as CustomerAddress,
    status: ord.status === 'Cancelled' ? 'CONFIRMED' : (ord.status.toUpperCase() as any),
    estimatedDeliveryDate: ord.estimated_delivery_date || 'Within 4-5 business days',
  }));
};

export const updateOrderStatusInDB = async (orderId: string, status: string, trackingNumber?: string, courier?: string) => {
  if (!isSupabaseConfigured()) return false;
  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (trackingNumber) updates.shipment_tracking_number = trackingNumber;
  if (courier) updates.courier_name = courier;

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  return !error;
};

// ============================================================================
// 6. EXCHANGE REQUEST WORKFLOW (7-DAY EXCHANGE POLICY)
// ============================================================================

export const submitExchangeRequest = async (data: {
  orderId: string;
  userId?: string;
  requestedSize: string;
  reason: string;
  supportingImages?: string[];
}) => {
  if (!isSupabaseConfigured()) {
    return { success: true, message: 'Exchange request submitted successfully (Offline demo mode).' };
  }

  const { error } = await supabase
    .from('exchange_requests')
    .insert({
      order_id: data.orderId,
      user_id: data.userId || null,
      requested_size: data.requestedSize,
      reason: data.reason,
      supporting_images: data.supportingImages || [],
      status: 'pending',
    });

  if (error) return { success: false, message: error.message };
  return { success: true, message: 'Your exchange request has been logged. Our Jaipur studio team will contact you within 24 hours.' };
};

export const fetchExchangeRequests = async () => {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('exchange_requests')
    .select(`
      *,
      order:orders(order_number, customer_email, customer_phone, total, created_at)
    `)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
};

export const updateExchangeStatus = async (requestId: string, status: 'approved' | 'rejected' | 'completed', adminNotes?: string) => {
  if (!isSupabaseConfigured()) return false;
  const { error } = await supabase
    .from('exchange_requests')
    .update({
      status,
      admin_notes: adminNotes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  return !error;
};

// ============================================================================
// 7. COUPONS, REVIEWS, CONTACT & NEWSLETTER
// ============================================================================

export const fetchActiveCoupons = async (): Promise<Coupon[]> => {
  if (!isSupabaseConfigured()) return [];
  const { data } = await supabase
    .from('coupons')
    .select('*')
    .eq('is_active', true);

  return (data || []).map((c: any) => ({
    code: c.code,
    description: c.description,
    type: c.type,
    value: Number(c.value),
    minOrder: Number(c.min_order_amount),
  }));
};

export const submitContactMessage = async (msg: {
  name: string;
  email: string;
  phone?: string;
  orderNumber?: string;
  message: string;
}) => {
  if (!isSupabaseConfigured()) return { success: true };
  const { error } = await supabase.from('contact_messages').insert(msg);
  return { success: !error };
};

export const subscribeNewsletter = async (email: string) => {
  if (!isSupabaseConfigured()) return { success: true };
  const { error } = await supabase.from('newsletter_subscriptions').insert({ email: email.trim().toLowerCase() });
  return { success: !error };
};
