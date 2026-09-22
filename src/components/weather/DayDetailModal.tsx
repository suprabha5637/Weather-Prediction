import React from 'react';
import {
  X,
  Calendar,
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
  SunMedium,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { DailyForecast, TemperatureUnit, Language } from '../../types/weather';
import { formatTemp } from '../../services/weatherService';

interface DayDetailModalProps {
  day: DailyForecast | null;
  onClose: () => void;
  unit: TemperatureUnit;
  language: Language;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  onClose,
  unit,
}) => {
  if (!day) return null;

  const renderWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-amber-500 fill-amber-400" />;
      case 'partly-cloudy':
        return <CloudSun className="w-8 h-8 text-amber-500" />;
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'heavy-rain':
        return <CloudRain className="w-8 h-8 text-blue-700 fill-blue-500/20" />;
      case 'thunderstorm':
        return <CloudLightning className="w-8 h-8 text-purple-600" />;
      default:
        return <Sun className="w-8 h-8 text-amber-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Calendar className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Day {day.dayIndex}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {day.dayName}, {day.dateStr}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Detailed Daily Agricultural Forecast
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Main Weather Hero in Modal */}
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-2xl shadow-xs border border-slate-100">
                {renderWeatherIcon(day.icon)}
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 block leading-tight">
                  {formatTemp(day.maxTemp, unit)} / {formatTemp(day.minTemp, unit)}
                </span>
                <span className="text-xs font-bold text-slate-700 block mt-0.5">
                  {day.condition}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Rain Probability: {day.rainProb}% ({day.rainAmount} mm)
                </span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-[10.5px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider inline-block ${getRiskColor(
                  day.weatherRisk
                )}`}
              >
                {day.weatherRisk} Agri Risk
              </span>
            </div>
          </div>

          {/* Key Meteorological Parameters Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Atmospheric Parameters
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">Humidity</span>
                <span className="text-xs font-bold text-slate-800">{day.humidity}%</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <Wind className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">Wind</span>
                <span className="text-xs font-bold text-slate-800">
                  {day.windSpeed} km/h {day.windDirection}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <SunMedium className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">UV Index</span>
                <span className="text-xs font-bold text-slate-800">{day.uv} of 12</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <CloudSun className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">Cloud Cover</span>
                <span className="text-xs font-bold text-slate-800">{day.cloudCover}%</span>
              </div>
            </div>
          </div>

          {/* Probabilistic Prediction Quantiles */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Probabilistic Thermal Quantiles (Uncertainty Range)</span>
            </h4>
            <div className="flex items-center justify-between text-xs font-medium px-2 py-1.5 bg-white rounded-lg border border-slate-200">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block font-bold">P10 (Cold extreme)</span>
                <span className="text-slate-700 font-bold">{formatTemp(day.p10Temp, unit)}</span>
              </div>
              <div className="text-center border-x border-slate-100 px-4">
                <span className="text-[10px] text-emerald-600 block font-bold">P50 (Median)</span>
                <span className="text-emerald-800 font-black">{formatTemp(day.p50Temp, unit)}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-red-400 block font-bold">P90 (Warm extreme)</span>
                <span className="text-slate-700 font-bold">{formatTemp(day.p90Temp, unit)}</span>
              </div>
            </div>
          </div>

          {/* Agronomic Guidance & Field Activity Recommendation */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Recommended Farm Activity for this Day</span>
            </h4>
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-950 font-medium leading-relaxed">
              {day.agriculturalImpact}
            </div>
          </div>

          {/* Field Operations Suitability Badges */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-500 font-semibold block">Irrigation Window</span>
              <span className="font-bold text-slate-800">
                {day.rainAmount > 5 ? 'Delay (Rain anticipated)' : 'Favorable early morning'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-500 font-semibold block">Spraying Window</span>
              <span className="font-bold text-slate-800">
                {day.windSpeed > 18 ? 'Caution (Wind drift)' : 'Safe (6:00 AM – 9:00 AM)'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
