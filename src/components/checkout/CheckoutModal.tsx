import React, { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { X, MessageCircle, AlertTriangle } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    items,
    selectedTable,
    orderType,
    isCheckoutOpen,
    setCheckoutOpen,
    clearCart,
    getTotalEstimatedPrice,
  } = useCartStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const estimatedTotal = getTotalEstimatedPrice();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    // 1. Build the WhatsApp message
    let message = `*NEW ORDER - LAVIDA CARWASH & LOUNGE*\n\n`;
    message += `*Name:* ${name.trim()}\n`;
    message += `*Phone:* ${phone.trim()}\n`;
    message += `*Location:* ${selectedTable || orderType.toUpperCase()}\n`;
    if (notes.trim()) {
      message += `*Notes:* ${notes.trim()}\n`;
    }
    message += `\n*Items Ordered:*\n`;
    
    items.forEach(item => {
      message += `• ${item.quantity}x ${item.name} (₦${(item.price * item.quantity).toLocaleString()})\n`;
    });
    
    message += `\n*Estimated Total:* ₦${estimatedTotal.toLocaleString()}\n`;
    message += `\n_Please confirm this order. Sent from LaVida Web App._`;

    // 2. Create the WhatsApp link
    const waNumber = '+2348138637678';
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    // 3. Open WhatsApp and clean up
    window.open(waLink, '_blank');
    clearCart();
    setCheckoutOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-[#181818] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#25D366]/10 text-[#25D366]">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">WhatsApp Checkout</h3>
              <span className="text-xs text-neutral-400 font-mono">
                Direct WhatsApp Concierge
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-neutral-500 block uppercase">Location:</span>
              <span className="text-white font-semibold">
                {selectedTable || orderType.toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-neutral-500 block uppercase">Est. Total:</span>
              <span className="text-sm font-serif font-bold text-[#D4AF37]">
                ₦{estimatedTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-300 font-mono">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block">
              Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Adebayo Adeleke"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/10 text-white text-xs placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block">
              Phone *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +234 803 123 4567"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/10 text-white text-xs placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra spicy, no ice..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/10 text-white text-xs placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#25D366]/25 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Order via WhatsApp</span>
          </button>
          
          <p className="text-center text-[10px] text-neutral-500">
            This opens WhatsApp with your order pre-filled. No BFF required.
          </p>
        </form>
      </div>
    </div>
  );
};