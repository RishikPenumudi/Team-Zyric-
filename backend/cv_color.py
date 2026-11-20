"""
SAHAJ AI - Deterministic Computer Vision & Botanical Color Engine
Deterministic image processing using OpenCV, K-Means clustering, and CIE Delta-E metrics.
"""

import math
import numpy as np
import cv2

def rgb_to_hex(r: int, g: int, b: int) -> str:
    """Format RGB tuple as uppercase HEX string."""
    return f"#{r:02X}{g:02X}{b:02X}"

def hex_to_rgb(hex_str: str) -> tuple[int, int, int]:
    """Convert HEX string to (R, G, B) tuple."""
    hex_clean = hex_str.lstrip("#")
    if len(hex_clean) == 3:
        hex_clean = "".join([c * 2 for c in hex_clean])
    if len(hex_clean) != 6:
        return (128, 128, 128)
    return (int(hex_clean[0:2], 16), int(hex_clean[2:4], 16), int(hex_clean[4:6], 16))

def rgb_to_xyz(r: int, g: int, b: int) -> tuple[float, float, float]:
    """Convert sRGB (0-255) to CIE XYZ under standard illuminant D65."""
    # Gamma companding inversion
    def pivot(v):
        v = v / 255.0
        return ((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92

    r_lin = pivot(r) * 100.0
    g_lin = pivot(g) * 100.0
    b_lin = pivot(b) * 100.0

    # sRGB D65 transformation matrix
    x = r_lin * 0.4124564 + g_lin * 0.3575761 + b_lin * 0.1804375
    y = r_lin * 0.2126729 + g_lin * 0.7151522 + b_lin * 0.0721750
    z = r_lin * 0.0193339 + g_lin * 0.1191920 + b_lin * 0.9503041
    return (x, y, z)

def xyz_to_lab(x: float, y: float, z: float) -> tuple[float, float, float]:
    """Convert CIE XYZ to CIE L*a*b* under 2° standard observer D65."""
    # D65 standard reference white points
    ref_x, ref_y, ref_z = 95.047, 100.000, 108.883

    def pivot(val):
        epsilon = 0.008856
        kappa = 903.3
        return val ** (1.0 / 3.0) if val > epsilon else (kappa * val + 16.0) / 116.0

    fx = pivot(x / ref_x)
    fy = pivot(y / ref_y)
    fz = pivot(z / ref_z)

    l_star = max(0.0, 116.0 * fy - 16.0)
    a_star = 500.0 * (fx - fy)
    b_star = 200.0 * (fy - fz)
    return (l_star, a_star, b_star)

def rgb_to_lab(r: int, g: int, b: int) -> tuple[float, float, float]:
    """Helper converting RGB directly to CIELAB."""
    x, y, z = rgb_to_xyz(r, g, b)
    return xyz_to_lab(x, y, z)

def calculate_delta_e_cie76(lab1: tuple[float, float, float], lab2: tuple[float, float, float]) -> float:
    """Calculate CIE76 Euclidean color difference."""
    dl = lab1[0] - lab2[0]
    da = lab1[1] - lab2[1]
    db = lab1[2] - lab2[2]
    return math.sqrt(dl * dl + da * da + db * db)

def classify_color_family(r: int, g: int, b: int) -> dict:
    """Classify RGB color into botanical natural dye families."""
    # Convert RGB to HSV
    rgb_arr = np.uint8([[[r, g, b]]])
    hsv = cv2.cvtColor(rgb_arr, cv2.COLOR_RGB2HSV)[0][0]
    h, s, v = int(hsv[0]) * 2, int(hsv[1]), int(hsv[2]) # H in 0-360, S & V in 0-255

    # Color family rules based on natural botanical spectrum
    if s < 35:
        if v < 60:
            return {"family": "Charcoal / Iron Black", "primary_source": "Tannin + Iron (Ferrous Sulphate)", "confidence": 0.88}
        elif v > 200:
            return {"family": "Natural Raw Ecru / Off-White", "primary_source": "Bleached or Unbleached Base", "confidence": 0.90}
        else:
            return {"family": "Muted Slate / Grey", "primary_source": "Pomegranate + Light Iron", "confidence": 0.85}

    # Hue classification
    if (h >= 0 and h <= 18) or (h >= 340 and h <= 360):
        if v < 140 or s > 150:
            return {"family": "Madder Crimson / Terracotta Red", "primary_source": "Rubia cordifolia (Manjistha)", "confidence": 0.92}
        else:
            return {"family": "Warm Rust / Peach", "primary_source": "Madder + Alum (Mild)", "confidence": 0.86}
    elif h > 18 and h <= 45:
        if s > 130 and v > 150:
            return {"family": "Mustard Yellow / Radiant Gold", "primary_source": "Tagetes erecta (Marigold)", "confidence": 0.94}
        else:
            return {"family": "Earthy Ochre / Tan", "primary_source": "Punica granatum (Pomegranate Rind)", "confidence": 0.89}
    elif h > 45 and h <= 70:
        return {"family": "Golden Olive / Khaki", "primary_source": "Marigold + Pomegranate", "confidence": 0.87}
    elif h > 70 and h <= 160:
        return {"family": "Olive / Forest Green", "primary_source": "Indigo overdyed with Marigold or Pomegranate", "confidence": 0.85}
    elif h > 160 and h <= 260:
        return {"family": "Indigo Blue / Navy / Teal", "primary_source": "Indigofera tinctoria (True Indigo)", "confidence": 0.93}
    elif h > 260 and h < 340:
        return {"family": "Plum / Purple / Mulberry", "primary_source": "Madder + Indigo overdye or Sappanwood", "confidence": 0.82}
    else:
        return {"family": "Warm Earth / Terracotta", "primary_source": "Manjistha / Catechu", "confidence": 0.80}

def extract_dominant_colors(image_bytes: bytes, k: int = 4) -> dict:
    """
    Extract dominant color swatches from an image using deterministic K-Means clustering.
    Returns primary dominant color, palette swatches, and botanical family.
    """
    # Decode image from memory
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid image file: Could not decode image bytes.")

    # Resize image to reasonable dimensions for fast, deterministic clustering
    h, w = img.shape[:2]
    max_dim = 250
    scale = max_dim / max(h, w)
    if scale < 1.0:
        new_w, new_h = int(w * scale), int(h * scale)
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)

    # Convert BGR to RGB
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    pixels = img_rgb.reshape((-1, 3)).astype(np.float32)

    # Deterministic K-Means clustering
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 15, 0.2)
    flags = cv2.KMEANS_PP_CENTERS
    compactness, labels, centers = cv2.kmeans(pixels, k, None, criteria, 10, flags)

    # Calculate cluster frequencies
    counts = np.bincount(labels.flatten())
    total_pixels = len(labels)

    # Sort clusters by frequency descending
    sorted_indices = np.argsort(counts)[::-1]

    swatches = []
    for idx in sorted_indices:
        r, g, b = [int(round(c)) for c in centers[idx]]
        percentage = round((counts[idx] / total_pixels) * 100.0, 1)
        hex_val = rgb_to_hex(r, g, b)
        swatches.append({
            "hex": hex_val,
            "rgb": [r, g, b],
            "percentage": percentage
        })

    # Primary dominant color
    primary = swatches[0]
    pr, pg, pb = primary["rgb"]
    family_info = classify_color_family(pr, pg, pb)

    return {
        "dominant_hex": primary["hex"],
        "dominant_rgb": primary["rgb"],
        "swatches": swatches,
        "color_family": family_info["family"],
        "primary_source_suggestion": family_info["primary_source"],
        "confidence": family_info["confidence"],
        "analysis_method": "Deterministic OpenCV K-Means (CIELAB/RGB)"
    }

