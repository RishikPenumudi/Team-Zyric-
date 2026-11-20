# SAHAJ AI
## Smart Automated Heritage Artisan Natural Dyeing System

> **Tagline:** Intelligence for Natural Dyeing. Technology for Traditional Artisans.  
> **Category:** Cleantech | AI | Sustainable Textile Technology | Natural Dye Production | IoT

---

## 1. Product Vision & Architecture

**SAHAJ AI** is an intelligent natural dye production and textile dyeing platform that unites botanical colour intelligence, automated material measurement, predictive dye-yield analysis, and sensor-assisted process management.

Natural dye production has traditionally been manual, experience-dependent, and prone to batch inconsistencies. SAHAJ AI transforms this ancient craft into a measurable, repeatable, and scientific industrial workflow while preserving traditional botanical heritage.

### The 4 Connected Core Modules

```
┌─────────────────────────┐       ┌─────────────────────────┐
│       MODULE 01         │       │       MODULE 02         │
│  AI Colour Intelligence │ ───>  │   Smart Measurement     │
│  Multimodal CV & ΔE     │       │   Load Cell & Water     │
└─────────────────────────┘       └─────────────────────────┘
             │                                 │
             ▼                                 ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│       MODULE 03         │       │       MODULE 04         │
│  Yield Intelligence     │ <───  │   Extraction & Dyeing   │
│  ML Prediction & Errors │       │   Thermal & Interlocks  │
└─────────────────────────┘       └─────────────────────────┘
```

### The 20 Core Botanical Recipes & Shade Families

SAHAJ AI's recipe library is built around **20 natural-dye shade recipes** spanning single-botanical extracts, chemical modifiers (iron saddening, citric acid shift), and sequential combinations:

| Code | Recipe Name | Botanical Source | Process Type | Target Shade | Starting Status |
|---|---|---|---|---|---|
| **SAH-001** | Marigold – Sun Yellow | *Tagetes spp.* (Dried Petals) | Standard Extraction (85°C) | Sun Yellow (`#F59E0B`) | Awaiting Validation |
| **SAH-002** | Marigold + Iron – Olive Gold | *Tagetes* + 1.5% FeSO4 | Iron Saddening Modifier | Olive Gold (`#656626`) | Awaiting Validation |
| **SAH-003** | Turmeric – Bright Yellow | *Curcuma longa* | Standard Extraction (75°C) | Bright Yellow (`#FBBF24`)| Awaiting Validation |
| **SAH-004** | Turmeric + Iron – Mustard | *Curcuma longa* + 1% Iron | Iron Saddening Modifier | Mustard Khaki (`#A88219`) | Awaiting Validation |
| **SAH-005** | Onion Skin – Copper Gold | *Allium cepa* (Dry Skins) | Standard Extraction (85°C) | Copper Gold (`#D97706`) | Awaiting Validation |
| **SAH-006** | Madder – Terracotta | *Rubia cordifolia / tinctorum* | Low-Temp Extraction (68°C) | Terracotta (`#B45309`) | Awaiting Validation |
| **SAH-007** | Madder – Rose Pink | *Rubia cordifolia* (Light) | Low-Temp Extraction (65°C) | Rose Pink (`#DB7093`) | Awaiting Validation |
| **SAH-008** | Hibiscus – Dusty Mauve | *Hibiscus sabdariffa* | Standard Extraction (70°C) | Dusty Mauve (`#9D6B7A`) | Awaiting Validation |
| **SAH-009** | Red Cabbage + Acid – Pink | *Brassica oleracea* + Citric | Acid pH 3.2 Shift | Vibrant Pink (`#E05284`) | Awaiting Validation |
| **SAH-010** | Madder + Iron – Rust Brown | *Rubia* + 2% FeSO4 | Iron Saddening Modifier | Rust Brown (`#7C2D12`) | Awaiting Validation |
| **SAH-011** | Red Cabbage – Lavender | *Brassica oleracea* | Neutral Extraction (70°C) | Lavender (`#8B7BA8`) | Awaiting Validation |
| **SAH-012** | Red Cabbage – Violet | *Brassica oleracea* + Base | Alkaline pH 8.0 Shift | Royal Violet (`#6B46C1`) | Awaiting Validation |
| **SAH-013** | Indigo – Sky Blue | *Indigofera tinctoria* | Reduced Vat (No Boil, 50°C)| Sky Blue (`#38BDF8`) | Awaiting Validation |
| **SAH-014** | Indigo – Deep Navy | *Indigofera tinctoria* | Reduced Vat (5-6 Dips) | Deep Navy (`#1E3A8A`) | Awaiting Validation |
| **SAH-015** | Indigo + Turmeric – Teal Green| *Indigofera* + *Curcuma* | Sequential Overdyeing | Teal Green (`#0D9488`) | Awaiting Validation |
| **SAH-016** | Pomegranate Rind – Sand Beige | *Punica granatum* (Rinds) | Standard Extraction (85°C) | Sand Beige (`#D4B996`) | Awaiting Validation |
| **SAH-017** | Pomegranate + Iron – Charcoal | *Punica* + 2.5% FeSO4 | Ferro-Tannate Modifier | Charcoal Grey (`#374151`)| Awaiting Validation |
| **SAH-018** | Black Tea – Warm Brown | *Camellia sinensis* | High-Temp Extraction (92°C)| Warm Brown (`#854D0E`) | Awaiting Validation |
| **SAH-019** | Coffee – Cocoa Brown | *Coffea arabica* (Spent) | Upcycled Extraction (85°C) | Cocoa Brown (`#6F4E37`) | Awaiting Validation |
| **SAH-020** | Eucalyptus – Peach / Rust | *Eucalyptus globulus* | Standard Extraction (85°C) | Peach Rust (`#D97757`) | Awaiting Validation |

