export const BRAND_CONFIG = {
  name: 'ADAAH HOUSE',
  tagline: 'GRACE IN EVERY THREAD.',
  subTagline: 'Curated Indian Ethnic Wear for Everyday Luxury',
  businessModelNote: 'Thoughtfully curated ready-made kurtis and ethnic ensembles retailed with love.',
  
  contact: {
    phone: '7357804296',
    whatsappFormatted: '+91 73578 04296',
    whatsappRaw: '917357804296',
    email: 'aadahhouse@gmail.com',
    supportHours: 'Mon – Sat, 10:00 AM – 7:00 PM IST',
    location: 'Rajasthan, India',
  },
  
  social: {
    instagram: '@adaahhouse',
    instagramUrl: 'https://instagram.com/adaahhouse',
    whatsappUrl: 'https://wa.me/917357804296',
  },

  payment: {
    upiId: '7357804296@ybl',
    merchantName: 'ADAAH HOUSE',
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
  
  colors: {
    maroon: '#5B1E22',
    ivory: '#FAF7F2',
    gold: '#C9A76A',
    beige: '#E8DED2',
    sage: '#7A8061',
    rose: '#C98A8E',
    taupe: '#9E897A',
    charcoal: '#292522',
  },
  
  packagingQuote: {
    title: 'A little Adaah in every outfit.',
    body: 'Thank you for choosing Adaah House. We hope this piece brings a little extra grace to your everyday moments.',
    signature: 'With love, Adaah House',
  },
  
  coupons: [
    {
      code: 'ADAAH10',
      description: '10% off on all orders above ₹999',
      type: 'percentage' as const,
      value: 10,
      minOrder: 999,
    },
    {
      code: 'FIRSTGRACE',
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
  ],
};

export const STANDARD_MEASUREMENTS = {
  S: { bust: '36"', waist: '32"', hip: '38"', length: '44"', shoulder: '14.5"' },
  M: { bust: '38"', waist: '34"', hip: '40"', length: '44"', shoulder: '15"' },
  L: { bust: '40"', waist: '36"', hip: '42"', length: '45"', shoulder: '15.5"' },
  XL: { bust: '42"', waist: '38"', hip: '44"', length: '45"', shoulder: '16"' },
  XXL: { bust: '44"', waist: '40"', hip: '46"', length: '46"', shoulder: '16.5"' },
};
