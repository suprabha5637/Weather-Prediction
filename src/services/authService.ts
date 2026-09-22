/**
 * Authentication and Farmer Profile API Service
 * Handles session tokens, HTTP cookies, OTP dispatch/verification, and profile synchronization.
 */

import {
  AuthResponse,
  PhoneCheckResponse,
  SendOTPResponse,
  User,
  FarmProfile,
  PersonalizedWeatherResponse
} from '../types/auth';

const API_BASE = 'http://localhost:8000/api/v1';

const TOKEN_KEY = 'krishigo_farmer_token';

export const authService = {
  getStoredToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setStoredToken(token: string | null): void {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      // Ignore localStorage exceptions in private browsing
    }
  },

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async checkPhone(phone: string): Promise<PhoneCheckResponse> {
    const res = await fetch(`${API_BASE}/auth/phone/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to verify phone' }));
      throw new Error(err.detail || 'Failed to verify phone number');
    }
    return res.json();
  },

  async registerPhone(name: string, phone: string, password?: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/phone/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, password }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Registration failed');
    }
    if (data.session_token) {
      this.setStoredToken(data.session_token);
    }
    return data;
  },

  async loginWithPassword(phone: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/phone/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Login failed. Please check your credentials.');
    }
    if (data.session_token) {
      this.setStoredToken(data.session_token);
    }
    return data;
  },

  async sendOtp(phone: string, purpose: 'login' | 'register' | 'verification' = 'login'): Promise<SendOTPResponse> {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, purpose }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to send OTP code');
    }
    return data;
  },

  async verifyOtp(phone: string, otp: string, purpose: 'login' | 'register' | 'verification' = 'login'): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, purpose }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Invalid verification code');
    }
    if (data.session_token) {
      this.setStoredToken(data.session_token);
    }
    return data;
  },

  async checkGoogleOAuthConfig(): Promise<{ configured: boolean; client_id: string | null }> {
    try {
      const res = await fetch(`${API_BASE}/auth/google/status`);
      if (!res.ok) return { configured: false, client_id: null };
      return res.json();
    } catch {
      return { configured: false, client_id: null };
    }
  },

  startGoogleOAuthFlow(): void {
    // Navigates directly to the official Google OAuth authorization flow via backend initiation
    window.location.href = `${API_BASE}/auth/google`;
  },

  async loginWithGoogle(idToken?: string, mockProfile?: any): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken, mock_profile: mockProfile }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Google sign-in failed');
    }
    if (data.session_token) {
      this.setStoredToken(data.session_token);
    }
    return data;
  },

  async getMe(): Promise<AuthResponse | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });
      if (res.status === 401) {
        this.setStoredToken(null);
        return null;
      }
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  async logout(): Promise<{ success: boolean }> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });
    } finally {
      this.setStoredToken(null);
    }
    return { success: true };
  },

  async updateProfile(profileData: Partial<User>): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to update profile');
    }
    return data;
  },

  async getFarmProfile(): Promise<{ success: boolean; farm_profile: FarmProfile }> {
    const res = await fetch(`${API_BASE}/farm-profile`, {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to fetch farm profile');
    }
    return data;
  },

  async saveFarmProfile(farmData: Partial<FarmProfile>): Promise<{ success: boolean; farm_profile: FarmProfile }> {
    const res = await fetch(`${API_BASE}/farm-profile`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(farmData),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to save farm profile');
    }
    return data;
  },

  async getPersonalizedWeather(): Promise<PersonalizedWeatherResponse> {
    const res = await fetch(`${API_BASE}/weather/personalized`, {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to fetch personalized weather');
    }
    return data;
  }
};