*Note: In accordance with natural dyeing standards, all 20 entries are marked "Awaiting Validation" as initial experimental starting points until validated by physical SAHAJ machine runs.*
2. **Module 02 — Smart Raw Material & Water Measurement:** Deterministic recipe calculations for plant material (grams) and water volume (ml). Interfaces with digital scales (HX711) and water meters with a ±5% recipe tolerance lockout.
3. **Module 03 — AI Dye-Yield Prediction & Error Analysis:** Physics-informed mass transfer regression model that accounts for biomass absorption loss and thermal evaporation. Computes absolute and percentage yield error to continuously recalibrate future batches.
4. **Module 04 — Extraction Control & Fabric Dyeing:** Real-time thermal agitation monitoring with deterministic safety interlocks (heater cutoff at 95°C, dry run lockout below 0.5L). Guides fabric immersion, liquor ratio validation, and final batch completion.

### Additional Intelligence Layers

- **SAHAJ AI Artisan Assistant:** Conversational domain-grounded assistant powered by Google Gemini with full multilingual support for English, Telugu (తెలుగు), and Hindi (हिंदी).
- **Batch Intelligence Ledger:** Historical production record persistence, side-by-side batch variance diagnostics, and JSON/CSV data export.
- **Colour Quality Analysis (Section 3.C):** Post-dyeing quality assessment comparing dyed fabric against reference swatches using CIE Delta-E spectrophotometric classification.

---

## 2. Technology Stack

