/**
 * Pillar 2: AI News Rank & Refine Studio
 * Filters the pipeline run to the Top 10 highest-ranked stories based on Custom AI Agent Rules,
 * refines text context, crafts Nano Banana visual prompts, and connects directly to Nano Banana Studio.
 */
const RankingPage = {
  top10: [],
  allArticles: [],
  selectedArticleId: null,
  activeTab: 'top10', // 'top10' | 'all' | 'rules'
  rules: {
    profile_name: "AI Breakthroughs & Deep Tech",
    target_niche: "AI, Autonomous Agents, LLMs & Silicon Breakthroughs",
    min_threshold_score: 75,
    ranking_prompt: "Rank stories based on technological breakthrough novelty, viral reader interest, practical application, and industry disruption. Heavily prioritize foundational model releases, GPU/chip milestones, AI agent autonomy, and major startup funding rounds.",
    positive_topics: [
      "AI Models & LLMs",
      "GPU & Chips",
      "Autonomous Agents",
      "Robotics",
      "Founding & Funding",
      "Quantum Computing"
    ],
    negative_filters: [
      "Discount Deals & Coupons",
      "Wallpapers & Accessories",
      "Minor Version Bug Fixes",
      "Generic Top 10 Lists",
      "Sponsored PR Posts"
    ]
  },

  presets: {
    ai_tech: {
      profile_name: "AI Breakthroughs & Autonomous Agents",
      target_niche: "AI Research, Autonomous Agents, LLMs & Silicon Breakthroughs",
      min_threshold_score: 75,
      ranking_prompt: "Rank stories based on technological breakthrough novelty, viral reader interest, practical application, and industry disruption. Heavily prioritize foundational model releases, GPU/chip milestones, AI agent autonomy, and major startup funding rounds.",
      positive_topics: ["AI Models & LLMs", "GPU & Chips", "Autonomous Agents", "Robotics", "Founding & Funding", "Quantum Computing"],
      negative_filters: ["Discount Deals & Coupons", "Wallpapers & Accessories", "Minor Version Bug Fixes", "Generic Top 10 Lists", "Sponsored PR Posts"]
    },
    startups: {
      profile_name: "Startups, Venture Capital & Unicorns",
      target_niche: "Venture Capital, Startup Funding, Y Combinator & Tech Unicorns",
      min_threshold_score: 75,
      ranking_prompt: "Prioritize major venture capital deals, Series A/B/C rounds, acquisitions, IPO announcements, and founder stories. Deprioritize routine software patches and gadget consumer guides.",
      positive_topics: ["Seed & Series Rounds", "Venture Capital", "Unicorns & M&A", "Founder Interviews", "Tech Layoffs & Growth"],
      negative_filters: ["Smartphone Deals", "Game Patch Notes", "Free Downloads", "Gadget Reviews", "Generic Advice"]
    },
    consumer_tech: {
      profile_name: "Consumer Hardware & Breakthrough Gadgets",
      target_niche: "Flagship Smartphones, Wearables, EV Tech & Futuristic Gadgets",
      min_threshold_score: 70,
      ranking_prompt: "Prioritize flagship hardware releases, camera advancements, foldables, electric vehicle developments, and AR/VR spatial computing.",
      positive_topics: ["Flagship Smartphones", "Electric Vehicles (EV)", "AR / VR & Spatial", "Camera Innovation", "Smart Wearables"],
      negative_filters: ["Phone Cases & Skins", "Software Bug Fixes", "Refurbished Deals", "Coupon Codes", "Rumor Reposts"]
    }
  },

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 18px;">
        
        <!-- Header Banner -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--text-main);">
              🧠 Pillar 2: AI News Rank & Refine Studio
            </h3>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-top: 2px;">
              Evaluates raw news with Custom AI Agent Rules, selects the Top 10 stories, refines context, and generates Nano Banana visual prompts.
            </p>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="btn btn-secondary" onclick="RankingPage.loadData()">
              <i data-lucide="refresh-cw"></i> Refresh Run
            </button>
            <button class="btn btn-secondary" onclick="App.navigateTo('media')">
              <i data-lucide="wand-2"></i> Nano Banana Studio →
            </button>
            <button class="btn btn-primary btn-glow" id="rerank-btn" onclick="RankingPage.runRerank()">
              <i data-lucide="sparkles"></i> Re-Rank Pipeline Run
            </button>
          </div>
        </div>

        <!-- Pipeline Workflow Stage Progression Bar -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: var(--bg-surface); padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border-color);">
          
          <div style="display: flex; align-items: center; gap: 10px; border-right: 1px solid var(--border-color); padding-right: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(43, 123, 185, 0.12); color: #2b7bb9; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="database" style="width: 16px; height: 16px;"></i>
            </div>
            <div>
              <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Stage 1</span>
              <h5 style="font-size: 0.86rem; font-weight: 700; color: var(--text-main);" id="flow-scraped-count">133 Scraped</h5>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; border-right: 1px solid var(--border-color); padding-right: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(217, 119, 87, 0.12); color: var(--primary-purple); display: flex; align-items: center; justify-content: center;">
              <i data-lucide="award" style="width: 16px; height: 16px;"></i>
            </div>
            <div>
              <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Stage 2</span>
              <h5 style="font-size: 0.86rem; font-weight: 700; color: var(--text-main);" id="flow-ranked-count">133 AI Evaluated</h5>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; border-right: 1px solid var(--border-color); padding-right: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(46, 125, 50, 0.15); color: #2e7d32; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="check-circle" style="width: 16px; height: 16px;"></i>
            </div>
            <div>
              <span style="font-size: 0.65rem; font-weight: 700; color: #2e7d32; text-transform: uppercase; letter-spacing: 0.04em;">Stage 3 (Active)</span>
              <h5 style="font-size: 0.86rem; font-weight: 700; color: var(--text-main);">Top 10 Curated & Refined</h5>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(193, 53, 132, 0.12); color: #c13584; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="wand-2" style="width: 16px; height: 16px;"></i>
            </div>
            <div>
              <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Stage 4</span>
              <h5 style="font-size: 0.86rem; font-weight: 700; color: var(--text-main);">Nano Banana Studio</h5>
            </div>
          </div>

        </div>

        <!-- View Switcher Tabs Toolbar -->
        <div style="display: flex; align-items: center; justify-content: space-between; background: #ffffff; padding: 10px 18px; border-radius: 10px; border: 1px solid var(--border-color); flex-wrap: wrap; gap: 10px;">
          
          <div style="display: flex; gap: 8px;" id="ranking-view-tabs">
            <button class="btn btn-secondary ${this.activeTab === 'top10' ? 'active-tab' : ''}" style="padding: 6px 14px; font-size: 0.82rem;" onclick="RankingPage.switchTab('top10')">
              🏆 Top 10 Curated & Refined (<span id="tab-top10-count">10</span>)
            </button>
            <button class="btn btn-secondary ${this.activeTab === 'all' ? 'active-tab' : ''}" style="padding: 6px 14px; font-size: 0.82rem;" onclick="RankingPage.switchTab('all')">
              📥 All Scraped Stories Pool (<span id="tab-all-count">0</span>)
            </button>
            <button class="btn btn-secondary ${this.activeTab === 'rules' ? 'active-tab' : ''}" style="padding: 6px 14px; font-size: 0.82rem;" onclick="RankingPage.switchTab('rules')">
              ⚙️ Custom AI Agent Rules Cockpit
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted);">Current Scope:</span>
            <span style="font-size: 0.76rem; font-weight: 700; background: rgba(46,125,50,0.1); color: #2e7d32; padding: 3px 10px; border-radius: 12px; border: 1px solid rgba(46,125,50,0.2);">
              ● Active Pipeline Run
            </span>
          </div>

        </div>

        <!-- Tab 1: Top 10 Master-Detail Split Studio View -->
        <div id="tab-view-top10" style="display: grid; grid-template-columns: 440px 1fr; gap: 18px; align-items: start;">
          
          <!-- Left Column: Top 10 Ranked Cards List -->
          <div style="display: flex; flex-direction: column; gap: 10px;" id="top10-cards-list">
            <div class="glass-card" style="text-align: center; padding: 30px;"><p>Loading Top 10 curated stories...</p></div>
          </div>

          <!-- Right Column: Interactive Story Inspector & Nano Banana Studio Bridge -->
          <div class="glass-card" id="story-inspector" style="background: #ffffff; padding: 22px; border: 1px solid var(--border-color); border-radius: 12px; position: sticky; top: 70px; min-height: 480px;">
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
              <i data-lucide="hand-metal" style="width: 32px; height: 32px; margin-bottom: 8px;"></i>
              <p>Select any of the Top 10 stories on the left to inspect refined content & Nano Banana slides.</p>
            </div>
          </div>

        </div>

        <!-- Tab 2: All Scraped Articles Pool (Hidden by default) -->
        <div id="tab-view-all" style="display: none; flex-direction: column; gap: 12px;">
          <div style="background: #ffffff; padding: 14px 18px; border-radius: 10px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
            <p style="font-size: 0.84rem; color: var(--text-muted);">
              All raw news scraped in this pipeline run. Articles with score ≥ 75 qualify for the Top 10. Click <strong>"Boost to Top 10"</strong> to promote any story.
            </p>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;" id="all-scraped-list"></div>
        </div>

        <!-- Tab 3: Custom AI Agent Rules Cockpit (Hidden by default) -->
        <div id="tab-view-rules" style="display: none;">
          <div class="glass-card" style="background: #ffffff; border: 1px solid var(--border-color); border-radius: 14px; padding: 22px;">
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(217, 119, 87, 0.15); color: var(--primary-purple); display: flex; align-items: center; justify-content: center;">
                  <i data-lucide="sliders" style="width: 20px; height: 20px;"></i>
                </div>
                <div>
                  <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--text-main);">
                    Custom AI Agent Ranking Rules & Criteria
                  </h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted);">
                    Customize how the AI scoring agent evaluates, filters, and selects the Top 10 news.
                  </p>
                </div>
              </div>

              <!-- Profile Presets -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Presets:</span>
                <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="RankingPage.applyPreset('ai_tech')">🤖 AI & LLMs</button>
                <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="RankingPage.applyPreset('startups')">🚀 Startups & VC</button>
                <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="RankingPage.applyPreset('consumer_tech')">📱 Consumer Tech</button>
              </div>
            </div>

            <!-- Rules Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 18px;">
              
              <div style="display: flex; flex-direction: column; gap: 14px;">
                <div>
                  <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">
                    🎯 Target Audience & Niche Focus
                  </label>
                  <input type="text" id="rule-niche-input" class="filter-select" style="width: 100%; padding: 8px 12px; font-size: 0.85rem;" />
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">
                      ⚡ Minimum Threshold Score for Top 10 Qualification
                    </label>
                    <span id="threshold-val" style="font-size: 0.85rem; font-weight: 800; color: var(--primary-purple); background: rgba(217,119,87,0.12); padding: 2px 8px; border-radius: 6px;">
                      75 / 100
                    </span>
                  </div>
                  <input type="range" id="rule-threshold-slider" min="50" max="90" value="75" step="1" style="width: 100%; cursor: pointer;" 
                    oninput="document.getElementById('threshold-val').textContent = this.value + ' / 100'" />
                </div>
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">
                  📜 Core AI Agent Scoring Directive (Prompt)
                </label>
                <textarea id="rule-prompt-input" rows="4" class="filter-select" style="width: 100%; font-family: var(--font-sans); font-size: 0.84rem; line-height: 1.5; padding: 10px; resize: vertical;"></textarea>
              </div>

            </div>

            <!-- Topic Boosts & Negative Filters Row -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: var(--bg-surface); padding: 14px 16px; border-radius: 10px; border: 1px solid var(--border-color); margin-bottom: 16px;">
              
              <div>
                <label style="font-size: 0.8rem; font-weight: 700; color: #2e7d32; display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                  <i data-lucide="plus-circle" style="width: 14px; height: 14px;"></i> Priority Focus Topics (+15 to +30 Pts)
                </label>
                <div id="positive-topics-container" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;"></div>
                <div style="display: flex; gap: 6px;">
                  <input type="text" id="add-pos-topic-input" class="filter-select" style="flex: 1; padding: 5px 10px; font-size: 0.78rem;" placeholder="Add topic (e.g. LLM Inference)..." />
                  <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="RankingPage.addPositiveTopic()">Add</button>
                </div>
              </div>

              <div>
                <label style="font-size: 0.8rem; font-weight: 700; color: #c62828; display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                  <i data-lucide="minus-circle" style="width: 14px; height: 14px;"></i> Negative Filters / Penalties (-20 to -40 Pts)
                </label>
                <div id="negative-filters-container" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;"></div>
                <div style="display: flex; gap: 6px;">
                  <input type="text" id="add-neg-filter-input" class="filter-select" style="flex: 1; padding: 5px 10px; font-size: 0.78rem;" placeholder="Add negative filter (e.g. Affiliate Deals)..." />
                  <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="RankingPage.addNegativeFilter()">Add</button>
                </div>
              </div>

            </div>

            <!-- Action Buttons -->
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button class="btn btn-primary btn-glow" style="padding: 7px 18px; font-size: 0.84rem;" onclick="RankingPage.saveRankingRules()">
                <i data-lucide="check"></i> Save Rules & Update AI Agent
              </button>
            </div>

          </div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    await this.loadData();
  },

  switchTab(tabKey) {
    this.activeTab = tabKey;
    
    // Toggle tab buttons
    const tabs = document.querySelectorAll('#ranking-view-tabs button');
    tabs.forEach((t, idx) => {
      const isMatch = (idx === 0 && tabKey === 'top10') || (idx === 1 && tabKey === 'all') || (idx === 2 && tabKey === 'rules');
      t.classList.toggle('active-tab', isMatch);
    });

    // Toggle tab view containers
    const vTop10 = document.getElementById('tab-view-top10');
    const vAll = document.getElementById('tab-view-all');
    const vRules = document.getElementById('tab-view-rules');

    if (vTop10) vTop10.style.display = tabKey === 'top10' ? 'grid' : 'none';
    if (vAll) vAll.style.display = tabKey === 'all' ? 'flex' : 'none';
    if (vRules) vRules.style.display = tabKey === 'rules' ? 'block' : 'none';

    if (window.lucide) window.lucide.createIcons();
  },

  async loadData() {
    try {
      // 1. Fetch Top 10 data from dedicated endpoint
      const top10Res = await App.fetchApi('/api/ranking/top10');
      this.top10 = top10Res.top10 || [];

      // 2. Fetch all scraped articles for this run
      const allRes = await App.fetchApi('/api/articles?limit=140');
      let allArticles = allRes.articles || [];
      allArticles.sort((a, b) => (b.rank_score || 75) - (a.rank_score || 75));
      this.allArticles = allArticles;

      // 3. Fetch active rules
      try {
        const rulesRes = await App.fetchApi('/api/ranking/rules');
        if (rulesRes) this.rules = { ...this.rules, ...rulesRes };
      } catch (e) {}

      // Update Header counts
      const elScraped = document.getElementById('flow-scraped-count');
      const elRanked = document.getElementById('flow-ranked-count');
      const elTopCount = document.getElementById('tab-top10-count');
      const elAllCount = document.getElementById('tab-all-count');

      if (elScraped) elScraped.textContent = `${this.allArticles.length} Scraped`;
      if (elRanked) elRanked.textContent = `${this.allArticles.length} Evaluated`;
      if (elTopCount) elTopCount.textContent = this.top10.length;
      if (elAllCount) elAllCount.textContent = this.allArticles.length;

      // Select first Top 10 story by default
      if (this.top10.length > 0 && !this.selectedArticleId) {
        this.selectedArticleId = this.top10[0].id;
      }

      this.renderTop10Cards();
      this.renderInspector();
      this.renderAllScrapedList();
      this.populateRulesUI();

    } catch (e) {
      console.error("Failed to load ranking studio data", e);
    }
  },

  renderTop10Cards() {
    const container = document.getElementById('top10-cards-list');
    if (!container) return;

    if (this.top10.length === 0) {
      container.innerHTML = '<div class="glass-card" style="text-align: center; padding: 30px;"><p>No Top 10 articles found. Please run the pipeline.</p></div>';
      return;
    }

    container.innerHTML = this.top10.map((a, idx) => {
      const isSelected = a.id === this.selectedArticleId;
      const score = a.rank_score || 75;

      let scoreColor = score >= 90 ? '#d97757' : score >= 80 ? '#2e7d32' : '#2b7bb9';
      let scoreBg = score >= 90 ? 'rgba(217,119,87,0.12)' : score >= 80 ? 'rgba(46,125,50,0.12)' : 'rgba(43,123,185,0.12)';

      return `
        <div class="top10-card ${isSelected ? 'selected' : ''}" onclick="RankingPage.selectStory(${a.id})" 
          style="padding: 14px 16px; background: ${isSelected ? '#ffffff' : '#ffffff'}; border: 1.5px solid ${isSelected ? 'var(--primary-purple)' : 'var(--border-color)'}; border-radius: 10px; cursor: pointer; transition: all 0.15s ease; box-shadow: ${isSelected ? '0 4px 16px rgba(217,119,87,0.14)' : '0 1px 3px rgba(0,0,0,0.02)'};">
          
          <!-- Top Row: Rank badge, Source, Score -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.74rem; font-weight: 800; background: ${isSelected ? 'var(--primary-purple)' : '#1f1e1b'}; color: #ffffff; padding: 2px 7px; border-radius: 4px;">
                #${idx + 1}
              </span>
              <span class="source-pill" style="font-size: 0.7rem; padding: 1px 6px;">${a.source}</span>
              <span style="font-size: 0.72rem; color: var(--text-dim);">${a.category}</span>
            </div>

            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 0.76rem; font-weight: 800; background: ${scoreBg}; color: ${scoreColor}; padding: 1px 7px; border-radius: 4px;">
                ${score}/100
              </span>
            </div>
          </div>

          <!-- Title -->
          <h4 style="font-family: var(--font-serif); font-size: 0.98rem; font-weight: 600; line-height: 1.35; color: var(--text-main); margin-bottom: 6px;">
            ${a.title}
          </h4>

          <!-- AI Rule Justification Highlight -->
          <div style="font-size: 0.74rem; color: var(--text-muted); background: var(--bg-surface); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            <i data-lucide="bot" style="width: 12px; height: 12px; color: var(--primary-purple); flex-shrink: 0;"></i>
            <span style="overflow: hidden; text-overflow: ellipsis;">${a.rank_reason}</span>
          </div>

          <!-- Bottom micro row -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.05); font-size: 0.7rem;">
            <span style="color: #2e7d32; font-weight: 600; display: flex; align-items: center; gap: 4px;">
              <span style="width: 5px; height: 5px; border-radius: 50%; background: #2e7d32;"></span> Refined & Studio Ready
            </span>
            <span style="color: var(--primary-purple); font-weight: 600;">
              ${isSelected ? '● Active View' : 'Inspect →'}
            </span>
          </div>

        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  selectStory(articleId) {
    this.selectedArticleId = articleId;
    this.renderTop10Cards();
    this.renderInspector();
  },

  renderInspector() {
    const container = document.getElementById('story-inspector');
    if (!container) return;

    const story = this.top10.find(a => a.id === this.selectedArticleId) || this.top10[0];
    if (!story) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No story selected.</p>';
      return;
    }

    const slideImagesHtml = (story.slide_urls && story.slide_urls.length > 0) ? `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px;">
        ${story.slide_urls.map((url, i) => `
          <div style="border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); background: var(--bg-surface);">
            <img src="${url}" style="width: 100%; height: auto; display: block; aspect-ratio: 1/1; object-fit: cover;" alt="Slide ${i+1}" />
            <div style="padding: 4px; font-size: 0.68rem; text-align: center; font-weight: 700; color: var(--text-muted);">Slide ${i+1}</div>
          </div>
        `).join('')}
      </div>
    ` : `
      <div style="background: var(--bg-surface); padding: 18px; border-radius: 8px; border: 1px dashed var(--border-color); text-align: center; margin-top: 8px;">
        <i data-lucide="image" style="width: 24px; height: 24px; color: var(--text-dim); margin-bottom: 4px;"></i>
        <p style="font-size: 0.78rem; color: var(--text-muted);">Click "Generate 4-Slide Deck" below to build visual assets for this story.</p>
      </div>
    `;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Inspector Top Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.8rem; font-weight: 800; background: #1f1e1b; color: #ffffff; padding: 3px 8px; border-radius: 5px;">
              RANK #${story.rank}
            </span>
            <span class="source-pill">${story.source}</span>
            <span style="font-size: 0.76rem; color: var(--text-muted);">r/${story.subreddit}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.82rem; font-weight: 800; background: rgba(46,125,50,0.12); color: #2e7d32; padding: 3px 10px; border-radius: 6px; border: 1px solid rgba(46,125,50,0.25);">
              AI SCORE ${story.rank_score}/100
            </span>
          </div>
        </div>

        <!-- Headline & Original Link -->
        <div>
          <h3 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; line-height: 1.35; color: var(--text-main); margin-bottom: 6px;">
            ${story.title}
          </h3>
          <a href="${story.url}" target="_blank" style="font-size: 0.78rem; color: var(--primary-purple); text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
            <i data-lucide="external-link" style="width: 12px; height: 12px;"></i> View Original Source Article (${story.source})
          </a>
        </div>

        <!-- AI Ranking Agent Verdict -->
        <div style="background: rgba(217, 119, 87, 0.08); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(217, 119, 87, 0.2); font-size: 0.82rem; color: var(--text-main);">
          <div style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--primary-purple); margin-bottom: 2px;">
            <i data-lucide="check-circle" style="width: 14px; height: 14px;"></i> Custom AI Rule Justification:
          </div>
          <p style="line-height: 1.45;">${story.rank_reason}</p>
        </div>

        <!-- AI Refined Content & Social Context -->
        <div style="background: var(--bg-surface); padding: 14px; border-radius: 10px; border: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.04em;">
              ✨ AI Refined Content & Context
            </span>
            <span style="font-size: 0.72rem; color: #2e7d32; font-weight: 600;">● Gemini 2.5 Refined</span>
          </div>

          <div style="font-size: 0.84rem; color: var(--text-main); line-height: 1.5; margin-bottom: 10px; font-weight: 500;">
            ${story.refined_body}
          </div>

          <!-- Social Media Context Snippets -->
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px;">
            <span style="font-size: 0.72rem; background: #ffffff; border: 1px solid var(--border-color); padding: 3px 8px; border-radius: 4px; color: var(--text-muted);">
              🐦 Twitter/X Hook: Ready
            </span>
            <span style="font-size: 0.72rem; background: #ffffff; border: 1px solid var(--border-color); padding: 3px 8px; border-radius: 4px; color: var(--text-muted);">
              💼 LinkedIn Post: Formatted
            </span>
            <span style="font-size: 0.72rem; background: #ffffff; border: 1px solid var(--border-color); padding: 3px 8px; border-radius: 4px; color: var(--text-muted);">
              💬 Reddit Discussion: Prompted
            </span>
          </div>
        </div>

        <!-- Nano Banana Studio Visual System Prompt -->
        <div style="background: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.04em; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="wand-2" style="width: 14px; height: 14px; color: var(--primary-purple);"></i> Nano Banana Visual System Prompt
            </span>
            <button class="btn btn-secondary" style="padding: 2px 8px; font-size: 0.7rem;" onclick="RankingPage.copyPrompt('${story.id}')">
              <i data-lucide="copy"></i> Copy Prompt
            </button>
          </div>

          <p id="prompt-text-${story.id}" style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-muted); background: var(--bg-surface); padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border-color); line-height: 1.4; word-break: break-word;">
            ${story.nano_banana_prompt}
          </p>

          <!-- Nano Banana 4-Slide Deck Preview -->
          <div style="margin-top: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.04em;">
                🎨 Nano Banana 4-Slide Visual Deck
              </span>
              <button class="btn btn-secondary" style="padding: 2px 8px; font-size: 0.72rem;" onclick="RankingPage.generateSlides(${story.id})">
                <i data-lucide="refresh-cw"></i> Re-Render Slides
              </button>
            </div>

            ${slideImagesHtml}
          </div>
        </div>

        <!-- Action Footer -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 8px;">
          <span style="font-size: 0.74rem; color: var(--text-muted);">
            Scraped: ${App.formatTimestamp(story.scraped_at)}
          </span>

          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.76rem;" onclick="App.openArticleModal(${story.id})">
              <i data-lucide="eye"></i> Full Article Modal
            </button>
            <button class="btn btn-primary btn-glow" style="padding: 6px 14px; font-size: 0.76rem;" onclick="App.navigateTo('media')">
              <i data-lucide="wand-2"></i> Open in Nano Banana Studio →
            </button>
          </div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  renderAllScrapedList() {
    const container = document.getElementById('all-scraped-list');
    if (!container) return;

    if (this.allArticles.length === 0) {
      container.innerHTML = '<div class="glass-card" style="text-align: center; padding: 30px;"><p>No scraped articles found.</p></div>';
      return;
    }

    container.innerHTML = this.allArticles.map((a, idx) => {
      const isTop10 = idx < 10;
      const score = a.rank_score || 75;

      return `
        <div class="glass-card" style="padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; background: #ffffff; border-radius: 8px; gap: 12px;">
          
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
            <span style="font-size: 0.74rem; font-weight: 800; background: ${isTop10 ? '#2e7d32' : '#6e6b65'}; color: #ffffff; padding: 2px 6px; border-radius: 4px;">
              #${idx + 1}
            </span>
            <span class="source-pill" style="font-size: 0.7rem;">${a.source}</span>
            <h5 style="font-family: var(--font-serif); font-size: 0.95rem; font-weight: 600; color: var(--text-main); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${a.title}
            </h5>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
            <span style="font-size: 0.76rem; font-weight: 700; color: ${score >= 80 ? '#2e7d32' : '#d97757'};">
              ${score}/100
            </span>
            ${!isTop10 ? `
              <button class="btn btn-secondary" style="padding: 3px 8px; font-size: 0.72rem;" onclick="RankingPage.boostScore(${a.id})">
                🚀 Boost to Top 10
              </button>
            ` : `
              <span style="font-size: 0.72rem; color: #2e7d32; font-weight: 700;">● In Top 10</span>
            `}
          </div>

        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  populateRulesUI() {
    const nicheInput = document.getElementById('rule-niche-input');
    const promptInput = document.getElementById('rule-prompt-input');
    const slider = document.getElementById('rule-threshold-slider');
    const sliderVal = document.getElementById('threshold-val');

    if (nicheInput) nicheInput.value = this.rules.target_niche || '';
    if (promptInput) promptInput.value = this.rules.ranking_prompt || '';
    if (slider) slider.value = this.rules.min_threshold_score || 75;
    if (sliderVal) sliderVal.textContent = (this.rules.min_threshold_score || 75) + ' / 100';

    this.renderTopicsPills();
  },

  renderTopicsPills() {
    const posCont = document.getElementById('positive-topics-container');
    const negCont = document.getElementById('negative-filters-container');

    if (posCont) {
      posCont.innerHTML = (this.rules.positive_topics || []).map((t, idx) => `
        <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.74rem; background: rgba(46,125,50,0.12); color: #2e7d32; border: 1px solid rgba(46,125,50,0.25); padding: 3px 8px; border-radius: 12px; font-weight: 600;">
          ${t}
          <i data-lucide="x" style="width: 12px; height: 12px; cursor: pointer;" onclick="RankingPage.removePositiveTopic(${idx})"></i>
        </span>
      `).join('');
    }

    if (negCont) {
      negCont.innerHTML = (this.rules.negative_filters || []).map((t, idx) => `
        <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.74rem; background: rgba(198,40,40,0.12); color: #c62828; border: 1px solid rgba(198,40,40,0.25); padding: 3px 8px; border-radius: 12px; font-weight: 600;">
          ${t}
          <i data-lucide="x" style="width: 12px; height: 12px; cursor: pointer;" onclick="RankingPage.removeNegativeFilter(${idx})"></i>
        </span>
      `).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  },

  addPositiveTopic() {
    const input = document.getElementById('add-pos-topic-input');
    const val = input.value.trim();
    if (val && !this.rules.positive_topics.includes(val)) {
      this.rules.positive_topics.push(val);
      input.value = '';
      this.renderTopicsPills();
    }
  },

  removePositiveTopic(idx) {
    this.rules.positive_topics.splice(idx, 1);
    this.renderTopicsPills();
  },

  addNegativeFilter() {
    const input = document.getElementById('add-neg-filter-input');
    const val = input.value.trim();
    if (val && !this.rules.negative_filters.includes(val)) {
      this.rules.negative_filters.push(val);
      input.value = '';
      this.renderTopicsPills();
    }
  },

  removeNegativeFilter(idx) {
    this.rules.negative_filters.splice(idx, 1);
    this.renderTopicsPills();
  },

  applyPreset(key) {
    const p = this.presets[key];
    if (p) {
      this.rules = JSON.parse(JSON.stringify(p));
      this.populateRulesUI();
      App.showToast(`Applied preset: ${p.profile_name}`, 'info');
    }
  },

  async saveRankingRules() {
    const nicheInput = document.getElementById('rule-niche-input');
    const promptInput = document.getElementById('rule-prompt-input');
    const slider = document.getElementById('rule-threshold-slider');

    this.rules.target_niche = nicheInput ? nicheInput.value.trim() : this.rules.target_niche;
    this.rules.ranking_prompt = promptInput ? promptInput.value.trim() : this.rules.ranking_prompt;
    this.rules.min_threshold_score = slider ? parseInt(slider.value) : 75;

    try {
      const res = await App.fetchApi('/api/ranking/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.rules)
      });
      App.showToast(res.message || 'AI Ranking Rules saved successfully!', 'success');
      this.switchTab('top10');
    } catch (e) {
      App.showToast(`Failed to save rules: ${e.message}`, 'error');
    }
  },

  async runRerank() {
    const btn = document.getElementById('rerank-btn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Re-Ranking Run...';
      btn.disabled = true;
    }

    try {
      App.showToast('Evaluating articles with Custom AI Rules & selecting Top 10...', 'info');
      const res = await App.fetchApi('/api/ranking/rerank', { method: 'POST' });
      App.showToast(res.message || 'Articles re-ranked! Top 10 updated.', 'success');
      await this.loadData();
    } catch (e) {
      App.showToast(`Re-ranking failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="sparkles"></i> Re-Rank Pipeline Run';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  boostScore(articleId) {
    const art = this.allArticles.find(a => a.id === articleId);
    if (art) {
      art.rank_score = 99;
      art.rank_reason = "Manually promoted by user into Top 10 Leaderboard (Score 99/100).";
      App.showToast(`Promoted article #${articleId} into Top 10!`, 'success');
      this.loadData();
      this.switchTab('top10');
    }
  },

  async generateSlides(articleId) {
    try {
      App.showToast(`Generating Nano Banana 4-Slide Deck for Story #${articleId}...`, 'info');
      const res = await App.fetchApi(`/api/articles/${articleId}/slides`, { method: 'POST' });
      if (res && res.success) {
        App.showToast(`4-Slide Deck generated successfully!`, 'success');
        await this.loadData();
      }
    } catch (e) {
      App.showToast(`Nano Banana generation: ${e.message}`, 'error');
    }
  },

  copyPrompt(articleId) {
    const el = document.getElementById(`prompt-text-${articleId}`);
    if (el) {
      navigator.clipboard.writeText(el.textContent.trim());
      App.showToast('Nano Banana visual prompt copied to clipboard!', 'success');
    }
  }
};
