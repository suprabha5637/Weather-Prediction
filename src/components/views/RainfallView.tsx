import React, { useState } from 'react';
import {
  CloudRain,
  Droplets,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { WeatherDataState, TemperatureUnit, Language } from '../../types/weather';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { exportForecastCsv, downloadFile } from '../../services/weatherService';

interface RainfallViewProps {
  weather: WeatherDataState;
  unit: TemperatureUnit;
  language: Language;
}

export const RainfallView: React.FC<RainfallViewProps> = ({
  weather,
  locationName = weather.location.name,
}: RainfallViewProps & { locationName?: string }) => {
  const [horizon, setHorizon] = useState<'7' | '15'>('15');

  const filteredDays =
    horizon === '7' ? weather.daily15.slice(0, 7) : weather.daily15;

  const rainChartData = filteredDays.map((d) => ({
    date: d.dateStr,
    rain: d.rainAmount,
    prob: d.rainProb,
  }));

  const cumulativeRain = filteredDays.reduce((acc, cur) => acc + cur.rainAmount, 0);
  const maxRainDay = [...filteredDays].sort((a, b) => b.rainAmount - a.rainAmount)[0];

  const handleExport = () => {
    const csv = exportForecastCsv(weather.daily15, weather.location.name);
    downloadFile(csv, `KrishiGo_Rainfall_${weather.location.name}.csv`, 'text/csv;charset=utf-8;');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-sky-900 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CloudRain className="w-5 h-5 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
              Precipitation & Monsoon Intelligence
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Rainfall Prediction & Field Drainage Analysis
          </h1>
          <p className="text-xs text-sky-200/90 mt-1 max-w-xl">
            High-resolution convective and stratiform precipitation forecast for{' '}
            <strong>{weather.location.name}, {weather.location.state}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/20 text-xs">
            <span className="text-sky-200 block text-[10px]">Today's Rain Chance</span>
            <span className="font-extrabold text-white text-base">
              {weather.current.rainChanceToday}%
            </span>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium">Cumulative Rain ({horizon} Days)</span>
          </div>
          <span className="text-2xl font-black text-slate-900">
            {cumulativeRain.toFixed(1)} <span className="text-xs font-bold text-slate-500">mm</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {cumulativeRain > 50 ? 'Above normal monsoon quota' : 'Normal rainfall levels'}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium">Peak Rainfall Day</span>
          </div>
          <span className="text-2xl font-black text-slate-900">
            {maxRainDay ? `${maxRainDay.rainAmount} mm` : '0 mm'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Expected on {maxRainDay?.dateStr || 'N/A'}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-medium">Rain Days ({horizon}d)</span>
          </div>
          <span className="text-2xl font-black text-slate-900">
            {filteredDays.filter((d) => d.rainAmount > 1).length}{' '}
            <span className="text-xs font-bold text-slate-500">Days</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Days with precipitation &gt; 1 mm
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium">Waterlogging Risk</span>
          </div>
          <span
            className={`text-2xl font-black ${
              cumulativeRain > 60 ? 'text-red-600' : 'text-emerald-700'
            }`}
          >
            {cumulativeRain > 60 ? 'High' : cumulativeRain > 30 ? 'Moderate' : 'Low'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Drainage channels required
          </span>
        </div>
      </div>

      {/* Main Rainfall Chart Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Daily Expected Precipitation Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Calibrated precipitation amounts and probability from ECMWF and IMD NWP.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setHorizon('7')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                horizon === '7' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setHorizon('15')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                horizon === '15' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              15 Days
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rainChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" unit="mm" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="rain" name="Rainfall (mm)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Field Activity Recommendations Based on Rainfall */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Agronomic Water Management Strategy</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>
                <strong>Pre-Rainfall Window:</strong> Suspend fertilizer application 24 hours prior to forecasted rainfall events exceeding 10 mm to prevent leaching.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>
                <strong>Irrigation Offset:</strong> Every 5 mm of rainfall offsets approximately 1 full day of furrow irrigation demand in flowering paddy.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>
                <strong>Post-Rain Drainage:</strong> Ensure water drains from vegetable beds within 6 hours to prevent collar rot and damp-off.
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Heavy Rain Advisory Status</span>
          </h4>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium leading-relaxed">
            {weather.metrics.totalExpectedRainfall > 50
              ? 'Convective monsoon surge forecasted mid-horizon. Reinforce field bunds and ensure open outlets in lowland paddy plots.'
              : 'Precipitation is anticipated to remain moderate. Favorable conditions for normal irrigation and weed management.'}
          </div>
        </div>
      </div>
    </div>
  );
};
