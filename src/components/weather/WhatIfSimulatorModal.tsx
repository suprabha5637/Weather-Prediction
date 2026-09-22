import React, { useState } from 'react';
import { X, Sparkles, AlertTriangle, CheckCircle2, Compass, ShieldAlert } from 'lucide-react';
import { WeatherDataState } from '../../types/weather';
import { runWhatIfScenario, WhatIfScenarioResult } from '../../services/aiCopilotService';

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherDataState;
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  isOpen,
  onClose,
  weather,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('sow-tomorrow');

  if (!isOpen) return null;

  const scenarios = [
    { id: 'sow-tomorrow', label: '🌱 What if I sow tomorrow?' },
    { id: 'wait-3-days', label: '⏳ What if I wait 3 days before sowing?' },
    { id: 'irrigate-today', label: '💧 What if I irrigate today?' },
    { id: 'spray-tomorrow', label: '💨 What if I spray tomorrow morning?' },
    { id: 'harvest-today', label: '🌾 What if I harvest today?' },
  ];

  const result: WhatIfScenarioResult = runWhatIfScenario(selectedScenario, weather);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/15">
              <Compass className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">Agricultural What-If Simulator</h2>
              <p className="text-xs text-emerald-200/80">
                Simulate agricultural decisions against local 15-day meteorological forecasts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenario Selection Chips */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto flex gap-1.5 shrink-0">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all shrink-0 border ${
                selectedScenario === sc.id
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Scenario Simulation Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Recommendation Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-800">
                Decision Outcome
              </span>
              <h3 className="text-sm font-bold text-emerald-950">
                {result.scenario}
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                result.recommendation === 'Recommended'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {result.recommendation}
            </span>
          </div>

          {/* Expected Weather */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Forecast Atmospheric Regime
            </span>
            <p className="text-slate-800 font-semibold">{result.expectedWeather}</p>
          </div>

          {/* Benefit vs Risk Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Potential Benefit</span>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                {result.potentialBenefit}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Agronomic Risk</span>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                {result.potentialRisk}
              </p>
            </div>
          </div>

          {/* Field Impact */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Crop & Field Impact</span>
            </div>
            <p className="text-slate-700 font-medium leading-relaxed">
              {result.agriculturalImpact}
            </p>
          </div>

          {/* Uncertainty Calibration */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
            <span>Forecast Horizon: 24–96h</span>
            <span className="font-semibold text-emerald-800">
              Model Uncertainty: {result.uncertainty}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
