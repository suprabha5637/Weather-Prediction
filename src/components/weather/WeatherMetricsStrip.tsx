import React from 'react';
import {
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Cloud,
  Sun,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { CurrentWeather, TemperatureUnit, Language } from '../../types/weather';
import { formatTemp } from '../../services/weatherService';

interface WeatherMetricsStripProps {
  current: CurrentWeather;
  unit: TemperatureUnit;
  language: Language;
}

export const WeatherMetricsStrip: React.FC<WeatherMetricsStripProps> = ({
  current,
  unit,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-4">
      {/* 1. Rain Chance Today */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold">Rain Chance</span>
          <CloudRain className="w-4 h-4 text-blue-500" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight block">
            {current.rainChanceToday}%
          </span>
          <span className="text-[10px] text-slate-400 font-medium block">
            {current.rainAmountToday} mm today
          </span>
        </div>
      </div>

      {/* 2. Max Temperature */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold">Max Temp</span>
          <Thermometer className="w-4 h-4 text-rose-500" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight block">
            {formatTemp(current.maxTemp, unit)}
          </span>
          <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5">
            <ArrowUp className="w-3 h-3" />
            <span>{current.maxTempTrend}°C vs avg</span>
          </span>
        </div>
      </div>

      {/* 3. Min Temperature */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold">Min Temp</span>
          <Thermometer className="w-4 h-4 text-blue-500" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight block">
            {formatTemp(current.minTemp, unit)}
          </span>
          <span className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5">
            <ArrowDown className="w-3 h-3" />
            <span>{Math.abs(current.minTempTrend)}°C vs avg</span>
          </span>
        </div>
      </div>

      {/* 4. Humidity */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold">Humidity</span>
          <Droplets className="w-4 h-4 text-cyan-600" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight block">
            {current.humidity}%
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block">
            Comfortable
          </span>
        </div>
      </div>

      {/* 5. Wind Speed */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold">Wind Speed</span>
          <Wind className="w-4 h-4 text-teal-600" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight block">
            {current.windSpeed} <span className="text-xs font-semibold text-slate-500">km/h</span>
          </span>
          <span className="text-[10px] text-slate-600 font-semibold block">
            {current.windDirection}
          </span>
        </div>
      </div>

      {/* 6. Visibility */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold">Visibility</span>
          <Eye className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight block">
            {current.visibility} <span className="text-xs font-semibold text-slate-500">km</span>
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block">
            Good
          </span>
        </div>
      </div>

      {/* 7. Cloud Cover */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold">Cloud Cover</span>
          <Cloud className="w-4 h-4 text-slate-400" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight block">
            {current.cloudCover}%
          </span>
          <span className="text-[10px] text-slate-600 font-semibold block truncate">
            Partly Cloudy
          </span>
        </div>
      </div>

      {/* 8. UV Index */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold">UV Index</span>
          <Sun className="w-4 h-4 text-amber-500" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight block">
            {current.uvIndex}
          </span>
          <span className="text-[10px] text-amber-600 font-semibold block">
            {current.uvLevel}
          </span>
        </div>
      </div>
    </div>
  );
};
