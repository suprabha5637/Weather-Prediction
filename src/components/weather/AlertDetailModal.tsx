import React from 'react';
import {
  X,
  AlertTriangle,
  Clock,
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  ShieldAlert,
  Sprout,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { WeatherAlert, Language } from '../../types/weather';
import { getTranslation } from '../../utils/translations';

interface AlertDetailModalProps {
  alert: WeatherAlert | null;
  onClose: () => void;
  language: Language;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  language,
}) => {
  if (!alert) return null;

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'severe':
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getSeverityBadge(
                    alert.severity
                  )}`}
                >
                  {alert.severity} Risk
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {alert.type}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                {alert.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Timing & Validity Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Affected Timing: {alert.timeRange}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Forecast Confidence: {alert.probability || 85}%</span>
            </div>
          </div>

          {/* Detailed Cause & Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Root Meteorological Cause
            </h4>
            <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-3 text-xs text-slate-700 leading-relaxed font-medium">
              {alert.description}
            </div>
          </div>

          {/* Trigger Weather Metrics */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Associated Weather Triggers
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 text-center">
                <Thermometer className="w-4 h-4 text-red-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">Temperature</span>
                <span className="text-xs font-bold text-slate-800">36° – 38°C</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 text-center">
                <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">Humidity</span>
                <span className="text-xs font-bold text-slate-800">55% – 88%</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 text-center">
                <Wind className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">Wind Velocity</span>
                <span className="text-xs font-bold text-slate-800">12–22 km/h</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 text-center">
                <CloudRain className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">Precipitation</span>
                <span className="text-xs font-bold text-slate-800">0 – 18 mm</span>
              </div>
            </div>
          </div>

          {/* Potential Farm Impact */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Potential Farm & Crop Impact</span>
            </h4>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-700 space-y-1.5">
              <p className="leading-relaxed font-medium">
                High heat index accelerates soil transpiration and causes flower drop in fruiting vegetables. High night humidity subsequent to rain increases sheath blight in paddy.
              </p>
              {alert.affectedCrops && alert.affectedCrops.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-500">Most Vulnerable Crops:</span>
                  {alert.affectedCrops.map((crop, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recommended Action */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Recommended Agronomic Actions</span>
            </h4>
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 font-medium leading-relaxed">
              {alert.recommendedAction}
            </div>
          </div>

          {/* Source Attribution */}
          <div className="text-[10.5px] text-slate-400 font-medium text-center pt-1">
            Data Source: {alert.source || 'KrishiGo Ensemble Model + IMD Calibration'}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
