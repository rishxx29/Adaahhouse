import React, { useState } from 'react';
import { Mail, MessageCircle, Heart, ArrowRight, ShieldCheck, Truck, RotateCcw, Check, Lock } from 'lucide-react';
import { AdaahLogo } from './AdaahLogo';
import { BRAND_CONFIG } from '../config/brand';
import { useStore, ActivePage } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const {
    setActivePage,
    setSelectedCollectionFilter,
    showToast,
    isOwnerLoggedIn,
    setIsOwnerLoginModalOpen,
  } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNav = (page: ActivePage, collectionFilter?: string) => {
    setActivePage(page);
    if (collectionFilter) {
      setSelectedCollectionFilter(collectionFilter);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribed(true);
    showToast('Thank you for subscribing to ADAAH HOUSE whispers!');
  };

  return (
    <footer className="bg-[#292522] text-[#FAF7F2] border-t border-[#C9A76A]/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top 3 Trust Markers Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-white/10 text-xs">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#C9A76A] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">Free Express Shipping</h4>
              <p className="text-[#E8DED2]/70 mt-0.5 leading-relaxed">
                Enjoy complimentary shipping on all prepaid & COD orders above ₹{BRAND_CONFIG.shipping.freeShippingThreshold}.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-[#C9A76A] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">7-Day Size Exchanges</h4>
              <p className="text-[#E8DED2]/70 mt-0.5 leading-relaxed">
                Hassle-free reverse courier pickup if you require a different fit or alteration.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#C9A76A] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">Curated Quality Inspected</h4>
              <p className="text-[#E8DED2]/70 mt-0.5 leading-relaxed">
                Every kurti lot is individually checked for stitching, fabric feel, and standard Indian sizing.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <AdaahLogo variant="horizontal" theme="dark" showTagline={true} />
            <p className="text-xs text-[#E8DED2]/80 leading-relaxed max-w-sm mt-3">
              ADAAH HOUSE celebrates everyday Indian dressing with curated ready-made kurtis and festive ensembles. Thoughtfully selected, beautifully packaged, and delivered across India.
            </p>
            <div className="pt-2 text-xs space-y-1 text-[#E8DED2]/70">
              <p className="flex items-center gap-2">
                <span className="text-[#C9A76A]">WhatsApp:</span>
                <a
                  href={BRAND_CONFIG.social.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline font-mono"
                >
                  +91 {BRAND_CONFIG.contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#C9A76A]">Email:</span>
                <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="hover:text-white underline">
                  {BRAND_CONFIG.contact.email}
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#C9A76A]">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#E8DED2]/80 font-medium">
              <li>
                <button
                  onClick={() => handleNav('shop', 'all')}
                  className="hover:text-white transition-colors"
                >
                  Shop All Kurtis
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'Everyday Elegance')}
                  className="hover:text-white transition-colors"
                >
                  Everyday Elegance
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'Festive Edit')}
                  className="hover:text-white transition-colors"
                >
                  Festive Edit
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'Office & College Wear')}
                  className="hover:text-white transition-colors"
                >
                  Office & College Wear
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#C9A76A]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#E8DED2]/80 font-medium">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  Our Story & Curation
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('policies')} className="hover:text-white transition-colors">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('policies')} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </button>
              </li>
              <li className="pt-1.5 border-t border-white/10">
                <button
                  onClick={() => {
                    if (isOwnerLoggedIn) {
                      handleNav('admin');
                    } else {
                      setIsOwnerLoginModalOpen(true);
                    }
                  }}
                  className="hover:text-[#C9A76A] transition-colors flex items-center gap-1.5 text-[#E8DED2]/90"
                  title="ADAAH HOUSE Owner Studio"
                >
                  <Lock className="w-3.5 h-3.5 text-[#C9A76A]" />
                  <span>Owner Studio {isOwnerLoggedIn ? '(Active)' : '(Passcode Login)'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#C9A76A]">
              Grace in Your Inbox
            </h4>
            <p className="text-xs text-[#E8DED2]/75 leading-relaxed">
              Subscribe for new arrival alerts, festive curations, and private discount codes.
            </p>
            {isSubscribed ? (
              <div className="p-3 bg-white/10 border border-[#7A8061] text-xs text-[#E8DED2] flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#7A8061]" />
                <span>You're on the ADAAH HOUSE list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder:text-[#E8DED2]/50 outline-none focus:border-[#C9A76A]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#5B1E22] hover:bg-[#74272D] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Join the Family
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8DED2]/60">
          <p className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} ADAAH HOUSE. All rights reserved. Grace in Every Thread.</span>
            {/* Discreet Owner Trigger: Hidden from ordinary shoppers */}
            <button
              onClick={() => {
                if (isOwnerLoggedIn) {
                  handleNav('admin');
                } else {
                  setIsOwnerLoginModalOpen(true);
                }
              }}
              className="text-white/20 hover:text-[#C9A76A] transition-colors p-1"
              title={isOwnerLoggedIn ? "Open Owner Studio" : "Owner Verification Portal"}
              aria-label="Owner Portal"
            >
              <Lock className="w-2.5 h-2.5 opacity-30 hover:opacity-100" />
            </button>
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Payments accepted: UPI · Cards · NetBanking · COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
