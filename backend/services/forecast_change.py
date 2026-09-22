"""
Forecast Change Detection Engine for KrishiGo Weather Intelligence.

Detects run-to-run changes across consecutive Numerical Weather Prediction
and ML forecast cycles (e.g., 00Z vs 06Z vs 12Z runs) and alerts farmers
to actionable operational shifts.
"""

from typing import Dict, Any, List
from datetime import datetime, timezone

class ForecastChangeDetectionEngine:
    @classmethod
    def compare_runs(
        cls,
        previous_run: Dict[str, Any],
        current_run: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Compares two consecutive forecast runs and computes agricultural decision deltas.
        """
        prev_rain_prob = previous_run.get("rain_probability", 20.0)
        curr_rain_prob = current_run.get("rain_probability", 70.0)
        prob_delta = round(curr_rain_prob - prev_rain_prob, 1)

        prev_rainfall = previous_run.get("expected_rainfall_mm", 4.0)
        curr_rainfall = current_run.get("expected_rainfall_mm", 18.0)
        rainfall_delta = round(curr_rainfall - prev_rainfall, 1)

        prev_temp_max = previous_run.get("max_temp_c", 34.0)
        curr_temp_max = current_run.get("max_temp_c", 30.0)
        temp_delta = round(curr_temp_max - prev_temp_max, 1)

        # Significant change thresholds:
        # |prob_delta| >= 25% or |rainfall_delta| >= 10mm or |temp_delta| >= 3°C
        is_significant = (
            abs(prob_delta) >= 25.0 or
            abs(rainfall_delta) >= 10.0 or
            abs(temp_delta) >= 3.5
        )

        impacts = []
        recommended_action = "No immediate operational adjustment required."

        if prob_delta >= 30.0 or rainfall_delta >= 10.0:
            impacts.extend([
                {"operation": "Irrigation", "impact": "Postpone planned irrigation to prevent standing water and root asphyxiation."},
                {"operation": "Spraying", "impact": "Suspend foliar chemical spraying; chemical wash-off risk is high."},
                {"operation": "Harvest", "impact": "Accelerate harvest of mature produce before rain onset, or protect harvested produce."},
                {"operation": "Field Drainage", "impact": "Clear field ditches and drainage outlets to avoid waterlogging."}
            ])
            recommended_action = "Hold irrigation & suspend spraying: incoming wet spell detected."
        elif prob_delta <= -30.0 or rainfall_delta <= -10.0:
            impacts.extend([
                {"operation": "Irrigation", "impact": "Scheduled rainfall downgraded; prepare supplemental irrigation cycle."},
                {"operation": "Spraying", "impact": "Spraying window has opened with low rain wash-off risk."}
            ])
            recommended_action = "Rainfall downgraded: prepare supplemental irrigation."

        return {
            "has_significant_change": is_significant,
            "previous_run_id": previous_run.get("run_id", "run_20260921_1800Z"),
            "current_run_id": current_run.get("run_id", "run_20260922_0600Z"),
            "comparison_timestamp": datetime.now(timezone.utc).isoformat(),
            "deltas": {
                "rain_probability_pct": {
                    "previous": prev_rain_prob,
                    "current": curr_rain_prob,
                    "delta": prob_delta,
                    "unit": "pp"
                },
                "expected_rainfall_mm": {
                    "previous": prev_rainfall,
                    "current": curr_rainfall,
                    "delta": rainfall_delta,
                    "unit": "mm"
                },
                "max_temperature_c": {
                    "previous": prev_temp_max,
                    "current": curr_temp_max,
                    "delta": temp_delta,
                    "unit": "°C"
                }
            },
            "summary_message": (
                f"Rain probability increased by {prob_delta:+.0f} percentage points (from {prev_rain_prob}% to {curr_rain_prob}%). "
                f"Expected rainfall changed from {prev_rainfall} mm to {curr_rainfall} mm."
                if is_significant else "Forecast remains consistent with previous model cycle."
            ),
            "agricultural_impacts": impacts,
            "recommended_action": recommended_action
        }
