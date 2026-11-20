/**
 * SAHAJ AI - API Client Layer
 * Encapsulates all backend REST endpoints with robust error handling.
 */

var API = {
  baseUrl: "",

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        let errMessage = `HTTP Error ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.error || errData.message) {
            errMessage = errData.error || errData.message;
          }
        } catch (_) {}
        throw new Error(errMessage);
      }
      return await response.json();
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // System & Hardware
  getSystemStatus() {
    return this.request("/api/system/status");
  },
  setHardwareMode(mode) {
    return this.request("/api/system/hardware-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode })
    });
  },
  setSensorOverride(plantWeight, waterVolume, temperature) {
    return this.request("/api/system/sensor-override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plant_weight: plantWeight, water_volume: waterVolume, temperature })
    });
  },
  updateApiKey(key) {
    return this.request("/api/system/api-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gemini_api_key: key })
    });
  },

  // Module 01: Colour Intelligence
  analyseColour(payload) {
    const isFormData = payload instanceof FormData;
    return this.request("/api/colour/analyse", {
      method: "POST",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? payload : JSON.stringify(payload)
    });
  },

  // Botanicals & Recipes
  getBotanicals() {
    return this.request("/api/botanicals");
  },
  getRecipes(params = {}) {
    let q = [];
    if (typeof params === "object" && params !== null) {
      if (params.botanicalId) q.push(`botanical_id=${encodeURIComponent(params.botanicalId)}`);
      if (params.fabricType) q.push(`fabric_type=${encodeURIComponent(params.fabricType)}`);
      if (params.shadeFamily) q.push(`shade_family=${encodeURIComponent(params.shadeFamily)}`);
      if (params.processType) q.push(`process_type=${encodeURIComponent(params.processType)}`);
      if (params.validatedStatus) q.push(`validated_status=${encodeURIComponent(params.validatedStatus)}`);
      if (params.search) q.push(`search=${encodeURIComponent(params.search)}`);
    } else if (arguments.length > 0) {
      // Backwards compatibility for getRecipes(botanicalId, fabricType)
      if (arguments[0]) q.push(`botanical_id=${encodeURIComponent(arguments[0])}`);
      if (arguments[1]) q.push(`fabric_type=${encodeURIComponent(arguments[1])}`);
    }
    const qs = q.length ? `?${q.join("&")}` : "";
    return this.request(`/api/recipes${qs}`);
  },
  getRecipeById(id) {
    return this.request(`/api/recipes/${id}`);
  },
  createRecipe(data) {
    return this.request("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },
  updateRecipe(id, data) {
    return this.request(`/api/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },
  deleteRecipe(id) {
    return this.request(`/api/recipes/${id}`, {
      method: "DELETE"
    });
  },
  recommendRecipe(targetHex, fabricType) {
    return this.request("/api/recipes/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_hex: targetHex, fabric_type: fabricType })
    });
  },

  // Module 02: Measurements
  calculateMeasurements(recipeId, fabricWeight = 200, desiredDyeMl = null) {
    return this.request("/api/measurements/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_id: recipeId, fabric_weight: fabricWeight, desired_dye_ml: desiredDyeMl })
    });
  },
  validateMeasurements(actualPlantWeight = null, actualWaterVolume = null) {
    return this.request("/api/measurements/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actual_plant_weight: actualPlantWeight,
        actual_water_volume: actualWaterVolume
      })
    });
  },

  // Module 03: Yield Intelligence & ML
  predictYield(plantWeight, waterQuantity, temperature, duration, botanicalId) {
    return this.request("/api/yield/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plant_weight: plantWeight,
        water_quantity: waterQuantity,
        temperature,
        duration,
        botanical_id: botanicalId
      })
    });
  },
  compareYield(batchId, actualOutput, predictedOutput, notes = "") {
    return this.request("/api/yield/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        batch_id: batchId,
        actual_output: actualOutput,
        predicted_output: predictedOutput,
        notes
      })
    });
  },
  getYieldHistory() {
    return this.request("/api/yield/history");
  },

  // Module 04: Process State Machine
  getProcessStatus() {
    return this.request("/api/process/status");
  },
  startProcess(batchId, duration = 45, temperature = 85.0, recipeId = 1) {
    return this.request("/api/process/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch_id: batchId, duration, temperature, recipe_id: recipeId })
    });
  },
  tickProcess(seconds = 30, fastForward = false) {
    return this.request("/api/process/tick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seconds, fast_forward: fastForward })
    });
  },
  completeProcess(actualDyeVolumeMl = null) {
    return this.request("/api/process/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actual_dye_volume_ml: actualDyeVolumeMl })
    });
  },
  resetProcess() {
    return this.request("/api/process/reset", { method: "POST" });
  },

  // Fabric Dyeing Workflow
  validateDyeing(batchId, fabricType = "cotton", fabricWeight = 200.0) {
    return this.request("/api/dyeing/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch_id: batchId, fabric_type: fabricType, fabric_weight: fabricWeight })
    });
  },
  startDyeing(batchId, fabricWeight = 200.0) {
    return this.request("/api/dyeing/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch_id: batchId, fabric_weight: fabricWeight })
    });
  },
  completeDyeing(batchId) {
    return this.request("/api/dyeing/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch_id: batchId })
    });
  },

  // Batch Records
  createBatch(recipeId, plantWeight = 0, waterQuantity = 0) {
    return this.request("/api/batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_id: recipeId, plant_weight: plantWeight, water_quantity: waterQuantity })
    });
  },
  getBatches(botanicalId = null, status = null) {
    let q = [];
    if (botanicalId) q.push(`botanical_id=${botanicalId}`);
    if (status) q.push(`status=${encodeURIComponent(status)}`);
    const qs = q.length ? `?${q.join("&")}` : "";
    return this.request(`/api/batches${qs}`);
  },
  getBatchById(id) {
    return this.request(`/api/batches/${id}`);
  },

  // AI Assistant
  chatAssistant(message, history = [], language = "en") {
    return this.request("/api/assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, conversation_history: history, language })
    });
  },

  // Quality Analysis
  compareQuality(payload) {
    const isFormData = payload instanceof FormData;
    return this.request("/api/quality/compare", {
      method: "POST",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? payload : JSON.stringify(payload)
    });
  }
};

window.API = API;
