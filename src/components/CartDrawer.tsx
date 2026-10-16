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
    currentUser,
    openAuthModal,
    showToast,
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
    if (!currentUser) {
      showToast('Please log in with your mobile number or email to checkout');
      openAuthModal('login', 'checkout', 'Please log in with your mobile number or email to complete your order.');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F3E9EB] w-full max-w-full sm:max-w-md h-full shadow-2xl flex flex-col border-l border-[#D5C2D7] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#D5C2D7] flex items-center justify-between bg-[#F3E9EB]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8C5A7D]" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#554052]">
              Shopping Bag ({cartCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#554052] hover:text-[#8C5A7D] transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-[#F3E9EB] px-5 py-2.5 border-b border-[#D5C2D7] text-xs">
          <div className="flex items-center gap-2 text-[#554052]">
            <Truck className="w-4 h-4 text-[#8C5A7D] shrink-0" />
            <span className="text-[#8C5A7D] font-semibold text-xs">
              Complimentary Free Express Shipping on all orders across India!
            </span>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#D5C2D7]">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#D5C2D7]/40 flex items-center justify-center mx-auto text-[#8C5A7D]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#554052]">Your bag is empty</h4>
                <p className="text-xs text-[#A185A4] mt-1">
                  Explore our curated collections to find your graceful fit.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActivePage('shop');
                }}
                className="px-6 py-2.5 bg-[#8C5A7D] text-[#F6F0F4] text-xs uppercase tracking-wider font-semibold hover:bg-[#554052] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-24 bg-white border border-[#D5C2D7] shrink-0 overflow-hidden">
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
                      <h4 className="font-serif text-sm font-semibold text-[#554052] leading-snug line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#A185A4] hover:text-[#8C5A7D] transition-colors p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-[#A185A4]">
                      <span>Size: <strong className="text-[#8C5A7D]">{item.selectedSize}</strong></span>
                      <span>·</span>
                      <span className="font-mono text-[#8C5A7D] font-semibold tabular-nums">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Line Total */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#D5C2D7] bg-white text-xs">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-[#554052] hover:bg-[#F3E9EB] font-semibold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 font-mono font-medium tabular-nums min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-[#554052] hover:bg-[#F3E9EB] font-semibold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-sm font-bold text-[#554052] tabular-nums">
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
          <div className="p-4 sm:p-5 border-t border-[#D5C2D7] bg-[#F3E9EB] space-y-4">
            {/* Coupon Code Input */}
            <div>
              {activeCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#F3E9EB] border border-[#D5C2D7] text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#8C5A7D]" />
                    <span className="font-mono font-bold text-[#8C5A7D]">{activeCoupon.code}</span>
                    <span className="text-[#8C5A7D] font-medium">(-₹{discountAmount})</span>
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
                    placeholder="Enter Coupon (e.g. RII10)"
                    className="flex-1 bg-[#F3E9EB] border border-[#D5C2D7] px-3 py-2 text-xs uppercase font-mono outline-none focus:border-[#8C5A7D] text-[#554052]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#554052] text-white text-xs font-semibold hover:bg-[#8C5A7D] transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#554052]/80 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#8C5A7D] font-medium">
                  <span>Coupon Discount</span>
                  <span className="font-mono tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono tabular-nums">
                  {shippingFee === 0 ? <strong className="text-[#8C5A7D]">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#D5C2D7] flex justify-between text-base font-bold text-[#554052]">
                <span className="font-serif">Order Total</span>
                <span className="font-mono text-[#8C5A7D] tabular-nums">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>{currentUser ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
              <ArrowRight className="w-4 h-4 text-[#D5C2D7]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
