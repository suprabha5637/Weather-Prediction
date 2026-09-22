import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, SidebarTab } from './components/layout/Sidebar';
import { HeroBanner } from './components/weather/HeroBanner';
import { CurrentWeatherCard } from './components/weather/CurrentWeatherCard';
import { WeatherSummaryCard } from './components/weather/WeatherSummaryCard';
import { WeatherAlertsCard } from './components/weather/WeatherAlertsCard';
import { LocationDetailsCard } from './components/weather/LocationDetailsCard';
import { WeatherMetricsStrip } from './components/weather/WeatherMetricsStrip';
import { FifteenDayForecast } from './components/weather/FifteenDayForecast';
import { CropsForWeather } from './components/weather/CropsForWeather';
import { WeatherTrendsAndMetrics } from './components/weather/WeatherTrendsAndMetrics';
import { AICropAdvisory } from './components/weather/AICropAdvisory';
import { FarmActionCalendar } from './components/weather/FarmActionCalendar';
import { WeatherMapSection } from './components/weather/WeatherMapSection';
import { HourlyForecastSection } from './components/weather/HourlyForecastSection';
import { Footer } from './components/layout/Footer';
import {
  AIWeatherCopilotModal,
  AskAIFloatingButton,
} from './components/weather/AIWeatherCopilotModal';
import { WhatIfSimulatorModal } from './components/weather/WhatIfSimulatorModal';
import { ForecastVerificationModal } from './components/weather/ForecastVerificationModal';
import { CropDetailModal } from './components/weather/CropDetailModal';
import { LocationSearchModal } from './components/weather/LocationSearchModal';
import { ForecastChangeAlert } from './components/weather/ForecastChangeAlert';
import { MLOpsRegistryModal } from './components/weather/MLOpsRegistryModal';
import { AlertDetailModal } from './components/weather/AlertDetailModal';
import {
  INITIAL_WEATHER_DATA,
} from './services/weatherService';
import { TemperatureUnit, Language, LocationInfo, CropItem, WeatherAlert } from './types/weather';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginModal } from './components/auth/LoginModal';
import { FarmerProfileModal } from './components/auth/FarmerProfileModal';
import { FarmProfileModal } from './components/auth/FarmProfileModal';
import { SessionExpiredModal } from './components/auth/SessionExpiredModal';
import { LoginRequiredModal } from './components/auth/LoginRequiredModal';

// ── Dedicated View Components ──────────────────────────────
import { RainfallView } from './components/views/RainfallView';
import { TemperatureView } from './components/views/TemperatureView';
import { HumidityView } from './components/views/HumidityView';
import { WindView } from './components/views/WindView';
import { AirQualityView } from './components/views/AirQualityView';
import { CloudCoverView } from './components/views/CloudCoverView';
import { UVIndexView } from './components/views/UVIndexView';
import { PressureView } from './components/views/PressureView';
import { ExtremeWeatherView } from './components/views/ExtremeWeatherView';
import { WeatherAlertsView } from './components/views/WeatherAlertsView';
import { AgriToolsView } from './components/views/AgriToolsView';
import { SoilInsightsView } from './components/views/SoilInsightsView';
import { SatelliteView } from './components/views/SatelliteView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

