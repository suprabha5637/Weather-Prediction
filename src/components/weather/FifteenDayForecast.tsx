import React, { useState } from 'react';
import {
  Calendar,
  Table,
  LineChart as ChartIcon,
  Map as MapIcon,
  Download,
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
  Check,
  FileSpreadsheet,
  FileText,
  Layers,
} from 'lucide-react';
import { DailyForecast, TemperatureUnit, Language, WeatherDataState } from '../../types/weather';
import { formatTemp, exportForecastCsv, downloadFile, printFarmerWeatherReport } from '../../services/weatherService';
import { getTranslation } from '../../utils/translations';
import { DayDetailModal } from './DayDetailModal';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface FifteenDayForecastProps {
  daily: DailyForecast[];
  unit: TemperatureUnit;
  language: Language;
  locationName: string;
  fullWeatherState?: WeatherDataState;
}

export const FifteenDayForecast: React.FC<FifteenDayForecastProps> = ({
  daily,
  unit,
  language,
  locationName,
  fullWeatherState,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'graph' | 'map'>('cards');
  const [selectedDay, setSelectedDay] = useState<DailyForecast | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // Graph Metric Checkboxes state
  const [showTemp, setShowTemp] = useState(true);
  const [showRain, setShowRain] = useState(true);
  const [showHumidity, setShowHumidity] = useState(false);
  const [showWind, setShowWind] = useState(false);

  // Table Sort State
  const [sortField, setSortField] = useState<'day' | 'maxTemp' | 'rainAmount'>('day');
  const [sortAsc, setSortAsc] = useState(true);

  // Map Layer State
  const [mapLayer, setMapLayer] = useState<'rain' | 'temp' | 'wind' | 'clouds'>('rain');

  const handleDownloadCsv = () => {
    setShowDownloadMenu(false);
    const csvContent = exportForecastCsv(daily, locationName);
    downloadFile(csvContent, `KrishiGo_15Day_Forecast_${locationName}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleDownloadPdf = () => {
    setShowDownloadMenu(false);
    if (fullWeatherState) {
      printFarmerWeatherReport(fullWeatherState, unit);
    } else {
      window.print();
    }
  };

  const renderWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-amber-500 fill-amber-400" />;
      case 'partly-cloudy':
        return <CloudSun className="w-6 h-6 text-amber-500" />;
      case 'rain':
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'heavy-rain':
        return <CloudRain className="w-6 h-6 text-blue-700 fill-blue-500/20" />;
      case 'thunderstorm':
        return <CloudLightning className="w-6 h-6 text-purple-600" />;
      default:
        return <Sun className="w-6 h-6 text-amber-500" />;
    }
  };

  const chartData = daily.map((d) => ({
    date: d.dateStr,
    maxTemp: d.maxTemp,
    minTemp: d.minTemp,
    rainfall: d.rainAmount,
    rainProb: d.rainProb,
    humidity: d.humidity,
    wind: d.windSpeed,
  }));

  const sortedDaily = [...daily].sort((a, b) => {
    let diff = 0;
    if (sortField === 'day') diff = a.dayIndex - b.dayIndex;
    if (sortField === 'maxTemp') diff = a.maxTemp - b.maxTemp;
    if (sortField === 'rainAmount') diff = a.rainAmount - b.rainAmount;
    return sortAsc ? diff : -diff;
  });

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-4 relative">
      {/* Header with Title and 4 View Toggle Buttons */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
            <Calendar className="w-4 h-4 text-emerald-700" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {getTranslation(language, 'forecast15Day')}
          </h2>
          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
            (Click any day to inspect field guidance)
          </span>
        </div>

        {/* View Switchers & Download */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'cards'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Cards</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'tableView')}</span>
          </button>

          <button
            onClick={() => setViewMode('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'graph'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ChartIcon className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'graphView')}</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'map'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'mapView')}</span>
          </button>

          {/* Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all shadow-2xs active:scale-95 ml-1"
              title="Download Forecast Data"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>{getTranslation(language, 'download')}</span>
            </button>

            {showDownloadMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 animate-in fade-in zoom-in-95">
                <button
                  onClick={handleDownloadCsv}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Download CSV Data</span>
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Download / Print PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. CARDS VIEW (Clean horizontal scroll strip) */}
      {viewMode === 'cards' && (
        <div className="overflow-x-auto pb-2 -mx-1 px-1">
          <div className="flex gap-2 min-w-[1240px]">
            {daily.map((day) => (
              <div
                key={day.dayIndex}
                onClick={() => setSelectedDay(day)}
                className="flex-1 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 rounded-xl p-2.5 border border-slate-200/80 transition-all text-center flex flex-col justify-between items-center group cursor-pointer shadow-2xs hover:shadow-xs"
              >
                {/* Day Header */}
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block">
                    Day {day.dayIndex}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {day.dayName} {day.dateStr}
                  </span>
                </div>

                {/* Weather Condition Icon */}
                <div className="my-2 p-1.5 rounded-full bg-white shadow-2xs group-hover:scale-110 transition-transform">
                  {renderWeatherIcon(day.icon)}
                </div>

                {/* Temperature Range */}
                <div className="text-xs font-extrabold text-slate-800 whitespace-nowrap mb-1">
                  <span>{formatTemp(day.maxTemp, unit)}</span>
                  <span className="text-slate-400 font-normal mx-0.5">/</span>
                  <span className="text-slate-500 font-bold">{formatTemp(day.minTemp, unit)}</span>
                </div>

                {/* Rain Probability & Expected Amount */}
                <div className="space-y-0.5 w-full pt-1.5 border-t border-slate-200/60 text-[10px]">
                  <div className="flex items-center justify-center gap-1 text-blue-600 font-bold">
                    <Droplets className="w-3 h-3 shrink-0" />
                    <span>{day.rainProb}%</span>
                  </div>
                  <span className="text-slate-600 font-semibold block">
                    {day.rainAmount} mm
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TABLE VIEW (Full sortable tabular format) */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th
                  onClick={() => {
                    if (sortField === 'day') setSortAsc(!sortAsc);
                    else {
                      setSortField('day');
                      setSortAsc(true);
                    }
                  }}
                  className="p-3 cursor-pointer hover:bg-slate-100"
                >
                  Day & Date {sortField === 'day' && (sortAsc ? '↑' : '↓')}
                </th>
                <th className="p-3">Condition</th>
                <th
                  onClick={() => {
                    if (sortField === 'maxTemp') setSortAsc(!sortAsc);
                    else {
                      setSortField('maxTemp');
                      setSortAsc(false);
                    }
                  }}
                  className="p-3 cursor-pointer hover:bg-slate-100"
                >
                  Temp (Max / Min) {sortField === 'maxTemp' && (sortAsc ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => {
                    if (sortField === 'rainAmount') setSortAsc(!sortAsc);
                    else {
                      setSortField('rainAmount');
                      setSortAsc(false);
                    }
                  }}
                  className="p-3 cursor-pointer hover:bg-slate-100"
                >
                  Rainfall (mm) {sortField === 'rainAmount' && (sortAsc ? '↑' : '↓')}
                </th>
                <th className="p-3">Rain Prob %</th>
                <th className="p-3">Humidity</th>
                <th className="p-3">Wind</th>
                <th className="p-3">Agri Risk</th>
                <th className="p-3">Recommended Field Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {sortedDaily.map((d) => (
                <tr
                  key={d.dayIndex}
                  onClick={() => setSelectedDay(d)}
                  className="hover:bg-emerald-50/50 cursor-pointer transition-colors"
                >
                  <td className="p-3 font-bold text-slate-900">
                    Day {d.dayIndex} ({d.dayName}, {d.dateStr})
                  </td>
                  <td className="p-3 flex items-center gap-1.5">
                    {renderWeatherIcon(d.icon)}
                    <span>{d.condition}</span>
                  </td>
                  <td className="p-3 font-semibold">
                    <span className="text-slate-900">{formatTemp(d.maxTemp, unit)}</span> /{' '}
                    <span className="text-slate-500">{formatTemp(d.minTemp, unit)}</span>
                  </td>
                  <td className="p-3 font-bold text-blue-600">{d.rainAmount} mm</td>
                  <td className="p-3">{d.rainProb}%</td>
                  <td className="p-3">{d.humidity}%</td>
                  <td className="p-3">
                    {d.windSpeed} km/h {d.windDirection}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.weatherRisk === 'High'
                          ? 'bg-red-100 text-red-800'
                          : d.weatherRisk === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {d.weatherRisk}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 truncate max-w-xs">{d.agriculturalImpact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. GRAPH VIEW (Multi-metric toggles for Temperature, Rainfall, Humidity, Wind) */}
      {viewMode === 'graph' && (
        <div className="w-full pt-1">
          {/* Interactive Metric Toggles */}
          <div className="flex items-center gap-4 mb-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex-wrap text-xs">
            <span className="font-bold text-slate-700">Display Metrics:</span>
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={showTemp}
                onChange={(e) => setShowTemp(e.target.checked)}
                className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Temperature
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={showRain}
                onChange={(e) => setShowRain(e.target.checked)}
                className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Rainfall
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={showHumidity}
                onChange={(e) => setShowHumidity(e.target.checked)}
                className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Humidity
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={showWind}
                onChange={(e) => setShowWind(e.target.checked)}
                className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Wind
              </span>
            </label>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#64748b" unit="°C" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#0ea5e9" unit="mm" />
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

                {showRain && (
                  <Bar
                    yAxisId="right"
                    dataKey="rainfall"
                    name="Rainfall (mm)"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                )}
                {showTemp && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="maxTemp"
                    name="Max Temp (°C)"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                )}
                {showTemp && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="minTemp"
                    name="Min Temp (°C)"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                )}
                {showHumidity && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="humidity"
                    name="Humidity (%)"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2 }}
                  />
                )}
                {showWind && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="wind"
                    name="Wind (km/h)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. MAP VIEW (Real Leaflet Map with weather layers) */}
      {viewMode === 'map' && (
        <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col">
          <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-slate-800">Forecast Weather Layer:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['rain', 'temp', 'wind', 'clouds'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setMapLayer(layer)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    mapLayer === layer
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {layer} Layer
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full h-80 bg-slate-200">
            <iframe
              title="Forecast Synoptic Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=81.5%2C24.5%2C84.5%2C26.5&layer=mapnik&marker=25.3176%2C82.9739`}
              className="w-full h-full"
            />
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-md max-w-xs text-xs">
              <span className="font-bold text-slate-900 block">
                {locationName} Forecast Sector
              </span>
              <span className="text-[10px] text-slate-600 block mt-0.5">
                Active Layer: <strong className="capitalize">{mapLayer}</strong> projection
                calibrated from ECMWF 0.1° grid.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Day Detail Modal on click */}
      <DayDetailModal
        day={selectedDay}
        onClose={() => setSelectedDay(null)}
        unit={unit}
        language={language}
      />
    </div>
  );
};
