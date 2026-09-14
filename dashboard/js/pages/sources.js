/**
 * News Sources Links Manager — Monitored Web & RSS Feeds (18 Permanent Feeds)
 * Manages source URLs, scrape tiers, category tags, subreddits, crawl delay, Edit, Delete, and Add Source URL modal.
 */
const SourcesPage = {
  sourcesData: [],

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 1.35rem;">🌐 Monitored Web & RSS Feeds (News Sources Links)</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Active news websites and RSS feeds monitored continuously by the web scraper engine.</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" onclick="SourcesPage.loadSources()">
              <i data-lucide="refresh-cw"></i> Refresh Sources List
            </button>
            <button class="btn btn-primary btn-glow" onclick="SourcesPage.openAddModal()">
              <i data-lucide="plus"></i> Add Source URL
            </button>
          </div>
        </div>

        <!-- Monitored Feeds & Pipeline Metrics Overview Grid -->
        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
          <div class="glass-card stat-card total" style="padding: 16px;">
            <div class="stat-icon"><i data-lucide="rss"></i></div>
            <div class="stat-data">
              <h3 id="src-stat-sources" style="font-size: 1.2rem;">16 Active</h3>
              <p style="font-size: 0.78rem;">Monitored Sources Links</p>
            </div>
          </div>

          <div class="glass-card stat-card scraped" style="padding: 16px;">
            <div class="stat-icon"><i data-lucide="database"></i></div>
            <div class="stat-data">
              <h3 id="src-stat-total" style="font-size: 1.2rem;">0 Items</h3>
              <p style="font-size: 0.78rem;">Scraped Raw News Data</p>
            </div>
          </div>

          <div class="glass-card stat-card ready" style="padding: 16px;">
            <div class="stat-icon"><i data-lucide="award"></i></div>
            <div class="stat-data">
              <h3 id="src-stat-ranked" style="font-size: 1.2rem;">0 Stories</h3>
              <p style="font-size: 0.78rem;">AI Ranked Stories (1-100)</p>
            </div>
          </div>

          <div class="glass-card stat-card published" style="padding: 16px;">
            <div class="stat-icon"><i data-lucide="zap"></i></div>
            <div class="stat-data">
              <h3 id="src-stat-ready" style="font-size: 1.2rem;">0 Ready</h3>
              <p style="font-size: 0.78rem;">App 2 Sync Ready Decks</p>
            </div>
          </div>
        </div>

        <!-- 18 Permanent Feeds Grid -->
        <div class="sources-grid" id="sources-grid">
          <div class="glass-card"><p>Loading monitored web & RSS feeds...</p></div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    await this.loadSources();
  },

  async loadSources() {
    const grid = document.getElementById('sources-grid');
    if (!grid) return;

    try {
      // Fetch live stats for overview cards
      try {
        const stats = await App.fetchApi('/api/stats');
        const summary = stats.summary || {};

        const elSrc = document.getElementById('src-stat-sources');
        const elTot = document.getElementById('src-stat-total');
        const elRnk = document.getElementById('src-stat-ranked');
        const elRdy = document.getElementById('src-stat-ready');

        if (elSrc) elSrc.textContent = `${summary.monitored_sources || 16} Active`;
        if (elTot) elTot.textContent = `${summary.total || 0} Items`;
        if (elRnk) elRnk.textContent = `${summary.ranked || 0} Stories`;
        if (elRdy) elRdy.textContent = `${summary.ready || 0} Ready`;
      } catch (e) {
        console.warn("Could not load stats on sources page", e);
      }

      const data = await App.fetchApi('/api/sources');
      this.sourcesData = data.sources || [];

      if (!this.sourcesData || this.sourcesData.length === 0) {
        grid.innerHTML = '<div class="glass-card"><p>No sources found in sources.yaml</p></div>';
        return;
      }

      grid.innerHTML = this.sourcesData.map((s, idx) => `
        <div style="display: flex; flex-direction: column; justify-content: space-between; border-radius: 18px; border: 1px solid #E8E0D4; background: #FFFFFF; overflow: hidden;">
          
          <!-- Header: logo mark + name + tier badge -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid #E8E0D4;">
            <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: #FCEEE3; color: #D97B3F; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i data-lucide="newspaper" style="width: 18px; height: 18px;"></i>
              </div>
              <h3 style="font-family: Georgia, serif; font-size: 1.1rem; font-weight: 700; color: #2B2622; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${s.name}
              </h3>
            </div>
            <span style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em; padding: 4px 12px; border-radius: 20px; background: #FCEEE3; color: #D97B3F; flex-shrink: 0;">
              TIER ${s.tier}
            </span>
          </div>

          <!-- Meta rows -->
          <div style="padding: 18px 20px; display: flex; flex-direction: column; gap: 10px; font-size: 0.88rem;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i data-lucide="tag" style="width: 15px; height: 15px; color: #8A8175;"></i>
              <span style="color: #8A8175;">Category:</span>
              <strong style="color: #2B2622; font-weight: 600;">${s.category || 'tech'}</strong>
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">
              <i data-lucide="message-square" style="width: 15px; height: 15px; color: #8A8175;"></i>
              <span style="color: #8A8175;">Subreddit:</span>
              <strong style="color: #2B2622; font-weight: 600;">r/${s.subreddit || 'technology'}</strong>
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">
              <i data-lucide="clock" style="width: 15px; height: 15px; color: #8A8175;"></i>
              <span style="color: #8A8175;">Delay:</span>
              <strong style="color: #2B2622; font-weight: 600;">${s.delay_seconds}s</strong>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; font-size: 0.8rem;">
              <i data-lucide="link-2" style="width: 15px; height: 15px; color: #8A8175; flex-shrink: 0;"></i>
              <span style="color: #8A8175; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${s.feed_url || s.url}</span>
            </div>
          </div>

          <!-- Stat -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid #E8E0D4; background: #FFFFFF;">
            <span style="font-size: 0.86rem; color: #8A8175; font-weight: 500;">
              Articles scraped
            </span>
            <span style="font-size: 1.35rem; font-weight: 800; color: #D97B3F;">
              ${s.article_count || 0}
            </span>
          </div>

          <!-- Actions: Edit left, Delete right -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; gap: 14px;">
            <button onclick="SourcesPage.openEditModal(${idx})" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; font-size: 0.85rem; font-weight: 600; border-radius: 12px; border: 1px solid #E8E0D4; background: #FFFFFF; color: #2B2622; cursor: pointer;">
              <i data-lucide="pencil" style="width: 15px; height: 15px;"></i> Edit
            </button>
            <button onclick="SourcesPage.deleteSource(${idx}, '${s.name}')" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; font-size: 0.85rem; font-weight: 600; border-radius: 12px; border: 1px solid #F3D9CE; background: #FFFFFF; color: #C0432A; cursor: pointer;">
              <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i> Delete
            </button>
          </div>

        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();

    } catch (e) {
      console.error("Failed to load sources page", e);
    }
  },

  openAddModal() {
    const modal = document.getElementById('add-source-modal');
    if (modal) {
      document.getElementById('new-source-url').value = '';
      document.getElementById('new-source-name').value = '';
      modal.classList.add('active');
    }
  },

  openEditModal(index) {
    const s = this.sourcesData[index];
    if (!s) return;

    let modal = document.getElementById('edit-source-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'edit-source-modal';
      modal.className = 'modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-backdrop" onclick="SourcesPage.closeEditModal()"></div>
      <div class="modal-content glass-card" style="max-width: 520px;">
        <div class="modal-header">
          <h2>✏️ Edit News Source</h2>
          <button class="btn-icon" onclick="SourcesPage.closeEditModal()"><i data-lucide="x"></i></button>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 14px;">
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Source Name</label>
            <input type="text" id="edit-source-name" class="filter-select" value="${s.name}" style="width: 100%; margin-top: 4px;" />
          </div>

          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Website / Feed URL</label>
            <input type="url" id="edit-source-url" class="filter-select" value="${s.feed_url || s.url}" style="width: 100%; margin-top: 4px;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">Category</label>
              <input type="text" id="edit-source-category" class="filter-select" value="${s.category || 'tech'}" style="width: 100%; margin-top: 4px;" />
            </div>

            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">Target Subreddit</label>
              <input type="text" id="edit-source-subreddit" class="filter-select" value="${s.subreddit || 'technology'}" style="width: 100%; margin-top: 4px;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">Scrape Tier</label>
              <select id="edit-source-tier" class="filter-select" style="width: 100%; margin-top: 4px;">
                <option value="1" ${s.tier == 1 ? 'selected' : ''}>Tier 1 (Fast RSS)</option>
                <option value="2" ${s.tier == 2 ? 'selected' : ''}>Tier 2 (AI ScrapeGraph)</option>
              </select>
            </div>

            <div>
              <label style="font-size: 0.85rem; font-weight: 600;">Crawl Delay (s)</label>
              <input type="number" id="edit-source-delay" class="filter-select" value="${s.delay_seconds || 2}" min="1" max="10" style="width: 100%; margin-top: 4px;" />
            </div>
          </div>

          <button class="btn btn-primary btn-glow" style="margin-top: 10px; justify-content: center;" onclick="SourcesPage.saveEditSource(${index})">
            <i data-lucide="check"></i> Save Changes to Source
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  },

  closeEditModal() {
    const modal = document.getElementById('edit-source-modal');
    if (modal) modal.classList.remove('active');
  },

  async saveEditSource(index) {
    const name = document.getElementById('edit-source-name').value.trim();
    const url = document.getElementById('edit-source-url').value.trim();
    const category = document.getElementById('edit-source-category').value.trim();
    const subreddit = document.getElementById('edit-source-subreddit').value.trim();
    const tier = document.getElementById('edit-source-tier').value;
    const delay = document.getElementById('edit-source-delay').value;

    try {
      const res = await App.fetchApi(`/api/sources/${index}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, url, feed_url: url, category, subreddit, tier: parseInt(tier), delay_seconds: parseInt(delay)
        })
      });

      App.showToast(res.message, 'success');
      this.closeEditModal();
      this.loadSources();
    } catch (err) {
      App.showToast(`Failed to update source: ${err.message}`, 'error');
    }
  },

  async deleteSource(index, name) {
    if (!confirm(`Are you sure you want to delete source '${name}'?`)) return;

    try {
      const res = await App.fetchApi(`/api/sources/${index}/delete`, { method: 'POST' });
      App.showToast(res.message, 'info');
      this.loadSources();
    } catch (err) {
      try {
        const res = await App.fetchApi(`/api/sources/${index}`, { method: 'DELETE' });
        App.showToast(res.message, 'info');
        this.loadSources();
      } catch (e2) {
        App.showToast(`Failed to delete source: ${err.message}`, 'error');
      }
    }
  }
};
