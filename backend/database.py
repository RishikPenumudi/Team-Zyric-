"""
SAHAJ AI - Database Architecture & Repository Layer
Compatible with SQLite (local development/MVP) and PostgreSQL/AlloyDB (Cloud Run)
Includes 20 Natural Dye Shade Recipes, Version History, and 11 Botanical Sources.
"""

import sqlite3
import json
from datetime import datetime
from pathlib import Path
from backend.config import DB_PATH

def get_connection():
    """Get a database connection with dict-like row factory and FK support."""
    conn = sqlite3.connect(str(DB_PATH), timeout=20.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    """Initialize relational database schema and run seed migrations."""
    conn = get_connection()
    cursor = conn.cursor()

    # Table 1: users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT DEFAULT 'artisan_operator',
        preferred_language TEXT DEFAULT 'en',
        created_at TEXT NOT NULL
    );
    """)

    # Table 2: botanical_materials
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS botanical_materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        botanical_name TEXT NOT NULL,
        common_name TEXT NOT NULL,
        material_type TEXT NOT NULL,
        natural_colour_family TEXT NOT NULL,
        description TEXT NOT NULL,
        image_reference TEXT,
        availability_status TEXT DEFAULT 'available'
    );
    """)

    # Table 3: dye_recipes
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dye_recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipe_code TEXT,
        recipe_name TEXT NOT NULL,
        botanical_material_id INTEGER NOT NULL,
        fabric_type TEXT NOT NULL,
        target_colour_name TEXT NOT NULL,
        target_hex TEXT NOT NULL,
        material_to_water_ratio REAL NOT NULL,
        extraction_temperature REAL NOT NULL,
        extraction_duration INTEGER NOT NULL,
        mordant_information TEXT NOT NULL,
        dyeing_parameters TEXT NOT NULL,
        validated_status TEXT DEFAULT 'Awaiting Validation',
        recipe_notes TEXT,
        shade_family TEXT,
        process_type TEXT DEFAULT 'standard_extraction',
        ph_target REAL DEFAULT 6.5,
        filtration TEXT DEFAULT 'Required (Muslin Cloth)',
        cooling_mins INTEGER DEFAULT 20,
        dyeing_temperature REAL DEFAULT 75.0,
        dyeing_duration INTEGER DEFAULT 45,
        evidence_notes TEXT,
        combination_details TEXT,
        FOREIGN KEY (botanical_material_id) REFERENCES botanical_materials(id) ON DELETE CASCADE
    );
    """)

    # Table 3B: recipe_versions (Audit & Recipe Versioning)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recipe_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipe_id INTEGER NOT NULL,
        version_number INTEGER NOT NULL,
        recipe_name TEXT NOT NULL,
        parameters_json TEXT NOT NULL,
        changed_by TEXT DEFAULT 'Heritage Artisan',
        changed_at TEXT NOT NULL,
        change_summary TEXT,
        FOREIGN KEY (recipe_id) REFERENCES dye_recipes(id) ON DELETE CASCADE
    );
    """)

    # Table 4: production_batches
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS production_batches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        batch_number TEXT UNIQUE NOT NULL,
        recipe_id INTEGER NOT NULL,
        target_colour TEXT NOT NULL,
        plant_weight REAL NOT NULL,
        water_quantity REAL NOT NULL,
        actual_temperature REAL,
        extraction_duration INTEGER,
        operating_mode TEXT DEFAULT 'SIMULATION',
        created_at TEXT NOT NULL,
        process_status TEXT NOT NULL,
        fabric_weight REAL,
        FOREIGN KEY (recipe_id) REFERENCES dye_recipes(id)
    );
    """)

    # Table 5: batch_results
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS batch_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        batch_id INTEGER UNIQUE NOT NULL,
        predicted_output REAL NOT NULL,
        actual_output REAL NOT NULL,
        absolute_error REAL NOT NULL,
        percentage_error REAL NOT NULL,
        colour_strength TEXT DEFAULT 'Standard',
        result_notes TEXT,
        completed_at TEXT NOT NULL,
        FOREIGN KEY (batch_id) REFERENCES production_batches(id) ON DELETE CASCADE
    );
    """)

    # Table 6: sensor_readings
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sensor_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        batch_id INTEGER,
        sensor_type TEXT NOT NULL,
        sensor_value REAL NOT NULL,
        unit TEXT NOT NULL,
        recorded_at TEXT NOT NULL,
        is_simulated INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (batch_id) REFERENCES production_batches(id) ON DELETE SET NULL
    );
    """)

    # Migration: check and add missing columns if upgrading an older database
    existing_recipe_cols = [r["name"] for r in cursor.execute("PRAGMA table_info(dye_recipes)").fetchall()]
    new_cols = [
        ("recipe_code", "TEXT"),
        ("shade_family", "TEXT"),
        ("process_type", "TEXT DEFAULT 'standard_extraction'"),
        ("ph_target", "REAL DEFAULT 6.5"),
        ("filtration", "TEXT DEFAULT 'Required (Muslin Cloth)'"),
        ("cooling_mins", "INTEGER DEFAULT 20"),
        ("dyeing_temperature", "REAL DEFAULT 75.0"),
        ("dyeing_duration", "INTEGER DEFAULT 45"),
        ("evidence_notes", "TEXT"),
        ("combination_details", "TEXT")
    ]
    for col_name, col_type in new_cols:
        if col_name not in existing_recipe_cols:
            cursor.execute(f"ALTER TABLE dye_recipes ADD COLUMN {col_name} {col_type};")

    # Indexes
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_recipes_botanical ON dye_recipes(botanical_material_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_recipes_code ON dye_recipes(recipe_code);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_recipes_family ON dye_recipes(shade_family);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_batches_status ON production_batches(process_status);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sensor_batch ON sensor_readings(batch_id);")

    conn.commit()
    seed_20_recipes_and_botanicals(cursor, conn)
    conn.close()

def seed_20_recipes_and_botanicals(cursor, conn):
    """Seed comprehensive 11 botanicals and 20 natural dye shade recipes."""
    now = datetime.utcnow().isoformat()

    # 1. Botanical Materials (11 species covering all 20 shades)
    botanicals_data = [
        (1, "Tagetes erecta / spp.", "Marigold (Genda)", "Dried flower petals", "Yellow, Gold & Orange",
         "High in lutein carotenoids. Produces bright sun yellows and, when modified with iron, rich olive golds.", "/static/images/marigold.jpg", "available"),
        (2, "Indigofera tinctoria", "True Indigo (Neel)", "Pre-reduced / Natural Indigo extract", "Purple, Blue & Teal",
         "Ancient substantive vat dye yielding sky blues to deep navy via chemical reduction and atmospheric oxidation.", "/static/images/indigo.jpg", "available"),
        (3, "Rubia cordifolia / tinctorum", "Indian Madder (Manjistha)", "Dried root / Ground powder", "Red, Pink & Terracotta",
         "Anthraquinone source (alizarin & purpurin) for brick terracotta, rose pinks, and rust browns. Sensitive to heat above 75°C.", "/static/images/madder.jpg", "available"),
        (4, "Punica granatum", "Pomegranate Rind (Anar Chilka)", "Dried fruit rinds", "Brown, Beige, Grey & Earthy",
         "Rich in ellagitannins. Acts as a self-mordanting sand beige dye and forms charcoal grey/black complexes with iron.", "/static/images/pomegranate.jpg", "available"),
        (5, "Curcuma longa", "Turmeric (Haldi)", "Dried ground rhizome", "Yellow, Gold & Orange",
         "Direct curcuminoid dye producing luminous brilliant yellows and warm mustard with iron. Moderate lightfastness.", "/static/images/turmeric.jpg", "available"),
        (6, "Allium cepa", "Yellow Onion Skin (Pyaz Chilka)", "Dry outer papery skins", "Yellow, Gold & Orange",
         "Rich in quercetin flavonoids. Excellent natural affinity for wool, silk, and alum-mordanted cotton for copper gold.", "/static/images/onion.jpg", "available"),
        (7, "Hibiscus sabdariffa", "Hibiscus (Gudhal / Roselle)", "Dried red calyces", "Red, Pink & Terracotta",
         "Anthocyanin-rich botanical providing soft dusty mauve and pinkish shades. Highly sensitive to extraction pH.", "/static/images/hibiscus.jpg", "available"),
        (8, "Brassica oleracea var. capitata f. rubra", "Red Cabbage", "Fresh chopped leaves", "Purple, Blue & Teal",
         "Classic indicator anthocyanins shifting dynamically with pH: vibrant pink with acid, lavender at neutral, violet with mild base.", "/static/images/cabbage.jpg", "available"),
        (9, "Camellia sinensis", "Black Tea", "Cured fermented tea leaves", "Brown, Beige, Grey & Earthy",
         "High theaflavin and tannin content. Self-mordanting dye yielding warm amber tans and rich leather browns.", "/static/images/tea.jpg", "available"),
        (10, "Coffea arabica", "Spent Coffee Grounds", "Clean brewed coffee residue", "Brown, Beige, Grey & Earthy",
         "Upcycled beverage byproduct containing caffeic and chlorogenic acids, yielding soft beige to warm cocoa brown.", "/static/images/coffee.jpg", "available"),
        (11, "Eucalyptus globulus / spp.", "Eucalyptus Leaves", "Dried aromatic leaves", "Brown, Beige, Grey & Earthy",
         "Cineole and tannin-rich foliage imparting delicate peach, cinnamon rust, and warm terracotta tones.", "/static/images/eucalyptus.jpg", "available"),
    ]

    for b in botanicals_data:
        cursor.execute("""
        INSERT INTO botanical_materials (id, botanical_name, common_name, material_type, natural_colour_family, description, image_reference, availability_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            botanical_name=excluded.botanical_name,
            common_name=excluded.common_name,
            material_type=excluded.material_type,
            natural_colour_family=excluded.natural_colour_family,
            description=excluded.description
        """, b)

    # 2. Check if SAH-001 already exists to prevent duplicate seeding
    cursor.execute("SELECT COUNT(*) as c FROM dye_recipes WHERE recipe_code = 'SAH-001'")
    if cursor.fetchone()["c"] > 0:
        return

    # Temporarily disable foreign keys during seed cleanup and re-link
    cursor.execute("PRAGMA foreign_keys = OFF;")
    cursor.execute("DELETE FROM batch_results;")
    cursor.execute("DELETE FROM production_batches;")
    cursor.execute("DELETE FROM recipe_versions;")
    cursor.execute("DELETE FROM dye_recipes;")
    try:
        cursor.execute("DELETE FROM sqlite_sequence WHERE name IN ('dye_recipes', 'production_batches', 'batch_results');")
    except Exception:
        pass
    cursor.execute("PRAGMA foreign_keys = ON;")

    # 3. 20 Natural Dye Shade Recipes
    recipes_20 = [
        # --- 1. YELLOW, GOLD AND ORANGE SHADES ---
        (
            "SAH-001",
            "Marigold – Sun Yellow",
            1, # Tagetes
            "cotton, silk, wool",
            "Sun Yellow",
            "#F59E0B",
            0.05, # 100g in 2000ml (1:20 ratio)
            85.0, # 80-90°C
            60,   # 60 min
            json.dumps({"type": "Alum (Potassium Aluminium Sulphate)", "percentage": "15% WOF", "timing": "pre-mordant"}),
            json.dumps({"dyeing_temp_c": 75.0, "dyeing_time_mins": 45, "liquor_ratio": "1:20", "ph_target": 6.5}),
            "Awaiting Validation",
            "Experimental starting protocol. Rich lutein carotenoid extraction; optimal below boiling to preserve brilliance.",
            "Yellow, Gold & Orange",
            "standard_extraction",
            6.5,
            "Required (Muslin Cloth)",
            20,
            75.0,
            45,
            "Initial experimental starting protocol. Actual shade depends on flower harvest and fiber scouring.",
            "Single Botanical: Marigold Flowers (100g per 2L)"
        ),
        (
            "SAH-002",
            "Marigold + Iron – Olive Gold",
            1, # Tagetes
            "cotton, silk, wool",
            "Olive Gold",
            "#656626",
            0.05,
            85.0,
            60,
            json.dumps({"type": "Alum pre-mordant + Iron modifier", "percentage": "12% Alum + 1.5% Ferrous Sulphate", "timing": "separate modifier bath"}),
            json.dumps({"dyeing_temp_c": 75.0, "dyeing_time_mins": 45, "liquor_ratio": "1:20", "ph_target": 6.0}),
            "Awaiting Validation",
            "Extraction followed by a measured iron modifier saddening step. Shifts luminous yellow into antique olive gold.",
            "Yellow, Gold & Orange",
            "iron_modifier",
            6.0,
            "Required (Muslin Cloth)",
            20,
            75.0,
            45,
            "Iron concentration must be kept below 2% WOF to avoid fiber embrittlement.",
            "Combination: Marigold extract with separate measured Iron modifier bath"
        ),
        (
            "SAH-003",
            "Turmeric – Bright Yellow",
            5, # Turmeric
            "cotton, silk",
            "Bright Yellow",
            "#FBBF24",
            0.025, # 50g in 2000ml (1:40 ratio)
            75.0,  # 70-80°C
            40,    # 30-45 min
            json.dumps({"type": "Optional Alum trial", "percentage": "10% WOF", "timing": "pre-mordant"}),
            json.dumps({"dyeing_temp_c": 70.0, "dyeing_time_mins": 35, "liquor_ratio": "1:25", "ph_target": 6.0}),
            "Awaiting Validation",
            "Direct curcuminoid dye producing fluorescent brilliance. Note: Limited lightfastness; test UV resistance.",
            "Yellow, Gold & Orange",
            "standard_extraction",
            6.0,
            "Required (Fine Mesh)",
            15,
            70.0,
            35,
            "Curcumin is sensitive to sunlight; pre-treatment with tannin or post-soaping recommended.",
            "Single Botanical: Dried Turmeric Rhizome Powder (50g per 2L)"
        ),
        (
            "SAH-004",
            "Turmeric + Iron – Mustard",
            5, # Turmeric
            "cotton, silk",
            "Mustard Khaki",
            "#A88219",
            0.025,
            75.0,
            40,
            json.dumps({"type": "Alum + Controlled Iron Modifier", "percentage": "8% Alum + 1% Ferrous Sulphate", "timing": "post-bath modifier"}),
            json.dumps({"dyeing_temp_c": 70.0, "dyeing_time_mins": 35, "liquor_ratio": "1:25", "ph_target": 5.8}),
            "Awaiting Validation",
            "Curcumin darkened with trace ferrous ions. Produces earthy mustard or muted khaki tone.",
            "Yellow, Gold & Orange",
            "iron_modifier",
            5.8,
            "Required (Fine Mesh)",
            15,
            70.0,
            35,
            "Controlled iron saddening improves lightfastness over unmodified turmeric.",
            "Combination: Turmeric 50g with controlled iron modification"
        ),
        (
            "SAH-005",
            "Onion Skin – Copper Gold",
            6, # Onion Skin
            "cotton, silk, wool",
            "Copper Gold",
            "#D97706",
            0.05, # 100g in 2000ml
            85.0,
            60,
            json.dumps({"type": "Alum", "percentage": "15% WOF Alum", "timing": "pre-mordant"}),
            json.dumps({"dyeing_temp_c": 80.0, "dyeing_time_mins": 45, "liquor_ratio": "1:20", "ph_target": 6.2}),
            "Awaiting Validation",
            "Quercetin flavonoid extraction from dry papery skins. Delivers deep amber and radiant copper gold.",
            "Yellow, Gold & Orange",
            "standard_extraction",
            6.2,
            "Required (Muslin Cloth)",
            20,
            80.0,
            45,
            "Excellent wash and light fastness on wool and silk.",
            "Single Botanical: Dry Onion Skins (100g per 2L)"
        ),

        # --- 2. RED, PINK AND TERRACOTTA SHADES ---
        (
            "SAH-006",
            "Madder – Terracotta",
            3, # Madder
            "cotton, silk, wool",
            "Terracotta",
            "#B45309",
            0.05, # 100g in 2000ml
            68.0, # 60-70°C
            75,   # 60-90 min
            json.dumps({"type": "Alum", "percentage": "15% WOF Alum + 2% Soda Ash", "timing": "pre-mordant"}),
            json.dumps({"dyeing_temp_c": 70.0, "dyeing_time_mins": 60, "liquor_ratio": "1:20", "ph_target": 7.5}),
            "Awaiting Validation",
            "Alizarin and purpurin extraction. Gentle temperature (60-70°C) prevents brown hydrolyzable tannins.",
            "Red, Pink & Terracotta",
            "standard_extraction",
            7.5,
            "Required (Fine Mesh)",
            25,
            70.0,
            60,
            "Water with natural calcium/hard ions enhances bright red alizarin chelation.",
            "Single Botanical: Dried Madder Root (100g per 2L)"
        ),
        (
            "SAH-007",
            "Madder – Rose Pink",
            3, # Madder
            "cotton, silk, wool",
            "Rose Pink",
            "#DB7093",
            0.025, # 50g in 2000ml (lighter trial)
            65.0,  # 60-70°C
            50,    # 45-60 min
            json.dumps({"type": "Alum", "percentage": "10% WOF Alum", "timing": "pre-mordant"}),
            json.dumps({"dyeing_temp_c": 65.0, "dyeing_time_mins": 45, "liquor_ratio": "1:25", "ph_target": 7.0}),
            "Awaiting Validation",
            "Lighter extraction ratio yields delicate dusty rose and antique pink tones without brick darkening.",
            "Red, Pink & Terracotta",
            "standard_extraction",
            7.0,
            "Required (Fine Mesh)",
            20,
            65.0,
            45,
            "Tested on scoured ahimsa silk and combed cotton.",
            "Single Botanical: Light Madder Root (50g per 2L)"
        ),
        (
            "SAH-008",
            "Hibiscus – Dusty Mauve",
            7, # Hibiscus
            "cotton, silk",
            "Dusty Mauve",
            "#9D6B7A",
            0.05,
            70.0, # 60-80°C
            35,   # 30-45 min
            json.dumps({"type": "Alum trial", "percentage": "10% WOF", "timing": "pre-mordant"}),
            json.dumps({"dyeing_temp_c": 65.0, "dyeing_time_mins": 35, "liquor_ratio": "1:20", "ph_target": 5.5}),
            "Awaiting Validation",
            "Rich in delphinidin and cyanidin glycosides. Muted dusty mauve and violet-rose.",
            "Red, Pink & Terracotta",
            "standard_extraction",
            5.5,
            "Required (Muslin Cloth)",
            20,
            65.0,
            35,
            "pH-sensitive botanical. Acidic rinse recommended to stabilize shade.",
            "Single Botanical: Dried Hibiscus Calyces (100g per 2L)"
        ),
        (
            "SAH-009",
            "Red Cabbage + Acid – Pink",
            8, # Red Cabbage
            "silk, wool",
            "Vibrant Pink",
            "#E05284",
            0.10, # 200g in 2000ml
            70.0,
            35,
            json.dumps({"type": "Citric Acid modifier", "percentage": "pH adjusted to 3.0-3.5", "timing": "extraction modifier"}),
            json.dumps({"dyeing_temp_c": 65.0, "dyeing_time_mins": 30, "liquor_ratio": "1:20", "ph_target": 3.2}),
            "Awaiting Validation",
            "Anthocyanins protonate in acidic conditions to form the flavylium cation (vibrant red-pink).",
            "Red, Pink & Terracotta",
            "acid_modifier",
            3.2,
            "Required (Muslin Cloth)",
            15,
            65.0,
            30,
            "Experimental pH-sensitive shade. Wash with mild pH-neutral detergent.",
            "Combination: Chopped Red Cabbage with Citric Acid pH 3.2 modifier"
        ),
        (
            "SAH-010",
            "Madder + Iron – Rust Brown",
            3, # Madder
            "cotton, silk, wool",
            "Rust Brown",
            "#7C2D12",
            0.05,
            68.0,
            75,
            json.dumps({"type": "Alum pre-mordant + Iron modifier", "percentage": "12% Alum + 2% FeSO4", "timing": "post-immersion saddening"}),
            json.dumps({"dyeing_temp_c": 70.0, "dyeing_time_mins": 50, "liquor_ratio": "1:20", "ph_target": 6.8}),
            "Awaiting Validation",
            "Alizarin complexed with iron(II) ions. Deepens terracotta into rustic leather brown and brick rust.",
            "Red, Pink & Terracotta",
            "iron_modifier",
            6.8,
            "Required (Fine Mesh)",
            20,
            70.0,
            50,
            "Iron modification provides superior washfastness.",
            "Combination: Madder Root 100g with controlled 2% Iron saddening"
        ),

        # --- 3. PURPLE, BLUE AND TEAL SHADES ---
        (
            "SAH-011",
            "Red Cabbage – Lavender",
            8, # Red Cabbage
            "silk, wool",
            "Lavender",
            "#8B7BA8",
            0.10,
            70.0,
            35,
            json.dumps({"type": "Alum trial", "percentage": "8% WOF", "timing": "pre-mordant"}),
            json.dumps({"dyeing_temp_c": 65.0, "dyeing_time_mins": 30, "liquor_ratio": "1:20", "ph_target": 6.2}),
            "Awaiting Validation",
            "Neutral extraction yields soft lavender and muted slate purple. Unstable to high UV.",
            "Purple, Blue & Teal",
            "standard_extraction",
            6.2,
            "Required (Muslin Cloth)",
            15,
            65.0,
            30,
            "Experimental shade. Requires gentle handling and shadow drying.",
            "Single Botanical: Fresh Chopped Red Cabbage (200g per 2L)"
        ),
        (
            "SAH-012",
            "Red Cabbage – Violet",
            8, # Red Cabbage
            "silk, wool",
            "Royal Violet",
            "#6B46C1",
            0.10,
            70.0,
            35,
            json.dumps({"type": "Alkaline buffer", "percentage": "Sodium Bicarbonate pH 8.0", "timing": "extraction modifier"}),
            json.dumps({"dyeing_temp_c": 65.0, "dyeing_time_mins": 30, "liquor_ratio": "1:20", "ph_target": 8.0}),
            "Awaiting Validation",
            "Anthocyanins shift through quinonoidal base form under mild alkaline condition (pH 7.8-8.2).",
            "Purple, Blue & Teal",
            "acid_modifier",
            8.0,
            "Required (Muslin Cloth)",
            15,
            65.0,
            30,
            "Record exact pH. Protein fibers like silk accept mild alkaline baths well.",
            "Combination: Red Cabbage with controlled alkaline pH 8.0 buffer"
        ),
        (
            "SAH-013",
            "Indigo – Sky Blue",
            2, # Indigo
            "cotton, silk, wool",
            "Sky Blue",
            "#38BDF8",
            0.015, # 30g vat stock per 2000ml
            50.0,  # Vat reduction temperature (45-55°C)
            30,    # Reduction time
            json.dumps({"type": "None (Substantive Vat Dye)", "percentage": "0%", "timing": "direct reduction"}),
            json.dumps({"dyeing_temp_c": 45.0, "dyeing_time_mins": 10, "liquor_ratio": "1:25", "ph_target": 10.2, "dips": 2}),
            "Awaiting Validation",
            "Reduced indigo vat. Pale cerulean achieved with 1-2 short dips and complete intermediate aeration.",
            "Purple, Blue & Teal",
            "reduced_vat",
            10.2,
            "Not Applicable (Vat Liquor)",
            30,
            45.0,
            15,
            "IMPORTANT: Indigo is a chemical reduction vat, not a hot-water extraction. No boiling permitted.",
            "Vat Process: Indigo reduction with Fructose/Lime or Hydrosulphite (1-2 short dips)"
        ),
        (
            "SAH-014",
            "Indigo – Deep Navy",
            2, # Indigo
            "cotton, silk, wool",
            "Deep Navy",
            "#1E3A8A",
            0.030, # 60g vat stock
            50.0,
            30,
            json.dumps({"type": "None (Substantive Vat Dye)", "percentage": "0%", "timing": "direct reduction"}),
            json.dumps({"dyeing_temp_c": 45.0, "dyeing_time_mins": 30, "liquor_ratio": "1:25", "ph_target": 10.5, "dips": 5}),
            "Awaiting Validation",
            "Layered indigo oxidation. 4 to 6 dips build deep, lightfast midnight navy without crocking.",
            "Purple, Blue & Teal",
            "reduced_vat",
            10.5,
            "Not Applicable (Vat Liquor)",
            30,
            45.0,
            30,
            "Each dip adds ~0.5g/m² insoluble indigotin inside the fiber matrix upon oxygen exposure.",
            "Vat Process: Indigo reduction with multi-dip oxidation cycles (5-6 dips)"
        ),
        (
            "SAH-015",
            "Indigo + Turmeric – Teal Green",
            2, # Indigo primary
            "cotton, silk, wool",
            "Teal Green",
            "#0D9488",
            0.035, # Combined ratio
            75.0,
            40,
            json.dumps({"type": "Alum pre-mordant on fabric", "percentage": "10% Alum", "timing": "pre-mordant prior to overdye"}),
            json.dumps({"dyeing_temp_c": 70.0, "dyeing_time_mins": 40, "liquor_ratio": "1:25", "ph_target": 6.5, "steps": "Indigo vat dip -> aerate -> hot turmeric bath"}),
            "Awaiting Validation",
            "Classic two-stage overdyeing: Substantive indigo sky blue base followed by hot turmeric extract bath.",
            "Purple, Blue & Teal",
            "sequential_overdye",
            6.5,
            "Required (for Turmeric bath)",
            20,
            70.0,
            40,
            "Sequential overdyeing produces brilliant, luminous greens unobtainable from single botanicals.",
            "Combination: Sequential overdye (Indigo pale vat dip + Turmeric 50g extract)"
        ),

        # --- 4. BROWN, BEIGE, GREY AND EARTHY SHADES ---
        (
            "SAH-016",
            "Pomegranate Rind – Sand Beige",
            4, # Pomegranate
            "cotton, silk, wool",
            "Sand Beige",
            "#D4B996",
            0.05, # 100g in 2000ml
            85.0,
            60,
            json.dumps({"type": "Self-mordanting tannin (Optional 8% Alum)", "percentage": "None or 8% Alum", "timing": "pre-mordant"}),
            json.dumps({"dyeing_temp_c": 75.0, "dyeing_time_mins": 45, "liquor_ratio": "1:20", "ph_target": 6.5}),
            "Awaiting Validation",
            "High ellagitannin concentration acts as both natural dye and cellulosic fiber preparation base.",
            "Brown, Beige, Grey & Earthy",
            "standard_extraction",
            6.5,
            "Required (Muslin Cloth)",
            20,
            75.0,
            45,
            "Excellent baseline tannin bath for subsequent mordant printing or overdyeing.",
            "Single Botanical: Dried Pomegranate Rinds (100g per 2L)"
        ),
        (
            "SAH-017",
            "Pomegranate + Iron – Charcoal",
            4, # Pomegranate
            "cotton, silk, wool",
            "Charcoal Grey",
            "#374151",
            0.05,
            85.0,
            60,
            json.dumps({"type": "Iron modifier", "percentage": "2.5% Ferrous Sulphate (FeSO4)", "timing": "post-saddening"}),
            json.dumps({"dyeing_temp_c": 75.0, "dyeing_time_mins": 45, "liquor_ratio": "1:20", "ph_target": 5.8}),
            "Awaiting Validation",
            "Iron(II) complexes with hydrolyzable tannins to form permanent ferro-tannate slate grey/charcoal.",
            "Brown, Beige, Grey & Earthy",
            "iron_modifier",
            5.8,
            "Required (Muslin Cloth)",
            20,
            75.0,
            45,
            "Historical iron-tannin chemistry providing high light and wash fastness.",
            "Combination: Pomegranate Rind 100g with 2.5% Iron modifier saddening"
        ),
        (
            "SAH-018",
            "Black Tea – Warm Brown",
            9, # Black Tea
            "cotton, silk, wool",
            "Warm Brown",
            "#854D0E",
            0.025, # 50g in 2000ml
            92.0,  # 90-95°C
            25,    # 20-30 min
            json.dumps({"type": "Tea tannins + Optional Alum", "percentage": "8% Alum trial", "timing": "pre-mordant"}),
            json.dumps({"dyeing_temp_c": 85.0, "dyeing_time_mins": 30, "liquor_ratio": "1:25", "ph_target": 6.0}),
            "Awaiting Validation",
            "Theaflavin and thearubigin pigments deliver warm amber tans and rich leather browns.",
            "Brown, Beige, Grey & Earthy",
            "standard_extraction",
            6.0,
            "Required (Fine Strainer)",
            15,
            85.0,
            30,
            "High natural polyphenol content ensures substantive adhesion to cellulosic and protein fibers.",
            "Single Botanical: Cured Black Tea Leaves (50g per 2L)"
        ),
        (
            "SAH-019",
            "Coffee – Cocoa Brown",
            10, # Coffee
            "cotton, silk, wool",
            "Cocoa Brown",
            "#6F4E37",
            0.05, # 100g in 2000ml
            85.0,
            40,
            json.dumps({"type": "Alum", "percentage": "12% WOF Alum", "timing": "pre-mordant"}),
            json.dumps({"dyeing_temp_c": 80.0, "dyeing_time_mins": 40, "liquor_ratio": "1:20", "ph_target": 6.2}),
            "Awaiting Validation",
            "Circular economy upcycling: Clean spent barista grounds produce warm earthy cocoa tones.",
            "Brown, Beige, Grey & Earthy",
            "standard_extraction",
            6.2,
            "Required (Fine Filter)",
            20,
            80.0,
            40,
            "Rinse grounds with boiling water prior to extraction to remove residual surface lipids.",
            "Single Botanical: Clean Spent Coffee Grounds (100g per 2L)"
        ),
        (
            "SAH-020",
            "Eucalyptus – Peach / Rust",
            11, # Eucalyptus
            "cotton, silk, wool",
            "Peach Rust",
            "#D97757",
            0.05, # 100g in 2000ml
            85.0,
            60,
            json.dumps({"type": "Alum", "percentage": "12% WOF Alum", "timing": "pre-mordant"}),
            json.dumps({"dyeing_temp_c": 80.0, "dyeing_time_mins": 45, "liquor_ratio": "1:20", "ph_target": 6.4}),
            "Awaiting Validation",
            "Abundant in flavonoids and cineole. Imparts delicate peach tones on silk and warm rust on wool.",
            "Brown, Beige, Grey & Earthy",
            "standard_extraction",
            6.4,
            "Required (Muslin Cloth)",
            20,
            80.0,
            45,
            "Species and leaf maturity significantly impact colour. Iron modifier shifts tone toward olive-grey.",
            "Single Botanical: Dried Eucalyptus Leaves (100g per 2L)"
        )
    ]

    for r in recipes_20:
        cursor.execute("""
        INSERT INTO dye_recipes (
            recipe_code, recipe_name, botanical_material_id, fabric_type, target_colour_name, target_hex,
            material_to_water_ratio, extraction_temperature, extraction_duration, mordant_information,
            dyeing_parameters, validated_status, recipe_notes, shade_family, process_type, ph_target,
            filtration, cooling_mins, dyeing_temperature, dyeing_duration, evidence_notes, combination_details
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, r)

    # 4. Seed initial versions into recipe_versions audit table
    cursor.execute("SELECT id, recipe_code, recipe_name FROM dye_recipes WHERE recipe_code IS NOT NULL")
    all_seeded = cursor.fetchall()
    for row in all_seeded:
        cursor.execute("""
        INSERT INTO recipe_versions (recipe_id, version_number, recipe_name, parameters_json, changed_by, changed_at, change_summary)
        VALUES (?, 1, ?, ?, 'Antigravity Seed Engine', ?, 'Initial 20-shade experimental protocol import')
        """, (row["id"], row["recipe_name"], json.dumps({"recipe_code": row["recipe_code"]}), now))

    # 5. Historical batches
    cursor.execute("SELECT COUNT(*) as c FROM production_batches")
    if cursor.fetchone()["c"] == 0:
        historical_batches = [
            ("BAT-2026-001", 1, "#F59E0B", 100.0, 2000.0, 85.0, 60, "SIMULATION", "2026-11-15T09:30:00", "Dyeing Completed", 200.0, 1720.0, 1740.0, 20.0, 1.16),
            ("BAT-2026-002", 6, "#B45309", 100.0, 2000.0, 68.0, 75, "SIMULATION", "2026-11-16T11:15:00", "Dyeing Completed", 200.0, 1680.0, 1660.0, 20.0, 1.19),
            ("BAT-2026-003", 14, "#1E3A8A", 60.0, 2000.0, 50.0, 30, "SIMULATION", "2026-11-17T14:00:00", "Dyeing Completed", 200.0, 1850.0, 1865.0, 15.0, 0.81),
            ("BAT-2026-004", 16, "#D4B996", 100.0, 2000.0, 85.0, 60, "SIMULATION", "2026-11-18T10:45:00", "Dyeing Completed", 200.0, 1710.0, 1695.0, 15.0, 0.88),
            ("BAT-2026-005", 5, "#D97706", 100.0, 2000.0, 85.0, 60, "SIMULATION", "2026-11-19T13:20:00", "Dyeing Completed", 200.0, 1730.0, 1750.0, 20.0, 1.16),
            ("BAT-2026-006", 15, "#0D9488", 70.0, 2000.0, 75.0, 40, "SIMULATION", "2026-11-19T16:00:00", "Dyeing Completed", 200.0, 1700.0, 1720.0, 20.0, 1.18)
        ]
        for b in historical_batches:
            cursor.execute("""
            INSERT INTO production_batches (batch_number, recipe_id, target_colour, plant_weight, water_quantity,
                                            actual_temperature, extraction_duration, operating_mode, created_at,
                                            process_status, fabric_weight)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8], b[9], b[10]))
            batch_id = cursor.lastrowid

            cursor.execute("""
            INSERT INTO batch_results (batch_id, predicted_output, actual_output, absolute_error, percentage_error,
                                       colour_strength, result_notes, completed_at)
            VALUES (?, ?, ?, ?, ?, 'Standard', 'Calibrated production benchmark', ?)
            """, (batch_id, b[11], b[12], b[13], b[14], b[8]))

    conn.commit()

# Ensure database is initialized on import
init_db()
