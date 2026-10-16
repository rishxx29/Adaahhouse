import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/hero_kurti_editorial_1792057768559.jpg';
import { useStore } from '../context/StoreContext';
import { BRAND_CONFIG } from '../config/brand';
import { HouseOfRiiLotus } from './AdaahLogo';

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
    <section className="relative overflow-hidden bg-[#F6F0F4] border-b border-[#D5C2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Message & Editorial Copy */}
          <div className="lg:col-span-6 space-y-6 lg:pr-6 text-center lg:text-left">
            {/* Season kicker from guidelines */}
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.28em] uppercase text-[#8C5A7D] font-semibold">
              <HouseOfRiiLotus size={18} color="#8C5A7D" />
              <span>TRADITION · COMFORT · YOU</span>
            </div>

            {/* Display Headline from Image 1 */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#554052] tracking-tight leading-[1.08] font-normal [text-wrap:balance]">
              Tradition <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#8C5A7D]">Styled Your Way.</span>
            </h1>

            {/* Sub-headline & Description */}
            <div className="space-y-2">
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.24em] font-bold text-[#8C5A7D]">
                ELEGANT KURTAS, KURTA SETS AND CO-ORDS FOR EVERY YOU
              </p>
              <p className="text-[#554052]/85 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                HOUSE OF RII celebrates the beauty of effortless Indian dressing. Thoughtfully curated kurtas, ensembles, and modern co-ords tailored for timeless grace.
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleShopClick}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-200 flex items-center justify-center gap-2 group shadow-xs whitespace-nowrap cursor-pointer"
              >
                <span>Shop New In</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#D5C2D7]" />
              </button>

              <button
                onClick={handleStoryClick}
                className="w-full sm:w-auto px-7 py-3.5 border border-[#A185A4] hover:border-[#8C5A7D] hover:text-[#8C5A7D] text-[#554052] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 whitespace-nowrap cursor-pointer bg-white/60"
              >
                Explore The Story
              </button>
            </div>

            {/* Brand Value Pillars from Image 1 */}
            <div className="pt-6 border-t border-[#D5C2D7] grid grid-cols-3 gap-4 text-center lg:text-left text-xs text-[#554052]/80">
              <div>
                <span className="block font-serif text-lg font-bold text-[#8C5A7D]">Natural</span>
                <span className="text-[11px] uppercase tracking-wider text-[#A185A4]">Premium Fabrics</span>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-[#8C5A7D]">S to XXL</span>
                <span className="text-[11px] uppercase tracking-wider text-[#A185A4]">True Indian Fits</span>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-[#8C5A7D]">FREE</span>
                <span className="text-[11px] uppercase tracking-wider text-[#A185A4]">Pan-India Shipping</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Visual Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] overflow-hidden rounded-xs border border-[#D5C2D7] shadow-sm bg-[#D5C2D7]/20">
              <img
                src={heroImg}
                alt="HOUSE OF RII Curated Silk Kurti Editorial"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
              />

              {/* Discreet Brand Stamp Card on Corner */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-[#F6F0F4]/95 backdrop-blur-md p-4 border border-[#D5C2D7] max-w-xs shadow-xs">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#8C5A7D] font-semibold block">
                  HOUSE OF RII EDIT
                </span>
                <p className="font-serif text-sm font-semibold text-[#554052] mt-0.5">
                  Chanderi Silk & Zardozi Kurti Set
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D5C2D7] text-xs">
                  <span className="font-mono font-bold text-[#8C5A7D] tabular-nums">₹2,499</span>
                  <button
                    onClick={handleShopClick}
                    className="text-[11px] uppercase tracking-wider font-semibold text-[#8C5A7D] hover:text-[#554052] transition-colors cursor-pointer"
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
