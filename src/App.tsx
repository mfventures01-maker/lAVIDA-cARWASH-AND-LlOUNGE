import React, { useEffect } from 'react';
import { useLavidaData } from './hooks/useLavidaData';
import { useCartStore } from './store/useCartStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollProgress } from './components/cinematic/ScrollProgress';
import { Scene1Arrival } from './components/cinematic/Scene1Arrival';
import { Scene2Wash } from './components/cinematic/Scene2Wash';
import { Scene3Reveal } from './components/cinematic/Scene3Reveal';
import { Scene4Grill } from './components/cinematic/Scene4Grill';
import { Scene5Lounge } from './components/cinematic/Scene5Lounge';
import { Scene6Entertainment } from './components/cinematic/Scene6Entertainment';
import { Scene7Offers } from './components/cinematic/Scene7Offers';
import { Scene8OrderCatalog } from './components/cinematic/Scene8OrderCatalog';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderSuccess } from './components/checkout/OrderSuccess';
import { DownloadModal } from './components/apk/DownloadModal';
import { DiagnosticModal } from './components/admin/DiagnosticModal';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function App() {
  const {
    config,
    carousel,
    foodItems,
    drinkItems,
    carwashServices,
    loading,
    error,
    refetch,
  } = useLavidaData();

  const {
    confirmedOrder,
    setConfirmedOrder,
    setSelectedTable,
    setDownloadModalOpen,
    setDiagnosticOpen,
  } = useCartStore();

  const currencySymbol = config?.currency_symbol || '₦';

  // Parse QR code / URL table context on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');
      if (tableParam) {
        setSelectedTable(`Table ${tableParam.trim()}`);
      }
    }
  }, [setSelectedTable]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading && !config && carousel.length === 0 && foodItems.length === 0 && drinkItems.length === 0 && carwashServices.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-6 text-neutral-400">
        <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mb-4" />
        <h2 className="font-serif text-2xl font-bold text-white mb-2 tracking-widest uppercase">
          LAVIDA CARWASH AND LOUNGE
        </h2>
        <p className="text-xs font-mono text-neutral-400 max-w-sm mb-4">
          Synchronizing with live Google Apps Script SSOT backend (0 Fallback Mode)...
        </p>
        <span className="text-[10px] font-mono text-[#D4AF37]/80 bg-black/60 px-3 py-1 rounded-full border border-white/10">
          Strict CARSS Governance · Law 4 & Law 11
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F0E7] relative selection:bg-[#D4AF37]/30 selection:text-white font-sans bg-grain">
      {/* Top Fixed Header with Spec Crest */}
      <Navbar />

      {/* Global Governance Notice Banner */}
      <div className="w-full bg-[#161208] border-b border-amber-500/20 py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[11px] font-mono text-amber-300">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            ABSOLUTE SSOT MODE: Live Google Apps Script Backend · 0 Local Fallback Prices, Food, or Drinks Loaded.
          </span>
          <button
            onClick={() => setDiagnosticOpen(true)}
            className="underline font-bold text-amber-400 hover:text-white ml-2 cursor-pointer"
          >
            Diagnostics
          </button>
        </div>
      </div>

      {/* Vertical Navigation & Scroll Tracker */}
      <ScrollProgress />

      {/* Main Connected Cinematic Story Journey */}
      <main>
        {/* Scene 1: Arrival Hero with Master Logo Emblem */}
        <Scene1Arrival
          onExploreServices={() => scrollTo('scene-wash')}
          onOrderNow={() => scrollTo('scene-order')}
          onOpenDownload={() => setDownloadModalOpen(true)}
        />

        {/* Scene 2: The Precision Wash Sanctuary */}
        <Scene2Wash
          services={carwashServices}
          currencySymbol={currencySymbol}
          onRefresh={refetch}
        />

        {/* Scene 3: The Hydrophobic Ceramic Reveal */}
        <Scene3Reveal />

        {/* Scene 4: Live Charcoal Kitchen & Delicacies */}
        <Scene4Grill
          items={foodItems}
          currencySymbol={currencySymbol}
          onRefresh={refetch}
        />

        {/* Scene 5: The Amber Vault & Mocktail Bar */}
        <Scene5Lounge
          items={drinkItems}
          currencySymbol={currencySymbol}
          onRefresh={refetch}
        />

        {/* Scene 6: Snooker Lounge & Game Night */}
        <Scene6Entertainment
          onExploreEvents={() => scrollTo('scene-offers')}
        />

        {/* Scene 7: 3D Carousel Feed & Showcase Events */}
        <Scene7Offers
          carouselItems={carousel}
          currencySymbol={currencySymbol}
          onExploreMenu={() => scrollTo('scene-order')}
          onRefresh={refetch}
        />

        {/* Scene 8: Unified Digital Menu & Live Cart */}
        <Scene8OrderCatalog
          foodItems={foodItems}
          drinkItems={drinkItems}
          carwashServices={carwashServices}
          currencySymbol={currencySymbol}
          onRefresh={refetch}
        />
      </main>

      {/* Global Footer */}
      <Footer config={config} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Order Checkout Modal */}
      <CheckoutModal />

      {/* Confirmed Order Receipt & WhatsApp Handoff Modal */}
      {confirmedOrder && (
        <OrderSuccess
          order={confirmedOrder}
          whatsappPhone={config?.whatsapp_number || '2348030000000'}
          onClose={() => setConfirmedOrder(null)}
        />
      )}

      {/* Android APK Download Modal */}
      <DownloadModal config={config} />

      {/* Administrative CARSS Diagnostic Modal */}
      <DiagnosticModal />
    </div>
  );
}
