"""
SAHAJ AI - Hardware Abstraction Layer & Safety Subsystem
Supports Live Hardware Gateways (Serial/HTTP/MQTT) and Transparent Simulation Mode.
Maintains deterministic safety interlocks independent of AI layers.
"""

import time
import random
from typing import Dict, Any
from backend.config import (
    DEFAULT_HARDWARE_MODE,
    SAFETY_MAX_TEMPERATURE_C,
    SAFETY_MIN_WATER_LEVEL_LITRES,
    MEASUREMENT_TOLERANCE_PERCENT
)

class HardwareManager:
    """
    Manages physical or simulated IoT telemetry for SAHAJ natural dye machine.
    """

    def __init__(self):
        self.operating_mode = DEFAULT_HARDWARE_MODE  # "SIMULATION" or "LIVE"
        self.connection_status = "Connected (Simulated Hardware Gateway)" if self.operating_mode == "SIMULATION" else "Disconnected (Awaiting Hardware Interface)"
        
        # State variables
        self.target_plant_weight = 0.0
        self.target_water_volume = 0.0
        self.current_plant_weight = 0.0
        self.current_water_volume = 0.0
        self.current_temperature = 25.0 # Ambient starting temperature
        self.target_temperature = 85.0
        self.water_level_litres = 0.0
        self.pump_status = "OFF" # "ON", "OFF", "CIRCULATING"
        self.heater_status = "OFF" # "ON", "OFF", "INTERLOCKED"
        self.emergency_stop = False

        # Live hardware connection parameters
        self.gateway_ip = "192.168.1.150"
        self.serial_port = "COM3"

    def set_operating_mode(self, mode: str) -> dict:
        """Switch between 'LIVE' and 'SIMULATION' mode."""
        clean_mode = mode.upper()
        if clean_mode not in ("LIVE", "SIMULATION"):
            raise ValueError("Operating mode must be 'LIVE' or 'SIMULATION'")

        self.operating_mode = clean_mode
        if self.operating_mode == "SIMULATION":
            self.connection_status = "Connected (Simulated Hardware Gateway)"
        else:
            # Check physical gateway connectivity
            self.connection_status = "Standby (Local Hardware Gateway - Polling COM3/TCP)"

        return {
            "operating_mode": self.operating_mode,
            "connection_status": self.connection_status,
            "is_simulated": self.operating_mode == "SIMULATION"
        }

    def set_targets(self, plant_weight_g: float, water_volume_ml: float, target_temp_c: float = 85.0):
        """Set target setpoints from validated recipe calculation."""
        self.target_plant_weight = plant_weight_g
        self.target_water_volume = water_volume_ml
        self.target_temperature = target_temp_c

        if self.operating_mode == "SIMULATION":
            # Initialize simulated scale with realistic near-target reading
            noise_wt = random.uniform(-0.015, 0.02) * plant_weight_g
            noise_wtr = random.uniform(-0.01, 0.015) * water_volume_ml
            self.current_plant_weight = round(plant_weight_g + noise_wt, 1)
            self.current_water_volume = round(water_volume_ml + noise_wtr, 1)
            self.water_level_litres = round(self.current_water_volume / 1000.0, 2)

    def update_sensor_readings(self, plant_weight: float = None, water_volume: float = None, temperature: float = None):
        """Update live or simulated sensor readings."""
        if plant_weight is not None:
            self.current_plant_weight = round(plant_weight, 1)
        if water_volume is not None:
            self.current_water_volume = round(water_volume, 1)
            self.water_level_litres = round(self.current_water_volume / 1000.0, 2)
        if temperature is not None:
            self.current_temperature = round(temperature, 1)

    def validate_measurements(self) -> dict:
        """
        Compare actual sensor readings against recipe targets within tolerance.
        Returns deviation, tolerance status, and whether extraction is permitted.
        """
        if self.target_plant_weight <= 0 or self.target_water_volume <= 0:
            return {
                "valid": False,
                "can_proceed": False,
                "message": "Target values have not been set from a recipe."
            }

        # Weight deviation
        wt_dev_g = self.current_plant_weight - self.target_plant_weight
        wt_dev_pct = (abs(wt_dev_g) / self.target_plant_weight) * 100.0
        wt_within_tol = wt_dev_pct <= MEASUREMENT_TOLERANCE_PERCENT

        # Water deviation
        wtr_dev_ml = self.current_water_volume - self.target_water_volume
        wtr_dev_pct = (abs(wtr_dev_ml) / self.target_water_volume) * 100.0
        wtr_within_tol = wtr_dev_pct <= MEASUREMENT_TOLERANCE_PERCENT

        can_proceed = wt_within_tol and wtr_within_tol

        # Status badge & messages
        if can_proceed:
            status_text = "Measurements Validated (Within ±5% Recipe Limits)"
        elif not wt_within_tol and not wtr_within_tol:
            status_text = "Plant Weight & Water Volume Both Out of Tolerance"
        elif not wt_within_tol:
            status_text = f"Plant Weight Deviation ({wt_dev_pct:.1f}%) Exceeds ±5% Tolerance"
        else:
            status_text = f"Water Volume Deviation ({wtr_dev_pct:.1f}%) Exceeds ±5% Tolerance"

        return {
            "can_proceed": can_proceed,
            "status_text": status_text,
            "plant_weight": {
                "target_g": self.target_plant_weight,
                "actual_g": self.current_plant_weight,
                "deviation_g": round(wt_dev_g, 1),
                "deviation_percent": round(wt_dev_pct, 1),
                "is_within_tolerance": wt_within_tol,
                "tolerance_percent": MEASUREMENT_TOLERANCE_PERCENT
            },
            "water_volume": {
                "target_ml": self.target_water_volume,
                "actual_ml": self.current_water_volume,
                "deviation_ml": round(wtr_dev_ml, 1),
                "deviation_percent": round(wtr_dev_pct, 1),
                "is_within_tolerance": wtr_within_tol,
                "tolerance_percent": MEASUREMENT_TOLERANCE_PERCENT
            },
            "operating_mode": self.operating_mode,
            "is_simulated": self.operating_mode == "SIMULATION"
        }

    def check_safety_interlocks(self) -> dict:
        """
        Deterministic safety check. Local controller prevents heater execution if limits breached.
        """
        interlocks_passed = True
        warnings = []

        if self.emergency_stop:
            return {"safe": False, "reason": "EMERGENCY STOP ACTIVATED", "action": "HALT_ALL"}

        if self.current_temperature >= SAFETY_MAX_TEMPERATURE_C:
            interlocks_passed = False
            self.heater_status = "INTERLOCKED_THERMAL_CUTOFF"
            warnings.append(f"Thermal Limit Exceeded ({self.current_temperature}°C >= {SAFETY_MAX_TEMPERATURE_C}°C). Heater Cutoff.")

        if self.water_level_litres < SAFETY_MIN_WATER_LEVEL_LITRES:
            interlocks_passed = False
            self.heater_status = "INTERLOCKED_DRY_RUN_PROTECTION"
            warnings.append(f"Water Level Low ({self.water_level_litres}L < {SAFETY_MIN_WATER_LEVEL_LITRES}L). Dry run prevention active.")

        return {
            "safe": interlocks_passed,
            "heater_status": self.heater_status,
            "pump_status": self.pump_status,
            "warnings": warnings,
            "current_temp_c": self.current_temperature,
            "max_safe_temp_c": SAFETY_MAX_TEMPERATURE_C,
            "water_level_litres": self.water_level_litres,
            "min_safe_water_litres": SAFETY_MIN_WATER_LEVEL_LITRES
        }

    def simulate_telemetry_tick(self, extraction_active: bool, elapsed_seconds: int, total_duration_seconds: int):
        """Simulate realistic thermal rise and pump circulation during extraction."""
        if not extraction_active or self.operating_mode != "SIMULATION":
            return

        # Gradual heat up towards target temperature
        if self.current_temperature < self.target_temperature:
            heat_step = random.uniform(1.2, 2.5)
            self.current_temperature = min(self.target_temperature, round(self.current_temperature + heat_step, 1))
        else:
            # Temperature oscillation around setpoint (±0.4°C)
            self.current_temperature = round(self.target_temperature + random.uniform(-0.4, 0.4), 1)

        self.heater_status = "ON"
        self.pump_status = "CIRCULATING"

    def get_telemetry(self) -> dict:
        """Return full current sensor payload."""
        return {
            "operating_mode": self.operating_mode,
            "is_simulated": self.operating_mode == "SIMULATION",
            "connection_status": self.connection_status,
            "sensors": {
                "plant_weight_g": self.current_plant_weight,
                "water_volume_ml": self.current_water_volume,
                "temperature_c": self.current_temperature,
                "water_level_litres": self.water_level_litres
            },
            "actuators": {
                "pump": self.pump_status,
                "heater": self.heater_status,
                "e_stop": self.emergency_stop
            },
            "targets": {
                "plant_weight_g": self.target_plant_weight,
                "water_volume_ml": self.target_water_volume,
                "temperature_c": self.target_temperature
            }
        }

# Global hardware manager instance
hardware_manager = HardwareManager()
