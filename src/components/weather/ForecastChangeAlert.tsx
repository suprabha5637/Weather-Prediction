import React, { useState } from 'react';
import { AlertCircle, TrendingUp, Droplets, ChevronDown, ChevronUp, Clock, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types/weather';

interface ForecastChangeAlertProps {
  language: Language;
}

export const ForecastChangeAlert: React.FC<ForecastChangeAlertProps> = ({ language }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3.5 mb-4 shadow-2xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <TrendingUp className="w-5 h-5 text-amber-700" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                Forecast Change Detected
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> Run 06:00Z vs Previous 00:00Z Run
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-1">
              Rain probability increased by <span className="text-amber-700 font-bold">+50 percentage points</span> (20% → 70%). Expected rainfall changed from <span className="font-semibold text-slate-700">4 mm to 18 mm</span>.
            </p>

            <p className="text-xs text-slate-600 mt-0.5">
              <strong className="text-emerald-800">Action Recommended:</strong> Hold planned irrigation and suspend foliar chemical spraying before incoming rain onset on Days 7–8.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition-colors flex items-center gap-1"
          >
            <span>{isExpanded ? 'Hide Impacts' : 'View Farm Impacts'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1.5 rounded-lg"
            title="Dismiss notification"
          >
            ✕
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-white/80 rounded-xl p-2.5 border border-amber-100">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
              <span>Irrigation Impact</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Delay planned field flooding or tube-well pumping. Anticipated 18 mm precipitation will replenish root-zone soil moisture.
            </p>
          </div>

          <div className="bg-white/80 rounded-xl p-2.5 border border-amber-100">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Spraying Window</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Suspend foliar chemical spraying. High rainfall probability creates chemical wash-off and environmental leaching.
            </p>
          </div>

          <div className="bg-white/80 rounded-xl p-2.5 border border-amber-100">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Harvest Schedule</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Accelerate harvesting of mature tomatoes, chilies, and okra within the next 48 hours to prevent fruit cracking.
            </p>
          </div>

          <div className="bg-white/80 rounded-xl p-2.5 border border-amber-100">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
              <span>Drainage Outlets</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Inspect field perimeter bunds and unblock drainage ditches to avert localized waterlogging in lower terraces.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
