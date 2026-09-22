import React from 'react';
import {
  Cloud,
  Calendar,
  Clock,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  CloudSun,
  Sun,
  Gauge,
  AlertTriangle,
  BellRing,
  Map,
  Sprout,
  Wrench,
  Layers,
  FileText,
  Settings,
  Leaf,
} from 'lucide-react';

export type SidebarTab =
  | 'overview'
  | '15-day'
  | 'hourly'
  | 'rainfall'
  | 'temperature'
  | 'humidity'
  | 'wind'
  | 'air-quality'
  | 'cloud-cover'
  | 'uv-index'
  | 'pressure'
  | 'extreme-weather'
  | 'alerts'
  | 'maps'
  | 'crop-advisory'
  | 'agri-tools'
  | 'soil-insights'
  | 'satellite'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const navItems: { id: SidebarTab; label: string; icon: React.ReactNode; isNew?: boolean }[] = [
    { id: 'overview', label: 'Weather Overview', icon: <Cloud className="w-4 h-4" /> },
    { id: '15-day', label: '15-Day Forecast', icon: <Calendar className="w-4 h-4" /> },
    { id: 'hourly', label: 'Hourly Forecast', icon: <Clock className="w-4 h-4" /> },
    { id: 'rainfall', label: 'Rainfall Prediction', icon: <CloudRain className="w-4 h-4" /> },
    { id: 'temperature', label: 'Temperature', icon: <Thermometer className="w-4 h-4" /> },
    { id: 'humidity', label: 'Humidity', icon: <Droplets className="w-4 h-4" /> },
    { id: 'wind', label: 'Wind', icon: <Wind className="w-4 h-4" /> },
    { id: 'air-quality', label: 'Air Quality', icon: <Activity className="w-4 h-4" /> },
    { id: 'cloud-cover', label: 'Cloud Cover', icon: <CloudSun className="w-4 h-4" /> },
    { id: 'uv-index', label: 'UV Index', icon: <Sun className="w-4 h-4" /> },
    { id: 'pressure', label: 'Pressure', icon: <Gauge className="w-4 h-4" /> },
    { id: 'extreme-weather', label: 'Extreme Weather', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'alerts', label: 'Weather Alerts', icon: <BellRing className="w-4 h-4" /> },
    { id: 'maps', label: 'Weather Maps', icon: <Map className="w-4 h-4" /> },
  ];

  const secondaryItems: { id: SidebarTab; label: string; icon: React.ReactNode; isNew?: boolean }[] = [
    { id: 'crop-advisory', label: 'Crop Advisory', icon: <Sprout className="w-4 h-4" />, isNew: true },
    { id: 'agri-tools', label: 'Agri Tools', icon: <Wrench className="w-4 h-4" /> },
    { id: 'soil-insights', label: 'Soil & Field Insights', icon: <Layers className="w-4 h-4" /> },
    { id: 'satellite', label: 'Satellite View', icon: <Layers className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between min-h-[calc(100vh-61px)] p-3">
      <div className="space-y-1">
        {/* Main Weather Intelligence Navigation */}
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Divider */}
        <div className="pt-2 pb-1">
          <div className="h-px bg-slate-200" />
        </div>

        {/* Agricultural Intelligence & Tools Navigation */}
        <div className="space-y-0.5">
          {secondaryItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.isNew && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Promo Card: "Same Sky. Brighter Harvests." with agricultural background */}
      <div className="mt-4 rounded-2xl overflow-hidden relative border border-emerald-900/20 shadow-xs group cursor-pointer">
        <img
          src="/images/hero-farm.jpg"
          alt="Same Sky Brighter Harvests"
          className="w-full h-24 object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex flex-col justify-end">
          <div className="flex items-center gap-1.5 text-white">
            <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-xs font-extrabold tracking-wide drop-shadow-sm leading-tight">
              Same Sky. Brighter Harvests.
            </span>
          </div>
          <span className="text-[10px] text-emerald-200/90 font-medium">
            KrishiGo Farmer Weather
          </span>
        </div>
      </div>
    </aside>
  );
};
