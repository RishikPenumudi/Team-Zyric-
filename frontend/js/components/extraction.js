/**
 * SAHAJ AI - Extraction Control Component
 * Module 04 (Part 1): Real-time thermal agitation monitoring, safety interlocks, and cycle completion.
 */

const ExtractionComponent = {
  timerInterval: null,

  render() {
    return `
      <div class="section-header">
        <h1 class="section-title">Extraction Process Control</h1>
        <p class="section-subtitle">Vessel temperature regulation, circulation pump management, and automated extraction completion</p>
      </div>

      <!-- Safety & Interlock Notice Banner -->
      <div class="alert-box alert-success" id="ext-safety-banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <div>
          <strong>Deterministic Safety Active:</strong> Heating is locked below 95.0°C and requires >0.5L water level. Local hardware controls maintain emergency cutoffs independently of AI software.
        </div>
      </div>

      <div class="grid-aside-main" style="margin-bottom: 24px;">
        <!-- Left: Batch Telemetry & Actuator Controls -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Machine Controls & Status</span>
            <span id="ext-status-badge" class="status-badge status-ready-for-extraction">
              <span class="status-badge-dot"></span> Ready for Extraction
            </span>
          </div>
          <div class="card-body">
            <div style="margin-bottom: 16px;">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted);">Current Batch</div>
              <div id="ext-batch-num" style="font-size: 18px; font-weight: 700; font-family: var(--font-mono); color: var(--color-forest-dark);">BAT-2026-007</div>
              <div id="ext-recipe-name" style="font-size: 13px; color: var(--color-text-muted);">Marigold Artisan Mustard Yellow (Cotton)</div>
            </div>

            <!-- Temperature Meter Card -->
            <div style="background: #FAF9F6; border: 1px solid var(--color-ivory-border); border-radius: var(--radius-md); padding: 14px; margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-size: 12px; font-weight: 600; color: var(--color-text-muted);">VESSEL TEMPERATURE</span>
                <span id="ext-temp-badge" class="status-badge status-awaiting-inputs" style="font-size: 10px;">Heating Standby</span>
              </div>
              <div style="display: flex; align-items: baseline; gap: 6px; margin: 4px 0;">
                <span id="ext-temp-val" style="font-size: 32px; font-weight: 700; font-family: var(--font-mono); color: var(--color-forest-dark);">25.0</span>
                <span style="font-size: 16px; color: var(--color-text-muted);">°C</span>
              </div>
              <div style="font-size: 11.5px; color: var(--color-text-muted);">Setpoint: <strong id="ext-target-temp">85.0°C</strong> | Limit: 95.0°C</div>
            </div>

            <!-- Actuator Relays Grid -->
            <div class="grid-2" style="margin-bottom: 16px;">
              <div style="background: #FFF; border: 1px solid var(--color-ivory-border); border-radius: var(--radius-md); padding: 10px;">
                <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted);">Heater Element</div>
                <div id="ext-heater-val" style="font-size: 16px; font-weight: 700; color: var(--color-text-muted);">OFF</div>
              </div>
              <div style="background: #FFF; border: 1px solid var(--color-ivory-border); border-radius: var(--radius-md); padding: 10px;">
                <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted);">Circulation Pump</div>
                <div id="ext-pump-val" style="font-size: 16px; font-weight: 700; color: var(--color-text-muted);">OFF</div>
              </div>
            </div>

            <!-- Extraction Trigger Buttons -->
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <button class="btn btn-primary btn-lg" id="btn-start-extraction" onclick="ExtractionComponent.startCycle()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Start Automated Extraction
              </button>

              <button class="btn btn-mustard" id="btn-fast-forward" onclick="ExtractionComponent.fastForward()" style="display: none;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/></svg>
                Fast-Forward Simulation (Complete 45 min)
              </button>

              <button class="btn btn-secondary" onclick="ExtractionComponent.resetBatch()">
                Reset Machine State
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Real-time Extraction Chamber Visualizer -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Extraction Chamber Telemetry</span>
            <span id="ext-timer-display" style="font-family: var(--font-mono); font-weight: 700; font-size: 16px;">00:00 / 45:00</span>
          </div>
          <div class="card-body">
            <!-- Simulated Extraction Tank Visualizer -->
            <div style="background: #14281E; border-radius: var(--radius-lg); height: 260px; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; padding: 20px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);">
              <!-- Bubble/Steam Animation overlay -->
              <div id="ext-steam-layer" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 80%, rgba(212, 155, 40, 0.25), transparent 70%); opacity: 0; transition: opacity 0.5s ease;"></div>

              <!-- Liquor Level in Tank -->
              <div id="ext-tank-liquid" style="background: linear-gradient(180deg, #D49B28 0%, #A16207 100%); height: 60%; border-radius: 8px; opacity: 0.85; transition: height 0.5s ease; display: flex; align-items: center; justify-content: center; color: #FFF; font-weight: 700; font-size: 14px; text-shadow: 0 1px 3px rgba(0,0,0,0.6);">
                <div style="text-align: center;">
                  <div id="ext-tank-label">Botanical Infusion (1000 ml)</div>
                  <div style="font-size: 12px; font-weight: 400; opacity: 0.9;" id="ext-agitation-label">Vessel Idle</div>
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="margin-top: 20px;">
              <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; margin-bottom: 6px;">
                <span>Extraction Completion</span>
                <span id="ext-pct-label">0%</span>
              </div>
              <div style="background-color: #E5E7EB; height: 12px; border-radius: 6px; overflow: hidden;">
                <div id="ext-progress-fill" style="width: 0%; height: 100%; background: var(--color-forest); transition: width 0.3s ease;"></div>
              </div>
            </div>

            <!-- Output Dye Collection Prompt (Shows upon completion) -->
            <div id="ext-collection-pane" style="display: none; margin-top: 24px; background: #FAF9F6; border: 1px solid var(--color-forest); border-radius: var(--radius-md); padding: 16px;">
              <div style="font-size: 15px; font-weight: 700; color: var(--color-forest); margin-bottom: 4px;">
                Extraction Completed! Collect Extracted Liquid
              </div>
              <p style="font-size: 12.5px; color: var(--color-text-muted); margin-bottom: 12px;">
                Measured dye liquid volume collected from chamber drainage. Enter actual collected volume:
              </p>
              
              <div style="display: flex; gap: 12px; align-items: center;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <input type="number" id="ext-collected-input" class="form-control" value="865" style="width: 140px; font-family: var(--font-mono); font-size: 16px; font-weight: 700;">
                  <span style="font-size: 14px; font-weight: 600;">ml</span>
                </div>
                <button class="btn btn-mustard" onclick="ExtractionComponent.submitCollectedDye()">
                  Record Volume & Analyze Dye Yield →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    await this.refreshStatus();
  },

  async refreshStatus() {
    try {
      const data = await API.getProcessStatus();
      const p = data.process;
      const t = p.telemetry;

      // Update badge
      const b = document.getElementById("ext-status-badge");
      if (b) {
        b.className = `status-badge ${App.getStatusBadgeClass(p.process_status)}`;
        b.innerHTML = `<span class="status-badge-dot"></span> ${p.process_status}`;
      }

      // Batch details
      const batchNum = p.batch_number || (App.state.activeBatch ? App.state.activeBatch.batch_number : "BAT-2026-007");
      if (document.getElementById("ext-batch-num")) document.getElementById("ext-batch-num").textContent = batchNum;

      if (App.state.activeRecipe) {
        if (document.getElementById("ext-recipe-name")) {
          document.getElementById("ext-recipe-name").textContent = `${App.state.activeRecipe.recipe_name} (${App.state.activeRecipe.fabric_type})`;
        }
        if (document.getElementById("ext-target-temp")) {
          document.getElementById("ext-target-temp").textContent = `${App.state.activeRecipe.extraction_temperature}°C`;
        }
      }

      // Telemetry
      if (document.getElementById("ext-temp-val")) document.getElementById("ext-temp-val").textContent = t.sensors.temperature_c.toFixed(1);
      const heatEl = document.getElementById("ext-heater-val");
      const pumpEl = document.getElementById("ext-pump-val");
      if (heatEl) {
        heatEl.textContent = t.actuators.heater;
        heatEl.style.color = t.actuators.heater === "ON" ? "#DC2626" : "var(--color-text-muted)";
      }
      if (pumpEl) {
        pumpEl.textContent = t.actuators.pump;
        pumpEl.style.color = t.actuators.pump === "CIRCULATING" ? "#16A34A" : "var(--color-text-muted)";
      }

      // Timer & Progress
      const elSec = p.elapsed_seconds;
      const totSec = p.total_duration_seconds;
      const mm = String(Math.floor(elSec / 60)).padStart(2, "0");
      const ss = String(elSec % 60).padStart(2, "0");
      const totMm = String(Math.floor(totSec / 60)).padStart(2, "0");
      if (document.getElementById("ext-timer-display")) document.getElementById("ext-timer-display").textContent = `${mm}:${ss} / ${totMm}:00`;

      if (document.getElementById("ext-pct-label")) document.getElementById("ext-pct-label").textContent = `${p.progress_percent}%`;
      if (document.getElementById("ext-progress-fill")) document.getElementById("ext-progress-fill").style.width = `${p.progress_percent}%`;

      // Tank visuals
      const steam = document.getElementById("ext-steam-layer");
      const agitation = document.getElementById("ext-agitation-label");
      if (p.is_running) {
        if (steam) steam.style.opacity = "1";
        if (agitation) agitation.textContent = "Thermal Agitation & Recirculation Active";
        if (document.getElementById("btn-start-extraction")) document.getElementById("btn-start-extraction").style.display = "none";
        if (document.getElementById("btn-fast-forward")) document.getElementById("btn-fast-forward").style.display = "block";
      } else {
        if (steam) steam.style.opacity = "0";
        if (agitation) agitation.textContent = p.process_status === "Extraction Completed" ? "Extraction Complete - Ready for Drain" : "Vessel Idle";
      }

      // If extraction completed, show collection prompt
      const colPane = document.getElementById("ext-collection-pane");
      if (colPane) {
        if (p.process_status === "Extraction Completed" || p.progress_percent >= 100) {
          colPane.style.display = "block";
          if (p.collected_dye_output_ml > 0) {
            document.getElementById("ext-collected-input").value = p.collected_dye_output_ml;
          }
        } else {
          colPane.style.display = "none";
        }
      }
    } catch (e) {
      console.error("Extraction status error:", e);
    }
  },

  async startCycle() {
    const batchId = App.state.activeBatch ? App.state.activeBatch.id : null;
    const dur = App.state.activeRecipe ? App.state.activeRecipe.extraction_duration : 45;
    const temp = App.state.activeRecipe ? App.state.activeRecipe.extraction_temperature : 85.0;

    try {
      await API.startProcess(batchId, dur, temp);
      this.startPolling();
      await this.refreshStatus();
    } catch (err) {
      alert("Cannot start extraction: " + err.message);
    }
  },

  async fastForward() {
    try {
      await API.tickProcess(60, true); // fast forward to completion
      await this.refreshStatus();
    } catch (err) {
      console.error("Fast forward error:", err);
    }
  },

  startPolling() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(async () => {
      try {
        await API.tickProcess(10, false);
        await this.refreshStatus();
      } catch (_) {}
    }, 2000);
  },

  async submitCollectedDye() {
    const val = parseFloat(document.getElementById("ext-collected-input").value || "865");
    await API.completeProcess(val);
    if (this.timerInterval) clearInterval(this.timerInterval);
    App.state.actualDyeCollected = val;
    App.navigate("yield");
  },

  async resetBatch() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    await API.resetProcess();
    await this.refreshStatus();
  }
};

window.ExtractionComponent = ExtractionComponent;
