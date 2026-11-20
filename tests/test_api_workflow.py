"""
Complete 14-Step End-to-End Demonstration Integration Test
Verifies the exact workflow mandated in Section 11 of the SAHAJ AI Master Build Specification.
"""

import sys
import asyncio
from pathlib import Path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

from starlette.testclient import TestClient
from backend.app import app

client = TestClient(app)

def test_full_14_step_workflow():
    print("==================================================")
    print(" STARTING SAHAJ AI 14-STEP WORKFLOW VALIDATION")
    print("==================================================")

    # STEP 1 & 2: User provides mustard-yellow colour reference
    print("\n[STEP 1 & 2] Analyse Mustard-Yellow Colour Reference...")
    resp = client.post("/api/colour/analyse", json={
        "hex_code": "#D49B28",
        "fabric_type": "cotton",
        "quantity": 200.0
    })
    assert resp.status_code == 200, f"Error: {resp.text}"
    col_data = resp.json()
    assert col_data["analysis"]["dominant_hex"] == "#D49B28"
    assert "Mustard" in col_data["analysis"]["color_family"] or "Gold" in col_data["analysis"]["color_family"]
    print(f"✓ Dominant Colour: {col_data['analysis']['dominant_hex']} | Family: {col_data['analysis']['color_family']}")

    # STEP 3: Recipe Engine retrieves appropriate botanical recipe
    print("\n[STEP 3] Retrieve Botanical Recipe Match...")
    matched = col_data["matched_recipes"]
    assert len(matched) > 0, "No recipes matched"
    best_recipe = matched[0]
    recipe_id = best_recipe["recipe_id"]
    print(f"✓ Matched Recipe: {best_recipe['recipe_name']} (Botanical: {best_recipe['botanical_name']}, Delta E: {best_recipe['delta_e']})")

    # STEP 4: Calculate required plant material and water quantities
    print("\n[STEP 4] Calculate Plant Material & Water Quantities...")
    resp = client.post("/api/measurements/calculate", json={
        "recipe_id": recipe_id,
        "fabric_weight": 200.0
    })
    assert resp.status_code == 200
    meas_data = resp.json()
    calc = meas_data["calculation"]
    plant_target = calc["target_plant_weight_g"]
    water_target = calc["target_water_input_ml"]
    print(f"✓ Target Plant: {plant_target} g | Target Water: {water_target} ml (Ratio: {calc['material_to_water_ratio']})")

    # STEP 5: Operator confirms actual material and water measurements within tolerance
    print("\n[STEP 5] Confirm Actual Measurements within ±5% Tolerance...")
    resp = client.post("/api/measurements/validate", json={
        "actual_plant_weight": plant_target + 0.5, # +0.5%
        "actual_water_volume": water_target + 10.0 # +1.0%
    })
    assert resp.status_code == 200
    val_data = resp.json()
    assert val_data["can_begin_extraction"] is True
    print(f"✓ Validation Status: {val_data['validation']['status_text']}")

    # STEP 6: Extraction begins in live or clearly labelled simulation mode
    print("\n[STEP 6] Initialize Batch & Begin Extraction...")
    resp_batch = client.post("/api/batches", json={
        "recipe_id": recipe_id,
        "plant_weight": plant_target + 0.5,
        "water_quantity": water_target + 10.0
    })
    assert resp_batch.status_code == 200
    batch_info = resp_batch.json()["batch"]
    batch_id = batch_info["id"]

    resp_start = client.post("/api/process/start", json={
        "batch_id": batch_id,
        "duration": 45,
        "temperature": 85.0
    })
    assert resp_start.status_code == 200
    print(f"✓ Extraction Started for Batch {batch_info['batch_number']} (Status: {resp_start.json()['process']['process_status']})")

    # STEP 7: Application displays temperature, duration, pump and process status
    print("\n[STEP 7] Monitor Extraction Telemetry & Progress...")
    resp_tick = client.post("/api/process/tick", json={"seconds": 60, "fast_forward": True})
    assert resp_tick.status_code == 200
    proc = resp_tick.json()["process"]
    print(f"✓ Telemetry: Temp={proc['telemetry']['sensors']['temperature_c']}°C | Pump={proc['telemetry']['actuators']['pump']} | Progress={proc['progress_percent']}%")

    # STEP 8: Yield engine predicts expected dye output
    print("\n[STEP 8] Predict Expected Dye Output via ML Engine...")
    b_id = best_recipe.get("botanical_material_id") or 1
    resp_pred = client.post("/api/yield/predict", json={
        "plant_weight": plant_target + 0.5,
        "water_quantity": water_target + 10.0,
        "temperature": 85.0,
        "duration": 45.0,
        "botanical_id": b_id
    })
    assert resp_pred.status_code == 200
    pred_data = resp_pred.json()["prediction"]
    pred_ml = pred_data["predicted_output_ml"]
    print(f"✓ Predicted Dye Output: {pred_ml} ml (Biomass Loss: -{pred_data['estimated_biomass_retention_ml']} ml, Evap: -{pred_data['estimated_evaporation_loss_ml']} ml)")

    # STEP 9 & 10: Operator records actual collected volume & calculates error
    print("\n[STEP 9 & 10] Record Actual Output & Calculate Absolute & Percentage Error...")
    actual_collected = round(pred_ml + 12.5, 1)
    resp_err = client.post("/api/yield/compare", json={
        "batch_id": batch_id,
        "actual_output": actual_collected,
        "predicted_output": pred_ml,
        "notes": "14-Step Demo Run"
    })
    assert resp_err.status_code == 200
    err_data = resp_err.json()["error_analysis"]
    print(f"✓ Actual: {actual_collected} ml | Predicted: {pred_ml} ml")
    print(f"✓ Absolute Error: {err_data['absolute_error_ml']} ml | Percentage Error: {err_data['percentage_error']}% ({err_data['evaluation']})")

    # STEP 11: Validate dye quantity available for selected fabric and recipe
    print("\n[STEP 11] Validate Dye Volume Sufficiency for 200g Cotton...")
    resp_dyeing_val = client.post("/api/dyeing/validate", json={
        "batch_id": batch_id,
        "fabric_type": "cotton",
        "fabric_weight": 200.0
    })
    assert resp_dyeing_val.status_code == 200
    d_val = resp_dyeing_val.json()
    assert d_val["is_sufficient"] is True
    print(f"✓ Dye Sufficiency: {d_val['status_note']} (Avail: {d_val['available_dye_ml']} ml >= Required: {d_val['recommended_liquor_ml']} ml)")

    # STEP 12: Guidance to add fabric and proceed with dyeing
    print("\n[STEP 12] Guided Fabric Addition & Start Dyeing Workflow...")
    resp_d_start = client.post("/api/dyeing/start", json={
        "batch_id": batch_id,
        "fabric_weight": 200.0
    })
    assert resp_d_start.status_code == 200
    assert resp_d_start.json()["process_status"] == "Dyeing In Progress"
    print(f"✓ Fabric Added. Dyeing Active (Status: {resp_d_start.json()['process_status']})")

    # Complete dyeing run
    resp_d_comp = client.post("/api/dyeing/complete", json={"batch_id": batch_id})
    assert resp_d_comp.status_code == 200
    assert resp_d_comp.json()["process_status"] == "Dyeing Completed"
    print(f"✓ Dyeing Run Completed Successfully (Status: {resp_d_comp.json()['process_status']})")

    # STEP 13 & 14: Verify batch persistence and retrieve from production history
    print("\n[STEP 13 & 14] Verify Batch Persistence & Historical Record...")
    resp_history = client.get(f"/api/batches/{batch_id}")
    assert resp_history.status_code == 200
    batch_record = resp_history.json()["batch"]
    assert batch_record["batch_number"] == batch_info["batch_number"]
    assert batch_record["process_status"] == "Dyeing Completed"
    assert batch_record["actual_output"] == actual_collected
    print(f"✓ Batch Record Stored & Retrieved: {batch_record['batch_number']} | Status: {batch_record['process_status']} | Final Error: {batch_record['percentage_error']}%")

    print("\n==================================================")
    print(" ALL 14 STEPS COMPLETED & VERIFIED 100% OPERATIONAL")
    print("==================================================")

if __name__ == "__main__":
    test_full_14_step_workflow()
