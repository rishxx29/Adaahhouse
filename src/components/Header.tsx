import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  SlidersHorizontal,
  Lock,
  User,
  Package,
  ChevronDown,
  LogOut,
  Home,
  Sparkles,
  Info,
  Phone,
  ShieldCheck,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { useStore, ActivePage } from '../context/StoreContext';
import { BRAND_CONFIG } from '../config/brand';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    selectedCollectionFilter,
    setSelectedCollectionFilter,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    searchQuery,
    setSearchQuery,
    isOwnerLoggedIn,
    logoutOwner,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    logoutCustomer,
    orders,
  } = useStore();

  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Prevent background scrolling when side navigation drawer is open
  useEffect(() => {
    if (isSideNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSideNavOpen]);

  const handleNavClick = (page: ActivePage, collectionFilter?: string) => {
    setActivePage(page);
    if (collectionFilter) {
      setSelectedCollectionFilter(collectionFilter);
    } else if (page === 'shop') {
      setSelectedCollectionFilter('all');
    }
    setIsSideNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-[#E8DED2]/80 transition-all shadow-xs">
      {/* Search Bar Slide-Down Overlay */}
      {isSearchOpen && (
        <div className="bg-[#FAF7F2] border-b border-[#E8DED2] px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-4 h-4 text-[#C9A76A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== 'shop') setActivePage('shop');
              }}
              placeholder="Search kurtis by fabric, style, color, or collection..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-[#292522] placeholder:text-[#9E897A]"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#9E897A] hover:text-[#5B1E22] px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 text-[#292522] hover:text-[#5B1E22]"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header Bar: Corner Menu | Middle Website Name | Corner Utility Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left Corner: Elegant Menu Button */}
        <div className="w-1/4 sm:w-1/3 flex items-center justify-start">
          <button
            onClick={() => setIsSideNavOpen(true)}
            className="flex items-center gap-2.5 p-1.5 -ml-2 text-[#292522] hover:text-[#5B1E22] transition-colors group cursor-pointer"
            aria-label="Open Navigation Menu"
            title="Explore all sections & collections"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-[#E8DED2] group-hover:border-[#5B1E22] group-hover:bg-[#5B1E22]/5 flex items-center justify-center transition-all shadow-2xs">
              <Menu className="w-5 h-5 text-[#292522] group-hover:text-[#5B1E22] stroke-[1.8]" />
            </div>
            <span className="hidden sm:inline font-serif uppercase tracking-[0.24em] text-xs font-semibold text-[#292522] group-hover:text-[#5B1E22]">
              Menu
            </span>
          </button>
        </div>

        {/* Center: ONLY the Name of the Website */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <button
            onClick={() => handleNavClick('home')}
            className="inline-flex flex-col items-center justify-center text-center group cursor-pointer focus-visible:outline-none"
            aria-label="ADAAH HOUSE Home"
          >
            <div className="flex items-baseline justify-center gap-1.5 sm:gap-2.5">
              <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[0.22em] text-[#5B1E22] leading-none transition-colors group-hover:text-[#421417]">
                ADAAH
              </span>
              <span className="font-serif text-lg sm:text-2xl lg:text-3xl font-light tracking-[0.3em] text-[#C9A76A]">
                HOUSE
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.34em] text-[#651F32] font-semibold mt-1">
              Grace in every thread
            </span>
          </button>
        </div>

        {/* Right Corner: Utility Actions (Search, Wishlist, Bag, Account, Admin) */}
        <div className="w-1/4 sm:w-1/3 flex items-center justify-end gap-1.5 sm:gap-2.5">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-[#292522] hover:text-[#5B1E22] transition-colors cursor-pointer"
            title="Search Products"
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-[#292522] hover:text-[#5B1E22] transition-colors cursor-pointer"
            title="View Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[1.75]" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#5B1E22] text-white text-[10px] font-semibold rounded-full flex items-center justify-center animate-in zoom-in-75 duration-150">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#292522] hover:text-[#5B1E22] transition-colors cursor-pointer"
            title="Shopping Bag"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A76A] text-[#292522] text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Customer Account Trigger */}
          {currentUser ? (
            <div className="relative group hidden sm:block">
              <button
                onClick={() => handleNavClick('account')}
                className="flex items-center gap-1.5 p-1 px-2 bg-white border border-[#E8DED2] hover:border-[#5B1E22] text-xs font-semibold text-[#5B1E22] transition-colors rounded-xs shadow-2xs cursor-pointer"
                title={`Signed in as ${currentUser.fullName}`}
              >
                <div className="w-5 h-5 rounded-full bg-[#5B1E22] text-[#FAF7F2] flex items-center justify-center text-[10px] font-bold">
                  {currentUser.fullName.charAt(0)}
                </div>
                <span className="max-w-[70px] truncate text-[11px]">
                  {currentUser.fullName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-[#9E897A]" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#E8DED2] shadow-lg rounded-xs py-1.5 hidden group-hover:block z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-[#E8DED2] text-[11px] text-[#9E897A] truncate">
                  {currentUser.email}
                </div>
                <button
                  onClick={() => handleNavClick('orders')}
                  className="w-full text-left px-3 py-2 hover:bg-[#FAF7F2] text-[#292522] flex items-center gap-2"
                >
                  <Package className="w-3.5 h-3.5 text-[#5B1E22]" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => handleNavClick('account')}
                  className="w-full text-left px-3 py-2 hover:bg-[#FAF7F2] text-[#292522] flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-[#5B1E22]" />
                  <span>Account Profile</span>
                </button>
                <div className="border-t border-[#E8DED2] my-1" />
                <button
                  onClick={() => logoutCustomer()}
                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-700 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 p-1.5 px-2.5 bg-white border border-[#E8DED2] hover:border-[#5B1E22] text-xs font-semibold text-[#292522] hover:text-[#5B1E22] transition-colors rounded-xs shadow-2xs cursor-pointer"
              title="Customer Sign In / Register"
            >
              <User className="w-4 h-4 text-[#5B1E22]" />
              <span className="text-[11px]">Sign In</span>
            </button>
          )}

          {/* Admin Lock / Studio Trigger */}
          <button
            onClick={() => handleNavClick('admin')}
            className={`p-2 rounded-xs transition-colors cursor-pointer ${
              isOwnerLoggedIn
                ? 'bg-[#5B1E22] text-[#FAF7F2] hover:bg-[#421417]'
                : 'text-[#9E897A] hover:text-[#5B1E22]'
            }`}
            title={isOwnerLoggedIn ? 'Admin Studio Active' : 'Owner & Admin Portal'}
            aria-label="Admin Portal"
          >
            {isOwnerLoggedIn ? (
              <SlidersHorizontal className="w-4 h-4 text-[#C9A76A]" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Luxury Side Navigation Drawer (Rendered via Portal to ensure full viewport visibility & escape header containing block) */}
      {isSideNavOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex animate-in fade-in duration-200">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsSideNavOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
            aria-hidden="true"
          />

          {/* Side Drawer Panel */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between border-r border-[#E8DED2] overflow-y-auto animate-in slide-in-from-left duration-300 z-10">
            {/* Top Header of Drawer */}
            <div className="p-5 border-b border-[#E8DED2] flex items-center justify-between bg-white shrink-0">
              <button
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-3 text-left focus:outline-none cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#5B1E22]/10 flex items-center justify-center text-[#5B1E22] border border-[#C9A76A]/40">
                  <span className="font-serif font-bold text-sm text-[#5B1E22]">AH</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#5B1E22] tracking-wider leading-none">
                    ADAAH HOUSE
                  </h3>
                  <p className="text-[9px] uppercase tracking-[0.24em] text-[#C9A76A] font-semibold mt-0.5">
                    Grace in every thread
                  </p>
                </div>
              </button>

              <button
                onClick={() => setIsSideNavOpen(false)}
                className="w-8 h-8 rounded-full border border-[#E8DED2] flex items-center justify-center text-[#292522] hover:text-[#5B1E22] hover:border-[#5B1E22] transition-colors cursor-pointer"
                aria-label="Close Navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Greeting / Auth Strip */}
            <div className="px-5 py-3.5 bg-[#F2ECE1] border-b border-[#E8DED2] flex items-center justify-between shrink-0">
              {currentUser ? (
                <div className="flex items-center justify-between w-full text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#5B1E22] text-[#FAF7F2] flex items-center justify-center font-bold text-xs shadow-xs">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#292522]">{currentUser.fullName}</p>
                      <p className="text-[10px] text-[#9E897A] truncate max-w-[170px]">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logoutCustomer();
                      setIsSideNavOpen(false);
                    }}
                    className="text-[11px] text-red-700 hover:underline font-semibold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="font-serif font-bold text-xs text-[#292522]">Welcome to ADAAH HOUSE</p>
                    <p className="text-[10px] text-[#9E897A]">Sign in for order tracking & saved address</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSideNavOpen(false);
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-[#5B1E22] text-white text-[11px] font-semibold uppercase tracking-wider rounded-xs shadow-xs hover:bg-[#421417] cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Navigation Links & Tabs */}
            <div className="flex-1 px-5 py-4 space-y-6 overflow-y-auto text-xs">
              {/* Category 1: Kurti Collections */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C9A76A] block px-2 pb-1">
                  Boutique Collections & Tabs
                </span>

                <button
                  onClick={() => handleNavClick('home')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'home'
                      ? 'bg-[#5B1E22] text-white font-semibold'
                      : 'text-[#292522] hover:bg-white hover:text-[#5B1E22]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-[#C9A76A]" />
                    <span className="text-[13px] uppercase tracking-wider">Home</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('shop', 'all')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'shop' && selectedCollectionFilter === 'all'
                      ? 'bg-[#5B1E22] text-white font-semibold'
                      : 'text-[#292522] hover:bg-white hover:text-[#5B1E22]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-[#C9A76A]" />
                    <span className="text-[13px] uppercase tracking-wider">Shop All Kurtis</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-[#C9A76A]/20 text-[#5B1E22] rounded-full font-bold">
                    All
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('shop', 'Everyday Elegance')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'shop' && selectedCollectionFilter === 'Everyday Elegance'
                      ? 'bg-[#5B1E22] text-white font-semibold'
                      : 'text-[#292522] hover:bg-white hover:text-[#5B1E22]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#C9A76A]" />
                    <span className="text-[13px] uppercase tracking-wider">Everyday Wear (Casual/Office)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('shop', 'Festive Edit')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'shop' && selectedCollectionFilter === 'Festive Edit'
                      ? 'bg-[#5B1E22] text-white font-semibold'
                      : 'text-[#292522] hover:bg-white hover:text-[#5B1E22]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#C9A76A]" />
                    <span className="text-[13px] uppercase tracking-wider">Festive & Wedding Edit</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

              {/* Category 2: Customer Section */}
              <div className="space-y-1 pt-2 border-t border-[#E8DED2]">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C9A76A] block px-2 pb-1">
                  Customer Dashboard
                </span>

                <button
                  onClick={() => handleNavClick('orders')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'orders'
                      ? 'bg-[#5B1E22] text-white font-semibold'
                      : 'text-[#292522] hover:bg-white hover:text-[#5B1E22]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-[#5B1E22]" />
                    <span className="text-[13px] uppercase tracking-wider font-semibold">My Orders</span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#FAF7F2] border border-[#E8DED2] text-[#5B1E22] text-[10px] font-bold rounded-xs">
                    {orders.length} Placed
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsSideNavOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between text-[#292522] hover:bg-white hover:text-[#5B1E22] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-[#5B1E22]" />
                    <span className="text-[13px] uppercase tracking-wider">My Wishlist</span>
                  </div>
                  {wishlist.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-[#5B1E22] text-white text-[10px] rounded-full leading-none">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNavClick('account')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'account'
                      ? 'bg-[#5B1E22] text-white font-semibold'
                      : 'text-[#292522] hover:bg-white hover:text-[#5B1E22]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#5B1E22]" />
                    <span className="text-[13px] uppercase tracking-wider">Customer Profile & Addresses</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

              {/* Category 3: Brand & Heritage */}
              <div className="space-y-1 pt-2 border-t border-[#E8DED2]">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C9A76A] block px-2 pb-1">
                  Brand & Heritage
                </span>

                <button
                  onClick={() => handleNavClick('about')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'about'
                      ? 'bg-[#5B1E22] text-white font-semibold'
                      : 'text-[#292522] hover:bg-white hover:text-[#5B1E22]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-[#9E897A]" />
                    <span className="text-[13px] uppercase tracking-wider">About ADAAH HOUSE</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('contact')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'contact'
                      ? 'bg-[#5B1E22] text-white font-semibold'
                      : 'text-[#292522] hover:bg-white hover:text-[#5B1E22]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#9E897A]" />
                    <span className="text-[13px] uppercase tracking-wider">Contact & Concierge</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('policies')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'policies'
                      ? 'bg-[#5B1E22] text-white font-semibold'
                      : 'text-[#292522] hover:bg-white hover:text-[#5B1E22]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#9E897A]" />
                    <span className="text-[13px] uppercase tracking-wider">Policies & Exchange</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

              {/* Category 4: Admin Portal */}
              <div className="pt-2 border-t border-[#E8DED2]">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`w-full text-left p-3 rounded-xs border flex items-center justify-between transition-colors cursor-pointer ${
                    isOwnerLoggedIn
                      ? 'bg-[#5B1E22] text-white border-[#C9A76A]'
                      : 'bg-[#F2ECE1] text-[#5B1E22] border-[#C9A76A]/50 hover:bg-[#5B1E22] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-[#C9A76A]" />
                    <div>
                      <p className="font-bold text-xs uppercase tracking-wider">
                        {isOwnerLoggedIn ? 'Admin Studio (Active)' : 'Admin & Owner Portal'}
                      </p>
                      <p className="text-[10px] text-inherit opacity-80">Manage Orders, Inventory & PIN</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-black/10 rounded-xs">
                    Alt + O
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Contact / Concierge Strip */}
            <div className="p-5 border-t border-[#E8DED2] bg-white space-y-3 shrink-0">
              <a
                href={BRAND_CONFIG.social.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <div className="text-[11px] text-[#9E897A] text-center space-y-0.5">
                <p>Official Boutique: {BRAND_CONFIG.contact.email}</p>
                <p>Phone: {BRAND_CONFIG.contact.phone}</p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

