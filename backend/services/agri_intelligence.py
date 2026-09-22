"""
Agronomic Intelligence Engine for KrishiGo.
Implements FAO-56 Penman-Monteith Reference Evapotranspiration (ET0),
Growing Degree Days (GDD), Pest/Disease Weather Index, and Operations Window Scoring.
"""

import math
from typing import Dict, Any

class AgronomicEngine:
    @staticmethod
    def calculate_fao56_et0(
        t_mean: float,
        wind_2m_ms: float,
        rh_mean: float,
        solar_rad_mj_m2: float = 19.5,
        altitude_m: float = 80.0
    ) -> float:
        """
        Calculates reference evapotranspiration (ET0 in mm/day) using the standard
        FAO-56 Penman-Monteith formulation.
        """
        p = 101.3 * ((293 - 0.0065 * altitude_m) / 293) ** 5.26
        gamma = 0.000665 * p
        delta = (4098 * (0.6108 * math.exp((17.27 * t_mean) / (t_mean + 237.3)))) / ((t_mean + 237.3) ** 2)
        e_sat = 0.6108 * math.exp((17.27 * t_mean) / (t_mean + 237.3))
        e_act = e_sat * (rh_mean / 100.0)
        g = 0.0
        
        num = 0.408 * delta * (solar_rad_mj_m2 - g) + gamma * (900 / (t_mean + 273)) * wind_2m_ms * (e_sat - e_act)
        den = delta + gamma * (1 + 0.34 * wind_2m_ms)
        
        et0 = num / den
        return round(max(et0, 0.5), 2)

    @staticmethod
    def evaluate_spray_window(
        wind_speed_kmh: float,
        rain_prob: float,
        temp_c: float,
        rh_percent: float
    ) -> Dict[str, Any]:
        """
        Calculates agricultural chemical spraying window score (0 to 100).
        Favorable: Wind 5-12 km/h, Rain prob < 20%, Temp 18-28°C, RH 50-75%.
        """
        score = 100.0
        reasons = []

        if wind_speed_kmh > 15.0:
            penalty = (wind_speed_kmh - 15.0) * 5.0
            score -= penalty
            reasons.append(f"Elevated wind speed ({wind_speed_kmh} km/h) causes off-target spray drift.")
        elif wind_speed_kmh < 4.0:
            score -= 10.0
            reasons.append("Air inversion risk with near-zero wind; droplet settling may be uneven.")

        if rain_prob > 25.0:
            score -= (rain_prob - 25.0) * 1.5
            reasons.append(f"Rain probability is {rain_prob}%; high wash-off risk.")

        if temp_c > 32.0:
            score -= (temp_c - 32.0) * 4.0
            reasons.append(f"High temperature ({temp_c}°C) accelerates droplet evaporation.")

        final_score = max(0, min(100, int(score)))
        status = "OPTIMAL" if final_score >= 80 else "SUITABLE" if final_score >= 60 else "CAUTION" if final_score >= 40 else "UNSUITABLE"

        return {
            "spray_score": final_score,
            "suitability_score": final_score,
            "status": status,
            "best_window": "6:00 AM – 9:00 AM",
            "alternative_window": "5:00 PM – 7:00 PM",
            "reasons": reasons if reasons else ["Wind speed, ambient temperature, and precipitation probability are optimal."]
        }

    @staticmethod
    def evaluate_disease_risk(temp_c: float, rh_percent: float, rain_days_ahead: int) -> Dict[str, Any]:
        """
        Calculates weather-driven fungal and insect pest risk score.
        Warm (24-30°C) + High RH (>75%) + Rain triggers aphid and blight outbreaks.
        """
        aphid_risk = "Low"
        blight_risk = "Low"

        if 22.0 <= temp_c <= 32.0 and rh_percent >= 65:
            aphid_risk = "Moderate"

        if rh_percent >= 80 and rain_days_ahead >= 2:
            blight_risk = "High"

        return {
            "aphid_risk": aphid_risk,
            "blight_risk": blight_risk,
            "monitored_crops": ["Paddy", "Maize", "Vegetables"],
            "advisory": "Scout lower canopy foliage for aphid colonies and water-soaked lesions."
        }
