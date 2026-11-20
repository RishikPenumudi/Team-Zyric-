"""
SAHAJ AI - System Administration, Hardware Mode & Colour Quality Analysis Routes
"""

from starlette.requests import Request
from starlette.responses import JSONResponse
import backend.config as cfg
from backend.hardware import hardware_manager
from backend.cv_color import hex_to_rgb, rgb_to_lab, calculate_delta_e_cie76, extract_dominant_colors

async def get_system_status(request: Request) -> JSONResponse:
    """GET /api/system/status"""
    from backend.ai_engine import is_gemini_available

    telemetry = hardware_manager.get_telemetry()
    interlocks = hardware_manager.check_safety_interlocks()

    return JSONResponse({
        "status": "online",
        "product_name": "SAHAJ AI",
        "full_form": "Smart Automated Heritage Artisan Natural Dyeing System",
        "tagline": "Intelligence for Natural Dyeing. Technology for Traditional Artisans.",
        "hardware_mode": hardware_manager.operating_mode,
        "is_simulated": hardware_manager.operating_mode == "SIMULATION",
        "gemini_api_configured": is_gemini_available(),
        "active_gemini_model": cfg.GEMINI_MODEL,
        "telemetry": telemetry,
        "safety_interlocks": interlocks
    })

async def set_hardware_mode(request: Request) -> JSONResponse:
    """POST /api/system/hardware-mode"""
    try:
        body = await request.json()
    except Exception:
        body = {}

    mode = body.get("mode", "SIMULATION")
    try:
        res = hardware_manager.set_operating_mode(mode)
        return JSONResponse({"status": "success", "hardware": res})
    except ValueError as e:
        return JSONResponse({"status": "error", "message": str(e)}, status_code=400)

async def set_sensor_override(request: Request) -> JSONResponse:
    """POST /api/system/sensor-override"""
    try:
        body = await request.json()
    except Exception:
        body = {}

    pw = body.get("plant_weight")
    wv = body.get("water_volume")
    temp = body.get("temperature")

    hardware_manager.update_sensor_readings(
        plant_weight=float(pw) if pw is not None else None,
        water_volume=float(wv) if wv is not None else None,
        temperature=float(temp) if temp is not None else None
    )

    return JSONResponse({
        "status": "success",
        "telemetry": hardware_manager.get_telemetry(),
        "validation": hardware_manager.validate_measurements()
    })

async def update_api_key(request: Request) -> JSONResponse:
    """POST /api/system/api-key"""
    try:
        body = await request.json()
    except Exception:
        body = {}

    key = body.get("gemini_api_key", "").strip()
    if key:
        cfg.GEMINI_API_KEY = key
        # Also re-import or update ai_engine config
        import backend.ai_engine as ai
        ai.GEMINI_API_KEY = key

    from backend.ai_engine import is_gemini_available
    return JSONResponse({
        "status": "success",
        "gemini_api_configured": is_gemini_available()
    })

async def compare_quality(request: Request) -> JSONResponse:
    """
    POST /api/quality/compare
    Section 3.C: Future Colour Quality Analysis.
    Compares dyed fabric against target colour using CIE Delta-E metrics.
    """
    content_type = request.headers.get("content-type", "")
    target_hex = "#D49B28"

    # Case A: Multipart uploaded dyed fabric photograph
    if "multipart/form-data" in content_type:
        form = await request.form()
        image_field = form.get("fabric_image")
        target_hex = form.get("target_hex", "#D49B28")

        if not image_field:
            return JSONResponse({"error": "No fabric image provided"}, status_code=400)

        image_bytes = await image_field.read()
        cv_res = extract_dominant_colors(image_bytes, k=3)
        actual_rgb = cv_res["dominant_rgb"]
        actual_hex = cv_res["dominant_hex"]
    else:
        try:
            body = await request.json()
        except Exception:
            body = {}
        target_hex = body.get("target_hex", "#D49B28")
        actual_hex = body.get("actual_hex", "#D89E30")
        actual_rgb = list(hex_to_rgb(actual_hex))

    target_rgb = hex_to_rgb(target_hex)
    target_lab = rgb_to_lab(target_rgb[0], target_rgb[1], target_rgb[2])
    actual_lab = rgb_to_lab(actual_rgb[0], actual_rgb[1], actual_rgb[2])

    delta_e = calculate_delta_e_cie76(target_lab, actual_lab)

    # Commercial textile color difference assessment
    if delta_e <= 3.0:
        commercial_grade = "Commercial Pass (Grade A)"
        artisan_assessment = "Excellent colour uniformity. Delta E <= 3.0 represents imperceptible natural dye variation."
    elif delta_e <= 6.0:
        commercial_grade = "Artisan Standard Pass (Grade B)"
        artisan_assessment = "Acceptable botanical match. Slight natural batch character typical of artisanal textiles."
    elif delta_e <= 12.0:
        commercial_grade = "Noticeable Variation (Grade C)"
        artisan_assessment = "Moderate shift. Check mordant concentration or dyeing temperature uniformity."
    else:
        commercial_grade = "Colour Out of Spec (Grade D)"
        artisan_assessment = "Significant deviation from target swatch. Re-calibration or overdyeing required."

    return JSONResponse({
        "status": "success",
        "target": {
            "hex": target_hex,
            "rgb": list(target_rgb),
            "lab": [round(c, 2) for c in target_lab]
        },
        "actual_dyed": {
            "hex": actual_hex if 'actual_hex' in locals() else f"#{actual_rgb[0]:02X}{actual_rgb[1]:02X}{actual_rgb[2]:02X}",
            "rgb": actual_rgb,
            "lab": [round(c, 2) for c in actual_lab]
        },
        "delta_e": round(delta_e, 2),
        "commercial_grade": commercial_grade,
        "artisan_assessment": artisan_assessment,
        "lighting_disclaimer": "Laboratory-calibrated CIE Delta-E assessment. Camera ambient lighting may influence photographic readings."
    })
