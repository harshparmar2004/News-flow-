/**
 * Settings Page Renderer — Autonomous News Intelligence Cockpit
 * Masterclass Organized UI/UX:
 * 1. Direct Web Ingestion & JEV (TypeSafe AI) Distribution Engine
 * 2. Telegram Bot Remote Control & Executive Review Cockpit
 * 3. Multi-LLM Providers (Groq, OpenAI, Claude, Gemini) & Target Niche Focus
 * 4. Authentic Image Extraction & Storage
 */
const SettingsPage = {
  async render(container) {
    container.innerHTML = `
      <div style="max-width: 920px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; padding-bottom: 60px;">
        
        <!-- Header Banner -->
        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); padding: 22px 28px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="badge" style="background: rgba(217,119,87,0.12); color: var(--primary-purple); font-weight: 700; font-size: 0.72rem; letter-spacing: 0.5px;">PIPELINE INTEGRATIONS</span>
              <span id="global-sync-badge" class="badge" style="background: rgba(46,125,50,0.12); color: #2e7d32; font-size: 0.72rem;">● SYSTEM READY</span>
            </div>
            <h2 style="font-family: var(--font-serif); font-size: 1.45rem; margin: 0; color: var(--text-main); font-weight: 700;">Settings & Integration Cockpit</h2>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin: 4px 0 0 0;">
              Manage Web Ingestion & JEV TypeSafe AI Routing, Telegram Remote Control, and Multi-LLM Providers.
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span id="save-status-msg" style="font-size: 0.85rem; color: #2e7d32; font-weight: 600;"></span>
            <button class="btn btn-primary btn-glow" onclick="SettingsPage.saveSettings()" style="padding: 10px 22px; font-weight: 600; display: flex; align-items: center; gap: 8px; font-size: 0.88rem;">
              <i data-lucide="save"></i> Save All Settings
            </button>
          </div>
        </div>

        <!-- =================================================================== -->
        <!-- 1. DIRECT WEB INGESTION & JEV (TYPESAFE AI) DISTRIBUTION ENGINE     -->
        <!-- =================================================================== -->
        <div class="glass-card" style="border: 1px solid var(--border-color); border-radius: 14px; padding: 26px; background: var(--bg-card); box-shadow: 0 2px 12px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 20px;">
          
          <!-- Card Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 18px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(43,123,185,0.1); color: #2b7bb9; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="globe" style="width: 22px; height: 22px;"></i>
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0; color: var(--text-main);">Direct Web Ingestion & JEV AI Engine</h3>
                  <span id="web-conn-badge" class="badge" style="background: rgba(43,123,185,0.1); color: #2b7bb9; font-size: 0.72rem; font-weight: 600;">CHECKING BRIDGE...</span>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 3px 0 0 0;">
                  Autonomous research posts directly to NewsFlow Admin. JEV Agent (TypeSafe AI) routes stories into 6 editorial beats.
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-secondary" onclick="SettingsPage.testWebConnection()" style="font-size: 0.78rem; padding: 6px 14px; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="activity"></i> Test Bridge
              </button>
              <a href="http://localhost:3000/admin" target="_blank" class="btn btn-secondary" style="font-size: 0.78rem; padding: 6px 14px; text-decoration: none; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="external-link"></i> Admin Desk
              </a>
            </div>
          </div>

          <!-- Organized Architectural Stepper -->
          <div style="background: var(--bg-surface); padding: 14px 18px; border-radius: 10px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.78rem; color: var(--text-muted);">
              <span style="font-weight: 700; color: var(--text-main); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">Architecture:</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 0.78rem;">
              <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 4px 10px; border-radius: 6px; font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 6px;">
                <span style="color: var(--primary-purple);">①</span> 16 Sources Scraped
              </div>
              <span style="color: var(--text-dim);">→</span>
              <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 4px 10px; border-radius: 6px; font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 6px;">
                <span style="color: #2b7bb9;">②</span> Web Ingestion (:3000)
              </div>
              <span style="color: var(--text-dim);">→</span>
              <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 4px 10px; border-radius: 6px; font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 6px;">
                <span style="color: #a855f7;">③</span> JEV Agent (TypeSafe AI)
              </div>
              <span style="color: var(--text-dim);">→</span>
              <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 4px 10px; border-radius: 6px; font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 6px;">
                <span style="color: #2e7d32;">④</span> 6 Beat Categories
              </div>
            </div>
          </div>

          <!-- Section A: Web Destination & Credentials -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="server" style="width: 14px; height: 14px;"></i> Target Website & Ingest Credentials
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <!-- Web URL -->
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Target Web Endpoint</label>
                  <code style="font-size: 0.72rem; color: var(--text-dim);">NEWSFLOW_WEB_URL</code>
                </div>
                <input type="text" id="input-NEWSFLOW_WEB_URL" class="filter-select" placeholder="http://localhost:3000" value="http://localhost:3000" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; font-size: 0.85rem;" />
                <span style="font-size: 0.74rem; color: var(--text-muted);">Destination where autonomous stories & lead images are delivered.</span>
              </div>

              <!-- Admin Ingest API Key -->
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Admin Ingestion API Key</label>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <code style="font-size: 0.72rem; color: var(--text-dim);">NEWSFLOW_WEB_API_KEY</code>
                    <button type="button" class="btn btn-secondary" onclick="SettingsPage.toggleVisibility('input-NEWSFLOW_WEB_API_KEY')" style="padding: 1px 6px; font-size: 0.7rem;">Show</button>
                  </div>
                </div>
                <input type="password" id="input-NEWSFLOW_WEB_API_KEY" class="filter-select" placeholder="nf_live_sec_..." value="nf_live_sec_9942a8b7e1034f68a" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; font-size: 0.85rem;" />
                <span style="font-size: 0.74rem; color: var(--text-muted);">Matches <code>x-api-key</code> authorized in <code>newsflow-web/.env</code>.</span>
              </div>
            </div>
          </div>

          <!-- Section B: JEV Agent & TypeSafe AI Setup -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 10px; padding: 16px 18px; display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 24px; height: 24px; border-radius: 6px; background: rgba(168,85,247,0.12); color: #a855f7; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">
                  <i data-lucide="cpu" style="width: 14px; height: 14px;"></i>
                </div>
                <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main);">
                  TypeSafe AI API Key <span style="font-weight: 400; color: var(--text-muted);">(JEV Editorial Routing Agent)</span>
                </label>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <a href="http://localhost:3000/admin/jev" target="_blank" style="font-size: 0.75rem; color: #a855f7; text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                  Open JEV Desk <i data-lucide="arrow-up-right" style="width: 12px; height: 12px;"></i>
                </a>
                <button type="button" class="btn btn-secondary" onclick="SettingsPage.toggleVisibility('input-TYPESAFE_API_KEY')" style="padding: 2px 8px; font-size: 0.7rem;">Show</button>
              </div>
            </div>

            <input type="password" id="input-TYPESAFE_API_KEY" class="filter-select" placeholder="Enter TypeSafe API key (ts_...)" value="ts_demo_secret_key_849204" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; font-size: 0.85rem;" />

            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 0.75rem; color: var(--text-muted);">
              <span>JEV automatically triages incoming stories and routes them to 5 target beats:</span>
              <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                <span class="badge" style="background: var(--bg-card); border: 1px solid var(--border-color); font-size: 0.7rem; color: var(--text-main);">AI & Robotics</span>
                <span class="badge" style="background: var(--bg-card); border: 1px solid var(--border-color); font-size: 0.7rem; color: var(--text-main);">Startups & VC</span>
                <span class="badge" style="background: var(--bg-card); border: 1px solid var(--border-color); font-size: 0.7rem; color: var(--text-main);">Gadgets & Hardware</span>
                <span class="badge" style="background: var(--bg-card); border: 1px solid var(--border-color); font-size: 0.7rem; color: var(--text-main);">Cybersecurity</span>
                <span class="badge" style="background: var(--bg-card); border: 1px solid var(--border-color); font-size: 0.7rem; color: var(--text-main);">Tech</span>
              </div>
            </div>
          </div>

          <!-- Section C: Ingestion Rules -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <!-- Auto Publish Toggle -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Auto-Publish Stream</label>
                <code style="font-size: 0.72rem; color: var(--text-dim);">AUTO_PUBLISH_TO_WEB</code>
              </div>
              <select id="input-AUTO_PUBLISH_TO_WEB" class="filter-select" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; font-size: 0.84rem;">
                <option value="true">Enabled (Auto-upload stories when research finishes)</option>
                <option value="false">Disabled (Manual upload via Editorial Vault)</option>
              </select>
              <span style="font-size: 0.74rem; color: var(--text-muted);">Streams all scraped stories to NewsFlow Web on each pipeline run.</span>
            </div>

            <!-- Default Web Status -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Initial Ingestion Status</label>
                <code style="font-size: 0.72rem; color: var(--text-dim);">DEFAULT_WEB_STATUS</code>
              </div>
              <select id="input-DEFAULT_WEB_STATUS" class="filter-select" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; font-size: 0.84rem;">
                <option value="published">published (Recommended — Immediately live on homepage & article pages)</option>
                <option value="draft">draft (Draft mode in Admin Desk)</option>
              </select>
              <span style="font-size: 0.74rem; color: var(--text-muted);">"published" makes stories immediately readable on the live website.</span>
            </div>
          </div>

          <!-- Bridge Feedback Banner -->
          <div id="web-test-feedback" style="display: none; padding: 10px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 500;"></div>

        </div>

        <!-- =================================================================== -->
        <!-- 2. TELEGRAM BOT REMOTE CONTROL & EXECUTIVE REVIEW COCKPIT           -->
        <!-- =================================================================== -->
        <div class="glass-card" style="border: 1px solid var(--border-color); border-radius: 14px; padding: 26px; background: var(--bg-card); box-shadow: 0 2px 12px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 20px;">
          
          <!-- Card Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 18px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(0,136,204,0.1); color: #0088cc; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="send" style="width: 22px; height: 22px;"></i>
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0; color: var(--text-main);">Telegram Bot Remote Control & Review</h3>
                  <span id="tg-status-badge" class="badge" style="background: rgba(0,136,204,0.1); color: #0088cc; font-size: 0.72rem; font-weight: 600;">CHECKING BOT...</span>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 3px 0 0 0;">
                  Trigger pipeline runs with <code>/run</code> from Telegram, monitor live health, and receive executive digests with photos and links.
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-secondary" onclick="SettingsPage.testTelegram()" style="font-size: 0.78rem; padding: 6px 14px; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="bell"></i> Send Ping
              </button>
              <button id="tg-toggle-listener-btn" class="btn btn-secondary" onclick="SettingsPage.toggleTelegramListener()" style="font-size: 0.78rem; padding: 6px 14px; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="radio"></i> Toggle Listener
              </button>
            </div>
          </div>

          <!-- Organized 6-Command Palette Grid -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="command" style="width: 14px; height: 14px;"></i> Available Telegram Bot Commands
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between;">
                <code style="color: #0088cc; font-weight: 700; font-size: 0.82rem;">/run</code>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Start research pipeline</span>
              </div>
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between;">
                <code style="color: #0088cc; font-weight: 700; font-size: 0.82rem;">/status</code>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Pipeline state & DB counts</span>
              </div>
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between;">
                <code style="color: #0088cc; font-weight: 700; font-size: 0.82rem;">/latest</code>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Top 5 stories with links</span>
              </div>
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between;">
                <code style="color: #0088cc; font-weight: 700; font-size: 0.82rem;">/sync</code>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Sync Admin live status</span>
              </div>
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between;">
                <code style="color: #0088cc; font-weight: 700; font-size: 0.82rem;">/stop</code>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Immediate pipeline abort</span>
              </div>
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between;">
                <code style="color: #0088cc; font-weight: 700; font-size: 0.82rem;">/ping</code>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Health & latency check</span>
              </div>
            </div>
          </div>

          <!-- Section A: Telegram Bot Credentials -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="key" style="width: 14px; height: 14px;"></i> Bot Credentials & Chat Authorization
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <!-- Bot Token -->
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Telegram Bot Token</label>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <a href="https://t.me/BotFather" target="_blank" style="font-size: 0.74rem; color: #0088cc; text-decoration: none; font-weight: 500;">@BotFather ↗</a>
                    <button type="button" class="btn btn-secondary" onclick="SettingsPage.toggleVisibility('input-TELEGRAM_BOT_TOKEN')" style="padding: 1px 6px; font-size: 0.7rem;">Show</button>
                  </div>
                </div>
                <input type="password" id="input-TELEGRAM_BOT_TOKEN" class="filter-select" placeholder="e.g. 7123456789:AAHk..." style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; font-size: 0.85rem;" />
                <span style="font-size: 0.74rem; color: var(--text-muted);">Bot token provided by Telegram's @BotFather.</span>
              </div>

              <!-- Chat ID -->
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Authorized Chat ID</label>
                  <a href="https://t.me/userinfobot" target="_blank" style="font-size: 0.74rem; color: #0088cc; text-decoration: none; font-weight: 500;">Get via @userinfobot ↗</a>
                </div>
                <input type="text" id="input-TELEGRAM_CHAT_ID" class="filter-select" placeholder="e.g. 123456789" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; font-size: 0.85rem;" />
                <span style="font-size: 0.74rem; color: var(--text-muted);">Your numeric Telegram user ID (strictly whitelisted for security).</span>
              </div>
            </div>
          </div>

          <!-- Section B: Remote Execution & Digests -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <!-- Remote Control Toggle -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Remote Execution Mode</label>
                <code style="font-size: 0.72rem; color: var(--text-dim);">TELEGRAM_REMOTE_CONTROL</code>
              </div>
              <select id="input-TELEGRAM_REMOTE_CONTROL" class="filter-select" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; font-size: 0.84rem;">
                <option value="true">Enabled (Accept /run and button triggers)</option>
                <option value="false">Disabled (Notifications only, no remote runs)</option>
              </select>
              <span style="font-size: 0.74rem; color: var(--text-muted);">Allows triggering research from your phone with one tap.</span>
            </div>

            <!-- Completion Digest Toggle -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Executive Run Digest</label>
                <code style="font-size: 0.72rem; color: var(--text-dim);">TELEGRAM_NOTIFY_COMPLETION</code>
              </div>
              <select id="input-TELEGRAM_NOTIFY_COMPLETION" class="filter-select" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; font-size: 0.84rem;">
                <option value="true">Enabled (Send completion digest with article links)</option>
                <option value="false">Disabled (Silent execution)</option>
              </select>
              <span style="font-size: 0.74rem; color: var(--text-muted);">Dispatches rich summary with scraped counts and top stories.</span>
            </div>
          </div>

          <!-- Security Whitelist Banner -->
          <div style="background: rgba(43,123,185,0.06); border: 1px solid rgba(43,123,185,0.18); border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; font-size: 0.76rem; color: #2b7bb9;">
            <i data-lucide="shield-check" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
            <span><strong>Security Enforcement:</strong> Only messages from your verified <code>TELEGRAM_CHAT_ID</code> can trigger pipeline commands. Unauthorized users are blocked automatically.</span>
          </div>

          <!-- Telegram Feedback Banner -->
          <div id="tg-test-feedback" style="display: none; padding: 10px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 500;"></div>

        </div>

        <!-- =================================================================== -->
        <!-- 3. TARGET NICHE FOCUS & MULTI-LLM PROVIDER SELECTION                -->
        <!-- =================================================================== -->
        <div class="glass-card" style="border: 1px solid var(--border-color); border-radius: 14px; padding: 26px; background: var(--bg-card); box-shadow: 0 2px 12px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 20px;">
          
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 18px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(217,119,87,0.12); color: var(--primary-purple); display: flex; align-items: center; justify-content: center;">
                <i data-lucide="cpu" style="width: 22px; height: 22px;"></i>
              </div>
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0; color: var(--text-main);">Target Niche & Multi-LLM Providers</h3>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 3px 0 0 0;">
                  Powers intelligent research filtering, structured Tech Notes synthesis, and tone tailoring.
                </p>
              </div>
            </div>
            <span class="badge" style="font-size: 0.7rem; background: rgba(217,119,87,0.12); color: var(--primary-purple); font-weight: 600;">COGNITIVE ENGINE</span>
          </div>

          <!-- Niche Focus Input -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Target Niche Focus</label>
              <code style="font-size: 0.72rem; color: var(--text-dim);">NICHE_FOCUS</code>
            </div>
            <input type="text" id="input-NICHE_FOCUS" class="filter-select" placeholder="e.g. Artificial Intelligence, Tech News & Innovation" value="Artificial Intelligence, Tech News & Innovation" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; font-size: 0.85rem;" />
            <span style="font-size: 0.74rem; color: var(--text-muted);">The AI agent uses this topic scope to filter and format relevant news.</span>
          </div>

          <!-- LLM Providers Grid (2x2) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            
            <!-- Groq API Key -->
            <div style="display: flex; flex-direction: column; gap: 6px; background: var(--bg-surface); padding: 14px 16px; border-radius: 10px; border: 1px solid var(--border-color);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 0.82rem; font-weight: 700; color: var(--primary-purple);">⚡ Groq (Llama 3.3 70B)</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <a href="https://console.groq.com/keys" target="_blank" style="font-size: 0.72rem; color: var(--primary-purple); text-decoration: none; font-weight: 600;">console.groq.com ↗</a>
                  <button type="button" class="btn btn-secondary" onclick="SettingsPage.toggleVisibility('input-GROQ_API_KEY')" style="padding: 1px 6px; font-size: 0.7rem;">Show</button>
                </div>
              </div>
              <input type="password" id="input-GROQ_API_KEY" class="filter-select" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 10px; font-size: 0.83rem;" placeholder="gsk_..." />
            </div>

            <!-- OpenAI API Key -->
            <div style="display: flex; flex-direction: column; gap: 6px; background: var(--bg-surface); padding: 14px 16px; border-radius: 10px; border: 1px solid var(--border-color);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 0.82rem; font-weight: 700; color: #2b7bb9;">🟢 OpenAI (GPT-4o)</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <a href="https://platform.openai.com/api-keys" target="_blank" style="font-size: 0.72rem; color: #2b7bb9; text-decoration: none; font-weight: 600;">platform.openai.com ↗</a>
                  <button type="button" class="btn btn-secondary" onclick="SettingsPage.toggleVisibility('input-OPENAI_API_KEY')" style="padding: 1px 6px; font-size: 0.7rem;">Show</button>
                </div>
              </div>
              <input type="password" id="input-OPENAI_API_KEY" class="filter-select" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 10px; font-size: 0.83rem;" placeholder="sk-proj-..." />
            </div>

            <!-- Anthropic Claude API Key -->
            <div style="display: flex; flex-direction: column; gap: 6px; background: var(--bg-surface); padding: 14px 16px; border-radius: 10px; border: 1px solid var(--border-color);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 0.82rem; font-weight: 700; color: #d97757;">🧡 Anthropic (Claude 3.5)</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <a href="https://console.anthropic.com/settings/keys" target="_blank" style="font-size: 0.72rem; color: #d97757; text-decoration: none; font-weight: 600;">console.anthropic.com ↗</a>
                  <button type="button" class="btn btn-secondary" onclick="SettingsPage.toggleVisibility('input-ANTHROPIC_API_KEY')" style="padding: 1px 6px; font-size: 0.7rem;">Show</button>
                </div>
              </div>
              <input type="password" id="input-ANTHROPIC_API_KEY" class="filter-select" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 10px; font-size: 0.83rem;" placeholder="sk-ant-api..." />
            </div>

            <!-- Google Gemini API Key -->
            <div style="display: flex; flex-direction: column; gap: 6px; background: var(--bg-surface); padding: 14px 16px; border-radius: 10px; border: 1px solid var(--border-color);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 0.82rem; font-weight: 700; color: #a855f7;">✨ Google (Gemini 2.0)</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <a href="https://aistudio.google.com/apikey" target="_blank" style="font-size: 0.72rem; color: #a855f7; text-decoration: none; font-weight: 600;">aistudio.google.com ↗</a>
                  <button type="button" class="btn btn-secondary" onclick="SettingsPage.toggleVisibility('input-GOOGLE_API_KEY')" style="padding: 1px 6px; font-size: 0.7rem;">Show</button>
                </div>
              </div>
              <input type="password" id="input-GOOGLE_API_KEY" class="filter-select" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 10px; font-size: 0.83rem;" placeholder="AIzaSy..." />
            </div>

          </div>
        </div>

        <!-- =================================================================== -->
        <!-- 4. AUTHENTIC IMAGE EXTRACTION & STORAGE SETTINGS                     -->
        <!-- =================================================================== -->
        <div class="glass-card" style="border: 1px solid var(--border-color); border-radius: 14px; padding: 26px; background: var(--bg-card); box-shadow: 0 2px 12px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 16px;">
          
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(46,125,50,0.12); color: #2e7d32; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="camera" style="width: 22px; height: 22px;"></i>
              </div>
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0; color: var(--text-main);">Authentic Image Extraction & Storage</h3>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 3px 0 0 0;">
                  Web scraper image extraction, OpenGraph fallback parsing, and local WebP optimization.
                </p>
              </div>
            </div>
            <span class="badge" style="font-size: 0.7rem; background: rgba(46,125,50,0.12); color: #2e7d32; font-weight: 600;">SCRAPER ENGINE</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Image Optimization Format</label>
              <input type="text" class="filter-select" value="WebP (Lossless compression, instant delivery)" readonly style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; font-size: 0.84rem; color: var(--text-muted);" />
              <span style="font-size: 0.74rem; color: var(--text-muted);">Scraped images are automatically converted and cached locally as WebP.</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Fallback Strategy</label>
              <input type="text" class="filter-select" value="OpenGraph meta tags / Direct source URL extraction" readonly style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; font-size: 0.84rem; color: var(--text-muted);" />
              <span style="font-size: 0.74rem; color: var(--text-muted);">Falls back to publisher og:image if inline photos are not present.</span>
            </div>
          </div>
        </div>

        <!-- Bottom Save Button -->
        <div style="display: flex; align-items: center; justify-content: center; margin-top: 10px;">
          <button class="btn btn-primary btn-glow" onclick="SettingsPage.saveSettings()" style="padding: 14px 44px; font-size: 1rem; font-weight: 700; display: flex; align-items: center; gap: 10px; border-radius: 10px;">
            <i data-lucide="zap"></i> Save & Activate All Configurations
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
      const keys = data.keys || {};

      for (const [key, info] of Object.entries(keys)) {
        const input = document.getElementById(`input-${key}`);
        if (input && info.raw !== undefined) {
          input.value = info.raw;
        }
      }

      this.refreshWebStatus();
      this.refreshTelegramStatus();
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  },

  async refreshWebStatus() {
    const badge = document.getElementById('web-conn-badge');
    try {
      const st = await App.fetchApi('/api/web/status');
      if (badge) {
        if (st.web_url) {
          badge.innerHTML = `● BRIDGE ACTIVE (${st.default_status || 'draft'})`;
          badge.style.background = 'rgba(46,125,50,0.12)';
          badge.style.color = '#2e7d32';
        }
      }
    } catch (e) {
      if (badge) {
        badge.innerHTML = `○ OFFLINE`;
        badge.style.background = 'rgba(217,83,79,0.12)';
        badge.style.color = '#d9534f';
      }
    }
  },

  async refreshTelegramStatus() {
    const badge = document.getElementById('tg-status-badge');
    const toggleBtn = document.getElementById('tg-toggle-listener-btn');
    try {
      const st = await App.fetchApi('/api/telegram/status');
      if (badge) {
        if (st.configured && st.valid) {
          if (st.is_polling) {
            badge.innerHTML = `🟢 LISTENING (@${st.bot_user || 'Bot'})`;
            badge.style.background = 'rgba(46,125,50,0.12)';
            badge.style.color = '#2e7d32';
            if (toggleBtn) toggleBtn.innerHTML = '<i data-lucide="square" style="width: 14px; height: 14px;"></i> Stop Listener';
          } else {
            badge.innerHTML = `🟡 STANDBY (@${st.bot_user || 'Bot'})`;
            badge.style.background = 'rgba(245,158,11,0.12)';
            badge.style.color = '#d97706';
            if (toggleBtn) toggleBtn.innerHTML = '<i data-lucide="play" style="width: 14px; height: 14px;"></i> Start Listener';
          }
        } else if (st.configured && !st.valid) {
          badge.innerHTML = `🔴 INVALID TOKEN`;
          badge.style.background = 'rgba(217,83,79,0.12)';
          badge.style.color = '#d9534f';
        } else {
          badge.innerHTML = `⚪ NOT CONFIGURED`;
          badge.style.background = 'rgba(150,150,150,0.12)';
          badge.style.color = 'var(--text-muted)';
        }
        if (window.lucide) window.lucide.createIcons();
      }
    } catch (e) {
      if (badge) {
        badge.innerHTML = `⚪ UNKNOWN`;
      }
    }
  },

  async testWebConnection() {
    const fb = document.getElementById('web-test-feedback');
    if (fb) {
      fb.style.display = 'block';
      fb.style.background = 'rgba(43,123,185,0.08)';
      fb.style.color = '#2b7bb9';
      fb.style.border = '1px solid rgba(43,123,185,0.2)';
      fb.innerHTML = 'Testing connection to NewsFlow Web API (:3000)...';
    }

    try {
      const res = await App.fetchApi('/api/web/test-connection', { method: 'POST' });
      if (fb) {
        if (res.success) {
          fb.style.background = 'rgba(46,125,50,0.1)';
          fb.style.color = '#2e7d32';
          fb.style.border = '1px solid rgba(46,125,50,0.25)';
          fb.innerHTML = `✅ <strong>Connected!</strong> NewsFlow Web responded in <strong>${res.latency_ms}ms</strong>. JEV TypeSafe AI Agent is <strong>${res.jev_ready ? 'ready for beat routing' : 'awaiting key'}</strong>.`;
        } else {
          fb.style.background = 'rgba(217,83,79,0.1)';
          fb.style.color = '#d9534f';
          fb.style.border = '1px solid rgba(217,83,79,0.25)';
          fb.innerHTML = `⚠️ <strong>Connection Notice:</strong> ${res.message}`;
        }
      }
      this.refreshWebStatus();
    } catch (err) {
      if (fb) {
        fb.style.background = 'rgba(217,83,79,0.1)';
        fb.style.color = '#d9534f';
        fb.style.border = '1px solid rgba(217,83,79,0.25)';
        fb.innerHTML = `❌ <strong>Failed:</strong> ${err.message}`;
      }
    }
  },

  async testTelegram() {
    const fb = document.getElementById('tg-test-feedback');
    if (fb) {
      fb.style.display = 'block';
      fb.style.background = 'rgba(0,136,204,0.08)';
      fb.style.color = '#0088cc';
      fb.style.border = '1px solid rgba(0,136,204,0.2)';
      fb.innerHTML = 'Dispatching test ping to your Telegram chat...';
    }

    try {
      const res = await App.fetchApi('/api/telegram/test', { method: 'POST' });
      if (fb) {
        fb.style.background = 'rgba(46,125,50,0.1)';
        fb.style.color = '#2e7d32';
        fb.style.border = '1px solid rgba(46,125,50,0.25)';
        fb.innerHTML = `✅ <strong>Success!</strong> ${res.message || 'Check your Telegram app for the verification ping!'}`;
      }
      App.showToast('Test ping sent to your Telegram!', 'success');
      this.refreshTelegramStatus();
    } catch (err) {
      if (fb) {
        fb.style.background = 'rgba(217,83,79,0.1)';
        fb.style.color = '#d9534f';
        fb.style.border = '1px solid rgba(217,83,79,0.25)';
        fb.innerHTML = `❌ <strong>Failed to dispatch Telegram ping:</strong> ${err.message}. Make sure you have started a chat with the bot in Telegram first.`;
      }
      App.showToast(`Telegram ping failed: ${err.message}`, 'error');
    }
  },

  async toggleTelegramListener() {
    try {
      const res = await App.fetchApi('/api/telegram/toggle-polling', { method: 'POST' });
      App.showToast(res.message || 'Telegram listener toggled.', 'info');
      await this.refreshTelegramStatus();
    } catch (err) {
      App.showToast(`Failed to toggle listener: ${err.message}`, 'error');
    }
  },

  async saveSettings() {
    const keys = [
      "NICHE_FOCUS",
      "NEWSFLOW_WEB_URL",
      "NEWSFLOW_WEB_API_KEY",
      "TYPESAFE_API_KEY",
      "AUTO_PUBLISH_TO_WEB",
      "DEFAULT_WEB_STATUS",
      "TELEGRAM_BOT_TOKEN",
      "TELEGRAM_CHAT_ID",
      "TELEGRAM_REMOTE_CONTROL",
      "TELEGRAM_NOTIFY_COMPLETION",
      "GOOGLE_API_KEY",
      "GROQ_API_KEY",
      "OPENAI_API_KEY",
      "ANTHROPIC_API_KEY"
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

      App.showToast('All settings saved and activated!', 'success');
      const msg = document.getElementById('save-status-msg');
      if (msg) {
        msg.textContent = "Saved & Activated!";
        setTimeout(() => msg.textContent = "", 4000);
      }
      
      await this.refreshWebStatus();
      await this.refreshTelegramStatus();
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
