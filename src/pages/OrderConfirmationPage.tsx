import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  MessageCircle,
  ArrowRight,
  Mail,
  Send,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Home,
  ShoppingBag,
  AlertCircle,
  KeyRound,
  Check,
  Smartphone,
  MessageSquare,
  Copy,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND_CONFIG } from '../config/brand';
import {
  sendOrderEmails,
  getOwnerMailtoUrl,
  getCustomerMailtoUrl,
  getCustomerWhatsAppUrl,
  getCustomerSmsUrl,
  getOwnerWhatsAppUrl,
  getOwnerGmailWebUrl,
  getCustomerGmailWebUrl,
  saveSmtpPassword,
  NotificationResult,
} from '../services/notificationService';

export const OrderConfirmationPage: React.FC = () => {
  const { lastOrder, setActivePage, showToast } = useStore();
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [notificationResult, setNotificationResult] = useState<NotificationResult | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [showSmtpSetup, setShowSmtpSetup] = useState(false);
  const [appPasswordInput, setAppPasswordInput] = useState('');
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);
  const [copiedPhoneMsg, setCopiedPhoneMsg] = useState(false);
  const dispatchAttempted = useRef<string | null>(null);
  const hasAutoOpenedWhatsAppRef = useRef(false);

  // Automatically dispatch notification emails and attempt WhatsApp launch when landing on confirmation page
  useEffect(() => {
    if (lastOrder && dispatchAttempted.current !== lastOrder.id) {
      dispatchAttempted.current = lastOrder.id;
      setEmailStatus('sending');
      sendOrderEmails(lastOrder)
        .then((res) => {
          setNotificationResult(res);
          setEmailStatus('sent');
        })
        .catch((err) => {
          console.error('Failed to dispatch notifications:', err);
          setEmailStatus('error');
        });

      // Automatically launch WhatsApp with the customer's order receipt
      if (!hasAutoOpenedWhatsAppRef.current) {
        hasAutoOpenedWhatsAppRef.current = true;
        try {
          const waUrl = getCustomerWhatsAppUrl(lastOrder);
          const w = window.open(waUrl, '_blank');
          if (w) w.focus();
        } catch {
          // Popup blocker prevented auto-opening
        }
      }
    }
  }, [lastOrder]);

  if (!lastOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="font-serif text-xl font-bold text-[#554052]">No recent order found</p>
        <button
          onClick={() => setActivePage('shop')}
          className="px-6 py-2.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleResendEmails = async () => {
    setIsResending(true);
    setEmailStatus('sending');
    try {
      const res = await sendOrderEmails(lastOrder);
      setNotificationResult(res);
      setEmailStatus('sent');
      showToast('Order notification emails refreshed successfully!');
    } catch (err) {
      console.error(err);
      setEmailStatus('error');
      showToast('Could not reach email service. Opening mail draft fallback.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSaveAppPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appPasswordInput.trim()) return;
    setIsSavingSmtp(true);
    const res = await saveSmtpPassword(appPasswordInput);
    setIsSavingSmtp(false);
    if (res.success) {
      showToast('Gmail App Password saved! Sending live emails now...');
      setAppPasswordInput('');
      setShowSmtpSetup(false);
      await handleResendEmails();
    } else {
      showToast(res.message || 'Failed to save App Password');
    }
  };

  const ownerMailto = getOwnerMailtoUrl(lastOrder);
  const customerMailto = getCustomerMailtoUrl(lastOrder);
  const ownerGmailWeb = getOwnerGmailWebUrl(lastOrder);
  const customerGmailWeb = getCustomerGmailWebUrl(lastOrder);
  const customerWhatsAppUrl = getCustomerWhatsAppUrl(lastOrder);
  const customerSmsUrl = getCustomerSmsUrl(lastOrder);
  const ownerWhatsAppUrl = getOwnerWhatsAppUrl(lastOrder);

  const isSimulated = notificationResult?.simulated ?? true;

  return (
    <div className="bg-[#F6F0F4] py-12 sm:py-16 animate-in fade-in duration-300 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Success Banner */}
        <div className="bg-white p-8 sm:p-10 border border-[#D5C2D7] text-center space-y-4 shadow-sm relative overflow-hidden">
          {/* Decorative luxury gradient top accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8C5A7D] via-[#A185A4] to-[#8C5A7D]" />

          <div className="w-20 h-20 rounded-full bg-[#8C5A7D]/15 text-[#8C5A7D] flex items-center justify-center mx-auto shadow-inner ring-8 ring-[#8C5A7D]/5 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#8C5A7D]/10 border border-[#8C5A7D]/30 text-[#8C5A7D] text-[11px] font-bold uppercase tracking-widest rounded-full">
            <span>Payment Received · Order Confirmed</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#554052] tracking-tight">
            Order Placed Successfully!
          </h1>

          <p className="font-serif text-lg sm:text-xl text-[#8C5A7D] font-semibold italic">
            Thank you for ordering from HOUSE OF RII
          </p>

          <p className="text-xs sm:text-sm text-[#554052]/80 max-w-lg mx-auto leading-relaxed">
            Tradition, Styled Your Way. We have received your order details and payment confirmation. Our team is now preparing your curated pieces with care.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="font-mono px-3.5 py-1.5 bg-[#F6F0F4] border border-[#D5C2D7] text-[#8C5A7D] font-bold">
              Order ID: {lastOrder.orderNumber}
            </span>
            <span className="px-3.5 py-1.5 bg-[#F6F0F4] border border-[#D5C2D7] text-[#554052] font-medium flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#8C5A7D]" />
              <span>Est. Delivery: <strong>{lastOrder.estimatedDeliveryDate}</strong></span>
            </span>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-7 py-3 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#D5C2D7]" />
              <span>Go to Home Page</span>
            </button>

            <button
              onClick={() => {
                setActivePage('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white hover:bg-[#F6F0F4] border border-[#8C5A7D] text-[#8C5A7D] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Package className="w-4 h-4 text-[#8C5A7D]" />
              <span>View in "My Orders"</span>
            </button>

            <button
              onClick={() => {
                setActivePage('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#F6F0F4] hover:bg-[#D5C2D7] border border-[#D5C2D7] text-[#554052] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#A185A4]" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* 3. Order Details & Receipt */}
        <div className="bg-white p-6 sm:p-8 border border-[#D5C2D7] space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D5C2D7] text-xs">
            <div>
              <span className="text-[#A185A4] block">Estimated Delivery Date</span>
              <strong className="text-sm font-semibold text-[#8C5A7D]">
                {lastOrder.estimatedDeliveryDate}
              </strong>
            </div>
            <div>
              <span className="text-[#A185A4] block">Payment Method</span>
              <span
                className={`font-semibold uppercase text-[11px] ${
                  lastOrder.paymentStatus === 'PAID' ? 'text-[#8C5A7D]' : 'text-[#A185A4]'
                }`}
              >
                {lastOrder.paymentMethod === 'COD'
                  ? 'Cash on Delivery (Pending)'
                  : lastOrder.paymentMethod === 'ONLINE_UPI'
                  ? `Paid via UPI (${BRAND_CONFIG.payment.upiId})`
                  : 'Paid Online (Card)'}
              </span>
            </div>
            <div className="print:hidden">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 border border-[#D5C2D7] hover:bg-[#F6F0F4] text-[#554052] flex items-center gap-1.5 font-medium transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>

          {/* Items Purchased List */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-[#554052]">
              Garments in this Order ({lastOrder.items.length})
            </h3>
            <div className="divide-y divide-[#D5C2D7]">
              {lastOrder.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-4 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-14 h-16 object-cover border border-[#D5C2D7] shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-serif font-bold text-[#554052] text-sm">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-[#A185A4]">
                      Kurti Size: <strong className="text-[#8C5A7D]">{item.selectedSize}</strong> · Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-[#8C5A7D] tabular-nums">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="pt-4 border-t border-[#D5C2D7] space-y-2 text-xs text-[#554052]/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">₹{lastOrder.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {lastOrder.discount > 0 && (
              <div className="flex justify-between text-[#8C5A7D] font-medium">
                <span>Discount ({lastOrder.couponCode})</span>
                <span className="font-mono tabular-nums">-₹{lastOrder.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-mono tabular-nums">
                {lastOrder.shippingFee === 0 ? 'FREE' : `₹${lastOrder.shippingFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-[#D5C2D7] flex justify-between text-base font-bold text-[#554052]">
              <span className="font-serif">Total Paid / Payable</span>
              <span className="font-mono text-[#8C5A7D] tabular-nums">
                ₹{lastOrder.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Shipping Address Summary */}
          <div className="pt-4 border-t border-[#D5C2D7] text-xs space-y-1">
            <span className="text-[#A185A4] font-semibold uppercase tracking-wider block">
              Delivery Address:
            </span>
            <p className="font-semibold text-[#554052]">{lastOrder.shippingAddress.fullName}</p>
            <p className="text-[#554052]/80">
              {lastOrder.shippingAddress.addressLine}{lastOrder.shippingAddress.locality ? `, ${lastOrder.shippingAddress.locality}` : ''}, {lastOrder.shippingAddress.city},{' '}
              {lastOrder.shippingAddress.state} — {lastOrder.shippingAddress.pincode}
            </p>
            <p className="text-[#554052]/80">
              Phone: {lastOrder.shippingAddress.phone} | Email: {lastOrder.shippingAddress.email}
            </p>
          </div>
        </div>

        {/* 4. Follow-up Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden pt-2">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#D5C2D7]" />
              <span>Return to Home Page</span>
            </button>

            <button
              onClick={() => {
                setActivePage('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-[#F6F0F4] border border-[#D5C2D7] text-[#554052] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Package className="w-4 h-4 text-[#8C5A7D]" />
              <span>Track in My Orders</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <a
              href={customerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Receipt</span>
            </a>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-[#F6F0F4] border border-[#D5C2D7] text-[#554052] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#8C5A7D]" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
