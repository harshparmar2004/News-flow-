/**
 * Notebook Notes & Instagram Carousel Studio Page (#notes)
 * Generates and previews handwritten spiral-notebook PDFs and 1080x1350 PNG carousel slides
 * for any tech topic matching the aesthetic of Notes_260918_142423 2.pdf.
 */

const NotesStudioPage = {
  currentDoc: null,
  currentSlideIndex: 0,
  recentDocs: [],
  isGenerating: false,

  presets: [
    { topic: "Python OOPs", label: "Python OOPs", badge: "OOPs Notes", icon: "🐍" },
    { topic: "Docker", label: "Docker CLI & Architecture", badge: "Docker Notes", icon: "🐳" },
    { topic: "Kubernetes", label: "Kubernetes (K8s)", badge: "K8s Notes", icon: "☸️" },
    { topic: "ChatGPT", label: "ChatGPT & Prompting", badge: "ChatGPT Notes", icon: "🤖" },
    { topic: "MERN Stack", label: "MERN Stack", badge: "MERN Notes", icon: "⚛️" },
    { topic: "DSA & Algorithms", label: "DSA & Big-O", badge: "DSA Notes", icon: "⚡" },
    { topic: "SQL & Databases", label: "SQL & Relational DB", badge: "SQL Cheat Sheet", icon: "🗄️" },
    { topic: "Git & GitHub", label: "Git Version Control", badge: "Git Cheat Sheet", icon: "🐙" }
  ],

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px; max-width: 1400px; margin: 0 auto;">
        
        <!-- Header Banner -->
        <div class="glass-card" style="padding: 20px 24px; background: #ffffff; border-radius: 16px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="font-size: 1.5rem;">📓</span>
              <h2 style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; color: #2B2622; margin: 0;">
                Notebook Notes & Instagram Carousel Studio
              </h2>
              <span style="font-size: 0.72rem; font-weight: 800; background: #FCEEE3; color: #D97B3F; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">
                Format: 4:5 Instagram Portrait (1080x1350)
              </span>
            </div>
            <p style="font-size: 0.85rem; color: #8A8175; margin: 0; line-height: 1.5;">
              Generates handwritten spiral-notebook PDFs and crisp 1080x1350 PNG carousel slides with official tech logos, ruled notebook paper, and blue code boxes.
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="btn btn-secondary" onclick="NotesStudioPage.loadDocuments()" style="padding: 7px 14px; font-size: 0.82rem;">
              <i data-lucide="refresh-cw"></i> Refresh Library
            </button>
          </div>
        </div>

        <!-- Main Studio Grid: Controls Left, Live Carousel Right -->
        <div style="display: grid; grid-template-columns: minmax(360px, 460px) 1fr; gap: 22px; align-items: start;">
          
          <!-- LEFT PANEL: Topic Generation Form -->
          <div class="glass-card" style="padding: 22px; background: #ffffff; border-radius: 16px; border: 1px solid #E8E0D4; box-shadow: 0 4px 16px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 18px;">
            
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #2B2622; display: block; margin-bottom: 8px;">
                🚀 Quick Technology Presets
              </label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                ${this.presets.map(p => `
                  <button type="button" class="btn btn-secondary" onclick="NotesStudioPage.selectPreset('${p.topic}', '${p.badge}')" style="justify-content: flex-start; text-align: left; padding: 8px 10px; font-size: 0.78rem; border-radius: 8px; gap: 6px;">
                    <span>${p.icon}</span>
                    <span style="font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.label}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div style="border-top: 1px solid #F0EAE1;"></div>

            <!-- Custom Topic Input -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-size: 0.82rem; font-weight: 700; color: #2B2622;">
                Technology or Topic Name <span style="color: #D97B3F;">*</span>
              </label>
              <input type="text" id="notes-topic-input" class="filter-select" placeholder="e.g. Python OOPs, Docker, Kubernetes, Rust..." value="Python OOPs" style="padding: 10px 14px; font-size: 0.9rem; border-radius: 10px; border: 1px solid #D8CFC4; font-weight: 600;" />
              <span style="font-size: 0.72rem; color: #8A8175;">Supports any tech stack, programming language, DSA concept, or framework.</span>
            </div>

            <!-- Custom Title -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-size: 0.82rem; font-weight: 700; color: #2B2622;">
                Header Title (Optional)
              </label>
              <input type="text" id="notes-title-input" class="filter-select" placeholder="e.g. Object-Oriented Programming" value="Object-Oriented Programming" style="padding: 8px 12px; font-size: 0.85rem; border-radius: 8px;" />
            </div>

            <!-- Badge Sticker Tag -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <label style="font-size: 0.82rem; font-weight: 700; color: #2B2622;">
                  Top-Right Badge Tag
                </label>
                <input type="text" id="notes-badge-input" class="filter-select" placeholder="OOPs Notes" value="OOPs Notes" style="padding: 8px 12px; font-size: 0.85rem; border-radius: 8px;" />
              </div>

              <!-- Brand Handle Watermark -->
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <label style="font-size: 0.82rem; font-weight: 700; color: #2B2622;">
                  Brand Watermark
                </label>
                <input type="text" id="notes-brand-input" class="filter-select" placeholder="by @PyCode.Hubb" value="by @PyCode.Hubb" style="padding: 8px 12px; font-size: 0.85rem; border-radius: 8px;" />
              </div>
            </div>

            <!-- Generate Button -->
            <button id="notes-generate-btn" class="btn btn-primary btn-glow" onclick="NotesStudioPage.generateNotes()" style="padding: 12px; font-size: 0.92rem; font-weight: 700; border-radius: 12px; justify-content: center; margin-top: 6px;">
              <i data-lucide="sparkles"></i> Generate Notebook Notes & Slides
            </button>

            <!-- Generation Status Banner -->
            <div id="notes-gen-status" style="display: none; padding: 10px 14px; background: #F8F5F0; border-radius: 10px; font-size: 0.8rem; color: #2B2622; border: 1px solid #E5DCCE; align-items: center; gap: 8px;">
              <span class="dot-pulse" style="background: #D97B3F;"></span>
              <span id="notes-gen-status-text">Synthesizing notebook pages and 1080x1350 slides...</span>
            </div>

          </div>

          <!-- RIGHT PANEL: Interactive Instagram Carousel Viewer -->
          <div class="glass-card" style="padding: 24px; background: #ffffff; border-radius: 16px; border: 1px solid #E8E0D4; box-shadow: 0 4px 16px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 18px;">
            
            <!-- Carousel Top Bar -->
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
              <div>
                <span style="font-size: 0.72rem; font-weight: 800; color: #8A8175; text-transform: uppercase; letter-spacing: 0.05em;">Interactive Carousel Preview</span>
                <h3 id="carousel-doc-title" style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: #2B2622; margin: 2px 0 0 0;">
                  Python OOPs Notes
                </h3>
              </div>

              <!-- Carousel Action Buttons -->
              <div id="carousel-actions-bar" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <a id="download-pdf-btn" href="#" target="_blank" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px;">
                  <span>📄</span> Download Full PDF
                </a>
                <button class="btn btn-secondary" onclick="NotesStudioPage.downloadCurrentSlide()" style="padding: 6px 14px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px;">
                  <span>🖼️</span> Download This Slide (1080x1350)
                </button>
                <button class="btn btn-primary" onclick="NotesStudioPage.dispatchCurrentDoc()" style="padding: 6px 14px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px;">
                  <span>🚀</span> Send to App 2 API
                </button>
              </div>
            </div>

            <!-- The 4:5 Carousel Viewport Container -->
            <div style="display: flex; justify-content: center; align-items: center; padding: 10px 0; background: #FAF7F2; border-radius: 14px; border: 1px solid #EAE3D9; position: relative;">
              
              <!-- Previous Button -->
              <button onclick="NotesStudioPage.prevSlide()" class="btn-icon" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); z-index: 10; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.92); box-shadow: 0 4px 12px rgba(0,0,0,0.12); border: 1px solid #DDD3C7; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #2B2622;">
                ‹
              </button>

              <!-- Slide Image Wrapper with exact 4:5 aspect ratio -->
              <div id="slide-viewport" style="width: 100%; max-width: 440px; aspect-ratio: 4 / 5; position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 32px rgba(0,0,0,0.14); border: 1px solid #D6CBC0; background: #ffffff;">
                <img id="carousel-active-img" src="/images/notes/python_oops/slide_01.png" alt="Carousel Slide" style="width: 100%; height: 100%; object-fit: contain; display: block;" onerror="this.src='/images/notes/docker/slide_01.png'" />
              </div>

              <!-- Next Button -->
              <button onclick="NotesStudioPage.nextSlide()" class="btn-icon" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); z-index: 10; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.92); box-shadow: 0 4px 12px rgba(0,0,0,0.12); border: 1px solid #DDD3C7; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #2B2622;">
                ›
              </button>
            </div>

            <!-- Slide Dots & Thumbnails Strip -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
              
              <!-- Indicator Pill -->
              <div style="display: flex; align-items: center; gap: 10px;">
                <span id="slide-counter-badge" style="font-size: 0.78rem; font-weight: 700; color: #D97B3F; background: #FCEEE3; padding: 3px 12px; border-radius: 12px;">
                  Slide 1 of 5
                </span>
                <div id="carousel-dots-container" style="display: flex; gap: 6px; align-items: center;">
                  <!-- Dots rendered dynamically -->
                </div>
              </div>

              <!-- Thumbnails Strip -->
              <div id="carousel-thumbnails-strip" style="display: flex; gap: 8px; overflow-x: auto; max-width: 100%; padding: 4px; scrollbar-width: thin;">
                <!-- Thumbnail items rendered dynamically -->
              </div>
            </div>

          </div>

        </div>

        <!-- RECENT GENERATED DOCUMENTS LIBRARY -->
        <div class="glass-card" style="padding: 22px 24px; background: #ffffff; border-radius: 16px; border: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.2rem;">📚</span>
              <h3 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: #2B2622; margin: 0;">
                Generated Notes Library & Instagram Archives
              </h3>
            </div>
            <span style="font-size: 0.78rem; color: #8A8175; font-weight: 600;" id="library-count-label">0 Documents</span>
          </div>

          <div id="notes-library-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
            <p style="color: #8A8175; font-size: 0.85rem;">Loading generated documents library...</p>
          </div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    await this.loadDocuments();
  },

  selectPreset(topic, badge) {
    const topicInput = document.getElementById('notes-topic-input');
    const titleInput = document.getElementById('notes-title-input');
    const badgeInput = document.getElementById('notes-badge-input');

    if (topicInput) topicInput.value = topic;
    if (titleInput) titleInput.value = topic;
    if (badgeInput) badgeInput.value = badge;
  },

  async loadDocuments() {
    try {
      const res = await App.fetchApi('/api/notes/documents');
      this.recentDocs = res.documents || [];

      const countLabel = document.getElementById('library-count-label');
      if (countLabel) countLabel.textContent = `${this.recentDocs.length} Documents`;

      this.renderLibraryGrid();

      // If we don't have an active doc or just loaded, show first doc
      if (this.recentDocs.length > 0 && !this.currentDoc) {
        this.setActiveDocument(this.recentDocs[0]);
      }
    } catch (e) {
      console.error("Failed to load notes documents", e);
    }
  },

  setActiveDocument(doc) {
    this.currentDoc = doc;
    this.currentSlideIndex = 0;

    const titleEl = document.getElementById('carousel-doc-title');
    if (titleEl) titleEl.textContent = `${doc.title || doc.topic} (${doc.page_count} Slides)`;

    const pdfBtn = document.getElementById('download-pdf-btn');
    if (pdfBtn) pdfBtn.href = doc.pdf_url || `/api/notes/${doc.slug}/pdf`;

    this.updateCarouselView();
  },

  updateCarouselView() {
    if (!this.currentDoc || !this.currentDoc.slide_urls || this.currentDoc.slide_urls.length === 0) return;

    const total = this.currentDoc.slide_urls.length;
    if (this.currentSlideIndex < 0) this.currentSlideIndex = 0;
    if (this.currentSlideIndex >= total) this.currentSlideIndex = total - 1;

    const activeUrl = this.currentDoc.slide_urls[this.currentSlideIndex];
    const imgEl = document.getElementById('carousel-active-img');
    if (imgEl) imgEl.src = activeUrl;

    const counter = document.getElementById('slide-counter-badge');
    if (counter) counter.textContent = `Slide ${this.currentSlideIndex + 1} of ${total}`;

    // Render dots
    const dotsContainer = document.getElementById('carousel-dots-container');
    if (dotsContainer) {
      dotsContainer.innerHTML = this.currentDoc.slide_urls.map((_, idx) => `
        <span onclick="NotesStudioPage.goToSlide(${idx})" style="width: ${idx === this.currentSlideIndex ? '18px' : '7px'}; height: 7px; border-radius: 4px; background: ${idx === this.currentSlideIndex ? '#D97B3F' : '#D1C6BA'}; cursor: pointer; transition: all 0.2s ease;"></span>
      `).join('');
    }

    // Render thumbnails strip
    const strip = document.getElementById('carousel-thumbnails-strip');
    if (strip) {
      strip.innerHTML = this.currentDoc.slide_urls.map((url, idx) => `
        <div onclick="NotesStudioPage.goToSlide(${idx})" style="width: 48px; height: 60px; border-radius: 6px; overflow: hidden; border: 2px solid ${idx === this.currentSlideIndex ? '#D97B3F' : 'transparent'}; cursor: pointer; flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.1);">
          <img src="${url}" alt="Slide ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
      `).join('');
    }
  },

  prevSlide() {
    if (!this.currentDoc) return;
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.currentDoc.slide_urls.length) % this.currentDoc.slide_urls.length;
    this.updateCarouselView();
  },

  nextSlide() {
    if (!this.currentDoc) return;
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.currentDoc.slide_urls.length;
    this.updateCarouselView();
  },

  goToSlide(idx) {
    this.currentSlideIndex = idx;
    this.updateCarouselView();
  },

  downloadCurrentSlide() {
    if (!this.currentDoc || !this.currentDoc.slide_urls) return;
    const url = this.currentDoc.slide_urls[this.currentSlideIndex];
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.currentDoc.slug}_slide_${this.currentSlideIndex + 1}.png`;
    link.click();
    App.showToast("Slide image downloaded!", "success");
  },

  async dispatchCurrentDoc() {
    if (!this.currentDoc) return;
    App.showToast(`Dispatching "${this.currentDoc.title}" to App 2...`, "info");
    try {
      const res = await App.fetchApi(`/api/notes/${this.currentDoc.slug}/dispatch`, { method: 'POST' });
      App.showToast("Carousel notes successfully dispatched to App 2!", "success");
    } catch (e) {
      App.showToast("Dispatch failed: " + e.message, "error");
    }
  },

  async generateNotes() {
    if (this.isGenerating) return;

    const topic = document.getElementById('notes-topic-input').value.trim();
    const title = document.getElementById('notes-title-input').value.trim();
    const badge = document.getElementById('notes-badge-input').value.trim();
    const brand = document.getElementById('notes-brand-input').value.trim();

    if (!topic) {
      App.showToast("Please enter a technology or topic name.", "warning");
      return;
    }

    this.isGenerating = true;
    const btn = document.getElementById('notes-generate-btn');
    const statusBanner = document.getElementById('notes-gen-status');
    const statusText = document.getElementById('notes-gen-status-text');

    if (btn) btn.disabled = true;
    if (statusBanner) statusBanner.style.display = 'flex';
    if (statusText) statusText.textContent = `Generating handwritten notebook notes for "${topic}"...`;

    try {
      const res = await App.fetchApi('/api/notes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          custom_title: title || undefined,
          badge_tag: badge || undefined,
          brand_handle: brand || undefined
        })
      });

      App.showToast(`Generated ${res.document.page_count} slides for "${topic}"!`, "success");
      await this.loadDocuments();
      this.setActiveDocument(res.document);

    } catch (e) {
      App.showToast("Generation failed: " + e.message, "error");
    } finally {
      this.isGenerating = false;
      if (btn) btn.disabled = false;
      if (statusBanner) statusBanner.style.display = 'none';
    }
  },

  renderLibraryGrid() {
    const grid = document.getElementById('notes-library-grid');
    if (!grid) return;

    if (!this.recentDocs || this.recentDocs.length === 0) {
      grid.innerHTML = '<p style="color: #8A8175; font-size: 0.85rem; grid-column: 1/-1;">No notes documents generated yet. Use the form above to generate your first document.</p>';
      return;
    }

    grid.innerHTML = this.recentDocs.map(doc => {
      const coverUrl = doc.slide_urls && doc.slide_urls[0] ? doc.slide_urls[0] : '';
      const dateStr = doc.created_at ? App.formatTimestamp(doc.created_at) : '';

      return `
        <div class="glass-card" style="padding: 14px; background: #ffffff; border-radius: 14px; border: 1px solid #E8E0D4; box-shadow: 0 2px 6px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="width: 100%; aspect-ratio: 4 / 5; border-radius: 8px; overflow: hidden; background: #2B2622; margin-bottom: 10px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.08);" onclick='NotesStudioPage.setActiveDocument(${JSON.stringify(doc)})'>
              <img src="${coverUrl}" alt="${doc.topic}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 0.7rem; font-weight: 700; color: #D97B3F; background: #FCEEE3; padding: 2px 8px; border-radius: 4px;">
                ${doc.badge_tag || 'Notes'}
              </span>
              <span style="font-size: 0.72rem; color: #8A8175; font-weight: 600;">
                ${doc.page_count} Slides
              </span>
            </div>

            <h4 style="font-family: var(--font-serif); font-size: 0.96rem; font-weight: 700; color: #2B2622; margin: 4px 0;">
              ${doc.title || doc.topic}
            </h4>
            <div style="font-size: 0.72rem; color: #8A8175; margin-bottom: 8px;">
              ${doc.brand_handle || ''} · ${dateStr}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
            <button onclick='NotesStudioPage.setActiveDocument(${JSON.stringify(doc)})' class="btn btn-secondary" style="padding: 6px; font-size: 0.76rem; justify-content: center;">
              👁️ View Carousel
            </button>
            <a href="${doc.pdf_url}" target="_blank" class="btn btn-primary" style="padding: 6px; font-size: 0.76rem; justify-content: center; text-decoration: none;">
              📄 PDF
            </a>
          </div>
        </div>
      `;
    }).join('');
  }
};
