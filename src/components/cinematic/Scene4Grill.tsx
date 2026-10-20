import React from 'react';
import { CatalogItemData } from '../../types/lavida';
import { useCartStore } from '../../store/useCartStore';
import { Flame, Plus, Sparkles, Database, RefreshCw } from 'lucide-react';

interface Scene4GrillProps {
  items: CatalogItemData[];
  currencySymbol?: string;
  onRefresh?: () => void;
}

export const Scene4Grill: React.FC<Scene4GrillProps> = ({
  items,
  currencySymbol = '',
  onRefresh,
}) => {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddFood = (item: CatalogItemData) => {
    addItem({
      item_id: item.item_id,
      name: item.name,
      price: item.price,
      item_type: 'menu_item',
    });
  };

  return (
    <section
      id="scene-grill"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#D4AF37] tracking-widest uppercase mb-3">
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Scene 04 · Live Charcoal & Hickory Grills</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#F5F0E7] uppercase mb-4">
          The Charcoal Kitchen & Delicacies
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Open-flame craftsmanship infused with indigenous West African seasonings, tender cuts slow-charred to order, and generous sharing platters.
        </p>
      </div>

      {/* Food Cards Grid or Zero-Fallback SSOT Status */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 4).map((food) => {
            const hasMedia = Boolean(food.media_url && food.media_url.trim() !== '');

            return (
              <div
                key={food.item_id}
                className="group relative rounded-2xl overflow-hidden bg-[#111111] border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                {/* Media cover or Obsidian Typographic Fallback Card */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#050505] flex items-center justify-center">
                  {hasMedia ? (
                    <img
                      src={food.media_url}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full p-5 flex flex-col justify-between items-center text-center bg-[#050505]">
                      <div className="w-full flex justify-between items-center text-[9px] font-mono uppercase text-neutral-500">
                        <span>{food.category_id}</span>
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] opacity-60" />
                      </div>
                      <h4 className="font-serif text-base font-black text-[#D6A64B] uppercase tracking-wider my-auto">
                        {food.name}
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-500">
                        Kitchen Craft
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <span className="text-[9px] font-mono tracking-widest uppercase bg-black/80 text-[#D4AF37] px-2.5 py-0.5 rounded-full border border-white/10">
                      Food & Grill
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#F5F0E7] group-hover:text-[#D4AF37] transition-colors line-clamp-1 mb-1.5">
                      {food.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                      {food.description}
                    </p>
                  </div>

                  {/* Price & Add */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
                        SSOT Price
                      </span>
                      <span className="font-serif font-bold text-base text-[#D4AF37]">
                        {currencySymbol}{food.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddFood(food)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-[#D4AF37]/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
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
            Absolute SSOT: Food Catalog Awaiting Google Sheets Sync
          </h3>
          <p className="text-xs font-mono text-neutral-400 leading-relaxed max-w-lg mx-auto">
            Zero mock food items or artificial prices are loaded. Food items will render dynamically once synchronized from the Google Sheets <code className="text-amber-300">MenuItems</code> tab (domain: <code className="text-amber-300">food</code>) via the Google Apps Script Web App.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className="text-[10px] font-mono text-neutral-500 bg-black/60 px-3 py-1 rounded-full border border-white/10">
              ?action=catalog&domain=food
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
