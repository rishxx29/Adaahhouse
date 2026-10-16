import React from 'react';

interface HouseOfRiiLogoProps {
  className?: string;
  variant?: 'primary' | 'stacked' | 'horizontal' | 'monogram' | 'emblem';
  theme?: 'light' | 'dark';
  showTagline?: boolean;
}

// Stylized Lotus Bloom from Official House of Rii Brand Identity
export const HouseOfRiiLotus: React.FC<{
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 42, color = '#8C5A7D', className = '' }) => (
  <svg
    width={size}
    height={size * 0.72}
    viewBox="0 0 120 86"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 transition-transform duration-300 ${className}`}
  >
    {/* Central Bloom Petal */}
    <path
      d="M60 6 C56 18 52 28 60 48 C68 28 64 18 60 6 Z"
      stroke={color}
      strokeWidth="2.2"
      fill={color}
      fillOpacity="0.08"
      strokeLinejoin="round"
    />
    {/* Central Petal Vein */}
    <path
      d="M60 12 L60 40"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.7"
    />

    {/* Inner Left Petal */}
    <path
      d="M60 48 C48 36 40 24 46 16 C53 22 56 34 60 48 Z"
      stroke={color}
      strokeWidth="2.0"
      fill={color}
      fillOpacity="0.06"
      strokeLinejoin="round"
    />

    {/* Inner Right Petal */}
    <path
      d="M60 48 C72 36 80 24 74 16 C67 22 64 34 60 48 Z"
      stroke={color}
      strokeWidth="2.0"
      fill={color}
      fillOpacity="0.06"
      strokeLinejoin="round"
    />

    {/* Outer Sweeping Left Petal */}
    <path
      d="M58 50 C38 48 24 38 32 26 C42 27 50 38 58 50 Z"
      stroke={color}
      strokeWidth="1.8"
      fill={color}
      fillOpacity="0.04"
      strokeLinejoin="round"
    />

    {/* Outer Sweeping Right Petal */}
    <path
      d="M62 50 C82 48 96 38 88 26 C78 27 70 38 62 50 Z"
      stroke={color}
      strokeWidth="1.8"
      fill={color}
      fillOpacity="0.04"
      strokeLinejoin="round"
    />

    {/* Elegant Lower Sweeping Tendril Flanking Left */}
    <path
      d="M18 52 C32 40 48 46 60 52"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* Elegant Lower Sweeping Tendril Flanking Right */}
    <path
      d="M102 52 C88 40 72 46 60 52"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* Base Calyx Anchor */}
    <path
      d="M52 52 C56 56 64 56 68 52"
      stroke={color}
      strokeWidth="2.0"
      strokeLinecap="round"
    />
  </svg>
);

// Ornamental Floral Divider with Lotus Bud: ── 🪷 ──
export const HouseOfRiiDivider: React.FC<{ color?: string }> = ({ color = '#A185A4' }) => (
  <div className="flex items-center justify-center gap-2.5 my-1 opacity-80">
    <span className="h-[1px] w-8 sm:w-12 bg-current" style={{ color }} />
    <svg width="14" height="12" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1 C7 5 5 7 8 12 C11 7 9 5 8 1 Z" fill={color} />
      <path d="M8 12 C5 9 3 7 5 5 C6.5 6.5 7.5 9 8 12 Z" fill={color} opacity="0.6" />
      <path d="M8 12 C11 9 13 7 11 5 C9.5 6.5 8.5 9 8 12 Z" fill={color} opacity="0.6" />
    </svg>
    <span className="h-[1px] w-8 sm:w-12 bg-current" style={{ color }} />
  </div>
);

export const HouseOfRiiLogo: React.FC<HouseOfRiiLogoProps> = ({
  className = '',
  variant = 'primary',
  theme = 'light',
  showTagline = true,
}) => {
  const isDark = theme === 'dark';
  const plumColor = isDark ? '#F6F0F4' : '#8C5A7D';
  const textColor = isDark ? '#FAF7F2' : '#554052';
  const accentColor = isDark ? '#D5C2D7' : '#A185A4';

  // Circular Monogram with Floral Stem (from Brand Guidelines)
  if (variant === 'monogram') {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <div
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border flex items-center justify-center shadow-2xs transition-transform duration-300 hover:scale-105"
          style={{
            borderColor: accentColor,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
          }}
        >
          {/* Stylized Rii Monogram */}
          <div className="flex items-baseline relative">
            <span
              className="font-serif font-bold text-2xl sm:text-3xl tracking-tight"
              style={{ color: plumColor }}
            >
              R
            </span>
            <span
              className="font-serif font-light text-base sm:text-lg italic -ml-0.5"
              style={{ color: accentColor }}
            >
              ii
            </span>
            {/* Delicate Sprouting Floral Bud Motif */}
            <svg
              className="absolute -top-1 -right-2 w-3.5 h-3.5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 18 C10 12 14 8 16 3 C11 5 7 9 10 18 Z"
                fill={plumColor}
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Horizontal variant (Great for Navbar and Sticky Headers)
  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
        <HouseOfRiiLotus size={36} color={plumColor} />
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-serif tracking-[0.16em] text-xl sm:text-2xl font-bold leading-none"
              style={{ color: plumColor }}
            >
              HOUSE OF RII
            </span>
          </div>
          <div className="flex items-center justify-between text-[8px] sm:text-[9px] uppercase tracking-[0.32em] font-semibold mt-0.5" style={{ color: accentColor }}>
            <span>ETHNIC WEAR</span>
          </div>
        </div>
      </div>
    );
  }

  // Primary Stacked Logo (Centered as in official brand sheet)
  return (
    <div className={`inline-flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* Lotus Bloom Icon */}
      <HouseOfRiiLotus size={variant === 'stacked' ? 48 : 56} color={plumColor} />

      {/* Brand Title: HOUSE OF RII */}
      <h1 className="font-serif font-bold tracking-[0.18em] text-2xl sm:text-3xl lg:text-4xl leading-none mt-2">
        <span style={{ color: plumColor }}>HOUSE OF RII</span>
      </h1>

      {/* Subtitle: ETHNIC WEAR */}
      <p
        className="text-[9px] sm:text-[10px] uppercase tracking-[0.38em] font-semibold mt-1"
        style={{ color: textColor }}
      >
        ETHNIC WEAR
      </p>

      {/* Ornamental Floral Divider */}
      {showTagline && <HouseOfRiiDivider color={accentColor} />}

      {/* Brand Tagline from Guidelines */}
      {showTagline && (
        <span
          className="font-serif italic text-xs sm:text-sm tracking-wide mt-0.5"
          style={{ color: textColor }}
        >
          Tradition, Styled Your Way.
        </span>
      )}
    </div>
  );
};

// Backwards-compatible alias for existing imports
export const AdaahLogo = HouseOfRiiLogo;
export default HouseOfRiiLogo;
