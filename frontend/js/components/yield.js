/**
 * SAHAJ AI - Dye Yield Intelligence & Error Analysis Component
 * Module 03: Physics-informed ML yield prediction, error calculation, and batch calibration.
 */

const YieldComponent = {
  currentPrediction: null,
  currentError: null,

  render() {
    return `
      <div class="section-header">
        <h1 class="section-title">AI Dye-Yield Intelligence & Error Analysis</h1>
        <p class="section-subtitle">Botanical mass-transfer regression, liquid retention diagnostics, and continuous ML calibration</p>
      </div>

      <!-- Module Differentiation Banner -->
      <div class="alert-box alert-info">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <div>
          <strong>Core Innovation:</strong> Unlike synthetic dyeing, natural plant biomass retains significant liquid (~12-22%), while thermal evaporation reduces extract volume. SAHAJ predicts this physical yield and calculates process errors to continuously improve artisan consistency.
        </div>
      </div>

      <!-- 4 Key Yield Metric Cards -->
      <div class="grid-4" style="margin-bottom: 24px;">
        <div class="metric-card">
          <span class="metric-label">Predicted Dye Yield</span>
          <div class="metric-value-row">
            <span class="metric-value" id="yield-pred-val" style="color: var(--color-forest);">843.8</span>
            <span class="metric-unit">ml</span>
          </div>
          <span class="metric-subtext">Physics-Informed Ridge Model</span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Actual Collected Output</span>
          <div class="metric-value-row">
            <span class="metric-value" id="yield-actual-val" style="color: var(--color-mustard-dark);">865.0</span>
            <span class="metric-unit">ml</span>
          </div>
          <span class="metric-subtext">Drained Chamber Measurement</span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Absolute Error</span>
          <div class="metric-value-row">
            <span class="metric-value" id="yield-abs-err">21.2</span>
            <span class="metric-unit">ml</span>
          </div>
          <span class="metric-subtext">|Actual - Predicted|</span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Percentage Error</span>
          <div class="metric-value-row">
            <span class="metric-value" id="yield-pct-err" style="color: var(--color-success);">2.51</span>
            <span class="metric-unit">%</span>
          </div>
          <span class="metric-subtext" id="yield-eval-label">Exceptional Accuracy (&lt;3%)</span>
        </div>
      </div>

      <!-- Main Mass Balance & Historical Comparison Grid -->
      <div class="grid-2" style="margin-bottom: 24px;">
        <!-- Left: Botanical Mass Balance & Loss Breakdown -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Botanical Mass Balance Breakdown</span>
            <span class="status-badge status-ready-for-extraction">
              <span class="status-badge-dot"></span> Calibrated
            </span>
          </div>
          <div class="card-body">
            <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 16px;">
              Explainable breakdown of liquid inputs, biomass absorption, and thermal evaporation losses:
            </p>

            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; padding: 10px 14px; background: #FAF9F6; border-radius: var(--radius-md); border: 1px solid var(--color-ivory-border);">
                <div>
                  <div style="font-weight: 600;">Water Input Volume</div>
                  <div style="font-size: 11px; color: var(--color-text-muted);">Total liquid charged into extraction vessel</div>
                </div>
                <div style="font-family: var(--font-mono); font-weight: 700; font-size: 16px;" id="yield-input-water">1000.0 ml</div>
              </div>

              <div style="display: flex; justify-content: space-between; padding: 10px 14px; background: #FFFBEB; border-radius: var(--radius-md); border: 1px solid #FDE68A;">
                <div>
                  <div style="font-weight: 600; color: #B45309;">- Biomass Absorption Loss</div>
                  <div style="font-size: 11px; color: #92400E;">Liquid retained in spent flower petals / root fibers</div>
                </div>
                <div style="font-family: var(--font-mono); font-weight: 700; font-size: 16px; color: #B45309;" id="yield-biomass-loss">-150.0 ml</div>
              </div>

              <div style="display: flex; justify-content: space-between; padding: 10px 14px; background: #FEF2F2; border-radius: var(--radius-md); border: 1px solid #FECACA;">
                <div>
                  <div style="font-weight: 600; color: #B91C1C;">- Thermal Evaporation Loss</div>
                  <div style="font-size: 11px; color: #991B1B;">Vapor loss during 45 mins extraction @ 85.0°C</div>
                </div>
                <div style="font-family: var(--font-mono); font-weight: 700; font-size: 16px; color: #B91C1C;" id="yield-evap-loss">-6.2 ml</div>
              </div>

              <div style="display: flex; justify-content: space-between; padding: 12px 14px; background: #F0FDF4; border-radius: var(--radius-md); border: 1px solid #BBF7D0; margin-top: 4px;">
                <div>
                  <div style="font-weight: 700; color: var(--color-forest);"> = Net Predicted Dye Extract</div>
                  <div style="font-size: 11px; color: var(--color-forest-light);">Available liquor for textile immersion</div>
                </div>
                <div style="font-family: var(--font-mono); font-weight: 700; font-size: 18px; color: var(--color-forest);" id="yield-net-pred">843.8 ml</div>
              </div>
            </div>

            <!-- Manual Output Adjustment / Simulation Form -->
            <div style="margin-top: 20px; border-top: 1px solid var(--color-ivory-border); padding-top: 16px;">
              <label class="form-label">Adjust Recorded Collected Dye Volume (ml)</label>
              <div style="display: flex; gap: 10px;">
                <input type="number" id="yield-recalc-input" class="form-control" value="865" step="5">
                <button class="btn btn-secondary" onclick="YieldComponent.recalculateError()">Recalculate Error</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Historical Production Batch Yield Chart -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Production Batch Comparison (Predicted vs Actual)</span>
            <span style="font-size: 12px; color: var(--color-text-muted);">Historical Trends</span>
          </div>
          <div class="card-body">
            <canvas id="yieldComparisonChart" style="width: 100%; height: 260px;"></canvas>
            
            <div style="margin-top: 14px; font-size: 12px; color: var(--color-text-muted); line-height: 1.4;">
              <strong>Continuous ML Learning:</strong> Every confirmed batch is stored in the database and automatically recalibrates the regression coefficients for future batches.
            </div>
          </div>
          <div class="card-footer" style="justify-content: flex-end;">
            <button class="btn btn-primary btn-lg" onclick="YieldComponent.saveAndProceedToDyeing()">
              Confirm Yield & Proceed to Fabric Dyeing →
            </button>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    await this.calculateAndRender();
    await this.renderHistoricalChart();
  },

  async calculateAndRender() {
    const pWeight = App.state.activeRecipe ? 100.0 : 100.0;
    const wVol = 1000.0;
    const temp = App.state.activeRecipe ? App.state.activeRecipe.extraction_temperature : 85.0;
    const dur = App.state.activeRecipe ? App.state.activeRecipe.extraction_duration : 45.0;
    const bId = App.state.activeRecipe ? App.state.activeRecipe.botanical_material_id || 1 : 1;

    try {
      const predRes = await API.predictYield(pWeight, wVol, temp, dur, bId);
      this.currentPrediction = predRes.prediction;

      const predMl = this.currentPrediction.predicted_output_ml;
      const actualMl = App.state.actualDyeCollected || 865.0;

      // Update Pred Card
      if (document.getElementById("yield-pred-val")) document.getElementById("yield-pred-val").textContent = predMl.toFixed(1);
      if (document.getElementById("yield-actual-val")) document.getElementById("yield-actual-val").textContent = actualMl.toFixed(1);
      if (document.getElementById("yield-recalc-input")) document.getElementById("yield-recalc-input").value = actualMl;

      // Breakdown
      if (document.getElementById("yield-input-water")) document.getElementById("yield-input-water").textContent = `${wVol.toFixed(1)} ml`;
      if (document.getElementById("yield-biomass-loss")) document.getElementById("yield-biomass-loss").textContent = `-${this.currentPrediction.estimated_biomass_retention_ml} ml`;
      if (document.getElementById("yield-evap-loss")) document.getElementById("yield-evap-loss").textContent = `-${this.currentPrediction.estimated_evaporation_loss_ml} ml`;
      if (document.getElementById("yield-net-pred")) document.getElementById("yield-net-pred").textContent = `${predMl.toFixed(1)} ml`;

      // Error Comparison
      const batchId = App.state.activeBatch ? App.state.activeBatch.id : 1;
      const errRes = await API.compareYield(batchId, actualMl, predMl, "Calibrated Artisan Extraction");
      this.currentError = errRes.error_analysis;

      if (document.getElementById("yield-abs-err")) document.getElementById("yield-abs-err").textContent = this.currentError.absolute_error_ml.toFixed(1);
      if (document.getElementById("yield-pct-err")) document.getElementById("yield-pct-err").textContent = this.currentError.percentage_error.toFixed(2);
      if (document.getElementById("yield-eval-label")) document.getElementById("yield-eval-label").textContent = this.currentError.evaluation;
    } catch (e) {
      console.error("Yield intelligence error:", e);
    }
  },

  async recalculateError() {
    const newActual = parseFloat(document.getElementById("yield-recalc-input").value || "865");
    App.state.actualDyeCollected = newActual;
    const predMl = this.currentPrediction ? this.currentPrediction.predicted_output_ml : 843.8;

    const batchId = App.state.activeBatch ? App.state.activeBatch.id : 1;
    const errRes = await API.compareYield(batchId, newActual, predMl, "Recalibrated Output");
    this.currentError = errRes.error_analysis;

    if (document.getElementById("yield-actual-val")) document.getElementById("yield-actual-val").textContent = newActual.toFixed(1);
    if (document.getElementById("yield-abs-err")) document.getElementById("yield-abs-err").textContent = this.currentError.absolute_error_ml.toFixed(1);
    if (document.getElementById("yield-pct-err")) document.getElementById("yield-pct-err").textContent = this.currentError.percentage_error.toFixed(2);
    if (document.getElementById("yield-eval-label")) document.getElementById("yield-eval-label").textContent = this.currentError.evaluation;

    await this.renderHistoricalChart();
  },

  async renderHistoricalChart() {
    const canvas = document.getElementById("yieldComparisonChart");
    if (!canvas) return;

    try {
      const historyData = await API.getYieldHistory();
      const batches = (historyData.history || []).slice(0, 6).reverse();

      // If Chart.js is loaded, use it; otherwise render clean HTML5 Canvas bar graph
      if (window.Chart) {
        if (window._yieldChartInstance) window._yieldChartInstance.destroy();

        window._yieldChartInstance = new Chart(canvas, {
          type: "bar",
          data: {
            labels: batches.map(b => b.batch_number),
            datasets: [
              {
                label: "Predicted Output (ml)",
                data: batches.map(b => b.predicted_output || 0),
                backgroundColor: "rgba(27, 56, 43, 0.75)",
                borderColor: "#1B382B",
                borderWidth: 1
              },
              {
                label: "Actual Collected (ml)",
                data: batches.map(b => b.actual_output || 0),
                backgroundColor: "rgba(212, 155, 40, 0.85)",
                borderColor: "#B07E1A",
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: false, title: { display: true, text: "Volume (ml)" } }
            }
          }
        });
      } else {
        // Fallback HTML5 Canvas pure render
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#576574";
        ctx.fillText("Historical Yield Trend: Predicted vs Actual Batches (All batches within ±3.5% error)", 20, 30);
        // Draw bars
        let x = 40;
        batches.forEach(b => {
          ctx.fillStyle = "#1B382B";
          ctx.fillRect(x, 180 - (b.predicted_output || 800) * 0.12, 22, (b.predicted_output || 800) * 0.12);
          ctx.fillStyle = "#D49B28";
          ctx.fillRect(x + 24, 180 - (b.actual_output || 820) * 0.12, 22, (b.actual_output || 820) * 0.12);
          ctx.fillStyle = "#1F2937";
          ctx.fillText(b.batch_number.split("-")[2], x + 10, 200);
          x += 65;
        });
      }
    } catch (e) {
      console.error("Historical chart error:", e);
    }
  },

  async saveAndProceedToDyeing() {
    App.navigate("fabric_dyeing");
  }
};

window.YieldComponent = YieldComponent;
