"""
SAHAJ AI - Botanical Knowledge & Recipe Library API Routes
Provides verified natural dye recipes, botanical material specs, recommendations, and full recipe CRUD with audit history.
"""

import json
from datetime import datetime
from starlette.requests import Request
from starlette.responses import JSONResponse
from backend.database import get_connection
from backend.cv_color import hex_to_rgb, match_recipes_for_color

async def get_botanicals(request: Request) -> JSONResponse:
    """
    GET /api/botanicals
    Retrieve all registered botanical plant materials.
    """
    conn = get_connection()
    rows = conn.execute("""
        SELECT b.*, COUNT(r.id) as recipes_count
        FROM botanical_materials b
        LEFT JOIN dye_recipes r ON b.id = r.botanical_material_id
        GROUP BY b.id
        ORDER BY b.id ASC
    """).fetchall()
    conn.close()

    botanicals = [dict(r) for r in rows]
    return JSONResponse({"status": "success", "count": len(botanicals), "botanicals": botanicals})

async def get_recipes(request: Request) -> JSONResponse:
    """
    GET /api/recipes
    Retrieve recipes with optional query params: botanical_id, fabric_type, shade_family, process_type, validated_status, search.
    """
    botanical_id = request.query_params.get("botanical_id")
    fabric_type = request.query_params.get("fabric_type")
    shade_family = request.query_params.get("shade_family")
    process_type = request.query_params.get("process_type")
    validated_status = request.query_params.get("validated_status")
    search = request.query_params.get("search")

    query = """
    SELECT r.*, b.botanical_name, b.common_name, b.material_type, b.natural_colour_family, b.description as botanical_desc
    FROM dye_recipes r
    JOIN botanical_materials b ON r.botanical_material_id = b.id
    WHERE 1=1
    """
    params = []

    if botanical_id and botanical_id != "all":
        query += " AND r.botanical_material_id = ?"
        params.append(botanical_id)
    if fabric_type and fabric_type != "all":
        query += " AND (r.fabric_type LIKE ? OR r.fabric_type LIKE '%all%')"
        params.append(f"%{fabric_type}%")
    if shade_family and shade_family != "all":
        query += " AND r.shade_family = ?"
        params.append(shade_family)
    if process_type and process_type != "all":
        query += " AND r.process_type = ?"
        params.append(process_type)
    if validated_status and validated_status != "all":
        query += " AND r.validated_status = ?"
        params.append(validated_status)
    if search:
        query += " AND (r.recipe_name LIKE ? OR r.recipe_code LIKE ? OR r.target_colour_name LIKE ? OR b.common_name LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term, term])

    query += " ORDER BY r.id ASC"

    conn = get_connection()
    rows = conn.execute(query, tuple(params)).fetchall()
    conn.close()

    recipes = [dict(r) for r in rows]
    return JSONResponse({"status": "success", "count": len(recipes), "recipes": recipes})

async def get_recipe_by_id(request: Request) -> JSONResponse:
    """
    GET /api/recipes/{id}
    Retrieve detailed single recipe with version audit trail and linked production batches.
    """
    recipe_id = request.path_params.get("id")
    conn = get_connection()

    recipe_row = conn.execute("""
        SELECT r.*, b.botanical_name, b.common_name, b.material_type, b.natural_colour_family, b.description as botanical_desc
        FROM dye_recipes r
        JOIN botanical_materials b ON r.botanical_material_id = b.id
        WHERE r.id = ?
    """, (recipe_id,)).fetchone()

    if not recipe_row:
        conn.close()
        return JSONResponse({"error": f"Recipe {recipe_id} not found"}, status_code=404)

    # Fetch version history
    versions = conn.execute("""
        SELECT * FROM recipe_versions WHERE recipe_id = ? ORDER BY version_number DESC
    """, (recipe_id,)).fetchall()

    # Fetch linked batches
    batches = conn.execute("""
        SELECT id, batch_number, created_at, process_status, plant_weight, water_quantity
        FROM production_batches
        WHERE recipe_id = ?
        ORDER BY id DESC LIMIT 5
    """, (recipe_id,)).fetchall()

    conn.close()

    return JSONResponse({
        "status": "success",
        "recipe": dict(recipe_row),
        "versions": [dict(v) for v in versions],
        "linked_batches": [dict(b) for b in batches]
    })

