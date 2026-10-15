import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#5B1E22] text-[#FAF7F2] text-xs py-2 px-4 border-b border-[#C9A76A]/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left note */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] tracking-wider uppercase text-[#E8DED2]">
          <span className="text-[#C9A76A]">✦</span>
          <span>Grace In Every Thread</span>
        </div>

        {/* Center promotional message */}
        <div className="flex-1 text-center font-medium tracking-wide flex items-center justify-center gap-2 text-[11px] sm:text-xs">
          <span>Free Express Shipping across India on All Orders</span>
          <span className="hidden md:inline text-[#C9A76A]">• Use code <strong className="text-white tracking-wider">ADAAH10</strong> for 10% off</span>
        </div>

        {/* Right WhatsApp support */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
          <a
            href={BRAND_CONFIG.social.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#E8DED2] hover:text-[#C9A76A] transition-colors"
            title="Chat with styling assistant on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#C9A76A]" />
            <span className="font-medium">WhatsApp Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};
