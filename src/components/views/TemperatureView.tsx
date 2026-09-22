import React from 'react';
import {
  Thermometer,
  Flame,
  TrendingUp,
  AlertTriangle,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { WeatherDataState, TemperatureUnit, Language } from '../../types/weather';
import { formatTemp, convertTemp } from '../../services/weatherService';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface TemperatureViewProps {
  weather: WeatherDataState;
  unit: TemperatureUnit;
  onToggleUnit: (u: TemperatureUnit) => void;
  language: Language;
}

export const TemperatureView: React.FC<TemperatureViewProps> = ({
  weather,
  unit,
  onToggleUnit,
}) => {
  const chartData = weather.daily15.map((d) => ({
    date: d.dateStr,
    maxTemp: convertTemp(d.maxTemp, unit),
    minTemp: convertTemp(d.minTemp, unit),
  }));

  const hourlyChartData = weather.hourly.map((h) => ({
    time: h.time,
    temp: convertTemp(h.temp, unit),
    feelsLike: convertTemp(h.feelsLike, unit),
  }));

  const maxTemp = weather.metrics.highestTemperature;
  const isHeatWave = maxTemp >= 37;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-rose-900 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Thermal Microclimate Intelligence
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Temperature Analytics & Heat Stress Risk
          </h1>
          <p className="text-xs text-amber-100/90 mt-1 max-w-xl">
            Real-time thermal monitoring for{' '}
            <strong>{weather.location.name}, {weather.location.state}</strong>.
          </p>
        </div>

        {/* Global Unit Switcher inside view */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs p-1.5 rounded-xl border border-white/20">
          <button
            onClick={() => onToggleUnit('C')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              unit === 'C' ? 'bg-white text-slate-900 shadow-xs' : 'text-amber-100 hover:text-white'
            }`}
          >
            Celsius (°C)
          </button>
          <button
            onClick={() => onToggleUnit('F')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              unit === 'F' ? 'bg-white text-slate-900 shadow-xs' : 'text-amber-100 hover:text-white'
            }`}
          >
            Fahrenheit (°F)
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Thermometer className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium">Current Temperature</span>
          </div>
          <span className="text-2xl font-black text-slate-900">
            {formatTemp(weather.current.temp, unit)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Feels like {formatTemp(weather.current.feelsLike, unit)}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium">15-Day Maximum</span>
          </div>
          <span className="text-2xl font-black text-slate-900">
            {formatTemp(weather.metrics.highestTemperature, unit)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Peak period: {weather.metrics.highestTempDates}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Sun className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-medium">15-Day Minimum</span>
          </div>
          <span className="text-2xl font-black text-slate-900">
            {formatTemp(weather.metrics.lowestTemperature, unit)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Night minimum: {weather.metrics.lowestTempDates}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-medium">Heat Stress Index</span>
          </div>
          <span
            className={`text-2xl font-black ${
              isHeatWave ? 'text-red-600' : 'text-emerald-700'
            }`}
          >
            {isHeatWave ? 'High Risk' : 'Normal / Safe'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {isHeatWave ? 'Apply light mulching' : 'Comfortable growth window'}
          </span>
        </div>
      </div>

      {/* Hourly Temperature Chart */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          24-Hour Diurnal Temperature Cycle
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Tracking temperature curve and apparent temperature (feels like) throughout the day.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" unit={`°${unit}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="temp"
                name={`Temperature (°${unit})`}
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="feelsLike"
                name={`Feels Like (°${unit})`}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 15-Day Temperature Trend */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          15-Day Daily Maximum & Minimum Temperature Trend
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Visualizing day/night thermal range to detect heat stress or cold shock anomalies.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" unit={`°${unit}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="maxTemp"
                name={`Max Temp (°${unit})`}
                stroke="#dc2626"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="minTemp"
                name={`Min Temp (°${unit})`}
                stroke="#0284c7"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
