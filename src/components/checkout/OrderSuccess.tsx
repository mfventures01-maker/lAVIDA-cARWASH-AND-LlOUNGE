import React from 'react';
import { OrderConfirmationData } from '../../types/lavida';
import { WhatsAppButton } from '../WhatsAppButton';
import { CheckCircle2, X, Receipt } from 'lucide-react';

interface OrderSuccessProps {
  order: OrderConfirmationData;
  whatsappPhone: string;
  onClose: () => void;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({
  order,
  whatsappPhone,
  onClose,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-xl bg-[#141414] border border-[#D4AF37]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#1C180E] via-[#141414] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] block">
                Order Persisted by Backend
              </span>
              <h3 className="font-serif text-xl font-bold text-white">
                Reference: {order.order_reference}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Customer & Location context */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
            <div>
              <span className="text-neutral-500 block uppercase">Customer:</span>
              <span className="text-white font-semibold">{order.customer.name}</span>
              <span className="text-neutral-400 block text-[11px]">{order.customer.phone}</span>
            </div>
            <div>
              <span className="text-neutral-500 block uppercase">Location Context:</span>
              <span className="text-[#D4AF37] font-semibold">
                {order.customer.table_number || 'Takeaway'}
              </span>
              <span className="text-neutral-400 block text-[11px]">
                {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Itemized Line Items from Server */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Server-Calculated Line Items</span>
            </h4>

            <div className="space-y-2 border border-white/5 rounded-xl p-3 bg-[#181818]">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 text-xs border-b border-white/5 last:border-none">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-400 font-bold">{item.quantity}x</span>
                    <span className="text-white">{item.name}</span>
                  </div>
                  <span className="font-mono text-[#D4AF37] font-semibold">
                    ₦{item.line_total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Authoritative Total */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1C180E] border border-[#D4AF37]/30">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                Server-Confirmed Total
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Currency: {order.currency}
              </span>
            </div>
            <span className="text-2xl font-serif font-black text-[#D4AF37]">
              {order.formatted_total}
            </span>
          </div>

          {/* WhatsApp Handoff Action */}
          <div className="space-y-3 pt-2">
            <WhatsAppButton
              phone={whatsappPhone}
              message={order.handoff_message}
              label="Handoff Order to WhatsApp Service"
              className="w-full"
            />
            <p className="text-[11px] font-mono text-neutral-400 leading-relaxed text-center">
              * Non-negotiable rule: Opening WhatsApp does not prove kitchen delivery or payment clearance. Staff will inspect your order reference upon arrival.
            </p>
          </div>

          {/* Backend Authority Badge */}
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-4 border-t border-white/5">
            <span>Persistence: Google Sheets / Apps Script SSOT</span>
            <span className="text-[#D4AF37]">DEMO MODE CERTIFIED</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#161616] border-t border-white/10 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono uppercase tracking-wider transition-colors"
          >
            Close & Start New Order
          </button>
        </div>
      </div>
    </div>
  );
};
