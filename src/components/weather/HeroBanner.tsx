import React from 'react';
import { Leaf } from 'lucide-react';
import { Language } from '../../types/weather';
import { getTranslation } from '../../utils/translations';

interface HeroBannerProps {
  language: Language;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ language }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 mb-4">
      {/* Background panoramic agricultural sunset image */}
      <img
        src="/images/hero-farm.jpg"
        alt="Agricultural Weather Intelligence"
        className="w-full h-36 sm:h-44 md:h-48 object-cover object-center brightness-95 contrast-105"
      />

      {/* Gradient overlays for crisp text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <span className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300 drop-shadow-xs">
              {getTranslation(language, 'heroTag')}
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {getTranslation(language, 'heroTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200/90 font-medium max-w-xl drop-shadow-xs">
              {getTranslation(language, 'heroDesc')}
            </p>
          </div>

          {/* Right Floating Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-3.5 py-1.5 rounded-full text-white shadow-md shrink-0">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold tracking-wide">Same Sky</span>
              <span className="text-[10px] text-emerald-200 font-medium -mt-0.5">Brighter Harvests</span>
            </div>
            <Leaf className="w-4 h-4 text-emerald-400 fill-emerald-400/50" />
          </div>
        </div>

        {/* Bottom subtle indicator dots / metadata */}
        <div className="flex items-center justify-between text-[11px] text-emerald-200/80">
          <span className="font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Meteorological Satellite & Station Grid
          </span>
          <span className="hidden md:inline font-mono">
            Model: KrishiGo Ensemble v4.2 • ECMWF + IMD
          </span>
        </div>
      </div>
    </div>
  );
};