async def create_recipe(request: Request) -> JSONResponse:
    """
    POST /api/recipes
    Add a new recipe record into the SAHAJ library.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    name = body.get("recipe_name", "").strip()
    if not name:
        return JSONResponse({"error": "recipe_name is required"}, status_code=400)

    botanical_id = int(body.get("botanical_material_id", 1))
    fabric_type = body.get("fabric_type", "cotton, silk, wool")
    target_colour_name = body.get("target_colour_name", "Natural Botanical Shade")
    target_hex = body.get("target_hex", "#D49B28").upper()
    ratio = float(body.get("material_to_water_ratio", 0.05))
    temp = float(body.get("extraction_temperature", 85.0))
    duration = int(body.get("extraction_duration", 60))
    mordant = body.get("mordant_information", json.dumps({"type": "Alum", "percentage": "12% WOF"}))
    dyeing_params = body.get("dyeing_parameters", json.dumps({"dyeing_temp_c": 75.0, "dyeing_time_mins": 45, "liquor_ratio": "1:20"}))
    status = body.get("validated_status", "Awaiting Validation")
    notes = body.get("recipe_notes", "Artisan customized natural dye recipe.")
    shade_family = body.get("shade_family", "Yellow, Gold & Orange")
    process_type = body.get("process_type", "standard_extraction")
    ph_target = float(body.get("ph_target", 6.5))
    filtration = body.get("filtration", "Required (Muslin Cloth)")
    cooling_mins = int(body.get("cooling_mins", 20))
    dye_temp = float(body.get("dyeing_temperature", 75.0))
    dye_dur = int(body.get("dyeing_duration", 45))
    evidence = body.get("evidence_notes", "Custom experimental protocol.")
    combo = body.get("combination_details", "")

    now = datetime.utcnow().isoformat()
    conn = get_connection()
    cursor = conn.cursor()

    # Generate custom code
    count_row = cursor.execute("SELECT COUNT(*) as c FROM dye_recipes").fetchone()
    code = body.get("recipe_code") or f"SAH-{(count_row['c'] + 1):03d}"

    cursor.execute("""
    INSERT INTO dye_recipes (
        recipe_code, recipe_name, botanical_material_id, fabric_type, target_colour_name, target_hex,
        material_to_water_ratio, extraction_temperature, extraction_duration, mordant_information,
        dyeing_parameters, validated_status, recipe_notes, shade_family, process_type, ph_target,
        filtration, cooling_mins, dyeing_temperature, dyeing_duration, evidence_notes, combination_details
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        code, name, botanical_id, fabric_type, target_colour_name, target_hex,
        ratio, temp, duration, mordant, dyeing_params, status, notes,
        shade_family, process_type, ph_target, filtration, cooling_mins,
        dye_temp, dye_dur, evidence, combo
    ))
    new_id = cursor.lastrowid

    # Create initial version 1 audit
    cursor.execute("""
    INSERT INTO recipe_versions (recipe_id, version_number, recipe_name, parameters_json, changed_by, changed_at, change_summary)
    VALUES (?, 1, ?, ?, 'Master Artisan', ?, 'Recipe created in SAHAJ library')
    """, (new_id, name, json.dumps(body), now))

    conn.commit()
    conn.close()

    return JSONResponse({"status": "success", "id": new_id, "recipe_code": code, "message": "Recipe created successfully."})

