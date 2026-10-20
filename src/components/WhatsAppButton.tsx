import React from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';

interface WhatsAppButtonProps {
  phone: string;
  message: string;
  label?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone,
  message,
  label = 'Transmit Order to WhatsApp',
  className = '',
}) => {
  const handleOpenWhatsApp = () => {
    // Sanitize phone number (strip '+', spaces, dashes)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // Note: In iframe preview environments window.open might be constrained; use top-level or link
    window.location.href = waUrl;
  };

  return (
    <button
      onClick={handleOpenWhatsApp}
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#25D366]/20 cursor-pointer ${className}`}
    >
      <MessageCircle className="w-4 h-4 fill-black" />
      <span>{label}</span>
      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
    </button>
  );
};
