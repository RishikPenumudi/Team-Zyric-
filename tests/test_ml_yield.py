"""
Unit Tests for Module 03: Machine Learning Dye-Yield Prediction & Error Pipeline
"""

import sys
from pathlib import Path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

from backend.ml_yield import yield_predictor, calculate_yield_error

def test_yield_prediction_bounds():
    # 100g marigold, 1000ml water, 85C, 45 mins
    pred = yield_predictor.predict(
        plant_weight=100.0,
        water_ml=1000.0,
        temp_c=85.0,
        duration_mins=45.0,
        botanical_id=1
    )
    output = pred["predicted_output_ml"]
    # Physical yield must be positive, less than input water (1000ml), and greater than 50%
    assert 500.0 <= output <= 980.0, f"Expected output between 500 and 980 ml, got {output}"
    assert pred["estimated_biomass_retention_ml"] > 0
    assert pred["estimated_evaporation_loss_ml"] > 0
    print(f"✓ test_yield_prediction_bounds passed (Yield: {output} ml)")

def test_error_calculation():
    actual = 865.0
    predicted = 843.8
    err = calculate_yield_error(actual, predicted)
    expected_abs = abs(actual - predicted)
    assert abs(err["absolute_error_ml"] - expected_abs) < 0.1
    expected_pct = (expected_abs / predicted) * 100.0
    assert abs(err["percentage_error"] - expected_pct) < 0.1
    assert "Exceptional" in err["evaluation"]
    print(f"✓ test_error_calculation passed (Absolute: {err['absolute_error_ml']} ml, Pct: {err['percentage_error']}%)")

def test_zero_predicted_safety():
    err = calculate_yield_error(500.0, 0.0)
    assert err["absolute_error_ml"] == 0.0
    assert err["percentage_error"] == 0.0
    print("✓ test_zero_predicted_safety passed")

if __name__ == "__main__":
    test_yield_prediction_bounds()
    test_error_calculation()
    test_zero_predicted_safety()
    print("All ML Yield tests passed successfully!")
