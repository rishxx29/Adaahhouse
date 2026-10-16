import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Upload,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  KeyRound,
  LogOut,
  Key,
  Package,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Printer,
  MessageCircle,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, KurtiSize, ProductCollection, Order } from '../types';
import { STANDARD_MEASUREMENTS, BRAND_CONFIG } from '../config/brand';
import {
  sendOrderEmails,
  getOwnerMailtoUrl,
  getCustomerMailtoUrl,
  getCustomerWhatsAppUrl,
} from '../services/notificationService';

const ALL_SIZES: KurtiSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const AdminProductManager: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    openProductDetails,
    setActivePage,
    isOwnerLoggedIn,
    loginAsOwner,
    logoutOwner,
    updateOwnerPin,
    orders,
    updateOrderStatus,
    deleteOrder,
    showToast,
  } = useStore();


  // Studio Active Tab: 'orders' or 'catalog'
  const [activeStudioTab, setActiveStudioTab] = useState<'orders' | 'catalog'>('orders');

  // Orders Filter & Search State
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED'>('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Authentication gate state
  const [adminIdentifier, setAdminIdentifier] = useState('aadahhouse@gmail.com');
  const [gatePasscode, setGatePasscode] = useState('');
  const [showGatePasscode, setShowGatePasscode] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);

  // Change PIN modal state
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [changePinError, setChangePinError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [collection, setCollection] = useState<ProductCollection>('Everyday Elegance');
  const [category, setCategory] = useState<Product['category']>('Kurti Set');
  const [price, setPrice] = useState<number>(1499);
  const [originalPrice, setOriginalPrice] = useState<number>(1999);
  const [fabric, setFabric] = useState('Pure Chanderi Silk Blend');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<KurtiSize[]>(['S', 'M', 'L', 'XL', 'XXL']);
  const [inStock, setInStock] = useState(true);
  const [inventoryCount, setInventoryCount] = useState(15);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setCollection('Everyday Elegance');
    setCategory('Kurti Set');
    setPrice(1499);
    setOriginalPrice(1999);
    setFabric('Pure Chanderi Silk Blend');
    setDescription('');
    setImages([]);
    setNewImageUrl('');
    setSelectedSizes(['S', 'M', 'L', 'XL', 'XXL']);
    setInStock(true);
    setInventoryCount(15);
    setIsNewArrival(false);
    setIsBestseller(false);
  };

  const handleStartEdit = (product: Product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setName(product.name);
    setCollection(product.collection);
    setCategory(product.category);
    setPrice(product.price);
    setOriginalPrice(product.originalPrice || product.price);
    setFabric(product.fabric);
    setDescription(product.description);
    setImages([...product.images]);
    setSelectedSizes([...product.sizes]);
    setInStock(product.inStock);
    setInventoryCount(product.inventoryCount);
    setIsNewArrival(!!product.isNewArrival);
    setIsBestseller(!!product.isBestseller);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNew = () => {
    resetForm();
    setIsEditing(true);
    setEditingId(null);
  };

  // Add image via URL
  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  // Add image via local file selection (reads as Base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    // reset input
    e.target.value = '';
  };

  // Remove specific image
  const handleRemoveImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  // Toggle size checkbox
  const handleToggleSize = (size: KurtiSize) => {
    if (selectedSizes.includes(size)) {
      if (selectedSizes.length === 1) {
        alert('A kurti must have at least one available size');
        return;
      }
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a product name');
      return;
    }
    if (images.length === 0) {
      alert('Please add at least one image of the kurti');
      return;
    }
    if (selectedSizes.length === 0) {
      alert('Please select at least one kurti size');
      return;
    }
    if (price < 1) {
      alert('Retail price must be at least ₹1');
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');


    if (editingId) {
      const existing = products.find((p) => p.id === editingId);
      if (existing) {
        const updated: Product = {
          ...existing,
          name,
          slug,
          collection,
          category,
          price,
          originalPrice,
          fabric,
          description,
          images,
          sizes: selectedSizes,
          inStock,
          inventoryCount,
          isNewArrival,
          isBestseller,
        };
        updateProduct(updated);
      }
    } else {
      addProduct({
        name,
        slug,
        collection,
        category,
        price,
        originalPrice,
        fabric,
        description: description || `Graceful ${name} curated in premium ${fabric}.`,
        images,
        sizes: selectedSizes,
        measurements: STANDARD_MEASUREMENTS,
        colors: ['Multi / Classic'],
        careInstructions: [
          'Gentle hand wash cold with mild detergent',
          'Line dry in shade',
          'Iron on low heat on reverse',
        ],
        inStock,
        inventoryCount,
        isNewArrival,
        isBestseller,
        status: 'active',
        specifications: {
          weave: 'Handpicked Quality Weave',
          pattern: 'Embroidered / Printed',
          neckline: 'Comfort Traditional Neck',
          sleeves: 'Three-Quarter Sleeves',
          fit: 'Standard Indian Ethnic Fit',
        },
      });
    }

    resetForm();
  };

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGateError(null);
    const success = loginAsOwner(gatePasscode);
    if (!success) {
      setGateError('Incorrect owner passcode. Access denied.');
    } else {
      setGatePasscode('');
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinError(null);
    if (!currentPinInput.trim() || !newPinInput.trim()) {
      setChangePinError('Both fields are required');
      return;
    }
    const success = updateOwnerPin(currentPinInput, newPinInput);
    if (!success) {
      setChangePinError('Current passcode is incorrect');
    } else {
      setIsChangingPin(false);
      setCurrentPinInput('');
      setNewPinInput('');
    }
  };

  // If not authenticated as owner, display the dedicated Admin & Owner Login Portal
  if (!isOwnerLoggedIn) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16 animate-in fade-in duration-300">
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8C5A7D]/10 border border-[#D5C2D7] text-[#8C5A7D] text-xs font-semibold uppercase tracking-widest rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8C5A7D]" />
            <span>HOUSE OF RII · Owner Studio & Management</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#554052]">
            Store Administration & Operations
          </h1>
          <p className="text-xs sm:text-sm text-[#A185A4] leading-relaxed">
            Welcome to the centralized operations studio. Log in to manage incoming customer orders, update ethnic wear collections, inspect UPI payments, and review notifications.
          </p>
        </div>

        {/* Centered Owner Sign In Card */}
        <div className="max-w-md mx-auto bg-white border border-[#D5C2D7] shadow-md overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#8C5A7D] text-[#F6F0F4] flex items-center justify-center shadow-xs shrink-0">
              <Lock className="w-5 h-5 text-[#D5C2D7]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#554052]">Owner Sign In</h2>
              <p className="text-[11px] text-[#A185A4]">Enter your credentials to enter Studio</p>
            </div>
          </div>

          <form onSubmit={handleGateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#554052] mb-1">
                Official Admin Email / User ID
              </label>
              <input
                type="text"
                value={adminIdentifier}
                onChange={(e) => setAdminIdentifier(e.target.value)}
                placeholder="aadahhouse@gmail.com"
                className="w-full bg-white border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#554052]">
                  Admin Passcode
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setGatePasscode('rii2026');
                    setAdminIdentifier('aadahhouse@gmail.com');
                  }}
                  className="text-[10px] text-[#8C5A7D] font-semibold underline hover:text-[#554052] cursor-pointer"
                >
                  Fill default (rii2026)
                </button>
              </div>
              <div className="relative">
                <input
                  type={showGatePasscode ? 'text' : 'password'}
                  value={gatePasscode}
                  onChange={(e) => setGatePasscode(e.target.value)}
                  placeholder="Enter owner passcode"
                  autoFocus
                  className="w-full bg-white border border-[#D5C2D7] p-2.5 pr-10 text-xs text-[#554052] outline-none focus:border-[#8C5A7D] font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowGatePasscode(!showGatePasscode)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A185A4] hover:text-[#554052]"
                >
                  {showGatePasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {gateError && (
                <p className="text-[11px] text-red-600 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 inline" /> {gateError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-sm cursor-pointer"
            >
              Verify & Access Studio
            </button>
          </form>

          <div className="p-3 bg-[#F6F0F4] border border-[#D5C2D7] rounded-xs space-y-1 text-[11px] text-[#554052]/80">
            <p className="font-semibold text-[#8C5A7D] flex items-center gap-1">
              <Key className="w-3 h-3 text-[#8C5A7D]" /> Credentials Guide
            </p>
            <p>• Admin ID: <strong className="font-mono text-[#554052]">aadahhouse@gmail.com</strong></p>
            <p>• Default Passcode: <strong className="font-mono text-[#8C5A7D]">rii2026</strong></p>
            <p className="text-[10px] text-[#A185A4] pt-0.5">
              You can update this passcode anytime inside the studio via PIN Settings.
            </p>
          </div>

          <div className="pt-4 border-t border-[#D5C2D7] flex items-center justify-between text-xs">
            <button
              onClick={() => setActivePage('home')}
              className="text-[#A185A4] hover:text-[#8C5A7D] flex items-center gap-1 transition-colors cursor-pointer"
            >
              ← Return to Storefront
            </button>
            <button
              onClick={() => setActivePage('orders')}
              className="text-[#8C5A7D] font-medium hover:underline cursor-pointer"
            >
              Customer Orders Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Owner Session Active Status Banner */}
      <div className="bg-[#8C5A7D] text-[#F6F0F4] p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs border border-[#D5C2D7] shadow-xs">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#D5C2D7]" />
          <span>
            <strong>Owner Session Active:</strong> You are authorized to add/remove garment images, set sizes S–XXL, and update prices.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsChangingPin(!isChangingPin)}
            className="text-xs underline hover:text-[#D5C2D7] transition-colors"
          >
            {isChangingPin ? 'Close PIN Settings' : 'Change Passcode'}
          </button>
          <span className="text-white/40">·</span>
          <button
            onClick={logoutOwner}
            className="text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 text-white transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3 h-3" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Change Passcode Box */}
      {isChangingPin && (
        <form
          onSubmit={handleChangePinSubmit}
          className="bg-white p-5 border border-[#D5C2D7] shadow-sm max-w-md space-y-3 text-xs animate-in slide-in-from-top-2 duration-200"
        >
          <h4 className="font-serif text-sm font-bold text-[#8C5A7D]">Change Owner Passcode</h4>
          <div>
            <label className="block text-xs font-medium text-[#554052] mb-1">Current Passcode</label>
            <input
              type="password"
              value={currentPinInput}
              onChange={(e) => setCurrentPinInput(e.target.value)}
              placeholder="Enter current passcode"
              className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2 text-xs font-mono outline-none focus:border-[#8C5A7D]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#554052] mb-1">New Passcode</label>
            <input
              type="password"
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              placeholder="Enter your new secret passcode"
              className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2 text-xs font-mono outline-none focus:border-[#8C5A7D]"
            />
          </div>
          {changePinError && <p className="text-red-600 text-[11px]">{changePinError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsChangingPin(false)}
              className="px-3 py-1.5 border border-[#D5C2D7] text-xs text-[#554052] hover:bg-[#F6F0F4]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#8C5A7D] text-white text-xs font-semibold hover:bg-[#554052]"
            >
              Update Passcode
            </button>
          </div>
        </form>
      )}

      {/* Studio Navigation Tabs (Orders vs Kurti Catalogue) */}
      <div className="flex items-center gap-2 border-b border-[#D5C2D7] pb-1">
        <button
          onClick={() => setActiveStudioTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 -mb-[5px] ${
            activeStudioTab === 'orders'
              ? 'border-[#8C5A7D] text-[#8C5A7D] bg-white'
              : 'border-transparent text-[#A185A4] hover:text-[#554052]'
          }`}
        >
          <Package className="w-4 h-4 text-[#8C5A7D]" />
          <span>Customer Orders</span>
          <span className="ml-1 px-1.5 py-0.2 bg-[#8C5A7D] text-white text-[10px] rounded-full">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveStudioTab('catalog')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 -mb-[5px] ${
            activeStudioTab === 'catalog'
              ? 'border-[#8C5A7D] text-[#8C5A7D] bg-white'
              : 'border-transparent text-[#A185A4] hover:text-[#554052]'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#8C5A7D]" />
          <span>Garment Catalogue & Photos</span>
          <span className="ml-1 px-1.5 py-0.2 bg-[#D5C2D7] text-[#554052] text-[10px] rounded-full">
            {products.length}
          </span>
        </button>
      </div>

      {/* VIEW 1: CUSTOMER ORDERS MANAGEMENT */}
      {activeStudioTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 border border-[#D5C2D7] shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#A185A4] font-medium block">
                Total Orders Placed
              </span>
              <p className="font-serif text-2xl font-bold text-[#8C5A7D] mt-1 tabular-nums">
                {orders.length}
              </p>
              <span className="text-[10px] text-[#7A8061] mt-0.5 block">Recorded in store storage</span>
            </div>

            <div className="bg-white p-4 border border-[#D5C2D7] shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#A185A4] font-medium block">
                Total Revenue (₹)
              </span>
              <p className="font-mono text-2xl font-bold text-[#554052] mt-1 tabular-nums">
                ₹{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-[#A185A4] mt-0.5 block">Prepaid + COD bookings</span>
            </div>

            <div className="bg-white p-4 border border-[#D5C2D7] shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#A185A4] font-medium block">
                Pending Dispatch
              </span>
              <p className="font-serif text-2xl font-bold text-[#8C5A7D] mt-1 tabular-nums">
                {orders.filter((o) => o.status === 'CONFIRMED').length}
              </p>
              <span className="text-[10px] text-[#A185A4] mt-0.5 block">Ready to pack & courier</span>
            </div>

            <div className="bg-white p-4 border border-[#D5C2D7] shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#A185A4] font-medium block">
                Delivered
              </span>
              <p className="font-serif text-2xl font-bold text-[#7A8061] mt-1 tabular-nums">
                {orders.filter((o) => o.status === 'DELIVERED').length}
              </p>
              <span className="text-[10px] text-[#7A8061] mt-0.5 block">Completed shipments</span>
            </div>
          </div>

          {/* Search & Status Filter Controls */}
          <div className="bg-white p-4 border border-[#D5C2D7] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#A185A4]" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search by Order ID (e.g. ADH-2026), Name, Phone, or City..."
                className="w-full bg-[#F6F0F4] border border-[#D5C2D7] px-3 py-1.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
              />
              {orderSearchQuery && (
                <button
                  onClick={() => setOrderSearchQuery('')}
                  className="text-xs text-[#A185A4] hover:text-[#8C5A7D]"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
              <span className="text-[#A185A4] font-medium">Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                className="bg-[#F6F0F4] border border-[#D5C2D7] px-3 py-1.5 text-xs text-[#554052] outline-none font-medium"
              >
                <option value="ALL">All Orders ({orders.length})</option>
                <option value="CONFIRMED">Confirmed / Processing</option>
                <option value="DISPATCHED">Dispatched with Courier</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
          </div>

          {/* Orders Cards List */}
          {orders.length === 0 ? (
            <div className="bg-white border border-[#D5C2D7] p-12 text-center space-y-3">
              <Package className="w-10 h-10 text-[#8C5A7D] mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#554052]">No Customer Orders Yet</h3>
              <p className="text-xs text-[#A185A4] max-w-sm mx-auto">
                Whenever a customer places an order on your website, it will immediately appear right here with their name, phone number, and delivery address.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders
                .filter((order) => {
                  if (orderStatusFilter !== 'ALL' && order.status !== orderStatusFilter) {
                    return false;
                  }
                  if (orderSearchQuery.trim()) {
                    const q = orderSearchQuery.toLowerCase();
                    const matchNum = order.orderNumber.toLowerCase().includes(q);
                    const matchName = order.shippingAddress.fullName.toLowerCase().includes(q);
                    const matchPhone = order.shippingAddress.phone.includes(q);
                    const matchCity = order.shippingAddress.city.toLowerCase().includes(q);
                    return matchNum || matchName || matchPhone || matchCity;
                  }
                  return true;
                })
                .map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-[#D5C2D7] shadow-xs p-5 sm:p-6 space-y-4 hover:border-[#8C5A7D]/80 transition-colors"
                  >
                    {/* Order Top Bar: Order ID, Date, Payment & Status Select */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D5C2D7]">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#8C5A7D]">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] text-[#A185A4]">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-xs ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {order.paymentMethod === 'COD' ? 'COD (Pay on Delivery)' : 'Paid Online (UPI/Card)'}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#A185A4] font-medium">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className={`font-semibold text-xs px-2.5 py-1 border outline-none rounded-xs ${
                            order.status === 'CONFIRMED'
                              ? 'bg-amber-50 border-amber-300 text-amber-900'
                              : order.status === 'DISPATCHED'
                              ? 'bg-blue-50 border-blue-300 text-blue-900'
                              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          }`}
                        >
                          <option value="CONFIRMED">🟡 Confirmed (Packaging)</option>
                          <option value="DISPATCHED">🔵 Dispatched (Shipped)</option>
                          <option value="DELIVERED">🟢 Delivered (Completed)</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Body: Customer & Address + Garments List */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Customer Info & Shipping Address */}
                      <div className="md:col-span-5 space-y-2 text-xs border-b md:border-b-0 md:border-r border-[#D5C2D7] pb-4 md:pb-0 md:pr-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A185A4] block">
                          Customer & Delivery Address
                        </span>
                        <p className="font-serif text-base font-bold text-[#554052]">
                          {order.shippingAddress.fullName}
                        </p>
                        <p className="text-[#554052]/85 leading-relaxed">
                          {order.shippingAddress.addressLine}
                          {order.shippingAddress.locality && `, ${order.shippingAddress.locality}`}
                          <br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} —{' '}
                          <strong className="text-[#8C5A7D]">{order.shippingAddress.pincode}</strong>
                        </p>

                        <div className="pt-2 text-xs space-y-1">
                          <p className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-[#8C5A7D]" />
                            <span className="font-mono">{order.shippingAddress.phone}</span>
                            <a
                              href={`https://wa.me/91${order.shippingAddress.phone}?text=${encodeURIComponent(
                                `Hello ${order.shippingAddress.fullName}! This is HOUSE OF RII regarding your order ${order.orderNumber}. We have received your order and are preparing your parcel.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] bg-[#25D366] text-white px-2 py-0.5 rounded-xs font-semibold hover:bg-[#20ba59] transition-colors ml-1"
                              title="Message customer directly on WhatsApp"
                            >
                              WhatsApp Customer
                            </a>
                          </p>
                          <p className="flex items-center gap-2 text-[#A185A4]">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{order.shippingAddress.email}</span>
                          </p>
                        </div>

                        {/* Payment & Receiver Information */}
                        <div className="pt-2 border-t border-[#D5C2D7]/80 space-y-1 text-[11px]">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A185A4] block">
                            Payment Verification:
                          </span>
                          {order.paymentMethod === 'ONLINE_UPI' ? (
                            <div className="bg-[#F6F0F4] p-2.5 border border-[#8C5A7D]/40 space-y-1">
                              <p className="font-semibold text-[#8C5A7D] flex items-center gap-1 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#7A8061]" />
                                <span>UPI Payment to: <strong className="font-mono text-[#8C5A7D]">{order.receiverUpi || BRAND_CONFIG.payment.upiId}</strong></span>
                              </p>
                              <p className="text-[#554052]">
                                Customer UTR / Ref: <strong className="font-mono text-[#8C5A7D] bg-white px-1.5 py-0.5 border border-[#D5C2D7] rounded-xs">{order.transactionRef || 'Provided via UPI App'}</strong>
                              </p>
                              <p className="text-[10px] text-[#7A8061] leading-tight">
                                ✓ Money deposited directly to your bank account ({BRAND_CONFIG.payment.upiId}).
                              </p>
                            </div>
                          ) : order.paymentMethod === 'COD' ? (
                            <div className="bg-amber-50/70 p-2.5 border border-amber-200 text-amber-900 space-y-0.5">
                              <p className="font-semibold text-xs">Cash on Delivery (COD)</p>
                              <p className="text-[10px]">Collect ₹{order.total.toLocaleString('en-IN')} cash upon delivering parcel.</p>
                            </div>
                          ) : (
                            <div className="bg-emerald-50/70 p-2.5 border border-emerald-200 text-emerald-900">
                              <p className="font-semibold text-xs">Paid Online via Card</p>
                              <p className="text-[10px]">Prepaid card transaction.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Items Ordered List */}
                      <div className="md:col-span-7 space-y-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A185A4] block">
                          Kurti Items ({order.items.length})
                        </span>
                        <div className="divide-y divide-[#D5C2D7] max-h-48 overflow-y-auto">
                          {order.items.map((item) => (
                            <div key={item.id} className="py-2 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={item.product.images[0]}
                                  alt=""
                                  className="w-10 h-12 object-cover border border-[#D5C2D7] shrink-0"
                                />
                                <div>
                                  <p className="font-serif font-bold text-[#554052] line-clamp-1">
                                    {item.product.name}
                                  </p>
                                  <div className="flex items-center gap-2 text-[11px] text-[#A185A4]">
                                    <span>
                                      Size: <strong className="text-[#8C5A7D]">{item.selectedSize}</strong>
                                    </span>
                                    <span>·</span>
                                    <span>Qty: {item.quantity}</span>
                                  </div>
                                </div>
                              </div>
                              <span className="font-mono font-semibold text-[#8C5A7D] tabular-nums">
                                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Summary Financials Bar */}
                        <div className="pt-2 border-t border-[#D5C2D7] flex items-center justify-between text-xs">
                          <div className="text-[11px] text-[#A185A4]">
                            <span>Subtotal: ₹{order.subtotal}</span>
                            {order.discount > 0 && <span className="ml-2 text-[#7A8061]">Discount: -₹{order.discount}</span>}
                            <span className="ml-2">Shipping: {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
                          </div>
                          <div className="flex items-baseline gap-1.5 font-bold">
                            <span>Total:</span>
                            <span className="font-mono text-sm text-[#8C5A7D] tabular-nums">
                              ₹{order.total.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Action Buttons */}
                    <div className="pt-3 border-t border-[#D5C2D7] flex items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => window.print()}
                          className="px-3 py-1.5 border border-[#D5C2D7] hover:bg-[#F6F0F4] text-[#554052] font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#8C5A7D]" />
                          <span>Print Slip</span>
                        </button>

                        <button
                          onClick={async () => {
                            showToast(`Dispatching order alerts for #${order.orderNumber}...`);
                            try {
                              const res = await sendOrderEmails(order);
                              showToast(res.message);
                            } catch (e) {
                              showToast('Opening owner email draft...');
                              window.open(getOwnerMailtoUrl(order), '_blank');
                            }
                          }}
                          className="px-3 py-1.5 border border-[#8C5A7D]/60 hover:bg-[#F6F0F4] text-[#8C5A7D] font-semibold flex items-center gap-1.5 transition-colors"
                          title="Resend email alert to aadahhouse@gmail.com and customer"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#8C5A7D]" />
                          <span>Resend Email Alerts</span>
                        </button>

                        <a
                          href={getCustomerWhatsAppUrl(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-medium flex items-center gap-1.5 transition-colors rounded-xs"
                          title="Send order receipt to customer on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Customer WhatsApp</span>
                        </a>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete order record ${order.orderNumber}?`)) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="text-[11px] text-red-600 hover:underline p-1"
                      >
                        Delete Record
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: KURTI CATALOGUE & IMAGE MANAGER */}
      {activeStudioTab === 'catalog' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Page Title & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D5C2D7]">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C5A7D] font-semibold">
                <span>Catalogue Manager</span>
                <span>·</span>
                <span>Upload Photos & Sizes</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#554052] mt-1">
                Kurti Inventory & Photos
              </h2>
              <p className="text-xs text-[#A185A4] mt-1">
                Upload kurti photos from your device, add/remove images, configure sizes (S, M, L, XL, XXL), and manage retail prices.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={resetProductsToDefault}
                className="px-3.5 py-2 border border-[#D5C2D7] bg-white text-[#554052] hover:text-[#8C5A7D] text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Reset to initial catalogue"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
              {!isEditing && (
                <button
                  onClick={handleStartNew}
                  className="px-5 py-2.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Kurti</span>
                </button>
              )}
            </div>
          </div>

      {/* Product Form Editor (Add or Edit) */}
      {isEditing && (
        <form
          onSubmit={handleSaveProduct}
          className="bg-white p-6 sm:p-8 border-2 border-[#8C5A7D]/30 shadow-md space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#D5C2D7]">
            <h3 className="font-serif text-xl font-bold text-[#8C5A7D]">
              {editingId ? 'Edit Kurti Details' : 'Add New Kurti to HOUSE OF RII'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-[#A185A4] hover:text-[#8C5A7D]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#554052] mb-1">
                  Kurti / Set Title *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Parijat Embroidered Chanderi Kurti Set"
                  required
                  className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#554052] mb-1">
                    Collection *
                  </label>
                  <select
                    value={collection}
                    onChange={(e) => setCollection(e.target.value as ProductCollection)}
                    className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none"
                  >
                    <option value="Everyday Wear">Everyday Wear</option>
                    <option value="Festive & Wedding Edits">Festive & Wedding Edits</option>
                    <option value="Everyday Elegance">Everyday Elegance</option>
                    <option value="Festive Edit">Festive Edit</option>
                    <option value="Office & College Wear">Office & College Wear</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#554052] mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Product['category'])}
                    className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none"
                  >
                    <option value="Kurti Set">Kurti Set</option>
                    <option value="Bottom Wear">Bottom Wear</option>
                    <option value="Coord Set">Coord Set</option>
                    <option value="Suit Sets">Suit Sets</option>
                    <option value="Kurta Sets">Kurta Sets</option>
                    <option value="Coord Sets">Coord Sets</option>
                    <option value="Sharara Sets">Sharara Sets</option>
                    <option value="Straight Kurti">Straight Kurti</option>
                    <option value="Anarkali Kurti">Anarkali Kurti</option>
                    <option value="Co-ord Set">Co-ord Set</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#554052] mb-1">
                    Retail Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Math.max(1, Number(e.target.value)))}
                    min={1}
                    required
                    className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 text-xs font-mono text-[#554052] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#554052] mb-1">
                    Original Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Math.max(1, Number(e.target.value)))}
                    min={1}
                    className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 text-xs font-mono text-[#554052] outline-none"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold text-[#554052] mb-1">
                  Fabric Composition *
                </label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g. 100% Breathable Cotton Mulmul / Chanderi Silk"
                  className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#554052] mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the kurti silhouette, embroidery, pairing, and occasions..."
                  className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none"
                />
              </div>

              {/* Kurti Sizes Selection (S, M, L, XL, XXL) */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#554052] mb-2">
                  Available Sizes (Starting S, M, L, XL, XXL):
                </label>
                <div className="flex items-center gap-3">
                  {ALL_SIZES.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`w-12 h-11 border text-xs font-bold transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-[#8C5A7D] text-white border-[#8C5A7D]'
                            : 'bg-white text-[#A185A4] border-[#D5C2D7] hover:border-[#8C5A7D]'
                        }`}
                      >
                        <span>{sz}</span>
                        {isSelected && <span className="text-[9px] font-normal leading-none mt-0.5">Active</span>}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[#A185A4] mt-1.5">
                  Click a size button to toggle its availability for this kurti.
                </p>
              </div>
            </div>

            {/* Right: Kurti Image Management (Add / Remove) */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#554052] mb-1">
                  Manage Kurti Images (Add & Remove)
                </label>
                <p className="text-[11px] text-[#A185A4] mb-3">
                  Upload kurti photos from your device, or paste image URLs. You can remove unwanted images anytime.
                </p>

                {/* File Upload Button */}
                <label className="flex items-center justify-center gap-2 p-3 bg-[#F6F0F4] border-2 border-dashed border-[#8C5A7D]/60 hover:border-[#8C5A7D] cursor-pointer text-xs font-semibold text-[#8C5A7D] transition-colors">
                  <Upload className="w-4 h-4 text-[#8C5A7D]" />
                  <span>Upload Photos From Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Or URL input */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or paste an image URL..."
                    className="flex-1 bg-[#F6F0F4] border border-[#D5C2D7] px-3 py-2 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 bg-[#554052] text-white text-xs font-medium hover:bg-[#8C5A7D]"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Current Images Gallery with Delete Overlay */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-[#554052]">
                  Current Photos ({images.length}):
                </span>

                {images.length === 0 ? (
                  <div className="p-8 border border-[#D5C2D7] bg-[#F6F0F4] text-center text-xs text-[#A185A4]">
                    <ImageIcon className="w-8 h-8 mx-auto text-[#8C5A7D]/60 mb-2" />
                    <span>No photos added yet. Upload an image to preview.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[3/4] bg-[#F6F0F4] border border-[#D5C2D7] group overflow-hidden"
                      >
                        <img
                          src={img}
                          alt={`Kurti view ${idx + 1}`}
                          className="w-full h-full object-cover object-top"
                        />
                        {/* Remove Image Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 shadow-md transition-opacity"
                          title="Remove this image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Flags & Stock */}
              <div className="pt-2 border-t border-[#D5C2D7] space-y-2">
                <label className="flex items-center gap-2 text-xs text-[#554052] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="accent-[#8C5A7D]"
                  />
                  <span>Mark as In Stock</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#554052] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="accent-[#8C5A7D]"
                  />
                  <span>Show under "New Arrivals"</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#554052] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="accent-[#8C5A7D]"
                  />
                  <span>Show under "Bestsellers"</span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#D5C2D7] flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 border border-[#D5C2D7] text-xs font-medium text-[#554052] hover:bg-[#F6F0F4]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-xs"
            >
              {editingId ? 'Save Changes' : 'Publish Kurti to Store'}
            </button>
          </div>
        </form>
      )}

      {/* Current Products Inventory Table */}
      <div className="bg-white border border-[#D5C2D7] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#D5C2D7] bg-[#F6F0F4] flex items-center justify-between">
          <span className="font-serif text-base font-bold text-[#554052]">
            Active Catalog ({products.length} Kurtis)
          </span>
          <span className="text-xs text-[#A185A4]">
            Modifications update your live storefront instantly
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F0F4] text-[#A185A4] uppercase tracking-wider font-semibold border-b border-[#D5C2D7]">
              <tr>
                <th className="py-3 px-4">Kurti</th>
                <th className="py-3 px-4">Collection</th>
                <th className="py-3 px-4">Sizes</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Images</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5C2D7]">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#F6F0F4]/50 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={prod.images[0]}
                      alt=""
                      className="w-10 h-12 object-cover border border-[#D5C2D7] shrink-0"
                    />
                    <div>
                      <p className="font-serif font-bold text-[#554052]">{prod.name}</p>
                      <p className="font-mono text-[10px] text-[#A185A4]">{prod.sku}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#554052]">{prod.collection}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {prod.sizes.map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.5 bg-[#F6F0F4] border border-[#D5C2D7] text-[10px] font-mono"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#8C5A7D] tabular-nums">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-[#554052]/80">
                    {prod.images.length} {prod.images.length === 1 ? 'photo' : 'photos'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        prod.inStock
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {prod.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openProductDetails(prod)}
                        className="p-1.5 text-[#554052] hover:text-[#8C5A7D]"
                        title="View Live"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStartEdit(prod)}
                        className="p-1.5 text-[#8C5A7D] hover:bg-[#F6F0F4]"
                        title="Edit kurti & photos"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50"
                        title="Delete kurti"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}
</div>
);
};
