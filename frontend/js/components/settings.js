/**
 * SAHAJ AI - Settings, Hardware Mode & Colour Quality Analysis Component
 */

const SettingsComponent = {
  render() {
    return `
      <div class="section-header">
        <h1 class="section-title">System Settings & Hardware Gateway</h1>
        <p class="section-subtitle">Operating mode configuration, sensor calibration, Gemini API credentials, and fabric colour quality</p>
      </div>

      <div class="grid-2" style="margin-bottom: 24px;">
        <!-- Card 1: Hardware Operating Mode -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Hardware Operating Mode</span>
            <span id="settings-current-mode-badge" class="status-badge status-awaiting-inputs">Checking...</span>
          </div>
          <div class="card-body">
            <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 16px;">
              SAHAJ provides two distinct operating modes. Simulation mode is clearly labelled throughout all interfaces.
            </p>

            <div class="form-group">
              <label class="form-label">Operating Mode Selection</label>
              <div style="display: flex; gap: 12px; margin-top: 8px;">
                <button class="btn btn-secondary active" id="btn-mode-sim" onclick="SettingsComponent.setMode('SIMULATION')">
                  Simulation Mode (Demo)
                </button>
                <button class="btn btn-secondary" id="btn-mode-live" onclick="SettingsComponent.setMode('LIVE')">
                  Live Hardware Mode (Physical)
                </button>
              </div>
            </div>

            <div style="background: #FAF9F6; border: 1px solid var(--color-ivory-border); border-radius: var(--radius-md); padding: 12px; margin-top: 14px; font-size: 12.5px;">
              <div><strong>Gateway IP / Serial:</strong> 192.168.1.150 / COM3 (115200 baud)</div>
              <div><strong>Supported Sensors:</strong> HX711 Load Cell, Hall-effect Flow Sensor, PT100 RTD</div>
              <div><strong>Safety Interlocks:</strong> Hardware thermal cutoff at 95.0°C; Dry-run cutoff at 0.5L</div>
            </div>
          </div>
        </div>

        <!-- Card 2: Gemini API Configuration -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Google Gemini AI Engine</span>
            <span id="settings-gemini-status-badge" class="status-badge status-awaiting-inputs">Checking...</span>
          </div>
          <div class="card-body">
            <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 16px;">
              Connects to Google Generative Language API for multimodal image understanding and conversational artisan assistance.
            </p>

            <div class="form-group">
              <label class="form-label">Gemini API Key</label>
              <input type="password" id="settings-api-key-input" class="form-control" placeholder="Enter GEMINI_API_KEY (AIzaSy...)">
              <span style="font-size: 11px; color: var(--color-text-muted);">Stored securely in backend environment. Fallback heritage engine active when unconfigured.</span>
            </div>

            <button class="btn btn-primary" onclick="SettingsComponent.saveApiKey()">
              Save Gemini API Key
            </button>
          </div>
        </div>
      </div>

      <!-- Card 3: Section 3.C Future Colour Quality Analysis (Dyed Fabric vs Target Swatch) -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <span class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>
            Colour Quality & Delta-E Spectrophotometric Analysis (Section 3.C)
          </span>
          <span class="status-badge status-yield-analysis-completed">Post-Dye Quality Control</span>
        </div>
        <div class="card-body">
          <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 16px;">
            Compare the finished dyed fabric against the original target colour reference using CIE Delta-E metrics:
          </p>

          <div class="grid-2">
            <div>
              <div class="form-group">
                <label class="form-label">Target Reference Colour (HEX)</label>
                <div style="display: flex; gap: 8px;">
                  <input type="color" id="quality-target-color" value="#D49B28" onchange="document.getElementById('quality-target-hex').value = this.value">
                  <input type="text" id="quality-target-hex" class="form-control" value="#D49B28">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Actual Dyed Fabric Sample (HEX or Photo)</label>
                <div style="display: flex; gap: 8px;">
                  <input type="color" id="quality-actual-color" value="#D79F32" onchange="document.getElementById('quality-actual-hex').value = this.value">
                  <input type="text" id="quality-actual-hex" class="form-control" value="#D79F32">
                </div>
              </div>

              <button class="btn btn-mustard" onclick="SettingsComponent.runQualityCheck()">
                Compute CIE Delta-E Colour Difference
              </button>
            </div>

            <div id="quality-results-pane" style="background: #FAF9F6; border: 1px solid var(--color-ivory-border); border-radius: var(--radius-md); padding: 16px;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-forest); margin-bottom: 10px;">
                Spectrophotometric Assessment Output
              </div>

              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 14px;">
                <div style="text-align: center;">
                  <div id="quality-swatch-target" style="width: 44px; height: 44px; border-radius: 6px; background-color: #D49B28; border: 1px solid rgba(0,0,0,0.15); margin: 0 auto;"></div>
                  <div style="font-size: 11px; margin-top: 4px; font-weight: 600;">Target</div>
                </div>
                <div style="font-size: 18px; font-weight: 700; color: var(--color-text-muted);">vs</div>
                <div style="text-align: center;">
                  <div id="quality-swatch-actual" style="width: 44px; height: 44px; border-radius: 6px; background-color: #D79F32; border: 1px solid rgba(0,0,0,0.15); margin: 0 auto;"></div>
                  <div style="font-size: 11px; margin-top: 4px; font-weight: 600;">Dyed Fabric</div>
                </div>
                <div style="margin-left: 20px;">
                  <div style="font-size: 26px; font-weight: 700; font-family: var(--font-mono); color: var(--color-forest);" id="quality-delta-e-val">ΔE 2.45</div>
                  <div style="font-size: 12px; font-weight: 600; color: var(--color-success);" id="quality-grade-val">Commercial Pass (Grade A)</div>
                </div>
              </div>

              <div id="quality-artisan-notes" style="font-size: 12.5px; color: var(--color-text-main); line-height: 1.4;">
                CIE Delta-E &lt; 3.0 represents exceptional colour conformity. Natural botanical batch is ready for commercial inspection.
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
      const data = await API.getSystemStatus();
      const isSim = data.is_simulated;

      // Mode badges
      const badge = document.getElementById("settings-current-mode-badge");
      if (badge) {
        badge.className = `status-badge ${isSim ? 'status-input-validation-required' : 'status-ready-for-extraction'}`;
        badge.innerHTML = `<span class="status-badge-dot"></span> ${isSim ? 'Simulation Mode' : 'Live Hardware'}`;
      }

      const btnSim = document.getElementById("btn-mode-sim");
      const btnLive = document.getElementById("btn-mode-live");
      if (btnSim && btnLive) {
        if (isSim) {
          btnSim.classList.add("active");
          btnLive.classList.remove("active");
        } else {
          btnLive.classList.add("active");
          btnSim.classList.remove("active");
        }
      }

      // Gemini Status
      const geminiBadge = document.getElementById("settings-gemini-status-badge");
      if (geminiBadge) {
        geminiBadge.className = `status-badge ${data.gemini_api_configured ? 'status-ready-for-extraction' : 'status-input-validation-required'}`;
        geminiBadge.innerHTML = `<span class="status-badge-dot"></span> ${data.gemini_api_configured ? 'Gemini API Active' : 'Heritage Fallback Mode'}`;
      }
    } catch (e) {
      console.error("Settings status error:", e);
    }
  },

  async setMode(mode) {
    try {
      await API.setHardwareMode(mode);
      await this.refreshStatus();
      // Also update top header
      App.updateTopHeader();
    } catch (e) {
      alert("Error setting mode: " + e.message);
    }
  },

  async saveApiKey() {
    const key = document.getElementById("settings-api-key-input")?.value.trim();
    if (!key) return;
    try {
      await API.updateApiKey(key);
      alert("Gemini API Key updated successfully!");
      await this.refreshStatus();
    } catch (e) {
      alert("Failed to update API key: " + e.message);
    }
  },

  async runQualityCheck() {
    const targetHex = document.getElementById("quality-target-hex")?.value || "#D49B28";
    const actualHex = document.getElementById("quality-actual-hex")?.value || "#D79F32";

    try {
      const res = await API.compareQuality({ target_hex: targetHex, actual_hex: actualHex });
      if (document.getElementById("quality-swatch-target")) document.getElementById("quality-swatch-target").style.backgroundColor = targetHex;
      if (document.getElementById("quality-swatch-actual")) document.getElementById("quality-swatch-actual").style.backgroundColor = actualHex;
      if (document.getElementById("quality-delta-e-val")) document.getElementById("quality-delta-e-val").textContent = `ΔE ${res.delta_e}`;
      if (document.getElementById("quality-grade-val")) document.getElementById("quality-grade-val").textContent = res.commercial_grade;
      if (document.getElementById("quality-artisan-notes")) document.getElementById("quality-artisan-notes").textContent = res.artisan_assessment;
    } catch (e) {
      alert("Quality check error: " + e.message);
    }
  }
};

window.SettingsComponent = SettingsComponent;
