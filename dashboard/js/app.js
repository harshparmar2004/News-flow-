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
    if (!['scraped', 'space', 'dashboard', 'articles', 'sources', 'ranking', 'queue', 'media', 'pipeline', 'logs', 'settings'].includes(page)) {
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
      scraped: { title: '1. Research Scraped Data Vault', subtitle: 'View raw content, extracted headlines, and text scraped from monitored web sources' },
      space: { title: '🌌 3D Interactive Agentic Space', subtitle: 'Observe research, refinement, and image generation progression in 3D' },
      dashboard: { title: 'Dashboard Overview', subtitle: 'Real-time research analytics, news ranking, and Nano Banana image studio' },
      sources: { title: 'News Sources & Web Links', subtitle: 'Manage news source links, RSS feeds, and trigger automated crawlers' },
      ranking: { title: '2. AI News Rank & Refine Engine', subtitle: 'Scores news from 1 to 100 based on custom AI parameters and refines raw text' },
      media: { title: '3. Studio (Nano Banana Graphic Engine)', subtitle: 'Custom visual prompt studio & 4-slide catalog carousel generator powered by Nano Banana 2' },
      articles: { title: 'Refined Content Vault & Calendar Archive', subtitle: 'Database of refined news, scores, and generated Nano Banana visual assets' },
      pipeline: { title: 'Research & Graphic Workflow Diagram', subtitle: 'Scrape ➔ Rank & Refine ➔ Nano Banana Image Generation workflow' },
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

    body.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-muted);">Loading article details...</p>';
    modal.classList.add('active');

    try {
      const data = await this.fetchApi(`/api/articles/${articleId}`);
      
      title.textContent = data.title;
      meta.textContent = `${data.source} • Scraped: ${this.formatTimestamp(data.scraped_at)} • Category: ${data.category || 'General'}`;
      badge.textContent = data.status ? data.status.toUpperCase() : 'SCRAPED';
      badge.className = `badge badge-${(data.status || 'scraped').toLowerCase()}`;

      const score = data.rank_score || 75;
      const scoreColor = score >= 80 ? '#2e7d32' : score >= 60 ? '#2b7bb9' : '#d97757';

      let html = `
        <!-- AI Rank Score & Research Evaluation -->
        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border-color); margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">AI Relevance & Virality Score</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: ${scoreColor}; margin-top: 2px;">
              ★ ${score} / 100
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">App 2 Integration Status</div>
            <span style="font-size: 0.78rem; font-weight: 700; color: #2e7d32; background: rgba(46, 125, 50, 0.12); padding: 4px 10px; border-radius: 6px; display: inline-block; margin-top: 3px;">
              📡 Ready for App 2 REST Transfer
            </span>
          </div>
        </div>

        ${data.rank_reason ? `
          <div style="background: rgba(43, 123, 185, 0.08); border: 1px solid rgba(43, 123, 185, 0.25); padding: 12px 16px; border-radius: 10px; margin-bottom: 16px;">
            <strong style="font-size: 0.78rem; color: #2b7bb9; text-transform: uppercase;">🧠 AI Ranking Evaluation:</strong>
            <p style="font-size: 0.84rem; color: var(--text-main); margin-top: 4px; line-height: 1.4;">${data.rank_reason}</p>
          </div>
        ` : ''}

        <!-- Nano Banana Generated 4-Slide Graphic Deck -->
        <div class="modal-section" style="margin-bottom: 16px;">
          <h4 style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; margin-bottom: 10px;">🎨 Nano Banana 4-Slide Graphic Deck</h4>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
            ${[1, 2, 3, 4].map(num => `
              <div style="border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; background: #ffffff; padding: 6px; text-align: center;">
                <div style="height: 90px; background: var(--bg-surface); border-radius: 6px; overflow: hidden; margin-bottom: 4px;">
                  <img src="/api/images/${data.id}_slide${num}.png" alt="Slide ${num}" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.src='/api/placeholder/400/220'" />
                </div>
                <span style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted);">Slide ${num}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Original Extracted Body Content -->
        <div class="modal-section">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <h4 style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700;">📄 Raw Extracted Web Text</h4>
            <a href="${data.url}" target="_blank" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.76rem; text-decoration: none;">
              🌐 Source Website Link ↗
            </a>
          </div>
          <div style="background: var(--bg-surface); padding: 14px 16px; border-radius: 10px; border: 1px solid var(--border-color); font-size: 0.85rem; color: var(--text-main); line-height: 1.5; max-height: 200px; overflow-y: auto;">
            ${data.body}
          </div>
        </div>
      `;

      body.innerHTML = html;
    } catch (err) {
      body.innerHTML = '<p class="error" style="padding: 20px; text-align: center; color: var(--status-failed);">Failed to load article details.</p>';
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
