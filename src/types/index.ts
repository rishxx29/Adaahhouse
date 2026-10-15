export type KurtiSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface GarmentMeasurements {
  bust: string;
  waist: string;
  hip: string;
  length: string;
  shoulder?: string;
}

export type ProductCollection = 'Everyday Elegance' | 'Festive Edit' | 'Office & College Wear';

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  collection: ProductCollection;
  category: 'Kurti Set' | 'Straight Kurti' | 'Anarkali Kurti' | 'Co-ord Set';
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  fabric: string;
  sizes: KurtiSize[];
  measurements: Record<KurtiSize, GarmentMeasurements>;
  colors: string[];
  careInstructions: string[];
  inStock: boolean;
  inventoryCount: number;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  status: 'active' | 'draft' | 'archived';
  specifications: {
    weave: string;
    pattern: string;
    neckline: string;
    sleeves: string;
    fit: string;
  };
}

export interface CartItem {
  id: string; // unique cart item id (product.id + size)
  product: Product;
  selectedSize: KurtiSize;
  quantity: number;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  savedAddress?: CustomerAddress;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: 'ONLINE_UPI' | 'ONLINE_CARD' | 'COD';
  paymentStatus: 'PAID' | 'PENDING_COD';
  transactionRef?: string;
  receiverUpi?: string;
  shippingAddress: CustomerAddress;
  status: 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED';
  estimatedDeliveryDate: string;
}

export interface Coupon {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
}

