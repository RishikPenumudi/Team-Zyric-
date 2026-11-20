/**
 * SAHAJ AI - Colour Studio Component
 * Module 01: Multimodal Image Understanding, Deterministic CV & Botanical Recipe Matching.
 * Includes complete 20-shade botanical colour-to-recipe suitability directory.
 */

const BOTANICAL_SHADES_DATA = [
  // 1. YELLOW, GOLD & ORANGE
  {
    code: "SAH-001",
    id: 1,
    name: "Marigold – Sun Yellow",
    family: "Yellow, Gold & Orange",
    colorType: "Sun Yellow / Radiant Gold",
    hex: "#F59E0B",
    rgb: [245, 158, 11],
    botanical: "Marigold (Tagetes erecta)",
    plantPart: "Dried Flower Petals",
    materialInput: "100 g dried flowers / 2.0 L water",
    temp: "80–90°C",
    duration: "60 mins",
    mordant: "Alum (12% WOF pre-mordant)",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Silk & Wool (Deep luster), Cotton (Warm golden yellow)",
    processType: "Standard Thermal Extraction",
    modifier: "None (Pure Carotenoid / Flavonoid)",
    achievableShade: "Brilliant warm sun yellow with golden amber undertones",
    fastness: "Wash: 4/5 | Light: 3-4/5 (High when alum-mordanted)",
    notes: "Petals harvested at peak bloom and shade dried. Avoid boiling above 95°C to prevent thermal browning."
  },
  {
    code: "SAH-002",
    id: 2,
    name: "Marigold + Iron – Olive Gold",
    family: "Yellow, Gold & Orange",
    colorType: "Olive Gold / Antique Khaki",
    hex: "#656626",
    rgb: [101, 102, 38],
    botanical: "Marigold (Tagetes erecta) + Ferrous Sulfate",
    plantPart: "Dried Flowers + Mineral Modifier",
    materialInput: "100 g flowers / 2.0 L water + 1.5% FeSO4",
    temp: "80–90°C",
    duration: "60 mins",
    mordant: "Alum pre-mordant; Iron (1-1.5% WOF) separate modifier bath",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Cotton & Desi Wool (Rich antique olive / khaki)",
    processType: "Iron Saddened Modifier",
    modifier: "Ferrous sulfate modifier bath (10 mins at 50°C)",
    achievableShade: "Muted olive gold, antique khaki, and mossy gold",
    fastness: "Wash: 4-5/5 | Light: 4/5 (Iron complex improves lightfastness)",
    notes: "Keep iron concentration below 2% to avoid fiber harshness; rinse thoroughly in clean water."
  },
  {
    code: "SAH-003",
    id: 3,
    name: "Turmeric – Bright Yellow",
    family: "Yellow, Gold & Orange",
    colorType: "Bright Yellow / Luminous Canary",
    hex: "#FBBF24",
    rgb: [251, 191, 36],
    botanical: "Turmeric (Curcuma longa)",
    plantPart: "Dried Rhizome Powder",
    materialInput: "50 g turmeric powder / 1.5–2.0 L water",
    temp: "70–80°C",
    duration: "30–45 mins",
    mordant: "Direct substantivity (Optional Alum 8% trial)",
    fabrics: ["Cotton", "Silk"],
    bestFabric: "Ahimsa Silk (High affinity, electric brilliance)",
    processType: "Low-Temperature Thermal",
    modifier: "Substantive dye (No heavy mordant strictly needed)",
    achievableShade: "Vibrant, high-chroma canary yellow",
    fastness: "Wash: 3/5 | Light: 2-3/5 (Curcumin photofades under intense UV)",
    notes: "Direct affinity on protein and cellulosic fibers. Keep out of direct sunlight; finish with a mild acidic rinse."
  },
  {
    code: "SAH-004",
    id: 4,
    name: "Turmeric + Iron – Mustard",
    family: "Yellow, Gold & Orange",
    colorType: "Mustard / Muted Earthy Khaki",
    hex: "#A88219",
    rgb: [168, 130, 25],
    botanical: "Turmeric (Curcuma longa) + Ferrous Sulfate",
    plantPart: "Dried Rhizome Powder + Iron Modifier",
    materialInput: "50 g turmeric / 1.5–2.0 L water + 1% FeSO4",
    temp: "70–80°C",
    duration: "30–45 mins",
    mordant: "Optional Alum; Controlled Iron modifier bath",
    fabrics: ["Cotton", "Silk"],
    bestFabric: "Cotton & Silk (Warm rustic mustard)",
    processType: "Iron Saddened Modifier",
    modifier: "Trace iron bath (1% WOF) for 5-8 minutes",
    achievableShade: "Spicy warm mustard, muted amber khaki",
    fastness: "Wash: 3-4/5 | Light: 3-4/5 (Significantly better UV stability than raw turmeric)",
    notes: "Controlled iron complexation binds curcuminoids, dramatically shifting hue from canary to deep spice mustard."
  },
  {
    code: "SAH-005",
    id: 5,
    name: "Onion Skin – Copper Gold",
    family: "Yellow, Gold & Orange",
    colorType: "Copper Gold / Amber Bronze",
    hex: "#D97706",
    rgb: [217, 119, 6],
    botanical: "Yellow Onion Skin (Allium cepa)",
    plantPart: "Dry Outer Papery Skins",
    materialInput: "100 g dry onion skins / 2.0 L water",
    temp: "80–90°C",
    duration: "60 mins",
    mordant: "Alum (12% WOF)",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Wool & Silk (Rich copper tone), Cotton (Golden amber)",
    processType: "Standard Thermal Extraction",
    modifier: "Quercetin flavonoid rich (Pre-mordant with alum)",
    achievableShade: "Warm copper, glowing amber gold, and burnished bronze",
    fastness: "Wash: 4/5 | Light: 4/5 (High quercetin light stability)",
    notes: "Zero-waste culinary byproduct. Papery skins yield high tinctorial power with minimal water retention."
  },

  // 2. RED, PINK & TERRACOTTA
  {
    code: "SAH-006",
    id: 6,
    name: "Madder – Terracotta",
    family: "Red, Pink & Terracotta",
    colorType: "Terracotta / Heritage Brick Red",
    hex: "#B45309",
    rgb: [180, 83, 9],
    botanical: "Indian Madder / Manjistha (Rubia cordifolia)",
    plantPart: "Dried Chipped Roots",
    materialInput: "100 g dried madder roots / 2.0 L water",
    temp: "60–70°C (Never boil!)",
    duration: "60–90 mins",
    mordant: "Alum (15% WOF) + optional calcium carbonate",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Cotton (Classic Indian kalamkari brick red), Silk, Wool",
    processType: "Sub-Boiling Anthraquinone Extraction",
    modifier: "Maintain gentle heat below 70°C; do not boil",
    achievableShade: "Warm rustic terracotta, rich brick red, earthy crimson",
    fastness: "Wash: 4-5/5 | Light: 4-5/5 (Historic benchmark fastness)",
    notes: "CRITICAL: Do not exceed 70°C. High heat releases brown purpurin tannins which mask the brilliant alizarin red."
  },
  {
    code: "SAH-007",
    id: 7,
    name: "Madder – Rose Pink",
    family: "Red, Pink & Terracotta",
    colorType: "Rose Pink / Blush Salmon",
    hex: "#DB7093",
    rgb: [219, 112, 147],
    botanical: "Indian Madder / Manjistha (Rubia cordifolia)",
    plantPart: "Dried Chipped Roots (Light Extraction)",
    materialInput: "50 g dried madder root / 2.0 L water",
    temp: "60–70°C",
    duration: "45–60 mins",
    mordant: "Alum (10% WOF)",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Ahimsa Silk (Luminous blush rose), Desi Wool",
    processType: "Sub-Boiling Light Extraction",
    modifier: "Lower concentration (50% WOF) or second-exhaust bath",
    achievableShade: "Delicate blush pink, salmon rose, soft muted petal",
    fastness: "Wash: 4/5 | Light: 4/5 (Gentle hue with enduring stability)",
    notes: "Produced using lower root-to-fabric ratio or using the second exhaust liquor from an initial terracotta batch."
  },
  {
    code: "SAH-008",
    id: 8,
    name: "Hibiscus – Dusty Mauve",
    family: "Red, Pink & Terracotta",
    colorType: "Dusty Mauve / Soft Heather Lilac",
    hex: "#93335B",
    rgb: [147, 51, 91],
    botanical: "Hibiscus / Roselle (Hibiscus sabdariffa)",
    plantPart: "Dried Flower Calyces",
    materialInput: "100 g dried hibiscus calyces / 2.0 L water",
    temp: "60–80°C",
    duration: "30–45 mins",
    mordant: "Alum pre-mordant trial (10% WOF)",
    fabrics: ["Cotton", "Silk"],
    bestFabric: "Silk & Wool (Soft antique mauve glow)",
    processType: "pH-Sensitive Low-Heat Extraction",
    modifier: "Anthocyanin complex (Maintain pH 4.5–5.5)",
    achievableShade: "Dusty heather mauve, dusky rose-plum",
    fastness: "Wash: 3/5 | Light: 3/5 (pH sensitive; store away from alkaline detergents)",
    notes: "Anthocyanin dyes are inherently sensitive to water alkalinity. Best washed with neutral or slightly acidic soap."
  },
  {
    code: "SAH-009",
    id: 9,
    name: "Red Cabbage + Acid – Berry Pink",
    family: "Red, Pink & Terracotta",
    colorType: "Acid Berry Pink / Orchid Cerise",
    hex: "#E05284",
    rgb: [224, 82, 132],
    botanical: "Red Cabbage (Brassica oleracea) + Citric Acid",
    plantPart: "Fresh Shredded Leaf Head + Acid",
    materialInput: "200 g shredded cabbage / 1.5 L water + 5g citric acid",
    temp: "50–60°C",
    duration: "30 mins",
    mordant: "Alum (12% WOF pre-mordant)",
    fabrics: ["Silk", "Wool"],
    bestFabric: "Silk & Wool (Anthocyanin cation binds tightly to protein)",
    processType: "Acid / pH Shift Modifier",
    modifier: "Citric acid addition to lower bath to pH 3.0–3.5",
    achievableShade: "Vivid cerise pink, magenta berry, orchid blush",
    fastness: "Wash: 3/5 | Light: 2-3/5 (Colour indicator sensitive)",
    notes: "Demonstrates botanical anthocyanin chromophore shifting from purple/blue to vibrant pink under acid ionization."
  },
  {
    code: "SAH-010",
    id: 10,
    name: "Madder + Iron – Rust Brown",
    family: "Red, Pink & Terracotta",
    colorType: "Rust Brown / Burnt Terracotta",
    hex: "#7C2D12",
    rgb: [124, 45, 18],
    botanical: "Indian Madder (Rubia) + Ferrous Sulfate",
    plantPart: "Dried Roots + Iron Mineral Modifier",
    materialInput: "100 g madder root / 2.0 L water + 1.5% FeSO4",
    temp: "60–70°C",
    duration: "60 mins",
    mordant: "Alum pre-mordant; Iron post-bath modifier",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Cotton & Desi Wool (Rich warm mahogany rust)",
    processType: "Iron Saddened Modifier",
    modifier: "Ferrous sulfate post-bath saddening (10 mins)",
    achievableShade: "Deep reddish rust, burnt brick, warm iron mahogany",
    fastness: "Wash: 4-5/5 | Light: 4-5/5 (Very high colorfastness)",
    notes: "Iron saddening turns madder's alizarin red into a deep, earthy rust with exceptional wash resistance."
  },

  // 3. PURPLE, BLUE & TEAL
  {
    code: "SAH-011",
    id: 11,
    name: "Red Cabbage – Lavender",
    family: "Purple, Blue & Teal",
    colorType: "Lavender Blue / Periwinkle",
    hex: "#7C83BC",
    rgb: [124, 131, 188],
    botanical: "Red Cabbage (Brassica oleracea)",
    plantPart: "Fresh Shredded Leaf Head (Neutral pH)",
    materialInput: "200 g shredded cabbage / 1.5 L water",
    temp: "50–60°C",
    duration: "30 mins",
    mordant: "Alum pre-mordanted fiber",
    fabrics: ["Silk", "Wool"],
    bestFabric: "Silk & Wool (Soft periwinkle shimmer)",
    processType: "Neutral Anthocyanin Extraction",
    modifier: "Neutral distilled/filtered water (pH 6.5–7.0)",
    achievableShade: "Soft periwinkle, lavender blue, dusty iris",
    fastness: "Wash: 3/5 | Light: 2-3/5 (Anthocyanin baseline)",
    notes: "Water hardness significantly affects hue. Use non-alkaline distilled water for true soft lavender."
  },
  {
    code: "SAH-012",
    id: 12,
    name: "Red Cabbage + Base – Violet",
    family: "Purple, Blue & Teal",
    colorType: "Royal Violet / Twilight Purple",
    hex: "#6B46C1",
    rgb: [107, 70, 193],
    botanical: "Red Cabbage (Brassica oleracea) + Sodium Bicarbonate",
    plantPart: "Fresh Shredded Leaf Head + Alkaline Salt",
    materialInput: "200 g shredded cabbage / 1.5 L water + 3g soda",
    temp: "50–60°C",
    duration: "30 mins",
    mordant: "Alum pre-mordant (10% WOF)",
    fabrics: ["Silk", "Wool"],
    bestFabric: "Ahimsa Silk (Deep regal twilight purple)",
    processType: "Alkaline / pH Shift Modifier",
    modifier: "Mild sodium bicarbonate addition to raise pH to 8.0–8.5",
    achievableShade: "Regal violet, deep purple twilight, amethyst",
    fastness: "Wash: 3/5 | Light: 2-3/5 (Keep away from acids)",
    notes: "Mild alkaline pH ionizes anthocyanin quinonoid bases into rich violet. Keep heat below 60°C."
  },
  {
    code: "SAH-013",
    id: 13,
    name: "Indigo – Sky Blue",
    family: "Purple, Blue & Teal",
    colorType: "Sky Blue / Crisp Cerulean",
    hex: "#38BDF8",
    rgb: [56, 189, 248],
    botanical: "True Indigo (Indigofera tinctoria)",
    plantPart: "Fermented Reduced Pigment Paste",
    materialInput: "20 g indigo pigment in 10 L reduced vat (1–2 dips)",
    temp: "40–50°C (No boil / Reduced vat)",
    duration: "10 mins per dip + 15 mins aeration",
    mordant: "None required (Substantive leuco-indigo trapped in fiber)",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Cotton (Pristine sky blue denim/khadi), Silk, Wool",
    processType: "Reduced Vat (Ferrous/Fructose Vat)",
    modifier: "Reduction with ferrous sulfate/lime or fructose at pH 10–11",
    achievableShade: "Clear sky blue, crisp cerulean, ice blue tint",
    fastness: "Wash: 4-5/5 | Light: 4-5/5 (Legendary indigo insolubility)",
    notes: "Requires reduced vat state. Submerge fabric gently without splashing; aerate to oxidize from yellow-green to blue."
  },
  {
    code: "SAH-014",
    id: 14,
    name: "Indigo – Deep Navy",
    family: "Purple, Blue & Teal",
    colorType: "Deep Navy / Midnight Indigo",
    hex: "#1E3A8A",
    rgb: [30, 58, 138],
    botanical: "True Indigo (Indigofera tinctoria)",
    plantPart: "Fermented Reduced Pigment Paste",
    materialInput: "40 g indigo pigment / 10 L vat (5–6 dips)",
    temp: "40–50°C (Reduced vat)",
    duration: "6 dips × 10 mins + 20 mins oxidation between dips",
    mordant: "None (Layered substantive indigotin entrapment)",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Cotton & Wool (Heavy saturated midnight blue)",
    processType: "Multi-Dip Reduced Vat",
    modifier: "Layered multiple dips; full aeration between dips",
    achievableShade: "Deep ink navy, midnight blue, rich royal indigo",
    fastness: "Wash: 5/5 | Light: 5/5 (Highest natural colorfastness benchmark)",
    notes: "Deep shade requires building thin pigment layers across repeated immersions and full oxidation between dips."
  },
  {
    code: "SAH-015",
    id: 15,
    name: "Indigo + Turmeric – Teal Green",
    family: "Purple, Blue & Teal",
    colorType: "Teal Green / Peacock Emerald",
    hex: "#0D9488",
    rgb: [13, 148, 136],
    botanical: "Indigo (Indigofera) + Turmeric (Curcuma)",
    plantPart: "Sequential Overdye: Plant Rhizome then Indigo Vat",
    materialInput: "Step 1: 40g Turmeric (2L) → Step 2: 2 dips Indigo Vat",
    temp: "Step 1: 75°C (30m) → Step 2: 45°C (10m)",
    duration: "45 mins total sequence",
    mordant: "Alum pre-mordant on fabric before Step 1",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Cotton & Silk (Rich peacock luster)",
    processType: "Sequential Overdye Combination",
    modifier: "Subtractive color mixing: Botanical yellow overdyed with botanical blue",
    achievableShade: "Lush peacock teal, deep emerald green, forest pine",
    fastness: "Wash: 4/5 | Light: 3-4/5 (Indigo blue layer shields turmeric)",
    notes: "Classic master artisan technique: pure green does not exist as a single durable natural extract; created by sequential cross-dyeing."
  },

  // 4. BROWN, BEIGE, GREY & EARTHY
  {
    code: "SAH-016",
    id: 16,
    name: "Pomegranate Rind – Sand Beige",
    family: "Brown, Beige, Grey & Earthy",
    colorType: "Sand Beige / Golden Ecru",
    hex: "#D4B996",
    rgb: [212, 185, 150],
    botanical: "Pomegranate Rind (Punica granatum)",
    plantPart: "Dried Fruit Rind / Peel",
    materialInput: "100 g dried pomegranate peel / 2.0 L water",
    temp: "80–90°C",
    duration: "60 mins",
    mordant: "Alum (10% WOF) or Self-Mordanting Tannin",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Cotton (Superb natural tannin fixation), Silk, Wool",
    processType: "Standard High-Tannin Thermal",
    modifier: "Naturally rich in ellagitannins (28-30% dry weight)",
    achievableShade: "Warm sand beige, desert khaki, golden ecru",
    fastness: "Wash: 4-5/5 | Light: 4-5/5 (High tannin permanence)",
    notes: "Excellent natural mordant and dye in one. Serves as heritage pre-treatment base for cotton scoured fibers."
  },
  {
    code: "SAH-017",
    id: 17,
    name: "Pomegranate + Iron – Charcoal Grey",
    family: "Brown, Beige, Grey & Earthy",
    colorType: "Charcoal Grey / Steel Slate",
    hex: "#374151",
    rgb: [55, 65, 81],
    botanical: "Pomegranate Rind (Punica) + Ferrous Sulfate",
    plantPart: "Dried Rind + Iron Mineral Complex",
    materialInput: "100 g pomegranate rind / 2.0 L water + 2% FeSO4",
    temp: "80–90°C",
    duration: "60 mins",
    mordant: "Iron (Ferrous sulfate 2% WOF) post-bath modifier",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Cotton, Silk & Wool (Industrial deep gunmetal slate)",
    processType: "Iron Tannate Mineral Complex",
    modifier: "Tannin-iron reaction forms insoluble black iron tannate",
    achievableShade: "Steel slate, deep charcoal grey, mineral black",
    fastness: "Wash: 5/5 | Light: 5/5 (Permanent mineral dye complex)",
    notes: "Forms traditional iron tannate ink complex. The most wash-durable and light-durable natural dark grey available."
  },
  {
    code: "SAH-018",
    id: 18,
    name: "Black Tea – Warm Brown",
    family: "Brown, Beige, Grey & Earthy",
    colorType: "Warm Brown / Amber Tan",
    hex: "#854D0E",
    rgb: [133, 77, 14],
    botanical: "Black Tea (Camellia sinensis)",
    plantPart: "Fermented Black Tea Leaves",
    materialInput: "80 g loose black tea / 2.0 L water",
    temp: "85–90°C",
    duration: "45 mins",
    mordant: "Optional Alum 8% (High natural theaflavin tannins)",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Cotton & Desi Wool (Rich warm saddle tan)",
    processType: "Standard Thermal Tannin Extraction",
    modifier: "Tannin polyphenols act as self-fixing mordant",
    achievableShade: "Warm saddle brown, amber tan, spiced nutmeg",
    fastness: "Wash: 4/5 | Light: 4/5 (Very stable thearubigins)",
    notes: "Widely available pantry resource. High tannin content bonds directly to cellulosic cotton fibers without heavy metallic mordants."
  },
  {
    code: "SAH-019",
    id: 19,
    name: "Spent Coffee – Cocoa Brown",
    family: "Brown, Beige, Grey & Earthy",
    colorType: "Cocoa Brown / Cafe-au-Lait",
    hex: "#5C3D2E",
    rgb: [92, 61, 46],
    botanical: "Spent Coffee Grounds (Coffea arabica)",
    plantPart: "Dried Upcycled Brew Grounds",
    materialInput: "120 g spent coffee grounds / 2.0 L water",
    temp: "85–90°C",
    duration: "45–60 mins",
    mordant: "Alum (12% WOF) pre-mordant",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Desi Wool & Silk (Rich earthy cocoa aroma & hue)",
    processType: "Upcycled Waste Thermal Extraction",
    modifier: "Alum pre-treatment ensures deep brown saturation",
    achievableShade: "Muted cocoa brown, earthy cafe-au-lait, warm sepia",
    fastness: "Wash: 3-4/5 | Light: 3-4/5 (Soft vintage patina)",
    notes: "Circular economy dye utilizing cafe waste streams. Pre-scour fabric thoroughly to optimize uniform lipid-free penetration."
  },
  {
    code: "SAH-020",
    id: 20,
    name: "Eucalyptus – Peach Rust",
    family: "Brown, Beige, Grey & Earthy",
    colorType: "Peach Rust / Coral Terracotta",
    hex: "#D97757",
    rgb: [217, 119, 87],
    botanical: "Eucalyptus Leaves (Eucalyptus globulus)",
    plantPart: "Fresh or Dried Fallen Leaves",
    materialInput: "100 g dried eucalyptus leaves / 2.0 L water",
    temp: "85–95°C",
    duration: "60–90 mins",
    mordant: "Alum (10% WOF pre-mordant)",
    fabrics: ["Cotton", "Silk", "Wool"],
    bestFabric: "Desi Wool & Ahimsa Silk (Luminous warm coral glow)",
    processType: "High-Heat Polyphenol Extraction",
    modifier: "Prolonged gentle simmer extracts warm cineole/eucalyptin pigments",
    achievableShade: "Soft coral peach, apricot blush, warm rosy terracotta",
    fastness: "Wash: 4/5 | Light: 4-5/5 (High resinous fastness)",
    notes: "Infuses protein fibers with subtle botanical fragrance alongside rich, warm peachy coral shades."
  }
];

