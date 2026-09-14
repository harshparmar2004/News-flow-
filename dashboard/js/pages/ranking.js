/**
 * Pillar 2: Custom AI Agent News Ranking Rules & Engine
 * Evaluates, scores (1-100), and ranks news with structured rule criteria,
 * topic boosts, negative exclusion filters, score meters, and instant re-ranking.
 */
const RankingPage = {
  articles: [],
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
  activeFilter: 'top10',
  selectedSource: 'all',

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
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Header Banner -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--text-main);">
              🧠 Pillar 2: Custom AI Agent News Ranking Rules & Engine
            </h3>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-top: 2px;">
              Configure intelligent scoring directives, topic priority boosts, and spam filters to score news (1-100).
            </p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" onclick="RankingPage.loadRankedNews()">
              <i data-lucide="refresh-cw"></i> Refresh Leaderboard
            </button>
            <button class="btn btn-primary btn-glow" id="rerank-btn" onclick="RankingPage.runRerank()">
              <i data-lucide="sparkles"></i> Apply Rules & Re-Rank Stories
            </button>
          </div>
        </div>

        <!-- Custom AI Agent Ranking Rules Cockpit -->
        <div class="glass-card" style="background: #ffffff; border: 1px solid var(--border-color); border-radius: 14px; padding: 22px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(217, 119, 87, 0.15); color: var(--primary-purple); display: flex; align-items: center; justify-content: center;">
                <i data-lucide="sliders" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--text-main);">
                  Custom AI Agent Ranking Rules & Niche Criteria
                </h4>
                <p style="font-size: 0.8rem; color: var(--text-muted);">
                  The AI scoring agent evaluates each scraped article based on these exact parameters.
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

          <!-- Structured Form Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 18px;">
            
            <!-- Left Column: Niche & Threshold -->
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">
                  🎯 Target Audience & Niche Focus
                </label>
                <input type="text" id="rule-niche-input" class="filter-select" style="width: 100%; padding: 8px 12px; font-size: 0.85rem;" 
                  placeholder="e.g. AI Researchers, Startup Founders, Tech Enthusiasts" />
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">
                    ⚡ Minimum Threshold Score for App 2 Transfer
                  </label>
                  <span id="threshold-val" style="font-size: 0.85rem; font-weight: 800; color: var(--primary-purple); background: rgba(217,119,87,0.12); padding: 2px 8px; border-radius: 6px;">
                    75 / 100
                  </span>
                </div>
                <input type="range" id="rule-threshold-slider" min="50" max="90" value="75" step="1" style="width: 100%; cursor: pointer;" 
                  oninput="document.getElementById('threshold-val').textContent = this.value + ' / 100'" />
                <span style="font-size: 0.72rem; color: var(--text-muted);">Only stories scoring at or above this threshold will sync to App 2.</span>
              </div>
            </div>

            <!-- Right Column: Core Prompt Directive -->
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">
                📜 Core AI Agent Scoring Directive (Prompt)
              </label>
              <textarea id="rule-prompt-input" rows="4" class="filter-select" style="width: 100%; font-family: var(--font-sans); font-size: 0.84rem; line-height: 1.5; padding: 10px; resize: vertical;" 
                placeholder="Instruct the AI on what stories to score 90+ vs 50..."></textarea>
            </div>

          </div>

          <!-- Structured Topic Boosts & Negative Filters Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: var(--bg-surface); padding: 14px 16px; border-radius: 10px; border: 1px solid var(--border-color); margin-bottom: 16px;">
            
            <!-- Positive Topics Boost -->
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <label style="font-size: 0.8rem; font-weight: 700; color: #2e7d32; display: flex; align-items: center; gap: 6px;">
                  <i data-lucide="plus-circle" style="width: 14px; height: 14px;"></i> Priority Focus Topics (+15 to +30 Pts)
                </label>
              </div>
              <div id="positive-topics-container" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;"></div>
              <div style="display: flex; gap: 6px;">
                <input type="text" id="add-pos-topic-input" class="filter-select" style="flex: 1; padding: 5px 10px; font-size: 0.78rem;" placeholder="Add focus topic (e.g. Quantum Computing)..." />
                <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="RankingPage.addPositiveTopic()">Add</button>
              </div>
            </div>

            <!-- Negative Exclusion Filters -->
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <label style="font-size: 0.8rem; font-weight: 700; color: #c62828; display: flex; align-items: center; gap: 6px;">
                  <i data-lucide="minus-circle" style="width: 14px; height: 14px;"></i> Negative Filters / Penalties (-20 to -40 Pts)
                </label>
              </div>
              <div id="negative-filters-container" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;"></div>
              <div style="display: flex; gap: 6px;">
                <input type="text" id="add-neg-filter-input" class="filter-select" style="flex: 1; padding: 5px 10px; font-size: 0.78rem;" placeholder="Add negative filter (e.g. Coupon Codes)..." />
                <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="RankingPage.addNegativeFilter()">Add</button>
              </div>
            </div>

          </div>

          <!-- Bottom Action Bar -->
          <div style="display: flex; align-items: center; justify-content: space-between; pt: 8px;">
            <span style="font-size: 0.78rem; color: var(--text-muted);">
              💡 Changes are instantly applied to the AI scoring agent during pipeline and re-ranking runs.
            </span>
            <div style="display: flex; gap: 10px;">
              <button class="btn btn-primary btn-glow" style="padding: 7px 18px; font-size: 0.84rem;" onclick="RankingPage.saveRankingRules()">
                <i data-lucide="check"></i> Save AI Ranking Rules
              </button>
            </div>
          </div>

        </div>

        <!-- Filter & Sorting Tabs Toolbar -->
        <div style="display: flex; align-items: center; justify-content: space-between; background: #ffffff; padding: 10px 18px; border-radius: 10px; border: 1px solid var(--border-color); flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="ranking-filter-tabs">
            <button class="btn btn-secondary ${this.activeFilter === 'top10' ? 'active-tab' : ''}" style="padding: 6px 14px; font-size: 0.8rem;" onclick="RankingPage.setFilter('top10')">
              🔥 Top 10 Leaderboard
            </button>
            <button class="btn btn-secondary ${this.activeFilter === 'all' ? 'active-tab' : ''}" style="padding: 6px 14px; font-size: 0.8rem;" onclick="RankingPage.setFilter('all')">
              🌟 All Ranked News (<span id="count-all">0</span>)
            </button>
            <button class="btn btn-secondary ${this.activeFilter === 'high' ? 'active-tab' : ''}" style="padding: 6px 14px; font-size: 0.8rem;" onclick="RankingPage.setFilter('high')">
              ⚡ High Priority (80-100)
            </button>
            <button class="btn btn-secondary ${this.activeFilter === 'medium' ? 'active-tab' : ''}" style="padding: 6px 14px; font-size: 0.8rem;" onclick="RankingPage.setFilter('medium')">
              🟡 Moderate (60-79)
            </button>
            <button class="btn btn-secondary ${this.activeFilter === 'low' ? 'active-tab' : ''}" style="padding: 6px 14px; font-size: 0.8rem;" onclick="RankingPage.setFilter('low')">
              🔴 Filtered (<60)
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <select id="ranking-source-filter" class="filter-select" style="padding: 4px 10px; font-size: 0.78rem;" onchange="RankingPage.onSourceFilterChange(this.value)">
              <option value="all">All Sources</option>
            </select>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;" id="ranking-status-label">Showing Top 10</span>
          </div>
        </div>

        <!-- Ranked News Leaderboard Cards List -->
        <div style="display: flex; flex-direction: column; gap: 12px;" id="ranking-cards-list">
          <div class="glass-card" style="text-align: center; padding: 40px;"><p>Loading AI ranked news leaderboard...</p></div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    await this.loadRules();
    await this.loadRankedNews();
  },

  async loadRules() {
    try {
      const res = await App.fetchApi('/api/ranking/rules');
      if (res) {
        this.rules = { ...this.rules, ...res };
      }
      this.populateRulesUI();
    } catch (e) {
      console.warn("Using default rules", e);
      this.populateRulesUI();
    }
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
    } catch (e) {
      App.showToast(`Failed to save rules: ${e.message}`, 'error');
    }
  },

  async runRerank() {
    await this.saveRankingRules();
    const btn = document.getElementById('rerank-btn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Re-Ranking Stories...';
      btn.disabled = true;
    }

    try {
      App.showToast('Evaluating all articles against active Custom AI Rules...', 'info');
      const res = await App.fetchApi('/api/ranking/rerank', { method: 'POST' });
      App.showToast(res.message || 'Articles successfully re-ranked!', 'success');
      await this.loadRankedNews();
    } catch (e) {
      App.showToast(`Re-ranking failed: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="sparkles"></i> Apply Rules & Re-Rank Stories';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  setFilter(filterType) {
    this.activeFilter = filterType;
    const tabs = document.querySelectorAll('#ranking-filter-tabs button');
    tabs.forEach(t => t.classList.remove('active-tab'));
    this.renderRankedCards();
  },

  onSourceFilterChange(val) {
    this.selectedSource = val;
    this.renderRankedCards();
  },

  async loadRankedNews() {
    try {
      const data = await App.fetchApi('/api/articles?limit=120');
      let articles = data.articles || [];

      // Sort by rank_score descending
      articles.sort((a, b) => (b.rank_score || 75) - (a.rank_score || 75));
      this.articles = articles;

      // Populate source filter dropdown
      const srcSelect = document.getElementById('ranking-source-filter');
      if (srcSelect) {
        const uniqueSources = Array.from(new Set(articles.map(a => a.source).filter(Boolean)));
        srcSelect.innerHTML = '<option value="all">All Sources</option>' + 
          uniqueSources.map(s => `<option value="${s}" ${this.selectedSource === s ? 'selected' : ''}>${s}</option>`).join('');
      }

      const countAll = document.getElementById('count-all');
      if (countAll) countAll.textContent = this.articles.length;

      this.renderRankedCards();
    } catch (e) {
      console.error("Failed to load ranking leaderboard", e);
    }
  },

  renderRankedCards() {
    const list = document.getElementById('ranking-cards-list');
    const label = document.getElementById('ranking-status-label');
    if (!list) return;

    let filtered = [...this.articles];

    // Source filter
    if (this.selectedSource !== 'all') {
      filtered = filtered.filter(a => a.source === this.selectedSource);
    }

    if (this.activeFilter === 'top10') {
      filtered = filtered.slice(0, 10);
      if (label) label.textContent = `Showing Top 10 Ranked News`;
    } else if (this.activeFilter === 'high') {
      filtered = filtered.filter(a => (a.rank_score || 75) >= 80);
      if (label) label.textContent = `Showing High Priority (${filtered.length} items)`;
    } else if (this.activeFilter === 'medium') {
      filtered = filtered.filter(a => (a.rank_score || 75) >= 60 && (a.rank_score || 75) < 80);
      if (label) label.textContent = `Showing Moderate Priority (${filtered.length} items)`;
    } else if (this.activeFilter === 'low') {
      filtered = filtered.filter(a => (a.rank_score || 75) < 60);
      if (label) label.textContent = `Showing Low Priority (${filtered.length} items)`;
    } else {
      if (label) label.textContent = `Showing All ${filtered.length} Ranked Articles`;
    }

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="glass-card" style="text-align: center; padding: 40px; background: #ffffff;">
          <i data-lucide="inbox" style="width: 36px; height: 36px; color: var(--text-dim); margin-bottom: 8px;"></i>
          <p style="color: var(--text-muted); font-size: 0.9rem;">No articles match the selected filter criteria.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    list.innerHTML = filtered.map((a, index) => {
      const score = a.rank_score || 75;
      const minThreshold = this.rules.min_threshold_score || 75;
      const isSyncReady = score >= minThreshold;

      // Dynamic color theme based on score tier
      let scoreColor = '#2e7d32';
      let scoreBg = 'rgba(46,125,50,0.1)';
      let scoreBorder = '#2e7d32';
      let tierLabel = '🔥 Top Impact';

      if (score >= 90) {
        scoreColor = '#d97757';
        scoreBg = 'rgba(217,119,87,0.12)';
        scoreBorder = '#d97757';
        tierLabel = '🔥 Viral Breakthrough';
      } else if (score >= 80) {
        scoreColor = '#2e7d32';
        scoreBg = 'rgba(46,125,50,0.12)';
        scoreBorder = '#2e7d32';
        tierLabel = '⚡ High Impact';
      } else if (score >= 60) {
        scoreColor = '#2b7bb9';
        scoreBg = 'rgba(43,123,185,0.12)';
        scoreBorder = '#2b7bb9';
        tierLabel = '🟡 Standard Niche';
      } else {
        scoreColor = '#c62828';
        scoreBg = 'rgba(198,40,40,0.12)';
        scoreBorder = '#c62828';
        tierLabel = '🔴 Filtered Out';
      }

      // Format clean excerpt (only if body exists, never render empty fallback box)
      const cleanExcerpt = a.body ? a.body.replace(/\s+/g, ' ').trim() : '';
      const displaySnippet = cleanExcerpt.length > 170 ? cleanExcerpt.substring(0, 170) + '...' : cleanExcerpt;

      return `
        <div class="glass-card" style="padding: 16px 20px; border-left: 4px solid ${scoreBorder}; background: #ffffff; border-radius: 12px; transition: transform 0.15s ease, box-shadow 0.15s ease;">
          
          <!-- Top Header Meta Row -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 0.76rem; font-weight: 800; background: #1f1e1b; color: #ffffff; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.04em;">
                #${index + 1}
              </span>
              <span class="source-pill" style="font-size: 0.72rem; padding: 2px 8px;">${a.source || 'RSS Feed'}</span>
              <span style="font-size: 0.74rem; color: var(--text-muted); background: var(--bg-surface); padding: 2px 8px; border-radius: 4px; border: 1px solid var(--border-color);">
                ${a.category || 'tech'}
              </span>
              <span style="font-size: 0.74rem; color: var(--text-muted);">
                Target: <strong>r/${a.subreddit || 'technology'}</strong>
              </span>
            </div>

            <!-- Score Pill with Visual Progress Gauge -->
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                <span style="font-size: 0.8rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: ${scoreBg}; color: ${scoreColor}; border: 1px solid ${scoreBorder};">
                  ${tierLabel} • ${score}/100
                </span>
                <div style="width: 85px; height: 4px; background: #eee; border-radius: 2px; overflow: hidden;">
                  <div style="width: ${score}%; height: 100%; background: ${scoreColor};"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Headline -->
          <h4 style="font-family: var(--font-serif); font-size: 1.12rem; font-weight: 600; line-height: 1.35; margin-bottom: 8px;">
            <a href="${a.url}" target="_blank" style="color: var(--text-main); text-decoration: none;">${a.title}</a>
          </h4>

          ${displaySnippet ? `
            <!-- Concise Clean Excerpt -->
            <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 10px; font-style: italic;">
              "${displaySnippet}"
            </p>
          ` : ''}

          <!-- Structured AI Justification Banner -->
          <div style="display: flex; align-items: center; gap: 8px; background: rgba(217, 119, 87, 0.06); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(217, 119, 87, 0.2); font-size: 0.8rem; color: var(--text-main); margin-bottom: 10px;">
            <i data-lucide="bot" style="width: 16px; height: 16px; color: var(--primary-purple); flex-shrink: 0;"></i>
            <div style="overflow: hidden; text-overflow: ellipsis;">
              <strong>AI Agent Verdict:</strong> ${a.rank_reason || 'Evaluated against custom AI niche rules.'}
            </div>
          </div>

          <!-- Card Bottom Action Row -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 0.74rem; color: var(--text-muted);">
                ${App.formatTimestamp(a.scraped_at)}
              </span>
              ${isSyncReady ? `
                <span style="font-size: 0.72rem; font-weight: 700; color: #2e7d32; display: flex; align-items: center; gap: 4px;">
                  <span style="width: 6px; height: 6px; border-radius: 50%; background: #2e7d32;"></span> App 2 Sync Ready
                </span>
              ` : `
                <span style="font-size: 0.72rem; color: var(--text-dim);">Below Sync Threshold</span>
              `}
            </div>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.74rem;" onclick="App.openArticleModal(${a.id})" title="Inspect Full Content">
                <i data-lucide="eye"></i> View Story
              </button>
              <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.74rem;" onclick="RankingPage.boostScore(${a.id})" title="Boost to 98/100">
                <i data-lucide="arrow-up-circle"></i> Boost
              </button>
              <button class="btn btn-primary btn-glow" style="padding: 4px 12px; font-size: 0.74rem;" onclick="RankingPage.generateSlides(${a.id})">
                <i data-lucide="wand-2"></i> Generate 4-Slide Deck →
              </button>
            </div>
          </div>

        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  boostScore(articleId) {
    const art = this.articles.find(a => a.id === articleId);
    if (art) {
      art.rank_score = 98;
      art.rank_reason = "Manually boosted by user to viral top impact tier (98/100).";
      App.showToast(`Article #${articleId} boosted to Score 98/100!`, 'success');
      this.renderRankedCards();
    }
  },

  async generateSlides(articleId) {
    try {
      App.showToast(`Generating Nano Banana 4-Slide Deck for Article #${articleId}...`, 'info');
      const res = await App.fetchApi(`/api/articles/${articleId}/slides`, { method: 'POST' });
      if (res && res.success) {
        App.showToast(`4-Slide Deck generated successfully!`, 'success');
        App.openArticleModal(articleId);
      }
    } catch (e) {
      App.showToast(`Nano Banana generation: ${e.message}`, 'error');
    }
  }
};