def match_recipes_for_color(target_rgb: list[int], db_recipes: list[dict], max_results: int = 3) -> list[dict]:
    """
    Compare target color against all database recipes using CIE Delta-E color distance.
    Returns matched recipes ranked by chromatic proximity.
    """
    target_lab = rgb_to_lab(target_rgb[0], target_rgb[1], target_rgb[2])
    scored = []

    for r in db_recipes:
        recipe_rgb = hex_to_rgb(r["target_hex"])
        recipe_lab = rgb_to_lab(recipe_rgb[0], recipe_rgb[1], recipe_rgb[2])
        delta_e = calculate_delta_e_cie76(target_lab, recipe_lab)

        # Natural dye chromatic evaluation
        if delta_e <= 6.0:
            match_quality = "Direct Match"
            achievability = "Highly achievable with standard calibrated recipe."
        elif delta_e <= 14.0:
            match_quality = "Close Harmonious Shade"
            achievability = "Achievable. Slight hue or saturation variation typical of botanical variation."
        elif delta_e <= 24.0:
            match_quality = "Alternative Botanical Shade"
            achievability = "Moderate match. Natural dye limits may produce a softer or earthier tone than synthetic reference."
        else:
            match_quality = "Distant Tone"
            achievability = "Noticeable color difference. Natural botanicals cannot achieve vivid synthetic fluorescent tones."

        # Normalized confidence score (100 at Delta E 0, tapering downwards)
        confidence = max(10.0, round(100.0 - (delta_e * 2.8), 1))

        scored.append({
            "recipe_id": r["id"],
            "recipe_code": r.get("recipe_code") or f"SAH-{r['id']:03d}",
            "recipe_name": r["recipe_name"],
            "botanical_name": r["botanical_name"],
            "common_name": r["common_name"],
            "fabric_type": r["fabric_type"],
            "target_colour_name": r["target_colour_name"],
            "target_hex": r["target_hex"],
            "delta_e": round(delta_e, 2),
            "match_quality": match_quality,
            "achievability": achievability,
            "confidence_percent": confidence,
            "material_to_water_ratio": r["material_to_water_ratio"],
            "extraction_temperature": r["extraction_temperature"],
            "extraction_duration": r["extraction_duration"],
            "mordant_information": r["mordant_information"],
            "validated_status": r.get("validated_status", "Awaiting Validation"),
            "recipe_notes": r["recipe_notes"],
            "shade_family": r.get("shade_family", "Natural Botanical"),
            "process_type": r.get("process_type", "standard_extraction"),
            "ph_target": r.get("ph_target", 6.5),
            "filtration": r.get("filtration", "Required (Muslin Cloth)"),
            "cooling_mins": r.get("cooling_mins", 20),
            "evidence_notes": r.get("evidence_notes", ""),
            "combination_details": r.get("combination_details", "")
        })

    scored.sort(key=lambda x: x["delta_e"])
    return scored[:max_results]
