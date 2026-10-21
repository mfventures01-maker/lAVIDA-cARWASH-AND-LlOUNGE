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
  currencySymbol = '₦',
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'drinks' | 'carwash'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem, items: cartItems, selectedTable, setSelectedTable, setCartOpen } = useCartStore();

  const tableOptions = [
    'Takeaway / Pickup',
    'Table 04 (Lounge Booth)',
    'Detailing Bay A (Royale)',
  ];

  // Unified items list
  const allItems = useMemo(() => {
    const list: any[] = [];
    foodItems.forEach((f) => list.push({ ...f, item_type: 'menu_item', domain: 'food' }));
    drinkItems.forEach((d) => list.push({ ...d, item_type: 'menu_item', domain: 'drinks' }));
    carwashServices.forEach((c) => list.push({ 
      ...c, 
      item_id: c.service_id, 
      name: c.name, 
      item_type: 'carwash', 
      domain: 'carwash',
      category_id: c.vehicle_category 
    }));
    return list;
  }, [foodItems, drinkItems, carwashServices]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesTab = activeTab === 'all' || item.domain === activeTab;
      const matchesQuery = searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [allItems, activeTab, searchQuery]);

  // Group filtered items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredItems.forEach(item => {
      const cat = item.category_id || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [filteredItems]);

  const getQuantityInCart = (itemId: string) => {
    const item = cartItems.find((i) => i.item_id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <section id="scene-order" className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#D4AF37] tracking-widest uppercase mb-3">
          <ShoppingBag className="w-4 h-4" /> <span>Scene 08 · Unified Digital Menu</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#F5F0E7] uppercase mb-4">
          Curated Ordering Desk
        </h2>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-amber-500/30 text-[11px] font-mono text-amber-300">
          <ShieldCheck className="w-3.5 h-3.5" /> <span>ABSOLUTE SSOT MODE</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'All', icon: null },
            { id: 'food', label: 'Grills', icon: Utensils },
            { id: 'drinks', label: 'Drinks', icon: Wine },
            { id: 'carwash', label: 'Carwash', icon: Car },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all ${
                activeTab === tab.id ? 'bg-[#D4AF37] text-black font-bold' : 'bg-[#141414] text-neutral-400 border border-white/5 hover:bg-[#1E1E1E]'
              }`}
            >
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />} <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-white text-xs focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Grouped Catalog List */}
      <div className="space-y-16">
        {Object.entries(groupedItems).map(([categoryName, items]) => (
          <div key={categoryName}>
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-2xl font-serif text-white capitalize">{categoryName.replace(/-/g, ' ')}</h3>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => {
                const inCartCount = getQuantityInCart(item.item_id);
                const hasMedia = Boolean(item.media_url && item.media_url.trim() !== '');

                return (
                  <div key={item.item_id} className="group rounded-2xl bg-[#111111] border border-white/10 hover:border-[#D4AF37]/50 flex flex-col justify-between overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
                    
                    {/* Media or Typographic Fallback */}
                    <div className="relative aspect-square w-full bg-[#0A0A0A] flex items-center justify-center">
                      {hasMedia ? (
                        item.media_type === 'video' ? (
                          <video src={item.media_url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                          <img src={item.media_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        )
                      ) : (
                        <div className="w-full h-full p-6 flex flex-col justify-between items-center text-center bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase">{item.category_id}</span>
                          <h4 className="font-serif text-lg text-[#D4AF37] uppercase tracking-wider">{item.name}</h4>
                          <span className="text-[10px] font-mono text-neutral-600">LaVida Original</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-serif text-lg font-bold text-white mb-1 truncate">{item.name}</h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 mb-4">{item.description || 'Authentic LaVida selection.'}</p>
                      
                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="font-serif font-bold text-lg text-[#D4AF37]">
                          {currencySymbol}{item.price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => addItem({ item_id: item.item_id, name: item.name, price: item.price, item_type: item.item_type })}
                          className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add {inCartCount > 0 && `(${inCartCount})`}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-md w-full px-4">
          <button onClick={() => setCartOpen(true)} className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-bold flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black text-[#D4AF37] flex items-center justify-center text-xs">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </div>
              <span className="text-sm uppercase tracking-wider">Review Order</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono uppercase block text-black/70">Est. Total</span>
              <span className="text-base font-serif font-black">{currencySymbol}{cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString()}</span>
            </div>
          </button>
        </div>
      )}
    </section>
  );
};