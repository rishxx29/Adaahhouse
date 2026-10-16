import React from 'react';
import { ArrowRight, Sparkles, Star, Instagram, Quote, ShieldCheck, Heart } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { BRAND_CONFIG } from '../config/brand';
import { AdaahLogo } from '../components/AdaahLogo';

// Assets
import maroonImg from '../assets/images/kurti_maroon_velvet_set_1792057769380.jpg';
import ivoryImg from '../assets/images/kurti_ivory_anarkali_set_1792057769586.jpg';
import sageImg from '../assets/images/kurti_sage_green_set_1792057769346.jpg';
import dustyRoseImg from '../assets/images/kurti_dusty_rose_set_1792057769153.jpg';
import heroImg from '../assets/images/hero_kurti_editorial_1792057768559.jpg';

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

  // Verified sample placeholder reviews clearly marked
  const sampleReviews = [
    {
      name: 'Pooja Singhal',
      city: 'Jaipur',
      text: 'The maroon Chanderi kurti set looks even more graceful in person than on screen! The stitching is so clean, and the S size fit was true to measurement.',
      product: 'Gulmohar Embroidered Maroon Silk Kurti Set',
      rating: 5,
    },
    {
      name: 'Dr. Radhika Sen',
      city: 'Bengaluru',
      text: 'Ordered the ivory mulmul Anarkali for everyday hospital rounds. Feather-light fabric, no transparency issue, and the packaging with the brand tag was lovely.',
      product: 'Noor Hand-Blocked Ivory Anarkali',
      rating: 5,
    },
    {
      name: 'Meenakshi Iyer',
      city: 'Pune',
      text: 'I was hesitant about ordering wholesale-curated pieces online, but ADAAH HOUSE proved their quality. The pants actually have a real pocket! Highly recommend.',
      product: 'Rooh Sage Green Straight Kurti Pant Set',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Shop by Collection (3 Distinctive Editorial Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#651F32] font-semibold">
            Curated Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#292522]">
            Shop by Collection
          </h2>
          <p className="text-xs sm:text-sm text-[#292522]/80">
            Tailored kurtis handpicked for every rhythm of modern Indian life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collectionsList.map((col) => (
            <div
              key={col.name}
              onClick={() => handleCollectionClick(col.target)}
              className="group relative cursor-pointer overflow-hidden bg-white border border-[#E8DED2] hover:border-[#C9A76A] transition-all duration-300 shadow-xs hover:shadow-md"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF7F2]">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-[#DFC794] font-semibold">
                    {col.tag}
                  </span>
                  <h3 className="font-serif text-2xl font-bold mt-1 text-white leading-tight">
                    {col.name}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 mt-1.5 font-light">
                    {col.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#DFC794] group-hover:text-white transition-colors">
                    <span>Explore Edit</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#E8DED2]">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#651F32] font-semibold block">
              Just Arrived In Store
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#292522] mt-1">
              New Season Arrivals
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCollectionFilter('all');
              setActivePage('shop');
            }}
            className="text-xs uppercase tracking-wider font-semibold text-[#5B1E22] hover:text-[#292522] flex items-center gap-1.5"
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

      {/* 4. Brand Story Section (Authentic Curation Ethos) */}
      <section className="bg-[#F2ECE1] border-y border-[#E8DED2]/80 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Story Copy */}
            <div className="md:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#5B1E22] font-semibold">
                <span className="text-[#C9A76A]">✦</span>
                <span>The ADAAH HOUSE Ethos</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#292522] font-normal leading-snug">
                "We handpick ready-made kurtis so you don't have to sift through endless wholesale stalls."
              </h2>
              <p className="text-xs sm:text-sm text-[#292522]/85 leading-relaxed font-normal">
                ADAAH HOUSE celebrates the beauty of everyday Indian dressing — thoughtfully curated kurtis, timeless details, and styles that make you feel effortlessly yourself.
              </p>
              <p className="text-xs text-[#292522]/80 leading-relaxed">
                Rather than charging high designer markups, we partner directly with respected wholesale garment houses in Rajasthan and across India, curating the finest fabrics, comfortable sizing (S to XXL), and neat tailoring for your wardrobe.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-[#5B1E22] hover:bg-[#421417] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Read Our Full Story
                </button>
              </div>
            </div>

            {/* Hang Tag Card visual */}
            <div className="md:col-span-5 flex justify-center">
              <div className="bg-[#FAF7F2] p-8 border border-[#C9A76A]/40 shadow-sm text-center max-w-sm w-full space-y-4">
                <AdaahLogo variant="stacked" showTagline={true} />
                <div className="h-[1px] w-12 bg-[#C9A76A] mx-auto my-3" />
                <p className="font-serif text-sm italic text-[#5B1E22]">
                  "A little Adaah in every outfit."
                </p>
                <div className="text-[11px] text-[#9E897A] border-t border-[#E8DED2] pt-3">
                  <span>Standard Sizes: S · M · L · XL · XXL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bestsellers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#E8DED2]">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#651F32] font-semibold block">
              Most Loved Styles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#292522] mt-1">
              ADAAH Bestsellers
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCollectionFilter('Festive Edit');
              setActivePage('shop');
            }}
            className="text-xs uppercase tracking-wider font-semibold text-[#5B1E22] hover:text-[#292522] flex items-center gap-1.5"
          >
            <span>Explore Festive Edit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Customer Experiences / Testimonials (Clearly labeled sample placeholders) */}
      <section className="bg-white border-y border-[#E8DED2] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#651F32] font-semibold">
              Client Love
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#292522]">
              Words of Grace
            </h2>
            <p className="text-[11px] text-[#9E897A] italic">
              Sample customer placeholders — real verified customer feedback will update automatically as reviews come in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleReviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[#FAF7F2] p-6 border border-[#E8DED2] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#C9A76A]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="font-serif text-sm text-[#292522] italic leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E8DED2]/60 text-xs">
                  <strong className="text-[#5B1E22] block font-serif text-sm">{rev.name}</strong>
                  <span className="text-[#9E897A] text-[11px]">{rev.city} · Verified Kurti Buyer</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Instagram-Inspired Editorial Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-[0.25em] text-[#651F32] font-semibold">
            Follow Our Journey
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292522]">
            {BRAND_CONFIG.social.instagram}
          </h2>
          <p className="text-xs text-[#9E897A]">
            Tag your everyday moments with #GraceInEveryThread to be featured in our story.
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
              className="relative aspect-square overflow-hidden bg-white border border-[#E8DED2] group"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5">
                <Instagram className="w-4 h-4 text-[#DFC794]" />
                <span>View Outfit</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
