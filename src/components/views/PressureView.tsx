import React from 'react';
import {
  Gauge,
  TrendingDown,
  TrendingUp,
  CloudRain,
  ShieldCheck,
} from 'lucide-react';
import { WeatherDataState, Language } from '../../types/weather';

interface PressureViewProps {
  weather: WeatherDataState;
  language: Language;
}

export const PressureView: React.FC<PressureViewProps> = ({ weather }) => {
  const currentPressure = weather.current.pressure;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Barometric Altimetry & Synoptic Pressure
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Atmospheric Pressure & Storm Front Forecasting
          </h1>
          <p className="text-xs text-indigo-200/90 mt-1 max-w-xl">
            Barometric pressure monitoring for storm front advance in{' '}
            <strong>{weather.location.name}, {weather.location.state}</strong>.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/20 text-center">
          <span className="text-indigo-200 block text-[10px] uppercase font-bold">
            Current Pressure
          </span>
          <span className="text-2xl font-black text-white">
            {currentPressure} <span className="text-xs font-bold text-indigo-300">hPa</span>
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Current Sea-Level</span>
          <span className="text-2xl font-black text-slate-900">{currentPressure} hPa</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Mean sea level equivalent</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">24-Hour Barometric Trend</span>
          <span className="text-lg font-bold text-emerald-700 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> Stable (+1.2 hPa)
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">No sudden trough drop</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">15-Day Pressure Range</span>
          <span className="text-xl font-black text-slate-900">{weather.metrics.pressureRange}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Forecast envelope</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Depression Alert</span>
          <span className="text-2xl font-black text-emerald-700">None</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Atmosphere stable today</span>
        </div>
      </div>

      {/* Agronomic Interpretation */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Barometric Interpretation for Farm Operations</span>
        </h4>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          A stable barometric reading of {currentPressure} hPa indicates fair weather persistence over Eastern Uttar Pradesh for the next 72 hours. When pressure drops sharply by more than 4–6 hPa in 12 hours, expect rapid convective squalls and high winds—a key early indicator for securing livestock and suspending sprayers.
        </p>
      </div>
    </div>
  );
};
