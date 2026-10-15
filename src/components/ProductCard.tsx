import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product, KurtiSize } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductDetails, addToCart, isInWishlist, toggleWishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedQuickSize, setSelectedQuickSize] = useState<KurtiSize>(product.sizes[0] || 'M');

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const inWishlist = isInWishlist(product.id);

  // Fallback styling if image fails
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || primaryImage;

  return (
    <div
      className="group flex flex-col bg-white border border-[#E8DED2]/80 hover:border-[#C9A76A]/70 transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF7F2] cursor-pointer" onClick={() => openProductDetails(product)}>
        <img
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle Text Flag (NO pill sandwich) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start pointer-events-none">
          {product.isNewArrival && (
            <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#5B1E22] border border-[#E8DED2]">
              New Arrival
            </span>
          )}
          {product.isBestseller && !product.isNewArrival && (
            <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#651F32] border border-[#E8DED2]">
              Bestseller
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#5B1E22] text-white">
              {discountPercentage}% Off
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            inWishlist
              ? 'bg-[#5B1E22] text-white shadow-sm'
              : 'bg-[#FAF7F2]/90 text-[#292522] hover:text-[#5B1E22] hover:bg-white'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : 'stroke-[1.75]'}`} />
        </button>

        {/* Quick View Overlay on Desktop Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductDetails(product);
            }}
            className="flex-1 py-2 bg-[#FAF7F2] text-[#292522] hover:bg-white text-[11px] uppercase tracking-wider font-medium flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#C9A76A]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Collection & Category unboxed text */}
          <div className="flex items-center gap-2 text-[11px] text-[#9E897A] uppercase tracking-wider font-medium">
            <span>{product.collection}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => openProductDetails(product)}
            className="font-serif text-base sm:text-lg text-[#292522] font-semibold mt-1 leading-snug line-clamp-2 hover:text-[#5B1E22] cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          {/* Fabric Note */}
          <p className="text-xs text-[#292522]/70 mt-1 line-clamp-1 italic font-serif">
            {product.fabric}
          </p>

          {/* Available Sizes List */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-[#9E897A] mr-1">Sizes:</span>
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedQuickSize(size);
                }}
                className={`text-[10px] font-medium w-6 h-6 flex items-center justify-center transition-colors border ${
                  selectedQuickSize === size
                    ? 'border-[#5B1E22] bg-[#5B1E22] text-white'
                    : 'border-[#E8DED2] text-[#292522] hover:border-[#C9A76A]'
                }`}
                title={`Select size ${size}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Add to Bag Footer */}
        <div className="mt-4 pt-3 border-t border-[#E8DED2]/60 flex items-center justify-between gap-2">
          {/* Price with Tabular Numerals */}
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base font-semibold text-[#5B1E22] tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-mono text-xs text-[#9E897A] line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => addToCart(product, selectedQuickSize, 1)}
            className="p-2 sm:px-3 sm:py-1.5 bg-[#FAF7F2] hover:bg-[#5B1E22] text-[#292522] hover:text-white border border-[#E8DED2] hover:border-[#5B1E22] text-xs uppercase tracking-wider font-semibold transition-all duration-200 flex items-center gap-1.5"
            title={`Add size ${selectedQuickSize} to bag`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C9A76A] group-hover:text-white" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
