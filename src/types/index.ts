export type KurtiSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface GarmentMeasurements {
  bust: string;
  waist: string;
  hip: string;
  length: string;
  shoulder?: string;
}

export type ProductCollection =
  | 'Everyday Wear'
  | 'Festive & Wedding Edits'
  | 'Everyday Elegance'
  | 'Festive Edit'
  | 'Office & College Wear';

export type ProductCategory =
  | 'Kurti Set'
  | 'Bottom Wear'
  | 'Coord Set'
  | 'Suit Sets'
  | 'Kurta Sets'
  | 'Coord Sets'
  | 'Sharara Sets'
  | 'Co-ord Set'
  | 'Straight Kurti'
  | 'Anarkali Kurti';

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  collection: ProductCollection;
  category: ProductCategory;
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
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  isDefault?: boolean;
  deliveryInstructions?: string;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role?: 'customer' | 'admin';
  savedAddress?: CustomerAddress;
  savedAddresses?: CustomerAddress[];
  createdAt: string;
}

export type OrderStatusType =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'CONFIRMED'
  | 'DISPATCHED'
  | 'DELIVERED';

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
  paymentMethod: 'ONLINE_UPI' | 'ONLINE_CARD' | 'COD' | 'ONLINE_RAZORPAY';
  paymentStatus: 'PAID' | 'PENDING_COD' | 'FAILED' | 'REFUNDED';
  transactionRef?: string;
  receiverUpi?: string;
  shippingAddress: CustomerAddress;
  status: OrderStatusType;
  shipmentTrackingNumber?: string;
  courierName?: string;
  customerNotes?: string;
  adminNotes?: string;
  estimatedDeliveryDate: string;
}

export interface Coupon {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
}

export interface ExchangeRequest {
  id: string;
  orderId: string;
  orderNumber?: string;
  userId?: string;
  customerEmail?: string;
  customerPhone?: string;
  requestedSize: string;
  reason: string;
  supportingImages?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminNotes?: string;
  createdAt: string;
}

