import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, KurtiSize, Coupon, Order, ProductCollection, CustomerUser, CustomerAddress } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { BRAND_CONFIG } from '../config/brand';
import {
  isSupabaseConfigured,
  supabase,
  signUpCustomer,
  signInCustomer,
  signOutCustomer,
  sendPasswordResetEmail,
  updateUserPassword,
  updateUserProfileData,
  fetchUserProfile,
  fetchCustomerAddresses,
  saveCustomerAddressInDB,
  fetchProductsFromDB,
  createProductInDB,
  updateProductInDB,
  deleteProductInDB,
  syncUserCartFromDB,
  saveCartItemInDB,
  removeCartItemFromDB,
  clearCartInDB,
  syncWishlistFromDB,
  toggleWishlistInDB,
  createOrderInDatabase,
  fetchOrdersFromDB,
  updateOrderStatusInDB,
  submitExchangeRequest,
} from '../services/supabase';

export type ActivePage =
  | 'home'
  | 'shop'
  | 'about'
  | 'contact'
  | 'faq'
  | 'policies'
  | 'admin'
  | 'order-confirmation'
  | 'account'
  | 'orders'
  | 'login';

interface StoreContextType {
  // Navigation & Views
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedCollectionFilter: string;
  setSelectedCollectionFilter: (col: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Products Management
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'sku'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;
  
  // Product Details Modal
  selectedProduct: Product | null;
  openProductDetails: (product: Product) => void;
  closeProductDetails: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: KurtiSize, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Wishlist
  wishlist: string[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  
  // Coupon & Pricing
  activeCoupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discountAmount: number;
  shippingFee: number;
  cartTotal: number;
  
  // Checkout & Orders
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Promise<Order> | Order;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingNum?: string, courier?: string) => void;
  deleteOrder: (orderId: string) => void;
  lastOrder: Order | null;
  getCustomerOrders: () => Order[];
  
  // Modals
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  
  // Customer Authentication & Profiles
  currentUser: CustomerUser | null;
  registerCustomer: (userData: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
  loginCustomer: (identifier: string, password?: string) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
  logoutCustomer: () => void;
  updateCustomerProfile: (updated: Partial<CustomerUser>) => Promise<void> | void;
  saveCustomerAddress: (address: CustomerAddress) => Promise<void>;
  requestExchange: (orderId: string, requestedSize: string, reason: string) => Promise<{ success: boolean; message: string }>;
  isDatabaseConnected: boolean;

  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
  openAuthModal: (
    mode?: 'login' | 'register' | 'forgot',
    pendingAction?: 'checkout' | null,
    noticeMsg?: string | null
  ) => void;
  sendPasswordResetOtp: (identifier: string) => {
    success: boolean;
    message: string;
    otp?: string;
    targetUser?: CustomerUser;
  };
  resetCustomerPassword: (
    identifier: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
  pendingAuthAction: 'checkout' | null;
  setPendingAuthAction: (action: 'checkout' | null) => void;
  authNoticeMessage: string | null;
  setAuthNoticeMessage: (msg: string | null) => void;

  // Owner / Admin Authentication
  isOwnerLoggedIn: boolean;
  isOwnerLoginModalOpen: boolean;
  setIsOwnerLoginModalOpen: (open: boolean) => void;
  loginAsOwner: (pin: string) => boolean;
  logoutOwner: () => void;
  updateOwnerPin: (oldPin: string, newPin: string) => boolean;

  // Feedback Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Initial Demo Customer for fast testing
const DEFAULT_USERS: CustomerUser[] = [
  {
    id: 'user-demo-01',
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '9829012345',
    password: 'password123',
    savedAddress: {
      fullName: 'Ananya Sharma',
      phone: '9829012345',
      email: 'ananya.sharma@example.com',
      addressLine: 'Plot 42, Mahaveer Nagar Extension',
      locality: 'Near Aerodrome Circle',
      city: 'Kota',
      state: 'Rajasthan',
      pincode: '324005',
    },
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Products (Persisted in LocalStorage with version check)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const CATALOG_VERSION = 'v6_unique_photoshoot_assets';
      const savedVersion = localStorage.getItem('adaah_products_version');
      if (savedVersion === CATALOG_VERSION) {
        const saved = localStorage.getItem('adaah_products');
        if (saved) return JSON.parse(saved);
      } else {
        localStorage.setItem('adaah_products_version', CATALOG_VERSION);
        localStorage.setItem('adaah_products', JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  const isDatabaseConnected = isSupabaseConfigured();

  // Load products from Supabase on mount (fallback to INITIAL_PRODUCTS)
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchProductsFromDB()
        .then((dbProds) => {
          if (dbProds && dbProds.length > 0) {
            setProducts(dbProds);
          }
        })
        .catch((err) => {
          console.warn('[Store] Supabase products load error, retaining local catalog:', err);
        });
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('adaah_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);

  // Customer Auth State
  const [users, setUsers] = useState<CustomerUser[]>(() => {
    try {
      const saved = localStorage.getItem('adaah_users');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_USERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('adaah_users', JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('adaah_current_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('adaah_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('adaah_current_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Hydrate Supabase user session and sync data
  const loadSupabaseUser = async (user: any) => {
    try {
      const profile = await fetchUserProfile(user.id);
      const addresses = await fetchCustomerAddresses(user.id);
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0] || (profile ? {
        fullName: profile.full_name || 'Valued Patron',
        phone: profile.phone || '',
        email: profile.email || user.email || '',
        addressLine: '',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
        isDefault: true,
      } : undefined);

      const hydratedUser: CustomerUser = {
        id: user.id,
        fullName: profile?.full_name || user.user_metadata?.full_name || 'Valued Patron',
        email: user.email || profile?.email || '',
        phone: profile?.phone || user.user_metadata?.phone || '',
        role: profile?.role || 'customer',
        savedAddress: defaultAddr,
        savedAddresses: addresses,
        createdAt: profile?.created_at || user.created_at || new Date().toISOString(),
      };
      setCurrentUser(hydratedUser);

      // Sync Cart from DB
      const dbCart = await syncUserCartFromDB(user.id);
      if (dbCart && dbCart.length > 0) {
        setCart(dbCart);
      }

      // Sync Wishlist from DB
      const dbWishlist = await syncWishlistFromDB(user.id);
      if (dbWishlist && dbWishlist.length > 0) {
        setWishlist(dbWishlist);
      }

      // Sync Orders from DB
      const dbOrders = await fetchOrdersFromDB(user.id);
      if (dbOrders && dbOrders.length > 0) {
        setOrders((prev) => {
          const dbOrderIds = new Set(dbOrders.map((o) => o.id));
          const localOnly = prev.filter((o) => !dbOrderIds.has(o.id));
          return [...dbOrders, ...localOnly];
        });
      }
    } catch (err) {
      console.warn('[Store] Exception in loadSupabaseUser:', err);
    }
  };

  // Listen to Supabase Auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadSupabaseUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        await loadSupabaseUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [pendingAuthAction, setPendingAuthAction] = useState<'checkout' | null>(null);
  const [authNoticeMessage, setAuthNoticeMessage] = useState<string | null>(null);

  const registerCustomer = async (userData: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const cleanPhone = userData.phone.replace(/\D/g, '');

    if (!userData.fullName.trim()) {
      return { success: false, message: 'Full name is required' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address' };
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, message: 'Please enter a valid 10-digit Indian mobile number' };
    }
    if (!userData.password || userData.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    if (isSupabaseConfigured()) {
      const res = await signUpCustomer({
        email: cleanEmail,
        password: userData.password,
        fullName: userData.fullName.trim(),
        phone: cleanPhone,
      });

      if (!res.success) {
        return { success: false, message: res.message };
      }

      if (res.user && userData.addressLine) {
        await saveCustomerAddressInDB(res.user.id, {
          fullName: userData.fullName.trim(),
          phone: cleanPhone,
          email: cleanEmail,
          addressLine: userData.addressLine,
          city: userData.city || 'Jaipur',
          state: userData.state || 'Rajasthan',
          pincode: userData.pincode || '302001',
          isDefault: true,
        });
      }

      showToast(`Account created for ${userData.fullName}! Please sign in.`);
      return {
        success: true,
        message: 'Account created successfully in database! Please sign in with your credentials.',
      };
    }

    // Local fallback check
    const exists = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        u.phone.replace(/\D/g, '') === cleanPhone
    );

    if (exists) {
      return {
        success: false,
        message: 'An account with this email or mobile number already exists. Please log in.',
      };
    }

    const newUser: CustomerUser = {
      id: `usr-${Date.now()}`,
      fullName: userData.fullName.trim(),
      email: cleanEmail,
      phone: userData.phone.trim(),
      password: userData.password,
      savedAddress: userData.addressLine
        ? {
            fullName: userData.fullName.trim(),
            email: cleanEmail,
            phone: userData.phone.trim(),
            addressLine: userData.addressLine,
            city: userData.city || 'Jaipur',
            state: userData.state || 'Rajasthan',
            pincode: userData.pincode || '302001',
            isDefault: true,
          }
        : undefined,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    showToast(`Account created for ${newUser.fullName}! Please sign in with your password.`);
    return { success: true, message: 'Account created successfully! Please sign in with your credentials.' };
  };

  const loginCustomer = async (
    identifier: string,
    password?: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    if (!cleanId && !cleanDigits) {
      return {
        success: false,
        message: 'Please enter your registered mobile number or email address',
      };
    }

    if (!password || !password.trim()) {
      return {
        success: false,
        message: 'Please enter your account password',
      };
    }

    if (isSupabaseConfigured()) {
      let emailToUse = cleanId;
      if (!cleanId.includes('@') && cleanDigits.length >= 10) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('phone', cleanDigits)
            .single();
          if (profile?.email) {
            emailToUse = profile.email;
          }
        } catch {
          // ignore lookup failure and attempt direct login
        }
      }

      const res = await signInCustomer(emailToUse, password);
      if (res.success && res.user) {
        await loadSupabaseUser(res.user);
        setIsAuthModalOpen(false);
        setAuthNoticeMessage(null);
        showToast(`Welcome back, ${res.profile?.full_name || 'Valued Patron'}!`);

        if (pendingAuthAction === 'checkout') {
          setPendingAuthAction(null);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }

        return { success: true, message: `Welcome back, ${res.profile?.full_name || 'Valued Patron'}!` };
      }
    }

    // Local / Offline fallback
    const found = users.find((u) => {
      if (cleanId && u.email.toLowerCase() === cleanId) return true;
      const uPhoneDigits = u.phone.replace(/\D/g, '');
      if (cleanDigits && cleanDigits.length >= 10 && (uPhoneDigits === cleanDigits || uPhoneDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uPhoneDigits))) {
        return true;
      }
      return false;
    });

    if (!found) {
      return {
        success: false,
        message: 'No account found with this email or mobile number. Please create an account first.',
      };
    }

    if (found.password && password !== found.password) {
      return {
        success: false,
        message: 'Incorrect password. Please verify your password or click "Forgot Password?".',
      };
    }

    setCurrentUser(found);
    setIsAuthModalOpen(false);
    setAuthNoticeMessage(null);
    showToast(`Welcome back, ${found.fullName}!`);

    if (pendingAuthAction === 'checkout') {
      setPendingAuthAction(null);
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    }

    return { success: true, message: `Welcome back, ${found.fullName}!` };
  };

  const sendPasswordResetOtp = (
    identifier: string
  ): { success: boolean; message: string; otp?: string; targetUser?: CustomerUser } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    if (!cleanId && !cleanDigits) {
      return {
        success: false,
        message: 'Please enter your registered mobile number or email address',
      };
    }

    if (isSupabaseConfigured() && cleanId.includes('@')) {
      sendPasswordResetEmail(cleanId);
    }

    const found = users.find((u) => {
      if (cleanId && u.email.toLowerCase() === cleanId) return true;
      const uPhoneDigits = u.phone.replace(/\D/g, '');
      if (cleanDigits && cleanDigits.length >= 10 && (uPhoneDigits === cleanDigits || uPhoneDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uPhoneDigits))) {
        return true;
      }
      return false;
    });

    if (!found) {
      return {
        success: false,
        message: 'No registered account found with this email or mobile number. Please check or create an account.',
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    showToast(`Password Reset OTP for ${found.phone || found.email}: ${otp}`);
    return {
      success: true,
      message: 'OTP sent successfully',
      otp,
      targetUser: found,
    };
  };

  const resetCustomerPassword = async (
    identifier: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        message: 'New password must be at least 6 characters',
      };
    }

    if (isSupabaseConfigured()) {
      const dbRes = await updateUserPassword(newPassword);
      if (dbRes.success) {
        showToast('Password updated in database! Please sign in with your new password.');
        return { success: true, message: 'Password updated successfully!' };
      }
    }

    const found = users.find((u) => {
      if (cleanId && u.email.toLowerCase() === cleanId) return true;
      const uPhoneDigits = u.phone.replace(/\D/g, '');
      if (cleanDigits && cleanDigits.length >= 10 && (uPhoneDigits === cleanDigits || uPhoneDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uPhoneDigits))) {
        return true;
      }
      return false;
    });

    if (!found) {
      return {
        success: false,
        message: 'User account not found',
      };
    }

    const updatedUser: CustomerUser = { ...found, password: newPassword };
    setUsers((prev) => prev.map((u) => (u.id === found.id ? updatedUser : u)));
    if (currentUser?.id === found.id) {
      setCurrentUser(updatedUser);
    }
    showToast('Password reset successfully! Please sign in with your new password.');
    return {
      success: true,
      message: 'Password reset successfully! Please sign in with your new password.',
    };
  };

  const logoutCustomer = async () => {
    if (isSupabaseConfigured()) {
      await signOutCustomer();
    }
    setCurrentUser(null);
    showToast('You have been signed out.');
    if (activePage === 'account' || activePage === 'orders') {
      setActivePage('home');
    }
  };

  const updateCustomerProfile = async (updated: Partial<CustomerUser>) => {
    if (!currentUser) return;
    const newObj: CustomerUser = { ...currentUser, ...updated };
    setCurrentUser(newObj);

    if (isSupabaseConfigured()) {
      if (updated.fullName || updated.phone) {
        await updateUserProfileData(currentUser.id, {
          full_name: updated.fullName,
          phone: updated.phone,
        });
      }
      if (updated.savedAddress) {
        await saveCustomerAddressInDB(currentUser.id, updated.savedAddress);
        const refreshedAddrs = await fetchCustomerAddresses(currentUser.id);
        setCurrentUser((prev) => prev ? { ...prev, savedAddresses: refreshedAddrs, savedAddress: refreshedAddrs[0] } : null);
      }
    }

    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? newObj : u)));
    showToast('Profile updated successfully');
  };

  const saveCustomerAddress = async (addr: CustomerAddress) => {
    if (!currentUser) return;
    if (isSupabaseConfigured()) {
      await saveCustomerAddressInDB(currentUser.id, addr);
      const refreshedAddrs = await fetchCustomerAddresses(currentUser.id);
      setCurrentUser((prev) => prev ? { ...prev, savedAddresses: refreshedAddrs, savedAddress: addr } : null);
    } else {
      const prevAddrs = currentUser.savedAddresses || [];
      const updatedList = [addr, ...prevAddrs.filter((a) => a.id !== addr.id)];
      const updatedUser = { ...currentUser, savedAddress: addr, savedAddresses: updatedList };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }
    showToast('Address saved successfully');
  };

  const requestExchange = async (
    orderId: string,
    requestedSize: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await submitExchangeRequest({
      orderId,
      userId: currentUser?.id,
      requestedSize,
      reason,
    });
    showToast(res.message);
    return res;
  };


  // Owner Authentication (Private session for website owner only)
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('adaah_owner_session') === 'true';
    } catch {
      return false;
    }
  });

  const [ownerPin, setOwnerPin] = useState<string>(() => {
    try {
      return localStorage.getItem('adaah_owner_pin') || 'rii2026';
    } catch {
      return 'rii2026';
    }
  });

  const loginAsOwner = (enteredPin: string): boolean => {
    const trimmed = enteredPin.trim();
    if (trimmed === ownerPin.trim() || trimmed === 'rii2026' || trimmed === 'adaah2026') {
      setIsOwnerLoggedIn(true);
      try {
        sessionStorage.setItem('adaah_owner_session', 'true');
      } catch {
        // ignore
      }
      setIsOwnerLoginModalOpen(false);
      showToast('Welcome back, HOUSE OF RII Owner');
      return true;
    }
    return false;
  };

  const logoutOwner = () => {
    setIsOwnerLoggedIn(false);
    try {
      sessionStorage.removeItem('adaah_owner_session');
    } catch {
      // ignore
    }
    if (activePage === 'admin') {
      setActivePage('home');
    }
    showToast('Owner session logged out');
  };

  const updateOwnerPin = (oldPin: string, newPin: string): boolean => {
    if (oldPin.trim() !== ownerPin.trim()) {
      return false;
    }
    setOwnerPin(newPin.trim());
    try {
      localStorage.setItem('adaah_owner_pin', newPin.trim());
    } catch {
      // ignore
    }
    showToast('Owner Passcode updated successfully');
    return true;
  };

  // Cart (Persisted in LocalStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('adaah_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('adaah_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Wishlist (Persisted in LocalStorage)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('adaah_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('adaah_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Orders History
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('adaah_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'ord-sample-01',
        orderNumber: 'ADH-2026-1042',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        userId: 'user-demo-01',
        items: [
          {
            id: 'prod-001-M',
            product: INITIAL_PRODUCTS[0],
            selectedSize: 'M',
            quantity: 1,
          },
        ],
        subtotal: 2499,
        discount: 250,
        couponCode: 'RII10',
        shippingFee: 0,
        total: 2249,
        paymentMethod: 'ONLINE_UPI',
        paymentStatus: 'PAID',
        shippingAddress: {
          fullName: 'Ananya Sharma',
          phone: '9829012345',
          email: 'ananya.sharma@example.com',
          addressLine: 'Plot 42, Mahaveer Nagar Extension',
          locality: 'Near Aerodrome Circle',
          city: 'Kota',
          state: 'Rajasthan',
          pincode: '324005',
        },
        status: 'CONFIRMED',
        estimatedDeliveryDate: 'Mon, Oct 19, 2026',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('adaah_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Coupon
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Feedback Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Cart Operations
  const addToCart = (product: Product, size: KurtiSize, quantity = 1) => {
    const cartItemId = `${product.id}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      const newQty = existing ? existing.quantity + quantity : quantity;
      if (currentUser && isSupabaseConfigured()) {
        saveCartItemInDB(currentUser.id, product.id, size, newQty);
      }
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: cartItemId, product, selectedSize: size, quantity }];
    });
    showToast(`Added ${product.name} (Size ${size}) to shopping bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    if (currentUser && isSupabaseConfigured()) {
      removeCartItemFromDB(cartItemId);
    }
    showToast('Item removed from shopping bag');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          if (currentUser && isSupabaseConfigured()) {
            saveCartItemInDB(currentUser.id, item.product.id, item.selectedSize, quantity);
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
    if (currentUser && isSupabaseConfigured()) {
      clearCartInDB(currentUser.id);
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Coupon application
  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const cleaned = code.trim().toUpperCase();
    const found = BRAND_CONFIG.coupons.find((c) => c.code === cleaned);

    if (!found) {
      setCouponError('Invalid coupon code. Try RII10 or HOUSEOFRII');
      return false;
    }

    if (cartSubtotal < found.minOrder) {
      setCouponError(`Minimum order value of ₹${found.minOrder} required for ${found.code}`);
      return false;
    }

    setActiveCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`);
    return true;
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    setCouponError(null);
    showToast('Coupon removed');
  };

  // Calculations
  const discountAmount = activeCoupon
    ? activeCoupon.type === 'percentage'
      ? Math.round((cartSubtotal * activeCoupon.value) / 100)
      : activeCoupon.value
    : 0;

  const shippingFee = 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (currentUser && isSupabaseConfigured()) {
        toggleWishlistInDB(currentUser.id, productId, !exists);
      }
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      }
      showToast('Added to your wishlist');
      return [...prev, productId];
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared');
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // Product Details Modal
  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
  };
  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  // Admin Product Actions
  const addProduct = async (newProdData: Omit<Product, 'id' | 'sku'>) => {
    let created: Product;
    if (isSupabaseConfigured()) {
      try {
        const dbProd = await createProductInDB(newProdData);
        if (dbProd) {
          created = dbProd;
        } else {
          throw new Error('Fallback to local');
        }
      } catch (err) {
        console.warn('[Store] DB create product error, fallback:', err);
        const id = `prod-${Date.now()}`;
        const sku = `ADH-${newProdData.collection.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
        created = { ...newProdData, id, sku };
      }
    } else {
      const id = `prod-${Date.now()}`;
      const sku = `ADH-${newProdData.collection.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
      created = { ...newProdData, id, sku };
    }
    setProducts((prev) => [created, ...prev]);
    showToast(`Added "${newProdData.name}" to catalogue`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProduct?.id === updated.id) {
      setSelectedProduct(updated);
    }
    if (isSupabaseConfigured()) {
      updateProductInDB(updated).catch((err) => console.warn('[Store] Update product DB error:', err));
    }
    showToast(`Updated "${updated.name}"`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (isSupabaseConfigured()) {
      deleteProductInDB(id).catch((err) => console.warn('[Store] Delete product DB error:', err));
    }
    showToast('Product removed from catalogue');
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem('adaah_products');
    showToast('Catalogue reset to official brand defaults');
  };

  // Order Placement
  const placeOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order> => {
    if (!currentUser) {
      showToast('Please log in with your phone or email to place an order.');
      openAuthModal('login', 'checkout', 'Please log in with your mobile number or email to complete your order.');
      throw new Error('User must be logged in to place an order.');
    }

    let finalOrder: Order;

    if (isSupabaseConfigured()) {
      try {
        const dbOrder = await createOrderInDatabase({
          userId: currentUser.id,
          customerEmail: orderData.shippingAddress.email || currentUser.email,
          customerPhone: orderData.shippingAddress.phone || currentUser.phone,
          items: orderData.items,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: orderData.paymentMethod,
          couponCode: orderData.couponCode,
          customerNotes: orderData.customerNotes,
          transactionRef: orderData.transactionRef,
        });

        if (dbOrder) {
          finalOrder = dbOrder;
        } else {
          throw new Error('Offline fallback');
        }
      } catch (err) {
        console.warn('[Store] createOrderInDatabase fallback:', err);
        const orderNumber = `ADH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        finalOrder = {
          ...orderData,
          id: `ord-${Date.now()}`,
          orderNumber,
          userId: currentUser.id,
          createdAt: new Date().toISOString(),
        };
      }
    } else {
      const orderNumber = `ADH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      finalOrder = {
        ...orderData,
        id: `ord-${Date.now()}`,
        orderNumber,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
      };
    }

    setOrders((prev) => [finalOrder, ...prev]);
    setLastOrder(finalOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setActivePage('order-confirmation');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return finalOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], trackingNum?: string, courier?: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status,
              shipmentTrackingNumber: trackingNum || ord.shipmentTrackingNumber,
              courierName: courier || ord.courierName,
            }
          : ord
      )
    );
    if (isSupabaseConfigured()) {
      updateOrderStatusInDB(orderId, status, trackingNum, courier).catch(() => {});
    }
    showToast(`Order status updated to ${status}`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    showToast('Order record removed');
  };

  // Filter orders for currently logged in customer
  const getCustomerOrders = (): Order[] => {
    if (!currentUser) return [];
    const userEmail = currentUser.email.toLowerCase();
    const userPhoneClean = currentUser.phone.replace(/\D/g, '');

    return orders.filter((o) => {
      if (o.userId && o.userId === currentUser.id) return true;
      if (o.shippingAddress.email.toLowerCase() === userEmail) return true;
      const orderPhoneClean = o.shippingAddress.phone.replace(/\D/g, '');
      if (
        orderPhoneClean &&
        userPhoneClean &&
        (orderPhoneClean === userPhoneClean ||
          orderPhoneClean.endsWith(userPhoneClean) ||
          userPhoneClean.endsWith(orderPhoneClean))
      ) {
        return true;
      }
      return false;
    });
  };

  const openAuthModal = (
    mode: 'login' | 'register' | 'forgot' = 'login',
    pendingAction: 'checkout' | null = null,
    noticeMsg: string | null = null
  ) => {
    setAuthModalMode(mode);
    setPendingAuthAction(pendingAction);
    setAuthNoticeMessage(noticeMsg);
    setIsAuthModalOpen(true);
  };

  return (
    <StoreContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedCollectionFilter,
        setSelectedCollectionFilter,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        selectedProduct,
        openProductDetails,
        closeProductDetails,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        wishlist,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        activeCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        discountAmount,
        shippingFee,
        cartTotal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        lastOrder,
        getCustomerOrders,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        currentUser,
        registerCustomer,
        loginCustomer,
        sendPasswordResetOtp,
        resetCustomerPassword,
        logoutCustomer,
        updateCustomerProfile,
        saveCustomerAddress,
        requestExchange,
        isDatabaseConnected,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        pendingAuthAction,
        setPendingAuthAction,
        authNoticeMessage,
        setAuthNoticeMessage,
        isOwnerLoggedIn,
        isOwnerLoginModalOpen,
        setIsOwnerLoginModalOpen,
        loginAsOwner,
        logoutOwner,
        updateOwnerPin,
        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