function FarmerWeatherDashboard() {
  const {
    user,
    farmProfile,
    isAuthenticated,
    showLoginModal,
    closeLoginModal,
    showProfileModal,
    closeProfileModal,
    showFarmModal,
    closeFarmModal,
    showSessionExpiredModal,
    closeSessionExpiredModal,
    showLoginRequiredModal,
    closeLoginRequiredModal,
  } = useAuth();

  const [weatherData, setWeatherData] = useState(INITIAL_WEATHER_DATA);
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<SidebarTab>('overview');
  const [isLiveMode, setIsLiveMode] = useState(false);

  // Sync farm profile with weather dashboard location when farmer is authenticated
  React.useEffect(() => {
    if (isAuthenticated && farmProfile) {
      setWeatherData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          name: farmProfile.farm_name
            ? `${farmProfile.farm_name} (${farmProfile.district || farmProfile.location})`
            : (farmProfile.location || prev.location.name),
          state: farmProfile.state || prev.location.state,
          latitude: farmProfile.latitude || prev.location.latitude,
          longitude: farmProfile.longitude || prev.location.longitude,
        },
      }));
    }
  }, [isAuthenticated, farmProfile]);

  // Modals state
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isMLOpsOpen, setIsMLOpsOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropItem | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<WeatherAlert | null>(null);

  const handleUseMyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = Number(position.coords.latitude.toFixed(4));
          const lon = Number(position.coords.longitude.toFixed(4));

          let resolvedName = 'GPS Field Node';
          let resolvedState = 'India';

          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
            );
            if (res.ok) {
              const geo = await res.json();
              resolvedName = geo.locality || geo.city || geo.principalSubdivision || 'Field Location';
              resolvedState = geo.principalSubdivision || geo.countryName || 'India';
            }
          } catch {
            // Graceful fallback
          }

          setWeatherData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              name: resolvedName,
              state: resolvedState,
              latitude: lat,
              longitude: lon,
            },
          }));
        },
        () => {
          alert('Location permission was denied. Please select your location manually.');
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      alert('Location permission was denied. Please select your location manually.');
    }
  };

  const handleSelectLocation = (newLoc: LocationInfo) => {
    setWeatherData((prev) => ({
      ...prev,
      location: newLoc,
    }));
  };

  const handleSelectTab = (tab: SidebarTab) => {
    setActiveTab(tab);
  };

  // ── Persistent chrome (Header + Sidebar + Footer stay on all tabs) ──
  // ── Only the <main> content area swaps ──

  const renderMainContent = () => {
    switch (activeTab) {
      // ── Weather parameter dedicated views ──────────────────
      case 'rainfall':
        return <RainfallView weather={weatherData} unit={unit} language={language} />;

      case 'temperature':
        return (
          <TemperatureView
            weather={weatherData}
            unit={unit}
            onToggleUnit={setUnit}
            language={language}
          />
        );

      case 'humidity':
        return <HumidityView weather={weatherData} language={language} />;

      case 'wind':
        return <WindView weather={weatherData} language={language} />;

      case 'air-quality':
        return <AirQualityView weather={weatherData} language={language} />;

      case 'cloud-cover':
        return <CloudCoverView weather={weatherData} language={language} />;

      case 'uv-index':
        return <UVIndexView weather={weatherData} language={language} />;

      case 'pressure':
        return <PressureView weather={weatherData} language={language} />;

      case 'extreme-weather':
        return <ExtremeWeatherView weather={weatherData} language={language} />;

      case 'alerts':
        return (
          <>
            <WeatherAlertsView weather={weatherData} language={language} />
            <AlertDetailModal
              alert={selectedAlert}
              onClose={() => setSelectedAlert(null)}
              language={language}
            />
          </>
        );

      // ── Maps / Satellite ────────────────────────────────────
      case 'maps':
        return (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-lg font-bold text-slate-800">🗺️ Interactive Weather Maps</h2>
            <WeatherMapSection location={weatherData.location} />
          </div>
        );

      case 'satellite':
        return <SatelliteView location={weatherData.location} />;

      // ── Hourly dedicated view ───────────────────────────────
      case 'hourly':
        return (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-lg font-bold text-slate-800">⏰ 72-Hour Hourly Forecast</h2>
            <HourlyForecastSection hourly={weatherData.hourly} unit={unit} language={language} />
          </div>
        );

      // ── 15-Day dedicated view ───────────────────────────────
      case '15-day':
        return (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-lg font-bold text-slate-800">📅 15-Day Forecast</h2>
            <FifteenDayForecast
              daily={weatherData.daily15}
              unit={unit}
              language={language}
              locationName={weatherData.location.name}
            />
            <FarmActionCalendar calendar={weatherData.calendar15} language={language} />
          </div>
        );

      // ── Agricultural intelligence views ─────────────────────
      case 'crop-advisory':
        return (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-lg font-bold text-slate-800">🌾 AI Crop Advisory</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
              <CropsForWeather
                cropsPlanting={weatherData.cropsPlanting}
                cropsHarvest={weatherData.cropsHarvest}
                language={language}
                onViewAllCrops={() => setSelectedCrop(weatherData.cropsPlanting[0])}
                onSelectCrop={(crop) => setSelectedCrop(crop)}
              />
              <AICropAdvisory
                advisory={weatherData.advisory}
                farmerTips={weatherData.farmerTips}
                language={language}
                onOpenWhatIf={() => setIsWhatIfOpen(true)}
              />
              <WeatherTrendsAndMetrics
                daily={weatherData.daily15}
                metrics={weatherData.metrics}
                language={language}
              />
            </div>
            <FarmActionCalendar calendar={weatherData.calendar15} language={language} />
          </div>
        );

      case 'agri-tools':
        return <AgriToolsView weather={weatherData} language={language} />;

      case 'soil-insights':
        return <SoilInsightsView weather={weatherData} language={language} />;

      // ── Reports & Settings ──────────────────────────────────
      case 'reports':
        return <ReportsView weather={weatherData} unit={unit} language={language} />;

      case 'settings':
        return (
          <SettingsView
            unit={unit}
            onToggleUnit={setUnit}
            language={language}
            onSelectLanguage={setLanguage}
            locationName={weatherData.location.name}
            stateName={weatherData.location.state}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
          />
        );

      // ── Overview (default) ──────────────────────────────────
      case 'overview':
      default:
        return (
          <>
            {/* Hero Banner */}
            <HeroBanner language={language} />

            {/* Forecast Change Detection Banner */}
            <ForecastChangeAlert language={language} />

            {/* Top Row: Current Weather | Summary | Alerts | Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 mb-4">
              <CurrentWeatherCard
                current={weatherData.current}
                unit={unit}
                language={language}
              />

              <WeatherSummaryCard
                summaryText={weatherData.summaryText}
                noHeavyRain24h={weatherData.noHeavyRain24h}
                language={language}
              />

              <WeatherAlertsCard
                alerts={weatherData.alerts}
                language={language}
                onViewAllAlerts={() => setActiveTab('alerts')}
                onSelectAlert={(alert) => setSelectedAlert(alert)}
              />

              <LocationDetailsCard
                location={weatherData.location}
                language={language}
                onEditLocation={() => setIsLocationModalOpen(true)}
              />
            </div>

            {/* Weather Metrics Strip */}
            <WeatherMetricsStrip
              current={weatherData.current}
              unit={unit}
              language={language}
            />

            {/* 15-Day Forecast */}
            <FifteenDayForecast
              daily={weatherData.daily15}
              unit={unit}
              language={language}
              locationName={weatherData.location.name}
            />

            {/* Lower 3-Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 mb-4">
              <CropsForWeather
                cropsPlanting={weatherData.cropsPlanting}
                cropsHarvest={weatherData.cropsHarvest}
                language={language}
                onViewAllCrops={() => setSelectedCrop(weatherData.cropsPlanting[0])}
                onSelectCrop={(crop) => setSelectedCrop(crop)}
              />

              <WeatherTrendsAndMetrics
                daily={weatherData.daily15}
                metrics={weatherData.metrics}
                language={language}
              />

              <AICropAdvisory
                advisory={weatherData.advisory}
                farmerTips={weatherData.farmerTips}
                language={language}
                onOpenWhatIf={() => setIsWhatIfOpen(true)}
              />
            </div>

            {/* Hourly Forecast */}
            <HourlyForecastSection
              hourly={weatherData.hourly}
              unit={unit}
              language={language}
            />

            {/* Farm Action Calendar */}
            <FarmActionCalendar
              calendar={weatherData.calendar15}
              language={language}
            />

            {/* Weather Maps */}
            <WeatherMapSection location={weatherData.location} />

            {/* Forecast Verification Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                  🎯
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Forecast Verification & Model Accuracy Tracking
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Yesterday's Error: ±0.6°C • Rain Brier Score: 0.14 • 1,840 Walk-Forward Validated Horizons
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMLOpsOpen(true)}
                  className="text-xs font-semibold px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <span>🔬 MLOps Model Registry</span>
                </button>
                <button
                  onClick={() => setIsVerificationOpen(true)}
                  className="text-xs font-semibold px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-2xs transition-colors"
                >
                  View Verification Report →
                </button>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* 1. Main Header */}
      <Header
        unit={unit}
        onToggleUnit={setUnit}
        language={language}
        onSelectLanguage={setLanguage}
        locationName={weatherData.location.name}
        stateName={weatherData.location.state}
        onUseMyLocation={handleUseMyLocation}
        onOpenSettings={() => setIsLocationModalOpen(true)}
        isLiveMode={isLiveMode}
        onToggleLiveMode={setIsLiveMode}
      />

      {/* 2. Main App Body (Sidebar + Content) */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto">
        {/* Left Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
          />
        </div>

        {/* Main Content Canvas */}
        <main className="flex-1 p-3 sm:p-5 overflow-x-hidden">
          {renderMainContent()}

          {/* Footer — always visible at bottom of content */}
          <Footer language={language} />
        </main>
      </div>

      {/* Floating Ask AI Button */}
      <AskAIFloatingButton onClick={() => setIsCopilotOpen(true)} />

      {/* ── Global Modals ─────────────────────────────────── */}
      <AIWeatherCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        weather={weatherData}
      />

      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        weather={weatherData}
      />

      <ForecastVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        verification={weatherData.verification}
      />

      <MLOpsRegistryModal
        isOpen={isMLOpsOpen}
        onClose={() => setIsMLOpsOpen(false)}
      />

      <CropDetailModal
        crop={selectedCrop}
        onClose={() => setSelectedCrop(null)}
      />

      <LocationSearchModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={weatherData.location}
        onSelectLocation={handleSelectLocation}
      />

      {/* Alert Detail Modal — wired to alert card clicks */}
      <AlertDetailModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        language={language}
      />

      {/* KrishiGo Farmer Account & Authentication Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={closeLoginModal}
      />

      <FarmerProfileModal
        isOpen={showProfileModal}
        onClose={closeProfileModal}
      />

      <FarmProfileModal
        isOpen={showFarmModal}
        onClose={closeFarmModal}
        onFarmProfileUpdated={(updated) => {
          setWeatherData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              name: updated.farm_name
                ? `${updated.farm_name} (${updated.district || updated.location})`
                : (updated.location || prev.location.name),
              state: updated.state || prev.location.state,
              latitude: updated.latitude || prev.location.latitude,
              longitude: updated.longitude || prev.location.longitude,
            },
          }));
        }}
      />

      <SessionExpiredModal
        isOpen={showSessionExpiredModal}
        onClose={closeSessionExpiredModal}
      />

      <LoginRequiredModal
        isOpen={showLoginRequiredModal}
        onClose={closeLoginRequiredModal}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <FarmerWeatherDashboard />
    </AuthProvider>
  );
}

export default App;
