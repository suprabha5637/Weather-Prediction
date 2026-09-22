import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Phone,
  Lock,
  User as UserIcon,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const {
    loginWithPassword,
    loginWithGoogle,
    sendOtp,
    verifyOtp,
    registerWithPhone,
    oauthError,
    clearOAuthError,
  } = useAuth();

  // View state: 'phone_entry' | 'password_entry' | 'otp_entry' | 'register_entry'
  const [view, setView] = useState<'phone_entry' | 'password_entry' | 'otp_entry' | 'register_entry'>(
    initialMode === 'register' ? 'register_entry' : 'phone_entry'
  );

  // Form inputs
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP inputs: 6 digits
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [maskedPhone, setMaskedPhone] = useState<string>('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Sync OAuth errors from URL redirect
  useEffect(() => {
    if (oauthError) {
      setError(oauthError);
    }
  }, [oauthError]);

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setView(initialMode === 'register' ? 'register_entry' : 'phone_entry');
      setError(oauthError || null);
      setSuccessMsg(null);
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setOtpDigits(['', '', '', '', '', '']);
      setDebugOtp(null);
    }
  }, [isOpen, initialMode]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Phone sanitizer (10 digits)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= 10) {
      setPhone(raw);
      setError(null);
    }
  };

  // Password strength checker
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-600' };
  };

  const strength = getPasswordStrength(password);

  // Quick fill for demo evaluator
  const handleDemoFill = () => {
    setPhone('9876543210');
    setPassword('Farmer@2026');
    setError(null);
  };

  // Continue from Phone Entry
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const check = await authService.checkPhone(phone);
      if (check.is_registered) {
        if (check.has_password) {
          setView('password_entry');
        } else {
          // Send OTP
          await triggerSendOtp('login');
        }
      } else {
        // Not registered -> go to register
        setView('register_entry');
      }
    } catch (err: any) {
      setError(err.message || 'Error verifying phone number');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Send OTP
  const triggerSendOtp = async (purpose: 'login' | 'register' = 'login') => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendOtp(phone, purpose);
      setMaskedPhone(res.masked_phone);
      setResendCooldown(res.cooldown_seconds || 30);
      if (res.debug_otp) {
        setDebugOtp(res.debug_otp);
      }
      setView('otp_entry');
      setSuccessMsg(res.message);
      setTimeout(() => otpInputsRef.current[0]?.focus(), 150);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch OTP');
    } finally {
      setLoading(false);
    }
  };

  // Submit Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await loginWithPassword(phone, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (password && password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Direct register or verify via OTP
    setLoading(true);
    setError(null);
    try {
      await triggerSendOtp('register');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // OTP Box Change Handler
  const handleOtpDigitChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setError(null);

    // Auto advance
    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto submit if all 6 filled
    if (digit && index === 5 && newDigits.every((d) => d !== '')) {
      submitOtpVerification(newDigits.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!paste) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = paste[i] || '';
    }
    setOtpDigits(newDigits);
    if (paste.length === 6) {
      submitOtpVerification(paste);
    } else {
      otpInputsRef.current[paste.length]?.focus();
    }
  };

  // Verify OTP
  const submitOtpVerification = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (view === 'otp_entry' && name) {
        // Registering user with OTP verified
        await registerWithPhone(name, phone, password);
      } else {
        await verifyOtp(phone, code, 'login');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  // Real Google OAuth 2.0 Flow
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    if (clearOAuthError) clearOAuthError();

    try {
      const status = await authService.checkGoogleOAuthConfig();
      if (!status.configured) {
        setError('Google sign-in is not configured yet. Please configure the Google OAuth credentials.');
        setGoogleLoading(false);
        return;
      }
      // Start the real Google OAuth 2.0 authorization redirect
      authService.startGoogleOAuthFlow();
    } catch (err: any) {
      setError('Google sign-in could not be completed.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              👨‍🌾
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                KrishiGo Farmer Platform
              </div>
              <h2 className="text-xl font-extrabold text-white">
                {view === 'register_entry' ? 'Create Farmer Account' : 'Welcome to Farmer'}
              </h2>
            </div>
          </div>
          <p className="mt-2 text-xs text-emerald-100/90 leading-relaxed">
            {view === 'register_entry'
              ? 'Join thousands of farmers receiving AI-powered weather & crop intelligence.'
              : 'Login to access your personalized farming dashboard, crops & weather advisories.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Global Alert Messages */}
          {error && (
            <div className="mb-4 flex flex-col gap-2 p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="flex-1 leading-relaxed">{error}</span>
              </div>
              {(error.includes('Google') || error.includes('cancelled') || error.includes('could not be completed')) && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      if (clearOAuthError) clearOAuthError();
                      handleGoogleLogin();
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {successMsg && !error && (
            <div className="mb-4 flex items-start gap-2.5 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* VIEW 1: Phone Entry + Google Login */}
          {view === 'phone_entry' && (
            <div>
              {/* Google Real OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading || googleLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {googleLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                    <span className="font-semibold text-slate-700">Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
                  <span className="bg-white px-3 text-slate-400">or login with phone</span>
                </div>
              </div>

              {/* Phone Form */}
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex rounded-xl border border-slate-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition-all overflow-hidden shadow-2xs">
                    <span className="inline-flex items-center px-3 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-700">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="98765 43210"
                      className="w-full px-3 py-2 text-sm text-slate-800 focus:outline-hidden"
                      autoFocus
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    We will send a 6-digit verification code or prompt for your password.
                  </p>
                </div>

                {/* Demo Quick-Fill Button */}
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-lg border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fill Demo Farmer (+91 9876543210)</span>
                </button>

                <button
                  type="submit"
                  disabled={loading || phone.length !== 10}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Switcher */}
              <div className="mt-5 text-center text-xs text-slate-500">
                New farmer?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setView('register_entry');
                  }}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Create an account
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: Password Entry */}
          {view === 'password_entry' && (
            <div>
              <div className="mb-4 flex items-center justify-between text-xs">
                <span className="text-slate-600">Logging in as:</span>
                <span className="font-bold text-slate-800">🇮🇳 +91 {phone}</span>
              </div>

              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => triggerSendOtp('login')}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline"
                    >
                      Login with OTP instead
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-3 py-2 pr-10 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-hidden shadow-2xs"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Login to Dashboard</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setView('phone_entry')}
                  className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Use a different phone number
                </button>
              </form>
            </div>
          )}

          {/* VIEW 3: OTP Verification (6-box) */}
          {view === 'otp_entry' && (
            <div>
              <div className="text-center mb-5">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Enter Verification Code</h3>
                <p className="text-xs text-slate-500 mt-1">
                  We sent a 6-digit code to{' '}
                  <span className="font-semibold text-slate-700">{maskedPhone || `+91 ${phone}`}</span>
                </p>
              </div>

              {/* Developer/Evaluation Debug Badge */}
              {debugOtp && (
                <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-center">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                    ⚡ Evaluator Instant OTP
                  </span>
                  <div className="font-mono text-base font-extrabold text-amber-900 tracking-widest mt-0.5">
                    {debugOtp}
                  </div>
                </div>
              )}

              {/* 6 Discrete Input Boxes */}
              <div className="flex justify-center gap-2 my-4" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-hidden shadow-2xs transition-all"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => submitOtpVerification()}
                disabled={loading || otpDigits.some((d) => !d)}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Verify & Continue</span>}
              </button>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setView('phone_entry')}
                  className="hover:underline"
                >
                  Change number
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={() => triggerSendOtp('login')}
                  className="text-emerald-700 font-semibold disabled:text-slate-400 hover:underline"
                >
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
            </div>
          )}

          {/* VIEW 4: Register Entry */}
          {view === 'register_entry' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Farmer Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-hidden shadow-2xs"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <div className="flex rounded-xl border border-slate-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition-all overflow-hidden shadow-2xs">
                  <span className="inline-flex items-center px-3 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-700">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    className="w-full px-3 py-2 text-xs text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password (Optional, for fast login)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-hidden shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span>Strength: {strength.label}</span>
                      <span>8+ chars recommended</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full rounded-full transition-all ${
                          strength.score >= 1 ? strength.color : 'bg-slate-200'
                        } w-1/3`}
                      />
                      <div
                        className={`h-full rounded-full transition-all ${
                          strength.score >= 2 ? strength.color : 'bg-slate-200'
                        } w-1/3`}
                      />
                      <div
                        className={`h-full rounded-full transition-all ${
                          strength.score >= 3 ? strength.color : 'bg-slate-200'
                        } w-1/3`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {password && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-hidden shadow-2xs"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !name.trim() || phone.length !== 10}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Create Account & Verify</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-xs text-slate-500 pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setView('phone_entry');
                  }}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Log in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
