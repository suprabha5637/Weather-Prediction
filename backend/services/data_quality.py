"""
Data Quality Engine for KrishiGo Weather Intelligence.

Enforces meteorological physical bounds, spike/jump detection, temporal consistency,
and sensor failure isolation. Flags data records with:
- GOOD: Within normal statistical & physical envelope
- WARNING: Approaching climatic extremes (needs downstream verification)
- SUSPECT: Unrealistic rate of change or statistical anomaly
- INVALID: Physically impossible values (auto-rejected from model ingestion)
- MISSING: Telemetry gap or incomplete payload
"""

from typing import Dict, Any, List
from datetime import datetime, timezone

class DataQualityEngine:
    # Physical and climatic bounds for Indo-Gangetic and tropical agricultural zones
    BOUNDS = {
        "temperature_c": {"min": -5.0, "max": 54.0, "max_jump_1h": 8.0},
        "humidity_pct": {"min": 0.0, "max": 100.0, "max_jump_1h": 35.0},
        "pressure_hpa": {"min": 870.0, "max": 1085.0, "max_jump_1h": 12.0},
        "wind_speed_kmh": {"min": 0.0, "max": 180.0, "max_jump_1h": 50.0},
        "precipitation_mm": {"min": 0.0, "max": 400.0, "max_jump_1h": 120.0},
        "uv_index": {"min": 0.0, "max": 16.0, "max_jump_1h": 8.0},
        "latitude": {"min": -90.0, "max": 90.0},
        "longitude": {"min": -180.0, "max": 180.0}
    }

    @classmethod
    def validate_observation(cls, record: Dict[str, Any], previous_record: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Validates a single weather observation record against physical bounds and jump limits.
        """
        flags = {}
        overall_status = "GOOD"
        violations = []

        # Coordinate check
        lat = record.get("latitude")
        lon = record.get("longitude")
        if lat is not None and not (cls.BOUNDS["latitude"]["min"] <= lat <= cls.BOUNDS["latitude"]["max"]):
            overall_status = "INVALID"
            violations.append(f"Latitude {lat} out of physical range.")
        if lon is not None and not (cls.BOUNDS["longitude"]["min"] <= lon <= cls.BOUNDS["longitude"]["max"]):
            overall_status = "INVALID"
            violations.append(f"Longitude {lon} out of physical range.")

        # Metric range checks
        for metric, bounds in cls.BOUNDS.items():
            if metric in ["latitude", "longitude"]:
                continue
            val = record.get(metric)
            if val is None:
                flags[metric] = "MISSING"
                violations.append(f"{metric} is missing.")
                if overall_status != "INVALID":
                    overall_status = "WARNING"
                continue

            # Physical limit check
            if val < bounds["min"] or val > bounds["max"]:
                flags[metric] = "INVALID"
                overall_status = "INVALID"
                violations.append(f"{metric} value {val} is physically impossible (allowed {bounds['min']} to {bounds['max']}).")
                continue

            # Climatic warning thresholds
            if metric == "temperature_c" and (val > 46.0 or val < 2.0):
                flags[metric] = "WARNING"
                violations.append(f"Extreme heat/cold condition: {val}°C.")
                if overall_status != "INVALID":
                    overall_status = "WARNING"
            elif metric == "wind_speed_kmh" and val > 75.0:
                flags[metric] = "WARNING"
                violations.append(f"Severe gale wind condition: {val} km/h.")
                if overall_status != "INVALID":
                    overall_status = "WARNING"
            else:
                flags[metric] = "GOOD"

            # Temporal rate-of-change (jump) check if previous record exists
            if previous_record and metric in bounds and "max_jump_1h" in bounds:
                prev_val = previous_record.get(metric)
                if prev_val is not None:
                    delta = abs(val - prev_val)
                    if delta > bounds["max_jump_1h"]:
                        flags[metric] = "SUSPECT"
                        violations.append(f"Unrealistic jump in {metric}: changed by {delta:.1f} in 1 hour (limit {bounds['max_jump_1h']}).")
                        if overall_status != "INVALID":
                            overall_status = "SUSPECT"

        return {
            "overall_status": overall_status,
            "metric_flags": flags,
            "violations": violations,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "validation_engine_version": "v2.1-fao-wmo"
        }

    @classmethod
    def run_health_audit(cls, sample_records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Runs comprehensive audit across an ingested telemetry batch.
        """
        total = len(sample_records)
        good_count = 0
        warning_count = 0
        suspect_count = 0
        invalid_count = 0

        for i, rec in enumerate(sample_records):
            prev = sample_records[i - 1] if i > 0 else None
            res = cls.validate_observation(rec, prev)
            status = res["overall_status"]
            if status == "GOOD":
                good_count += 1
            elif status == "WARNING":
                warning_count += 1
            elif status == "SUSPECT":
                suspect_count += 1
            elif status == "INVALID":
                invalid_count += 1

        return {
            "total_records_audited": total,
            "good_pct": round((good_count / total) * 100, 2) if total else 100.0,
            "warning_count": warning_count,
            "suspect_count": suspect_count,
            "invalid_count": invalid_count,
            "data_lineage": "Multi-Source Ingestion Pipeline (WMO Certified Station + NWP Reanalysis)"
        }
