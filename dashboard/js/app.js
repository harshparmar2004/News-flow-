/**
 * NewsFlow Dashboard — Core SPA Application JS
 * Handles routing, state management, API communication, and UI events.
 */

const App = {
  currentPage: 'dashboard',
  pipelineRunning: false,
  
  init() {
    console.log("🚀 NewsFlow Dashboard Initializing...");
    
    // Bind navigation clicks
    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        this.navigateTo(page);
      });
    });

    // Sidebar toggle handler
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.getElementById('app-sidebar');
    if (sidebarToggleBtn && sidebar) {
      sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed-mode');
      });
    }

    // Handle hash change in URL
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      this.navigateTo(hash, false);
    });

    // Run / Stop Pipeline button handler
    const runBtn = document.getElementById('run-pipeline-btn');
    if (runBtn) {
      runBtn.addEventListener('click', () => this.handlePipelineButtonClick());
    }

    // Auto-Pilot toggle handler
    const apChk = document.getElementById('autopilot-toggle-chk');
    if (apChk) {
      apChk.addEventListener('change', (e) => this.toggleAutoPilot(e.target.checked));
      this.checkAutoPilotStatus();
    }

    // Modal close handlers
    const closeBtn = document.getElementById('modal-close-btn');
    const backdrop = document.querySelector('.modal-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
    if (backdrop) backdrop.addEventListener('click', () => this.closeModal());

    const addSourceCloseBtn = document.getElementById('add-source-close-btn');
    if (addSourceCloseBtn) addSourceCloseBtn.addEventListener('click', () => {
      const modal = document.getElementById('add-source-modal');
      if (modal) modal.classList.remove('active');
    });

    const submitAddSourceBtn = document.getElementById('submit-add-source-btn');
    if (submitAddSourceBtn) {
      submitAddSourceBtn.addEventListener('click', () => this.submitAddSource());
    }

    // Initial page load
    const initialPage = window.location.hash.replace('#', '') || 'dashboard';
    this.navigateTo(initialPage);

    // Start background status polling
    this.checkPipelineStatus();
    setInterval(() => this.checkPipelineStatus(), 4000);
  },

  async handlePipelineButtonClick() {
    if (this.pipelineRunning) {
      await this.stopPipeline();
    } else {
      await this.triggerPipeline();
    }
  },

  async toggleAutoPilot(enabled) {
    const label = document.getElementById('autopilot-toggle-label');
    try {
      const res = await this.fetchApi('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, interval_minutes: 15 })
      });

      if (label) label.textContent = enabled ? 'Auto-Pilot: ON (15m)' : 'Auto-Pilot: OFF';
      this.showToast(res.message, enabled ? 'success' : 'info');
    } catch (e) {
      const chk = document.getElementById('autopilot-toggle-chk');
      if (chk) chk.checked = !enabled;
    }
  },

  async checkAutoPilotStatus() {
    try {
      const res = await fetch('/api/autopilot');
      if (!res.ok) return;
      const data = await res.json();
      const chk = document.getElementById('autopilot-toggle-chk');
      const label = document.getElementById('autopilot-toggle-label');
      if (chk) chk.checked = data.enabled;
      if (label) label.textContent = data.enabled ? 'Auto-Pilot: ON (15m)' : 'Auto-Pilot: OFF';
    } catch (e) {}
  },

  async submitAddSource() {
    const url = document.getElementById('new-source-url').value.trim();
    const name = document.getElementById('new-source-name').value.trim();
    const category = document.getElementById('new-source-category').value.trim();
    const subreddit = document.getElementById('new-source-subreddit').value.trim();
    const tier = document.getElementById('new-source-tier').value;
    const delay = document.getElementById('new-source-delay').value;

    if (!url) {
      this.showToast('Please enter a website URL', 'warning');
      return;
    }

    try {
      const res = await this.fetchApi('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, url, category, subreddit, tier: parseInt(tier), delay_seconds: parseInt(delay)
        })
      });

      this.showToast(res.message, 'success');
      const modal = document.getElementById('add-source-modal');
      if (modal) modal.classList.remove('active');

      if (this.currentPage === 'sources' && typeof SourcesPage !== 'undefined') {
        SourcesPage.render(document.getElementById('page-container'));
      }
    } catch (err) {
      this.showToast(`Failed to add source: ${err.message}`, 'error');
    }
  },

  navigateTo(page, updateHash = true) {
    if (!['scraped', 'space', 'dashboard', 'articles', 'sources', 'ranking', 'queue', 'media', 'notes', 'pipeline', 'logs', 'settings'].includes(page)) {
      page = 'dashboard';
    }

    this.currentPage = page;
    if (updateHash) {
      window.location.hash = page;
    }

    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-page') === page);
    });

    const pageTitles = {
      scraped: { title: 'Scraped News Data Vault', subtitle: 'View raw content, extracted headlines, and text scraped from monitored web sources' },
      space: { title: '🌌 3D Interactive Agentic Space', subtitle: 'Observe news scraping, AI ranking, authentic photo extraction, and App 2 transfer in 3D' },
      dashboard: { title: 'Dashboard Overview', subtitle: 'Real-time automation analytics, authentic photo extraction, and news ranking status' },
      sources: { title: 'News Sources & Web Links', subtitle: 'Manage news source links, RSS feeds, and trigger automated crawlers' },
      ranking: { title: 'NewsFlow Web Publishing Desk', subtitle: 'Publish all scraped news articles line-by-line to NewsFlow Web (localhost:3000) with authentic photos. No ranking gates.' },
      media: { title: 'Visual Studio', subtitle: 'Editorial photo and graphic management' },
      notes: { title: 'Tech Notes Vault', subtitle: 'Structured technical documentation and post archives' },
      articles: { title: 'Refined Content Vault & Calendar Archive', subtitle: 'Database of refined news, ranking scores, and authentic source editorial photos' },
      pipeline: { title: 'Pipeline Workflow & API Distribution Engine', subtitle: 'Sequential 16-Source Scraping ➔ Authentic Editorial Photos ➔ NewsFlow Web & Admin Sync (:3000) ➔ Outbound API Webhooks' },
      logs: { title: 'System Logs Stream', subtitle: 'Live terminal stream from pipeline.log' },
      settings: { title: 'API Keys & Configuration', subtitle: 'Manage Groq, OpenAI, Gemini, and research pipeline credentials' }
    };

    const header = pageTitles[page] || pageTitles.dashboard;
    document.getElementById('page-title').textContent = header.title;
    document.getElementById('page-subtitle').textContent = header.subtitle;

    const container = document.getElementById('page-container');
    container.innerHTML = '<div class="glass-card"><p>Loading page content...</p></div>';

    if (page === 'scraped' && typeof ScrapedPage !== 'undefined') {
      ScrapedPage.render(container);
    } else if (page === 'space' && typeof SpacePage !== 'undefined') {
      SpacePage.render(container);
    } else if (page === 'dashboard' && typeof DashboardPage !== 'undefined') {
      DashboardPage.render(container);
    } else if (page === 'articles' && typeof ArticlesPage !== 'undefined') {
      ArticlesPage.render(container);
    } else if (page === 'sources' && typeof SourcesPage !== 'undefined') {
      SourcesPage.render(container);
    } else if (page === 'ranking' && typeof RankingPage !== 'undefined') {
      RankingPage.render(container);
    } else if (page === 'queue' && typeof QueuePage !== 'undefined') {
      QueuePage.render(container);
    } else if (page === 'media' && typeof MediaPage !== 'undefined') {
      MediaPage.render(container);
    } else if (page === 'notes' && typeof NotesStudioPage !== 'undefined') {
      NotesStudioPage.render(container);
    } else if (page === 'pipeline' && typeof PipelinePage !== 'undefined') {
      PipelinePage.render(container);
    } else if (page === 'logs' && typeof LogsPage !== 'undefined') {
      LogsPage.render(container);
    } else if (page === 'settings' && typeof SettingsPage !== 'undefined') {
      SettingsPage.render(container);
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  async fetchApi(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`API Error (${url}):`, err);
      this.showToast(`API Request Failed: ${err.message}`, 'error');
      throw err;
    }
  },

  async triggerPipeline() {
    if (this.pipelineRunning) {
      return this.stopPipeline();
    }

    try {
      const res = await this.fetchApi('/api/pipeline/run', { method: 'POST' });
      this.showToast(res.message || 'Pipeline started!', 'success');
      this.pipelineRunning = true;
      this.updatePipelineButtonState();
      this.checkPipelineStatus();
    } catch (err) {
      this.showToast('Failed to trigger pipeline', 'error');
    }
  },

  async stopPipeline() {
    try {
      const res = await fetch('/api/pipeline/stop', { method: 'POST' });
      if (res.status === 405 || res.status === 404) {
        this.showToast('Server update needed: Please restart "python dashboard.py" in your terminal window once!', 'warning');
        this.pipelineRunning = false;
        this.updatePipelineButtonState();
        return;
      }
      const data = await res.json();
      this.showToast(data.message || 'Pipeline execution stopped!', 'info');
      this.pipelineRunning = false;
      this.updatePipelineButtonState();
    } catch (err) {
      this.showToast(`Stop request: ${err.message}`, 'error');
      this.pipelineRunning = false;
      this.updatePipelineButtonState();
    }
  },

  updatePipelineButtonState() {
    const runBtn = document.getElementById('run-pipeline-btn');
    if (!runBtn) return;

    if (this.pipelineRunning) {
      runBtn.innerHTML = '<i data-lucide="square"></i> 🛑 Stop Pipeline';
      runBtn.style.background = '#c62828';
      runBtn.style.color = '#ffffff';
    } else {
      runBtn.innerHTML = '<i data-lucide="play"></i> Run Pipeline';
      runBtn.style.background = 'var(--primary-purple)';
      runBtn.style.color = '#ffffff';
    }
    if (window.lucide) window.lucide.createIcons();
  },

  async checkPipelineStatus() {
    try {
      const res = await fetch('/api/pipeline/status');
      if (res.ok) {
        const data = await res.json();
        
        const dot = document.querySelector('.dot-pulse');
        const text = document.getElementById('pipeline-status-text');

        if (data.is_running) {
          this.pipelineRunning = true;
          if (dot) dot.className = 'dot-pulse running';
          if (text) text.textContent = 'Pipeline Running...';
          this.updatePipelineButtonState();
        } else {
          if (this.pipelineRunning) {
            this.showToast('Pipeline run completed!', 'success');
            this.navigateTo(this.currentPage, false);
          }
          this.pipelineRunning = false;
          if (dot) dot.className = 'dot-pulse green';
          if (text) text.textContent = data.last_run ? `Last run: ${new Date(data.last_run).toLocaleTimeString()}` : 'Idle (Ready)';
          this.updatePipelineButtonState();
        }
      }

      // Live update top header overview metrics
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        const summary = statsData.summary || {};

        const mSources = document.getElementById('top-metric-sources');
        // Update sidebar badges dynamically
        const bSources = document.getElementById('nav-badge-sources');
        const bScraped = document.getElementById('nav-badge-scraped');
        const bArticles = document.getElementById('nav-count-articles');

        if (bSources) bSources.textContent = summary.monitored_sources || 16;
        if (bScraped) bScraped.textContent = summary.total || 0;
        if (bArticles) bArticles.textContent = summary.ready || 0;
      }
    } catch (e) {
      console.warn("Status check failed", e);
    }
  },

  formatTimestamp(dateStr) {
    if (!dateStr) return 'N/A';
    try {
      let formattedStr = dateStr;
      if (typeof dateStr === 'string' && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
        formattedStr += 'Z';
      }
      const d = new Date(formattedStr);
      if (isNaN(d.getTime())) return dateStr;

      const datePart = d.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const timePart = d.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      return `${datePart} at ${timePart} IST`;
    } catch (e) {
      return dateStr;
    }
  },

  async openArticleModal(articleId) {
    const modal = document.getElementById('article-modal');
    const body = document.getElementById('modal-article-body');
    const title = document.getElementById('modal-article-title');
    const meta = document.getElementById('modal-article-meta');
    const badge = document.getElementById('modal-status-badge');

    body.innerHTML = '<p style="padding: 40px; text-align: center; color: var(--text-muted);">Loading article...</p>';
    modal.classList.add('active');

    try {
      const data = await this.fetchApi(`/api/articles/${articleId}`);
      this.currentModalArticle = data;

      title.textContent = data.ai_headline || data.title;
      meta.textContent = `${data.source}  ·  ${this.formatTimestamp(data.scraped_at)}  ·  ${data.category || 'General'}`;

      const currentStatus = data.editorial_status || data.status || 'scraped';
      badge.textContent = currentStatus.replace('_', ' ').toUpperCase();
      badge.className = `badge badge-${currentStatus.toLowerCase() === 'approved' ? 'ready' : currentStatus.toLowerCase()}`;

      const bodyContent = data.final_body || data.body || '';
      const wordCount = bodyContent.trim() ? bodyContent.trim().split(/\s+/).length : 0;

      let html = `
        <!-- Info Row -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding-bottom: 14px; border-bottom: 1px solid var(--border-color); margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="source-pill">${data.source}</span>
            ${data.web_posted
              ? '<span class="badge" style="background: rgba(46,125,50,0.12); color: #2e7d32; font-size: 0.72rem; font-weight: 700;">✓ In NewsFlow</span>'
              : '<span class="badge" style="background: rgba(217,119,87,0.1); color: var(--primary-purple); font-size: 0.72rem;">Pending Sync</span>'
            }
          </div>
          <a href="${data.url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 4px 11px; font-size: 0.78rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
            <i data-lucide="external-link" style="width: 12px; height: 12px;"></i> Source ↗
          </a>
        </div>

        <!-- Editorial Photo -->
        ${(data.scraped_image_path || data.scraped_image_url) ? `
          <div style="margin-bottom: 16px; border-radius: 10px; overflow: hidden; border: 1px solid var(--border-color); max-height: 220px; text-align: center; background: var(--bg-surface);">
            <img src="${data.scraped_image_path || data.scraped_image_url}" alt="Photo" style="width: 100%; max-height: 220px; object-fit: cover;" onerror="this.parentElement.style.display='none'">
          </div>
        ` : ''}

        <!-- Headline -->
        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 0.74rem; font-weight: 600; color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Headline</label>
          <input type="text" id="modal-edit-headline" value="${(data.ai_headline || data.title || '').replace(/"/g, '&quot;')}"
            style="width: 100%; font-size: 1rem; font-weight: 700; font-family: var(--font-serif); padding: 9px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main);" />
        </div>

        <!-- Summary & Key Points -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Summary</label>
              <button class="btn btn-primary btn-glow" id="modal-gen-headline-btn" onclick="App.generateArticleAiHeadline(${data.id})" style="padding: 3px 8px; font-size: 0.7rem; display: flex; align-items: center; gap: 3px;">
                <i data-lucide="sparkles" style="width: 10px; height: 10px;"></i> AI Generate
              </button>
            </div>
            <textarea id="modal-edit-summary" rows="3" placeholder="Executive summary..."
              style="width: 100%; font-size: 0.83rem; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main); line-height: 1.5; resize: vertical; font-family: inherit;">${data.ai_summary || ''}</textarea>
          </div>
          <div>
            <label style="display: block; font-size: 0.74rem; font-weight: 600; color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Key Points</label>
            <textarea id="modal-edit-keypoints" rows="3" placeholder="• Point 1&#10;• Point 2&#10;• Point 3"
              style="width: 100%; font-size: 0.82rem; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main); line-height: 1.45; resize: vertical; font-family: var(--font-mono);">${data.ai_key_points || ''}</textarea>
          </div>
        </div>

        <!-- Article Body -->
        <div style="margin-bottom: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
            <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Article Body</label>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span id="modal-text-stats" style="font-size: 0.72rem; color: var(--text-muted);">${wordCount} words</span>
              <button class="btn btn-secondary" onclick="App.copyModalArticleText()" style="padding: 3px 8px; font-size: 0.7rem; display: flex; align-items: center; gap: 3px;">
                <i data-lucide="copy" style="width: 11px; height: 11px;"></i> Copy
              </button>
              <button class="btn btn-secondary" onclick="App.resetModalArticleBody()" style="padding: 3px 8px; font-size: 0.7rem; display: flex; align-items: center; gap: 3px;">
                <i data-lucide="rotate-ccw" style="width: 11px; height: 11px;"></i> Reset
              </button>
            </div>
          </div>
          <textarea id="modal-edit-body" rows="10" oninput="App.updateModalStats(this.value)"
            style="width: 100%; font-size: 0.86rem; line-height: 1.65; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main); resize: vertical; font-family: inherit;">${bodyContent}</textarea>
        </div>

        <!-- Footer Actions -->
        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border-color); flex-wrap: wrap;">
          <button class="btn btn-secondary" onclick="App.closeModal()" style="padding: 7px 14px; font-size: 0.82rem;">Close</button>
          ${data.web_posted && data.web_slug ? `
            <a href="http://localhost:3000/article/${data.web_slug}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 7px 14px; font-size: 0.82rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; color: #2e7d32; font-weight: 700;">
              🌐 View on Web ↗
            </a>
          ` : ''}
          <a href="http://localhost:3000/admin" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 7px 14px; font-size: 0.82rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
            🔑 Admin Desk
          </a>
          <button class="btn btn-secondary" id="modal-save-btn" onclick="App.saveArticleEditorial(${data.id})" style="padding: 7px 16px; font-size: 0.82rem; display: flex; align-items: center; gap: 5px;">
            <i data-lucide="save" style="width: 13px; height: 13px;"></i> Save
          </button>
          <button class="btn btn-secondary" onclick="App.uploadArticleToWeb(${data.id}, 'published')" style="padding: 7px 14px; font-size: 0.82rem; color: #2e7d32; font-weight: 700; display: flex; align-items: center; gap: 5px;">
            ⚡ Publish Live
          </button>
          <button class="btn btn-primary btn-glow" id="modal-web-upload-btn" onclick="App.uploadArticleToWeb(${data.id}, 'draft')" style="padding: 7px 16px; font-size: 0.82rem; display: flex; align-items: center; gap: 5px;">
            <i data-lucide="shield-check" style="width: 13px; height: 13px;"></i> Send to Admin
          </button>
        </div>
      `;

      body.innerHTML = html;
      if (window.lucide) window.lucide.createIcons();
    } catch (err) {
      body.innerHTML = `<p style="padding: 20px; text-align: center; color: var(--status-failed);">Failed to load article: ${err.message}</p>`;
    }
  },

  async generateArticleAiHeadline(articleId) {
    const btn = document.getElementById('modal-gen-headline-btn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Generating...';
      btn.disabled = true;
    }
    try {
      this.showToast('Generating AI Headline and takeaways from raw article text...', 'info');
      const res = await this.fetchApi(`/api/articles/${articleId}/generate-headline`, { method: 'POST' });
      if (res.success) {
        const headlineInput = document.getElementById('modal-edit-headline');
        const summaryInput = document.getElementById('modal-edit-summary');
        const keypointsInput = document.getElementById('modal-edit-keypoints');
        if (headlineInput && res.headline) headlineInput.value = res.headline;
        if (summaryInput && res.summary) summaryInput.value = res.summary;
        if (keypointsInput && res.key_points) {
          keypointsInput.value = Array.isArray(res.key_points) ? res.key_points.map(p => `• ${p}`).join('\n') : res.key_points;
        }
        this.showToast('AI headline & packaging generated! Click "Save Article Changes" to keep.', 'success');
      }
    } catch (e) {
      this.showToast(`Generation failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="sparkles" style="width: 14px; height: 14px;"></i> Generate AI Headline & Takeaways';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  async saveArticleEditorial(articleId) {
    const btn = document.getElementById('modal-save-btn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Saving...';
      btn.disabled = true;
    }
    try {
      const headlineInput = document.getElementById('modal-edit-headline');
      const summaryInput = document.getElementById('modal-edit-summary');
      const keypointsInput = document.getElementById('modal-edit-keypoints');
      const bodyInput = document.getElementById('modal-edit-body');

      const payload = {
        ai_headline: headlineInput ? headlineInput.value.trim() : null,
        title: headlineInput ? headlineInput.value.trim() : null,
        ai_summary: summaryInput ? summaryInput.value.trim() : null,
        ai_key_points: keypointsInput ? keypointsInput.value.trim() : null,
        final_body: bodyInput ? bodyInput.value.trim() : null,
        editorial_status: 'approved',
        status: 'ready'
      };

      const res = await this.fetchApi(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      this.showToast(`Article #${articleId} saved successfully to database!`, 'success');
      
      const badge = document.getElementById('modal-status-badge');
      if (badge) {
        badge.textContent = 'APPROVED / READY';
        badge.className = 'badge badge-ready';
      }

      if (window.location.hash === '#ranking' && typeof RankingPage !== 'undefined') {
        RankingPage.loadData();
      } else if (window.location.hash === '#scraped' && typeof ScrapedPage !== 'undefined') {
        ScrapedPage.loadData();
      }
    } catch (e) {
      this.showToast(`Failed to save article: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="save"></i> 💾 Save Article Changes';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  async uploadArticleToWeb(articleId, status = 'draft') {
    const btn = document.getElementById('modal-web-upload-btn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Uploading...';
      btn.disabled = true;
    }
    try {
      const targetLabel = status === 'draft' ? 'NewsFlow Admin (Draft)' : 'NewsFlow Web (Live)';
      // Save changes first
      await this.saveArticleEditorial(articleId);
      this.showToast(`Sending story #${articleId} to ${targetLabel}...`, 'info');
      const res = await this.fetchApi(`/api/web/upload/${articleId}?status=${status}`, { method: 'POST' });
      if (res.success) {
        this.showToast(`Story #${articleId} sent to ${targetLabel}!`, 'success');
        await this.openArticleModal(articleId); // Re-open to refresh badge and link
        if (typeof RankingPage !== 'undefined' && RankingPage.loadData) {
          RankingPage.loadData();
        }
      }
    } catch (e) {
      this.showToast(`Web upload failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="shield-check"></i> 📋 Send to Admin (Draft)';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  async dispatchArticleFromModal(articleId) {
    this.showToast(`Dispatching article #${articleId} to connected App 2 Gateway...`, 'info');
    try {
      const res = await this.fetchApi(`/api/dispatch/send/${articleId}`, { method: 'POST' });
      if (res.success) {
        this.showToast(`Article #${articleId} successfully transmitted to App 2!`, 'success');
      } else {
        this.showToast(`Dispatch note: ${res.error || 'Check partner app connection'}`, 'warning');
      }
    } catch (e) {
      this.showToast(`Dispatch error: ${e.message}`, 'error');
    }
  },

  updateModalStats(text) {
    const statsEl = document.getElementById('modal-text-stats');
    if (statsEl) {
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      statsEl.textContent = `${words} words · ${text.length} chars`;
    }
  },

  copyModalArticleText() {
    const bodyInput = document.getElementById('modal-edit-body');
    if (bodyInput) {
      navigator.clipboard.writeText(bodyInput.value);
      this.showToast('Article text copied to clipboard!', 'info');
    }
  },

  resetModalArticleBody() {
    if (this.currentModalArticle && this.currentModalArticle.body) {
      const bodyInput = document.getElementById('modal-edit-body');
      if (bodyInput) {
        bodyInput.value = this.currentModalArticle.body;
        this.updateModalStats(bodyInput.value);
        this.showToast('Reset article text to original raw extracted text.', 'info');
      }
    }
  },

  closeModal() {
    const modal = document.getElementById('article-modal');
    if (modal) modal.classList.remove('active');
  },

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; z-index: 9999;
      background: var(--bg-card); border: 1px solid var(--border-color);
      padding: 12px 20px; border-radius: 8px; font-size: 0.85rem; font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s ease;
      display: flex; align-items: center; gap: 8px; color: var(--text-main);
    `;

    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-triangle' : 'info';
    toast.innerHTML = `<i data-lucide="${icon}" style="width: 16px;"></i> ${message}`;

    document.body.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// Initialize App on DOM load
document.addEventListener('DOMContentLoaded', () => App.init());
