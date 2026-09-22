import React, { useState } from 'react';
import {
  Layers,
  Save,
  CheckCircle2,
  Droplets,
  Sprout,
  HelpCircle,
  FlaskConical,
} from 'lucide-react';
import { WeatherDataState, Language } from '../../types/weather';
import { useAuth } from '../../context/AuthContext';

interface SoilInsightsViewProps {
  weather: WeatherDataState;
  language: Language;
}

export const SoilInsightsView: React.FC<SoilInsightsViewProps> = ({ weather }) => {
  const { farmProfile, saveFarmProfile, isAuthenticated, openLoginModal } = useAuth();

  const [soilType, setSoilType] = useState<string>(
    farmProfile?.soil_type || 'Alluvial Loam'
  );
  const [soilPh, setSoilPh] = useState<string>('6.8 (Neutral)');
  const [organicCarbon, setOrganicCarbon] = useState<string>('Medium (0.55%)');
  const [drainageStatus, setDrainageStatus] = useState<string>('Well Drained');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await saveFarmProfile({
        soil_type: soilType,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Error saving soil info:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const soilDescriptions: Record<string, { desc: string; crops: string[]; waterAdvise: string }> = {
    'Alluvial Loam': {
      desc: 'Deep, fertile soil with balanced silt, sand, and clay. Excellent nutrient retention and water-holding capacity common to the Indo-Gangetic Plains.',
      crops: ['Paddy', 'Wheat', 'Sugarcane', 'Maize', 'Vegetables'],
      waterAdvise: 'Retains moisture for 3–4 days after irrigation; avoid excessive flooding.',
    },
    'Black Soil (Regur)': {
      desc: 'Clay-rich montmorillonite soil with high swelling and shrinkage. High moisture retention; prone to cracking in dry conditions.',
      crops: ['Cotton', 'Soybean', 'Gram', 'Sorghum'],
      waterAdvise: 'Irrigate at longer intervals; susceptible to surface waterlogging during heavy downpours.',
    },
    'Red Soil': {
      desc: 'Porous, friable structure rich in iron oxides. Lower water retention and slightly acidic; needs frequent light irrigations.',
      crops: ['Groundnut', 'Millets', 'Pulses', 'Oilseeds'],
      waterAdvise: 'Apply frequent light irrigations; add organic mulch to conserve moisture.',
    },
    'Sandy Loam': {
      desc: 'Light, well-aerated soil with rapid infiltration and low nutrient holding capacity. Warms up quickly in early spring.',
      crops: ['Potato', 'Carrot', 'Groundnut', 'Melons', 'Maize'],
      waterAdvise: 'High infiltration rate; best managed with drip irrigation to avoid deep percolation losses.',
    },
    'Clay Loam': {
      desc: 'Dense soil with high clay fraction and strong cation exchange. Retains water firmly; slow to drain.',
      crops: ['Paddy', 'Wheat', 'Mustard'],
      waterAdvise: 'Ensure deep drainage trenches are cleared ahead of forecasted monsoon surges.',
    },
  };

  const selectedSoilInfo = soilDescriptions[soilType] || soilDescriptions['Alluvial Loam'];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-emerald-950 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Edaphic Profile & Root-Zone Hydrology
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Soil Characteristics & Field Moisture Retention
          </h1>
          <p className="text-xs text-amber-100/90 mt-1 max-w-xl">
            Farm profile soil parameters for{' '}
            <strong>{weather.location.name}, {weather.location.state}</strong>.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Soil Info'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Soil profile saved successfully to your farm database!</span>
        </div>
      )}

      {/* Inputs Form */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-amber-600" />
          <span>Field Edaphic Profile Configuration</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Soil Type (मिट्टी का प्रकार)
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
            >
              <option value="Alluvial Loam">Alluvial Loam (जलोढ़ दोमट)</option>
              <option value="Black Soil (Regur)">Black Soil (काली मिट्टी)</option>
              <option value="Red Soil">Red Soil (लाल मिट्टी)</option>
              <option value="Sandy Loam">Sandy Loam (बलुई दोमट)</option>
              <option value="Clay Loam">Clay Loam (मटियार दोमट)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Soil Reaction (pH Level)
            </label>
            <select
              value={soilPh}
              onChange={(e) => setSoilPh(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
            >
              <option value="6.5 - 7.5 (Neutral)">6.5 – 7.5 (Optimal Neutral)</option>
              <option value="5.5 - 6.5 (Slightly Acidic)">5.5 – 6.5 (Slightly Acidic)</option>
              <option value="7.5 - 8.5 (Alkaline)">7.5 – 8.5 (Alkaline / Calcareous)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Organic Carbon Status
            </label>
            <select
              value={organicCarbon}
              onChange={(e) => setOrganicCarbon(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
            >
              <option value="High (>0.75%)">High (&gt;0.75%)</option>
              <option value="Medium (0.50 - 0.75%)">Medium (0.50 – 0.75%)</option>
              <option value="Low (<0.50%)">Low (&lt;0.50%)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Natural Drainage Capacity
            </label>
            <select
              value={drainageStatus}
              onChange={(e) => setDrainageStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
            >
              <option value="Well Drained">Well Drained (उत्कृष्ट जल निकासी)</option>
              <option value="Moderately Drained">Moderately Drained (मध्यम)</option>
              <option value="Poorly Drained / Waterlogged">Poorly Drained (जलभराव प्रवण)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Soil Characteristics & Recommendations Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>Characteristics & Compatible Crops</span>
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {selectedSoilInfo.desc}
          </p>
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-900 block mb-1.5">
              High-Suitability Crops for this Soil:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedSoilInfo.crops.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>Weather-Linked Hydrology Advice</span>
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {selectedSoilInfo.waterAdvise}
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-600">
            <div>
              <strong>Current Field Capacity:</strong> Estimated at 68% saturation.
            </div>
            <div>
              <strong>Infiltration Rate:</strong> 12–15 mm/hour under optimal tilth.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
