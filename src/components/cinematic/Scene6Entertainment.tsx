import React from 'react';
import { Trophy } from 'lucide-react';

export function Scene6Entertainment({ carousel }: { carousel: any[] }) {
  // Filter strictly for the Snooker offer from the carousel feed
  const snookerOffers = carousel?.filter(o => o.type === 'offer' && o.item_id === 'lav-offer-snooker-game') || [];

  return (
    <section className="py-24 bg-[#0A0A0A] text-white relative flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-serif font-light tracking-wide text-white mb-6 uppercase">
            Lounge & <span className="text-[#D4AF37] italic">Entertainment</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            Competition-grade tables, private lounge seating, and high-energy sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {snookerOffers.length > 0 ? (
            snookerOffers.map((offer: any) => (
              <div 
                key={offer.id}
                className="bg-[#121212] border border-white/10 rounded-2xl p-8 flex flex-col justify-between transition-transform hover:-translate-y-2 duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6">
                    <Trophy className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-2xl font-serif text-white mb-4">{offer.title}</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    {offer.description || 'Experience the best of LaVida.'}
                  </p>
                  
                  <div className="border-t border-white/10 pt-6 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-widest">Rate</span>
                      <span className="text-[#D4AF37] font-serif text-xl">
                        ₦{offer.price ? offer.price.toLocaleString() : 'Inquire'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 uppercase tracking-widest">Unit</span>
                      <span className="text-xs text-white text-right max-w-[150px]">
                        {offer.price_unit || 'per game'}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 mt-4 border border-[#D4AF37] text-[#D4AF37] uppercase tracking-widest text-sm hover:bg-[#D4AF37] hover:text-black transition-colors rounded">
                  Reserve / Inquire
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No entertainment offers currently available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}