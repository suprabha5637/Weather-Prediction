/**
 * Authentication and Farmer Account Types
 * Compliant with KrishiGo Farmer Account System Specification
 */

export type AuthProviderType = 'phone' | 'google' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  profile_image: string | null;
  auth_provider: AuthProviderType;
  google_id?: string | null;
  phone_verified: boolean | number;
  email_verified: boolean | number;
  account_status: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string | null;
}

export interface FarmProfile {
  id: string;
  user_id: string;
  farmer_name: string;
  farm_name: string;
  location: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  farm_size: number;
  farm_size_unit: string;
  soil_type: string;
  irrigation_type: string;
  primary_crops: string;
  preferred_language: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  farm_profile?: FarmProfile;
  session_token?: string;
}

export interface PhoneCheckResponse {
  phone: string;
  is_registered: boolean;
  has_password: boolean;
  name?: string | null;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  phone: string;
  masked_phone: string;
  cooldown_seconds: number;
  debug_otp?: string;
}

export interface PersonalizedWeatherResponse {
  farmer_context: {
    farmer_id: string;
    farmer_name: string;
    farm_name: string;
    farm_size: number;
    farm_size_unit: string;
    coordinates: { lat: number; lon: number };
    location: string;
    district: string;
    state: string;
    crops: string[];
    soil_type: string;
    irrigation_type: string;
  };
  current_weather: any;
  fifteen_day_forecast: any[];
  hourly_forecast: any[];
  agronomic_advisories: Array<{
    crop: string;
    status: string;
    growth_stage: string;
    irrigation_advice: string;
    spraying_window: string;
    harvest_suitability: string;
    weather_risks: string[];
  }>;
}