- **AI & Multimodal Understanding:** Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`) via structured REST payloads, paired with a deterministic OpenCV K-Means & CIELAB heritage fallback engine.
- **Backend:** Python, Starlette ASGI, Uvicorn, SQLite relational database (PostgreSQL / AlloyDB compatible schema).
- **Machine Learning:** NumPy-based Physics-Informed Ordinary Least Squares & Ridge Polynomial Regression for dye-yield mass-balance prediction.
- **Computer Vision:** OpenCV (`cv2`), NumPy, CIE 1976 / 1994 Delta-E colour difference metrics.
- **Frontend:** Responsive Single-Page Application (SPA) designed with a natural botanical palette (warm ivory, deep forest green, natural mustard, terracotta, charcoal), Chart.js telemetry charts, and operator controls.
- **Deployment:** Google Cloud Run containerized deployment via Docker.

---

## 3. Database Schema

The relational database is automatically initialized and migrated on application startup (`data/sahaj.db`):

- `botanical_materials`: Catalog of natural dye plants (Tagetes erecta, Indigofera tinctoria, Rubia cordifolia, Punica granatum).
- `dye_recipes`: Validated laboratory extraction parameters, material-to-water ratios, extraction temperatures, durations, and mordant chemistry.
- `production_batches`: Production runs tracking batch ID, target shade, plant weight, water volume, operating mode, and process states.
- `batch_results`: Predicted yield, actual collected dye output, absolute error (ml), percentage error (%), and quality notes.
- `sensor_readings`: Time-series sensor logs (load cell, water flow meter, temperature probe).
- `users`: Artisan roles and preferred language settings.

---

## 4. Local Execution & Quick Start

### Prerequisites
- Python 3.10+ (Standard Python runtime)

### Installation

```bash
# Clone or navigate to the project directory
cd sahaj-ai

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (optional)
cp .env.example .env
```

### Starting the Server

```bash
python run_server.py
```

The application will start on:
👉 **`http://localhost:8000`**

Open `http://localhost:8000` in your web browser to access the complete SAHAJ AI dashboard.

---

## 5. Automated 14-Step Workflow Demonstration

The application supports the exact 14-step workflow mandated in Section 11 of the master specification:

