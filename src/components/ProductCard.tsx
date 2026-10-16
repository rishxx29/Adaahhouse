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
      className="group flex flex-col bg-[#FAF5F8] border border-[#D5C2D7] hover:border-[#8C5A7D] transition-all duration-300 hover:shadow-xs rounded-xs overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F6F0F4] cursor-pointer" onClick={() => openProductDetails(product)}>
        <img
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Text Flags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start pointer-events-none">
          {product.isNewArrival && (
            <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 bg-[#FAF5F8]/95 backdrop-blur-xs text-[#8C5A7D] border border-[#D5C2D7]">
              New Arrival
            </span>
          )}
          {product.isBestseller && !product.isNewArrival && (
            <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 bg-[#FAF5F8]/95 backdrop-blur-xs text-[#8C5A7D] border border-[#D5C2D7]">
              Bestseller
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#8C5A7D] text-white">
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
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            inWishlist
              ? 'bg-[#8C5A7D] text-white shadow-sm'
              : 'bg-[#FAF5F8]/90 text-[#554052] hover:text-[#8C5A7D] hover:bg-[#FAF5F8]'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : 'stroke-[1.75]'}`} />
        </button>

        {/* Quick View Overlay on Desktop Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#554052]/70 via-[#554052]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductDetails(product);
            }}
            className="flex-1 py-2 bg-[#FAF5F8] text-[#554052] hover:bg-white text-[11px] uppercase tracking-wider font-medium flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#8C5A7D]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-[#FAF5F8]">
        <div>
          {/* Collection & Category */}
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-[#A185A4] uppercase tracking-wider font-medium">
            <span>{product.collection}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => openProductDetails(product)}
            className="font-serif text-sm sm:text-base text-[#554052] font-semibold mt-1 leading-snug line-clamp-2 hover:text-[#8C5A7D] cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          {/* Fabric Note */}
          <p className="text-[11px] sm:text-xs text-[#554052]/70 mt-1 line-clamp-1 italic font-serif">
            {product.fabric}
          </p>

          {/* Available Sizes List */}
          <div className="mt-2.5 flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span className="text-[9.5px] uppercase tracking-wider text-[#A185A4] mr-0.5">Sizes:</span>
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedQuickSize(size);
                }}
                className={`text-[9.5px] font-medium w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-colors border cursor-pointer ${
                  selectedQuickSize === size
                    ? 'border-[#8C5A7D] bg-[#8C5A7D] text-white'
                    : 'border-[#D5C2D7] text-[#554052] hover:border-[#8C5A7D]'
                }`}
                title={`Select size ${size}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Add to Bag Footer */}
        <div className="mt-3.5 pt-2.5 border-t border-[#D5C2D7]/80 flex items-center justify-between gap-2">
          {/* Price with Tabular Numerals */}
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="font-mono text-sm sm:text-base font-semibold text-[#8C5A7D] tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-mono text-[11px] sm:text-xs text-[#A185A4] line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => addToCart(product, selectedQuickSize, 1)}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-[#FAF5F8] hover:bg-[#8C5A7D] text-[#554052] hover:text-white border border-[#D5C2D7] hover:border-[#8C5A7D] text-[10px] sm:text-xs uppercase tracking-wider font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title={`Add size ${selectedQuickSize} to bag`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#8C5A7D] group-hover:text-white" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
