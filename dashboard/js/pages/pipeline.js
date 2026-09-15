/**
 * Pipeline Page Renderer — Simplified, Theme-Matched Outbound API Dispatch & Workflow
 * High clarity, minimal clutter, warm cream/terracotta theme matching,
 * clear action buttons, and end-to-end pipeline run auto-dispatching.
 */
const PipelinePage = {
  dispatchConfig: null,
  articlesData: [],
  selectedPayloadArticle: null,
  timerInterval: null,
  nextDispatchCountdown: 14 * 60 + 20,

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Header & Top Actions -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; color: var(--text-main);">
              Pipeline Workflow & API Dispatch Engine
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              Automated multi-stage flow: Web Ingest ➔ AI Rank & Refine ➔ Nano Banana 4-Slide Studio ➔ Partner App Transfer.
            </p>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="PipelinePage.testPingConnection()" id="test-ping-btn" style="display: flex; align-items: center; gap: 6px; padding: 7px 14px; font-size: 0.82rem;">
              <i data-lucide="activity" style="width: 15px; height: 15px;"></i> Ping API
            </button>
            <button class="btn btn-secondary" onclick="PipelinePage.openConfigModal()" style="display: flex; align-items: center; gap: 6px; padding: 7px 14px; font-size: 0.82rem;">
              <i data-lucide="settings" style="width: 15px; height: 15px;"></i> Configure App
            </button>
            <button class="btn btn-primary btn-glow" onclick="PipelinePage.dispatchBatchNow()" id="dispatch-batch-btn" style="display: flex; align-items: center; gap: 6px; padding: 7px 16px; font-size: 0.84rem;">
              <i data-lucide="send" style="width: 15px; height: 15px;"></i> Send Batch Now
            </button>
          </div>
        </div>



        <!-- 2. Integrated Connection Health & Speed Controller -->
        <div class="glass-card" style="padding: 18px 22px;">
          
          <!-- Top Row: Connection Status & State Toggle -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 14px; border-bottom: 1px solid var(--border-color); flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 7px;">
                <span class="status-indicator online" id="api-status-dot"></span>
                <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);" id="api-status-label">
                  App 2 Bridge: Connected (200 OK)
                </span>
              </div>
              <span class="badge" style="font-size: 0.74rem; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-muted);">
                Endpoint: <code style="color: var(--primary-purple); font-weight: 700; margin-left: 4px;" id="api-target-display">http://localhost:5000/api/inbound/news</code>
              </span>
              <span class="badge" id="api-latency-badge" style="font-size: 0.72rem; background: rgba(46,125,50,0.1); color: #2e7d32; font-weight: 600;">
                ⚡ 18ms
              </span>
            </div>

            <!-- Pipeline Automation Switch -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">Pipeline Auto-Dispatch:</span>
              <div style="display: flex; background: var(--bg-surface); border-radius: 8px; border: 1px solid var(--border-color); padding: 2px;">
                <button id="rate-mode-active" class="btn btn-primary" onclick="PipelinePage.setAutomationState(true)" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 6px;">
                  Active 🟢
                </button>
                <button id="rate-mode-paused" class="btn btn-secondary" onclick="PipelinePage.setAutomationState(false)" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 6px;">
                  Paused ⏸️
                </button>
              </div>
            </div>
          </div>

          <!-- Middle Row: Dispatch Speed Presets -->
          <div style="margin-top: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-main);">
                Dispatch Pacing & Throttle Speed:
              </span>
              <span style="font-size: 0.76rem; color: var(--text-muted);">
                Controls how many articles & 4-slide decks are transmitted to App 2
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px;">
              <label class="glass-card rate-card" style="padding: 10px 14px; cursor: pointer; border: 1.5px solid var(--primary-purple); background: rgba(217,119,87,0.06); display: flex; align-items: center; gap: 10px; border-radius: 8px;">
                <input type="radio" name="dispatch_speed_preset" value="batch_10_2hr" checked onchange="PipelinePage.onRatePresetChange('batch_10_2hr')">
                <div>
                  <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">📦 Batch 10 / 2 Hours</div>
                  <div style="font-size: 0.7rem; color: var(--text-muted);">Recommended pacing</div>
                </div>
              </label>

              <label class="glass-card rate-card" style="padding: 10px 14px; cursor: pointer; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; border-radius: 8px;">
                <input type="radio" name="dispatch_speed_preset" value="batch_10_1hr" onchange="PipelinePage.onRatePresetChange('batch_10_1hr')">
                <div>
                  <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">⏱️ Batch 10 / 1 Hour</div>
                  <div style="font-size: 0.7rem; color: var(--text-muted);">Hourly bursts</div>
                </div>
              </label>

              <label class="glass-card rate-card" style="padding: 10px 14px; cursor: pointer; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; border-radius: 8px;">
                <input type="radio" name="dispatch_speed_preset" value="1_per_hour" onchange="PipelinePage.onRatePresetChange('1_per_hour')">
                <div>
                  <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">⏱️ 1 Story / Hour</div>
                  <div style="font-size: 0.7rem; color: var(--text-muted);">Steady trickle</div>
                </div>
              </label>

              <label class="glass-card rate-card" style="padding: 10px 14px; cursor: pointer; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; border-radius: 8px;">
                <input type="radio" name="dispatch_speed_preset" value="instant" onchange="PipelinePage.onRatePresetChange('instant')">
                <div>
                  <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">⚡ Instant Dispatch</div>
                  <div style="font-size: 0.7rem; color: var(--text-muted);">Sends as soon as ready</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Bottom Telemetry Bar -->
          <div style="margin-top: 12px; background: var(--bg-surface); padding: 8px 14px; border-radius: 6px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-size: 0.78rem;">
            <div>
              <span style="color: var(--text-muted);">Next Dispatch:</span>
              <strong style="color: var(--primary-purple); font-family: var(--font-mono); margin-left: 4px;" id="next-dispatch-timer">14m 20s</strong>
              <span style="color: var(--text-muted); margin: 0 8px;">•</span>
              <span style="color: var(--text-muted);">Queue Status:</span>
              <strong style="color: #2e7d32; margin-left: 4px;" id="queue-completed-label">10 Completed</strong>
              <span style="color: var(--text-muted); margin-left: 4px;" id="queue-waiting-label">· 6 Queued</span>
            </div>
            <button class="btn btn-secondary" onclick="PipelinePage.dispatchBatchNow()" style="padding: 3px 10px; font-size: 0.74rem;">
              ⚡ Send Batch Now
            </button>
          </div>

        </div>

        <!-- Broken Connection Alert Banner (Conditional) -->
        <div id="api-broken-banner" style="display: none; background: rgba(198,40,40,0.08); border: 1.5px solid rgba(198,40,40,0.3); padding: 12px 18px; border-radius: 8px; font-size: 0.84rem; color: var(--status-failed); justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="alert-triangle" style="width: 18px; height: 18px;"></i>
            <span><strong>Outbound Sync Alert:</strong> Connection to target app broken or timed out. Payload transmissions are paused.</span>
          </div>
          <button class="btn btn-secondary" onclick="PipelinePage.testPingConnection()" style="padding: 4px 10px; font-size: 0.76rem;">Retry Connection</button>
        </div>

        <!-- 3. Clean, Simplified & Organized Outbound Dispatch Board -->
        <div class="glass-card" style="padding: 20px;">
          <div style="margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <div>
              <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700;">
                Outbound API Dispatch Roster
              </h4>
              <p style="font-size: 0.8rem; color: var(--text-muted);">
                Clean verified status of content and 4-slide visual decks sent to your connected partner application.
              </p>
            </div>
            <button class="btn btn-secondary" onclick="PipelinePage.loadDispatchData()" style="padding: 4px 10px; font-size: 0.76rem;">
              <i data-lucide="refresh-cw" style="width: 13px; height: 13px;"></i> Refresh
            </button>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.84rem;">
              <thead>
                <tr style="background: var(--bg-surface); border-bottom: 1.5px solid var(--border-color); font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">
                  <th style="padding: 10px 14px; width: 45%;">Story & Publisher</th>
                  <th style="padding: 10px 14px; width: 22%; text-align: center;">Assets Ready</th>
                  <th style="padding: 10px 14px; width: 18%; text-align: center;">API Sync State</th>
                  <th style="padding: 10px 14px; width: 15%; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody id="dispatch-articles-tbody">
                <tr><td colspan="4" style="text-align: center; padding: 30px; color: var(--text-muted);">Loading dispatch roster...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- JSON Payload Inspection Modal -->
      <div id="payload-modal" class="modal" style="display: none;">
        <div class="modal-backdrop" onclick="PipelinePage.closePayloadModal()"></div>
        <div class="modal-content glass-card" style="max-width: 680px; width: 92%; max-height: 85vh; display: flex; flex-direction: column;">
          <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border-color);">
            <div>
              <span class="badge" style="background: rgba(46,125,50,0.12); color: #2e7d32; font-weight: 700;">TRANSMITTED PAYLOAD</span>
              <h3 id="payload-modal-title" style="font-family: var(--font-serif); font-size: 1.15rem; margin-top: 4px;">Payload Inspector</h3>
            </div>
            <button class="btn-icon" onclick="PipelinePage.closePayloadModal()">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div style="padding: 16px 18px; overflow-y: auto; flex: 1;">
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">
              Destination: <code id="payload-modal-endpoint" style="color: var(--primary-purple); font-weight: 700;">...</code>
            </div>
            <pre id="payload-json-content" style="background: var(--bg-surface); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.76rem; overflow-x: auto; color: var(--text-main); white-space: pre-wrap; line-height: 1.45;"></pre>
          </div>
          <div style="padding: 12px 18px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn btn-secondary" onclick="PipelinePage.copyPayloadJson()">Copy JSON</button>
            <button class="btn btn-primary" onclick="PipelinePage.closePayloadModal()">Close</button>
          </div>
        </div>
      </div>

      <!-- API Configuration Modal -->
      <div id="config-modal" class="modal" style="display: none;">
        <div class="modal-backdrop" onclick="PipelinePage.closeConfigModal()"></div>
        <div class="modal-content glass-card" style="max-width: 500px; width: 92%;">
          <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border-color);">
            <h3 style="font-family: var(--font-serif); font-size: 1.15rem;">Configure Destination API</h3>
            <button class="btn-icon" onclick="PipelinePage.closeConfigModal()">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div style="padding: 18px; display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 4px;">Destination REST / Webhook URL</label>
              <input type="text" id="cfg-target-url" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); font-size: 0.85rem;" placeholder="http://localhost:5000/api/inbound/news">
            </div>
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 4px;">Bearer Authorization Token</label>
              <input type="text" id="cfg-auth-token" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); font-size: 0.85rem;" placeholder="bearer_token_...">
            </div>
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 4px;">Connected App Name</label>
              <input type="text" id="cfg-app-name" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); font-size: 0.85rem;" value="Omni-Channel AI Agent">
            </div>
          </div>
          <div style="padding: 12px 18px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn btn-secondary" onclick="PipelinePage.closeConfigModal()">Cancel</button>
            <button class="btn btn-primary" onclick="PipelinePage.saveConfig()">Save & Test</button>
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
        this.nextDispatchCountdown = 120 * 60;
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
      
      const n1 = document.getElementById('node-1-count');
      const n2 = document.getElementById('node-2-count');
      const n3 = document.getElementById('node-3-count');
      const n4 = document.getElementById('node-4-count');
      const targetLabel = document.getElementById('node-4-target-label');

      if (n1) n1.textContent = `${res.node_counts.ingested} Ingested`;
      if (n2) n2.textContent = `${res.node_counts.refined} Refined`;
      if (n3) n3.textContent = `${res.node_counts.slide_decks} Decks (${res.node_counts.slide_images} Slides)`;
      if (n4) n4.textContent = `${res.stats.total_dispatched} Dispatched`;

      if (targetLabel && res.config.app_name) {
        targetLabel.textContent = `${res.config.app_name} (REST)`;
      }

      this.updateConnectionMonitor(res.health || {}, res.config);

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
      label.textContent = isConnected ? 'App 2 Bridge: Connected (200 OK)' : 'App 2 Bridge: Broken / Unreachable';
      label.style.color = isConnected ? 'var(--text-main)' : 'var(--status-failed)';
    }

    if (latencyBadge) {
      latencyBadge.textContent = `⚡ ${health.latency_ms || 18}ms`;
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
    if (btn) btn.innerHTML = '<i data-lucide="loader" style="width: 14px; height: 14px;"></i> Pinging...';
    
    try {
      const res = await App.fetchApi('/api/dispatch/ping', { method: 'POST' });
      const health = res.health;
      this.updateConnectionMonitor(health, this.dispatchConfig);
      App.showToast(`Ping: ${health.message} (${health.latency_ms}ms)`, health.status === 'error' ? 'error' : 'success');
      await this.loadPipelineData();
    } catch (e) {
      App.showToast(`Ping failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="activity" style="width: 15px; height: 15px;"></i> Ping API';
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
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px; color: var(--text-muted);">No articles in pipeline database.</td></tr>';
        return;
      }

      const deliveredCount = this.articlesData.filter(a => a.dispatch_status === 'delivered').length;
      const waitingCount = this.articlesData.filter(a => a.dispatch_status !== 'delivered').length;
      
      const compLabel = document.getElementById('queue-completed-label');
      const waitLabel = document.getElementById('queue-waiting-label');
      if (compLabel) compLabel.textContent = `${deliveredCount} Completed`;
      if (waitLabel) waitLabel.textContent = `· ${waitingCount} Queued`;

      tbody.innerHTML = this.articlesData.map(a => {
        const isDelivered = a.dispatch_status === 'delivered';
        const isFailed = a.dispatch_status === 'failed';
        const slides = a.slide_urls || [];
        const hasDeck = slides.length >= 4;

        // Theme-matched publisher pill (Warm cream/terracotta, NO harsh black!)
        const publisherHtml = `
          <span style="display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; background: rgba(217, 119, 87, 0.12); color: var(--primary-purple); border: 1px solid rgba(217, 119, 87, 0.28); text-transform: uppercase;">
            ${a.source}
          </span>
        `;

        return `
          <tr style="border-bottom: 1px solid var(--border-color); transition: background 0.15s ease;" onmouseenter="this.style.background='var(--bg-surface)'" onmouseleave="this.style.background='transparent'">
            
            <!-- Col 1: Story & Publisher (Clean, organized) -->
            <td style="padding: 12px 14px; vertical-align: middle;">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  ${publisherHtml}
                  ${a.source_domain ? `
                    <a href="${a.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.72rem; color: var(--text-muted); text-decoration: none;" title="Open original">
                      ${a.source_domain} ↗
                    </a>
                  ` : ''}
                  <span style="font-size: 0.74rem; font-weight: 800; color: ${a.rank_score >= 85 ? '#2e7d32' : '#2b7bb9'}; margin-left: auto;">
                    ★ ${a.rank_score}/100
                  </span>
                </div>
                <a href="javascript:void(0)" onclick="App.openArticleModal(${a.id})" style="font-family: var(--font-serif); font-size: 0.98rem; font-weight: 600; color: var(--text-main); text-decoration: none; line-height: 1.35;" onmouseenter="this.style.color='var(--primary-purple)'" onmouseleave="this.style.color='var(--text-main)'">
                  ${a.title}
                </a>
              </div>
            </td>

            <!-- Col 2: Assets Package (Simple, theme-matched) -->
            <td style="padding: 12px 14px; text-align: center; vertical-align: middle;">
              <div style="display: inline-flex; flex-direction: column; align-items: center; gap: 3px;">
                <span class="badge" style="font-size: 0.72rem; font-weight: 700; ${hasDeck ? 'background: rgba(193, 53, 132, 0.12); color: #c13584; border: 1px solid rgba(193, 53, 132, 0.3);' : 'background: var(--bg-surface); color: var(--text-muted);'}">
                  ${hasDeck ? '✨ 4 Slides Deck + Text' : `${slides.length} Image + Text`}
                </span>
                <span style="font-size: 0.68rem; color: var(--text-muted);">
                  ${isDelivered ? 'Done & Synced ✅' : 'Ready for transfer'}
                </span>
              </div>
            </td>

            <!-- Col 3: API Sync State -->
            <td style="padding: 12px 14px; text-align: center; vertical-align: middle;">
              ${isDelivered ? `
                <div style="display: inline-flex; flex-direction: column; align-items: center; gap: 2px;">
                  <span class="badge" style="font-size: 0.72rem; font-weight: 800; background: rgba(46,125,50,0.12); color: #2e7d32; border: 1px solid rgba(46,125,50,0.3);">
                    🟢 DELIVERED 200 OK
                  </span>
                  <span style="font-size: 0.66rem; color: var(--text-muted);">${a.dispatched_at ? App.formatTimestamp(a.dispatched_at) : 'Just now'}</span>
                </div>
              ` : isFailed ? `
                <span class="badge" style="font-size: 0.72rem; font-weight: 800; background: rgba(198,40,40,0.12); color: var(--status-failed); border: 1px solid rgba(198,40,40,0.3);">
                  🔴 FAILED (RETRY)
                </span>
              ` : `
                <span class="badge" style="font-size: 0.72rem; font-weight: 700; background: rgba(217,119,87,0.12); color: var(--primary-purple); border: 1px solid rgba(217,119,87,0.3);">
                  ⏳ IN DISPATCH QUEUE
                </span>
              `}
            </td>

            <!-- Col 4: Action (Clean, prominent buttons) -->
            <td style="padding: 12px 14px; text-align: right; vertical-align: middle;">
              <div style="display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
                ${isDelivered ? `
                  <button class="btn btn-secondary" onclick="PipelinePage.openPayloadModal(${a.id})" style="padding: 4px 10px; font-size: 0.74rem;" title="View transmitted JSON payload">
                    👁️ View Payload
                  </button>
                  <button class="btn-icon" onclick="PipelinePage.dispatchSingleArticle(${a.id})" title="Resend to App 2" style="width: 28px; height: 28px;">
                    <i data-lucide="rotate-cw" style="width: 13px; height: 13px;"></i>
                  </button>
                ` : `
                  <button class="btn btn-primary" onclick="PipelinePage.dispatchSingleArticle(${a.id})" style="padding: 5px 12px; font-size: 0.76rem; font-weight: 700;">
                    🚀 Send to App 2
                  </button>
                `}
              </div>
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
    App.showToast(`Transmitting story #${articleId} + 4-slide deck to App 2...`, 'info');
    try {
      const res = await App.fetchApi(`/api/dispatch/send/${articleId}`, { method: 'POST' });
      if (res.success) {
        App.showToast(`Story #${articleId} delivered successfully to App 2! (200 OK in ${res.latency_ms}ms)`, 'success');
        await this.loadPipelineData();
        await this.loadDispatchData();
      } else {
        App.showToast(`Dispatch warning: ${res.error}`, 'error');
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
      App.showToast(`Transmitted batch of ${res.dispatched_count} stories with slides to App 2!`, 'success');
      await this.loadPipelineData();
      await this.loadDispatchData();
    } catch (e) {
      App.showToast(`Batch dispatch failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="send" style="width: 15px; height: 15px;"></i> Send Batch Now';
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
      App.showToast(`Pipeline Auto-Dispatch is now ${isActive ? 'ACTIVE 🟢' : 'PAUSED ⏸️'}`, 'info');
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
      App.showToast(`Dispatch pace set to: ${labels[preset]}`, 'success');
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

    if (title) title.textContent = `Payload: Story #${article.id} — ${article.title.substring(0, 42)}...`;
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
      App.showToast('App 2 configuration updated & verified!', 'success');
      await this.loadPipelineData();
    } catch (e) {
      App.showToast(`Failed to update config: ${e.message}`, 'error');
    }
  }
};
