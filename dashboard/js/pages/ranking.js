/**
 * News Website Desk
 * Unified editorial command center for reviewing scraped news, inspecting authentic photo packaging,
 * and synchronizing records directly to NewsFlow Web & Admin (:3000).
 */
const RankingPage = {
  articles: [],
  filteredArticles: [],
  selectedIds: new Set(),
  currentFilter: 'all', // 'all' | 'pending' | 'draft' | 'published'
  currentCategory: 'all',
  searchQuery: '',
  currentPage: 1,
  pageSize: 25,
  webStatus: null,

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 1320px; margin: 0 auto; padding-bottom: 40px;">
        
        <!-- Unified Editorial Control Card (Single Cohesive Command Bar) -->
        <div class="glass-card" style="padding: 0; overflow: hidden; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
          
          <!-- Top Row: Desk Title, Live Status & Primary Workflow Actions -->
          <div style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; background: #ffffff;">
            <div>
              <div style="display: flex; align-items: center; gap: 9px; margin-bottom: 3px;">
                <h3 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin: 0;">
                  NewsFlow Editorial Desk
                </h3>
                <span id="web-status-badge" style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: var(--bg-surface); color: var(--text-muted); border: 1px solid var(--border-color);">
                  Checking website (:3000)...
                </span>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">
                Review scraped stories, verify authentic photos, and sync line-by-line to NewsFlow Admin as draft records.
              </p>
            </div>

            <!-- Action Button Group -->
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <button class="btn btn-primary btn-glow" id="upload-pending-btn" onclick="RankingPage.uploadPending()" style="display: flex; align-items: center; gap: 6px; padding: 7px 16px; font-weight: 700; font-size: 0.82rem;">
                <i data-lucide="send" style="width: 14px; height: 14px;"></i> Send Pending (<span id="btn-pending-count">0</span>) to Admin
              </button>

              <div style="display: flex; gap: 2px; background: var(--bg-surface); padding: 2px; border-radius: 8px; border: 1px solid var(--border-color);">
                <a href="http://localhost:3000/admin" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.76rem; border: none; background: transparent; text-decoration: none; display: flex; align-items: center; gap: 4px; color: var(--text-main);" title="Open NewsFlow Admin Cockpit">
                  <i data-lucide="shield-check" style="width: 13px; height: 13px; color: #10B981;"></i> Admin ↗
                </a>
                <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.76rem; border: none; background: transparent; text-decoration: none; display: flex; align-items: center; gap: 4px; color: var(--text-main);" title="Open Public Website">
                  <i data-lucide="globe" style="width: 13px; height: 13px; color: #4F46E5;"></i> Web ↗
                </a>
              </div>

              <button class="btn btn-secondary" onclick="RankingPage.triggerBackfill()" id="fetch-photos-btn" style="padding: 6px 11px; font-size: 0.76rem; display: flex; align-items: center; gap: 4px;" title="Scrape and cache authentic editorial photos for stories missing photos">
                <i data-lucide="camera" style="width: 13px; height: 13px;"></i> Photos
              </button>
              <button class="btn btn-secondary" onclick="RankingPage.loadData()" style="padding: 6px 10px; font-size: 0.76rem; display: flex; align-items: center; gap: 4px;" title="Refresh news stream">
                <i data-lucide="refresh-cw" style="width: 13px; height: 13px;"></i>
              </button>
            </div>
          </div>

          <!-- Bottom Row: Integrated Segmented Filters & Search (Unified inside the card) -->
          <div style="padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; background: var(--bg-surface); border-top: 1px solid var(--border-color);">
            
            <!-- Segmented Status Tabs -->
            <div style="display: flex; align-items: center; gap: 3px; background: #ffffff; padding: 3px; border-radius: 8px; border: 1px solid var(--border-color);">
              <button id="filter-all-btn" class="btn btn-primary" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 6px; font-weight: 600;" onclick="RankingPage.setFilter('all')">
                All <span id="tab-count-all" style="margin-left: 3px; padding: 1px 5px; border-radius: 10px; background: rgba(0,0,0,0.08); font-size: 0.68rem; font-weight: 700;">0</span>
              </button>
              <button id="filter-pending-btn" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 6px; border: none; background: transparent; font-weight: 600;" onclick="RankingPage.setFilter('pending')">
                Pending <span id="tab-count-pending" style="margin-left: 3px; padding: 1px 5px; border-radius: 10px; background: rgba(217,119,87,0.14); color: var(--primary-purple); font-size: 0.68rem; font-weight: 700;">0</span>
              </button>
              <button id="filter-draft-btn" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 6px; border: none; background: transparent; font-weight: 600;" onclick="RankingPage.setFilter('draft')">
                Drafts <span id="tab-count-draft" style="margin-left: 3px; padding: 1px 5px; border-radius: 10px; background: rgba(0,0,0,0.06); font-size: 0.68rem; font-weight: 700;">0</span>
              </button>
              <button id="filter-published-btn" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 6px; border: none; background: transparent; font-weight: 600;" onclick="RankingPage.setFilter('published')">
                Live <span id="tab-count-published" style="margin-left: 3px; padding: 1px 5px; border-radius: 10px; background: rgba(16,185,129,0.14); color: #059669; font-size: 0.68rem; font-weight: 700;">0</span>
              </button>
            </div>

            <!-- Category Selector & Search Box -->
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <select id="desk-category-filter" class="filter-select" style="padding: 5px 10px; font-size: 0.78rem; border-radius: 7px; background: #ffffff; border: 1px solid var(--border-color); color: var(--text-main);" onchange="RankingPage.setCategory(this.value)">
                <option value="all">All Categories</option>
                <option value="AI & Robotics">AI &amp; Robotics</option>
                <option value="Tech & Innovation">Tech &amp; Innovation</option>
                <option value="Gadgets & Hardware">Gadgets &amp; Hardware</option>
                <option value="Startups & VC">Startups &amp; VC</option>
                <option value="Policy & Big Tech">Policy &amp; Big Tech</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>

              <div style="position: relative;">
                <input type="text" id="desk-search-input" placeholder="Search stories..." class="filter-select" style="padding: 5px 10px 5px 28px; font-size: 0.78rem; width: 210px; border-radius: 7px; background: #ffffff; border: 1px solid var(--border-color);" oninput="RankingPage.onSearch(this.value)" />
                <i data-lucide="search" style="position: absolute; left: 8px; top: 7px; width: 13px; height: 13px; color: var(--text-dim);"></i>
              </div>
            </div>

          </div>

        </div>

        <!-- Bulk Selection Floating Bar (Activates when stories are checked) -->
        <div id="bulk-actions-bar" style="display: none; background: #2B2622; color: #FAF7F2; padding: 10px 18px; border-radius: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; box-shadow: 0 4px 14px rgba(0,0,0,0.12);">
          <div style="display: flex; align-items: center; gap: 12px; font-size: 0.82rem;">
            <span><strong id="bulk-selected-count">0</strong> stories selected</span>
            <button class="btn btn-secondary" onclick="RankingPage.clearSelection()" style="padding: 3px 8px; font-size: 0.72rem; color: #FAF7F2; border-color: rgba(255,255,255,0.2);">Clear</button>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-primary" onclick="RankingPage.uploadSelected('draft')" style="padding: 5px 14px; font-size: 0.78rem;">Send to Admin (Draft)</button>
            <button class="btn btn-secondary" onclick="RankingPage.uploadSelected('published')" style="padding: 5px 14px; font-size: 0.78rem; color: #10B981; border-color: rgba(16,185,129,0.4);">Publish Live</button>
          </div>
        </div>

        <!-- High-Density Stories Feed Table -->
        <div class="glass-card" style="padding: 0; overflow: hidden; border-radius: 12px; border: 1px solid var(--border-color);">
          <!-- Table Header -->
          <div style="display: grid; grid-template-columns: 36px 64px 1fr 140px 150px; align-items: center; gap: 12px; padding: 10px 16px; background: var(--bg-surface); border-bottom: 1px solid var(--border-color); font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">
            <div style="text-align: center;">
              <input type="checkbox" id="select-all-checkbox" onchange="RankingPage.toggleSelectAll(this.checked)" title="Select all on this page" style="cursor: pointer;" />
            </div>
            <div>Photo</div>
            <div>Story &amp; Publisher</div>
            <div style="text-align: center;">NewsFlow Status</div>
            <div style="text-align: right;">Actions</div>
          </div>

          <!-- Feed Container -->
          <div id="desk-stories-list">
            <div style="padding: 40px; text-align: center; color: var(--text-muted);">
              <i data-lucide="loader-2" class="spin" style="width: 22px; height: 22px; margin-bottom: 6px;"></i>
              <p style="margin: 0; font-size: 0.85rem;">Loading stories from news vault...</p>
            </div>
          </div>
        </div>

        <!-- Pagination Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 4px; font-size: 0.78rem; color: var(--text-muted); flex-wrap: wrap; gap: 10px;">
          <div id="desk-pagination-info">Showing 0 of 0 stories</div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button class="btn btn-secondary" id="page-prev-btn" onclick="RankingPage.prevPage()" style="padding: 4px 10px; font-size: 0.75rem;">&larr; Prev</button>
            <span id="page-indicator" style="font-weight: 600; padding: 0 6px;">Page 1</span>
            <button class="btn btn-secondary" id="page-next-btn" onclick="RankingPage.nextPage()" style="padding: 4px 10px; font-size: 0.75rem;">Next &rarr;</button>
          </div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    await this.checkWebStatus();
    await this.loadData();
  },

  async checkWebStatus() {
    const badge = document.getElementById('web-status-badge');
    try {
      const res = await App.fetchApi('/api/web/status');
      this.webStatus = res;
      if (badge) {
        if (res.online) {
          badge.innerHTML = `<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#10B981; margin-right:4px;"></span> Online (${res.stats?.articles || 0} on :3000)`;
          badge.style.background = 'rgba(16,185,129,0.1)';
          badge.style.color = '#059669';
          badge.style.borderColor = 'rgba(16,185,129,0.25)';
        } else {
          badge.innerHTML = `⚠️ Website Offline (localhost:3000)`;
          badge.style.background = 'rgba(198,40,40,0.1)';
          badge.style.color = 'var(--status-failed)';
          badge.style.borderColor = 'rgba(198,40,40,0.25)';
        }
      }
    } catch (e) {
      if (badge) {
        badge.innerHTML = `⚠️ Website Unreachable`;
        badge.style.background = 'rgba(198,40,40,0.1)';
        badge.style.color = 'var(--status-failed)';
      }
    }
  },

  async loadData() {
    const listEl = document.getElementById('desk-stories-list');
    try {
      const data = await App.fetchApi('/api/web/articles?limit=300&filter=all');
      this.articles = data.articles || [];
      this.updateCounts();
      this.applyFilterAndRender();
    } catch (e) {
      if (listEl) {
        listEl.innerHTML = `<div style="padding: 30px; text-align: center; color: var(--status-failed);">Failed to load news stories: ${e.message}</div>`;
      }
    }
  },

  updateCounts() {
    const total = this.articles.length;
    const pending = this.articles.filter(a => !a.web_posted).length;
    const published = this.articles.filter(a => (a.web_status === 'published')).length;
    const draft = this.articles.filter(a => a.web_posted && a.web_status !== 'published').length;

    const elAll = document.getElementById('tab-count-all');
    const elPend = document.getElementById('tab-count-pending');
    const elDraft = document.getElementById('tab-count-draft');
    const elPub = document.getElementById('tab-count-published');
    const btnPend = document.getElementById('btn-pending-count');

    if (elAll) elAll.textContent = total;
    if (elPend) elPend.textContent = pending;
    if (elDraft) elDraft.textContent = draft;
    if (elPub) elPub.textContent = published;
    if (btnPend) btnPend.textContent = pending;
  },

  setFilter(filter) {
    this.currentFilter = filter;
    this.currentPage = 1;
    ['all', 'pending', 'draft', 'published'].forEach(f => {
      const btn = document.getElementById(`filter-${f}-btn`);
      if (btn) {
        if (f === filter) {
          btn.className = 'btn btn-primary';
          btn.style.border = '';
          btn.style.background = '';
        } else {
          btn.className = 'btn btn-secondary';
          btn.style.border = 'none';
          btn.style.background = 'transparent';
        }
      }
    });
    this.applyFilterAndRender();
  },

  setCategory(cat) {
    this.currentCategory = cat;
    this.currentPage = 1;
    this.applyFilterAndRender();
  },

  onSearch(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.currentPage = 1;
    this.applyFilterAndRender();
  },

  applyFilterAndRender() {
    let list = this.articles;

    if (this.currentFilter === 'pending') {
      list = list.filter(a => !a.web_posted);
    } else if (this.currentFilter === 'draft') {
      list = list.filter(a => a.web_posted && a.web_status !== 'published');
    } else if (this.currentFilter === 'published') {
      list = list.filter(a => a.web_status === 'published');
    }

    if (this.currentCategory !== 'all') {
      list = list.filter(a => a.category === this.currentCategory);
    }

    if (this.searchQuery) {
      list = list.filter(a =>
        (a.title && a.title.toLowerCase().includes(this.searchQuery)) ||
        (a.original_title && a.original_title.toLowerCase().includes(this.searchQuery)) ||
        (a.source && a.source.toLowerCase().includes(this.searchQuery)) ||
        (a.body && a.body.toLowerCase().includes(this.searchQuery))
      );
    }

    this.filteredArticles = list;
    this.renderPage();
  },

  renderPage() {
    const listEl = document.getElementById('desk-stories-list');
    const infoEl = document.getElementById('desk-pagination-info');
    const indicatorEl = document.getElementById('page-indicator');
    const prevBtn = document.getElementById('page-prev-btn');
    const nextBtn = document.getElementById('page-next-btn');
    const selectAllBox = document.getElementById('select-all-checkbox');

    if (!listEl) return;

    const total = this.filteredArticles.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.currentPage > totalPages) this.currentPage = totalPages;

    const startIdx = (this.currentPage - 1) * this.pageSize;
    const pageItems = this.filteredArticles.slice(startIdx, startIdx + this.pageSize);

    if (infoEl) {
      infoEl.textContent = total === 0 ? 'No stories match filter' : `Showing ${startIdx + 1}–${Math.min(startIdx + this.pageSize, total)} of ${total} stories`;
    }
    if (indicatorEl) indicatorEl.textContent = `Page ${this.currentPage} of ${totalPages}`;
    if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
    if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;

    if (selectAllBox) {
      const allChecked = pageItems.length > 0 && pageItems.every(a => this.selectedIds.has(a.id));
      selectAllBox.checked = allChecked;
    }

    if (pageItems.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 45px; text-align: center; color: var(--text-muted);">
          <i data-lucide="inbox" style="width: 28px; height: 28px; margin-bottom: 8px; opacity: 0.6;"></i>
          <p style="margin: 0; font-size: 0.88rem;">No stories match this filter or search query.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    listEl.innerHTML = pageItems.map(art => {
      const isSelected = this.selectedIds.has(art.id);
      const imgPath = art.scraped_image_path || art.scraped_image_url;
      const isPublished = art.web_status === 'published';
      const isDraft = art.web_posted && !isPublished;
      const liveUrl = art.web_url || (art.web_slug ? `http://localhost:3000/article/${art.web_slug}` : null);

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
        <img src="${imgPath}" alt="Thumbnail" style="width: 58px; height: 42px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-color);" onerror="this.outerHTML='<div style=\\'width:58px;height:42px;border-radius:6px;background:var(--bg-surface);display:flex;align-items:center;justify-content:center;font-size:1rem;color:var(--text-dim);\\'>📷</div>'" />
      ` : `
        <div style="width: 58px; height: 42px; border-radius: 6px; background: var(--bg-surface); border: 1px dashed var(--border-color); display: flex; align-items: center; justify-content: center; font-size: 1rem; color: var(--text-dim);" title="No photo">
          📷
        </div>
      `;

      return `
        <div class="desk-story-row" style="display: grid; grid-template-columns: 36px 64px 1fr 140px 150px; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--border-color); background: ${isSelected ? 'rgba(79,70,229,0.04)' : '#ffffff'}; transition: background 0.15s ease;" onmouseenter="this.style.background='var(--bg-card-hover)'" onmouseleave="this.style.background='${isSelected ? 'rgba(79,70,229,0.04)' : '#ffffff'}'">
          
          <!-- Checkbox -->
          <div style="text-align: center;">
            <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="RankingPage.toggleSelect(${art.id}, this.checked)" style="cursor: pointer;" />
          </div>

          <!-- Photo Thumbnail -->
          <div>
            ${thumbnailHtml}
          </div>

          <!-- Story Details -->
          <div style="min-width: 0;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px; flex-wrap: wrap;">
              <span class="source-pill" style="font-size: 0.65rem; padding: 2px 6px;">${art.source}</span>
              <span style="font-size: 0.68rem; color: var(--text-muted); background: var(--bg-surface); border: 1px solid var(--border-color); padding: 1.5px 6px; border-radius: 4px;">
                ${art.category || 'Tech'}
              </span>
              <span style="font-size: 0.68rem; color: var(--text-dim);">
                ${art.scraped_at ? App.formatTimestamp(art.scraped_at) : 'Recent'}
              </span>
            </div>
            <a href="javascript:void(0)" onclick="App.openArticleModal(${art.id})" style="font-family: var(--font-serif); font-size: 0.94rem; font-weight: 600; color: var(--text-main); text-decoration: none; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 1.35;" onmouseenter="this.style.color='#4F46E5'" onmouseleave="this.style.color='var(--text-main)'" title="${(art.title || '').replace(/"/g, '&quot;')}">
              ${art.title}
            </a>
          </div>

          <!-- NewsFlow Status -->
          <div style="text-align: center;">
            ${statusBadge}
          </div>

          <!-- Actions -->
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 5px;">
            ${liveUrl ? `
              <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.72rem; text-decoration: none; display: inline-flex; align-items: center; gap: 3px; color: #059669;" title="View Live on Website">
                Live &#8599;
              </a>
            ` : ''}
            <button class="btn btn-secondary" onclick="App.openArticleModal(${art.id})" style="padding: 4px 9px; font-size: 0.72rem;" title="Inspect article details, full text & packaging">
              Inspect
            </button>
            ${!art.web_posted ? `
              <button class="btn btn-primary" onclick="RankingPage.uploadArticle(${art.id}, 'draft')" id="row-btn-${art.id}" style="padding: 4px 9px; font-size: 0.72rem; font-weight: 700;" title="Send to NewsFlow Admin">
                Send
              </button>
            ` : `
              <button class="btn-icon" onclick="RankingPage.uploadArticle(${art.id}, 'draft')" title="Resync to Admin" style="width: 26px; height: 26px;">
                <i data-lucide="rotate-cw" style="width: 12px; height: 12px;"></i>
              </button>
            `}
          </div>

        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  toggleSelect(articleId, isChecked) {
    if (isChecked) {
      this.selectedIds.add(articleId);
    } else {
      this.selectedIds.delete(articleId);
    }
    this.updateBulkActionBar();
  },

  toggleSelectAll(isChecked) {
    const startIdx = (this.currentPage - 1) * this.pageSize;
    const pageItems = this.filteredArticles.slice(startIdx, startIdx + this.pageSize);
    pageItems.forEach(a => {
      if (isChecked) {
        this.selectedIds.add(a.id);
      } else {
        this.selectedIds.delete(a.id);
      }
    });
    this.updateBulkActionBar();
    this.renderPage();
  },

  clearSelection() {
    this.selectedIds.clear();
    this.updateBulkActionBar();
    this.renderPage();
  },

  updateBulkActionBar() {
    const bar = document.getElementById('bulk-actions-bar');
    const countEl = document.getElementById('bulk-selected-count');
    if (!bar) return;
    const count = this.selectedIds.size;
    if (count > 0) {
      bar.style.display = 'flex';
      if (countEl) countEl.textContent = count;
    } else {
      bar.style.display = 'none';
    }
  },

  async uploadArticle(articleId, status = 'draft') {
    const targetLabel = status === 'draft' ? 'NewsFlow Admin (Draft)' : 'NewsFlow Web (Live)';
    App.showToast(`Sending story #${articleId} to ${targetLabel}...`, 'info');
    try {
      const res = await App.fetchApi(`/api/web/upload/${articleId}?status=${status}`, { method: 'POST' });
      if (res.success) {
        App.showToast(`Story #${articleId} sent to ${targetLabel}!`, 'success');
        await this.loadData();
        await this.checkWebStatus();
      }
    } catch (e) {
      App.showToast(`Upload failed: ${e.message}`, 'error');
    }
  },

  async uploadPending() {
    const pendingList = this.articles.filter(a => !a.web_posted);
    if (pendingList.length === 0) {
      App.showToast('All scraped stories are already synced to NewsFlow Web!', 'info');
      return;
    }
    const btn = document.getElementById('upload-pending-btn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width:14px; height:14px;"></i> Syncing...';
      btn.disabled = true;
    }
    try {
      App.showToast(`Uploading ${pendingList.length} pending stories to NewsFlow Admin...`, 'info');
      const res = await App.fetchApi(`/api/web/upload-all?status=draft`, { method: 'POST' });
      if (res.success) {
        App.showToast(`Uploaded ${res.published} stories to NewsFlow Admin as drafts!`, 'success');
        await this.loadData();
        await this.checkWebStatus();
      }
    } catch (e) {
      App.showToast(`Batch sync failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="send" style="width: 14px; height: 14px;"></i> Send Pending (<span id="btn-pending-count">0</span>) to Admin';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  async uploadSelected(status = 'draft') {
    const ids = Array.from(this.selectedIds);
    if (ids.length === 0) return;
    App.showToast(`Sending ${ids.length} selected stories to NewsFlow (${status})...`, 'info');
    try {
      let okCount = 0;
      for (const id of ids) {
        const res = await App.fetchApi(`/api/web/upload/${id}?status=${status}`, { method: 'POST' });
        if (res.success) okCount++;
      }
      App.showToast(`Successfully synced ${okCount} of ${ids.length} stories!`, 'success');
      this.clearSelection();
      await this.loadData();
      await this.checkWebStatus();
    } catch (e) {
      App.showToast(`Bulk upload error: ${e.message}`, 'error');
    }
  },

  async triggerBackfill() {
    const btn = document.getElementById('fetch-photos-btn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width:13px; height:13px;"></i> Fetching...';
      btn.disabled = true;
    }
    try {
      App.showToast('Fetching authentic editorial photos from source websites...', 'info');
      const res = await App.fetchApi('/api/media/backfill-images', { method: 'POST' });
      App.showToast(`Photo scan complete: ${res.verified || 0} photos verified!`, 'success');
      await this.loadData();
    } catch (e) {
      App.showToast(`Photo fetch failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="camera" style="width: 13px; height: 13px;"></i> Photos';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderPage();
    }
  },

  nextPage() {
    const totalPages = Math.ceil(this.filteredArticles.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.renderPage();
    }
  }
};
