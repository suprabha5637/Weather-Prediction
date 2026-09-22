# KrishiGo — Farmer Weather Intelligence Platform

> **AI-Powered Agricultural Weather Intelligence & Decision Support System**
> Built for Indian farmers. Powered by Open-Meteo, FastAPI, and React.

---

## 🌐 Live URLs (Development)

| Service | URL |
|---------|-----|
| Frontend (Vite + React) | http://localhost:3001 |
| Backend API (FastAPI) | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |

---

## 🚀 Quick Start

### 1. Frontend

```bash
npm install
npm run dev
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # macOS / Linux
# venv\Scripts\activate           # Windows
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Environment Variables

Copy `.env.example` → `backend/.env` and fill in your keys:

```bash
cp .env.example backend/.env
```

---

## 📁 Project Structure

```
Weather Prediction/
│
├── index.html                      # Vite HTML entry point
├── vite.config.ts                  # Vite + React configuration
├── tsconfig.json                   # TypeScript root config
├── tsconfig.app.json               # App-specific TS config
├── tsconfig.node.json              # Node-specific TS config
├── package.json                    # Frontend dependencies & scripts
├── .env.example                    # Environment variable template
├── .gitignore                      # Git ignore rules
├── docker-compose.yml              # Docker multi-service config
├── Dockerfile                      # Root Docker build
│
├── public/                         # Static public assets
│   ├── favicon.svg
│   ├── icons.svg
│   └── images/                     # Crop & UI images
│       ├── Logo_Farmer.jpeg        # KrishiGo Farmer brand logo
│       ├── hero-farm.jpg           # Sidebar promo image
│       ├── ai-robot.jpg            # AI copilot image
│       ├── crop-paddy.jpg
│       ├── crop-wheat.jpg
│       ├── crop-maize.jpg
│       ├── crop-tomato.jpg
│       ├── crop-brinjal.jpg
│       ├── crop-chili.jpg
│       ├── crop-okra.jpg
│       ├── crop-groundnut.jpg
│       ├── crop-soybean.jpg
│       ├── farmer-learning.jpg
│       ├── leaf-scan.jpg
│       └── seedlings.jpg
│
├── src/                            # Frontend source code
│   ├── main.tsx                    # React app entry point
│   ├── App.tsx                     # Root app + router (all 20 tabs)
│   ├── App.css                     # Global app styles
│   ├── index.css                   # Tailwind base + custom CSS
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── weather.ts              # All weather data types & interfaces
│   │   └── auth.ts                 # Auth user & farm profile types
│   │
│   ├── context/                    # React context providers
│   │   └── AuthContext.tsx         # Auth state, login, logout, modals
│   │
│   ├── services/                   # Frontend data & API services
│   │   ├── weatherService.ts       # Weather data, mock data, export utils
│   │   ├── authService.ts          # Login, register, OTP, session API calls
│   │   └── aiCopilotService.ts     # AI weather copilot API integration
│   │
│   ├── utils/                      # Shared utility functions
│   │   └── translations.ts         # i18n strings (English, Hindi, Bengali)
│   │
│   ├── assets/                     # Bundled assets (icons etc.)
│   │
│   └── components/                 # All UI components
│       │
│       ├── layout/                 # App chrome (always visible)
│       │   ├── Header.tsx          # Top navigation bar
│       │   ├── Sidebar.tsx         # Left navigation (20 tabs)
│       │   └── Footer.tsx          # Page footer
│       │
│       ├── auth/                   # Authentication components
│       │   ├── LoginModal.tsx          # Phone/OTP + Google login
│       │   ├── FarmerAccountDropdown.tsx # Profile dropdown in header
│       │   ├── FarmerProfileModal.tsx  # "My Profile" modal
│       │   ├── FarmProfileModal.tsx    # Farm details editor
│       │   ├── LoginRequiredModal.tsx  # Gate for protected features
│       │   └── SessionExpiredModal.tsx # Session timeout prompt
│       │
│       ├── weather/                # Core weather UI components
│       │   ├── HeroBanner.tsx          # Top greeting + date banner
│       │   ├── CurrentWeatherCard.tsx  # Live temp, condition, metrics
│       │   ├── WeatherSummaryCard.tsx  # AI-generated daily summary
│       │   ├── WeatherAlertsCard.tsx   # Active alert preview card
│       │   ├── LocationDetailsCard.tsx # Farm location info
│       │   ├── WeatherMetricsStrip.tsx # 8-metric horizontal strip
│       │   ├── FifteenDayForecast.tsx  # 15-day with Table/Graph/Map views
│       │   ├── CropsForWeather.tsx     # Crop suitability cards
│       │   ├── WeatherTrendsAndMetrics.tsx # Charts + metric summaries
│       │   ├── AICropAdvisory.tsx      # Irrigation/pest/activity tips
│       │   ├── FarmActionCalendar.tsx  # 15-day field activity calendar
│       │   ├── HourlyForecastSection.tsx # 72-hour hourly scroll
│       │   ├── WeatherMapSection.tsx   # Interactive Leaflet map
│       │   ├── ForecastChangeAlert.tsx # Forecast shift detection banner
│       │   ├── AlertDetailModal.tsx    # Full alert impact + action modal
│       │   ├── DayDetailModal.tsx      # Day-specific hourly + agri detail
│       │   ├── AIWeatherCopilotModal.tsx # "Ask AI" chat interface
│       │   ├── WhatIfSimulatorModal.tsx  # Scenario weather simulator
│       │   ├── ForecastVerificationModal.tsx # Model accuracy report
│       │   ├── CropDetailModal.tsx     # Crop planting detail modal
│       │   ├── LocationSearchModal.tsx # Location search + GPS
│       │   └── MLOpsRegistryModal.tsx  # ML model registry inspector
│       │
│       └── views/                  # Full-page dedicated tab views
│           ├── RainfallView.tsx        # Rainfall prediction + charts
│           ├── TemperatureView.tsx     # Temp curve + heat index + °C/°F
│           ├── HumidityView.tsx        # RH% + fungal risk index
│           ├── WindView.tsx            # Wind compass + spraying advisory
│           ├── AirQualityView.tsx      # AQI + PM2.5 + crop foliar impact
│           ├── CloudCoverView.tsx      # Cloud % + solar radiation
│           ├── UVIndexView.tsx         # UV curve + peak risk window
│           ├── PressureView.tsx        # Barometric pressure + tendency
│           ├── ExtremeWeatherView.tsx  # Heatwave/frost/cyclone detection
│           ├── WeatherAlertsView.tsx   # Full alerts center with filters
│           ├── AgriToolsView.tsx       # 7 agricultural calculators
│           ├── SoilInsightsView.tsx    # Soil type + moisture + advice
│           ├── SatelliteView.tsx       # Satellite map (NDVI, thermal)
│           ├── ReportsView.tsx         # PDF/CSV report generator
│           └── SettingsView.tsx        # Units, language, notifications
│
└── backend/                        # Python FastAPI backend
    ├── main.py                     # FastAPI app + all API routes
    ├── requirements.txt            # Python dependencies
    ├── Dockerfile                  # Backend Docker build
    ├── .env                        # Secrets (git-ignored)
    │
    ├── routes/                     # Route handler modules
    │   └── auth_routes.py          # Phone OTP + Google auth endpoints
    │
    ├── services/                   # Business logic services
    │   ├── weather_provider.py     # Open-Meteo weather data fetcher
    │   ├── auth_security.py        # JWT, hashing, OTP generation
    │   ├── agri_intelligence.py    # Crop advisory + irrigation logic
    │   ├── anomaly_engine.py       # Weather anomaly detection
    │   ├── forecast_change.py      # Forecast shift detection
    │   ├── verification_service.py # Model accuracy verification
    │   └── data_quality.py         # Data validation & cleaning
    │
    ├── db/                         # Database files (git-ignored)
    ├── data/                       # ML model data + datasets
    ├── mlops/                      # MLOps model registry
    └── tests/                      # Backend unit tests
