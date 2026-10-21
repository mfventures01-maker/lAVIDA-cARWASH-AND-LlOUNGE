import React from 'react';
import { Car } from 'lucide-react';

export function Scene2Wash({ services, currencySymbol }: { services: any[], currencySymbol: string }) {
  return (
    <section id="scene-wash" className="py-24 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#D4AF37] tracking-widest uppercase mb-3">
            <Car className="w-4 h-4" />
            <span>Scene 02 · The Wash</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-white uppercase">
            Detailing Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service: any) => (
            <div key={service.service_id} className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all">
              <div className="aspect-video bg-[#0A0A0A] relative">
                {service.media_url ? (
                  <img src={service.media_url} alt={service.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono text-xs uppercase">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-white mb-2">{service.name}</h3>
                <p className="text-sm text-neutral-400 mb-4">{service.description || 'Standard service.'}</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-[#D4AF37] font-bold text-lg">{currencySymbol}{service.price?.toLocaleString()}</span>
                  <span className="text-xs text-neutral-500 font-mono">{service.duration_minutes} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}