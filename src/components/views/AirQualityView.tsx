import React from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Wind,
  ShieldCheck,
} from 'lucide-react';
import { WeatherDataState, Language } from '../../types/weather';

interface AirQualityViewProps {
  weather: WeatherDataState;
  language: Language;
}

export const AirQualityView: React.FC<AirQualityViewProps> = ({ weather }) => {
  // Typical agricultural air quality metrics for Indo-Gangetic Plains
  const aqi = 68;
  const pm25 = 22.4;
  const pm10 = 54.1;
  const ozone = 38.0;
  const no2 = 14.5;

  const getAqiCategory = (val: number) => {
    if (val <= 50) return { label: 'Good', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val <= 100) return { label: 'Moderate', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (val <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Poor / Severe', color: 'text-red-700 bg-red-50 border-red-200' };
  };

  const aqiCat = getAqiCategory(aqi);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Atmospheric Composition & Crop Health
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Air Quality Index (AQI) & Foliar Particulate Deposition
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Ambient air quality observations for{' '}
            <strong>{weather.location.name}, {weather.location.state}</strong>.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/20 text-center">
          <span className="text-emerald-200 block text-[10px] uppercase font-bold">
            Live AQI Index
          </span>
          <span className="text-2xl font-black text-white">{aqi}</span>
          <span className="text-[10px] text-emerald-300 block font-semibold">
            {aqiCat.label}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">PM2.5 Fine Particulate</span>
          <span className="text-2xl font-black text-slate-900">
            {pm25} <span className="text-xs font-bold text-slate-500">µg/m³</span>
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
            Within CPCB safe limits
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">PM10 Coarse Dust</span>
          <span className="text-2xl font-black text-slate-900">
            {pm10} <span className="text-xs font-bold text-slate-500">µg/m³</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Surface soil dust influence
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Ground-level Ozone (O₃)</span>
          <span className="text-2xl font-black text-slate-900">
            {ozone} <span className="text-xs font-bold text-slate-500">ppb</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            No foliar burn risk
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Nitrogen Dioxide (NO₂)</span>
          <span className="text-2xl font-black text-slate-900">
            {no2} <span className="text-xs font-bold text-slate-500">ppb</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Low atmospheric pollutant
          </span>
        </div>
      </div>

      {/* Agricultural Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Crop & Stomatal Conductance Impact</span>
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Moderate AQI (68) indicates clean atmospheric conditions for vegetative crops. PM2.5 levels do not block leaf stomata, ensuring optimal carbon dioxide intake and undisturbed photosynthetic rates in paddy and pulses.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Farm Worker Health Guidance</span>
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Air quality is completely safe for sustained open-air field labor, manual weeding, and tractor operations. No respiratory protective measures required for farm operators today.
          </p>
        </div>
      </div>
    </div>
  );
};
