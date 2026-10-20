import React from 'react';
import { Sparkles, Shield, Zap, Eye } from 'lucide-react';

export const Scene3Reveal: React.FC = () => {
  return (
    <section
      id="scene-reveal"
      className="relative min-h-[90vh] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Editorial Narrative */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] tracking-widest uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Scene 03 · The Hydrophobic Reveal</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#F5F0E7] uppercase leading-[1.1]">
            Unflinching Gloss. Pristine Sanctuary.
          </h2>

          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            The foam recedes to uncover deep, glass-like reflection. Every curve cured under infrared lamps, sealed with genuine 9H ceramic matrix that repels road grime, Lagos tropical rainstorms, and intense UV radiation.
          </p>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-[#F5F0E7]">9H Nano-Matrix Coating</h4>
                <p className="text-xs text-neutral-400">Extreme hydrophobic contact angle causing water and contaminants to bead instantly.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-[#F5F0E7]">Anti-Microbial Dry Vapor Extraction</h4>
                <p className="text-xs text-neutral-400">140°C dry steam sanitization of luxury leather hides, Alcantara headliners, and AC ducts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right High-Fidelity Vehicle Visual */}
        <div className="lg:col-span-7 relative">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#141414]">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85"
              alt="Finished hyper-gloss ceramic luxury vehicle"
              className="w-full aspect-[4/3] object-cover object-center brightness-90 hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />

            {/* In-image Spec Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between p-4 rounded-xl glass-panel">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#D4AF37] block">Curing Status</span>
                  <span className="text-xs font-semibold text-white">Full Ceramic Seal Active</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-neutral-400 block">Inspection Grade</span>
                <span className="text-xs font-bold text-[#F5F0E7]">Zero-Defect Standard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
