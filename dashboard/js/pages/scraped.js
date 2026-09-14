/**
 * Dedicated Raw Scraped Data Vault Page Renderer (#scraped)
 * Displays all raw website data ingested from web scraper links in dedicated card boxes.
 */
const ScrapedPage = {
  articles: [],
  currentRunScope: 'latest', // Default to latest run to avoid scroll clutter

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Unified Compact Header & Toolbar -->
        <div class="glass-card" style="padding: 14px 18px; display: flex; flex-direction: column; gap: 12px; background: #ffffff; border-radius: 14px; border: 1px solid var(--border-color);">
          <!-- Top Row: Title + Action Buttons -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <h3 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: #2B2622;">📦 Raw Scraped Data Vault</h3>
              <span style="font-size: 0.76rem; font-weight: 700; color: #D97B3F; background: #FCEEE3; padding: 3px 10px; border-radius: 6px;">
                <strong id="raw-total-count">0</strong> Raw Items
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-secondary" onclick="ScrapedPage.loadScrapedData()" style="padding: 5px 12px; font-size: 0.78rem;">
                <i data-lucide="refresh-cw"></i> Refresh
              </button>
              <button class="btn btn-primary btn-glow" onclick="App.triggerPipeline()" style="padding: 5px 14px; font-size: 0.78rem;">
                <i data-lucide="play"></i> Run Web Scraper Engine
              </button>
            </div>
          </div>

          <!-- Bottom Row: Filter Scope Buttons + Search -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding-top: 10px; border-top: 1px solid #EBE4DA;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-right: 4px;">Run Scope:</span>
              <button id="scope-latest-btn" class="btn ${this.currentRunScope === 'latest' ? 'btn-primary' : 'btn-secondary'}" style="padding: 5px 12px; font-size: 0.78rem; border-radius: 8px;" onclick="ScrapedPage.setRunScope('latest')">
                🔥 Latest Run
              </button>
              <button id="scope-last100-btn" class="btn ${this.currentRunScope === 'last100' ? 'btn-primary' : 'btn-secondary'}" style="padding: 5px 12px; font-size: 0.78rem; border-radius: 8px;" onclick="ScrapedPage.setRunScope('last100')">
                ⚡ Last 100 Scraped
              </button>
              <button id="scope-all-btn" class="btn ${this.currentRunScope === 'all' ? 'btn-primary' : 'btn-secondary'}" style="padding: 5px 12px; font-size: 0.78rem; border-radius: 8px;" onclick="ScrapedPage.setRunScope('all')">
                📚 All News
              </button>
            </div>

            <input type="text" id="raw-search-input" placeholder="Search raw scraped text..." class="filter-select" style="padding: 5px 12px; font-size: 0.8rem; width: 220px; border-radius: 8px;" oninput="ScrapedPage.filterRawData(this.value)" />
          </div>
        </div>

        <!-- Raw Scraped Data Boxes Grid (Compact 290px Min Width) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px;" id="raw-scraped-boxes-grid">
          <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 40px;"><p>Loading raw scraped web content...</p></div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    await this.loadScrapedData();
  },

  async setRunScope(scope) {
    this.currentRunScope = scope;
    ['latest', 'last100', 'all'].forEach(s => {
      const btn = document.getElementById(`scope-${s}-btn`);
      if (btn) {
        btn.className = `btn ${s === scope ? 'btn-primary' : 'btn-secondary'}`;
      }
    });
    await this.loadScrapedData();
  },

  async loadScrapedData() {
    const grid = document.getElementById('raw-scraped-boxes-grid');
    const countLabel = document.getElementById('raw-total-count');
    if (!grid) return;

    try {
      const data = await App.fetchApi(`/api/articles?limit=100&run_scope=${this.currentRunScope}`);
      this.articles = data.articles || [];

      if (countLabel) countLabel.textContent = this.articles.length;

      this.renderBoxes(this.articles);

    } catch (e) {
      console.error("Failed to load raw scraped data", e);
    }
  },

  filterRawData(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      this.renderBoxes(this.articles);
      return;
    }
    const filtered = this.articles.filter(a => 
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.source && a.source.toLowerCase().includes(q)) ||
      (a.url && a.url.toLowerCase().includes(q))
    );
    this.renderBoxes(filtered);
  },

  formatHeadline(title) {
    if (!title) return '';
    return title.replace(/(\$\d[\d,.]*|\b\d+%\b)/g, '<span style="color: #D97B3F; font-weight: 700;">$1</span>');
  },

  renderBoxes(items) {
    const grid = document.getElementById('raw-scraped-boxes-grid');
    if (!grid) return;

    if (!items || items.length === 0) {
      grid.innerHTML = '<div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 40px;"><p>No raw scraped data found. Click "Run Web Scraper Engine" to fetch live content.</p></div>';
      return;
    }

    grid.innerHTML = items.map(a => {
      const bodySnippet = a.body ? (a.body.length > 200 ? a.body.substring(0, 200) + '...' : a.body) : 'Raw web headline extracted.';
      const formattedTitle = this.formatHeadline(a.title);

      return `
        <div class="glass-card article-box-card" style="padding: 16px 18px; background: #ffffff; border-radius: 14px; border: 1px solid #E8E0D4; box-shadow: 0 2px 8px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
          
          <div>
            <!-- Header: Source Pill + Raw Badge -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span style="background: #231F1C; color: #ffffff; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; padding: 4px 10px; border-radius: 6px;">
                ${a.source || 'Web Source'}
              </span>
              <span style="font-size: 0.68rem; font-weight: 700; color: #8A8175; background: #F6F1EA; padding: 4px 8px; border-radius: 6px; text-transform: uppercase;">
                RAW ITEM #${a.id}
              </span>
            </div>

            <!-- Title -->
            <h4 style="font-family: var(--font-serif), Georgia, serif; font-size: 1.05rem; font-weight: 700; line-height: 1.35; color: #2B2622; margin-bottom: 10px;">
              <a href="${a.url}" target="_blank" style="color: inherit; text-decoration: none;">${formattedTitle}</a>
            </h4>

            <!-- Snippet Container Box -->
            <div style="background: #F7F2EC; border-radius: 10px; padding: 10px 12px; margin-bottom: 10px;">
              <p style="font-size: 0.8rem; color: #8A8175; line-height: 1.45; margin: 0; font-weight: 500;">
                ${bodySnippet}
              </p>
            </div>

            <!-- Divider -->
            <div style="border-top: 1px solid #EBE4DA; margin-bottom: 10px;"></div>

            <!-- Timestamp -->
            <div style="font-size: 0.78rem; color: #8A8175; font-weight: 500; margin-bottom: 12px;">
              ${App.formatTimestamp(a.scraped_at)}
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 2px;">
            <a href="${a.url}" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 4px; background: #ffffff; border: 1px solid #E2D9CC; color: #2B2622; font-weight: 700; font-size: 0.78rem; padding: 7px 10px; border-radius: 10px; text-decoration: none;">
              <span style="color: #D97B3F; font-size: 0.9rem;">🌐</span> Website Link <span style="font-size: 0.7rem; color: #8A8175;">↗</span>
            </a>
            <button onclick="App.openArticleModal(${a.id})" style="display: flex; align-items: center; justify-content: center; gap: 4px; background: #D97B3F; border: none; color: #ffffff; font-weight: 700; font-size: 0.78rem; padding: 7px 10px; border-radius: 10px; cursor: pointer;">
              <span style="font-size: 0.85rem;">🔍</span> Inspect Box
            </button>
          </div>

        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }
};
