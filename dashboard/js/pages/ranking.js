/**
 * Pillar 2: AI News Rank & Refine Studio
 * Displays strictly the Top 10 highest-ranked stories from the pipeline run.
 * Refines editorial context, synthesizes key takeaways, crafts Nano Banana visual prompts,
 * and connects directly to Nano Banana Studio for 4-slide catalog generation.
 */
const RankingPage = {
  top10: [],
  totalScraped: 0,
  rulesDrawerOpen: false,
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
      <div style="display: flex; flex-direction: column; gap: 20px; max-width: 1280px; margin: 0 auto; padding-bottom: 40px;">
        
        <!-- Top Header & Primary Actions -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.35rem;">🏆</span>
              <h2 style="font-family: var(--font-serif); font-size: 1.4rem; font-weight: 700; color: var(--text-main);">
                Top 10 AI Ranked & Refined News
              </h2>
              <span style="font-size: 0.72rem; font-weight: 700; background: rgba(217,119,87,0.12); color: var(--primary-purple); padding: 3px 9px; border-radius: 12px; border: 1px solid rgba(217,119,87,0.25);">
                Active Pipeline Run
              </span>
            </div>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-top: 4px;">
              Evaluates raw news with Custom AI Agent Rules, curates strictly the <strong>Top 10 breakthrough stories</strong>, refines executive summaries, and creates Nano Banana visual decks.
            </p>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="RankingPage.toggleRulesDrawer()">
              <i data-lucide="sliders"></i> Custom AI Agent Rules
            </button>
            <button class="btn btn-secondary" id="batch-slides-btn" onclick="RankingPage.generateAllTop10Slides()">
              <i data-lucide="sparkles"></i> Batch Generate 4-Slide Decks
            </button>
            <button class="btn btn-secondary" id="rerank-btn" onclick="RankingPage.runRerank()">
              <i data-lucide="refresh-cw"></i> Re-Rank Run
            </button>
            <button class="btn btn-primary btn-glow" onclick="App.navigateTo('media')">
              <i data-lucide="wand-2"></i> Nano Banana Studio →
            </button>
          </div>
        </div>

        <!-- Pipeline Workflow Stage Progression Bar -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; background: #ffffff; padding: 14px 18px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
          
          <div style="display: flex; align-items: center; gap: 12px; border-right: 1px solid var(--border-color); padding-right: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(43, 123, 185, 0.12); color: #2b7bb9; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="database" style="width: 18px; height: 18px;"></i>
            </div>
            <div>
              <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Stage 1</span>
              <h5 style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);" id="flow-scraped-count">16 Sources · 133 Scraped</h5>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; border-right: 1px solid var(--border-color); padding-right: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(217, 119, 87, 0.12); color: var(--primary-purple); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="cpu" style="width: 18px; height: 18px;"></i>
            </div>
            <div>
              <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Stage 2</span>
              <h5 style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);" id="flow-ranked-count">AI Agent Rules Applied</h5>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; border-right: 1px solid var(--border-color); padding-right: 12px; background: rgba(46,125,50,0.04); border-radius: 8px; padding-left: 8px;">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(46, 125, 50, 0.15); color: #2e7d32; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="check-circle" style="width: 18px; height: 18px;"></i>
            </div>
            <div>
              <span style="font-size: 0.65rem; font-weight: 700; color: #2e7d32; text-transform: uppercase; letter-spacing: 0.04em;">Stage 3 (Active)</span>
              <h5 style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">Top 10 Curated & Refined</h5>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; cursor: pointer;" onclick="App.navigateTo('media')">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(193, 53, 132, 0.12); color: #c13584; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="wand-2" style="width: 18px; height: 18px;"></i>
            </div>
            <div>
              <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Stage 4</span>
              <h5 style="font-size: 0.88rem; font-weight: 700; color: var(--primary-purple);">Nano Banana Studio →</h5>
            </div>
          </div>

        </div>

        <!-- Collapsible Custom AI Agent Rules Cockpit Drawer -->
        <div id="rules-drawer" style="display: none; background: #ffffff; border: 1.5px solid var(--primary-purple); border-radius: 14px; padding: 22px; box-shadow: 0 4px 20px rgba(217,119,87,0.12);">
          
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
                  The AI scoring agent evaluates all scraped news against these directives and selects strictly the Top 10 stories.
                </p>
              </div>
            </div>

            <!-- Profile Presets & Close Button -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Presets:</span>
              <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="RankingPage.applyPreset('ai_tech')">🤖 AI & LLMs</button>
              <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="RankingPage.applyPreset('startups')">🚀 Startups & VC</button>
              <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="RankingPage.applyPreset('consumer_tech')">📱 Consumer Tech</button>
              <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="RankingPage.toggleRulesDrawer()">✕ Close</button>
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
            <button class="btn btn-primary btn-glow" style="padding: 8px 20px; font-size: 0.84rem;" onclick="RankingPage.saveRankingRules()">
              <i data-lucide="check"></i> Save Rules & Apply to Agent
            </button>
          </div>

        </div>

        <!-- Top 10 Stories Feed Container -->
        <div id="top10-cards-container" style="display: flex; flex-direction: column; gap: 18px;">
          <div class="glass-card" style="text-align: center; padding: 40px;">
            <i data-lucide="loader-2" class="spin" style="width: 28px; height: 28px; color: var(--primary-purple); margin-bottom: 8px;"></i>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Loading Top 10 Curated & Refined Stories...</p>
          </div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    await this.loadData();
  },

  toggleRulesDrawer() {
    this.rulesDrawerOpen = !this.rulesDrawerOpen;
    const el = document.getElementById('rules-drawer');
    if (el) {
      el.style.display = this.rulesDrawerOpen ? 'block' : 'none';
      if (this.rulesDrawerOpen) {
        this.populateRulesUI();
      }
    }
    if (window.lucide) window.lucide.createIcons();
  },

  async loadData() {
    try {
      const top10Res = await App.fetchApi('/api/ranking/top10');
      this.top10 = top10Res.top10 || [];
      this.totalScraped = top10Res.total_scraped || 0;

      try {
        const rulesRes = await App.fetchApi('/api/ranking/rules');
        if (rulesRes) this.rules = { ...this.rules, ...rulesRes };
      } catch (e) {}

      const elScraped = document.getElementById('flow-scraped-count');
      if (elScraped) elScraped.textContent = `16 Sources · ${this.totalScraped} Scraped`;

      this.renderTop10List();
      this.populateRulesUI();

    } catch (e) {
      console.error("Failed to load top 10 ranking data", e);
      const container = document.getElementById('top10-cards-container');
      if (container) {
        container.innerHTML = `
          <div class="glass-card" style="text-align: center; padding: 40px;">
            <p class="error">Failed to load Top 10 news stories: ${e.message}</p>
            <button class="btn btn-primary" style="margin-top: 12px;" onclick="RankingPage.loadData()">Retry</button>
          </div>
        `;
      }
    }
  },

  renderTop10List() {
    const container = document.getElementById('top10-cards-container');
    if (!container) return;

    if (this.top10.length === 0) {
      container.innerHTML = `
        <div class="glass-card" style="text-align: center; padding: 50px; background: #ffffff;">
          <i data-lucide="award" style="width: 48px; height: 48px; color: var(--primary-purple); margin-bottom: 12px;"></i>
          <h4 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; margin-bottom: 6px;">
            No Top 10 Stories Found Yet
          </h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 18px; max-width: 500px; margin-left: auto; margin-right: auto;">
            Run the pipeline to scrape news across all 16 sources and automatically evaluate the Top 10 breakthrough stories with Custom AI Agent Rules.
          </p>
          <button class="btn btn-primary btn-glow" onclick="App.triggerPipeline()">
            <i data-lucide="play"></i> Run Pipeline Now
          </button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = this.top10.map((story, idx) => {
      const score = story.rank_score || 75;
      const rankNum = idx + 1;

      let rankBadgeBg = rankNum === 1 ? '#d97757' : rankNum === 2 ? '#2b7bb9' : rankNum === 3 ? '#c13584' : '#1f1e1b';
      let scoreColor = score >= 90 ? '#d97757' : score >= 80 ? '#2e7d32' : '#2b7bb9';
      let scoreBg = score >= 90 ? 'rgba(217,119,87,0.12)' : score >= 80 ? 'rgba(46,125,50,0.12)' : 'rgba(43,123,185,0.12)';

      const slideImagesHtml = (story.slide_urls && story.slide_urls.length > 0) ? `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px;">
          ${story.slide_urls.map((url, i) => `
            <div style="border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); background: #faf7f2; cursor: pointer; transition: transform 0.15s ease;" onclick="window.open('${url}', '_blank')">
              <img src="${url}" style="width: 100%; height: auto; display: block; aspect-ratio: 1/1; object-fit: cover;" alt="Slide ${i+1}" />
              <div style="padding: 5px; font-size: 0.7rem; text-align: center; font-weight: 700; color: var(--text-muted); background: #ffffff;">
                ${i === 0 ? '① Title Hook' : i === 1 ? '② Key Insight' : i === 2 ? '③ Deep Analysis' : '④ Discussion'}
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div style="background: var(--bg-surface); padding: 16px; border-radius: 8px; border: 1px dashed var(--border-color); text-align: center; margin-top: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 8px; text-align: left;">
            <i data-lucide="image" style="width: 20px; height: 20px; color: var(--primary-purple);"></i>
            <span style="font-size: 0.8rem; color: var(--text-muted);">4-Slide Visual Deck ready to be rendered for this story.</span>
          </div>
          <button class="btn btn-secondary" style="padding: 4px 12px; font-size: 0.76rem;" onclick="RankingPage.generateSlides(${story.id})">
            <i data-lucide="sparkles"></i> Generate 4-Slide Deck
          </button>
        </div>
      `;

      return `
        <div class="glass-card" style="background: #ffffff; border: 1px solid var(--border-color); border-radius: 14px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Card Header Row -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 0.82rem; font-weight: 800; background: ${rankBadgeBg}; color: #ffffff; padding: 4px 12px; border-radius: 6px; letter-spacing: 0.04em;">
                #${rankNum} RANK
              </span>
              <span class="source-pill" style="font-size: 0.74rem; font-weight: 700; padding: 3px 9px;">${story.source}</span>
              <span style="font-size: 0.74rem; color: var(--text-muted); background: var(--bg-surface); padding: 3px 8px; border-radius: 4px; border: 1px solid var(--border-color);">
                ${story.category || 'Tech'}
              </span>
              <span style="font-size: 0.72rem; color: var(--text-dim);">r/${story.subreddit || 'technology'}</span>
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 0.8rem; font-weight: 800; background: ${scoreBg}; color: ${scoreColor}; padding: 3px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.06);">
                AI SCORE: ${score}/100
              </span>
              <a href="${story.url}" target="_blank" style="font-size: 0.76rem; color: var(--primary-purple); text-decoration: none; display: inline-flex; align-items: center; gap: 3px;">
                Original Article <i data-lucide="external-link" style="width: 12px; height: 12px;"></i>
              </a>
            </div>
          </div>

          <!-- Main Story Headline -->
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; line-height: 1.35; color: var(--text-main); margin-bottom: 4px;">
              ${story.title}
            </h3>
          </div>

          <!-- Section 1: AI Refined Narrative & Context -->
          <div style="background: var(--bg-surface); padding: 14px 16px; border-radius: 10px; border: 1px solid var(--border-color);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.04em; display: flex; align-items: center; gap: 5px;">
                <i data-lucide="sparkles" style="width: 14px; height: 14px; color: var(--primary-purple);"></i>
                AI Refined Narrative & Strategic Context
              </span>
              <span style="font-size: 0.72rem; color: #2e7d32; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: #2e7d32;"></span> Gemini 2.5 Refined
              </span>
            </div>

            <p style="font-size: 0.86rem; color: var(--text-main); line-height: 1.55; margin-bottom: 10px; font-weight: 500;">
              ${story.refined_body}
            </p>

            ${story.key_takeaways && story.key_takeaways.length > 0 ? `
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border-color); display: flex; flex-direction: column; gap: 4px;">
                ${story.key_takeaways.map(t => `
                  <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: baseline; gap: 6px;">
                    <span style="color: var(--primary-purple); font-weight: 700;">•</span>
                    <span>${t}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Multi-Platform Social Badges -->
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px;">
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

          <!-- Section 2: Custom AI Agent Justification -->
          <div style="background: rgba(217, 119, 87, 0.06); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(217, 119, 87, 0.2); font-size: 0.82rem; color: var(--text-main);">
            <div style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--primary-purple); margin-bottom: 2px;">
              <i data-lucide="bot" style="width: 14px; height: 14px;"></i> Custom AI Agent Ranking Justification:
            </div>
            <p style="line-height: 1.45; font-size: 0.8rem;">${story.rank_reason}</p>
          </div>

          <!-- Section 3: Nano Banana Visual System Prompt & 4-Slide Deck -->
          <div style="background: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid var(--border-color);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.04em; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="wand-2" style="width: 14px; height: 14px; color: var(--primary-purple);"></i>
                Nano Banana Visual System Prompt
              </span>
              <button class="btn btn-secondary" style="padding: 2px 8px; font-size: 0.72rem;" onclick="RankingPage.copyPrompt(${story.id})">
                <i data-lucide="copy"></i> Copy Prompt
              </button>
            </div>

            <p id="prompt-text-${story.id}" style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-muted); background: var(--bg-surface); padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border-color); line-height: 1.4; word-break: break-word;">
              ${story.nano_banana_prompt}
            </p>

            <!-- 4-Slide Deck Display -->
            <div style="margin-top: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.04em;">
                  🎨 Nano Banana 4-Slide Catalog Deck
                </span>
                <button class="btn btn-secondary" style="padding: 2px 8px; font-size: 0.72rem;" onclick="RankingPage.generateSlides(${story.id})">
                  <i data-lucide="refresh-cw"></i> Re-Render Slides
                </button>
              </div>

              ${slideImagesHtml}
            </div>
          </div>

          <!-- Card Actions Footer -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 8px;">
            <span style="font-size: 0.74rem; color: var(--text-muted);">
              Scraped: ${App.formatTimestamp(story.scraped_at)}
            </span>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.78rem;" onclick="App.openArticleModal(${story.id})">
                <i data-lucide="eye"></i> Inspect Full Article
              </button>
              <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.78rem;" onclick="RankingPage.generateSlides(${story.id})">
                <i data-lucide="sparkles"></i> 4-Slide Deck
              </button>
              <button class="btn btn-primary btn-glow" style="padding: 6px 14px; font-size: 0.78rem;" onclick="RankingPage.openInNanoBanana(${story.id})">
                <i data-lucide="wand-2"></i> Open in Nano Banana Studio →
              </button>
            </div>
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
      this.toggleRulesDrawer();
    } catch (e) {
      App.showToast(`Failed to save rules: ${e.message}`, 'error');
    }
  },

  async runRerank() {
    const btn = document.getElementById('rerank-btn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Re-Ranking...';
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
        btn.innerHTML = '<i data-lucide="refresh-cw"></i> Re-Rank Run';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
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
      App.showToast(`Slide generation error: ${e.message}`, 'error');
    }
  },

  async generateAllTop10Slides() {
    const btn = document.getElementById('batch-slides-btn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Generating 10 Decks...';
      btn.disabled = true;
    }

    try {
      App.showToast('Generating 4-slide catalog decks for all Top 10 stories...', 'info');
      const res = await App.fetchApi('/api/ranking/generate-all-slides', { method: 'POST' });
      App.showToast(res.message || 'Generated 4-slide decks for Top 10 stories!', 'success');
      await this.loadData();
    } catch (e) {
      App.showToast(`Batch generation error: ${e.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="sparkles"></i> Batch Generate 4-Slide Decks';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  openInNanoBanana(articleId) {
    sessionStorage.setItem('nano_banana_target_id', articleId.toString());
    const story = this.top10.find(s => s.id === articleId);
    if (story && story.nano_banana_prompt) {
      sessionStorage.setItem('nano_banana_prompt', story.nano_banana_prompt);
    }
    App.navigateTo('media');
  },

  copyPrompt(articleId) {
    const el = document.getElementById(`prompt-text-${articleId}`);
    if (el) {
      navigator.clipboard.writeText(el.textContent.trim());
      App.showToast('Nano Banana visual prompt copied to clipboard!', 'success');
    }
  }
};
