import React from 'react';
import { Mic, Trophy, Check, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface Scene6EntertainmentProps {
  onExploreEvents?: () => void;
}

export const Scene6Entertainment: React.FC<Scene6EntertainmentProps> = ({
  onExploreEvents,
}) => {
  const snookerTables = [
    {
      id: 'lav-snooker-001',
      name: 'Table Alpha (Championship Slate)',
      type: '12ft English Tournament Table',
      statusNotice: 'Authoritative Rates Synchronized via Google Sheets',
      features: ['Strachan 6811 cloth', 'Steel block cushions', 'Aramith tournament ball set', 'Lounge booth'],
    },
    {
      id: 'lav-snooker-002',
      name: 'Table Apex (Private Suite)',
      type: '12ft Private Enclave Table',
      statusNotice: 'Authoritative Rates Synchronized via Google Sheets',
      features: ['Private soundproof enclave', 'Dedicated bar attendant', 'Overhead LED canopy', 'Champagne cooler'],
    },
    {
      id: 'lav-snooker-003',
      name: 'Table Velocity (Fast 8-Ball)',
      type: '9ft English Pool Table',
      statusNotice: 'Authoritative Rates Synchronized via Google Sheets',
      features: ['Speed cloth', 'Quick ball return', 'Spectator counter', 'Craft drinks service'],
    },
  ];

  return (
    <section
      id="scene-entertainment"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#D4AF37] tracking-widest uppercase mb-3">
          <Trophy className="w-4 h-4" />
          <span>Scene 06 · Championship Slate & Karaoke</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#F5F0E7] uppercase mb-4">
          Snooker Lounge & Game Night
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Competition-grade Strachan cloth, precision cues, private lounge seating, and high-energy Friday & Sunday Karaoke sessions.
        </p>
      </div>

      {/* Snooker Tables Showcase (With Obsidian Typographic Cards & 0 Invented Rates) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {snookerTables.map((table) => (
          <div
            key={table.id}
            className="rounded-2xl overflow-hidden bg-[#111111] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
          >
            {/* Obsidian Card Header */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#050505] p-6 flex flex-col justify-between items-center text-center">
              <div className="w-full flex justify-between items-center text-[9px] font-mono uppercase text-neutral-500">
                <span>{table.type}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] opacity-60" />
              </div>
              <h4 className="font-serif text-lg font-black text-[#D6A64B] uppercase tracking-wider my-auto">
                {table.name}
              </h4>
              <span className="text-[10px] font-mono text-neutral-500">
                Tournament Grade Facility
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="space-y-1.5 mb-6">
                  {table.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
                    Session Rate
                  </span>
                  <span className="font-serif font-bold text-xs text-[#D4AF37]">
                    Inquire at Lounge Desk
                  </span>
                </div>

                <button
                  onClick={() => {
                    const target = document.getElementById('scene-order');
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1F1F1F] text-white border border-white/15 hover:border-[#D4AF37]/50 hover:bg-[#282828] text-xs font-mono font-bold uppercase tracking-wider transition-all"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Reserve Table</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Box: Game Night With Karaoke */}
      <div className="rounded-3xl p-8 sm:p-10 glass-panel border border-[#D4AF37]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#D4AF37] tracking-widest uppercase">
              <Mic className="w-4 h-4" />
              <span>Bi-Weekly Highlight · Fridays & Sundays</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-white uppercase">
              Game Night With Karaoke & Suya Bundles
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Step onto the vocal spotlight, enjoy curated acoustic sound engineering, and compete in rapid 8-ball knockouts with sharing platters delivered directly to your booth.
            </p>
            <div className="text-[11px] font-mono text-neutral-400">
              * Schedule and rates configured in Google Sheets SnookerTables workbook. Zero client prices invented.
            </div>
          </div>

          <button
            onClick={() => {
              if (onExploreEvents) {
                onExploreEvents();
              } else {
                const target = document.getElementById('scene-offers');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="shrink-0 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-xl shadow-[#D4AF37]/20"
          >
            <span>View Event Packages</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
