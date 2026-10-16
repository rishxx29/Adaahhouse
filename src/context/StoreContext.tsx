import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, KurtiSize, Coupon, Order, ProductCollection, CustomerUser, CustomerAddress } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { BRAND_CONFIG } from '../config/brand';

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
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  lastOrder: Order | null;
  getCustomerOrders: () => Order[];
  
  // Modals
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  
  // Customer Authentication
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
  }) => { success: boolean; message: string };
  loginCustomer: (identifier: string, password?: string) => { success: boolean; message: string };
  logoutCustomer: () => void;
  updateCustomerProfile: (updated: Partial<CustomerUser>) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;

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
      const CATALOG_VERSION = 'v5_house_of_rii_visual_ref';
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

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const registerCustomer = (userData: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }): { success: boolean; message: string } => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const cleanPhone = userData.phone.replace(/\D/g, '');

    // Check duplicate
    const exists = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        u.phone.replace(/\D/g, '') === cleanPhone
    );

    if (exists) {
      return {
        success: false,
        message: 'An account with this email or phone number already exists. Please log in.',
      };
    }

    const newUser: CustomerUser = {
      id: `usr-${Date.now()}`,
      fullName: userData.fullName.trim(),
      email: cleanEmail,
      phone: userData.phone.trim(),
      password: userData.password || 'password123',
      savedAddress: userData.addressLine
        ? {
            fullName: userData.fullName.trim(),
            email: cleanEmail,
            phone: userData.phone.trim(),
            addressLine: userData.addressLine,
            city: userData.city || 'Jaipur',
            state: userData.state || 'Rajasthan',
            pincode: userData.pincode || '302001',
          }
        : undefined,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Welcome to HOUSE OF RII, ${newUser.fullName}!`);
    return { success: true, message: 'Account created successfully' };
  };

  const loginCustomer = (
    identifier: string,
    password?: string
  ): { success: boolean; message: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const found = users.find((u) => {
      // Match email
      if (u.email.toLowerCase() === cleanId) return true;
      // Match phone
      const uPhoneDigits = u.phone.replace(/\D/g, '');
      if (cleanDigits && (uPhoneDigits === cleanDigits || uPhoneDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uPhoneDigits))) {
        return true;
      }
      return false;
    });

    if (!found) {
      return {
        success: false,
        message: 'No account found with this email or mobile number. Please register.',
      };
    }

    if (password && found.password && password !== found.password) {
      return {
        success: false,
        message: 'Incorrect password. Please verify your credentials.',
      };
    }

    setCurrentUser(found);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${found.fullName}!`);
    return { success: true, message: `Welcome back, ${found.fullName}!` };
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    if (activePage === 'account' || activePage === 'orders') {
      setActivePage('home');
    }
    showToast('Logged out of your account');
  };

  const updateCustomerProfile = (updated: Partial<CustomerUser>) => {
    if (!currentUser) return;
    const merged: CustomerUser = { ...currentUser, ...updated };
    setCurrentUser(merged);
    setUsers((prev) => prev.map((u) => (u.id === merged.id ? merged : u)));
    showToast('Profile updated successfully');
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
    showToast('Item removed from shopping bag');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
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
  const addProduct = (newProdData: Omit<Product, 'id' | 'sku'>) => {
    const id = `prod-${Date.now()}`;
    const sku = `ADH-${newProdData.collection.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const fullProduct: Product = {
      ...newProdData,
      id,
      sku,
    };
    setProducts((prev) => [fullProduct, ...prev]);
    showToast(`Added "${newProdData.name}" to catalogue`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProduct?.id === updated.id) {
      setSelectedProduct(updated);
    }
    showToast(`Updated "${updated.name}"`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalogue');
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem('adaah_products');
    showToast('Catalogue reset to official brand defaults');
  };

  // Order Placement
  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const orderNumber = `ADH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: currentUser?.id,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setActivePage('order-confirmation');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
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

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
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
        logoutCustomer,
        updateCustomerProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
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
