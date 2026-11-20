/**
 * SAHAJ AI - Main Application Controller & Router
 * Manages cross-module state transitions, telemetry polling, and view rendering.
 */

const App = {
  state: {
    currentView: "overview",
    activeRecipe: null,
    activeFabricWeight: 200.0,
    activeBatch: null,
    actualDyeCollected: 865.0,
    hardwareMode: "SIMULATION"
  },

  views: {
    overview: OverviewComponent,
    colour_studio: ColourStudioComponent,
    recipes: RecipeLibraryComponent,
    measurement: MeasurementComponent,
    extraction: ExtractionComponent,
    yield: YieldComponent,
    fabric_dyeing: FabricDyeingComponent,
    batch_history: BatchHistoryComponent,
    assistant: AssistantComponent,
    settings: SettingsComponent
  },

  init() {
    this.setupNavigation();
    this.navigate("overview");
    this.startGlobalTelemetry();
  },

  setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        const view = item.getAttribute("data-view");
        if (view) this.navigate(view);
      });
    });
  },

  navigate(viewName) {
    if (!this.views[viewName]) return;
    this.state.currentView = viewName;

    // Update active nav item
    document.querySelectorAll(".nav-item").forEach(item => {
      if (item.getAttribute("data-view") === viewName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Render component HTML
    const contentBody = document.getElementById("content-body");
    contentBody.innerHTML = this.views[viewName].render();

    // Call component init
    if (typeof this.views[viewName].init === "function") {
      this.views[viewName].init();
    }

    // Scroll to top
    window.scrollTo(0, 0);
  },

  getStatusBadgeClass(status) {
    if (!status) return "status-awaiting-inputs";
    const key = status.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return `status-${key}`;
  },

  async updateTopHeader() {
    try {
      const sys = await API.getSystemStatus();
      this.state.hardwareMode = sys.hardware_mode;

      const badge = document.getElementById("header-hw-badge");
      if (badge) {
        badge.className = `hardware-mode-badge ${sys.is_simulated ? 'simulation' : 'live'}`;
        badge.innerHTML = `<span class="badge-dot"></span> ${sys.is_simulated ? 'SIMULATION MODE' : 'LIVE HARDWARE'}`;
      }

      const activeBatchNum = this.state.activeBatch ? this.state.activeBatch.batch_number : "BAT-2026-007";
      const batchEl = document.getElementById("header-batch-label");
      if (batchEl) batchEl.textContent = `Batch: ${activeBatchNum}`;
    } catch (_) {}
  },

  startGlobalTelemetry() {
    this.updateTopHeader();
    setInterval(() => {
      this.updateTopHeader();
    }, 4000);
  },

  /**
   * Complete End-to-End 14-Step Demonstration Runner
   * Demonstrates the primary required workflow connecting all four core modules.
   */
  async runFullDemoWorkflow() {
    console.log("=== INITIATING SAHAJ AI FULL 14-STEP WORKFLOW ===");
    
    // Step 1 & 2: Colour Studio Reference Upload / Mustard Selection
    this.navigate("colour_studio");
    ColourStudioComponent.setPreset("#D49B28", "Mustard Yellow");
    await ColourStudioComponent.runAnalysis();

    // Step 3: Recipe Match Selected (Marigold Artisan Mustard Yellow)
    setTimeout(async () => {
      await ColourStudioComponent.selectRecipe(1);

      // Step 4 & 5: Smart Measurement & Confirmation
      setTimeout(async () => {
        await MeasurementComponent.handleWeightSlider(100.5);
        await MeasurementComponent.handleWaterSlider(1010);
        await MeasurementComponent.proceedToExtraction();

        // Step 6 & 7: Extraction Monitoring
        setTimeout(async () => {
          await ExtractionComponent.startCycle();
          await ExtractionComponent.fastForward();

          // Step 8, 9 & 10: Yield Prediction & Error Analysis
          setTimeout(async () => {
            await ExtractionComponent.submitCollectedDye();

            // Step 11 & 12: Fabric Dyeing Readiness & Execution
            setTimeout(async () => {
              this.navigate("fabric_dyeing");
              setTimeout(async () => {
                const chk3 = document.getElementById("chk-step-3");
                const chk4 = document.getElementById("chk-step-4");
                if (chk3) chk3.checked = true;
                if (chk4) chk4.checked = true;
                FabricDyeingComponent.checkButtons();
                await FabricDyeingComponent.startDyeingRun();
                await FabricDyeingComponent.completeDyeingRun();

                // Step 13 & 14: Batch History
                this.navigate("batch_history");
                console.log("=== 14-STEP WORKFLOW COMPLETED SUCCESSFULLY ===");
              }, 1200);
            }, 1200);
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  }
};

window.App = App;
document.addEventListener("DOMContentLoaded", () => App.init());
