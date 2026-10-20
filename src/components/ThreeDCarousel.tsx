import React, { useState, useRef } from 'react';
import { CarouselFeedItem } from '../types/lavida';
import { useCartStore } from '../store/useCartStore';
import { ChevronLeft, ChevronRight, Plus, Sparkles, ArrowRight, X, Clock, Play } from 'lucide-react';

interface ThreeDCarouselProps {
  items: CarouselFeedItem[];
  currencySymbol?: string;
}

export const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({
  items,
  currencySymbol = '₦',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<CarouselFeedItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  // Extract distinct category names from backend feed
  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category_name).filter(Boolean)))];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((i) => i.category_name === selectedCategory);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleCardClick = (item: CarouselFeedItem) => {
    setActiveItem(item);
  };

  const handleAddToCart = (e: React.MouseEvent, item: CarouselFeedItem) => {
    e.stopPropagation();
    addItem({
      item_id: item.item_id || item.id,
      name: item.title,
      price: item.price || 0,
      item_type: item.type || 'menu_item',
    });
  };

  return (
    <div className="relative w-full py-8">
      {/* Category Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 px-4 sm:px-8 mb-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#D4AF37] text-black font-bold shadow-md shadow-[#D4AF37]/20'
                  : 'bg-[#181818] text-neutral-400 hover:text-white hover:bg-[#222] border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-full bg-[#181818] hover:bg-[#252525] text-neutral-300 hover:text-white border border-white/10 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-full bg-[#181818] hover:bg-[#252525] text-neutral-300 hover:text-white border border-white/10 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-6 overflow-x-auto px-4 sm:px-8 pb-8 pt-2 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        {filteredItems.map((item) => (
          <CarouselCard
            key={item.id}
            item={item}
            currencySymbol={currencySymbol}
            onClick={() => handleCardClick(item)}
            onAddToCart={(e) => handleAddToCart(e, item)}
          />
        ))}

        {filteredItems.length === 0 && (
          <div className="w-full py-16 text-center text-neutral-500 font-mono text-xs">
            No items in this category currently.
          </div>
        )}
      </div>

      {/* Item Lightbox Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-xl bg-[#0F0F0F] border border-[#D4AF37]/40 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Media Showcase */}
            <div className="aspect-video w-full bg-[#050505] relative overflow-hidden flex items-center justify-center">
              {activeItem.media_type === 'video' && activeItem.media_url ? (
                <video
                  src={activeItem.media_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : activeItem.media_type === 'image' && activeItem.media_url ? (
                <img
                  src={activeItem.media_url}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Obsidian Typographic Fallback */
                <div className="w-full h-full p-8 flex flex-col justify-center items-center text-center bg-[#050505] border border-white/5">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] mb-2">
                    {activeItem.category_name}
                  </span>
                  <h3 className="font-serif text-2xl font-black text-[#D6A64B] uppercase tracking-wide">
                    {activeItem.title}
                  </h3>
                  {activeItem.schedule_text && (
                    <span className="text-xs text-neutral-400 font-mono mt-2">
                      {activeItem.schedule_text}
                    </span>
                  )}
                </div>
              )}

              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-black/80 text-[#D4AF37] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                  {activeItem.category_name}
                </span>
              </div>
            </div>

            {/* Modal Details */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-serif text-[#F5F0E7] font-bold mb-2">
                  {activeItem.title}
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              {activeItem.schedule_text && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-[#D4AF37]">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{activeItem.schedule_text}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                    Authoritative Rate
                  </span>
                  <span className="font-serif font-bold text-xl text-[#D4AF37]">
                    {activeItem.price !== undefined && activeItem.price > 0
                      ? `${currencySymbol}${activeItem.price.toLocaleString()} ${activeItem.price_unit ? `(${activeItem.price_unit})` : ''}`
                      : 'Included in Venue Experience'}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    handleAddToCart(e, activeItem);
                    setActiveItem(null);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Order Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface CarouselCardProps {
  item: CarouselFeedItem;
  currencySymbol: string;
  onClick: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
}

const CarouselCard: React.FC<CarouselCardProps> = ({
  item,
  currencySymbol,
  onClick,
  onAddToCart,
}) => {
  const [mediaError, setMediaError] = useState(false);
  const [transformStyle, setTransformStyle] = useState('');

  const hasMediaUrl = Boolean(item.media_url && item.media_url.trim() !== '' && !mediaError);
  const isVideo = item.media_type === 'video';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / (rect.height / 2)) * -5;
    const tiltY = (x / (rect.width / 2)) * 5;
    setTransformStyle(`perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle, transition: 'transform 0.15s ease-out' }}
      className="relative shrink-0 w-[290px] sm:w-[340px] rounded-2xl overflow-hidden cursor-pointer group bg-[#111111] border border-white/10 hover:border-[#D4AF37]/50 shadow-xl transition-all duration-300 snap-start select-none flex flex-col justify-between"
    >
      {/* Media Canvas with Strict Inspection */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#050505]">
        {hasMediaUrl ? (
          isVideo ? (
            /* Video Media Player */
            <div className="relative w-full h-full">
              <video
                src={item.media_url}
                autoPlay
                muted
                loop
                playsInline
                onError={() => setMediaError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/60 text-[#D4AF37] pointer-events-none">
                <Play className="w-3 h-3 fill-current" />
              </div>
            </div>
          ) : (
            /* Image Media */
            <img
              src={item.media_url}
              alt={item.title}
              onError={() => setMediaError(true)}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
            />
          )
        ) : (
          /* Obsidian Typographic Fallback Card (Solid Dark Background, Gold Text, Item Title) */
          <div className="w-full h-full p-6 flex flex-col justify-between items-center text-center bg-[#050505] border-b border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,166,75,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 w-full flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
              <span>{item.category_name}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] opacity-60" />
            </div>

            <div className="relative z-10 my-auto py-3">
              <h4 className="font-serif text-lg font-black text-[#D6A64B] uppercase tracking-wider line-clamp-2 leading-snug">
                {item.title}
              </h4>
              {item.schedule_text && (
                <span className="text-[11px] font-mono text-neutral-400 block mt-2">
                  {item.schedule_text}
                </span>
              )}
            </div>

            <div className="relative z-10 w-full pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span>LaVida Curated Item</span>
              <span className="text-[#D4AF37]">Inspect Details</span>
            </div>
          </div>
        )}

        {/* Category Pill Tag on active media */}
        {hasMediaUrl && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest bg-black/80 text-[#D4AF37] px-2.5 py-0.5 rounded-full border border-white/10">
              {item.category_name}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Card Metadata & Add Action */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-serif text-lg font-bold text-[#F5F0E7] group-hover:text-[#D4AF37] transition-colors line-clamp-1 mb-1.5">
            {item.title}
          </h4>
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
              Price
            </span>
            <span className="font-serif font-bold text-base text-[#D4AF37]">
              {item.price !== undefined && item.price > 0
                ? `${currencySymbol}${item.price.toLocaleString()}`
                : 'Free Inquiry'}
            </span>
          </div>

          <button
            onClick={onAddToCart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-[#D4AF37]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
