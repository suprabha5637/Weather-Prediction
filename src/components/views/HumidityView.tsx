import React from 'react';
import {
  Droplets,
  TrendingUp,
  AlertTriangle,
  Bug,
  ShieldAlert,
} from 'lucide-react';
import { WeatherDataState, Language } from '../../types/weather';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface HumidityViewProps {
  weather: WeatherDataState;
  language: Language;
}

export const HumidityView: React.FC<HumidityViewProps> = ({ weather }) => {
  const currentRH = weather.current.humidity;

  const getInterpretation = (rh: number): { level: string; color: string; desc: string } => {
    if (rh < 40) {
      return {
        level: 'Low',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        desc: 'Accelerated soil drying and increased plant transpiration. Irrigation required.',
      };
    } else if (rh <= 65) {
      return {
        level: 'Comfortable',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        desc: 'Ideal microclimatic humidity for balanced photosynthetic assimilation and low pathogen pressure.',
      };
    } else if (rh <= 80) {
      return {
        level: 'High',
        color: 'text-sky-700 bg-sky-50 border-sky-200',
        desc: 'Reduced plant transpiration rate. Elevated risk of bacterial leaf blight and fungal spore germination.',
      };
    } else {
      return {
        level: 'Very High',
        color: 'text-red-700 bg-red-50 border-red-200',
        desc: 'Extreme relative humidity. Dew persists on foliage; severe alert for powdery mildew, blast, and aphids.',
      };
    }
  };

  const status = getInterpretation(currentRH);

  const hourlyData = weather.hourly.map((h) => ({
    time: h.time,
    humidity: h.humidity,
  }));

  const forecastData = weather.daily15.map((d) => ({
    date: d.dateStr,
    humidity: d.humidity,
  }));

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-cyan-950 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-5 h-5 text-cyan-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">
              Atmospheric Moisture & Pathogen Risk
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Relative Humidity & Foliar Moisture Dynamics
          </h1>
          <p className="text-xs text-cyan-100/90 mt-1 max-w-xl">
            Live relative humidity tracking and fungal risk monitoring for{' '}
            <strong>{weather.location.name}, {weather.location.state}</strong>.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/20 text-center">
          <span className="text-cyan-200 block text-[10px] uppercase font-bold">
            Current Humidity
          </span>
          <span className="text-2xl font-black text-white">{currentRH}%</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Agricultural Status
          </span>
          <span
            className={`text-lg font-bold px-2 py-0.5 rounded-full border inline-block ${status.color}`}
          >
            {status.level}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1.5">
            Based on current {currentRH}% RH
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Dew Point</span>
          <span className="text-2xl font-black text-slate-900">
            {weather.current.dewPoint}°C
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Condensation threshold
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Fungal Disease Risk
          </span>
          <span
            className={`text-2xl font-black ${
              currentRH > 75 ? 'text-red-600' : 'text-emerald-700'
            }`}
          >
            {currentRH > 75 ? 'Elevated' : 'Low'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Aphid and blast susceptibility
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            15-Day RH Range
          </span>
          <span className="text-xl font-black text-slate-900">
            {weather.metrics.humidityRange}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Min & Max forecast
          </span>
        </div>
      </div>

      {/* Hourly Chart */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          24-Hour Diurnal Humidity Curve (%)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Tracking nocturnal humidity buildup and afternoon drop.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" unit="%" domain={[30, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                name="Relative Humidity (%)"
                stroke="#0284c7"
                strokeWidth={2.5}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agronomic Guidance */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Bug className="w-4 h-4 text-emerald-700" />
          <span>Agricultural Interpretation & Pathogen Advisory</span>
        </h4>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-medium">
          {status.desc}
        </div>
      </div>
    </div>
  );
};
