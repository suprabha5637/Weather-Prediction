"""
Weather Anomaly Detection Engine for KrishiGo Weather Intelligence.

Detects statistically significant deviations between current/forecast weather
and 30-year historical climatological baselines (ERA5-Land & IMD Reanalysis 1991-2020).
"""

from typing import Dict, Any, List
from datetime import datetime

class ClimatologyAnomalyEngine:
    # 30-Year monthly climatological baselines for Indo-Gangetic Basin (Varanasi / Eastern UP)
    # [T_mean, T_max, T_min, Monthly_Precip_mm, Mean_RH]
    MONTHLY_NORMALS = {
        1:  {"temp_mean": 15.8, "temp_max": 22.8, "temp_min": 8.8,  "precip_mm": 18.0, "rh_pct": 72.0},
        2:  {"temp_mean": 19.4, "temp_max": 27.2, "temp_min": 11.6, "precip_mm": 16.0, "rh_pct": 62.0},
        3:  {"temp_mean": 25.6, "temp_max": 33.8, "temp_min": 17.4, "precip_mm": 10.0, "rh_pct": 46.0},
        4:  {"temp_mean": 31.5, "temp_max": 39.4, "temp_min": 23.6, "precip_mm": 8.0,  "rh_pct": 36.0},
        5:  {"temp_mean": 34.2, "temp_max": 41.8, "temp_min": 26.6, "precip_mm": 24.0, "rh_pct": 42.0},
        6:  {"temp_mean": 33.6, "temp_max": 39.2, "temp_min": 28.0, "precip_mm": 115.0,"rh_pct": 64.0},
        7:  {"temp_mean": 29.8, "temp_max": 33.6, "temp_min": 26.0, "precip_mm": 295.0,"rh_pct": 82.0},
        8:  {"temp_mean": 29.2, "temp_max": 32.8, "temp_min": 25.6, "precip_mm": 280.0,"rh_pct": 84.0},
        9:  {"temp_mean": 28.6, "temp_max": 32.4, "temp_min": 24.8, "precip_mm": 195.0,"rh_pct": 80.0},
        10: {"temp_mean": 26.0, "temp_max": 32.0, "temp_min": 20.0, "precip_mm": 38.0, "rh_pct": 70.0},
        11: {"temp_mean": 21.0, "temp_max": 28.4, "temp_min": 13.6, "precip_mm": 6.0,  "rh_pct": 65.0},
        12: {"temp_mean": 16.8, "temp_max": 23.8, "temp_min": 9.8,  "precip_mm": 8.0,  "rh_pct": 70.0},
    }

    @classmethod
    def evaluate_anomalies(
        cls,
        month: int,
        current_temp_max: float,
        current_temp_min: float,
        current_rh: float,
        expected_precip_15d: float
    ) -> Dict[str, Any]:
        """
        Calculates delta anomalies and returns agronomic classification.
        """
        normal = cls.MONTHLY_NORMALS.get(month, cls.MONTHLY_NORMALS[9])
        
        temp_max_anomaly = round(current_temp_max - normal["temp_max"], 1)
        temp_min_anomaly = round(current_temp_min - normal["temp_min"], 1)
        rh_anomaly = round(current_rh - normal["rh_pct"], 1)
        
        # Expected 15-day normal precip is roughly half the monthly normal
        normal_15d_precip = round(normal["precip_mm"] / 2.0, 1)
        precip_anomaly = round(expected_precip_15d - normal_15d_precip, 1)

        detected_anomalies: List[Dict[str, Any]] = []

        if abs(temp_max_anomaly) >= 3.0:
            direction = "above" if temp_max_anomaly > 0 else "below"
            severity = "HIGH" if abs(temp_max_anomaly) >= 5.0 else "MODERATE"
            detected_anomalies.append({
                "variable": "Maximum Temperature",
                "observed_forecast": current_temp_max,
                "climatological_normal": normal["temp_max"],
                "delta": temp_max_anomaly,
                "direction": direction,
                "severity": severity,
                "description": f"Maximum temperature is {abs(temp_max_anomaly)}°C {direction} historical average for this period.",
                "agronomic_implication": "Risk of pollen sterility in flowering crops or excessive evapotranspiration." if temp_max_anomaly > 0 else "Slower germination and vegetative growth rates."
            })

        if abs(precip_anomaly) >= 25.0:
            direction = "above" if precip_anomaly > 0 else "below"
            severity = "HIGH" if abs(precip_anomaly) >= 60.0 else "MODERATE"
            detected_anomalies.append({
                "variable": "Precipitation Accumulation",
                "observed_forecast": expected_precip_15d,
                "climatological_normal": normal_15d_precip,
                "delta": precip_anomaly,
                "direction": direction,
                "severity": severity,
                "description": f"15-Day rainfall is {abs(precip_anomaly)} mm {direction} historical 30-year normal.",
                "agronomic_implication": "Waterlogging and fertilizer leaching hazard." if precip_anomaly > 0 else "Deficit moisture conditions; supplemental irrigation planning required."
            })

        return {
            "month": month,
            "reference_period": "1991–2020 IMD/ERA5 Climatology Normal",
            "anomalies_detected": len(detected_anomalies) > 0,
            "anomaly_count": len(detected_anomalies),
            "anomalies": detected_anomalies,
            "metrics": {
                "temp_max_anomaly_c": temp_max_anomaly,
                "temp_min_anomaly_c": temp_min_anomaly,
                "rh_anomaly_pct": rh_anomaly,
                "precip_15d_anomaly_mm": precip_anomaly
            }
        }
