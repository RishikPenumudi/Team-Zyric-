"""
SAHAJ AI - Machine Learning Dye-Yield Prediction & Error Analysis Pipeline
Physics-informed botanical mass-transfer model combined with NumPy Ordinary Least Squares & Ridge regression.
"""

import math
import numpy as np
from backend.database import get_connection

# Typical botanical absorption coefficients (ml water retained per gram of dry botanical matter)
BOTANICAL_ABSORPTION_COEFFS = {
    1: 1.50, # Marigold petals: absorbs ~1.5 ml/g
    2: 0.25, # Indigo vat stock / reduced pigment: ~0.25 ml/g (vat chemistry, not dense biomass)
    3: 1.80, # Madder root coarse powder: absorbs ~1.8 ml/g
    4: 1.60, # Pomegranate rind: absorbs ~1.6 ml/g
    5: 1.20, # Turmeric dried ground rhizome: absorbs ~1.2 ml/g
    6: 1.40, # Onion skin dry papery leaves: absorbs ~1.4 ml/g
    7: 1.60, # Hibiscus calyces: absorbs ~1.6 ml/g
    8: 0.60, # Fresh Red Cabbage (high internal water content): ~0.6 ml/g
    9: 1.70, # Black Tea cured leaves: absorbs ~1.7 ml/g
    10: 1.50, # Spent Coffee Grounds: absorbs ~1.5 ml/g
    11: 1.30  # Eucalyptus leaves: absorbs ~1.3 ml/g
}

# Baseline evaporation rate factor per hour at 100°C
BASELINE_EVAPORATION_RATE = 0.05

