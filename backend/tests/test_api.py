"""
Unit and Integration Test Suite for KrishiGo Weather Intelligence API.
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["application"] == "Weather"
    assert data["ecosystem"] == "KrishiGo"
    assert data["status"] == "online"

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_current_weather():
    response = client.get("/api/v1/weather/current?lat=25.3176&lon=82.9739")
    assert response.status_code == 200
    data = response.json()
    assert "temperature_c" in data
    assert "humidity_pct" in data
    assert "wind_speed_kmh" in data
    assert "pressure_hpa" in data
    assert "uv_index" in data

def test_hourly_forecast():
    response = client.get("/api/v1/weather/hourly?lat=25.3176&lon=82.9739&hours=24")
    assert response.status_code == 200
    data = response.json()
    assert "hourly" in data
    assert len(data["hourly"]) == 24

def test_15day_forecast():
    response = client.get("/api/v1/weather/15-day?lat=25.3176&lon=82.9739")
    assert response.status_code == 200
    data = response.json()
    assert "forecast" in data
    assert len(data["forecast"]) == 15
    first_day = data["forecast"][0]
    assert "probabilistic_quantiles" in first_day
    assert "p10" in first_day["probabilistic_quantiles"]["temperature_c"]
    assert "p50" in first_day["probabilistic_quantiles"]["temperature_c"]
    assert "p90" in first_day["probabilistic_quantiles"]["temperature_c"]

def test_forecast_verification():
    response = client.get("/api/v1/weather/verification")
    assert response.status_code == 200
    data = response.json()
    assert "yesterday_verification" in data
    assert "benchmarks" in data
    assert "mae_temperature_c" in data["benchmarks"]
    assert "brier_score_rain" in data["benchmarks"]

def test_fao56_irrigation_engine():
    response = client.get("/api/v1/weather/irrigation?temp_mean=28.0&wind_kmh=12.0&rh_pct=68.0&crop_kc=1.1")
    assert response.status_code == 200
    data = response.json()
    assert "reference_et0_mm_day" in data
    assert data["reference_et0_mm_day"] > 0
    assert "crop_evapotranspiration_etc_mm_day" in data

def test_spraying_window_engine():
    response = client.get("/api/v1/weather/spraying?wind_kmh=8.0&rain_prob=10.0&temp_c=25.0&rh_pct=65.0")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["OPTIMAL", "SUITABLE", "CAUTION", "UNSUITABLE"]
    assert "suitability_score" in data

def test_ai_copilot_structured_response():
    payload = {"query": "Should I irrigate my paddy field today?", "crop": "Paddy", "growth_stage": "Flowering"}
    response = client.post("/api/v1/weather/ai", json=payload)
    assert response.status_code == 200
    data = response.json()
    for field in ["ANSWER", "WHY", "WEATHER DATA", "FARM IMPACT", "RECOMMENDED ACTION", "RISK", "ALTERNATIVE"]:
        assert field in data

def test_future_farmer_integration_endpoint():
    context = {
        "farmer_id": "farmer_vns_101",
        "farm_id": "farm_plot_03",
        "latitude": 25.3176,
        "longitude": 82.9739,
        "crop": "Paddy",
        "crop_variety": "Basmati PB-1121",
        "growth_stage": "Flowering",
        "soil_type": "Alluvial Loam",
        "soil_moisture": "64%"
    }
    response = client.post("/api/v1/integration/farmer/weather", json=context)
    assert response.status_code == 200
    data = response.json()
    assert data["integration_status"] == "active"
    assert "current_weather" in data
    assert "fifteen_day_forecast" in data
    assert "irrigation_intelligence" in data
    assert "windows" in data
    assert "ai_weather_summary" in data

def test_mlops_models_registry():
    response = client.get("/api/v1/mlops/models")
    assert response.status_code == 200
    data = response.json()
    assert data["total_models"] >= 4
    model_ids = [m["model_id"] for m in data["models"]]
    assert "krishi_tft_temp_v3.2" in model_ids
    assert "krishi_lgbm_rain_v4.1" in model_ids

def test_data_quality_check():
    response = client.get("/api/v1/data-quality/check")
    assert response.status_code == 200
    data = response.json()
    assert data["overall_status"] in ["GOOD", "WARNING", "SUSPECT", "INVALID"]

def test_forecast_change_detection():
    response = client.get("/api/v1/forecast/change-detection")
    assert response.status_code == 200
    data = response.json()
    assert "has_significant_change" in data
    assert "deltas" in data
    assert "agricultural_impacts" in data
