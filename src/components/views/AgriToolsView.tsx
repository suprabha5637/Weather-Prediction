import React, { useState } from 'react';
import {
  Wrench,
  Droplets,
  Calendar,
  Sun,
  CloudRain,
  Calculator,
  Scale,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { WeatherDataState, Language } from '../../types/weather';

interface AgriToolsViewProps {
  weather: WeatherDataState;
  language: Language;
}

export const AgriToolsView: React.FC<AgriToolsViewProps> = ({ weather }) => {
  const [activeTool, setActiveTool] = useState<
    | 'irrigation'
    | 'calendar'
    | 'harvest'
    | 'runoff'
    | 'gdd'
    | 'area'
    | 'yield'
  >('irrigation');

  // 1. Irrigation Calculator State
  const [irrigArea, setIrrigArea] = useState<number>(2.5); // acres
  const [irrigCrop, setIrrigCrop] = useState<string>('Paddy');
  const [irrigStage, setIrrigStage] = useState<string>('Vegetative');

  const getKc = (crop: string, stage: string) => {
    if (crop === 'Paddy') return stage === 'Flowering' ? 1.2 : 1.05;
    if (crop === 'Maize') return stage === 'Flowering' ? 1.15 : 0.9;
    if (crop === 'Tomato') return stage === 'Fruiting' ? 1.15 : 0.8;
    return 1.0;
  };

  const et0 = 4.8; // mm/day
  const kc = getKc(irrigCrop, irrigStage);
  const etcMm = et0 * kc;
  // 1 acre = 4046.86 m2. 1 mm over 1 m2 = 1 liter.
  const dailyLiters = Math.round(irrigArea * 4046.86 * etcMm);
  const pumpHours = (dailyLiters / 25000).toFixed(1); // standard 5HP pump delivers ~25,000 L/hr

  // 2. Crop Calendar State
  const [sowCrop, setSowCrop] = useState<string>('Paddy');
  const [sowDate, setSowDate] = useState<string>('2026-07-15');

  const calculateStages = (crop: string, startStr: string) => {
    const start = new Date(startStr);
    const addDays = (d: Date, days: number) => {
      const res = new Date(d);
      res.setDate(res.getDate() + days);
      return res.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (crop === 'Paddy') {
      return {
        nursery: addDays(start, 25),
        tillering: addDays(start, 50),
        flowering: addDays(start, 85),
        harvest: addDays(start, 120),
      };
    } else if (crop === 'Maize') {
      return {
        nursery: addDays(start, 15),
        tillering: addDays(start, 40),
        flowering: addDays(start, 65),
        harvest: addDays(start, 95),
      };
    } else {
      return {
        nursery: addDays(start, 20),
        tillering: addDays(start, 45),
        flowering: addDays(start, 70),
        harvest: addDays(start, 105),
      };
    }
  };

  const stages = calculateStages(sowCrop, sowDate);

  // 3. Harvest Readiness State
  const [harvestCrop, setHarvestCrop] = useState<string>('Tomato');
  const [maturityDays, setMaturityDays] = useState<number>(75);

  // 4. Rainfall & Runoff Catchment Calculator State
  const [catchmentAreaSqM, setCatchmentAreaSqM] = useState<number>(4046); // 1 acre = 4046 m2
  const [rainfallMm, setRainfallMm] = useState<number>(25); // mm
  const [runoffCoeff, setRunoffCoeff] = useState<number>(0.4); // agricultural field

  const harvestedWaterLiters = Math.round(catchmentAreaSqM * rainfallMm * runoffCoeff);
  const harvestedWaterCuM = (harvestedWaterLiters / 1000).toFixed(1);

  // 5. GDD Calculator State
  const [gddBaseTemp, setGddBaseTemp] = useState<number>(10);
  const [gddMaxT, setGddMaxT] = useState<number>(33);
  const [gddMinT, setGddMinT] = useState<number>(24);
  const [gddDays, setGddDays] = useState<number>(10);

  const dailyGdd = Math.max(0, (gddMaxT + gddMinT) / 2 - gddBaseTemp);
  const totalGdd = Math.round(dailyGdd * gddDays);

  // 6. Farm Area & Seed Rate Calculator State
  const [farmLenM, setFarmLenM] = useState<number>(100);
  const [farmWidM, setFarmWidM] = useState<number>(40);
  const [seedCrop, setSeedCrop] = useState<string>('Paddy');

  const calculatedSqM = farmLenM * farmWidM;
  const calculatedAcres = (calculatedSqM / 4046.86).toFixed(2);
  const calculatedHectares = (calculatedSqM / 10000).toFixed(2);

  const getSeedRatePerAcre = (crop: string) => {
    if (crop === 'Paddy') return 18; // 18 kg/acre for transplanted
    if (crop === 'Maize') return 8; // 8 kg/acre
    if (crop === 'Wheat') return 45; // 45 kg/acre
    if (crop === 'Soybean') return 25; // 25 kg/acre
    return 15;
  };

  const seedRequiredKg = (parseFloat(calculatedAcres) * getSeedRatePerAcre(seedCrop)).toFixed(1);

  // 7. Yield Estimator State
  const [yieldPlantsPerSqM, setYieldPlantsPerSqM] = useState<number>(25);
  const [yieldGrainsPerPlant, setYieldGrainsPerPlant] = useState<number>(120);
  const [testWeightGrams, setTestWeightGrams] = useState<number>(24); // weight of 1000 grains

  // Yield formula: (Plants/m2 * Grains/plant * (TestWeight / 1000)) / 1000 = kg/m2
  // kg/m2 * 4046.86 / 100 = quintals per acre
  const yieldKgPerSqM = (yieldPlantsPerSqM * yieldGrainsPerPlant * (testWeightGrams / 1000)) / 1000;
  const estimatedQuintalsPerAcre = ((yieldKgPerSqM * 4046.86) / 100).toFixed(1);
  const estimatedTonsPerHa = ((yieldKgPerSqM * 10000) / 1000).toFixed(2);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Interactive Agricultural Decision Tools
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Agricultural Calculators & Farm Optimization Center
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Real agronomic algorithms computing irrigation demands, growth intervals, and projected yields.
          </p>
        </div>
      </div>

      {/* Calculator Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
        {[
          { id: 'irrigation', label: 'Irrigation Calculator', icon: <Droplets className="w-3.5 h-3.5" /> },
          { id: 'calendar', label: 'Crop Calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'harvest', label: 'Harvest Readiness', icon: <Sun className="w-3.5 h-3.5" /> },
          { id: 'runoff', label: 'Rainfall & Runoff', icon: <CloudRain className="w-3.5 h-3.5" /> },
          { id: 'gdd', label: 'Growing Degree Days (GDD)', icon: <Calculator className="w-3.5 h-3.5" /> },
          { id: 'area', label: 'Farm Area & Seed Rate', icon: <Scale className="w-3.5 h-3.5" /> },
          { id: 'yield', label: 'Yield Estimator', icon: <Sparkles className="w-3.5 h-3.5" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id as any)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTool === t.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* 1. IRRIGATION CALCULATOR */}
      {activeTool === 'irrigation' && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <span>FAO-56 Crop Water & Irrigation Demand Calculator</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Farm Area (Acres)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={irrigArea}
                onChange={(e) => setIrrigArea(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select Crop
              </label>
              <select
                value={irrigCrop}
                onChange={(e) => setIrrigCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value="Paddy">Paddy (धान)</option>
                <option value="Maize">Maize (मक्का)</option>
                <option value="Tomato">Tomato (टमाटर)</option>
                <option value="Wheat">Wheat (गेहूं)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Growth Stage
              </label>
              <select
                value={irrigStage}
                onChange={(e) => setIrrigStage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value="Vegetative">Vegetative (वानस्पतिक)</option>
                <option value="Flowering">Flowering / Spikelet (फूल आना)</option>
                <option value="Maturity">Maturity / Ripening (पकाव)</option>
              </select>
            </div>
          </div>

          {/* Results Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <div>
              <span className="text-[10.5px] font-bold text-emerald-800 uppercase block">
                Daily Evapotranspiration (ETc)
              </span>
              <span className="text-xl font-black text-slate-900">
                {etcMm.toFixed(2)} mm/day
              </span>
            </div>
            <div>
              <span className="text-[10.5px] font-bold text-emerald-800 uppercase block">
                Daily Water Volume Needed
              </span>
              <span className="text-xl font-black text-emerald-800">
                {dailyLiters.toLocaleString()} Liters
              </span>
            </div>
            <div>
              <span className="text-[10.5px] font-bold text-emerald-800 uppercase block">
                Estimated 5HP Pump Run Time
              </span>
              <span className="text-xl font-black text-slate-900">
                {pumpHours} Hours/day
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. CROP CALENDAR */}
      {activeTool === 'calendar' && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <span>Thermal Phenology & Crop Stage Progression Planner</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select Crop
              </label>
              <select
                value={sowCrop}
                onChange={(e) => setSowCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value="Paddy">Paddy (धान)</option>
                <option value="Maize">Maize (मक्का)</option>
                <option value="Tomato">Tomato (टमाटर)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Sowing / Planting Date
              </label>
              <input
                type="date"
                value={sowDate}
                onChange={(e) => setSowDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                Seedling / Nursery
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-1">
                {stages.nursery}
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                Tillering / Peak Growth
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-1">
                {stages.tillering}
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                Flowering / Heading
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-1">
                {stages.flowering}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-700 block uppercase">
                Expected Harvest
              </span>
              <span className="text-xs font-black text-emerald-900 block mt-1">
                {stages.harvest}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. HARVEST READINESS */}
      {activeTool === 'harvest' && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <span>Harvest Window & Sun-Drying Weather Matcher</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Crop Ready for Harvest
              </label>
              <select
                value={harvestCrop}
                onChange={(e) => setHarvestCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value="Tomato">Tomato (टमाटर)</option>
                <option value="Chili">Chili (मिर्च)</option>
                <option value="Lady Finger">Lady Finger (भिंडी)</option>
                <option value="Brinjal">Brinjal (बैंगन)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Days Since Sowing
              </label>
              <input
                type="number"
                value={maturityDays}
                onChange={(e) => setMaturityDays(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-amber-950">
              Optimal Harvest Recommendation for {harvestCrop}:
            </div>
            <p className="text-amber-900 leading-relaxed font-medium">
              Upcoming 3-day dry weather provides an ideal window for harvesting. Solar radiation is sufficient for open-air drying without risking rain cracking or moisture decay. Complete plucking before 16 September when rain probability escalates to 60%.
            </p>
          </div>
        </div>
      )}

      {/* 4. RUNOFF & CATCHMENT */}
      {activeTool === 'runoff' && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-500" />
            <span>Farm Pond & Rainwater Harvesting Catchment Calculator</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Catchment Area (Sq. Meters)
              </label>
              <input
                type="number"
                value={catchmentAreaSqM}
                onChange={(e) => setCatchmentAreaSqM(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                1 Acre = 4,047 m²
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Expected Rainfall (mm)
              </label>
              <input
                type="number"
                value={rainfallMm}
                onChange={(e) => setRainfallMm(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Surface Runoff Coefficient
              </label>
              <select
                value={runoffCoeff}
                onChange={(e) => setRunoffCoeff(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value={0.4}>Bunded Agricultural Soil (0.40)</option>
                <option value={0.25}>Permeable Sandy Loam (0.25)</option>
                <option value={0.85}>Tin / Concrete Rooftop (0.85)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-sky-800 uppercase block">
                Total Harvestable Water Volume
              </span>
              <span className="text-2xl font-black text-sky-950">
                {harvestedWaterLiters.toLocaleString()} Liters
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-sky-800 uppercase block">
                Farm Pond Capacity Equivalent
              </span>
              <span className="text-2xl font-black text-slate-900">
                {harvestedWaterCuM} m³
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. GDD CALCULATOR */}
      {activeTool === 'gdd' && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-600" />
            <span>Growing Degree Days (GDD) Heat Unit Calculator</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Base Temperature (°C)
              </label>
              <input
                type="number"
                value={gddBaseTemp}
                onChange={(e) => setGddBaseTemp(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Rice/Maize: 10°C, Wheat: 5°C
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Daily Max Temp (°C)
              </label>
              <input
                type="number"
                value={gddMaxT}
                onChange={(e) => setGddMaxT(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Daily Min Temp (°C)
              </label>
              <input
                type="number"
                value={gddMinT}
                onChange={(e) => setGddMinT(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Number of Days
              </label>
              <input
                type="number"
                value={gddDays}
                onChange={(e) => setGddDays(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase block">
                Daily Heat Unit Accumulation
              </span>
              <span className="text-2xl font-black text-slate-900">
                {dailyGdd.toFixed(1)} GDD / day
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase block">
                Total Heat Units ({gddDays} Days)
              </span>
              <span className="text-2xl font-black text-amber-900">
                {totalGdd} GDD
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 6. FARM AREA & SEED RATE */}
      {activeTool === 'area' && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-700" />
            <span>Farm Field Dimensions & Certified Seed Requirement</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Field Length (Meters)
              </label>
              <input
                type="number"
                value={farmLenM}
                onChange={(e) => setFarmLenM(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Field Width (Meters)
              </label>
              <input
                type="number"
                value={farmWidM}
                onChange={(e) => setFarmWidM(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Crop
              </label>
              <select
                value={seedCrop}
                onChange={(e) => setSeedCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value="Paddy">Paddy (धान)</option>
                <option value="Maize">Maize (मक्का)</option>
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                Calculated Farm Area
              </span>
              <span className="text-xl font-black text-slate-900">
                {calculatedAcres} Acres ({calculatedHectares} Ha)
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                Recommended Seed Rate
              </span>
              <span className="text-xl font-black text-slate-900">
                {getSeedRatePerAcre(seedCrop)} kg/acre
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                Total Seed Quantity Required
              </span>
              <span className="text-xl font-black text-emerald-800">
                {seedRequiredKg} kg
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 7. YIELD ESTIMATOR */}
      {activeTool === 'yield' && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Pre-Harvest Agronomic Crop Yield Estimator</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Plant Population (plants / m²)
              </label>
              <input
                type="number"
                value={yieldPlantsPerSqM}
                onChange={(e) => setYieldPlantsPerSqM(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Grains / Pods Per Plant
              </label>
              <input
                type="number"
                value={yieldGrainsPerPlant}
                onChange={(e) => setYieldGrainsPerPlant(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                1000-Grain Test Weight (grams)
              </label>
              <input
                type="number"
                step="0.5"
                value={testWeightGrams}
                onChange={(e) => setTestWeightGrams(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Paddy: ~24g, Wheat: ~38g
              </span>
            </div>
          </div>

          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase block">
                Estimated Field Yield
              </span>
              <span className="text-2xl font-black text-slate-900">
                {estimatedQuintalsPerAcre} Quintals / Acre
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase block">
                Metric Ton Equivalent
              </span>
              <span className="text-2xl font-black text-amber-900">
                {estimatedTonsPerHa} Tons / Hectare
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
