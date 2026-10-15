import React from 'react';

interface AdaahLogoProps {
  className?: string;
  variant?: 'primary' | 'stacked' | 'horizontal' | 'monogram' | 'emblem';
  theme?: 'light' | 'dark';
  showTagline?: boolean;
}

export const AdaahLogo: React.FC<AdaahLogoProps> = ({
  className = '',
  variant = 'primary',
  theme = 'light',
  showTagline = true,
}) => {
  const isDark = theme === 'dark';
  const maroonColor = isDark ? '#FAF7F2' : '#5B1E22';
  const goldColor = '#C9A76A';
  const taglineColor = isDark ? '#E8DED2' : '#651F32';

  // Stylized Lotus Blossom SVG (Matches the official ADAAH HOUSE brand icon)
  const LotusFlower = ({ size = 32 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300"
    >
      {/* Topmost ornamental dots */}
      <circle cx="50" cy="5" r="1.8" fill={goldColor} />
      <circle cx="50" cy="11" r="2.2" fill={goldColor} />

      {/* Central Flame / Lotus Core */}
      <path
        d="M50 16 C48 24 45 32 50 44 C55 32 52 24 50 16 Z"
        stroke={goldColor}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Inner Petals Left & Right */}
      <path
        d="M50 44 C42 34 38 23 44 19 C48 23 49 33 50 44 Z"
        stroke={goldColor}
        strokeWidth="1.8"
        fill="none"
      />
      <path
        d="M50 44 C58 34 62 23 56 19 C52 23 51 33 50 44 Z"
        stroke={goldColor}
        strokeWidth="1.8"
        fill="none"
      />

      {/* Outer Sweeping Petals */}
      <path
        d="M50 46 C34 44 22 36 28 26 C36 25 43 35 50 46 Z"
        stroke={goldColor}
        strokeWidth="1.8"
        fill="none"
      />
      <path
        d="M50 46 C66 44 78 36 72 26 C64 25 57 35 50 46 Z"
        stroke={goldColor}
        strokeWidth="1.8"
        fill="none"
      />

      {/* Base Calyx Curves */}
      <path
        d="M32 46 C40 52 46 54 50 54 C54 54 60 52 68 46"
        stroke={goldColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Lower Stem & Suspended Diamond Droplet */}
      <path d="M50 54 L50 62" stroke={goldColor} strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="50,65 52,69 50,73 48,69" fill={goldColor} />
    </svg>
  );

  // Horizontal variant (Ideal for sticky navigation bar)
  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 select-none ${className}`}>
        <LotusFlower size={34} />
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-serif tracking-[0.16em] text-xl font-bold leading-none"
              style={{ color: maroonColor }}
            >
              ADAAH
            </span>
            <span
              className="font-serif tracking-[0.24em] text-xs font-medium"
              style={{ color: goldColor }}
            >
              HOUSE
            </span>
          </div>
          {showTagline && (
            <span
              className="text-[9px] uppercase tracking-[0.24em] font-medium leading-tight mt-0.5"
              style={{ color: taglineColor }}
            >
              Grace in every thread
            </span>
          )}
        </div>
      </div>
    );
  }

  // Monogram variant ("AH" monogram with floral stem)
  if (variant === 'monogram') {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <div className="relative w-12 h-12 flex items-center justify-center">
          <span
            className="font-serif text-3xl font-bold tracking-tight italic"
            style={{ color: maroonColor }}
          >
            A
          </span>
          <span
            className="font-serif text-3xl font-bold tracking-tight -ml-1"
            style={{ color: goldColor }}
          >
            H
          </span>
        </div>
        <span
          className="text-[8px] uppercase tracking-[0.25em] font-semibold mt-0.5"
          style={{ color: maroonColor }}
        >
          ADAAH HOUSE
        </span>
      </div>
    );
  }

  // Emblem in traditional scalloped Indian arch
  if (variant === 'emblem') {
    return (
      <div
        className={`inline-flex items-center justify-center p-3 rounded-full border border-[#C9A76A]/40 bg-[#FAF7F2] ${className}`}
      >
        <LotusFlower size={38} />
      </div>
    );
  }

  // Primary Brand Logo (Stacked - Lotus on top, ADAAH, — HOUSE —, GRACE IN EVERY THREAD)
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      <LotusFlower size={42} />
      
      {/* ADAAH Wordmark */}
      <h1
        className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-bold mt-1.5 leading-none transition-colors"
        style={{ color: maroonColor }}
      >
        ADAAH
      </h1>

      {/* — HOUSE — with gold accents */}
      <div className="flex items-center justify-center gap-2 mt-1.5 w-full max-w-[170px]">
        <span className="h-[0.5px] flex-1 bg-[#C9A76A]/70" />
        <span className="text-[7px] text-[#C9A76A]">✦</span>
        <span
          className="font-serif tracking-[0.32em] text-[11px] sm:text-xs font-semibold uppercase"
          style={{ color: goldColor }}
        >
          HOUSE
        </span>
        <span className="text-[7px] text-[#C9A76A]">✦</span>
        <span className="h-[0.5px] flex-1 bg-[#C9A76A]/70" />
      </div>

      {/* Official Tagline */}
      {showTagline && (
        <p
          className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] font-medium mt-1.5"
          style={{ color: taglineColor }}
        >
          Grace in every thread
        </p>
      )}
    </div>
  );
};
