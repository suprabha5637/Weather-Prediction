import React, { useRef, useEffect } from 'react';
import {
  User,
  Sprout,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface FarmerAccountDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenFarmProfile: () => void;
  onOpenSettings?: () => void;
}

export const FarmerAccountDropdown: React.FC<FarmerAccountDropdownProps> = ({
  isOpen,
  onClose,
  onOpenProfile,
  onOpenFarmProfile,
  onOpenSettings,
}) => {
  const { user, farmProfile, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* User Info Header */}
      <div className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-bold shadow-xs shrink-0 overflow-hidden">
            {user.profile_image && user.profile_image.startsWith('http') ? (
              <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user.profile_image || '👨‍🌾'}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-extrabold text-slate-800 truncate">{user.name}</h4>
              <span title="Verified Farmer" className="inline-flex items-center">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">
              {user.phone || user.email || 'Farmer Account'}
            </p>
            {farmProfile && (
              <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800">
                🌱 {farmProfile.farm_name || 'My Farm'} • {farmProfile.farm_size} {farmProfile.farm_size_unit}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Menu Actions */}
      <div className="p-2 space-y-1">
        {/* My Profile */}
        <button
          onClick={() => {
            onClose();
            onOpenProfile();
          }}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-600 group-hover:text-emerald-700 transition-colors">
              <User className="w-3.5 h-3.5" />
            </div>
            <span>My Profile</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
        </button>

        {/* Farm Profile */}
        <button
          onClick={() => {
            onClose();
            onOpenFarmProfile();
          }}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-600 group-hover:text-emerald-700 transition-colors">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div>Farm Profile</div>
              <div className="text-[10px] text-slate-400 font-normal">
                {farmProfile?.location || 'Set crops & acreage'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            onClose();
            if (onOpenSettings) onOpenSettings();
          }}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-600 group-hover:text-emerald-700 transition-colors">
              <Settings className="w-3.5 h-3.5" />
            </div>
            <span>Weather Settings</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
        </button>

        {/* Security & Sessions */}
        <button
          onClick={() => {
            onClose();
            onOpenProfile();
          }}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-600 group-hover:text-emerald-700 transition-colors">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span>Security & Sessions</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
        </button>
      </div>

      {/* KrishiGo Farmer Platform link */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>KrishiGo Farmer Ecosystem</span>
        <a
          href="http://localhost:3002/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
        >
          <span>Farmer App</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Logout Action */}
      <div className="p-2 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
