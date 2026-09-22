import React from 'react';
import {
  Wind,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Navigation,
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

interface WindViewProps {
  weather: WeatherDataState;
  language: Language;
}

export const WindView: React.FC<WindViewProps> = ({ weather }) => {
  const currentSpeed = weather.current.windSpeed;
  const currentDir = weather.current.windDirection;
  const gustSpeed = Math.round(currentSpeed * 1.4);

  const isSafeForSpraying = currentSpeed >= 5 && currentSpeed <= 14;

  const hourlyData = weather.hourly.map((h) => ({
    time: h.time,
    wind: h.windSpeed,
  }));

  const forecastData = weather.daily15.map((d) => ({
    date: d.dateStr,
    wind: d.windSpeed,
    dir: d.windDirection,
  }));

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-5 h-5 text-teal-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
              Wind Field & Spray Drift Management
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Wind Velocity, Direction & Chemical Application Windows
          </h1>
          <p className="text-xs text-teal-100/90 mt-1 max-w-xl">
            Real-time aerodynamic tracking for{' '}
            <strong>{weather.location.name}, {weather.location.state}</strong>.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/20 text-center">
          <span className="text-teal-200 block text-[10px] uppercase font-bold">
            Wind Velocity
          </span>
          <span className="text-2xl font-black text-white">
            {currentSpeed} <span className="text-xs font-bold text-teal-200">km/h</span>
          </span>
          <span className="text-[10px] text-teal-300 block">
            Heading: {currentDir}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Current Wind Speed
          </span>
          <span className="text-2xl font-black text-slate-900">
            {currentSpeed} <span className="text-xs font-bold text-slate-500">km/h</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Calibrated at 10m height
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Wind Direction
          </span>
          <span className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
            <Navigation className="w-5 h-5 text-teal-600 rotate-45" />
            <span>{currentDir}</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            North-Westerly airflow
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Peak Wind Gusts
          </span>
          <span className="text-2xl font-black text-slate-900">
            {gustSpeed} <span className="text-xs font-bold text-slate-500">km/h</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Instantaneous maximum
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Chemical Spray Window
          </span>
          <span
            className={`text-lg font-bold px-2 py-0.5 rounded-full border inline-block ${
              isSafeForSpraying
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {isSafeForSpraying ? 'Safe Window' : 'Caution / Delay'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1.5">
            {isSafeForSpraying ? 'Minimal drift risk' : 'High drift / volatilization'}
          </span>
        </div>
      </div>

      {/* Hourly Wind Curve */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          24-Hour Hourly Wind Speed Trend (km/h)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Optimum ground spraying window is typically early morning when wind speed is &lt; 12 km/h.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" unit=" km/h" />
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
                dataKey="wind"
                name="Wind Speed (km/h)"
                stroke="#0d9488"
                strokeWidth={2.5}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agricultural Advice Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Farm Practical Spraying & Operations Advisory</span>
        </h4>
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-medium leading-relaxed">
          {currentSpeed > 15
            ? 'Wind conditions may affect spraying. Sustained winds above 15 km/h cause droplet drift into non-target areas and rapid evaporation. Delay herbicide and pesticide applications until morning calm.'
            : 'Wind conditions are ideal for crop spraying. Gentle breezes (8–12 km/h) ensure uniform foliar coverage without chemical drift.'}
        </div>
      </div>
    </div>
  );
};
