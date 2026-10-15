import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND_CONFIG } from '../config/brand';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    activeCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    discountAmount,
    shippingFee,
    cartTotal,
    setIsCheckoutOpen,
    setActivePage,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] w-full max-w-md h-full shadow-2xl flex flex-col border-l border-[#E8DED2] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8DED2] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#5B1E22]" />
            <h3 className="font-serif text-lg font-bold text-[#292522]">
              Shopping Bag ({cartCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#292522] hover:text-[#5B1E22] transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-[#F2ECE1] px-5 py-2.5 border-b border-[#E8DED2] text-xs">
          <div className="flex items-center gap-2 text-[#292522]">
            <Truck className="w-4 h-4 text-[#7A8061] shrink-0" />
            <span className="text-[#7A8061] font-semibold text-xs">
              Complimentary Free Express Shipping on all orders across India!
            </span>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E8DED2]">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E8DED2]/50 flex items-center justify-center mx-auto text-[#9E897A]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#292522]">Your bag is empty</h4>
                <p className="text-xs text-[#9E897A] mt-1">
                  Explore our curated kurti collections to find your graceful fit.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActivePage('shop');
                }}
                className="px-6 py-2.5 bg-[#5B1E22] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#421417] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-24 bg-white border border-[#E8DED2] shrink-0 overflow-hidden">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-sm font-semibold text-[#292522] leading-snug line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#9E897A] hover:text-[#5B1E22] transition-colors p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-[#9E897A]">
                      <span>Size: <strong className="text-[#5B1E22]">{item.selectedSize}</strong></span>
                      <span>·</span>
                      <span className="font-mono text-[#5B1E22] font-semibold tabular-nums">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Line Total */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#E8DED2] bg-white text-xs">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-[#292522] hover:bg-[#FAF7F2] font-semibold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 font-mono font-medium tabular-nums min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-[#292522] hover:bg-[#FAF7F2] font-semibold"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-sm font-bold text-[#292522] tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Coupon + Summary + Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E8DED2] bg-white space-y-4">
            {/* Coupon Code Input */}
            <div>
              {activeCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#FAF7F2] border border-[#C9A76A]/40 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#5B1E22]" />
                    <span className="font-mono font-bold text-[#5B1E22]">{activeCoupon.code}</span>
                    <span className="text-[#7A8061] font-medium">(-₹{discountAmount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. ADAAH10)"
                    className="flex-1 bg-[#FAF7F2] border border-[#E8DED2] px-3 py-2 text-xs uppercase font-mono outline-none focus:border-[#5B1E22]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#292522] text-white text-xs font-semibold hover:bg-[#5B1E22] transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#292522]/80 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#7A8061] font-medium">
                  <span>Coupon Discount</span>
                  <span className="font-mono tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono tabular-nums">
                  {shippingFee === 0 ? <strong className="text-[#7A8061]">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E8DED2] flex justify-between text-base font-bold text-[#292522]">
                <span className="font-serif">Order Total</span>
                <span className="font-mono text-[#5B1E22] tabular-nums">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-[#5B1E22] hover:bg-[#421417] text-white text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#C9A76A]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
