export const BRAND_CONFIG = {
  name: 'HOUSE OF RII',
  tagline: 'Tradition, Styled Your Way.',
  subTagline: 'ELEGANT KURTAS, KURTA SETS AND CO-ORDS FOR EVERY YOU',
  businessModelNote: 'Curated Indian ethnic wear rooted in tradition, crafted for everyday luxury and celebratory moments.',
  
  contact: {
    phone: '7357804296',
    whatsappFormatted: '+91 73578 04296',
    whatsappRaw: '917357804296',
    email: 'aadahhouse@gmail.com', // Active operational inbox
    brandEmail: 'care@houseofrii.com',
    supportHours: 'Mon – Sat, 10:00 AM – 7:00 PM IST',
    location: 'Rajasthan, India',
  },
  
  social: {
    instagram: '@houseofrii',
    instagramUrl: 'https://instagram.com/houseofrii',
    whatsappUrl: 'https://wa.me/917357804296',
  },

  payment: {
    upiId: '7357804296@ybl',
    merchantName: 'HOUSE OF RII',
    supportNumber: '7357804296',
    gatewayOptions: 'PhonePe / Google Pay / BHIM / Direct UPI',
  },
  
  shipping: {
    freeShippingThreshold: 0,
    standardShippingFee: 0,
    estimatedDaysMin: 3,
    estimatedDaysMax: 5,
    codAvailable: true,
  },
  
  // Official Mauve & Plum Brand Palette from Guidelines
  colors: {
    softLilac: '#F6F0F4',     // Backgrounds
    dustyMauve: '#D5C2D7',    // Accents & Borders
    mutedViolet: '#A185A4',   // Buttons & Highlights
    plum: '#8C5A7D',          // Headings & Key Elements
    deepPlum: '#554052',      // Text & Dark Contrast
    
    // Semantic mappings for compatibility
    maroon: '#8C5A7D',        // maps to Plum
    ivory: '#F6F0F4',         // maps to Soft Lilac
    gold: '#A185A4',          // maps to Muted Violet
    beige: '#D5C2D7',         // maps to Dusty Mauve
    sage: '#A185A4',
    rose: '#D5C2D7',
    taupe: '#8C5A7D',
    charcoal: '#554052',      // maps to Deep Plum
  },
  
  packagingQuote: {
    title: 'Tradition, Styled Your Way.',
    body: 'Thank you for choosing House of Rii. We hope this piece brings comfort, grace, and timeless elegance to your story.',
    signature: 'With love, House of Rii',
  },
  
  coupons: [
    {
      code: 'RII10',
      description: '10% off on all orders above ₹999',
      type: 'percentage' as const,
      value: 10,
      minOrder: 999,
    },
    {
      code: 'HOUSEOFRII',
      description: 'Flat ₹200 off your first purchase above ₹1,499',
      type: 'fixed' as const,
      value: 200,
      minOrder: 1499,
    },
    {
      code: 'FESTIVE15',
      description: '15% off on Festive Edit orders above ₹2,499',
      type: 'percentage' as const,
      value: 15,
      minOrder: 2499,
    },
    {
      code: 'ADAAH10',
      description: '10% loyalty discount',
      type: 'percentage' as const,
      value: 10,
      minOrder: 999,
    },
  ],
};

export const STANDARD_MEASUREMENTS = {
  S: { bust: '36"', waist: '32"', hip: '38"', length: '44"', shoulder: '14.5"' },
  M: { bust: '38"', waist: '34"', hip: '40"', length: '44"', shoulder: '15"' },
  L: { bust: '40"', waist: '36"', hip: '42"', length: '45"', shoulder: '15.5"' },
  XL: { bust: '42"', waist: '38"', hip: '44"', length: '45"', shoulder: '16"' },
  XXL: { bust: '44"', waist: '40"', hip: '46"', length: '46"', shoulder: '16.5"' },
};
