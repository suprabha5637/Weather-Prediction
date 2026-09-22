import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, FarmProfile, SendOTPResponse } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  farmProfile: FarmProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSessionExpired: boolean;
  showLoginModal: boolean;
  showProfileModal: boolean;
  showFarmModal: boolean;
  showSessionExpiredModal: boolean;
  showLoginRequiredModal: boolean;
  oauthError: string | null;
  clearOAuthError: () => void;
  loginWithPassword: (phone: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken?: string, mockProfile?: any) => Promise<void>;
  sendOtp: (phone: string, purpose?: 'login' | 'register' | 'verification') => Promise<SendOTPResponse>;
  verifyOtp: (phone: string, otp: string, purpose?: 'login' | 'register' | 'verification') => Promise<void>;
  registerWithPhone: (name: string, phone: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  saveFarmProfile: (data: Partial<FarmProfile>) => Promise<void>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openFarmModal: () => void;
  closeFarmModal: () => void;
  closeSessionExpiredModal: () => void;
  promptLoginRequired: () => void;
  closeLoginRequiredModal: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [farmProfile, setFarmProfile] = useState<FarmProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);

  // Modals state
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showFarmModal, setShowFarmModal] = useState<boolean>(false);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState<boolean>(false);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState<boolean>(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const refreshAuth = useCallback(async () => {
    try {
      const data = await authService.getMe();
      if (data && data.user) {
        setUser(data.user);
        if (data.farm_profile) {
          setFarmProfile(data.farm_profile);
        }
        setIsSessionExpired(false);
      } else {
        const hadStoredToken = !!authService.getStoredToken();
        if (user && hadStoredToken) {
          setIsSessionExpired(true);
          setShowSessionExpiredModal(true);
        }
        setUser(null);
        setFarmProfile(null);
      }
    } catch {
      setUser(null);
      setFarmProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshAuth();

    // Check for Google OAuth callback parameters on mount
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const authSuccess = searchParams.get('auth_success');
      const authErrorParam = searchParams.get('auth_error');

      if (authSuccess === 'true') {
        refreshAuth();
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      } else if (authErrorParam) {
        if (authErrorParam === 'cancelled') {
          setOauthError('Google sign-in was cancelled.');
        } else if (authErrorParam === 'not_configured') {
          setOauthError('Google sign-in is not configured yet. Please configure the Google OAuth credentials.');
        } else {
          setOauthError('Google sign-in could not be completed.');
        }
        setShowLoginModal(true);
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      }
    }
  }, [refreshAuth]);

  const loginWithPassword = async (phone: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.loginWithPassword(phone, password);
      if (res.user) {
        setUser(res.user);
        if (res.farm_profile) setFarmProfile(res.farm_profile);
        setShowLoginModal(false);
        setIsSessionExpired(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (idToken?: string, mockProfile?: any) => {
    setIsLoading(true);
    try {
      const res = await authService.loginWithGoogle(idToken, mockProfile);
      if (res.user) {
        setUser(res.user);
        if (res.farm_profile) setFarmProfile(res.farm_profile);
        setShowLoginModal(false);
        setIsSessionExpired(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (phone: string, purpose: 'login' | 'register' | 'verification' = 'login') => {
    return await authService.sendOtp(phone, purpose);
  };

  const verifyOtp = async (phone: string, otp: string, purpose: 'login' | 'register' | 'verification' = 'login') => {
    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(phone, otp, purpose);
      if (res.user) {
        setUser(res.user);
        if (res.farm_profile) setFarmProfile(res.farm_profile);
        setShowLoginModal(false);
        setIsSessionExpired(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithPhone = async (name: string, phone: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await authService.registerPhone(name, phone, password);
      if (res.user) {
        setUser(res.user);
        if (res.farm_profile) setFarmProfile(res.farm_profile);
        setShowLoginModal(false);
        setIsSessionExpired(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setFarmProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    const res = await authService.updateProfile(data);
    if (res.user) {
      setUser(res.user);
    }
  };

  const saveFarmProfile = async (data: Partial<FarmProfile>) => {
    const res = await authService.saveFarmProfile(data);
    if (res.farm_profile) {
      setFarmProfile(res.farm_profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        farmProfile,
        isAuthenticated: !!user,
        isLoading,
        isSessionExpired,
        showLoginModal,
        showProfileModal,
        showFarmModal,
        showSessionExpiredModal,
        showLoginRequiredModal,
        oauthError,
        clearOAuthError: () => setOauthError(null),
        loginWithPassword,
        loginWithGoogle,
        sendOtp,
        verifyOtp,
        registerWithPhone,
        logout,
        updateProfile,
        saveFarmProfile,
        openLoginModal: () => setShowLoginModal(true),
        closeLoginModal: () => setShowLoginModal(false),
        openProfileModal: () => setShowProfileModal(true),
        closeProfileModal: () => setShowProfileModal(false),
        openFarmModal: () => setShowFarmModal(true),
        closeFarmModal: () => setShowFarmModal(false),
        closeSessionExpiredModal: () => setShowSessionExpiredModal(false),
        promptLoginRequired: () => setShowLoginRequiredModal(true),
        closeLoginRequiredModal: () => setShowLoginRequiredModal(false),
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
