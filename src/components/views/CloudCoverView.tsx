import React from 'react';
import {
  CloudSun,
  Sun,
  CloudRain,
  Zap,
  CheckCircle2,
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

interface CloudCoverViewProps {
  weather: WeatherDataState;
  language: Language;
}

export const CloudCoverView: React.FC<CloudCoverViewProps> = ({ weather }) => {
  const currentCloud = weather.current.cloudCover;

  const hourlyData = weather.hourly.map((h) => ({
    time: h.time,
    cloud: h.cloudCover,
  }));

  const forecastData = weather.daily15.map((d) => ({
    date: d.dateStr,
    cloud: d.cloudCover,
    rainProb: d.rainProb,
  }));

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CloudSun className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Solar Radiation & Cloud Dynamics
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Cloud Cover, Sunlight Hours & Solar Irradiance
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Photosynthetically active radiation (PAR) estimates for{' '}
            <strong>{weather.location.name}, {weather.location.state}</strong>.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/20 text-center">
          <span className="text-amber-200 block text-[10px] uppercase font-bold">
            Current Cloud Cover
          </span>
          <span className="text-2xl font-black text-white">{currentCloud}%</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Solar Conditions</span>
          <span className="text-lg font-bold text-slate-900 block">
            {currentCloud < 30 ? 'High Sunlight' : currentCloud < 70 ? 'Filtered / Partial' : 'Diffuse Overcast'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {currentCloud < 40 ? 'Optimal for photosynthesis' : 'Moderate solar flux'}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Sun-Drying Window</span>
          <span className="text-lg font-bold text-emerald-700 block">
            {currentCloud < 50 ? 'Excellent Window' : 'Poor Drying Window'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            For harvested grains & chili
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Rain Linkage</span>
          <span className="text-lg font-bold text-slate-900 block">
            {weather.current.rainChanceToday}% Rain Chance
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Convective cloud fraction
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Estimated Sunshine</span>
          <span className="text-2xl font-black text-slate-900">
            {currentCloud < 40 ? '8.5' : currentCloud < 70 ? '5.2' : '2.0'}{' '}
            <span className="text-xs font-bold text-slate-500">Hours</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Effective daylight exposure
          </span>
        </div>
      </div>

      {/* Hourly Chart */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          24-Hour Hourly Cloud Cover Percentage
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Tracking sky coverage progression throughout daylight and night hours.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" unit="%" domain={[0, 100]} />
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
                dataKey="cloud"
                name="Cloud Cover (%)"
                stroke="#64748b"
                strokeWidth={2.5}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Field Activity Recommendations */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Agricultural Guidance Linked to Cloud Cover</span>
        </h4>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          With partial cloud cover ({currentCloud}%), solar radiation remains sufficient for robust seedling vegetative development while shielding young crops from severe leaf scorch. Today is ideal for nursery transplanting, soil aerating, and post-harvest produce sun drying.
        </p>
      </div>
    </div>
  );
};
