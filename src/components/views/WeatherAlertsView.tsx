import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { WeatherDataState, WeatherAlert, Language } from '../../types/weather';
import { AlertDetailModal } from '../weather/AlertDetailModal';

interface WeatherAlertsViewProps {
  weather: WeatherDataState;
  language: Language;
}

export const WeatherAlertsView: React.FC<WeatherAlertsViewProps> = ({
  weather,
  language,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<WeatherAlert | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredAlerts = weather.alerts.filter((a) => {
    if (severityFilter === 'all') return true;
    return a.severity.toLowerCase() === severityFilter.toLowerCase();
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-900 via-amber-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BellRing className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Agricultural Early Warning System
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Active Weather Alerts & Farm Protection Advisories
          </h1>
          <p className="text-xs text-amber-100/90 mt-1 max-w-xl">
            Real-time emergency weather bulletins for{' '}
            <strong>{weather.location.name}, {weather.location.state}</strong>.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs p-1.5 rounded-xl border border-white/20 text-xs">
          <Filter className="w-3.5 h-3.5 text-amber-200 ml-1" />
          <span className="font-bold text-amber-200">Filter:</span>
          {(['all', 'severe', 'moderate'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                severityFilter === sev
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              ✓
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No Active Weather Alerts for this Filter
            </h3>
            <p className="text-xs text-slate-500">
              Atmospheric conditions are stable with no extreme hazards detected.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className="bg-white hover:bg-amber-50/40 rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-amber-300 shadow-xs transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                        alert.severity === 'Severe'
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      {alert.severity} Risk
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {alert.timeRange}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="mt-2 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                    <span>Action: {alert.recommendedAction}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-slate-700 group-hover:text-amber-700 self-end md:self-center">
                <span>View Full Impact</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert Inspection Modal */}
      <AlertDetailModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        language={language}
      />
    </div>
  );
};
