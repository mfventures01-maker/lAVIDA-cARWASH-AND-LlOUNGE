import React from 'react';

interface LaVidaLogoProps {
  variant?: 'full_emblem' | 'emblem_icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const LaVidaLogo: React.FC<LaVidaLogoProps> = ({
  variant = 'emblem_icon',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-20 h-20',
    xl: 'w-48 h-48 sm:w-64 sm:h-64',
  };

  if (variant === 'full_emblem') {
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        <img
          src="/assets/lavida_logo_master.svg"
          alt="LAVIDA Carwash and Lounge Cinematic Emblem"
          className={`${sizeMap[size]} object-contain drop-shadow-[0_10px_25px_rgba(214,166,75,0.25)] transition-transform duration-300 hover:scale-105`}
        />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <img
          src="/assets/lavida_logo_master.svg"
          alt="LAVIDA Emblem"
          className="w-10 h-10 object-contain drop-shadow-md"
        />
        <div className="text-left">
          <span className="font-serif font-black tracking-widest text-lg text-[#F5F0E7] block leading-none">
            LAVIDA
          </span>
          {showSubtitle && (
            <span className="text-[9px] font-mono tracking-widest uppercase text-[#D4AF37] block mt-0.5">
              CARWASH AND LOUNGE
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: emblem_icon
  return (
    <div className={`relative ${sizeMap[size]} ${className} shrink-0`}>
      <img
        src="/assets/lavida_logo_master.svg"
        alt="LAVIDA Crest"
        className="w-full h-full object-contain drop-shadow-md"
      />
    </div>
  );
};
