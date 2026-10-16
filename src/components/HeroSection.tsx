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
      <section className="relative w-full aspect-[1024/251] min-h-[200px] sm:min-h-[240px] lg:min-h-[250px] overflow-hidden bg-[#E6D8D7]">
        {/* Full-bleed Panorama Reference Image */}
        <img
          src="/hero_exact_banner.jpg"
          alt="HOUSE OF RII — Tradition Styled Your Way"
          className="w-full h-full object-cover sm:object-fill select-none pointer-events-none"
        />

        {/* Interactive Clickable SHOP NEW IN Button Overlay */}
        <button
          onClick={handleShopNewIn}
          style={{
            position: 'absolute',
            left: '12.0%',
            top: '66.9%',
            width: '17.1%',
            height: '21.9%',
          }}
          className="cursor-pointer bg-transparent hover:bg-white/10 transition-colors focus:outline-none"
          title="Shop New In"
          aria-label="Shop New In"
        />

        {/* Carousel Prev Button */}
        <button
          onClick={handleShopNewIn}
          style={{
            position: 'absolute',
            left: '1.2%',
            top: '48%',
            transform: 'translateY(-50%)',
          }}
          className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full bg-white/90 hover:bg-white text-[#554052] shadow-sm flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>

        {/* Carousel Next Button */}
        <button
          onClick={handleShopNewIn}
          style={{
            position: 'absolute',
            right: '1.2%',
            top: '48%',
            transform: 'translateY(-50%)',
          }}
          className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full bg-white/90 hover:bg-white text-[#554052] shadow-sm flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </section>

      {/* 2. Benefits Strip (4 Pillars directly from visual reference) */}
      <section className="bg-[#F3EAEB] border-t border-[#D5C2D7] py-3 sm:py-3.5 px-4 sm:px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D5C2D7]/80">
          {/* Pillar 1: Premium Fabrics */}
          <div className="flex items-center gap-3 p-1.5 sm:px-4 justify-start sm:justify-center">
            <div className="text-[#7D4E68] shrink-0">
              <Feather className="w-5 h-5 stroke-[1.6]" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-[10.5px] sm:text-[11.5px] uppercase tracking-wider text-[#554052]">
                PREMIUM FABRICS
              </h4>
              <p className="text-[10px] text-[#8C5A7D]">for everyday comfort</p>
            </div>
          </div>

          {/* Pillar 2: Timeless Designs */}
          <div className="flex items-center gap-3 p-1.5 sm:px-4 justify-start sm:justify-center pt-3 sm:pt-1.5">
            <div className="text-[#7D4E68] shrink-0">
              <Flower2 className="w-5 h-5 stroke-[1.6]" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-[10.5px] sm:text-[11.5px] uppercase tracking-wider text-[#554052]">
                TIMELESS DESIGNS
              </h4>
              <p className="text-[10px] text-[#8C5A7D]">rooted in tradition</p>
            </div>
          </div>

          {/* Pillar 3: Pan India Shipping */}
          <div className="flex items-center gap-3 p-1.5 sm:px-4 justify-start sm:justify-center pt-3 sm:pt-1.5">
            <div className="text-[#7D4E68] shrink-0">
              <Truck className="w-5 h-5 stroke-[1.6]" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-[10.5px] sm:text-[11.5px] uppercase tracking-wider text-[#554052]">
                PAN INDIA SHIPPING
              </h4>
              <p className="text-[10px] text-[#8C5A7D]">safe and reliable</p>
            </div>
          </div>

          {/* Pillar 4: Made For You */}
          <div className="flex items-center gap-3 p-1.5 sm:px-4 justify-start sm:justify-center pt-3 sm:pt-1.5">
            <div className="text-[#7D4E68] shrink-0">
              <Heart className="w-5 h-5 stroke-[1.6]" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-[10.5px] sm:text-[11.5px] uppercase tracking-wider text-[#554052]">
                MADE FOR YOU
              </h4>
              <p className="text-[10px] text-[#8C5A7D]">with love</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
