import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Layers,
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  Cloud,
  Sun,
  ShieldAlert,
  Satellite,
} from 'lucide-react';
import { LocationInfo } from '../../types/weather';
import L from 'leaflet';

interface WeatherMapSectionProps {
  location: LocationInfo;
}

export type WeatherLayerType =
  | 'temperature'
  | 'precipitation'
  | 'wind'
  | 'clouds'
  | 'humidity'
  | 'satellite';

export const WeatherMapSection: React.FC<WeatherMapSectionProps> = ({ location }) => {
  const [activeLayer, setActiveLayer] = useState<WeatherLayerType>('precipitation');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 9,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Farm boundary circle (5 km buffer)
      L.circle([location.latitude, location.longitude], {
        color: '#0f766e',
        fillColor: '#10b981',
        fillOpacity: 0.15,
        radius: 5000,
      })
        .addTo(map)
        .bindPopup(`<b>${location.name} Agricultural Command Zone</b><br/>5km Microclimate Observation Radius`);

      // Farm Location Pin
      const pinIcon = L.divIcon({
        className: 'farm-pin',
        html: `
          <div style="background-color: #0f766e; color: white; padding: 6px; border-radius: 9999px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
            🌾
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      });

      L.marker([location.latitude, location.longitude], { icon: pinIcon })
        .addTo(map)
        .bindPopup(`<b>KrishiGo Farm Node</b><br/>Varanasi, UP`);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location.latitude, location.longitude, location.name]);

  const layers: { id: WeatherLayerType; label: string; icon: React.ReactNode }[] = [
    { id: 'precipitation', label: 'Rainfall / Radar', icon: <CloudRain className="w-3.5 h-3.5" /> },
    { id: 'temperature', label: 'Temperature (°C)', icon: <Thermometer className="w-3.5 h-3.5" /> },
    { id: 'wind', label: 'Wind Vector', icon: <Wind className="w-3.5 h-3.5" /> },
    { id: 'clouds', label: 'Cloud Cover', icon: <Cloud className="w-3.5 h-3.5" /> },
    { id: 'humidity', label: 'Relative Humidity', icon: <Droplets className="w-3.5 h-3.5" /> },
    { id: 'satellite', label: 'Satellite IR', icon: <Satellite className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-4">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
            <Layers className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Interactive Weather Maps & Satellite Layers
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Real-time Doppler precipitation radar and regional meteorological projections
            </p>
          </div>
        </div>

        {/* Layer Selector Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                activeLayer === layer.id
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {layer.icon}
              <span>{layer.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md text-xs space-y-1 max-w-xs">
          <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
            Layer: {activeLayer.toUpperCase()}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-slate-600">
            <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-600 inline-block" />
            <span>5km Agricultural Zone</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gradient-to-r from-blue-300 via-emerald-400 to-amber-500 mt-1" />
          <div className="flex justify-between text-[9px] text-slate-400 font-mono">
            <span>Low</span>
            <span>Medium</span>
            <span>Severe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
