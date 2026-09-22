import React, { useState } from 'react';
import { X, Layers, Cpu, CheckCircle, ShieldCheck, Database, Award, BarChart3, Activity } from 'lucide-react';

interface MLOpsRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MLOpsRegistryModal: React.FC<MLOpsRegistryModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'models' | 'pipeline' | 'governance'>('models');

  if (!isOpen) return null;

  const models = [
    {
      id: "krishi_stacked_ensemble_v4.2",
      name: "Bayesian Model Averaging & Quantile Ensemble",
      version: "v4.2.0",
      target: "Full 15-Day Synoptic-Agri Forecast Envelope",
      scope: "National (Varanasi Node Lead)",
      status: "Production",
      mae: "0.62°C",
      rmse: "0.89°C",
      brier: "0.132",
      crps: "0.46",
      coverage: "88.4%",
      trainingPeriod: "2022-01-01 to 2025-12-31",
      valScore: "0.968 R²",
      deployed: "2026-06-15",
      isLead: true
    },
    {
      id: "krishi_tft_temp_v3.2",
      name: "Temporal Fusion Transformer (TFT)",
      version: "v3.2.0",
      target: "2m Temperature (°C) with P10/P50/P90",
      scope: "Indo-Gangetic Basin (Lat 24-28N)",
      status: "Production",
      mae: "0.68°C",
      rmse: "0.94°C",
      brier: "N/A",
      crps: "0.51",
      coverage: "89.2%",
      trainingPeriod: "2010-01-01 to 2023-12-31",
      valScore: "0.962 R²",
      deployed: "2026-03-01",
      isLead: false
    },
    {
      id: "krishi_lgbm_rain_v4.1",
      name: "LightGBM Calibrated Rain Classifier",
      version: "v4.1.2",
      target: "Precipitation Probability & Accumulation (mm)",
      scope: "Eastern Uttar Pradesh Sub-agro zone",
      status: "Production",
      mae: "1.24 mm",
      rmse: "2.10 mm",
      brier: "0.138",
      crps: "0.58",
      coverage: "86.5%",
      trainingPeriod: "2005-01-01 to 2023-12-31",
      valScore: "0.892 ROC-AUC",
      deployed: "2026-04-20",
      isLead: false
    },
    {
      id: "krishi_xgb_wind_v2.5",
      name: "XGBoost Wind Vector Downscaling",
      version: "v2.5.0",
      target: "10m Wind Speed & Direction (km/h, deg)",
      scope: "Northern Plains Agricultural Belt",
      status: "Production",
      mae: "1.85 km/h",
      rmse: "2.41 km/h",
      brier: "N/A",
      crps: "N/A",
      coverage: "91.0%",
      trainingPeriod: "2015-01-01 to 2024-06-30",
      valScore: "0.914 R²",
      deployed: "2026-05-12",
      isLead: false
    },
    {
      id: "krishi_graph_neural_v1.0_candidate",
      name: "Spatial-Temporal Graph Neural Network (ST-GNN)",
      version: "v1.0.0-rc1",
      target: "District Microclimate Coordinated Convection",
      scope: "Varanasi Micro-cluster (20 IoT Nodes)",
      status: "Candidate",
      mae: "0.59°C",
      rmse: "0.82°C",
      brier: "0.129",
      crps: "0.42",
      coverage: "90.1%",
      trainingPeriod: "2023-01-01 to 2025-12-31",
      valScore: "0.974 R²",
      deployed: "Pending Gate",
      isLead: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  KrishiGo MLOps Model Registry & Governance
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                  v4.2.0 Active
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Walk-forward validated weather intelligence models, training intervals & deployment gates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('models')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'models'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" /> Active Model Catalog ({models.length})
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'pipeline'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Validation & Leakage Prevention
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'governance'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Deployment Gates & Data Lineage
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'models' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                {models.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-2xl p-4 border transition-all ${
                      m.isLead
                        ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900">{m.name}</h3>
                          <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                            {m.version}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                              m.status === 'Production'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-amber-500 text-white'
                            }`}
                          >
                            {m.status}
                          </span>
                          {m.isLead && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Award className="w-3 h-3 text-emerald-700" /> Primary Ensemble
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          <strong className="text-slate-800">Target:</strong> {m.target} • <span className="text-slate-500">{m.scope}</span>
                        </p>
                      </div>

                      <div className="text-right text-[11px] text-slate-500 shrink-0">
                        <div>Trained: {m.trainingPeriod}</div>
                        <div>Deployed: <strong className="text-slate-700">{m.deployed}</strong></div>
                      </div>
                    </div>

                    {/* Benchmark Metrics Strip */}
                    <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-200/60">
                        <div className="text-[10px] uppercase font-bold text-slate-400">MAE</div>
                        <div className="font-extrabold text-slate-900 mt-0.5">{m.mae}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-200/60">
                        <div className="text-[10px] uppercase font-bold text-slate-400">RMSE</div>
                        <div className="font-extrabold text-slate-900 mt-0.5">{m.rmse}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-200/60">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Brier Score</div>
                        <div className="font-extrabold text-slate-900 mt-0.5">{m.brier}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-200/60">
                        <div className="text-[10px] uppercase font-bold text-slate-400">CRPS</div>
                        <div className="font-extrabold text-slate-900 mt-0.5">{m.crps}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-200/60 col-span-2 sm:col-span-1">
                        <div className="text-[10px] uppercase font-bold text-slate-400">P10-P90 Cov.</div>
                        <div className="font-extrabold text-emerald-700 mt-0.5">{m.coverage}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <h3 className="font-bold text-emerald-950 text-sm mb-1 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" /> Walk-Forward Time-Series Validation Protocol
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  In compliance with Section 37 of the KrishiGo Specification, weather observations are <strong>never randomly shuffled</strong>. Models are trained on strict historical intervals (e.g. 2010–2023), validated on rolling sequential years (2024–2025), and evaluated on unseen future horizons (2026 walk-forward test).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-700" /> Leakage Prevention Measures
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
                    <li>Strict forecast issue-time isolation: future observations are masked during feature generation.</li>
                    <li>Temporal lag windows strictly use historical data up to T-0 UTC.</li>
                    <li>Satellite precipitation features only incorporate verified GPM IMERG 3-hour latency products.</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-700" /> Bias Correction & Downscaling
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
                    <li>Quantile mapping applied to raw GFS and ECMWF grids using 30-year IMD station records.</li>
                    <li>Elevation lapse rate correction (6.5°C / 1000m) tailored for farm altitudes (80m Varanasi datum).</li>
                    <li>Monsoon convective surge probability calibration using Brier score minimization.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'governance' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" /> Automated Production Deployment Gate
                </h3>
                <p className="text-slate-600 leading-relaxed mb-3">
                  A candidate model can only supersede the active production model if it satisfies all 4 automated validation gates over a 60-day walk-forward window:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Temperature MAE &le; 0.85°C across 15-day horizon</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Rain Probability Brier Score &le; 0.150</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>P10–P90 Prediction Interval Coverage &ge; 85.0%</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero Data Drift violation on critical synoptic features</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Repository: <span className="font-mono text-slate-700">krishigo-weather-mlops / models / v4.2.0</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-colors"
          >
            Close Registry
          </button>
        </div>
      </div>
    </div>
  );
};
