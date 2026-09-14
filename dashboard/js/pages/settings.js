/**
 * Settings Page Renderer — Target Niche Focus + Multi-LLM Support + Social Media APIs
 */
const SettingsPage = {
  async render(container) {
    container.innerHTML = `
      <div style="max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
        
        <!-- Header Banner -->
        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); padding: 20px 24px; border-radius: 10px; border: 1px solid var(--border-color);">
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 1.3rem;">API Credentials & Multi-LLM Setup</h3>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-top: 2px;">
              Connect your choice of LLM provider (Groq, OpenAI, Claude, or Gemini) + social media accounts.
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span id="save-status-msg" style="font-size: 0.85rem; color: #2e7d32; font-weight: 600;"></span>
            <button class="btn btn-primary btn-glow" onclick="SettingsPage.saveSettings()">
              <i data-lucide="zap"></i> Activate & Save All Keys
            </button>
          </div>
        </div>

        <!-- Target Niche Focus Box -->
        <div class="glass-card" style="border: 1px solid var(--primary-purple);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div class="stat-icon" style="color: var(--primary-purple); background: rgba(217, 119, 87, 0.15); width: 38px; height: 38px; border-radius: 8px;">
              <i data-lucide="target"></i>
            </div>
            <div>
              <h3 style="font-family: var(--font-serif); font-size: 1.15rem;">🎯 Target Niche & AI Agent Focus</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted);">Tell your AI Agent what niche to filter and tailor news for (e.g. Tech, Politics, AI, Finance, Crypto, Health)</p>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label style="font-size: 0.84rem; font-weight: 600;">NICHE_FOCUS</label>
            <input type="text" id="input-NICHE_FOCUS" class="filter-select" placeholder="e.g. Artificial Intelligence, Tech News & Innovation" value="Artificial Intelligence, Tech News & Innovation" />
            <span style="font-size: 0.76rem; color: var(--text-dim);">The LLM agent uses this topic prompt to select and format relevant news for your target audience.</span>
          </div>
        </div>

        <!-- Step 1: Multi-LLM Provider Selection (Groq, OpenAI, Claude, Gemini) -->
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="stat-icon" style="color: var(--primary-purple); background: rgba(217, 119, 87, 0.15); width: 40px; height: 40px; border-radius: 8px;">
                <i data-lucide="cpu"></i>
              </div>
              <div>
                <h3 style="font-family: var(--font-serif); font-size: 1.15rem;">1. Choose LLM Provider (Any LLM API Key)</h3>
                <p style="font-size: 0.82rem; color: var(--text-muted);">Powers article rewriting & content generation. Use Groq, OpenAI, Claude, or Gemini!</p>
              </div>
            </div>
            <span class="badge badge-scraped" style="font-size: 0.7rem;">REQUIRED (PICK ANY 1)</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            
            <!-- Groq API Key -->
            <div style="display: flex; flex-direction: column; gap: 4px; background: var(--bg-surface); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 0.84rem; font-weight: 700; color: var(--primary-purple);">⚡ Groq API Key (Llama 3.3 70B — Fast & Free)</label>
                <span style="font-size: 0.76rem; color: var(--text-dim);">Get key: <a href="https://console.groq.com/keys" target="_blank" style="color: var(--primary-purple); font-weight: 600;">console.groq.com/keys</a></span>
              </div>
              <div style="display: flex; gap: 10px; margin-top: 4px;">
                <input type="password" id="input-GROQ_API_KEY" class="filter-select" style="flex: 1; background: var(--bg-card);" placeholder="Enter Groq key (gsk_...)" />
                <button class="btn btn-secondary" onclick="SettingsPage.toggleVisibility('input-GROQ_API_KEY')">Show/Hide</button>
              </div>
            </div>

            <!-- OpenAI API Key -->
            <div style="display: flex; flex-direction: column; gap: 4px; background: var(--bg-surface); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 0.84rem; font-weight: 700; color: #2b7bb9;">🟢 OpenAI ChatGPT API Key (GPT-4o / GPT-4o mini)</label>
                <span style="font-size: 0.76rem; color: var(--text-dim);">Get key: <a href="https://platform.openai.com/api-keys" target="_blank" style="color: #2b7bb9; font-weight: 600;">platform.openai.com/api-keys</a></span>
              </div>
              <div style="display: flex; gap: 10px; margin-top: 4px;">
                <input type="password" id="input-OPENAI_API_KEY" class="filter-select" style="flex: 1; background: var(--bg-card);" placeholder="Enter OpenAI key (sk-proj-...)" />
                <button class="btn btn-secondary" onclick="SettingsPage.toggleVisibility('input-OPENAI_API_KEY')">Show/Hide</button>
              </div>
            </div>

            <!-- Anthropic Claude API Key -->
            <div style="display: flex; flex-direction: column; gap: 4px; background: var(--bg-surface); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 0.84rem; font-weight: 700; color: #d97757;">🧡 Anthropic Claude API Key (Claude 3.5 Sonnet)</label>
                <span style="font-size: 0.76rem; color: var(--text-dim);">Get key: <a href="https://console.anthropic.com/settings/keys" target="_blank" style="color: #d97757; font-weight: 600;">console.anthropic.com/settings/keys</a></span>
              </div>
              <div style="display: flex; gap: 10px; margin-top: 4px;">
                <input type="password" id="input-ANTHROPIC_API_KEY" class="filter-select" style="flex: 1; background: var(--bg-card);" placeholder="Enter Anthropic key (sk-ant-api...)" />
                <button class="btn btn-secondary" onclick="SettingsPage.toggleVisibility('input-ANTHROPIC_API_KEY')">Show/Hide</button>
              </div>
            </div>

            <!-- Google Gemini & Nano Banana API Key -->
            <div style="display: flex; flex-direction: column; gap: 4px; background: var(--bg-surface); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 0.84rem; font-weight: 700; color: #a855f7;">🍌 Nano Banana / Google Gemini API Key (AI Pro Plan - Imagen 3 / Gemini 2.5)</label>
                <span style="font-size: 0.76rem; color: var(--text-dim);">Get key: <a href="https://aistudio.google.com/apikey" target="_blank" style="color: #a855f7; font-weight: 600;">aistudio.google.com/apikey</a></span>
              </div>
              <div style="display: flex; gap: 10px; margin-top: 4px;">
                <input type="password" id="input-GOOGLE_API_KEY" class="filter-select" style="flex: 1; background: var(--bg-card);" placeholder="Enter Gemini / Nano Banana key (AIzaSy...)" />
                <button class="btn btn-secondary" onclick="SettingsPage.toggleVisibility('input-GOOGLE_API_KEY')">Show/Hide</button>
              </div>
              <span style="font-size: 0.74rem; color: var(--text-muted); margin-top: 4px;">
                Includes <strong>Nano Banana (Imagen 3.0 Generate)</strong> for high-resolution contextual social media post cards.
              </span>
            </div>

          </div>
        </div>

        <!-- Nano Banana Image & 4-Slide Deck Settings -->
        <div class="glass-card" style="border: 1px solid #a855f7;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="stat-icon" style="color: #a855f7; background: rgba(168, 85, 247, 0.12); width: 40px; height: 40px; border-radius: 8px;">
                <i data-lucide="image"></i>
              </div>
              <div>
                <h3 style="font-family: var(--font-serif); font-size: 1.15rem;">🍌 Nano Banana 4-Slide Deck & Aspect Ratio Settings</h3>
                <p style="font-size: 0.82rem; color: var(--text-muted);">Configure automatic 4-card image decks (1 Attracting Banner + 3 Context/Concept Details) & ratio</p>
              </div>
            </div>
            <span class="badge" style="font-size: 0.7rem; background: rgba(168, 85, 247, 0.15); color: #a855f7;">NANO BANANA</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label style="font-size: 0.84rem; font-weight: 600;">DEFAULT_ASPECT_RATIO</label>
                <select id="input-DEFAULT_ASPECT_RATIO" class="filter-select" style="width: 100%; margin-top: 4px;">
                  <option value="16:9" selected>16:9 Widescreen (Twitter, Reddit, LinkedIn - Recommended)</option>
                  <option value="4:5">4:5 Mobile Portrait (Instagram Feed & Mobile)</option>
                  <option value="1:1">1:1 Square (Classic Social Grid)</option>
                </select>
                <span style="font-size: 0.74rem; color: var(--text-muted); margin-top: 4px; display: block;">Twitter, Reddit & LinkedIn perform best with 16:9 widescreen visuals!</span>
              </div>

              <div>
                <label style="font-size: 0.84rem; font-weight: 600;">4-SLIDE DECK SEQUENCE</label>
                <input type="text" id="input-SLIDE_STRUCTURE" class="filter-select" value="1 Banner (Attract Hook) + 3 Concept/Context Breakdown Cards" readonly style="width: 100%; margin-top: 4px; background: var(--bg-surface);" />
                <span style="font-size: 0.74rem; color: var(--text-muted); margin-top: 4px; display: block;">Slide 1: High-impact Title Banner Hook ➔ Slides 2-4: Deep concept visualization & context.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- App 2 Integration REST Transfer Gateway Settings -->
        <div class="glass-card" style="border: 1px solid #2e7d32;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="stat-icon" style="color: #2e7d32; background: rgba(46, 125, 50, 0.12); width: 40px; height: 40px; border-radius: 8px;">
                <i data-lucide="share-2"></i>
              </div>
              <div>
                <h3 style="font-family: var(--font-serif); font-size: 1.15rem;">📡 App 2 (Omni-Channel AI Agent) Integration Gateway</h3>
                <p style="font-size: 0.82rem; color: var(--text-muted);">Configures REST API transfer endpoints so App 2 can fetch refined news & Nano Banana graphics</p>
              </div>
            </div>
            <span class="badge" style="font-size: 0.7rem; background: rgba(46, 125, 50, 0.15); color: #2e7d32;">INTEGRATION READY</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; background: var(--bg-surface); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.84rem; font-weight: 700;">REST API Export Endpoint:</span>
              <code style="font-size: 0.82rem; color: var(--primary-purple); background: var(--bg-card); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border-color);">http://127.0.0.1:8000/api/v1/export/refined-posts</code>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.84rem; font-weight: 700;">Integration Health Endpoint:</span>
              <code style="font-size: 0.82rem; color: #2b7bb9; background: var(--bg-card); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border-color);">http://127.0.0.1:8000/api/v1/export/status</code>
            </div>
            <span style="font-size: 0.76rem; color: var(--text-muted);">
              All social media account credentials, auto-posting, and multi-channel scheduling are managed by <strong>App 2 (Omni-Channel AI Agent)</strong>.
            </span>
          </div>
        </div>
                <i data-lucide="message-square"></i>
        <!-- Bottom Save Button -->
        <div style="display: flex; align-items: center; justify-content: center; margin-top: 10px; margin-bottom: 30px;">
          <button class="btn btn-primary btn-glow" onclick="SettingsPage.saveSettings()" style="padding: 14px 40px; font-size: 1rem;">
            <i data-lucide="zap"></i> Save Research Engine Configuration
          </button>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    await this.loadSettings();
  },

  async loadSettings() {
    try {
      const data = await App.fetchApi('/api/settings');
      const keys = data.keys;

      for (const [key, info] of Object.entries(keys)) {
        const input = document.getElementById(`input-${key}`);
        if (input && info.raw) {
          input.value = info.raw;
        }
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  },

  async saveSettings() {
    const keys = [
      "NICHE_FOCUS",
      "GOOGLE_API_KEY",
      "GROQ_API_KEY",
      "OPENAI_API_KEY",
      "ANTHROPIC_API_KEY",
      "INSTAGRAM_ACCESS_TOKEN",
      "INSTAGRAM_ACCOUNT_ID",
      "TWITTER_API_KEY",
      "TWITTER_API_SECRET",
      "TWITTER_ACCESS_TOKEN",
      "TWITTER_ACCESS_SECRET",
      "REDDIT_CLIENT_ID",
      "REDDIT_CLIENT_SECRET",
      "REDDIT_USERNAME",
      "REDDIT_PASSWORD",
      "LINKEDIN_ACCESS_TOKEN",
      "LINKEDIN_AUTHOR_URN",
    ];

    const payload = {};
    for (const key of keys) {
      const input = document.getElementById(`input-${key}`);
      if (input) {
        payload[key] = input.value.trim();
      }
    }

    try {
      const res = await App.fetchApi('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      App.showToast('Target Niche & API Keys activated and saved!', 'success');
      const msg = document.getElementById('save-status-msg');
      if (msg) {
        msg.textContent = "Saved & Activated!";
        setTimeout(() => msg.textContent = "", 4000);
      }
    } catch (err) {
      App.showToast(`Failed to save settings: ${err.message}`, 'error');
    }
  },

  toggleVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  }
};
