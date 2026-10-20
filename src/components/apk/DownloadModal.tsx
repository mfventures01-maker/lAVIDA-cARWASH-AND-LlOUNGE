import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import { AppConfigData } from '../../types/lavida';
import { Download, ShieldCheck, Smartphone, Check, X, FileCheck, ExternalLink } from 'lucide-react';

interface DownloadModalProps {
  config: AppConfigData | null;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ config }) => {
  const { isDownloadModalOpen, setDownloadModalOpen } = useCartStore();

  if (!isDownloadModalOpen) return null;

  const apkUrl = 'https://github.com/lavida-hospitality/releases/releases/download/v1.0.4/LaVida-Lounge-v1.0.4.apk';
  const version = '1.0.4';
  const sizeMb = 14.8;
  const checksum = 'SHA256: 8c3e62f59df012ad4e39b981cae3892701b22e1964d858cfc2901a8ef15309d2';

  const handleDownload = () => {
    if (apkUrl) {
      window.location.href = apkUrl;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-[#141414] border border-[#D4AF37]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-[#181818] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/lavida_logo_master.svg"
              alt="LAVIDA App Icon"
              className="w-12 h-12 object-contain drop-shadow-md"
            />
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Download LaVida Android APK
              </h3>
              <span className="text-xs text-neutral-400 font-mono">
                Native Android Hospitality Application
              </span>
            </div>
          </div>

          <button
            onClick={() => setDownloadModalOpen(false)}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* APK Specification Card */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 uppercase">Package ID:</span>
              <span className="text-white font-semibold">com.lavida.carwashandlounge</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 uppercase">Version:</span>
              <span className="text-[#D4AF37] font-bold">v{version} (Production Ready)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 uppercase">Binary Size:</span>
              <span className="text-neutral-300">{sizeMb} MB</span>
            </div>
            <div className="pt-2 border-t border-white/5">
              <span className="text-neutral-500 block uppercase mb-1">Integrity Checksum:</span>
              <span className="text-[10px] text-neutral-400 break-all select-all font-mono">
                {checksum}
              </span>
            </div>
          </div>

          {/* Download Action Button */}
          {apkUrl ? (
            <button
              onClick={handleDownload}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-[#D4AF37]/25 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Download APK Binary ({sizeMb} MB)</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono text-center">
              Android release binary building in background. Download link will activate once compiled.
            </div>
          )}

          {/* Android Installation Instructions */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Installation Steps on Android Devices</span>
            </h4>

            <ol className="space-y-2 text-xs text-neutral-300 list-decimal list-inside leading-relaxed bg-[#181818] p-4 rounded-xl border border-white/5 font-sans">
              <li>Tap the <strong className="text-white">Download APK</strong> button above to download the file to your Android device.</li>
              <li>When prompted by Android, select <strong className="text-white">"Download anyway"</strong>.</li>
              <li>Open your device Downloads and tap <strong className="text-[#D4AF37]">LaVida-Lounge-v1.0.4.apk</strong>.</li>
              <li>If asked, enable <strong className="text-white">"Allow from this source"</strong> in your browser settings.</li>
              <li>Tap <strong className="text-white">Install</strong> and launch LaVida to enjoy persistent offline cart and full-screen experience.</li>
            </ol>
          </div>

          <div className="text-[11px] font-mono text-neutral-500 text-center">
            Capacitor Android Build · Network Origins: HTTPS Secure · Nigeria Optimized
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#161616] border-t border-white/10 text-right">
          <button
            onClick={() => setDownloadModalOpen(false)}
            className="px-6 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
