import React from 'react';
import {
  TrendingUp,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Gauge,
  Cloud,
  Sun,
  Eye,
} from 'lucide-react';
import { DetailedForecastMetrics, DailyForecast, Language } from '../../types/weather';
import { getTranslation } from '../../utils/translations';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface WeatherTrendsAndMetricsProps {
  daily: DailyForecast[];
  metrics: DetailedForecastMetrics;
  language: Language;
}

export const WeatherTrendsAndMetrics: React.FC<WeatherTrendsAndMetricsProps> = ({
  daily,
  metrics,
  language,
}) => {
  const chartData = daily.map((d) => ({
    date: d.dateStr,
    maxTemp: d.maxTemp,
    minTemp: d.minTemp,
    rainfall: d.rainAmount,
  }));

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      {/* 1. Weather Trends (Next 15 Days) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              {getTranslation(language, 'weatherTrends')}
            </h2>
          </div>

          {/* Legend indicators */}
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <div className="flex items-center gap-1 text-rose-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Max Temp (°C)</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-600">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span>Min Temp (°C)</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
              <span>Rainfall (mm)</span>
            </div>
          </div>
        </div>

        {/* Dual Axis Interactive Line & Bar Chart */}
        <div className="w-full h-44 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis yAxisId="temp" tick={{ fontSize: 10 }} stroke="#94a3b8" domain={[15, 42]} />
              <YAxis yAxisId="rain" orientation="right" tick={{ fontSize: 10 }} stroke="#10b981" domain={[0, 40]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  fontSize: '11px',
                }}
              />
              <Bar yAxisId="rain" dataKey="rainfall" fill="#10b981" radius={[3, 3, 0, 0]} barSize={8} />
              <Line yAxisId="temp" type="monotone" dataKey="maxTemp" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
              <Line yAxisId="temp" type="monotone" dataKey="minTemp" stroke="#06b6d4" strokeWidth={2} dot={{ r: 2 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Detailed Forecast Metrics (Next 15 Days) */}
      <div className="pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-800 tracking-tight mb-2.5">
          {getTranslation(language, 'detailedMetrics')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
          {/* Left Column */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                <span>Total Expected Rainfall</span>
              </div>
              <span className="font-bold text-slate-800 font-mono">
                {metrics.totalExpectedRainfall} mm
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                <span>Average Rain Probability</span>
              </div>
              <span className="font-bold text-slate-800 font-mono">
                {metrics.avgRainProbability}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                <span>Highest Temperature</span>
              </div>
              <span className="font-bold text-slate-800">
                {metrics.highestTemperature}°C <span className="text-[10px] text-slate-400 font-normal">({metrics.highestTempDates})</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Thermometer className="w-3.5 h-3.5 text-blue-500" />
                <span>Lowest Temperature</span>
              </div>
              <span className="font-bold text-slate-800">
                {metrics.lowestTemperature}°C <span className="text-[10px] text-slate-400 font-normal">({metrics.lowestTempDates})</span>
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Droplets className="w-3.5 h-3.5 text-slate-400" />
                <span>Humidity Range</span>
              </div>
              <span className="font-semibold text-slate-800">{metrics.humidityRange}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Wind className="w-3.5 h-3.5 text-slate-400" />
                <span>Wind Speed</span>
              </div>
              <span className="font-semibold text-slate-800">{metrics.windSpeedRange}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                <span>Wind Direction</span>
              </div>
              <span className="font-semibold text-slate-800">{metrics.windDirection}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                <span>Pressure</span>
              </div>
              <span className="font-semibold text-slate-800">{metrics.pressureRange}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Cloud className="w-3.5 h-3.5 text-slate-400" />
                <span>Cloud Cover</span>
              </div>
              <span className="font-semibold text-slate-800">{metrics.cloudCoverRange}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>UV Index</span>
              </div>
              <span className="font-semibold text-slate-800">{metrics.uvIndexRange}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Visibility</span>
              </div>
              <span className="font-semibold text-slate-800">{metrics.visibilityRange}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
