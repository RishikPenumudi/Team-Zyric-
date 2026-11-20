"""
SAHAJ AI - AI Dye-Yield Prediction & Error Analysis API Routes
Module 03: Physics-informed ML yield prediction, error calculation, and historical comparisons.
"""

from datetime import datetime
from starlette.requests import Request
from starlette.responses import JSONResponse
from backend.ml_yield import yield_predictor, calculate_yield_error
from backend.database import get_connection

async def predict_yield(request: Request) -> JSONResponse:
    """
    POST /api/yield/predict
    Predict expected dye output volume (ml) using calibrated regression model.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    plant_weight = float(body.get("plant_weight", 100.0))
    water_quantity = float(body.get("water_quantity", 1000.0))
    temperature = float(body.get("temperature", 85.0))
    duration = float(body.get("duration", 45.0))
    botanical_id = int(body.get("botanical_id", 1))

    prediction = yield_predictor.predict(
        plant_weight=plant_weight,
        water_ml=water_quantity,
        temp_c=temperature,
        duration_mins=duration,
        botanical_id=botanical_id
    )

    return JSONResponse({
        "status": "success",
        "prediction": prediction
    })

async def compare_yield(request: Request) -> JSONResponse:
    """
    POST /api/yield/compare
    Compare actual collected dye against predicted output and calculate errors.
    Persists batch result into database and triggers dynamic model recalibration.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    batch_id = body.get("batch_id")
    actual_output = float(body.get("actual_output", 0.0))
    predicted_output = float(body.get("predicted_output", 0.0))
    notes = body.get("notes", "Operator batch collection")

    error_calc = calculate_yield_error(actual_output, predicted_output)
    now = datetime.utcnow().isoformat()

    conn = get_connection()
    if batch_id:
        # Check if record exists
        existing = conn.execute("SELECT id FROM batch_results WHERE batch_id = ?", (batch_id,)).fetchone()
        if existing:
            conn.execute("""
            UPDATE batch_results
            SET actual_output = ?, predicted_output = ?, absolute_error = ?, percentage_error = ?,
                result_notes = ?, completed_at = ?
            WHERE batch_id = ?
            """, (actual_output, predicted_output, error_calc["absolute_error_ml"],
                  error_calc["percentage_error"], notes, now, batch_id))
        else:
            conn.execute("""
            INSERT INTO batch_results (batch_id, predicted_output, actual_output, absolute_error,
                                       percentage_error, colour_strength, result_notes, completed_at)
            VALUES (?, ?, ?, ?, ?, 'Standard', ?, ?)
            """, (batch_id, predicted_output, actual_output, error_calc["absolute_error_ml"],
                  error_calc["percentage_error"], notes, now))

        # Update batch status
        conn.execute("""
        UPDATE production_batches
        SET process_status = 'Yield Analysis Completed'
        WHERE id = ?
        """, (batch_id,))

        conn.commit()

    conn.close()

    # Recalibrate ML model with new batch data
    yield_predictor.train_from_db()

    return JSONResponse({
        "status": "success",
        "error_analysis": error_calc,
        "model_recalibrated": True,
        "batch_id": batch_id
    })

async def get_yield_history(request: Request) -> JSONResponse:
    """
    GET /api/yield/history
    Retrieve historical batches and yield comparison metrics for interactive visualization.
    """
    conn = get_connection()
    query = """
    SELECT b.id, b.batch_number, b.created_at, b.plant_weight, b.water_quantity,
           b.actual_temperature, b.extraction_duration, b.process_status,
           r.recipe_name, r.target_colour_name, r.target_hex,
           m.common_name, m.natural_colour_family,
           br.predicted_output, br.actual_output, br.absolute_error, br.percentage_error
    FROM production_batches b
    JOIN dye_recipes r ON b.recipe_id = r.id
    JOIN botanical_materials m ON r.botanical_material_id = m.id
    LEFT JOIN batch_results br ON b.id = br.batch_id
    ORDER BY b.id DESC
    LIMIT 20
    """
    rows = conn.execute(query).fetchall()
    conn.close()

    history = [dict(r) for r in rows]
    return JSONResponse({
        "status": "success",
        "count": len(history),
        "history": history
    })
