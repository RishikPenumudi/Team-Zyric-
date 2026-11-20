/**
 * SAHAJ AI - Overview Component
 * Central industrial dashboard with active telemetry, batch status, and production summary.
 */

const OverviewComponent = {
  render() {
    return `
      <div class="section-header">
        <h1 class="section-title">Production Overview</h1>
        <p class="section-subtitle">Real-time botanical dyeing telemetry, active batch progress, and machine interlocks</p>
      </div>

      <!-- Simulation / Live Hardware Alert Banner -->
      <div id="overview-hardware-banner" class="simulation-banner">
        <div>
          <strong>OPERATING MODE:</strong> <span id="overview-mode-label">SIMULATION MODE (Demo Mode)</span>
          <span style="margin-left: 10px; color: #78350F; font-size: 11.5px;">Physical hardware simulated with sensor noise and thermal curves.</span>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="App.navigate('settings')">Configure Hardware</button>
      </div>

      <!-- Quick Telemetry Grid -->
      <div class="grid-4" style="margin-bottom: 24px;">
        <div class="metric-card">
          <span class="metric-label">Vessel Temperature</span>
          <div class="metric-value-row">
            <span class="metric-value" id="overview-temp">25.0</span>
            <span class="metric-unit">°C</span>
          </div>
          <span class="metric-subtext" id="overview-temp-target">Target: 85.0°C | Safety Max: 95°C</span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Plant Material Load</span>
          <div class="metric-value-row">
            <span class="metric-value" id="overview-plant-wt">100.0</span>
            <span class="metric-unit">g</span>
          </div>
          <span class="metric-subtext" id="overview-scale-status">Load Cell: Calibrated</span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Water Input</span>
          <div class="metric-value-row">
            <span class="metric-value" id="overview-water-vol">1000</span>
            <span class="metric-unit">ml</span>
          </div>
          <span class="metric-subtext" id="overview-water-level">Level: 1.00 L (Above Interlock)</span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Actuator Relays</span>
          <div class="metric-value-row" style="font-size: 16px; font-weight: 700; gap: 12px; margin-top: 4px;">
            <div>Pump: <span id="overview-pump-status" style="color: var(--color-text-muted);">OFF</span></div>
            <div>Heater: <span id="overview-heater-status" style="color: var(--color-text-muted);">OFF</span></div>
          </div>
          <span class="metric-subtext" id="overview-e-stop">Safety Interlocks: PASS</span>
        </div>
      </div>

      <!-- Active Batch & Extraction Tracker -->
      <div class="grid-aside-main" style="margin-bottom: 24px;">
        <!-- Left: Active Batch Profile -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Active Production Batch
            </span>
            <span id="overview-process-badge" class="status-badge status-awaiting-inputs">
              <span class="status-badge-dot"></span> Awaiting Inputs
            </span>
          </div>
          <div class="card-body">
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
              <div id="overview-swatch" class="swatch-box" style="background-color: #D49B28;"></div>
              <div>
                <div style="font-size: 16px; font-weight: 700;" id="overview-recipe-name">Marigold Artisan Mustard Yellow</div>
                <div style="font-size: 12.5px; color: var(--color-text-muted);" id="overview-botanical-name">Tagetes erecta (Marigold Petals)</div>
                <div style="font-size: 11.5px; font-family: var(--font-mono); color: var(--color-forest);" id="overview-batch-number">Batch: BAT-2026-007</div>
              </div>
            </div>

            <div style="border-top: 1px solid var(--color-ivory-border); padding-top: 12px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: var(--color-text-muted);">Target Fabric:</span>
                <strong id="overview-fabric-type">Scoured Cotton</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: var(--color-text-muted);">Recipe Ratio:</span>
                <strong id="overview-recipe-ratio">1:10 (100g / 1000ml)</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: var(--color-text-muted);">Planned Duration:</span>
                <strong id="overview-planned-dur">45 mins @ 85.0°C</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--color-text-muted);">Predicted Dye Yield:</span>
                <strong id="overview-pred-yield" style="color: var(--color-forest);">~844 ml</strong>
              </div>
            </div>
          </div>
          <div class="card-footer" style="justify-content: space-between;">
            <button class="btn btn-sm btn-secondary" onclick="App.navigate('colour_studio')">New Colour Match</button>
            <button class="btn btn-sm btn-primary" onclick="App.navigate('measurement')">Proceed to Measurement</button>
          </div>
        </div>

        <!-- Right: Real-time Extraction Cycle Monitor -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Extraction Cycle Monitor
            </span>
            <span style="font-size: 12px; color: var(--color-text-muted);">Automated Thermal Agitation</span>
          </div>
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
              <span style="font-size: 13.5px; font-weight: 600;">Cycle Progress</span>
              <span id="overview-progress-text" style="font-family: var(--font-mono); font-weight: 700; font-size: 15px;">0% (0 / 45 mins)</span>
            </div>
            
            <div style="background-color: #E5E7EB; height: 16px; border-radius: 8px; overflow: hidden; margin-bottom: 16px;">
              <div id="overview-progress-bar" style="height: 100%; width: 0%; background-color: var(--color-forest); transition: width 0.3s ease;"></div>
            </div>

            <div class="grid-3" style="margin-top: 16px;">
              <div style="background: #FAF9F6; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--color-ivory-border);">
                <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted);">Elapsed Time</div>
                <div style="font-size: 18px; font-weight: 700; font-family: var(--font-mono);" id="overview-elapsed">00:00</div>
              </div>
              <div style="background: #FAF9F6; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--color-ivory-border);">
                <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted);">Collected Dye</div>
                <div style="font-size: 18px; font-weight: 700; font-family: var(--font-mono); color: var(--color-mustard-dark);" id="overview-collected">0 ml</div>
              </div>
              <div style="background: #FAF9F6; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--color-ivory-border);">
                <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted);">Safety Status</div>
                <div style="font-size: 15px; font-weight: 700; color: var(--color-success);" id="overview-safety-status">SECURE</div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-secondary" onclick="App.navigate('extraction')">View Extraction Controls</button>
            <button class="btn btn-mustard" onclick="App.navigate('yield')">Analyze Dye Yield</button>
          </div>
        </div>
      </div>

      <!-- Recent Batches Table -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent Production Batches</span>
          <button class="btn btn-sm btn-secondary" onclick="App.navigate('batch_history')">View Full History</button>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Batch Number</th>
                  <th>Target Shade</th>
                  <th>Botanical Source</th>
                  <th>Inputs (Plant / Water)</th>
                  <th>Yield (Pred / Actual)</th>
                  <th>Error %</th>
                  <th>Process Status</th>
                </tr>
              </thead>
              <tbody id="overview-recent-batches-tbody">
                <tr><td colspan="7" style="text-align: center; color: var(--color-text-muted); padding: 24px;">Loading recent production batches...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    await this.refreshData();
  },

  async refreshData() {
    try {
      const [sysStatus, procStatus, yieldHistory] = await Promise.all([
        API.getSystemStatus(),
        API.getProcessStatus(),
        API.getYieldHistory()
      ]);

      // Update hardware mode
      const isSim = sysStatus.is_simulated;
      const modeLabel = document.getElementById("overview-mode-label");
      if (modeLabel) {
        modeLabel.textContent = isSim ? "SIMULATION MODE (Demo Mode)" : "LIVE HARDWARE MODE (Connected)";
        modeLabel.style.color = isSim ? "#B45309" : "#15803D";
      }

      // Update Telemetry
      const sensors = sysStatus.telemetry.sensors;
      const actuators = sysStatus.telemetry.actuators;
      if (document.getElementById("overview-temp")) document.getElementById("overview-temp").textContent = sensors.temperature_c.toFixed(1);
      if (document.getElementById("overview-plant-wt")) document.getElementById("overview-plant-wt").textContent = sensors.plant_weight_g.toFixed(1);
      if (document.getElementById("overview-water-vol")) document.getElementById("overview-water-vol").textContent = Math.round(sensors.water_volume_ml);
      if (document.getElementById("overview-water-level")) document.getElementById("overview-water-level").textContent = `Level: ${sensors.water_level_litres.toFixed(2)} L (Above Interlock)`;
      
      const pumpEl = document.getElementById("overview-pump-status");
      const heatEl = document.getElementById("overview-heater-status");
      if (pumpEl) {
        pumpEl.textContent = actuators.pump;
        pumpEl.style.color = actuators.pump === "CIRCULATING" ? "#16A34A" : "var(--color-text-muted)";
      }
      if (heatEl) {
        heatEl.textContent = actuators.heater;
        heatEl.style.color = actuators.heater === "ON" ? "#DC2626" : "var(--color-text-muted)";
      }

      // Update Process Progress
      const proc = procStatus.process;
      const badge = document.getElementById("overview-process-badge");
      if (badge) {
        badge.className = `status-badge ${App.getStatusBadgeClass(proc.process_status)}`;
        badge.innerHTML = `<span class="status-badge-dot"></span> ${proc.process_status}`;
      }

      const pBar = document.getElementById("overview-progress-bar");
      const pText = document.getElementById("overview-progress-text");
      if (pBar) pBar.style.width = `${proc.progress_percent}%`;
      if (pText) {
        const mins = Math.floor(proc.elapsed_seconds / 60);
        const totalMins = Math.floor(proc.total_duration_seconds / 60);
        pText.textContent = `${proc.progress_percent}% (${mins} / ${totalMins} mins)`;
      }

      const elSec = proc.elapsed_seconds;
      const mm = String(Math.floor(elSec / 60)).padStart(2, "0");
      const ss = String(elSec % 60).padStart(2, "0");
      if (document.getElementById("overview-elapsed")) document.getElementById("overview-elapsed").textContent = `${mm}:${ss}`;
      if (document.getElementById("overview-collected")) document.getElementById("overview-collected").textContent = `${proc.collected_dye_output_ml} ml`;

      // Update Active Batch Info from App state
      if (App.state.activeRecipe) {
        const r = App.state.activeRecipe;
        if (document.getElementById("overview-swatch")) document.getElementById("overview-swatch").style.backgroundColor = r.target_hex;
        if (document.getElementById("overview-recipe-name")) document.getElementById("overview-recipe-name").textContent = r.recipe_name;
        if (document.getElementById("overview-botanical-name")) document.getElementById("overview-botanical-name").textContent = `${r.botanical_name} (${r.common_name})`;
        if (document.getElementById("overview-fabric-type")) document.getElementById("overview-fabric-type").textContent = r.fabric_type;
        if (document.getElementById("overview-recipe-ratio")) document.getElementById("overview-recipe-ratio").textContent = `1:${Math.round(1/r.material_to_water_ratio)}`;
        if (document.getElementById("overview-planned-dur")) document.getElementById("overview-planned-dur").textContent = `${r.extraction_duration} mins @ ${r.extraction_temperature}°C`;
      }

      // Update Recent Batches Table
      const tbody = document.getElementById("overview-recent-batches-tbody");
      if (tbody && yieldHistory.history) {
        if (yieldHistory.history.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-text-muted); padding: 20px;">No production batches recorded yet.</td></tr>`;
        } else {
          tbody.innerHTML = yieldHistory.history.slice(0, 5).map(b => `
            <tr>
              <td style="font-family: var(--font-mono); font-weight: 600;">${b.batch_number}</td>
              <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="display: inline-block; width: 14px; height: 14px; border-radius: 3px; background-color: ${b.target_hex};"></span>
                  <span>${b.target_colour_name || b.target_hex}</span>
                </div>
              </td>
              <td>${b.common_name}</td>
              <td>${b.plant_weight}g / ${Math.round(b.water_quantity)}ml</td>
              <td>${b.predicted_output ? Math.round(b.predicted_output) + ' ml' : '—'} / ${b.actual_output ? Math.round(b.actual_output) + ' ml' : '—'}</td>
              <td>
                ${b.percentage_error !== null && b.percentage_error !== undefined ?
                  `<strong style="color: ${b.percentage_error < 5 ? 'var(--color-success)' : 'var(--color-warning)'}">${b.percentage_error.toFixed(1)}%</strong>`
                  : '—'}
              </td>
              <td>
                <span class="status-badge ${App.getStatusBadgeClass(b.process_status)}">
                  <span class="status-badge-dot"></span> ${b.process_status}
                </span>
              </td>
            </tr>
          `).join("");
        }
      }
    } catch (e) {
      console.error("Overview refresh error:", e);
    }
  }
};

window.OverviewComponent = OverviewComponent;
