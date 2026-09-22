import React from 'react';
import {
  SunMedium,
  Sun,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
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

interface UVIndexViewProps {
  weather: WeatherDataState;
  language: Language;
}

export const UVIndexView: React.FC<UVIndexViewProps> = ({ weather }) => {
  const currentUV = weather.current.uvIndex;
  const maxUV = Math.max(...weather.hourly.map((h) => h.uv), currentUV);

  const getUvRisk = (val: number) => {
    if (val <= 2) return { level: 'Low', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val <= 5) return { level: 'Moderate', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (val <= 7) return { level: 'High', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    if (val <= 10) return { level: 'Very High', color: 'text-red-700 bg-red-50 border-red-200' };
    return { level: 'Extreme', color: 'text-purple-700 bg-purple-50 border-purple-200' };
  };

  const risk = getUvRisk(currentUV);

  const hourlyData = weather.hourly.map((h) => ({
    time: h.time,
    uv: h.uv,
  }));

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SunMedium className="w-5 h-5 text-amber-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Ultraviolet Solar Radiation
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            UV Index & Photobiological Crop Exposure
          </h1>
          <p className="text-xs text-amber-100/90 mt-1 max-w-xl">
            Solar ultraviolet index and sun-scald risk monitoring for{' '}
            <strong>{weather.location.name}, {weather.location.state}</strong>.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/20 text-center">
          <span className="text-amber-100 block text-[10px] uppercase font-bold">
            Current UV Index
          </span>
          <span className="text-3xl font-black text-white">{currentUV}</span>
          <span className="text-[10px] text-amber-200 block font-bold">
            {risk.level}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Current UV Value</span>
          <span className="text-2xl font-black text-slate-900">{currentUV} / 12</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Scale 0 to 12+</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Peak Midday UV</span>
          <span className="text-2xl font-black text-amber-600">{maxUV} / 12</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Occurring 12 PM – 2 PM</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Risk Category</span>
          <span className={`text-base font-bold px-2 py-0.5 rounded-full border inline-block ${risk.color}`}>
            {risk.level} Risk
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">WHO / WMO standard</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Sun-Scald Hazard</span>
          <span className="text-2xl font-black text-emerald-700">Low to Moderate</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Vegetable crops safe</span>
        </div>
      </div>

      {/* Hourly Chart */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Hourly UV Radiation Curve (0 to 12+)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Peak solar UV occurs between 11:30 AM and 2:30 PM. Plan intensive field operations accordingly.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" domain={[0, 12]} />
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
                dataKey="uv"
                name="UV Index"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agricultural Advice Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Crop Sun-Scald Prevention</span>
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Moderate UV levels ({currentUV}) promote healthy cuticle development in tomatoes and capsicums without bleaching chlorophyll. If peak UV rises above 8, provide shade cloth or straw mulching for nursery saplings.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Farmer Protection Measures</span>
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Avoid prolonged unshaded labor between 12:00 PM and 2:00 PM. Wear wide-brimmed cotton hats and stay hydrated to avoid solar heat exhaustion.
          </p>
        </div>
      </div>
    </div>
  );
};
