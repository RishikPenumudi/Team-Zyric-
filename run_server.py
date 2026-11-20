"""
SAHAJ AI - Server Runner
"""

import sys
import uvicorn
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.config import HOST, PORT

if __name__ == "__main__":
    print(f"==================================================")
    print(f" SAHAJ AI — Heritage Artisan Natural Dyeing System")
    print(f" Server starting on http://{HOST}:{PORT}")
    print(f"==================================================")
    uvicorn.run("backend.app:app", host=HOST, port=PORT, log_level="info")
