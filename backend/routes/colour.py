"""
SAHAJ AI - Colour Intelligence API Routes
Module 01: Reference image understanding, deterministic CV, and botanical recipe matching.
"""

import json
from starlette.requests import Request
from starlette.responses import JSONResponse
from backend.cv_color import hex_to_rgb, extract_dominant_colors, match_recipes_for_color
from backend.ai_engine import analyze_image_with_gemini
from backend.database import get_connection

async def analyse_colour(request: Request) -> JSONResponse:
    """
    POST /api/colour/analyse
    Accepts reference image (multipart/form-data) OR JSON with hex_code / rgb values.
    Returns dominant colour, HEX/RGB, natural colour family, and matched botanical recipes.
    """
    content_type = request.headers.get("content-type", "")
    target_fabric = "cotton"
    desired_quantity = 1000.0 # ml or fabric grams

    # Case A: Multipart form image upload
    if "multipart/form-data" in content_type:
        form = await request.form()
        image_field = form.get("image")
        target_fabric = form.get("fabric_type", "cotton")
        try:
            desired_quantity = float(form.get("quantity", 1000.0))
        except (ValueError, TypeError):
            desired_quantity = 1000.0

        if not image_field:
            return JSONResponse({"error": "No image file provided in multipart upload."}, status_code=400)

        image_bytes = await image_field.read()
        mime_type = getattr(image_field, "content_type", "image/jpeg")

        analysis = analyze_image_with_gemini(image_bytes, mime_type, target_fabric)
        target_rgb = analysis["dominant_rgb"]

    # Case B: JSON payload with hex_code or rgb
    else:
        try:
            body = await request.json()
        except Exception:
            body = {}

        target_hex = body.get("hex_code", "#D49B28")
        target_fabric = body.get("fabric_type", "cotton")
        try:
            desired_quantity = float(body.get("quantity", 1000.0))
        except (ValueError, TypeError):
            desired_quantity = 1000.0

        target_rgb = hex_to_rgb(target_hex)
        from backend.cv_color import classify_color_family
        family_info = classify_color_family(target_rgb[0], target_rgb[1], target_rgb[2])

        analysis = {
            "source": "direct_colour_selection",
            "gemini_active": False,
            "status_note": "Direct colour input analyzed with CIELAB color matching",
            "dominant_hex": target_hex.upper(),
            "dominant_rgb": list(target_rgb),
            "color_family": family_info["family"],
            "swatches": [{"hex": target_hex.upper(), "rgb": list(target_rgb), "percentage": 100.0}],
            "botanical_suggestion": family_info["primary_source"],
            "artisan_assessment": f"Directly selected {family_info['family']}. Recommended botanical candidate: {family_info['primary_source']}.",
            "achievability_limits": "Natural dye shade varies by harvest quality and fabric pre-treatment.",
            "confidence": family_info["confidence"]
        }

    # Query all active database recipes matching target fabric
    conn = get_connection()
    recipes_query = """
    SELECT r.*, b.botanical_name, b.common_name, b.material_type, b.natural_colour_family
    FROM dye_recipes r
    JOIN botanical_materials b ON r.botanical_material_id = b.id
    WHERE (r.fabric_type LIKE ? OR ? = 'all')
    """
    rows = conn.execute(recipes_query, (f"%{target_fabric}%", target_fabric)).fetchall()
    conn.close()

    db_recipes = [dict(r) for r in rows]
    # If no recipes specifically matched the target fabric, retrieve all
    if not db_recipes:
        conn = get_connection()
        db_recipes = [dict(r) for r in conn.execute("""
            SELECT r.*, b.botanical_name, b.common_name, b.material_type, b.natural_colour_family
            FROM dye_recipes r
            JOIN botanical_materials b ON r.botanical_material_id = b.id
        """).fetchall()]
        conn.close()

    matched_recipes = match_recipes_for_color(target_rgb, db_recipes, max_results=4)

    return JSONResponse({
        "status": "success",
        "analysis": analysis,
        "matched_recipes": matched_recipes,
        "parameters": {
            "target_fabric": target_fabric,
            "desired_quantity": desired_quantity
        }
    })
