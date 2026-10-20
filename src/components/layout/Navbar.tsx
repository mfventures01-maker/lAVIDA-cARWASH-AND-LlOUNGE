import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { ShoppingBag, Smartphone, ShieldAlert, Menu, X, Car } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    getItemCount,
    setCartOpen,
    setDownloadModalOpen,
    setDiagnosticOpen,
  } = useCartStore();

  const cartCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with Official Spec Crest */}
        <button
          onClick={() => scrollTo('scene-arrival')}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <img
            src="/assets/lavida_logo_master.svg"
            alt="LAVIDA Carwash and Lounge Crest"
            className="w-10 h-10 object-contain drop-shadow-[0_4px_12px_rgba(214,166,75,0.3)] group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="font-serif font-black tracking-widest text-lg sm:text-xl text-[#F5F0E7] block leading-none">
              LAVIDA
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase text-[#D4AF37] block mt-0.5">
              CARWASH AND LOUNGE
            </span>
          </div>
        </button>

        {/* Desktop Nav Links (Clean unboxed typography) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium uppercase tracking-wider text-neutral-300">
          <button
            onClick={() => scrollTo('scene-wash')}
            className="hover:text-[#D4AF37] transition-colors focus:outline-none"
          >
            The Wash
          </button>
          <button
            onClick={() => scrollTo('scene-grill')}
            className="hover:text-[#D4AF37] transition-colors focus:outline-none"
          >
            Delicacies
          </button>
          <button
            onClick={() => scrollTo('scene-lounge')}
            className="hover:text-[#D4AF37] transition-colors focus:outline-none"
          >
            Whiskey Vault
          </button>
          <button
            onClick={() => scrollTo('scene-entertainment')}
            className="hover:text-[#D4AF37] transition-colors focus:outline-none"
          >
            Snooker
          </button>
          <button
            onClick={() => scrollTo('scene-offers')}
            className="hover:text-[#D4AF37] transition-colors focus:outline-none text-[#D4AF37]"
          >
            Special Offers
          </button>
          <button
            onClick={() => scrollTo('scene-order')}
            className="hover:text-[#D4AF37] transition-colors focus:outline-none"
          >
            Order Menu
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Diagnostic status button */}
          <button
            onClick={() => setDiagnosticOpen(true)}
            title="Inspect CARSS & Demo Governance"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-wider hover:bg-amber-500/20 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Demo Mode</span>
          </button>

          {/* Download Android APK button */}
          <button
            onClick={() => setDownloadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs font-mono tracking-wider transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android APK</span>
          </button>

          {/* Cart Icon Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black hover:brightness-110 transition-all shadow-md shadow-[#D4AF37]/20 cursor-pointer"
            aria-label="Open shopping cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black text-[#D4AF37] border border-[#D4AF37] text-[10px] font-mono font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white border border-white/10 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#121212] border-b border-white/10 px-6 py-6 space-y-4 animate-fade-in font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => scrollTo('scene-wash')}
            className="block w-full text-left py-2 text-neutral-300 hover:text-[#D4AF37]"
          >
            The Wash Bays
          </button>
          <button
            onClick={() => scrollTo('scene-grill')}
            className="block w-full text-left py-2 text-neutral-300 hover:text-[#D4AF37]"
          >
            Grills & Delicacies
          </button>
          <button
            onClick={() => scrollTo('scene-lounge')}
            className="block w-full text-left py-2 text-neutral-300 hover:text-[#D4AF37]"
          >
            Whiskey Vault & Mocktails
          </button>
          <button
            onClick={() => scrollTo('scene-entertainment')}
            className="block w-full text-left py-2 text-neutral-300 hover:text-[#D4AF37]"
          >
            Snooker Lounge
          </button>
          <button
            onClick={() => scrollTo('scene-offers')}
            className="block w-full text-left py-2 text-[#D4AF37]"
          >
            Special Offers & Events
          </button>
          <button
            onClick={() => scrollTo('scene-order')}
            className="block w-full text-left py-2 text-neutral-300 hover:text-[#D4AF37]"
          >
            Digital Catalog & Ordering
          </button>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setDiagnosticOpen(true);
              }}
              className="text-amber-400 text-[11px]"
            >
              Demo Mode Diagnostics
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setDownloadModalOpen(true);
              }}
              className="text-[#D4AF37] text-[11px]"
            >
              Get Android App
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
