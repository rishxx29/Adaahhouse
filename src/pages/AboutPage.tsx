import React from 'react';
import {
  Heart,
  ShieldCheck,
  Package,
  Search,
  MapPin,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Leaf,
} from 'lucide-react';
import { HouseOfRiiLogo, HouseOfRiiLotus, HouseOfRiiDivider } from '../components/AdaahLogo';
import { useStore } from '../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { setActivePage, setSelectedCategoryFilter, setSelectedCollectionFilter } = useStore();

  const handleCategoryClick = (category: string) => {
    if (category === 'Festive Wear') {
      setSelectedCollectionFilter('festive');
      setSelectedCategoryFilter('all');
    } else if (category === 'Kurti Sets' || category === 'Straight Suit Sets') {
      setSelectedCollectionFilter('all');
      setSelectedCategoryFilter('Kurti Set');
    } else if (category === 'Co-ord Sets') {
      setSelectedCollectionFilter('all');
      setSelectedCategoryFilter('Co-ord');
    } else if (category === 'Anarkali Suits') {
      setSelectedCollectionFilter('all');
      setSelectedCategoryFilter('Anarkali');
    } else {
      setSelectedCollectionFilter('all');
      setSelectedCategoryFilter('all');
    }
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopNowClick = () => {
    setSelectedCollectionFilter('all');
    setSelectedCategoryFilter('all');
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToStory = () => {
    const el = document.getElementById('our-story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#F3E9EB] text-[#554052] font-body animate-in fade-in duration-300">
      {/* =========================================================================
          SECTION 1: HERO — "More Than A Brand"
          ========================================================================= */}
      <section className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 relative z-10 space-y-4 sm:space-y-6">
            {/* Subtle botanical line art decoration background */}
            <div className="absolute -left-6 -top-10 w-32 h-44 opacity-25 pointer-events-none hidden sm:block">
              <svg viewBox="0 0 100 140" fill="none" stroke="#8C5A7D" strokeWidth="1.2">
                <path d="M10 130 C20 90 40 50 80 10" />
                <path d="M40 70 C30 50 15 55 10 70 C20 80 35 75 40 70 Z" fill="#8C5A7D" fillOpacity="0.08" />
                <path d="M55 45 C65 30 80 35 85 45 C75 55 60 55 55 45 Z" fill="#8C5A7D" fillOpacity="0.08" />
                <path d="M25 100 C15 90 5 95 0 105 C10 115 20 110 25 100 Z" fill="#8C5A7D" fillOpacity="0.08" />
              </svg>
            </div>

            {/* Pinterest vibe pill badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/85 backdrop-blur-xs border border-[#D5C2D7] text-[#8C5A7D] text-[10.5px] uppercase tracking-[0.2em] font-semibold rounded-full shadow-2xs">
                <span>📌</span>
                <span>MOOD: GRACE IN EVERY THREAD</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#8C5A7D]/10 border border-[#8C5A7D]/25 text-[#8C5A7D] text-[10.5px] font-medium rounded-full">
                <span>✦</span>
                <span>JAIPUR CURATION</span>
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[56px] text-[#554052] font-normal leading-[1.12]">
              More Than <br className="hidden sm:inline" />
              A Brand
            </h1>

            <p className="font-cursive text-3xl sm:text-4xl lg:text-[42px] text-[#8C5A7D] leading-snug pt-1">
              It's a dream of fashion, freedom and self-expression.
            </p>

            <div className="w-24">
              <HouseOfRiiDivider color="#A185A4" />
            </div>

            <p className="text-xs sm:text-sm text-[#554052]/90 leading-relaxed max-w-lg font-body">
              HOUSE OF RII is an ethnic wear brand created for every girl who loves beautiful outfits, effortless style and the confidence that comes with Indian fashion.
            </p>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                onClick={scrollToStory}
                className="inline-flex items-center gap-2 bg-[#7D4E68] hover:bg-[#554052] text-white text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium px-7 py-3 transition shadow-xs cursor-pointer group"
              >
                <span>OUR STORY</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
              <a
                href="#moodboard"
                className="inline-flex items-center gap-1.5 border border-[#8C5A7D]/60 hover:bg-white text-[#7D4E68] text-[11px] sm:text-xs uppercase tracking-[0.18em] font-medium px-5 py-3 transition shadow-2xs cursor-pointer"
              >
                <span>✨ VIEW MOODBOARD</span>
              </a>
            </div>
          </div>

          {/* Right Hero Image Card with Editorial Caption & Washi Tape */}
          <div className="lg:col-span-6 relative">
            {/* Washi Tape at Top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-28 h-6 bg-[#FAF7F2]/90 border border-[#D5C2D7] shadow-2xs rotate-[-1.5deg] flex items-center justify-center pointer-events-none">
              <span className="text-[9.5px] uppercase tracking-[0.25em] text-[#8C5A7D] font-mono font-medium">
                ESTD · 2026
              </span>
            </div>

            <div className="relative aspect-[3/3.8] sm:aspect-[4/4.8] max-h-[600px] overflow-hidden shadow-xs border border-[#D5C2D7]/60 bg-white group">
              <img
                src="/about_hero_photo_hd.jpg?v=3"
                alt="HOUSE OF RII Founder - More Than A Brand"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-102"
              />

              {/* Editorial script caption overlay on top right */}
              <div className="absolute top-6 right-6 text-right select-none pointer-events-none">
                <p className="font-cursive text-3xl sm:text-4xl text-[#554052] drop-shadow-xs leading-tight">
                  Tradition, <br />
                  Styled Your Way.
                </p>
                <div className="flex justify-end mt-1 opacity-70">
                  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="#554052" strokeWidth="1.2">
                    <path d="M20 35 C20 20 28 10 35 5" />
                    <path d="M22 22 C16 16 12 18 10 24 C14 28 20 26 22 22 Z" fill="#554052" fillOpacity="0.1" />
                  </svg>
                </div>
              </div>

              {/* Aesthetic Polaroid bottom caption tag */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/92 backdrop-blur-xs border border-[#D5C2D7]/70 p-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-cursive text-2xl text-[#554052] leading-none">
                      daydreaming in jaipur 🌸
                    </p>
                    <p className="text-[10px] text-[#8C5A7D] font-mono tracking-wider uppercase mt-1">
                      curated with grace · house of rii
                    </p>
                  </div>
                  <span className="text-[10.5px] text-[#8C5A7D] bg-[#F3E9EB] border border-[#D5C2D7] px-2.5 py-1 font-mono">
                    #DesiAesthetic
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: OUR STORY — "A Dream Turned Into A Brand"
          ========================================================================= */}
      <section id="our-story" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Portrait Photo with Polaroid style */}
          <div className="lg:col-span-4 relative group">
            {/* Washi tape at top */}
            <div className="absolute -top-3 left-8 z-20 w-20 h-5 bg-[#EADBD5]/90 border border-white/60 shadow-2xs rotate-[-3deg] pointer-events-none" />
            <div className="relative aspect-[3/3.8] max-h-[500px] overflow-hidden border border-[#D5C2D7]/60 shadow-xs bg-white p-2 sm:p-2.5 pb-8 transition-transform duration-300 group-hover:rotate-1">
              <div className="w-full h-full overflow-hidden">
                <img
                  src="/about_story_photo_hd.jpg?v=3"
                  alt="HOUSE OF RII Founder - Rishika Jain"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
                />
              </div>
              <div className="pt-2 px-1 flex items-center justify-between text-xs">
                <span className="font-cursive text-xl text-[#554052]">the girl behind the brand ✨</span>
                <span className="font-mono text-[10px] text-[#8C5A7D]">jaipur · 2026</span>
              </div>
            </div>
          </div>

          {/* Center Column: Narrative Copy */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#8C5A7D]">
                OUR STORY
              </span>
              <span className="text-xs text-[#8C5A7D]">✦</span>
              <span className="font-cursive text-lg text-[#8C5A7D]">since 2026</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#554052] font-normal leading-tight">
              A Dream Turned <br className="hidden sm:inline" />
              Into A Brand
            </h2>

            <div className="space-y-3 text-xs sm:text-[13px] text-[#554052]/90 leading-relaxed font-body">
              <p>
                I'm <strong>Rishika Jain</strong>, the founder of HOUSE OF RII. Fashion has always been my way of expressing myself — be it through styling, creating content or experimenting with different looks.
              </p>
              <p>
                HOUSE OF RII started with a simple dream — to build my own fashion brand where I can bring together beautiful, affordable ethnic wear, model the outfits myself, create aesthetic content and share this journey with you.
              </p>
              <p>
                Every collection is thoughtfully curated to include the styles, sizes and price range that every girl would love to have in her wardrobe.
              </p>
            </div>
          </div>

          {/* Right Column: Signature Quote Card */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <div className="h-full bg-[#F6ECEB] border border-[#E8D8CC] p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xs relative overflow-hidden">
              {/* Aesthetic Stamp Badge */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full border border-dashed border-[#8C5A7D]/40 flex flex-col items-center justify-center rotate-12 text-[#8C5A7D] text-[7.5px] font-mono uppercase tracking-tighter select-none pointer-events-none">
                <span>ESTD</span>
                <span className="font-bold text-[9px]">2026</span>
                <span>JAIPUR</span>
              </div>

              {/* Lotus at top */}
              <div className="mb-4">
                <HouseOfRiiLotus size={34} />
              </div>

              {/* Quote */}
              <p className="font-display italic text-2xl sm:text-[26px] text-[#7D4E68] leading-snug max-w-[200px] tracking-wide font-normal">
                “One girl, <br />
                one dream, <br />
                one fashion <br />
                brand.”
              </p>

              <div className="w-16 my-4">
                <HouseOfRiiDivider color="#A185A4" />
              </div>

              {/* Botanical leaves line art at the bottom */}
              <div className="mt-2 opacity-50">
                <svg width="60" height="40" viewBox="0 0 80 50" fill="none" stroke="#8C5A7D" strokeWidth="1.2">
                  <path d="M40 50 C40 30 55 15 75 10" />
                  <path d="M50 32 C58 24 66 26 70 32 C64 38 56 36 50 32 Z" fill="#8C5A7D" fillOpacity="0.1" />
                  <path d="M40 50 C40 30 25 15 5 10" />
                  <path d="M30 32 C22 24 14 26 10 32 C16 38 24 36 30 32 Z" fill="#8C5A7D" fillOpacity="0.1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: WHY HOUSE OF RII? — 5 Pillars with Dividers
          ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-b border-[#D5C2D7]/70">
        <div className="text-center max-w-xl mx-auto space-y-1 mb-10">
          <h2 className="text-xs sm:text-[13px] uppercase tracking-[0.3em] font-semibold text-[#7D4E68]">
            WHY HOUSE OF RII?
          </h2>
          <div className="w-20 mx-auto">
            <HouseOfRiiDivider color="#A185A4" />
          </div>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#D5C2D7]">
          {/* Pillar 1: Affordable Elegance */}
          <div className="text-center px-3 sm:px-4 py-4 md:py-0 flex flex-col items-center space-y-2">
            <div className="h-10 flex items-center justify-center">
              <HouseOfRiiLotus size={28} />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-semibold text-[#554052]">
              Affordable Elegance
            </h3>
            <p className="text-[11px] sm:text-xs text-[#554052]/80 leading-relaxed font-body">
              Stylish ethnic wear within ₹500 – ₹1,500
            </p>
          </div>

          {/* Pillar 2: Curated Collections */}
          <div className="text-center px-3 sm:px-4 py-4 md:py-0 flex flex-col items-center space-y-2">
            <div className="h-10 flex items-center justify-center text-[#8C5A7D]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 3 L15 3 L18 8 L16 11 L19 21 L5 21 L8 11 L6 8 Z" />
                <path d="M10 3 C10 5 14 5 14 3" />
              </svg>
            </div>
            <h3 className="font-serif text-sm sm:text-base font-semibold text-[#554052]">
              Curated Collections
            </h3>
            <p className="text-[11px] sm:text-xs text-[#554052]/80 leading-relaxed font-body">
              Carefully selected from trusted Indian wholesalers
            </p>
          </div>

          {/* Pillar 3: Traditional with a Modern Touch */}
          <div className="text-center px-3 sm:px-4 py-4 md:py-0 flex flex-col items-center space-y-2">
            <div className="h-10 flex items-center justify-center text-[#8C5A7D]">
              <Leaf className="w-5 h-5 stroke-[1.6]" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-semibold text-[#554052]">
              Traditional with a Modern Touch
            </h3>
            <p className="text-[11px] sm:text-xs text-[#554052]/80 leading-relaxed font-body">
              Classics with contemporary styles
            </p>
          </div>

          {/* Pillar 4: Everyday & Festive Wear */}
          <div className="text-center px-3 sm:px-4 py-4 md:py-0 flex flex-col items-center space-y-2">
            <div className="h-10 flex items-center justify-center text-[#8C5A7D]">
              <Heart className="w-5 h-5 stroke-[1.6]" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-semibold text-[#554052]">
              Everyday & Festive Wear
            </h3>
            <p className="text-[11px] sm:text-xs text-[#554052]/80 leading-relaxed font-body">
              Outfits for every mood and occasion
            </p>
          </div>

          {/* Pillar 5: Comfort & Versatility */}
          <div className="text-center px-3 sm:px-4 py-4 md:py-0 flex flex-col items-center space-y-2 col-span-2 md:col-span-1">
            <div className="h-10 flex items-center justify-center text-[#8C5A7D]">
              <Sparkles className="w-5 h-5 stroke-[1.6]" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-semibold text-[#554052]">
              Comfort & Versatility
            </h3>
            <p className="text-[11px] sm:text-xs text-[#554052]/80 leading-relaxed font-body">
              Designs you'll love wearing again and again
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PIECES WE LOVE — 5 Image Tiles + Explore Button
          ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="text-center max-w-xl mx-auto space-y-1 mb-10">
          <h2 className="text-xs sm:text-[13px] uppercase tracking-[0.3em] font-semibold text-[#7D4E68]">
            PIECES WE LOVE
          </h2>
          <div className="w-20 mx-auto">
            <HouseOfRiiDivider color="#A185A4" />
          </div>
        </div>

        {/* 5 Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Card 1: Kurti Sets */}
          <div
            onClick={() => handleCategoryClick('Kurti Sets')}
            className="group cursor-pointer text-center space-y-3"
          >
            <div className="aspect-[3/3.6] overflow-hidden bg-white border border-[#D5C2D7]/70 shadow-xs relative">
              <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-white/90 backdrop-blur-xs text-[9.5px] uppercase font-mono tracking-widest text-[#8C5A7D] border border-[#D5C2D7]/70 shadow-2xs">
                01 · SETS
              </span>
              <img
                src="/about_col_kurti_sets_hd.jpg?v=5"
                alt="Kurti Sets"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div>
              <h3 className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-[#554052] uppercase group-hover:text-[#8C5A7D] transition-colors">
                KURTI SETS
              </h3>
              <p className="text-[11px] text-[#554052]/80 leading-snug mt-1 font-body">
                Effortless ethnic looks for everyday and outings.
              </p>
            </div>
          </div>

          {/* Card 2: Co-ord Sets */}
          <div
            onClick={() => handleCategoryClick('Co-ord Sets')}
            className="group cursor-pointer text-center space-y-3"
          >
            <div className="aspect-[3/3.6] overflow-hidden bg-white border border-[#D5C2D7]/70 shadow-xs relative">
              <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-white/90 backdrop-blur-xs text-[9.5px] uppercase font-mono tracking-widest text-[#8C5A7D] border border-[#D5C2D7]/70 shadow-2xs">
                02 · CO-ORDS
              </span>
              <img
                src="/about_col_coord_sets_hd.jpg?v=5"
                alt="Co-ord Sets"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div>
              <h3 className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-[#554052] uppercase group-hover:text-[#8C5A7D] transition-colors">
                CO-ORD SETS
              </h3>
              <p className="text-[11px] text-[#554052]/80 leading-snug mt-1 font-body">
                Modern styles with a coordinated look.
              </p>
            </div>
          </div>

          {/* Card 3: Anarkali Suits */}
          <div
            onClick={() => handleCategoryClick('Anarkali Suits')}
            className="group cursor-pointer text-center space-y-3"
          >
            <div className="aspect-[3/3.6] overflow-hidden bg-white border border-[#D5C2D7]/70 shadow-xs relative">
              <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-white/90 backdrop-blur-xs text-[9.5px] uppercase font-mono tracking-widest text-[#8C5A7D] border border-[#D5C2D7]/70 shadow-2xs">
                03 · ANARKALIS
              </span>
              <img
                src="/about_col_anarkali_suits_hd.jpg?v=5"
                alt="Anarkali Suits"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div>
              <h3 className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-[#554052] uppercase group-hover:text-[#8C5A7D] transition-colors">
                ANARKALI SUITS
              </h3>
              <p className="text-[11px] text-[#554052]/80 leading-snug mt-1 font-body">
                Graceful silhouettes for special moments.
              </p>
            </div>
          </div>

          {/* Card 4: Straight Suit Sets */}
          <div
            onClick={() => handleCategoryClick('Straight Suit Sets')}
            className="group cursor-pointer text-center space-y-3"
          >
            <div className="aspect-[3/3.6] overflow-hidden bg-white border border-[#D5C2D7]/70 shadow-xs relative">
              <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-white/90 backdrop-blur-xs text-[9.5px] uppercase font-mono tracking-widest text-[#8C5A7D] border border-[#D5C2D7]/70 shadow-2xs">
                04 · STRAIGHT
              </span>
              <img
                src="/about_col_straight_suits_hd.jpg?v=5"
                alt="Straight Suit Sets"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div>
              <h3 className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-[#554052] uppercase group-hover:text-[#8C5A7D] transition-colors">
                STRAIGHT SUIT SETS
              </h3>
              <p className="text-[11px] text-[#554052]/80 leading-snug mt-1 font-body">
                Classic and versatile pieces with timeless appeal.
              </p>
            </div>
          </div>

          {/* Card 5: Festive Wear */}
          <div
            onClick={() => handleCategoryClick('Festive Wear')}
            className="group cursor-pointer text-center space-y-3 col-span-2 sm:col-span-1"
          >
            <div className="aspect-[3/3.6] overflow-hidden bg-white border border-[#D5C2D7]/70 shadow-xs relative">
              <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-white/90 backdrop-blur-xs text-[9.5px] uppercase font-mono tracking-widest text-[#8C5A7D] border border-[#D5C2D7]/70 shadow-2xs">
                05 · FESTIVE
              </span>
              <img
                src="/about_col_festive_wear_hd.jpg?v=5"
                alt="Festive Wear"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div>
              <h3 className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-[#554052] uppercase group-hover:text-[#8C5A7D] transition-colors">
                FESTIVE WEAR
              </h3>
              <p className="text-[11px] text-[#554052]/80 leading-snug mt-1 font-body">
                Elegant styles for your celebrations.
              </p>
            </div>
          </div>
        </div>

        {/* Explore Collections Button */}
        <div className="text-center mt-10">
          <button
            onClick={handleShopNowClick}
            className="inline-flex items-center gap-2 border border-[#7D4E68] text-[#7D4E68] hover:bg-[#7D4E68] hover:text-white px-8 py-3 uppercase text-[11px] tracking-[0.22em] font-medium transition cursor-pointer"
          >
            <span>EXPLORE PIECES WE LOVE</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          PINTEREST VIBE SECTION: THE STUDIO MOODBOARD
          ========================================================================= */}
      <section id="moodboard" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 border-t border-[#D5C2D7]/70 relative">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-[#D5C2D7] text-[#8C5A7D] text-[10.5px] uppercase tracking-[0.25em] font-semibold rounded-full shadow-2xs">
            <span>📌</span>
            <span>FROM RISHIKA'S MOODBOARD</span>
            <span>✨</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#554052]">
            The House of Rii Aesthetic
          </h2>
          <p className="font-cursive text-2xl sm:text-3xl text-[#8C5A7D] pt-0.5">
            a love letter to soft pastels, morning chai & twirl-worthy silhouettes
          </p>
          <div className="w-24 mx-auto pt-1">
            <HouseOfRiiDivider color="#A185A4" />
          </div>
        </div>

        {/* Pinterest Moodboard Scrapbook Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 items-start">
          
          {/* Moodboard Item 1: Polaroid Photo (Anarkali Flare) */}
          <div className="relative group bg-white p-3 pb-8 border border-[#D5C2D7]/70 shadow-sm rotate-[-2deg] hover:rotate-0 hover:scale-[1.02] transition-all duration-300">
            {/* Washi Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#FAF7F2]/90 border border-[#D5C2D7]/80 shadow-2xs rotate-[-3deg] pointer-events-none" />
            <div className="aspect-[3/3.8] overflow-hidden bg-[#F3E9EB]">
              <img
                src="/products/prod_lavender_anarkali.jpg"
                alt="Lavender Anarkali Flare"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="pt-3 px-1 space-y-1">
              <p className="font-cursive text-2xl text-[#554052] leading-tight">
                flares, folds & poetry 🪻
              </p>
              <p className="text-[10px] uppercase font-mono tracking-wider text-[#8C5A7D]">
                #chanderisilk #anarkalilove
              </p>
            </div>
          </div>

          {/* Moodboard Item 2: Signature Colour Palette Card */}
          <div className="bg-[#FAF7F2] p-6 border border-[#E8D8CC] shadow-sm rotate-[1deg] hover:rotate-0 transition-all duration-300 space-y-5 relative">
            {/* Cute Tape at top right */}
            <div className="absolute -top-3 right-6 w-16 h-4 bg-[#EADBD5]/90 border border-white/60 shadow-2xs rotate-6 pointer-events-none" />
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#8C5A7D] font-semibold block">
                PALETTE NO. 01
              </span>
              <h3 className="font-serif text-lg font-semibold text-[#554052]">
                Our Signature Hues
              </h3>
              <p className="text-[11px] text-[#554052]/75 font-body">
                The calming, regal colors that define every collection.
              </p>
            </div>

            {/* Swatches with names */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#D5C2D7] shadow-inner shrink-0 border border-white" />
                <div className="text-left text-xs">
                  <p className="font-medium text-[#554052]">Gulabi Lilac</p>
                  <p className="text-[10px] text-[#8C5A7D] font-mono">#D5C2D7 · soft dusk skies</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#8C5A7D] shadow-inner shrink-0 border border-white" />
                <div className="text-left text-xs">
                  <p className="font-medium text-[#554052]">Heritage Plum</p>
                  <p className="text-[10px] text-[#8C5A7D] font-mono">#8C5A7D · regal warmth</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#554052] shadow-inner shrink-0 border border-white" />
                <div className="text-left text-xs">
                  <p className="font-medium text-[#554052]">Royal Jamun</p>
                  <p className="text-[10px] text-[#8C5A7D] font-mono">#554052 · vintage depth</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#F3E9EB] border border-[#D5C2D7] shadow-inner shrink-0" />
                <div className="text-left text-xs">
                  <p className="font-medium text-[#554052]">Powder Blush</p>
                  <p className="text-[10px] text-[#8C5A7D] font-mono">#F3E9EB · subtle canvas</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#D5C2D7]/60 flex items-center justify-between text-[10px] text-[#8C5A7D] font-mono">
              <span>✦ HAND-SELECTED</span>
              <span>JAIPUR 2026</span>
            </div>
          </div>

          {/* Moodboard Item 3: Handwritten Memo / Sticky Note */}
          <div className="bg-[#F8EFEA] p-6 border border-[#E4D2C7] shadow-sm rotate-[-1.5deg] hover:rotate-0 transition-all duration-300 relative space-y-4">
            {/* Cute pushpin top */}
            <div className="w-4 h-4 mx-auto rounded-full bg-[#8C5A7D] shadow-xs flex items-center justify-center -mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#8C5A7D] font-semibold text-center block">
              FOUNDER'S NOTEBOOK
            </span>

            <p className="font-cursive text-2xl sm:text-[26px] text-[#554052] leading-snug text-center pt-1">
              “wear what makes you feel like poetry in motion. grace isn't loud — it's in the quiet way you carry yourself.”
            </p>

            <div className="w-12 mx-auto">
              <HouseOfRiiDivider color="#A185A4" />
            </div>

            <div className="text-center pt-1">
              <p className="font-signature text-3xl text-[#8C5A7D]">~ Rii</p>
              <p className="text-[10px] text-[#554052]/70 font-mono tracking-widest uppercase mt-0.5">
                curator & stylist
              </p>
            </div>
          </div>

          {/* Moodboard Item 4: Polaroid Photo (Co-ord set or floral detail) */}
          <div className="relative group bg-white p-3 pb-8 border border-[#D5C2D7]/70 shadow-sm rotate-[2.5deg] hover:rotate-0 hover:scale-[1.02] transition-all duration-300">
            {/* Washi Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#FAF7F2]/90 border border-[#D5C2D7]/80 shadow-2xs rotate-[2deg] pointer-events-none" />
            <div className="aspect-[3/3.8] overflow-hidden bg-[#F3E9EB]">
              <img
                src="/products/prod_rose_pink_coord.jpg"
                alt="Rose Pink Botanical Co-ord"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="pt-3 px-1 space-y-1">
              <p className="font-cursive text-2xl text-[#554052] leading-tight">
                modern coords & chai ☕
              </p>
              <p className="text-[10px] uppercase font-mono tracking-wider text-[#8C5A7D]">
                #softglam #everydaydesi
              </p>
            </div>
          </div>

        </div>

        {/* Moodboard Bottom Pinterest Pin Banner */}
        <div className="mt-12 bg-white/75 backdrop-blur-xs border border-[#D5C2D7] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-[#8C5A7D]/10 text-[#8C5A7D] flex items-center justify-center shrink-0">
              <span className="text-lg">📌</span>
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-[#554052]">
                Love this aesthetic? Save it to your Pinterest board
              </h4>
              <p className="text-xs text-[#554052]/80">
                Explore our everyday & festive edits styled for the modern Indian girl.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShopNowClick}
              className="px-6 py-2.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <span>SHOP THE MOODBOARD</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: MY VISION — "Creating a Brand That Feels Like Me"
          ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Portrait Photo with Polaroid style */}
          <div className="lg:col-span-6 relative group">
            {/* Washi tape at top */}
            <div className="absolute -top-3 left-12 z-20 w-24 h-5 bg-[#FAF7F2]/90 border border-[#D5C2D7] shadow-2xs rotate-[-2deg] pointer-events-none" />
            <div className="relative aspect-[3/3.8] sm:aspect-[4/4.8] max-h-[560px] overflow-hidden border border-[#D5C2D7]/60 shadow-xs bg-white p-2.5 sm:p-3 pb-8 transition-transform duration-300 group-hover:rotate-[-0.5deg]">
              <div className="w-full h-full overflow-hidden">
                <img
                  src="/about_vision_photo_hd.jpg?v=3"
                  alt="Rishika Jain - Vision for House of Rii"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-102"
                />
              </div>
              <div className="pt-2.5 px-1 flex items-center justify-between text-xs">
                <span className="font-cursive text-xl text-[#554052]">from sketches to reality ✨</span>
                <span className="font-mono text-[10px] text-[#8C5A7D]">jaipur · rishika</span>
              </div>
            </div>
          </div>

          {/* Right Column: Vision Narrative */}
          <div className="lg:col-span-6 space-y-5 relative">
            {/* Top Right Botanical Branch */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-25 pointer-events-none hidden sm:block">
              <svg viewBox="0 0 80 80" fill="none" stroke="#8C5A7D" strokeWidth="1.2">
                <path d="M10 70 C30 50 50 30 75 10" />
                <path d="M45 35 C55 25 70 28 72 36 C64 42 50 40 45 35 Z" fill="#8C5A7D" fillOpacity="0.1" />
                <path d="M30 50 C20 40 10 44 8 52 C16 58 28 56 30 50 Z" fill="#8C5A7D" fillOpacity="0.1" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#8C5A7D]">
                  MY VISION
                </span>
                <span className="text-xs text-[#8C5A7D]">✦</span>
                <span className="font-cursive text-lg text-[#8C5A7D]">styled by me</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#554052] font-normal leading-tight mt-1.5">
                Creating a Brand <br />
                That Feels Like Me
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-[13px] text-[#554052]/90 leading-relaxed font-body">
              <p>
                I want HOUSE OF RII to be a place where every girl finds outfits that make her feel confident, comfortable and beautiful.
              </p>
              <p>
                I look forward to styling the collections, modelling them myself, creating photoshoots, and sharing my love for Indian fashion through this brand.
              </p>
              <p>
                This is just the beginning, and I'm so excited to grow this dream with you.
              </p>
            </div>

            {/* Signature Block */}
            <div className="pt-4 space-y-1">
              <p className="font-signature text-4xl sm:text-5xl lg:text-[54px] text-[#8C5A7D] select-none leading-none tracking-normal font-normal">
                ~ Rishika Jain
              </p>
              <p className="text-[10.5px] uppercase tracking-[0.25em] text-[#554052]/80 font-medium font-sans pt-1">
                Founder, Stylist & Creative Director
              </p>
              <p className="font-cursive text-lg text-[#8C5A7D] pt-0.5">
                grace in every thread 🌸
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: OUR PROCESS — "Thoughtfully Curated for You"
          ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-[#D5C2D7]/70">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Lead text */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#8C5A7D]">
              OUR PROCESS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#554052] font-normal leading-tight">
              Thoughtfully <br className="hidden sm:inline" />
              Curated for You
            </h2>
            <p className="text-xs sm:text-[13px] text-[#554052]/90 leading-relaxed font-body max-w-md">
              We source ready-made outfits from Indian clothing wholesalers and carefully select each piece based on style, quality, comfort and value.
            </p>
          </div>

          {/* Right: 4-Step Process Flow with Connecting Arrows */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
            {/* Step 1: We Discover */}
            <div className="text-center space-y-1.5 p-2">
              <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center text-[#8C5A7D]">
                <Search className="w-5 h-5 stroke-[1.6]" />
              </div>
              <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#554052]">
                We Discover
              </h4>
              <p className="text-[11px] text-[#554052]/80 leading-snug font-body">
                Explore trends and unique styles
              </p>
            </div>

            {/* Step 2: We Curate */}
            <div className="text-center space-y-1.5 p-2 relative">
              <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center text-[#8C5A7D]">
                <Heart className="w-5 h-5 stroke-[1.6]" />
              </div>
              <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#554052]">
                We Curate
              </h4>
              <p className="text-[11px] text-[#554052]/80 leading-snug font-body">
                Select pieces that fit our vision
              </p>
            </div>

            {/* Step 3: We Check */}
            <div className="text-center space-y-1.5 p-2 relative">
              <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center text-[#8C5A7D]">
                <ShieldCheck className="w-5 h-5 stroke-[1.6]" />
              </div>
              <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#554052]">
                We Check
              </h4>
              <p className="text-[11px] text-[#554052]/80 leading-snug font-body">
                Focus on style, comfort and finish
              </p>
            </div>

            {/* Step 4: We Deliver */}
            <div className="text-center space-y-1.5 p-2">
              <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center text-[#8C5A7D]">
                <Package className="w-5 h-5 stroke-[1.6]" />
              </div>
              <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#554052]">
                We Deliver
              </h4>
              <p className="text-[11px] text-[#554052]/80 leading-snug font-body">
                Bring them to you with minimal, eco-conscious packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: PROMOTIONAL PLUM BANNER & TRUST STRIP
          ========================================================================= */}
      <section className="bg-[#7D4E68] text-white py-10 sm:py-12 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="hidden md:block w-32" />

          {/* Centered Master Logo in Light Theme */}
          <div className="text-center">
            <HouseOfRiiLogo variant="primary" theme="dark" showTagline={true} className="max-w-[240px] sm:max-w-[280px]" />
          </div>

          {/* Right CTA Button */}
          <div className="shrink-0">
            <button
              onClick={handleShopNowClick}
              className="inline-flex items-center gap-2 border border-white/80 hover:bg-white hover:text-[#7D4E68] text-white px-7 py-3 uppercase text-[11px] tracking-[0.22em] font-medium transition cursor-pointer"
            >
              <span>SHOP NOW</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: 5 TRUST MARKERS STRIP
          ========================================================================= */}
      <section className="bg-[#F3E9EB] border-b border-[#D5C2D7] py-8 sm:py-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-[#D5C2D7]/80">
            {/* Marker 1: Based in Jaipur */}
            <div className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-0">
              <MapPin className="w-5 h-5 text-[#8C5A7D] shrink-0" />
              <div>
                <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#554052]">
                  Based in Jaipur
                </h4>
                <p className="text-[11px] text-[#554052]/80 mt-0.5">Rajasthan, India</p>
              </div>
            </div>

            {/* Marker 2: India-wide Delivery */}
            <div className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-0">
              <Truck className="w-5 h-5 text-[#8C5A7D] shrink-0" />
              <div>
                <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#554052]">
                  India-wide Delivery
                </h4>
                <p className="text-[11px] text-[#554052]/80 mt-0.5">Across India</p>
              </div>
            </div>

            {/* Marker 3: Dispatch in */}
            <div className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-0">
              <Package className="w-5 h-5 text-[#8C5A7D] shrink-0" />
              <div>
                <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#554052]">
                  Dispatch in
                </h4>
                <p className="text-[11px] text-[#554052]/80 mt-0.5">3–5 business days</p>
              </div>
            </div>

            {/* Marker 4: Exchange Only */}
            <div className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-0">
              <RotateCcw className="w-5 h-5 text-[#8C5A7D] shrink-0" />
              <div>
                <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#554052]">
                  Exchange Only
                </h4>
                <p className="text-[11px] text-[#554052]/80 mt-0.5">(T&C apply)</p>
              </div>
            </div>

            {/* Marker 5: Minimal Packaging */}
            <div className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-0 col-span-2 sm:col-span-1">
              <Leaf className="w-5 h-5 text-[#8C5A7D] shrink-0" />
              <div>
                <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#554052]">
                  Minimal
                </h4>
                <p className="text-[11px] text-[#554052]/80 mt-0.5">Eco-conscious Packaging</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
