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
    saveCustomerAddress,
    logoutCustomer,
    setActivePage,
    setIsAuthModalOpen,
    setAuthModalMode,
    getCustomerOrders,
    wishlist,
    setIsWishlistOpen,
    resetCustomerPassword,
    showToast,
    isDatabaseConnected,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');

  // Profile Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isSaved, setIsSaved] = useState(false);

  // New Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrName, setNewAddrName] = useState(currentUser?.fullName || '');
  const [newAddrPhone, setNewAddrPhone] = useState(currentUser?.phone || '');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrLocality, setNewAddrLocality] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Jaipur');
  const [newAddrState, setNewAddrState] = useState('Rajasthan');
  const [newAddrPincode, setNewAddrPincode] = useState('');

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#F3E9EB] border border-[#D5C2D7] flex items-center justify-center mx-auto text-[#8C5A7D]">
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
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLine || !newAddrCity || !newAddrPincode) {
      showToast('Please fill all required address fields');
      return;
    }
    await saveCustomerAddress({
      fullName: newAddrName || currentUser.fullName,
      phone: newAddrPhone || currentUser.phone,
      email: currentUser.email,
      addressLine: newAddrLine,
      locality: newAddrLocality,
      city: newAddrCity,
      state: newAddrState,
      pincode: newAddrPincode,
      isDefault: true,
    });
    setShowAddAddress(false);
    setNewAddrLine('');
    setNewAddrLocality('');
    setNewAddrPincode('');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    const res = await resetCustomerPassword(currentUser.email, newPassword);
    setPasswordMsg(res.message);
    if (res.success) {
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const userOrdersCount = getCustomerOrders().length;
  const savedAddresses = currentUser.savedAddresses || (currentUser.savedAddress ? [currentUser.savedAddress] : []);

  return (
    <div className="bg-[#F3E9EB] py-12 sm:py-16 animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Account Header */}
        <div className="bg-[#F3E9EB] p-6 sm:p-8 border border-[#D5C2D7] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#8C5A7D] text-[#F6F0F4] flex items-center justify-center font-serif text-2xl font-bold">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#8C5A7D] font-semibold">
                  HOUSE OF RII Member
                </span>
                <span className="px-1.5 py-0.2 bg-[#8C5A7D]/10 text-[#8C5A7D] text-[9px] uppercase font-bold rounded-xs">
                  {currentUser.role === 'admin' ? 'Administrator' : 'Patron'}
                </span>
                {isDatabaseConnected && (
                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] uppercase font-bold rounded-xs">
                    DB Synced
                  </span>
                )}
              </div>
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
              className="px-4 py-2 bg-[#F3E9EB] border border-[#D5C2D7] hover:border-[#8C5A7D] text-xs font-semibold text-[#8C5A7D] flex items-center gap-1.5 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>My Orders ({userOrdersCount})</span>
            </button>
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="px-4 py-2 bg-[#F3E9EB] border border-[#D5C2D7] hover:border-[#8C5A7D] text-xs font-semibold text-[#8C5A7D] flex items-center gap-1.5 transition-colors"
            >
              <Heart className="w-4 h-4 text-[#8C5A7D]" />
              <span>Wishlist ({wishlist.length})</span>
            </button>
            <button
              onClick={logoutCustomer}
              className="px-3.5 py-2 border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign out of your account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Profile, Addresses, Security */}
        <div className="flex border-b border-[#D5C2D7] bg-white text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 border-b-2 text-center transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#8C5A7D] text-[#8C5A7D] bg-[#F6F0F4]'
                : 'border-transparent text-[#A185A4] hover:text-[#554052]'
            }`}
          >
            Patron Profile
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 py-3 border-b-2 text-center transition-colors cursor-pointer ${
              activeTab === 'addresses'
                ? 'border-[#8C5A7D] text-[#8C5A7D] bg-[#F6F0F4]'
                : 'border-transparent text-[#A185A4] hover:text-[#554052]'
            }`}
          >
            Saved Delivery Addresses ({savedAddresses.length})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-3 border-b-2 text-center transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'border-[#8C5A7D] text-[#8C5A7D] bg-[#F6F0F4]'
                : 'border-transparent text-[#A185A4] hover:text-[#554052]'
            }`}
          >
            Security & Password
          </button>
        </div>

        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-[#F3E9EB] p-6 sm:p-8 border border-[#D5C2D7] space-y-6 shadow-xs animate-in fade-in duration-200">
            <div className="border-b border-[#D5C2D7] pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#554052]">
                  Account Information
                </h3>
                <p className="text-xs text-[#A185A4] mt-0.5">
                  Update your display name and registered contact mobile for dispatch notifications.
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
                    className="w-full bg-[#F3E9EB] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#554052] mb-1">
                    Email Address (Account ID)
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
                    className="w-full bg-[#F3E9EB] border border-[#D5C2D7] p-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#554052] mb-1">Account Joined</label>
                  <input
                    type="text"
                    value={new Date(currentUser.createdAt || Date.now()).toLocaleDateString('en-IN', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    disabled
                    className="w-full bg-gray-100 border border-[#D5C2D7] p-2.5 text-xs text-gray-500 cursor-not-allowed outline-none"
                  />
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
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="bg-[#F3E9EB] p-6 sm:p-8 border border-[#D5C2D7] space-y-6 shadow-xs animate-in fade-in duration-200">
            <div className="border-b border-[#D5C2D7] pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#554052]">
                  Saved Delivery Addresses
                </h3>
                <p className="text-xs text-[#A185A4] mt-0.5">
                  Pre-fill your shipping address for fast 1-click checkout.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="px-4 py-2 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                {showAddAddress ? 'Cancel' : '+ Add New Address'}
              </button>
            </div>

            {/* Add New Address Form */}
            {showAddAddress && (
              <form onSubmit={handleAddNewAddress} className="p-4 bg-white border border-[#D5C2D7] space-y-4 text-xs">
                <h4 className="font-serif font-bold text-sm text-[#8C5A7D]">New Delivery Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#554052] font-medium mb-1">Recipient Name *</label>
                    <input
                      type="text"
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2 text-xs outline-none focus:border-[#8C5A7D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#554052] font-medium mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2 text-xs outline-none focus:border-[#8C5A7D]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#554052] font-medium mb-1">House / Flat / Street *</label>
                  <input
                    type="text"
                    value={newAddrLine}
                    onChange={(e) => setNewAddrLine(e.target.value)}
                    placeholder="e.g. 24, Malviya Nagar"
                    className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2 text-xs outline-none focus:border-[#8C5A7D]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#554052] font-medium mb-1">PIN Code *</label>
                    <input
                      type="text"
                      value={newAddrPincode}
                      onChange={(e) => setNewAddrPincode(e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                      placeholder="302017"
                      className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2 text-xs outline-none focus:border-[#8C5A7D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#554052] font-medium mb-1">City *</label>
                    <input
                      type="text"
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2 text-xs outline-none focus:border-[#8C5A7D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#554052] font-medium mb-1">State *</label>
                    <input
                      type="text"
                      value={newAddrState}
                      onChange={(e) => setNewAddrState(e.target.value)}
                      className="w-full bg-[#F6F0F4] border border-[#D5C2D7] p-2 text-xs outline-none focus:border-[#8C5A7D]"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="px-4 py-2 border border-[#D5C2D7] text-[#554052]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#8C5A7D] hover:bg-[#554052] text-white font-semibold uppercase tracking-wider text-xs"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* List of Saved Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((addr, idx) => (
                <div
                  key={addr.id || idx}
                  className="bg-white p-5 border border-[#D5C2D7] space-y-2 relative shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-sm text-[#554052]">{addr.fullName}</strong>
                    {addr.isDefault && (
                      <span className="text-[9px] uppercase px-2 py-0.5 bg-[#8C5A7D] text-white font-bold rounded-xs">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#554052]">
                    {addr.addressLine}
                    {addr.locality && `, ${addr.locality}`}
                    <br />
                    {addr.city}, {addr.state} — <strong className="font-mono">{addr.pincode}</strong>
                  </p>
                  <p className="text-[11px] text-[#A185A4]">Mobile: {addr.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <div className="bg-[#F3E9EB] p-6 sm:p-8 border border-[#D5C2D7] space-y-6 shadow-xs animate-in fade-in duration-200">
            <div className="border-b border-[#D5C2D7] pb-4">
              <h3 className="font-serif text-lg font-bold text-[#554052]">
                Account Security & Password
              </h3>
              <p className="text-xs text-[#A185A4] mt-0.5">
                Update your account credentials or review account privacy policies.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs">
              <div>
                <label className="block text-[#554052] font-semibold mb-1">New Password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#F3E9EB] border border-[#D5C2D7] p-2.5 text-xs outline-none focus:border-[#8C5A7D]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#554052] font-semibold mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#F3E9EB] border border-[#D5C2D7] p-2.5 text-xs outline-none focus:border-[#8C5A7D]"
                  required
                />
              </div>

              {passwordMsg && (
                <p className="text-xs text-[#8C5A7D] font-semibold">{passwordMsg}</p>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Update Password
              </button>
            </form>

            <div className="pt-6 border-t border-[#D5C2D7] space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#554052]">Account Deletion & Data Privacy</h4>
              <p className="text-xs text-[#A185A4] leading-relaxed">
                Under Indian Consumer Protection (E-Commerce) Rules and GST compliance mandates, completed order transactions and invoices must be retained for tax auditing purposes. To request full deletion of your profile data, please contact our Jaipur studio concierge at <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-[#8C5A7D] underline">{BRAND_CONFIG.contact.email}</a>.
              </p>
            </div>
          </div>
        )}

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
