import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  MessageCircle,
  Search,
  ArrowRight,
  User,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  RotateCw,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND_CONFIG } from '../config/brand';
import { Order, KurtiSize } from '../types';

export const OrdersPage: React.FC = () => {
  const {
    currentUser,
    orders,
    getCustomerOrders,
    setActivePage,
    setIsAuthModalOpen,
    setAuthModalMode,
    openProductDetails,
    requestExchange,
    showToast,
  } = useStore();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED'>('ALL');
  const [lookupOrderNumber, setLookupOrderNumber] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [guestLookupResult, setGuestLookupResult] = useState<Order | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Size Exchange Modal State
  const [selectedExchangeOrder, setSelectedExchangeOrder] = useState<Order | null>(null);
  const [requestedSize, setRequestedSize] = useState<KurtiSize>('M');
  const [exchangeReason, setExchangeReason] = useState('Need an alternate size for better fit');
  const [isSubmittingExchange, setIsSubmittingExchange] = useState(false);
  const [exchangeSuccess, setExchangeSuccess] = useState(false);

  const customerOrders = currentUser ? getCustomerOrders() : [];

  const filteredOrders = customerOrders.filter((ord) => {
    if (statusFilter === 'ALL') return true;
    return ord.status === statusFilter;
  });

  const handleGuestLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setGuestLookupResult(null);

    const cleanOrderNum = lookupOrderNumber.trim().toUpperCase();
    const cleanPhone = lookupPhone.replace(/\D/g, '');

    if (!cleanOrderNum && !cleanPhone) {
      setLookupError('Please enter an Order ID or Mobile Number');
      return;
    }

    const found = orders.find((o) => {
      const matchNum = cleanOrderNum && o.orderNumber.toUpperCase().includes(cleanOrderNum);
      const matchPhone = cleanPhone && o.shippingAddress.phone.replace(/\D/g, '').includes(cleanPhone);
      return matchNum || matchPhone;
    });

    if (found) {
      setGuestLookupResult(found);
    } else {
      setLookupError('No matching order found. Please verify your Order Number or Mobile Number.');
    }
  };

  const renderOrderCard = (order: Order) => {
    const isPaid = order.paymentStatus === 'PAID';
    const statusColor =
      order.status === 'CONFIRMED'
        ? 'bg-amber-50 text-amber-800 border-amber-200'
        : order.status === 'DISPATCHED'
        ? 'bg-blue-50 text-blue-800 border-blue-200'
        : 'bg-emerald-50 text-emerald-800 border-emerald-200';

    const whatsappInquiryUrl = `https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
      `Hello HOUSE OF RII! I am inquiring about my order #${order.orderNumber} for ${order.shippingAddress.fullName}. Could you please share the current dispatch tracking?`
    )}`;

    return (
      <div
        key={order.id}
        className="bg-white border border-[#D5C2D7] p-5 sm:p-6 shadow-xs space-y-5 transition-all hover:border-[#8C5A7D]"
      >
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D5C2D7] text-xs">
          <div>
            <span className="text-[#A185A4] block text-[11px]">ORDER PLACED</span>
            <strong className="text-[#554052] text-sm">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </strong>
          </div>

          <div>
            <span className="text-[#A185A4] block text-[11px]">ORDER NUMBER</span>
            <span className="font-mono font-bold text-[#8C5A7D] text-sm">
              #{order.orderNumber}
            </span>
          </div>

          <div>
            <span className="text-[#A185A4] block text-[11px]">TOTAL AMOUNT</span>
            <span className="font-mono font-bold text-[#554052] text-sm">
              ₹{order.total.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Status Badge */}
          <div className="sm:text-right">
            <span className="text-[#A185A4] block text-[11px]">ORDER STATUS</span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xs border mt-0.5 ${statusColor}`}
            >
              {order.status === 'CONFIRMED' && <Clock className="w-3 h-3 text-amber-600" />}
              {order.status === 'DISPATCHED' && <Truck className="w-3 h-3 text-blue-600" />}
              {order.status === 'DELIVERED' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              <span>{order.status}</span>
            </span>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="py-2">
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className={`p-2 border rounded-xs ${order.status ? 'bg-[#F3E9EB] border-[#8C5A7D] text-[#8C5A7D] font-semibold' : 'border-[#D5C2D7] text-[#A185A4]'}`}>
              <span>1. Confirmed</span>
            </div>
            <div className={`p-2 border rounded-xs ${order.status === 'DISPATCHED' || order.status === 'DELIVERED' ? 'bg-[#F3E9EB] border-[#8C5A7D] text-[#8C5A7D] font-semibold' : 'border-[#D5C2D7] text-[#A185A4]'}`}>
              <span>2. Dispatched</span>
            </div>
            <div className={`p-2 border rounded-xs ${order.status === 'DELIVERED' ? 'bg-[#F3E9EB] border-[#8C5A7D] text-[#8C5A7D] font-semibold' : 'border-[#D5C2D7] text-[#A185A4]'}`}>
              <span>3. Delivered</span>
            </div>
          </div>
        </div>

        {/* Garments List */}
        <div className="space-y-3">
          <span className="text-[11px] uppercase tracking-wider text-[#A185A4] font-semibold block">
            Garments ({order.items.length})
          </span>
          <div className="divide-y divide-[#D5C2D7]">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-12 h-14 object-cover border border-[#D5C2D7] shrink-0"
                  />
                  <div>
                    <h5
                      onClick={() => openProductDetails(item.product)}
                      className="font-serif font-bold text-[#554052] hover:text-[#8C5A7D] cursor-pointer text-sm"
                    >
                      {item.product.name}
                    </h5>
                    <p className="text-[11px] text-[#A185A4] mt-0.5">
                      Kurti Size: <strong className="text-[#8C5A7D]">{item.selectedSize}</strong> · Qty: {item.quantity} · {item.product.fabric}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-semibold text-[#8C5A7D] tabular-nums">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Details & Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#D5C2D7] text-xs">
          <div className="space-y-1">
            <span className="text-[#A185A4] font-semibold block text-[11px] uppercase">
              Shipping Address:
            </span>
            <p className="font-semibold text-[#554052]">{order.shippingAddress.fullName}</p>
            <p className="text-[#554052]/80">
              {order.shippingAddress.addressLine}
              {order.shippingAddress.locality && `, ${order.shippingAddress.locality}`}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </p>
            <p className="text-[#A185A4] text-[11px]">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="space-y-1 md:text-right">
            <span className="text-[#A185A4] font-semibold block text-[11px] uppercase">
              Delivery & Payment:
            </span>
            <p className="text-[#554052]">
              Est. Delivery: <strong className="text-[#8C5A7D]">{order.estimatedDeliveryDate}</strong>
            </p>
            <p className="text-[#554052]">
              Payment: <strong>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid via Online UPI'}</strong>
            </p>
            {order.transactionRef && (
              <p className="font-mono text-[11px] text-[#A185A4]">Ref: {order.transactionRef}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#D5C2D7] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-medium flex items-center gap-1.5 rounded-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Track on WhatsApp</span>
            </a>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 border border-[#D5C2D7] hover:bg-[#F3E9EB] text-[#554052] font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#8C5A7D]" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={() => {
                setSelectedExchangeOrder(order);
                setExchangeSuccess(false);
              }}
              className="px-3 py-1.5 border border-[#8C5A7D] bg-[#F6F0F4] hover:bg-[#8C5A7D] hover:text-white text-[#8C5A7D] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Request alternate size within 7 days of delivery"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Request Exchange</span>
            </button>
          </div>

          <button
            onClick={() => setActivePage('shop')}
            className="text-[11px] text-[#8C5A7D] hover:underline font-semibold flex items-center gap-1"
          >
            <span>Browse More Styles</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#F3E9EB] py-12 sm:py-16 animate-in fade-in duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Title */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold">
            Customer Dashboard
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#554052]">
            My HOUSE OF RII Orders
          </h1>
          <p className="text-xs sm:text-sm text-[#554052]/80">
            Track current deliveries, view order receipts, and request size exchanges.
          </p>
        </div>

        {/* LOGGED IN VIEW */}
        {currentUser ? (
          <div className="space-y-6">
            {/* User Greeting Bar */}
            <div className="bg-white p-4 sm:p-5 border border-[#D5C2D7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8C5A7D] text-white flex items-center justify-center font-serif font-bold text-lg">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#554052]">
                    Namaste, {currentUser.fullName}
                  </h3>
                  <p className="text-xs text-[#A185A4]">
                    {currentUser.email} • {currentUser.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePage('account')}
                  className="px-3.5 py-1.5 border border-[#D5C2D7] hover:bg-[#F3E9EB] text-xs font-semibold text-[#554052] transition-colors"
                >
                  Manage Profile
                </button>
                <button
                  onClick={() => setActivePage('shop')}
                  className="px-4 py-1.5 bg-[#8C5A7D] hover:bg-[#554052] text-xs font-semibold text-white uppercase tracking-wider transition-colors"
                >
                  Shop Catalog
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 border-b border-[#D5C2D7] pb-2 text-xs font-medium">
              <span className="text-[#A185A4] mr-2">Filter By:</span>
              {(['ALL', 'CONFIRMED', 'DISPATCHED', 'DELIVERED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-xs transition-colors ${
                    statusFilter === st
                      ? 'bg-[#8C5A7D] text-white font-semibold'
                      : 'text-[#554052] hover:bg-white'
                  }`}
                >
                  {st === 'ALL' ? `All Orders (${customerOrders.length})` : st}
                </button>
              ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map(renderOrderCard)}
              </div>
            ) : (
              <div className="bg-white p-12 border border-[#D5C2D7] text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-[#A185A4] mx-auto opacity-40" />
                <h4 className="font-serif text-xl font-bold text-[#554052]">
                  {statusFilter === 'ALL'
                    ? 'No orders placed yet'
                    : `No orders matching status "${statusFilter}"`}
                </h4>
                <p className="text-xs text-[#A185A4] max-w-sm mx-auto">
                  Explore our curated collections of everyday and festive kurtis.
                </p>
                <button
                  onClick={() => setActivePage('shop')}
                  className="px-6 py-2.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Browse Kurtis
                </button>
              </div>
            )}
          </div>
        ) : (
          /* NOT LOGGED IN: Sign In Promotion + Guest Order Lookup */
          <div className="space-y-8">
            <div className="bg-[#F3E9EB] p-8 border border-[#D5C2D7] text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#F3E9EB] border border-[#D5C2D7] flex items-center justify-center mx-auto text-[#8C5A7D]">
                <User className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#554052]">
                Sign In to View Your Orders
              </h3>
              <p className="text-xs sm:text-sm text-[#554052]/80 max-w-md mx-auto leading-relaxed">
                Log in using your registered <strong>Email ID or Mobile Number</strong> to see all past orders, track dispatch status, and download receipts.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-8 py-3 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Sign In With Email / Phone
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-3 border border-[#8C5A7D] text-[#8C5A7D] text-xs uppercase tracking-wider font-semibold hover:bg-[#F3E9EB] transition-colors"
                >
                  New Customer? Register
                </button>
              </div>
            </div>

            {/* Quick Guest Order Lookup Form */}
            <div className="bg-[#F3E9EB] p-6 sm:p-8 border border-[#D5C2D7] space-y-4 shadow-xs">
              <div className="border-b border-[#D5C2D7] pb-3">
                <h4 className="font-serif text-lg font-bold text-[#554052] flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#8C5A7D]" />
                  <span>Or Track a Guest Order Directly</span>
                </h4>
                <p className="text-xs text-[#A185A4] mt-0.5">
                  Placed an order as a guest? Enter your Order Number or Mobile Number below to find your parcel.
                </p>
              </div>

              <form onSubmit={handleGuestLookup} className="space-y-4">
                {lookupError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                    {lookupError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-medium text-[#554052] mb-1">
                      Order ID (e.g. RII-2026-1042)
                    </label>
                    <input
                      type="text"
                      value={lookupOrderNumber}
                      onChange={(e) => setLookupOrderNumber(e.target.value)}
                      placeholder="RII-2026-XXXX"
                      className="w-full bg-[#F3E9EB] border border-[#D5C2D7] p-2.5 text-xs font-mono uppercase text-[#554052] outline-none focus:border-[#8C5A7D]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#554052] mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={lookupPhone}
                      onChange={(e) => setLookupPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full bg-[#F3E9EB] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Track Order</span>
                </button>
              </form>

              {/* Guest Lookup Result */}
              {guestLookupResult && (
                <div className="mt-6 pt-6 border-t border-[#D5C2D7] space-y-3">
                  <h5 className="font-serif text-base font-bold text-[#8C5A7D]">
                    Matching Order Found:
                  </h5>
                  {renderOrderCard(guestLookupResult)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 7-DAY SIZE EXCHANGE REQUEST MODAL */}
      {selectedExchangeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#F3E9EB] max-w-lg w-full border border-[#D5C2D7] shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#D5C2D7] pb-3">
              <div className="flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-[#8C5A7D]" />
                <h3 className="font-serif text-lg font-bold text-[#554052]">
                  Request Garment Size Exchange
                </h3>
              </div>
              <button
                onClick={() => setSelectedExchangeOrder(null)}
                className="p-1 text-[#554052] hover:text-[#8C5A7D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-white border border-[#D5C2D7] text-xs space-y-1">
              <p className="flex justify-between">
                <span className="text-[#A185A4]">Order Number:</span>
                <strong className="font-mono text-[#8C5A7D]">#{selectedExchangeOrder.orderNumber}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-[#A185A4]">Customer:</span>
                <span className="font-semibold text-[#554052]">{selectedExchangeOrder.shippingAddress.fullName}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#A185A4]">Items in Order:</span>
                <span className="text-[#554052]">{selectedExchangeOrder.items.length} garments</span>
              </p>
            </div>

            {exchangeSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-center space-y-2 rounded-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-base font-bold text-emerald-900">Exchange Logged Successfully!</h4>
                <p className="text-xs text-emerald-800">
                  Our Jaipur studio concierge will verify inventory and arrange reverse pickup within 24 hours.
                </p>
                <button
                  onClick={() => setSelectedExchangeOrder(null)}
                  className="mt-3 px-4 py-2 bg-[#8C5A7D] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmittingExchange(true);
                  try {
                    await requestExchange(selectedExchangeOrder.id, requestedSize, exchangeReason);
                    setExchangeSuccess(true);
                  } catch (err: any) {
                    showToast(err?.message || 'Failed to submit exchange request');
                  } finally {
                    setIsSubmittingExchange(false);
                  }
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-[#554052] font-semibold mb-1">
                    Select Replacement Size Needed *
                  </label>
                  <div className="flex gap-2">
                    {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as KurtiSize[]).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setRequestedSize(sz)}
                        className={`flex-1 py-2 font-mono font-bold border transition-colors ${
                          requestedSize === sz
                            ? 'bg-[#8C5A7D] text-white border-[#8C5A7D]'
                            : 'bg-white border-[#D5C2D7] text-[#554052] hover:border-[#8C5A7D]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#554052] font-semibold mb-1">
                    Reason for Exchange & Fitting Notes *
                  </label>
                  <textarea
                    rows={3}
                    value={exchangeReason}
                    onChange={(e) => setExchangeReason(e.target.value)}
                    placeholder="e.g. Sleeves feel slightly snug / prefer looser bust fitting for festive movement"
                    className="w-full bg-white border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                    required
                  />
                </div>

                <div className="p-2.5 bg-[#FAF7F5] border border-[#D5C2D7] text-[11px] text-[#A185A4] leading-relaxed">
                  ✓ Valid within 7 calendar days of delivery.<br />
                  ✓ Garment must remain unused with original House of Rii brand tags intact.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedExchangeOrder(null)}
                    className="px-4 py-2 border border-[#D5C2D7] text-[#554052] hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingExchange}
                    className="px-6 py-2 bg-[#8C5A7D] hover:bg-[#554052] text-white font-semibold uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSubmittingExchange ? 'Submitting...' : 'Submit Exchange Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
