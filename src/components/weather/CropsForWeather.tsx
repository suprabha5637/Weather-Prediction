import React from 'react';
import { Sprout, CheckCircle2, Scissors, ChevronRight } from 'lucide-react';
import { CropItem, Language } from '../../types/weather';
import { getTranslation } from '../../utils/translations';

interface CropsForWeatherProps {
  cropsPlanting: CropItem[];
  cropsHarvest: CropItem[];
  language: Language;
  onViewAllCrops?: () => void;
  onSelectCrop?: (crop: CropItem) => void;
}

export const CropsForWeather: React.FC<CropsForWeatherProps> = ({
  cropsPlanting,
  cropsHarvest,
  language,
  onViewAllCrops,
  onSelectCrop,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
            <Sprout className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              {getTranslation(language, 'cropsForThisWeather')}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Based on next 7 days forecast (10–16 Sep)
            </p>
          </div>
        </div>

        <button
          onClick={onViewAllCrops}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 hover:underline shrink-0"
        >
          <span>View All Crops</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sub-Category 1: Suitable for Planting / Good Growth */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
          <span>{getTranslation(language, 'suitableForPlanting')}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {cropsPlanting.map((crop) => (
            <div
              key={crop.id}
              onClick={() => onSelectCrop?.(crop)}
              className="group bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 rounded-xl p-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs flex flex-col items-center text-center"
            >
              {/* Crop Image Thumbnail */}
              <div className="w-full h-16 rounded-lg overflow-hidden relative mb-1.5 bg-slate-200">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Crop Title & Status Tag */}
              <span className="text-xs font-bold text-slate-800 block truncate w-full">
                {crop.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block truncate w-full">
                {crop.statusTag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Category 2: Ready for Harvest (Current Conditions) */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-2">
          <Scissors className="w-3.5 h-3.5 text-amber-600" />
          <span>{getTranslation(language, 'readyForHarvest')}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {cropsHarvest.map((crop) => (
            <div
              key={crop.id}
              onClick={() => onSelectCrop?.(crop)}
              className="group bg-slate-50 hover:bg-amber-50/40 border border-slate-200/80 rounded-xl p-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs flex flex-col items-center text-center"
            >
              {/* Crop Image Thumbnail */}
              <div className="w-full h-16 rounded-lg overflow-hidden relative mb-1.5 bg-slate-200">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Crop Title & Status Tag */}
              <span className="text-xs font-bold text-slate-800 block truncate w-full">
                {crop.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block truncate w-full">
                {crop.statusTag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
