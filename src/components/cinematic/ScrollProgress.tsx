import React, { useEffect, useState } from 'react';

interface SceneMarker {
  id: string;
  number: string;
  label: string;
}

const SCENES: SceneMarker[] = [
  { id: 'scene-arrival', number: '01', label: 'Arrival' },
  { id: 'scene-wash', number: '02', label: 'The Wash' },
  { id: 'scene-reveal', number: '03', label: 'The Reveal' },
  { id: 'scene-grill', number: '04', label: 'The Grill' },
  { id: 'scene-lounge', number: '05', label: 'Whiskey Lounge' },
  { id: 'scene-entertainment', number: '06', label: 'Snooker & Game Night' },
  { id: 'scene-offers', number: '07', label: 'Special Offers' },
  { id: 'scene-order', number: '08', label: 'Digital Menu & Order' },
];

export const ScrollProgress: React.FC = () => {
  const [activeScene, setActiveScene] = useState<string>('scene-arrival');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // Check which section is in view
      for (let i = SCENES.length - 1; i >= 0; i--) {
        const el = document.getElementById(SCENES[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveScene(SCENES[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToScene = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile top thin progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-[#141414] md:hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#38BDF8] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Desktop side indicator */}
      <nav
        aria-label="Scene progress"
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3 pointer-events-auto"
      >
        {SCENES.map((scene) => {
          const isActive = activeScene === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => scrollToScene(scene.id)}
              className="group flex items-center gap-3 py-1 text-right focus:outline-none"
              title={`Jump to ${scene.label}`}
            >
              <span
                className={`text-[11px] font-mono tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'text-[#D4AF37] opacity-100 font-semibold translate-x-0'
                    : 'text-neutral-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2'
                }`}
              >
                {scene.number}. {scene.label}
              </span>
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[#D4AF37] ring-4 ring-[#D4AF37]/20 scale-125'
                    : 'bg-neutral-700 group-hover:bg-neutral-400 group-hover:scale-110'
                }`}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
};
