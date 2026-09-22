-- ============================================================
-- KRISHIGO WEATHER INTELLIGENCE DATABASE SCHEMA
-- PostgreSQL 16 + PostGIS + TimescaleDB
-- ============================================================

-- Enable Geospatial & Time-Series Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
-- TimescaleDB extension enabled in production cluster:
-- CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- 1. Locations & Geospatial Hierarchy
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    geom GEOMETRY(Point, 4326),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    altitude_m DOUBLE PRECISION DEFAULT 80.0,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_locations_geom ON locations USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_locations_district_state ON locations(district, state);

-- 2. Weather Sources & Weather Stations
CREATE TABLE IF NOT EXISTS weather_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_name VARCHAR(100) NOT NULL UNIQUE, -- ECMWF, IMD, NOAA, GPM_IMERG, LOCAL_AWS
    source_type VARCHAR(50) NOT NULL, -- NWP, SATELLITE, RADAR, IN_SITU, BLENDED
    spatial_resolution_km DOUBLE PRECISION,
    temporal_resolution_mins INT,
    latency_mins INT,
    reliability_score DOUBLE PRECISION DEFAULT 0.95,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weather_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_code VARCHAR(50) NOT NULL UNIQUE,
    station_name VARCHAR(100) NOT NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    geom GEOMETRY(Point, 4326),
    elevation_m DOUBLE PRECISION,
    sensors JSONB, -- list of installed sensor capabilities
    is_operational BOOLEAN DEFAULT TRUE,
    last_ping TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Weather Observations (Time-Series Optimized)
CREATE TABLE IF NOT EXISTS weather_observations (
    id BIGSERIAL,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    station_id UUID REFERENCES weather_stations(id) ON DELETE SET NULL,
    source_id UUID REFERENCES weather_sources(id),
    timestamp_utc TIMESTAMPTZ NOT NULL,
    variable VARCHAR(50) NOT NULL, -- temperature, humidity, precipitation, wind_speed, etc.
    value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL,
    quality_flag VARCHAR(20) NOT NULL DEFAULT 'GOOD', -- GOOD, WARNING, SUSPECT, INVALID, MISSING
    confidence_score DOUBLE PRECISION DEFAULT 1.0,
    observation_type VARCHAR(50) DEFAULT 'IN_SITU',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (location_id, timestamp_utc, variable, id)
);
-- In production TimescaleDB: SELECT create_hypertable('weather_observations', 'timestamp_utc');
CREATE INDEX IF NOT EXISTS idx_obs_loc_time ON weather_observations(location_id, timestamp_utc DESC);
CREATE INDEX IF NOT EXISTS idx_obs_var_time ON weather_observations(variable, timestamp_utc DESC);
CREATE INDEX IF NOT EXISTS idx_obs_qual_flag ON weather_observations(quality_flag);

