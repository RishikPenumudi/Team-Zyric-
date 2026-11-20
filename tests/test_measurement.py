"""
Unit Tests for Module 02: Smart Measurement, Hardware Gateway & Tolerance Locks
"""

import sys
from pathlib import Path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

from backend.hardware import HardwareManager

def test_tolerance_within_bounds():
    hw = HardwareManager()
    hw.set_targets(plant_weight_g=100.0, water_volume_ml=1000.0, target_temp_c=85.0)
    # Set actual values within ±5%: 102.0g (+2%), 1010ml (+1%)
    hw.update_sensor_readings(plant_weight=102.0, water_volume=1010.0, temperature=25.0)

    val = hw.validate_measurements()
    assert val["can_proceed"] is True
    assert val["plant_weight"]["is_within_tolerance"] is True
    assert val["water_volume"]["is_within_tolerance"] is True
    print("✓ test_tolerance_within_bounds passed (Within ±5% tolerance)")

def test_tolerance_exceeded_lockout():
    hw = HardwareManager()
    hw.set_targets(plant_weight_g=100.0, water_volume_ml=1000.0, target_temp_c=85.0)
    # Exceed plant weight by +12%: 112.0g
    hw.update_sensor_readings(plant_weight=112.0, water_volume=1000.0)

    val = hw.validate_measurements()
    assert val["can_proceed"] is False
    assert val["plant_weight"]["is_within_tolerance"] is False
    assert val["water_volume"]["is_within_tolerance"] is True
    print("✓ test_tolerance_exceeded_lockout passed (Properly locked out on excess weight)")

def test_safety_interlock_thermal():
    hw = HardwareManager()
    hw.update_sensor_readings(temperature=96.5, water_volume=1000.0)
    check = hw.check_safety_interlocks()
    assert check["safe"] is False
    assert "Thermal Limit Exceeded" in check["warnings"][0]
    print("✓ test_safety_interlock_thermal passed (Cutoff triggered above 95°C)")

def test_safety_interlock_dry_run():
    hw = HardwareManager()
    hw.update_sensor_readings(temperature=50.0, water_volume=200.0) # 0.2L is below 0.5L limit
    check = hw.check_safety_interlocks()
    assert check["safe"] is False
    assert "Water Level Low" in check["warnings"][0]
    print("✓ test_safety_interlock_dry_run passed (Dry run cutoff triggered below 0.5L)")

if __name__ == "__main__":
    test_tolerance_within_bounds()
    test_tolerance_exceeded_lockout()
    test_safety_interlock_thermal()
    test_safety_interlock_dry_run()
    print("All Measurement & Safety tests passed successfully!")
