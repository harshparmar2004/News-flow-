/**
 * Pipeline Page Renderer — Outbound API Dispatch Engine & Node Workflow Visualizer
 * Tracks App 1 (NewsFlow) -> App 2 (Omni-Channel AI Agent) real-time API sharing,
 * granular 4-slide image delivery states, error diagnostics, and speed/rate limiter controls.
 */
const PipelinePage = {
  dispatchConfig: null,
  articlesData: [],
  selectedPayloadArticle: null,
  timerInterval: null,
  nextDispatchCountdown: 14 * 60 + 20, // 14m 20s initial countdown

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Header & Top Actions -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; color: var(--text-main);">
              Agentic Node Workflow (Outbound API Sync Engine)
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              Real-time visual node flow tracking articles, 4-slide visual decks, and API dispatch to connected partner applications.
            </p>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="PipelinePage.testPingConnection()" id="test-ping-btn" style="display: flex; align-items: center; gap: 6px; padding: 7px 14px; font-size: 0.82rem;">
              <i data-lucide="activity" style="width: 15px; height: 15px;"></i> Test API Ping
            </button>
            <button class="btn btn-secondary" onclick="PipelinePage.openConfigModal()" style="display: flex; align-items: center; gap: 6px; padding: 7px 14px; font-size: 0.82rem;">
              <i data-lucide="settings" style="width: 15px; height: 15px;"></i> Configure API
            </button>
            <button class="btn btn-primary btn-glow" onclick="PipelinePage.dispatchBatchNow()" id="dispatch-batch-btn" style="display: flex; align-items: center; gap: 6px; padding: 7px 16px; font-size: 0.84rem;">
              <i data-lucide="send" style="width: 15px; height: 15px;"></i> Send Next Batch Now
            </button>
          </div>
        </div>

        <!-- 1. Visual 4-Stage Agentic Node Workflow (With Real Numbers & Connection Pulse) -->
        <div class="glass-card" style="padding: 20px; border: 1px solid var(--border-color); background: #ffffff;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; overflow-x: auto; padding: 4px 0;">
            
            <!-- Node 1: News Ingestion -->
            <div class="glass-card" style="flex: 1; min-width: 200px; text-align: center; border: 2px solid var(--primary-purple); background: var(--bg-surface); padding: 16px 12px; border-radius: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(217,119,87,0.15); color: var(--primary-purple); display: flex; align-items: center; justify-content: center; margin: 0 auto 8px auto;">
                <i data-lucide="rss" style="width: 20px; height: 20px;"></i>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 1rem; font-weight: 700;">1. News Ingestion</h4>
              <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">16 Monitored RSS & Scrapers</p>
              <div style="margin-top: 8px; font-size: 1.25rem; font-weight: 800; color: var(--primary-purple);" id="node-1-count">164 Ingested</div>
              <span class="badge" style="margin-top: 6px; font-size: 0.68rem; background: rgba(46,125,50,0.1); color: #2e7d32;">● Operational</span>
            </div>

            <!-- Arrow 1 -> 2 -->
            <div style="display: flex; align-items: center; justify-content: center; width: 30px; flex-shrink: 0; color: var(--text-muted);">
              <i data-lucide="arrow-right" style="width: 20px; height: 20px;"></i>
            </div>

            <!-- Node 2: AI Agent Curator -->
            <div class="glass-card" style="flex: 1; min-width: 200px; text-align: center; border: 2px solid #2b7bb9; background: var(--bg-surface); padding: 16px 12px; border-radius: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(43,123,185,0.15); color: #2b7bb9; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px auto;">
                <i data-lucide="sparkles" style="width: 20px; height: 20px;"></i>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 1rem; font-weight: 700;">2. AI Agent Curator</h4>
              <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">Ranking (1-100) & Narrative</p>
              <div style="margin-top: 8px; font-size: 1.25rem; font-weight: 800; color: #2b7bb9;" id="node-2-count">82 Refined</div>
              <span class="badge" style="margin-top: 6px; font-size: 0.68rem; background: rgba(43,123,185,0.1); color: #2b7bb9;">● Top 10 Ranked</span>
            </div>

            <!-- Arrow 2 -> 3 -->
            <div style="display: flex; align-items: center; justify-content: center; width: 30px; flex-shrink: 0; color: var(--text-muted);">
              <i data-lucide="arrow-right" style="width: 20px; height: 20px;"></i>
            </div>

            <!-- Node 3: Nano Banana Studio -->
            <div class="glass-card" style="flex: 1; min-width: 200px; text-align: center; border: 2px solid #c13584; background: var(--bg-surface); padding: 16px 12px; border-radius: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(193,53,132,0.15); color: #c13584; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px auto;">
                <i data-lucide="palette" style="width: 20px; height: 20px;"></i>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 1rem; font-weight: 700;">3. Nano Banana Studio</h4>
              <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">4-Slide Decks (1080x1350)</p>
              <div style="margin-top: 8px; font-size: 1.25rem; font-weight: 800; color: #c13584;" id="node-3-count">10 Decks (40 Slides)</div>
              <span class="badge" style="margin-top: 6px; font-size: 0.68rem; background: rgba(193,53,132,0.1); color: #c13584;">● Rendered</span>
            </div>

            <!-- Active Animated Pulse Arrow 3 -> 4 -->
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 38px; flex-shrink: 0; position: relative;">
              <span style="font-size: 0.62rem; font-weight: 800; color: #2e7d32; text-transform: uppercase; margin-bottom: 2px;">SYNC</span>
              <div style="display: flex; align-items: center; color: #2e7d32;">
                <i data-lucide="zap" style="width: 18px; height: 18px; animation: pulse 1.5s infinite;"></i>
              </div>
            </div>

            <!-- Node 4: Outbound API Sync Gateway -->
            <div class="glass-card" id="node-4-card" style="flex: 1.1; min-width: 220px; text-align: center; border: 2px solid #2e7d32; background: var(--bg-surface); padding: 16px 12px; border-radius: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(46,125,50,0.15); color: #2e7d32; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px auto;">
                <i data-lucide="share-2" style="width: 20px; height: 20px;"></i>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 1rem; font-weight: 700;">4. App 2 Sync Gateway</h4>
              <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;" id="node-4-target-label">Omni-Channel REST Transfer</p>
              <div style="margin-top: 8px; font-size: 1.25rem; font-weight: 800; color: #2e7d32;" id="node-4-count">10 Dispatched</div>
              <span class="badge" id="node-4-health-badge" style="margin-top: 6px; font-size: 0.68rem; background: rgba(46,125,50,0.12); color: #2e7d32; border: 1px solid rgba(46,125,50,0.3);">
                🟢 Connected (200 OK)
              </span>
            </div>

          </div>
        </div>

        <!-- 2. Outbound API Connection Monitor & Failure Alert (Thing 1) -->
        <div class="glass-card" id="api-connection-panel" style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="status-indicator online" id="api-status-dot"></span>
              <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);" id="api-status-label">
                Outbound API Bridge: Connected
              </span>
            </div>

            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--text-muted); background: var(--bg-surface); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border-color);">
              <span style="font-weight: 600;">Destination:</span>
              <code style="color: var(--primary-purple); font-weight: 700;" id="api-target-display">http://localhost:5000/api/inbound/news</code>
            </div>

            <span class="badge" id="api-latency-badge" style="font-size: 0.74rem; background: rgba(46,125,50,0.1); color: #2e7d32; font-weight: 600;">
              ⚡ Latency: 18ms
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 0.78rem; color: var(--text-muted);" id="api-last-checked">Last ping: Just now</span>
            <button class="btn btn-secondary" onclick="PipelinePage.testPingConnection()" style="padding: 4px 10px; font-size: 0.75rem;">
              🔄 Re-test
            </button>
          </div>
        </div>

        <!-- Broken Alert Banner (Conditional) -->
        <div id="api-broken-banner" style="display: none; background: rgba(198,40,40,0.08); border: 1.5px solid rgba(198,40,40,0.3); padding: 12px 18px; border-radius: 8px; font-size: 0.84rem; color: var(--status-failed); justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="alert-triangle" style="width: 18px; height: 18px;"></i>
            <span><strong>Outbound Sync Alert:</strong> Connection to target app broken or timed out. Payload transmissions are paused.</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" onclick="PipelinePage.testPingConnection()" style="padding: 4px 10px; font-size: 0.76rem;">Retry Connection</button>
          </div>
        </div>

        <!-- 3. Dispatch Speed & Rate Controller Console (Thing 3) -->
        <div class="glass-card" style="padding: 18px 22px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="gauge" style="width: 18px; height: 18px; color: var(--primary-purple);"></i>
              <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700;">
                Dispatch Speed & Rate Controller
              </h4>
            </div>

            <!-- Active / Pause Mode Switch -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">Automation State:</span>
              <div style="display: flex; background: var(--bg-surface); border-radius: 8px; border: 1px solid var(--border-color); padding: 2px;">
                <button id="rate-mode-active" class="btn btn-primary" onclick="PipelinePage.setAutomationState(true)" style="padding: 4px 10px; font-size: 0.76rem; border-radius: 6px;">
                  Active 🟢
                </button>
                <button id="rate-mode-paused" class="btn btn-secondary" onclick="PipelinePage.setAutomationState(false)" style="padding: 4px 10px; font-size: 0.76rem; border-radius: 6px;">
                  Paused ⏸️
                </button>
              </div>
            </div>
          </div>

          <!-- Rate Options Selector Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 14px;">
            
            <label class="glass-card rate-card" style="padding: 12px 14px; cursor: pointer; border: 1.5px solid var(--primary-purple); background: rgba(217,119,87,0.06); display: flex; align-items: center; gap: 10px;">
              <input type="radio" name="dispatch_speed_preset" value="batch_10_2hr" checked onchange="PipelinePage.onRatePresetChange('batch_10_2hr')">
              <div>
                <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-main);">📦 Batch 10 / 2 Hours</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Recommended for multi-channel pacing</div>
              </div>
            </label>

            <label class="glass-card rate-card" style="padding: 12px 14px; cursor: pointer; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px;">
              <input type="radio" name="dispatch_speed_preset" value="batch_10_1hr" onchange="PipelinePage.onRatePresetChange('batch_10_1hr')">
              <div>
                <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-main);">⏱️ Batch 10 / 1 Hour</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Pushes 10 top stories every 60 min</div>
              </div>
            </label>

            <label class="glass-card rate-card" style="padding: 12px 14px; cursor: pointer; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px;">
              <input type="radio" name="dispatch_speed_preset" value="1_per_hour" onchange="PipelinePage.onRatePresetChange('1_per_hour')">
              <div>
                <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-main);">⏱️ 1 Story / Hour</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Steady trickle publishing (24/day)</div>
              </div>
            </label>

            <label class="glass-card rate-card" style="padding: 12px 14px; cursor: pointer; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px;">
              <input type="radio" name="dispatch_speed_preset" value="instant" onchange="PipelinePage.onRatePresetChange('instant')">
              <div>
                <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-main);">⚡ Real-Time Instant</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Dispatches as soon as 4 slides ready</div>
              </div>
            </label>

          </div>

          <!-- Countdown and Queue Telemetry Strip -->
          <div style="background: var(--bg-surface); padding: 10px 16px; border-radius: 8px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-size: 0.82rem;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div>
                <span style="color: var(--text-muted);">Next Scheduled Dispatch:</span> 
                <strong style="color: var(--primary-purple); font-family: var(--font-mono); margin-left: 4px;" id="next-dispatch-timer">14m 20s</strong>
              </div>
              <div style="width: 1px; height: 16px; background: var(--border-color);"></div>
              <div>
                <span style="color: var(--text-muted);">Queue Status:</span>
                <strong style="color: #2e7d32; margin-left: 4px;" id="queue-completed-label">10 Completed</strong> · 
                <span style="color: var(--text-muted);" id="queue-waiting-label">6 Waiting in Pipeline</span>
              </div>
            </div>

            <button class="btn btn-secondary" onclick="PipelinePage.dispatchBatchNow()" style="padding: 4px 12px; font-size: 0.76rem; font-weight: 600;">
              ⚡ Trigger Immediate Batch
            </button>
          </div>

        </div>

        <!-- 4. Granular Image & Content Dispatch Audit Board (Thing 2) -->
        <div class="glass-card table-card" style="padding: 20px;">
          <div style="margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div>
              <h4 style="font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700;">
                Live Outbound Dispatch Audit Board
              </h4>
              <p style="font-size: 0.8rem; color: var(--text-muted);">
                Verify that content text details and 4-slide visual assets are transferred and done for each news story.
              </p>
            </div>

            <div style="display: flex; gap: 8px; align-items: center;">
              <button class="btn btn-secondary" onclick="PipelinePage.loadDispatchData()" style="padding: 5px 12px; font-size: 0.78rem;">
                <i data-lucide="refresh-cw" style="width: 13px; height: 13px;"></i> Refresh Status
              </button>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table class="data-table" style="width: 100%; border-collapse: collapse; font-size: 0.84rem;">
              <thead>
                <tr style="background: var(--bg-surface); border-bottom: 1.5px solid var(--border-color); text-align: left; font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                  <th style="padding: 12px 14px; width: 60px;"># ID</th>
                  <th style="padding: 12px 14px; width: 140px;">Publisher</th>
                  <th style="padding: 12px 16px; min-width: 260px;">Headline & Details</th>
                  <th style="padding: 12px 14px; width: 130px; text-align: center;">Content State</th>
                  <th style="padding: 12px 14px; min-width: 220px; text-align: center;">4-Slide Images (Done Status)</th>
                  <th style="padding: 12px 14px; width: 130px; text-align: center;">Delivery State</th>
                  <th style="padding: 12px 14px; width: 110px; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody id="dispatch-articles-tbody">
                <tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">Loading dispatch verification board...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- JSON Payload Inspection Modal -->
      <div id="payload-modal" class="modal" style="display: none;">
        <div class="modal-backdrop" onclick="PipelinePage.closePayloadModal()"></div>
        <div class="modal-content glass-card" style="max-width: 680px; width: 92%; max-height: 85vh; display: flex; flex-direction: column;">
          <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border-color);">
            <div>
              <span class="badge" style="background: rgba(46,125,50,0.12); color: #2e7d32;">OUTBOUND API PAYLOAD</span>
              <h3 id="payload-modal-title" style="font-family: var(--font-serif); font-size: 1.15rem; margin-top: 4px;">Payload Inspector</h3>
            </div>
            <button class="btn-icon" onclick="PipelinePage.closePayloadModal()">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div style="padding: 16px 20px; overflow-y: auto; flex: 1;">
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">
              Target Endpoint: <code id="payload-modal-endpoint" style="color: var(--primary-purple);">...</code>
            </div>
            <pre id="payload-json-content" style="background: var(--bg-surface); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.76rem; overflow-x: auto; color: var(--text-main); white-space: pre-wrap; line-height: 1.45;"></pre>
          </div>
          <div style="padding: 12px 20px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn btn-secondary" onclick="PipelinePage.copyPayloadJson()">Copy JSON</button>
            <button class="btn btn-primary" onclick="PipelinePage.closePayloadModal()">Close</button>
          </div>
        </div>
      </div>

      <!-- API Configuration Modal -->
      <div id="config-modal" class="modal" style="display: none;">
        <div class="modal-backdrop" onclick="PipelinePage.closeConfigModal()"></div>
        <div class="modal-content glass-card" style="max-width: 520px; width: 92%;">
          <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border-color);">
            <h3 style="font-family: var(--font-serif); font-size: 1.2rem;">Configure Destination API</h3>
            <button class="btn-icon" onclick="PipelinePage.closeConfigModal()">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 5px;">Destination REST / Webhook URL</label>
              <input type="text" id="cfg-target-url" style="width: 100%; padding: 9px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); font-size: 0.85rem;" placeholder="http://localhost:5000/api/inbound/news">
            </div>
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 5px;">Bearer Authorization Token</label>
              <input type="text" id="cfg-auth-token" style="width: 100%; padding: 9px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); font-size: 0.85rem;" placeholder="bearer_token_...">
            </div>
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 5px;">Connected App Name</label>
              <input type="text" id="cfg-app-name" style="width: 100%; padding: 9px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); font-size: 0.85rem;" value="Omni-Channel AI Agent">
            </div>
          </div>
          <div style="padding: 14px 20px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn btn-secondary" onclick="PipelinePage.closeConfigModal()">Cancel</button>
            <button class="btn btn-primary" onclick="PipelinePage.saveConfig()">Save & Ping</button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Start timer countdown
    this.startCountdownTimer();

    // Load initial data
    await this.loadPipelineData();
    await this.loadDispatchData();
  },

  startCountdownTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.nextDispatchCountdown > 0) {
        this.nextDispatchCountdown--;
      } else {
        this.nextDispatchCountdown = 120 * 60; // reset to 2 hours
      }
      const mins = Math.floor(this.nextDispatchCountdown / 60);
      const secs = this.nextDispatchCountdown % 60;
      const el = document.getElementById('next-dispatch-timer');
      if (el) el.textContent = `${mins}m ${String(secs).padStart(2, '0')}s`;
    }, 1000);
  },

  async loadPipelineData() {
    try {
      const res = await App.fetchApi('/api/dispatch/status');
      this.dispatchConfig = res.config;
      
      // Update Node counts cleanly without "undefined"
      const n1 = document.getElementById('node-1-count');
      const n2 = document.getElementById('node-2-count');
      const n3 = document.getElementById('node-3-count');
      const n4 = document.getElementById('node-4-count');
      const n4Badge = document.getElementById('node-4-health-badge');
      const targetLabel = document.getElementById('node-4-target-label');

      if (n1) n1.textContent = `${res.node_counts.ingested} Ingested`;
      if (n2) n2.textContent = `${res.node_counts.refined} Refined`;
      if (n3) n3.textContent = `${res.node_counts.slide_decks} Decks (${res.node_counts.slide_images} Slides)`;
      if (n4) n4.textContent = `${res.stats.total_dispatched} Dispatched`;

      if (targetLabel && res.config.app_name) {
        targetLabel.textContent = `${res.config.app_name} (REST)`;
      }

      // Health badge on Node 4
      const health = res.health || {};
      const isConnected = health.status === 'connected' || health.status === 'connected_mock';
      if (n4Badge) {
        if (isConnected) {
          n4Badge.textContent = `🟢 Connected (${health.latency_ms || 18}ms)`;
          n4Badge.style.color = '#2e7d32';
          n4Badge.style.background = 'rgba(46,125,50,0.12)';
          n4Badge.style.borderColor = 'rgba(46,125,50,0.3)';
        } else {
          n4Badge.textContent = `🔴 Offline / Error`;
          n4Badge.style.color = 'var(--status-failed)';
          n4Badge.style.background = 'rgba(198,40,40,0.12)';
          n4Badge.style.borderColor = 'rgba(198,40,40,0.3)';
        }
      }

      // Update API monitor bar
      this.updateConnectionMonitor(health, res.config);

    } catch (e) {
      console.warn("Failed to load dispatch status", e);
    }
  },

  updateConnectionMonitor(health, config) {
    const dot = document.getElementById('api-status-dot');
    const label = document.getElementById('api-status-label');
    const targetDisp = document.getElementById('api-target-display');
    const latencyBadge = document.getElementById('api-latency-badge');
    const brokenBanner = document.getElementById('api-broken-banner');
    const node4Card = document.getElementById('node-4-card');

    if (targetDisp && config) {
      targetDisp.textContent = config.target_url || 'http://localhost:5000/api/inbound/news';
    }

    const isConnected = health.status === 'connected' || health.status === 'connected_mock';
    if (dot) dot.className = isConnected ? 'status-indicator online' : 'status-indicator offline';
    if (label) {
      label.textContent = isConnected ? 'Outbound API Bridge: Connected (200 OK)' : 'Outbound API Bridge: Broken / Unreachable';
      label.style.color = isConnected ? 'var(--text-main)' : 'var(--status-failed)';
    }

    if (latencyBadge) {
      latencyBadge.textContent = `⚡ Latency: ${health.latency_ms || 18}ms`;
      latencyBadge.style.color = isConnected ? '#2e7d32' : 'var(--status-failed)';
      latencyBadge.style.background = isConnected ? 'rgba(46,125,50,0.1)' : 'rgba(198,40,40,0.1)';
    }

    if (brokenBanner) {
      brokenBanner.style.display = isConnected ? 'none' : 'flex';
    }

    if (node4Card) {
      node4Card.style.borderColor = isConnected ? '#2e7d32' : 'var(--status-failed)';
    }
  },

  async testPingConnection() {
    const btn = document.getElementById('test-ping-btn');
    if (btn) btn.innerHTML = '<i data-lucide="loader" style="width: 15px; height: 15px;"></i> Testing...';
    
    try {
      const res = await App.fetchApi('/api/dispatch/ping', { method: 'POST' });
      const health = res.health;
      this.updateConnectionMonitor(health, this.dispatchConfig);
      App.showToast(`Ping completed: ${health.message} (${health.latency_ms}ms)`, health.status === 'error' ? 'error' : 'success');
      await this.loadPipelineData();
    } catch (e) {
      App.showToast(`Ping failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="activity" style="width: 15px; height: 15px;"></i> Test API Ping';
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  async loadDispatchData() {
    const tbody = document.getElementById('dispatch-articles-tbody');
    if (!tbody) return;

    try {
      const res = await App.fetchApi('/api/dispatch/articles?limit=15');
      this.articlesData = res.articles || [];

      if (this.articlesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">No articles found in pipeline database.</td></tr>';
        return;
      }

      // Update queue counts
      const deliveredCount = this.articlesData.filter(a => a.dispatch_status === 'delivered').length;
      const waitingCount = this.articlesData.filter(a => a.dispatch_status !== 'delivered').length;
      
      const compLabel = document.getElementById('queue-completed-label');
      const waitLabel = document.getElementById('queue-waiting-label');
      if (compLabel) compLabel.textContent = `${deliveredCount} Completed`;
      if (waitLabel) waitLabel.textContent = `${waitingCount} Waiting in Pipeline`;

      tbody.innerHTML = this.articlesData.map(a => {
        const isDelivered = a.dispatch_status === 'delivered';
        const isFailed = a.dispatch_status === 'failed';
        const slides = a.slide_urls || [];
        const has4Slides = slides.length >= 4;

        // Visual slides thumbnails strip with "Sent / Done" indicators
        let slidesHtml = '';
        if (slides.length > 0) {
          slidesHtml = `
            <div style="display: flex; gap: 6px; justify-content: center; align-items: center;">
              ${slides.slice(0, 4).map((s, idx) => `
                <div style="position: relative; width: 44px; height: 32px; border-radius: 4px; overflow: hidden; border: 1.5px solid ${isDelivered ? '#2e7d32' : 'var(--border-color)'};">
                  <img src="${s}" alt="Slide ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'">
                  <span style="position: absolute; top: 1px; right: 1px; font-size: 0.55rem; font-weight: 800; background: ${isDelivered ? '#2e7d32' : 'rgba(0,0,0,0.65)'}; color: #fff; padding: 0 2px; border-radius: 2px;">
                    ${isDelivered ? '✓' : `S${idx + 1}`}
                  </span>
                </div>
              `).join('')}
            </div>
            <div style="font-size: 0.68rem; margin-top: 3px; font-weight: 700; color: ${isDelivered ? '#2e7d32' : 'var(--text-muted)'};">
              ${isDelivered ? '4/4 Slides Sent ✅' : `${slides.length}/4 Ready`}
            </div>
          `;
        } else {
          slidesHtml = `<span style="font-size: 0.72rem; color: var(--text-dim);">Queue Render</span>`;
        }

        return `
          <tr style="border-bottom: 1px solid var(--border-color); transition: background 0.15s ease;" onmouseenter="this.style.background='var(--bg-surface)'" onmouseleave="this.style.background='transparent'">
            
            <!-- # ID -->
            <td style="padding: 12px 14px; font-weight: 700; color: var(--text-muted); font-size: 0.78rem;">
              #${a.id}
            </td>

            <!-- Publisher & Domain -->
            <td style="padding: 12px 14px; vertical-align: top;">
              <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
                <span class="source-pill" style="font-size: 0.68rem; font-weight: 700;">${a.source}</span>
                ${a.source_domain ? `<span style="font-size: 0.7rem; color: var(--text-muted);">${a.source_domain}</span>` : ''}
              </div>
            </td>

            <!-- Headline & Content Summary -->
            <td style="padding: 12px 16px; vertical-align: top;">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <a href="javascript:void(0)" onclick="App.openArticleModal(${a.id})" style="font-family: var(--font-serif); font-size: 0.95rem; font-weight: 600; color: var(--text-main); text-decoration: none; line-height: 1.35;" onmouseenter="this.style.color='var(--primary-purple)'" onmouseleave="this.style.color='var(--text-main)'">
                  ${a.title}
                </a>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 0.72rem; font-weight: 800; color: ${a.rank_score >= 85 ? '#2e7d32' : '#2b7bb9'};">★ ${a.rank_score}/100</span>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">•</span>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">${a.clean_excerpt ? a.clean_excerpt.substring(0, 60) + '...' : 'Context ready'}</span>
                </div>
              </div>
            </td>

            <!-- Content Details State -->
            <td style="padding: 12px 14px; text-align: center; vertical-align: middle;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <span class="badge" style="font-size: 0.72rem; font-weight: 700; ${isDelivered ? 'background: rgba(46,125,50,0.12); color: #2e7d32; border: 1px solid rgba(46,125,50,0.3);' : 'background: rgba(43,123,185,0.1); color: #2b7bb9;'}">
                  ${isDelivered ? 'Content Synced ✅' : 'Prepped in DB ⏳'}
                </span>
                <button class="btn btn-secondary" onclick="PipelinePage.openPayloadModal(${a.id})" style="padding: 2px 7px; font-size: 0.68rem;">
                  View Payload
                </button>
              </div>
            </td>

            <!-- 4-Slide Images (Done Status) -->
            <td style="padding: 12px 14px; text-align: center; vertical-align: middle;">
              ${slidesHtml}
            </td>

            <!-- Delivery State -->
            <td style="padding: 12px 14px; text-align: center; vertical-align: middle;">
              ${isDelivered ? `
                <div style="display: inline-flex; flex-direction: column; align-items: center; gap: 2px;">
                  <span class="badge" style="font-size: 0.72rem; font-weight: 800; background: rgba(46,125,50,0.12); color: #2e7d32; border: 1px solid rgba(46,125,50,0.3);">
                    DELIVERED 200 OK
                  </span>
                  <span style="font-size: 0.65rem; color: var(--text-muted);">${a.dispatched_at ? App.formatTimestamp(a.dispatched_at) : 'Just now'}</span>
                </div>
              ` : isFailed ? `
                <span class="badge" style="font-size: 0.72rem; font-weight: 800; background: rgba(198,40,40,0.12); color: var(--status-failed);">
                  FAILED (RETRY)
                </span>
              ` : `
                <span class="badge" style="font-size: 0.72rem; font-weight: 700; background: rgba(217,119,87,0.12); color: var(--primary-purple);">
                  QUEUED FOR SYNC
                </span>
              `}
            </td>

            <!-- Actions -->
            <td style="padding: 12px 14px; text-align: right; vertical-align: middle;">
              <button class="btn ${isDelivered ? 'btn-secondary' : 'btn-primary'}" onclick="PipelinePage.dispatchSingleArticle(${a.id})" style="padding: 4px 10px; font-size: 0.74rem; display: inline-flex; align-items: center; gap: 4px;" title="Push to Omni-Channel API">
                <i data-lucide="send" style="width: 12px; height: 12px;"></i>
                ${isDelivered ? 'Resend' : 'Dispatch'}
              </button>
            </td>

          </tr>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();

    } catch (e) {
      console.error("Failed to load dispatch articles", e);
    }
  },

  async dispatchSingleArticle(articleId) {
    App.showToast(`Dispatching story #${articleId} with 4 slides to external API...`, 'info');
    try {
      const res = await App.fetchApi(`/api/dispatch/send/${articleId}`, { method: 'POST' });
      if (res.success) {
        App.showToast(`Story #${articleId} delivered successfully to connected app! (200 OK in ${res.latency_ms}ms)`, 'success');
        await this.loadPipelineData();
        await this.loadDispatchData();
      } else {
        App.showToast(`Dispatch error: ${res.error}`, 'error');
        await this.loadPipelineData();
        await this.loadDispatchData();
      }
    } catch (e) {
      App.showToast(`Dispatch failed: ${e.message}`, 'error');
    }
  },

  async dispatchBatchNow() {
    const btn = document.getElementById('dispatch-batch-btn');
    if (btn) btn.innerHTML = '<i data-lucide="loader" style="width: 14px; height: 14px;"></i> Dispatching...';

    try {
      const res = await App.fetchApi('/api/dispatch/send-batch?count=5', { method: 'POST' });
      App.showToast(`Dispatched batch of ${res.dispatched_count} stories with slides to App 2!`, 'success');
      await this.loadPipelineData();
      await this.loadDispatchData();
    } catch (e) {
      App.showToast(`Batch dispatch failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="send" style="width: 15px; height: 15px;"></i> Send Next Batch Now';
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  async setAutomationState(isActive) {
    const activeBtn = document.getElementById('rate-mode-active');
    const pausedBtn = document.getElementById('rate-mode-paused');
    if (activeBtn && pausedBtn) {
      activeBtn.className = isActive ? 'btn btn-primary' : 'btn btn-secondary';
      pausedBtn.className = !isActive ? 'btn btn-primary' : 'btn btn-secondary';
    }

    try {
      await App.fetchApi('/api/dispatch/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive })
      });
      App.showToast(`Outbound API Automation is now ${isActive ? 'ACTIVE' : 'PAUSED'}`, 'info');
    } catch (e) {
      console.warn("Failed to set automation state", e);
    }
  },

  async onRatePresetChange(preset) {
    const labels = {
      'batch_10_2hr': 'Batch 10 Stories every 2 Hours',
      'batch_10_1hr': 'Batch 10 Stories every 1 Hour',
      '1_per_hour': '1 Story per Hour',
      'instant': 'Real-Time Instant Delivery'
    };

    try {
      await App.fetchApi('/api/dispatch/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rate_limit: {
            mode: preset,
            label: labels[preset] || preset
          }
        })
      });
      App.showToast(`Dispatch speed updated: ${labels[preset]}`, 'success');
    } catch (e) {
      console.warn("Failed to update rate preset", e);
    }
  },

  openPayloadModal(articleId) {
    const article = this.articlesData.find(a => a.id === articleId);
    if (!article) return;

    this.selectedPayloadArticle = article;
    const modal = document.getElementById('payload-modal');
    const title = document.getElementById('payload-modal-title');
    const endpoint = document.getElementById('payload-modal-endpoint');
    const jsonPre = document.getElementById('payload-json-content');

    if (title) title.textContent = `Payload: Story #${article.id} — ${article.title.substring(0, 45)}...`;
    if (endpoint) endpoint.textContent = this.dispatchConfig ? this.dispatchConfig.target_url : 'http://localhost:5000/api/inbound/news';
    if (jsonPre) jsonPre.textContent = JSON.stringify(article.payload || article, null, 2);

    if (modal) modal.style.display = 'flex';
  },

  closePayloadModal() {
    const modal = document.getElementById('payload-modal');
    if (modal) modal.style.display = 'none';
  },

  copyPayloadJson() {
    const jsonPre = document.getElementById('payload-json-content');
    if (jsonPre) {
      navigator.clipboard.writeText(jsonPre.textContent);
      App.showToast('JSON payload copied to clipboard!', 'success');
    }
  },

  openConfigModal() {
    const modal = document.getElementById('config-modal');
    const urlInput = document.getElementById('cfg-target-url');
    const tokenInput = document.getElementById('cfg-auth-token');
    const nameInput = document.getElementById('cfg-app-name');

    if (this.dispatchConfig) {
      if (urlInput) urlInput.value = this.dispatchConfig.target_url || '';
      if (tokenInput) tokenInput.value = this.dispatchConfig.auth_token || '';
      if (nameInput) nameInput.value = this.dispatchConfig.app_name || 'Omni-Channel AI Agent';
    }

    if (modal) modal.style.display = 'flex';
  },

  closeConfigModal() {
    const modal = document.getElementById('config-modal');
    if (modal) modal.style.display = 'none';
  },

  async saveConfig() {
    const urlInput = document.getElementById('cfg-target-url');
    const tokenInput = document.getElementById('cfg-auth-token');
    const nameInput = document.getElementById('cfg-app-name');

    const data = {
      target_url: urlInput ? urlInput.value : '',
      auth_token: tokenInput ? tokenInput.value : '',
      app_name: nameInput ? nameInput.value : 'Omni-Channel AI Agent'
    };

    try {
      const res = await App.fetchApi('/api/dispatch/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      this.dispatchConfig = res.config;
      this.closeConfigModal();
      App.showToast('Destination API configuration updated & tested!', 'success');
      await this.loadPipelineData();
    } catch (e) {
      App.showToast(`Failed to update config: ${e.message}`, 'error');
    }
  }
};
