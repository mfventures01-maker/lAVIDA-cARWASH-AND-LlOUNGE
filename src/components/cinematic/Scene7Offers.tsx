import React from 'react';
import { CarouselFeedItem } from '../../types/lavida';
import { ThreeDCarousel } from '../ThreeDCarousel';
import { Sparkles, ArrowRight, ShieldAlert, Database, RefreshCw } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

interface Scene7OffersProps {
  carouselItems: CarouselFeedItem[];
  currencySymbol?: string;
  onExploreMenu?: () => void;
  onRefresh?: () => void;
}

export const Scene7Offers: React.FC<Scene7OffersProps> = ({
  carouselItems,
  currencySymbol = '',
  onExploreMenu,
  onRefresh,
}) => {
  const addItem = useCartStore((s) => s.addItem);

  // Dedicated feature card for Bikini Carwash from the carousel feed if available
  const bikiniEvent = carouselItems.find((i) => i.item_id === 'lav-event-bikini') || (carouselItems.length > 0 ? carouselItems[0] : null);

  return (
    <section
      id="scene-offers"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#D4AF37] tracking-widest uppercase mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Scene 07 · Verified Packages & Showcase Events</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#F5F0E7] uppercase mb-4">
          Curated Showcase & Experiences
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Exclusive experiences, monthly automotive showcases, and paired tasting bundles. Prices and availability validated against venue records.
        </p>
      </div>

      {/* Featured Showcase Card: Last Saturday Bikini Car Wash (Only when provided by backend) */}
      {bikiniEvent && (
        <div className="mb-16 p-8 sm:p-10 rounded-3xl bg-[#0F0F0F] border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#7E1020]/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-[#D4AF37] text-black font-extrabold px-3 py-1 rounded-full shadow-lg">
                  {bikiniEvent.category_name}
                </span>
                <span className="text-[10px] font-mono text-amber-300 bg-black/60 px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Tasteful Hospitality Event</span>
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-serif font-black text-white uppercase">
                {bikiniEvent.title}
              </h3>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                {bikiniEvent.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 pt-2">
                {bikiniEvent.schedule_text && (
                  <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-[#F5F0E7]">
                    {bikiniEvent.schedule_text}
                  </span>
                )}
                {bikiniEvent.price !== undefined && bikiniEvent.price > 0 && (
                  <span className="text-[#D4AF37] font-bold text-sm">
                    {currencySymbol}{bikiniEvent.price.toLocaleString()} ({bikiniEvent.price_unit || 'Pass'})
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
              <button
                onClick={() =>
                  addItem({
                    item_id: bikiniEvent.item_id || bikiniEvent.id,
                    name: bikiniEvent.title,
                    price: bikiniEvent.price || 0,
                    item_type: 'experience',
                  })
                }
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/25"
              >
                <span>Reserve Showcase Bay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onExploreMenu && (
                <button
                  onClick={onExploreMenu}
                  className="px-6 py-3.5 rounded-2xl bg-[#1C1C1C] text-neutral-300 hover:text-white border border-white/10 text-xs font-mono uppercase tracking-wider hover:bg-[#252525] transition-all text-center"
                >
                  Explore Full Menu
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3D Mixed Media Carousel with Live Feed or Zero-Fallback State */}
      {carouselItems.length > 0 ? (
        <ThreeDCarousel
          items={carouselItems}
          currencySymbol={currencySymbol}
        />
      ) : (
        /* Zero-Fallback SSOT Waiting Card */
        <div className="p-10 rounded-3xl bg-[#0D0D0D] border border-amber-500/30 text-center max-w-2xl mx-auto shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
            Absolute SSOT: 3D Carousel Feed Awaiting Google Sheets Sync
          </h3>
          <p className="text-xs font-mono text-neutral-400 leading-relaxed max-w-lg mx-auto">
            Zero mock showcase items, prices, or artificial media are loaded. Verified promotions and mixed media cards will render dynamically when synchronized from the Google Sheets <code className="text-amber-300">CarouselFeed</code> tab via Google Apps Script.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className="text-[10px] font-mono text-neutral-500 bg-black/60 px-3 py-1 rounded-full border border-white/10">
              ?action=carousel
            </span>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="text-[11px] font-mono text-amber-400 hover:text-white flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry Sync</span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
