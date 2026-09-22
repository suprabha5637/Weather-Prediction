import React from 'react';
import {
  Sun,
  CloudSun,
  Droplets,
  Wind,
  Gauge,
  Eye,
  SunMedium,
} from 'lucide-react';
import { CurrentWeather, TemperatureUnit, Language } from '../../types/weather';
import { formatTemp } from '../../services/weatherService';
import { getTranslation } from '../../utils/translations';

interface CurrentWeatherCardProps {
  current: CurrentWeather;
  unit: TemperatureUnit;
  language: Language;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  current,
  unit,
  language,
}) => {
  return (
    <div className="bg-gradient-to-br from-white via-slate-50/60 to-emerald-50/20 rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-xs flex flex-col justify-between h-full min-w-0">
      {/* Top Header Row: Section Title & Date/Time Badge */}
      <div className="flex items-center justify-between gap-1 pb-2 border-b border-slate-100/90 min-w-0">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight whitespace-nowrap">
          {getTranslation(language, 'currentWeather')}
        </h3>
        <span className="text-[10.5px] font-medium bg-slate-100/90 border border-slate-200/80 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
          {current.timestamp}
        </span>
      </div>

      {/* Main Weather Area: Clean 2-Column Layout spanning natural card height */}
      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 my-2 min-w-0">
        {/* LEFT / MAIN WEATHER AREA: Icon + Temp + Condition + Feels like (approx 48-50% width) */}
        <div className="flex items-start gap-2 min-w-0 shrink-0 sm:w-[110px]">
          {/* Weather Condition Icon (48px, rounded-2xl, never squeezed) */}
          <div className="relative shrink-0 mt-0.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200/80 flex items-center justify-center shadow-xs">
              <Sun className="w-6 h-6 sm:w-6.5 sm:h-6.5 text-amber-500 fill-amber-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-2xs border border-slate-200/80">
              <CloudSun className="w-3.5 h-3.5 text-teal-600" />
            </div>
          </div>

          {/* Temperature, Condition, and Feels-like stack */}
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-3xl font-black text-slate-900 tracking-tight leading-none whitespace-nowrap">
              {formatTemp(current.temp, unit)}
            </span>
            <span className="text-xs font-bold text-slate-700 leading-tight whitespace-nowrap mt-1">
              {current.condition}
            </span>
            <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap mt-0.5">
              {getTranslation(language, 'feelsLike')} {formatTemp(current.feelsLike, unit)}
            </span>
          </div>
        </div>

        {/* RIGHT / WEATHER METRICS AREA: Structured column filling vertical space with mini-cards */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5 pl-2 border-l border-slate-200/70">
          {/* Humidity */}
          <div className="flex items-center justify-between gap-1 px-1.5 py-1 rounded-lg bg-slate-50/70 border border-slate-100 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0 text-slate-500">
              <Droplets className="w-3 h-3 text-blue-500 shrink-0" />
              <span className="text-[10px] font-medium whitespace-nowrap">
                {getTranslation(language, 'humidity')}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap text-right shrink-0">
              {current.humidity}%
            </span>
          </div>

          {/* Wind */}
          <div className="flex items-center justify-between gap-1 px-1.5 py-1 rounded-lg bg-slate-50/70 border border-slate-100 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0 text-slate-500">
              <Wind className="w-3 h-3 text-teal-600 shrink-0" />
              <span className="text-[10px] font-medium whitespace-nowrap">
                {getTranslation(language, 'wind')}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap text-right shrink-0">
              {current.windSpeed} km/h <span className="text-[9px] font-semibold text-slate-500">{current.windDirection}</span>
            </span>
          </div>

          {/* Pressure */}
          <div className="flex items-center justify-between gap-1 px-1.5 py-1 rounded-lg bg-slate-50/70 border border-slate-100 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0 text-slate-500">
              <Gauge className="w-3 h-3 text-indigo-500 shrink-0" />
              <span className="text-[10px] font-medium whitespace-nowrap">
                {getTranslation(language, 'pressure')}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap text-right shrink-0">
              {current.pressure} hPa
            </span>
          </div>

          {/* Visibility */}
          <div className="flex items-center justify-between gap-1 px-1.5 py-1 rounded-lg bg-slate-50/70 border border-slate-100 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0 text-slate-500">
              <Eye className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="text-[10px] font-medium whitespace-nowrap">
                {getTranslation(language, 'visibility')}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap text-right shrink-0">
              {current.visibility} km
            </span>
          </div>

          {/* UV Index */}
          <div className="flex items-center justify-between gap-1 px-1.5 py-1 rounded-lg bg-slate-50/70 border border-slate-100 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0 text-slate-500">
              <SunMedium className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="text-[10px] font-medium whitespace-nowrap">
                {getTranslation(language, 'uvIndex')}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap text-right shrink-0">
              {current.uvIndex} <span className="text-[9px] font-semibold text-amber-600">{current.uvLevel}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Information: Dew Point, Sunrise, Sunset with equal spacing */}
      <div className="pt-2 border-t border-slate-100/90 flex items-center justify-between text-[10px] text-slate-500 font-medium min-w-0">
        <span className="whitespace-nowrap">
          Dew Point: <strong className="text-slate-700 font-semibold">{formatTemp(current.dewPoint, unit)}</strong>
        </span>
        <span className="text-slate-300 select-none">•</span>
        <span className="whitespace-nowrap">
          Sunrise: <strong className="text-slate-700 font-semibold">{current.sunrise}</strong>
        </span>
        <span className="text-slate-300 select-none">•</span>
        <span className="whitespace-nowrap">
          Sunset: <strong className="text-slate-700 font-semibold">{current.sunset}</strong>
        </span>
      </div>
    </div>
  );
};
