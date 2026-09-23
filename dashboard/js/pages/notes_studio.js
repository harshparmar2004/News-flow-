/**
 * Tech Notes & Instagram Carousel Studio Page
 * Generates and previews handwritten spiral-notebook PDFs and 1080x1350 PNG slides
 * with official technology logos and seamless Instagram/App 2 dispatching.
 */

const NotesStudioPage = {
  activeDoc: null,
  activeSlideIdx: 0,
  allDocs: [],
  isGenerating: false,

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 1280px; margin: 0 auto; padding-bottom: 50px;">
        
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.5rem;">📓</span>
              <h2 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: var(--text-main);">
                Tech Notes & Instagram Carousel Studio
              </h2>
              <span style="font-size: 0.72rem; font-weight: 700; background: rgba(37, 99, 235, 0.1); color: #2563eb; padding: 3px 10px; border-radius: 12px; border: 1px solid rgba(37, 99, 235, 0.25);">
                1080x1350 Native 4:5 Vector
              </span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Generates handwritten spiral-notebook cheat sheets, architecture diagrams, and multi-slide Instagram carousels with official tech logos.
            </p>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="NotesStudioPage.loadDocuments()">
              <i data-lucide="refresh-cw"></i> Refresh Vault
            </button>
            <button class="btn btn-secondary" onclick="App.navigateTo('articles')">
              <i data-lucide="newspaper"></i> Content Vault →
            </button>
          </div>
        </div>

        <!-- Generation Studio Control Bar -->
        <div class="glass-card" style="background: #ffffff; padding: 22px; border-radius: 14px; border: 1px solid var(--border-color); box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
          <div style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 12px;">
            1. Instant Topic Presets & Custom Configuration
          </div>

          <!-- Quick Presets -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px;" id="notes-preset-chips">
            ${[
              { name: "Python OOPs", icon: "🐍", color: "#2563eb" },
              { name: "Docker", icon: "🐳", color: "#0284c7" },
              { name: "Kubernetes", icon: "☸️", color: "#3b82f6" },
              { name: "ChatGPT & AI", icon: "🤖", color: "#059669" },
              { name: "DSA Algorithms", icon: "🌳", color: "#7c3aed" },
              { name: "MERN Stack", icon: "⚛️", color: "#0891b2" },
              { name: "SQL & Postgres", icon: "🐘", color: "#1d4ed8" },
              { name: "Git Cheat Sheet", icon: "🐙", color: "#ea580c" },
              { name: "FastAPI", icon: "⚡", color: "#059669" }
            ].map(p => `
              <button class="btn" style="background: #f8fafc; border: 1px solid var(--border-color); font-size: 0.8rem; font-weight: 600; padding: 6px 14px; border-radius: 20px; display: flex; align-items: center; gap: 6px; cursor: pointer;"
                      onclick="NotesStudioPage.selectPreset('${p.name}')">
                <span>${p.icon}</span>
                <span>${p.name}</span>
              </button>
            `).join('')}
          </div>

          <!-- Inputs Grid -->
          <div style="display: grid; grid-template-columns: 2fr 1.2fr 1fr auto; gap: 14px; align-items: flex-end;">
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Technology / Topic</label>
              <input type="text" id="notes-topic-input" class="filter-select" value="Python OOPs" placeholder="e.g. Python OOPs, Docker, Kubernetes, ChatGPT, DSA..." style="font-size: 0.9rem; padding: 9px 12px;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Brand Signature Watermark</label>
              <input type="text" id="notes-brand-input" class="filter-select" value="by @PyCode.Hubb" placeholder="e.g. by @NewsFlow.Tech" style="font-size: 0.9rem; padding: 9px 12px;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);">Format Template</label>
              <select id="notes-type-select" class="filter-select" style="font-size: 0.9rem; padding: 9px 12px;">
                <option value="complete">Complete Mastery (Multi-Slide)</option>
                <option value="cheatsheet">Fast Cheat Sheet & Architecture</option>
                <option value="interview">Interview Q&A Architecture</option>
              </select>
            </div>

            <button class="btn btn-primary btn-glow" id="notes-gen-btn" onclick="NotesStudioPage.triggerGeneration()" style="height: 42px; padding: 0 20px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="sparkles"></i> Generate Carousel PDF
            </button>
          </div>
        </div>

        <!-- Active Document Carousel Viewer -->
        <div id="notes-viewer-section">
          <div class="glass-card" style="padding: 40px; text-align: center; color: var(--text-muted);">
            <div class="spinner" style="margin: 0 auto 12px auto;"></div>
            <p>Loading Tech Notes Vault...</p>
          </div>
        </div>

        <!-- Saved Notes Vault Grid -->
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
            <h3 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
              <i data-lucide="folder" style="width: 18px; height: 18px; color: var(--text-muted);"></i>
              Saved Tech Notes Documents & Slide Decks
            </h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);" id="notes-vault-count">0 Documents</span>
          </div>

          <div id="notes-grid-section" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
            <!-- Rendered by loadDocuments() -->
          </div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    await this.loadDocuments();
  },

  selectPreset(topicName) {
    const inp = document.getElementById("notes-topic-input");
    if (inp) {
      inp.value = topicName;
      this.triggerGeneration();
    }
  },

  async loadDocuments() {
    try {
      const res = await App.fetchApi("/api/notes/documents");
      this.allDocs = res.documents || [];
      
      const countEl = document.getElementById("notes-vault-count");
      if (countEl) countEl.textContent = `${this.allDocs.length} Documents`;

      if (this.allDocs.length > 0) {
        if (!this.activeDoc) {
          this.activeDoc = this.allDocs[0];
          this.activeSlideIdx = 0;
        }
        this.renderViewer();
        this.renderGrid();
      } else {
        const viewer = document.getElementById("notes-viewer-section");
        if (viewer) {
          viewer.innerHTML = `
            <div class="glass-card" style="padding: 40px; text-align: center;">
              <p style="color: var(--text-muted); margin-bottom: 12px;">No tech notes generated yet. Click a preset above to create your first notebook carousel!</p>
              <button class="btn btn-primary" onclick="NotesStudioPage.triggerGeneration()">Generate Python OOPs Notes</button>
            </div>
          `;
        }
      }
    } catch (e) {
      console.error("Error loading notes documents:", e);
    }
  },

  renderViewer() {
    const viewer = document.getElementById("notes-viewer-section");
    if (!viewer || !this.activeDoc) return;

    const doc = this.activeDoc;
    const slides = doc.slide_urls || [];
    const total = slides.length;
    const currentSlide = slides[this.activeSlideIdx] || slides[0] || "";

    viewer.innerHTML = `
      <div class="glass-card" style="background: #ffffff; border-radius: 16px; border: 1px solid var(--border-color); padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
        
        <!-- Viewer Top Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-weight: 700; font-size: 0.8rem; padding: 4px 10px; border-radius: 8px;">
              ${doc.badge_tag || 'Tech Notes'}
            </div>
            <div>
              <h3 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin: 0;">
                ${doc.title || doc.topic}
              </h3>
              <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; gap: 12px; margin-top: 3px;">
                <span>${doc.page_count} Slides (1080x1350)</span>
                <span>•</span>
                <span>${doc.brand_handle || 'NewsFlow'}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
            <a href="${doc.pdf_url}" target="_blank" class="btn btn-secondary" style="display: flex; align-items: center; gap: 6px; text-decoration: none;">
              <i data-lucide="file-text"></i> Open Full PDF
            </a>
            <a href="${doc.pdf_url}" download="${doc.slug}_notes.pdf" class="btn btn-secondary" style="display: flex; align-items: center; gap: 6px; text-decoration: none;">
              <i data-lucide="download"></i> Download Vector PDF
            </a>
            <a href="${currentSlide}" download="${doc.slug}_slide_${this.activeSlideIdx + 1}.png" class="btn btn-secondary" style="display: flex; align-items: center; gap: 6px; text-decoration: none;">
              <i data-lucide="image"></i> Download Current Slide
            </a>
            <button class="btn btn-primary btn-glow" onclick="NotesStudioPage.dispatchActiveDoc()" style="display: flex; align-items: center; gap: 6px;">
              <i data-lucide="send"></i> Dispatch to App 2 API
            </button>
          </div>
        </div>

        <!-- Center Interactive Carousel Showcase -->
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin: 10px 0 24px 0;">
          
          <!-- Prev Button -->
          <button class="btn-icon" onclick="NotesStudioPage.prevSlide()" ${this.activeSlideIdx === 0 ? 'disabled style="opacity: 0.3; cursor: not-allowed;"' : ''} style="width: 44px; height: 44px; border-radius: 50%; background: #ffffff; border: 1px solid var(--border-color); box-shadow: 0 2px 6px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center;">
            <i data-lucide="chevron-left" style="width: 22px; height: 22px;"></i>
          </button>

          <!-- 4:5 Instagram Portrait Frame -->
          <div style="width: 480px; max-width: 90vw; aspect-ratio: 4 / 5; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.12); border: 1px solid var(--border-color); position: relative; background: #23272f;">
            <img src="${currentSlide}" alt="Slide ${this.activeSlideIdx + 1}" style="width: 100%; height: 100%; object-fit: contain; display: block;" />
            
            <!-- Slide Pill Overlay -->
            <div style="position: absolute; top: 14px; right: 14px; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(6px); color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 20px;">
              ${this.activeSlideIdx + 1} / ${total}
            </div>
          </div>

          <!-- Next Button -->
          <button class="btn-icon" onclick="NotesStudioPage.nextSlide()" ${this.activeSlideIdx >= total - 1 ? 'disabled style="opacity: 0.3; cursor: not-allowed;"' : ''} style="width: 44px; height: 44px; border-radius: 50%; background: #ffffff; border: 1px solid var(--border-color); box-shadow: 0 2px 6px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center;">
            <i data-lucide="chevron-right" style="width: 22px; height: 22px;"></i>
          </button>

        </div>

        <!-- Thumbnail Strip -->
        <div style="display: flex; justify-content: center; gap: 10px; overflow-x: auto; padding: 8px 4px;">
          ${slides.map((url, i) => `
            <div onclick="NotesStudioPage.setSlide(${i})" 
                 style="width: 72px; height: 90px; border-radius: 6px; overflow: hidden; cursor: pointer; border: 2px solid ${i === this.activeSlideIdx ? 'var(--primary-blue, #2563eb)' : 'transparent'}; box-shadow: 0 1px 4px rgba(0,0,0,0.08); transition: transform 0.15s ease; ${i === this.activeSlideIdx ? 'transform: scale(1.05);' : ''}">
              <img src="${url}" alt="Thumb ${i+1}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
          `).join('')}
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  renderGrid() {
    const grid = document.getElementById("notes-grid-section");
    if (!grid) return;

    grid.innerHTML = this.allDocs.map(doc => {
      const cover = (doc.slide_urls && doc.slide_urls[0]) || "";
      const isSelected = this.activeDoc && this.activeDoc.slug === doc.slug;

      return `
        <div class="glass-card" style="background: #ffffff; border-radius: 12px; overflow: hidden; border: ${isSelected ? '2px solid #2563eb' : '1px solid var(--border-color)'}; box-shadow: 0 2px 8px rgba(0,0,0,0.03); display: flex; flex-direction: column;">
          
          <!-- Thumbnail -->
          <div style="width: 100%; aspect-ratio: 4 / 5; max-height: 280px; background: #f8fafc; cursor: pointer; overflow: hidden; position: relative;" onclick="NotesStudioPage.selectDoc('${doc.slug}')">
            ${cover ? `<img src="${cover}" alt="${doc.topic}" style="width: 100%; height: 100%; object-fit: contain;" />` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;">No preview</div>'}
            <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(15, 23, 42, 0.75); color: #fff; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">
              ${doc.page_count} Slides
            </div>
          </div>

          <!-- Info & Actions -->
          <div style="padding: 14px; display: flex; flex-direction: column; gap: 8px; flex: 1; justify-content: space-between;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #2563eb; text-transform: uppercase;">${doc.badge_tag || 'Notes'}</div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin: 2px 0;">${doc.topic}</h4>
              <div style="font-size: 0.76rem; color: var(--text-muted);">${doc.brand_handle || ''}</div>
            </div>

            <div style="display: flex; gap: 6px; margin-top: 6px;">
              <button class="btn btn-secondary" style="flex: 1; font-size: 0.78rem; padding: 6px;" onclick="NotesStudioPage.selectDoc('${doc.slug}')">
                <i data-lucide="eye"></i> Inspect
              </button>
              <a href="${doc.pdf_url}" target="_blank" class="btn btn-secondary" style="padding: 6px 10px; font-size: 0.78rem; text-decoration: none;" title="Open PDF">
                <i data-lucide="file-text"></i>
              </a>
              <button class="btn btn-secondary" style="padding: 6px 10px; font-size: 0.78rem;" onclick="NotesStudioPage.dispatchSpecificDoc('${doc.slug}')" title="Dispatch to App 2">
                <i data-lucide="send"></i>
              </button>
            </div>
          </div>

        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  selectDoc(slug) {
    const found = this.allDocs.find(d => d.slug === slug);
    if (found) {
      this.activeDoc = found;
      this.activeSlideIdx = 0;
      this.renderViewer();
      this.renderGrid();
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  },

  setSlide(idx) {
    this.activeSlideIdx = idx;
    this.renderViewer();
  },

  prevSlide() {
    if (this.activeSlideIdx > 0) {
      this.activeSlideIdx--;
      this.renderViewer();
    }
  },

  nextSlide() {
    const total = (this.activeDoc && this.activeDoc.slide_urls) ? this.activeDoc.slide_urls.length : 0;
    if (this.activeSlideIdx < total - 1) {
      this.activeSlideIdx++;
      this.renderViewer();
    }
  },

  async triggerGeneration() {
    if (this.isGenerating) return;

    const topicInput = document.getElementById("notes-topic-input");
    const brandInput = document.getElementById("notes-brand-input");
    const genBtn = document.getElementById("notes-gen-btn");

    const topic = topicInput ? topicInput.value.trim() : "Python OOPs";
    const brand = brandInput ? brandInput.value.trim() : "by @PyCode.Hubb";

    if (!topic) {
      App.showToast("Please enter a topic name", "warning");
      return;
    }

    this.isGenerating = true;
    if (genBtn) {
      genBtn.disabled = true;
      genBtn.innerHTML = `<span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span> Generating ${topic}...`;
    }

    App.showToast(`Synthesizing notebook notes for ${topic}...`, "info");

    try {
      const res = await App.fetchApi("/api/notes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic,
          brand_handle: brand
        })
      });

      if (res.success && res.document) {
        App.showToast(`Successfully created ${topic} notes & ${res.document.page_count} slides!`, "success");
        this.activeDoc = res.document;
        this.activeSlideIdx = 0;
        await this.loadDocuments();
      }
    } catch (err) {
      App.showToast(`Generation failed: ${err.message}`, "error");
    } finally {
      this.isGenerating = false;
      if (genBtn) {
        genBtn.disabled = false;
        genBtn.innerHTML = `<i data-lucide="sparkles"></i> Generate Carousel PDF`;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  async dispatchActiveDoc() {
    if (!this.activeDoc) return;
    await this.dispatchSpecificDoc(this.activeDoc.slug);
  },

  async dispatchSpecificDoc(slug) {
    App.showToast(`Dispatching ${slug} carousel slides to App 2 API...`, "info");
    try {
      const res = await App.fetchApi(`/api/notes/${slug}/dispatch`, {
        method: "POST"
      });
      if (res.success) {
        App.showToast(`Successfully dispatched ${slug} notes & slides to App 2!`, "success");
      } else {
        App.showToast(`Dispatch queued for ${slug}`, "info");
      }
    } catch (err) {
      App.showToast(`Failed to dispatch: ${err.message}`, "error");
    }
  }
};
