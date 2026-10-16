import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Feather, Flower2, Truck, Heart } from 'lucide-react';
import heroPinkSuit from '../assets/images/hero-pink-suit.jpg';
import { useStore } from '../context/StoreContext';

export const HeroSection: React.FC = () => {
  const { setActivePage, setSelectedCollectionFilter, setSelectedCategoryFilter } = useStore();

  const handleShopNewIn = () => {
    setSelectedCollectionFilter('all');
    setSelectedCategoryFilter('all');
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative bg-[#F6F0F4] border-b border-[#D5C2D7] overflow-hidden">
      {/* 1. Main Editorial Hero Banner matching Reference Image */}
      <section className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center justify-between">
        {/* Left Decorative Botanical Sketch Illustration */}
        <div className="absolute left-0 top-0 bottom-0 pointer-events-none opacity-25 sm:opacity-35 hidden sm:block w-36 lg:w-48 overflow-hidden">
          <svg viewBox="0 0 160 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-[#8C5A7D]">
            {/* Upper Leaf Stem */}
            <path d="M10 20 Q50 80 20 150 Q-10 220 30 300 Q60 380 15 480" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M22 60 C45 40 70 55 60 75 C45 80 30 75 22 60 Z" strokeWidth="1.2" fill="#8C5A7D" fillOpacity="0.04" />
            <path d="M28 110 C55 95 75 115 65 130 C48 135 35 125 28 110 Z" strokeWidth="1.2" fill="#8C5A7D" fillOpacity="0.04" />
            <path d="M12 180 C-15 160 -5 140 10 155 C20 170 18 178 12 180 Z" strokeWidth="1.2" fill="#8C5A7D" fillOpacity="0.04" />
            <path d="M20 240 C50 220 70 235 60 255 C45 260 30 250 20 240 Z" strokeWidth="1.2" fill="#8C5A7D" fillOpacity="0.04" />
            <path d="M28 320 C58 300 78 318 68 338 C50 342 36 332 28 320 Z" strokeWidth="1.2" fill="#8C5A7D" fillOpacity="0.04" />
            <path d="M35 390 C65 375 80 395 70 410 C52 415 42 402 35 390 Z" strokeWidth="1.2" fill="#8C5A7D" fillOpacity="0.04" />
          </svg>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={handleShopNewIn}
          className="absolute left-3 sm:left-6 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white border border-[#D5C2D7] text-[#554052] hover:text-[#8C5A7D] flex items-center justify-center shadow-xs transition-all cursor-pointer backdrop-blur-xs"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={handleShopNewIn}
          className="absolute right-3 sm:right-6 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white border border-[#D5C2D7] text-[#554052] hover:text-[#8C5A7D] flex items-center justify-center shadow-xs transition-all cursor-pointer backdrop-blur-xs"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Block */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left pt-2 lg:pt-0">
            {/* Spaced small-caps kicker */}
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#8C5A7D] font-semibold">
              TRADITIONAL WEAR FOR EVERY YOU
            </p>

            {/* Display Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[62px] text-[#554052] leading-[1.08] tracking-tight [text-wrap:balance]">
              Tradition <br />
              <span className="italic font-normal text-[#8C5A7D]">Styled Your Way</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-xs sm:text-sm text-[#554052]/80 max-w-md mx-auto lg:mx-0 font-normal leading-relaxed">
              Elegant Kurtas, Kurta Sets &amp; Co-ords for Everyday and Every Occasion.
            </p>

            {/* CTA Button */}
            <div className="pt-2 flex justify-center lg:justify-start">
              <button
                onClick={handleShopNewIn}
                className="px-8 py-3.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center gap-2 group shadow-sm cursor-pointer"
              >
                <span>SHOP NEW IN</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Center-Right: Model in Pink Suit Set with Grace in Every Thread Quote */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end relative">
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/11] rounded-xs overflow-hidden shadow-xs border border-[#D5C2D7]/80 bg-white/50 group">
              <img
                src={heroPinkSuit}
                alt="House of Rii Pink Embroidered Kurta Set Editorial"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-102"
              />

              {/* Soft radial vignette blending to lilac on edges */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F6F0F4]/40 via-transparent to-[#F6F0F4]/20 pointer-events-none" />

              {/* Grace in Every Thread floating quote on the right edge */}
              <div className="absolute right-3 sm:right-5 top-6 sm:top-8 text-right hidden sm:block bg-white/60 backdrop-blur-xs p-3 rounded-xs border border-white/60">
                <p className="font-serif italic text-sm sm:text-base text-[#554052] leading-tight">
                  Grace <br />
                  in Every <br />
                  Thread
                </p>
                <div className="h-[1.5px] w-6 bg-[#8C5A7D] ml-auto mt-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Benefits Strip (4 Pillars from visual reference) */}
      <section className="bg-white border-t border-[#D5C2D7] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D5C2D7]/60">
          {/* Pillar 1: Premium Fabrics */}
          <div className="flex items-center gap-3.5 p-2 sm:px-4 justify-start sm:justify-center">
            <div className="w-10 h-10 rounded-full bg-[#F6F0F4] border border-[#D5C2D7] flex items-center justify-center text-[#8C5A7D] shrink-0">
              <Feather className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#554052]">
                PREMIUM FABRICS
              </h4>
              <p className="text-[11px] text-[#A185A4]">for everyday comfort</p>
            </div>
          </div>

          {/* Pillar 2: Timeless Designs */}
          <div className="flex items-center gap-3.5 p-2 sm:px-4 justify-start sm:justify-center pt-3 sm:pt-2">
            <div className="w-10 h-10 rounded-full bg-[#F6F0F4] border border-[#D5C2D7] flex items-center justify-center text-[#8C5A7D] shrink-0">
              <Flower2 className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#554052]">
                TIMELESS DESIGNS
              </h4>
              <p className="text-[11px] text-[#A185A4]">rooted in tradition</p>
            </div>
          </div>

          {/* Pillar 3: Pan India Shipping */}
          <div className="flex items-center gap-3.5 p-2 sm:px-4 justify-start sm:justify-center pt-3 sm:pt-2">
            <div className="w-10 h-10 rounded-full bg-[#F6F0F4] border border-[#D5C2D7] flex items-center justify-center text-[#8C5A7D] shrink-0">
              <Truck className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#554052]">
                PAN INDIA SHIPPING
              </h4>
              <p className="text-[11px] text-[#A185A4]">safe and reliable</p>
            </div>
          </div>

          {/* Pillar 4: Made For You */}
          <div className="flex items-center gap-3.5 p-2 sm:px-4 justify-start sm:justify-center pt-3 sm:pt-2">
            <div className="w-10 h-10 rounded-full bg-[#F6F0F4] border border-[#D5C2D7] flex items-center justify-center text-[#8C5A7D] shrink-0">
              <Heart className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#554052]">
                MADE FOR YOU
              </h4>
              <p className="text-[11px] text-[#A185A4]">with love</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
