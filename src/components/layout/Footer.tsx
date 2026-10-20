import React from 'react';
import { AppConfigData } from '../../types/lavida';
import { useCartStore } from '../../store/useCartStore';
import { MapPin, Clock, Phone, Smartphone, ShieldAlert } from 'lucide-react';

interface FooterProps {
  config: AppConfigData | null;
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  const { setDownloadModalOpen, setDiagnosticOpen } = useCartStore();

  const businessName = config?.venue_name || 'LAVIDA CARWASH AND LOUNGE';
  const location = config?.address || '14A Admiralty Way, Lekki Phase 1, Lagos, Nigeria';
  const hours = config?.operating_hours || 'Open Daily: 9:00 AM – 3:00 AM';
  const phone = config?.whatsapp_number || '2348030000000';

  return (
    <footer className="bg-[#050505] border-t border-white/10 text-neutral-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Mission */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <img
              src="/assets/lavida_logo_master.svg"
              alt="LAVIDA Emblem"
              className="w-12 h-12 object-contain drop-shadow-md"
            />
            <div>
              <span className="font-serif font-black tracking-widest text-xl text-white block leading-none">
                {businessName}
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] block mt-1">
                CARWASH AND LOUNGE
              </span>
            </div>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
            Lagos premier automotive spa and luxury hospitality destination. Precision ceramic detailing, firewood delicacies, aged spirits, and competition snooker tables.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setDiagnosticOpen(true)}
              className="inline-flex items-center gap-2 text-[11px] font-mono text-amber-400/90 hover:text-amber-300 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>DEMO MODE · GOOGLE SHEETS BACKEND · NOT FIREBASE-CERTIFIED</span>
            </button>
          </div>
        </div>

        {/* Location & Hours */}
        <div className="space-y-3 text-xs font-mono">
          <span className="text-white font-bold uppercase tracking-wider block">
            Venue Operations
          </span>
          <div className="flex items-start gap-2.5 text-neutral-400">
            <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2.5 text-neutral-400">
            <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>{hours}</span>
          </div>
          <div className="flex items-center gap-2.5 text-neutral-400">
            <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>+{phone} (WhatsApp Concierge)</span>
          </div>
        </div>

        {/* Deliverables & APK */}
        <div className="space-y-3 text-xs font-mono">
          <span className="text-white font-bold uppercase tracking-wider block">
            Digital Access
          </span>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Native Android application packaged via Capacitor. Persistent offline cart, table QR resolution, and direct WhatsApp handoff.
          </p>
          <button
            onClick={() => setDownloadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            <span>Download Android APK</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
        <div>
          © {new Date().getFullYear()} {businessName}. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>HOEOS Controlled Release</span>
          <span aria-hidden="true">·</span>
          <span>Deterministic Pricing</span>
          <span aria-hidden="true">·</span>
          <span>Fail-Closed Resilience</span>
        </div>
      </div>
    </footer>
  );
};
