"""
Unit Tests for Module 01: Computer Vision & CIE Delta-E Color Engine
"""

import sys
from pathlib import Path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

import cv2
import numpy as np
from backend.cv_color import (
    rgb_to_hex,
    hex_to_rgb,
    rgb_to_lab,
    calculate_delta_e_cie76,
    classify_color_family,
    extract_dominant_colors,
    match_recipes_for_color
)

def test_hex_rgb_conversion():
    hex_val = "#D49B28"
    rgb = hex_to_rgb(hex_val)
    assert rgb == (212, 155, 40), f"Expected (212, 155, 40), got {rgb}"
    assert rgb_to_hex(rgb[0], rgb[1], rgb[2]) == "#D49B28"
    print("✓ test_hex_rgb_conversion passed")

def test_delta_e_identical():
    lab1 = rgb_to_lab(212, 155, 40)
    lab2 = rgb_to_lab(212, 155, 40)
    delta_e = calculate_delta_e_cie76(lab1, lab2)
    assert delta_e == 0.0, f"Expected 0.0, got {delta_e}"
    print("✓ test_delta_e_identical passed")

def test_color_classification():
    mustard = classify_color_family(212, 155, 40)
    assert "Mustard" in mustard["family"] or "Gold" in mustard["family"]

    indigo = classify_color_family(30, 58, 138)
    assert "Indigo" in indigo["family"] or "Blue" in indigo["family"]
    print("✓ test_color_classification passed")

def test_kmeans_extraction():
    img = np.full((80, 80, 3), (40, 155, 212), dtype=np.uint8) # BGR for Mustard #D49B28
    _, enc = cv2.imencode(".png", img)
    res = extract_dominant_colors(enc.tobytes(), k=3)
    assert res["dominant_hex"] == "#D49B28"
    assert len(res["swatches"]) == 3
    print("✓ test_kmeans_extraction passed")

if __name__ == "__main__":
    test_hex_rgb_conversion()
    test_delta_e_identical()
    test_color_classification()
    test_kmeans_extraction()
    print("All CV & Color tests passed successfully!")
