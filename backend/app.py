"""
SAHAJ AI - Core Application Entry & Routing
High-performance ASGI server with Starlette, full CORS support, and static asset streaming.
"""

import os
from pathlib import Path
from starlette.applications import Starlette
from starlette.routing import Route, Mount
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from starlette.responses import FileResponse, JSONResponse
from starlette.requests import Request

from backend.routes.colour import analyse_colour
from backend.routes.botanicals import get_botanicals, get_recipes, recommend_recipe, get_recipe_by_id, create_recipe, update_recipe, delete_recipe
from backend.routes.measurements import calculate_measurements, validate_measurements
from backend.routes.yield_api import predict_yield, compare_yield, get_yield_history
from backend.routes.process import get_process_status, start_process, tick_process, complete_process, reset_process
from backend.routes.dyeing import validate_dyeing, start_dyeing, complete_dyeing
from backend.routes.batches import create_batch, get_batches, get_batch_by_id
from backend.routes.assistant import chat_assistant
from backend.routes.system import get_system_status, set_hardware_mode, set_sensor_override, update_api_key, compare_quality

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

async def index_page(request: Request):
    """Serve single-page application entry point."""
    index_file = FRONTEND_DIR / "index.html"
    if not index_file.exists():
        return JSONResponse({"status": "error", "message": "Frontend index.html not found"}, status_code=404)
    return FileResponse(str(index_file))

routes = [
    # Colour Intelligence
    Route("/api/colour/analyse", analyse_colour, methods=["POST"]),

    # Botanicals & Recipes
    Route("/api/botanicals", get_botanicals, methods=["GET"]),
    Route("/api/recipes", get_recipes, methods=["GET"]),
    Route("/api/recipes", create_recipe, methods=["POST"]),
    Route("/api/recipes/{id:int}", get_recipe_by_id, methods=["GET"]),
    Route("/api/recipes/{id:int}", update_recipe, methods=["PUT"]),
    Route("/api/recipes/{id:int}", delete_recipe, methods=["DELETE"]),
    Route("/api/recipes/recommend", recommend_recipe, methods=["POST"]),

    # Measurement & Hardware Sensors
    Route("/api/measurements/calculate", calculate_measurements, methods=["POST"]),
    Route("/api/measurements/validate", validate_measurements, methods=["POST"]),

    # Yield Intelligence & Error ML
    Route("/api/yield/predict", predict_yield, methods=["POST"]),
    Route("/api/yield/compare", compare_yield, methods=["POST"]),
    Route("/api/yield/history", get_yield_history, methods=["GET"]),

    # Process Monitoring & State Machine
    Route("/api/process/status", get_process_status, methods=["GET"]),
    Route("/api/process/start", start_process, methods=["POST"]),
    Route("/api/process/tick", tick_process, methods=["POST"]),
    Route("/api/process/complete", complete_process, methods=["POST"]),
    Route("/api/process/reset", reset_process, methods=["POST"]),

    # Fabric Dyeing Workflow
    Route("/api/dyeing/validate", validate_dyeing, methods=["POST"]),
    Route("/api/dyeing/start", start_dyeing, methods=["POST"]),
    Route("/api/dyeing/complete", complete_dyeing, methods=["POST"]),

    # Batch Intelligence & History
    Route("/api/batches", create_batch, methods=["POST"]),
    Route("/api/batches", get_batches, methods=["GET"]),
    Route("/api/batches/{id}", get_batch_by_id, methods=["GET"]),

    # AI Artisan Assistant (Gemini)
    Route("/api/assistant/chat", chat_assistant, methods=["POST"]),

    # System, Hardware Modes & Quality
    Route("/api/system/status", get_system_status, methods=["GET"]),
    Route("/api/system/hardware-mode", set_hardware_mode, methods=["POST"]),
    Route("/api/system/sensor-override", set_sensor_override, methods=["POST"]),
    Route("/api/system/api-key", update_api_key, methods=["POST"]),
    Route("/api/quality/compare", compare_quality, methods=["POST"]),

    # Frontend Assets
    Route("/", index_page, methods=["GET"]),
    Mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static"),
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )
]

app = Starlette(debug=True, routes=routes, middleware=middleware)
