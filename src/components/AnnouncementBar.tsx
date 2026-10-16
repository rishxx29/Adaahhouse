import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#554052] text-[#F6F0F4] text-xs py-2 px-4 border-b border-[#D5C2D7]/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left note */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] tracking-wider uppercase text-[#D5C2D7]">
          <span className="text-[#A185A4]">✦</span>
          <span>Tradition, Styled Your Way.</span>
        </div>

        {/* Center promotional message */}
        <div className="flex-1 text-center font-medium tracking-wide flex items-center justify-center gap-2 text-[11px] sm:text-xs">
          <span>Free Express Shipping across India on All Orders</span>
          <span className="hidden md:inline text-[#D5C2D7]">• Use code <strong className="text-white tracking-wider">RII10</strong> for 10% off</span>
        </div>

        {/* Right WhatsApp support */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
          <a
            href={BRAND_CONFIG.social.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#D5C2D7] hover:text-white transition-colors"
            title="Chat with styling assistant on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#D5C2D7]" />
            <span className="font-medium">WhatsApp Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};
