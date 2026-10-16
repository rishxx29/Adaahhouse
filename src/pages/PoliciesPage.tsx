import React, { useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, FileText, CheckCircle } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';

type PolicyTab = 'shipping' | 'returns' | 'cancellation' | 'terms';

export const PoliciesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PolicyTab>('shipping');

  return (
    <div className="bg-[#F3E9EB] py-12 sm:py-16 animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold">
            Store Guidelines
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#554052]">
            Store Policies & Customer Care
          </h1>
          <p className="text-xs text-[#A185A4]">
            Transparent terms designed to ensure a confident, graceful shopping experience.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap p-1 bg-[#F3E9EB] border border-[#D5C2D7]">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'shipping'
                ? 'bg-[#8C5A7D] text-white shadow-xs'
                : 'text-[#554052] hover:text-[#8C5A7D]'
            }`}
          >
            Shipping & Delivery
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'returns'
                ? 'bg-[#8C5A7D] text-white shadow-xs'
                : 'text-[#554052] hover:text-[#8C5A7D]'
            }`}
          >
            Returns & Exchanges
          </button>
          <button
            onClick={() => setActiveTab('cancellation')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'cancellation'
                ? 'bg-[#8C5A7D] text-white shadow-xs'
                : 'text-[#554052] hover:text-[#8C5A7D]'
            }`}
          >
            Cancellation & Refunds
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'terms'
                ? 'bg-[#8C5A7D] text-white shadow-xs'
                : 'text-[#554052] hover:text-[#8C5A7D]'
            }`}
          >
            Terms & Privacy
          </button>
        </div>

        {/* Policy Content Body */}
        <div className="bg-[#F3E9EB] p-6 sm:p-10 border border-[#D5C2D7] shadow-xs text-xs sm:text-sm text-[#554052]/85 leading-relaxed space-y-6">
          {activeTab === 'shipping' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-3 border-b border-[#D5C2D7]">
                <Truck className="w-5 h-5 text-[#8C5A7D]" />
                <h3 className="font-serif text-xl font-bold text-[#554052]">
                  Shipping & Delivery Policy
                </h3>
              </div>
              <p>
                At <strong>HOUSE OF RII</strong>, we strive to dispatch every curated garment with utmost care and speed across India.
              </p>
              <h4 className="font-serif text-base font-semibold text-[#8C5A7D] pt-2">
                1. Delivery Timelines
              </h4>
              <p>
                Orders are processed and dispatched within 24 to 48 hours of order confirmation. Standard courier delivery takes between <strong>3 to 5 business days</strong> depending on your delivery PIN code and city zone.
              </p>
              <h4 className="font-serif text-base font-semibold text-[#8C5A7D] pt-2">
                2. Shipping Rates
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Free Express Shipping:</strong> Available on all orders with a cart subtotal of <strong>₹{BRAND_CONFIG.shipping.freeShippingThreshold}</strong> and above.
                </li>
                <li>
                  <strong>Standard Shipping:</strong> A flat delivery charge of <strong>₹{BRAND_CONFIG.shipping.standardShippingFee}</strong> applies to orders below ₹{BRAND_CONFIG.shipping.freeShippingThreshold}.
                </li>
              </ul>
              <h4 className="font-serif text-base font-semibold text-[#8C5A7D] pt-2">
                3. Order Tracking
              </h4>
              <p>
                Once your parcel is handed over to our courier partners (Delhivery / BlueDart / XpressBees), you will receive a tracking link via SMS, WhatsApp, and email.
              </p>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-3 border-b border-[#D5C2D7]">
                <RotateCcw className="w-5 h-5 text-[#8C5A7D]" />
                <h3 className="font-serif text-xl font-bold text-[#554052]">
                  Returns & Size Exchanges
                </h3>
              </div>
              <p>
                We want you to love your HOUSE OF RII kurti. If an item does not fit comfortably or is not to your complete liking, we provide a structured exchange policy.
              </p>
              <h4 className="font-serif text-base font-semibold text-[#8C5A7D] pt-2">
                1. 7-Day Exchange Window
              </h4>
              <p>
                You may request an exchange within <strong>7 days</strong> from the date of delivery for sizing issues or defects.
              </p>
              <h4 className="font-serif text-base font-semibold text-[#8C5A7D] pt-2">
                2. Garment Condition Criteria
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Garment must be unworn, unwashed, and without perfume or cosmetic stains.</li>
                <li>The official <strong>HOUSE OF RII brand hang tag</strong> must remain intact and securely attached.</li>
                <li>Items must be returned in the original packaging tissue and box.</li>
              </ul>
              <h4 className="font-serif text-base font-semibold text-[#8C5A7D] pt-2">
                3. How to Initiate an Exchange
              </h4>
              <p>
                Send a message to our WhatsApp team at <strong>+91 {BRAND_CONFIG.contact.phone}</strong> or email <strong>{BRAND_CONFIG.contact.email}</strong> with your Order ID and photo of the item. We will arrange a reverse pickup from your doorstep.
              </p>
            </div>
          )}

          {activeTab === 'cancellation' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-3 border-b border-[#D5C2D7]">
                <ShieldCheck className="w-5 h-5 text-[#8C5A7D]" />
                <h3 className="font-serif text-xl font-bold text-[#554052]">
                  Cancellation & Refund Policy
                </h3>
              </div>
              <p>
                Orders may be cancelled free of charge before they are handed over to our dispatch courier partner (typically within 12 hours of placing the order).
              </p>
              <h4 className="font-serif text-base font-semibold text-[#8C5A7D] pt-2">
                1. Order Cancellation Process
              </h4>
              <p>
                To cancel an unfulfilled order, please reach out via WhatsApp at <strong>{BRAND_CONFIG.contact.phone}</strong> with your order number. If the order has already shipped, it cannot be cancelled in transit but may be exchanged upon arrival.
              </p>
              <h4 className="font-serif text-base font-semibold text-[#8C5A7D] pt-2">
                2. Refund Settlement
              </h4>
              <p>
                Approved refunds for prepaid orders will be processed back to the original payment source (UPI account / Card) within <strong>5 to 7 working days</strong> following verification.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-3 border-b border-[#D5C2D7]">
                <FileText className="w-5 h-5 text-[#8C5A7D]" />
                <h3 className="font-serif text-xl font-bold text-[#554052]">
                  Terms of Service & Privacy
                </h3>
              </div>
              <p>
                Welcome to HOUSE OF RII. By browsing or purchasing from our store, you agree to our terms of service and responsible data privacy policy.
              </p>
              <h4 className="font-serif text-base font-semibold text-[#8C5A7D] pt-2">
                1. Product Representation & Curation
              </h4>
              <p>
                We source ready-made kurtis and ethnic wear from established wholesale manufacturers. All fabric compositions and garment measurements (S, M, L, XL, XXL) are inspected directly. Minor color variations may occur due to studio lighting differences and monitor color rendering.
              </p>
              <h4 className="font-serif text-base font-semibold text-[#8C5A7D] pt-2">
                2. Customer Privacy
              </h4>
              <p>
                We collect your name, phone number, shipping address, and email strictly for the fulfillment of orders and delivery communication. We never sell or distribute your private data to third-party marketing brokers.
              </p>
              <h4 className="font-serif text-base font-semibold text-[#8C5A7D] pt-2">
                3. Grievance Redressal
              </h4>
              <p>
                For any concerns, feedback, or grievance matters, please contact: <br />
                <strong>Grievance Officer:</strong> Customer Care Lead, HOUSE OF RII <br />
                <strong>Email:</strong> {BRAND_CONFIG.contact.email} <br />
                <strong>WhatsApp / Phone:</strong> +91 {BRAND_CONFIG.contact.phone}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
