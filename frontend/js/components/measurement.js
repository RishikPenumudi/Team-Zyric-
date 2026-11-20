/**
 * SAHAJ AI - Smart Measurement Component
 * Module 02: Hardware-assisted botanical & water measurement with ±5% recipe tolerance locks.
 */

const MeasurementComponent = {
  currentCalculation: null,
  currentValidation: null,

  render() {
    return `
      <div class="section-header">
        <h1 class="section-title">Smart Raw Material & Water Measurement</h1>
        <p class="section-subtitle">Real-time load cell & water sensor telemetry with automated recipe tolerance verification</p>
      </div>

      <!-- Hardware Operating Mode Warning -->
      <div class="simulation-banner" id="measurement-hw-banner">
        <div>
          <strong>MODE:</strong> <span id="measurement-hw-mode">SIMULATION MODE (Demo Mode)</span>
          <span style="margin-left: 8px; color: #78350F; font-size: 11.5px;">Sensor telemetry generated for demonstration. Toggle to Live Hardware in Settings.</span>
        </div>
        <span class="status-badge status-ready-for-extraction">
          <span class="status-badge-dot"></span> Gateway Online
        </span>
      </div>

      <!-- Recipe Parameters Bar -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-body" style="padding: 16px 20px;">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div id="meas-recipe-swatch" class="swatch-box" style="width: 42px; height: 42px; background-color: #D49B28;"></div>
              <div>
                <div id="meas-recipe-name" style="font-size: 16px; font-weight: 700; color: var(--color-forest-dark);">Marigold Artisan Mustard Yellow</div>
                <div id="meas-botanical-name" style="font-size: 12px; color: var(--color-text-muted);">Tagetes erecta (100% dried flower petals)</div>
              </div>
            </div>

            <div style="display: flex; gap: 20px; font-size: 13px;">
              <div>
                <span style="color: var(--color-text-muted);">Fiber Substrate:</span>
                <strong id="meas-fabric-type">Scoured Cotton</strong>
              </div>
              <div>
                <span style="color: var(--color-text-muted);">Fabric Load:</span>
                <strong id="meas-fabric-load">200 g</strong>
              </div>
              <div>
                <span style="color: var(--color-text-muted);">Recipe Ratio:</span>
                <strong id="meas-recipe-ratio">1:10 (0.10)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Main Measurement Cards: Botanical Plant Weight & Water Volume -->
      <div class="grid-2" style="margin-bottom: 24px;">
        <!-- Card 1: Botanical Plant Weight Measurement -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>
              1. Botanical Material Weight (HX711 Load Cell)
            </span>
            <span id="meas-weight-tolerance-badge" class="status-badge status-awaiting-inputs">Checking...</span>
          </div>
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
              <div>
                <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted);">Target Recipe Weight</div>
                <div style="font-size: 28px; font-weight: 700; font-family: var(--font-mono); color: var(--color-forest-dark);" id="meas-target-weight">100.0 g</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted);">Actual Sensor Reading</div>
                <div style="font-size: 28px; font-weight: 700; font-family: var(--font-mono); color: var(--color-forest);" id="meas-actual-weight">100.5 g</div>
              </div>
            </div>

            <!-- Tolerance Visual Bar -->
            <div style="margin: 16px 0 6px;">
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--color-text-muted);">
                <span>-10%</span>
                <span style="color: var(--color-success); font-weight: 600;">Validated Limit (±5%)</span>
                <span>+10%</span>
              </div>
              <div class="tolerance-bar-container">
                <div class="tolerance-safe-zone"></div>
                <div class="tolerance-pointer" id="meas-weight-pointer" style="left: 51%;"></div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 10px;">
              <span>Deviation: <strong id="meas-weight-deviation">+0.5 g (+0.5%)</strong></span>
              <span id="meas-weight-limits-text" style="color: var(--color-text-muted);">Permitted: 95.0g - 105.0g</span>
            </div>

            <!-- Manual Test Slider (for simulation mode adjustments) -->
            <div style="margin-top: 20px; background: #FAF9F6; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--color-ivory-border);">
              <label class="form-label" style="font-size: 11px;">Simulation Fine Adjustment (Test Scale Weight)</label>
              <input type="range" id="meas-weight-slider" min="80" max="120" step="0.5" value="100.5" style="width: 100%; cursor: pointer;" oninput="MeasurementComponent.handleWeightSlider(this.value)">
            </div>
          </div>
        </div>

        <!-- Card 2: Water Input Measurement -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              2. Water Volume Input (Flow & Level Sensor)
            </span>
            <span id="meas-water-tolerance-badge" class="status-badge status-awaiting-inputs">Checking...</span>
          </div>
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
              <div>
                <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted);">Target Water Volume</div>
                <div style="font-size: 28px; font-weight: 700; font-family: var(--font-mono); color: var(--color-forest-dark);" id="meas-target-water">1000 ml</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted);">Actual Sensor Reading</div>
                <div style="font-size: 28px; font-weight: 700; font-family: var(--font-mono); color: var(--color-forest);" id="meas-actual-water">1010 ml</div>
              </div>
            </div>

            <!-- Tolerance Visual Bar -->
            <div style="margin: 16px 0 6px;">
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--color-text-muted);">
                <span>-10%</span>
                <span style="color: var(--color-success); font-weight: 600;">Validated Limit (±5%)</span>
                <span>+10%</span>
              </div>
              <div class="tolerance-bar-container">
                <div class="tolerance-safe-zone"></div>
                <div class="tolerance-pointer" id="meas-water-pointer" style="left: 52%;"></div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 10px;">
              <span>Deviation: <strong id="meas-water-deviation">+10 ml (+1.0%)</strong></span>
              <span id="meas-water-limits-text" style="color: var(--color-text-muted);">Permitted: 950ml - 1050ml</span>
            </div>

            <!-- Manual Test Slider (for simulation mode adjustments) -->
            <div style="margin-top: 20px; background: #FAF9F6; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--color-ivory-border);">
              <label class="form-label" style="font-size: 11px;">Simulation Fine Adjustment (Test Water Meter)</label>
              <input type="range" id="meas-water-slider" min="850" max="1150" step="10" value="1010" style="width: 100%; cursor: pointer;" oninput="MeasurementComponent.handleWaterSlider(this.value)">
            </div>
          </div>
        </div>
      </div>

      <!-- Validation Outcome & Safety Interlock Gateway -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Measurement Validation & Extraction Authorization</span>
          <span id="meas-overall-status-badge" class="status-badge status-awaiting-inputs">Evaluating Tolerance</span>
        </div>
        <div class="card-body">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div id="meas-validation-summary" style="font-size: 15px; font-weight: 700; color: var(--color-forest-dark);">
                Awaiting sensor confirmation
              </div>
              <div id="meas-interlock-note" style="font-size: 12px; color: var(--color-text-muted); margin-top: 4px;">
                Thermal limits (95°C max) and dry run interlocks (0.5L min) are continuously enforced by the hardware gateway.
              </div>
            </div>

            <div style="display: flex; gap: 12px;">
              <button class="btn btn-secondary" onclick="MeasurementComponent.recheckSensors()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                Re-check Sensors
              </button>
              <button class="btn btn-primary btn-lg" id="btn-proceed-extraction" onclick="MeasurementComponent.proceedToExtraction()">
                Confirm Measurements & Begin Extraction →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    await this.loadRecipeMeasurement();
  },

  async loadRecipeMeasurement() {
    const recipeId = App.state.activeRecipe ? App.state.activeRecipe.id || App.state.activeRecipe.recipe_id : 1;
    const fabricWeight = App.state.activeFabricWeight || 200.0;

    try {
      const data = await API.calculateMeasurements(recipeId, fabricWeight);
      this.currentCalculation = data;
      this.updateUI(data);
    } catch (e) {
      console.error("Failed to calculate measurements:", e);
    }
  },

  updateUI(data) {
    const calc = data.calculation;
    const r = data.recipe;
    const val = data.validation;
    const isSim = data.sensor_state.is_simulated;

    // Banner
    const hwMode = document.getElementById("measurement-hw-mode");
    if (hwMode) hwMode.textContent = isSim ? "SIMULATION MODE (Demo Mode)" : "LIVE HARDWARE MODE (Connected)";

    // Recipe Header
    if (document.getElementById("meas-recipe-swatch")) document.getElementById("meas-recipe-swatch").style.backgroundColor = r.target_hex;
    if (document.getElementById("meas-recipe-name")) {
      const code = r.recipe_code ? `[${r.recipe_code}] ` : "";
      document.getElementById("meas-recipe-name").textContent = `${code}${r.recipe_name}`;
    }
    if (document.getElementById("meas-botanical-name")) {
      const pType = r.process_type === 'reduced_vat' ? ' • Reduced Vat Chemistry (Ambient/Warm, No Boil)' : '';
      document.getElementById("meas-botanical-name").textContent = `${r.botanical_name} (${r.common_name})${pType}`;
    }
    if (document.getElementById("meas-fabric-type")) document.getElementById("meas-fabric-type").textContent = r.fabric_type;
    if (document.getElementById("meas-fabric-load")) document.getElementById("meas-fabric-load").textContent = `${calc.fabric_weight_g} g`;
    if (document.getElementById("meas-recipe-ratio")) document.getElementById("meas-recipe-ratio").textContent = calc.material_to_water_ratio;

    // Weight Targets & Actuals
    const pw = val.plant_weight;
    if (document.getElementById("meas-target-weight")) document.getElementById("meas-target-weight").textContent = `${pw.target_g} g`;
    if (document.getElementById("meas-actual-weight")) document.getElementById("meas-actual-weight").textContent = `${pw.actual_g} g`;
    if (document.getElementById("meas-weight-deviation")) {
      const devSign = pw.deviation_g >= 0 ? "+" : "";
      document.getElementById("meas-weight-deviation").textContent = `${devSign}${pw.deviation_g} g (${devSign}${pw.deviation_percent.toFixed(1)}%)`;
      document.getElementById("meas-weight-deviation").style.color = pw.is_within_tolerance ? "var(--color-success)" : "var(--color-danger)";
    }
    const minWt = (pw.target_g * 0.95).toFixed(1);
    const maxWt = (pw.target_g * 1.05).toFixed(1);
    if (document.getElementById("meas-weight-limits-text")) document.getElementById("meas-weight-limits-text").textContent = `Permitted: ${minWt}g - ${maxWt}g`;

    const wtBadge = document.getElementById("meas-weight-tolerance-badge");
    if (wtBadge) {
      wtBadge.className = `status-badge ${pw.is_within_tolerance ? 'status-ready-for-extraction' : 'status-process-attention-required'}`;
      wtBadge.innerHTML = `<span class="status-badge-dot"></span> ${pw.is_within_tolerance ? 'Within ±5% Tolerance' : 'Out of Tolerance'}`;
    }

    // Weight pointer position: 50% is target, ±10% maps to 0% - 100%
    const wtPctOffset = ((pw.actual_g - pw.target_g) / pw.target_g) * 100.0;
    const wtLeft = Math.max(0, Math.min(100, 50 + (wtPctOffset * 5)));
    const wtPointer = document.getElementById("meas-weight-pointer");
    if (wtPointer) wtPointer.style.left = `${wtLeft}%`;

    // Water Targets & Actuals
    const wv = val.water_volume;
    if (document.getElementById("meas-target-water")) document.getElementById("meas-target-water").textContent = `${Math.round(wv.target_ml)} ml`;
    if (document.getElementById("meas-actual-water")) document.getElementById("meas-actual-water").textContent = `${Math.round(wv.actual_ml)} ml`;
    if (document.getElementById("meas-water-deviation")) {
      const devSignW = wv.deviation_ml >= 0 ? "+" : "";
      document.getElementById("meas-water-deviation").textContent = `${devSignW}${Math.round(wv.deviation_ml)} ml (${devSignW}${wv.deviation_percent.toFixed(1)}%)`;
      document.getElementById("meas-water-deviation").style.color = wv.is_within_tolerance ? "var(--color-success)" : "var(--color-danger)";
    }
    const minWtr = Math.round(wv.target_ml * 0.95);
    const maxWtr = Math.round(wv.target_ml * 1.05);
    if (document.getElementById("meas-water-limits-text")) document.getElementById("meas-water-limits-text").textContent = `Permitted: ${minWtr}ml - ${maxWtr}ml`;

    const wtrBadge = document.getElementById("meas-water-tolerance-badge");
    if (wtrBadge) {
      wtrBadge.className = `status-badge ${wv.is_within_tolerance ? 'status-ready-for-extraction' : 'status-process-attention-required'}`;
      wtrBadge.innerHTML = `<span class="status-badge-dot"></span> ${wv.is_within_tolerance ? 'Within ±5% Tolerance' : 'Out of Tolerance'}`;
    }

    const wtrPctOffset = ((wv.actual_ml - wv.target_ml) / wv.target_ml) * 100.0;
    const wtrLeft = Math.max(0, Math.min(100, 50 + (wtrPctOffset * 5)));
    const wtrPointer = document.getElementById("meas-water-pointer");
    if (wtrPointer) wtrPointer.style.left = `${wtrLeft}%`;

    // Overall Status & Lockout Button
    const canProceed = val.can_proceed;
    const overallBadge = document.getElementById("meas-overall-status-badge");
    const summaryText = document.getElementById("meas-validation-summary");
    const btnProceed = document.getElementById("btn-proceed-extraction");

    if (overallBadge) {
      overallBadge.className = `status-badge ${canProceed ? 'status-ready-for-extraction' : 'status-process-attention-required'}`;
      overallBadge.innerHTML = `<span class="status-badge-dot"></span> ${canProceed ? 'Inputs Validated (Safe to Extract)' : 'Validation Lockout Active'}`;
    }

    if (summaryText) {
      summaryText.textContent = val.status_text;
      summaryText.style.color = canProceed ? "var(--color-forest-dark)" : "var(--color-danger)";
    }

    if (btnProceed) {
      btnProceed.disabled = !canProceed;
      if (!canProceed) {
        btnProceed.title = "Measurements must fall within ±5% of validated recipe limits before extraction can proceed.";
      } else {
        btnProceed.title = "";
      }
    }
  },

  async handleWeightSlider(val) {
    const pw = parseFloat(val);
    document.getElementById("meas-actual-weight").textContent = `${pw.toFixed(1)} g`;
    const res = await API.validateMeasurements(pw, null);
    this.updateUI({ ...this.currentCalculation, validation: res.validation });
  },

  async handleWaterSlider(val) {
    const wv = parseFloat(val);
    document.getElementById("meas-actual-water").textContent = `${Math.round(wv)} ml`;
    const res = await API.validateMeasurements(null, wv);
    this.updateUI({ ...this.currentCalculation, validation: res.validation });
  },

  async recheckSensors() {
    await this.loadRecipeMeasurement();
  },

  async proceedToExtraction() {
    const recipeId = App.state.activeRecipe ? (App.state.activeRecipe.id || App.state.activeRecipe.recipe_id) : 1;
    // Create new batch record if needed
    const batch = await API.createBatch(recipeId);
    App.state.activeBatch = batch.batch;
    App.navigate("extraction");
  }
};

window.MeasurementComponent = MeasurementComponent;