class DyeYieldPredictor:
    """
    Explainable machine learning pipeline for botanical dye extraction yield.
    Uses physics-informed mass balance feature engineering + Ordinary Least Squares calibration.
    """

    def __init__(self):
        self.weights = None
        self.is_calibrated = False
        self.training_sample_count = 0
        self.train_from_db()

    def _extract_features(self, plant_weight: float, water_ml: float, temp_c: float, duration_mins: float, botanical_id: int) -> np.ndarray:
        """
        Construct explainable feature vector:
        1. Bias (intercept)
        2. Water Input (ml)
        3. Theoretical Biomass Absorption (ml) = plant_weight * absorption_coeff
        4. Evaporation Estimate (ml) = water_ml * (temp / 100)^2 * (duration / 60) * rate
        5. Thermal Duration interaction (temp * duration / 1000)
        """
        abs_coeff = BOTANICAL_ABSORPTION_COEFFS.get(botanical_id, 1.5)
        theoretical_absorption = plant_weight * abs_coeff
        evap_factor = ((temp_c / 100.0) ** 2) * (duration_mins / 60.0) * BASELINE_EVAPORATION_RATE
        evaporation_estimate = water_ml * evap_factor
        thermal_duration = (temp_c * duration_mins) / 1000.0

        return np.array([
            1.0,
            water_ml,
            theoretical_absorption,
            evaporation_estimate,
            thermal_duration
        ], dtype=np.float64)

    def train_from_db(self):
        """Train or recalibrate the regression model using completed historical batches."""
        try:
            conn = get_connection()
            query = """
            SELECT b.recipe_id, b.plant_weight, b.water_quantity, b.actual_temperature,
                   b.extraction_duration, r.botanical_material_id, br.actual_output
            FROM production_batches b
            JOIN dye_recipes r ON b.recipe_id = r.id
            JOIN batch_results br ON b.id = br.batch_id
            WHERE br.actual_output IS NOT NULL AND br.actual_output > 0
            """
            rows = conn.execute(query).fetchall()
            conn.close()

            if len(rows) < 3:
                # Fall back to default physics-based baseline weights
                # Yield approx = 0.98 * Water - 1.2 * Absorption - 1.0 * Evaporation
                self.weights = np.array([0.0, 0.97, -1.0, -1.0, -0.5], dtype=np.float64)
                self.is_calibrated = False
                self.training_sample_count = len(rows)
                return

            X_list = []
            y_list = []
            for r in rows:
                p_wt = float(r["plant_weight"])
                w_ml = float(r["water_quantity"])
                t_c = float(r["actual_temperature"] or 85.0)
                dur = float(r["extraction_duration"] or 45)
                b_id = int(r["botanical_material_id"])
                actual = float(r["actual_output"])

                feat = self._extract_features(p_wt, w_ml, t_c, dur, b_id)
                X_list.append(feat)
                y_list.append(actual)

            X = np.array(X_list, dtype=np.float64)
            y = np.array(y_list, dtype=np.float64)

            # Regularized Ridge / OLS solution: (X^T X + lambda I)^(-1) X^T y
            reg_lambda = 0.05
            XT_X = np.dot(X.T, X) + reg_lambda * np.eye(X.shape[1])
            XT_y = np.dot(X.T, y)
            self.weights = np.linalg.solve(XT_X, XT_y)
            self.is_calibrated = True
            self.training_sample_count = len(rows)
        except Exception as e:
            # Fallback safe physics weights
            self.weights = np.array([0.0, 0.97, -1.0, -1.0, -0.5], dtype=np.float64)
            self.is_calibrated = False

    def predict(self, plant_weight: float, water_ml: float, temp_c: float, duration_mins: float, botanical_id: int) -> dict:
        """
        Generate predicted dye volume output with explainable breakdowns.
        """
        feat = self._extract_features(plant_weight, water_ml, temp_c, duration_mins, botanical_id)
        raw_pred = float(np.dot(self.weights, feat))

        # Physical boundary constraints: Output cannot exceed input water or be below 0
        min_phys = water_ml * 0.50
        max_phys = water_ml * 0.98
        bounded_pred = max(min_phys, min(raw_pred, max_phys))

        abs_coeff = BOTANICAL_ABSORPTION_COEFFS.get(botanical_id, 1.5)
        est_absorbed = round(plant_weight * abs_coeff, 1)
        est_evaporated = round(water_ml * ((temp_c / 100.0) ** 2) * (duration_mins / 60.0) * BASELINE_EVAPORATION_RATE, 1)

        return {
            "predicted_output_ml": round(bounded_pred, 1),
            "theoretical_water_input_ml": water_ml,
            "estimated_biomass_retention_ml": est_absorbed,
            "estimated_evaporation_loss_ml": est_evaporated,
            "model_type": "Physics-Informed Ridge Polynomial Regression (NumPy)",
            "is_calibrated_on_batches": self.is_calibrated,
            "training_batches_count": self.training_sample_count,
            "model_status": "Calibrated with historical batches" if self.is_calibrated else "Initial baseline (requires continuous batch calibration)",
            "model_limitations": (
                "Yield prediction accounts for botanical moisture retention and evaporation. "
                "Coarse vs fine powder grind size and ambient humidity may introduce minor variance."
            )
        }

def calculate_yield_error(actual_ml: float, predicted_ml: float) -> dict:
    """
    Compute absolute and percentage errors between actual collected dye and predicted dye.
    Handles zero and missing values safely.
    """
    if predicted_ml is None or predicted_ml <= 0.0:
        return {
            "actual_output_ml": actual_ml,
            "predicted_output_ml": predicted_ml,
            "absolute_error_ml": 0.0,
            "percentage_error": 0.0,
            "yield_efficiency_percent": 0.0,
            "status": "Invalid or zero predicted output"
        }

    abs_err = abs(actual_ml - predicted_ml)
    pct_err = (abs_err / predicted_ml) * 100.0

    # Assessment
    if pct_err <= 3.0:
        evaluation = "Exceptional Accuracy (<3% Error)"
    elif pct_err <= 7.0:
        evaluation = "Good Artisan Tolerance (<7% Error)"
    elif pct_err <= 15.0:
        evaluation = "Moderate Deviation - Check Biomass Pressing or Filter Loss"
    else:
        evaluation = "Significant Process Deviation - Verify Water Evaporation or Leakage"

    return {
        "actual_output_ml": round(actual_ml, 1),
        "predicted_output_ml": round(predicted_ml, 1),
        "absolute_error_ml": round(abs_err, 1),
        "percentage_error": round(pct_err, 2),
        "evaluation": evaluation
    }

# Global singleton predictor instance
yield_predictor = DyeYieldPredictor()
