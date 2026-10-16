import React from 'react';
import { Sparkles, Heart, PackageCheck, ShieldCheck, CheckCircle } from 'lucide-react';
import { HouseOfRiiLogo } from '../components/AdaahLogo';
import { BRAND_CONFIG } from '../config/brand';
import editorialImg from '../assets/images/hero_kurti_editorial_1792057768559.jpg';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#F3E9EB] py-12 sm:py-20 animate-in fade-in duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Brand Monogram & Lead Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <HouseOfRiiLogo variant="primary" showTagline={true} className="mb-4" />
          <h2 className="font-serif text-3xl sm:text-4xl text-[#554052] leading-tight font-normal">
            Everyday luxury with an Indian soul.
          </h2>
          <div className="h-[1px] w-24 bg-[#A185A4] mx-auto" />
        </div>

        {/* Editorial Split Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/5] bg-white border border-[#D5C2D7] p-2 shadow-sm">
            <img
              src={editorialImg}
              alt="HOUSE OF RII Curated Fashion"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="space-y-6 text-[#554052]/90 text-sm sm:text-base leading-relaxed">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C5A7D] font-semibold">
              <span className="text-[#A185A4]">✦</span>
              <span>Our Philosophy</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#554052] leading-snug">
              Curated for women who love effortless elegance.
            </h3>

            <p>
              <strong>HOUSE OF RII</strong> celebrates the beauty of everyday Indian dressing — thoughtfully curated kurtas, timeless details, and styles that make you feel effortlessly yourself.
            </p>

            <p>
              We believe great ethnic wear shouldn't be reserved only for rare occasions or inaccessible luxury prices. Instead of heavy overheads, we travel, inspect, and select ready-made pieces directly from trusted wholesale fashion houses across India.
            </p>

            <p>
              Every garment in our collection undergoes our individual quality check for fabric comfort, seam durability, and genuine Indian sizing from <strong>S to XXL</strong>.
            </p>
          </div>
        </div>

        {/* Clothing Tag & Unboxing Experience Card (Image 2 style) */}
        <div className="bg-[#EFE7ED] border border-[#A185A4]/40 p-8 sm:p-12 space-y-8 rounded-xs">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold">
              The HOUSE OF RII Unboxing Experience
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#554052]">
              "Wear tradition, live your story."
            </h3>
            <p className="text-xs text-[#554052]/80">
              Every parcel is hand-packaged with custom tissue wrapping, a personalized thank-you note, and our signature botanical brand tag.
            </p>
          </div>

          {/* Visual hang tag preview card replicating user's uploaded asset */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Hang Tag Front */}
            <div className="bg-[#F3E9EB] p-8 border border-[#D5C2D7] text-center flex flex-col items-center justify-between shadow-xs">
              <div className="w-2 h-2 rounded-full border border-[#A185A4] mb-4" />
              <div className="space-y-2">
                <HouseOfRiiLogo variant="primary" showTagline={true} />
              </div>
              <p className="font-serif italic text-xs text-[#8C5A7D] mt-6">
                Tradition, Styled Your Way.
              </p>
            </div>

            {/* Hang Tag Back */}
            <div className="bg-[#F3E9EB] p-8 border border-[#D5C2D7] text-center flex flex-col justify-between shadow-xs">
              <div className="w-2 h-2 rounded-full border border-[#A185A4] mx-auto mb-4" />
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-[#8C5A7D] font-semibold">
                  A Little Note From Us
                </span>
                <p className="text-xs text-[#554052]/90 leading-relaxed font-serif text-base italic">
                  "{BRAND_CONFIG.packagingQuote.body}"
                </p>
                <div className="pt-2 text-xs font-medium text-[#8C5A7D]">
                  <p>{BRAND_CONFIG.packagingQuote.signature}</p>
                  <p className="text-[11px] text-[#A185A4] mt-0.5">{BRAND_CONFIG.social.instagram}</p>
                </div>
              </div>
              <div className="text-[9px] uppercase tracking-widest text-[#A185A4] mt-6">
                100% Inspected · Ready-To-Wear
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Trust */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="bg-white p-6 border border-[#D5C2D7] space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#8C5A7D]" />
            <h4 className="font-serif text-base font-bold text-[#554052]">Handpicked Curation</h4>
            <p className="text-xs text-[#554052]/80 leading-relaxed">
              We test each wholesale lot for true-to-size drape, neat stitching, and skin-friendly breathability before listing.
            </p>
          </div>

          <div className="bg-white p-6 border border-[#D5C2D7] space-y-2">
            <PackageCheck className="w-6 h-6 text-[#8C5A7D]" />
            <h4 className="font-serif text-base font-bold text-[#554052]">Honest Fashion Pricing</h4>
            <p className="text-xs text-[#554052]/80 leading-relaxed">
              By curating wholesale lots directly for you, we deliver boutique ethnic wear without inflated retail markups.
            </p>
          </div>

          <div className="bg-white p-6 border border-[#D5C2D7] space-y-2">
            <Heart className="w-6 h-6 text-[#8C5A7D]" />
            <h4 className="font-serif text-base font-bold text-[#554052]">Personal Care</h4>
            <p className="text-xs text-[#554052]/80 leading-relaxed">
              We are accessible via WhatsApp at {BRAND_CONFIG.contact.phone} for fit advice, styling tips, and order updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
