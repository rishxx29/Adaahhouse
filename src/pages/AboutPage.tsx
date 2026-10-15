import React from 'react';
import { Sparkles, Heart, PackageCheck, ShieldCheck, CheckCircle } from 'lucide-react';
import { AdaahLogo } from '../components/AdaahLogo';
import { BRAND_CONFIG } from '../config/brand';
import editorialImg from '../assets/images/hero_kurti_editorial_1792057768559.jpg';
import ivoryKurtiImg from '../assets/images/kurti_ivory_anarkali_set_1792057769586.jpg';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#FAF7F2] py-12 sm:py-20 animate-in fade-in duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Brand Monogram & Lead Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <AdaahLogo variant="primary" showTagline={true} className="mb-4" />
          <h2 className="font-serif text-3xl sm:text-4xl text-[#292522] leading-tight font-normal">
            Everyday luxury with an Indian soul.
          </h2>
          <div className="h-[1px] w-24 bg-[#C9A76A] mx-auto" />
        </div>

        {/* Editorial Split Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/5] bg-white border border-[#E8DED2] p-2 shadow-sm">
            <img
              src={editorialImg}
              alt="ADAAH HOUSE Curated Fashion"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="space-y-6 text-[#292522]/85 text-sm sm:text-base leading-relaxed">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#651F32] font-semibold">
              <span className="text-[#C9A76A]">✦</span>
              <span>Our Philosophy</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292522] leading-snug">
              Curated for women who love effortless elegance.
            </h3>

            <p>
              <strong>ADAAH HOUSE</strong> celebrates the beauty of everyday Indian dressing — thoughtfully curated kurtis, timeless details, and styles that make you feel effortlessly yourself.
            </p>

            <p>
              We believe great ethnic wear shouldn't be reserved only for heavy festivals or inaccessible luxury prices. Instead of manufacturing our own garments, we meticulously travel, inspect, and select ready-made pieces directly from trusted wholesale fashion houses across India.
            </p>

            <p>
              Every kurti in our collection undergoes our individual quality check for fabric comfort, seam durability, and genuine Indian sizing from <strong>S to XXL</strong>.
            </p>
          </div>
        </div>

        {/* Hang Tag & Unboxing Experience Card (Faithfully referencing the uploaded brand board) */}
        <div className="bg-[#F2ECE1] border border-[#C9A76A]/40 p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#5B1E22] font-semibold">
              The ADAAH HOUSE Unboxing Experience
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292522]">
              "A little Adaah in every outfit."
            </h3>
            <p className="text-xs text-[#292522]/80">
              Every parcel is hand-packaged with custom tissue wrapping, a personalized thank-you note, and our signature botanical brand tag.
            </p>
          </div>

          {/* Visual hang tag preview card replicating user's uploaded asset */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Hang Tag Front */}
            <div className="bg-[#FAF7F2] p-8 border border-[#E8DED2] text-center flex flex-col items-center justify-between shadow-xs">
              <div className="w-2 h-2 rounded-full border border-[#9E897A] mb-4" />
              <div className="space-y-2">
                <AdaahLogo variant="primary" showTagline={true} />
              </div>
              <p className="font-serif italic text-xs text-[#5B1E22] mt-6">
                Made to feel like you.
              </p>
            </div>

            {/* Hang Tag Back */}
            <div className="bg-[#FAF7F2] p-8 border border-[#E8DED2] text-center flex flex-col justify-between shadow-xs">
              <div className="w-2 h-2 rounded-full border border-[#9E897A] mx-auto mb-4" />
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-[#C9A76A] font-semibold">
                  A Little Note From Us
                </span>
                <p className="text-xs text-[#292522]/90 leading-relaxed font-serif text-base italic">
                  "{BRAND_CONFIG.packagingQuote.body}"
                </p>
                <div className="pt-2 text-xs font-medium text-[#5B1E22]">
                  <p>{BRAND_CONFIG.packagingQuote.signature}</p>
                  <p className="text-[11px] text-[#9E897A] mt-0.5">{BRAND_CONFIG.social.instagram}</p>
                </div>
              </div>
              <div className="text-[9px] uppercase tracking-widest text-[#9E897A] mt-6">
                100% Inspected · Ready-To-Wear
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Trust */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="bg-white p-6 border border-[#E8DED2] space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#5B1E22]" />
            <h4 className="font-serif text-base font-bold text-[#292522]">Handpicked Curation</h4>
            <p className="text-xs text-[#292522]/80 leading-relaxed">
              We test each wholesale lot for true-to-size drape, neat stitching, and skin-friendly breathability before listing.
            </p>
          </div>

          <div className="bg-white p-6 border border-[#E8DED2] space-y-2">
            <PackageCheck className="w-6 h-6 text-[#5B1E22]" />
            <h4 className="font-serif text-base font-bold text-[#292522]">Honest Fashion Pricing</h4>
            <p className="text-xs text-[#292522]/80 leading-relaxed">
              By curating wholesale lots directly for you, we deliver boutique ethnic wear without inflated retail markups.
            </p>
          </div>

          <div className="bg-white p-6 border border-[#E8DED2] space-y-2">
            <Heart className="w-6 h-6 text-[#5B1E22]" />
            <h4 className="font-serif text-base font-bold text-[#292522]">Personal Care</h4>
            <p className="text-xs text-[#292522]/80 leading-relaxed">
              We are accessible via WhatsApp at {BRAND_CONFIG.contact.phone} for fit advice, styling tips, and order updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
