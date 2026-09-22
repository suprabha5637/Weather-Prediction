import React from 'react';
import { Sprout, Tractor } from 'lucide-react';
import { Language } from '../../types/weather';
import { getTranslation } from '../../utils/translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="mt-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm border border-emerald-800">
      {/* Background agricultural tractor & fields artistic motif */}
      <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none">
        <Tractor className="w-32 h-32 text-emerald-300" />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Sprout className="w-4 h-4" />
          </div>
          <span className="text-sm sm:text-base font-extrabold tracking-wide text-emerald-100">
            {getTranslation(language, 'footerQuote')}
          </span>
        </div>

        <div className="text-xs text-emerald-200/80 font-medium">
          {getTranslation(language, 'footerPowered')}
        </div>
      </div>
    </footer>
  );
};
