import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Star,
  Shield,
  RotateCcw,
  Truck,
  Instagram,
  Heart,
  Check,
  Send,
  ChevronRight,
} from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { BRAND_CONFIG } from '../config/brand';
import { HouseOfRiiLogo, HouseOfRiiLotus } from '../components/AdaahLogo';

// Photoshoot imagery
import heroPinkSuit from '../assets/images/hero-pink-suit.jpg';
import maroonImg from '../assets/images/kurti_maroon_velvet_set_1792057769380.jpg';
import ivoryImg from '../assets/images/kurti_ivory_anarkali_set_1792057769586.jpg';
import sageImg from '../assets/images/kurti_sage_green_set_1792057769346.jpg';
import dustyRoseImg from '../assets/images/kurti_dusty_rose_set_1792057769153.jpg';

export const HomePage: React.FC = () => {
  const {
    products,
    setActivePage,
    setSelectedCollectionFilter,
    setSelectedCategoryFilter,
    showToast,
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Active Bestseller Tab State
  const [activeMainTab, setActiveMainTab] = useState<'bestseller' | 'everyday' | 'festive'>('bestseller');
  const [activeSubTab, setActiveSubTab] = useState<string>('ALL');

  // Filter products for New Collection and Bestsellers (5 spacious cards matching 4-5 items per row)
  const newArrivals = products.filter((p) => p.isNewArrival);
  const displayNewArrivals = newArrivals.length > 0 ? newArrivals.slice(0, 5) : products.slice(0, 5);

  // Tab filtering for Bestsellers
  const filteredBestsellers = products.filter((product) => {
    if (activeMainTab === 'bestseller') {
      return product.isBestseller;
    }
    if (activeMainTab === 'everyday') {
      const isEveryday = product.collection === 'Everyday Wear' || product.collection === 'Everyday Elegance';
      if (!isEveryday) return false;
      if (activeSubTab === 'ALL') return true;
      if (activeSubTab === 'KURTI_SET') return product.category === 'Kurti Set';
      if (activeSubTab === 'BOTTOM_WEAR') return product.category === 'Bottom Wear';
      if (activeSubTab === 'COORD_SET') return product.category === 'Coord Set';
      return true;
    }
    if (activeMainTab === 'festive') {
      const isFestive = product.collection === 'Festive & Wedding Edits' || product.collection === 'Festive Glamour';
      if (!isFestive) return false;
      if (activeSubTab === 'ALL') return true;
      if (activeSubTab === 'SUIT_SETS') return product.category === 'Suit Set' || product.category === 'Kurti Set';
      if (activeSubTab === 'KURTA_SETS') return product.category === 'Kurti Set';
      if (activeSubTab === 'COORD_SETS') return product.category === 'Coord Set';
      if (activeSubTab === 'SHARARA_SETS') return product.category === 'Sharara Set';
      return true;
    }
    return true;
  });

  const handleCategoryCircleClick = (type: string) => {
    if (type === 'KURTAS') {
      setSelectedCollectionFilter('all');
      setSelectedCategoryFilter('Kurti');
    } else if (type === 'KURTA SETS') {
      setSelectedCollectionFilter('all');
      setSelectedCategoryFilter('Kurti Set');
    } else if (type === 'CO-ORDS') {
      setSelectedCollectionFilter('all');
      setSelectedCategoryFilter('Coord Set');
    } else if (type === 'FESTIVE WEAR') {
      setSelectedCollectionFilter('Festive & Wedding Edits');
      setSelectedCategoryFilter('all');
    } else if (type === 'NEW IN') {
      setSelectedCollectionFilter('all');
      setSelectedCategoryFilter('all');
    } else if (type === 'BESTSELLERS') {
      setSelectedCollectionFilter('bestseller');
      setSelectedCategoryFilter('all');
    } else if (type === 'COTTON WEAR') {
      setSelectedCollectionFilter('Everyday Wear');
      setSelectedCategoryFilter('all');
    } else if (type === 'CHIKANKARI') {
      setSelectedCollectionFilter('all');
      setSelectedCategoryFilter('all');
    } else if (type === 'PRINTED EDIT') {
      setSelectedCollectionFilter('Everyday Wear');
      setSelectedCategoryFilter('all');
    } else if (type === 'ACCESSORIES') {
      showToast('Styling accessories and jewelry dropping soon in The Rii Edit!');
      return;
    }
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    setIsSubscribed(true);
    showToast('Welcome to the House of Rii Circle! Use code RII10 for 10% off.');
  };

  // 10 Circular Category Tiles matching Reference Image 1
  const categoryCircles = [
    { name: 'KURTAS', img: '/categories/kurtas.jpg' },
    { name: 'KURTA SETS', img: '/categories/kurta_sets.jpg' },
    { name: 'CO-ORDS', img: '/categories/coords.jpg' },
    { name: 'FESTIVE WEAR', img: '/categories/festive_wear.jpg' },
    { name: 'NEW IN', img: '/categories/new_in.jpg' },
    { name: 'BESTSELLERS', img: '/categories/bestsellers.jpg' },
    { name: 'COTTON WEAR', img: '/categories/cotton_wear.jpg' },
    { name: 'CHIKANKARI', img: '/categories/chikankari.jpg' },
    { name: 'PRINTED EDIT', img: '/categories/printed_edit.jpg' },
    { name: 'ACCESSORIES', img: '/categories/accessories.jpg' },
  ];

  // Customer Reviews
  const verifiedReviews = [
    {
      name: 'Pooja Singhal',
      city: 'Jaipur',
      text: 'The mauve Chanderi kurti set looks even more graceful in person than on screen! The stitching is so neat, and the S size fit was true to measurement.',
      product: 'Shahi Mauve Silk Kurta Set',
      rating: 5,
    },
    {
      name: 'Dr. Radhika Sen',
      city: 'Bengaluru',
      text: 'Ordered the ivory mulmul suit set for everyday hospital rounds. Feather-light fabric, no transparency issues, and the signature packaging with the tag was lovely.',
      product: 'Noor Ivory Angrakha Suit Set',
      rating: 5,
    },
    {
      name: 'Meenakshi Iyer',
      city: 'Pune',
      text: 'I was hesitant about ordering ethnic wear online, but HOUSE OF RII proved their quality. The pants actually have a functional pocket! Highly recommend.',
      product: 'Rooh Sage Green Daily Kurti Set',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-14 sm:space-y-20 pb-16 bg-[#F6F0F4]">
      {/* SECTION 1: EDITORIAL HERO BANNER & 4-PILLAR BENEFITS STRIP */}
      <HeroSection />

      {/* SECTION 2: SHOP BY CATEGORY (10 Circular Tiles matching Reference Image) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#D5C2D7]">
          <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-[0.16em] text-[#554052]">
            SHOP BY CATEGORY
          </h2>
          <button
            onClick={() => {
              setSelectedCollectionFilter('all');
              setSelectedCategoryFilter('all');
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs uppercase tracking-wider font-semibold text-[#8C5A7D] hover:text-[#554052] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Circular Category Tiles: All 10 displayed across desktop in a row */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 overflow-x-auto lg:overflow-x-visible pb-4 pt-1 scrollbar-none scroll-smooth">
          {categoryCircles.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryCircleClick(cat.name)}
              className="flex flex-col items-center gap-2.5 shrink-0 group cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[84px] lg:h-[84px] rounded-full p-0.5 border-2 border-[#D5C2D7] group-hover:border-[#8C5A7D] transition-all duration-300 shadow-2xs group-hover:shadow-md bg-[#FAF5F8]">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#F6F0F4]">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-[#554052] group-hover:text-[#8C5A7D] transition-colors text-center whitespace-nowrap">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: NEW COLLECTION (Grid matching reference layout with VIEW ALL) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-3 border-b border-[#D5C2D7]">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-[#554052]">
              NEW COLLECTION
            </h2>
            <div className="hidden sm:block h-[1px] w-8 bg-[#A185A4]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C5A7D] font-medium">
              A CURATED COLLECTION FOR YOUR BEAUTIFUL DAYS.
            </span>
          </div>

          <button
            onClick={() => {
              setSelectedCollectionFilter('all');
              setSelectedCategoryFilter('all');
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="self-start sm:self-auto px-5 py-2 bg-[#8C5A7D] hover:bg-[#554052] text-white text-[11px] uppercase tracking-wider font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            VIEW ALL
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
          {displayNewArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 4: BESTSELLERS WITH INTERACTIVE TABS */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold">
            <HouseOfRiiLotus size={16} color="#8C5A7D" />
            <span>CUSTOMER FAVOURITES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#554052]">
            HOUSE OF RII Bestsellers
          </h2>
          <p className="text-xs sm:text-sm text-[#554052]/80">
            Handpicked bestsellers crafted for effortless grace and everyday Indian living.
          </p>
        </div>

        {/* Main Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
          <button
            onClick={() => {
              setActiveMainTab('bestseller');
              setActiveSubTab('ALL');
            }}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
              activeMainTab === 'bestseller'
                ? 'bg-[#8C5A7D] text-white shadow-xs'
                : 'bg-[#FAF5F8] text-[#554052] border border-[#D5C2D7] hover:border-[#8C5A7D]'
            }`}
          >
            Bestseller
          </button>

          <button
            onClick={() => {
              setActiveMainTab('everyday');
              setActiveSubTab('ALL');
            }}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
              activeMainTab === 'everyday'
                ? 'bg-[#8C5A7D] text-white shadow-xs'
                : 'bg-[#FAF5F8] text-[#554052] border border-[#D5C2D7] hover:border-[#8C5A7D]'
            }`}
          >
            Everyday Wear
          </button>

          <button
            onClick={() => {
              setActiveMainTab('festive');
              setActiveSubTab('ALL');
            }}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
              activeMainTab === 'festive'
                ? 'bg-[#8C5A7D] text-white shadow-xs'
                : 'bg-[#FAF5F8] text-[#554052] border border-[#D5C2D7] hover:border-[#8C5A7D]'
            }`}
          >
            Festive &amp; Wedding Edits
          </button>
        </div>

        {/* Sub-Tabs for Everyday Wear */}
        {activeMainTab === 'everyday' && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 animate-in fade-in duration-200">
            {['ALL', 'KURTI_SET', 'BOTTOM_WEAR', 'COORD_SET'].map((subKey) => {
              const labels: Record<string, string> = {
                ALL: 'All Everyday',
                KURTI_SET: 'Kurti Sets',
                BOTTOM_WEAR: 'Bottom Wear',
                COORD_SET: 'Co-ord Sets',
              };
              return (
                <button
                  key={subKey}
                  onClick={() => setActiveSubTab(subKey)}
                  className={`px-3.5 py-1.5 text-[11px] font-medium tracking-wider rounded-full transition-all cursor-pointer ${
                    activeSubTab === subKey
                      ? 'bg-[#554052] text-white shadow-xs'
                      : 'bg-[#FAF5F8] text-[#554052] border border-[#D5C2D7] hover:bg-[#FAF5F8]'
                  }`}
                >
                  {labels[subKey]}
                </button>
              );
            })}
          </div>
        )}

        {/* Sub-Tabs for Festive & Wedding Edits */}
        {activeMainTab === 'festive' && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 animate-in fade-in duration-200">
            {['ALL', 'SUIT_SETS', 'KURTA_SETS', 'COORD_SETS', 'SHARARA_SETS'].map((subKey) => {
              const labels: Record<string, string> = {
                ALL: 'All Festive Edits',
                SUIT_SETS: 'Suit Sets',
                KURTA_SETS: 'Kurta Sets',
                COORD_SETS: 'Co-ord Sets',
                SHARARA_SETS: 'Sharara Sets',
              };
              return (
                <button
                  key={subKey}
                  onClick={() => setActiveSubTab(subKey)}
                  className={`px-3.5 py-1.5 text-[11px] font-medium tracking-wider rounded-full transition-all cursor-pointer ${
                    activeSubTab === subKey
                      ? 'bg-[#554052] text-white shadow-xs'
                      : 'bg-[#FAF5F8] text-[#554052] border border-[#D5C2D7] hover:bg-[#FAF5F8]'
                  }`}
                >
                  {labels[subKey]}
                </button>
              );
            })}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {filteredBestsellers.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 5: PROMOTIONAL BANNER FOR FESTIVE & OCCASION WEAR */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xs bg-[#554052] text-[#F6F0F4] border border-[#D5C2D7] shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#D5C2D7] font-semibold">
                <Sparkles className="w-4 h-4 text-[#D5C2D7]" />
                <span>CELEBRATE IN TIMELESS GRACE</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white">
                The Festive &amp; Wedding Edit
              </h3>
              <p className="text-sm text-[#F6F0F4]/85 leading-relaxed max-w-lg font-light">
                Intricate zardozi embroidery, regal Chanderi silk blends, and graceful organza dupattas tailored for weddings, celebrations, and cherished festive moments.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedCollectionFilter('Festive & Wedding Edits');
                    setSelectedCategoryFilter('all');
                    setActivePage('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-8 py-3.5 bg-[#8C5A7D] hover:bg-[#FAF5F8] hover:text-[#554052] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-sm cursor-pointer"
                >
                  EXPLORE FESTIVE EDIT →
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto lg:h-full overflow-hidden">
              <img
                src={heroPinkSuit}
                alt="Festive Edit House of Rii"
                className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#554052] via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: THE RII EDIT (Styling Inspiration & Stories) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold">
            STYLE JOURNAL
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#554052]">
            The Rii Edit
          </h2>
          <p className="text-xs sm:text-sm text-[#554052]/80">
            Outfit inspiration and curated styling guides for every occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'The Daytime Linen Story',
              desc: 'Airy, breathable silhouettes and soft pastels crafted for sunny brunches and casual workdays.',
              tag: 'Everyday Styling',
              img: '/products/prod_sage_linen_coord.jpg',
              target: 'Everyday Wear',
            },
            {
              title: 'Subtle Zardozi & Organza',
              desc: 'The art of quiet festive luxury: delicate gold embroidery on handloom Chanderi silks.',
              tag: 'Festive Notes',
              img: '/products/prod_lavender_anarkali.jpg',
              target: 'Festive & Wedding Edits',
            },
            {
              title: 'Modern Traditional Co-ords',
              desc: 'Effortless two-piece sets that bridge heritage craftsmanship with contemporary comfort.',
              tag: 'Trend Edit',
              img: '/products/prod_plum_velvet_coord.jpg',
              target: 'Everyday Wear',
            },
          ].map((edit, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedCollectionFilter(edit.target);
                setSelectedCategoryFilter('all');
                setActivePage('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#FAF5F8] border border-[#D5C2D7] overflow-hidden group cursor-pointer shadow-2xs hover:shadow-xs transition-all duration-300 rounded-xs"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F6F0F4]">
                <img
                  src={edit.img}
                  alt={edit.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#FAF5F8]/90 backdrop-blur-xs text-[10px] uppercase tracking-wider font-semibold text-[#8C5A7D] border border-[#D5C2D7]/60">
                  {edit.tag}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#554052] group-hover:text-[#8C5A7D] transition-colors">
                  {edit.title}
                </h3>
                <p className="text-xs text-[#554052]/80 leading-relaxed font-light">
                  {edit.desc}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#8C5A7D] uppercase tracking-wider">
                  <span>Explore Look</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: CLIENT LOVE & REVIEWS */}
      <section className="bg-[#FAF5F8] border-y border-[#D5C2D7] py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold">
              GENUINE EXPERIENCES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#554052]">
              Words of Grace
            </h2>
            <p className="text-xs text-[#A185A4] italic">
              Verified customer feedback from lovers of House of Rii across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verifiedReviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[#F6F0F4] p-6 border border-[#D5C2D7] flex flex-col justify-between space-y-4 rounded-xs shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#8C5A7D]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="font-serif text-sm text-[#554052] italic leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#D5C2D7]/80 text-xs">
                  <strong className="text-[#8C5A7D] block font-serif text-sm">{rev.name}</strong>
                  <span className="text-[#554052]/70 text-[11px]">{rev.city} · Verified Buyer</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: INSTAGRAM GALLERY */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold">
            FOLLOW OUR JOURNEY
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#554052]">
            {BRAND_CONFIG.social.instagram}
          </h2>
          <p className="text-xs text-[#A185A4]">
            Tag your everyday moments with #TraditionStyledYourWay to be featured in our story.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { img: '/products/prod_dusty_mauve_kurta.jpg', title: 'Mauve Silk Floral' },
            { img: '/products/prod_lilac_cotton_kurta.jpg', title: 'Noor Mulmul' },
            { img: '/products/prod_rose_pink_coord.jpg', title: 'Rooh Everyday' },
            { img: '/products/prod_dusty_rose_festive_kurta.jpg', title: 'Mehr Gotta Patti' },
          ].map((item, idx) => (
            <a
              key={idx}
              href={BRAND_CONFIG.social.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden bg-[#FAF5F8] border border-[#D5C2D7] group block rounded-xs shadow-2xs"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#554052]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5">
                <Instagram className="w-4 h-4 text-[#D5C2D7]" />
                <span>View Outfit</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* SECTION 9: NEWSLETTER SUBSCRIPTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FAF5F8] border border-[#D5C2D7] p-8 sm:p-12 text-center space-y-4 rounded-xs shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#8C5A7D]/10 flex items-center justify-center mx-auto text-[#8C5A7D]">
            <HouseOfRiiLotus size={24} color="#8C5A7D" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#554052]">
              Join The House of Rii Circle
            </h3>
            <p className="text-xs sm:text-sm text-[#554052]/80 max-w-md mx-auto">
              Subscribe to receive exclusive early access to seasonal edits, styling notes, and a flat 10% discount on your first order.
            </p>
          </div>

          {isSubscribed ? (
            <div className="p-4 bg-[#F6F0F4] border border-[#D5C2D7] text-xs font-semibold text-[#8C5A7D] flex items-center justify-center gap-2 max-w-md mx-auto">
              <Check className="w-4 h-4" />
              <span>You're in! Use coupon code <strong>RII10</strong> at checkout for 10% off.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-[#F6F0F4] border border-[#D5C2D7] px-4 py-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D] placeholder:text-[#A185A4]"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <p className="text-[10px] text-[#A185A4]">
            No spam, ever. Unsubscribe with one click anytime.
          </p>
        </div>
      </section>
    </div>
  );
};
