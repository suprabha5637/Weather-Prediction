import React from 'react';
import { Leaf, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types/weather';
import { getTranslation } from '../../utils/translations';

interface WeatherSummaryCardProps {
  summaryText: string;
  noHeavyRain24h: boolean;
  language: Language;
}

export const WeatherSummaryCard: React.FC<WeatherSummaryCardProps> = ({
  summaryText,
  noHeavyRain24h,
  language,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div>
        {/* Title with green leaf icon */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
            <Leaf className="w-4 h-4 fill-emerald-600/20 text-emerald-700" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">
            {getTranslation(language, 'weatherSummary')}
          </h2>
        </div>

        {/* Dynamic AI weather summary */}
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          {summaryText}
        </p>
      </div>

      {/* Green status badge at bottom */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        {noHeavyRain24h ? (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-800 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
            <span>{getTranslation(language, 'noHeavyRain')}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-amber-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Precipitation alerts active in your district.</span>
          </div>
        )}
      </div>
    </div>
  );
};
