/**
 * NewsFlow Web Publishing Desk (Line-by-Line Feed)
 * Displays all scraped news articles line-by-line with authentic source photos.
 * Replaces the old ranking gate with direct, frictionless publishing to NewsFlow Web (localhost:3000).
 */
const RankingPage = {
  articles: [],
  filteredArticles: [],
  currentFilter: 'all', // 'all' | 'published' | 'pending'
  currentCategory: 'all',
  webStatus: null,
  searchQuery: '',

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 18px; max-width: 1320px; margin: 0 auto; padding-bottom: 50px;">
        
        <!-- Header & Primary Controls -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; background: #ffffff; padding: 18px 22px; border-radius: 14px; border: 1px solid var(--border-color); box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <span style="font-size: 1.5rem;">🗞️</span>
              <h2 style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; color: #2B2622; margin: 0;">
                NewsFlow Web Publishing Desk
              </h2>
              <span id="web-status-badge" style="font-size: 0.74rem; font-weight: 700; padding: 4px 10px; border-radius: 8px; background: #F6F1EA; color: #8A8175; border: 1px solid var(--border-color);">
                Checking website status...
              </span>
            </div>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin: 4px 0 0 0;">
              All scraped news with authentic source photos, published line-by-line directly to the public NewsFlow Web site (<a href="http://localhost:3000" target="_blank" style="color: var(--primary-purple); font-weight: 600; text-decoration: none;">localhost:3000</a>).
            </p>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-primary btn-glow" id="upload-all-btn" onclick="RankingPage.uploadAll()" style="display: flex; align-items: center; gap: 8px; padding: 9px 20px; font-weight: 700; font-size: 0.88rem;">
              <i data-lucide="upload-cloud" style="width: 17px; height: 17px;"></i> 🚀 Upload All to NewsFlow Web
            </button>
            <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 6px; padding: 9px 15px; font-size: 0.82rem; font-weight: 600; text-decoration: none;">
              <i data-lucide="external-link" style="width: 14px; height: 14px;"></i> Open Website (localhost:3000) ↗
            </a>
            <button class="btn btn-secondary" onclick="RankingPage.triggerBackfill()" style="display: flex; align-items: center; gap: 6px; padding: 9px 13px; font-size: 0.82rem;" title="Scrapes authentic lead photos from websites for existing articles">
              <i data-lucide="camera" style="width: 14px; height: 14px;"></i> 📸 Fetch Photos
            </button>
            <button class="btn btn-secondary" onclick="RankingPage.loadData()" style="display: flex; align-items: center; gap: 6px; padding: 9px 13px; font-size: 0.82rem;">
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i> Refresh
            </button>
          </div>
        </div>

        <!-- Telemetry Stats Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
          
          <div class="glass-card" style="padding: 14px 18px; background: #ffffff; border-radius: 12px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(217, 119, 87, 0.1); color: #d97757; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              📦
            </div>
            <div>
              <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total Scraped News</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: #2B2622;" id="stat-total-scraped">--</div>
            </div>
          </div>

          <div class="glass-card" style="padding: 14px 18px; background: #ffffff; border-radius: 12px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(46, 125, 50, 0.1); color: #2e7d32; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              🌐
            </div>
            <div>
              <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Published on Website</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: #2e7d32;" id="stat-published-count">--</div>
            </div>
          </div>

          <div class="glass-card" style="padding: 14px 18px; background: #ffffff; border-radius: 12px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(230, 81, 0, 0.1); color: #e65100; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              ⏳
            </div>
            <div>
              <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Pending Upload</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: #e65100;" id="stat-pending-count">--</div>
            </div>
          </div>

          <div class="glass-card" style="padding: 14px 18px; background: #ffffff; border-radius: 12px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(43, 123, 185, 0.1); color: #2b7bb9; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              📸
            </div>
            <div>
              <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Authentic Photos</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: #2b7bb9;" id="stat-photos-count">--</div>
            </div>
          </div>

        </div>

        <!-- Filter & Search Toolbar -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; background: #ffffff; padding: 12px 18px; border-radius: 12px; border: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-right: 4px;">Filter Stream:</span>
            <button id="filter-all-btn" class="btn btn-primary" style="padding: 5px 14px; font-size: 0.78rem;" onclick="RankingPage.setFilter('all')">
              📚 All Scraped News (<span id="count-all">0</span>)
            </button>
            <button id="filter-published-btn" class="btn btn-secondary" style="padding: 5px 14px; font-size: 0.78rem;" onclick="RankingPage.setFilter('published')">
              🌐 Published on Web (<span id="count-published">0</span>)
            </button>
            <button id="filter-pending-btn" class="btn btn-secondary" style="padding: 5px 14px; font-size: 0.78rem;" onclick="RankingPage.setFilter('pending')">
              ⏳ Pending Upload (<span id="count-pending">0</span>)
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <input type="text" id="stream-search-input" placeholder="Search headline, text, source..." class="filter-select" style="padding: 6px 14px; font-size: 0.82rem; width: 260px; border-radius: 8px;" oninput="RankingPage.filterSearch(this.value)" />
          </div>
        </div>

        <!-- Line-by-Line News Feed Container -->
        <div id="line-by-line-feed" style="display: flex; flex-direction: column; gap: 14px;">
          <div class="glass-card" style="padding: 50px; text-align: center; color: var(--text-muted);">
            <i data-lucide="loader-2" class="spin" style="width: 24px; height: 24px; margin-bottom: 8px;"></i>
            <p>Loading scraped news stream for NewsFlow Web...</p>
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
          badge.innerHTML = `<span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#2e7d32; margin-right:4px;"></span> NewsFlow Web Online (${res.stats?.articles || 0} Articles)`;
          badge.style.background = '#E8F5E9';
          badge.style.color = '#2e7d32';
          badge.style.borderColor = '#A5D6A7';
        } else {
          badge.innerHTML = `⚠️ NewsFlow Web Offline (Starting...)`;
          badge.style.background = '#FFF3E0';
          badge.style.color = '#E65100';
          badge.style.borderColor = '#FFCC80';
        }
      }
    } catch (e) {
      if (badge) {
        badge.innerHTML = `⚠️ Next.js Server Offline (localhost:3000)`;
        badge.style.background = '#FFEBEE';
        badge.style.color = '#C62828';
      }
    }
  },

  async loadData() {
    const feed = document.getElementById('line-by-line-feed');
    try {
      const data = await App.fetchApi('/api/web/articles?limit=150&filter=all');
      this.articles = data.articles || [];
      this.updateStats();
      this.applyFilterAndRender();
    } catch (e) {
      if (feed) {
        feed.innerHTML = `<div class="glass-card" style="padding: 40px; text-align: center; color: var(--status-failed);">Failed to load news stream: ${e.message}</div>`;
      }
    }
  },

  updateStats() {
    const total = this.articles.length;
    const published = this.articles.filter(a => a.web_posted).length;
    const pending = total - published;
    const withPhotos = this.articles.filter(a => a.scraped_image_path || a.scraped_image_url).length;

    const elTotal = document.getElementById('stat-total-scraped');
    const elPub = document.getElementById('stat-published-count');
    const elPend = document.getElementById('stat-pending-count');
    const elPhotos = document.getElementById('stat-photos-count');

    const cAll = document.getElementById('count-all');
    const cPub = document.getElementById('count-published');
    const cPend = document.getElementById('count-pending');

    if (elTotal) elTotal.textContent = total;
    if (elPub) elPub.textContent = published;
    if (elPend) elPend.textContent = pending;
    if (elPhotos) elPhotos.textContent = withPhotos;

    if (cAll) cAll.textContent = total;
    if (cPub) cPub.textContent = published;
    if (cPend) cPend.textContent = pending;
  },

  setFilter(filter) {
    this.currentFilter = filter;
    ['all', 'published', 'pending'].forEach(f => {
      const btn = document.getElementById(`filter-${f}-btn`);
      if (btn) {
        btn.className = `btn ${f === filter ? 'btn-primary' : 'btn-secondary'}`;
      }
    });
    this.applyFilterAndRender();
  },

  filterSearch(q) {
    this.searchQuery = (q || '').toLowerCase().trim();
    this.applyFilterAndRender();
  },

  applyFilterAndRender() {
    let list = this.articles;

    if (this.currentFilter === 'published') {
      list = list.filter(a => a.web_posted);
    } else if (this.currentFilter === 'pending') {
      list = list.filter(a => !a.web_posted);
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
    this.renderFeed(list);
  },

  renderFeed(items) {
    const feed = document.getElementById('line-by-line-feed');
    if (!feed) return;

    if (!items || items.length === 0) {
      feed.innerHTML = `
        <div class="glass-card" style="padding: 40px; text-align: center; color: var(--text-muted); background: #ffffff; border-radius: 12px; border: 1px solid var(--border-color);">
          <p style="margin: 0; font-size: 0.95rem;">No news articles match the selected filter.</p>
        </div>
      `;
      return;
    }

    feed.innerHTML = items.map((art, idx) => {
      const imgPath = art.scraped_image_path || art.scraped_image_url;
      const wordCount = art.body ? art.body.trim().split(/\s+/).length : 0;
      const snippet = art.body ? (art.body.length > 210 ? art.body.substring(0, 210) + '...' : art.body) : 'Raw extracted web article content.';
      
      const isPublished = art.web_posted;
      const liveUrl = art.web_url || (art.web_slug ? `http://localhost:3000/article/${art.web_slug}` : null);

      const statusBadge = isPublished ? `
        <span style="display: inline-flex; align-items: center; gap: 5px; background: rgba(46, 125, 50, 0.12); color: #2e7d32; border: 1px solid rgba(46, 125, 50, 0.3); font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 6px;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #2e7d32;"></span>
          Published on NewsFlow Web
        </span>
      ` : `
        <span style="display: inline-flex; align-items: center; gap: 5px; background: rgba(230, 81, 0, 0.1); color: #e65100; border: 1px solid rgba(230, 81, 0, 0.28); font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 6px;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #e65100;"></span>
          Ready to Upload
        </span>
      `;

      const uploadActionBtn = isPublished ? `
        <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 7px 14px; font-size: 0.78rem; font-weight: 700; color: #2e7d32; border-color: rgba(46,125,50,0.4); text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
          <span>🌐</span> View Live ↗
        </a>
        <button class="btn btn-secondary" onclick="RankingPage.uploadArticle(${art.id})" id="btn-upload-${art.id}" style="padding: 7px 11px; font-size: 0.76rem;" title="Re-sync changes to NewsFlow Web">
          🔄 Re-Upload
        </button>
      ` : `
        <button class="btn btn-primary btn-glow" onclick="RankingPage.uploadArticle(${art.id})" id="btn-upload-${art.id}" style="padding: 7px 16px; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
          <i data-lucide="upload" style="width: 13px; height: 13px;"></i> 🚀 Upload to Web
        </button>
      `;

      const imageBox = imgPath ? `
        <div style="width: 170px; height: 115px; border-radius: 10px; overflow: hidden; background: #26221F; position: relative; flex-shrink: 0; border: 1px solid var(--border-color);">
          <img src="${imgPath}" alt="Source Photo" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.style.display='none'">
          <span style="position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,0.72); color: #fff; font-size: 0.62rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; backdrop-filter: blur(3px);">
            📸 Website Photo
          </span>
        </div>
      ` : `
        <div style="width: 170px; height: 115px; border-radius: 10px; background: #F6F1EA; border: 1px dashed #D5CCA8; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; flex-shrink: 0; color: #8A8175;">
          <span style="font-size: 1.3rem;">📷</span>
          <span style="font-size: 0.68rem; font-weight: 600;">No Image</span>
          <button class="btn btn-secondary" onclick="RankingPage.fetchSinglePhoto(${art.id})" style="padding: 2px 8px; font-size: 0.65rem;">Fetch</button>
        </div>
      `;

      return `
        <!-- Line-by-Line News Row Card -->
        <div class="glass-card" style="padding: 16px 20px; background: #ffffff; border-radius: 14px; border: 1px solid var(--border-color); display: flex; gap: 18px; align-items: flex-start; justify-content: space-between; box-shadow: 0 1px 4px rgba(0,0,0,0.02); transition: all 0.2s ease;">
          
          <div style="display: flex; gap: 16px; align-items: flex-start; flex: 1; min-width: 0;">
            <!-- Authentic Scraped Image -->
            ${imageBox}

            <!-- Story Body & Packaging -->
            <div style="flex: 1; min-width: 0;">
              
              <!-- Source & Status Pills Row -->
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
                <span style="background: rgba(217, 119, 87, 0.12); color: #cc6343; border: 1px solid rgba(217, 119, 87, 0.28); font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; padding: 3px 8px; border-radius: 6px;">
                  ${art.source || 'Web Source'}
                </span>

                <span style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); background: #FAF7F2; border: 1px solid var(--border-color); padding: 3px 8px; border-radius: 6px;">
                  ${art.category || 'Tech & Innovation'}
                </span>

                ${statusBadge}

                <span style="font-size: 0.72rem; color: var(--text-dim); margin-left: auto;">
                  ${art.scraped_at ? App.formatTimestamp(art.scraped_at) : ''}
                </span>
              </div>

              <!-- Editable AI Headline Input & Generator -->
              <div style="margin-bottom: 8px;">
                <div style="display: flex; gap: 8px; align-items: center;">
                  <input type="text" id="stream-headline-${art.id}" value="${(art.title || '').replace(/"/g, '&quot;')}" class="filter-select" style="font-family: var(--font-serif); font-size: 1.02rem; font-weight: 700; color: #2B2622; width: 100%; padding: 6px 12px; background: #FAF7F2; border: 1px solid rgba(217, 119, 87, 0.3); border-radius: 8px;" />
                  <button class="btn btn-secondary" onclick="RankingPage.generateHeadline(${art.id})" id="btn-gen-head-${art.id}" style="padding: 6px 10px; font-size: 0.72rem; font-weight: 700; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;" title="Let AI write a punchy publication headline">
                    <i data-lucide="sparkles" style="width: 12px; height: 12px;"></i> ✨ AI Headline
                  </button>
                </div>
              </div>

              <!-- Raw Extracted Snippet & Word Count -->
              <div style="font-size: 0.81rem; color: #6E675F; line-height: 1.45; background: #FAF7F2; padding: 8px 12px; border-radius: 8px; border: 1px solid #EBE4DA; margin-bottom: 8px;">
                ${snippet}
              </div>

              <!-- Footer Meta & Links -->
              <div style="display: flex; align-items: center; gap: 12px; font-size: 0.74rem; color: var(--text-muted); flex-wrap: wrap;">
                <span>📝 ${wordCount} words verbatim</span>
                <span>•</span>
                <a href="${art.url}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-purple); text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 3px;">
                  Original Source Report ↗
                </a>
              </div>

            </div>
          </div>

          <!-- Actions Column -->
          <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end; justify-content: flex-start; flex-shrink: 0; min-width: 160px;">
            ${uploadActionBtn}

            <button class="btn btn-secondary" onclick="RankingPage.saveArticle(${art.id})" id="btn-save-${art.id}" style="padding: 6px 12px; font-size: 0.76rem; width: 100%; display: flex; align-items: center; justify-content: center; gap: 5px;">
              <i data-lucide="save" style="width: 12px; height: 12px;"></i> 💾 Save Changes
            </button>

            <button class="btn btn-secondary" onclick="App.openArticleModal(${art.id})" style="padding: 6px 12px; font-size: 0.76rem; width: 100%; display: flex; align-items: center; justify-content: center; gap: 5px;">
              <i data-lucide="eye" style="width: 12px; height: 12px;"></i> 📝 Inspect & Edit ↗
            </button>
          </div>

        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  async uploadArticle(articleId) {
    const btn = document.getElementById(`btn-upload-${articleId}`);
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width:12px; height:12px;"></i> Uploading...';
      btn.disabled = true;
    }
    try {
      App.showToast(`Uploading Story #${articleId} to NewsFlow Web with authentic photo...`, 'info');
      
      // Save any headline edits first
      const headInput = document.getElementById(`stream-headline-${articleId}`);
      if (headInput) {
        await App.fetchApi(`/api/articles/${articleId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ai_headline: headInput.value.trim(), title: headInput.value.trim() })
        });
      }

      const res = await App.fetchApi(`/api/web/upload/${articleId}`, { method: 'POST' });
      if (res.success) {
        App.showToast(`Story #${articleId} published to NewsFlow Web!`, 'success');
        await this.loadData();
        await this.checkWebStatus();
      }
    } catch (e) {
      App.showToast(`Upload failed: ${e.message}`, 'error');
    } finally {
      if (btn) btn.disabled = false;
      if (window.lucide) window.lucide.createIcons();
    }
  },

  async uploadAll() {
    const btn = document.getElementById('upload-all-btn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width:16px; height:16px;"></i> Uploading Stream...';
      btn.disabled = true;
    }
    try {
      App.showToast('Publishing all pending scraped news line-by-line to NewsFlow Web...', 'info');
      const res = await App.fetchApi('/api/web/upload-all', { method: 'POST' });
      if (res.success) {
        App.showToast(`Published ${res.published} articles to NewsFlow Web!`, 'success');
        await this.loadData();
        await this.checkWebStatus();
      }
    } catch (e) {
      App.showToast(`Batch upload error: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="upload-cloud" style="width: 17px; height: 17px;"></i> 🚀 Upload All to NewsFlow Web';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  async generateHeadline(articleId) {
    const btn = document.getElementById(`btn-gen-head-${articleId}`);
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width:12px; height:12px;"></i> Writing...';
      btn.disabled = true;
    }
    try {
      App.showToast(`Crafting AI Headline for story #${articleId}...`, 'info');
      const res = await App.fetchApi(`/api/articles/${articleId}/generate-headline`, { method: 'POST' });
      if (res.success && res.headline) {
        const input = document.getElementById(`stream-headline-${articleId}`);
        if (input) input.value = res.headline;
        App.showToast(`AI Headline generated! Click "Save Changes" or "Upload".`, 'success');
      }
    } catch (e) {
      App.showToast(`AI headline failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="sparkles" style="width: 12px; height: 12px;"></i> ✨ AI Headline';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  async saveArticle(articleId) {
    const btn = document.getElementById(`btn-save-${articleId}`);
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width:12px; height:12px;"></i> Saving...';
      btn.disabled = true;
    }
    try {
      const headInput = document.getElementById(`stream-headline-${articleId}`);
      const payload = {
        ai_headline: headInput ? headInput.value.trim() : null,
        title: headInput ? headInput.value.trim() : null,
        editorial_status: 'approved',
        status: 'ready'
      };
      await App.fetchApi(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      App.showToast(`Story #${articleId} saved to database!`, 'success');
    } catch (e) {
      App.showToast(`Save failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="save" style="width: 12px; height: 12px;"></i> 💾 Save Changes';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  async fetchSinglePhoto(articleId) {
    App.showToast(`Extracting photo for story #${articleId}...`, 'info');
    try {
      await App.fetchApi(`/api/scraped/backfill-images?limit=1`, { method: 'POST' });
      await this.loadData();
    } catch (e) {
      App.showToast(`Photo fetch error: ${e.message}`, 'error');
    }
  },

  async triggerBackfill() {
    App.showToast('Fetching authentic lead photos from publisher websites...', 'info');
    try {
      const res = await App.fetchApi('/api/scraped/backfill-images?limit=40', { method: 'POST' });
      App.showToast(res.message || 'Photos updated successfully!', 'success');
      await this.loadData();
    } catch (e) {
      App.showToast(`Photo fetch failed: ${e.message}`, 'error');
    }
  },

  // Backwards-compatible aliases if other views invoke RankingPage methods
  async runRerank() {
    return this.loadData();
  },
  async dispatchStory(id) {
    return this.uploadArticle(id);
  }
};
