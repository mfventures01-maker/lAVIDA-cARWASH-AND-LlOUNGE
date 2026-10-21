import React from 'react';
import { Wine } from 'lucide-react';

export function Scene5Lounge({ items, currencySymbol }: { items: any[], currencySymbol: string }) {
  return (
    <section id="scene-lounge" className="py-24 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#D4AF37] tracking-widest uppercase mb-3">
            <Wine className="w-4 h-4" />
            <span>Scene 05 · Whiskey Vault</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-white uppercase">
            Drinks & Spirits
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items?.slice(0, 8).map((item: any) => (
            <div key={item.item_id} className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
              <div className="aspect-square bg-[#0A0A0A] relative">
                {item.media_url ? (
                  <img src={item.media_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono text-[10px] uppercase text-center p-2">
                    {item.name}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-white truncate">{item.name}</h3>
                <span className="text-[#D4AF37] font-bold text-sm">{currencySymbol}{item.price?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}