import { Instagram, Megaphone, MessageCircle, Headphones } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { useStore } from '../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { setActivePage } = useStore();

  return (
    <div className="bg-[#A27E8C] text-white text-[10px] py-1.5 px-4 border-b border-[#D5C2D7]/20 select-none">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Left balance placeholder */}
        <div className="hidden lg:block w-1/4" />

        {/* Center promotional message matching reference image */}
        <div className="flex-1 text-center font-medium tracking-[0.18em] uppercase text-[10px] sm:text-[10.5px] flex items-center justify-center gap-2 text-white">
          <span className="text-white/80 text-xs">✧</span>
          <span>FREE SHIPPING ON ALL ORDERS ABOVE ₹1,999</span>
          <span className="text-white/80 text-xs">✧</span>
        </div>

        {/* Right side: Follow Us + Socials | Help & Support */}
        <div className="hidden sm:flex items-center justify-end gap-3 text-[10px] text-white/95 w-auto lg:w-1/4">
          <span className="uppercase tracking-wider text-white/90">Follow Us</span>
          <div className="flex items-center gap-2.5">
            <a
              href={BRAND_CONFIG.social.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D5C2D7] hover:text-white transition-colors"
              title="Instagram: @houseofrii"
              aria-label="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href={BRAND_CONFIG.social.whatsappChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D5C2D7] hover:text-white transition-colors flex items-center gap-0.5"
              title="WhatsApp Channel (Exclusive Drops)"
              aria-label="WhatsApp Channel"
            >
              <Megaphone className="w-3.5 h-3.5" />
            </a>
            <a
              href={BRAND_CONFIG.social.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D5C2D7] hover:text-white transition-colors"
              title="WhatsApp Chat (+91 7357804296)"
              aria-label="WhatsApp Chat"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          </div>

          <span className="text-white/20">|</span>

          <button
            onClick={() => {
              setActivePage('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1 text-[#D5C2D7] hover:text-white transition-colors cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5 text-[#D5C2D7]" />
            <span className="font-medium">Help & Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};
