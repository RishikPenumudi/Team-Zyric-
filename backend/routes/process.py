"""
SAHAJ AI - Extraction Process Monitoring & Control State Machine
Module 04: Real-time process monitoring, deterministic safety enforcement, and extraction completion.
"""

import time
from datetime import datetime
from starlette.requests import Request
from starlette.responses import JSONResponse
from backend.hardware import hardware_manager
from backend.database import get_connection

class ProcessStateMachine:
    """
    Manages the lifecycle of an active natural dye extraction batch.
    Strictly prevents physical machine operations without safety validation.
    """

    def __init__(self):
        self.active_batch_id = None
        self.batch_number = None
        self.recipe_id = 1
        self.process_status = "Awaiting Inputs"
        self.extraction_duration_mins = 45
        self.target_temperature = 85.0
        self.elapsed_seconds = 0
        self.is_running = False
        self.start_timestamp = None
        self.collected_dye_output_ml = 0.0

    def get_status(self) -> dict:
        telemetry = hardware_manager.get_telemetry()
        interlocks = hardware_manager.check_safety_interlocks()

        total_seconds = self.extraction_duration_mins * 60
        progress_pct = min(100.0, round((self.elapsed_seconds / total_seconds) * 100.0, 1)) if total_seconds > 0 else 0.0

        return {
            "batch_id": self.active_batch_id,
            "batch_number": self.batch_number,
            "recipe_id": self.recipe_id,
            "process_status": self.process_status,
            "is_running": self.is_running,
            "elapsed_seconds": self.elapsed_seconds,
            "total_duration_seconds": total_seconds,
            "progress_percent": progress_pct,
            "collected_dye_output_ml": self.collected_dye_output_ml,
            "telemetry": telemetry,
            "safety": interlocks,
            "operating_mode": hardware_manager.operating_mode,
            "is_simulated": hardware_manager.operating_mode == "SIMULATION"
        }

    def start_extraction(self, batch_id: int, duration_mins: int, target_temp: float) -> dict:
        # Check measurement tolerance
        val = hardware_manager.validate_measurements()
        if not val["can_proceed"]:
            self.process_status = "Process Attention Required"
            return {
                "success": False,
                "error": f"Cannot start extraction: {val['status_text']}. Inputs must be within ±5% tolerance."
            }

        # Check safety interlocks
        interlocks = hardware_manager.check_safety_interlocks()
        if not interlocks["safe"]:
            self.process_status = "Process Attention Required"
            return {
                "success": False,
                "error": f"Safety Interlock Block: {', '.join(interlocks['warnings'])}"
            }

        self.active_batch_id = batch_id
        self.extraction_duration_mins = duration_mins
        self.target_temperature = target_temp
        self.elapsed_seconds = 0
        self.is_running = True
        self.process_status = "Extraction In Progress"
        self.start_timestamp = datetime.utcnow().isoformat()

        # Update hardware actuator state
        hardware_manager.heater_status = "ON"
        hardware_manager.pump_status = "CIRCULATING"

        # Update DB batch status
        conn = get_connection()
        conn.execute("""
            UPDATE production_batches
            SET process_status = 'Extraction In Progress', actual_temperature = ?, extraction_duration = ?
            WHERE id = ?
        """, (hardware_manager.current_temperature, duration_mins, batch_id))
        conn.commit()
        conn.close()

        return {"success": True, "process_status": self.process_status}

    def tick(self, seconds_increment: int = 15):
        if not self.is_running:
            return

        self.elapsed_seconds += seconds_increment
        total_seconds = self.extraction_duration_mins * 60

        # Simulate hardware telemetry if in simulation mode
        hardware_manager.simulate_telemetry_tick(self.is_running, self.elapsed_seconds, total_seconds)

        if self.elapsed_seconds >= total_seconds:
            self.is_running = False
            self.process_status = "Extraction Completed"
            hardware_manager.heater_status = "OFF"
            hardware_manager.pump_status = "OFF"

            # Auto-calculate collected dye estimate in simulation mode
            if hardware_manager.operating_mode == "SIMULATION":
                # Typical extraction yield ~85% of input water
                est = round(hardware_manager.target_water_volume * 0.86, 1)
                self.collected_dye_output_ml = est

            # Update DB
            if self.active_batch_id:
                conn = get_connection()
                conn.execute("""
                    UPDATE production_batches
                    SET process_status = 'Extraction Completed', actual_temperature = ?
                    WHERE id = ?
                """, (hardware_manager.current_temperature, self.active_batch_id))
                conn.commit()
                conn.close()

    def complete_extraction(self, actual_dye_volume_ml: float = None) -> dict:
        self.is_running = False
        self.process_status = "Extraction Completed"
        hardware_manager.heater_status = "OFF"
        hardware_manager.pump_status = "OFF"

        if actual_dye_volume_ml is not None:
            self.collected_dye_output_ml = float(actual_dye_volume_ml)

        return {"success": True, "process_status": self.process_status, "collected_dye_ml": self.collected_dye_output_ml}

    def reset(self):
        self.active_batch_id = None
        self.batch_number = None
        self.process_status = "Awaiting Inputs"
        self.is_running = False
        self.elapsed_seconds = 0
        self.collected_dye_output_ml = 0.0
        hardware_manager.heater_status = "OFF"
        hardware_manager.pump_status = "OFF"

# Global singleton state machine
process_engine = ProcessStateMachine()

async def get_process_status(request: Request) -> JSONResponse:
    """GET /api/process/status"""
    return JSONResponse({"status": "success", "process": process_engine.get_status()})

async def start_process(request: Request) -> JSONResponse:
    """POST /api/process/start"""
    try:
        body = await request.json()
    except Exception:
        body = {}

    batch_id = body.get("batch_id")
    duration = int(body.get("duration", 45))
    target_temp = float(body.get("temperature", 85.0))

    if not batch_id:
        # Create a new batch automatically if not existing
        from backend.routes.batches import create_new_batch_record
        batch = create_new_batch_record(recipe_id=body.get("recipe_id", 1))
        batch_id = batch["id"]

    result = process_engine.start_extraction(batch_id, duration, target_temp)
    if not result["success"]:
        return JSONResponse({"status": "error", "message": result["error"]}, status_code=400)

    return JSONResponse({"status": "success", "process": process_engine.get_status()})

async def tick_process(request: Request) -> JSONResponse:
    """POST /api/process/tick - Advance process timer / simulation step"""
    try:
        body = await request.json()
    except Exception:
        body = {}

    sec = int(body.get("seconds", 30))
    fast_forward = body.get("fast_forward", False)

    if fast_forward:
        # Advance directly to completion for demonstration efficiency
        total = process_engine.extraction_duration_mins * 60
        process_engine.elapsed_seconds = total - 1
        process_engine.tick(seconds_increment=1)
    else:
        process_engine.tick(seconds_increment=sec)

    return JSONResponse({"status": "success", "process": process_engine.get_status()})

async def complete_process(request: Request) -> JSONResponse:
    """POST /api/process/complete - Finalize extraction"""
    try:
        body = await request.json()
    except Exception:
        body = {}

    actual_vol = body.get("actual_dye_volume_ml")
    res = process_engine.complete_extraction(actual_vol)
    return JSONResponse({"status": "success", "result": res, "process": process_engine.get_status()})

async def reset_process(request: Request) -> JSONResponse:
    """POST /api/process/reset"""
    process_engine.reset()
    return JSONResponse({"status": "success", "message": "Machine reset to Awaiting Inputs", "process": process_engine.get_status()})