const ColourStudioComponent = {
  selectedFile: null,
  currentAnalysis: null,
  activeDirectoryFamily: "all",
  activeDirectoryFabric: "all",

  render() {
    return `
      <div class="section-header">
        <h1 class="section-title">AI Colour Intelligence Studio</h1>
        <p class="section-subtitle">Multimodal botanical colour matching, CIE Delta-E recipe ranking, and complete 20-shade botanical suitability directory</p>
      </div>

      <!-- Natural Dye Notice Alert -->
      <div class="alert-box alert-info">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <div>
          <strong>Heritage Dyeing Principle:</strong> Natural botanical colours depend on harvest quality, water pH, mordant binding, and fiber porosity. Photographic references are matched against validated botanical spectral gamuts using CIE Delta-E metrics rather than synthetic Pantone claims.
        </div>
      </div>

      <div class="grid-2">
        <!-- Left Column: Input Selection (Image Upload or Colour Picker) -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">1. Reference Colour Input</span>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-sm btn-secondary active" id="tab-btn-upload" onclick="ColourStudioComponent.switchInputTab('upload')">Photo Upload</button>
              <button class="btn btn-sm btn-secondary" id="tab-btn-picker" onclick="ColourStudioComponent.switchInputTab('picker')">Interactive Picker</button>
            </div>
          </div>
          <div class="card-body">
            <!-- Mode A: Image Upload -->
            <div id="input-pane-upload">
              <div class="upload-dropzone" id="dropzone" onclick="document.getElementById('file-input').click()">
                <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <div class="upload-prompt">Drop textile swatch photograph here</div>
                <div class="upload-hint">Supports JPEG, PNG, WebP (Max 10MB)</div>
                <input type="file" id="file-input" style="display: none;" accept="image/*" onchange="ColourStudioComponent.handleFileSelect(event)">
              </div>

              <!-- Image Preview Box -->
              <div id="image-preview-container" style="display: none; margin-top: 16px; text-align: center;">
                <img id="image-preview" style="max-height: 220px; border-radius: var(--radius-md); border: 1px solid var(--color-ivory-border); box-shadow: var(--shadow-sm); max-width: 100%;">
                <div style="margin-top: 8px;">
                  <button class="btn btn-sm btn-secondary" onclick="ColourStudioComponent.clearImage()">Remove Image</button>
                </div>
              </div>
            </div>

            <!-- Mode B: Colour Picker & Presets -->
            <div id="input-pane-picker" style="display: none;">
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                <input type="color" id="native-color-picker" value="#F59E0B" style="width: 72px; height: 72px; border: none; border-radius: 8px; cursor: pointer;" onchange="ColourStudioComponent.handleColorPick(this.value)">
                <div>
                  <label class="form-label">HEX Code</label>
                  <input type="text" id="manual-hex-input" class="form-control" value="#F59E0B" style="font-family: var(--font-mono); font-size: 16px; text-transform: uppercase;" onchange="ColourStudioComponent.handleManualHex(this.value)">
                  <span style="font-size: 11px; color: var(--color-text-muted);">Pick or enter 6-digit hex</span>
                </div>
              </div>

              <div class="form-label" style="display: flex; justify-content: space-between; align-items: center;">
                <span>Botanical Heritage Shade Presets (All 20 Shades)</span>
                <span style="font-size: 11px; color: var(--color-forest); font-weight: 600;">Click to select</span>
              </div>
              
              <!-- Family 1 -->
              <div style="font-size: 11px; font-weight: 700; color: var(--color-text-muted); margin: 8px 0 4px; text-transform: uppercase;">1. Yellow, Gold & Orange</div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 8px;">
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#F59E0B', 'SAH-001 Sun Yellow', 'cotton')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #F59E0B; flex-shrink: 0;"></span>
                  SAH-001 Marigold Sun
                </button>
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#656626', 'SAH-002 Olive Gold', 'cotton')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #656626; flex-shrink: 0;"></span>
                  SAH-002 Olive Gold
                </button>
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#FBBF24', 'SAH-003 Turmeric Yellow', 'silk')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #FBBF24; flex-shrink: 0;"></span>
                  SAH-003 Turmeric Yellow
                </button>
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#A88219', 'SAH-004 Turmeric Mustard', 'cotton')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #A88219; flex-shrink: 0;"></span>
                  SAH-004 Turmeric Mustard
                </button>
                <button class="btn btn-sm btn-secondary" style="grid-column: 1 / -1; justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#D97706', 'SAH-005 Onion Copper', 'cotton')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #D97706; flex-shrink: 0;"></span>
                  SAH-005 Onion Skin Copper Gold
                </button>
              </div>

              <!-- Family 2 -->
              <div style="font-size: 11px; font-weight: 700; color: var(--color-text-muted); margin: 8px 0 4px; text-transform: uppercase;">2. Red, Pink & Terracotta</div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 8px;">
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#B45309', 'SAH-006 Madder Terracotta', 'cotton')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #B45309; flex-shrink: 0;"></span>
                  SAH-006 Madder Brick
                </button>
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#DB7093', 'SAH-007 Madder Rose', 'silk')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #DB7093; flex-shrink: 0;"></span>
                  SAH-007 Madder Rose Pink
                </button>
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#93335B', 'SAH-008 Hibiscus Mauve', 'silk')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #93335B; flex-shrink: 0;"></span>
                  SAH-008 Hibiscus Mauve
                </button>
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#E05284', 'SAH-009 Cabbage Pink', 'silk')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #E05284; flex-shrink: 0;"></span>
                  SAH-009 Cabbage Acid Pink
                </button>
                <button class="btn btn-sm btn-secondary" style="grid-column: 1 / -1; justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#7C2D12', 'SAH-010 Madder Rust', 'cotton')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #7C2D12; flex-shrink: 0;"></span>
                  SAH-010 Madder + Iron Rust Brown
                </button>
              </div>

              <!-- Family 3 -->
              <div style="font-size: 11px; font-weight: 700; color: var(--color-text-muted); margin: 8px 0 4px; text-transform: uppercase;">3. Purple, Blue & Teal</div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 8px;">
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#7C83BC', 'SAH-011 Cabbage Lavender', 'silk')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #7C83BC; flex-shrink: 0;"></span>
                  SAH-011 Cabbage Lavender
                </button>
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#6B46C1', 'SAH-012 Cabbage Violet', 'silk')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #6B46C1; flex-shrink: 0;"></span>
                  SAH-012 Cabbage Royal Violet
                </button>
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#38BDF8', 'SAH-013 Indigo Sky', 'cotton')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #38BDF8; flex-shrink: 0;"></span>
                  SAH-013 Indigo Sky Blue
                </button>
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#1E3A8A', 'SAH-014 Indigo Navy', 'cotton')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #1E3A8A; flex-shrink: 0;"></span>
                  SAH-014 Indigo Deep Navy
                </button>
                <button class="btn btn-sm btn-secondary" style="grid-column: 1 / -1; justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#0D9488', 'SAH-015 Teal Green', 'cotton')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #0D9488; flex-shrink: 0;"></span>
                  SAH-015 Indigo + Turmeric Teal Green
                </button>
              </div>

              <!-- Family 4 -->
              <div style="font-size: 11px; font-weight: 700; color: var(--color-text-muted); margin: 8px 0 4px; text-transform: uppercase;">4. Brown, Beige, Grey & Earthy</div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#D4B996', 'SAH-016 Pomegranate Sand', 'cotton')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #D4B996; flex-shrink: 0;"></span>
                  SAH-016 Sand Beige
                </button>
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#374151', 'SAH-017 Charcoal Grey', 'cotton')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #374151; flex-shrink: 0;"></span>
                  SAH-017 Charcoal Grey
                </button>
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#854D0E', 'SAH-018 Tea Brown', 'cotton')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #854D0E; flex-shrink: 0;"></span>
                  SAH-018 Black Tea Brown
                </button>
                <button class="btn btn-sm btn-secondary" style="justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#5C3D2E', 'SAH-019 Coffee Cocoa', 'wool')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #5C3D2E; flex-shrink: 0;"></span>
                  SAH-019 Coffee Cocoa
                </button>
                <button class="btn btn-sm btn-secondary" style="grid-column: 1 / -1; justify-content: flex-start; gap: 6px; font-size: 11px; padding: 4px 8px;" onclick="ColourStudioComponent.setPreset('#D97757', 'SAH-020 Eucalyptus Peach', 'silk')">
                  <span style="width: 13px; height: 13px; border-radius: 3px; background: #D97757; flex-shrink: 0;"></span>
                  SAH-020 Eucalyptus Peach Rust
                </button>
              </div>
            </div>

            <!-- Target Parameters -->
            <div style="margin-top: 20px; border-top: 1px solid var(--color-ivory-border); padding-top: 16px;">
              <div class="form-group">
                <label class="form-label">Target Substrate Fiber</label>
                <select id="studio-fabric-select" class="form-control">
                  <option value="cotton" selected>Scoured Cotton (Cellulosic)</option>
                  <option value="silk">Ahimsa Silk (Protein)</option>
                  <option value="wool">Desi Wool (Keratin Protein)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Target Batch Quantity (Fabric Weight in grams)</label>
                <input type="number" id="studio-quantity-input" class="form-control" value="200" min="50" max="2000" step="50">
                <span style="font-size: 11px; color: var(--color-text-muted);">Standard bench batch is 200g fabric (~1.5 to 2.0 meters)</span>
              </div>

              <button class="btn btn-primary btn-lg" id="btn-run-analysis" style="width: 100%;" onclick="ColourStudioComponent.runAnalysis()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Analyse Colour & Match Botanical Recipes
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Extracted Colour Intelligence & Botanical Suitability Matrix -->
        <div class="card">
          <div class="card-header" style="justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="card-title">2. AI Intelligence & Suitability</span>
              <span id="studio-ai-badge" class="status-badge status-awaiting-inputs">
                <span class="status-badge-dot"></span> Ready for Analysis
              </span>
            </div>

            <!-- View Toggle: Matches vs Directory -->
            <div style="display: flex; gap: 4px;">
              <button class="btn btn-sm btn-secondary active" id="view-tab-analysis" onclick="ColourStudioComponent.switchRightView('analysis')">AI Matches</button>
              <button class="btn btn-sm btn-secondary" id="view-tab-directory" onclick="ColourStudioComponent.switchRightView('directory')">Suitability Guide (20)</button>
            </div>
          </div>

          <div class="card-body" id="studio-results-body">
            <!-- PANE 1: AI Analysis Matches View -->
            <div id="pane-analysis-results">
              <!-- Initial Empty State with Quick Explorer -->
              <div id="studio-empty-state">
                <div style="text-align: center; padding: 20px 10px 16px; border-bottom: 1px solid var(--color-ivory-border);">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 8px; color: var(--color-forest);"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                  <div style="font-size: 15px; font-weight: 700; color: var(--color-forest-dark);">Ready to Formulate Natural Dyes</div>
                  <p style="font-size: 12.5px; margin-top: 4px; color: var(--color-text-muted);">
                    Select a heritage preset on the left, upload a swatch image, or explore the suitability directory below to match recipes.
                  </p>
                </div>

                <div style="margin-top: 14px;">
                  <div style="font-size: 12px; font-weight: 700; color: var(--color-forest); text-transform: uppercase; margin-bottom: 8px;">
                    Quick Botanical Colour Matchers (Click to Test)
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div class="recipe-match-card" style="padding: 10px; cursor: pointer;" onclick="ColourStudioComponent.setPreset('#F59E0B', 'Sun Yellow', 'cotton', true)">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 22px; height: 22px; border-radius: 4px; background: #F59E0B;"></span>
                        <div>
                          <div style="font-size: 12px; font-weight: 700; color: var(--color-forest-dark);">Sun Yellow (Marigold)</div>
                          <div style="font-size: 10.5px; color: var(--color-text-muted);">SAH-001 | Cotton, Silk, Wool</div>
                        </div>
                      </div>
                    </div>
                    <div class="recipe-match-card" style="padding: 10px; cursor: pointer;" onclick="ColourStudioComponent.setPreset('#B45309', 'Terracotta', 'cotton', true)">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 22px; height: 22px; border-radius: 4px; background: #B45309;"></span>
                        <div>
                          <div style="font-size: 12px; font-weight: 700; color: var(--color-forest-dark);">Terracotta (Madder)</div>
                          <div style="font-size: 10.5px; color: var(--color-text-muted);">SAH-006 | Alum Pre-Mordant</div>
                        </div>
                      </div>
                    </div>
                    <div class="recipe-match-card" style="padding: 10px; cursor: pointer;" onclick="ColourStudioComponent.setPreset('#1E3A8A', 'Deep Navy', 'cotton', true)">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 22px; height: 22px; border-radius: 4px; background: #1E3A8A;"></span>
                        <div>
                          <div style="font-size: 12px; font-weight: 700; color: var(--color-forest-dark);">Deep Navy (Indigo Vat)</div>
                          <div style="font-size: 10.5px; color: var(--color-text-muted);">SAH-014 | Reduced Vat (No Boil)</div>
                        </div>
                      </div>
                    </div>
                    <div class="recipe-match-card" style="padding: 10px; cursor: pointer;" onclick="ColourStudioComponent.setPreset('#374151', 'Charcoal Grey', 'cotton', true)">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 22px; height: 22px; border-radius: 4px; background: #374151;"></span>
                        <div>
                          <div style="font-size: 12px; font-weight: 700; color: var(--color-forest-dark);">Charcoal Grey (Pomegranate+Fe)</div>
                          <div style="font-size: 10.5px; color: var(--color-text-muted);">SAH-017 | Permanent Tannate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Analysis Content (Populated after analysis) -->
              <div id="studio-analysis-content" style="display: none;">
                <!-- Extracted Dominant Colour -->
                <div class="swatch-display-row">
                  <div id="studio-dominant-swatch" class="swatch-box" style="background-color: #F59E0B;"></div>
                  <div class="swatch-info">
                    <div id="studio-dominant-hex" class="swatch-hex">#F59E0B</div>
                    <div id="studio-dominant-rgb" style="font-size: 12px; font-family: var(--font-mono); color: var(--color-text-muted);">RGB(245, 158, 11)</div>
                    <div id="studio-color-family" class="swatch-family">Yellow, Gold & Orange</div>
                  </div>
                </div>

                <!-- Palette Distribution Bar -->
                <div style="font-size: 11.5px; font-weight: 600; color: var(--color-text-muted); margin-top: 14px;">Extracted Dominant Color Swatches (K-Means Frequency)</div>
                <div class="palette-bar" id="studio-palette-bar"></div>

                <!-- Artisan AI Assessment -->
                <div style="background: #F8F7F4; border-left: 3px solid var(--color-forest); padding: 12px 14px; border-radius: 0 var(--radius-md) var(--radius-md) 0; margin: 16px 0;">
                  <div style="font-size: 12px; font-weight: 700; color: var(--color-forest); text-transform: uppercase;">Artisan Intelligence Assessment</div>
                  <div id="studio-artisan-assessment" style="font-size: 13px; color: var(--color-text-main); margin-top: 4px;"></div>
                  <div id="studio-limits-note" style="font-size: 11.5px; color: var(--color-text-muted); margin-top: 6px;"></div>
                </div>

                <!-- Matched Botanical Recipes -->
                <div style="font-size: 14px; font-weight: 700; color: var(--color-forest-dark); margin: 20px 0 10px;">Recommended Botanical Recipes (CIE Delta-E Ranked)</div>
                <div id="studio-recipe-cards-container"></div>
              </div>
            </div>

            <!-- PANE 2: Complete Botanical Colour Suitability Directory (20 Core Shades) -->
            <div id="pane-suitability-directory" style="display: none;">
              <div style="margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-size: 13px; font-weight: 700; color: var(--color-forest-dark);">Botanical Colour-to-Recipe Suitability Matrix</span>
                  <span style="font-size: 11.5px; color: var(--color-text-muted);">20 Baseline Experimental Protocols</span>
                </div>

                <!-- Family Filter Pills -->
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
                  <button class="btn btn-sm btn-secondary active" id="dir-filter-all" onclick="ColourStudioComponent.filterDirectoryFamily('all', this)">All (20)</button>
                  <button class="btn btn-sm btn-secondary" id="dir-filter-yellow" onclick="ColourStudioComponent.filterDirectoryFamily('Yellow, Gold & Orange', this)">1. Yellow & Gold</button>
                  <button class="btn btn-sm btn-secondary" id="dir-filter-red" onclick="ColourStudioComponent.filterDirectoryFamily('Red, Pink & Terracotta', this)">2. Red & Pink</button>
                  <button class="btn btn-sm btn-secondary" id="dir-filter-blue" onclick="ColourStudioComponent.filterDirectoryFamily('Purple, Blue & Teal', this)">3. Blue & Purple</button>
                  <button class="btn btn-sm btn-secondary" id="dir-filter-brown" onclick="ColourStudioComponent.filterDirectoryFamily('Brown, Beige, Grey & Earthy', this)">4. Earthy & Brown</button>
                </div>

                <!-- Fabric Affinity Pills -->
                <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--color-text-muted);">
                  <span>Filter by Substrate:</span>
                  <button class="btn btn-sm btn-secondary active" id="dir-fab-all" onclick="ColourStudioComponent.filterDirectoryFabric('all', this)" style="padding: 2px 8px; font-size: 10.5px;">All Substrates</button>
                  <button class="btn btn-sm btn-secondary" id="dir-fab-cotton" onclick="ColourStudioComponent.filterDirectoryFabric('Cotton', this)" style="padding: 2px 8px; font-size: 10.5px;">Cotton (Cellulosic)</button>
                  <button class="btn btn-sm btn-secondary" id="dir-fab-silk" onclick="ColourStudioComponent.filterDirectoryFabric('Silk', this)" style="padding: 2px 8px; font-size: 10.5px;">Silk (Protein)</button>
                  <button class="btn btn-sm btn-secondary" id="dir-fab-wool" onclick="ColourStudioComponent.filterDirectoryFabric('Wool', this)" style="padding: 2px 8px; font-size: 10.5px;">Wool (Keratin)</button>
                </div>
              </div>

              <!-- Directory Items List -->
              <div id="directory-items-container" style="display: flex; flex-direction: column; gap: 10px; max-height: 580px; overflow-y: auto; padding-right: 4px;">
                <!-- Populated dynamically -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    // Setup drag and drop listeners
    const dropzone = document.getElementById("dropzone");
    if (dropzone) {
      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      });
      dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.processImageFile(e.dataTransfer.files[0]);
        }
      });
    }

    // Render the initial directory items
    this.renderDirectoryItems();
  },

  switchInputTab(tab) {
    const btnUpload = document.getElementById("tab-btn-upload");
    const btnPicker = document.getElementById("tab-btn-picker");
    const paneUpload = document.getElementById("input-pane-upload");
    const panePicker = document.getElementById("input-pane-picker");

    if (tab === "upload") {
      btnUpload.classList.add("active");
      btnPicker.classList.remove("active");
      paneUpload.style.display = "block";
      panePicker.style.display = "none";
    } else {
      btnPicker.classList.add("active");
      btnUpload.classList.remove("active");
      panePicker.style.display = "block";
      paneUpload.style.display = "none";
    }
  },

  switchRightView(view) {
    const tabAnalysis = document.getElementById("view-tab-analysis");
    const tabDir = document.getElementById("view-tab-directory");
    const paneAnalysis = document.getElementById("pane-analysis-results");
    const paneDir = document.getElementById("pane-suitability-directory");

    if (view === "analysis") {
      tabAnalysis.classList.add("active");
      tabDir.classList.remove("active");
      paneAnalysis.style.display = "block";
      paneDir.style.display = "none";
    } else {
      tabDir.classList.add("active");
      tabAnalysis.classList.remove("active");
      paneDir.style.display = "block";
      paneAnalysis.style.display = "none";
      this.renderDirectoryItems();
    }
  },

  filterDirectoryFamily(family, btn) {
    this.activeDirectoryFamily = family;
    document.querySelectorAll("[id^='dir-filter-']").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    this.renderDirectoryItems();
  },

  filterDirectoryFabric(fabric, btn) {
    this.activeDirectoryFabric = fabric;
    document.querySelectorAll("[id^='dir-fab-']").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    this.renderDirectoryItems();
  },

  renderDirectoryItems() {
    const container = document.getElementById("directory-items-container");
    if (!container) return;

    let items = BOTANICAL_SHADES_DATA;

    // Filter by family
    if (this.activeDirectoryFamily !== "all") {
      items = items.filter(i => i.family === this.activeDirectoryFamily);
    }

    // Filter by fabric
    if (this.activeDirectoryFabric !== "all") {
      items = items.filter(i => i.fabrics.includes(this.activeDirectoryFabric));
    }

    if (items.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--color-text-muted); padding: 30px;">No recipes match the selected filters.</div>`;
      return;
    }

    container.innerHTML = items.map(shade => `
      <div class="recipe-match-card" style="border-left: 4px solid ${shade.hex}; padding: 12px 14px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="display: inline-block; width: 32px; height: 32px; border-radius: 6px; background-color: ${shade.hex}; border: 1.5px solid rgba(0,0,0,0.15); box-shadow: 0 1px 3px rgba(0,0,0,0.1); flex-shrink: 0;"></span>
            <div>
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--color-forest);">${shade.code}</span>
                <span style="font-size: 13.5px; font-weight: 700; color: var(--color-forest-dark);">${shade.name}</span>
              </div>
              <div style="font-size: 11px; color: var(--color-text-muted);">${shade.botanical} • <em>${shade.plantPart}</em></div>
            </div>
          </div>

          <div style="display: flex; gap: 4px; flex-shrink: 0;">
            <button class="btn btn-sm btn-secondary" style="padding: 3px 8px; font-size: 11px;" title="Test this shade in AI Colour Studio" onclick="ColourStudioComponent.setPreset('${shade.hex}', '${shade.name}', '${shade.fabrics[0].toLowerCase()}', true)">
              Test & Match
            </button>
            <button class="btn btn-sm btn-mustard" style="padding: 3px 8px; font-size: 11px;" title="Select and proceed to smart measurement" onclick="ColourStudioComponent.directSelectRecipe(${shade.id})">
              Select →
            </button>
          </div>
        </div>

        <!-- Badges Row -->
        <div style="display: flex; flex-wrap: wrap; gap: 5px; margin: 8px 0 6px;">
          <span style="background: #F1F5F9; color: #475569; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
            ${shade.family}
          </span>
          <span style="background: rgba(45, 90, 67, 0.1); color: var(--color-forest); font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
            ${shade.processType}
          </span>
          <span style="background: #FEF3C7; color: #B45309; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
            ${shade.temp} (${shade.duration})
          </span>
          ${shade.fabrics.map(f => `<span style="background: #E0E7FF; color: #3730A3; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${f}</span>`).join(" ")}
        </div>

        <!-- Achievable Shade & Mordant -->
        <div style="font-size: 11.5px; color: var(--color-text-main); line-height: 1.4; margin-top: 4px;">
          <strong>Achievable Tone:</strong> ${shade.achievableShade}
        </div>
        <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 2px;">
          <strong>Mordant & Chemistry:</strong> ${shade.mordant}
        </div>
        <div style="font-size: 11px; color: var(--color-forest); margin-top: 2px;">
          <strong>Artisan Guidance:</strong> ${shade.notes}
        </div>
      </div>
    `).join("");
  },

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      this.processImageFile(file);
    }
  },

  processImageFile(file) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.getElementById("image-preview");
      const container = document.getElementById("image-preview-container");
      img.src = e.target.result;
      container.style.display = "block";
      document.getElementById("dropzone").style.display = "none";
    };
    reader.readAsDataURL(file);
  },

  clearImage() {
    this.selectedFile = null;
    document.getElementById("file-input").value = "";
    document.getElementById("image-preview-container").style.display = "none";
    document.getElementById("dropzone").style.display = "block";
  },

  handleColorPick(hex) {
    document.getElementById("manual-hex-input").value = hex.toUpperCase();
  },

  handleManualHex(hex) {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      document.getElementById("native-color-picker").value = hex;
    }
  },

  setPreset(hex, label, fabricType = "cotton", autoRun = false) {
    document.getElementById("native-color-picker").value = hex;
    document.getElementById("manual-hex-input").value = hex.toUpperCase();
    if (fabricType && document.getElementById("studio-fabric-select")) {
      document.getElementById("studio-fabric-select").value = fabricType;
    }
    this.switchInputTab("picker");

    if (autoRun) {
      this.switchRightView("analysis");
      this.runAnalysis();
    }
  },

  async runAnalysis() {
    const btn = document.getElementById("btn-run-analysis");
    btn.disabled = true;
    btn.innerHTML = `<span class="badge-dot" style="animation: pulseGlow 1s infinite;"></span> Analyzing Botanical Colour...`;

    const fabricType = document.getElementById("studio-fabric-select").value;
    const quantity = parseFloat(document.getElementById("studio-quantity-input").value || "200");

    try {
      const api = window.API || (typeof API !== "undefined" ? API : null);
      if (!api) {
        throw new Error("Application API client not initialized. Please refresh the page.");
      }

      let result;
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append("image", this.selectedFile);
        formData.append("fabric_type", fabricType);
        formData.append("quantity", quantity);
        result = await api.analyseColour(formData);
      } else {
        const hex = document.getElementById("manual-hex-input").value || "#F59E0B";
        result = await api.analyseColour({
          hex_code: hex,
          fabric_type: fabricType,
          quantity: quantity
        });
      }

      this.currentAnalysis = result;
      this.switchRightView("analysis");
      this.renderAnalysisOutput(result);
    } catch (err) {
      console.error("Colour analysis failure:", err);
      alert("Error analyzing colour: " + (err.message || err));
    } finally {
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Analyse Colour & Match Botanical Recipes
      `;
    }
  },

  renderAnalysisOutput(data) {
    document.getElementById("studio-empty-state").style.display = "none";
    document.getElementById("studio-analysis-content").style.display = "block";

    const a = data.analysis;
    const aiBadge = document.getElementById("studio-ai-badge");
    if (a.gemini_active) {
      aiBadge.className = "status-badge status-ready-for-extraction";
      aiBadge.innerHTML = `<span class="status-badge-dot"></span> Gemini Multimodal Verified`;
    } else {
      aiBadge.className = "status-badge status-extraction-in-progress";
      aiBadge.innerHTML = `<span class="status-badge-dot"></span> Deterministic Heritage CV`;
    }

    // Dominant Swatch
    document.getElementById("studio-dominant-swatch").style.backgroundColor = a.dominant_hex;
    document.getElementById("studio-dominant-hex").textContent = a.dominant_hex;
    document.getElementById("studio-dominant-rgb").textContent = `RGB(${a.dominant_rgb.join(", ")})`;
    document.getElementById("studio-color-family").textContent = a.color_family;

    // Palette Bar
    const paletteBar = document.getElementById("studio-palette-bar");
    if (a.swatches && a.swatches.length) {
      paletteBar.innerHTML = a.swatches.map(s => `
        <div class="palette-segment" style="width: ${s.percentage}%; background-color: ${s.hex}; cursor: pointer;" title="${s.hex} (${s.percentage}%) - Click to select" onclick="ColourStudioComponent.setPreset('${s.hex}')">
          ${s.percentage > 12 ? s.percentage + '%' : ''}
        </div>
      `).join("");
    }

    // Assessment text
    document.getElementById("studio-artisan-assessment").textContent = a.artisan_assessment || "Verified natural botanical spectrum candidate.";
    document.getElementById("studio-limits-note").textContent = a.achievability_limits || "";

    // Recipe Match Cards
    const cardsContainer = document.getElementById("studio-recipe-cards-container");
    if (!data.matched_recipes || !data.matched_recipes.length) {
      cardsContainer.innerHTML = `<div style="color: var(--color-text-muted); padding: 12px;">No matching recipes found for the selected fiber. Switch substrate or check directory.</div>`;
      return;
    }

    cardsContainer.innerHTML = data.matched_recipes.map((r) => `
      <div class="recipe-match-card">
        <div class="recipe-match-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="display: inline-block; width: 28px; height: 28px; border-radius: 6px; background-color: ${r.target_hex}; border: 1.5px solid rgba(0,0,0,0.15);"></span>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--color-forest);">${r.recipe_code || 'SAH'}</span>
                <span class="recipe-match-title">${r.recipe_name}</span>
              </div>
              <div style="font-size: 11.5px; color: var(--color-text-muted);">${r.botanical_name} (${r.common_name})</div>
            </div>
          </div>
          <div style="text-align: right;">
            <span class="status-badge ${r.delta_e < 8 ? 'status-ready-for-extraction' : 'status-input-validation-required'}">
              ΔE: ${r.delta_e} | ${r.confidence_percent}% Match
            </span>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0;">
          <span style="background: #F1F5F9; color: #475569; font-size: 10.5px; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
            ${r.shade_family || 'Botanical'}
          </span>
          <span style="background: rgba(45, 90, 67, 0.1); color: var(--color-forest); font-size: 10.5px; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
            ${r.process_type === 'reduced_vat' ? 'Vat Process (No Boil)' : r.process_type === 'sequential_overdye' ? 'Sequential Overdye' : r.process_type === 'iron_modifier' ? 'Iron Modifier' : 'Standard Extraction'}
          </span>
          ${r.combination_details ? `<span style="background: #FEF3C7; color: #B45309; font-size: 10.5px; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Combination Recipe</span>` : ''}
          <span style="background: #E0E7FF; color: #3730A3; font-size: 10.5px; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
            Substrate: ${r.fabric_type}
          </span>
        </div>

        <div class="recipe-meta-row" style="margin-top: 4px;">
          <div class="recipe-meta-item"><strong>Target Shade:</strong> ${r.target_colour_name || r.recipe_name}</div>
          <div class="recipe-meta-item"><strong>Ratio:</strong> 1:${Math.round(1/r.material_to_water_ratio)}</div>
          <div class="recipe-meta-item"><strong>Temp:</strong> ${r.extraction_temperature}°C</div>
          <div class="recipe-meta-item"><strong>Time:</strong> ${r.extraction_duration} min</div>
        </div>

        <div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 6px;">
          <strong>Achievability Assessment:</strong> ${r.achievability}
        </div>
        <div style="font-size: 11.5px; color: var(--color-forest); margin-bottom: 12px;">
          <strong>Artisan Protocol:</strong> ${r.recipe_notes || r.evidence_notes || 'Maintain gentle extraction temperature.'}
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn btn-sm btn-secondary" onclick="ColourStudioComponent.switchRightView('directory')">
            Browse All 20 Shades
          </button>
          <button class="btn btn-sm btn-primary" onclick="ColourStudioComponent.selectRecipe(${r.recipe_id})">
            Select Recipe & Proceed to Measurement →
          </button>
        </div>
      </div>
    `).join("");
  },

  async selectRecipe(recipeId) {
    const matched = this.currentAnalysis?.matched_recipes?.find(r => r.recipe_id === recipeId);
    const fabricWeight = parseFloat(document.getElementById("studio-quantity-input")?.value || "200");

    // Set globally in App state
    App.state.activeRecipe = matched;
    App.state.activeFabricWeight = fabricWeight;

    const api = window.API || (typeof API !== "undefined" ? API : null);
    if (api) {
      await api.calculateMeasurements(recipeId, fabricWeight);
    }
    App.navigate("measurement");
  },

  async directSelectRecipe(recipeId) {
    const shade = BOTANICAL_SHADES_DATA.find(s => s.id === recipeId);
    const fabricWeight = parseFloat(document.getElementById("studio-quantity-input")?.value || "200");

    const api = window.API || (typeof API !== "undefined" ? API : null);
    if (api) {
      const resp = await api.getRecipeById(recipeId);
      if (resp && resp.recipe) {
        App.state.activeRecipe = resp.recipe;
        App.state.activeFabricWeight = fabricWeight;
        await api.calculateMeasurements(recipeId, fabricWeight);
        App.navigate("measurement");
        return;
      }
    }

    // Fallback if network fails
    App.state.activeRecipe = {
      id: recipeId,
      recipe_code: shade?.code || "SAH-001",
      recipe_name: shade?.name || "Natural Dye Recipe",
      botanical_name: shade?.botanical || "Tagetes erecta",
      common_name: shade?.botanical?.split("(")[0]?.trim() || "Marigold",
      fabric_type: shade?.fabrics?.[0]?.toLowerCase() || "cotton",
      target_hex: shade?.hex || "#F59E0B",
      material_to_water_ratio: 0.05,
      extraction_temperature: 85.0,
      extraction_duration: 60
    };
    App.state.activeFabricWeight = fabricWeight;
    App.navigate("measurement");
  }
};

window.ColourStudioComponent = ColourStudioComponent;
