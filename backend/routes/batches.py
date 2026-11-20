"""
SAHAJ AI - Production Batch Intelligence API Routes
Manages persistent production runs, batch history, comparisons, and export records.
"""

from datetime import datetime
from starlette.requests import Request
from starlette.responses import JSONResponse
from backend.database import get_connection
from backend.hardware import hardware_manager

def create_new_batch_record(recipe_id: int, plant_weight: float = None, water_quantity: float = None) -> dict:
    """Helper to initialize a new batch in DB."""
    conn = get_connection()
    now = datetime.utcnow().isoformat()
    count_row = conn.execute("SELECT COUNT(*) as c FROM production_batches").fetchone()
    batch_num = f"BAT-2026-{(count_row['c'] + 1):03d}"

    recipe = conn.execute("SELECT * FROM dye_recipes WHERE id = ?", (recipe_id,)).fetchone()
    target_colour = recipe["target_hex"] if recipe else "#D49B28"

    pw = plant_weight if plant_weight is not None else hardware_manager.current_plant_weight
    wq = water_quantity if water_quantity is not None else hardware_manager.current_water_volume
    if pw <= 0:
        pw = 100.0
    if wq <= 0:
        wq = 1000.0

    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO production_batches (
        batch_number, recipe_id, target_colour, plant_weight, water_quantity,
        actual_temperature, extraction_duration, operating_mode, created_at, process_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Ready for Extraction')
    """, (batch_num, recipe_id, target_colour, pw, wq,
          hardware_manager.current_temperature, recipe["extraction_duration"] if recipe else 45,
          hardware_manager.operating_mode, now))

    batch_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "id": batch_id,
        "batch_number": batch_num,
        "recipe_id": recipe_id,
        "created_at": now,
        "process_status": "Ready for Extraction"
    }

async def create_batch(request: Request) -> JSONResponse:
    """POST /api/batches - Initialize a new production batch"""
    try:
        body = await request.json()
    except Exception:
        body = {}

    recipe_id = int(body.get("recipe_id", 1))
    plant_weight = float(body.get("plant_weight", 0.0))
    water_quantity = float(body.get("water_quantity", 0.0))

    batch = create_new_batch_record(recipe_id, plant_weight, water_quantity)
    return JSONResponse({"status": "success", "batch": batch})

async def get_batches(request: Request) -> JSONResponse:
    """GET /api/batches - Retrieve production batch history"""
    botanical_id = request.query_params.get("botanical_id")
    status = request.query_params.get("status")

    query = """
    SELECT b.*, r.recipe_name, r.target_colour_name, r.target_hex, r.fabric_type,
           m.botanical_name, m.common_name, m.natural_colour_family,
           br.predicted_output, br.actual_output, br.absolute_error, br.percentage_error, br.colour_strength
    FROM production_batches b
    JOIN dye_recipes r ON b.recipe_id = r.id
    JOIN botanical_materials m ON r.botanical_material_id = m.id
    LEFT JOIN batch_results br ON b.id = br.batch_id
    WHERE 1=1
    """
    params = []

    if botanical_id:
        query += " AND m.id = ?"
        params.append(botanical_id)
    if status:
        query += " AND b.process_status = ?"
        params.append(status)

    query += " ORDER BY b.id DESC"

    conn = get_connection()
    rows = conn.execute(query, tuple(params)).fetchall()
    conn.close()

    batches = [dict(r) for r in rows]
    return JSONResponse({"status": "success", "count": len(batches), "batches": batches})

async def get_batch_by_id(request: Request) -> JSONResponse:
    """GET /api/batches/{id} - Retrieve single batch record with sensor telemetry"""
    batch_id = request.path_params.get("id")

    conn = get_connection()
    batch = conn.execute("""
        SELECT b.*, r.recipe_name, r.target_colour_name, r.target_hex, r.fabric_type,
               r.material_to_water_ratio, r.extraction_temperature, r.extraction_duration as planned_duration,
               r.mordant_information, r.dyeing_parameters,
               m.botanical_name, m.common_name, m.material_type, m.natural_colour_family,
               br.predicted_output, br.actual_output, br.absolute_error, br.percentage_error,
               br.colour_strength, br.result_notes, br.completed_at
        FROM production_batches b
        JOIN dye_recipes r ON b.recipe_id = r.id
        JOIN botanical_materials m ON r.botanical_material_id = m.id
        LEFT JOIN batch_results br ON b.id = br.batch_id
        WHERE b.id = ?
    """, (batch_id,)).fetchone()

    if not batch:
        conn.close()
        return JSONResponse({"error": "Batch not found"}, status_code=404)

    # Fetch sensor readings
    sensors = conn.execute("""
        SELECT * FROM sensor_readings WHERE batch_id = ? ORDER BY id ASC
    """, (batch_id,)).fetchall()
    conn.close()

    return JSONResponse({
        "status": "success",
        "batch": dict(batch),
        "sensor_readings": [dict(s) for s in sensors]
    })
