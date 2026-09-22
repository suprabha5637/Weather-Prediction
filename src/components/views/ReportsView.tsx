import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  Printer,
  Sparkles,
  Layers,
} from 'lucide-react';
import { WeatherDataState, TemperatureUnit, Language } from '../../types/weather';
import { exportForecastCsv, downloadFile, printFarmerWeatherReport } from '../../services/weatherService';

interface ReportsViewProps {
  weather: WeatherDataState;
  unit: TemperatureUnit;
  language: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  weather,
  unit,
}) => {
  const [reportType, setReportType] = useState<string>('comprehensive');
  const [dateRange, setDateRange] = useState<string>('15days');
  const [includeAdvisory, setIncludeAdvisory] = useState<boolean>(true);
  const [includeAlerts, setIncludeAlerts] = useState<boolean>(true);
  const [includeSoil, setIncludeSoil] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSuccess, setGeneratedSuccess] = useState<boolean>(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSuccess(true);
      setTimeout(() => setGeneratedSuccess(false), 3000);
    }, 600);
  };

  const handleDownloadCsv = () => {
    const csv = exportForecastCsv(weather.daily15, weather.location.name);
    downloadFile(csv, `KrishiGo_Farmer_Report_${weather.location.name}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleDownloadPdf = () => {
    printFarmerWeatherReport(weather, unit);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Agronomic Documentation & Dossiers
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Agricultural Weather Reports & Dossier Center
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Generate and export printable farm weather dossiers, advisories, and risk assessments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {generatedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Report compiled successfully! Ready for view or download.</span>
        </div>
      )}

      {/* Report Configuration Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>Generate Customized Agricultural Report</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
            >
              <option value="comprehensive">Comprehensive Agronomic Dossier</option>
              <option value="weather-only">Weather Forecast & Extremes Only</option>
              <option value="crop-protection">Pest, Disease & Irrigation Schedule</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Forecast Horizon
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
            >
              <option value="7days">Next 7 Days</option>
              <option value="15days">Next 15 Days (Full Horizon)</option>
              <option value="seasonal">Monsoon Cumulative Summary</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Target Location
            </label>
            <input
              type="text"
              readOnly
              value={`${weather.location.name}, ${weather.location.state}`}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-600"
            />
          </div>
        </div>

        {/* Modules inclusion checkboxes */}
        <div className="flex items-center gap-5 flex-wrap pt-3 border-t border-slate-100 text-xs mb-4">
          <span className="font-bold text-slate-700">Include Modules:</span>
          <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={includeAdvisory}
              onChange={(e) => setIncludeAdvisory(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500"
            />
            <span>Crop & Irrigation Advisory</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={includeAlerts}
              onChange={(e) => setIncludeAlerts(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500"
            />
            <span>Weather Risk Bulletins</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={includeSoil}
              onChange={(e) => setIncludeSoil(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500"
            />
            <span>Soil Characteristics</span>
          </label>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-2"
        >
          <span>{isGenerating ? 'Compiling Report...' : 'Compile & Generate Report'}</span>
        </button>
      </div>

      {/* Live Preview Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <span className="text-[10.5px] font-bold text-emerald-700 uppercase tracking-wider block">
              Dossier Preview
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Farmer Weather Dossier — {weather.location.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Preview</span>
            </button>
          </div>
        </div>

        {/* Preview Summary */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-semibold">
            <div>
              <span className="text-slate-400 block text-[10px]">Location</span>
              <span className="text-slate-800">{weather.location.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Current Temp</span>
              <span className="text-slate-800">{weather.current.temp}°{unit}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">15-Day Rain</span>
              <span className="text-slate-800">{weather.metrics.totalExpectedRainfall} mm</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Active Alerts</span>
              <span className="text-slate-800">{weather.alerts.length} Bulletin(s)</span>
            </div>
          </div>
          <p className="text-slate-600 pt-2 border-t border-slate-200/60 leading-relaxed font-medium">
            {weather.summaryText}
          </p>
        </div>
      </div>
    </div>
  );
};
