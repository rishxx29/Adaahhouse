import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I choose the correct kurti size?',
      a: 'We provide an accurate garment measurements chart for sizes S, M, L, XL, and XXL on each product page and via the "Size Chart" button. We measure our curated kurtis flat across the bust, waist, and hip. For Indian ethnic wear comfort, if your measurement falls between two sizes, we recommend choosing the larger size.',
    },
    {
      q: 'Can I place an order directly on WhatsApp?',
      a: `Absolutely! You can click the "Order via WhatsApp" button on any kurti or message us directly at +91 ${BRAND_CONFIG.contact.phone}. Simply share the screenshot or product name, your desired size (S to XXL), and your delivery address.`,
    },
    {
      q: 'What are the delivery timelines and charges?',
      a: `We provide Free Express Shipping across all Indian pin codes on orders of ₹${BRAND_CONFIG.shipping.freeShippingThreshold} and above. Orders below ₹${BRAND_CONFIG.shipping.freeShippingThreshold} carry a nominal flat delivery fee of ₹${BRAND_CONFIG.shipping.standardShippingFee}. Standard delivery takes 3 to 5 business days.`,
    },
    {
      q: 'Does HOUSE OF RII manufacture its own garments?',
      a: 'No. HOUSE OF RII is a curated ethnic wear boutique. We carefully handpick, inspect, and retail ready-made kurtis, sets, and co-ords from premier wholesale fashion suppliers across India, bringing you exceptional designs at honest prices.',
    },
    {
      q: 'What is your exchange and return policy?',
      a: 'We offer a 7-day hassle-free exchange policy if you need a different size or if an item arrives with any defect. Garments must remain unworn, unwashed, and with the official HOUSE OF RII hang tag attached.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitted(true);
    showToast('Your message has been received. Our team will contact you shortly.');
  };

  return (
    <div className="bg-[#F6F0F4] py-12 sm:py-16 animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold">
            Customer Care & Queries
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#554052]">
            We're Here to Help
          </h1>
          <p className="text-xs sm:text-sm text-[#554052]/80">
            Have a question about kurti sizing, wholesale lots, or an existing order? Reach out anytime.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-white p-6 border border-[#D5C2D7] flex flex-col justify-between hover:border-[#25D366] transition-colors shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#554052]">WhatsApp Concierge</h3>
              <p className="text-xs text-[#554052]/80 leading-relaxed">
                Fastest response for sizing advice, photo queries, and direct ordering.
              </p>
              <p className="font-mono text-sm font-semibold text-[#554052]">
                +91 {BRAND_CONFIG.contact.phone}
              </p>
            </div>
            <a
              href={BRAND_CONFIG.social.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center py-2.5 px-4 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#20ba59] transition-colors"
            >
              Open WhatsApp Chat
            </a>
          </div>

          {/* Email Support */}
          <div className="bg-white p-6 border border-[#D5C2D7] flex flex-col justify-between hover:border-[#8C5A7D] transition-colors shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#8C5A7D]/10 flex items-center justify-center text-[#8C5A7D]">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#554052]">Email Support</h3>
              <p className="text-xs text-[#554052]/80 leading-relaxed">
                For order tracking queries, exchanges, and wholesale inquiries.
              </p>
              <p className="text-xs font-semibold text-[#8C5A7D]">
                {BRAND_CONFIG.contact.email}
              </p>
            </div>
            <a
              href={`mailto:${BRAND_CONFIG.contact.email}`}
              className="mt-6 inline-flex items-center justify-center py-2.5 px-4 bg-[#8C5A7D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#554052] transition-colors"
            >
              Send an Email
            </a>
          </div>

          {/* Operating Hours & Location */}
          <div className="bg-white p-6 border border-[#D5C2D7] flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#A185A4]/20 flex items-center justify-center text-[#8C5A7D]">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#554052]">Boutique Hub</h3>
              <p className="text-xs text-[#554052]/80 leading-relaxed">
                Operating out of Rajasthan, shipping across all states of India.
              </p>
              <div className="text-xs text-[#A185A4] space-y-0.5 pt-1">
                <p>Support Hours: {BRAND_CONFIG.contact.supportHours}</p>
                <p>Instagram: {BRAND_CONFIG.social.instagram}</p>
              </div>
            </div>
            <div className="mt-6 text-[11px] text-[#8C5A7D] font-medium py-2 px-3 bg-[#F6F0F4] border border-[#D5C2D7]">
              ✓ Ready for pan-India courier dispatch
            </div>
          </div>
        </div>

        {/* Contact Form & FAQ Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 border border-[#D5C2D7] shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#554052] mb-1">
              Send us a Message
            </h3>
            <p className="text-xs text-[#A185A4] mb-6">
              Fill in your details and our team will get back to you within 24 hours.
            </p>

            {isSubmitted ? (
              <div className="p-8 text-center bg-[#F6F0F4] border border-[#A185A4]/40 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#8C5A7D] mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#554052]">Thank You!</h4>
                <p className="text-xs text-[#554052]/80">
                  Your message has been received. We will respond to <strong>{email}</strong> shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-3 text-xs text-[#8C5A7D] underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-[#554052] mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Ananya Mehra"
                    className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 outline-none focus:border-[#8C5A7D] text-[#554052]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[#554052] mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 outline-none focus:border-[#8C5A7D] text-[#554052]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#554052] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 outline-none focus:border-[#8C5A7D] text-[#554052]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#554052] mb-1">Order Number (Optional)</label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. RII-2026-1042"
                    className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 outline-none focus:border-[#8C5A7D] text-[#554052]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#554052] mb-1">Message *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="Tell us about your sizing question or inquiry..."
                    className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 outline-none focus:border-[#8C5A7D] text-[#554052]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#8C5A7D] hover:bg-[#554052] text-white uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-[#D5C2D7]" />
                  <span>Submit Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Frequently Asked Questions */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#554052] mb-1">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-[#A185A4] mb-4">
              Quick answers about shipping, sizing, and the brand.
            </p>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="bg-white border border-[#D5C2D7] transition-colors shadow-xs">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full text-left p-4 flex items-center justify-between gap-3 text-xs font-semibold text-[#554052]"
                    >
                      <span className="font-serif text-sm font-semibold">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#8C5A7D] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-[#554052]/80 leading-relaxed border-t border-[#D5C2D7]/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
