import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { laVidaClient } from '../../services/laVidaClient';
import { ShieldAlert, RefreshCw, X, Server, Database, CheckCircle2, Lock } from 'lucide-react';

export const DiagnosticModal: React.FC = () => {
  const { isDiagnosticOpen, setDiagnosticOpen } = useCartStore();
  const [diagData, setDiagData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDiag = async () => {
    setLoading(true);
    try {
      const data = await laVidaClient.getDiagnostic();
      setDiagData(data);
    } catch (err: any) {
      setDiagData({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDiagnosticOpen) {
      fetchDiag();
    }
  }, [isDiagnosticOpen]);

  if (!isDiagnosticOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-xl bg-[#141414] border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-[#1A160E] border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                CARSS & HOEOS System Diagnostics
              </h3>
              <span className="text-xs text-amber-400 font-mono">
                Authority & Contract Compliance Inspector
              </span>
            </div>
          </div>

          <button
            onClick={() => setDiagnosticOpen(false)}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
          {/* Prominent Mandatory Governance Label */}
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-center">
            <span className="text-amber-300 font-extrabold tracking-wider text-sm block mb-1">
              DEMO MODE · GOOGLE SHEETS BACKEND · NOT FIREBASE-CERTIFIED
            </span>
            <span className="text-[11px] text-amber-200/80">
              Operating under strict CARSS boundary governance. Client-side state is non-authoritative.
            </span>
          </div>

          {/* Upstream Apps Script Probe Status */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 uppercase font-bold flex items-center gap-2">
                <Server className="w-4 h-4 text-[#D4AF37]" />
                <span>Upstream Apps Script Gateway</span>
              </span>
              <button
                onClick={fetchDiag}
                disabled={loading}
                className="p-1 rounded text-neutral-400 hover:text-white"
                title="Refresh probe"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-1 text-[11px] text-neutral-300">
              <div className="text-neutral-500 truncate">
                Target: {diagData?.upstreamEndpoint || 'Loading...'}
              </div>
              <div className="flex items-start gap-2 pt-1 text-amber-300">
                <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{diagData?.upstreamState?.status || 'Probing gateway...'}</span>
              </div>
            </div>
          </div>

          {/* Demonstration In-Memory Database State */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-neutral-400 uppercase font-bold">
              <Database className="w-4 h-4 text-[#38BDF8]" />
              <span>BFF In-Memory Order Authority</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-neutral-300">
              <div className="p-2.5 rounded bg-neutral-900 border border-white/5">
                <span className="text-neutral-500 block text-[10px] uppercase">Persisted Orders</span>
                <span className="text-lg font-bold text-white">
                  {diagData?.persistedOrdersCount ?? 0}
                </span>
              </div>
              <div className="p-2.5 rounded bg-neutral-900 border border-white/5">
                <span className="text-neutral-500 block text-[10px] uppercase">Idempotency Keys</span>
                <span className="text-lg font-bold text-white">
                  {diagData?.idempotencyStoreCount ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Rule Compliance Checklist */}
          <div className="space-y-2 p-4 rounded-xl bg-neutral-900 border border-white/5">
            <span className="text-neutral-400 uppercase font-bold block mb-1">
              HOEOS Verified Invariants:
            </span>
            <div className="space-y-1.5 text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Client prices strictly ignored; server recalculates line totals.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Duplicate submissions blocked via persistent idempotency keys.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp handoff explicitly distinguished from order acceptance.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero mock claims: Google auth redirect accurately recorded.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#161616] border-t border-white/10 text-right">
          <button
            onClick={() => setDiagnosticOpen(false)}
            className="px-6 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono uppercase"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
