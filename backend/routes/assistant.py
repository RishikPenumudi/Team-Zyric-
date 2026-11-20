"""
SAHAJ AI - Artisan Assistant API Routes
Interactive natural dye intelligence chat powered by Gemini with multilingual & domain grounding.
"""

from starlette.requests import Request
from starlette.responses import JSONResponse
from backend.ai_engine import chat_artisan_assistant

async def chat_assistant(request: Request) -> JSONResponse:
    """
    POST /api/assistant/chat
    Process domain-specific questions in English, Telugu, or Hindi.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    user_message = body.get("message", "").strip()
    if not user_message:
        return JSONResponse({"error": "Message is required"}, status_code=400)

    conversation_history = body.get("conversation_history", [])
    language = body.get("language", "en")

    result = chat_artisan_assistant(
        user_message=user_message,
        conversation_history=conversation_history,
        language=language
    )

    return JSONResponse({
        "status": "success",
        "reply": result["reply"],
        "model": result["model"],
        "mode": result["mode"]
    })
