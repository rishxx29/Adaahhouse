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
  Flame,
} from 'lucide-react';
import { useStore, ActivePage } from '../context/StoreContext';
import { BRAND_CONFIG } from '../config/brand';
import { HouseOfRiiLotus } from './AdaahLogo';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    selectedCollectionFilter,
    setSelectedCollectionFilter,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
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
  const [isEverydayOpen, setIsEverydayOpen] = useState(true);
  const [isFestiveOpen, setIsFestiveOpen] = useState(true);

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

  const handleNavClick = (page: ActivePage, collectionFilter?: string, categoryFilter: string = 'all') => {
    setActivePage(page);
    if (collectionFilter) {
      setSelectedCollectionFilter(collectionFilter);
    } else if (page === 'shop') {
      setSelectedCollectionFilter('all');
    }
    setSelectedCategoryFilter(categoryFilter);
    setIsSideNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F3E9EB] border-b border-[#D5C2D7] transition-all shadow-2xs select-none">
      {/* Search Bar Slide-Down Overlay */}
      {isSearchOpen && (
        <div className="bg-[#F3E9EB] border-b border-[#D5C2D7] px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-4 h-4 text-[#8C5A7D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== 'shop') setActivePage('shop');
              }}
              placeholder="Search for kurtas, sets and more..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-[#554052] placeholder:text-[#A185A4]"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#8C5A7D] hover:text-[#554052] px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 text-[#554052] hover:text-[#8C5A7D]"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header Bar matching visual reference: Left Logo | Center Nav Links | Right Search + Icons */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-20 sm:h-[88px] flex items-center justify-between gap-3 lg:gap-6">
        {/* Left: Stacked HOUSE OF RII Logo from official visual reference */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsSideNavOpen(true)}
            className="lg:hidden p-2 -ml-2 text-[#554052] hover:text-[#8C5A7D] transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleNavClick('home')}
            className="inline-flex flex-col items-center text-center group cursor-pointer focus-visible:outline-none py-1"
            aria-label="HOUSE OF RII Home"
          >
            <HouseOfRiiLotus size={36} color="#7D4E68" className="transition-transform group-hover:scale-105 mb-0.5" />
            <span className="font-serif text-lg sm:text-xl lg:text-[22px] font-normal tracking-[0.18em] text-[#7D4E68] leading-none whitespace-nowrap">
              HOUSE OF RII
            </span>
            <div className="flex items-center justify-center gap-1.5 text-[7px] sm:text-[7.5px] uppercase tracking-[0.34em] text-[#554052]/80 font-medium mt-1 w-full">
              <span className="h-[0.5px] w-2.5 bg-[#A185A4]/60" />
              <span>ETHNIC WEAR</span>
              <span className="h-[0.5px] w-2.5 bg-[#A185A4]/60" />
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links matching Reference Image */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-7 text-xs font-medium tracking-wider text-[#554052] whitespace-nowrap shrink-0">
          <button
            onClick={() => handleNavClick('shop', 'all', 'all')}
            className="hover:text-[#8C5A7D] transition-colors py-1 cursor-pointer"
          >
            New In
          </button>
          <button
            onClick={() => handleNavClick('shop', 'all', 'Kurti')}
            className="hover:text-[#8C5A7D] transition-colors py-1 cursor-pointer"
          >
            Kurtas
          </button>
          <button
            onClick={() => handleNavClick('shop', 'all', 'Kurti Set')}
            className="hover:text-[#8C5A7D] transition-colors py-1 cursor-pointer"
          >
            Kurta Sets
          </button>
          <button
            onClick={() => handleNavClick('shop', 'all', 'Coord Set')}
            className="hover:text-[#8C5A7D] transition-colors py-1 cursor-pointer"
          >
            Co-ords
          </button>
          <button
            onClick={() => handleNavClick('shop', 'Festive & Wedding Edits', 'all')}
            className="hover:text-[#8C5A7D] transition-colors py-1 cursor-pointer"
          >
            Festive Edit
          </button>
          <button
            onClick={() => handleNavClick('shop', 'all', 'all')}
            className="hover:text-[#8C5A7D] transition-colors py-1 cursor-pointer"
          >
            Collections
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="hover:text-[#8C5A7D] transition-colors py-1 cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right Corner: Search Input Pill + Wishlist + Bag + Account */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
          {/* Desktop Search Input Pill */}
          <div className="hidden md:flex items-center relative w-48 lg:w-56 xl:w-64">
            <Search className="w-3.5 h-3.5 text-[#554052] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== 'shop') setActivePage('shop');
              }}
              placeholder="Search for kurtas, sets and more..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F6ECEF] border border-[#D5C2D7] rounded-full text-[11px] text-[#554052] placeholder:text-[#8C5A7D]/70 outline-none focus:border-[#8C5A7D] transition-all"
            />
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-[#554052] hover:text-[#8C5A7D] transition-colors cursor-pointer"
            title="Search Products"
            aria-label="Search"
          >
            <Search className="w-4 h-4 stroke-[1.75]" />
          </button>

          {/* Customer Account Trigger */}
          {currentUser ? (
            <div className="relative group">
              <button
                onClick={() => handleNavClick('account')}
                className="flex items-center gap-1.5 p-1 px-2 bg-[#F6ECEF] border border-[#D5C2D7] hover:border-[#8C5A7D] text-xs font-semibold text-[#8C5A7D] transition-colors rounded-full shadow-2xs cursor-pointer"
                title={`Signed in as ${currentUser.fullName}`}
              >
                <div className="w-4 h-4 rounded-full bg-[#8C5A7D] text-[#F6F0F4] flex items-center justify-center text-[9px] font-bold">
                  {currentUser.fullName.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[70px] truncate text-[11px]">
                  {currentUser.fullName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-[#A185A4]" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-44 bg-[#F6ECEF] border border-[#D5C2D7] shadow-lg rounded-xs py-1.5 hidden group-hover:block z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-[#D5C2D7] text-[11px] text-[#A185A4] truncate">
                  {currentUser.email}
                </div>
                <button
                  onClick={() => handleNavClick('orders')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F3E9EB] text-[#554052] flex items-center gap-2"
                >
                  <Package className="w-3.5 h-3.5 text-[#8C5A7D]" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => handleNavClick('account')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F3E9EB] text-[#554052] flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-[#8C5A7D]" />
                  <span>Account Profile</span>
                </button>
                <div className="border-t border-[#D5C2D7] my-1" />
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
              className="p-1.5 text-[#554052] hover:text-[#8C5A7D] transition-colors cursor-pointer"
              title="Customer Sign In / Register"
              aria-label="Sign In"
            >
              <User className="w-4 h-4 stroke-[1.75]" />
            </button>
          )}

          {/* Wishlist Icon with plum badge */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-1.5 text-[#554052] hover:text-[#8C5A7D] transition-colors cursor-pointer"
            title="View Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4 stroke-[1.75]" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#8C5A7D] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
              {wishlist.length}
            </span>
          </button>

          {/* Shopping Bag Button with plum badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 text-[#554052] hover:text-[#8C5A7D] transition-colors cursor-pointer"
            title="Shopping Bag"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#8C5A7D] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
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
          <div className="relative w-full max-w-sm sm:max-w-md bg-[#F3E9EB] h-full shadow-2xl flex flex-col justify-between border-r border-[#D5C2D7] overflow-y-auto animate-in slide-in-from-left duration-300 z-10">
            {/* Top Header of Drawer */}
            <div className="p-5 border-b border-[#D5C2D7] flex items-center justify-between bg-[#F3E9EB] shrink-0">
              <button
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-3 text-left focus:outline-none cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#8C5A7D]/10 flex items-center justify-center text-[#8C5A7D] border border-[#A185A4]/40">
                  <span className="font-serif font-bold text-sm text-[#8C5A7D]">Rii</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#8C5A7D] tracking-wider leading-none">
                    HOUSE OF RII
                  </h3>
                  <p className="text-[9px] uppercase tracking-[0.28em] text-[#A185A4] font-semibold mt-0.5">
                    ETHNIC WEAR
                  </p>
                </div>
              </button>

              <button
                onClick={() => setIsSideNavOpen(false)}
                className="w-8 h-8 rounded-full border border-[#D5C2D7] flex items-center justify-center text-[#554052] hover:text-[#8C5A7D] hover:border-[#8C5A7D] transition-colors cursor-pointer"
                aria-label="Close Navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Greeting / Auth Strip */}
            <div className="px-5 py-3.5 bg-[#EFE7ED] border-b border-[#D5C2D7] flex items-center justify-between shrink-0">
              {currentUser ? (
                <div className="flex items-center justify-between w-full text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#8C5A7D] text-[#FAF7F2] flex items-center justify-center font-bold text-xs shadow-xs">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#554052]">{currentUser.fullName}</p>
                      <p className="text-[10px] text-[#A185A4] truncate max-w-[170px]">{currentUser.email}</p>
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
                    <p className="font-serif font-bold text-xs text-[#554052]">Welcome to HOUSE OF RII</p>
                    <p className="text-[10px] text-[#A185A4]">Tradition, styled your way</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSideNavOpen(false);
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-[#8C5A7D] text-white text-[11px] font-semibold uppercase tracking-wider rounded-xs shadow-xs hover:bg-[#554052] cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Navigation Links & Tabs */}
            <div className="flex-1 px-5 py-4 space-y-6 overflow-y-auto text-xs">
              {/* Category 1: Kurti Collections & Tabs */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8C5A7D] block px-2 pb-1">
                  Boutique Collections & Tabs
                </span>

                {/* Home */}
                <button
                  onClick={() => handleNavClick('home')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'home'
                      ? 'bg-[#8C5A7D] text-white font-semibold'
                      : 'text-[#554052] hover:bg-white hover:text-[#8C5A7D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-[#A185A4]" />
                    <span className="text-[13px] uppercase tracking-wider">Home</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                {/* Shop All */}
                <button
                  onClick={() => handleNavClick('shop', 'all', 'all')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'shop' && selectedCollectionFilter === 'all' && selectedCategoryFilter === 'all'
                      ? 'bg-[#8C5A7D] text-white font-semibold'
                      : 'text-[#554052] hover:bg-white hover:text-[#8C5A7D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-[#A185A4]" />
                    <span className="text-[13px] uppercase tracking-wider">Shop All Kurtas & Sets</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-[#A185A4]/20 text-[#8C5A7D] rounded-full font-bold">
                    All
                  </span>
                </button>

                {/* BESTSELLER TAB */}
                <button
                  onClick={() => handleNavClick('shop', 'bestseller', 'all')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'shop' && selectedCollectionFilter === 'bestseller'
                      ? 'bg-[#8C5A7D] text-white font-semibold'
                      : 'text-[#554052] hover:bg-white hover:text-[#8C5A7D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-4 h-4 text-[#8C5A7D] fill-[#8C5A7D]" />
                    <span className="text-[13px] uppercase tracking-wider font-bold">Bestseller</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-[#8C5A7D]/15 text-[#8C5A7D] font-bold uppercase rounded-full">
                    Top Picks
                  </span>
                </button>

                {/* EVERYDAY WEAR TAB GROUP */}
                <div className="pt-2">
                  <div className="flex items-center justify-between px-3 py-2 bg-[#EFE7ED]/80 border border-[#D5C2D7] rounded-xs">
                    <button
                      onClick={() => handleNavClick('shop', 'Everyday Wear', 'all')}
                      className="flex items-center gap-2 text-left flex-1 hover:text-[#8C5A7D] cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#A185A4]" />
                      <span className="text-[13px] uppercase tracking-wider font-bold text-[#554052]">
                        Everyday Wear
                      </span>
                    </button>
                    <button
                      onClick={() => setIsEverydayOpen(!isEverydayOpen)}
                      className="p-1 text-[#A185A4] hover:text-[#8C5A7D] cursor-pointer"
                      aria-label="Toggle Everyday Wear Sub-tabs"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isEverydayOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Everyday Wear Sub-tabs */}
                  {isEverydayOpen && (
                    <div className="mt-1 ml-3 pl-3 border-l-2 border-[#A185A4]/40 space-y-1">
                      <button
                        onClick={() => handleNavClick('shop', 'Everyday Wear', 'all')}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                          activePage === 'shop' &&
                          selectedCollectionFilter === 'Everyday Wear' &&
                          selectedCategoryFilter === 'all'
                            ? 'bg-[#8C5A7D] text-white font-semibold'
                            : 'text-[#554052]/80 hover:bg-white hover:text-[#8C5A7D]'
                        }`}
                      >
                        <span>All Everyday Wear</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('shop', 'Everyday Wear', 'Kurti Set')}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                          activePage === 'shop' &&
                          selectedCollectionFilter === 'Everyday Wear' &&
                          selectedCategoryFilter === 'Kurti Set'
                            ? 'bg-[#8C5A7D] text-white font-semibold'
                            : 'text-[#554052]/80 hover:bg-white hover:text-[#8C5A7D]'
                        }`}
                      >
                        <span>Kurti Set</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>

                      <button
                        onClick={() => handleNavClick('shop', 'Everyday Wear', 'Bottom Wear')}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                          activePage === 'shop' &&
                          selectedCollectionFilter === 'Everyday Wear' &&
                          selectedCategoryFilter === 'Bottom Wear'
                            ? 'bg-[#8C5A7D] text-white font-semibold'
                            : 'text-[#554052]/80 hover:bg-white hover:text-[#8C5A7D]'
                        }`}
                      >
                        <span>Bottom Wear</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>

                      <button
                        onClick={() => handleNavClick('shop', 'Everyday Wear', 'Coord Set')}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                          activePage === 'shop' &&
                          selectedCollectionFilter === 'Everyday Wear' &&
                          selectedCategoryFilter === 'Coord Set'
                            ? 'bg-[#8C5A7D] text-white font-semibold'
                            : 'text-[#554052]/80 hover:bg-white hover:text-[#8C5A7D]'
                        }`}
                      >
                        <span>Coord Set</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>
                    </div>
                  )}
                </div>

                {/* FESTIVE & WEDDING EDITS TAB GROUP */}
                <div className="pt-2">
                  <div className="flex items-center justify-between px-3 py-2 bg-[#EFE7ED]/80 border border-[#D5C2D7] rounded-xs">
                    <button
                      onClick={() => handleNavClick('shop', 'Festive & Wedding Edits', 'all')}
                      className="flex items-center gap-2 text-left flex-1 hover:text-[#8C5A7D] cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#A185A4]" />
                      <span className="text-[13px] uppercase tracking-wider font-bold text-[#554052]">
                        Festive & Wedding Edits
                      </span>
                    </button>
                    <button
                      onClick={() => setIsFestiveOpen(!isFestiveOpen)}
                      className="p-1 text-[#A185A4] hover:text-[#8C5A7D] cursor-pointer"
                      aria-label="Toggle Festive & Wedding Sub-tabs"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isFestiveOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Festive & Wedding Sub-tabs */}
                  {isFestiveOpen && (
                    <div className="mt-1 ml-3 pl-3 border-l-2 border-[#A185A4]/40 space-y-1">
                      <button
                        onClick={() => handleNavClick('shop', 'Festive & Wedding Edits', 'all')}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                          activePage === 'shop' &&
                          selectedCollectionFilter === 'Festive & Wedding Edits' &&
                          selectedCategoryFilter === 'all'
                            ? 'bg-[#8C5A7D] text-white font-semibold'
                            : 'text-[#554052]/80 hover:bg-white hover:text-[#8C5A7D]'
                        }`}
                      >
                        <span>All Festive & Wedding</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('shop', 'Festive & Wedding Edits', 'Suit Sets')}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                          activePage === 'shop' &&
                          selectedCollectionFilter === 'Festive & Wedding Edits' &&
                          selectedCategoryFilter === 'Suit Sets'
                            ? 'bg-[#8C5A7D] text-white font-semibold'
                            : 'text-[#554052]/80 hover:bg-white hover:text-[#8C5A7D]'
                        }`}
                      >
                        <span>Suit Sets</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>

                      <button
                        onClick={() => handleNavClick('shop', 'Festive & Wedding Edits', 'Kurta Sets')}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                          activePage === 'shop' &&
                          selectedCollectionFilter === 'Festive & Wedding Edits' &&
                          selectedCategoryFilter === 'Kurta Sets'
                            ? 'bg-[#8C5A7D] text-white font-semibold'
                            : 'text-[#554052]/80 hover:bg-white hover:text-[#8C5A7D]'
                        }`}
                      >
                        <span>Kurta Sets</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>

                      <button
                        onClick={() => handleNavClick('shop', 'Festive & Wedding Edits', 'Coord Sets')}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                          activePage === 'shop' &&
                          selectedCollectionFilter === 'Festive & Wedding Edits' &&
                          selectedCategoryFilter === 'Coord Sets'
                            ? 'bg-[#8C5A7D] text-white font-semibold'
                            : 'text-[#554052]/80 hover:bg-white hover:text-[#8C5A7D]'
                        }`}
                      >
                        <span>Coord Sets</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>

                      <button
                        onClick={() => handleNavClick('shop', 'Festive & Wedding Edits', 'Sharara Sets')}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                          activePage === 'shop' &&
                          selectedCollectionFilter === 'Festive & Wedding Edits' &&
                          selectedCategoryFilter === 'Sharara Sets'
                            ? 'bg-[#8C5A7D] text-white font-semibold'
                            : 'text-[#554052]/80 hover:bg-white hover:text-[#8C5A7D]'
                        }`}
                      >
                        <span>Sharara Sets</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Category 2: Customer Section */}
              <div className="space-y-1 pt-2 border-t border-[#D5C2D7]">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8C5A7D] block px-2 pb-1">
                  Customer Dashboard
                </span>

                <button
                  onClick={() => handleNavClick('orders')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'orders'
                      ? 'bg-[#8C5A7D] text-white font-semibold'
                      : 'text-[#554052] hover:bg-white hover:text-[#8C5A7D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-[#8C5A7D]" />
                    <span className="text-[13px] uppercase tracking-wider font-semibold">My Orders</span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#F3E9EB] border border-[#D5C2D7] text-[#8C5A7D] text-[10px] font-bold rounded-xs">
                    {orders.length} Placed
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsSideNavOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between text-[#554052] hover:bg-white hover:text-[#8C5A7D] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-[#8C5A7D]" />
                    <span className="text-[13px] uppercase tracking-wider">My Wishlist</span>
                  </div>
                  {wishlist.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-[#8C5A7D] text-white text-[10px] rounded-full leading-none">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNavClick('account')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'account'
                      ? 'bg-[#8C5A7D] text-white font-semibold'
                      : 'text-[#554052] hover:bg-white hover:text-[#8C5A7D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#8C5A7D]" />
                    <span className="text-[13px] uppercase tracking-wider">Customer Profile & Addresses</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

              {/* Category 3: Brand & Heritage */}
              <div className="space-y-1 pt-2 border-t border-[#D5C2D7]">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8C5A7D] block px-2 pb-1">
                  Brand & Heritage
                </span>

                <button
                  onClick={() => handleNavClick('about')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'about'
                      ? 'bg-[#8C5A7D] text-white font-semibold'
                      : 'text-[#554052] hover:bg-white hover:text-[#8C5A7D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-[#A185A4]" />
                    <span className="text-[13px] uppercase tracking-wider">About HOUSE OF RII</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('contact')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'contact'
                      ? 'bg-[#8C5A7D] text-white font-semibold'
                      : 'text-[#554052] hover:bg-white hover:text-[#8C5A7D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#A185A4]" />
                    <span className="text-[13px] uppercase tracking-wider">Contact & Concierge</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('policies')}
                  className={`w-full text-left px-3 py-2.5 rounded-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activePage === 'policies'
                      ? 'bg-[#8C5A7D] text-white font-semibold'
                      : 'text-[#554052] hover:bg-white hover:text-[#8C5A7D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#A185A4]" />
                    <span className="text-[13px] uppercase tracking-wider">Policies & Exchange</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

              {/* Category 4: Admin Portal */}
              <div className="pt-2 border-t border-[#D5C2D7]">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`w-full text-left p-3 rounded-xs border flex items-center justify-between transition-colors cursor-pointer ${
                    isOwnerLoggedIn
                      ? 'bg-[#8C5A7D] text-white border-[#A185A4]'
                      : 'bg-[#EFE7ED] text-[#8C5A7D] border-[#A185A4]/50 hover:bg-[#8C5A7D] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-[#A185A4]" />
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

