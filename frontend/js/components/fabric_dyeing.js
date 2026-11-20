/**
 * SAHAJ AI - Fabric Dyeing Workflow Component
 * Module 04 (Part 2): Guided fabric immersion, liquor ratio validation, mordant chemistry, and final completion.
 */

const FabricDyeingComponent = {
  currentValidation: null,

  render() {
    return `
      <div class="section-header">
        <h1 class="section-title">Fabric Dyeing Readiness & Guided Execution</h1>
        <p class="section-subtitle">Substrate immersion verification, liquor-to-goods ratio check, and recipe-validated mordanting parameters</p>
      </div>

      <!-- Process State Alert -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <span class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Dyeing Readiness Assessment
          </span>
          <span id="dyeing-readiness-badge" class="status-badge status-awaiting-inputs">Evaluating...</span>
        </div>
        <div class="card-body">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
            <div>
              <div id="dyeing-status-title" style="font-size: 16px; font-weight: 700; color: var(--color-forest-dark);">
                Checking available extract volume...
              </div>
              <div id="dyeing-status-desc" style="font-size: 13px; color: var(--color-text-muted); margin-top: 4px;">
                Calculated based on 200g fabric load and recipe liquor ratio.
              </div>
            </div>

            <div style="display: flex; gap: 24px;">
              <div style="text-align: right;">
                <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted);">Available Dye Volume</div>
                <div id="dyeing-avail-vol" style="font-size: 24px; font-weight: 700; font-family: var(--font-mono); color: var(--color-mustard-dark);">865 ml</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted);">Minimum Required Liquor</div>
                <div id="dyeing-req-vol" style="font-size: 24px; font-weight: 700; font-family: var(--font-mono); color: var(--color-forest-dark);">800 ml</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom: 24px;">
        <!-- Left: Fabric & Recipe Parameters -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">1. Fabric Substrate & Liquor Ratio</span>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Substrate Material</label>
              <select id="dyeing-fabric-select" class="form-control" onchange="FabricDyeingComponent.revalidate()">
                <option value="cotton" selected>Scoured Bleached Cotton (Cellulosic)</option>
                <option value="silk">Raw / Degummed Mulberry Silk (Protein)</option>
                <option value="wool">Desi Wool (Keratin Protein)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Fabric Weight (grams)</label>
              <input type="number" id="dyeing-weight-input" class="form-control" value="200" min="50" max="1000" step="10" oninput="FabricDyeingComponent.revalidate()">
              <span style="font-size: 11px; color: var(--color-text-muted);">Determines liquor ratio and mordant dosing</span>
            </div>

            <!-- Validated Parameters Box -->
            <div style="background: #FAF9F6; border: 1px solid var(--color-ivory-border); border-radius: var(--radius-md); padding: 14px; margin-top: 16px;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-forest-dark); margin-bottom: 8px;">
                Validated Recipe Dyeing Parameters
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--color-text-muted);">Dyeing Temperature:</span>
                  <strong id="dyeing-param-temp">75.0°C</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--color-text-muted);">Immersion Duration:</span>
                  <strong id="dyeing-param-time">45 minutes</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--color-text-muted);">Recommended Mordant:</span>
                  <strong id="dyeing-param-mordant">Alum (15% WOF)</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--color-text-muted);">Optimal pH Target:</span>
                  <strong id="dyeing-param-ph">6.5 (Neutral)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Guided Artisan Step-by-Step Execution -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">2. Guided Artisan Execution Checklist</span>
          </div>
          <div class="card-body">
            <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 14px;">
              Follow traditional artisan best practices before activating the dyeing cycle:
            </p>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              <label style="display: flex; align-items: flex-start; gap: 10px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" id="chk-step-1" checked style="margin-top: 3px;">
                <div>
                  <strong>Fiber Scouring & Wetting Out:</strong> Ensure fabric was thoroughly wet in warm water for 20 mins to eliminate dry air pockets.
                </div>
              </label>

              <label style="display: flex; align-items: flex-start; gap: 10px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" id="chk-step-2" checked style="margin-top: 3px;">
                <div>
                  <strong>Mordant Pre-treatment Verified:</strong> Fabric treated with Potassium Aluminium Sulphate (Alum) to create coordination bonds.
                </div>
              </label>

              <label style="display: flex; align-items: flex-start; gap: 10px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" id="chk-step-3" style="margin-top: 3px;" onchange="FabricDyeingComponent.checkButtons()">
                <div>
                  <strong>Substrate Immersion into Chamber:</strong> Fabric introduced into vessel smoothly without folding or splashing.
                </div>
              </label>

              <label style="display: flex; align-items: flex-start; gap: 10px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" id="chk-step-4" style="margin-top: 3px;" onchange="FabricDyeingComponent.checkButtons()">
                <div>
                  <strong>Lid Sealed & Agitation Ready:</strong> Chamber secured for temperature-controlled gentle circulation.
                </div>
              </label>
            </div>

            <!-- Action Buttons -->
            <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 10px;">
              <button class="btn btn-primary btn-lg" id="btn-start-dyeing" onclick="FabricDyeingComponent.startDyeingRun()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Confirm Fabric Addition & Start Dyeing
              </button>

              <button class="btn btn-success btn-lg" id="btn-complete-dyeing" onclick="FabricDyeingComponent.completeDyeingRun()" style="display: none;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                Complete Dyeing Cycle & Finalize Production Batch
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    await this.revalidate();
  },

  async revalidate() {
    const batchId = App.state.activeBatch ? App.state.activeBatch.id : 1;
    const fabricType = document.getElementById("dyeing-fabric-select")?.value || "cotton";
    const fabricWeight = parseFloat(document.getElementById("dyeing-weight-input")?.value || "200");

    try {
      const data = await API.validateDyeing(batchId, fabricType, fabricWeight);
      this.currentValidation = data;

      const badge = document.getElementById("dyeing-readiness-badge");
      const title = document.getElementById("dyeing-status-title");
      const desc = document.getElementById("dyeing-status-desc");

      if (badge) {
        badge.className = `status-badge ${data.is_sufficient ? 'status-ready-for-fabric-dyeing' : 'status-insufficient-dye-quantity'}`;
        badge.innerHTML = `<span class="status-badge-dot"></span> ${data.process_status}`;
      }

      if (title) title.textContent = data.is_sufficient ? "Sufficient Botanical Dye Volume Available" : "Insufficient Dye Volume for Requested Load";
      if (desc) desc.textContent = data.status_note;

      if (document.getElementById("dyeing-avail-vol")) document.getElementById("dyeing-avail-vol").textContent = `${data.available_dye_ml} ml`;
      if (document.getElementById("dyeing-req-vol")) document.getElementById("dyeing-req-vol").textContent = `${data.recommended_liquor_ml} ml`;

      // Update parameters
      const dp = data.dyeing_parameters;
      const mg = data.mordant_guidance;
      if (document.getElementById("dyeing-param-temp")) document.getElementById("dyeing-param-temp").textContent = `${dp.dyeing_temp_c || 75.0}°C`;
      if (document.getElementById("dyeing-param-time")) document.getElementById("dyeing-param-time").textContent = `${dp.dyeing_time_mins || 45} mins`;
      if (document.getElementById("dyeing-param-mordant")) document.getElementById("dyeing-param-mordant").textContent = mg.type || "Alum (15% WOF)";
      if (document.getElementById("dyeing-param-ph")) document.getElementById("dyeing-param-ph").textContent = `${dp.ph_target || 6.5}`;

      this.checkButtons();
    } catch (e) {
      console.error("Dyeing validation error:", e);
    }
  },

  checkButtons() {
    const chk3 = document.getElementById("chk-step-3")?.checked;
    const chk4 = document.getElementById("chk-step-4")?.checked;
    const isSufficient = this.currentValidation ? this.currentValidation.is_sufficient : true;

    const btnStart = document.getElementById("btn-start-dyeing");
    if (btnStart) {
      btnStart.disabled = !(chk3 && chk4 && isSufficient);
    }
  },

  async startDyeingRun() {
    const batchId = App.state.activeBatch ? App.state.activeBatch.id : 1;
    const weight = parseFloat(document.getElementById("dyeing-weight-input")?.value || "200");

    try {
      await API.startDyeing(batchId, weight);
      document.getElementById("btn-start-dyeing").style.display = "none";
      document.getElementById("btn-complete-dyeing").style.display = "block";
      
      const badge = document.getElementById("dyeing-readiness-badge");
      if (badge) {
        badge.className = "status-badge status-dyeing-in-progress";
        badge.innerHTML = `<span class="status-badge-dot"></span> Dyeing In Progress`;
      }
    } catch (e) {
      alert("Error starting dyeing: " + e.message);
    }
  },

  async completeDyeingRun() {
    const batchId = App.state.activeBatch ? App.state.activeBatch.id : 1;
    try {
      await API.completeDyeing(batchId);
      alert("Success! Production batch dyeing run has been completed and saved into the historical database.");
      App.navigate("batch_history");
    } catch (e) {
      alert("Error completing dyeing: " + e.message);
    }
  }
};

window.FabricDyeingComponent = FabricDyeingComponent;
