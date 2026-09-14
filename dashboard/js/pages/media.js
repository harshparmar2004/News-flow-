/**
 * Pillar 3: Nano Banana Graphic Studio & Visual Prompt Console
 * Configures visual prompt directives, style presets, and target aspect ratios.
 * Applies visual generation across the Top 10 AI Ranked news stories.
 * Note: Generated visual catalog decks are presented inside the AI Rank & Refine Studio (#ranking).
 */
const MediaPage = {
  top10: [],
  isGenerating: false,

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 22px; max-width: 1200px; margin: 0 auto; padding-bottom: 40px;">
        
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.35rem;">🎨</span>
              <h2 style="font-family: var(--font-serif); font-size: 1.4rem; font-weight: 700; color: var(--text-main);">
                Nano Banana Graphic Studio & Prompt Console
              </h2>
              <span style="font-size: 0.72rem; font-weight: 700; background: rgba(193, 53, 132, 0.12); color: #c13584; padding: 3px 9px; border-radius: 12px; border: 1px solid rgba(193, 53, 132, 0.25);">
                MCP Engine Active
              </span>
            </div>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-top: 4px;">
              Configure visual directives, style preset, and aspect ratio. Generates high-impact visual decks applied across <strong>Rank #1 to Rank #10</strong> news.
            </p>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="MediaPage.loadData()">
              <i data-lucide="refresh-cw"></i> Refresh Status
            </button>
            <button class="btn btn-secondary" onclick="App.navigateTo('ranking')">
              <i data-lucide="award"></i> View Top 10 in Ranking Studio →
            </button>
            <button class="btn btn-primary btn-glow" id="gen-top10-btn" onclick="MediaPage.generateTop10Visuals()">
              <i data-lucide="sparkles"></i> Generate All Top 10 Visuals
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
              <h5 style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);" id="media-scraped-stat">16 Sources</h5>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; border-right: 1px solid var(--border-color); padding-right: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(217, 119, 87, 0.12); color: var(--primary-purple); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="award" style="width: 18px; height: 18px;"></i>
            </div>
            <div>
              <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Stage 2</span>
              <h5 style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">Top 10 Curated</h5>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; border-right: 1px solid var(--border-color); padding-right: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(46, 125, 50, 0.15); color: #2e7d32; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="check-circle" style="width: 18px; height: 18px;"></i>
            </div>
            <div>
              <span style="font-size: 0.65rem; font-weight: 700; color: #2e7d32; text-transform: uppercase; letter-spacing: 0.04em;">Stage 3</span>
              <h5 style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">Context Refined</h5>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; background: rgba(193, 53, 132, 0.05); border-radius: 8px; padding-left: 8px;">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(193, 53, 132, 0.15); color: #c13584; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="wand-2" style="width: 18px; height: 18px;"></i>
            </div>
            <div>
              <span style="font-size: 0.65rem; font-weight: 700; color: #c13584; text-transform: uppercase; letter-spacing: 0.04em;">Stage 4 (Active)</span>
              <h5 style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">Visual Studio Console</h5>
            </div>
          </div>

        </div>

        <!-- Nano Banana Visual Configuration Studio Card -->
        <div class="glass-card" style="border: 2px solid var(--primary-purple); background: #ffffff; border-radius: 14px; padding: 22px; box-shadow: 0 4px 20px rgba(217,119,87,0.08);">
          
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(217, 119, 87, 0.15); color: var(--primary-purple); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i data-lucide="sliders" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <h4 style="font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700; color: var(--text-main);">
                  Visual Prompt & Rendering Directives
                </h4>
                <p style="font-size: 0.8rem; color: var(--text-muted);">
                  These instructions guide the Nano Banana MCP engine when synthesizing editorial cards and 4-slide catalog carousels.
                </p>
              </div>
            </div>
            <span class="badge" style="background: rgba(46,125,50,0.1); color: #2e7d32; border: 1px solid rgba(46,125,50,0.25); padding: 5px 12px; font-weight: 700;">
              🍌 NANO BANANA READY
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            
            <!-- Prompt Textarea -->
            <div>
              <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span>✨ Custom Image Generation Prompt Instructions:</span>
                <span style="font-size: 0.74rem; font-weight: 400; color: var(--text-muted);">Injected into each Top 10 story template</span>
              </label>
              <textarea id="nano-banana-prompt-text" rows="3" class="filter-select" style="width: 100%; font-family: var(--font-sans); font-size: 0.86rem; line-height: 1.5; padding: 12px; resize: vertical;" placeholder="Modern minimalist tech news editorial infographic card, warm terracotta and clean slate accents, bold headline typography, high contrast, clean branding..."></textarea>
            </div>

            <!-- Parameters Grid: Visual Style Preset | Target Aspect Ratio | Target Scope -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1.3fr; gap: 14px;">
              
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">
                  🎨 Visual Style Preset:
                </label>
                <select id="nano-banana-style-preset" class="filter-select" style="width: 100%; padding: 9px; font-size: 0.84rem;">
                  <option selected>Warm Claude Minimal (Terracotta & Cream)</option>
                  <option>Futuristic Dark Neon Tech</option>
                  <option>Clean Editorial Infographic</option>
                  <option>Bold Gradient Social Slide Card</option>
                  <option>Cyberpunk Minimalist Slate</option>
                </select>
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">
                  📐 Target Aspect Ratio:
                </label>
                <select id="nano-banana-aspect-ratio" class="filter-select" style="width: 100%; padding: 9px; font-size: 0.84rem;">
                  <option selected>1:1 Square Instagram (1080 x 1080)</option>
                  <option>4:5 Instagram Portrait (1080 x 1350)</option>
                  <option>16:9 Editorial Banner (1920 x 1080)</option>
                </select>
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">
                  🎯 Target Scope to Apply:
                </label>
                <select id="nano-banana-target-article" class="filter-select" style="width: 100%; padding: 9px; font-size: 0.84rem;">
                  <option value="">✨ Apply to All Top 10 Ranked Stories (#1 to #10)</option>
                </select>
              </div>

            </div>

            <!-- Actions Bar -->
            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 6px; padding-top: 14px; border-top: 1px solid var(--border-color); flex-wrap: wrap;">
              <button class="btn btn-secondary" style="padding: 9px 18px; font-size: 0.84rem; font-weight: 600;" onclick="MediaPage.savePromptSettings()">
                <i data-lucide="save"></i> 💾 Save Visual Style & Directives
              </button>
              <button class="btn btn-primary btn-glow" id="trigger-gen-btn" style="padding: 9px 24px; font-size: 0.86rem; font-weight: 700;" onclick="MediaPage.generateCustomVisuals()">
                <i data-lucide="sparkles"></i> 🎨 Apply & Generate Images
              </button>
            </div>

          </div>
        </div>

        <!-- Live Generation Banner / Progress (Hidden by default) -->
        <div id="gen-progress-banner" style="display: none; background: rgba(217,119,87,0.08); border: 1.5px solid var(--primary-purple); border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <i data-lucide="loader-2" class="spin" style="width: 20px; height: 20px; color: var(--primary-purple);"></i>
            <span style="font-size: 0.86rem; font-weight: 600; color: var(--text-main);" id="gen-progress-text">
              Generating Nano Banana visual decks across all Top 10 stories...
            </span>
          </div>
          <span style="font-size: 0.76rem; font-weight: 700; color: var(--primary-purple);">PROCESSING</span>
        </div>

        <!-- Target Articles Pipeline Queue (Clean Structured Overview Table) -->
        <div class="glass-card" style="background: #ffffff; border: 1px solid var(--border-color); border-radius: 12px; padding: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <div>
              <h4 style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 6px;">
                📋 Top 10 News Visual Pipeline Target Queue
              </h4>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">
                The prompt directives and visual style above will be applied sequentially to these 10 breakthrough stories.
              </p>
            </div>
            <span style="font-size: 0.72rem; font-weight: 700; background: var(--bg-surface); padding: 3px 9px; border-radius: 6px; border: 1px solid var(--border-color);" id="queue-status-count">
              10 Stories in Queue
            </span>
          </div>

          <div id="top10-queue-list" style="display: flex; flex-direction: column; gap: 6px;">
            <div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.8rem;">Loading Top 10 target articles...</div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border-color); font-size: 0.76rem; flex-wrap: wrap; gap: 8px;">
            <span style="color: var(--text-muted);">
              💡 <em>All generated 4-slide catalog decks can be reviewed directly in the AI Rank & Refine Studio.</em>
            </span>
            <button class="btn btn-secondary" style="font-size: 0.74rem; padding: 4px 12px;" onclick="App.navigateTo('ranking')">
              🏆 Open AI Rank & Refine Studio →
            </button>
          </div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    await this.loadData();
  },

  async loadData() {
    const articleSelect = document.getElementById('nano-banana-target-article');
    const promptInput = document.getElementById('nano-banana-prompt-text');
    const queueList = document.getElementById('top10-queue-list');
    const countBadge = document.getElementById('queue-status-count');
    const scrapedStat = document.getElementById('media-scraped-stat');

    try {
      const top10Res = await App.fetchApi('/api/ranking/top10');
      this.top10 = top10Res.top10 || [];
      const totalScraped = top10Res.total_scraped || 0;

      if (scrapedStat) scrapedStat.textContent = `16 Sources · ${totalScraped} Scraped`;
      if (countBadge) countBadge.textContent = `${this.top10.length} Stories in Queue`;

      // Set default prompt if empty
      if (promptInput && !promptInput.value.trim()) {
        const storedPrompt = localStorage.getItem('nano_banana_custom_prompt');
        if (storedPrompt) {
          promptInput.value = storedPrompt;
        } else {
          promptInput.value = "Modern editorial 1:1 square infographic card for Tech & AI Breakthroughs. Minimalist layout, bold typography, warm terracotta and dark slate accents, high contrast.";
        }
      }

      // Populate target article dropdown
      if (articleSelect) {
        articleSelect.innerHTML = '<option value="">✨ Apply to All Top 10 Ranked Stories (#1 to #10)</option>' +
          this.top10.map((a, idx) => `
            <option value="${a.id}">
              #${idx + 1} (${a.rank_score || 75}/100): ${a.source} - ${a.title.substring(0, 45)}...
            </option>
          `).join('');
      }

      // Check incoming target from session storage (when user clicks "Open in Nano Banana Studio" in Ranking)
      const deepLinkId = sessionStorage.getItem('nano_banana_target_id');
      const deepLinkPrompt = sessionStorage.getItem('nano_banana_prompt');

      if (deepLinkId && articleSelect) {
        articleSelect.value = deepLinkId;
        sessionStorage.removeItem('nano_banana_target_id');
      }
      if (deepLinkPrompt && promptInput) {
        promptInput.value = deepLinkPrompt;
        sessionStorage.removeItem('nano_banana_prompt');
        App.showToast(`Loaded Nano Banana prompt for Story #${deepLinkId || ''}`, 'info');
      }

      // Render the Top 10 Target Overview Table
      if (queueList) {
        if (this.top10.length === 0) {
          queueList.innerHTML = `
            <div style="text-align: center; padding: 30px; color: var(--text-muted);">
              <p>No Top 10 stories found. Please run the pipeline first.</p>
            </div>
          `;
          return;
        }

        queueList.innerHTML = this.top10.map((a, idx) => {
          const rankNum = idx + 1;
          const hasSlides = a.slide_urls && a.slide_urls.length > 0;
          const score = a.rank_score || 75;
          const rankBadgeBg = rankNum <= 3 ? '#d97757' : '#1f1e1b';
          const scoreColor = score >= 90 ? '#d97757' : score >= 80 ? '#2e7d32' : '#2b7bb9';
          const scoreBg = score >= 90 ? 'rgba(217,119,87,0.08)' : score >= 80 ? 'rgba(46,125,50,0.08)' : 'rgba(43,123,185,0.08)';

          return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 7px 12px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 7px; gap: 10px; transition: all 0.15s ease;" onmouseover="this.style.background='#ffffff'; this.style.borderColor='rgba(217,119,87,0.35)'; this.style.boxShadow='0 1px 4px rgba(0,0,0,0.03)'" onmouseout="this.style.background='var(--bg-surface)'; this.style.borderColor='var(--border-color)'; this.style.boxShadow='none'">
              
              <div style="display: flex; align-items: flex-start; gap: 8px; min-width: 0; flex: 1;">
                <span style="font-size: 0.68rem; font-weight: 800; background: ${rankBadgeBg}; color: #ffffff; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; min-width: 26px; text-align: center; margin-top: 1px;">
                  #${rankNum}
                </span>
                <span class="source-pill" style="font-size: 0.64rem; padding: 2px 6px; flex-shrink: 0; margin-top: 1px;">${a.source}</span>
                <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px;">
                  <a href="${a.url || '#'}" target="_blank" rel="noopener noreferrer" style="font-family: var(--font-serif); font-size: 0.82rem; font-weight: 600; color: var(--text-main); text-decoration: none; line-height: 1.35; display: block; word-break: break-word;" onmouseover="this.style.color='var(--primary-purple)'" onmouseout="this.style.color='var(--text-main)'">
                    ${a.title}
                  </a>
                  ${a.refined_body ? `
                    <span style="font-size: 0.71rem; color: var(--text-muted); line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word;">
                      ${a.refined_body}
                    </span>
                  ` : ''}
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-left: 8px;">
                <span style="font-size: 0.72rem; font-weight: 700; color: ${scoreColor}; background: ${scoreBg}; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(0,0,0,0.05); white-space: nowrap;">
                  ${score}/100
                </span>

                ${hasSlides ? `
                  <span style="font-size: 0.68rem; font-weight: 700; background: rgba(46,125,50,0.12); color: #2e7d32; padding: 2px 7px; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; border: 1px solid rgba(46,125,50,0.25); white-space: nowrap;">
                    <i data-lucide="check" style="width: 11px; height: 11px;"></i> 4 Slides Ready
                  </span>
                ` : `
                  <span style="font-size: 0.68rem; font-weight: 600; background: rgba(0,0,0,0.04); color: var(--text-muted); padding: 2px 7px; border-radius: 4px; border: 1px solid var(--border-color); white-space: nowrap;">
                    Pending Gen
                  </span>
                `}

                <button class="btn btn-secondary" style="padding: 3px 8px; font-size: 0.7rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;" onclick="MediaPage.generateSingleStory(${a.id})" title="Generate or re-render 4-slide catalog deck">
                  <i data-lucide="sparkles" style="width: 11px; height: 11px;"></i> Render
                </button>

                <a href="${a.url || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 3px 6px; font-size: 0.7rem; color: var(--primary-purple); display: inline-flex; align-items: center;" title="Open original article website ↗">
                  <i data-lucide="external-link" style="width: 11px; height: 11px;"></i>
                </a>
              </div>

            </div>
          `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
      }

    } catch (e) {
      console.error("Failed to load Nano Banana studio data", e);
    }
  },

  savePromptSettings() {
    const promptInput = document.getElementById('nano-banana-prompt-text');
    const stylePreset = document.getElementById('nano-banana-style-preset');
    const aspectRatio = document.getElementById('nano-banana-aspect-ratio');

    if (promptInput) {
      localStorage.setItem('nano_banana_custom_prompt', promptInput.value.trim());
    }
    if (stylePreset) {
      localStorage.setItem('nano_banana_style_preset', stylePreset.value);
    }
    if (aspectRatio) {
      localStorage.setItem('nano_banana_aspect_ratio', aspectRatio.value);
    }

    App.showToast('Nano Banana visual prompt & style directives saved!', 'success');
  },

  async generateTop10Visuals() {
    const promptText = document.getElementById('nano-banana-prompt-text')?.value.trim() || '';
    const stylePreset = document.getElementById('nano-banana-style-preset')?.value || 'Warm Claude Minimal';
    const btn = document.getElementById('gen-top10-btn');
    const progressBanner = document.getElementById('gen-progress-banner');
    const progressText = document.getElementById('gen-progress-text');

    if (btn) {
      btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Generating 10 Decks...';
      btn.disabled = true;
    }
    if (progressBanner) progressBanner.style.display = 'flex';
    if (progressText) progressText.textContent = `Applying '${stylePreset}' & generating 4-slide catalog decks for all Top 10 stories...`;
    if (window.lucide) window.lucide.createIcons();

    try {
      App.showToast('Generating Nano Banana 4-slide decks for all Top 10 stories...', 'info');
      const res = await App.fetchApi('/api/ranking/generate-all-slides', { method: 'POST' });
      App.showToast(res.message || 'Successfully generated visual decks for all Top 10 stories!', 'success');
      await this.loadData();
    } catch (err) {
      App.showToast(`Generation failed: ${err.message}`, 'error');
    } finally {
      if (btn) {
        btn.innerHTML = '<i data-lucide="sparkles"></i> Generate All Top 10 Visuals';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
      if (progressBanner) progressBanner.style.display = 'none';
    }
  },

  async generateCustomVisuals() {
    const articleSelect = document.getElementById('nano-banana-target-article');
    const targetId = articleSelect ? articleSelect.value : '';

    if (!targetId) {
      // Apply to all Top 10
      await this.generateTop10Visuals();
    } else {
      // Apply to selected story
      await this.generateSingleStory(parseInt(targetId));
    }
  },

  async generateSingleStory(articleId) {
    try {
      App.showToast(`Generating Nano Banana 4-slide deck for Story #${articleId}...`, 'info');
      const res = await App.fetchApi(`/api/articles/${articleId}/slides`, { method: 'POST' });
      if (res && res.success) {
        App.showToast(`4-Slide Deck generated successfully for Story #${articleId}!`, 'success');
        await this.loadData();
      }
    } catch (err) {
      App.showToast(`Slide generation error: ${err.message}`, 'error');
    }
  }
};
