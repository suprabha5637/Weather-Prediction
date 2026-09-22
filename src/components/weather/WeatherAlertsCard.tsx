import React from 'react';
import { Bell, AlertTriangle, ChevronRight } from 'lucide-react';
import { WeatherAlert, Language } from '../../types/weather';
import { getTranslation } from '../../utils/translations';

interface WeatherAlertsCardProps {
  alerts: WeatherAlert[];
  language: Language;
  onViewAllAlerts?: () => void;
  onSelectAlert?: (alert: WeatherAlert) => void;
}

export const WeatherAlertsCard: React.FC<WeatherAlertsCardProps> = ({
  alerts,
  language,
  onViewAllAlerts,
  onSelectAlert,
}) => {
  const activeAlert = alerts[0];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header with Red Bell and Badge Count */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-rose-100 text-rose-600 relative">
              <Bell className="w-4 h-4 fill-rose-500/20" />
            </div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              {getTranslation(language, 'weatherAlerts')}
            </h2>
            {alerts.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                {alerts.length}
              </span>
            )}
          </div>

          <button
            onClick={onViewAllAlerts}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 hover:underline"
          >
            <span>{getTranslation(language, 'viewAll')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Alert Warning Card */}
        {activeAlert ? (
          <div
            onClick={() => onSelectAlert && onSelectAlert(activeAlert)}
            className="bg-rose-50/50 hover:bg-rose-50 border border-rose-200/80 rounded-xl p-3 sm:p-3.5 space-y-2 cursor-pointer transition-colors shadow-2xs group"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600 shrink-0 group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-4 h-4 fill-rose-500/20" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-rose-950">
                  {activeAlert.title}
                </h3>
              </div>

              {/* Severity Badge */}
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                {activeAlert.severity}
              </span>
            </div>

            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {activeAlert.description}
            </p>

            <div className="pt-1 text-[11px] text-slate-500 font-medium flex items-center justify-between">
              <span>Timeline: {activeAlert.timeRange}</span>
              <span className="text-emerald-700 font-bold group-hover:underline">
                View Farm Impact & Action →
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs">
            No active severe weather alerts.
          </div>
        )}
      </div>

      <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
        <span>Source: IMD + Local Station Ensemble</span>
        <span>Confidence: 78%</span>
      </div>
    </div>
  );
};
