import React from 'react';
import { X, Sprout, CheckCircle2, AlertTriangle, Droplets, Thermometer, ShieldCheck } from 'lucide-react';
import { CropItem } from '../../types/weather';

interface CropDetailModalProps {
  crop: CropItem | null;
  onClose: () => void;
}

export const CropDetailModal: React.FC<CropDetailModalProps> = ({ crop, onClose }) => {
  if (!crop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Crop Image Banner */}
        <div className="relative h-44 w-full bg-slate-200 overflow-hidden shrink-0">
          <img
            src={crop.image}
            alt={crop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wide">
                Agronomic Compatibility Profile
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {crop.name} <span className="text-sm font-normal text-slate-300">({crop.hindiName})</span>
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
              {crop.statusTag}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                <span>Optimal Temperature</span>
              </div>
              <span className="font-bold text-slate-900 text-sm block">
                {crop.optimalTemp}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Moisture Requirement</span>
              </div>
              <span className="font-bold text-slate-900 text-sm block">
                {crop.moistureNeed}
              </span>
            </div>
          </div>

          {/* Current Growth Stage */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              Target Growth Stage
            </span>
            <p className="text-slate-800 font-bold text-sm">
              {crop.growthStage}
            </p>
          </div>

          {/* Detailed Recommendation Reason */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Meteorological Justification & Action Plan
            </span>
            <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              {crop.recommendationReason}
            </p>
          </div>

          {/* Weather Risk Safeguard */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block text-[11px]">15-Day Weather Precaution:</span>
              <p className="text-[11px] leading-snug">
                Protect root zones during 13–15 Sep heat spell; prepare drainage furrows prior to 16 Sep heavy rainfall.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
