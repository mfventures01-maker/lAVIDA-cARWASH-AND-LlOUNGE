import React from 'react';
import { ArrowDown, Sparkles, ShieldCheck, Car } from 'lucide-react';

interface Scene1ArrivalProps {
  onExploreServices: () => void;
  onOrderNow: () => void;
  onOpenDownload: () => void;
}

export const Scene1Arrival: React.FC<Scene1ArrivalProps> = ({
  onExploreServices,
  onOrderNow,
  onOpenDownload,
}) => {
  return (
    <section
      id="scene-arrival"
      className="relative min-h-[92vh] flex flex-col justify-between items-center text-center px-4 sm:px-6 pt-24 pb-12 overflow-hidden"
    >
      {/* Background dramatic lighting and hero vehicle image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury performance automotive under dramatic spotlight"
          className="w-full h-full object-cover object-center brightness-40 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
      </div>

      {/* Top subtle brand badge */}
      <div className="relative z-10 flex items-center gap-2 text-xs text-[#D4AF37] font-mono tracking-widest uppercase">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Automotive Detailing & Elite Hospitality</span>
        <span aria-hidden="true">·</span>
        <span>Lekki Phase 1, Lagos</span>
      </div>

      {/* Central Headline & Master Logo Emblem */}
      <div className="relative z-10 max-w-4xl mx-auto my-auto py-6 flex flex-col items-center">
        {/* Cinematic Emblem Display */}
        <div className="mb-6 relative group">
          <div className="absolute inset-0 bg-[#D4AF37]/15 rounded-full blur-2xl group-hover:bg-[#D4AF37]/25 transition-all" />
          <img
            src="/assets/lavida_logo_master.svg"
            alt="LAVIDA Carwash and Lounge Official Emblem"
            className="w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-[0_12px_30px_rgba(214,166,75,0.35)] relative z-10 hover:scale-105 transition-transform duration-500"
          />
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-[#F5F0E7] uppercase leading-[1.1] mb-4 drop-shadow-2xl">
          LAVIDA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF2B2] to-[#D4AF37]">CARWASH</span> & LOUNGE
        </h1>

        <p className="text-base sm:text-xl text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed mb-8">
          Where master-level ceramic detailing converges with wood-smoked delicacies, aged spirits, and private snooker championship tables.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOrderNow}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-semibold text-sm tracking-wide uppercase hover:brightness-110 transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Order Menu & Services</span>
            <Car className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={onExploreServices}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#181818]/90 text-white font-medium text-sm tracking-wide uppercase border border-white/15 hover:bg-[#252525] hover:border-[#D4AF37]/40 transition-all cursor-pointer"
          >
            Explore Experience
          </button>

          <button
            onClick={onOpenDownload}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-neutral-900/80 text-[#D4AF37] font-mono text-xs uppercase tracking-wider border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-colors"
          >
            Android App
          </button>
        </div>

        {/* Unboxed Metadata Discipline */}
        <div className="flex items-center justify-center flex-wrap gap-3 mt-8 text-xs text-neutral-400 font-mono">
          <span>9H Ceramic Coating</span>
          <span aria-hidden="true">·</span>
          <span>Hickory Smoked Asun</span>
          <span aria-hidden="true">·</span>
          <span>Macallan Vault</span>
          <span aria-hidden="true">·</span>
          <span>Championship Snooker</span>
        </div>
      </div>

      {/* Scroll down prompt */}
      <div className="relative z-10 flex flex-col items-center gap-2 text-xs text-neutral-400 font-mono">
        <span className="tracking-widest uppercase text-[10px]">Scroll into the Wash Experience</span>
        <button
          onClick={onExploreServices}
          aria-label="Scroll to next scene"
          className="p-2 rounded-full border border-white/10 hover:border-[#D4AF37]/50 text-neutral-400 hover:text-[#D4AF37] transition-all animate-bounce"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
