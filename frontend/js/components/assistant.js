/**
 * SAHAJ AI - Artisan Assistant Component
 * Section 3.A: Gemini-powered interactive conversational assistant for natural dye artisans.
 * Supports English, Telugu, and Hindi.
 */

const AssistantComponent = {
  chatHistory: [],
  selectedLanguage: "en",

  render() {
    return `
      <div class="section-header">
        <h1 class="section-title">SAHAJ AI Artisan Assistant</h1>
        <p class="section-subtitle">Domain-grounded conversational intelligence for botanical chemistry, recipe advice, and troubleshooting</p>
      </div>

      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header" style="justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span class="card-title">Botanical Dyes AI Consultation</span>
          </div>

          <!-- Language Selector -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 12.5px; font-weight: 600; color: var(--color-text-muted);">Artisan Language:</span>
            <select id="assistant-language-select" class="form-control" style="width: 140px; padding: 4px 8px; font-size: 12.5px;" onchange="AssistantComponent.handleLanguageChange(this.value)">
              <option value="en" selected>English</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>

        <div class="card-body" style="padding: 0;">
          <!-- Quick Question Chips -->
          <div style="padding: 12px 18px; background: #FAF9F6; border-bottom: 1px solid var(--color-ivory-border); display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <span style="font-size: 11.5px; font-weight: 600; text-transform: uppercase; color: var(--color-text-muted);">Suggested Topics:</span>
            <button class="btn btn-sm btn-secondary" onclick="AssistantComponent.askSuggested('Optimal extraction temperature for Marigold yellow')">Marigold Extraction</button>
            <button class="btn btn-sm btn-secondary" onclick="AssistantComponent.askSuggested('Why does Madder turn brown if boiled over 80C?')">Madder Temperature Limit</button>
            <button class="btn btn-sm btn-secondary" onclick="AssistantComponent.askSuggested('Explain Indigo vat reduction process')">Indigo Vat Chemistry</button>
            <button class="btn btn-sm btn-secondary" onclick="AssistantComponent.askSuggested('How is dye yield error calculated in SAHAJ?')">Yield Error Diagnostics</button>
            <button class="btn btn-sm btn-secondary" onclick="AssistantComponent.askSuggested('What are the hardware safety limits?')">Machine Safety Limits</button>
          </div>

          <!-- Chat Window -->
          <div class="chat-window" style="border: none; border-radius: 0;">
            <div class="chat-messages" id="chat-messages-container">
              <!-- Initial Welcome Message -->
              <div class="chat-bubble assistant">
                <strong>SAHAJ AI Artisan Assistant:</strong><br>
                Namaste! I am your natural dyeing AI assistant. I can help with botanical recipes, plant-to-water ratios, mordanting (Alum, Iron, Tannins), and troubleshooting process deviations. You may ask me in English, Telugu (తెలుగు), or Hindi (हिंदी).
              </div>
            </div>

            <!-- Chat Input Row -->
            <div class="chat-input-bar">
              <input type="text" id="assistant-user-input" placeholder="Ask a question about botanical recipes, extraction, or mordants..." onkeydown="if(event.key === 'Enter') AssistantComponent.sendMessage()">
              <button class="btn btn-primary" id="btn-send-chat" onclick="AssistantComponent.sendMessage()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Ask Assistant
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    this.selectedLanguage = "en";
  },

  handleLanguageChange(lang) {
    this.selectedLanguage = lang;
    const msgContainer = document.getElementById("chat-messages-container");
    if (!msgContainer) return;

    if (lang === "te") {
      msgContainer.innerHTML += `
        <div class="chat-bubble assistant">
          <strong>SAHAJ AI ఆర్టిసాన్ అసిస్టెంట్:</strong><br>
          నమస్కారం! సహజ్ AI కి స్వాగతం. బంతిపూలు, మెంజిష్ట, నీలిమందు, మరియు దానిమ్మ సహజ రంగుల ప్రక్రియ గురించి మీరు తెలుగులో ప్రశ్నలు అడగవచ్చు.
        </div>
      `;
    } else if (lang === "hi") {
      msgContainer.innerHTML += `
        <div class="chat-bubble assistant">
          <strong>SAHAJ AI आर्टिसन असिस्टेंट:</strong><br>
          नमस्ते! सहज एआई में आपका स्वागत है। गेंदा, मजीठ, नील और अनार के छिलके से प्राकृतिक रंग निष्कर्षण एवं मोर्डेंट के बारे में आप हिंदी में प्रश्न पूछ सकते हैं।
        </div>
      `;
    }
    msgContainer.scrollTop = msgContainer.scrollHeight;
  },

  askSuggested(prompt) {
    const input = document.getElementById("assistant-user-input");
    if (input) {
      input.value = prompt;
      this.sendMessage();
    }
  },

  async sendMessage() {
    const input = document.getElementById("assistant-user-input");
    const text = input?.value.trim();
    if (!text) return;

    const msgContainer = document.getElementById("chat-messages-container");
    const btn = document.getElementById("btn-send-chat");

    // Append User Message
    msgContainer.innerHTML += `
      <div class="chat-bubble user">
        ${this.escapeHtml(text)}
      </div>
    `;
    input.value = "";
    msgContainer.scrollTop = msgContainer.scrollHeight;

    // Loading indicator
    const loadingId = "loading-" + Date.now();
    msgContainer.innerHTML += `
      <div class="chat-bubble assistant" id="${loadingId}">
        <span class="badge-dot" style="animation: pulseGlow 1s infinite;"></span> Consulting natural dye intelligence...
      </div>
    `;
    msgContainer.scrollTop = msgContainer.scrollHeight;
    btn.disabled = true;

    try {
      const res = await API.chatAssistant(text, this.chatHistory, this.selectedLanguage);
      const loadingEl = document.getElementById(loadingId);

      // Simple markdown converter (bold, lists, newlines)
      let formatted = this.escapeHtml(res.reply)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n- (.*?)/g, '<br>• $1')
        .replace(/\n/g, '<br>');

      if (loadingEl) {
        loadingEl.innerHTML = `
          <div style="font-size: 11px; text-transform: uppercase; color: var(--color-forest); font-weight: 700; margin-bottom: 4px;">
            ${res.mode === 'live_gemini' ? 'Gemini 1.5 Multimodal Engine' : 'SAHAJ Heritage Knowledge Base'}
          </div>
          <div>${formatted}</div>
        `;
      }

      this.chatHistory.push({ sender: "user", text });
      this.chatHistory.push({ sender: "model", text: res.reply });
    } catch (err) {
      const loadingEl = document.getElementById(loadingId);
      if (loadingEl) {
        loadingEl.innerHTML = `<span style="color: var(--color-danger);">Error: Could not retrieve assistant response (${err.message})</span>`;
      }
    } finally {
      btn.disabled = false;
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }
  },

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

window.AssistantComponent = AssistantComponent;
