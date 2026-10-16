import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AdminProductManager } from './components/AdminProductManager';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { OwnerLoginModal } from './components/OwnerLoginModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { OrdersPage } from './pages/OrdersPage';
import { AccountPage } from './pages/AccountPage';
import { BRAND_CONFIG } from './config/brand';
import { MessageCircle, Check } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activePage,
    setActivePage,
    isOwnerLoggedIn,
    setIsOwnerLoginModalOpen,
    openAuthModal,
    toast,
  } = useStore();

  React.useEffect(() => {
    // Check if URL specifies admin/owner/orders/account mode
    const checkUrl = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#admin' || hash === '#owner' || search.includes('admin') || search.includes('owner')) {
        setActivePage('admin');
      } else if (hash === '#orders' || search.includes('orders')) {
        setActivePage('orders');
      } else if (hash === '#account' || search.includes('account')) {
        setActivePage('account');
      } else if (hash === '#login' || search.includes('login')) {
        openAuthModal('login');
      }
    };
    checkUrl();
    window.addEventListener('hashchange', checkUrl);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + O or Alt + Shift + O toggles owner access
      if (e.altKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        if (isOwnerLoggedIn) {
          setActivePage('admin');
        } else {
          setIsOwnerLoginModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkUrl);
    };
  }, [isOwnerLoggedIn, setActivePage, setIsOwnerLoginModalOpen, openAuthModal]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3E9EB] text-[#554052]">
      {/* 1. Slim Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Top Navigation Bar (3-Zone Contract) */}
      <Header />

      {/* 3. Main View Router */}
      <main className="flex-1">
        {activePage === 'home' && <HomePage />}
        {activePage === 'shop' && <ShopPage />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'policies' && <PoliciesPage />}
        {activePage === 'order-confirmation' && <OrderConfirmationPage />}
        {activePage === 'orders' && <OrdersPage />}
        {(activePage === 'account' || activePage === 'login') && <AccountPage />}
        {activePage === 'admin' && <AdminProductManager />}
      </main>

      {/* 4. Global Modals & Drawers */}
      <ProductDetailsModal />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <SizeGuideModal />
      <OwnerLoginModal />
      <CustomerAuthModal />

      {/* 5. Floating WhatsApp Concierge Button */}
      <a
        href={BRAND_CONFIG.social.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-30 p-3.5 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 group"
        aria-label="Order or Chat on WhatsApp"
        title="Chat with HOUSE OF RII on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold pr-1">
          Chat on WhatsApp
        </span>
      </a>

      {/* 6. Subtle Feedback Toast */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#554052] text-[#F6F0F4] px-4 py-3 rounded-xs shadow-lg border border-[#D5C2D7] text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-[#D5C2D7]" />
          <span>{toast}</span>
        </div>
      )}

      {/* 7. Boutique Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
