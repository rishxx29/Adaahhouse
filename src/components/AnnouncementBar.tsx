import React from 'react';
import { Instagram, Youtube, Headphones } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { useStore } from '../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { setActivePage } = useStore();

  return (
    <div className="bg-[#8C5A7D] text-[#F6F0F4] text-[11px] py-2 px-4 border-b border-[#D5C2D7]/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left filler for desktop balance */}
        <div className="hidden lg:block w-1/4 text-[10px] tracking-widest uppercase text-[#D5C2D7]/90 font-medium">
          HOUSE OF RII · ETHNIC BOUTIQUE
        </div>

        {/* Center promotional message matching reference image */}
        <div className="flex-1 text-center font-medium tracking-[0.16em] uppercase text-[10px] sm:text-[11px] flex items-center justify-center gap-2 text-white">
          <span className="text-[#D5C2D7] text-xs">✧</span>
          <span>FREE SHIPPING ON ALL ORDERS ABOVE ₹1,999</span>
          <span className="text-[#D5C2D7] text-xs">✧</span>
        </div>

        {/* Right side: Follow Us + Socials | Help & Support */}
        <div className="hidden sm:flex items-center justify-end gap-3 text-[11px] text-[#D5C2D7] w-auto lg:w-1/4">
          <span className="text-[10px] uppercase tracking-wider text-[#D5C2D7]/90">Follow Us</span>
          <div className="flex items-center gap-2">
            <a
              href={BRAND_CONFIG.social.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D5C2D7] hover:text-white transition-colors"
              title="Instagram"
              aria-label="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D5C2D7] hover:text-white transition-colors font-bold text-xs"
              title="Pinterest"
              aria-label="Pinterest"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D5C2D7] hover:text-white transition-colors"
              title="YouTube"
              aria-label="YouTube"
            >
              <Youtube className="w-3.5 h-3.5" />
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
