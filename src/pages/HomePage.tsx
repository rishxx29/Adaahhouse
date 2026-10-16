import React from 'react';
import { ArrowRight, Sparkles, Star, Shield, RotateCcw, Truck, Instagram, Heart, Leaf, Flower2, UserCheck } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { BRAND_CONFIG } from '../config/brand';
import { HouseOfRiiLogo, HouseOfRiiLotus } from '../components/AdaahLogo';

// Photoshoot imagery
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
  } = useStore();

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 3);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  const handleCollectionClick = (target: string) => {
    setSelectedCollectionFilter(target);
    setSelectedCategoryFilter('all');
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const collectionsList = [
    {
      name: 'Bestseller',
      target: 'bestseller',
      tag: 'Most-Loved Silhouettes',
      description: 'Our top customer favourites and artisanal bestsellers tailored for perfection.',
      image: maroonImg,
    },
    {
      name: 'Everyday Wear',
      target: 'Everyday Wear',
      tag: 'Kurti Sets, Bottoms & Coords',
      description: 'Airy, breathable pure cotton kurti sets, cigarette pants, palazzos, and everyday coords for daily grace.',
      image: ivoryImg,
    },
    {
      name: 'Festive & Wedding Edits',
      target: 'Festive & Wedding Edits',
      tag: 'Suits, Kurta Sets & Shararas',
      description: 'Regal Chanderi suits, zardozi kurta sets, micro-velvet coords, and heavy festive sharara sets.',
      image: sageImg,
    },
  ];

  // Brand icons from Image 1 guideline
  const brandPillars = [
    {
      icon: Leaf,
      title: 'Natural Fabrics',
      desc: 'Pure breathable cottons, mulmuls & chanderi silks.',
    },
    {
      icon: Flower2,
      title: 'Handcrafted Style',
      desc: 'Authentic Indian artisanal heritage & gotta-patti motifs.',
    },
    {
      icon: Truck,
      title: 'Pan-India Shipping',
      desc: 'Free express shipping across all states & pin codes.',
    },
    {
      icon: Heart,
      title: 'Loved By You',
      desc: 'Designed for comfort, ease & compliments everywhere.',
    },
    {
      icon: UserCheck,
      title: 'Personalized Support',
      desc: 'Friendly size advice & exchange concierge on WhatsApp.',
    },
  ];

  // Verified customer experiences
  const sampleReviews = [
    {
      name: 'Pooja Singhal',
      city: 'Jaipur',
      text: 'The maroon Chanderi kurti set looks even more graceful in person than on screen! The stitching is so clean, and the S size fit was true to measurement.',
      product: 'Shahi Maroon Silk Kurta Set',
      rating: 5,
    },
    {
      name: 'Dr. Radhika Sen',
      city: 'Bengaluru',
      text: 'Ordered the ivory mulmul suit set for everyday hospital rounds. Feather-light fabric, no transparency issue, and the packaging with the brand tag was lovely.',
      product: 'Noor Ivory Angrakha Suit Set',
      rating: 5,
    },
    {
      name: 'Meenakshi Iyer',
      city: 'Pune',
      text: 'I was hesitant about ordering ethnic wear online, but HOUSE OF RII proved their quality. The pants actually have a real pocket! Highly recommend.',
      product: 'Rooh Sage Green Daily Kurti Set',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* Brand Icons Strip (from official guideline image) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 py-6 px-4 bg-white border border-[#D5C2D7] rounded-xs shadow-2xs">
          {brandPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-3 space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#8C5A7D]/10 flex items-center justify-center text-[#8C5A7D]">
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#554052]">
                  {p.title}
                </h4>
                <p className="text-[11px] text-[#554052]/75 leading-tight">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Shop by Collection (Editorial Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold">
            Curated Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#554052]">
            Shop by Collection
          </h2>
          <p className="text-xs sm:text-sm text-[#554052]/80">
            Tailored kurtas and ensembles handpicked for every rhythm of modern Indian life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collectionsList.map((col) => (
            <div
              key={col.name}
              onClick={() => handleCollectionClick(col.target)}
              className="group relative cursor-pointer overflow-hidden bg-white border border-[#D5C2D7] hover:border-[#8C5A7D] transition-all duration-300 shadow-xs hover:shadow-md"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F6F0F4]">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-[#D5C2D7] font-semibold">
                    {col.tag}
                  </span>
                  <h3 className="font-serif text-2xl font-bold mt-1 text-white leading-tight">
                    {col.name}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 mt-1.5 font-light">
                    {col.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#D5C2D7] group-hover:text-white transition-colors">
                    <span>Explore Edit</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#D5C2D7]">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold block">
              Just Arrived In Store
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#554052] mt-1">
              New Season Arrivals
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCollectionFilter('all');
              setActivePage('shop');
            }}
            className="text-xs uppercase tracking-wider font-semibold text-[#8C5A7D] hover:text-[#554052] flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Brand Ethos & Unboxing Preview */}
      <section className="bg-white border-y border-[#D5C2D7] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold block">
                The House of Rii Ethos
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#554052] leading-tight">
                Rooted in Tradition, <br />
                <span className="italic font-normal text-[#8C5A7D]">Made for Today.</span>
              </h2>
              <p className="text-sm text-[#554052]/90 leading-relaxed font-body">
                HOUSE OF RII celebrates the beauty of everyday Indian dressing — thoughtfully curated kurtas, timeless details, and styles that make you feel effortlessly yourself.
              </p>
              <p className="text-xs text-[#554052]/80 leading-relaxed">
                Rather than charging high designer markups, we partner directly with respected wholesale garment houses in Rajasthan and across India, curating the finest fabrics, comfortable sizing (S to XXL), and neat tailoring for your wardrobe.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Read Our Full Story
                </button>
              </div>
            </div>

            {/* Clothing Tag & Packaging Card visual (Image 2 style) */}
            <div className="md:col-span-5 flex justify-center">
              <div className="bg-[#F6F0F4] p-8 border border-[#D5C2D7] shadow-sm text-center max-w-sm w-full space-y-4 rounded-xs">
                <HouseOfRiiLogo variant="stacked" showTagline={true} />
                <div className="h-[1px] w-12 bg-[#A185A4] mx-auto my-3" />
                <p className="font-serif text-sm italic text-[#8C5A7D]">
                  "Wear tradition, live your story."
                </p>
                <div className="text-[11px] text-[#554052]/75 border-t border-[#D5C2D7] pt-3">
                  <span>Standard Sizes: S · M · L · XL · XXL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bestsellers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#D5C2D7]">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold block">
              Most Loved Styles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#554052] mt-1">
              HOUSE OF RII Bestsellers
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCollectionFilter('Festive & Wedding Edits');
              setActivePage('shop');
            }}
            className="text-xs uppercase tracking-wider font-semibold text-[#8C5A7D] hover:text-[#554052] flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Festive Edit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Customer Experiences / Testimonials */}
      <section className="bg-white border-y border-[#D5C2D7] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold">
              Client Love
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#554052]">
              Words of Grace
            </h2>
            <p className="text-[11px] text-[#A185A4] italic">
              Verified customer feedback from lovers of House of Rii.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleReviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[#F6F0F4] p-6 border border-[#D5C2D7] flex flex-col justify-between space-y-4"
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

      {/* 7. Instagram-Inspired Editorial Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold">
            Follow Our Journey
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
            { img: maroonImg, title: 'Gulmohar Silk' },
            { img: ivoryImg, title: 'Noor Mulmul' },
            { img: sageImg, title: 'Rooh Everyday' },
            { img: dustyRoseImg, title: 'Mehr Gotta Patti' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden bg-white border border-[#D5C2D7] group"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5">
                <Instagram className="w-4 h-4 text-[#D5C2D7]" />
                <span>View Outfit</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
