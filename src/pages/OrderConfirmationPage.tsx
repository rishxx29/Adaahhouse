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
        <p className="font-serif text-xl font-bold text-[#292522]">No recent order found</p>
        <button
          onClick={() => setActivePage('shop')}
          className="px-6 py-2.5 bg-[#5B1E22] text-white text-xs uppercase tracking-wider font-semibold"
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
    <div className="bg-[#FAF7F2] py-12 sm:py-16 animate-in fade-in duration-300 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Success Banner */}
        <div className="bg-white p-8 sm:p-10 border border-[#E8DED2] text-center space-y-4 shadow-sm relative overflow-hidden">
          {/* Decorative luxury gradient top accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5B1E22] via-[#C9A76A] to-[#5B1E22]" />

          <div className="w-20 h-20 rounded-full bg-[#7A8061]/15 text-[#7A8061] flex items-center justify-center mx-auto shadow-inner ring-8 ring-[#7A8061]/5 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#7A8061]/10 border border-[#7A8061]/30 text-[#7A8061] text-[11px] font-bold uppercase tracking-widest rounded-full">
            <span>Payment Received · Order Confirmed</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#292522] tracking-tight">
            Order Placed Successfully!
          </h1>

          <p className="font-serif text-lg sm:text-xl text-[#5B1E22] font-semibold italic">
            Thank you for ordering from ADAAH HOUSE
          </p>

          <p className="text-xs sm:text-sm text-[#292522]/80 max-w-lg mx-auto leading-relaxed">
            Grace in every thread. We have received your order details and payment confirmation. Our master artisans and dispatch team are now preparing your handcrafted pieces with care.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="font-mono px-3.5 py-1.5 bg-[#FAF7F2] border border-[#E8DED2] text-[#5B1E22] font-bold">
              Order ID: {lastOrder.orderNumber}
            </span>
            <span className="px-3.5 py-1.5 bg-[#FAF7F2] border border-[#E8DED2] text-[#292522] font-medium flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#C9A76A]" />
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
              className="px-7 py-3 bg-[#5B1E22] hover:bg-[#421417] text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#C9A76A]" />
              <span>Go to Home Page</span>
            </button>

            <button
              onClick={() => {
                setActivePage('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white hover:bg-[#FAF7F2] border border-[#5B1E22] text-[#5B1E22] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Package className="w-4 h-4 text-[#5B1E22]" />
              <span>View in "My Orders"</span>
            </button>

            <button
              onClick={() => {
                setActivePage('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#FAF7F2] hover:bg-[#E8DED2] border border-[#E8DED2] text-[#292522] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#9E897A]" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>



        {/* 3. Order Details & Receipt */}
        <div className="bg-white p-6 sm:p-8 border border-[#E8DED2] space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DED2] text-xs">
            <div>
              <span className="text-[#9E897A] block">Estimated Delivery Date</span>
              <strong className="text-sm font-semibold text-[#5B1E22]">
                {lastOrder.estimatedDeliveryDate}
              </strong>
            </div>
            <div>
              <span className="text-[#9E897A] block">Payment Method</span>
              <span
                className={`font-semibold uppercase text-[11px] ${
                  lastOrder.paymentStatus === 'PAID' ? 'text-[#7A8061]' : 'text-[#C9A76A]'
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
                className="px-3 py-1.5 border border-[#E8DED2] hover:bg-[#FAF7F2] text-[#292522] flex items-center gap-1.5 font-medium transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>

          {/* Items Purchased List */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-[#292522]">
              Garments in this Order ({lastOrder.items.length})
            </h3>
            <div className="divide-y divide-[#E8DED2]">
              {lastOrder.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-4 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-14 h-16 object-cover border border-[#E8DED2] shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-serif font-bold text-[#292522] text-sm">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-[#9E897A]">
                      Kurti Size: <strong className="text-[#5B1E22]">{item.selectedSize}</strong> · Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-[#5B1E22] tabular-nums">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="pt-4 border-t border-[#E8DED2] space-y-2 text-xs text-[#292522]/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">₹{lastOrder.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {lastOrder.discount > 0 && (
              <div className="flex justify-between text-[#7A8061] font-medium">
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
            <div className="pt-2 border-t border-[#E8DED2] flex justify-between text-base font-bold text-[#292522]">
              <span className="font-serif">Total Paid / Payable</span>
              <span className="font-mono text-[#5B1E22] tabular-nums">
                ₹{lastOrder.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Shipping Address Summary */}
          <div className="pt-4 border-t border-[#E8DED2] text-xs space-y-1">
            <span className="text-[#9E897A] font-semibold uppercase tracking-wider block">
              Delivery Address:
            </span>
            <p className="font-semibold text-[#292522]">{lastOrder.shippingAddress.fullName}</p>
            <p className="text-[#292522]/80">
              {lastOrder.shippingAddress.addressLine}{lastOrder.shippingAddress.locality ? `, ${lastOrder.shippingAddress.locality}` : ''}, {lastOrder.shippingAddress.city},{' '}
              {lastOrder.shippingAddress.state} — {lastOrder.shippingAddress.pincode}
            </p>
            <p className="text-[#292522]/80">
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
              className="w-full sm:w-auto px-6 py-3 bg-[#5B1E22] hover:bg-[#421417] text-white text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#C9A76A]" />
              <span>Return to Home Page</span>
            </button>

            <button
              onClick={() => {
                setActivePage('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-[#FAF7F2] border border-[#E8DED2] text-[#292522] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Package className="w-4 h-4 text-[#5B1E22]" />
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
              className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-[#FAF7F2] border border-[#E8DED2] text-[#292522] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#5B1E22]" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