1. **Step 1 & 2:** User uploads reference image or selects mustard-yellow (#D49B28). AI extracts dominant HEX/RGB and classifies the botanical colour family.
2. **Step 3:** Recipe engine matches Marigold Artisan Mustard Yellow (Tagetes erecta) with Delta E = 0.0.
3. **Step 4:** System calculates target plant weight (100.0g) and target water volume (1000ml) for a 200g fabric batch at a 1:10 ratio.
4. **Step 5:** Scale and water flow sensors confirm actual charge (100.5g plant, 1010ml water), validating within the ±5% recipe tolerance.
5. **Step 6 & 7:** Extraction begins in simulated/live mode. Vessel reaches 85.0°C setpoint while pump circulates. Timer progresses to completion.
6. **Step 8:** Physics-informed ML regression predicts expected yield (852.7 ml), accounting for 150.8 ml biomass retention loss and 27.4 ml thermal evaporation.
7. **Step 9 & 10:** Operator records actual collected dye output (865.0 ml). Absolute error (12.3 ml) and percentage error (1.44%) are calculated, confirming "Exceptional Accuracy (<3% Error)".
8. **Step 11 & 12:** Fabric dyeing validation confirms sufficient dye liquor for 200g cotton. Guided checklist ensures proper scouring and Alum pre-mordanting. Dyeing cycle completes.
9. **Step 13 & 14:** Batch `BAT-2026-007` is stored into the production database and viewable in historical ledgers and side-by-side comparison tools.

You can trigger this entire sequence in **1 click** inside the web interface by clicking the **"Run 14-Step Demo"** button on the top header bar, or by running the automated integration test:

```bash
python tests/test_api_workflow.py
```

---

## 6. Running Test Suites

SAHAJ AI includes four modular test suites covering all mathematical, physical, and API components:

```bash
# 1. Computer Vision & CIE Delta-E Color Tests
python tests/test_cv_color.py

# 2. Machine Learning Yield Prediction & Error Tests
python tests/test_ml_yield.py

# 3. Smart Measurement, Load Cell & Safety Interlock Tests
python tests/test_measurement.py

# 4. Full 14-Step End-to-End Workflow Integration Test
python tests/test_api_workflow.py
```

---

## 7. Google Cloud Run Deployment

To deploy SAHAJ AI to Google Cloud Run:

```bash
# Set Google Cloud Project
gcloud config set project [YOUR_PROJECT_ID]

# Build and submit the container image to Google Artifact Registry / Cloud Build
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/sahaj-ai:latest

# Deploy to Cloud Run
gcloud run deploy sahaj-ai \
    --image gcr.io/[YOUR_PROJECT_ID]/sahaj-ai:latest \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 8080 \
    --set-env-vars GEMINI_API_KEY=[YOUR_GEMINI_API_KEY],SAHAJ_HARDWARE_MODE=SIMULATION
```

---

## 8. REST API Documentation

| Endpoint | Method | Description |
|---|---|---|
| `/api/colour/analyse` | POST | Accepts multipart image or JSON HEX code. Returns dominant color, RGB, and matched recipes. |
| `/api/botanicals` | GET | Lists all registered natural botanical sources. |
| `/api/recipes` | GET | Lists recipes filterable by botanical source and substrate fiber. |
| `/api/recipes/recommend` | POST | Recommends optimal recipe based on target colour and fabric type. |
| `/api/measurements/calculate`| POST | Calculates required plant material (g) and water input (ml). |
| `/api/measurements/validate` | POST | Compares scale/flow readings against target limits (±5% tolerance). |
| `/api/yield/predict` | POST | Predicts dye output volume (ml) using physics-informed Ridge regression. |
| `/api/yield/compare` | POST | Compares actual vs predicted output, computes errors, and recalibrates ML model. |
| `/api/yield/history` | GET | Retrieves historical yield records for trend analysis. |
| `/api/process/status` | GET | Retrieves current state machine status, active batch, and hardware telemetry. |
| `/api/process/start` | POST | Validates tolerances and begins extraction cycle. |
| `/api/process/tick` | POST | Advances extraction time and generates simulation telemetry. |
| `/api/process/complete` | POST | Finalizes extraction run and stores collected volume. |
| `/api/dyeing/validate` | POST | Checks dye volume sufficiency against fabric liquor ratio. |
| `/api/dyeing/start` | POST | Confirms fabric immersion and activates dyeing state. |
| `/api/dyeing/complete` | POST | Completes batch and updates status to `Dyeing Completed`. |
| `/api/batches` | GET/POST | Create new batches and retrieve production ledger. |
| `/api/batches/{id}` | GET | Returns single batch record with time-series sensor data. |
| `/api/assistant/chat` | POST | Conversational AI assistant supporting English, Telugu, and Hindi. |
| `/api/quality/compare` | POST | Section 3.C: Compares dyed fabric against target reference via CIE Delta-E. |
| `/api/system/hardware-mode` | POST | Switches between `SIMULATION` and `LIVE` hardware modes. |

---

## 9. Feature Implementation Status Matrix

| Feature / Subsystem | Implementation Status | Notes |
|---|---|---|
| **Module 01: Colour Studio** | **Fully Working** | Multimodal upload + interactive color picker + OpenCV K-Means + CIE Delta-E recipe ranking. |
| **Module 02: Smart Measurement** | **Fully Working** | Deterministic recipe ratios, HX711 load cell telemetry, ±5% tolerance locks. |
| **Module 03: Yield Intelligence** | **Fully Working** | Physics-informed Ridge regression, biomass retention modeling, dynamic database recalibration. |
| **Module 04: Extraction & Dyeing** | **Fully Working** | 12 distinct process states, thermal agitation, hardware safety interlocks (95°C limit). |
| **Gemini Multimodal Vision** | **Fully Working + Fallback**| Direct Google Generative Language API integration with automatic deterministic CV fallback. |
| **Artisan Assistant** | **Fully Working** | Conversational chat with domain grounding and multilingual support (English, Telugu, Hindi). |
| **Batch Intelligence & Ledger** | **Fully Working** | Full database persistence, 2-batch side-by-side comparison modal, JSON export. |
| **Colour Quality (Section 3.C)** | **Fully Working** | Spectrophotometric CIE Delta-E evaluation with commercial grade assessment. |
| **Hardware Gateway** | **Fully Working + Simulated**| Seamless toggle between Live Hardware Mode (COM3/TCP) and realistic Simulation Mode. |
| **Cloud Run Deployment** | **Ready** | Fully containerized with production Dockerfile and Cloud Run documentation. |

---

## 10. Safety Governance

In accordance with strict cleantech and industrial safety standards:
- **AI NEVER directly controls safety-critical hardware.**
- Thermal limits (95.0°C maximum cutoff) and dry-run safety interlocks (0.5L minimum level) are enforced deterministically by the hardware abstraction layer.
- If cloud connectivity or external AI APIs fail, local safety controls and deterministic recipe extraction continue without disruption.
