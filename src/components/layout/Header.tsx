import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ChevronDown,
  Cloud,
  User as UserIcon,
} from 'lucide-react';
import { TemperatureUnit, Language } from '../../types/weather';
import { getTranslation } from '../../utils/translations';
import { useAuth } from '../../context/AuthContext';
import { FarmerAccountDropdown } from '../auth/FarmerAccountDropdown';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  locationName: string;
  stateName: string;
  onUseMyLocation: () => void;
  onOpenSettings?: () => void;
  isLiveMode?: boolean;
  onToggleLiveMode?: (live: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  language,
  onSelectLanguage,
  locationName,
  stateName,
  onUseMyLocation,
  onOpenSettings,
}) => {
  const {
    user,
    farmProfile,
    isAuthenticated,
    openLoginModal,
    openProfileModal,
    openFarmModal,
  } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedOutDropdownOpen, setIsLoggedOutDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const loggedOutRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (loggedOutRef.current && !loggedOutRef.current.contains(e.target as Node)) {
        setIsLoggedOutDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'http://localhost:3002/';
    }
  };

  // Determine displayed location (if farmer is logged in and has saved farm location)
  const displayLocation =
    isAuthenticated && farmProfile?.location
      ? farmProfile.location
      : `${locationName}, ${stateName}`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs h-16 md:h-[68px] flex items-center px-3 sm:px-5">
      <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between gap-3 lg:gap-6">
        
        {/* ========================================================
            HEADER LEFT SECTION: Back, Farmer Logo, Location, Use My Location
            ======================================================== */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 1. Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
            title="Return to Farmer Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{getTranslation(language, 'back')}</span>
          </button>

          {/* 2. Canonical Farmer Logo - exact asset without redesign */}
          <div className="flex items-center shrink-0">
            <img
              src="/images/Logo_Farmer.jpeg"
              alt="Farmer - Powered by KrishiGo"
              className="h-10 md:h-11 w-auto object-contain rounded-md"
            />
          </div>

          {/* 3. Location Selector Pill */}
          <div
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs text-slate-700 transition-colors cursor-pointer shadow-2xs max-w-[160px] sm:max-w-[210px] md:max-w-[240px]"
            title="Select Farm Location"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-800 truncate">
              {displayLocation}
            </span>
          </div>

          {/* 4. Use My Location Button */}
          <button
            onClick={onUseMyLocation}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl shadow-2xs transition-all active:scale-95 shrink-0 cursor-pointer"
            title="Detect GPS Field Coordinates"
          >
            <MapPin className="w-3.5 h-3.5 fill-white text-emerald-600 shrink-0" />
            <span className="hidden md:inline">{getTranslation(language, 'useMyLocation')}</span>
            <span className="md:hidden">GPS</span>
          </button>
        </div>

        {/* ========================================================
            HEADER CENTER SECTION: Compact Weather Navigation Item
            ======================================================== */}
        <div className="flex items-center justify-center shrink-0">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-2xs select-none">
            <Cloud className="w-4 h-4 text-emerald-600 fill-emerald-600/20 shrink-0" />
            <span className="uppercase">{getTranslation(language, 'weather')}</span>
          </div>
        </div>

        {/* ========================================================
            HEADER RIGHT SECTION: °C/°F, Language Dropdown, Date, Farmer Profile
            ======================================================== */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 6. Temperature Unit Toggle [ °C | °F ] */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => onToggleUnit('C')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                unit === 'C'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onToggleUnit('F')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                unit === 'F'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              °F
            </button>
          </div>

          {/* 7. Language Single Dropdown: [ EN ▼ ] */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200/80 px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer select-none"
              title="Select Language"
            >
              <span>{language.toUpperCase()}</span>
              <ChevronDown
                className={`w-3 h-3 text-slate-500 transition-transform ${
                  isLangDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in duration-100">
                <button
                  onClick={() => {
                    onSelectLanguage('en');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                    language === 'en'
                      ? 'font-bold text-emerald-800 bg-emerald-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  English (EN)
                </button>
                <button
                  onClick={() => {
                    onSelectLanguage('hi');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                    language === 'hi'
                      ? 'font-bold text-emerald-800 bg-emerald-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  हिन्दी (HI)
                </button>
                <button
                  onClick={() => {
                    onSelectLanguage('bn');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                    language === 'bn'
                      ? 'font-bold text-emerald-800 bg-emerald-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  বাংলা (BN)
                </button>
              </div>
            )}
          </div>

          {/* 8. Date / Last Updated (Compact 2-line element) */}
          <div className="hidden xl:flex flex-col text-right leading-tight">
            <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-slate-700">
              <Calendar className="w-3 h-3 text-emerald-700 shrink-0" />
              <span>Today, 10 Sep 2025</span>
            </div>
            <span className="text-[10px] text-slate-400">
              Last updated: 10:30 AM
            </span>
          </div>

          {/* 9. Farmer Profile / Login Trigger */}
          <div className="relative pl-1 sm:pl-2 border-l border-slate-200">
            {isAuthenticated && user ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer select-none text-left"
                title="Account Menu"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs shadow-2xs overflow-hidden shrink-0">
                  {user.profile_image && user.profile_image.startsWith('http') ? (
                    <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.profile_image || '👨‍🌾'}</span>
                  )}
                </div>
                <div className="hidden md:flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
            ) : (
              <div ref={loggedOutRef} className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLoggedOutDropdownOpen(!isLoggedOutDropdownOpen);
                  }}
                  className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer select-none"
                  title="Login to Farmer Platform"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs shadow-2xs shrink-0">
                    <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-800">
                      Login
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                        isLoggedOutDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Logged-Out Prompt Dropdown */}
                {isLoggedOutDropdownOpen && !isAuthenticated && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm">
                        👨‍🌾
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Welcome to Farmer</h4>
                        <p className="text-[10px] text-slate-500">KrishiGo Ecosystem</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">
                      Login to access your personalized farming dashboard, saved crop advisories, and SMS weather alerts.
                    </p>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setIsLoggedOutDropdownOpen(false);
                          openLoginModal();
                        }}
                        className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                      >
                        Login
                      </button>

                      <div className="text-center text-[11px] text-slate-500">
                        New farmer?{' '}
                        <button
                          onClick={() => {
                            setIsLoggedOutDropdownOpen(false);
                            openLoginModal();
                          }}
                          className="text-emerald-700 font-bold hover:underline"
                        >
                          Create an account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Logged-In Account Dropdown */}
            <FarmerAccountDropdown
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              onOpenProfile={openProfileModal}
              onOpenFarmProfile={openFarmModal}
              onOpenSettings={onOpenSettings}
            />
          </div>
        </div>

      </div>
    </header>
  );
};
