/**
 * Editorial Articles Vault (articles.js)
 * High-density editorial archive with an interactive Google Calendar-style
 * date and monthly explorer featuring dedicated Open/Close calendar controls.
 */
const ArticlesPage = {
  currentPageNum: 1,
  limitPerPage: 15,
  currentStatus: 'all', // 'all' | 'pending' | 'draft' | 'published'
  currentRunScope: 'all',
  currentSource: 'all',
  currentSearch: '',
  
  // Calendar State
  selectedDate: null,    // 'YYYY-MM-DD' or null
  selectedMonth: null,   // 'YYYY-MM' or null
  calYear: 2026,
  calMonth: 9,           // 0-indexed (9 = October)
  calExpanded: false,    // CLOSED by default, opened via Open Calendar button
  dateCountsMap: {},     // { '2026-10-07': 71, ... }
  monthCountsMap: {},    // { '2026-10': 201, ... }
  monthsList: [],        // [{ month: '2026-10', count: 201 }, ...]
  
  viewMode: 'table',     // 'table' | 'cards'
  sourcesList: [],
  totalArticlesCount: 0,

  async render(container) {
    this.calYear = 2026;
    this.calMonth = 9; // October

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 1320px; margin: 0 auto; padding-bottom: 40px;">
        
        <!-- 1. Unified Editorial Archive Header & KPI Container -->
        <div class="glass-card" style="padding: 0; overflow: hidden; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
          
          <!-- Top Row: Section Title, Brief & Actions -->
          <div style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; background: #ffffff;">
            <div>
              <div style="display: flex; align-items: center; gap: 9px; margin-bottom: 3px;">
                <h3 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin: 0;">
                  Editorial Articles Vault
                </h3>
                <span class="badge" style="background: rgba(79,70,229,0.1); color: #4F46E5; border: 1px solid rgba(79,70,229,0.25); font-weight: 700; font-size: 0.72rem; padding: 2px 8px; border-radius: 6px;">
                  Master Archive
                </span>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">
                Comprehensive archive of all ingested stories, authentic photo assets, and NewsFlow Web synchronization records.
              </p>
            </div>

            <!-- Primary Action Buttons -->
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <a href="#ranking" class="btn btn-primary btn-glow" style="display: flex; align-items: center; gap: 6px; padding: 7px 15px; font-weight: 700; font-size: 0.82rem; text-decoration: none;">
                <i data-lucide="send" style="width: 14px; height: 14px;"></i> Open News Desk &rarr;
              </a>
              <div style="display: flex; gap: 2px; background: var(--bg-surface); padding: 2px; border-radius: 8px; border: 1px solid var(--border-color);">
                <a href="http://localhost:3000/admin" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.76rem; border: none; background: transparent; text-decoration: none; display: flex; align-items: center; gap: 4px; color: var(--text-main);" title="Open NewsFlow Admin">
                  <i data-lucide="shield-check" style="width: 13px; height: 13px; color: #10B981;"></i> Admin ↗
                </a>
                <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.76rem; border: none; background: transparent; text-decoration: none; display: flex; align-items: center; gap: 4px; color: var(--text-main);" title="Open Public Website">
                  <i data-lucide="globe" style="width: 13px; height: 13px; color: #4F46E5;"></i> Web ↗
                </a>
              </div>
              <button class="btn btn-secondary" onclick="ArticlesPage.loadArticles()" style="padding: 6px 10px; font-size: 0.76rem; display: flex; align-items: center; gap: 4px;" title="Refresh articles">
                <i data-lucide="refresh-cw" style="width: 13px; height: 13px;"></i>
              </button>
            </div>
          </div>

          <!-- Middle Row: 4 Modern Executive Metric Capsules -->
          <div style="padding: 12px 20px; background: var(--bg-surface); border-top: 1px solid var(--border-color);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; align-items: center;">
              
              <!-- Metric 1: Total Ingested -->
              <div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="width: 32px; height: 32px; border-radius: 6px; background: rgba(79,70,229,0.1); color: #4F46E5; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">
                  <i data-lucide="layers" style="width: 16px; height: 16px;"></i>
                </div>
                <div style="min-width: 0;">
                  <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Total Ingested</div>
                  <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-main);" id="kpi-total-articles">...</div>
                </div>
              </div>

              <!-- Metric 2: Authentic Photos -->
              <div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="width: 32px; height: 32px; border-radius: 6px; background: rgba(16,185,129,0.1); color: #059669; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">
                  <i data-lucide="camera" style="width: 16px; height: 16px;"></i>
                </div>
                <div style="min-width: 0;">
                  <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Authentic Photos</div>
                  <div style="font-size: 1.05rem; font-weight: 800; color: #059669;" id="kpi-photos-count">...</div>
                </div>
              </div>

              <!-- Metric 3: Synced to Admin -->
              <div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="width: 32px; height: 32px; border-radius: 6px; background: rgba(6,182,212,0.1); color: #0891b2; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">
                  <i data-lucide="file-check" style="width: 16px; height: 16px;"></i>
                </div>
                <div style="min-width: 0;">
                  <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Synced to Admin</div>
                  <div style="font-size: 1.05rem; font-weight: 800; color: #0891b2;" id="kpi-synced-count">...</div>
                </div>
              </div>

              <!-- Metric 4: Live on Website -->
              <div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="width: 32px; height: 32px; border-radius: 6px; background: rgba(139,92,246,0.1); color: #7c3aed; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">
                  <i data-lucide="globe" style="width: 16px; height: 16px;"></i>
                </div>
                <div style="min-width: 0;">
                  <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Live on Web</div>
                  <div style="font-size: 1.05rem; font-weight: 800; color: #7c3aed;" id="kpi-live-count">...</div>
                </div>
              </div>

            </div>
          </div>

          <!-- Bottom Section: Calendar Control Bar & Google Calendar Drawer -->
          <div style="border-top: 1px solid var(--border-color); background: #ffffff;">
            
            <!-- Calendar Action Bar (Always Visible) -->
            <div style="padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: var(--bg-surface); border-bottom: 1px solid var(--border-color);">
              
              <!-- Left: Open/Close Calendar Button & Quick Month Pills -->
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                
                <!-- PRIMARY OPEN/CLOSE CALENDAR BUTTON -->
                <button id="main-cal-toggle-btn" class="btn btn-primary" onclick="ArticlesPage.toggleCalendar()" style="display: flex; align-items: center; gap: 6px; padding: 6px 14px; font-size: 0.8rem; font-weight: 700; border-radius: 8px; box-shadow: 0 1px 4px rgba(79,70,229,0.2);">
                  <i data-lucide="calendar" style="width: 14px; height: 14px;"></i>
                  <span id="main-cal-btn-text">Open Calendar</span>
                </button>

                <!-- Quick Month Filter Tabs -->
                <div id="cal-quick-months" style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                  <button class="btn btn-secondary" id="btn-month-all" onclick="ArticlesPage.clearCalendarFilter()" style="padding: 5px 10px; font-size: 0.74rem; border-radius: 6px; background: #ffffff;">
                    All Time (<span id="cal-all-count">...</span>)
                  </button>
                </div>

              </div>

              <!-- Right: Active Date Filter Pill & Reset -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <span id="cal-active-badge" style="font-size: 0.76rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; background: #ffffff; color: var(--text-muted); border: 1px solid var(--border-color); display: inline-flex; align-items: center; gap: 6px;">
                  Showing All Time
                </span>
                <button class="btn btn-secondary" id="cal-clear-filter-btn" onclick="ArticlesPage.clearCalendarFilter()" style="padding: 4px 8px; font-size: 0.72rem; display: none;" title="Reset date filter">
                  Clear
                </button>
              </div>

            </div>

            <!-- Google Calendar-Style Drawer (Hidden by default, opens via Open Calendar) -->
            <div id="cal-grid-panel" style="display: none; padding: 18px 20px; background: #ffffff; border-bottom: 1px solid var(--border-color); transition: all 0.25s ease;">
              
              <div style="max-width: 900px; margin: 0 auto; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
                
                <!-- Calendar Drawer Header: Stepper, Month Title & Dedicated Close Button -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                  
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <button class="btn btn-secondary" onclick="ArticlesPage.prevMonth()" style="padding: 5px 10px; font-size: 0.8rem; background: #ffffff;" title="Previous Month">
                      &larr; Prev
                    </button>
                    <h4 id="cal-month-title" style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin: 0; min-width: 140px; text-align: center;">
                      October 2026
                    </h4>
                    <button class="btn btn-secondary" onclick="ArticlesPage.nextMonth()" style="padding: 5px 10px; font-size: 0.8rem; background: #ffffff;" title="Next Month">
                      Next &rarr;
                    </button>
                    <button class="btn btn-secondary" onclick="ArticlesPage.goToCurrentMonth()" style="padding: 4px 8px; font-size: 0.72rem; background: #ffffff; margin-left: 4px;" title="Jump to October 2026">
                      Current
                    </button>
                  </div>

                  <!-- Close Calendar Button in Header -->
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <button class="btn btn-secondary" onclick="ArticlesPage.filterCurrentCalendarMonth()" id="cal-filter-month-btn" style="padding: 5px 12px; font-size: 0.76rem; background: #ffffff;">
                      Filter This Month (<span id="cal-current-month-count">...</span>)
                    </button>
                    <button class="btn btn-secondary" onclick="ArticlesPage.closeCalendar()" style="display: flex; align-items: center; gap: 5px; padding: 5px 12px; font-size: 0.76rem; font-weight: 700; background: #ffffff; color: var(--text-main); border: 1px solid var(--border-color);" title="Close Calendar Drawer">
                      <i data-lucide="x" style="width: 13px; height: 13px; color: #dc2626;"></i> Close Calendar
                    </button>
                  </div>

                </div>

                <!-- 7-Day Weekday Names -->
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 6px; text-align: center; font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 4px; border-bottom: 1px solid var(--border-color);">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>

                <!-- Days of Month Grid -->
                <div id="cal-days-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px;">
                  <!-- Dynamic day cells injected here -->
                </div>

                <!-- Calendar Footer Bar inside drawer -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border-color); font-size: 0.74rem; color: var(--text-muted); flex-wrap: wrap; gap: 8px;">
                  <div style="display: flex; align-items: center; gap: 14px;">
                    <span style="display: inline-flex; align-items: center; gap: 5px;">
                      <span style="width: 8px; height: 8px; border-radius: 50%; background: #4F46E5;"></span> Researched / Published
                    </span>
                    <span style="display: inline-flex; align-items: center; gap: 5px;">
                      <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--border-color);"></span> No Stories
                    </span>
                  </div>

                  <div style="display: flex; align-items: center; gap: 8px;">
                    <button class="btn btn-secondary" onclick="ArticlesPage.clearCalendarFilter()" style="padding: 4px 10px; font-size: 0.74rem; background: #ffffff;">
                      Show All Time
                    </button>
                    <button class="btn btn-primary" onclick="ArticlesPage.closeCalendar()" style="padding: 4px 14px; font-size: 0.74rem; font-weight: 700;">
                      Done
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        <!-- 2. Integrated Filter & Search Toolbar -->
        <div class="glass-card" style="padding: 10px 16px; border-radius: 12px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
          
          <!-- Search Box -->
          <div style="position: relative; flex: 1; min-width: 240px; max-width: 420px;">
            <i data-lucide="search" style="position: absolute; left: 10px; top: 8px; color: var(--text-dim); width: 14px; height: 14px; pointer-events: none;"></i>
            <input type="text" id="articles-search-input" placeholder="Search headlines, publisher, or content..." value="${this.currentSearch}" style="width: 100%; padding: 6px 12px 6px 32px; border-radius: 7px; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-main); font-size: 0.8rem; outline: none;">
          </div>

          <!-- Filter Dropdowns & View Switcher -->
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            
            <!-- Source Filter -->
            <select id="source-filter-select" class="filter-select" style="padding: 5px 10px; border-radius: 7px; font-size: 0.78rem; font-weight: 600; background: #ffffff; border: 1px solid var(--border-color); color: var(--text-main);">
              <option value="all">🌐 All Sources</option>
            </select>

            <!-- NewsFlow Status Filter -->
            <select id="status-filter-select" class="filter-select" style="padding: 5px 10px; border-radius: 7px; font-size: 0.78rem; font-weight: 600; background: #ffffff; border: 1px solid var(--border-color); color: var(--text-main);">
              <option value="all" ${this.currentStatus === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="published" ${this.currentStatus === 'published' ? 'selected' : ''}>🌐 Live on Web</option>
              <option value="draft" ${this.currentStatus === 'draft' ? 'selected' : ''}>📝 Draft in Admin</option>
              <option value="pending" ${this.currentStatus === 'pending' ? 'selected' : ''}>⏳ Pending Sync</option>
            </select>

            <!-- Scope Filter -->
            <select id="run-scope-filter-select" class="filter-select" style="padding: 5px 10px; border-radius: 7px; font-size: 0.78rem; font-weight: 600; background: #ffffff; border: 1px solid var(--border-color); color: var(--text-main);">
              <option value="all" ${this.currentRunScope === 'all' ? 'selected' : ''}>All Scrapes</option>
              <option value="latest" ${this.currentRunScope === 'latest' ? 'selected' : ''}>Latest Run</option>
              <option value="last100" ${this.currentRunScope === 'last100' ? 'selected' : ''}>Last 100</option>
            </select>

            <!-- View Mode Switcher -->
            <div style="display: flex; background: var(--bg-surface); border-radius: 7px; border: 1px solid var(--border-color); padding: 2px;">
              <button id="view-table-btn" class="btn ${this.viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}" style="padding: 4px 10px; font-size: 0.74rem; border: none; border-radius: 5px; display: flex; align-items: center; gap: 4px;">
                <i data-lucide="table" style="width: 13px; height: 13px;"></i> Table
              </button>
              <button id="view-cards-btn" class="btn ${this.viewMode === 'cards' ? 'btn-primary' : 'btn-secondary'}" style="padding: 4px 10px; font-size: 0.74rem; border: none; border-radius: 5px; display: flex; align-items: center; gap: 4px;">
                <i data-lucide="layout-grid" style="width: 13px; height: 13px;"></i> Grid Cards
              </button>
            </div>

          </div>
        </div>

        <!-- 3. Content Feed Container (Table or Grid Cards) -->
        <div id="articles-view-container">
          <div class="glass-card" style="text-align: center; padding: 40px; border-radius: 12px; border: 1px solid var(--border-color);">
            <i data-lucide="loader-2" class="spin" style="width: 22px; height: 22px; margin-bottom: 6px;"></i>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Loading articles vault...</p>
          </div>
        </div>

        <!-- 4. Integrated Pagination Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 6px; font-size: 0.78rem; color: var(--text-muted); flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span id="pagination-info" style="font-weight: 600;">Showing 0–0 of 0 stories</span>
            <div style="display: flex; align-items: center; gap: 5px;">
              <span>Per page:</span>
              <select id="articles-limit-select" class="filter-select" style="padding: 3px 6px; font-size: 0.75rem; border-radius: 5px;">
                <option value="15" ${this.limitPerPage === 15 ? 'selected' : ''}>15</option>
                <option value="30" ${this.limitPerPage === 30 ? 'selected' : ''}>30</option>
                <option value="50" ${this.limitPerPage === 50 ? 'selected' : ''}>50</option>
                <option value="100" ${this.limitPerPage === 100 ? 'selected' : ''}>100</option>
              </select>
            </div>
          </div>

          <div style="display: flex; gap: 6px; align-items: center;">
            <button class="btn btn-secondary" id="prev-page-btn" style="padding: 4px 10px; font-size: 0.75rem;">&larr; Prev</button>
            <span id="page-num-badge" style="font-weight: 600; padding: 0 6px;">Page 1</span>
            <button class="btn btn-secondary" id="next-page-btn" style="padding: 4px 10px; font-size: 0.75rem;">Next &rarr;</button>
          </div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    this.bindEvents();

    await Promise.all([
      this.loadKpiMetrics(),
      this.loadCalendarData(),
      this.loadSourcesFilter(),
      this.loadArticles()
    ]);
  },

  bindEvents() {
    const searchInput = document.getElementById('articles-search-input');
    const sourceSelect = document.getElementById('source-filter-select');
    const statusSelect = document.getElementById('status-filter-select');
    const runScopeSelect = document.getElementById('run-scope-filter-select');
    const viewTableBtn = document.getElementById('view-table-btn');
    const viewCardsBtn = document.getElementById('view-cards-btn');
    const limitSelect = document.getElementById('articles-limit-select');
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');

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

  toggleCalendar() {
    if (this.calExpanded) {
      this.closeCalendar();
    } else {
      this.openCalendar();
    }
  },

  openCalendar() {
    this.calExpanded = true;
    const panel = document.getElementById('cal-grid-panel');
    const btn = document.getElementById('main-cal-toggle-btn');
    const btnText = document.getElementById('main-cal-btn-text');

    if (panel) panel.style.display = 'block';
    if (btn) {
      btn.className = 'btn btn-secondary';
      btn.style.background = '#ffffff';
      btn.style.border = '1px solid #dc2626';
      btn.style.color = '#dc2626';
    }
    if (btnText) btnText.textContent = 'Close Calendar';

    this.renderCalendarGrid();
    if (window.lucide) window.lucide.createIcons();
  },

  closeCalendar() {
    this.calExpanded = false;
    const panel = document.getElementById('cal-grid-panel');
    const btn = document.getElementById('main-cal-toggle-btn');
    const btnText = document.getElementById('main-cal-btn-text');

    if (panel) panel.style.display = 'none';
    if (btn) {
      btn.className = 'btn btn-primary';
      btn.style.background = '';
      btn.style.border = '';
      btn.style.color = '';
    }
    if (btnText) btnText.textContent = 'Open Calendar';
    if (window.lucide) window.lucide.createIcons();
  },

  async loadKpiMetrics() {
    try {
      const [dispatchRes, webRes] = await Promise.all([
        App.fetchApi('/api/dispatch/status').catch(() => null),
        App.fetchApi('/api/web/status').catch(() => null)
      ]);

      const elTotal = document.getElementById('kpi-total-articles');
      const elPhotos = document.getElementById('kpi-photos-count');
      const elSynced = document.getElementById('kpi-synced-count');
      const elLive = document.getElementById('kpi-live-count');

      if (dispatchRes && dispatchRes.node_counts) {
        if (elTotal) elTotal.textContent = dispatchRes.node_counts.ingested || '0';
        if (elPhotos) elPhotos.textContent = dispatchRes.node_counts.photos || '0';
        if (elSynced) elSynced.textContent = dispatchRes.node_counts.web_synced || '0';
      }

      if (webRes && webRes.stats) {
        if (elLive) elLive.textContent = `${webRes.stats.articles || 0} Live`;
      }
    } catch (e) {
      console.warn("KPI metrics warning:", e);
    }
  },

  async loadCalendarData() {
    try {
      const res = await App.fetchApi('/api/articles/dates');
      const dates = res.dates || [];
      const months = res.months || [];
      this.totalArticlesCount = res.total || 0;

      const dateMap = {};
      dates.forEach(d => {
        dateMap[d.date] = d.count;
      });
      this.dateCountsMap = dateMap;

      const monthMap = {};
      months.forEach(m => {
        monthMap[m.month] = m.count;
      });
      this.monthCountsMap = monthMap;
      this.monthsList = months;

      const elAll = document.getElementById('cal-all-count');
      if (elAll) elAll.textContent = this.totalArticlesCount;

      this.renderQuickMonths();
      if (this.calExpanded) {
        this.renderCalendarGrid();
      }
    } catch (e) {
      console.error("Failed to load calendar data:", e);
    }
  },

  renderQuickMonths() {
    const container = document.getElementById('cal-quick-months');
    if (!container) return;

    let html = `
      <button class="btn ${!this.selectedDate && !this.selectedMonth ? 'btn-primary' : 'btn-secondary'}" 
              id="btn-month-all" 
              onclick="ArticlesPage.clearCalendarFilter()" 
              style="padding: 4px 10px; font-size: 0.74rem; border-radius: 6px; ${!this.selectedDate && !this.selectedMonth ? '' : 'background: #ffffff;'}">
        All Time (${this.totalArticlesCount})
      </button>
    `;

    this.monthsList.forEach(m => {
      const [y, mon] = m.month.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthLabel = `${monthNames[parseInt(mon, 10) - 1]} ${y}`;
      const isSelected = (this.selectedMonth === m.month && !this.selectedDate);

      html += `
        <button class="btn ${isSelected ? 'btn-primary' : 'btn-secondary'}" 
                onclick="ArticlesPage.selectMonth('${m.month}')" 
                style="padding: 4px 10px; font-size: 0.74rem; border-radius: 6px; ${isSelected ? '' : 'background: #ffffff;'}">
          ${monthLabel} (${m.count})
        </button>
      `;
    });

    container.innerHTML = html;
  },

  renderCalendarGrid() {
    const gridEl = document.getElementById('cal-days-grid');
    const titleEl = document.getElementById('cal-month-title');
    const monthCountEl = document.getElementById('cal-current-month-count');
    if (!gridEl) return;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (titleEl) {
      titleEl.textContent = `${monthNames[this.calMonth]} ${this.calYear}`;
    }

    const mKey = `${this.calYear}-${String(this.calMonth + 1).padStart(2, '0')}`;
    const currentMonthStories = this.monthCountsMap[mKey] || 0;
    if (monthCountEl) {
      monthCountEl.textContent = currentMonthStories;
    }

    const firstDayIndex = new Date(this.calYear, this.calMonth, 1).getDay();
    const daysInMonth = new Date(this.calYear, this.calMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(this.calYear, this.calMonth, 0).getDate();

    let cellsHtml = '';

    // Prev month padding cells
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      cellsHtml += `
        <div style="height: 42px; padding: 4px 6px; border-radius: 6px; background: rgba(0,0,0,0.015); border: 1px dashed var(--border-color); opacity: 0.35; user-select: none; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 0.74rem; color: var(--text-dim); font-weight: 500;">${dayNum}</span>
        </div>
      `;
    }

    // Current month cells
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(this.calMonth + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateKey = `${this.calYear}-${mStr}-${dStr}`;
      const count = this.dateCountsMap[dateKey] || 0;
      const isSelected = (this.selectedDate === dateKey);

      let cellStyle = `height: 42px; padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border-color); background: #ffffff; display: flex; align-items: center; justify-content: space-between; transition: all 0.15s ease; cursor: pointer;`;
      
      if (isSelected) {
        cellStyle = `height: 42px; padding: 4px 8px; border-radius: 6px; border: 2px solid #4F46E5; background: rgba(79,70,229,0.14); display: flex; align-items: center; justify-content: space-between; box-shadow: 0 0 0 3px rgba(79,70,229,0.18); cursor: pointer;`;
      } else if (count > 0) {
        cellStyle = `height: 42px; padding: 4px 8px; border-radius: 6px; border: 1.5px solid rgba(79,70,229,0.35); background: rgba(79,70,229,0.06); display: flex; align-items: center; justify-content: space-between; cursor: pointer;`;
      }

      const dayNumberStyle = count > 0 
        ? `font-size: 0.8rem; font-weight: 800; color: ${isSelected ? '#4F46E5' : 'var(--text-main)'};` 
        : `font-size: 0.76rem; color: var(--text-dim); font-weight: 500;`;

      const badgeHtml = count > 0 ? `
        <span style="background: ${isSelected ? '#4F46E5' : 'rgba(79,70,229,0.9)'}; color: #ffffff; font-size: 0.68rem; font-weight: 800; padding: 2px 7px; border-radius: 10px; line-height: 1;">
          ${count}
        </span>
      ` : '';

      cellsHtml += `
        <div style="${cellStyle}" 
             onclick="ArticlesPage.selectDate('${dateKey}')" 
             onmouseenter="if (!${isSelected}) this.style.borderColor='#4F46E5'" 
             onmouseleave="if (!${isSelected}) this.style.borderColor='${count > 0 ? 'rgba(79,70,229,0.35)' : 'var(--border-color)'}'"
             title="${count > 0 ? `${count} stories researched on ${dateKey}` : `No stories on ${dateKey}`}">
          <span style="${dayNumberStyle}">${d}</span>
          ${badgeHtml}
        </div>
      `;
    }

    gridEl.innerHTML = cellsHtml;
    this.updateActiveBadge();
  },

  updateActiveBadge() {
    const badge = document.getElementById('cal-active-badge');
    const clearBtn = document.getElementById('cal-clear-filter-btn');
    if (!badge) return;

    if (this.selectedDate) {
      const parts = this.selectedDate.split('-');
      const dObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formatted = `${monthNames[dObj.getMonth()]} ${String(dObj.getDate()).padStart(2, '0')}, ${dObj.getFullYear()}`;
      const count = this.dateCountsMap[this.selectedDate] || 0;
      
      badge.innerHTML = `📅 Date: <strong>${formatted}</strong> (${count} stories)`;
      badge.style.background = 'rgba(79,70,229,0.1)';
      badge.style.color = '#4F46E5';
      badge.style.borderColor = 'rgba(79,70,229,0.3)';
      if (clearBtn) clearBtn.style.display = 'inline-block';
    } else if (this.selectedMonth) {
      const [y, mon] = this.selectedMonth.split('-');
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const formatted = `${monthNames[parseInt(mon, 10) - 1]} ${y}`;
      const count = this.monthCountsMap[this.selectedMonth] || 0;
      
      badge.innerHTML = `📅 Month: <strong>${formatted}</strong> (${count} stories)`;
      badge.style.background = 'rgba(6,182,212,0.1)';
      badge.style.color = '#0891b2';
      badge.style.borderColor = 'rgba(6,182,212,0.3)';
      if (clearBtn) clearBtn.style.display = 'inline-block';
    } else {
      badge.textContent = `Showing All Time (${this.totalArticlesCount} stories)`;
      badge.style.background = '#ffffff';
      badge.style.color = 'var(--text-muted)';
      badge.style.borderColor = 'var(--border-color)';
      if (clearBtn) clearBtn.style.display = 'none';
    }
  },

  selectDate(dateKey) {
    this.selectedDate = dateKey;
    this.selectedMonth = null;
    this.currentPageNum = 1;

    const [y, m] = dateKey.split('-');
    this.calYear = parseInt(y, 10);
    this.calMonth = parseInt(m, 10) - 1;

    this.renderQuickMonths();
    if (this.calExpanded) {
      this.renderCalendarGrid();
    } else {
      this.updateActiveBadge();
    }
    this.loadArticles();
  },

  selectMonth(monthStr) {
    this.selectedMonth = monthStr;
    this.selectedDate = null;
    this.currentPageNum = 1;

    const [y, m] = monthStr.split('-');
    this.calYear = parseInt(y, 10);
    this.calMonth = parseInt(m, 10) - 1;

    this.renderQuickMonths();
    if (this.calExpanded) {
      this.renderCalendarGrid();
    } else {
      this.updateActiveBadge();
    }
    this.loadArticles();
  },

  filterCurrentCalendarMonth() {
    const mStr = String(this.calMonth + 1).padStart(2, '0');
    const monthKey = `${this.calYear}-${mStr}`;
    this.selectMonth(monthKey);
  },

  goToCurrentMonth() {
    this.calYear = 2026;
    this.calMonth = 9; // October
    this.renderCalendarGrid();
  },

  clearCalendarFilter() {
    this.selectedDate = null;
    this.selectedMonth = null;
    this.currentPageNum = 1;

    this.renderQuickMonths();
    if (this.calExpanded) {
      this.renderCalendarGrid();
    } else {
      this.updateActiveBadge();
    }
    this.loadArticles();
  },

  prevMonth() {
    if (this.calMonth === 0) {
      this.calMonth = 11;
      this.calYear--;
    } else {
      this.calMonth--;
    }
    this.renderCalendarGrid();
  },

  nextMonth() {
    if (this.calMonth === 11) {
      this.calMonth = 0;
      this.calYear++;
    } else {
      this.calMonth++;
    }
    this.renderCalendarGrid();
  },

  async loadSourcesFilter() {
    try {
      const stats = await App.fetchApi('/api/stats');
      if (stats && stats.sources) {
        const sourceSelect = document.getElementById('source-filter-select');
        if (!sourceSelect) return;
        
        const sources = Object.keys(stats.sources).sort();
        this.sourcesList = sources;
        
        let html = '<option value="all">🌐 All Sources (' + sources.length + ')</option>';
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

  async loadArticles() {
    const viewContainer = document.getElementById('articles-view-container');
    const paginationInfo = document.getElementById('pagination-info');
    const pageBadge = document.getElementById('page-num-badge');
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    if (!viewContainer) return;

    try {
      let url = `/api/articles?page=${this.currentPageNum}&limit=${this.limitPerPage}&run_scope=${this.currentRunScope}`;
      if (this.currentStatus !== 'all') url += `&status=${this.currentStatus}`;
      if (this.currentSource !== 'all') url += `&source=${encodeURIComponent(this.currentSource)}`;
      if (this.selectedDate) url += `&date_str=${this.selectedDate}`;
      if (this.selectedMonth) url += `&month_str=${this.selectedMonth}`;
      if (this.currentSearch) url += `&search=${encodeURIComponent(this.currentSearch)}`;

      const data = await App.fetchApi(url);
      const articles = data.articles || [];
      const pag = data.pagination || { total: 0, page: 1, limit: this.limitPerPage, total_pages: 1 };

      if (paginationInfo) {
        const startIdx = pag.total === 0 ? 0 : (pag.page - 1) * pag.limit + 1;
        const endIdx = Math.min(pag.page * pag.limit, pag.total);
        paginationInfo.textContent = `Showing ${startIdx}–${endIdx} of ${pag.total} stories`;
      }
      if (pageBadge) {
        pageBadge.textContent = `Page ${pag.page} of ${pag.total_pages || 1}`;
      }
      if (prevBtn) prevBtn.disabled = pag.page <= 1;
      if (nextBtn) nextBtn.disabled = pag.page >= (pag.total_pages || 1);

      if (!articles || articles.length === 0) {
        viewContainer.innerHTML = `
          <div class="glass-card" style="text-align: center; padding: 45px 20px; border-radius: 12px; border: 1px solid var(--border-color);">
            <i data-lucide="inbox" style="width: 28px; height: 28px; margin-bottom: 8px; opacity: 0.6;"></i>
            <h4 style="font-family: var(--font-serif); font-size: 1.15rem; margin-bottom: 6px;">No stories match this date or filter</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); max-width: 400px; margin: 0 auto 14px;">
              Try tapping another date on the calendar, or reset filters to browse all stories.
            </p>
            <button class="btn btn-secondary" onclick="ArticlesPage.clearCalendarFilter()" style="padding: 5px 12px; font-size: 0.78rem;">
              Reset Calendar &amp; Show All
            </button>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

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

  renderMasterTable(articles) {
    return `
      <div class="glass-card" style="padding: 0; overflow: hidden; border-radius: 12px; border: 1px solid var(--border-color);">
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.82rem;">
            <thead>
              <tr style="background: var(--bg-surface); border-bottom: 1.5px solid var(--border-color); color: var(--text-muted); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;">
                <th style="padding: 10px 14px; width: 50px; text-align: center;"># ID</th>
                <th style="padding: 10px 12px; width: 68px;">Photo</th>
                <th style="padding: 10px 14px; width: 140px;">Source &amp; Beat</th>
                <th style="padding: 10px 16px; min-width: 320px;">Headline &amp; Context Narrative</th>
                <th style="padding: 10px 12px; width: 130px; text-align: center;">NewsFlow Status</th>
                <th style="padding: 10px 14px; width: 120px;">Date Scraped</th>
                <th style="padding: 10px 14px; width: 120px; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${articles.map(a => {
                const domain = a.source_domain || (a.url ? a.url.split('/')[2] : '');
                const cleanExcerpt = a.refined_body || '';
                const imgPath = a.scraped_image_path || a.scraped_image_url || a.image_url;
                
                const isPublished = a.web_status === 'published';
                const isDraft = a.web_posted && !isPublished;
                const liveUrl = a.web_url || (a.web_slug ? `http://localhost:3000/article/${a.web_slug}` : null);

                const statusBadge = isPublished ? `
                  <span class="badge" style="background: rgba(16,185,129,0.12); color: #059669; border: 1px solid rgba(16,185,129,0.3); font-size: 0.7rem; font-weight: 700;">
                    &#127760; Live on Web
                  </span>
                ` : isDraft ? `
                  <span class="badge" style="background: rgba(79,70,229,0.1); color: #4F46E5; border: 1px solid rgba(79,70,229,0.25); font-size: 0.7rem; font-weight: 700;">
                    &#128221; Draft in Admin
                  </span>
                ` : `
                  <span class="badge" style="background: rgba(100,100,100,0.08); color: var(--text-muted); border: 1px solid var(--border-color); font-size: 0.7rem; font-weight: 600;">
                    &#8987; Pending Sync
                  </span>
                `;

                const thumbnailHtml = imgPath ? `
                  <img src="${imgPath}" alt="Photo" style="width: 54px; height: 38px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-color);" onerror="this.outerHTML='<div style=\\'width:54px;height:38px;border-radius:6px;background:var(--bg-surface);display:flex;align-items:center;justify-content:center;font-size:0.9rem;color:var(--text-dim);\\'>📷</div>'" />
                ` : `
                  <div style="width: 54px; height: 38px; border-radius: 6px; background: var(--bg-surface); border: 1px dashed var(--border-color); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; color: var(--text-dim);" title="No photo">
                    📷
                  </div>
                `;

                return `
                  <tr style="border-bottom: 1px solid var(--border-color); transition: background 0.15s ease;" onmouseenter="this.style.background='var(--bg-surface)'" onmouseleave="this.style.background='transparent'">
                    
                    <!-- ID -->
                    <td style="padding: 10px 14px; text-align: center; font-weight: 700; color: var(--text-muted); font-size: 0.75rem;">
                      #${a.id}
                    </td>

                    <!-- Photo Thumbnail -->
                    <td style="padding: 10px 12px;">
                      ${thumbnailHtml}
                    </td>

                    <!-- Source & Beat -->
                    <td style="padding: 10px 14px; vertical-align: middle;">
                      <div style="display: flex; flex-direction: column; gap: 3px; align-items: flex-start;">
                        <span class="source-pill" style="font-size: 0.68rem; font-weight: 700; padding: 2px 6px;">${a.source}</span>
                        ${domain ? `
                          <a href="${a.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.7rem; color: var(--text-dim); text-decoration: none; display: flex; align-items: center; gap: 2px;" title="Visit ${domain}">
                            ${domain} &#8599;
                          </a>
                        ` : ''}
                      </div>
                    </td>

                    <!-- Headline & Excerpt -->
                    <td style="padding: 10px 16px; vertical-align: middle;">
                      <div style="display: flex; flex-direction: column; gap: 3px;">
                        <a href="javascript:void(0)" onclick="App.openArticleModal(${a.id})" style="font-family: var(--font-serif); font-size: 0.92rem; font-weight: 600; color: var(--text-main); line-height: 1.35; text-decoration: none;" onmouseenter="this.style.color='#4F46E5'" onmouseleave="this.style.color='var(--text-main)'">
                          ${a.title}
                        </a>
                        ${cleanExcerpt ? `
                          <p style="font-size: 0.76rem; color: var(--text-muted); line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; margin: 0;">
                            ${cleanExcerpt}
                          </p>
                        ` : ''}
                      </div>
                    </td>

                    <!-- NewsFlow Status -->
                    <td style="padding: 10px 12px; text-align: center; vertical-align: middle;">
                      ${statusBadge}
                    </td>

                    <!-- Date Scraped -->
                    <td style="padding: 10px 14px; vertical-align: middle; font-size: 0.74rem; color: var(--text-muted); white-space: nowrap;">
                      ${App.formatTimestamp(a.scraped_at)}
                    </td>

                    <!-- Actions -->
                    <td style="padding: 10px 14px; text-align: right; vertical-align: middle;">
                      <div style="display: flex; align-items: center; justify-content: flex-end; gap: 5px;">
                        ${liveUrl ? `
                          <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.72rem; text-decoration: none; color: #059669;" title="View Live on Web">
                            Live &#8599;
                          </a>
                        ` : ''}
                        <button class="btn btn-secondary" onclick="App.openArticleModal(${a.id})" style="padding: 4px 9px; font-size: 0.72rem;" title="Inspect article details">
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
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 14px;">
        ${articles.map(a => {
          const domain = a.source_domain || (a.url ? a.url.split('/')[2] : '');
          const cleanExcerpt = a.refined_body || '';
          const imgPath = a.scraped_image_path || a.scraped_image_url || a.image_url;
          const isPublished = a.web_status === 'published';
          const isDraft = a.web_posted && !isPublished;
          const liveUrl = a.web_url || (a.web_slug ? `http://localhost:3000/article/${a.web_slug}` : null);

          const statusBadge = isPublished ? `
            <span class="badge" style="background: rgba(16,185,129,0.12); color: #059669; border: 1px solid rgba(16,185,129,0.3); font-size: 0.68rem; font-weight: 700;">
              Live on Web
            </span>
          ` : isDraft ? `
            <span class="badge" style="background: rgba(79,70,229,0.1); color: #4F46E5; border: 1px solid rgba(79,70,229,0.25); font-size: 0.68rem; font-weight: 700;">
              Draft in Admin
            </span>
          ` : `
            <span class="badge" style="background: rgba(100,100,100,0.08); color: var(--text-muted); border: 1px solid var(--border-color); font-size: 0.68rem; font-weight: 600;">
              Pending Sync
            </span>
          `;

          return `
            <div class="glass-card" style="display: flex; flex-direction: column; justify-content: space-between; gap: 12px; padding: 14px; border-radius: 12px; border: 1px solid var(--border-color); transition: border-color 0.15s ease;" onmouseenter="this.style.borderColor='rgba(79,70,229,0.35)'" onmouseleave="this.style.borderColor='var(--border-color)'">
              
              <div>
                <!-- Top Meta Row -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="source-pill" style="font-size: 0.68rem; font-weight: 700; padding: 2px 6px;">${a.source}</span>
                    ${domain ? `
                      <a href="${a.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.7rem; color: var(--text-muted); text-decoration: none;">
                        ${domain} &#8599;
                      </a>
                    ` : ''}
                  </div>
                  <div>
                    ${statusBadge}
                  </div>
                </div>

                <!-- Headline -->
                <h4 style="font-family: var(--font-serif); font-size: 1.02rem; font-weight: 600; line-height: 1.35; color: var(--text-main); margin-bottom: 8px; cursor: pointer;" onclick="App.openArticleModal(${a.id})">
                  ${a.title}
                </h4>

                <!-- Cover Image Preview -->
                ${imgPath ? `
                  <div style="margin-bottom: 8px; border-radius: 8px; overflow: hidden; height: 160px; border: 1px solid var(--border-color); position: relative; background: var(--bg-surface);">
                    <img src="${imgPath}" alt="Editorial Photo" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.style.display='none'">
                  </div>
                ` : ''}

                <!-- Context Excerpt -->
                ${cleanExcerpt ? `
                  <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0;">
                    ${cleanExcerpt}
                  </p>
                ` : ''}
              </div>

              <!-- Footer Row: Date & Action Links -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 8px;">
                <span style="font-size: 0.72rem; color: var(--text-muted);">
                  📅 ${App.formatTimestamp(a.scraped_at)}
                </span>

                <div style="display: flex; align-items: center; gap: 6px;">
                  ${liveUrl ? `
                    <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.72rem; text-decoration: none; color: #059669;">
                      Live &#8599;
                    </a>
                  ` : ''}
                  <button class="btn btn-secondary" onclick="App.openArticleModal(${a.id})" style="padding: 4px 10px; font-size: 0.74rem;">
                    Inspect
                  </button>
                  <button class="btn-icon danger" style="width: 26px; height: 26px;" onclick="ArticlesPage.deleteArticle(${a.id}, event)" title="Delete Article">
                    <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
                  </button>
                </div>
              </div>

            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  async deleteArticle(id, event) {
    if (event) event.stopPropagation();
    if (!confirm(`Are you sure you want to delete article #${id}?`)) return;

    try {
      await App.fetchApi(`/api/articles/${id}`, { method: 'DELETE' });
      App.showToast(`Deleted article #${id}`, 'info');
      await this.loadCalendarData();
      await this.loadArticles();
      await this.loadKpiMetrics();
    } catch (err) {
      App.showToast(`Failed to delete article: ${err.message}`, 'error');
    }
  }
};
