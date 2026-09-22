import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('👨‍🌾');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const AVATAR_OPTIONS = ['👨‍🌾', '👩‍🌾', '🌾', '🚜', '🌱', '☀️'];

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.profile_image || '👨‍🌾');
      setError(null);
      setSuccess(null);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Farmer name cannot be empty');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim() || null,
        profile_image: avatar,
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              {avatar}
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                KrishiGo Account
              </div>
              <h2 className="text-xl font-extrabold text-white">Farmer Profile</h2>
            </div>
          </div>
          <p className="mt-1 text-xs text-emerald-100/80">
            Manage your personal contact details, verified credentials, and preferences.
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2.5 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Choose Avatar Icon
            </label>
            <div className="flex items-center gap-2">
              {AVATAR_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setAvatar(opt)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                    avatar === opt
                      ? 'bg-emerald-100 border-2 border-emerald-600 scale-105 shadow-2xs'
                      : 'bg-slate-100 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-hidden shadow-2xs"
                required
              />
            </div>
          </div>

          {/* Phone Field (Read-only verified) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              {user.phone_verified ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              ) : null}
            </div>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={user.phone || 'Not provided'}
                disabled
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium cursor-not-allowed shadow-2xs"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address (Optional)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@krishigo.in"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-hidden shadow-2xs"
              />
            </div>
          </div>

          {/* Account Metadata Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Member Since</span>
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">{formattedDate}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span>Auth Provider</span>
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1 capitalize">
                {user.auth_provider === 'google' ? 'Google OAuth' : 'Phone (+91)'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
