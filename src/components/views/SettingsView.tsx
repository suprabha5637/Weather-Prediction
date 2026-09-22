import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Globe,
  Thermometer,
  Bell,
  MapPin,
  Shield,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { TemperatureUnit, Language } from '../../types/weather';
import { useAuth } from '../../context/AuthContext';

interface SettingsViewProps {
  unit: TemperatureUnit;
  onToggleUnit: (u: TemperatureUnit) => void;
  language: Language;
  onSelectLanguage: (l: Language) => void;
  locationName: string;
  stateName: string;
  onOpenLocationModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  unit,
  onToggleUnit,
  language,
  onSelectLanguage,
  locationName,
  stateName,
  onOpenLocationModal,
}) => {
  const { user, isAuthenticated, openLoginModal, openProfileModal, openFarmModal } = useAuth();

  // Notification Preferences State (persisted to localStorage)
  const [notifyWeatherAlerts, setNotifyWeatherAlerts] = useState<boolean>(true);
  const [notifyRainAlerts, setNotifyRainAlerts] = useState<boolean>(true);
  const [notifyHeatAlerts, setNotifyHeatAlerts] = useState<boolean>(true);
  const [notifyHarvestAlerts, setNotifyHarvestAlerts] = useState<boolean>(true);
  const [notifyCropAdvisory, setNotifyCropAdvisory] = useState<boolean>(false);

  // Privacy State
  const [dataSharing, setDataSharing] = useState<boolean>(true);

  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('krishigo_farmer_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.notifyWeatherAlerts === 'boolean') setNotifyWeatherAlerts(parsed.notifyWeatherAlerts);
        if (typeof parsed.notifyRainAlerts === 'boolean') setNotifyRainAlerts(parsed.notifyRainAlerts);
        if (typeof parsed.notifyHeatAlerts === 'boolean') setNotifyHeatAlerts(parsed.notifyHeatAlerts);
        if (typeof parsed.notifyHarvestAlerts === 'boolean') setNotifyHarvestAlerts(parsed.notifyHarvestAlerts);
        if (typeof parsed.notifyCropAdvisory === 'boolean') setNotifyCropAdvisory(parsed.notifyCropAdvisory);
        if (typeof parsed.dataSharing === 'boolean') setDataSharing(parsed.dataSharing);
      }
    } catch {
      // fallback
    }
  }, []);

  const handleSaveAllSettings = () => {
    const payload = {
      unit,
      language,
      notifyWeatherAlerts,
      notifyRainAlerts,
      notifyHeatAlerts,
      notifyHarvestAlerts,
      notifyCropAdvisory,
      dataSharing,
    };
    try {
      localStorage.setItem('krishigo_farmer_settings', JSON.stringify(payload));
    } catch {
      // safe fallback
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Platform & Agricultural Preferences
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Settings & Farm Configuration
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Configure units, notifications, multilingual interface, and privacy controls.
          </p>
        </div>

        <button
          onClick={handleSaveAllSettings}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All platform settings have been successfully saved!</span>
        </div>
      )}

      {/* 1. Account Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-700" />
          <span>Farmer Account & Profile</span>
        </h3>

        {isAuthenticated && user ? (
          <div className="flex items-center justify-between gap-4 flex-wrap p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-sm font-bold text-slate-900 block">{user.name}</span>
              <span className="text-xs text-slate-500 font-medium block">
                Phone: {user.phone || 'N/A'} • Provider: {user.auth_provider}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openProfileModal}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Edit My Profile
              </button>
              <button
                onClick={openFarmModal}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Edit Farm Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 flex-wrap p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-sm font-bold text-slate-800 block">Not Logged In</span>
              <span className="text-xs text-slate-500 font-medium block">
                Sign in with Google or Phone to sync your farm profile across devices.
              </span>
            </div>
            <button
              onClick={openLoginModal}
              className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Sign In / Register
            </button>
          </div>
        )}
      </div>

      {/* 2. Language & Units Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language Selection */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>Application Language (भाषा)</span>
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: 'en' as Language, label: 'English', sub: 'English' },
              { code: 'hi' as Language, label: 'हिन्दी', sub: 'Hindi' },
              { code: 'bn' as Language, label: 'বাংলা', sub: 'Bengali' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSelectLanguage(lang.code)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  language === lang.code
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                }`}
              >
                <span className="text-sm block">{lang.label}</span>
                <span className="text-[10px] text-slate-500 block">{lang.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Temperature Unit */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-emerald-700" />
            <span>Global Temperature Unit</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onToggleUnit('C')}
              className={`p-3 rounded-xl border text-center transition-all ${
                unit === 'C'
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
              }`}
            >
              <span className="text-lg font-black block">°C</span>
              <span className="text-xs text-slate-600 block mt-0.5">Celsius</span>
            </button>
            <button
              onClick={() => onToggleUnit('F')}
              className={`p-3 rounded-xl border text-center transition-all ${
                unit === 'F'
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
              }`}
            >
              <span className="text-lg font-black block">°F</span>
              <span className="text-xs text-slate-600 block mt-0.5">Fahrenheit</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Notification Preferences */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-700" />
          <span>Agricultural Notification Preferences</span>
        </h3>

        <div className="space-y-3 divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Extreme Weather Alerts
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Receive warnings for severe heatwaves, lightning, and storms.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyWeatherAlerts}
              onChange={(e) => setNotifyWeatherAlerts(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Rainfall & Inundation Warnings
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Notifications before heavy precipitation events (&gt; 25 mm).
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyRainAlerts}
              onChange={(e) => setNotifyRainAlerts(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Thermal Stress & Heatwave Bulletins
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Alerts when temperatures exceed 37°C.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyHeatAlerts}
              onChange={(e) => setNotifyHeatAlerts(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Harvest Window Alerts
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Notifications for optimal dry harvest and sun-drying windows.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyHarvestAlerts}
              onChange={(e) => setNotifyHarvestAlerts(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Daily AI Crop Advisory Digest
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Morning briefing with spraying and irrigation recommendations.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyCropAdvisory}
              onChange={(e) => setNotifyCropAdvisory(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Location & Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Default Farm Location</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Currently set to: <strong>{locationName}, {stateName}</strong>
          </p>
          <button
            onClick={onOpenLocationModal}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            Change Farm Location
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>Privacy & Farm Security</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Your GPS coordinates and farm crop data are stored privately and securely.
          </p>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={dataSharing}
              onChange={(e) => setDataSharing(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500"
            />
            <span>Allow anonymous meteorological model improvement</span>
          </label>
        </div>
      </div>
    </div>
  );
};
