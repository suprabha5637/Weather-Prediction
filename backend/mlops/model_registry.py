"""
MLOps Model Registry and Benchmark Engine for KrishiGo Weather Intelligence.

Maintains immutable model lineage, validation periods, hyperparameter tracking,
and multi-horizon verification benchmarks.
"""

from typing import Dict, Any, List
from datetime import datetime

class ModelRegistry:
    # Model Catalog registered in KrishiGo Weather Intelligence platform
    MODELS = [
        {
            "model_id": "krishi_tft_temp_v3.2",
            "model_name": "Temporal Fusion Transformer (TFT)",
            "version": "v3.2.0",
            "target_variable": "2m Temperature (°C)",
            "location_scope": "Indo-Gangetic Basin (Lat 24-28N, Lon 80-88E)",
            "training_period": "2010-01-01 to 2023-12-31",
            "validation_period": "2024-01-01 to 2024-12-31",
            "testing_period": "2025-01-01 to 2026-06-30 (Walk-forward)",
            "features": [
                "temp_lag_24h", "rh_lag_24h", "solar_rad_lag", "soil_moist_10cm",
                "day_of_year_sin_cos", "elevation_m", "synoptic_pressure_surface"
            ],
            "hyperparameters": {
                "hidden_dim": 128,
                "attention_heads": 4,
                "dropout": 0.15,
                "learning_rate": 0.0003,
                "loss_function": "QuantileLoss (P10, P50, P90)"
            },
            "metrics": {
                "mae": 0.68,
                "rmse": 0.94,
                "r2": 0.962,
                "crps": 0.51,
                "bias_c": -0.08
            },
            "status": "Production",
            "created_date": "2026-02-15",
            "deployment_date": "2026-03-01",
            "deployment_gate_passed": True
        },
        {
            "model_id": "krishi_lgbm_rain_v4.1",
            "model_name": "LightGBM Calibrated Rain Classifier & Regressor",
            "version": "v4.1.2",
            "target_variable": "Precipitation Probability & Accumulation (mm)",
            "location_scope": "Eastern Uttar Pradesh & Bihar Sub-agro-climatic Zone",
            "training_period": "2005-01-01 to 2023-12-31",
            "validation_period": "2024-01-01 to 2024-12-31",
            "testing_period": "2025-01-01 to 2026-06-30",
            "features": [
                "cape_jkg", "precipitable_water_mm", "convective_inhibition",
                "850hpa_wind_shear", "radar_reflectivity_composite", "gpm_imerg_3h_rate"
            ],
            "hyperparameters": {
                "n_estimators": 450,
                "max_depth": 8,
                "learning_rate": 0.03,
                "subsample": 0.82,
                "colsample_bytree": 0.8
            },
            "metrics": {
                "brier_score": 0.138,
                "roc_auc": 0.892,
                "precipitation_mae_mm": 1.24,
                "f1_score": 0.841,
                "reliability_slope": 0.98
            },
            "status": "Production",
            "created_date": "2026-04-10",
            "deployment_date": "2026-04-20",
            "deployment_gate_passed": True
        },
        {
            "model_id": "krishi_xgb_wind_v2.5",
            "model_name": "XGBoost Wind Vector Downscaling",
            "version": "v2.5.0",
            "target_variable": "10m Wind Speed & Direction (km/h, deg)",
            "location_scope": "Northern Plains Agricultural Belt",
            "training_period": "2015-01-01 to 2024-06-30",
            "validation_period": "2024-07-01 to 2024-12-31",
            "testing_period": "2025-01-01 to 2026-06-30",
            "features": [
                "surface_roughness_z0", "synoptic_u_10m", "synoptic_v_10m",
                "boundary_layer_height", "terrain_slope"
            ],
            "hyperparameters": {
                "n_estimators": 300,
                "max_depth": 6,
                "learning_rate": 0.05
            },
            "metrics": {
                "speed_mae_kmh": 1.85,
                "speed_rmse_kmh": 2.41,
                "direction_error_deg": 14.2
            },
            "status": "Production",
            "created_date": "2026-05-02",
            "deployment_date": "2026-05-12",
            "deployment_gate_passed": True
        },
        {
            "model_id": "krishi_stacked_ensemble_v4.2",
            "model_name": "Bayesian Model Averaging & Quantile Ensemble",
            "version": "v4.2.0",
            "target_variable": "Full 15-Day Synoptic-Agri Forecast Envelope",
            "location_scope": "National (Varanasi Node Lead)",
            "training_period": "Multi-model validation period 2022-2025",
            "validation_period": "2025-01-01 to 2025-12-31",
            "testing_period": "2026-01-01 to Present (Continuous)",
            "features": [
                "NWP ECMWF HRES output", "GFS 0.25deg output", "TFT temp prediction",
                "LightGBM rain probability", "Local ground station bias vector"
            ],
            "hyperparameters": {
                "meta_learner": "Ridge Regression with Non-negative Weights",
                "alpha": 0.85
            },
            "metrics": {
                "overall_mae": 0.62,
                "brier_score": 0.132,
                "crps": 0.46,
                "interval_coverage_p10_p90": 0.884
            },
            "status": "Production",
            "created_date": "2026-06-01",
            "deployment_date": "2026-06-15",
            "deployment_gate_passed": True
        },
        {
            "model_id": "krishi_graph_neural_v1.0_candidate",
            "model_name": "Spatial-Temporal Graph Neural Network (ST-GNN)",
            "version": "v1.0.0-rc1",
            "target_variable": "Multi-Station Coordinated Convection & Microclimate",
            "location_scope": "District Varanasi (20 IoT Ground Stations)",
            "training_period": "2023-01-01 to 2025-12-31",
            "validation_period": "2026-01-01 to 2026-06-30",
            "testing_period": "2026-07-01 to Present",
            "features": ["inter_station_distance_graph", "elevation_delta", "station_telemetry_stream"],
            "hyperparameters": {"gcn_layers": 3, "gru_units": 64},
            "metrics": {"mae": 0.59, "brier_score": 0.129},
            "status": "Candidate",
            "created_date": "2026-08-20",
            "deployment_date": None,
            "deployment_gate_passed": False
        }
    ]

    @classmethod
    def get_all_models(cls) -> List[Dict[str, Any]]:
        return cls.MODELS

    @classmethod
    def get_model_by_id(cls, model_id: str) -> Dict[str, Any]:
        for m in cls.MODELS:
            if m["model_id"] == model_id:
                return m
        return {}
