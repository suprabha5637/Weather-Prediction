import React, { useState } from 'react';
import {
  Sprout,
  Droplets,
  Bug,
  Leaf,
  Tractor,
  ChevronRight,
  CheckSquare,
  HelpCircle,
} from 'lucide-react';
import { AdvisoryItem, Language } from '../../types/weather';
import { getTranslation } from '../../utils/translations';

interface AICropAdvisoryProps {
  advisory: {
    irrigation: AdvisoryItem;
    pest: AdvisoryItem;
    fertilizer: AdvisoryItem;
    activity: AdvisoryItem;
  };
  farmerTips: string[];
  language: Language;
  onOpenAdvisoryDetail?: (item: AdvisoryItem) => void;
  onOpenWhatIf?: () => void;
}

export const AICropAdvisory: React.FC<AICropAdvisoryProps> = ({
  advisory,
  farmerTips,
  language,
  onOpenAdvisoryDetail,
  onOpenWhatIf,
}) => {
  const [selectedItem, setSelectedItem] = useState<AdvisoryItem | null>(null);

  const handleClickItem = (item: AdvisoryItem) => {
    setSelectedItem(item);
    onOpenAdvisoryDetail?.(item);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      {/* 1. AI Crop Advisory Beta */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
              <Sprout className="w-4 h-4 text-emerald-700" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              {getTranslation(language, 'aiCropAdvisory')}
            </h2>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md uppercase tracking-wide">
              Beta
            </span>
          </div>

          <button
            onClick={onOpenWhatIf}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors"
            title="Simulate agronomic decisions"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'whatIf')}</span>
          </button>
        </div>

        {/* 4 Interactive Advisory Cards */}
        <div className="space-y-2 mb-4">
          {/* Irrigation Advice */}
          <div
            onClick={() => handleClickItem(advisory.irrigation)}
            className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200/80 transition-all cursor-pointer flex items-start justify-between gap-2.5 group"
          >
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 shrink-0 mt-0.5">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 transition-colors">
                  {advisory.irrigation.title}
                </h3>
                <p className="text-xs text-slate-600 leading-snug">
                  {advisory.irrigation.summary}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>

          {/* Pest & Disease Risk */}
          <div
            onClick={() => handleClickItem(advisory.pest)}
            className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200/80 transition-all cursor-pointer flex items-start justify-between gap-2.5 group"
          >
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                <Bug className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 transition-colors">
                  {advisory.pest.title}
                </h3>
                <p className="text-xs text-slate-600 leading-snug">
                  {advisory.pest.summary}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>

          {/* Fertilizer Suggestion */}
          <div
            onClick={() => handleClickItem(advisory.fertilizer)}
            className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200/80 transition-all cursor-pointer flex items-start justify-between gap-2.5 group"
          >
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 transition-colors">
                  {advisory.fertilizer.title}
                </h3>
                <p className="text-xs text-slate-600 leading-snug">
                  {advisory.fertilizer.summary}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>

          {/* Field Activity */}
          <div
            onClick={() => handleClickItem(advisory.activity)}
            className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200/80 transition-all cursor-pointer flex items-start justify-between gap-2.5 group"
          >
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-orange-100 text-orange-700 shrink-0 mt-0.5">
                <Tractor className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 transition-colors">
                  {advisory.activity.title}
                </h3>
                <p className="text-xs text-slate-600 leading-snug">
                  {advisory.activity.summary}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* 2. Farmer Tips for This Weather */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-800 tracking-tight">
            {getTranslation(language, 'farmerTips')}
          </h3>
          <span className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer">
            View All →
          </span>
        </div>

        <div className="space-y-1.5">
          {farmerTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
              <CheckSquare className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0 mt-0.5" />
              <span className="leading-snug">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
