/**
 * Articles Vault Renderer — Interactive Visual Calendar Grid & Structured Month/Year Vault
 * Provides a real interactive monthly calendar grid with clickable day cells, article counters,
 * and pop-up filtered box cards.
 */
const ArticlesPage = {
  currentPageNum: 1,
  currentStatus: 'all',
  currentRunScope: 'all',
  currentSearch: '',
  selectedDate: 'all',
  
  // Calendar navigation state
  currentYear: 2026,
  currentMonth: 7, // 0-indexed (7 = August)
  
  datesData: [],
  monthsData: [],
  viewMode: 'calendar', // 'calendar' or 'grid'

  async render(container) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthLabel = `${monthNames[this.currentMonth]} ${this.currentYear}`;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Header Toolbar & View Mode Switcher -->
        <div class="glass-card" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 22px; flex-wrap: wrap;">
          
          <!-- Search Input -->
          <div class="search-box" style="position: relative; flex: 1; min-width: 240px; max-width: 420px;">
            <i data-lucide="search" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); width: 18px; height: 18px; pointer-events: none;"></i>
            <input type="text" id="articles-search-input" placeholder="Search scraped headlines or sources..." value="${this.currentSearch}" style="width: 100%; padding: 10px 14px 10px 42px; border-radius: 8px; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-main); font-size: 0.88rem; outline: none;">
          </div>

          <!-- Status, Run Scope & View Toggle -->
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            
            <select id="run-scope-filter-select" class="filter-select" style="padding: 9px 14px; border-radius: 8px; font-weight: 600; font-size: 0.85rem;">
              <option value="all" ${this.currentRunScope === 'all' ? 'selected' : ''}>📚 All Scraped News</option>
              <option value="latest" ${this.currentRunScope === 'latest' ? 'selected' : ''}>🔥 Latest Pipeline Run</option>
              <option value="last100" ${this.currentRunScope === 'last100' ? 'selected' : ''}>⚡ Last 100 Scraped News</option>
            </select>

            <select id="status-filter-select" class="filter-select" style="padding: 9px 14px; border-radius: 8px; font-weight: 600; font-size: 0.85rem;">
              <option value="all" ${this.currentStatus === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="ready" ${this.currentStatus === 'ready' ? 'selected' : ''}>Ready for Posting</option>
              <option value="scraped" ${this.currentStatus === 'scraped' ? 'selected' : ''}>Scraped Only</option>
              <option value="published" ${this.currentStatus === 'published' ? 'selected' : ''}>Published Live</option>
            </select>

            <div style="display: flex; background: var(--bg-surface); border-radius: 8px; border: 1px solid var(--border-color); padding: 3px;">
              <button id="view-calendar-btn" class="btn ${this.viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}" style="padding: 6px 14px; font-size: 0.8rem; border: none; border-radius: 6px;">
                🗓️ Calendar View
              </button>
              <button id="view-grid-btn" class="btn ${this.viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}" style="padding: 6px 14px; font-size: 0.8rem; border: none; border-radius: 6px;">
                📋 List Grid
              </button>
            </div>

          </div>

        </div>

        <!-- Interactive Monthly Calendar Component Card -->
        <div class="glass-card" id="calendar-vault-card" style="display: ${this.viewMode === 'calendar' ? 'block' : 'none'}; padding: 22px;">
          
          <!-- Month/Year Navigation Bar -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--border-color);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <h3 style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; color: var(--text-main);" id="calendar-month-year-title">
                🗓️ ${monthLabel} Scraped Vault
              </h3>
              <span class="badge badge-scraped" id="calendar-month-summary-badge" style="font-size: 0.76rem; padding: 5px 10px;">
                Loading month stats...
              </span>
            </div>

            <!-- Month/Year Stepper Controls -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-secondary" id="cal-prev-month-btn" style="padding: 6px 12px; font-size: 0.82rem;" title="Previous Month">
                ◀ Prev Month
              </button>
              
              <!-- Direct Month Jump Selector -->
              <select id="cal-month-select" class="filter-select" style="padding: 6px 10px; font-size: 0.82rem; font-weight: 600;">
                ${monthNames.map((m, idx) => `<option value="${idx}" ${idx === this.currentMonth ? 'selected' : ''}>${m}</option>`).join('')}
              </select>

              <!-- Direct Year Selector -->
              <select id="cal-year-select" class="filter-select" style="padding: 6px 10px; font-size: 0.82rem; font-weight: 600;">
                <option value="2026" selected>2026</option>
                <option value="2025">2025</option>
              </select>

              <button class="btn btn-secondary" id="cal-next-month-btn" style="padding: 6px 12px; font-size: 0.82rem;" title="Next Month">
                Next Month ▶
              </button>

              <button class="btn btn-secondary" id="cal-reset-date-btn" style="padding: 6px 12px; font-size: 0.82rem;" title="Show All Dates">
                Reset Filter
              </button>
            </div>
          </div>

          <!-- Calendar Grid (Sun - Sat Days Header) -->
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; text-align: center; font-weight: 700; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">
            <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
          </div>

          <!-- Days Grid Container -->
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;" id="calendar-days-grid">
            <p>Building calendar...</p>
          </div>

        </div>

        <!-- Selected Date Header Banner -->
        <div id="articles-date-banner" style="display: none; background: rgba(217, 119, 87, 0.12); border: 1px solid rgba(217, 119, 87, 0.3); padding: 12px 20px; border-radius: 10px; font-size: 0.9rem; color: var(--text-main); font-weight: 600;">
          📅 Filtered by Date
        </div>

        <!-- Articles Grid of Box Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px;" id="articles-boxes-grid">
          <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 40px;"><p>Loading articles vault...</p></div>
        </div>

        <!-- Pagination Controls -->
        <div class="glass-card" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 22px;">
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;" id="pagination-info">Page 1 of 1</span>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" id="prev-page-btn" style="padding: 8px 18px; font-size: 0.84rem;">← Previous</button>
            <button class="btn btn-secondary" id="next-page-btn" style="padding: 8px 18px; font-size: 0.84rem;">Next →</button>
          </div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind controls
    this.bindEvents();

    // Fetch dates & build calendar
    await this.loadDateMetadata();
    await this.loadArticles();
  },

  bindEvents() {
    const searchInput = document.getElementById('articles-search-input');
    const statusSelect = document.getElementById('status-filter-select');
    const viewCalBtn = document.getElementById('view-calendar-btn');
    const viewGridBtn = document.getElementById('view-grid-btn');
    const prevMonthBtn = document.getElementById('cal-prev-month-btn');
    const nextMonthBtn = document.getElementById('cal-next-month-btn');
    const monthSelect = document.getElementById('cal-month-select');
    const yearSelect = document.getElementById('cal-year-select');
    const resetDateBtn = document.getElementById('cal-reset-date-btn');
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');

    let searchTimeout;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.currentSearch = e.target.value;
          this.currentPageNum = 1;
          this.loadArticles();
        }, 300);
      });
    }

    const runScopeSelect = document.getElementById('run-scope-filter-select');

    if (runScopeSelect) {
      runScopeSelect.addEventListener('change', (e) => {
        this.currentRunScope = e.target.value;
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

    if (viewCalBtn && viewGridBtn) {
      viewCalBtn.addEventListener('click', () => {
        this.viewMode = 'calendar';
        document.getElementById('calendar-vault-card').style.display = 'block';
        viewCalBtn.className = 'btn btn-primary';
        viewGridBtn.className = 'btn btn-secondary';
      });

      viewGridBtn.addEventListener('click', () => {
        this.viewMode = 'grid';
        document.getElementById('calendar-vault-card').style.display = 'none';
        viewGridBtn.className = 'btn btn-primary';
        viewCalBtn.className = 'btn btn-secondary';
      });
    }

    if (prevMonthBtn) {
      prevMonthBtn.addEventListener('click', () => {
        if (this.currentMonth === 0) {
          this.currentMonth = 11;
          this.currentYear--;
        } else {
          this.currentMonth--;
        }
        this.updateCalendarHeader();
        this.renderCalendarGrid();
      });
    }

    if (nextMonthBtn) {
      nextMonthBtn.addEventListener('click', () => {
        if (this.currentMonth === 11) {
          this.currentMonth = 0;
          this.currentYear++;
        } else {
          this.currentMonth++;
        }
        this.updateCalendarHeader();
        this.renderCalendarGrid();
      });
    }

    if (monthSelect) {
      monthSelect.addEventListener('change', (e) => {
        this.currentMonth = parseInt(e.target.value);
        this.updateCalendarHeader();
        this.renderCalendarGrid();
      });
    }

    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        this.currentYear = parseInt(e.target.value);
        this.updateCalendarHeader();
        this.renderCalendarGrid();
      });
    }

    if (resetDateBtn) {
      resetDateBtn.addEventListener('click', () => {
        this.selectedDate = 'all';
        this.currentPageNum = 1;
        this.renderCalendarGrid();
        this.loadArticles();
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

  updateCalendarHeader() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const title = document.getElementById('calendar-month-year-title');
    const monthSelect = document.getElementById('cal-month-select');
    const yearSelect = document.getElementById('cal-year-select');

    if (title) title.textContent = `🗓️ ${monthNames[this.currentMonth]} ${this.currentYear} Scraped Vault`;
    if (monthSelect) monthSelect.value = this.currentMonth;
    if (yearSelect) yearSelect.value = this.currentYear;
  },

  async loadDateMetadata() {
    try {
      const res = await App.fetchApi('/api/articles/dates');
      this.datesData = res.dates || [];
      this.monthsData = res.months || [];
      this.renderCalendarGrid();
    } catch (e) {
      console.error("Failed to load date metadata", e);
    }
  },

  renderCalendarGrid() {
    const daysContainer = document.getElementById('calendar-days-grid');
    const summaryBadge = document.getElementById('calendar-month-summary-badge');
    if (!daysContainer) return;

    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    // Map date counts for easy lookup (YYYY-MM-DD)
    const monthPrefix = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}`;
    const dateCountsMap = {};
    let monthTotalCount = 0;

    this.datesData.forEach(d => {
      dateCountsMap[d.date] = d.count;
      if (d.date && d.date.startsWith(monthPrefix)) {
        monthTotalCount += d.count;
      }
    });

    if (summaryBadge) {
      summaryBadge.textContent = `${monthTotalCount} Scraped Articles in Month`;
    }

    let cellsHtml = '';

    // Empty lead-in cells
    for (let i = 0; i < firstDay; i++) {
      cellsHtml += `<div style="height: 70px; background: rgba(0,0,0,0.02); border-radius: 8px; border: 1px dashed var(--border-color); opacity: 0.3;"></div>`;
    }

    // Day cells (1 to daysInMonth)
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${monthPrefix}-${String(day).padStart(2, '0')}`;
      const count = dateCountsMap[dateStr] || 0;
      const isSelected = this.selectedDate === dateStr;
      const hasData = count > 0;

      const bgStyle = isSelected 
        ? 'background: var(--primary-purple); color: #fff; border: 2px solid var(--primary-indigo); box-shadow: 0 4px 12px rgba(217,119,87,0.3);' 
        : hasData 
        ? 'background: rgba(217, 119, 87, 0.12); color: var(--text-main); border: 1.5px solid rgba(217, 119, 87, 0.4);' 
        : 'background: var(--bg-card); color: var(--text-muted); border: 1px solid var(--border-color);';

      cellsHtml += `
        <div style="height: 72px; padding: 8px; border-radius: 8px; cursor: ${hasData ? 'pointer' : 'default'}; transition: all 0.15s ease; display: flex; flex-direction: column; justify-content: space-between; ${bgStyle}" 
             onclick="${hasData ? `ArticlesPage.selectCalendarDate('${dateStr}')` : ''}">
          <div style="font-size: 0.9rem; font-weight: 700; display: flex; justify-content: space-between; align-items: center;">
            <span>${day}</span>
            ${isSelected ? '<i data-lucide="check-circle" style="width: 14px; height: 14px;"></i>' : ''}
          </div>

          ${hasData ? `
            <div style="font-size: 0.72rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; ${isSelected ? 'background: rgba(255,255,255,0.25); color: #fff;' : 'background: var(--primary-purple); color: #fff;'} align-self: flex-start;">
              ${count} Scraped
            </div>
          ` : `
            <div style="font-size: 0.68rem; opacity: 0.4;">No data</div>
          `}
        </div>
      `;
    }

    daysContainer.innerHTML = cellsHtml;
    if (window.lucide) window.lucide.createIcons();
  },

  selectCalendarDate(dateStr) {
    this.selectedDate = dateStr;
    this.currentPageNum = 1;
    this.renderCalendarGrid();
    this.loadArticles();
  },

  async loadArticles() {
    const grid = document.getElementById('articles-boxes-grid');
    const info = document.getElementById('pagination-info');
    const banner = document.getElementById('articles-date-banner');
    if (!grid) return;

    try {
      let url = `/api/articles?page=${this.currentPageNum}&limit=12&run_scope=${this.currentRunScope}`;
      if (this.currentStatus !== 'all') url += `&status=${this.currentStatus}`;
      if (this.selectedDate !== 'all') url += `&date_str=${this.selectedDate}`;
      if (this.currentSearch) url += `&search=${encodeURIComponent(this.currentSearch)}`;

      const data = await App.fetchApi(url);
      const articles = data.articles;
      const pag = data.pagination;

      if (banner) {
        if (this.selectedDate !== 'all') {
          banner.style.display = 'flex';
          banner.style.alignItems = 'center';
          banner.style.justifyContent = 'space-between';
          banner.innerHTML = `
            <div>
              📅 <strong>Calendar Vault Filter:</strong> Showing ${pag.total} articles scraped on <strong>${this.selectedDate}</strong>.
            </div>
            <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.78rem;" onclick="ArticlesPage.selectCalendarDate('all')">
              ✖ Clear Date Filter
            </button>
          `;
        } else {
          banner.style.display = 'none';
        }
      }

      if (info) {
        info.textContent = `Page ${pag.page} of ${pag.total_pages} (${pag.total} total articles)`;
      }

      if (!articles || articles.length === 0) {
        grid.innerHTML = '<div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 40px;"><p style="font-size: 0.95rem; color: var(--text-muted);">No articles found for selected calendar date or filters.</p></div>';
        return;
      }

      grid.innerHTML = articles.map(a => {
        const score = a.rank_score || 75;
        const scoreColor = score >= 80 ? '#2e7d32' : score >= 60 ? '#2b7bb9' : '#d97757';
        
        const hasBodyText = a.body && a.body.trim().length > 0 && !a.body.includes('Scraped headline available');
        const bodySnippet = hasBodyText ? (a.body.length > 140 ? a.body.substring(0, 140) + '...' : a.body) : '';

        return `
          <div class="glass-card article-box-card" style="display: flex; flex-direction: column; justify-content: space-between; gap: 14px; cursor: pointer;" onclick="App.openArticleModal(${a.id})">
            
            <div>
              <!-- Header Row: Source Pill, Status, & Rank Score -->
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="source-pill" style="font-size: 0.72rem; padding: 3px 8px; font-weight: 700;">${a.source}</span>
                  <span class="badge badge-${a.status}">${a.status.toUpperCase()}</span>
                </div>
                <span style="font-size: 0.78rem; font-weight: 800; color: ${scoreColor}; background: var(--bg-surface); padding: 3px 8px; border-radius: 6px; border: 1px solid ${scoreColor};">
                  ★ ${score}/100
                </span>
              </div>

              <!-- Article Headline -->
              <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 600; line-height: 1.35; color: var(--text-main); margin-bottom: 8px;">
                ${a.title}
              </h4>

              <!-- Optional Body Excerpt -->
              ${hasBodyText ? `
                <p style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.45; background: var(--bg-surface); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 8px;">
                  ${bodySnippet}
                </p>
              ` : ''}
            </div>

            <!-- Footer Row: Date & Action Link -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--border-color);">
              <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 500;">
                📅 ${App.formatTimestamp(a.scraped_at)}
              </span>

              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.8rem; color: var(--primary-purple); font-weight: 700;">View Details →</span>
                <button class="btn-icon danger" style="width: 28px; height: 28px;" onclick="ArticlesPage.deleteArticle(${a.id}, event)" title="Delete Article">
                  <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                </button>
              </div>
            </div>

          </div>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();

    } catch (e) {
      console.error("Failed to load articles page", e);
    }
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
