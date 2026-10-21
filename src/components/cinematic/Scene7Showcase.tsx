import React from 'react';
import { Play } from 'lucide-react';

export function Scene7Showcase({ carousel }: { carousel: any[] }) {
  // Filter strictly for the Bikini Car Wash and Karaoke Offers (excluding the Snooker game)
  const showcaseItems = carousel?.filter(item => 
    item.type === 'offer' && 
    item.item_id !== 'lav-offer-snooker-game'
  ) || [];

  // Helper to extract YouTube ID safely
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <section id="scene-showcase" className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#D4AF37] tracking-widest uppercase mb-3">
          <span>Scene 07 · Verified Packages & Showcase Events</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#F5F0E7] uppercase mb-4">
          Curated Showcase & Experiences
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Exclusive experiences, monthly automotive showcases, and paired tasting bundles. Prices and availability validated against venue records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {showcaseItems.map((item, index) => {
          const isVideo = item.media_type === 'video';
          const ytId = isVideo ? getYouTubeId(item.media_url) : null;
          
          return (
            <div 
              key={item.id} 
              className={`group relative rounded-3xl overflow-hidden bg-[#111111] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500 ${
                index === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <div className={`relative w-full ${index === 0 ? 'aspect-[21/9]' : 'aspect-video'} bg-black`}>
                {isVideo && ytId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}&controls=1&modestbranding=1`}
                    title={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : isVideo && !ytId ? (
                  <div className="flex items-center justify-center w-full h-full text-red-500 font-mono text-xs p-6 text-center">
                    Invalid Video URL in CarouselFeed.
                  </div>
                ) : item.media_url ? (
                  <img 
                    src={item.media_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full p-6 flex flex-col justify-between items-center text-center bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase">{item.category_name}</span>
                    <h4 className="font-serif text-lg text-[#D4AF37] uppercase tracking-wider">{item.title}</h4>
                    <span className="text-[10px] font-mono text-neutral-600">LaVida Original</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-90 pointer-events-none"></div>

                {isVideo && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 pointer-events-none">
                    <Play className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                    <span className="text-[10px] font-mono text-white uppercase tracking-wider">Promo Video</span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase mb-2">
                      {item.category_name || 'Showcase'}
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-serif text-white font-bold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-300 max-w-xl line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-start sm:items-end gap-2 pointer-events-auto">
                    {item.price ? (
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase block">Price</span>
                        <span className="text-2xl font-serif font-black text-[#D4AF37]">
                          ₦{item.price.toLocaleString()}
                        </span>
                      </div>
                    ) : null}
                    
                    <button className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all z-20">
                      Reserve / Inquire
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {showcaseItems.length === 0 && (
          <div className="col-span-full text-center text-neutral-500 py-12">
            No showcase media available at this time.
          </div>
        )}
      </div>
    </section>
  );
}