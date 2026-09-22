import React, { useState, useEffect } from 'react';
import {
  X,
  Sprout,
  MapPin,
  Maximize2,
  Droplets,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LocateFixed
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FarmProfile } from '../../types/auth';

interface FarmProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFarmProfileUpdated?: (profile: FarmProfile) => void;
}

const COMMON_CROPS = [
  'Paddy (Rice)',
  'Wheat',
  'Maize (Corn)',
  'Soybean',
  'Groundnut',
  'Cotton',
  'Sugarcane',
  'Tomato',
  'Potato',
  'Mustard',
  'Onion',
  'Chilli'
];

const SOIL_TYPES = [
  'Alluvial Soil',
  'Black Soil (Regur)',
  'Red & Yellow Soil',
  'Laterite Soil',
  'Sandy Loam',
  'Clay Loam'
];

const IRRIGATION_TYPES = [
  'Borewell / Tube Well',
  'Canal Irrigation',
  'Drip Irrigation',
  'Sprinkler System',
  'River / Pond Lift',
  'Rainfed (Monsoon)'
];

export const FarmProfileModal: React.FC<FarmProfileModalProps> = ({
  isOpen,
  onClose,
  onFarmProfileUpdated,
}) => {
  const { farmProfile, saveFarmProfile } = useAuth();

  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [latitude, setLatitude] = useState(25.3176);
  const [longitude, setLongitude] = useState(82.9739);
  const [farmSize, setFarmSize] = useState(5.0);
  const [farmSizeUnit, setFarmSizeUnit] = useState('acres');
  const [soilType, setSoilType] = useState('Alluvial Soil');
  const [irrigationType, setIrrigationType] = useState('Borewell / Tube Well');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Paddy (Rice)', 'Wheat']);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (farmProfile) {
      setFarmName(farmProfile.farm_name || 'My Farm');
      setLocation(farmProfile.location || 'Varanasi, Uttar Pradesh');
      setDistrict(farmProfile.district || 'Varanasi');
      setState(farmProfile.state || 'Uttar Pradesh');
      setLatitude(farmProfile.latitude || 25.3176);
      setLongitude(farmProfile.longitude || 82.9739);
      setFarmSize(farmProfile.farm_size || 5.0);
      setFarmSizeUnit(farmProfile.farm_size_unit || 'acres');
      setSoilType(farmProfile.soil_type || 'Alluvial Soil');
      setIrrigationType(farmProfile.irrigation_type || 'Borewell / Tube Well');

      if (farmProfile.primary_crops) {
        const crops = farmProfile.primary_crops
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean);
        setSelectedCrops(crops.length > 0 ? crops : ['Paddy (Rice)']);
      }
    }
  }, [farmProfile, isOpen]);

  if (!isOpen) return null;

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      if (selectedCrops.length > 1) {
        setSelectedCrops(selectedCrops.filter((c) => c !== crop));
      }
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const handleUseCurrentGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(4)));
          setLongitude(Number(pos.coords.longitude.toFixed(4)));
          setSuccess('Updated coordinates from device GPS');
          setTimeout(() => setSuccess(null), 3000);
        },
        () => {
          setError('Could not access device GPS');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim()) {
      setError('Please enter your farm name');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload: Partial<FarmProfile> = {
        farm_name: farmName.trim(),
        location: location.trim(),
        district: district.trim(),
        state: state.trim(),
        latitude,
        longitude,
        farm_size: farmSize,
        farm_size_unit: farmSizeUnit,
        soil_type: soilType,
        irrigation_type: irrigationType,
        primary_crops: selectedCrops.join(', '),
      };

      await saveFarmProfile(payload);
      setSuccess('Farm Profile saved! Weather advisories are now synchronized.');

      if (onFarmProfileUpdated && farmProfile) {
        onFarmProfileUpdated({
          ...farmProfile,
          ...payload,
        } as FarmProfile);
      }

      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to save farm profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-xl shadow-inner">
              🌱
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                KrishiGo Agricultural Intelligence
              </div>
              <h2 className="text-xl font-extrabold text-white">Farm Profile & Land Record</h2>
            </div>
          </div>
          <p className="mt-1 text-xs text-emerald-100/80">
            Define your farm location, soil type, and crops to unlock precision microclimate forecasts.
          </p>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="flex items-start gap-2.5 p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2.5 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Farm Name & Acreage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Farm Name</label>
              <div className="relative">
                <Sprout className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. KrishiGo Smart Farm"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-hidden shadow-2xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Size</label>
              <div className="flex rounded-xl border border-slate-300 overflow-hidden shadow-2xs">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={farmSize}
                  onChange={(e) => setFarmSize(parseFloat(e.target.value) || 1)}
                  className="w-full px-2.5 py-2 text-xs text-slate-800 focus:outline-hidden"
                />
                <select
                  value={farmSizeUnit}
                  onChange={(e) => setFarmSizeUnit(e.target.value)}
                  className="bg-slate-50 border-l border-slate-200 px-2 py-2 text-[11px] font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="bigha">Bigha</option>
                </select>
              </div>
            </div>
          </div>

          {/* Geographic Coordinates & Location */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Geographic Location & Coordinates</span>
              </div>
              <button
                type="button"
                onClick={handleUseCurrentGPS}
                className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-200 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                <span>Get GPS</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Village / Area</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Varanasi, UP"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Varanasi"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Uttar Pradesh"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-mono">
              <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                Lat: <span className="font-bold text-slate-800">{latitude}° N</span>
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                Lon: <span className="font-bold text-slate-800">{longitude}° E</span>
              </div>
            </div>
          </div>

          {/* Primary Crops Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Primary Crops Grown (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_CROPS.map((crop) => {
                const selected = selectedCrops.includes(crop);
                return (
                  <button
                    type="button"
                    key={crop}
                    onClick={() => toggleCrop(crop)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selected
                        ? 'bg-emerald-700 text-white shadow-2xs scale-102'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {crop}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Soil & Irrigation Types */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                <span>Soil Type</span>
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 bg-white shadow-2xs"
              >
                {SOIL_TYPES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-emerald-700" />
                <span>Irrigation Infrastructure</span>
              </label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 bg-white shadow-2xs"
              >
                {IRRIGATION_TYPES.map((it) => (
                  <option key={it} value={it}>
                    {it}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Farm Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
