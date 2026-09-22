import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { LocationInfo, Language } from '../../types/weather';
import { getTranslation } from '../../utils/translations';
import L from 'leaflet';

interface LocationDetailsCardProps {
  location: LocationInfo;
  language: Language;
  onEditLocation?: () => void;
}

export const LocationDetailsCard: React.FC<LocationDetailsCardProps> = ({
  location,
  language,
  onEditLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet map
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      // Custom marker icon
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="background-color: #0f766e; color: white; padding: 6px; border-radius: 9999px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([location.latitude, location.longitude], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${location.name}</b><br/>${location.state}`);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([location.latitude, location.longitude], 11);
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location.latitude, location.longitude, location.name, location.state]);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header with Edit link */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-slate-800">
            <Navigation className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold tracking-tight">
              {getTranslation(language, 'locationDetails')}
            </h2>
          </div>
          <button
            onClick={onEditLocation}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            {getTranslation(language, 'edit')}
          </button>
        </div>

        {/* Mini Interactive Map container */}
        <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-200 relative mb-3 shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full" />
          <div className="absolute top-2 left-2 z-[400] bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md text-[11px] font-bold text-slate-700 flex items-center gap-1 shadow-xs border border-slate-200/60">
            <MapPin className="w-3 h-3 text-emerald-600" />
            <span>{location.name}, {location.state}</span>
          </div>
        </div>
      </div>

      {/* 4 Coordinate Details in Row Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-500 block">
            {getTranslation(language, 'latitude')}
          </span>
          <span className="font-bold text-slate-800 font-mono text-[11px]">
            {location.latitude.toFixed(4)}° N
          </span>
        </div>

        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-500 block">
            {getTranslation(language, 'longitude')}
          </span>
          <span className="font-bold text-slate-800 font-mono text-[11px]">
            {location.longitude.toFixed(4)}° E
          </span>
        </div>

        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-500 block">
            {getTranslation(language, 'altitude')}
          </span>
          <span className="font-bold text-slate-800 text-[11px]">
            {location.altitude} m
          </span>
        </div>

        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-500 block">
            {getTranslation(language, 'timeZone')}
          </span>
          <span className="font-bold text-slate-800 text-[11px]">
            {location.timezone}
          </span>
        </div>
      </div>
    </div>
  );
};
