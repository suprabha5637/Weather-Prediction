import React from 'react';
import { CalendarDays, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { FarmCalendarDay, Language } from '../../types/weather';
import { getTranslation } from '../../utils/translations';

interface FarmActionCalendarProps {
  calendar: FarmCalendarDay[];
  language: Language;
}

export const FarmActionCalendar: React.FC<FarmActionCalendarProps> = ({
  calendar,
  language,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
            <CalendarDays className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {getTranslation(language, 'farmCalendar')}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Weather-synchronized agronomic operational schedule
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Next 15 Days Action Plan
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {calendar.map((item) => (
          <div
            key={item.day}
            className="p-3 bg-slate-50 hover:bg-emerald-50/40 rounded-xl border border-slate-200/80 transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-800 shadow-2xs font-mono">
                  {item.date}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Day {item.day}
                </span>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.riskLevel === 'Low'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : item.riskLevel === 'Moderate'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {item.riskLevel} Risk
              </span>
            </div>

            <div className="my-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                {item.action}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5 leading-snug">
                {item.reason}
              </p>
            </div>

            <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>{item.weatherCondition}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
