/**
 * SAHAJ AI - Recipe Library Component
 * Complete 20 Natural-Dye Shade Recipes with Recipe CRUD, Version Audit, and Process Kinetics.
 */

const RecipeLibraryComponent = {
  allRecipes: [],
  filteredRecipes: [],
  activeShadeFamily: "all",
  activeProcessType: "all",
  activeBotanicalId: "all",
  activeStatus: "all",
  searchTerm: "",
  viewMode: "cards",

  render() {
    return `
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 class="section-title">Natural Dye Recipe Library (20 Core Shades)</h1>
          <p class="section-subtitle">Botanical formulas, single-source extracts, sequential overdyes, chemical modifiers, and colour suitability</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="display: flex; gap: 4px; background: #ECEAE4; padding: 3px; border-radius: var(--radius-sm);">
            <button class="btn btn-sm btn-secondary active" id="btn-recipe-view-cards" onclick="RecipeLibraryComponent.setViewMode('cards')">Cards View</button>
            <button class="btn btn-sm btn-secondary" id="btn-recipe-view-matrix" onclick="RecipeLibraryComponent.setViewMode('matrix')">Colour & Fabric Suitability Matrix</button>
          </div>
          <button class="btn btn-mustard btn-sm" onclick="RecipeLibraryComponent.openCreateModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add New Recipe
          </button>
        </div>
      </div>

      <!-- Experimental Protocol Notice -->
      <div class="alert-box alert-warning">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div>
          <strong>Initial Experimental Starting Protocols:</strong> These 20 formulas represent baseline botanical starting protocols. Actual shades depend on species harvest, water mineral content, fiber scouring, and mordanting. Entries are marked <em>Awaiting Validation</em> until verified on the physical SAHAJ platform.
        </div>
      </div>

      <!-- 4 Shade Family Category Tabs -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-body" style="padding: 12px 18px;">
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <button class="btn btn-sm btn-secondary active" id="tab-family-all" onclick="RecipeLibraryComponent.setShadeFamily('all', this)">
              All 20 Core Shades
            </button>
            <button class="btn btn-sm btn-secondary" id="tab-family-yellow" onclick="RecipeLibraryComponent.setShadeFamily('Yellow, Gold & Orange', this)">
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#F59E0B; margin-right:4px;"></span>
              1. Yellow, Gold & Orange (01–05)
            </button>
            <button class="btn btn-sm btn-secondary" id="tab-family-red" onclick="RecipeLibraryComponent.setShadeFamily('Red, Pink & Terracotta', this)">
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#B45309; margin-right:4px;"></span>
              2. Red, Pink & Terracotta (06–10)
            </button>
            <button class="btn btn-sm btn-secondary" id="tab-family-blue" onclick="RecipeLibraryComponent.setShadeFamily('Purple, Blue & Teal', this)">
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#1E3A8A; margin-right:4px;"></span>
              3. Purple, Blue & Teal (11–15)
            </button>
            <button class="btn btn-sm btn-secondary" id="tab-family-earth" onclick="RecipeLibraryComponent.setShadeFamily('Brown, Beige, Grey & Earthy', this)">
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#795548; margin-right:4px;"></span>
              4. Brown, Beige, Grey & Earthy (16–20)
            </button>
          </div>
        </div>
      </div>

      <!-- Comprehensive Filters Row -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-body" style="padding: 14px 20px;">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px;">
            <!-- Search -->
            <div style="flex: 1; min-width: 220px;">
              <input type="text" id="recipe-search-input" class="form-control" placeholder="Search by recipe name, code (SAH-001), botanical, or shade..." oninput="RecipeLibraryComponent.handleSearch(this.value)">
            </div>

            <!-- Botanical Dropdown -->
            <div>
              <select id="recipe-filter-botanical" class="form-control" style="font-size: 12.5px; width: 180px;" onchange="RecipeLibraryComponent.handleBotanicalFilter(this.value)">
                <option value="all">All Botanical Sources (11)</option>
                <option value="1">Marigold (Tagetes)</option>
                <option value="2">Indigo (Indigofera)</option>
                <option value="3">Madder (Rubia)</option>
                <option value="4">Pomegranate (Punica)</option>
                <option value="5">Turmeric (Curcuma)</option>
                <option value="6">Onion Skin (Allium)</option>
                <option value="7">Hibiscus (Roselle)</option>
                <option value="8">Red Cabbage (Brassica)</option>
                <option value="9">Black Tea (Camellia)</option>
                <option value="10">Spent Coffee (Coffea)</option>
                <option value="11">Eucalyptus (Eucalyptus)</option>
              </select>
            </div>

            <!-- Process Type -->
            <div>
              <select id="recipe-filter-process" class="form-control" style="font-size: 12.5px; width: 180px;" onchange="RecipeLibraryComponent.handleProcessFilter(this.value)">
                <option value="all">All Process Types</option>
                <option value="standard_extraction">Standard Extraction</option>
                <option value="reduced_vat">Reduced Vat (Indigo)</option>
                <option value="sequential_overdye">Sequential Overdye</option>
                <option value="iron_modifier">Iron Saddened Modifier</option>
                <option value="acid_modifier">Acid / pH Modifier</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <select id="recipe-filter-status" class="form-control" style="font-size: 12.5px; width: 160px;" onchange="RecipeLibraryComponent.handleStatusFilter(this.value)">
                <option value="all">All Statuses</option>
                <option value="Awaiting Validation">Awaiting Validation</option>
                <option value="validated">Validated (Calibrated)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Recipe Cards Grid -->
      <div id="recipes-grid-container" class="grid-2">
        <div style="color: var(--color-text-muted); padding: 20px;">Loading 20 natural dye recipes...</div>
      </div>

      <!-- Modal 1: Recipe Full Details & Version Audit Modal -->
      <div id="recipe-detail-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 100; align-items: center; justify-content: center;">
        <div class="card" style="width: 820px; max-width: 95%; max-height: 92vh; overflow-y: auto;">
          <div class="card-header">
            <span class="card-title" id="detail-modal-title">Recipe Protocol Specification</span>
            <button class="btn btn-sm btn-secondary" onclick="RecipeLibraryComponent.closeDetailModal()">✕ Close</button>
          </div>
          <div class="card-body" id="detail-modal-body">
            <!-- Populated dynamically -->
          </div>
        </div>
      </div>

      <!-- Modal 2: Edit / Create Recipe Modal -->
      <div id="recipe-edit-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 100; align-items: center; justify-content: center;">
        <div class="card" style="width: 820px; max-width: 95%; max-height: 92vh; overflow-y: auto;">
          <div class="card-header">
            <span class="card-title" id="edit-modal-title">Edit Recipe Parameters</span>
            <button class="btn btn-sm btn-secondary" onclick="RecipeLibraryComponent.closeEditModal()">✕ Close</button>
          </div>
          <div class="card-body">
            <input type="hidden" id="edit-recipe-id" value="">
            
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Recipe Code</label>
                <input type="text" id="edit-recipe-code" class="form-control" placeholder="SAH-001" style="font-family: var(--font-mono);">
              </div>
              <div class="form-group">
                <label class="form-label">Recipe Name</label>
                <input type="text" id="edit-recipe-name" class="form-control" placeholder="Marigold – Sun Yellow">
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Primary Botanical Source</label>
                <select id="edit-recipe-botanical" class="form-control">
                  <option value="1">Marigold (Tagetes spp.)</option>
                  <option value="2">True Indigo (Indigofera tinctoria)</option>
                  <option value="3">Indian Madder (Rubia cordifolia)</option>
                  <option value="4">Pomegranate Rind (Punica granatum)</option>
                  <option value="5">Turmeric (Curcuma longa)</option>
                  <option value="6">Yellow Onion Skin (Allium cepa)</option>
                  <option value="7">Hibiscus (Hibiscus sabdariffa)</option>
                  <option value="8">Red Cabbage (Brassica oleracea)</option>
                  <option value="9">Black Tea (Camellia sinensis)</option>
                  <option value="10">Spent Coffee Grounds (Coffea arabica)</option>
                  <option value="11">Eucalyptus Leaves (Eucalyptus globulus)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Shade Family</label>
                <select id="edit-recipe-family" class="form-control">
                  <option value="Yellow, Gold & Orange">Yellow, Gold & Orange</option>
                  <option value="Red, Pink & Terracotta">Red, Pink & Terracotta</option>
                  <option value="Purple, Blue & Teal">Purple, Blue & Teal</option>
                  <option value="Brown, Beige, Grey & Earthy">Brown, Beige, Grey & Earthy</option>
                </select>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Target Shade Name & HEX</label>
                <div style="display: flex; gap: 8px;">
                  <input type="color" id="edit-recipe-colorpicker" value="#F59E0B" onchange="document.getElementById('edit-recipe-hex').value = this.value">
                  <input type="text" id="edit-recipe-hex" class="form-control" value="#F59E0B" style="width: 110px; font-family: var(--font-mono);">
                  <input type="text" id="edit-recipe-colourname" class="form-control" value="Sun Yellow" placeholder="Colour Name">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Process Type</label>
                <select id="edit-recipe-processtype" class="form-control">
                  <option value="standard_extraction">Standard Thermal Extraction</option>
                  <option value="reduced_vat">Reduced Vat (No Boil / Indigo)</option>
                  <option value="sequential_overdye">Sequential Overdye</option>
                  <option value="iron_modifier">Iron Saddened Modifier</option>
                  <option value="acid_modifier">Acid / pH Shift Modifier</option>
                </select>
              </div>
            </div>

            <div class="grid-3">
              <div class="form-group">
                <label class="form-label">Extraction Temp (°C)</label>
                <input type="number" id="edit-recipe-exttemp" class="form-control" value="85" step="0.5">
              </div>
              <div class="form-group">
                <label class="form-label">Extraction Duration (min)</label>
                <input type="number" id="edit-recipe-extdur" class="form-control" value="60">
              </div>
              <div class="form-group">
                <label class="form-label">Plant:Water Ratio (e.g. 0.05 = 1:20)</label>
                <input type="number" id="edit-recipe-ratio" class="form-control" value="0.05" step="0.005">
              </div>
            </div>

            <div class="grid-3">
              <div class="form-group">
                <label class="form-label">Target pH</label>
                <input type="number" id="edit-recipe-ph" class="form-control" value="6.5" step="0.1">
              </div>
              <div class="form-group">
                <label class="form-label">Filtration Requirement</label>
                <input type="text" id="edit-recipe-filtration" class="form-control" value="Required (Muslin Cloth)">
              </div>
              <div class="form-group">
                <label class="form-label">Cooling Time (min)</label>
                <input type="number" id="edit-recipe-cooling" class="form-control" value="20">
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Dyeing Temp (°C)</label>
                <input type="number" id="edit-recipe-dyetemp" class="form-control" value="75.0" step="0.5">
              </div>
              <div class="form-group">
                <label class="form-label">Dyeing Duration (min)</label>
                <input type="number" id="edit-recipe-dyedur" class="form-control" value="45">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Mordant Specification</label>
              <input type="text" id="edit-recipe-mordant" class="form-control" placeholder='Alum 15% WOF pre-mordant / Iron modifier'>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Fabric Compatibility</label>
                <input type="text" id="edit-recipe-fabric" class="form-control" value="cotton, silk, wool">
              </div>
              <div class="form-group">
                <label class="form-label">Validation Status</label>
                <select id="edit-recipe-status" class="form-control">
                  <option value="Awaiting Validation">Awaiting Validation (Experimental Protocol)</option>
                  <option value="validated">Validated (Calibrated Benchmark)</option>
                  <option value="experimental">Experimental / Lab Trial</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Combination / Modifier Details</label>
              <input type="text" id="edit-recipe-combo" class="form-control" placeholder="e.g. Sequential overdye with Turmeric, or 2% Iron saddening bath">
            </div>

            <div class="form-group">
              <label class="form-label">Evidence / Protocol Source Notes</label>
              <textarea id="edit-recipe-evidence" class="form-control" rows="2" placeholder="Documented parameters, literature reference, or lab trial observations"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Audit Change Summary (Reason for edit)</label>
              <input type="text" id="edit-recipe-summary" class="form-control" placeholder="e.g. Adjusted extraction temperature for Ahimsa silk compatibility">
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
              <button class="btn btn-secondary" onclick="RecipeLibraryComponent.closeEditModal()">Cancel</button>
              <button class="btn btn-primary" onclick="RecipeLibraryComponent.saveRecipeForm()">Save Recipe</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    await this.loadRecipes();
  },

  async loadRecipes() {
    try {
      const data = await API.getRecipes({
        shadeFamily: this.activeShadeFamily === "all" ? null : this.activeShadeFamily,
        processType: this.activeProcessType === "all" ? null : this.activeProcessType,
        botanicalId: this.activeBotanicalId === "all" ? null : this.activeBotanicalId,
        validatedStatus: this.activeStatus === "all" ? null : this.activeStatus,
        search: this.searchTerm || null
      });
      this.allRecipes = data.recipes || [];
      this.renderRecipeCards();
    } catch (e) {
      console.error("Failed to load recipes:", e);
    }
  },

  setShadeFamily(family, btnElement) {
    this.activeShadeFamily = family;
    document.querySelectorAll("[id^='tab-family-']").forEach(b => b.classList.remove("active"));
    btnElement.classList.add("active");
    this.loadRecipes();
  },

  handleBotanicalFilter(val) {
    this.activeBotanicalId = val;
    this.loadRecipes();
  },

  handleProcessFilter(val) {
    this.activeProcessType = val;
    this.loadRecipes();
  },

  handleStatusFilter(val) {
    this.activeStatus = val;
    this.loadRecipes();
  },

  handleSearch(val) {
    this.searchTerm = val.trim();
    this.loadRecipes();
  },

  getProcessTypeLabel(type) {
    switch (type) {
      case "reduced_vat": return "Reduced Vat (No Boil)";
      case "sequential_overdye": return "Sequential Overdye";
      case "iron_modifier": return "Iron Saddening Modifier";
      case "acid_modifier": return "Acid / pH Shift";
      default: return "Standard Extraction";
    }
  },

  setViewMode(mode) {
    this.viewMode = mode;
    const btnCards = document.getElementById("btn-recipe-view-cards");
    const btnMatrix = document.getElementById("btn-recipe-view-matrix");
    if (btnCards && btnMatrix) {
      if (mode === "cards") {
        btnCards.classList.add("active");
        btnMatrix.classList.remove("active");
      } else {
        btnMatrix.classList.add("active");
        btnCards.classList.remove("active");
      }
    }
    this.renderRecipeCards();
  },

  renderSuitabilityMatrix(container) {
    if (this.allRecipes.length === 0) {
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--color-text-muted); padding: 50px;">No recipes match the selected filters.</div>`;
      return;
    }

    container.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; overflow-x: auto; padding: 0;">
        <table class="table" style="width: 100%; border-collapse: collapse; font-size: 12px; min-width: 860px;">
          <thead>
            <tr style="background: #F8F7F4; border-bottom: 2px solid var(--color-ivory-border); text-align: left;">
              <th style="padding: 10px 12px; width: 50px; text-align: center;">Swatch</th>
              <th style="padding: 10px 12px;">Recipe & Botanical</th>
              <th style="padding: 10px 12px;">Achievable Colour Type</th>
              <th style="padding: 10px 12px;">Fabric Substrates</th>
              <th style="padding: 10px 12px;">Mordant / Chemistry</th>
              <th style="padding: 10px 12px;">Extraction Kinetics</th>
              <th style="padding: 10px 12px; text-align: right;">Batch Action</th>
            </tr>
          </thead>
          <tbody>
            ${this.allRecipes.map(r => {
              let mordant = {};
              try { mordant = JSON.parse(r.mordant_information); } catch(_) { mordant = { type: r.mordant_information }; }
              const code = r.recipe_code || `SAH-${String(r.id).padStart(3, '0')}`;
              const fabrics = (r.fabric_type || "").split(",").map(f => f.trim());

              return `
                <tr style="border-bottom: 1px solid var(--color-ivory-border); vertical-align: middle;">
                  <td style="padding: 10px 12px; text-align: center;">
                    <span style="display: inline-block; width: 28px; height: 28px; border-radius: 6px; background-color: ${r.target_hex}; border: 1.5px solid rgba(0,0,0,0.15); box-shadow: 0 1px 2px rgba(0,0,0,0.1);"></span>
                    <div style="font-size: 9.5px; font-family: var(--font-mono); color: var(--color-text-muted); margin-top: 2px;">${r.target_hex}</div>
                  </td>
                  <td style="padding: 10px 12px;">
                    <div style="font-weight: 700; color: var(--color-forest-dark); font-size: 12.5px;">${r.recipe_name}</div>
                    <div style="font-family: var(--font-mono); font-size: 10.5px; color: var(--color-forest);">${code}</div>
                    <div style="font-size: 11px; color: var(--color-text-muted);">${r.botanical_name} (${r.common_name})</div>
                  </td>
                  <td style="padding: 10px 12px;">
                    <div style="font-weight: 600; color: var(--color-text-main); font-size: 12px;">${r.target_colour_name || r.recipe_name}</div>
                    <span style="display: inline-block; background: #F1F5F9; color: #475569; font-size: 10px; padding: 2px 6px; border-radius: 3px; font-weight: 600; margin-top: 3px;">
                      ${r.shade_family || 'Botanical'}
                    </span>
                  </td>
                  <td style="padding: 10px 12px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                      ${fabrics.map(f => {
                        const isCotton = f.toLowerCase().includes('cotton');
                        const isSilk = f.toLowerCase().includes('silk');
                        const bg = isCotton ? '#EFF6FF' : isSilk ? '#FAF5FF' : '#FDF4FF';
                        const color = isCotton ? '#1D4ED8' : isSilk ? '#6D28D9' : '#86198F';
                        return `<span style="background: ${bg}; color: ${color}; font-size: 10px; padding: 2px 6px; border-radius: 3px; font-weight: 600; text-transform: capitalize;">${f}</span>`;
                      }).join('')}
                    </div>
                  </td>
                  <td style="padding: 10px 12px; font-size: 11.5px;">
                    <div style="font-weight: 600; color: var(--color-text-main);">${mordant.type || r.mordant_information || 'Alum'}</div>
                    ${mordant.percentage ? `<div style="font-size: 10.5px; color: var(--color-text-muted);">${mordant.percentage}</div>` : ''}
                  </td>
                  <td style="padding: 10px 12px; font-size: 11px;">
                    <div><strong>${r.extraction_temperature}°C</strong> for <strong>${r.extraction_duration}m</strong></div>
                    <div style="color: var(--color-text-muted);">Ratio 1:${Math.round(1/r.material_to_water_ratio)} | pH ${r.ph_target || 6.5}</div>
                  </td>
                  <td style="padding: 10px 12px; text-align: right; white-space: nowrap;">
                    <div style="display: flex; gap: 4px; justify-content: flex-end;">
                      <button class="btn btn-sm btn-secondary" style="padding: 3px 8px; font-size: 11px;" onclick="RecipeLibraryComponent.openDetailModal(${r.id})">
                        Spec
                      </button>
                      <button class="btn btn-sm btn-mustard" style="padding: 3px 8px; font-size: 11px;" onclick="RecipeLibraryComponent.selectRecipeForBatch(${r.id})">
                        Select →
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderRecipeCards() {
    const container = document.getElementById("recipes-grid-container");
    if (!container) return;

    if (this.viewMode === "matrix") {
      this.renderSuitabilityMatrix(container);
      return;
    }

    if (this.allRecipes.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: var(--color-text-muted); padding: 50px;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <div style="font-size: 16px; font-weight: 600; color: var(--color-forest-dark);">No Recipes Found</div>
          <p style="font-size: 13px; margin-top: 4px;">Try adjusting your botanical filter, shade family, or search query.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.allRecipes.map(r => {
      let mordant = {};
      try { mordant = JSON.parse(r.mordant_information); } catch(_) { mordant = { type: r.mordant_information }; }
      const code = r.recipe_code || `SAH-${String(r.id).padStart(3, '0')}`;
      const isAwaiting = (r.validated_status || "").toLowerCase().includes("awaiting");

      return `
        <div class="card" style="position: relative;">
          <div class="card-header" style="justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="display: inline-block; width: 28px; height: 28px; border-radius: 6px; background-color: ${r.target_hex}; border: 1.5px solid rgba(0,0,0,0.15); box-shadow: 0 1px 3px rgba(0,0,0,0.1);"></span>
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--color-forest);">${code}</span>
                  <span class="card-title" style="font-size: 15px;">${r.recipe_name}</span>
                </div>
                <div style="font-size: 11.5px; color: var(--color-text-muted);">${r.botanical_name} (${r.common_name})</div>
              </div>
            </div>

            <div style="text-align: right;">
              <span class="status-badge ${isAwaiting ? 'status-input-validation-required' : 'status-ready-for-extraction'}" style="font-size: 11px;">
                <span class="status-badge-dot"></span> ${r.validated_status}
              </span>
            </div>
          </div>

          <div class="card-body">
            <!-- Process & Shade Badges -->
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
              <span style="background: #F1F5F9; color: #475569; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 600;">
                ${r.shade_family || 'Natural Botanical'}
              </span>
              <span style="background: rgba(45, 90, 67, 0.1); color: var(--color-forest); font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 600;">
                ${this.getProcessTypeLabel(r.process_type)}
              </span>
              ${r.combination_details ? `<span style="background: #FEF3C7; color: #B45309; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 600;">Combination Recipe</span>` : ''}
            </div>

            <!-- Kinetic Specs Grid -->
            <div class="grid-4" style="background: #FAF9F6; padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--color-ivory-border); margin-bottom: 12px; text-align: center;">
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: var(--color-text-muted);">Extr. Temp</div>
                <div style="font-size: 14px; font-weight: 700; font-family: var(--font-mono); color: var(--color-forest-dark);">${r.extraction_temperature}°C</div>
              </div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: var(--color-text-muted);">Duration</div>
                <div style="font-size: 14px; font-weight: 700; font-family: var(--font-mono); color: var(--color-forest-dark);">${r.extraction_duration} min</div>
              </div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: var(--color-text-muted);">Ratio</div>
                <div style="font-size: 14px; font-weight: 700; font-family: var(--font-mono); color: var(--color-forest-dark);">1:${Math.round(1/r.material_to_water_ratio)}</div>
              </div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: var(--color-text-muted);">Target pH</div>
                <div style="font-size: 14px; font-weight: 700; font-family: var(--font-mono); color: var(--color-forest-dark);">${r.ph_target || 6.5}</div>
              </div>
            </div>

            <div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 6px;">
              <strong>Mordant:</strong> ${mordant.type || r.mordant_information || 'Alum'}
            </div>
            <div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 10px;">
              <strong>Fiber Compatibility:</strong> ${r.fabric_type}
            </div>

            <p style="font-size: 12px; color: var(--color-text-main); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${r.recipe_notes || r.evidence_notes || ''}
            </p>
          </div>

          <div class="card-footer" style="justify-content: space-between; padding: 12px 16px;">
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-sm btn-secondary" onclick="RecipeLibraryComponent.openDetailModal(${r.id})">
                Protocol & Versions
              </button>
              <button class="btn btn-sm btn-secondary" onclick="RecipeLibraryComponent.openEditModal(${r.id})">
                Edit
              </button>
            </div>
            <button class="btn btn-sm btn-primary" onclick="RecipeLibraryComponent.selectRecipe(${r.id})">
              Measure & Dye →
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  async openDetailModal(recipeId) {
    try {
      const data = await API.getRecipeById(recipeId);
      const r = data.recipe;
      const versions = data.versions || [];
      const batches = data.linked_batches || [];

      let mordant = {};
      try { mordant = JSON.parse(r.mordant_information); } catch(_) { mordant = { type: r.mordant_information }; }

      const body = document.getElementById("detail-modal-body");
      document.getElementById("detail-modal-title").textContent = `[${r.recipe_code || 'SAH'}] ${r.recipe_name}`;

      body.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--color-ivory-border);">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 8px; background-color: ${r.target_hex}; border: 1.5px solid rgba(0,0,0,0.2);"></div>
            <div>
              <div style="font-size: 17px; font-weight: 700; color: var(--color-forest-dark);">${r.target_colour_name} (${r.target_hex})</div>
              <div style="font-size: 13px; color: var(--color-text-muted);">${r.botanical_name} — ${r.common_name}</div>
            </div>
          </div>
          <span class="status-badge ${r.validated_status.includes('Awaiting') ? 'status-input-validation-required' : 'status-ready-for-extraction'}">
            <span class="status-badge-dot"></span> ${r.validated_status}
          </span>
        </div>

        <!-- 2 Columns: Extraction vs Dyeing -->
        <div class="grid-2" style="margin-bottom: 16px;">
          <!-- Extraction Kinetics -->
          <div style="background: #FAF9F6; border: 1px solid var(--color-ivory-border); border-radius: var(--radius-md); padding: 14px;">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-forest); margin-bottom: 8px;">
              Extraction Parameters
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12.5px;">
              <div style="display: flex; justify-content: space-between;"><span>Process Type:</span> <strong>${this.getProcessTypeLabel(r.process_type)}</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>Extraction Temp:</span> <strong>${r.extraction_temperature}°C</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>Extraction Duration:</span> <strong>${r.extraction_duration} minutes</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>Plant-to-Water Ratio:</span> <strong>1:${Math.round(1/r.material_to_water_ratio)} (${r.material_to_water_ratio})</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>Filtration Method:</span> <strong>${r.filtration || 'Muslin Cloth'}</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>Target Extraction pH:</span> <strong>${r.ph_target || 6.5}</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>Cooling Duration:</span> <strong>${r.cooling_mins || 20} minutes</strong></div>
            </div>
          </div>

          <!-- Fabric Dyeing Parameters -->
          <div style="background: #FAF9F6; border: 1px solid var(--color-ivory-border); border-radius: var(--radius-md); padding: 14px;">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-forest); margin-bottom: 8px;">
              Fabric Dyeing Specifications
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12.5px;">
              <div style="display: flex; justify-content: space-between;"><span>Substrate Compatibility:</span> <strong>${r.fabric_type}</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>Dyeing Bath Temp:</span> <strong>${r.dyeing_temperature || 75.0}°C</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>Immersion Time:</span> <strong>${r.dyeing_duration || 45} minutes</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>Liquor-to-Goods Ratio:</span> <strong>1:20 (Cotton) / 1:25 (Silk/Wool)</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>Mordant Protocol:</span> <strong>${mordant.type || r.mordant_information}</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>Timing:</span> <strong>${mordant.timing || 'Pre-mordant'}</strong></div>
            </div>
          </div>
        </div>

        <!-- Evidence & Combination Notes -->
        <div style="background: #FFF; border: 1px solid var(--color-ivory-border); border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px;">
          <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-forest); margin-bottom: 6px;">
            Evidence & Technical Protocol Notes
          </div>
          <div style="font-size: 12.5px; color: var(--color-text-main); line-height: 1.4;">
            ${r.evidence_notes || r.recipe_notes || 'Initial experimental starting protocol.'}
          </div>
          ${r.combination_details ? `
            <div style="margin-top: 8px; font-size: 12px; color: #B45309;">
              <strong>Combination Specifics:</strong> ${r.combination_details}
            </div>
          ` : ''}
        </div>

        <!-- Version Audit Trail -->
        <div style="margin-top: 16px;">
          <div style="font-size: 13px; font-weight: 700; color: var(--color-forest-dark); margin-bottom: 8px;">
            Version History & Change Audit Trail
          </div>
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Modified By</th>
                  <th>Date & Time</th>
                  <th>Summary of Change</th>
                </tr>
              </thead>
              <tbody>
                ${versions.map(v => `
                  <tr>
                    <td><strong>v${v.version_number}</strong></td>
                    <td>${v.changed_by}</td>
                    <td style="font-size: 11px; color: var(--color-text-muted);">${new Date(v.changed_at).toLocaleString()}</td>
                    <td>${v.change_summary || 'Parameter update'}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
          <button class="btn btn-secondary" onclick="RecipeLibraryComponent.openEditModal(${r.id})">Edit Parameters</button>
          <button class="btn btn-primary" onclick="RecipeLibraryComponent.selectRecipe(${r.id})">Use Recipe for Batch →</button>
        </div>
      `;

      document.getElementById("recipe-detail-modal").style.display = "flex";
    } catch (e) {
      alert("Error loading recipe detail: " + e.message);
    }
  },

  closeDetailModal() {
    document.getElementById("recipe-detail-modal").style.display = "none";
  },

  async openEditModal(recipeId = null) {
    this.closeDetailModal();
    const modal = document.getElementById("recipe-edit-modal");
    modal.style.display = "flex";

    if (recipeId) {
      document.getElementById("edit-modal-title").textContent = "Edit Recipe Parameters";
      document.getElementById("edit-recipe-id").value = recipeId;
      try {
        const data = await API.getRecipeById(recipeId);
        const r = data.recipe;

        document.getElementById("edit-recipe-code").value = r.recipe_code || "";
        document.getElementById("edit-recipe-name").value = r.recipe_name || "";
        document.getElementById("edit-recipe-botanical").value = r.botanical_material_id || 1;
        document.getElementById("edit-recipe-family").value = r.shade_family || "Yellow, Gold & Orange";
        document.getElementById("edit-recipe-colorpicker").value = r.target_hex || "#F59E0B";
        document.getElementById("edit-recipe-hex").value = r.target_hex || "#F59E0B";
        document.getElementById("edit-recipe-colourname").value = r.target_colour_name || "";
        document.getElementById("edit-recipe-processtype").value = r.process_type || "standard_extraction";
        document.getElementById("edit-recipe-exttemp").value = r.extraction_temperature || 85.0;
        document.getElementById("edit-recipe-extdur").value = r.extraction_duration || 60;
        document.getElementById("edit-recipe-ratio").value = r.material_to_water_ratio || 0.05;
        document.getElementById("edit-recipe-ph").value = r.ph_target || 6.5;
        document.getElementById("edit-recipe-filtration").value = r.filtration || "Required (Muslin Cloth)";
        document.getElementById("edit-recipe-cooling").value = r.cooling_mins || 20;
        document.getElementById("edit-recipe-dyetemp").value = r.dyeing_temperature || 75.0;
        document.getElementById("edit-recipe-dyedur").value = r.dyeing_duration || 45;
        document.getElementById("edit-recipe-mordant").value = typeof r.mordant_information === "string" ? r.mordant_information : JSON.stringify(r.mordant_information);
        document.getElementById("edit-recipe-fabric").value = r.fabric_type || "cotton, silk, wool";
        document.getElementById("edit-recipe-status").value = r.validated_status || "Awaiting Validation";
        document.getElementById("edit-recipe-combo").value = r.combination_details || "";
        document.getElementById("edit-recipe-evidence").value = r.evidence_notes || "";
        document.getElementById("edit-recipe-summary").value = "Updated extraction and dyeing parameters";
      } catch (e) {
        alert("Failed to load recipe for editing: " + e.message);
      }
    } else {
      // Create New Recipe
      document.getElementById("edit-modal-title").textContent = "Create New Botanical Recipe";
      document.getElementById("edit-recipe-id").value = "";
      document.getElementById("edit-recipe-code").value = `SAH-${String(this.allRecipes.length + 1).padStart(3, '0')}`;
      document.getElementById("edit-recipe-name").value = "";
      document.getElementById("edit-recipe-colourname").value = "";
      document.getElementById("edit-recipe-hex").value = "#F59E0B";
      document.getElementById("edit-recipe-colorpicker").value = "#F59E0B";
      document.getElementById("edit-recipe-evidence").value = "";
      document.getElementById("edit-recipe-summary").value = "New custom recipe creation";
    }
  },

  openCreateModal() {
    this.openEditModal(null);
  },

  closeEditModal() {
    document.getElementById("recipe-edit-modal").style.display = "none";
  },

  async saveRecipeForm() {
    const id = document.getElementById("edit-recipe-id").value;
    const payload = {
      recipe_code: document.getElementById("edit-recipe-code").value.trim(),
      recipe_name: document.getElementById("edit-recipe-name").value.trim(),
      botanical_material_id: parseInt(document.getElementById("edit-recipe-botanical").value),
      shade_family: document.getElementById("edit-recipe-family").value,
      target_colour_name: document.getElementById("edit-recipe-colourname").value.trim(),
      target_hex: document.getElementById("edit-recipe-hex").value.trim().toUpperCase(),
      process_type: document.getElementById("edit-recipe-processtype").value,
      extraction_temperature: parseFloat(document.getElementById("edit-recipe-exttemp").value),
      extraction_duration: parseInt(document.getElementById("edit-recipe-extdur").value),
      material_to_water_ratio: parseFloat(document.getElementById("edit-recipe-ratio").value),
      ph_target: parseFloat(document.getElementById("edit-recipe-ph").value),
      filtration: document.getElementById("edit-recipe-filtration").value.trim(),
      cooling_mins: parseInt(document.getElementById("edit-recipe-cooling").value),
      dyeing_temperature: parseFloat(document.getElementById("edit-recipe-dyetemp").value),
      dyeing_duration: parseInt(document.getElementById("edit-recipe-dyedur").value),
      mordant_information: document.getElementById("edit-recipe-mordant").value.trim(),
      fabric_type: document.getElementById("edit-recipe-fabric").value.trim(),
      validated_status: document.getElementById("edit-recipe-status").value,
      combination_details: document.getElementById("edit-recipe-combo").value.trim(),
      evidence_notes: document.getElementById("edit-recipe-evidence").value.trim(),
      change_summary: document.getElementById("edit-recipe-summary").value.trim()
    };

    if (!payload.recipe_name) {
      alert("Please enter a Recipe Name.");
      return;
    }

    try {
      if (id) {
        await API.updateRecipe(id, payload);
        alert("Recipe updated successfully!");
      } else {
        await API.createRecipe(payload);
        alert("New recipe added to library!");
      }
      this.closeEditModal();
      await this.loadRecipes();
    } catch (err) {
      alert("Failed to save recipe: " + err.message);
    }
  },

  async selectRecipe(recipeId) {
    this.closeDetailModal();
    const selected = this.allRecipes.find(r => r.id === recipeId);
    if (!selected) return;

    App.state.activeRecipe = selected;
    App.state.activeFabricWeight = 200.0;
    await API.calculateMeasurements(recipeId, 200.0);
    App.navigate("measurement");
  }
};

window.RecipeLibraryComponent = RecipeLibraryComponent;