-- 4. Forecast Runs, Variables & Quantile Intervals
CREATE TABLE IF NOT EXISTS forecast_runs (
    id VARCHAR(100) PRIMARY KEY, -- e.g. forecast_run_2026_09_22_1200
    model_id UUID NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    issue_time_utc TIMESTAMPTZ NOT NULL,
    dataset_version VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weather_forecasts (
    id BIGSERIAL PRIMARY KEY,
    forecast_run_id VARCHAR(100) REFERENCES forecast_runs(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    issue_time_utc TIMESTAMPTZ NOT NULL,
    valid_time_utc TIMESTAMPTZ NOT NULL,
    forecast_horizon_hours INT NOT NULL,
    variable VARCHAR(50) NOT NULL,
    value_point DOUBLE PRECISION NOT NULL, -- deterministic/P50 value
    p10 DOUBLE PRECISION,
    p25 DOUBLE PRECISION,
    p50 DOUBLE PRECISION,
    p75 DOUBLE PRECISION,
    p90 DOUBLE PRECISION,
    uncertainty_score DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fc_loc_valid ON weather_forecasts(location_id, valid_time_utc);
CREATE INDEX IF NOT EXISTS idx_fc_run_var ON weather_forecasts(forecast_run_id, variable);

-- 5. Forecast Verification & Backtesting Store
CREATE TABLE IF NOT EXISTS forecast_verification (
    id BIGSERIAL PRIMARY KEY,
    forecast_run_id VARCHAR(100) REFERENCES forecast_runs(id),
    location_id UUID NOT NULL REFERENCES locations(id),
    variable VARCHAR(50) NOT NULL,
    valid_time_utc TIMESTAMPTZ NOT NULL,
    forecast_horizon_hours INT NOT NULL,
    forecasted_value DOUBLE PRECISION NOT NULL,
    observed_value DOUBLE PRECISION NOT NULL,
    absolute_error DOUBLE PRECISION NOT NULL,
    squared_error DOUBLE PRECISION NOT NULL,
    error_bias DOUBLE PRECISION NOT NULL,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_verif_loc_var ON forecast_verification(location_id, variable, valid_time_utc DESC);

-- 6. Climatology & 30-Year Benchmarks
CREATE TABLE IF NOT EXISTS climatology (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id),
    day_of_year INT NOT NULL, -- 1 to 366
    variable VARCHAR(50) NOT NULL,
    mean_value DOUBLE PRECISION NOT NULL,
    std_dev DOUBLE PRECISION NOT NULL,
    p10_value DOUBLE PRECISION,
    p90_value DOUBLE PRECISION,
    sample_years INT DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(location_id, day_of_year, variable)
);

-- 7. Weather Anomalies & Extreme Weather Events
CREATE TABLE IF NOT EXISTS weather_anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id),
    detected_at TIMESTAMPTZ NOT NULL,
    variable VARCHAR(50) NOT NULL,
    observed_or_forecast_value DOUBLE PRECISION NOT NULL,
    climatological_mean DOUBLE PRECISION NOT NULL,
    anomaly_magnitude DOUBLE PRECISION NOT NULL,
    z_score DOUBLE PRECISION NOT NULL,
    severity VARCHAR(20) DEFAULT 'MODERATE', -- LOW, MODERATE, HIGH, CRITICAL
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS weather_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(100) NOT NULL, -- Heatwave, Heavy Rain, Thunderstorm, Cyclone
    severity VARCHAR(20) NOT NULL, -- Minor, Moderate, Severe, Extreme
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    affected_locations JSONB NOT NULL,
    affected_crops JSONB,
    description TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    source VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Crop Database & Phenological Requirements
CREATE TABLE IF NOT EXISTS crop_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(100) NOT NULL,
    hindi_name VARCHAR(100),
    variety VARCHAR(100),
    temp_min_c DOUBLE PRECISION NOT NULL,
    temp_optimal_c DOUBLE PRECISION NOT NULL,
    temp_max_c DOUBLE PRECISION NOT NULL,
    annual_rainfall_min_mm DOUBLE PRECISION,
    annual_rainfall_max_mm DOUBLE PRECISION,
    optimal_humidity_percent DOUBLE PRECISION,
    heat_sensitivity VARCHAR(20) DEFAULT 'MODERATE',
    rain_sensitivity VARCHAR(20) DEFAULT 'MODERATE',
    waterlogging_sensitivity VARCHAR(20) DEFAULT 'HIGH',
    drought_sensitivity VARCHAR(20) DEFAULT 'HIGH',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crop_growth_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_id UUID NOT NULL REFERENCES crop_profiles(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL, -- Seed, Germination, Vegetative, Flowering, Maturity, Harvest
    gdd_required INT, -- Base 10 GDD units
    critical_temp_c DOUBLE PRECISION,
    moisture_need VARCHAR(20),
    heat_risk_threshold_c DOUBLE PRECISION,
    excess_rain_risk_threshold_mm DOUBLE PRECISION,
    fao_kc_coefficient DOUBLE PRECISION DEFAULT 1.0
);

-- 9. Farm Action Calendar & Advisory Rules
CREATE TABLE IF NOT EXISTS weather_action_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id),
    forecast_date DATE NOT NULL,
    recommended_action VARCHAR(200) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    meteorological_reason TEXT NOT NULL,
    weather_summary VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MLOps Model Registry & Monitoring
CREATE TABLE IF NOT EXISTS model_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL UNIQUE,
    target_variable VARCHAR(50) NOT NULL,
    model_architecture VARCHAR(100) NOT NULL, -- LightGBM, Transformer, LSTM, Ensemble
    training_data_period DATERANGE,
    validation_mae DOUBLE PRECISION,
    validation_rmse DOUBLE PRECISION,
    validation_brier DOUBLE PRECISION,
    status VARCHAR(30) DEFAULT 'CANDIDATE', -- TRAINING, VALIDATION, CANDIDATE, PRODUCTION, RETIRED
    hyperparameters JSONB,
    features_list JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deployed_at TIMESTAMPTZ
);
