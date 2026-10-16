import React from 'react';

export interface HouseOfRiiLogoProps {
  className?: string;
  variant?: 'primary' | 'stacked' | 'horizontal' | 'header' | 'monogram' | 'emblem';
  theme?: 'light' | 'dark';
  showTagline?: boolean;
  size?: number | string;
}

// Authentic Lotus Bloom from Official House of Rii Master Logo
export const HouseOfRiiLotus: React.FC<{
  size?: number;
  color?: string;
  theme?: 'light' | 'dark';
  className?: string;
}> = ({ size = 36, theme = 'light', className = '' }) => {
  const src = theme === 'dark' ? '/house_of_rii_lotus_mark_light.png' : '/house_of_rii_lotus_mark.png';
  return (
    <img
      src={src}
      alt="HOUSE OF RII Lotus"
      style={{ width: `${size}px`, height: 'auto' }}
      className={`inline-block shrink-0 object-contain ${className}`}
      loading="eager"
    />
  );
};

// Ornamental Floral Divider with diamond flower motif matching the logo: ── ✤ ──
export const HouseOfRiiDivider: React.FC<{ color?: string; className?: string }> = ({
  color = '#A185A4',
  className = '',
}) => (
  <div className={`flex items-center justify-center gap-2.5 my-1 opacity-80 ${className}`}>
    <span className="h-[1px] w-8 sm:w-12 bg-current" style={{ color }} />
    <span className="text-xs" style={{ color }}>✤</span>
    <span className="h-[1px] w-8 sm:w-12 bg-current" style={{ color }} />
  </div>
);

export const HouseOfRiiLogo: React.FC<HouseOfRiiLogoProps> = ({
  className = '',
  variant = 'primary',
  theme = 'light',
  showTagline = true,
  size,
}) => {
  const isDark = theme === 'dark';

  // 1. Monogram / Emblem: Isolated Lotus Mark
  if (variant === 'monogram' || variant === 'emblem') {
    const src = isDark ? '/house_of_rii_lotus_mark_light.png' : '/house_of_rii_lotus_mark.png';
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src={src}
          alt="HOUSE OF RII"
          className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
          style={size ? { height: typeof size === 'number' ? `${size}px` : size } : undefined}
          loading="eager"
        />
      </div>
    );
  }

  // 2. Header / Horizontal: Compact Lotus + HOUSE OF RII + ETHNIC WEAR
  if (variant === 'header' || variant === 'horizontal') {
    const src = isDark ? '/house_of_rii_logo_light_header.png' : '/house_of_rii_logo_header.png';
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src={src}
          alt="HOUSE OF RII - Ethnic Wear"
          className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
          style={size ? { height: typeof size === 'number' ? `${size}px` : size } : undefined}
          loading="eager"
        />
      </div>
    );
  }

  // 3. Primary / Stacked: Full Authentic Master Logo Artwork
  const fullSrc = isDark ? '/house_of_rii_logo_light.png' : '/house_of_rii_logo.png';
  const headerSrc = isDark ? '/house_of_rii_logo_light_header.png' : '/house_of_rii_logo_header.png';
  const src = showTagline ? fullSrc : headerSrc;

  return (
    <div className={`inline-flex flex-col items-center justify-center text-center select-none ${className}`}>
      <img
        src={src}
        alt="HOUSE OF RII - Tradition, Styled Your Way"
        className="w-full max-w-[220px] sm:max-w-[260px] h-auto object-contain transition-transform duration-300"
        style={size ? { width: typeof size === 'number' ? `${size}px` : size } : undefined}
        loading="eager"
      />
    </div>
  );
};

// Backwards-compatible alias for existing imports
export const AdaahLogo = HouseOfRiiLogo;
export default HouseOfRiiLogo;
