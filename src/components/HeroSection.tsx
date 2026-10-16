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
    <div className="relative bg-[#F3E9EB] border-b border-[#D5C2D7] overflow-hidden select-none">
      {/* 1. Main Editorial Hero Banner matching attached reference image */}
      <section className="relative w-full aspect-[2048/682] min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] xl:min-h-[420px] overflow-hidden bg-[#E6D8D7]">
        {/* Full-bleed 2048px Ultra-HD Panorama Reference Background */}
        <img
          src="/hero_panorama_hd.jpg?v=5"
          alt="HOUSE OF RII — Tradition Styled Your Way"
          className="w-full h-full object-cover object-right sm:object-center select-none pointer-events-none"
        />

        {/* Crisp Vector Typography & Content (Left side, pixel-aligned with reference) */}
        <div className="absolute inset-y-0 left-0 right-0 max-w-[1440px] mx-auto px-3 min-[360px]:px-6 sm:px-10 lg:px-16 flex items-center pointer-events-none">
          <div className="w-[92%] min-[420px]:w-[80%] sm:w-[60%] lg:w-[48%] pointer-events-auto pl-2 min-[360px]:pl-4 sm:pl-6 lg:pl-10">
            {/* Small caps kicker */}
            <p className="text-[8.5px] min-[360px]:text-[9.5px] sm:text-[11px] lg:text-[11.5px] uppercase tracking-[0.24em] min-[360px]:tracking-[0.28em] text-[#8C5A7D] font-medium mb-1 sm:mb-2.5">
              TRADITIONAL WEAR FOR EVERY YOU
            </p>

            {/* Display Headline: Tradition (italic) Styled Your Way (regular) */}
            <h1 className="font-serif text-[24px] min-[360px]:text-[28px] min-[420px]:text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-[#554052] leading-[1.08] tracking-tight [text-wrap:balance]">
              <span className="italic font-normal">Tradition</span> <br />
              <span className="font-normal">Styled Your Way</span>
            </h1>

            {/* Supporting Description */}
            <p className="font-serif italic text-[11px] min-[360px]:text-xs sm:text-sm lg:text-[14px] text-[#554052]/85 max-w-sm sm:max-w-md mt-1.5 sm:mt-3 leading-relaxed">
              Elegant Kurtas, Kurta Sets &amp; Co-ords <br className="hidden sm:inline" />
              for Everyday and Every Occasion.
            </p>

            {/* Signature Plum CTA Button */}
            <div className="mt-3 sm:mt-5 lg:mt-6">
              <button
                onClick={handleShopNewIn}
                className="px-4 min-[360px]:px-6 sm:px-7 py-2 sm:py-2.5 sm:py-3 bg-[#7D4E68] hover:bg-[#554052] text-white text-[10px] min-[360px]:text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] min-[360px]:tracking-[0.2em] font-semibold transition-all duration-300 flex items-center gap-1.5 sm:gap-2 group shadow-xs cursor-pointer"
              >
                <span>SHOP NEW IN</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Grace in Every Thread Quote (Right edge of model) */}
        <div className="absolute right-4 sm:right-10 lg:right-16 top-1/2 -translate-y-1/2 text-right pointer-events-none select-none hidden md:block">
          <p className="font-serif italic text-base sm:text-lg lg:text-2xl text-white/95 leading-tight drop-shadow-xs">
            Grace <br />
            in Every <br />
            Thread
          </p>
          <div className="h-[1.5px] w-8 sm:w-10 bg-white/85 ml-auto mt-2" />
        </div>

        {/* Carousel Prev Button (Only 1 Single Arrow on Left) */}
        <button
          onClick={handleShopNewIn}
          className="absolute left-1.5 sm:left-3.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-[#554052] hover:text-[#7D4E68] shadow-sm flex items-center justify-center transition-all cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        {/* Carousel Next Button (Only 1 Single Arrow on Right) */}
        <button
          onClick={handleShopNewIn}
          className="absolute right-1.5 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-[#554052] hover:text-[#7D4E68] shadow-sm flex items-center justify-center transition-all cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </section>

      {/* 2. Benefits Strip (4 Pillars directly from visual reference) */}
      <section className="bg-[#F3E9EB] border-t border-[#D5C2D7] py-2.5 sm:py-3.5 px-3 sm:px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D5C2D7]/80">
          {/* Pillar 1: Premium Fabrics */}
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:px-4 justify-start sm:justify-center">
            <div className="text-[#7D4E68] shrink-0">
              <Feather className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.6]" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-[9.5px] min-[360px]:text-[10.5px] sm:text-[11.5px] uppercase tracking-wider text-[#554052]">
                PREMIUM FABRICS
              </h4>
              <p className="text-[9px] min-[360px]:text-[10px] text-[#8C5A7D]">for everyday comfort</p>
            </div>
          </div>

          {/* Pillar 2: Timeless Designs */}
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:px-4 justify-start sm:justify-center pt-2 sm:pt-1">
            <div className="text-[#7D4E68] shrink-0">
              <Flower2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.6]" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-[9.5px] min-[360px]:text-[10.5px] sm:text-[11.5px] uppercase tracking-wider text-[#554052]">
                TIMELESS DESIGNS
              </h4>
              <p className="text-[9px] min-[360px]:text-[10px] text-[#8C5A7D]">rooted in tradition</p>
            </div>
          </div>

          {/* Pillar 3: Pan India Shipping */}
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:px-4 justify-start sm:justify-center pt-2 sm:pt-1">
            <div className="text-[#7D4E68] shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.6]" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-[9.5px] min-[360px]:text-[10.5px] sm:text-[11.5px] uppercase tracking-wider text-[#554052]">
                PAN INDIA SHIPPING
              </h4>
              <p className="text-[9px] min-[360px]:text-[10px] text-[#8C5A7D]">safe and reliable</p>
            </div>
          </div>

          {/* Pillar 4: Made For You */}
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:px-4 justify-start sm:justify-center pt-2 sm:pt-1">
            <div className="text-[#7D4E68] shrink-0">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.6]" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-[9.5px] min-[360px]:text-[10.5px] sm:text-[11.5px] uppercase tracking-wider text-[#554052]">
                MADE FOR YOU
              </h4>
              <p className="text-[9px] min-[360px]:text-[10px] text-[#8C5A7D]">with love</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
