"""
SAHAJ AI - System Configuration
Smart Automated Heritage Artisan Natural Dyeing System
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = BASE_DIR / "uploads"
DB_PATH = DATA_DIR / "sahaj.db"

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Server Config
HOST = os.getenv("SAHAJ_HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", os.getenv("SAHAJ_PORT", "8000")))
DEBUG = os.getenv("SAHAJ_DEBUG", "True").lower() in ("true", "1", "yes")

# Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

# Hardware & Simulation
DEFAULT_HARDWARE_MODE = os.getenv("SAHAJ_HARDWARE_MODE", "SIMULATION")  # "SIMULATION" or "LIVE"

# Maximum file upload size: 10MB
MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# Safety Limits (Hardware Interlocks)
SAFETY_MAX_TEMPERATURE_C = 95.0
SAFETY_MIN_WATER_LEVEL_LITRES = 0.5
SAFETY_MAX_EXTRACTION_TIME_MINS = 180
MEASUREMENT_TOLERANCE_PERCENT = 5.0
