import React from 'react';
import { Lock, ArrowRight, X, Sprout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  isOpen,
  onClose,
  featureName = 'Farm Profile and Personalized Advisories',
}) => {
  const { openLoginModal } = useAuth();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    openLoginModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-center p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-base font-extrabold text-slate-800 mb-1">
          Login Required
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Accessing <span className="font-semibold text-slate-700">{featureName}</span> requires a verified KrishiGo Farmer account.
        </p>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-5 text-left flex items-start gap-2.5">
          <Sprout className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span className="text-[11px] text-slate-600 leading-normal">
            Log in once with your Indian mobile number (+91) or Google to auto-sync your crops, land coordinates, and soil data.
          </span>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleLogin}
            className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Log In Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
