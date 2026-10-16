import React, { useState } from 'react';
import { Mail, Instagram, MessageCircle, Heart, ArrowRight, ShieldCheck, Truck, RotateCcw, Check, Lock, Megaphone } from 'lucide-react';
import { HouseOfRiiLogo } from './AdaahLogo';
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
    showToast('Thank you for subscribing to HOUSE OF RII updates!');
  };

  return (
    <footer className="bg-[#554052] text-[#FAF7F2] border-t border-[#A185A4]/40 pt-10 sm:pt-16 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Top 3 Trust Markers Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pb-8 sm:pb-12 border-b border-white/10 text-xs">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#D5C2D7] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">Free Express Shipping</h4>
              <p className="text-[#D5C2D7]/80 mt-0.5 leading-relaxed">
                Enjoy complimentary express shipping across India on prepaid & COD orders.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-[#D5C2D7] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">7-Day Size Exchanges</h4>
              <p className="text-[#D5C2D7]/80 mt-0.5 leading-relaxed">
                Hassle-free reverse courier pickup if you require a different fit or alteration.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#D5C2D7] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">Authentic Curation</h4>
              <p className="text-[#D5C2D7]/80 mt-0.5 leading-relaxed">
                Handpicked ethnic wear, carefully selected fabrics, and timeless Indian craftsmanship.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Brand Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-4">
            <HouseOfRiiLogo variant="primary" theme="dark" showTagline={true} className="items-start max-w-[210px]" />
            <p className="text-xs text-[#D5C2D7]/85 leading-relaxed max-w-sm mt-3 font-body">
              HOUSE OF RII celebrates everyday Indian dressing with curated ready-made kurtas, sets, and festive ensembles. Tradition, styled your way.
            </p>
            {/* Contact & Social Redirect Icons */}
            <div className="pt-2 flex items-center gap-2.5 text-[#D5C2D7]">
              {/* WhatsApp Chat Icon */}
              <a
                href={BRAND_CONFIG.social.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Chat (+91 7357804296)"
                title="WhatsApp Chat: +91 7357804296"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#8C5A7D] text-[#D5C2D7] hover:text-white border border-white/15 flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.97.531 1.77.82 2.796.821 3.184 0 5.768-2.587 5.768-5.766.001-3.187-2.575-5.77-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                </svg>
              </a>

              {/* WhatsApp Channel Icon */}
              <a
                href={BRAND_CONFIG.social.whatsappChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join our WhatsApp Channel"
                title="WhatsApp Channel: Exclusive drops & updates"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#8C5A7D] text-[#D5C2D7] hover:text-white border border-white/15 flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 relative group"
              >
                <Megaphone className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#25D366] rounded-full border border-[#554052]" />
              </a>

              {/* Email Icon */}
              <a
                href={`mailto:${BRAND_CONFIG.contact.email}`}
                aria-label={`Email (${BRAND_CONFIG.contact.email})`}
                title={`Email: ${BRAND_CONFIG.contact.email}`}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#8C5A7D] text-[#D5C2D7] hover:text-white border border-white/15 flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105"
              >
                <Mail className="w-4 h-4" />
              </a>

              {/* Instagram Icon */}
              <a
                href={BRAND_CONFIG.social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram (@houseofrii)"
                title="Instagram: @houseofrii"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#8C5A7D] text-[#D5C2D7] hover:text-white border border-white/15 flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#D5C2D7]">
              Collections & Edits
            </h4>
            <ul className="space-y-2 text-xs text-[#D5C2D7]/80 font-medium">
              <li>
                <button
                  onClick={() => handleNav('shop', 'all')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shop All Kurtas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'bestseller')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  🔥 Bestsellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'Everyday Wear')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Everyday Wear
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'Festive & Wedding Edits')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Festive & Wedding Edits
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#D5C2D7]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#D5C2D7]/80 font-medium">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors cursor-pointer">
                  Our Story & Curation
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('policies')} className="hover:text-white transition-colors cursor-pointer">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('policies')} className="hover:text-white transition-colors cursor-pointer">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <a
                  href={BRAND_CONFIG.social.whatsappChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-[#D5C2D7]"
                  title="Follow HOUSE OF RII on WhatsApp Channel"
                >
                  <Megaphone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Channel</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#25D366]/20 text-[#25D366] font-semibold border border-[#25D366]/40 rounded-xs uppercase tracking-wider">
                    Join
                  </span>
                </a>
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
                  className="hover:text-[#D5C2D7] transition-colors flex items-center gap-1.5 text-[#D5C2D7]/90 cursor-pointer"
                  title="HOUSE OF RII Owner Studio"
                >
                  <Lock className="w-3.5 h-3.5 text-[#A185A4]" />
                  <span>Owner Studio {isOwnerLoggedIn ? '(Active)' : '(Passcode Login)'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#D5C2D7]">
              Tradition in Your Inbox
            </h4>
            <p className="text-xs text-[#D5C2D7]/75 leading-relaxed">
              Subscribe for new arrival alerts, festive curations, and private discount codes.
            </p>
            {isSubscribed ? (
              <div className="p-3 bg-white/10 border border-[#A185A4] text-xs text-white flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#A185A4]" />
                <span>You're on the HOUSE OF RII list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder:text-white/50 outline-none focus:border-[#A185A4]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#8C5A7D] hover:bg-[#A185A4] text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Join the Family
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D5C2D7]/60 text-center sm:text-left">
          <p className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>© {new Date().getFullYear()} HOUSE OF RII. All rights reserved. Tradition, Styled Your Way.</span>
            <button
              onClick={() => {
                if (isOwnerLoggedIn) {
                  handleNav('admin');
                } else {
                  setIsOwnerLoginModalOpen(true);
                }
              }}
              className="text-white/20 hover:text-[#A185A4] transition-colors p-1 cursor-pointer"
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
