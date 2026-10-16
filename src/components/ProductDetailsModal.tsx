import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, Ruler, MessageCircle, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { KurtiSize } from '../types';
import { BRAND_CONFIG } from '../config/brand';

export const ProductDetailsModal: React.FC = () => {
  const {
    selectedProduct,
    closeProductDetails,
    addToCart,
    isInWishlist,
    toggleWishlist,
    setIsSizeGuideOpen,
    setIsCheckoutOpen,
    currentUser,
    openAuthModal,
    showToast,
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<KurtiSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{ checked: boolean; valid: boolean; message: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!selectedProduct) return null;

  const currentSize = selectedSize || selectedProduct.sizes[0] || 'M';
  const inWishlist = isInWishlist(selectedProduct.id);
  const discountPercent = selectedProduct.originalPrice
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : 0;

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setPincodeStatus({
        checked: true,
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code',
      });
      return;
    }

    // Realistic delivery calculation based on Indian logistics
    const today = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(today.getDate() + 4);
    const dateFormatted = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    setPincodeStatus({
      checked: true,
      valid: true,
      message: `Delivery available by ${dateFormatted}. Cash on Delivery & Free Shipping eligible.`,
    });
  };

  const handleAddToCart = () => {
    if (!currentSize) {
      setValidationError('Please select a size');
      return;
    }
    setValidationError(null);
    addToCart(selectedProduct, currentSize, quantity);
  };

  const handleBuyNow = () => {
    if (!currentSize) {
      setValidationError('Please select a size');
      return;
    }
    setValidationError(null);
    addToCart(selectedProduct, currentSize, quantity);
    closeProductDetails();
    if (!currentUser) {
      showToast('Please log in with your mobile number or email to checkout');
      openAuthModal('login', 'checkout', 'Please log in with your mobile number or email to complete your order.');
      return;
    }
    setIsCheckoutOpen(true);
  };

  // Direct WhatsApp order button
  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hello HOUSE OF RII! I would like to order the "${selectedProduct.name}" (SKU: ${selectedProduct.sku}) in Size ${currentSize} (Qty: ${quantity}) at ₹${selectedProduct.price}. Could you please assist with my order?`
    );
    window.open(`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F3E9EB] max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#D5C2D7] shadow-2xl relative flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={closeProductDetails}
          className="absolute top-4 right-4 z-10 p-2 bg-[#F3E9EB]/90 rounded-full text-[#554052] hover:text-[#8C5A7D] hover:bg-white shadow-xs transition-colors cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between bg-[#F3E9EB] border-b md:border-b-0 md:border-r border-[#D5C2D7]">
          {/* Main Selected Image */}
          <div className="relative aspect-[3/4] bg-[#F3E9EB] overflow-hidden rounded-xs border border-[#D5C2D7]/60">
            <img
              src={selectedProduct.images[activeImageIdx] || selectedProduct.images[0]}
              alt={selectedProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-all duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-[#8C5A7D] text-white text-xs font-semibold px-2 py-0.5">
                {discountPercent}% Off
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {selectedProduct.images.length > 1 && (
            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-16 h-20 shrink-0 overflow-hidden border-2 transition-all ${
                    activeImageIdx === idx ? 'border-[#5B1E22] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Collection & SKU */}
            <div className="flex items-center justify-between text-xs text-[#A185A4] uppercase tracking-wider font-medium">
              <span>{selectedProduct.collection}</span>
              <span className="font-mono text-[11px]">SKU: {selectedProduct.sku}</span>
            </div>

            {/* Product Name */}
            <h2 className="font-serif text-2xl sm:text-3xl text-[#554052] font-semibold leading-tight">
              {selectedProduct.name}
            </h2>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-mono text-2xl font-bold text-[#8C5A7D] tabular-nums">
                ₹{selectedProduct.price.toLocaleString('en-IN')}
              </span>
              {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                <>
                  <span className="font-mono text-sm text-[#A185A4] line-through tabular-nums">
                    ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-medium text-[#8C5A7D]">
                    Save ₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-[#A185A4]">Inclusive of all taxes. Free express shipping on all orders across India.</p>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#554052]/85 leading-relaxed pt-1">
              {selectedProduct.description}
            </p>

            {/* Fabric & Fit highlights */}
            <div className="bg-[#F3E9EB] p-3 border border-[#D5C2D7] text-xs space-y-1">
              <div>
                <strong className="text-[#8C5A7D]">Fabric:</strong> {selectedProduct.fabric}
              </div>
              <div>
                <strong className="text-[#8C5A7D]">Pattern / Work:</strong> {selectedProduct.specifications.pattern}
              </div>
              <div>
                <strong className="text-[#8C5A7D]">Neckline:</strong> {selectedProduct.specifications.neckline}
              </div>
            </div>

            {/* Size Selector + Size Guide Link */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#554052]">
                  Select Kurta Size:{' '}
                  <strong className="text-[#8C5A7D]">{currentSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-[#8C5A7D] hover:text-[#554052] font-medium transition-colors cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart</span>
                </button>
              </div>

              {/* Sizes Row */}
              <div className="flex items-center gap-2 flex-wrap">
                {selectedProduct.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      setSelectedSize(sz);
                      setValidationError(null);
                    }}
                    className={`w-11 h-11 text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                      currentSize === sz
                        ? 'border-[#8C5A7D] bg-[#8C5A7D] text-white shadow-xs'
                        : 'border-[#D5C2D7] bg-white text-[#554052] hover:border-[#8C5A7D]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              {validationError && (
                <p className="text-xs text-red-600 font-medium">{validationError}</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-medium text-[#554052]">Quantity:</span>
              <div className="flex items-center border border-[#D5C2D7] bg-white text-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-[#554052] hover:bg-[#F3E9EB] font-semibold cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-1.5 font-mono font-medium tabular-nums min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3 py-1.5 text-[#554052] hover:bg-[#F3E9EB] font-semibold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Bag & Buy Now */}
            <div className="space-y-2.5 pt-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-[#F3E9EB] hover:bg-[#EFE7ED] text-[#8C5A7D] border border-[#8C5A7D] text-xs uppercase tracking-[0.16em] font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#8C5A7D]" />
                  <span>Add to Bag</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 py-3 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-[0.16em] font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`p-3 border transition-colors cursor-pointer ${
                    inWishlist
                      ? 'border-[#8C5A7D] bg-[#8C5A7D] text-white'
                      : 'border-[#D5C2D7] bg-white text-[#554052] hover:border-[#8C5A7D]'
                  }`}
                  title={inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Order via WhatsApp direct button */}
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#128C7E] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Order via WhatsApp ({BRAND_CONFIG.contact.phone})</span>
              </button>
            </div>

            {/* Pincode Delivery Check */}
            <div className="pt-2 border-t border-[#D5C2D7]">
              <form onSubmit={handlePincodeCheck} className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8C5A7D] shrink-0" />
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 bg-white border border-[#D5C2D7] px-3 py-1.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#554052] text-white text-xs font-medium hover:bg-[#8C5A7D] transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p
                  className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${
                    pincodeStatus.valid ? 'text-[#8C5A7D]' : 'text-red-600'
                  }`}
                >
                  {pincodeStatus.valid && <Check className="w-3.5 h-3.5" />}
                  <span>{pincodeStatus.message}</span>
                </p>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] text-[#554052]/80 border-t border-[#D5C2D7]">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-[#8C5A7D]" />
                <span>7-Day Easy Exchange Policy</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C5A7D]" />
                <span>100% Quality Inspected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
