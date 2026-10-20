import React, { useState, useRef } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { laVidaClient } from '../../services/laVidaClient';
import { CustomerSchema } from '../../types/lavida';
import { X, ShieldCheck, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    items,
    selectedTable,
    orderType,
    isCheckoutOpen,
    setCheckoutOpen,
    clearCart,
    setConfirmedOrder,
    getTotalEstimatedPrice,
    buildOrderPayload,
  } = useCartStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Preserve idempotency key across retries of the same submission
  const idempotencyKeyRef = useRef<string>(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'idem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9)
  );

  if (!isCheckoutOpen) return null;

  const estimatedTotal = getTotalEstimatedPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    // Validate inputs with Zod
    const validation = CustomerSchema.safeParse({
      name,
      phone,
      table_number: selectedTable,
      notes,
    });

    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const key = String(err.path[0] || '');
        if (key) errMap[key] = err.message;
      });
      setErrors(errMap);
      return;
    }

    if (items.length === 0) {
      setServerError('Your cart is empty. Add items before checking out.');
      return;
    }

    setSubmitting(true);

    try {
      // Build strict security payload: NO unit_price or line_total
      const payload = buildOrderPayload(idempotencyKeyRef.current, {
        name: name.trim(),
        phone: phone.trim(),
        table_number: selectedTable,
        notes: notes.trim(),
      });

      const response = await laVidaClient.createOrder(payload);

      if (response.ok && response.data) {
        clearCart();
        setCheckoutOpen(false);
        setConfirmedOrder(response.data);
      } else {
        setServerError(response.error || 'Server rejected order submission.');
      }
    } catch (err: any) {
      setServerError(err.message || 'Network failure while connecting to LaVida BFF gateway.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 bg-[#181818] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Authoritative Order Checkout</h3>
              <span className="text-xs text-neutral-400 font-mono">
                Server-side price authority (?action=createOrder)
              </span>
            </div>
          </div>

          <button
            onClick={() => setCheckoutOpen(false)}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Order Summary Snapshot */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-neutral-500 block uppercase">Order Type / Location:</span>
              <span className="text-white font-semibold">
                {orderType.toUpperCase()} ({selectedTable})
              </span>
            </div>
            <div className="text-right">
              <span className="text-neutral-500 block uppercase">Est. Total:</span>
              <span className="text-sm font-serif font-bold text-[#D4AF37]">
                ₦{estimatedTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {serverError && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-300 font-mono">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Submission Error:</span>
                <span>{serverError}</span>
              </div>
            </div>
          )}

          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block">
              Customer Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Adebayo Adeleke"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#1C1C1C] border text-white text-xs placeholder-neutral-500 focus:outline-none ${
                errors.name ? 'border-red-500' : 'border-white/10 focus:border-[#D4AF37]'
              }`}
            />
            {errors.name && (
              <span className="text-[11px] text-red-400 font-mono">{errors.name}</span>
            )}
          </div>

          {/* Customer Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block">
              Contact Phone (Nigerian format) *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +234 803 123 4567 or 08031234567"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#1C1C1C] border text-white text-xs placeholder-neutral-500 focus:outline-none ${
                errors.phone ? 'border-red-500' : 'border-white/10 focus:border-[#D4AF37]'
              }`}
            />
            {errors.phone && (
              <span className="text-[11px] text-red-400 font-mono">{errors.phone}</span>
            )}
          </div>

          {/* Special Preparation Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block">
              Special Instructions / Dietary Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra spicy, no ice in cocktail..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/10 text-white text-xs placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none resize-none"
            />
          </div>

          {/* Security & Idempotency Notice */}
          <div className="p-3 rounded-lg bg-neutral-900 border border-white/5 text-[10px] font-mono text-neutral-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Idempotency Key:</span>
              <span className="text-neutral-500 truncate max-w-[180px]">
                {idempotencyKeyRef.current}
              </span>
            </div>
            <div>* Frontend sends NO prices. The backend calculates the real total from Google Sheets.</div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/25 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validating & Persisting Order...</span>
              </>
            ) : (
              <>
                <span>Confirm & Submit Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
