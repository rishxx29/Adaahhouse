import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/hero_kurti_editorial_1792057768559.jpg';
import { useStore } from '../context/StoreContext';
import { BRAND_CONFIG } from '../config/brand';

export const HeroSection: React.FC = () => {
  const { setActivePage, setSelectedCollectionFilter } = useStore();

  const handleShopClick = () => {
    setSelectedCollectionFilter('all');
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStoryClick = () => {
    setActivePage('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] border-b border-[#E8DED2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Message & Editorial Copy */}
          <div className="lg:col-span-6 space-y-6 lg:pr-6 text-center lg:text-left">
            {/* Quiet category / season kicker without pill tags */}
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#651F32] font-semibold">
              <span className="text-[#C9A76A]">✦</span>
              <span>New Season Collection · Handpicked Kurtis</span>
            </div>

            {/* Display Headline */}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#292522] tracking-tight leading-[1.08] font-normal [text-wrap:balance]">
              Everyday Luxury, <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#5B1E22]">Rooted in Grace.</span>
            </h2>

            {/* Supporting Prose */}
            <p className="text-[#292522]/80 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              ADAAH HOUSE celebrates the beauty of effortless Indian dressing. Thoughtfully curated ready-made kurtis and ethnic ensembles designed for comfort, poise, and everyday moments.
            </p>

            {/* CTAs adhering to zero-pill, single-line guidelines */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleShopClick}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#5B1E22] hover:bg-[#421417] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-200 flex items-center justify-center gap-2 group shadow-xs whitespace-nowrap"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#C9A76A]" />
              </button>

              <button
                onClick={handleStoryClick}
                className="w-full sm:w-auto px-7 py-3.5 border border-[#C9A76A]/80 hover:border-[#5B1E22] hover:text-[#5B1E22] text-[#292522] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 whitespace-nowrap"
              >
                Explore Our Story
              </button>
            </div>

            {/* Quiet Trust Bar */}
            <div className="pt-6 border-t border-[#E8DED2]/80 grid grid-cols-3 gap-4 text-center lg:text-left text-xs text-[#292522]/70">
              <div>
                <span className="block font-serif text-lg font-bold text-[#5B1E22]">100%</span>
                <span className="text-[11px] uppercase tracking-wider text-[#9E897A]">Curated Quality</span>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-[#5B1E22]">S to XXL</span>
                <span className="text-[11px] uppercase tracking-wider text-[#9E897A]">True Indian Fits</span>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-[#5B1E22]">FREE</span>
                <span className="text-[11px] uppercase tracking-wider text-[#9E897A]">All-India Shipping</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Visual Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] overflow-hidden rounded-xs border border-[#E8DED2] shadow-sm bg-[#E8DED2]/30">
              <img
                src={heroImg}
                alt="ADAAH HOUSE Curated Silk Kurti Editorial"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
              />

              {/* Discreet Brand Stamp Card on Corner */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-[#FAF7F2]/95 backdrop-blur-md p-4 border border-[#E8DED2] max-w-xs shadow-xs">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#651F32] font-semibold block">
                  Gulmohar Festive Edit
                </span>
                <p className="font-serif text-sm font-semibold text-[#292522] mt-0.5">
                  Chanderi Silk & Zardozi Kurti Set
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8DED2]/60 text-xs">
                  <span className="font-mono font-medium text-[#5B1E22] tabular-nums">₹2,499</span>
                  <button
                    onClick={handleShopClick}
                    className="text-[11px] uppercase tracking-wider font-semibold text-[#C9A76A] hover:text-[#5B1E22] transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
