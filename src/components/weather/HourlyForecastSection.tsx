import React from 'react';
import { Clock, Droplets, Wind, Sun, CloudSun, CloudRain } from 'lucide-react';
import { HourlyForecast, TemperatureUnit, Language } from '../../types/weather';
import { formatTemp } from '../../services/weatherService';

interface HourlyForecastSectionProps {
  hourly: HourlyForecast[];
  unit: TemperatureUnit;
  language: Language;
}

export const HourlyForecastSection: React.FC<HourlyForecastSectionProps> = ({
  hourly,
  unit,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
            <Clock className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Hourly Weather Forecast
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Hour-by-hour temperature, rain probability, and wind trajectory
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
          24-Hour Timeline
        </span>
      </div>

      {/* Horizontally scrollable strip */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex gap-2.5 min-w-[850px]">
          {hourly.map((hour, idx) => (
            <div
              key={idx}
              className="flex-1 bg-slate-50 hover:bg-emerald-50/50 rounded-xl p-3 border border-slate-200/80 transition-all text-center flex flex-col justify-between items-center group cursor-pointer shadow-2xs"
            >
              <span className="text-xs font-bold text-slate-700 mb-1">
                {hour.time}
              </span>

              <div className="my-2 p-1.5 rounded-full bg-white shadow-2xs group-hover:scale-110 transition-transform">
                {hour.icon === 'sunny' ? (
                  <Sun className="w-5 h-5 text-amber-500 fill-amber-400" />
                ) : hour.icon === 'rain' ? (
                  <CloudRain className="w-5 h-5 text-blue-500" />
                ) : (
                  <CloudSun className="w-5 h-5 text-amber-500" />
                )}
              </div>

              <span className="text-sm font-extrabold text-slate-900 mb-1">
                {formatTemp(hour.temp, unit)}
              </span>

              <div className="w-full pt-1.5 border-t border-slate-200/60 space-y-1 text-[10px]">
                <div className="flex items-center justify-center gap-1 text-blue-600 font-bold">
                  <Droplets className="w-3 h-3" />
                  <span>{hour.rainProb}%</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-teal-700 font-semibold">
                  <Wind className="w-3 h-3" />
                  <span>{hour.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
