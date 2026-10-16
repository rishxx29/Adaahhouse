import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { KurtiSize, Product } from '../types';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    wishlistProducts,
    toggleWishlist,
    clearWishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    addToCart,
    openProductDetails,
    setActivePage,
    setSelectedCollectionFilter,
  } = useStore();

  // Selected sizes for each wishlisted item in the drawer
  const [selectedSizes, setSelectedSizes] = useState<Record<string, KurtiSize>>({});

  if (!isWishlistOpen) return null;

  const handleSelectSize = (productId: string, size: KurtiSize) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: Product) => {
    const sizeToUse = selectedSizes[product.id] || product.sizes[0] || 'M';
    addToCart(product, sizeToUse, 1);
  };

  const handleMoveAllToBag = () => {
    wishlistProducts.forEach((product) => {
      const sizeToUse = selectedSizes[product.id] || product.sizes[0] || 'M';
      addToCart(product, sizeToUse, 1);
    });
    setIsWishlistOpen(false);
  };

  const handleViewInCatalog = () => {
    setSelectedCollectionFilter('wishlist');
    setActivePage('shop');
    setIsWishlistOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F3E9EB] w-full max-w-full sm:max-w-md h-full shadow-2xl flex flex-col border-l border-[#D5C2D7] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#D5C2D7] flex items-center justify-between bg-[#F3E9EB]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#8C5A7D]/10 flex items-center justify-center text-[#8C5A7D]">
              <Heart className="w-4 h-4 fill-[#8C5A7D]" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#554052] leading-tight">
                My Wishlist
              </h3>
              <span className="text-[11px] text-[#A185A4]">
                {wishlist.length} {wishlist.length === 1 ? 'curated piece' : 'curated pieces'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-[#554052] hover:text-[#8C5A7D] transition-colors rounded-xs hover:bg-[#F3E9EB]"
            aria-label="Close Wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Sub-banner */}
        {wishlistProducts.length > 0 && (
          <div className="bg-[#F3E9EB] px-5 py-2.5 border-b border-[#D5C2D7] flex items-center justify-between text-xs">
            <span className="text-[#8C5A7D] font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8C5A7D]" />
              <span>Saved in your private wardrobe</span>
            </span>
            <button
              onClick={handleViewInCatalog}
              className="text-[#8C5A7D] hover:underline font-semibold text-[11px] flex items-center gap-1"
            >
              <span>View in Grid</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#D5C2D7]">
          {wishlistProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#D5C2D7]/40 flex items-center justify-center mx-auto text-[#8C5A7D]">
                <Heart className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="max-w-xs mx-auto">
                <h4 className="font-serif text-lg font-semibold text-[#554052]">
                  Your Wishlist is Empty
                </h4>
                <p className="text-xs text-[#A185A4] mt-1.5 leading-relaxed">
                  Explore our luxury ethnic collections and tap the heart icon to save your favorite silhouettes for later.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  setActivePage('shop');
                }}
                className="px-6 py-2.5 bg-[#8C5A7D] text-[#F6F0F4] text-xs uppercase tracking-wider font-semibold hover:bg-[#554052] transition-colors shadow-xs"
              >
                Explore Kurti Collections
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => {
              const activeSize = selectedSizes[product.id] || product.sizes[0] || 'M';
              return (
                <div key={product.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      setIsWishlistOpen(false);
                      openProductDetails(product);
                    }}
                    className="w-20 h-28 bg-white border border-[#D5C2D7] shrink-0 overflow-hidden cursor-pointer relative group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#A185A4] font-semibold block">
                            {product.collection}
                          </span>
                          <h4
                            onClick={() => {
                              setIsWishlistOpen(false);
                              openProductDetails(product);
                            }}
                            className="font-serif text-sm font-semibold text-[#554052] hover:text-[#8C5A7D] cursor-pointer truncate"
                            title={product.name}
                          >
                            {product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-[#A185A4] hover:text-[#8C5A7D] p-1 transition-colors"
                          title="Remove from wishlist"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-serif text-sm font-bold text-[#8C5A7D]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-[#A185A4] line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Quick Size Selector */}
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-[#A185A4] font-medium mr-0.5">Size:</span>
                        {product.sizes.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSelectSize(product.id, s)}
                            className={`w-6 h-6 text-[10px] font-semibold border transition-all ${
                              activeSize === s
                                ? 'bg-[#8C5A7D] text-white border-[#8C5A7D]'
                                : 'bg-white text-[#554052] border-[#D5C2D7] hover:border-[#8C5A7D]'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Move to Bag Action */}
                    <div className="pt-2.5 flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 py-1.5 px-3 bg-[#8C5A7D] text-[#F6F0F4] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#554052] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag ({activeSize})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer Actions */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#D5C2D7] bg-[#F3E9EB] space-y-2.5">
            <button
              onClick={handleMoveAllToBag}
              className="w-full py-3 bg-[#8C5A7D] text-[#F6F0F4] text-xs uppercase tracking-widest font-semibold hover:bg-[#554052] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All to Shopping Bag</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                onClick={handleViewInCatalog}
                className="text-[#8C5A7D] hover:underline font-medium text-[11px]"
              >
                Browse Wishlist in Shop Grid
              </button>
              <button
                onClick={clearWishlist}
                className="text-[#A185A4] hover:text-red-700 transition-colors text-[11px]"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