```

---

## 🗂️ Sidebar Navigation (All 20 Tabs)

| # | Tab | View | Description |
|---|-----|------|-------------|
| 1 | Weather Overview | Overview Dashboard | Full dashboard with all cards |
| 2 | 15-Day Forecast | FifteenDayForecast | Table / Graph / Map / Download |
| 3 | Hourly Forecast | HourlyForecastSection | 72-hour scroll with all metrics |
| 4 | Rainfall Prediction | RainfallView | Rainfall charts + soil saturation |
| 5 | Temperature | TemperatureView | Temp curve, heat index, °C/°F |
| 6 | Humidity | HumidityView | RH%, fungal risk, comfort index |
| 7 | Wind | WindView | Speed, direction, spraying window |
| 8 | Air Quality | AirQualityView | AQI, PM2.5, crop foliar impact |
| 9 | Cloud Cover | CloudCoverView | Cloud %, solar radiation |
| 10 | UV Index | UVIndexView | UV curve, peak window, safety |
| 11 | Pressure | PressureView | Barometric + storm front detection |
| 12 | Extreme Weather | ExtremeWeatherView | Heatwave, frost, cyclone alerts |
| 13 | Weather Alerts | WeatherAlertsView | Full alert center with filters |
| 14 | Weather Maps | WeatherMapSection | Interactive Leaflet weather map |
| 15 | Crop Advisory | Crop Advisory Grid | Suitability + AI tips + calendar |
| 16 | Agri Tools | AgriToolsView | 7 calculators for field decisions |
| 17 | Soil & Field Insights | SoilInsightsView | Soil type, moisture, management |
| 18 | Satellite View | SatelliteView | NDVI, thermal, RGB satellite map |
| 19 | Reports | ReportsView | PDF/CSV weather report generator |
| 20 | Settings | SettingsView | Units, language, notifications |

---

## 🔑 Authentication

- **Phone + OTP** — 6-digit OTP with 60s cooldown, rate-limited
- **Google OAuth** — One-tap sign-in
- **Demo Account** — `9999999999` / `farmer123`
- **JWT Sessions** — 24h access token, 7d refresh

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Maps | Leaflet.js |
| Backend | FastAPI (Python) |
| Database | SQLite (dev) |
| Weather API | Open-Meteo (free, no key) |
| Auth | JWT + bcrypt + OTP |
| AI Copilot | Gemini API |

---

## 📦 Key Scripts

```bash
# Frontend
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build

# Backend
uvicorn main:app --reload --port 8000

# Type check
npx tsc --noEmit

# Docker (full stack)
docker-compose up --build
```

---

*KrishiGo Farmer Weather Intelligence — Same Sky. Brighter Harvests. 🌾*
