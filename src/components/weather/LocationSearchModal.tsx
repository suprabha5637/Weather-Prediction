import React, { useState } from 'react';
import { X, Search, MapPin, Check } from 'lucide-react';
import { LocationInfo } from '../../types/weather';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
}

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const popularLocations: LocationInfo[] = [
    {
      name: 'Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      country: 'India',
      latitude: 25.3176,
      longitude: 82.9739,
      altitude: 80,
      timezone: 'IST (UTC+5:30)',
    },
    {
      name: 'Gorakhpur',
      district: 'Gorakhpur',
      state: 'Uttar Pradesh',
      country: 'India',
      latitude: 26.7606,
      longitude: 83.3732,
      altitude: 84,
      timezone: 'IST (UTC+5:30)',
    },
    {
      name: 'Lucknow',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      country: 'India',
      latitude: 26.8467,
      longitude: 80.9462,
      altitude: 123,
      timezone: 'IST (UTC+5:30)',
    },
    {
      name: 'Patna',
      district: 'Patna',
      state: 'Bihar',
      country: 'India',
      latitude: 25.5941,
      longitude: 85.1376,
      altitude: 53,
      timezone: 'IST (UTC+5:30)',
    },
    {
      name: 'Indore',
      district: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      latitude: 22.7196,
      longitude: 75.8577,
      altitude: 553,
      timezone: 'IST (UTC+5:30)',
    },
    {
      name: 'Kolkata',
      district: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
      latitude: 22.5726,
      longitude: 88.3639,
      altitude: 9,
      timezone: 'IST (UTC+5:30)',
    },
  ];

  const filtered = popularLocations.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-200" />
            <h2 className="text-base font-bold">Select Farm Location</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search district, village, or state..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Location List */}
        <div className="p-2 max-h-72 overflow-y-auto space-y-1">
          {filtered.map((loc) => {
            const isSelected = loc.name === currentLocation.name;
            return (
              <div
                key={loc.name}
                onClick={() => {
                  onSelectLocation(loc);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs sm:text-sm block">
                      {loc.name}, {loc.state}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Lat: {loc.latitude.toFixed(2)}° • Lon: {loc.longitude.toFixed(2)}° • Alt: {loc.altitude}m
                    </span>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-emerald-700" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
