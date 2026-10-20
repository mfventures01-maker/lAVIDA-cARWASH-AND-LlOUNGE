import React from 'react';
import { CatalogItemData } from '../../types/lavida';
import { useCartStore } from '../../store/useCartStore';
import { Wine, Plus, Sparkles, AlertCircle, Database, RefreshCw } from 'lucide-react';

interface Scene5LoungeProps {
  items: CatalogItemData[];
  currencySymbol?: string;
  onRefresh?: () => void;
}

export const Scene5Lounge: React.FC<Scene5LoungeProps> = ({
  items,
  currencySymbol = '',
  onRefresh,
}) => {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddDrink = (item: CatalogItemData) => {
    addItem({
      item_id: item.item_id,
      name: item.name,
      price: item.price,
      item_type: 'menu_item',
    });
  };

  return (
    <section
      id="scene-lounge"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#D4AF37] tracking-widest uppercase mb-3">
          <Wine className="w-4 h-4" />
          <span>Scene 05 · The Amber Vault & Mocktail Bar</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#F5F0E7] uppercase mb-4">
          Aged Spirits & Artisanal Elixirs
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          From the peerless depths of Speyside single malts to handcrafted botanical Chapman and fresh tropical infusions.
        </p>

        {/* Responsible Service Notice */}
        <div className="mt-4 inline-flex items-center gap-2 text-xs text-neutral-400 font-mono bg-neutral-900/60 px-4 py-1.5 rounded-full border border-white/5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          <span>Age 18+ for alcoholic bottle service · Non-alcoholic mocktails served all hours</span>
        </div>
      </div>

      {/* Drink Cards or Zero-Fallback SSOT Status */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 4).map((drink) => {
            const hasMedia = Boolean(drink.media_url && drink.media_url.trim() !== '');

            return (
              <div
                key={drink.item_id}
                className="group relative rounded-2xl overflow-hidden bg-[#111111] border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                {/* Media cover or Obsidian Typographic Fallback Card */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#050505] flex items-center justify-center">
                  {hasMedia ? (
                    <img
                      src={drink.media_url}
                      alt={drink.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full p-5 flex flex-col justify-between items-center text-center bg-[#050505]">
                      <div className="w-full flex justify-between items-center text-[9px] font-mono uppercase text-neutral-500">
                        <span>{drink.category_id}</span>
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] opacity-60" />
                      </div>
                      <h4 className="font-serif text-base font-black text-[#D6A64B] uppercase tracking-wider my-auto">
                        {drink.name}
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-500">
                        Cellar Selection
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <span className="text-[9px] font-mono tracking-widest uppercase bg-black/80 text-[#D4AF37] px-2.5 py-0.5 rounded-full border border-white/10">
                      Spirits & Vault
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#F5F0E7] group-hover:text-[#D4AF37] transition-colors line-clamp-1 mb-1.5">
                      {drink.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                      {drink.description}
                    </p>
                  </div>

                  {/* Price & Add */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
                        SSOT Price
                      </span>
                      <span className="font-serif font-bold text-base text-[#D4AF37]">
                        {currencySymbol}{drink.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddDrink(drink)}
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
            Absolute SSOT: Drinks Vault Awaiting Google Sheets Sync
          </h3>
          <p className="text-xs font-mono text-neutral-400 leading-relaxed max-w-lg mx-auto">
            Zero mock whiskey or mock drinks are loaded. Items will populate directly when synchronized from the Google Sheets <code className="text-amber-300">MenuItems</code> tab (domain: <code className="text-amber-300">drinks</code>) via Google Apps Script.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className="text-[10px] font-mono text-neutral-500 bg-black/60 px-3 py-1 rounded-full border border-white/10">
              ?action=catalog&domain=drinks
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
