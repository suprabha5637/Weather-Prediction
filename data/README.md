# KrishiGo Weather Intelligence Data Lake Architecture

## 1. Directory Structure

```
/data
├── /raw            # Unprocessed raw API payloads, GRIB2 chunks, IoT dumps
├── /processed      # Cleaned, standardized NetCDF/Parquet datasets with quality flags
├── /features       # Feature-engineered matrices (temporal, lag, rolling, climatology)
├── /training       # Time-series training splits (strictly pre-forecast window)
├── /validation     # Walk-forward validation sets
├── /test           # Unseen future holdout benchmarks
├── /forecasts      # Stored model runs with run IDs, horizons, and quantiles (P10..P90)
├── /verification   # Paired forecast-vs-actual datasets and error residuals
├── /satellite      # INSAT-3DR, GPM IMERG precipitation, and MODIS LST observations
├── /nwp            # Numerical Weather Prediction grids (ECMWF, GFS, NCMRWF)
├── /observations   # Automated Weather Station (AWS) and IMD ground telemetry
├── /climatology    # 30-year gridded historical averages & standard deviations (1991-2020)
└── /models         # Serialized model artifacts, ONNX weights, and training checkpoints
```

## 2. Data Lineage Metadata Standard

Every ingested and processed file must store a sidecar `.metadata.json` or embed Parquet header metadata:

```json
{
  "dataset_id": "ds_varanasi_reanalysis_2026",
  "source": "ECMWF ERA5-Land + IMD AWS #428",
  "source_retrieval_time_utc": "2026-09-22T06:00:00Z",
  "spatial_bounding_box": [25.10, 82.80, 25.50, 83.15],
  "temporal_coverage": ["1995-01-01", "2026-09-22"],
  "temporal_resolution": "1_hour",
  "spatial_resolution_km": 3.0,
  "variable_units": {
    "temperature_2m": "celsius",
    "relative_humidity_2m": "percent",
    "precipitation": "mm",
    "surface_pressure": "hpa",
    "wind_speed_10m": "km_h"
  },
  "quality_engine_version": "v2.1.0",
  "passed_validation_records": 277200,
  "flagged_invalid_records": 12,
  "processing_pipeline_version": "pipeline_v4.2"
}
```
