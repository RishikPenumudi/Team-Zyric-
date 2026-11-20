/**
 * SAHAJ AI - Batch History & Batch Intelligence Component
 * Module 03 (Part B): Historical batch records, side-by-side comparison, and process deviations.
 */

const BatchHistoryComponent = {
  allBatches: [],
  selectedBatch1: null,
  selectedBatch2: null,

  render() {
    return `
      <div class="section-header">
        <h1 class="section-title">Production Batch Intelligence</h1>
        <p class="section-subtitle">Complete historical batch records, error deviations, recipe comparisons, and production metrics</p>
      </div>

      <!-- Action & Filter Bar -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-body" style="padding: 16px 20px;">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;">
            <div style="display: flex; gap: 12px; align-items: center;">
              <span style="font-size: 13px; font-weight: 600;">Filter Botanical:</span>
              <select id="history-filter-botanical" class="form-control" style="width: 170px;" onchange="BatchHistoryComponent.applyFilters()">
                <option value="">All Botanicals</option>
                <option value="1">Tagetes erecta (Marigold)</option>
                <option value="2">Indigofera tinctoria (Indigo)</option>
                <option value="3">Rubia cordifolia (Madder)</option>
                <option value="4">Punica granatum (Pomegranate)</option>
              </select>

              <span style="font-size: 13px; font-weight: 600; margin-left: 10px;">Status:</span>
              <select id="history-filter-status" class="form-control" style="width: 180px;" onchange="BatchHistoryComponent.applyFilters()">
                <option value="">All Statuses</option>
                <option value="Dyeing Completed">Dyeing Completed</option>
                <option value="Extraction Completed">Extraction Completed</option>
                <option value="Ready for Extraction">Ready for Extraction</option>
              </select>
            </div>

            <div style="display: flex; gap: 10px;">
              <button class="btn btn-secondary btn-sm" onclick="BatchHistoryComponent.openCompareModal()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
                Compare 2 Batches
              </button>
              <button class="btn btn-secondary btn-sm" onclick="BatchHistoryComponent.exportJSON()">
                Export JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main History Table Card -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <span class="card-title">Production Batch Ledger</span>
          <span id="history-count-badge" style="font-size: 12px; color: var(--color-text-muted);">0 batches</span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Batch Number</th>
                  <th>Date & Time</th>
                  <th>Target Shade</th>
                  <th>Botanical Material</th>
                  <th>Fiber / Weight</th>
                  <th>Plant / Water Charge</th>
                  <th>Predicted Yield</th>
                  <th>Actual Collected</th>
                  <th>Error %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="history-table-tbody">
                <tr><td colspan="10" style="text-align: center; color: var(--color-text-muted); padding: 30px;">Loading historical records...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Side-by-Side Batch Comparison Modal -->
      <div id="compare-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 100; align-items: center; justify-content: center;">
        <div class="card" style="width: 800px; max-width: 95%; max-height: 90vh; overflow-y: auto;">
          <div class="card-header">
            <span class="card-title">Batch Comparison Diagnostics</span>
            <button class="btn btn-sm btn-secondary" onclick="BatchHistoryComponent.closeCompareModal()">✕ Close</button>
          </div>
          <div class="card-body">
            <div class="grid-2" style="margin-bottom: 16px;">
              <div>
                <label class="form-label">Select Primary Batch A</label>
                <select id="compare-select-a" class="form-control" onchange="BatchHistoryComponent.updateComparison()"></select>
              </div>
              <div>
                <label class="form-label">Select Secondary Batch B</label>
                <select id="compare-select-b" class="form-control" onchange="BatchHistoryComponent.updateComparison()"></select>
              </div>
            </div>

            <div id="compare-results-container" style="border-top: 1px solid var(--color-ivory-border); padding-top: 16px;">
              <p style="text-align: center; color: var(--color-text-muted);">Select two batches above to compare recipe kinetics and yield performance.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    await this.loadBatches();
  },

  async loadBatches() {
    const bId = document.getElementById("history-filter-botanical")?.value;
    const status = document.getElementById("history-filter-status")?.value;

    try {
      const data = await API.getBatches(bId, status);
      this.allBatches = data.batches || [];
      this.renderTable();
    } catch (e) {
      console.error("Failed to load batch history:", e);
    }
  },

  applyFilters() {
    this.loadBatches();
  },

  renderTable() {
    const tbody = document.getElementById("history-table-tbody");
    const countBadge = document.getElementById("history-count-badge");
    if (!tbody) return;

    if (countBadge) countBadge.textContent = `${this.allBatches.length} batches recorded`;

    if (this.allBatches.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--color-text-muted); padding: 30px;">No batches match the selected criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.allBatches.map(b => {
      const d = new Date(b.created_at);
      const dateStr = d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return `
        <tr>
          <td style="font-family: var(--font-mono); font-weight: 700; color: var(--color-forest);">${b.batch_number}</td>
          <td style="font-size: 11.5px; color: var(--color-text-muted);">${dateStr}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 14px; height: 14px; border-radius: 3px; background-color: ${b.target_hex};"></span>
              <span>${b.target_colour_name || b.target_hex}</span>
            </div>
          </td>
          <td>${b.common_name}</td>
          <td>${b.fabric_type || 'cotton'} (${b.fabric_weight ? b.fabric_weight + 'g' : '200g'})</td>
          <td>${b.plant_weight}g / ${Math.round(b.water_quantity)}ml</td>
          <td>${b.predicted_output ? Math.round(b.predicted_output) + ' ml' : '—'}</td>
          <td><strong>${b.actual_output ? Math.round(b.actual_output) + ' ml' : '—'}</strong></td>
          <td>
            ${b.percentage_error !== null && b.percentage_error !== undefined ?
              `<span style="color: ${b.percentage_error < 5 ? 'var(--color-success)' : 'var(--color-warning)'}; font-weight: 700;">${b.percentage_error.toFixed(1)}%</span>`
              : '—'}
          </td>
          <td>
            <span class="status-badge ${App.getStatusBadgeClass(b.process_status)}">
              <span class="status-badge-dot"></span> ${b.process_status}
            </span>
          </td>
        </tr>
      `;
    }).join("");
  },

  openCompareModal() {
    const modal = document.getElementById("compare-modal");
    modal.style.display = "flex";

    const selA = document.getElementById("compare-select-a");
    const selB = document.getElementById("compare-select-b");

    const opts = this.allBatches.map((b, i) => `<option value="${b.id}" ${i === 0 ? 'selected' : ''}>${b.batch_number} - ${b.recipe_name} (${b.common_name})</option>`).join("");
    const optsB = this.allBatches.map((b, i) => `<option value="${b.id}" ${i === 1 ? 'selected' : ''}>${b.batch_number} - ${b.recipe_name} (${b.common_name})</option>`).join("");

    selA.innerHTML = opts;
    selB.innerHTML = optsB;

    this.updateComparison();
  },

  closeCompareModal() {
    document.getElementById("compare-modal").style.display = "none";
  },

  updateComparison() {
    const idA = parseInt(document.getElementById("compare-select-a")?.value);
    const idB = parseInt(document.getElementById("compare-select-b")?.value);

    const bA = this.allBatches.find(b => b.id === idA);
    const bB = this.allBatches.find(b => b.id === idB);

    const container = document.getElementById("compare-results-container");
    if (!bA || !bB || !container) return;

    container.innerHTML = `
      <table class="data-table" style="margin-top: 10px;">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Batch A (${bA.batch_number})</th>
            <th>Batch B (${bB.batch_number})</th>
            <th>Variance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Recipe</strong></td>
            <td>${bA.recipe_name}</td>
            <td>${bB.recipe_name}</td>
            <td>${bA.recipe_name === bB.recipe_name ? 'Identical Recipe' : 'Different Recipe'}</td>
          </tr>
          <tr>
            <td><strong>Botanical Source</strong></td>
            <td>${bA.common_name}</td>
            <td>${bB.common_name}</td>
            <td>—</td>
          </tr>
          <tr>
            <td><strong>Plant Material Charged</strong></td>
            <td>${bA.plant_weight} g</td>
            <td>${bB.plant_weight} g</td>
            <td>${(bA.plant_weight - bB.plant_weight).toFixed(1)} g</td>
          </tr>
          <tr>
            <td><strong>Water Charged</strong></td>
            <td>${bA.water_quantity} ml</td>
            <td>${bB.water_quantity} ml</td>
            <td>${(bA.water_quantity - bB.water_quantity).toFixed(1)} ml</td>
          </tr>
          <tr>
            <td><strong>Extraction Temp / Time</strong></td>
            <td>${bA.actual_temperature || 85}°C (${bA.extraction_duration || 45} min)</td>
            <td>${bB.actual_temperature || 85}°C (${bB.extraction_duration || 45} min)</td>
            <td>—</td>
          </tr>
          <tr>
            <td><strong>Predicted Output</strong></td>
            <td>${bA.predicted_output ? bA.predicted_output + ' ml' : '—'}</td>
            <td>${bB.predicted_output ? bB.predicted_output + ' ml' : '—'}</td>
            <td>—</td>
          </tr>
          <tr>
            <td><strong>Actual Output</strong></td>
            <td><strong>${bA.actual_output ? bA.actual_output + ' ml' : '—'}</strong></td>
            <td><strong>${bB.actual_output ? bB.actual_output + ' ml' : '—'}</strong></td>
            <td>${(bA.actual_output && bB.actual_output) ? (bA.actual_output - bB.actual_output).toFixed(1) + ' ml' : '—'}</td>
          </tr>
          <tr>
            <td><strong>Prediction Percentage Error</strong></td>
            <td style="color: var(--color-success); font-weight: 700;">${bA.percentage_error ? bA.percentage_error.toFixed(2) + '%' : '—'}</td>
            <td style="color: var(--color-success); font-weight: 700;">${bB.percentage_error ? bB.percentage_error.toFixed(2) + '%' : '—'}</td>
            <td>${(bA.percentage_error && bB.percentage_error) ? Math.abs(bA.percentage_error - bB.percentage_error).toFixed(2) + '%' : '—'}</td>
          </tr>
        </tbody>
      </table>
    `;
  },

  exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.allBatches, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "sahaj_production_batches.json");
    dlAnchor.click();
  }
};

window.BatchHistoryComponent = BatchHistoryComponent;
