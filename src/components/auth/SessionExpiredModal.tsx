import React from 'react';
import { ShieldAlert, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ isOpen, onClose }) => {
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

        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h3 className="text-base font-extrabold text-slate-800 mb-1">
          Session Expired
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-5">
          Your farmer session has expired for your security. Please log in again to continue accessing your farm records and personal advisories.
        </p>

        <div className="space-y-2">
          <button
            onClick={handleLogin}
            className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Log In Again</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
