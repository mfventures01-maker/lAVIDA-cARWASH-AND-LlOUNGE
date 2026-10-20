import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MapPin, AlertCircle } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    selectedTable,
    orderType,
    setOrderType,
    setCheckoutOpen,
    getTotalEstimatedPrice,
  } = useCartStore();

  if (!isCartOpen) return null;

  const estimatedTotal = getTotalEstimatedPrice();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md h-full bg-[#0F0F0F] border-l border-white/10 flex flex-col justify-between shadow-2xl">
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Your Order Cart</h3>
              <span className="text-xs text-neutral-400 font-mono">
                {items.length} unique {items.length === 1 ? 'line' : 'lines'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Type & Location context */}
        <div className="px-6 py-3 bg-[#161616] border-b border-white/5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-300">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Target:</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as any)}
              className="bg-[#202020] border border-white/10 rounded px-2 py-1 text-white text-[11px]"
            >
              <option value="takeaway">Takeaway</option>
              <option value="table">Table Service</option>
              <option value="lounge">Lounge Suite</option>
              <option value="carwash">Carwash Bay</option>
            </select>
            <span className="text-[#D4AF37] font-semibold">{selectedTable}</span>
          </div>
        </div>

        {/* Cart Line Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {items.map((item) => (
            <div
              key={item.item_id}
              className="p-4 rounded-xl bg-[#161616] border border-white/5 flex items-center justify-between gap-3 group"
            >
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono tracking-wider uppercase text-[#D4AF37] block">
                  {item.item_type || 'Item'} · {item.item_id}
                </span>
                <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xs font-serif font-bold text-[#D4AF37]">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    (₦{item.price.toLocaleString()} each)
                  </span>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 rounded-lg border border-white/10 shrink-0">
                <button
                  onClick={() => updateQuantity(item.item_id, -1)}
                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-mono font-bold text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.item_id, 1)}
                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeItem(item.item_id)}
                className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-500">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20 text-[#D4AF37]" />
              <h4 className="font-serif text-lg font-bold text-neutral-300 mb-1">Your cart is empty</h4>
              <p className="text-xs text-neutral-400 max-w-xs mb-6">
                Explore our live catalog loaded directly from the Google Sheets SSOT backend.
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#1C1C1C] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-mono uppercase tracking-wider hover:bg-[#D4AF37]/10"
              >
                Browse Menu
              </button>
            </div>
          )}
        </div>

        {/* Footer: Subtotal & Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#141414] space-y-4">
            {/* Price Authority Disclaimer */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-black/50 border border-white/5 text-[11px] font-mono text-neutral-400">
              <AlertCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>
                Estimated Subtotal. Line totals and applicable promotional rates are authoritatively calculated and persisted by the backend upon submission.
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                  Provisional Total
                </span>
                <span className="text-2xl font-serif font-black text-[#D4AF37]">
                  ₦{estimatedTotal.toLocaleString()}
                </span>
              </div>

              <button
                onClick={clearCart}
                className="text-xs text-neutral-500 hover:text-red-400 underline font-mono"
              >
                Clear Cart
              </button>
            </div>

            <button
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/20 cursor-pointer"
            >
              <span>Proceed to Server Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