async def update_recipe(request: Request) -> JSONResponse:
    """
    PUT /api/recipes/{id}
    Update recipe parameters, manage version audit trail, and track validation status.
    """
    recipe_id = request.path_params.get("id")
    try:
        body = await request.json()
    except Exception:
        body = {}

    conn = get_connection()
    cursor = conn.cursor()

    existing = cursor.execute("SELECT * FROM dye_recipes WHERE id = ?", (recipe_id,)).fetchone()
    if not existing:
        conn.close()
        return JSONResponse({"error": f"Recipe {recipe_id} not found"}, status_code=404)

    # Determine next version number
    v_row = cursor.execute("SELECT MAX(version_number) as v FROM recipe_versions WHERE recipe_id = ?", (recipe_id,)).fetchone()
    next_ver = (v_row["v"] or 1) + 1
    now = datetime.utcnow().isoformat()
    change_summary = body.get("change_summary", "Updated extraction and dyeing parameters")

    name = body.get("recipe_name", existing["recipe_name"])
    fabric_type = body.get("fabric_type", existing["fabric_type"])
    target_colour_name = body.get("target_colour_name", existing["target_colour_name"])
    target_hex = body.get("target_hex", existing["target_hex"])
    ratio = float(body.get("material_to_water_ratio", existing["material_to_water_ratio"]))
    temp = float(body.get("extraction_temperature", existing["extraction_temperature"]))
    duration = int(body.get("extraction_duration", existing["extraction_duration"]))
    mordant = body.get("mordant_information", existing["mordant_information"])
    if isinstance(mordant, dict):
        mordant = json.dumps(mordant)
    dyeing_params = body.get("dyeing_parameters", existing["dyeing_parameters"])
    if isinstance(dyeing_params, dict):
        dyeing_params = json.dumps(dyeing_params)
    status = body.get("validated_status", existing["validated_status"])
    notes = body.get("recipe_notes", existing["recipe_notes"])
    shade_family = body.get("shade_family", existing["shade_family"])
    process_type = body.get("process_type", existing["process_type"])
    ph_target = float(body.get("ph_target", existing["ph_target"] or 6.5))
    filtration = body.get("filtration", existing["filtration"] or "Required (Muslin Cloth)")
    cooling_mins = int(body.get("cooling_mins", existing["cooling_mins"] or 20))
    dye_temp = float(body.get("dyeing_temperature", existing["dyeing_temperature"] or 75.0))
    dye_dur = int(body.get("dyeing_duration", existing["dyeing_duration"] or 45))
    evidence = body.get("evidence_notes", existing["evidence_notes"])
    combo = body.get("combination_details", existing["combination_details"])

    cursor.execute("""
    UPDATE dye_recipes
    SET recipe_name = ?, fabric_type = ?, target_colour_name = ?, target_hex = ?,
        material_to_water_ratio = ?, extraction_temperature = ?, extraction_duration = ?,
        mordant_information = ?, dyeing_parameters = ?, validated_status = ?, recipe_notes = ?,
        shade_family = ?, process_type = ?, ph_target = ?, filtration = ?, cooling_mins = ?,
        dyeing_temperature = ?, dyeing_duration = ?, evidence_notes = ?, combination_details = ?
    WHERE id = ?
    """, (
        name, fabric_type, target_colour_name, target_hex, ratio, temp, duration,
        mordant, dyeing_params, status, notes, shade_family, process_type, ph_target,
        filtration, cooling_mins, dye_temp, dye_dur, evidence, combo, recipe_id
    ))

    # Log to recipe_versions
    cursor.execute("""
    INSERT INTO recipe_versions (recipe_id, version_number, recipe_name, parameters_json, changed_by, changed_at, change_summary)
    VALUES (?, ?, ?, ?, 'Artisan Operator', ?, ?)
    """, (recipe_id, next_ver, name, json.dumps(body), now, change_summary))

    conn.commit()
    conn.close()

    return JSONResponse({
        "status": "success",
        "recipe_id": recipe_id,
        "version": next_ver,
        "message": f"Recipe updated to version {next_ver}."
    })

async def delete_recipe(request: Request) -> JSONResponse:
    """DELETE /api/recipes/{id}"""
    recipe_id = request.path_params.get("id")
    conn = get_connection()
    conn.execute("DELETE FROM dye_recipes WHERE id = ?", (recipe_id,))
    conn.commit()
    conn.close()
    return JSONResponse({"status": "success", "message": f"Recipe {recipe_id} deleted."})

async def recommend_recipe(request: Request) -> JSONResponse:
    """
    POST /api/recipes/recommend
    Interpret requirements and recommend the optimal validated/experimental recipe from all 20 shades.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    target_hex = body.get("target_hex", "#F59E0B")
    fabric_type = body.get("fabric_type", "cotton")

    conn = get_connection()
    rows = conn.execute("""
        SELECT r.*, b.botanical_name, b.common_name, b.material_type, b.natural_colour_family
        FROM dye_recipes r
        JOIN botanical_materials b ON r.botanical_material_id = b.id
    """).fetchall()
    conn.close()

    db_recipes = [dict(r) for r in rows]
    target_rgb = hex_to_rgb(target_hex)

    # Filter by fabric if matching, otherwise retain
    fabric_matches = [r for r in db_recipes if fabric_type.lower() in r["fabric_type"].lower() or "all" in r["fabric_type"].lower()]
    pool = fabric_matches if fabric_matches else db_recipes

    ranked = match_recipes_for_color(list(target_rgb), pool, max_results=4)

    return JSONResponse({
        "status": "success",
        "recommended_recipe": ranked[0] if ranked else None,
        "alternatives": ranked[1:] if len(ranked) > 1 else [],
        "fabric_type": fabric_type
    })
