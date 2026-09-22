export type TemperatureUnit = 'C' | 'F';
export type Language = 'en' | 'hi' | 'bn';

export interface LocationInfo {
  name: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  altitude: number; // meters
  timezone: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Extreme';
  type: string;
  timeRange: string;
  description: string;
  affectedCrops: string[];
  recommendedAction: string;
  source: string;
  probability?: number;
}

export interface CurrentWeather {
  temp: number; // °C
  feelsLike: number;
  condition: string;
  conditionIcon: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rain' | 'heavy-rain' | 'thunderstorm';
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: string; // e.g. NW
  pressure: number; // hPa
  visibility: number; // km
  uvIndex: number;
  uvLevel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  dewPoint: number;
  cloudCover: number; // %
  rainChanceToday: number; // %
  rainAmountToday: number; // mm
  maxTemp: number;
  minTemp: number;
  maxTempTrend: number; // e.g. +2
  minTempTrend: number; // e.g. -1
  timestamp: string; // e.g. 10 Sep 2025, 10:30 AM
  lastUpdated: string; // e.g. 10:30 AM
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string; // 11:00 AM, 12:00 PM
  temp: number;
  feelsLike: number;
  rainProb: number;
  rainAmount: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  cloudCover: number;
  uv: number;
  condition: string;
  icon: string;
}

export interface DailyForecast {
  dayIndex: number; // 1 to 15
  dayName: string; // Wed, Thu
  dateStr: string; // 10 Sep
  fullDate: string; // 2025-09-10
  condition: string;
  icon: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rain' | 'heavy-rain' | 'thunderstorm';
  maxTemp: number;
  minTemp: number;
  rainProb: number; // %
  rainAmount: number; // mm
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: string;
  cloudCover: number; // %
  uv: number;
  weatherRisk: 'Low' | 'Moderate' | 'High';
  agriculturalImpact: string;
  // Probabilistic quantiles
  p10Temp: number;
  p50Temp: number;
  p90Temp: number;
}

export interface CropItem {
  id: string;
  name: string;
  hindiName: string;
  image: string;
  statusTag: string; // e.g. "Good moisture", "Harvest now"
  category: 'planting' | 'harvest';
  growthStage: string;
  optimalTemp: string;
  moistureNeed: string;
  recommendationReason: string;
}

export interface AdvisoryItem {
  type: 'irrigation' | 'pest' | 'fertilizer' | 'activity';
  title: string;
  summary: string;
  details: string;
  urgency: 'Low' | 'Medium' | 'High';
  action: string;
  alternative: string;
}

export interface DetailedForecastMetrics {
  totalExpectedRainfall: number; // mm
  avgRainProbability: number; // %
  highestTemperature: number; // °C
  highestTempDates: string; // "13–15 Sep"
  lowestTemperature: number; // °C
  lowestTempDates: string; // "17 Sep"
  humidityRange: string; // "55% – 92%"
  windSpeedRange: string; // "8 – 24 km/h"
  windDirection: string; // "Mostly NW"
  pressureRange: string; // "1008 – 1015 hPa"
  cloudCoverRange: string; // "20% – 90%"
  uvIndexRange: string; // "3 – 8 (Moderate to High)"
  visibilityRange: string; // "6 – 10 km"
}

export interface FarmCalendarDay {
  day: number;
  date: string;
  action: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  reason: string;
  weatherCondition: string;
}

export interface ForecastVerification {
  yesterday: {
    predictedTemp: number;
    actualTemp: number;
    tempError: number;
    predictedRainProb: number;
    observedRainOccurred: boolean;
    observedRainAmount: number;
  };
  metrics: {
    sevenDayMaeTemp: number;
    fifteenDayRmseTemp: number;
    brierScoreRain: number;
    calibrationReliability: number;
    forecastHorizonsVerified: number;
  };
}

export interface WeatherDataState {
  location: LocationInfo;
  current: CurrentWeather;
  summaryText: string;
  noHeavyRain24h: boolean;
  alerts: WeatherAlert[];
  hourly: HourlyForecast[];
  daily15: DailyForecast[];
  cropsPlanting: CropItem[];
  cropsHarvest: CropItem[];
  metrics: DetailedForecastMetrics;
  advisory: {
    irrigation: AdvisoryItem;
    pest: AdvisoryItem;
    fertilizer: AdvisoryItem;
    activity: AdvisoryItem;
  };
  farmerTips: string[];
  calendar15: FarmCalendarDay[];
  verification: ForecastVerification;
}
