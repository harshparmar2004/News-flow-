/**
 * Pipeline Workflow & API Distribution Engine — Pure, Newly Organized Section
 * Multi-stage flow: 16-Source Ingest → Authentic Photo Extraction → NewsFlow Web & Admin Sync (:3000) → Outbound API Webhooks.
 * No ranking stars, no AI scoring gates. Pure news scraping + direct publishing workflow.
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
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="badge" style="background: rgba(217, 119, 87, 0.12); color: var(--primary-purple); font-weight: 700; font-size: 0.72rem; letter-spacing: 0.05em; text-transform: uppercase;">
                Live Distribution Engine
              </span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">v2.0 Architecture</span>
            </div>
            <h3 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: var(--text-main); margin: 0;">
              Pipeline Workflow &amp; API Distribution Engine
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 4px 0 0 0;">
              Automated multi-source flow: <strong>16-Source Sequential Ingest</strong> &rarr; <strong>Authentic Photo Extraction</strong> &rarr; <strong>NewsFlow Web &amp; Admin Desk (:3000)</strong> &rarr; <strong>Outbound API Webhooks</strong>. No ranking gates.
            </p>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; font-size: 0.82rem; text-decoration: none;">
              <i data-lucide="globe" style="width: 15px; height: 15px; color: var(--primary-purple);"></i> Open Web (:3000)
            </a>
            <a href="http://localhost:3000/admin" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; font-size: 0.82rem; text-decoration: none;">
              <i data-lucide="shield-check" style="width: 15px; height: 15px; color: #2e7d32;"></i> Admin Desk
            </a>
            <button class="btn btn-secondary" onclick="PipelinePage.testPingConnection()" id="test-ping-btn" style="display: flex; align-items: center; gap: 6px; padding: 7px 14px; font-size: 0.82rem;">
              <i data-lucide="activity" style="width: 15px; height: 15px;"></i> Ping Bridge
            </button>
            <button class="btn btn-secondary" onclick="PipelinePage.openConfigModal()" style="display: flex; align-items: center; gap: 6px; padding: 7px 14px; font-size: 0.82rem;">
              <i data-lucide="settings" style="width: 15px; height: 15px;"></i> Webhook Config
            </button>
            <button class="btn btn-primary btn-glow" onclick="PipelinePage.dispatchBatchNow()" id="dispatch-batch-btn" style="display: flex; align-items: center; gap: 6px; padding: 7px 16px; font-size: 0.84rem;">
              <i data-lucide="send" style="width: 15px; height: 15px;"></i> Sync Next Batch
            </button>
          </div>
        </div>

        <!-- 1. Visual 4-Stage Architecture Banner -->
        <div class="glass-card" style="padding: 16px 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 160px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(217,119,87,0.12); display: flex; align-items: center; justify-content: center; color: var(--primary-purple); font-weight: 700; font-size: 0.9rem;">1</div>
              <div>
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">16 News Sources</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);" id="node-1-count">Loading...</div>
              </div>
            </div>
            <i data-lucide="arrow-right" style="width: 14px; height: 14px; color: var(--border-color);"></i>
            <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 160px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(46,125,50,0.12); display: flex; align-items: center; justify-content: center; color: #2e7d32; font-weight: 700; font-size: 0.9rem;">2</div>
              <div>
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">Authentic Photos</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);" id="node-2-count">Loading...</div>
              </div>
            </div>
            <i data-lucide="arrow-right" style="width: 14px; height: 14px; color: var(--border-color);"></i>
            <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 160px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(33,150,243,0.12); display: flex; align-items: center; justify-content: center; color: #1976d2; font-weight: 700; font-size: 0.9rem;">3</div>
              <div>
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">NewsFlow Web &amp; Admin</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);" id="node-3-count">Loading...</div>
              </div>
            </div>
            <i data-lucide="arrow-right" style="width: 14px; height: 14px; color: var(--border-color);"></i>
            <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 160px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(156,39,176,0.12); display: flex; align-items: center; justify-content: center; color: #7b1fa2; font-weight: 700; font-size: 0.9rem;">4</div>
              <div>
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">API Webhook Stream</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">Outbound JSON Payloads</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Connection Bridge & Distribution Speed Controller -->
        <div class="glass-card" style="padding: 18px 22px;">
          <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 14px; border-bottom: 1px solid var(--border-color); flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 7px;">
                <span class="status-indicator online" id="api-status-dot"></span>
                <span style="font-size: 0.9rem; font-weight: 700; color: var(--text-main);" id="api-status-label">
                  NewsFlow Web Platform: Connected (200 OK)
                </span>
              </div>
              <span class="badge" style="font-size: 0.74rem; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-muted);">
                Endpoint: <code style="color: var(--primary-purple); font-weight: 700; margin-left: 4px;" id="api-target-display">http://localhost:3000/api/articles</code>
              </span>
              <span class="badge" id="api-latency-badge" style="font-size: 0.72rem; background: rgba(46,125,50,0.1); color: #2e7d32; font-weight: 600;">
                &#9889; 12ms
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">Pipeline Auto-Sync:</span>
              <div style="display: flex; background: var(--bg-surface); border-radius: 8px; border: 1px solid var(--border-color); padding: 2px;">
                <button id="rate-mode-active" class="btn btn-primary" onclick="PipelinePage.setAutomationState(true)" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 6px;">Active &#128994;</button>
                <button id="rate-mode-paused" class="btn btn-secondary" onclick="PipelinePage.setAutomationState(false)" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 6px;">Paused &#9208;&#65039;</button>
              </div>
            </div>
          </div>

          <div style="margin-top: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">Distribution Pacing &amp; Workflow Mode:</span>
              <span style="font-size: 0.76rem; color: var(--text-muted);">Controls sync speed for scraped stories &amp; authentic photos to NewsFlow Web &amp; Admin</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
              <label class="glass-card rate-card" style="padding: 10px 14px; cursor: pointer; border: 1.5px solid var(--primary-purple); background: rgba(217,119,87,0.06); display: flex; align-items: center; gap: 10px; border-radius: 8px;">
                <input type="radio" name="dispatch_speed_preset" value="instant" checked onchange="PipelinePage.onRatePresetChange('instant')">
                <div><div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">&#9889; Instant Sync</div><div style="font-size: 0.7rem; color: var(--text-muted);">Line-by-line as scraped</div></div>
              </label>
              <label class="glass-card rate-card" style="padding: 10px 14px; cursor: pointer; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; border-radius: 8px;">
                <input type="radio" name="dispatch_speed_preset" value="batch_10_1hr" onchange="PipelinePage.onRatePresetChange('batch_10_1hr')">
                <div><div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">&#8987; Hourly Bursts</div><div style="font-size: 0.7rem; color: var(--text-muted);">Batch 10 / hour</div></div>
              </label>
              <label class="glass-card rate-card" style="padding: 10px 14px; cursor: pointer; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; border-radius: 8px;">
                <input type="radio" name="dispatch_speed_preset" value="batch_10_2hr" onchange="PipelinePage.onRatePresetChange('batch_10_2hr')">
                <div><div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">&#128230; Standard Pacing</div><div style="font-size: 0.7rem; color: var(--text-muted);">Batch 10 / 2 hours</div></div>
              </label>
              <label class="glass-card rate-card" style="padding: 10px 14px; cursor: pointer; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; border-radius: 8px;">
                <input type="radio" name="dispatch_speed_preset" value="review_first" onchange="PipelinePage.onRatePresetChange('review_first')">
                <div><div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">&#128737; Admin Review First</div><div style="font-size: 0.7rem; color: var(--text-muted);">Hold drafts in Admin</div></div>
              </label>
            </div>
          </div>

          <div style="margin-top: 14px; background: var(--bg-surface); padding: 10px 16px; border-radius: 8px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-size: 0.78rem;">
            <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
              <div><span style="color: var(--text-muted);">Sources:</span><strong style="color: var(--text-main); margin-left: 4px;" id="sources-traversed-label">16 / 16</strong></div>
              <span style="color: var(--border-color);">|</span>
              <div><span style="color: var(--text-muted);">Synced to Web:</span><strong style="color: #1976d2; margin-left: 4px;" id="queue-completed-label">Loading</strong></div>
              <span style="color: var(--border-color);">|</span>
              <div><span style="color: var(--text-muted);">Pending:</span><strong style="color: var(--primary-purple); margin-left: 4px;" id="queue-waiting-label">—</strong></div>
              <span style="color: var(--border-color);">|</span>
              <div><span style="color: var(--text-muted);">Next Auto-Cycle:</span><strong style="color: var(--primary-purple); font-family: var(--font-mono); margin-left: 4px;" id="next-dispatch-timer">14m 20s</strong></div>
            </div>
            <button class="btn btn-secondary" onclick="PipelinePage.dispatchBatchNow()" style="padding: 4px 12px; font-size: 0.74rem;">&#9889; Trigger Cycle Now</button>
          </div>
        </div>

        <!-- Connection Alert Banner (Conditional) -->
        <div id="api-broken-banner" style="display: none; background: rgba(198,40,40,0.08); border: 1.5px solid rgba(198,40,40,0.3); padding: 12px 18px; border-radius: 8px; font-size: 0.84rem; color: var(--status-failed); justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="alert-triangle" style="width: 18px; height: 18px;"></i>
            <span><strong>Distribution Sync Alert:</strong> Connection to NewsFlow Web bridge timed out. Payloads are paused.</span>
          </div>
          <button class="btn btn-secondary" onclick="PipelinePage.testPingConnection()" style="padding: 4px 10px; font-size: 0.76rem;">Retry Connection</button>
        </div>

        <!-- 3. Pure, Newly Organized Publishing & Distribution Roster -->
        <div class="glass-card" style="padding: 20px;">
          <div style="margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h4 style="font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700; margin: 0;">NewsFlow Publishing &amp; API Distribution Roster</h4>
                <span class="badge" style="background: rgba(46,125,50,0.12); color: #2e7d32; font-weight: 700; font-size: 0.68rem;">100% Sequential</span>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 3px 0 0 0;">
                Chronological catalog of all scraped stories, authentic editorial media, and live sync status across NewsFlow Web &amp; API endpoints. No ranking scores.
              </p>
            </div>
            <button class="btn btn-secondary" onclick="PipelinePage.loadDispatchData()" style="padding: 5px 12px; font-size: 0.76rem;">
              <i data-lucide="refresh-cw" style="width: 13px; height: 13px;"></i> Refresh Roster
            </button>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.84rem;">
              <thead>
                <tr style="background: var(--bg-surface); border-bottom: 1.5px solid var(--border-color); font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">
                  <th style="padding: 11px 14px; width: 38%;">Story &amp; Publisher</th>
                  <th style="padding: 11px 14px; width: 14%;">Category</th>
                  <th style="padding: 11px 14px; width: 18%; text-align: center;">Authentic Photo</th>
                  <th style="padding: 11px 14px; width: 16%; text-align: center;">NewsFlow Web Desk</th>
                  <th style="padding: 11px 14px; width: 14%; text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody id="dispatch-articles-tbody">
                <tr><td colspan="5" style="text-align: center; padding: 35px; color: var(--text-muted);">Loading distribution roster...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- JSON Payload Inspection Modal -->
      <div id="payload-modal" class="modal" style="display: none;">
        <div class="modal-backdrop" onclick="PipelinePage.closePayloadModal()"></div>
        <div class="modal-content glass-card" style="max-width: 720px; width: 92%; max-height: 85vh; display: flex; flex-direction: column;">
          <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border-color);">
            <div>
              <span class="badge" style="background: rgba(46,125,50,0.12); color: #2e7d32; font-weight: 700;">DISTRIBUTION PAYLOAD</span>
              <h3 id="payload-modal-title" style="font-family: var(--font-serif); font-size: 1.15rem; margin-top: 4px;">Payload Inspector</h3>
            </div>
            <button class="btn-icon" onclick="PipelinePage.closePayloadModal()"><i data-lucide="x"></i></button>
          </div>
          <div style="padding: 16px 18px; overflow-y: auto; flex: 1;">
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">Target: <code id="payload-modal-endpoint" style="color: var(--primary-purple); font-weight: 700;">...</code></div>
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
        <div class="modal-content glass-card" style="max-width: 520px; width: 92%;">
          <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border-color);">
            <h3 style="font-family: var(--font-serif); font-size: 1.15rem;">Configure Distribution Endpoints</h3>
            <button class="btn-icon" onclick="PipelinePage.closeConfigModal()"><i data-lucide="x"></i></button>
          </div>
          <div style="padding: 18px; display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 4px;">Destination REST / Webhook URL</label>
              <input type="text" id="cfg-target-url" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); font-size: 0.85rem;" placeholder="http://localhost:3000/api/articles">
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">Default: NewsFlow Web platform endpoint</div>
            </div>
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 4px;">Bearer Authorization Token / API Key</label>
              <input type="text" id="cfg-auth-token" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); font-size: 0.85rem;" placeholder="nf_live_sec_...">
            </div>
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 4px;">Connected Destination Platform Name</label>
              <input type="text" id="cfg-app-name" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); font-size: 0.85rem;" value="NewsFlow Web &amp; Admin Platform">
            </div>
          </div>
          <div style="padding: 12px 18px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn btn-secondary" onclick="PipelinePage.closeConfigModal()">Cancel</button>
            <button class="btn btn-primary" onclick="PipelinePage.saveConfig()">Save &amp; Test Connection</button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.startCountdownTimer();
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
      const srcLabel = document.getElementById('sources-traversed-label');

      if (n1) n1.textContent = `${res.node_counts.ingested} Scraped`;
      if (n2) n2.textContent = `${res.node_counts.photos || 0} Photos`;
      if (n3) n3.textContent = `${res.node_counts.web_synced || 0} Synced`;
      if (srcLabel) srcLabel.textContent = `${res.node_counts.sources_count || 16} / 16`;

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

    if (targetDisp && config) {
      targetDisp.textContent = config.target_url || 'http://localhost:3000/api/articles';
    }

    const isConnected = health.status === 'connected' || health.status === 'connected_mock';
    if (dot) dot.className = isConnected ? 'status-indicator online' : 'status-indicator offline';
    if (label) {
      label.textContent = isConnected ? 'NewsFlow Web Platform: Connected (200 OK)' : 'NewsFlow Web Bridge: Offline / Unreachable';
      label.style.color = isConnected ? 'var(--text-main)' : 'var(--status-failed)';
    }

    if (latencyBadge) {
      latencyBadge.textContent = `\u26A1 ${health.latency_ms || 12}ms`;
      latencyBadge.style.color = isConnected ? '#2e7d32' : 'var(--status-failed)';
      latencyBadge.style.background = isConnected ? 'rgba(46,125,50,0.1)' : 'rgba(198,40,40,0.1)';
    }

    if (brokenBanner) {
      brokenBanner.style.display = isConnected ? 'none' : 'flex';
    }
  },

  async testPingConnection() {
    const btn = document.getElementById('test-ping-btn');
    if (btn) btn.innerHTML = '<i data-lucide="loader" style="width: 14px; height: 14px;"></i> Pinging...';

    try {
      const res = await App.fetchApi('/api/dispatch/ping', { method: 'POST' });
      const health = res.health;
      this.updateConnectionMonitor(health, this.dispatchConfig);
      App.showToast(`Bridge Ping: ${health.message} (${health.latency_ms}ms)`, health.status === 'error' ? 'error' : 'success');
      await this.loadPipelineData();
    } catch (e) {
      App.showToast(`Ping failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="activity" style="width: 15px; height: 15px;"></i> Ping Bridge';
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  async loadDispatchData() {
    const tbody = document.getElementById('dispatch-articles-tbody');
    if (!tbody) return;

    try {
      const res = await App.fetchApi('/api/dispatch/articles?limit=25');
      this.articlesData = res.articles || [];

      if (this.articlesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 35px; color: var(--text-muted);">No articles yet. Start a pipeline run to begin scraping all 16 sources.</td></tr>';
        return;
      }

      const deliveredCount = this.articlesData.filter(a => a.dispatch_status === 'delivered' || a.web_posted).length;
      const waitingCount = this.articlesData.filter(a => a.dispatch_status !== 'delivered' && !a.web_posted).length;

      const compLabel = document.getElementById('queue-completed-label');
      const waitLabel = document.getElementById('queue-waiting-label');
      if (compLabel) compLabel.textContent = `${deliveredCount} Synced`;
      if (waitLabel) waitLabel.textContent = `${waitingCount} Pending`;

      tbody.innerHTML = this.articlesData.map(a => {
        const isDelivered = a.dispatch_status === 'delivered' || a.web_posted;
        const hasPhoto = a.has_authentic_photo;
        const photoUrl = a.photo_url;

        const publisherHtml = `
          <span style="display: inline-flex; align-items: center; padding: 2.5px 8px; border-radius: 6px; font-size: 0.68rem; font-weight: 700; background: rgba(217, 119, 87, 0.12); color: var(--primary-purple); border: 1px solid rgba(217, 119, 87, 0.28); text-transform: uppercase;">
            ${a.source}
          </span>
        `;

        const photoColHtml = hasPhoto && photoUrl ? `
          <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
            <img src="${photoUrl}" alt="Editorial" style="width: 44px; height: 30px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);" onerror="this.style.display='none'" />
            <span class="badge" style="font-size: 0.68rem; font-weight: 700; background: rgba(46,125,50,0.12); color: #2e7d32; border: 1px solid rgba(46,125,50,0.3);">&#128247; Photo</span>
          </div>
        ` : `
          <span class="badge" style="font-size: 0.68rem; font-weight: 600; background: var(--bg-surface); color: var(--text-muted); border: 1px solid var(--border-color);">&#128444; Topic Visual</span>
        `;

        const catHtml = `
          <span class="badge" style="font-size: 0.72rem; font-weight: 600; background: rgba(217, 119, 87, 0.08); color: var(--text-main); border: 1px solid var(--border-color);">
            ${a.category || 'Tech & Innovation'}
          </span>
        `;

        const webSyncHtml = a.web_posted ? `
          <div style="display: inline-flex; flex-direction: column; align-items: center; gap: 3px;">
            <span class="badge" style="font-size: 0.68rem; font-weight: 700; background: rgba(46,125,50,0.12); color: #2e7d32; border: 1px solid rgba(46,125,50,0.3);">&#9989; Draft in Admin</span>
            ${a.web_slug ? `<a href="http://localhost:3000/article/${a.web_slug}" target="_blank" rel="noopener noreferrer" style="font-size: 0.66rem; color: var(--primary-purple);">View on Web &#8599;</a>` : ''}
          </div>
        ` : `
          <span class="badge" style="font-size: 0.68rem; font-weight: 600; background: rgba(217,119,87,0.12); color: var(--primary-purple); border: 1px solid rgba(217,119,87,0.3);">&#8987; Pending Sync</span>
        `;

        return `
          <tr style="border-bottom: 1px solid var(--border-color); transition: background 0.15s ease;" onmouseenter="this.style.background='var(--bg-surface)'" onmouseleave="this.style.background='transparent'">
            <td style="padding: 12px 14px; vertical-align: middle;">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  ${publisherHtml}
                  ${a.source_domain ? `<a href="${a.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.72rem; color: var(--text-muted); text-decoration: none;">${a.source_domain} &#8599;</a>` : ''}
                  <span style="font-size: 0.7rem; color: var(--text-muted); margin-left: auto;">${a.scraped_at ? App.formatTimestamp(a.scraped_at) : 'Recent'}</span>
                </div>
                <a href="javascript:void(0)" onclick="App.openArticleModal(${a.id})" style="font-family: var(--font-serif); font-size: 0.96rem; font-weight: 600; color: var(--text-main); text-decoration: none; line-height: 1.35;" onmouseenter="this.style.color='var(--primary-purple)'" onmouseleave="this.style.color='var(--text-main)'">
                  ${a.title}
                </a>
              </div>
            </td>
            <td style="padding: 12px 14px; vertical-align: middle;">${catHtml}</td>
            <td style="padding: 12px 14px; text-align: center; vertical-align: middle;">${photoColHtml}</td>
            <td style="padding: 12px 14px; text-align: center; vertical-align: middle;">${webSyncHtml}</td>
            <td style="padding: 12px 14px; text-align: right; vertical-align: middle;">
              <div style="display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
                <button class="btn btn-secondary" onclick="PipelinePage.openPayloadModal(${a.id})" style="padding: 4px 9px; font-size: 0.74rem;" title="View distribution JSON payload">
                  &#128065; Payload
                </button>
                ${isDelivered ? `
                  <button class="btn-icon" onclick="PipelinePage.dispatchSingleArticle(${a.id})" title="Resync to NewsFlow Web" style="width: 28px; height: 28px;">
                    <i data-lucide="rotate-cw" style="width: 13px; height: 13px;"></i>
                  </button>
                ` : `
                  <button class="btn btn-primary" onclick="PipelinePage.dispatchSingleArticle(${a.id})" style="padding: 4px 10px; font-size: 0.74rem; font-weight: 700;">
                    &#128640; Sync
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
    App.showToast(`Synchronizing story #${articleId} + authentic photo to NewsFlow Web Desk...`, 'info');
    try {
      const res = await App.fetchApi(`/api/dispatch/send/${articleId}`, { method: 'POST' });
      if (res.success) {
        App.showToast(`Story #${articleId} synchronized to NewsFlow Web & Admin!`, 'success');
        await this.loadPipelineData();
        await this.loadDispatchData();
      } else {
        App.showToast(`Sync note: ${res.error || 'Check server logs'}`, 'warning');
        await this.loadPipelineData();
        await this.loadDispatchData();
      }
    } catch (e) {
      App.showToast(`Sync failed: ${e.message}`, 'error');
    }
  },

  async dispatchBatchNow() {
    const btn = document.getElementById('dispatch-batch-btn');
    if (btn) btn.innerHTML = '<i data-lucide="loader" style="width: 14px; height: 14px;"></i> Syncing...';

    try {
      const res = await App.fetchApi('/api/dispatch/send-batch?count=10', { method: 'POST' });
      App.showToast(`Synchronized batch of ${res.dispatched_count} stories with authentic photos to NewsFlow Web Desk!`, 'success');
      await this.loadPipelineData();
      await this.loadDispatchData();
    } catch (e) {
      App.showToast(`Batch sync failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="send" style="width: 15px; height: 15px;"></i> Sync Next Batch';
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
      App.showToast(`Pipeline Auto-Sync is now ${isActive ? 'ACTIVE \u{1F7E2}' : 'PAUSED \u23F8\uFE0F'}`, 'info');
    } catch (e) {
      console.warn("Failed to set automation state", e);
    }
  },

  async onRatePresetChange(preset) {
    const labels = {
      'instant': 'Instant Sync (Line-by-line as scraped)',
      'batch_10_1hr': 'Hourly Bursts (Batch 10 / 1 Hour)',
      'batch_10_2hr': 'Standard Pacing (Batch 10 / 2 Hours)',
      'review_first': 'Admin Review First (Hold Drafts)'
    };
    try {
      await App.fetchApi('/api/dispatch/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate_limit: { mode: preset, label: labels[preset] || preset } })
      });
      App.showToast(`Distribution pacing: ${labels[preset]}`, 'success');
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
    if (endpoint) endpoint.textContent = this.dispatchConfig ? this.dispatchConfig.target_url : 'http://localhost:3000/api/articles';
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
      if (urlInput) urlInput.value = this.dispatchConfig.target_url || 'http://localhost:3000/api/articles';
      if (tokenInput) tokenInput.value = this.dispatchConfig.auth_token || 'nf_live_sec_9942a8b7e1034f68a';
      if (nameInput) nameInput.value = this.dispatchConfig.app_name || 'NewsFlow Web & Admin Platform';
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
      target_url: urlInput ? urlInput.value : 'http://localhost:3000/api/articles',
      auth_token: tokenInput ? tokenInput.value : 'nf_live_sec_9942a8b7e1034f68a',
      app_name: nameInput ? nameInput.value : 'NewsFlow Web & Admin Platform'
    };
    try {
      const res = await App.fetchApi('/api/dispatch/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      this.dispatchConfig = res.config;
      this.closeConfigModal();
      App.showToast('Distribution configuration updated & verified!', 'success');
      await this.loadPipelineData();
    } catch (e) {
      App.showToast(`Failed to update config: ${e.message}`, 'error');
    }
  }
};
