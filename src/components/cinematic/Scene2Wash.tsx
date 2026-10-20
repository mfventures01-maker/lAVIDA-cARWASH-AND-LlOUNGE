import React from 'react';
import { CarwashServiceData } from '../../types/lavida';
import { useCartStore } from '../../store/useCartStore';
import { Droplets, Clock, Plus, Sparkles, Database, RefreshCw } from 'lucide-react';

interface Scene2WashProps {
  services: CarwashServiceData[];
  currencySymbol?: string;
  onRefresh?: () => void;
}

export const Scene2Wash: React.FC<Scene2WashProps> = ({
  services,
  currencySymbol = '',
  onRefresh,
}) => {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddWash = (service: CarwashServiceData) => {
    addItem({
      item_id: service.service_id,
      name: service.name,
      price: service.price,
      item_type: 'carwash',
    });
  };

  return (
    <section
      id="scene-wash"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#0EA5E9]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#38BDF8] tracking-widest uppercase mb-3">
          <Droplets className="w-4 h-4" />
          <span>Scene 02 · Pure Automotive Hydration</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#F5F0E7] uppercase mb-4">
          The Precision Wash Sanctuary
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Triple-stage snow foam, pressurized reverse-osmosis underbody jets, and swirl-free microfibre detailing executed in our dedicated temperature-controlled wash bays.
        </p>
      </div>

      {/* Automotive Detailing Grid or Zero-Fallback SSOT Status */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const hasMedia = Boolean(service.media_url && service.media_url.trim() !== '');

            return (
              <div
                key={service.service_id}
                className="relative rounded-2xl overflow-hidden bg-[#111111] border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
              >
                {/* Media Banner or Obsidian Typographic Fallback Card */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050505] flex items-center justify-center">
                  {hasMedia ? (
                    <img
                      src={service.media_url}
                      alt={service.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full p-6 flex flex-col justify-between items-center text-center bg-[#050505]">
                      <div className="w-full flex justify-between items-center text-[10px] font-mono uppercase text-neutral-500">
                        <span>{service.vehicle_category}</span>
                        <Sparkles className="w-4 h-4 text-[#D4AF37] opacity-60" />
                      </div>
                      <h4 className="font-serif text-lg font-black text-[#D6A64B] uppercase tracking-wider my-auto">
                        {service.name}
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-500">
                        Sanctuary Specification
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest bg-black/80 text-[#38BDF8] px-2.5 py-0.5 rounded-full border border-white/10">
                      {service.vehicle_category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#F5F0E7] mb-2">
                      {service.name}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                        SSOT Bay Rate
                      </span>
                      <span className="font-serif font-bold text-xl text-[#D4AF37]">
                        {currencySymbol}{service.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddWash(service)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-[#D4AF37]/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Book Bay</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Zero-Fallback SSOT Waiting Card */
        <div className="p-10 rounded-3xl bg-[#0D0D0D] border border-amber-500/30 text-center max-w-2xl mx-auto shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
            Absolute SSOT: Detailing Services Awaiting Google Sheets Sync
          </h3>
          <p className="text-xs font-mono text-neutral-400 leading-relaxed max-w-lg mx-auto">
            Zero mock carwash tiers or prices are loaded. Bay packages will render dynamically once synchronized from the Google Sheets <code className="text-amber-300">CarWashServices</code> tab via the Google Apps Script Web App.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className="text-[10px] font-mono text-neutral-500 bg-black/60 px-3 py-1 rounded-full border border-white/10">
              ?action=carwash
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
