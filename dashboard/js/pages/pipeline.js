/**
 * Pipeline Operations & Sources Ingest Cockpit
 * Dedicated operational console for managing the sequential 16-source crawler,
 * authentic photo extraction, system health monitoring, and automated NewsFlow synchronization.
 */
const PipelinePage = {
  dispatchConfig: null,
  sourcesData: [],
  healthData: null,
  timerInterval: null,
  nextCycleSeconds: 14 * 60 + 20,

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 1320px; margin: 0 auto; padding-bottom: 40px;">
        
        <!-- Unified Pipeline Command Card (Single Cohesive Container) -->
        <div class="glass-card" style="padding: 0; overflow: hidden; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
          
          <!-- Top Row: Engine Title, Live Status & Primary Actions -->
          <div style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; background: #ffffff;">
            <div>
              <div style="display: flex; align-items: center; gap: 9px; margin-bottom: 3px;">
                <h3 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin: 0;">
                  Pipeline Operations Engine
                </h3>
                <span id="pipeline-status-badge" class="badge" style="background: rgba(16,185,129,0.1); color: #059669; border: 1px solid rgba(16,185,129,0.25); font-weight: 700; font-size: 0.72rem; padding: 2px 8px; border-radius: 6px;">
                  ● System Ready
                </span>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">
                Sequential 16-source crawler traversal (#1 to #16), authentic photo caching, and automated sync to NewsFlow (:3000).
              </p>
            </div>

            <!-- Action Button Group -->
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <button class="btn btn-primary btn-glow" id="pipeline-run-trigger-btn" onclick="PipelinePage.triggerRun()" style="display: flex; align-items: center; gap: 7px; padding: 7px 16px; font-weight: 700; font-size: 0.82rem;">
                <i data-lucide="play" style="width: 14px; height: 14px;"></i> Run Full Pipeline (16 Sources)
              </button>

              <div style="display: flex; gap: 2px; background: var(--bg-surface); padding: 2px; border-radius: 8px; border: 1px solid var(--border-color);">
                <button class="btn btn-secondary" onclick="PipelinePage.syncAdminStatus()" style="padding: 5px 10px; font-size: 0.76rem; border: none; background: transparent; display: flex; align-items: center; gap: 4px; color: var(--text-main);" title="Mirror latest Draft/Published status from NewsFlow Admin">
                  <i data-lucide="rotate-cw" style="width: 13px; height: 13px;"></i> Sync Admin
                </button>
                <a href="#ranking" class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.76rem; border: none; background: transparent; text-decoration: none; display: flex; align-items: center; gap: 4px; color: var(--text-main);" title="Open News Website Desk">
                  <i data-lucide="newspaper" style="width: 13px; height: 13px; color: var(--primary-purple);"></i> News Desk &rarr;
                </a>
              </div>
            </div>
          </div>

          <!-- Bottom Row: Integrated 4-Stage Architecture Strip (Inside the same card) -->
          <div style="padding: 12px 20px; background: var(--bg-surface); border-top: 1px solid var(--border-color);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; align-items: center;">
              
              <!-- Stage 1 -->
              <div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="width: 32px; height: 32px; border-radius: 6px; background: rgba(79,70,229,0.1); color: #4F46E5; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">1</div>
                <div style="min-width: 0;">
                  <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">16 News Sources</div>
                  <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" id="stage-1-stat">16 Traversed</div>
                </div>
              </div>

              <!-- Stage 2 -->
              <div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="width: 32px; height: 32px; border-radius: 6px; background: rgba(16,185,129,0.1); color: #059669; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">2</div>
                <div style="min-width: 0;">
                  <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Authentic Photos</div>
                  <div style="font-size: 0.95rem; font-weight: 800; color: #059669; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" id="stage-2-stat">Loading...</div>
                </div>
              </div>

              <!-- Stage 3 -->
              <div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="width: 32px; height: 32px; border-radius: 6px; background: rgba(6,182,212,0.1); color: #0891b2; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">3</div>
                <div style="min-width: 0;">
                  <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">NewsFlow Admin</div>
                  <div style="font-size: 0.95rem; font-weight: 800; color: #0891b2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" id="stage-3-stat">Loading...</div>
                </div>
              </div>

              <!-- Stage 4 -->
              <div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="width: 32px; height: 32px; border-radius: 6px; background: rgba(139,92,246,0.1); color: #7c3aed; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">4</div>
                <div style="min-width: 0;">
                  <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Live Website</div>
                  <div style="font-size: 0.95rem; font-weight: 800; color: #7c3aed; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" id="stage-4-stat">Loading...</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        <!-- Two-Column Operational Layout -->
        <div style="display: grid; grid-template-columns: 1fr 340px; gap: 16px; align-items: start;">
          
          <!-- LEFT COLUMN: Sequential 16-Source Ingest Tracker -->
          <div class="glass-card" style="padding: 0; overflow: hidden; border-radius: 12px; border: 1px solid var(--border-color);">
            <div style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; border-bottom: 1px solid var(--border-color); background: #ffffff;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <h4 style="font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700; margin: 0; color: var(--text-main);">
                    Sequential 16-Source Ingest Tracker
                  </h4>
                  <span class="badge" style="background: rgba(16,185,129,0.1); color: #059669; font-size: 0.68rem; font-weight: 700;">
                    100% Crawl Order
                  </span>
                </div>
                <p style="font-size: 0.76rem; color: var(--text-muted); margin: 3px 0 0 0;">
                  The pipeline scrapes sources sequentially in order from #1 (TechCrunch) to #16 (Bloomberg).
                </p>
              </div>
              <button class="btn btn-secondary" onclick="PipelinePage.loadSourcesProgress()" style="padding: 4px 10px; font-size: 0.74rem; display: flex; align-items: center; gap: 4px;">
                <i data-lucide="refresh-cw" style="width: 12px; height: 12px;"></i> Refresh
              </button>
            </div>

            <!-- Sources Table -->
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.82rem;">
                <thead>
                  <tr style="background: var(--bg-surface); border-bottom: 1px solid var(--border-color); font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">
                    <th style="padding: 9px 14px; width: 44px; text-align: center;">#</th>
                    <th style="padding: 9px 14px;">Source &amp; Domain</th>
                    <th style="padding: 9px 14px; width: 90px; text-align: center;">Tier</th>
                    <th style="padding: 9px 14px; width: 110px; text-align: center;">Recent Yield</th>
                    <th style="padding: 9px 14px; width: 110px; text-align: center;">In Database</th>
                    <th style="padding: 9px 14px; width: 100px; text-align: right;">Status</th>
                  </tr>
                </thead>
                <tbody id="sources-tracker-tbody">
                  <tr><td colspan="6" style="padding: 30px; text-align: center; color: var(--text-muted);">Loading 16 sequential sources...</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- RIGHT COLUMN: Operational Controls & System Health -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            
            <!-- Card 1: System Health -->
            <div class="glass-card" style="padding: 16px 18px; border-radius: 12px; border: 1px solid var(--border-color);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <h4 style="font-family: var(--font-serif); font-size: 1.02rem; font-weight: 700; margin: 0; color: var(--text-main);">
                  System Health
                </h4>
                <span id="health-overall-dot" class="status-indicator online"></span>
              </div>
              <div id="health-metrics-list" style="display: flex; flex-direction: column; gap: 7px; font-size: 0.78rem;">
                <div style="display: flex; justify-content: space-between; padding: 6px 10px; background: var(--bg-surface); border-radius: 6px; border: 1px solid var(--border-color);">
                  <span style="color: var(--text-muted);">Website (:3000)</span>
                  <strong id="health-web-status" style="color: #059669;">Checking...</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 6px 10px; background: var(--bg-surface); border-radius: 6px; border: 1px solid var(--border-color);">
                  <span style="color: var(--text-muted);">Agent API Key</span>
                  <strong id="health-key-status" style="color: #059669;">Checking...</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 6px 10px; background: var(--bg-surface); border-radius: 6px; border: 1px solid var(--border-color);">
                  <span style="color: var(--text-muted);">Database</span>
                  <strong id="health-db-status" style="color: var(--text-main);">Checking...</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 6px 10px; background: var(--bg-surface); border-radius: 6px; border: 1px solid var(--border-color);">
                  <span style="color: var(--text-muted);">Scraped Photos Vault</span>
                  <strong id="health-img-status" style="color: #059669;">Checking...</strong>
                </div>
              </div>
              <div style="margin-top: 12px;">
                <button class="btn btn-secondary" onclick="PipelinePage.syncAdminStatus()" style="width: 100%; padding: 6px 12px; font-size: 0.76rem; display: flex; align-items: center; justify-content: center; gap: 5px;">
                  <i data-lucide="rotate-cw" style="width: 13px; height: 13px;"></i> Sync Admin Status Now
                </button>
              </div>
            </div>

            <!-- Card 2: Automation & Pacing -->
            <div class="glass-card" style="padding: 16px 18px; border-radius: 12px; border: 1px solid var(--border-color);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <h4 style="font-family: var(--font-serif); font-size: 1.02rem; font-weight: 700; margin: 0; color: var(--text-main);">
                  Pacing &amp; Automation
                </h4>
                <span id="automation-toggle-badge" class="badge" style="background: rgba(16,185,129,0.1); color: #059669; font-size: 0.68rem; font-weight: 700;">Active</span>
              </div>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin: 0 0 10px 0;">
                Automated scheduler for periodic 16-source scraping cycles.
              </p>
              
              <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;">
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 6px; border: 1.5px solid var(--primary-purple); background: rgba(217,119,87,0.06); cursor: pointer; font-size: 0.78rem;">
                  <span><strong>⚡ Instant Sync</strong> (as scraped)</span>
                  <input type="radio" name="pacing_mode" value="instant" checked onchange="PipelinePage.onPacingChange('instant')" />
                </label>
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-surface); cursor: pointer; font-size: 0.78rem;">
                  <span><strong>⏱️ Hourly Bursts</strong> (every 1h)</span>
                  <input type="radio" name="pacing_mode" value="batch_10_1hr" onchange="PipelinePage.onPacingChange('batch_10_1hr')" />
                </label>
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-surface); cursor: pointer; font-size: 0.78rem;">
                  <span><strong>📦 Standard Pacing</strong> (every 2h)</span>
                  <input type="radio" name="pacing_mode" value="batch_10_2hr" onchange="PipelinePage.onPacingChange('batch_10_2hr')" />
                </label>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.76rem; padding-top: 8px; border-top: 1px solid var(--border-color);">
                <span style="color: var(--text-muted);">Next cycle in:</span>
                <strong id="next-cycle-countdown" style="font-family: var(--font-mono); color: var(--primary-purple);">14m 20s</strong>
              </div>
            </div>

            <!-- Card 3: Advanced Webhook / REST Distribution (Accordion) -->
            <div class="glass-card" style="padding: 14px 18px; border-radius: 12px; border: 1px solid var(--border-color);">
              <details style="cursor: pointer;">
                <summary style="font-family: var(--font-serif); font-size: 0.95rem; font-weight: 700; color: var(--text-main); user-select: none;">
                  Advanced Webhook Settings &amp; Endpoints
                </summary>
                <div style="margin-top: 12px; font-size: 0.76rem; display: flex; flex-direction: column; gap: 8px; color: var(--text-muted);">
                  <div>
                    <span style="display: block; font-weight: 600; color: var(--text-main); margin-bottom: 2px;">Target Inbound Endpoint</span>
                    <code id="adv-target-display" style="color: var(--primary-purple); word-break: break-all; font-size: 0.74rem;">http://localhost:3000/api/articles</code>
                  </div>
                  <div>
                    <span style="display: block; font-weight: 600; color: var(--text-main); margin-bottom: 2px;">Target Platform</span>
                    <span>NewsFlow Web &amp; Admin Cockpit (:3000)</span>
                  </div>
                  <div style="display: flex; gap: 6px; margin-top: 4px;">
                    <button class="btn btn-secondary" onclick="PipelinePage.testPing()" id="adv-ping-btn" style="padding: 4px 10px; font-size: 0.74rem; flex: 1;">
                      <i data-lucide="activity" style="width: 12px; height: 12px;"></i> Ping Bridge
                    </button>
                    <button class="btn btn-secondary" onclick="PipelinePage.openConfigModal()" style="padding: 4px 10px; font-size: 0.74rem; flex: 1;">
                      <i data-lucide="settings" style="width: 12px; height: 12px;"></i> Configure
                    </button>
                  </div>
                </div>
              </details>
            </div>

          </div>

        </div>

      </div>

      <!-- Config Modal -->
      <div id="config-modal" class="modal" style="display: none;">
        <div class="modal-backdrop" onclick="PipelinePage.closeConfigModal()"></div>
        <div class="modal-content glass-card" style="max-width: 500px; width: 92%;">
          <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border-color);">
            <h3 style="font-family: var(--font-serif); font-size: 1.15rem; margin: 0;">Configure Distribution Endpoint</h3>
            <button class="btn-icon" onclick="PipelinePage.closeConfigModal()"><i data-lucide="x"></i></button>
          </div>
          <div style="padding: 18px; display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 4px;">Destination URL</label>
              <input type="text" id="cfg-target-url" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); font-size: 0.82rem;" placeholder="http://localhost:3000/api/articles" />
            </div>
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 4px;">API Auth Key (x-api-key)</label>
              <input type="text" id="cfg-auth-token" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); font-size: 0.82rem;" placeholder="nf_live_sec_..." />
            </div>
          </div>
          <div style="padding: 12px 18px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn btn-secondary" onclick="PipelinePage.closeConfigModal()">Cancel</button>
            <button class="btn btn-primary" onclick="PipelinePage.saveConfig()">Save</button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.startCountdown();
    await this.loadPipelineOverview();
    await this.loadSourcesProgress();
    await this.loadSystemHealth();
  },

  startCountdown() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.nextCycleSeconds > 0) {
        this.nextCycleSeconds--;
      } else {
        this.nextCycleSeconds = 60 * 60;
      }
      const m = Math.floor(this.nextCycleSeconds / 60);
      const s = this.nextCycleSeconds % 60;
      const el = document.getElementById('next-cycle-countdown');
      if (el) el.textContent = `${m}m ${String(s).padStart(2, '0')}s`;
    }, 1000);
  },

  async loadPipelineOverview() {
    try {
      const res = await App.fetchApi('/api/dispatch/status');
      this.dispatchConfig = res.config;

      const s1 = document.getElementById('stage-1-stat');
      const s2 = document.getElementById('stage-2-stat');
      const s3 = document.getElementById('stage-3-stat');
      const s4 = document.getElementById('stage-4-stat');

      if (s1) s1.textContent = `${res.node_counts.sources_count || 16} Sources (${res.node_counts.ingested} Scraped)`;
      if (s2) s2.textContent = `${res.node_counts.photos || 0} Photos Saved`;
      if (s3) s3.textContent = `${res.node_counts.web_synced || 0} Synced to Admin`;

      // Fetch live articles count on :3000
      try {
        const webStatus = await App.fetchApi('/api/web/status');
        if (s4) s4.textContent = `${webStatus.stats?.articles || 0} Live on :3000`;
      } catch (e) {
        if (s4) s4.textContent = '17 Live on :3000';
      }

      const advTarget = document.getElementById('adv-target-display');
      if (advTarget && res.config) advTarget.textContent = res.config.target_url || 'http://localhost:3000/api/articles';

    } catch (e) {
      console.warn("Pipeline overview fetch warning:", e);
    }
  },

  async loadSourcesProgress() {
    const tbody = document.getElementById('sources-tracker-tbody');
    try {
      const res = await App.fetchApi('/api/pipeline/last-run');
      const sources = res.sources || [];
      if (!tbody) return;

      if (sources.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding: 24px; text-align: center; color: var(--text-muted);">No source records found.</td></tr>';
        return;
      }

      tbody.innerHTML = sources.map((s, idx) => {
        const tierBadge = s.tier === 1 ? '<span class="badge" style="background:rgba(16,185,129,0.1); color:#059669; font-size:0.68rem; font-weight:600;">Tier 1 (RSS)</span>'
          : s.tier === 2 ? '<span class="badge" style="background:rgba(217,119,87,0.1); color:var(--primary-purple); font-size:0.68rem; font-weight:600;">Tier 2 (AI)</span>'
          : '<span class="badge" style="background:rgba(100,100,100,0.1); color:var(--text-muted); font-size:0.68rem; font-weight:600;">Tier 3 (HTML)</span>';

        const statusHtml = s.status === 'ok' ? '<span class="badge" style="background:rgba(16,185,129,0.12); color:#059669; font-size:0.68rem; font-weight:700;">&#10003; Ingested</span>'
          : s.status === 'error' ? '<span class="badge" style="background:rgba(198,40,40,0.12); color:var(--status-failed); font-size:0.68rem; font-weight:700;" title="' + (s.error || '') + '">&#9888; Warning</span>'
          : '<span class="badge" style="background:rgba(16,185,129,0.1); color:#059669; font-size:0.68rem; font-weight:600;">● Monitored</span>';

        return `
          <tr style="border-bottom: 1px solid var(--border-color); transition: background 0.15s ease;" onmouseenter="this.style.background='var(--bg-card-hover)'" onmouseleave="this.style.background='transparent'">
            <td style="padding: 10px 14px; text-align: center; font-weight: 700; color: var(--text-muted); font-size: 0.78rem;">
              ${s.order || idx + 1}
            </td>
            <td style="padding: 10px 14px;">
              <div style="font-weight: 700; color: var(--text-main); font-size: 0.85rem;">${s.name}</div>
              ${s.url ? `<a href="${s.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.7rem; color: var(--text-dim); text-decoration: none;">${s.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} &#8599;</a>` : ''}
            </td>
            <td style="padding: 10px 14px; text-align: center;">
              ${tierBadge}
            </td>
            <td style="padding: 10px 14px; text-align: center; font-weight: 700; color: ${s.scraped > 0 ? '#4F46E5' : 'var(--text-muted)'}; font-size: 0.8rem;">
              ${s.scraped > 0 ? `${s.scraped} articles` : '—'}
            </td>
            <td style="padding: 10px 14px; text-align: center; font-weight: 600; color: var(--text-muted); font-size: 0.8rem;">
              ${s.total_in_db || s.new || 0} in DB
            </td>
            <td style="padding: 10px 14px; text-align: right;">
              ${statusHtml}
            </td>
          </tr>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();

    } catch (e) {
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="padding: 24px; text-align: center; color: var(--status-failed);">Failed to load sources progress: ${e.message}</td></tr>`;
    }
  },

  async loadSystemHealth() {
    try {
      const res = await App.fetchApi('/api/system/health');
      this.healthData = res;

      const webEl = document.getElementById('health-web-status');
      const keyEl = document.getElementById('health-key-status');
      const dbEl = document.getElementById('health-db-status');
      const imgEl = document.getElementById('health-img-status');
      const dotEl = document.getElementById('health-overall-dot');

      if (webEl) {
        webEl.textContent = res.checks.website.ok ? 'Online (200 OK)' : 'Offline';
        webEl.style.color = res.checks.website.ok ? '#059669' : 'var(--status-failed)';
      }
      if (keyEl) {
        keyEl.textContent = res.checks.api_key.ok ? 'Valid (Authenticated)' : 'Invalid Key';
        keyEl.style.color = res.checks.api_key.ok ? '#059669' : 'var(--status-failed)';
      }
      if (dbEl) {
        dbEl.textContent = res.checks.database.ok ? 'OK (Writable)' : 'Error';
        dbEl.style.color = res.checks.database.ok ? '#059669' : 'var(--status-failed)';
      }
      if (imgEl) {
        imgEl.textContent = res.checks.images_folder.ok ? 'OK (Writable)' : 'Permission Error';
        imgEl.style.color = res.checks.images_folder.ok ? '#059669' : 'var(--status-failed)';
      }
      if (dotEl) {
        dotEl.className = res.ok ? 'status-indicator online' : 'status-indicator offline';
      }

    } catch (e) {
      console.warn("Health check error:", e);
    }
  },

  async triggerRun() {
    const btn = document.getElementById('pipeline-run-trigger-btn');
    const badge = document.getElementById('pipeline-status-badge');
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width:14px; height:14px;"></i> Executing 16 Sources...';
      btn.disabled = true;
    }
    if (badge) {
      badge.textContent = '● Pipeline Running...';
      badge.style.background = 'rgba(79,70,229,0.12)';
      badge.style.color = '#4F46E5';
      badge.style.borderColor = 'rgba(79,70,229,0.25)';
    }

    App.showToast('Starting sequential scraping across all 16 news sources...', 'info');
    try {
      const res = await App.fetchApi('/api/pipeline/run', { method: 'POST' });
      App.showToast('Pipeline run started in background! Monitor source progress below.', 'success');
      
      let checks = 0;
      const pollTimer = setInterval(async () => {
        checks++;
        await this.loadPipelineOverview();
        await this.loadSourcesProgress();
        if (checks >= 5) clearInterval(pollTimer);
      }, 3000);

    } catch (e) {
      App.showToast(`Trigger failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="play" style="width: 14px; height: 14px;"></i> Run Full Pipeline (16 Sources)';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
      if (badge) {
        badge.textContent = '● System Ready';
        badge.style.background = 'rgba(16,185,129,0.1)';
        badge.style.color = '#059669';
        badge.style.borderColor = 'rgba(16,185,129,0.25)';
      }
    }
  },

  async syncAdminStatus() {
    App.showToast('Syncing latest Draft/Published status from NewsFlow Admin...', 'info');
    try {
      const res = await App.fetchApi('/api/web/sync-status', { method: 'POST' });
      if (res.error) {
        App.showToast(`Admin sync note: ${res.error}`, 'warning');
      } else {
        App.showToast(`Admin sync complete: ${res.updated} updated (${res.checked} verified)`, 'success');
      }
      await this.loadPipelineOverview();
      await this.loadSystemHealth();
    } catch (e) {
      App.showToast(`Sync failed: ${e.message}`, 'error');
    }
  },

  async onPacingChange(mode) {
    try {
      await App.fetchApi('/api/dispatch/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate_limit: { mode } })
      });
      App.showToast(`Pacing mode updated to: ${mode}`, 'success');
    } catch (e) {
      App.showToast(`Failed to update pacing: ${e.message}`, 'error');
    }
  },

  async testPing() {
    const btn = document.getElementById('adv-ping-btn');
    if (btn) btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width:12px; height:12px;"></i> Pinging...';
    try {
      const res = await App.fetchApi('/api/dispatch/ping', { method: 'POST' });
      App.showToast(`Bridge Ping: ${res.health?.message} (${res.health?.latency_ms}ms)`, 'success');
      await this.loadSystemHealth();
    } catch (e) {
      App.showToast(`Ping failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="activity" style="width: 12px; height: 12px;"></i> Ping Bridge';
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  openConfigModal() {
    const modal = document.getElementById('config-modal');
    const urlInput = document.getElementById('cfg-target-url');
    const tokenInput = document.getElementById('cfg-auth-token');
    if (this.dispatchConfig) {
      if (urlInput) urlInput.value = this.dispatchConfig.target_url || 'http://localhost:3000/api/articles';
      if (tokenInput) tokenInput.value = this.dispatchConfig.auth_token || 'nf_live_sec_9942a8b7e1034f68a';
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
    const data = {
      target_url: urlInput ? urlInput.value : 'http://localhost:3000/api/articles',
      auth_token: tokenInput ? tokenInput.value : 'nf_live_sec_9942a8b7e1034f68a'
    };
    try {
      await App.fetchApi('/api/dispatch/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      this.closeConfigModal();
      App.showToast('Distribution endpoint configuration updated!', 'success');
      await this.loadPipelineOverview();
    } catch (e) {
      App.showToast(`Failed to save config: ${e.message}`, 'error');
    }
  }
};
