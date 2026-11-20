"""
SAHAJ AI - Intelligent Fabric Dyeing Workflow API Routes
Module 04: Guided fabric addition, liquor ratio validation, mordant guidance, and final batch completion.
"""

import json
from datetime import datetime
from starlette.requests import Request
from starlette.responses import JSONResponse
from backend.database import get_connection
from backend.routes.process import process_engine

async def validate_dyeing(request: Request) -> JSONResponse:
    """
    POST /api/dyeing/validate
    Validate available dye volume against selected fabric weight and liquor ratio.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    batch_id = body.get("batch_id") or process_engine.active_batch_id
    fabric_type = body.get("fabric_type", "cotton")
    fabric_weight = float(body.get("fabric_weight", 200.0)) # grams

    conn = get_connection()
    batch = None
    if batch_id:
        batch = conn.execute("""
            SELECT b.*, r.recipe_name, r.mordant_information, r.dyeing_parameters, r.target_colour_name, r.target_hex
            FROM production_batches b
            JOIN dye_recipes r ON b.recipe_id = r.id
            WHERE b.id = ?
        """, (batch_id,)).fetchone()

    # Determine available dye volume
    available_dye_ml = process_engine.collected_dye_output_ml
    if available_dye_ml <= 0 and batch:
        # Check batch_results table
        res = conn.execute("SELECT actual_output FROM batch_results WHERE batch_id = ?", (batch_id,)).fetchone()
        if res and res["actual_output"]:
            available_dye_ml = float(res["actual_output"])
        else:
            # Baseline estimate from water quantity
            available_dye_ml = float(batch["water_quantity"]) * 0.85

    conn.close()

    # Required liquor ratio:
    # Cotton: 1:20 (20ml liquor per gram fabric, or minimum bath depth)
    # Silk: 1:25
    # Wool: 1:25
    ratio_multiplier = 20.0 if fabric_type == "cotton" else 25.0
    # Minimum liquor required for smooth fabric immersion
    required_dye_ml = round(fabric_weight * ratio_multiplier, 1)

    # In compact bench runs, concentration is higher so 1:5 - 1:10 liquor ratios are also used
    effective_minimum_bath_ml = round(fabric_weight * 4.0, 1)

    is_sufficient = available_dye_ml >= effective_minimum_bath_ml

    if is_sufficient:
        process_engine.process_status = "Ready for Fabric Dyeing"
        status_note = "Sufficient natural dye extract available for fabric load."
    else:
        process_engine.process_status = "Insufficient Dye Quantity"
        status_note = f"Available dye ({available_dye_ml} ml) is less than required minimum ({effective_minimum_bath_ml} ml) for {fabric_weight}g fabric."

    # Parse mordant and dyeing parameters from recipe
    mordant_info = {}
    dyeing_params = {}
    if batch:
        try:
            mordant_info = json.loads(batch["mordant_information"])
        except Exception:
            mordant_info = {"mordant": batch["mordant_information"]}
        try:
            dyeing_params = json.loads(batch["dyeing_parameters"])
        except Exception:
            dyeing_params = {"params": batch["dyeing_parameters"]}

    return JSONResponse({
        "status": "success",
        "process_status": process_engine.process_status,
        "is_sufficient": is_sufficient,
        "status_note": status_note,
        "available_dye_ml": available_dye_ml,
        "fabric_weight_g": fabric_weight,
        "fabric_type": fabric_type,
        "target_liquor_ratio": f"1:{int(ratio_multiplier)}",
        "recommended_liquor_ml": required_dye_ml,
        "mordant_guidance": mordant_info,
        "dyeing_parameters": dyeing_params
    })

async def start_dyeing(request: Request) -> JSONResponse:
    """
    POST /api/dyeing/start
    Operator confirms fabric addition into the dye bath.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    batch_id = body.get("batch_id") or process_engine.active_batch_id
    fabric_weight = float(body.get("fabric_weight", 200.0))

    process_engine.process_status = "Dyeing In Progress"

    if batch_id:
        conn = get_connection()
        conn.execute("""
            UPDATE production_batches
            SET process_status = 'Dyeing In Progress', fabric_weight = ?
            WHERE id = ?
        """, (fabric_weight, batch_id))
        conn.commit()
        conn.close()

    return JSONResponse({
        "status": "success",
        "process_status": process_engine.process_status,
        "message": "Fabric addition confirmed. Dyeing cycle active."
    })

async def complete_dyeing(request: Request) -> JSONResponse:
    """
    POST /api/dyeing/complete
    Finalize fabric dyeing run and save complete batch record.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    batch_id = body.get("batch_id") or process_engine.active_batch_id
    now = datetime.utcnow().isoformat()

    process_engine.process_status = "Dyeing Completed"

    if batch_id:
        conn = get_connection()
        conn.execute("""
            UPDATE production_batches
            SET process_status = 'Dyeing Completed'
            WHERE id = ?
        """, (batch_id,))
        conn.commit()
        conn.close()

    return JSONResponse({
        "status": "success",
        "process_status": process_engine.process_status,
        "completed_at": now,
        "batch_id": batch_id,
        "message": "Production batch dyeing completed successfully!"
    })
