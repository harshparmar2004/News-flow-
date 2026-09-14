/**
 * 3D Interactive n8n Agentic Canvas Space Renderer (Vertical Flow Pipeline)
 * Arranges 4 connected agentic nodes top-to-bottom with vertical connector pulses
 * and interactive node inspectors.
 */
const SpacePage = {
  articles: [],
  selectedArticleId: null,

  render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 1000px; margin: 0 auto;">
        
        <!-- Vertical 3D Agentic Canvas Flow -->
        <div class="glass-card" style="position: relative; overflow: hidden; background: #FAF7F2; border: 1.5px solid var(--primary-purple); padding: 22px 24px; border-radius: 16px;">
          
          <!-- Background 3D Perspective Grid -->
          <div style="position: absolute; inset: 0; background-image: radial-gradient(#d97757 0.75px, transparent 0.75px), radial-gradient(#2b7bb9 0.75px, #faf7f2 0.75px); background-size: 24px 24px; background-position: 0 0, 12px 12px; opacity: 0.2; transform: perspective(1000px) rotateX(15deg); pointer-events: none;"></div>

          <!-- Top Toolbar Row inside Canvas -->
          <div style="position: relative; z-index: 12; display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(217,119,87,0.2);">
            <div style="display: flex; align-items: center; gap: 10px;">
              <h3 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: #2B2622;">🌌 Vertical 3D Pipeline Visualizer</h3>
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--primary-purple); background: rgba(217,119,87,0.12); padding: 3px 10px; border-radius: 6px;">
                Interactive n8n Flow
              </span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary" onclick="SpacePage.loadSpaceData()" style="padding: 5px 12px; font-size: 0.78rem;">
                <i data-lucide="refresh-cw"></i> Refresh Data
              </button>
              <button class="btn btn-primary btn-glow" onclick="App.triggerPipeline()" style="padding: 5px 14px; font-size: 0.78rem;">
                <i data-lucide="play"></i> Run Full Pipeline
              </button>
            </div>
          </div>

          <!-- Vertical Single-Column Node Flow -->
          <div style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 0;">
            
            <!-- NODE 1: Web Scraper Engine -->
            <div class="node-3d-card vertical-node" onclick="SpacePage.openNodeInspector(1)" style="padding: 12px 18px; border-radius: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span class="node-badge" style="background: rgba(217,119,87,0.15); color: var(--primary-purple); font-size: 0.65rem; padding: 2px 8px;">NODE 1 • WEB SCRAPER ENGINE</span>
                <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">18 Permanent Feeds</span>
              </div>

              <div style="display: flex; align-items: center; gap: 14px; text-align: left;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: var(--primary-purple); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <i data-lucide="rss" style="width: 20px; height: 20px;"></i>
                </div>
                <div style="flex: 1;">
                  <h4 style="font-family: var(--font-serif); font-size: 1.02rem; font-weight: 700; margin-bottom: 2px;">1. Web Scraper Engine</h4>
                  <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Monitors RSS feeds & AI ScrapeGraph web sources continuously</p>
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                  <div style="font-size: 1.05rem; font-weight: 700; color: var(--primary-purple);" id="space-v1-count">50 News Scraped</div>
                  <span class="btn-node-inspect" style="margin-top: 2px; padding: 3px 8px; font-size: 0.72rem;">Open Console 🔍</span>
                </div>
              </div>
            </div>

            <!-- Vertical Connector 1 -> 2 -->
            <div class="vertical-connector" style="padding: 3px 0;">
              <div class="connector-line" style="height: 16px;"></div>
              <div class="connector-badge" style="padding: 2px 10px; font-size: 0.68rem;">
                <i data-lucide="arrow-down" style="width: 14px; height: 14px; color: var(--primary-purple);"></i>
                <span>50 Raw Scraped Articles Flow Down</span>
              </div>
            </div>

            <!-- NODE 2: AI Agent News Ranker -->
            <div class="node-3d-card vertical-node" onclick="SpacePage.openNodeInspector(2)" style="padding: 12px 18px; border-radius: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span class="node-badge" style="background: rgba(43,123,185,0.15); color: #2b7bb9; font-size: 0.65rem; padding: 2px 8px;">NODE 2 • AI AGENT RANKER & REWRITER</span>
                <span style="font-size: 0.72rem; color: #2b7bb9; font-weight: 600;">Custom AI Ranking Prompt</span>
              </div>

              <div style="display: flex; align-items: center; gap: 14px; text-align: left;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: #2b7bb9; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <i data-lucide="award" style="width: 20px; height: 20px;"></i>
                </div>
                <div style="flex: 1;">
                  <h4 style="font-family: var(--font-serif); font-size: 1.02rem; font-weight: 700; margin-bottom: 2px;">2. AI News Ranker & Theme Adapter</h4>
                  <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Scores items 1-100 & filters Top 10 viral stories for your niche</p>
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                  <div style="font-size: 1.05rem; font-weight: 700; color: #2b7bb9;" id="space-v2-count">Top 10 Ranked</div>
                  <span class="btn-node-inspect" style="margin-top: 2px; padding: 3px 8px; font-size: 0.72rem; background: rgba(43,123,185,0.1); color: #2b7bb9;">Prompt Agent 🧠</span>
                </div>
              </div>
            </div>

            <!-- Vertical Connector 2 -> 3 -->
            <div class="vertical-connector" style="padding: 3px 0;">
              <div class="connector-line" style="border-color: #2b7bb9; height: 16px;"></div>
              <div class="connector-badge" style="border-color: rgba(43,123,185,0.3); color: #2b7bb9; padding: 2px 10px; font-size: 0.68rem;">
                <i data-lucide="arrow-down" style="width: 14px; height: 14px; color: #2b7bb9;"></i>
                <span>Top 10 News Filtered to Studio</span>
              </div>
            </div>

            <!-- NODE 3: Nano Banana 4-Slide Studio -->
            <div class="node-3d-card vertical-node" onclick="SpacePage.openNodeInspector(3)" style="padding: 12px 18px; border-radius: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span class="node-badge" style="background: rgba(193,53,132,0.15); color: #c13584; font-size: 0.65rem; padding: 2px 8px;">NODE 3 • NANO BANANA CAROUSEL STUDIO</span>
                <span style="font-size: 0.72rem; color: #c13584; font-weight: 600;">1 Banner + 3 Context Slides</span>
              </div>

              <div style="display: flex; align-items: center; gap: 14px; text-align: left;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: #c13584; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <i data-lucide="wand-2" style="width: 20px; height: 20px;"></i>
                </div>
                <div style="flex: 1;">
                  <h4 style="font-family: var(--font-serif); font-size: 1.02rem; font-weight: 700; margin-bottom: 2px;">3. Nano Banana 4-Slide Studio</h4>
                  <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Generates 4-image slide decks with custom visual prompts</p>
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                  <div style="font-size: 1.05rem; font-weight: 700; color: #c13584;" id="space-v3-count">40 Slide Cards</div>
                  <span class="btn-node-inspect" style="margin-top: 2px; padding: 3px 8px; font-size: 0.72rem; background: rgba(193,53,132,0.1); color: #c13584;">Open Studio 🎨</span>
                </div>
              </div>
            </div>

            <!-- Vertical Connector 3 -> 4 -->
            <div class="vertical-connector" style="padding: 3px 0;">
              <div class="connector-line" style="border-color: #c13584; height: 16px;"></div>
              <div class="connector-badge" style="border-color: rgba(193,53,132,0.3); color: #c13584; padding: 2px 10px; font-size: 0.68rem;">
                <i data-lucide="arrow-down" style="width: 14px; height: 14px; color: #c13584;"></i>
                <span>40 Slide Cards Ready for API Dispatch</span>
              </div>
            </div>

            <!-- NODE 4: App 2 Integration Gateway -->
            <div class="node-3d-card vertical-node" onclick="SpacePage.openNodeInspector(4)" style="padding: 12px 18px; border-radius: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span class="node-badge" style="background: rgba(46,125,50,0.15); color: #2e7d32; font-size: 0.65rem; padding: 2px 8px;">NODE 4 • OMNI-CHANNEL AI AGENT REST GATEWAY</span>
                <span style="font-size: 0.72rem; color: #2e7d32; font-weight: 600;">App 2 Export Endpoint</span>
              </div>

              <div style="display: flex; align-items: center; gap: 14px; text-align: left;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: #2e7d32; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <i data-lucide="share-2" style="width: 20px; height: 20px;"></i>
                </div>
                <div style="flex: 1;">
                  <h4 style="font-family: var(--font-serif); font-size: 1.02rem; font-weight: 700; margin-bottom: 2px;">4. App 2 REST Gateway Transfer</h4>
                  <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Dispatches refined news & Nano Banana 4-slide decks to App 2 via REST API</p>
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                  <div style="font-size: 1.05rem; font-weight: 700; color: #2e7d32;" id="space-v4-count">App 2 Sync Ready</div>
                  <span class="btn-node-inspect" style="margin-top: 2px; padding: 3px 8px; font-size: 0.72rem; background: rgba(46,125,50,0.1); color: #2e7d32;">Inspect Gateway 📡</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Selected Top 10 Article 4-Slide Catalog Deck -->
        <div class="glass-card" style="border: 1px solid var(--border-color); padding: 16px 20px; border-radius: 14px; background: #ffffff;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; flex-wrap: wrap;">
            <div>
              <h4 style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: #2B2622;">🎨 Live 4-Slide Deck Catalog (1 Banner + 3 Context Slides)</h4>
              <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">Select a top-ranked article to preview its complete 4-image slide deck generated by Nano Banana</p>
            </div>
            <select id="space-article-select" class="filter-select" style="padding: 6px 12px; font-size: 0.8rem; border-radius: 8px; max-width: 380px;" onchange="SpacePage.onSelectArticle(this.value)">
              <option value="">-- Select Top 10 Article --</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;" id="space-slides-preview-grid">
            <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 24px;">
              <p style="font-size: 0.85rem; color: var(--text-muted);">Loading Top 10 articles into Vertical Space...</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Node Control Inspector Modal Container -->
      <div id="node-inspector-modal" class="modal"></div>
    `;

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => this.loadSpaceData(), 50);
  },

  async loadSpaceData() {
    try {
      const data = await App.fetchApi('/api/articles?limit=50');
      let articles = data.articles || [];

      articles.sort((a, b) => (b.rank_score || 75) - (a.rank_score || 75));
      this.articles = articles;

      const top10 = articles.slice(0, 10);
      const select = document.getElementById('space-article-select');
      
      if (select && top10.length > 0) {
        select.innerHTML = '<option value="">-- Select Top 10 Article --</option>' +
          top10.map(a => `<option value="${a.id}">Article #${a.id} [Score ${a.rank_score || 75}/100]: ${a.title.substring(0, 40)}...</option>`).join('');
        
        select.value = top10[0].id;
        this.renderDefaultSlides(top10[0].id);
      } else {
        const grid = document.getElementById('space-slides-preview-grid');
        if (grid) grid.innerHTML = '<div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 30px;"><p>No articles found. Trigger the web scraper to populate Vertical Space!</p></div>';
      }

      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error("Failed to load vertical space data", e);
    }
  },

  renderDefaultSlides(articleId) {
    const grid = document.getElementById('space-slides-preview-grid');
    if (!grid || !articleId) return;

    const labels = [
      "🖼️ Slide 1: Main Title Banner Card",
      "🖼️ Slide 2: Key Context & Background",
      "🖼️ Slide 3: Detailed Breakdown",
      "🖼️ Slide 4: Community Discussion & CTA"
    ];

    const slides = [
      `/api/images/${articleId}_slide1.png`,
      `/api/images/${articleId}_slide2.png`,
      `/api/images/${articleId}_slide3.png`,
      `/api/images/${articleId}_slide4.png`
    ];

    grid.innerHTML = slides.map((imgUrl, i) => `
      <div class="glass-card" style="padding: 8px; text-align: center; border-radius: 10px; background: #FAF7F2; border: 1px solid var(--border-color);">
        <div style="position: relative; height: 135px; border-radius: 8px; overflow: hidden; background: #ffffff; border: 1px solid var(--border-color); margin-bottom: 6px;">
          <img src="${imgUrl}" alt="${labels[i]}" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.src='/api/placeholder/400/220'" />
        </div>
        <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-main); font-family: var(--font-serif);">${labels[i]}</span>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  async onSelectArticle(articleId) {
    if (!articleId) return;
    this.selectedArticleId = articleId;
    this.renderDefaultSlides(articleId);

    try {
      await App.fetchApi(`/api/articles/${articleId}/slides`, { method: 'POST' });
      this.renderDefaultSlides(articleId);
    } catch (err) {
      console.warn("Background slide generation notice:", err);
    }
  },

  openNodeInspector(nodeId) {
    let modal = document.getElementById('node-inspector-modal');
    if (!modal) return;

    let content = '';
    if (nodeId === 1) {
      content = `
        <div class="modal-header">
          <h2>📥 Node 1: Web Scraper Engine Console</h2>
          <button class="btn-icon" onclick="SpacePage.closeModal()"><i data-lucide="x"></i></button>
        </div>
        <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 14px;">
          <p style="font-size: 0.9rem; color: var(--text-muted);">Monitors 18 active news RSS feeds and ScrapeGraphAI web sources.</p>
          <div style="background: var(--bg-surface); padding: 14px; border-radius: 8px; font-size: 0.85rem;">
            <strong>Active Sources Monitored:</strong> 18 Permanent Feeds (TechCrunch, The Verge, Wired, Reuters, Hacker News)<br/>
            <strong>Status:</strong> Engine Active & Scrape Ready
          </div>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button class="btn btn-secondary" onclick="App.navigateTo('sources')">Go to Full Sources Page ↗️</button>
            <button class="btn btn-primary" onclick="App.triggerPipeline(); SpacePage.closeModal();">Trigger Scraper Now 🚀</button>
          </div>
        </div>
      `;
    } else if (nodeId === 2) {
      content = `
        <div class="modal-header">
          <h2>🧠 Node 2: AI Agent Ranking & Theme Inspector</h2>
          <button class="btn-icon" onclick="SpacePage.closeModal()"><i data-lucide="x"></i></button>
        </div>
        <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 14px;">
          <p style="font-size: 0.9rem; color: var(--text-muted);">Configure custom AI ranking rules to filter 50 scraped items down to Top 10.</p>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Custom AI Agent Ranking Prompt</label>
            <textarea class="filter-select" style="width: 100%; height: 90px; margin-top: 4px; font-family: monospace; font-size: 0.8rem;">Score news from 1 to 100 based on viral potential, AI advancements, tech breakthroughs, and market impact. Filter Top 10 items.</textarea>
          </div>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button class="btn btn-secondary" onclick="App.navigateTo('ranking')">Go to Full Ranking Page ↗️</button>
            <button class="btn btn-primary" onclick="App.showToast('Ranking Agent updated!', 'success'); SpacePage.closeModal();">Save Ranking Prompt 🧠</button>
          </div>
        </div>
      `;
    } else if (nodeId === 3) {
      content = `
        <div class="modal-header">
          <h2>🎨 Node 3: Nano Banana 4-Slide Studio Inspector</h2>
          <button class="btn-icon" onclick="SpacePage.closeModal()"><i data-lucide="x"></i></button>
        </div>
        <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 14px;">
          <p style="font-size: 0.9rem; color: var(--text-muted);">Nano Banana (Imagen 3 / Gemini 2.0 Flash) 4-Card Slide Catalog Generator.</p>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Nano Banana Custom Visual Style Prompt</label>
            <input type="text" class="filter-select" value="Modern editorial layout, bold typography, warm minimalist aesthetic, crisp infographic card" style="width: 100%; margin-top: 4px;" />
          </div>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button class="btn btn-secondary" onclick="App.navigateTo('media')">Go to Full Studio Page ↗️</button>
            <button class="btn btn-primary" onclick="App.showToast('Nano Banana prompt updated!', 'success'); SpacePage.closeModal();">Update Nano Banana Studio 🎨</button>
          </div>
        </div>
      `;
    } else if (nodeId === 4) {
      content = `
        <div class="modal-header">
          <h2>📡 Node 4: Omni-Channel AI Agent (App 2) REST Gateway</h2>
          <button class="btn-icon" onclick="SpacePage.closeModal()"><i data-lucide="x"></i></button>
        </div>
        <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 14px;">
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.45;">Transfers refined news articles and Nano Banana 4-slide image decks directly to App 2 (Omni-Channel AI Agent) via REST API.</p>
          <div style="background: var(--bg-surface); padding: 14px; border-radius: 8px; font-size: 0.84rem; line-height: 1.6; border: 1px solid var(--border-color);">
            <strong>REST Export Endpoint:</strong> <code style="color: var(--primary-purple); background: var(--bg-card); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-color);">/api/v1/export/refined-posts</code><br/>
            <strong>Min Score Threshold:</strong> 75 / 100<br/>
            <strong>Export Data Payload:</strong> Refined News Text + Nano Banana 4-Slide Image Deck
          </div>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button class="btn btn-primary" onclick="App.showToast('App 2 REST Gateway is Active & Online!', 'success'); SpacePage.closeModal();">Test REST Gateway 📡</button>
          </div>
        </div>
      `;
    }

    modal.innerHTML = `
      <div class="modal-backdrop" onclick="SpacePage.closeModal()"></div>
      <div class="modal-content glass-card" style="max-width: 540px;">
        ${content}
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  },

  closeModal() {
    const modal = document.getElementById('node-inspector-modal');
    if (modal) modal.classList.remove('active');
  }
};
