"""
SAHAJ AI - Intelligent Raw Material & Water Measurement API Routes
Module 02: Deterministic recipe scaling, hardware sensor readings, and tolerance validation.
"""

from starlette.requests import Request
from starlette.responses import JSONResponse
from backend.database import get_connection
from backend.hardware import hardware_manager

async def calculate_measurements(request: Request) -> JSONResponse:
    """
    POST /api/measurements/calculate
    Calculate required botanical plant material (g) and water input (ml) for the selected recipe.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    recipe_id = body.get("recipe_id")
    if not recipe_id:
        return JSONResponse({"error": "recipe_id is required"}, status_code=400)

    fabric_weight = float(body.get("fabric_weight", 200.0)) # default 200g fabric
    desired_dye_ml = body.get("desired_dye_ml")

    conn = get_connection()
    recipe = conn.execute("""
        SELECT r.*, b.botanical_name, b.common_name, b.material_type
        FROM dye_recipes r
        JOIN botanical_materials b ON r.botanical_material_id = b.id
        WHERE r.id = ?
    """, (recipe_id,)).fetchone()
    conn.close()

    if not recipe:
        return JSONResponse({"error": f"Recipe {recipe_id} not found"}, status_code=404)

    recipe_dict = dict(recipe)
    # Ratio: e.g. 0.10 means 10g plant per 100ml water (1:10)
    ratio = float(recipe_dict["material_to_water_ratio"])

    # Standard natural dyeing liquor ratio: 1:20 (1g fabric needs 20ml dye liquor)
    # Or calculate from desired_dye_ml if explicitly provided
    if desired_dye_ml:
        target_water_ml = float(desired_dye_ml)
        # Account for ~15% retention so output matches desired volume
        required_water_input_ml = round(target_water_ml / 0.85, 1)
        target_plant_weight_g = round(required_water_input_ml * ratio, 1)
    else:
        # Based on fabric weight: 200g fabric -> 4000ml water or scaled batch
        # For standard SAHAJ bench batch: 1000ml to 2000ml standard run
        # Dye liquor volume = fabric_weight * 10 ml
        required_water_input_ml = max(800.0, round(fabric_weight * 5.0, 1))
        target_plant_weight_g = round(required_water_input_ml * ratio, 1)

    # Set setpoints in hardware manager
    hardware_manager.set_targets(
        plant_weight_g=target_plant_weight_g,
        water_volume_ml=required_water_input_ml,
        target_temp_c=float(recipe_dict["extraction_temperature"])
    )

    # Automatically fetch current hardware reading (live or simulated)
    telemetry = hardware_manager.get_telemetry()
    validation = hardware_manager.validate_measurements()

    return JSONResponse({
        "status": "success",
        "recipe": recipe_dict,
        "calculation": {
            "fabric_weight_g": fabric_weight,
            "target_plant_weight_g": target_plant_weight_g,
            "target_water_input_ml": required_water_input_ml,
            "material_to_water_ratio": f"1:{round(1.0/ratio, 1)}" if ratio > 0 else "1:10",
            "extraction_temperature_c": recipe_dict["extraction_temperature"],
            "extraction_duration_mins": recipe_dict["extraction_duration"],
            "liquor_ratio_applied": "1:5 extraction, 1:20 dyeing"
        },
        "sensor_state": telemetry,
        "validation": validation
    })

async def validate_measurements(request: Request) -> JSONResponse:
    """
    POST /api/measurements/validate
    Compare actual hardware readings against target recipe requirements.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    actual_plant_wt = body.get("actual_plant_weight")
    actual_water_vol = body.get("actual_water_volume")

    # If operator manually adjusts or updates reading
    if actual_plant_wt is not None or actual_water_vol is not None:
        hardware_manager.update_sensor_readings(
            plant_weight=float(actual_plant_wt) if actual_plant_wt is not None else None,
            water_volume=float(actual_water_vol) if actual_water_vol is not None else None
        )

    validation_result = hardware_manager.validate_measurements()
    interlocks = hardware_manager.check_safety_interlocks()

    return JSONResponse({
        "status": "success",
        "validation": validation_result,
        "safety_interlocks": interlocks,
        "can_begin_extraction": validation_result["can_proceed"] and interlocks["safe"]
    })
