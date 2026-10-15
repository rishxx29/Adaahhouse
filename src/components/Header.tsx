import React, { useState } from 'react';
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
} from 'lucide-react';
import { AdaahLogo } from './AdaahLogo';
import { useStore, ActivePage } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    setSelectedCollectionFilter,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    searchQuery,
    setSearchQuery,
    isOwnerLoggedIn,
    setIsOwnerLoginModalOpen,
    logoutOwner,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    logoutCustomer,
  } = useStore();


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavClick = (page: ActivePage, collectionFilter?: string) => {
    setActivePage(page);
    if (collectionFilter) {
      setSelectedCollectionFilter(collectionFilter);
    } else if (page === 'shop') {
      setSelectedCollectionFilter('all');
    }
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DED2]/80 transition-all">
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

      {/* Main Header Bar adhering to 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark & Official Lotus Mark */}
        <button
          onClick={() => handleNavClick('home')}
          className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5B1E22] shrink-0 text-left"
          aria-label="ADAAH HOUSE Home"
        >
          <AdaahLogo variant="horizontal" showTagline={true} />
        </button>

        {/* Zone 2: 4–5 Clean single-line text links */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-wide uppercase font-medium text-[#292522]">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors hover:text-[#5B1E22] whitespace-nowrap shrink-0 ${
              activePage === 'home' ? 'text-[#5B1E22] font-semibold border-b border-[#5B1E22] pb-0.5' : 'text-[#292522]/80'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('shop', 'all')}
            className={`transition-colors hover:text-[#5B1E22] whitespace-nowrap shrink-0 ${
              activePage === 'shop' ? 'text-[#5B1E22] font-semibold border-b border-[#5B1E22] pb-0.5' : 'text-[#292522]/80'
            }`}
          >
            Shop All
          </button>
          <button
            onClick={() => handleNavClick('shop', 'Everyday Elegance')}
            className="transition-colors hover:text-[#5B1E22] text-[#292522]/80 whitespace-nowrap shrink-0"
          >
            Everyday Wear
          </button>
          <button
            onClick={() => handleNavClick('shop', 'Festive Edit')}
            className="transition-colors hover:text-[#5B1E22] text-[#292522]/80 whitespace-nowrap shrink-0"
          >
            Festive Edit
          </button>
          <button
            onClick={() => handleNavClick('orders')}
            className={`transition-colors hover:text-[#5B1E22] whitespace-nowrap shrink-0 ${
              activePage === 'orders' ? 'text-[#5B1E22] font-semibold border-b border-[#5B1E22] pb-0.5' : 'text-[#292522]/80'
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`transition-colors hover:text-[#5B1E22] whitespace-nowrap shrink-0 ${
              activePage === 'about' ? 'text-[#5B1E22] font-semibold border-b border-[#5B1E22] pb-0.5' : 'text-[#292522]/80'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`transition-colors hover:text-[#5B1E22] whitespace-nowrap shrink-0 ${
              activePage === 'contact' ? 'text-[#5B1E22] font-semibold border-b border-[#5B1E22] pb-0.5' : 'text-[#292522]/80'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Utility Actions (Search, Wishlist, Bag, Customer Account & Owner Studio) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-[#292522] hover:text-[#5B1E22] transition-colors"
            title="Search Products"
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-[#292522] hover:text-[#5B1E22] transition-colors"
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
            className="relative p-2 text-[#292522] hover:text-[#5B1E22] transition-colors"
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
            <div className="relative group">
              <button
                onClick={() => handleNavClick('account')}
                className="flex items-center gap-1.5 p-1.5 px-2 sm:px-2.5 bg-white border border-[#E8DED2] hover:border-[#5B1E22] text-xs font-semibold text-[#5B1E22] transition-colors rounded-xs shadow-2xs"
                title={`Signed in as ${currentUser.fullName}`}
              >
                <div className="w-5 h-5 rounded-full bg-[#5B1E22] text-[#FAF7F2] flex items-center justify-center text-[10px] font-bold">
                  {currentUser.fullName.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate text-[11px]">
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
              className="flex items-center gap-1.5 p-1.5 px-2.5 bg-white border border-[#E8DED2] hover:border-[#5B1E22] text-xs font-semibold text-[#292522] hover:text-[#5B1E22] transition-colors rounded-xs shadow-2xs"
              title="Customer Sign In / Register"
            >
              <User className="w-4 h-4 text-[#5B1E22]" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Owner Studio Button */}
          {isOwnerLoggedIn ? (
            <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 bg-[#5B1E22] text-[#FAF7F2] rounded-xs text-xs font-medium shadow-xs">
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1.5 hover:text-[#C9A76A] transition-colors"
                title="Manage kurti images, sizes, and customer orders"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A76A]" />
                <span>Admin Studio</span>
              </button>
              <span className="text-[#C9A76A]/50">·</span>
              <button
                onClick={logoutOwner}
                className="text-[10px] text-[#E8DED2] hover:text-white uppercase tracking-wider"
                title="Log out of admin mode"
              >
                Exit
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('admin')}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#5B1E22] bg-[#F2ECE1] hover:bg-[#5B1E22] hover:text-white border border-[#C9A76A]/60 rounded-xs transition-colors shadow-2xs group"
              title="ADAAH HOUSE Owner & Admin Portal"
            >
              <Lock className="w-3.5 h-3.5 text-[#C9A76A] group-hover:text-[#FAF7F2] transition-colors" />
              <span>Admin Portal</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#292522] hover:text-[#5B1E22]"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E8DED2] px-6 py-6 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3.5 text-sm font-medium tracking-wider uppercase text-[#292522]">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left py-1.5 border-b border-[#E8DED2]/50 ${
                activePage === 'home' ? 'text-[#5B1E22] font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop', 'all')}
              className={`text-left py-1.5 border-b border-[#E8DED2]/50 ${
                activePage === 'shop' ? 'text-[#5B1E22] font-semibold' : ''
              }`}
            >
              Shop All Kurtis
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Everyday Elegance')}
              className="text-left py-1.5 border-b border-[#E8DED2]/50"
            >
              Everyday Wear
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Festive Edit')}
              className="text-left py-1.5 border-b border-[#E8DED2]/50"
            >
              Festive Edit
            </button>
            <button
              onClick={() => handleNavClick('orders')}
              className={`text-left py-1.5 border-b border-[#E8DED2]/50 flex items-center justify-between ${
                activePage === 'orders' ? 'text-[#5B1E22] font-semibold' : ''
              }`}
            >
              <span>My Orders</span>
              <Package className="w-4 h-4 text-[#5B1E22]" />
            </button>
            <button
              onClick={() => {
                setIsWishlistOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-1.5 border-b border-[#E8DED2]/50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>My Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-[#5B1E22] text-white text-[10px] font-semibold rounded-full leading-none">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <Heart className="w-4 h-4 text-[#5B1E22]" />
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-left py-1.5 border-b border-[#E8DED2]/50 ${
                activePage === 'about' ? 'text-[#5B1E22] font-semibold' : ''
              }`}
            >
              About ADAAH HOUSE
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left py-1.5 border-b border-[#E8DED2]/50 ${
                activePage === 'contact' ? 'text-[#5B1E22] font-semibold' : ''
              }`}
            >
              Contact Us
            </button>

            {/* Customer Account Strip in Mobile */}
            <div className="pt-2 border-t border-[#E8DED2]">
              {currentUser ? (
                <div className="p-3 bg-white border border-[#E8DED2] rounded-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#292522]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#5B1E22] text-white flex items-center justify-center text-xs">
                        {currentUser.fullName.charAt(0)}
                      </div>
                      <span>{currentUser.fullName}</span>
                    </div>
                    <button
                      onClick={() => {
                        logoutCustomer();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-red-700 text-[11px] underline"
                    >
                      Sign Out
                    </button>
                  </div>
                  <button
                    onClick={() => handleNavClick('account')}
                    className="w-full text-left text-xs text-[#5B1E22] font-semibold flex items-center gap-1 pt-1"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>View / Edit Profile</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 bg-white border border-[#5B1E22] text-[#5B1E22] rounded-xs font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Customer Sign In / Register</span>
                </button>
              )}
            </div>

            {/* Mobile Admin Portal Strip */}
            <div className="pt-1">
              {isOwnerLoggedIn ? (
                <div className="flex items-center justify-between py-2 px-3 bg-[#5B1E22] text-[#FAF7F2] rounded-xs font-semibold text-xs">
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="flex items-center gap-2 text-xs"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#C9A76A]" />
                    <span>Admin Studio (Active)</span>
                  </button>
                  <button
                    onClick={logoutOwner}
                    className="text-[11px] text-[#E8DED2] underline font-normal"
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center justify-between w-full py-2.5 px-3 bg-[#F2ECE1] border border-[#C9A76A]/40 rounded-xs text-xs font-semibold text-[#5B1E22]"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#C9A76A]" />
                    <span>Admin Portal</span>
                  </div>
                  <span className="text-[10px] text-[#9E897A] font-normal uppercase tracking-wider">Passcode Access</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}

    </header>
  );
};
