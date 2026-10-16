import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  LogOut,
  Save,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Heart,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND_CONFIG } from '../config/brand';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    updateCustomerProfile,
    logoutCustomer,
    setActivePage,
    setIsAuthModalOpen,
    setAuthModalMode,
    getCustomerOrders,
    wishlist,
    setIsWishlistOpen,
  } = useStore();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [addressLine, setAddressLine] = useState(currentUser?.savedAddress?.addressLine || '');
  const [locality, setLocality] = useState(currentUser?.savedAddress?.locality || '');
  const [city, setCity] = useState(currentUser?.savedAddress?.city || 'Jaipur');
  const [state, setState] = useState(currentUser?.savedAddress?.state || 'Rajasthan');
  const [pincode, setPincode] = useState(currentUser?.savedAddress?.pincode || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#F6F0F4] border border-[#D5C2D7] flex items-center justify-center mx-auto text-[#8C5A7D]">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#554052]">
          Please Sign In to Access Your Account
        </h2>
        <p className="text-xs text-[#A185A4]">
          Create an account or login using your email or phone number.
        </p>
        <button
          onClick={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          className="px-6 py-2.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      fullName,
      phone,
      savedAddress: {
        fullName,
        phone,
        email: currentUser.email,
        addressLine,
        locality,
        city,
        state,
        pincode,
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const userOrdersCount = getCustomerOrders().length;

  return (
    <div className="bg-[#F6F0F4] py-12 sm:py-16 animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Account Header */}
        <div className="bg-white p-6 sm:p-8 border border-[#D5C2D7] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#8C5A7D] text-[#F6F0F4] flex items-center justify-center font-serif text-2xl font-bold">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#8C5A7D] font-semibold block">
                HOUSE OF RII Member
              </span>
              <h1 className="font-serif text-2xl font-bold text-[#554052]">
                {currentUser.fullName}
              </h1>
              <p className="text-xs text-[#A185A4] mt-0.5">
                {currentUser.email} • {currentUser.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('orders')}
              className="px-4 py-2 bg-[#F6F0F4] border border-[#D5C2D7] hover:border-[#8C5A7D] text-xs font-semibold text-[#8C5A7D] flex items-center gap-1.5 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>My Orders ({userOrdersCount})</span>
            </button>
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="px-4 py-2 bg-[#F6F0F4] border border-[#D5C2D7] hover:border-[#8C5A7D] text-xs font-semibold text-[#8C5A7D] flex items-center gap-1.5 transition-colors"
            >
              <Heart className="w-4 h-4 text-[#8C5A7D]" />
              <span>Wishlist ({wishlist.length})</span>
            </button>
            <button
              onClick={logoutCustomer}
              className="px-3.5 py-2 border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Sign out of your account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Profile & Saved Shipping Address Form */}
        <div className="bg-white p-6 sm:p-8 border border-[#D5C2D7] space-y-6 shadow-xs">
          <div className="border-b border-[#D5C2D7] pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#554052]">
                Profile & Delivery Address
              </h3>
              <p className="text-xs text-[#A185A4] mt-0.5">
                Saved address will be pre-filled automatically during your next checkout.
              </p>
            </div>
            {isSaved && (
              <span className="text-xs text-[#8C5A7D] font-semibold flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#554052] mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#554052] mb-1">
                  Email Address (Login ID)
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full bg-gray-100 border border-[#D5C2D7] p-2.5 text-xs text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#554052] mb-1">
                  Mobile Number (for SMS & WhatsApp receipts)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#D5C2D7]">
              <span className="font-semibold text-xs text-[#8C5A7D] uppercase tracking-wider block mb-3">
                Default Shipping Address:
              </span>
              <div className="space-y-3">
                <div>
                  <label className="block text-[#A185A4] mb-1">House / Flat / Street Address</label>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="e.g. 104, Royal Apartments, Civil Lines"
                    className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#A185A4] mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A185A4] mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A185A4] mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                      className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-[#D5C2D7]" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Links Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setActivePage('orders')}
            className="p-5 bg-white border border-[#D5C2D7] hover:border-[#8C5A7D] cursor-pointer transition-all shadow-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[#8C5A7D]" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#554052]">Order History</h4>
                <p className="text-[11px] text-[#A185A4]">View and track your {userOrdersCount} orders</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A185A4]" />
          </div>

          <div
            onClick={() => setActivePage('shop')}
            className="p-5 bg-white border border-[#D5C2D7] hover:border-[#8C5A7D] cursor-pointer transition-all shadow-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#8C5A7D]" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#554052]">Browse Catalog</h4>
                <p className="text-[11px] text-[#A185A4]">Explore new arrivals & festive edits</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A185A4]" />
          </div>
        </div>

      </div>
    </div>
  );
};
