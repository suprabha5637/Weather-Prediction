import React from 'react';
import {
  AlertTriangle,
  Flame,
  CloudRain,
  CloudLightning,
  Wind,
  Snowflake,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { WeatherDataState, Language } from '../../types/weather';

interface ExtremeWeatherViewProps {
  weather: WeatherDataState;
  language: Language;
}

export const ExtremeWeatherView: React.FC<ExtremeWeatherViewProps> = ({ weather }) => {
  const maxTemp = weather.metrics.highestTemperature;
  const totalRain = weather.metrics.totalExpectedRainfall;
  const maxWind = 24;

  const hazards = [
    {
      id: 'heatwave',
      title: 'Heatwave & Canopy Thermal Stress',
      icon: <Flame className="w-5 h-5 text-red-500" />,
      threshold: 'Max Temp ≥ 37°C for 3 consecutive days',
      currentValue: `${maxTemp}°C peak`,
      status: maxTemp >= 37 ? 'Active Watch' : 'Low Risk',
      statusColor: maxTemp >= 37 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200',
      impact: 'Pollen sterility in flowering paddy; rapid blossom drop in tomatoes and chillies.',
      action: 'Apply light mulching and irrigate in early dawn hours to cool the root envelope.',
    },
    {
      id: 'heavy-rain',
      title: 'Monsoon Heavy Downpour & Inundation',
      icon: <CloudRain className="w-5 h-5 text-blue-500" />,
      threshold: 'Single-day rain ≥ 30 mm or 3-day rain ≥ 60 mm',
      currentValue: `${totalRain} mm cumulative (15-day)`,
      status: totalRain >= 50 ? 'Moderate Alert' : 'Low Risk',
      statusColor: totalRain >= 50 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200',
      impact: 'Field waterlogging, root asphyxiation, topsoil nitrogen leaching.',
      action: 'Inspect field peripheral trenches and unblock furrow drain outlets.',
    },
    {
      id: 'squall-wind',
      title: 'Severe Convective Squall & High Wind',
      icon: <Wind className="w-5 h-5 text-teal-600" />,
      threshold: 'Wind gusts ≥ 35 km/h',
      currentValue: `${maxWind} km/h max gusts`,
      status: 'Normal',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      impact: 'Stem lodging in tall crops (maize, banana, mature paddy); spray drift.',
      action: 'Provide staking for vegetable climbers; tie banana pseudostems.',
    },
    {
      id: 'lightning',
      title: 'Thunderstorm & Lightning Hazard',
      icon: <CloudLightning className="w-5 h-5 text-purple-600" />,
      threshold: 'Convective CAPE > 1500 J/kg with thunderstorm radar signature',
      currentValue: 'Low electrical activity',
      status: 'Safe',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      impact: 'Direct safety threat to farm labor and grazing livestock in open fields.',
      action: 'Seek indoor shelter during active thunder or towering anvil cloud formation.',
    },
    {
      id: 'frost',
      title: 'Cold Shock / Winter Frost',
      icon: <Snowflake className="w-5 h-5 text-sky-500" />,
      threshold: 'Night minimum temperature ≤ 4°C',
      currentValue: `${weather.metrics.lowestTemperature}°C night min`,
      status: 'No Risk',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      impact: 'Cell membrane rupture and vegetative tissue frostbite.',
      action: 'Not applicable for current agro-climatic season.',
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-red-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-rose-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-200">
              Extreme Meteorological Hazard Detection
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Extreme Weather Early Warning & Risk Thresholds
          </h1>
          <p className="text-xs text-rose-100/90 mt-1 max-w-xl">
            Calibrated thresholds for agricultural protection in{' '}
            <strong>{weather.location.name}, {weather.location.state}</strong>.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/20 text-center">
          <span className="text-rose-200 block text-[10px] uppercase font-bold">
            Composite Threat Level
          </span>
          <span className="text-xl font-black text-white">
            {maxTemp >= 37 || totalRain >= 60 ? 'Advisory Active' : 'Normal / Low'}
          </span>
        </div>
      </div>

      {/* Extreme Weather Categories List */}
      <div className="space-y-3">
        {hazards.map((hazard) => (
          <div
            key={hazard.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
                {hazard.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900">{hazard.title}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${hazard.statusColor}`}
                  >
                    {hazard.status}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium block mt-0.5">
                  Threshold: {hazard.threshold} • Observed: <strong>{hazard.currentValue}</strong>
                </span>
                <p className="text-xs text-slate-700 font-medium mt-1">
                  <strong>Impact:</strong> {hazard.impact}
                </p>
              </div>
            </div>

            <div className="md:w-64 shrink-0 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                Protective Action
              </span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                {hazard.action}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
