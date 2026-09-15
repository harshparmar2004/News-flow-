/**
 * Content Wallet & Editorial Archive (articles.js)
 * High-density, professional editorial archive replacing the empty 35-cell calendar
 * and cramped boxes with a structured Master Table View and Executive Wide Cards View.
 */
const ArticlesPage = {
  currentPageNum: 1,
  limitPerPage: 15,
  currentStatus: 'all',
  currentRunScope: 'all',
  currentScoreTier: 'all',
  currentSource: 'all',
  currentSearch: '',
  selectedDate: 'all',
  viewMode: 'table', // 'table' (default) or 'cards'
  
  datesData: [],
  sourcesList: [],
  statsSummary: { total: 0, ready: 0, topTier: 0, withSlides: 0 },

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- 1. Top KPI Metrics Bar -->
        <div class="stats-grid" id="articles-kpi-bar" style="margin-bottom: 0;">
          <div class="glass-card stat-card total" style="padding: 14px 18px;">
            <div class="stat-icon" style="background: rgba(217, 119, 87, 0.12); color: var(--primary-purple);">
              <i data-lucide="layers" style="width: 20px; height: 20px;"></i>
            </div>
            <div class="stat-data">
              <h3 id="stat-total-articles">-</h3>
              <p>Total Scraped Assets</p>
            </div>
          </div>

          <div class="glass-card stat-card ready" style="padding: 14px 18px;">
            <div class="stat-icon" style="background: rgba(43, 123, 185, 0.12); color: var(--status-ready);">
              <i data-lucide="send" style="width: 20px; height: 20px;"></i>
            </div>
            <div class="stat-data">
              <h3 id="stat-ready-articles">-</h3>
              <p>Ready for Dispatch</p>
            </div>
          </div>

          <div class="glass-card stat-card" style="padding: 14px 18px;">
            <div class="stat-icon" style="background: rgba(46, 125, 50, 0.12); color: #2e7d32;">
              <i data-lucide="flame" style="width: 20px; height: 20px;"></i>
            </div>
            <div class="stat-data">
              <h3 id="stat-top-articles">-</h3>
              <p>Top Breakthroughs (85+)</p>
            </div>
          </div>

          <div class="glass-card stat-card" style="padding: 14px 18px;">
            <div class="stat-icon" style="background: rgba(193, 53, 132, 0.12); color: #c13584;">
              <i data-lucide="sparkles" style="width: 20px; height: 20px;"></i>
            </div>
            <div class="stat-data">
              <h3 id="stat-slides-articles">-</h3>
              <p>Visual 4-Slide Decks</p>
            </div>
          </div>
        </div>

        <!-- 2. Smart Scraped Batch Date Timeline Chips (Replaces Ugly Calendar) -->
        <div class="glass-card" style="padding: 14px 18px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 6px;">
                <i data-lucide="calendar" style="width: 16px; height: 16px; color: var(--primary-purple);"></i> Scraped Batches Timeline:
              </span>
              <span style="font-size: 0.76rem; color: var(--text-muted);" id="date-selection-status">All Batches</span>
            </div>

            <button class="btn btn-secondary" id="clear-date-filter-btn" style="padding: 3px 10px; font-size: 0.74rem; display: none;">
              ✖ Clear Date Filter
            </button>
          </div>

          <div id="date-chips-container" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: thin;">
            <button class="date-filter-chip active" data-date="all" style="flex-shrink: 0; padding: 6px 14px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; cursor: pointer; border: 1px solid var(--primary-purple); background: var(--primary-purple); color: #fff; transition: all 0.15s ease;">
              All Dates (<span id="all-dates-count">...</span>)
            </button>
            <span style="font-size: 0.78rem; color: var(--text-muted); align-self: center;">Loading scraped batches...</span>
          </div>
        </div>

        <!-- 3. Control Toolbar: Search, Source, Score Tier, Status, View Switcher -->
        <div class="glass-card" style="display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 14px 18px; flex-wrap: wrap;">
          
          <!-- Search Box -->
          <div style="position: relative; flex: 1; min-width: 260px; max-width: 440px;">
            <i data-lucide="search" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); width: 16px; height: 16px; pointer-events: none;"></i>
            <input type="text" id="articles-search-input" placeholder="Search headlines, context, or publisher domains..." value="${this.currentSearch}" style="width: 100%; padding: 9px 14px 9px 38px; border-radius: 8px; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-main); font-size: 0.86rem; outline: none;">
          </div>

          <!-- Multi-Parameter Filters & View Toggle -->
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            
            <!-- Source Filter -->
            <select id="source-filter-select" class="filter-select" style="padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 600;">
              <option value="all">🌐 All Sources</option>
            </select>

            <!-- Score Tier Filter -->
            <select id="score-filter-select" class="filter-select" style="padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 600;">
              <option value="all" ${this.currentScoreTier === 'all' ? 'selected' : ''}>★ All Scores</option>
              <option value="top" ${this.currentScoreTier === 'top' ? 'selected' : ''}>🔥 Top Tier (85+)</option>
              <option value="high" ${this.currentScoreTier === 'high' ? 'selected' : ''}>⭐ High Impact (75-84)</option>
              <option value="standard" ${this.currentScoreTier === 'standard' ? 'selected' : ''}>Standard (&lt;75)</option>
            </select>

            <!-- Status Filter -->
            <select id="status-filter-select" class="filter-select" style="padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 600;">
              <option value="all" ${this.currentStatus === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="ready" ${this.currentStatus === 'ready' ? 'selected' : ''}>Ready for Posting</option>
              <option value="scraped" ${this.currentStatus === 'scraped' ? 'selected' : ''}>Scraped Only</option>
              <option value="published" ${this.currentStatus === 'published' ? 'selected' : ''}>Published Live</option>
            </select>

            <!-- Scope Filter -->
            <select id="run-scope-filter-select" class="filter-select" style="padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 600;">
              <option value="all" ${this.currentRunScope === 'all' ? 'selected' : ''}>All Scrapes</option>
              <option value="latest" ${this.currentRunScope === 'latest' ? 'selected' : ''}>Latest Run</option>
              <option value="last100" ${this.currentRunScope === 'last100' ? 'selected' : ''}>Last 100</option>
            </select>

            <!-- View Mode Switcher -->
            <div style="display: flex; background: var(--bg-surface); border-radius: 8px; border: 1px solid var(--border-color); padding: 2px;">
              <button id="view-table-btn" class="btn ${this.viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}" style="padding: 6px 12px; font-size: 0.78rem; border: none; border-radius: 6px; display: flex; align-items: center; gap: 5px;">
                <i data-lucide="table" style="width: 14px; height: 14px;"></i> Table
              </button>
              <button id="view-cards-btn" class="btn ${this.viewMode === 'cards' ? 'btn-primary' : 'btn-secondary'}" style="padding: 6px 12px; font-size: 0.78rem; border: none; border-radius: 6px; display: flex; align-items: center; gap: 5px;">
                <i data-lucide="layout-grid" style="width: 14px; height: 14px;"></i> Wide Cards
              </button>
            </div>

          </div>
        </div>

        <!-- 4. Active Date Filter Indicator Banner (Conditional) -->
        <div id="articles-date-banner" style="display: none; background: rgba(217, 119, 87, 0.08); border: 1px solid rgba(217, 119, 87, 0.25); padding: 10px 16px; border-radius: 8px; font-size: 0.84rem; color: var(--text-main); justify-content: space-between; align-items: center;">
          <div id="articles-date-banner-text"></div>
          <button class="btn btn-secondary" style="padding: 3px 8px; font-size: 0.74rem;" onclick="ArticlesPage.selectDate('all')">Clear</button>
        </div>

        <!-- 5. Content Container (Table or Wide Cards) -->
        <div id="articles-view-container">
          <div class="glass-card" style="text-align: center; padding: 40px;">
            <p style="font-size: 0.9rem; color: var(--text-muted);">Loading articles vault...</p>
          </div>
        </div>

        <!-- 6. Structured Pagination & Limits Bar -->
        <div class="glass-card" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span style="font-size: 0.84rem; color: var(--text-muted); font-weight: 600;" id="pagination-info">
              Showing 0-0 of 0 articles
            </span>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--text-muted);">
              <span>Rows per page:</span>
              <select id="articles-limit-select" class="filter-select" style="padding: 4px 8px; font-size: 0.8rem;">
                <option value="15" ${this.limitPerPage === 15 ? 'selected' : ''}>15</option>
                <option value="30" ${this.limitPerPage === 30 ? 'selected' : ''}>30</option>
                <option value="50" ${this.limitPerPage === 50 ? 'selected' : ''}>50</option>
                <option value="100" ${this.limitPerPage === 100 ? 'selected' : ''}>100</option>
              </select>
            </div>
          </div>

          <div style="display: flex; gap: 8px; align-items: center;">
            <button class="btn btn-secondary" id="prev-page-btn" style="padding: 6px 14px; font-size: 0.82rem; display: flex; align-items: center; gap: 4px;">
              <i data-lucide="chevron-left" style="width: 14px; height: 14px;"></i> Prev
            </button>
            <span id="page-num-badge" style="font-size: 0.82rem; font-weight: 700; padding: 6px 12px; background: var(--bg-surface); border-radius: 6px; border: 1px solid var(--border-color);">
              Page 1
            </span>
            <button class="btn btn-secondary" id="next-page-btn" style="padding: 6px 14px; font-size: 0.82rem; display: flex; align-items: center; gap: 4px;">
              Next <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind event listeners
    this.bindEvents();

    // Initial data fetches in parallel
    await Promise.all([
      this.loadDateMetadata(),
      this.loadSourcesFilter(),
      this.loadArticles()
    ]);
  },

  bindEvents() {
    const searchInput = document.getElementById('articles-search-input');
    const sourceSelect = document.getElementById('source-filter-select');
    const scoreSelect = document.getElementById('score-filter-select');
    const statusSelect = document.getElementById('status-filter-select');
    const runScopeSelect = document.getElementById('run-scope-filter-select');
    const viewTableBtn = document.getElementById('view-table-btn');
    const viewCardsBtn = document.getElementById('view-cards-btn');
    const limitSelect = document.getElementById('articles-limit-select');
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    const clearDateBtn = document.getElementById('clear-date-filter-btn');

    let searchTimeout;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.currentSearch = e.target.value.trim();
          this.currentPageNum = 1;
          this.loadArticles();
        }, 300);
      });
    }

    if (sourceSelect) {
      sourceSelect.addEventListener('change', (e) => {
        this.currentSource = e.target.value;
        this.currentPageNum = 1;
        this.loadArticles();
      });
    }

    if (scoreSelect) {
      scoreSelect.addEventListener('change', (e) => {
        this.currentScoreTier = e.target.value;
        this.currentPageNum = 1;
        this.loadArticles();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.currentStatus = e.target.value;
        this.currentPageNum = 1;
        this.loadArticles();
      });
    }

    if (runScopeSelect) {
      runScopeSelect.addEventListener('change', (e) => {
        this.currentRunScope = e.target.value;
        this.currentPageNum = 1;
        this.loadArticles();
      });
    }

    if (limitSelect) {
      limitSelect.addEventListener('change', (e) => {
        this.limitPerPage = parseInt(e.target.value, 10);
        this.currentPageNum = 1;
        this.loadArticles();
      });
    }

    if (viewTableBtn && viewCardsBtn) {
      viewTableBtn.addEventListener('click', () => {
        this.viewMode = 'table';
        viewTableBtn.className = 'btn btn-primary';
        viewCardsBtn.className = 'btn btn-secondary';
        this.loadArticles();
      });

      viewCardsBtn.addEventListener('click', () => {
        this.viewMode = 'cards';
        viewCardsBtn.className = 'btn btn-primary';
        viewTableBtn.className = 'btn btn-secondary';
        this.loadArticles();
      });
    }

    if (clearDateBtn) {
      clearDateBtn.addEventListener('click', () => {
        this.selectDate('all');
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentPageNum > 1) {
          this.currentPageNum--;
          this.loadArticles();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentPageNum++;
        this.loadArticles();
      });
    }
  },

  async loadSourcesFilter() {
    try {
      const stats = await App.fetchApi('/api/stats');
      if (stats && stats.sources) {
        const sourceSelect = document.getElementById('source-filter-select');
        if (!sourceSelect) return;
        
        const sources = Object.keys(stats.sources).sort();
        this.sourcesList = sources;
        
        let html = '<option value="all">🌐 All Sources</option>';
        sources.forEach(src => {
          const count = stats.sources[src];
          html += `<option value="${src}">${src} (${count})</option>`;
        });
        sourceSelect.innerHTML = html;
      }
    } catch (e) {
      console.warn("Could not load sources filter", e);
    }
  },

  async loadDateMetadata() {
    try {
      const res = await App.fetchApi('/api/articles/dates');
      this.datesData = res.dates || [];
      const totalCount = res.total || 0;
      
      const allDatesCount = document.getElementById('all-dates-count');
      if (allDatesCount) allDatesCount.textContent = totalCount;

      const container = document.getElementById('date-chips-container');
      if (!container) return;

      let chipsHtml = `
        <button class="date-filter-chip ${this.selectedDate === 'all' ? 'active' : ''}" 
                onclick="ArticlesPage.selectDate('all')"
                style="flex-shrink: 0; padding: 6px 14px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; cursor: pointer; border: 1px solid ${this.selectedDate === 'all' ? 'var(--primary-purple)' : 'var(--border-color)'}; background: ${this.selectedDate === 'all' ? 'var(--primary-purple)' : 'var(--bg-surface)'}; color: ${this.selectedDate === 'all' ? '#fff' : 'var(--text-main)'}; transition: all 0.15s ease;">
          All Batches (${totalCount})
        </button>
      `;

      this.datesData.forEach(d => {
        const isSelected = this.selectedDate === d.date;
        const displayLabel = d.label || d.date;
        chipsHtml += `
          <button class="date-filter-chip ${isSelected ? 'active' : ''}" 
                  onclick="ArticlesPage.selectDate('${d.date}')"
                  style="flex-shrink: 0; padding: 6px 14px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; cursor: pointer; border: 1px solid ${isSelected ? 'var(--primary-purple)' : 'var(--border-color)'}; background: ${isSelected ? 'var(--primary-purple)' : 'var(--bg-surface)'}; color: ${isSelected ? '#fff' : 'var(--text-main)'}; transition: all 0.15s ease;">
            📅 ${displayLabel} <span style="opacity: 0.85; margin-left: 4px; font-weight: 700;">(${d.count})</span>
          </button>
        `;
      });

      container.innerHTML = chipsHtml;
    } catch (e) {
      console.error("Failed to load date metadata", e);
    }
  },

  selectDate(dateStr) {
    this.selectedDate = dateStr;
    this.currentPageNum = 1;
    
    // Update chip styling
    const container = document.getElementById('date-chips-container');
    if (container) {
      const buttons = container.querySelectorAll('.date-filter-chip');
      buttons.forEach(btn => {
        const match = (btn.getAttribute('onclick') || '').includes(`'${dateStr}'`);
        if (match) {
          btn.style.background = 'var(--primary-purple)';
          btn.style.borderColor = 'var(--primary-purple)';
          btn.style.color = '#fff';
        } else {
          btn.style.background = 'var(--bg-surface)';
          btn.style.borderColor = 'var(--border-color)';
          btn.style.color = 'var(--text-main)';
        }
      });
    }

    const clearBtn = document.getElementById('clear-date-filter-btn');
    const statusText = document.getElementById('date-selection-status');
    if (clearBtn) clearBtn.style.display = dateStr === 'all' ? 'none' : 'inline-block';
    if (statusText) {
      statusText.textContent = dateStr === 'all' ? 'All Batches' : `Filtered: ${dateStr}`;
    }

    this.loadArticles();
  },

  async loadArticles() {
    const viewContainer = document.getElementById('articles-view-container');
    const paginationInfo = document.getElementById('pagination-info');
    const pageBadge = document.getElementById('page-num-badge');
    const banner = document.getElementById('articles-date-banner');
    const bannerText = document.getElementById('articles-date-banner-text');
    if (!viewContainer) return;

    try {
      let url = `/api/articles?page=${this.currentPageNum}&limit=${this.limitPerPage}&run_scope=${this.currentRunScope}`;
      if (this.currentStatus !== 'all') url += `&status=${this.currentStatus}`;
      if (this.currentSource !== 'all') url += `&source=${encodeURIComponent(this.currentSource)}`;
      if (this.currentScoreTier !== 'all') url += `&score_tier=${this.currentScoreTier}`;
      if (this.selectedDate !== 'all') url += `&date_str=${this.selectedDate}`;
      if (this.currentSearch) url += `&search=${encodeURIComponent(this.currentSearch)}`;

      const data = await App.fetchApi(url);
      const articles = data.articles || [];
      const pag = data.pagination || { total: 0, page: 1, limit: this.limitPerPage, total_pages: 1 };

      // Update Top KPI stats from current set and overall
      this.updateKpiBar(pag.total, articles);

      // Date banner handling
      if (banner && bannerText) {
        if (this.selectedDate !== 'all') {
          banner.style.display = 'flex';
          bannerText.innerHTML = `<strong>Active Batch Filter:</strong> Showing <strong>${pag.total}</strong> articles scraped on <strong>${this.selectedDate}</strong>`;
        } else {
          banner.style.display = 'none';
        }
      }

      // Pagination texts
      if (paginationInfo) {
        const startIdx = pag.total === 0 ? 0 : (pag.page - 1) * pag.limit + 1;
        const endIdx = Math.min(pag.page * pag.limit, pag.total);
        paginationInfo.textContent = `Showing ${startIdx}–${endIdx} of ${pag.total} articles`;
      }
      if (pageBadge) {
        pageBadge.textContent = `Page ${pag.page} of ${pag.total_pages || 1}`;
      }

      if (!articles || articles.length === 0) {
        viewContainer.innerHTML = `
          <div class="glass-card" style="text-align: center; padding: 48px 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 12px; color: var(--text-muted);">🔍</div>
            <h4 style="font-family: var(--font-serif); font-size: 1.25rem; margin-bottom: 8px;">No matching articles found</h4>
            <p style="font-size: 0.86rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px;">
              Try clearing filters or search keywords to view the broader repository.
            </p>
            <button class="btn btn-secondary" onclick="ArticlesPage.resetAllFilters()">
              Reset All Filters
            </button>
          </div>
        `;
        return;
      }

      // Render Table or Cards
      if (this.viewMode === 'table') {
        viewContainer.innerHTML = this.renderMasterTable(articles);
      } else {
        viewContainer.innerHTML = this.renderExecutiveCards(articles);
      }

      if (window.lucide) window.lucide.createIcons();

    } catch (e) {
      console.error("Failed to load articles", e);
      viewContainer.innerHTML = `
        <div class="glass-card" style="text-align: center; padding: 30px; color: var(--status-failed);">
          <p>Failed to load articles: ${e.message}</p>
        </div>
      `;
    }
  },

  updateKpiBar(totalCount, articles) {
    const elTotal = document.getElementById('stat-total-articles');
    const elReady = document.getElementById('stat-ready-articles');
    const elTop = document.getElementById('stat-top-articles');
    const elSlides = document.getElementById('stat-slides-articles');

    if (elTotal) elTotal.textContent = totalCount;
    
    // Quick calculation based on retrieved batch
    const readyCount = articles.filter(a => a.status === 'ready' || a.status === 'published').length;
    const topCount = articles.filter(a => (a.rank_score || 0) >= 85).length;
    const slideCount = articles.filter(a => a.slide_count >= 1 || a.has_image).length;

    if (elReady) elReady.textContent = readyCount > 0 ? `${readyCount}+` : 'Ready';
    if (elTop) elTop.textContent = topCount > 0 ? `${topCount}` : '85+';
    if (elSlides) elSlides.textContent = slideCount > 0 ? `${slideCount} Decks` : 'Available';
  },

  renderMasterTable(articles) {
    return `
      <div class="glass-card" style="padding: 0; overflow: hidden; border-radius: 12px;">
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.84rem;">
            <thead>
              <tr style="background: var(--bg-surface); border-bottom: 1.5px solid var(--border-color); color: var(--text-muted); font-size: 0.74rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;">
                <th style="padding: 12px 14px; width: 60px;"># ID</th>
                <th style="padding: 12px 14px; width: 140px;">Source / Publisher</th>
                <th style="padding: 12px 16px; min-width: 320px;">Headline & Context Narrative</th>
                <th style="padding: 12px 12px; width: 100px; text-align: center;">AI Score</th>
                <th style="padding: 12px 14px; width: 130px; text-align: center;">Slide Deck</th>
                <th style="padding: 12px 14px; width: 150px; text-align: center;">Platforms</th>
                <th style="padding: 12px 14px; width: 130px;">Date Scraped</th>
                <th style="padding: 12px 14px; width: 100px; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${articles.map(a => {
                const score = a.rank_score || 75;
                const scoreBadgeBg = score >= 85 ? 'rgba(46, 125, 50, 0.12)' : score >= 75 ? 'rgba(43, 123, 185, 0.12)' : 'rgba(217, 119, 87, 0.12)';
                const scoreColor = score >= 85 ? '#2e7d32' : score >= 75 ? '#2b7bb9' : '#d97757';
                const scoreTierLabel = score >= 85 ? 'Top Tier' : score >= 75 ? 'High' : 'Standard';

                const domain = a.source_domain || (a.url ? a.url.split('/')[2] : '');
                const cleanExcerpt = a.refined_body || '';

                // Slide deck badge
                const hasDeck = (a.slide_count && a.slide_count >= 4) || (a.slide_urls && a.slide_urls.length >= 4);
                const hasAnyImage = a.has_image || (a.slide_urls && a.slide_urls.length > 0);

                let slideHtml = '';
                if (hasDeck) {
                  slideHtml = `<span class="badge" style="background: rgba(193, 53, 132, 0.12); color: #c13584; border: 1px solid rgba(193, 53, 132, 0.3); font-weight: 700;">✨ 4 Slides Deck</span>`;
                } else if (hasAnyImage) {
                  slideHtml = `<span class="badge" style="background: rgba(43, 123, 185, 0.1); color: #2b7bb9; border: 1px solid rgba(43, 123, 185, 0.3);">1 Visual</span>`;
                } else {
                  slideHtml = `<span style="font-size: 0.72rem; color: var(--text-dim);">Queue Render</span>`;
                }

                // Platform badges
                const p = a.platforms || {};
                const platReddit = p.reddit ? 'color: var(--color-reddit); font-weight: 800;' : 'color: var(--text-dim); opacity: 0.4;';
                const platTwitter = p.twitter ? 'color: var(--color-twitter); font-weight: 800;' : 'color: var(--text-dim); opacity: 0.4;';
                const platLinkedIn = p.linkedin ? 'color: var(--color-linkedin); font-weight: 800;' : 'color: var(--text-dim); opacity: 0.4;';
                const platInstagram = p.instagram ? 'color: var(--color-instagram); font-weight: 800;' : 'color: var(--text-dim); opacity: 0.4;';

                return `
                  <tr style="border-bottom: 1px solid var(--border-color); transition: background 0.15s ease;" onmouseenter="this.style.background='var(--bg-surface)'" onmouseleave="this.style.background='transparent'">
                    
                    <!-- ID -->
                    <td style="padding: 12px 14px; font-weight: 600; color: var(--text-muted); font-size: 0.78rem;">
                      #${a.id}
                    </td>

                    <!-- Source / Publisher & Domain -->
                    <td style="padding: 12px 14px; vertical-align: top;">
                      <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
                        <span class="source-pill" style="font-size: 0.7rem; font-weight: 700;">${a.source}</span>
                        ${domain ? `
                          <a href="${a.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.72rem; color: var(--text-muted); text-decoration: none; display: flex; align-items: center; gap: 3px;" title="Visit ${domain}">
                            ${domain} <i data-lucide="external-link" style="width: 10px; height: 10px;"></i>
                          </a>
                        ` : ''}
                      </div>
                    </td>

                    <!-- Headline & Context -->
                    <td style="padding: 12px 16px; vertical-align: top;">
                      <div style="display: flex; flex-direction: column; gap: 4px;">
                        <a href="javascript:void(0)" onclick="App.openArticleModal(${a.id})" style="font-family: var(--font-serif); font-size: 0.98rem; font-weight: 600; color: var(--text-main); line-height: 1.35; text-decoration: none;" onmouseenter="this.style.color='var(--primary-purple)'" onmouseleave="this.style.color='var(--text-main)'">
                          ${a.title}
                        </a>
                        ${cleanExcerpt ? `
                          <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0;">
                            ${cleanExcerpt}
                          </p>
                        ` : ''}
                      </div>
                    </td>

                    <!-- AI Score -->
                    <td style="padding: 12px 12px; text-align: center; vertical-align: middle;">
                      <div style="display: inline-flex; flex-direction: column; align-items: center; gap: 2px;">
                        <span style="font-size: 0.82rem; font-weight: 800; color: ${scoreColor}; background: ${scoreBadgeBg}; padding: 3px 8px; border-radius: 6px; border: 1px solid ${scoreColor};">
                          ★ ${score}
                        </span>
                        <span style="font-size: 0.68rem; font-weight: 600; color: var(--text-muted);">${scoreTierLabel}</span>
                      </div>
                    </td>

                    <!-- Slide Deck -->
                    <td style="padding: 12px 14px; text-align: center; vertical-align: middle;">
                      ${slideHtml}
                    </td>

                    <!-- Platforms -->
                    <td style="padding: 12px 14px; text-align: center; vertical-align: middle;">
                      <div style="display: inline-flex; gap: 6px; font-size: 0.72rem; padding: 4px 8px; background: var(--bg-surface); border-radius: 6px; border: 1px solid var(--border-color);">
                        <span style="${platTwitter}" title="Twitter / X">X</span>
                        <span style="${platLinkedIn}" title="LinkedIn">in</span>
                        <span style="${platReddit}" title="Reddit">r/</span>
                        <span style="${platInstagram}" title="Instagram">IG</span>
                      </div>
                    </td>

                    <!-- Date Scraped -->
                    <td style="padding: 12px 14px; vertical-align: middle; font-size: 0.76rem; color: var(--text-muted); white-space: nowrap;">
                      ${App.formatTimestamp(a.scraped_at)}
                    </td>

                    <!-- Actions -->
                    <td style="padding: 12px 14px; text-align: right; vertical-align: middle;">
                      <div style="display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
                        <button class="btn btn-secondary" onclick="App.openArticleModal(${a.id})" style="padding: 4px 10px; font-size: 0.74rem;" title="View Details">
                          Inspect
                        </button>
                        <button class="btn-icon danger" style="width: 26px; height: 26px;" onclick="ArticlesPage.deleteArticle(${a.id}, event)" title="Delete Article">
                          <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
                        </button>
                      </div>
                    </td>

                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderExecutiveCards(articles) {
    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(460px, 1fr)); gap: 16px;">
        ${articles.map(a => {
          const score = a.rank_score || 75;
          const scoreColor = score >= 85 ? '#2e7d32' : score >= 75 ? '#2b7bb9' : '#d97757';
          const domain = a.source_domain || (a.url ? a.url.split('/')[2] : '');
          const cleanExcerpt = a.refined_body || '';

          // Slides preview
          const slides = a.slide_urls || [];
          const hasCover = a.image_url || (slides.length > 0 ? slides[0] : null);

          return `
            <div class="glass-card" style="display: flex; flex-direction: column; justify-content: space-between; gap: 14px; padding: 18px; border-radius: 12px; transition: transform 0.15s ease, border-color 0.15s ease;" onmouseenter="this.style.borderColor='rgba(217, 119, 87, 0.4)'" onmouseleave="this.style.borderColor='var(--border-color)'">
              
              <div>
                <!-- Top Meta Row -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="source-pill" style="font-size: 0.72rem; font-weight: 700;">${a.source}</span>
                    ${domain ? `
                      <a href="${a.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.72rem; color: var(--text-muted); text-decoration: none; display: flex; align-items: center; gap: 3px;">
                        ${domain} <i data-lucide="external-link" style="width: 10px; height: 10px;"></i>
                      </a>
                    ` : ''}
                  </div>

                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge badge-${a.status}">${a.status.toUpperCase()}</span>
                    <span style="font-size: 0.76rem; font-weight: 800; color: ${scoreColor}; background: var(--bg-surface); padding: 3px 8px; border-radius: 6px; border: 1px solid ${scoreColor};">
                      ★ ${score}/100
                    </span>
                  </div>
                </div>

                <!-- Headline -->
                <h4 style="font-family: var(--font-serif); font-size: 1.12rem; font-weight: 600; line-height: 1.35; color: var(--text-main); margin-bottom: 8px; cursor: pointer;" onclick="App.openArticleModal(${a.id})">
                  ${a.title}
                </h4>

                <!-- AI Context Narrative -->
                ${cleanExcerpt ? `
                  <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.45; background: var(--bg-surface); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 12px;">
                    ${cleanExcerpt}
                  </p>
                ` : ''}

                <!-- Slide Deck Preview Strip (if available) -->
                ${slides.length > 0 ? `
                  <div style="display: flex; gap: 8px; margin-bottom: 12px; overflow-x: auto; padding-bottom: 4px;">
                    ${slides.map((s, idx) => `
                      <a href="${s}" target="_blank" style="flex-shrink: 0; width: 64px; height: 42px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-color); position: relative; display: block;" title="Slide ${idx + 1}">
                        <img src="${s}" alt="Slide ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'">
                        <span style="position: absolute; bottom: 2px; right: 2px; font-size: 0.6rem; font-weight: 800; background: rgba(0,0,0,0.65); color: #fff; padding: 1px 3px; border-radius: 2px;">S${idx + 1}</span>
                      </a>
                    `).join('')}
                  </div>
                ` : ''}
              </div>

              <!-- Footer Row: Date & Action Links -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 10px;">
                <span style="font-size: 0.74rem; color: var(--text-muted); font-weight: 500;">
                  📅 ${App.formatTimestamp(a.scraped_at)}
                </span>

                <div style="display: flex; align-items: center; gap: 8px;">
                  <button class="btn btn-secondary" onclick="App.openArticleModal(${a.id})" style="padding: 5px 12px; font-size: 0.78rem;">
                    Inspect Modal →
                  </button>
                  ${a.url ? `
                    <a href="${a.url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.78rem; text-decoration: none;" title="Open Scraped Website">
                      Visit ↗
                    </a>
                  ` : ''}
                  <button class="btn-icon danger" style="width: 28px; height: 28px;" onclick="ArticlesPage.deleteArticle(${a.id}, event)" title="Delete Article">
                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                  </button>
                </div>
              </div>

            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  resetAllFilters() {
    this.currentSearch = '';
    this.currentSource = 'all';
    this.currentScoreTier = 'all';
    this.currentStatus = 'all';
    this.currentRunScope = 'all';
    this.selectedDate = 'all';
    this.currentPageNum = 1;

    const sIn = document.getElementById('articles-search-input');
    const sSrc = document.getElementById('source-filter-select');
    const sScr = document.getElementById('score-filter-select');
    const sSta = document.getElementById('status-filter-select');
    const sScp = document.getElementById('run-scope-filter-select');

    if (sIn) sIn.value = '';
    if (sSrc) sSrc.value = 'all';
    if (sScr) sScr.value = 'all';
    if (sSta) sSta.value = 'all';
    if (sScp) sScp.value = 'all';

    this.selectDate('all');
  },

  async deleteArticle(id, event) {
    if (event) event.stopPropagation();
    if (!confirm(`Are you sure you want to delete article #${id}?`)) return;

    try {
      await App.fetchApi(`/api/articles/${id}`, { method: 'DELETE' });
      App.showToast(`Deleted article #${id}`, 'info');
      this.loadArticles();
    } catch (err) {
      App.showToast(`Failed to delete article: ${err.message}`, 'error');
    }
  }
};
