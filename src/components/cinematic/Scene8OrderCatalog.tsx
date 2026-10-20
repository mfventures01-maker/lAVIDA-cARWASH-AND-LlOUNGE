import React, { useState, useMemo } from 'react';
import { CatalogItemData, CarwashServiceData } from '../../types/lavida';
import { useCartStore } from '../../store/useCartStore';
import { Search, Plus, ShoppingBag, Utensils, Wine, Car, MapPin, Sparkles, Database, RefreshCw, ShieldCheck } from 'lucide-react';

interface Scene8OrderCatalogProps {
  foodItems: CatalogItemData[];
  drinkItems: CatalogItemData[];
  carwashServices: CarwashServiceData[];
  currencySymbol?: string;
  onRefresh?: () => void;
}

export const Scene8OrderCatalog: React.FC<Scene8OrderCatalogProps> = ({
  foodItems,
  drinkItems,
  carwashServices,
  currencySymbol = '',
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'drinks' | 'carwash'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem, items: cartItems, selectedTable, setSelectedTable, setCartOpen } = useCartStore();

  const tableOptions = [
    'Takeaway / Pickup',
    'Table 01 (Lounge VIP)',
    'Table 02 (Lounge)',
    'Table 03 (Poolside)',
    'Table 04 (Lounge Booth)',
    'Table 05 (Garden Patio)',
    'Detailing Bay A (Royale)',
    'Detailing Bay B (Executive)',
  ];

  // Unified items list for catalog filtering
  const allItems = useMemo(() => {
    const list: Array<{
      item_id: string;
      item_type: string;
      name: string;
      category_id: string;
      domain: string;
      description: string;
      price: number;
      media_url?: string;
      media_type?: string;
    }> = [];

    foodItems.forEach((f) =>
      list.push({
        item_id: f.item_id,
        item_type: 'menu_item',
        name: f.name,
        category_id: f.category_id,
        domain: 'food',
        description: f.description,
        price: f.price,
        media_url: f.media_url,
        media_type: f.media_type,
      })
    );

    drinkItems.forEach((d) =>
      list.push({
        item_id: d.item_id,
        item_type: 'menu_item',
        name: d.name,
        category_id: d.category_id,
        domain: 'drinks',
        description: d.description,
        price: d.price,
        media_url: d.media_url,
        media_type: d.media_type,
      })
    );

    carwashServices.forEach((c) =>
      list.push({
        item_id: c.service_id,
        item_type: 'carwash',
        name: c.name,
        category_id: c.vehicle_category,
        domain: 'carwash',
        description: c.description,
        price: c.price,
        media_url: c.media_url,
        media_type: c.media_type,
      })
    );

    return list;
  }, [foodItems, drinkItems, carwashServices]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesTab = activeTab === 'all' || item.domain === activeTab;
      const matchesQuery =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category_id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [allItems, activeTab, searchQuery]);

  const getQuantityInCart = (itemId: string) => {
    const item = cartItems.find((i) => i.item_id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <section
      id="scene-order"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#D4AF37] tracking-widest uppercase mb-3">
          <ShoppingBag className="w-4 h-4" />
          <span>Scene 08 · Unified Digital Menu & Ordering</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#F5F0E7] uppercase mb-4">
          Curated Ordering Desk
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Select detailing packages, kitchen specialties, and cellar selections. Orders are synchronized directly with venue staff records.
        </p>

        {/* Absolute SSOT Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-amber-500/30 text-[11px] font-mono text-amber-300">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>ABSOLUTE APPS SCRIPT SSOT · 0 LOCAL FALLBACK PRICES</span>
        </div>
      </div>

      {/* Table Context Selector Banner */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#121212] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Active Dining & Service Location
            </div>
            <div className="text-base font-serif font-bold text-white">
              {selectedTable}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="table-select" className="text-xs font-mono text-neutral-400 shrink-0">
            Switch:
          </label>
          <select
            id="table-select"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#1C1C1C] border border-white/10 text-white text-xs font-medium focus:border-[#D4AF37] focus:outline-none"
          >
            {tableOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Controls: Domain Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none max-w-full w-full md:w-auto">
          {[
            { id: 'all', label: 'All Catalog', icon: null },
            { id: 'food', label: 'Grills & Delicacies', icon: Utensils },
            { id: 'drinks', label: 'Whiskey & Drinks', icon: Wine },
            { id: 'carwash', label: 'Carwash Bays', icon: Car },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md shadow-[#D4AF37]/20'
                    : 'bg-[#141414] text-neutral-400 hover:text-white hover:bg-[#1E1E1E] border border-white/5'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog items..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-white placeholder-neutral-500 text-xs focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      {/* Catalog Grid or Absolute SSOT Awaiting Sync Card */}
      {allItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const inCartCount = getQuantityInCart(item.item_id);
            const hasMedia = Boolean(item.media_url && item.media_url.trim() !== '');

            return (
              <div
                key={item.item_id}
                className="group rounded-2xl overflow-hidden bg-[#111111] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                {/* Image Banner or Obsidian Typographic Fallback */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050505] flex items-center justify-center">
                  {hasMedia ? (
                    <img
                      src={item.media_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    /* Obsidian Typographic Fallback Card */
                    <div className="w-full h-full p-5 flex flex-col justify-between items-center text-center bg-[#050505] relative overflow-hidden">
                      <div className="w-full flex justify-between items-center text-[9px] font-mono uppercase text-neutral-500">
                        <span>{item.category_id}</span>
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] opacity-60" />
                      </div>
                      <h4 className="font-serif text-base font-black text-[#D6A64B] uppercase tracking-wider line-clamp-2 my-auto">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-500">
                        LaVida Authentic Item
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <span className="text-[9px] font-mono tracking-widest uppercase bg-black/80 text-[#D4AF37] px-2.5 py-0.5 rounded-full border border-white/10">
                      {item.domain}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#F5F0E7] group-hover:text-[#D4AF37] transition-colors line-clamp-1 mb-1.5">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Price and Add Button */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
                        Backend Price
                      </span>
                      <span className="font-serif font-bold text-base text-[#D4AF37]">
                        {currencySymbol}{item.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        addItem({
                          item_id: item.item_id,
                          name: item.name,
                          price: item.price,
                          item_type: item.item_type,
                        })
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-[#D4AF37]/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                      {inCartCount > 0 && (
                        <span className="ml-1 w-4 h-4 rounded-full bg-black text-[#D4AF37] text-[10px] flex items-center justify-center font-bold">
                          {inCartCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="col-span-full py-16 text-center text-neutral-500 font-mono text-xs">
              No items found matching "{searchQuery}".
            </div>
          )}
        </div>
      ) : (
        /* Absolute SSOT Zero Fallback Status Card */
        <div className="p-12 rounded-3xl bg-[#0D0D0D] border border-amber-500/30 text-center max-w-2xl mx-auto shadow-2xl space-y-5">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400">
            <Database className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">
            Absolute SSOT: 0 Fallback Mode
          </h3>
          <p className="text-xs font-mono text-neutral-300 leading-relaxed max-w-lg mx-auto">
            All hardcoded food, drinks, car wash items, and prices have been purged in strict compliance with the Absolute SSOT mandate. The application renders data exclusively from the Google Apps Script Web App.
          </p>
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-left font-mono text-[11px] space-y-2 text-neutral-400">
            <div>
              <span className="text-amber-400 font-bold block">Authority Gateway:</span>
              <span className="break-all text-neutral-300">
                https://script.google.com/macros/s/AKfycbyzgGSIW8Bs5cQkwUXEuAl8uRSBbpfbK0U_gmUlStruNnu6D1S9djrpT7PyKgEwAnvW/exec
              </span>
            </div>
            <div>
              <span className="text-amber-400 font-bold block">Google Sheets SSOT:</span>
              <span className="text-neutral-300">Workbook ID: 1xNPCHr22t7CjLW5SKLOyQdhS7qasEgM0El2cZxRmwus</span>
            </div>
            <div className="pt-2 text-neutral-400 text-[10px] leading-relaxed border-t border-white/5">
              Tip: If Apps Script redirects to Google Sign-In, ensure the deployment in Google Apps Script is configured with <span className="text-amber-300">Execute as: Me</span> and <span className="text-amber-300">Who has access: Anyone</span>.
            </div>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all inline-flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry SSOT Sync</span>
            </button>
          )}
        </div>
      )}

      {/* Floating Cart Trigger Bar when cart has items */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-md w-full px-4">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-bold flex items-center justify-between shadow-2xl shadow-black/80 hover:brightness-105 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black text-[#D4AF37] flex items-center justify-center text-xs font-black">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </div>
              <span className="text-sm uppercase tracking-wider">Review Order Cart</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono uppercase block text-black/70">Estimated Total</span>
              <span className="text-base font-serif font-black">
                {currencySymbol}{cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString()}
              </span>
            </div>
          </button>
        </div>
      )}
    </section>
  );
};
