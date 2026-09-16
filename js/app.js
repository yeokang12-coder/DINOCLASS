/* ==========================================================================
   DinoClass (恐龙班级小帮手) - Main Application Controller
   ========================================================================== */

class DinoApp {
  constructor() {
    this.selectedStudentIds = new Set();
    this.currentView = 'console';
    this.selectedTag = null;
    this.wheelRotation = 0;
    this.isSpinning = false;
    this.parkWanderInterval = null;

    // 👗 Shop Fitting Room / Dressing Room Try-on State
    this.shopTryOnEquipped = {};
    this.shopTryOnHasCrown = false;
    this.shopTryOnHasDialogue = false;
    this.shopTryOnTitle = '';
    this.shopTryOnHasFireworks = false;
    this.shopMannequinSpecies = 'rex';
  }

  init() {
    this.bindEvents();
    this.renderClassSelector();
    this.renderAll();
    this.initTools();
    this.initHutSystem();

    // Multi-tab cross-page sync
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY || (e.key && e.key.startsWith(STORAGE_KEY))) {
        window.storageMgr.data = window.storageMgr.loadData();
        this.renderAll();
        this.renderClassSelector();
      }
    });

    // Auto-update privilege countdown tags on dino cards every minute
    setInterval(() => {
      if (document.getElementById('view-console')?.classList.contains('active')) {
        this.renderConsoleCards();
      }
    }, 60000);
  }

  bindEvents() {
    // Class Selector Dropdown Events
    const btnClassSelector = document.getElementById('btn-class-selector');
    const classDropdown = document.getElementById('class-dropdown-menu');
    if (btnClassSelector && classDropdown) {
      btnClassSelector.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = classDropdown.classList.contains('active');
        classDropdown.classList.toggle('active', !isOpen);
        if (!isOpen) this.renderClassSelector();
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('#class-selector-wrap')) {
          classDropdown.classList.remove('active');
        }
      });
    }

    document.getElementById('btn-menu-add-class')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('class-dropdown-menu')?.classList.remove('active');
      this.openCreateClassView();
    });

    document.getElementById('btn-menu-manage-classes')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('class-dropdown-menu')?.classList.remove('active');
      this.openClassManageModal();
    });

    // Nav Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
      });
    });

    // Sound Toggle
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const enabled = window.soundCtrl.toggleSound();
        soundBtn.innerHTML = enabled ? '🔊 音效: 开' : '🔇 音效: 关';
        soundBtn.classList.toggle('btn-secondary', !enabled);
        soundBtn.classList.toggle('btn-gold', enabled);
      });
    }

    // BGM Music Toggle
    const bgmBtn = document.getElementById('btn-toggle-bgm');
    if (bgmBtn) {
      const isBgmOn = window.soundCtrl.bgmEnabled;
      bgmBtn.innerHTML = isBgmOn ? '🎵 音乐: 开' : '🎵 音乐: 关';
      bgmBtn.classList.toggle('btn-secondary', !isBgmOn);
      bgmBtn.classList.toggle('btn-gold', isBgmOn);

      bgmBtn.addEventListener('click', () => {
        const bgmEnabled = window.soundCtrl.toggleBGM();
        bgmBtn.innerHTML = bgmEnabled ? '🎵 音乐: 开' : '🎵 音乐: 关';
        bgmBtn.classList.toggle('btn-secondary', !bgmEnabled);
        bgmBtn.classList.toggle('btn-gold', bgmEnabled);
      });
    }

    // 🎮 Welcome Play Gate Overlay
    document.getElementById('btn-enter-class')?.addEventListener('click', () => {
      const gate = document.getElementById('welcome-gate');
      if (gate) gate.classList.add('hidden');
      if (window.soundCtrl) {
        window.soundCtrl.init();
        window.soundCtrl.startBGM();
      }
    });

    // Console Filters
    const searchInput = document.getElementById('search-student');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.renderConsoleCards());
    }

    const speciesFilter = document.getElementById('filter-species');
    if (speciesFilter) {
      speciesFilter.addEventListener('change', () => this.renderConsoleCards());
    }

    const stageFilter = document.getElementById('filter-stage');
    if (stageFilter) {
      stageFilter.addEventListener('change', () => this.renderConsoleCards());
    }

    // Modal Triggers & Controls
    document.getElementById('btn-batch-score')?.addEventListener('click', () => this.openBatchScoreModal());
    document.getElementById('btn-add-student')?.addEventListener('click', () => this.openAddStudentModal());
    document.getElementById('btn-reset-demo')?.addEventListener('click', () => this.resetDemoData());
    document.getElementById('btn-export-data')?.addEventListener('click', () => window.storageMgr.exportJSON());
    document.getElementById('btn-import-data')?.addEventListener('click', () => this.triggerImportJSON());
    document.getElementById('btn-cloud-sync-pill')?.addEventListener('click', () => this.openFirebaseModal());
    document.getElementById('btn-cloud-sync-toolbar')?.addEventListener('click', () => this.openFirebaseModal());

    // Select All Checkbox
    document.getElementById('checkbox-select-all')?.addEventListener('change', (e) => {
      const checked = e.target.checked;
      const visibleCards = document.querySelectorAll('.card-select-checkbox');
      visibleCards.forEach(cb => {
        cb.checked = checked;
        if (checked) this.selectedStudentIds.add(cb.dataset.id);
        else this.selectedStudentIds.clear();
      });
      this.updateSelectedCount();
    });

    // Close Modals
    document.querySelectorAll('.modal-close, .btn-modal-cancel').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    // Wheel Spin Button
    document.getElementById('btn-spin-wheel')?.addEventListener('click', () => this.spinWheel());

    // Add Reward Item Modal
    document.getElementById('btn-add-reward')?.addEventListener('click', () => this.openAddRewardModal());
  }

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === viewName);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `view-${viewName}`);
    });

    // Smart Background Hibernation: Only run park wander cycle when inside park view!
    if (viewName === 'park') {
      this.renderParkView();
      this.startParkWanderLoop();
    } else {
      this.stopParkWanderLoop();
      if (viewName === 'console') { this.renderConsoleCards(); }
      else if (viewName === 'screen') { this.renderScreenView(); }
      else if (viewName === 'shop') { this.renderShopView(); }
      else if (viewName === 'history') { this.renderHistoryView(); }
    }
  }

  renderAll() {
    this.renderHeaderStats();
    if (this.currentView === 'console') this.renderConsoleCards();
    else if (this.currentView === 'screen') this.renderScreenView();
    else if (this.currentView === 'park') { this.renderParkView(); this.startParkWanderLoop(); }
    else if (this.currentView === 'shop') this.renderShopView();
    else if (this.currentView === 'history') this.renderHistoryView();
  }

  renderHeaderStats() {
    const students = window.storageMgr.getStudents();
    const totalCount = students.length;
    const hatchedCount = students.filter(s => getStageByScore(s.score).key !== 'egg').length;
    const totalScore = students.reduce((sum, s) => sum + s.score, 0);

    const countEl = document.getElementById('stat-total-students');
    if (countEl) countEl.textContent = `${totalCount} 人`;

    const hatchedEl = document.getElementById('stat-hatched-count');
    if (hatchedEl) hatchedEl.textContent = `${hatchedCount} / ${totalCount}`;

    const scoreEl = document.getElementById('stat-total-score');
    if (scoreEl) scoreEl.textContent = `${totalScore} 分`;

    // Also update the Spotlight Shelf
    this.renderSpotlightShelf();
  }

  // Render Electronic Spotlight Shelf (电子光荣榜置顶展台)
  renderSpotlightShelf() {
    const container = document.getElementById('spotlight-shelf-container');
    const shelfCards = document.getElementById('spotlight-shelf-cards');
    if (!container || !shelfCards) return;

    const students = window.storageMgr.getStudents();
    const now = Date.now();
    const hasSpotlight = (s) => {
      if (s.isSpotlight) return true;
      if (!Array.isArray(s.activePrivileges)) return false;
      return s.activePrivileges.some(p => (p.itemId === 'item_wall' || p.itemId === 'item_leader') && (!p.expireTimestamp || p.expireTimestamp > now));
    };

    const spotlightStudents = students.filter(hasSpotlight);

    if (spotlightStudents.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    shelfCards.innerHTML = spotlightStudents.map(s => {
      const stage = getStageByScore(s.score);
      const hasCrown = !!s.hasCrown;
      const isLeader = Array.isArray(s.activePrivileges) && s.activePrivileges.some(p => p.itemId === 'item_leader');
      return `
        <div class="spotlight-shelf-card" onclick="window.dinoApp.openProjectionSpotlight('${s.id}')" title="点击查看大屏特写">
          <div class="spotlight-shelf-badge">${isLeader ? '👑 一日小班长' : '🌟 电子光荣榜置顶'}</div>
          <div class="spotlight-shelf-dino">
            ${generateDinoSVG(s.speciesKey, stage.key, s.equipped || {})}
            ${hasCrown ? '<div class="crowned-floating-crown" style="top:-18px; font-size:1.1rem;">👑</div>' : ''}
          </div>
          <div class="spotlight-shelf-name">${s.name}</div>
          <div class="spotlight-shelf-score">${stage.name} · <strong>${s.score}</strong>分</div>
        </div>
      `;
    }).join('');
  }

  // View 1: Render Console Cards
  renderConsoleCards() {
    const grid = document.getElementById('console-cards-grid');
    if (!grid) return;

    const students = window.storageMgr.getStudents();
    const searchVal = (document.getElementById('search-student')?.value || '').trim().toLowerCase();
    const speciesVal = document.getElementById('filter-species')?.value || 'all';
    const stageVal = document.getElementById('filter-stage')?.value || 'all';

    const filtered = students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchVal);
      const matchSpecies = speciesVal === 'all' || s.speciesKey === speciesVal;
      const stage = getStageByScore(s.score);
      const matchStage = stageVal === 'all' || stage.key === stageVal;
      return matchSearch && matchSpecies && matchStage;
    });

    const hasSpotlight = (s) => {
      if (s.isSpotlight) return true;
      if (!Array.isArray(s.activePrivileges)) return false;
      const now = Date.now();
      return s.activePrivileges.some(p => p.itemId === 'item_wall' && (!p.expireTimestamp || p.expireTimestamp > now));
    };

    filtered.sort((a, b) => b.score - a.score);

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">未找到符合条件的学生恐龙</div>`;
      return;
    }

    grid.innerHTML = filtered.map(s => {
      const stage = getStageByScore(s.score);
      const nextStage = getNextStage(stage.key);
      const species = DINO_DATA.SPECIES[s.speciesKey] || DINO_DATA.SPECIES.rex;
      const svgHtml = generateDinoSVG(s.speciesKey, stage.key, s.equipped || {});
      const isSelected = this.selectedStudentIds.has(s.id);
      const hasCrown = !!s.hasCrown;
      const isSpotlight = hasSpotlight(s);

      // Progress bar within stage
      let stageProgress = 100;
      if (nextStage) {
        const range = nextStage.minScore - stage.minScore;
        const currentInStage = s.score - stage.minScore;
        stageProgress = Math.min(100, Math.max(0, Math.round((currentInStage / range) * 100)));
      }

      const hasFireworks = !!(s.earned && s.earned.fireworks && s.equipped && s.equipped.fireworks);
      const hasDialogue = !!s.customDialogue;
      return `
        <div class="dino-card ${isSelected ? 'selected' : ''} ${hasCrown ? 'crowned' : ''} ${isSpotlight ? 'spotlight-card' : ''} ${hasFireworks ? 'fireworks-card' : ''}" id="card-${s.id}">
          ${hasFireworks ? '<div class="fireworks-particles"><span></span><span></span><span></span><span></span><span></span><span></span></div>' : ''}
          <input type="checkbox" class="card-select-checkbox" data-id="${s.id}" ${isSelected ? 'checked' : ''}/>
          ${isSpotlight ? '<div class="spotlight-top-badge">🌟 光荣榜置顶特写</div>' : ''}
          ${hasCrown ? '<div class="crowned-floating-crown" title="金冠尊享">👑</div>' : ''}
          
          <div class="stage-badge ${stage.badgeClass}">
            ${stage.icon} ${stage.name}
          </div>

          <div class="dino-avatar-wrap" style="position:relative;" onclick="window.dinoApp.triggerDinoClick(this, '${s.id}')" title="${hasDialogue ? '点击看恐龙台词' : '点击抚摸可爱恐龙'}">
            ${svgHtml}
            ${hasDialogue ? `<div class="dino-dialogue-bubble" id="bubble-${s.id}">💬 ${s.customDialogue}</div>` : ''}
          </div>

          <div class="student-info">
            <div class="student-name">
              ${s.name}
              <span class="species-name">(${species.name})</span>
            </div>
            ${s.titleBadge ? `<div style="margin-top:2px;"><span class="title-badge-tag">🏷️ ${s.titleBadge}</span></div>` : ''}
            
            <!-- Active Privileges Badges & Countdown -->
            ${Array.isArray(s.activePrivileges) && s.activePrivileges.length > 0 ? `
              <div class="privileges-list-row">
                ${s.activePrivileges.map(p => {
                  let timeStr = '永久';
                  if (p.expireTimestamp) {
                    const diffMs = p.expireTimestamp - Date.now();
                    if (diffMs <= 0) return '';
                    const totalMins = Math.floor(diffMs / (1000 * 60));
                    const hoursLeft = Math.floor(totalMins / 60);
                    const minsLeft = totalMins % 60;
                    timeStr = `${hoursLeft}时${minsLeft}分`;
                  }
                  return `<span class="privilege-tag-active" style="font-size:0.7rem; padding:2px 6px;">${p.icon} ${p.title} <span class="privilege-timer-text">[⏳ ${timeStr}]</span></span>`;
                }).filter(Boolean).join('')}
              </div>
            ` : ''}
          </div>

          <div class="level-progress-wrap">
            <div class="level-row">
              <span>积分: <strong class="score-highlight">${s.score}</strong> 分</span>
              <span>${nextStage ? `距下阶 ${nextStage.minScore - s.score} 分` : '已达最高阶'}</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${stageProgress}%"></div>
            </div>
          </div>

          <div class="card-actions">
            <button class="score-btn btn-add-1" onclick="window.dinoApp.adjustScore('${s.id}', 1, '日常表扬')">+1</button>
            <button class="score-btn btn-add-5" onclick="window.dinoApp.adjustScore('${s.id}', 5, '优秀表现')">+5</button>
            <button class="score-btn btn-sub-1" onclick="window.dinoApp.adjustScore('${s.id}', -1, '提醒改进')">-1</button>
            <button class="score-btn btn-secondary" style="flex:0 0 32px; padding:0;" title="更多操作" onclick="window.dinoApp.openStudentDetailModal('${s.id}')">⚙️</button>
          </div>
        </div>
      `;
    }).join('');

    // Bind checkboxes
    grid.querySelectorAll('.card-select-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) this.selectedStudentIds.add(id);
        else this.selectedStudentIds.delete(id);
        
        const card = document.getElementById(`card-${id}`);
        if (card) card.classList.toggle('selected', e.target.checked);
        this.updateSelectedCount();
      });
    });
  }

  getPetMoodQuote(student) {
    if (student.score <= 30) {
      const eggQuotes = ['🥚 努力孵化中...', '🐣 感觉要破壳啦！', '😋 想要加分小零食~', '💤 睡个美美的香甜觉'];
      const idx = Math.abs(student.name.charCodeAt(0) + student.score) % eggQuotes.length;
      return eggQuotes[idx];
    }
    const quotes = DINO_DATA.MOOD_QUOTES || [
      '😋 想要加分小零食~',
      '🎵 听课最认真啦！',
      '⚡ 感觉自己充满力量！',
      '❤️ 小主人对我真好~',
      '✨ 元气满满每一天！',
      '👑 最酷最可爱恐龙！'
    ];
    const idx = Math.abs(student.name.charCodeAt(0) + student.score) % quotes.length;
    return quotes[idx];
  }

  triggerDinoScratch(element, studentId) {
    if (!element) return;

    element.classList.remove('scratching', 'pet-bounce');
    void element.offsetWidth; // reflow
    element.classList.add('pet-bounce');

    // Create floating heart particle
    const heart = document.createElement('div');
    heart.className = 'pet-heart-particle';
    const particles = ['❤️', '💖', '✨', '🌟', '💕', '🥰', '🔥'];
    heart.textContent = particles[Math.floor(Math.random() * particles.length)];
    element.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1200);

    if (window.soundCtrl) {
      window.soundCtrl.playScoreAdd();
    }

    setTimeout(() => {
      element.classList.remove('pet-bounce');
    }, 650);
  }

  updateSelectedCount() {
    const btn = document.getElementById('btn-batch-score');
    if (btn) {
      const count = this.selectedStudentIds.size;
      btn.innerHTML = count > 0 ? `⚡ 批量加分 (${count}人)` : `⚡ 批量加/扣分`;
    }
  }

  // Smart in-place DOM update for instant 60fps score response without full-page re-rendering
  updateSingleCardScore(studentId, score, oldStageKey, newStageKey) {
    const card = document.getElementById(`card-${studentId}`);
    if (!card) return false;

    // If stage changed (hatched or leveled up), trigger full console render to update dinosaur SVG & stage badge
    if (oldStageKey !== newStageKey) {
      this.renderConsoleCards();
      return true;
    }

    // Otherwise, perform lightning-fast in-place DOM updates (<0.5ms)
    const stage = getStageByScore(score);
    const nextStage = getNextStage(stage.key);
    let stageProgress = 100;
    if (nextStage) {
      const range = nextStage.minScore - stage.minScore;
      const currentInStage = score - stage.minScore;
      stageProgress = Math.min(100, Math.max(0, Math.round((currentInStage / range) * 100)));
    }

    const scoreHighlight = card.querySelector('.level-row .score-highlight');
    if (scoreHighlight) scoreHighlight.textContent = score;

    const nextSpan = card.querySelector('.level-row span:last-child');
    if (nextSpan) {
      nextSpan.textContent = nextStage ? `距下阶 ${nextStage.minScore - score} 分` : '已达最高阶';
    }

    const fillBar = card.querySelector('.progress-bar-fill');
    if (fillBar) {
      fillBar.style.width = `${stageProgress}%`;
    }

    return true;
  }

  // Adjust score for single student
  adjustScore(studentId, delta, reason) {
    const result = window.storageMgr.updateStudentScore(studentId, delta, reason);
    if (!result) return;

    if (delta > 0) window.soundCtrl.playScoreAdd();
    else window.soundCtrl.playScoreDeduct();

    this.renderHeaderStats();

    // Fast-path in-place update
    const updated = this.updateSingleCardScore(
      studentId, 
      result.newScore, 
      result.oldStage.key, 
      result.newStage.key
    );
    if (!updated) {
      this.renderConsoleCards();
    }

    // Check for Hatching or Level Up Celebration!
    if (result.hatched || result.leveledUp) {
      this.triggerCelebrationModal(result);
    }
  }

  // In-Place Card-Level Evolution FX (非遮挡、仅在该恐龙卡片上触发酷炫进化)
  triggerCelebrationModal(result) {
    const { student, newStage, hatched } = result;
    
    if (hatched) window.soundCtrl.playEggHatch();
    else window.soundCtrl.playLevelUp();

    if (window.confettiFX && typeof window.confettiFX.launch === 'function') {
      window.confettiFX.launch(80);
    }

    const card = document.getElementById(`card-${student.id}`);
    if (!card) return;

    // Clear previous banner if any
    const oldBanner = card.querySelector('.card-evolution-banner');
    if (oldBanner) oldBanner.remove();

    card.classList.remove('card-evolving');
    void card.offsetWidth; // force reflow
    card.classList.add('card-evolving');

    const banner = document.createElement('div');
    banner.className = 'card-evolution-banner';
    banner.innerHTML = hatched ? `🐣 破壳进化为【${newStage.name}】!` : `✨ 破阶进化为【${newStage.name}】!`;
    card.appendChild(banner);

    setTimeout(() => {
      card.classList.remove('card-evolving');
      if (banner && banner.parentNode) banner.remove();
    }, 3000);
  }

  // Modal: Batch Score Modal
  openBatchScoreModal() {
    const modal = document.getElementById('modal-batch-score');
    if (!modal) return;

    const selectedCount = this.selectedStudentIds.size;
    const targetInfo = document.getElementById('batch-target-info');
    if (targetInfo) {
      targetInfo.textContent = selectedCount > 0 
        ? `已选中 ${selectedCount} 名学生` 
        : `未勾选学生（提交时将应用给全班 ${window.storageMgr.getStudents().length} 人）`;
    }

    // Render Behavior Tags
    const tagsContainer = document.getElementById('behavior-tags-list');
    if (tagsContainer) {
      tagsContainer.innerHTML = DINO_DATA.BEHAVIOR_TAGS.map(tag => `
        <div class="tag-card" onclick="window.dinoApp.selectBehaviorTag('${tag.id}')" id="tag-${tag.id}">
          <div>
            <span style="font-size: 1.2rem;">${tag.icon}</span>
            <strong style="margin-left: 6px;">${tag.text}</strong>
          </div>
          <span class="${tag.score > 0 ? 'score-highlight' : ''}" style="font-weight: 800; font-size: 1.1rem; color: ${tag.score > 0 ? '#34d399' : '#f87171'};">
            ${tag.score > 0 ? '+' : ''}${tag.score}
          </span>
        </div>
      `).join('');
    }

    modal.classList.add('active');
  }

  selectBehaviorTag(tagId) {
    document.querySelectorAll('.tag-card').forEach(c => c.classList.remove('selected'));
    const card = document.getElementById(`tag-${tagId}`);
    if (card) card.classList.add('selected');
    this.selectedTag = DINO_DATA.BEHAVIOR_TAGS.find(t => t.id === tagId);
  }

  submitBatchScore() {
    if (!this.selectedTag) {
      alert('请选择一个行为加扣分标签！');
      return;
    }

    let targetIds = Array.from(this.selectedStudentIds);
    if (targetIds.length === 0) {
      targetIds = window.storageMgr.getStudents().map(s => s.id);
    }

    targetIds.forEach(id => {
      this.adjustScore(id, this.selectedTag.score, this.selectedTag.text);
    });

    document.getElementById('modal-batch-score')?.classList.remove('active');
    this.selectedStudentIds.clear();
    this.updateSelectedCount();
  }

  // Modal: Add Student
  openAddStudentModal() {
    document.getElementById('modal-add-student')?.classList.add('active');
  }

  submitAddStudent() {
    const nameInput = document.getElementById('input-student-name');
    const speciesSelect = document.getElementById('select-student-species');
    const name = nameInput ? nameInput.value.trim() : '';
    const speciesKey = speciesSelect ? speciesSelect.value : 'rex';

    if (!name) {
      alert('请输入学生姓名！');
      return;
    }

    window.storageMgr.addStudent(name, speciesKey);
    if (nameInput) nameInput.value = '';
    document.getElementById('modal-add-student')?.classList.remove('active');
    this.renderAll();
  }

  // View 2: Big Screen Projection & Wheel
  renderScreenView() {
    const grid = document.getElementById('projection-cards-grid');
    if (!grid) return;

    const hasSpotlight = (s) => {
      if (s.isSpotlight) return true;
      if (!Array.isArray(s.activePrivileges)) return false;
      const now = Date.now();
      return s.activePrivileges.some(p => p.itemId === 'item_wall' && (!p.expireTimestamp || p.expireTimestamp > now));
    };

    const students = window.storageMgr.getStudents();
    students.sort((a, b) => b.score - a.score);

    grid.innerHTML = students.map(s => {
      const stage = getStageByScore(s.score);
      const isSpot = hasSpotlight(s);
      const hasCrown = !!s.hasCrown;
      const hasFireworks = !!(s.earned && s.earned.fireworks && s.equipped && s.equipped.fireworks);
      const hasDialogue = !!s.customDialogue;
      return `
        <div class="projection-card ${isSpot ? 'spotlight-projection-card' : ''} ${hasCrown ? 'crowned' : ''} ${hasFireworks ? 'fireworks-card' : ''}">
          ${hasFireworks ? '<div class="fireworks-particles"><span></span><span></span><span></span><span></span><span></span><span></span></div>' : ''}
          ${isSpot ? '<div class="spotlight-top-badge">🌟 电子光荣榜置顶特写</div>' : ''}
          ${hasCrown ? '<div class="crowned-floating-crown" title="金冠尊享">👑</div>' : ''}
          <div class="dino-avatar-wrap" style="width:100px; height:100px; margin:0 auto 10px; position:relative;" onclick="window.dinoApp.triggerDinoClick(this, '${s.id}')" title="${hasDialogue ? '点击看恐龙台词' : '点击展开恐龙大屏中央特写'}">
            ${generateDinoSVG(s.speciesKey, stage.key, s.equipped || {})}
            ${hasDialogue ? `<div class="dino-dialogue-bubble" id="bubble-${s.id}">💬 ${s.customDialogue}</div>` : ''}
          </div>
          <h3 style="font-size:1.1rem; margin-bottom:4px;">${s.name}</h3>
          <span class="stage-badge ${stage.badgeClass}" style="position:static; display:inline-flex; margin-bottom:4px;">
            ${stage.icon} ${stage.name} (${s.score}分)
          </span>
          <div>
            <button class="btn-spotlight-view" onclick="window.dinoApp.openProjectionSpotlight('${s.id}')">🔍 特写展示</button>
          </div>
        </div>
      `;
    }).join('');

    this.drawWheelCanvas();
  }

  // Open Central Dino Spotlight Showcase Modal
  openProjectionSpotlight(studentId) {
    const student = window.storageMgr.getStudentById(studentId);
    if (!student) return;

    const stage = getStageByScore(student.score);
    const spec = DINO_DATA.SPECIES[student.speciesKey] || DINO_DATA.SPECIES.rex;

    const modal = document.getElementById('modal-projection-spotlight');
    const wrap = document.getElementById('spotlight-dino-wrap');
    const name = document.getElementById('spotlight-student-name');
    const stageBadge = document.getElementById('spotlight-stage-badge');
    const titleBadge = document.getElementById('spotlight-title-badge');
    const scoreText = document.getElementById('spotlight-score-text');

    if (modal) {
      const cardBox = modal.querySelector('.modal-card');
      if (cardBox) cardBox.classList.toggle('crowned', !!student.hasCrown);
    }

    if (wrap) {
      wrap.innerHTML = generateDinoSVG(student.speciesKey, stage.key, student.equipped || {});
    }
    if (name) name.textContent = student.name;
    if (stageBadge) {
      stageBadge.innerHTML = `<span class="stage-badge ${stage.badgeClass}">${stage.icon} ${stage.name} (${spec.name})</span>`;
    }
    if (titleBadge) {
      titleBadge.innerHTML = student.titleBadge ? `<span class="title-badge-tag">🏷️ ${student.titleBadge}</span>` : '';
    }
    if (scoreText) {
      scoreText.innerHTML = `当前累积总积分：<strong style="color:var(--accent-gold); font-size:1.3rem;">${student.score}</strong> 分`;
    }

    // Show dialogue bubble in spotlight if exists
    const dialogueEl = document.getElementById('spotlight-dialogue-text');
    if (dialogueEl) {
      if (student.customDialogue) {
        dialogueEl.textContent = `💬 「${student.customDialogue}」`;
        dialogueEl.style.display = 'block';
      } else {
        dialogueEl.style.display = 'none';
      }
    }

    if (modal) modal.classList.add('active');

    if (window.soundCtrl && typeof window.soundCtrl.playLevelUp === 'function') {
      window.soundCtrl.playLevelUp();
    }
  }

  closeProjectionSpotlight() {
    const modal = document.getElementById('modal-projection-spotlight');
    if (modal) modal.classList.remove('active');
  }

  // Click handler for dino avatar — shows dialogue bubble + scratch animation
  triggerDinoClick(el, studentId) {
    const student = window.storageMgr.getStudentById(studentId);
    
    // Find bubble in clicked element container
    const bubble = el ? el.querySelector('.dino-dialogue-bubble') : null;
    if (bubble) {
      bubble.classList.remove('forced-show');
      void bubble.offsetWidth; // force reflow
      bubble.classList.add('forced-show');
      setTimeout(() => {
        bubble.classList.remove('forced-show');
      }, 4000);
    }

    // Always play scratch animation & sound
    this.triggerDinoScratch(el, studentId);
  }

  drawWheelCanvas() {
    // Draw on fullscreen canvas
    const canvas = document.getElementById('fullscreen-wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const students = window.storageMgr.getStudents();
    if (students.length === 0) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 10;
    const arc = (2 * Math.PI) / students.length;

    ctx.clearRect(0, 0, width, height);

    // Outer glow ring
    ctx.save();
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 24;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 6, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#06b6d4', '#f43f5e', '#14b8a6'];

    students.forEach((s, i) => {
      const angle = i * arc + (this.wheelRotation * Math.PI / 180);
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arc);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Student name text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(s.name, radius - 18, 6);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 26, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎰', centerX, centerY + 7);
  }

  spinWheel() {
    if (this.isSpinning) return;
    const students = window.storageMgr.getStudents();
    if (students.length === 0) return;

    this.isSpinning = true;
    const extraRotations = 5 + Math.floor(Math.random() * 5);
    const targetDeg = this.wheelRotation + extraRotations * 360 + Math.floor(Math.random() * 360);
    const startDeg = this.wheelRotation;
    const duration = 4000;
    const startTime = performance.now();
    let lastTickAt = 0;

    const btn = document.getElementById('btn-spin-fullscreen-wheel');
    if (btn) btn.disabled = true;

    const animateWheel = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      this.wheelRotation = startDeg + (targetDeg - startDeg) * ease;

      // Play tick sound periodically (not every frame)
      const tickInterval = Math.max(40, 200 * progress);
      if (now - lastTickAt > tickInterval) {
        window.soundCtrl.playTick();
        lastTickAt = now;
      }

      this.drawWheelCanvas();

      if (progress < 1) {
        requestAnimationFrame(animateWheel);
      } else {
        this.isSpinning = false;
        if (btn) btn.disabled = false;

        // Determine winner for Top Pointer (12 o'clock / 270 degrees)
        const angleUnderPointer = ((270 - (this.wheelRotation % 360)) % 360 + 360) % 360;
        const sliceDeg = 360 / students.length;
        const winnerIdx = Math.floor(angleUnderPointer / sliceDeg) % students.length;
        const winner = students[winnerIdx];

        window.soundCtrl.playLevelUp();
        window.confettiFX && window.confettiFX.launch(120);

        // Show fullscreen winner reveal card
        const stage = getStageByScore(winner.score);
        const spec = DINO_DATA.SPECIES[winner.speciesKey] || DINO_DATA.SPECIES.rex;

        const avatarEl = document.getElementById('winner-dino-avatar');
        const nameEl = document.getElementById('winner-student-name');
        const speciesEl = document.getElementById('winner-species-text');

        if (avatarEl) avatarEl.innerHTML = generateDinoSVG(winner.speciesKey, stage.key);
        if (nameEl) nameEl.textContent = winner.name;
        if (speciesEl) speciesEl.textContent = `${spec.name} · ${stage.icon} ${stage.name}`;

        const revealEl = document.getElementById('fullscreen-wheel-winner-reveal');
        if (revealEl) revealEl.style.display = 'flex';
      }
    };

    requestAnimationFrame(animateWheel);
  }

  openFullscreenWheel() {
    window.soundCtrl.init();
    const modal = document.getElementById('modal-fullscreen-wheel');
    if (!modal) return;
    modal.classList.add('active');
    // Draw wheel immediately
    setTimeout(() => this.drawWheelCanvas(), 100);
    const revealEl = document.getElementById('fullscreen-wheel-winner-reveal');
    if (revealEl) revealEl.style.display = 'none';
  }

  closeFullscreenWheel() {
    const modal = document.getElementById('modal-fullscreen-wheel');
    if (modal) modal.classList.remove('active');
    const revealEl = document.getElementById('fullscreen-wheel-winner-reveal');
    if (revealEl) revealEl.style.display = 'none';
  }

  // View 5: 🏞️ Dinosaur Safari Park (恐龙大草原乐园)
  renderParkView() {
    const layer = document.getElementById('park-dinos-layer');
    if (!layer) return;

    const students = window.storageMgr.getStudents();
    if (!students || students.length === 0) {
      layer.innerHTML = `<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-weight:700; font-size:1.1rem; text-shadow:0 2px 8px rgba(0,0,0,0.5);">草地上暂无恐龙散步，请在管理台新增学生！🦕</div>`;
      return;
    }

    // Preserve existing wander positions if already rendered
    const existingSprites = new Map();
    layer.querySelectorAll('.park-dino-sprite').forEach(el => {
      existingSprites.set(el.dataset.id, {
        left: parseFloat(el.style.left) || 20,
        top: parseFloat(el.style.top) || 55,
        isFlipped: el.classList.contains('flip-left')
      });
    });

    // Spread dinos in a wider grid across full ground area
    const cols = Math.ceil(Math.sqrt(students.length * 1.6));

    layer.innerHTML = students.map((s, index) => {
      const stage = getStageByScore(s.score);
      const isLegend = stage.key === 'legend';
      // generateDinoSVG returns effectsHtml + svg string; wrap with transparent container
      const svgHtml = generateDinoSVG(s.speciesKey, stage.key, s.equipped || {});
      const hasCrown = !!s.hasCrown;
      const hasDialogue = !!s.customDialogue;

      // Spread initial positions
      const col = index % cols;
      const row = Math.floor(index / cols);
      const totalRows = Math.ceil(students.length / cols) || 1;
      const jitterX = ((index * 37 + 11) % 16) - 8;
      const jitterY = ((index * 53 + 7) % 14) - 7;

      // Spread initial positions with Hut Avoidance (Villa zone: left 56%~88%, top 44%~76%)
      let rawLeft = Math.min(88, Math.max(5, (col / (cols - 1 || 1)) * 82 + 4 + jitterX));
      let rawTop  = isLegend
        ? Math.min(28, Math.max(6, 12 + (index * 8) % 16 + jitterY))
        : Math.min(82, Math.max(45, (row / (totalRows - 1 || 1)) * 34 + 46 + jitterY));

      // Avoid hut on initial placement for ground dinos
      if (!isLegend && rawLeft >= 55 && rawLeft <= 88 && rawTop >= 44 && rawTop <= 76) {
        rawLeft = Math.min(52, rawLeft - 25);
      }

      const defaultLeft = rawLeft;
      const defaultTop  = rawTop;

      const pos = existingSprites.get(s.id) || { left: defaultLeft, top: defaultTop, isFlipped: index % 2 === 0 };

      // Perspective scale: Legend dragons fly gracefully in sky (0.85), ground dinos scale by depth (0.55 ~ 0.85)
      const perspScale = isLegend
        ? 0.85
        : (0.55 + (pos.top / 100) * 0.30);

      const flyClass = isLegend ? 'park-dino-legend-flying' : '';

      return `
        <div class="park-dino-sprite ${flyClass} ${pos.isFlipped ? 'flip-left' : 'flip-right'}" 
             id="park-sprite-${s.id}" 
             data-id="${s.id}"
             data-is-flying="${isLegend ? 'true' : 'false'}"
             style="left: ${pos.left.toFixed(1)}%; top: ${pos.top.toFixed(1)}%; z-index: ${isLegend ? 9999 : Math.floor(pos.top * 10) + 1000}; transform: scale(${perspScale.toFixed(2)});"
             onclick="window.dinoApp.triggerParkDinoClick(this, '${s.id}')">

          <div class="park-dino-nametag">
            <span>${s.name}</span>
            ${s.titleBadge ? `<span class="nametag-badge">🏷️${s.titleBadge}</span>` : ''}
          </div>

          ${hasCrown ? '<div class="crowned-floating-crown" style="position:absolute; top:-30px; left:50%; transform:translateX(-50%); font-size:1.6rem; z-index:10005;">👑</div>' : ''}
          ${hasDialogue ? `<div class="dino-dialogue-bubble" id="bubble-park-${s.id}">💬 ${s.customDialogue}</div>` : ''}

          <div class="park-dino-body">
            ${svgHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  startParkWanderLoop() {
    this.stopParkWanderLoop();

    // Wander every 3.5s for a random subset of dinos with Hut Avoidance
    this.parkWanderInterval = setInterval(() => {
      const sprites = document.querySelectorAll('.park-dino-sprite');
      if (!sprites || sprites.length === 0) return;

      sprites.forEach(sprite => {
        // Skip if dino is currently executing entrance animation or inside hut
        if (sprite.dataset.isEntering === 'true' || sprite.style.opacity === '0') return;

        if (Math.random() < 0.5) {
          const isFlying = sprite.dataset.isFlying === 'true';
          const currentLeft = parseFloat(sprite.style.left) || 40;
          const currentTop  = parseFloat(sprite.style.top)  || (isFlying ? 15 : 60);

          // Wander range (-15% ~ +15% horizontal, -10% ~ +10% vertical)
          const dLeft = (Math.random() * 30 - 15);
          const dTop  = (Math.random() * 20 - 10);

          let newLeft = Math.min(88, Math.max(5, currentLeft + dLeft));
          let newTop = isFlying
            ? Math.min(28, Math.max(6, currentTop + dTop))
            : Math.min(82, Math.max(45, currentTop + dTop));

          // 🏰 Hut Exclusion Zone Avoidance Algorithm:
          // Villa body occupies left: 55% ~ 88%, top: 44% ~ 76%
          // If ground dino wanders into Villa body, redirect to left grass (left < 54%) or front lawn (top > 77%)
          if (!isFlying && newLeft >= 55 && newLeft <= 88 && newTop >= 44 && newTop <= 76) {
            if (currentLeft < 55) {
              // Steer back left to open field
              newLeft = Math.min(53, currentLeft + (Math.random() * -10));
            } else if (currentTop > 75) {
              // Steer down in front of steps
              newTop = 78 + Math.random() * 4;
            } else {
              // Redirect to open left field
              newLeft = 48 + Math.random() * 6;
            }
          }

          // Scale: Legend dragons maintain graceful flight scale, ground dinos scale by depth
          const perspScale = isFlying ? 0.85 : (0.55 + (newTop / 100) * 0.30).toFixed(2);

          // Flip direction based on horizontal movement
          if (newLeft < currentLeft - 0.5) {
            sprite.classList.add('flip-left');
            sprite.classList.remove('flip-right');
          } else if (newLeft > currentLeft + 0.5) {
            sprite.classList.add('flip-right');
            sprite.classList.remove('flip-left');
          }

          sprite.style.left      = `${newLeft.toFixed(1)}%`;
          sprite.style.top       = `${newTop.toFixed(1)}%`;
          sprite.style.zIndex    = `${isFlying ? 9999 : Math.floor(newTop * 10) + 1000}`;
          sprite.style.transform = `scale(${perspScale})`;
        }
      });
    }, 3500);
  }


  stopParkWanderLoop() {
    if (this.parkWanderInterval) {
      clearInterval(this.parkWanderInterval);
      this.parkWanderInterval = null;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 🏕️  SINGLE LARGE 3D DINO HUT SYSTEM
  // ═══════════════════════════════════════════════════════════

  initHutSystem() {
    // Single large 3D Villa: max 8 dino occupants
    this.hut = { id: 'single', name: '🏰 恐龙豪华庄园', maxOccupants: 8, occupants: new Set() };
    // Sky Castle for Legend Flying Dragons: max 4 occupants
    this.skyHut = { id: 'sky', name: '☁️ 天空之城', maxOccupants: 4, occupants: new Set() };
    this.startHutLoop();
  }

  // Returns current cycle phase: 'day' | 'dusk' | 'night'
  getDayNightPhase() {
    const CYCLE = 300000; // 300 seconds in ms
    if (!this._cycleStart) this._cycleStart = Date.now();
    const elapsed = (Date.now() - this._cycleStart) % CYCLE;
    const pct = elapsed / CYCLE;
    if (pct < 0.40) return 'day';
    if (pct < 0.55) return 'dusk';
    if (pct < 0.92) return 'night';
    return 'dawn';
  }

  // Probability that a wandering dino enters hut this tick
  getEnterProbability() {
    const phase = this.getDayNightPhase();
    if (phase === 'day')   return 0.15;
    if (phase === 'dusk')  return 0.35;
    if (phase === 'night') return 0.60;
    return 0.25; // dawn
  }

  // Duration dino stays inside hut (ms)
  getStayDuration() {
    const phase = this.getDayNightPhase();
    if (phase === 'day')   return 20000 + Math.random() * 20000; // 20-40s
    if (phase === 'dusk')  return 30000 + Math.random() * 20000; // 30-50s
    if (phase === 'night') return 40000 + Math.random() * 40000; // 40-80s
    return 25000 + Math.random() * 20000;
  }

  startHutLoop() {
    // Hut tick every 5 seconds
    this.hutInterval = setInterval(() => {
      this.updateHutDayNightVisuals();
      this.tryDinoEnterHut();
      this.tryLegendEnterSkyHut();
    }, 5000);

    // Peek window random timer
    this.hutPeekInterval = setInterval(() => {
      this.triggerRandomPeek();
    }, 12000);
  }

  updateHutDayNightVisuals() {
    const phase = this.getDayNightPhase();
    const isNight = phase === 'night' || phase === 'dusk';
    const el = document.getElementById('park-hut-single');
    if (el) {
      el.classList.toggle('hut-night', isNight);
      el.classList.toggle('hut-day', !isNight);
    }
    const skyEl = document.getElementById('park-hut-sky');
    if (skyEl) {
      skyEl.classList.toggle('hut-night', isNight);
      skyEl.classList.toggle('hut-day', !isNight);
    }
  }

  tryDinoEnterHut() {
    if (!this.hut || this.hut.occupants.size >= this.hut.maxOccupants) return;
    const prob = this.getEnterProbability();
    if (Math.random() > prob) return;

    const sprites = Array.from(document.querySelectorAll('.park-dino-sprite'));
    if (!sprites.length) return;

    // Filter ground dinos not already inside or currently entering
    const candidates = sprites.filter(s => s.dataset.isFlying !== 'true' && s.dataset.isEntering !== 'true' && !this.hut.occupants.has(s.dataset.id));
    if (!candidates.length) return;

    // Pick ONLY ONE dino to enter smoothly per 5s tick (prevents overlapping/flashing)
    const chosenSprite = candidates[Math.floor(Math.random() * candidates.length)];
    this.dinoEnterHut(chosenSprite, chosenSprite.dataset.id);
  }

  tryLegendEnterSkyHut() {
    if (!this.skyHut || this.skyHut.occupants.size >= this.skyHut.maxOccupants) return;
    const prob = 0.35;
    if (Math.random() > prob) return;

    const sprites = Array.from(document.querySelectorAll('.park-dino-sprite'));
    if (!sprites.length) return;

    const candidates = sprites.filter(s => s.dataset.isFlying === 'true' && s.dataset.isEntering !== 'true' && !this.skyHut.occupants.has(s.dataset.id));
    if (!candidates.length) return;

    const chosenSprite = candidates[Math.floor(Math.random() * candidates.length)];
    this.legendEnterSkyHut(chosenSprite, chosenSprite.dataset.id);
  }

  getSkyDoorCoordinates() {
    const hutEl  = document.getElementById('park-hut-sky');
    const parkEl = document.querySelector('.park-wrapper');
    if (hutEl && parkEl) {
      const hutRect  = hutEl.getBoundingClientRect();
      const parkRect = parkEl.getBoundingClientRect();
      if (parkRect.width > 0 && parkRect.height > 0) {
        // Cosmic Observatory SVG viewBox is 0 -35 320 275. Portal center (x=160, y=125) relative to top (-35) is (160/320, 160/275)
        const doorX = hutRect.left + (160 / 320) * hutRect.width;
        const doorY = hutRect.top  + (160 / 275) * hutRect.height;
        
        // Offset by half of sprite container (35px = 70px / 2) to center sprite right inside portal
        const leftPct = parseFloat(((doorX - 35 - parkRect.left) / parkRect.width * 100).toFixed(2));
        const topPct  = parseFloat(((doorY - 35 - parkRect.top)  / parkRect.height * 100).toFixed(2));
        return { left: leftPct, top: topPct };
      }
    }
    return { left: 16.2, top: 13.8 };
  }

  legendEnterSkyHut(sprite, studentId) {
    this.skyHut.occupants.add(studentId);
    sprite.dataset.isEntering = 'true';

    const doorPos = this.getSkyDoorCoordinates();
    const DOOR_LEFT = doorPos.left;
    const DOOR_TOP  = doorPos.top;

    const doorGlow = document.getElementById('sky-door-glow');
    if (doorGlow) doorGlow.style.opacity = '1';

    sprite.style.transition = 'left 2.2s ease-in-out, top 2.2s ease-in-out, transform 2.2s ease-in-out';
    sprite.style.left = `${DOOR_LEFT}%`;
    sprite.style.top  = `${DOOR_TOP}%`;
    sprite.style.transform = 'scale(0.45)';

    setTimeout(() => {
      const bubble = document.createElement('div');
      bubble.className = 'dino-entrance-bubble';
      bubble.textContent = '☁️';
      sprite.appendChild(bubble);

      sprite.style.transition = 'none';
      void sprite.offsetWidth;
      sprite.classList.add('dino-squeeze-in');

      setTimeout(() => {
        if (doorGlow) doorGlow.style.opacity = '0';
        bubble.remove();
      }, 700);
    }, 2200);

    const stayMs = 25000 + Math.random() * 25000;
    setTimeout(() => this.legendExitSkyHut(studentId), stayMs + 3000);
  }

  legendExitSkyHut(studentId) {
    if (!this.skyHut) return;
    this.skyHut.occupants.delete(studentId);
    const sprite = document.getElementById(`park-sprite-${studentId}`);
    if (!sprite) return;

    const doorPos = this.getSkyDoorCoordinates();
    const DOOR_LEFT = doorPos.left;
    const DOOR_TOP  = doorPos.top;

    sprite.classList.remove('dino-squeeze-in');
    sprite.style.transition = 'none';
    sprite.style.left = `${DOOR_LEFT}%`;
    sprite.style.top  = `${DOOR_TOP}%`;
    sprite.style.opacity = '0';
    sprite.style.transform = 'scale(0.3)';
    void sprite.offsetWidth;

    sprite.style.transition = 'opacity 1s ease, transform 1s ease, left 2s ease-out, top 2s ease-out';
    sprite.style.opacity = '1';
    sprite.style.transform = 'scale(0.85)';

    const exitLeft = (DOOR_LEFT + (Math.random() * 30 - 15)).toFixed(1);
    const exitTop  = (DOOR_TOP + (Math.random() * 12 - 6)).toFixed(1);
    sprite.style.left = `${exitLeft}%`;
    sprite.style.top  = `${exitTop}%`;

    setTimeout(() => {
      sprite.style.transition = '';
      delete sprite.dataset.isEntering;
    }, 2000);
  }

  // Dynamic calculation of the exact door center coordinates in % relative to park wrapper
  getDoorCoordinates() {
    const hutEl  = document.getElementById('park-hut-single');
    const parkEl = document.querySelector('.park-wrapper');
    if (hutEl && parkEl) {
      const hutRect  = hutEl.getBoundingClientRect();
      const parkRect = parkEl.getBoundingClientRect();
      if (parkRect.width > 0 && parkRect.height > 0) {
        // SVG viewBox is 300 x 230. 2.5D Arched door center is at x=115, y=198 (doorstep)
        const doorX = hutRect.left + (115 / 300) * hutRect.width;
        const doorY = hutRect.top  + (198 / 230) * hutRect.height;
        const leftPct = parseFloat(((doorX - parkRect.left) / parkRect.width * 100).toFixed(1));
        const topPct  = parseFloat(((doorY - parkRect.top)  / parkRect.height * 100).toFixed(1));
        return { left: leftPct, top: topPct };
      }
    }
    return { left: 74.5, top: 69.0 }; // fallback
  }

  // 🦕 Two-stage realistic door entrance:
  // Phase 1: Walk to dynamic door center coordinates with smooth perspective scaling (1.8s)
  // Phase 2: Squeeze into recessed door frame (scaleX to 0, opacity 0) (0.65s)
  dinoEnterHut(sprite, studentId) {
    this.hut.occupants.add(studentId);
    sprite.dataset.isEntering = 'true';

    const doorPos = this.getDoorCoordinates();
    const DOOR_LEFT = doorPos.left;
    const DOOR_TOP  = doorPos.top;

    // Facing direction facing towards door
    const currentLeft = parseFloat(sprite.style.left) || 40;
    if (currentLeft < DOOR_LEFT - 0.5) {
      sprite.classList.add('flip-right');
      sprite.classList.remove('flip-left');
    } else if (currentLeft > DOOR_LEFT + 0.5) {
      sprite.classList.add('flip-left');
      sprite.classList.remove('flip-right');
    }

    // Door Warm Light Welcoming Reaction Overlay
    const doorGlow = document.getElementById('door-glow-overlay');
    if (doorGlow) doorGlow.style.opacity = '0.9';

    // Phase 1: Walk to doorstep
    sprite.style.transition = 'left 1.8s ease-in-out, top 1.8s ease-in-out, transform 1.8s ease-in-out';
    sprite.style.left = `${DOOR_LEFT}%`;
    sprite.style.top  = `${DOOR_TOP}%`;
    sprite.style.zIndex = '125';
    sprite.style.transform = 'scale(0.65)'; // scale down for perspective near door

    // Phase 2: After walking to doorstep, pop cute happy bubble, squeeze into doorway, then fade out door glow
    setTimeout(() => {
      // Pop cute entrance emoji bubble
      const emojis = ['😋', '🐾', '🏡', '💕', '💤', '✨'];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const bubble = document.createElement('div');
      bubble.className = 'dino-entrance-bubble';
      bubble.textContent = emoji;
      sprite.appendChild(bubble);

      // Clear transition first to prevent CSS transition vs animation collision/flash
      sprite.style.transition = 'none';
      void sprite.offsetWidth; // force reflow

      sprite.classList.add('dino-squeeze-in');

      setTimeout(() => {
        if (doorGlow) doorGlow.style.opacity = '0';
        bubble.remove();
      }, 700);
    }, 1800);

    // Schedule exit
    const stayMs = this.getStayDuration();
    setTimeout(() => this.dinoExitHut(studentId), stayMs + 2500);
  }

  dinoExitHut(studentId) {
    if (!this.hut) return;
    this.hut.occupants.delete(studentId);
    const sprite = document.getElementById(`park-sprite-${studentId}`);
    if (!sprite) return;

    const doorPos = this.getDoorCoordinates();
    const DOOR_LEFT = doorPos.left;
    const DOOR_TOP  = doorPos.top;

    // Reset squeeze class and set position right in doorway
    sprite.classList.remove('dino-squeeze-in');
    sprite.style.transition = 'none';
    sprite.style.left = `${DOOR_LEFT}%`;
    sprite.style.top  = `${DOOR_TOP}%`;
    sprite.style.opacity = '0';
    sprite.style.transform = 'scale(0.3)';
    void sprite.offsetWidth; // force reflow

    // Phase 1: Emerge out of doorway onto stone steps
    sprite.style.transition = 'opacity 0.8s ease, transform 0.8s ease, left 1.5s ease-out, top 1.5s ease-out';
    sprite.style.opacity = '1';
    sprite.style.transform = 'scale(0.72)';

    // Phase 2: Walk forward out onto grass
    const exitLeft = (DOOR_LEFT + (Math.random() * 12 - 6)).toFixed(1);
    const exitTop  = (DOOR_TOP + 6 + Math.random() * 8).toFixed(1);
    sprite.style.left = `${exitLeft}%`;
    sprite.style.top  = `${exitTop}%`;

    // Reset transition after emerging and clear entering flag
    setTimeout(() => {
      sprite.style.transition = '';
      sprite.style.zIndex = `${Math.floor(parseFloat(exitTop) * 10) + 1000}`;
      delete sprite.dataset.isEntering;
    }, 1600);
  }

  clickHut(hutId) {
    const isSky = hutId === 'sky';
    const hut = isSky ? this.skyHut : this.hut;
    const hutEl = isSky ? document.getElementById('park-hut-sky') : document.getElementById('park-hut-single');
    const popup = document.getElementById('hut-popup');
    const titleEl = document.getElementById('hut-popup-title');
    const listEl = document.getElementById('hut-popup-list');
    if (!hut || !popup || !titleEl || !listEl) return;

    // Flash animation
    if (hutEl) {
      hutEl.classList.remove('hut-flash');
      void hutEl.offsetWidth;
      hutEl.classList.add('hut-flash');
      setTimeout(() => hutEl.classList.remove('hut-flash'), 600);
    }
    if (window.soundCtrl) window.soundCtrl.playScoreAdd();

    // Build occupant list
    titleEl.textContent = hut.name;
    const students = window.storageMgr.getStudents();
    const residents = Array.from(hut.occupants).map(sid => students.find(s => s.id === sid)).filter(Boolean);

    if (residents.length === 0) {
      listEl.innerHTML = `<div class="hut-empty-msg">${isSky ? '👑 天空之城暂无圣龙休养，龙群正在苍穹翱翔！' : '🦕 目前空无一龙，快去散步吧！'}</div>`;
    } else {
      listEl.innerHTML = residents.map(s => {
        const stage = getStageByScore(s.score);
        return `<div class="hut-resident-row">${stage.icon} <span style="font-weight:700">${s.name}</span> <span style="color:var(--text-muted);font-size:0.72rem;">${stage.name} · ${s.score}分</span></div>`;
      }).join('');
    }

    // Position popup above target hut
    if (hutEl) {
      const hutRect = hutEl.getBoundingClientRect();
      const parkEl = document.querySelector('.park-wrapper');
      const parkRect = parkEl ? parkEl.getBoundingClientRect() : { left: 0, top: 0 };
      popup.style.display = 'block';
      popup.style.left = `${Math.max(10, hutRect.left - parkRect.left + hutRect.width/2 - 110)}px`;
      popup.style.top  = `${Math.max(10, (isSky ? hutRect.bottom - parkRect.top + 10 : hutRect.top - parkRect.top - 175))}px`;
    } else {
      popup.style.display = 'block';
    }

    // Auto-close after 6s
    clearTimeout(this._hutPopupTimer);
    this._hutPopupTimer = setTimeout(() => { popup.style.display = 'none'; }, 6000);
  }

  triggerRandomPeek() {
    if (!this.hut || this.hut.occupants.size === 0) return;
    const peekWrap = document.getElementById('hut-single-peek');
    if (!peekWrap) return;

    const residents = Array.from(this.hut.occupants);
    const sid = residents[Math.floor(Math.random() * residents.length)];
    const s = window.storageMgr.getStudentById(sid);
    if (!s) return;
    const stage = getStageByScore(s.score);

    // Clear previous peeker
    peekWrap.innerHTML = '';
    const peeker = document.createElement('div');
    peeker.className = 'hut-peeker';
    peeker.textContent = stage.icon;
    peekWrap.appendChild(peeker);

    // Peek for 2.5s then hide
    setTimeout(() => {
      peeker.classList.add('peek-hide');
      setTimeout(() => { peekWrap.innerHTML = ''; }, 500);
    }, 2500);
  }

  triggerParkDinoClick(el, studentId) {
    // Show dialogue bubble if present in this sprite (search within the sprite, not just body)
    const bubble = el ? el.querySelector('.dino-dialogue-bubble') : null;
    if (bubble) {
      bubble.classList.remove('forced-show');
      void bubble.offsetWidth;
      bubble.classList.add('forced-show');
      setTimeout(() => bubble.classList.remove('forced-show'), 4000);
    }
    // Play scratch animation + sound via existing method
    this.triggerDinoScratch(el, studentId);
  }

  forceSyncShopItems() {
    window.storageMgr.forceSyncShopItems();
    alert('🎉 已成功同步最新商城商品（包含【🌋 熔岩火龙皮肤】与【🎓 学霸博士帽】）！');
    this.renderShopView();
  }

  setShopCategory(category) {
    this.currentShopCategory = category || 'all';
    const pills = document.querySelectorAll('.shop-cat-pill');
    pills.forEach(p => {
      p.classList.toggle('active', p.dataset.cat === this.currentShopCategory);
    });
    this.renderShopView();
  }

  // 👗 Check if an item is currently tried on in fitting room
  isItemCurrentlyTriedOn(itemId) {
    if (itemId === 'item_crown') return !!this.shopTryOnHasCrown;
    if (itemId === 'item_sunglasses') return !!this.shopTryOnEquipped.sunglasses;
    if (itemId === 'item_cherry_blossom') return !!this.shopTryOnEquipped.cherry_blossom;
    if (itemId === 'item_magic_circle') return !!this.shopTryOnEquipped.magic_circle;
    if (itemId === 'item_lava_circle')  return !!this.shopTryOnEquipped.lava_circle;
    if (itemId === 'item_cyber_circle') return !!this.shopTryOnEquipped.cyber_circle;
    if (itemId === 'item_sakura_circle') return !!this.shopTryOnEquipped.sakura_circle;
    if (itemId === 'item_companion_fairy') return !!this.shopTryOnEquipped.fairy;
    if (itemId === 'item_chroma_gold') return !!this.shopTryOnEquipped.chroma_gold;
    if (itemId === 'item_lava_skin') return !!this.shopTryOnEquipped.lava_skin;
    if (itemId === 'item_frost_skin') return !!this.shopTryOnEquipped.frost_skin;
    if (itemId === 'item_angel_skin') return !!this.shopTryOnEquipped.angel_skin;
    if (itemId === 'item_unicorn_skin') return !!this.shopTryOnEquipped.unicorn_skin;
    if (itemId === 'item_grad_cap') return !!this.shopTryOnEquipped.grad_cap;
    if (itemId === 'item_dialogue') return !!this.shopTryOnHasDialogue;
    if (itemId === 'item_fireworks') return !!this.shopTryOnHasFireworks;
    if (itemId === 'item_title') return !!this.shopTryOnTitle;
    return false;
  }

  // 👗 Toggle try-on item on the central fitting mannequin
  toggleShopItemTryOn(itemId) {
    if (window.soundCtrl && typeof window.soundCtrl.playScoreAdd === 'function') {
      window.soundCtrl.playScoreAdd();
    }

    if (itemId === 'item_crown') {
      this.shopTryOnHasCrown = !this.shopTryOnHasCrown;
    } else if (itemId === 'item_sunglasses') {
      this.shopTryOnEquipped.sunglasses = !this.shopTryOnEquipped.sunglasses;
    } else if (itemId === 'item_cherry_blossom') {
      this.shopTryOnEquipped.cherry_blossom = !this.shopTryOnEquipped.cherry_blossom;
    } else if (itemId === 'item_magic_circle') {
      this.shopTryOnEquipped.magic_circle = !this.shopTryOnEquipped.magic_circle;
    } else if (itemId === 'item_lava_circle') {
      this.shopTryOnEquipped.lava_circle = !this.shopTryOnEquipped.lava_circle;
    } else if (itemId === 'item_cyber_circle') {
      this.shopTryOnEquipped.cyber_circle = !this.shopTryOnEquipped.cyber_circle;
    } else if (itemId === 'item_sakura_circle') {
      this.shopTryOnEquipped.sakura_circle = !this.shopTryOnEquipped.sakura_circle;
    } else if (itemId === 'item_companion_fairy') {
      this.shopTryOnEquipped.fairy = !this.shopTryOnEquipped.fairy;
    } else if (itemId === 'item_chroma_gold') {
      const willEnable = !this.shopTryOnEquipped.chroma_gold;
      if (willEnable) {
        this.shopTryOnEquipped.lava_skin = false;
        this.shopTryOnEquipped.frost_skin = false;
        this.shopTryOnEquipped.frostfire_skin = false;
        this.shopTryOnEquipped.angel_skin = false;
        this.shopTryOnEquipped.unicorn_skin = false;
      }
      this.shopTryOnEquipped.chroma_gold = willEnable;
    } else if (itemId === 'item_lava_skin') {
      const willEnable = !this.shopTryOnEquipped.lava_skin;
      this.shopTryOnEquipped.lava_skin = willEnable;
      if (willEnable) {
        this.shopTryOnEquipped.chroma_gold = false;
        this.shopTryOnEquipped.angel_skin = false;
        this.shopTryOnEquipped.unicorn_skin = false;
      }
      if (this.shopTryOnEquipped.lava_skin && this.shopTryOnEquipped.frost_skin) {
        this.shopTryOnEquipped.frostfire_skin = true;
      } else {
        this.shopTryOnEquipped.frostfire_skin = false;
      }
    } else if (itemId === 'item_frost_skin') {
      const willEnable = !this.shopTryOnEquipped.frost_skin;
      this.shopTryOnEquipped.frost_skin = willEnable;
      if (willEnable) {
        this.shopTryOnEquipped.chroma_gold = false;
        this.shopTryOnEquipped.angel_skin = false;
        this.shopTryOnEquipped.unicorn_skin = false;
      }
      if (this.shopTryOnEquipped.lava_skin && this.shopTryOnEquipped.frost_skin) {
        this.shopTryOnEquipped.frostfire_skin = true;
      } else {
        this.shopTryOnEquipped.frostfire_skin = false;
      }
    } else if (itemId === 'item_angel_skin') {
      const willEnable = !this.shopTryOnEquipped.angel_skin;
      if (willEnable) {
        this.shopTryOnEquipped.chroma_gold = false;
        this.shopTryOnEquipped.lava_skin = false;
        this.shopTryOnEquipped.frost_skin = false;
        this.shopTryOnEquipped.frostfire_skin = false;
        this.shopTryOnEquipped.unicorn_skin = false;
      }
      this.shopTryOnEquipped.angel_skin = willEnable;
    } else if (itemId === 'item_unicorn_skin') {
      const willEnable = !this.shopTryOnEquipped.unicorn_skin;
      if (willEnable) {
        this.shopTryOnEquipped.chroma_gold = false;
        this.shopTryOnEquipped.lava_skin = false;
        this.shopTryOnEquipped.frost_skin = false;
        this.shopTryOnEquipped.frostfire_skin = false;
        this.shopTryOnEquipped.angel_skin = false;
      }
      this.shopTryOnEquipped.unicorn_skin = willEnable;
    } else if (itemId === 'item_grad_cap') {
      this.shopTryOnEquipped.grad_cap = !this.shopTryOnEquipped.grad_cap;
    } else if (itemId === 'item_dialogue') {
      this.shopTryOnHasDialogue = !this.shopTryOnHasDialogue;
    } else if (itemId === 'item_fireworks') {
      this.shopTryOnHasFireworks = !this.shopTryOnHasFireworks;
    } else if (itemId === 'item_title') {
      this.shopTryOnTitle = this.shopTryOnTitle ? '' : '答题战神';
    }

    this.renderShopMannequin();
    this.renderShopView();
  }

  // Clear all try-on cosmetics
  clearShopTryOn() {
    if (window.soundCtrl && typeof window.soundCtrl.playScoreDeduct === 'function') {
      window.soundCtrl.playScoreDeduct();
    }
    this.shopTryOnEquipped = {};
    this.shopTryOnHasCrown = false;
    this.shopTryOnHasDialogue = false;
    this.shopTryOnTitle = '';
    this.shopTryOnHasFireworks = false;
    this.renderShopMannequin();
    this.renderShopView();
  }

  // Try on all cosmetics simultaneously
  tryOnAllCosmetics() {
    if (window.soundCtrl && typeof window.soundCtrl.playLevelUp === 'function') {
      window.soundCtrl.playLevelUp();
    }
    this.shopTryOnEquipped = {
      sunglasses: true,
      cherry_blossom: true,
      magic_circle: true,
      lava_circle: true,
      cyber_circle: true,
      sakura_circle: true,
      fairy: true,
      chroma_gold: true,
      lava_skin: true,
      frost_skin: true,
      frostfire_skin: true,
      angel_skin: true,
      unicorn_skin: true,
      grad_cap: true
    };
    this.shopTryOnHasCrown = true;
    this.shopTryOnHasDialogue = true;
    this.shopTryOnTitle = '答题战神';
    this.shopTryOnHasFireworks = true;
    this.renderShopMannequin();
    this.renderShopView();
  }

  // Change Mannequin Species
  setShopMannequinSpecies(speciesKey) {
    this.shopMannequinSpecies = speciesKey || 'rex';
    const selectEl = document.getElementById('select-shop-species');
    if (selectEl) selectEl.value = this.shopMannequinSpecies;
    this.renderShopMannequin();
  }

  // 👗 Render the single ultra-clear central dressing room mannequin
  renderShopMannequin() {
    const avatarEl = document.getElementById('shop-mannequin-avatar');
    const summaryEl = document.getElementById('shop-tryon-summary');
    const stageWrap = document.getElementById('shop-mannequin-wrap');
    if (!avatarEl) return;

    if (stageWrap) {
      stageWrap.classList.toggle('crowned', !!this.shopTryOnHasCrown);
      stageWrap.classList.toggle('fireworks-card', !!this.shopTryOnHasFireworks);
    }

    const svgCode = generateDinoSVG(this.shopMannequinSpecies, 'teen', this.shopTryOnEquipped);
    
    avatarEl.innerHTML = `
      <div class="fitting-dino-stage-inner ${this.shopTryOnHasFireworks ? 'fireworks-card' : ''} ${this.shopTryOnHasCrown ? 'crowned' : ''}">
        ${this.shopTryOnHasFireworks ? '<div class="fireworks-particles"><span></span><span></span><span></span><span></span><span></span><span></span></div>' : ''}
        ${this.shopTryOnHasCrown ? '<div class="crowned-floating-crown" style="font-size:2.2rem; top:-24px; left:50%; transform:translateX(-50%); position:absolute; z-index:20;">👑</div>' : ''}
        ${svgCode}
        ${this.shopTryOnHasDialogue ? '<div class="dino-dialogue-bubble" style="opacity:1; transform:translateX(-50%) scale(0.85); top:-38px; font-size:0.78rem; padding:3px 8px;">💬 试穿新衣真帅气！✨</div>' : ''}
        ${this.shopTryOnTitle ? `<div class="title-badge-tag" style="position:absolute; bottom:-14px; left:50%; transform:translateX(-50%); z-index:20;">🏆 ${this.shopTryOnTitle}</div>` : ''}
      </div>
    `;

    // Render summary tags
    const activeNames = [];
    if (this.shopTryOnHasCrown) activeNames.push('👑 流光金冠');
    if (this.shopTryOnEquipped.sunglasses) activeNames.push('🕶️ 墨镜');
    if (this.shopTryOnEquipped.cherry_blossom) activeNames.push('🌸 唯美樱花');
    if (this.shopTryOnEquipped.magic_circle) activeNames.push('🔯 星芒法阵');
    if (this.shopTryOnEquipped.lava_circle)   activeNames.push('🌋 熔岩裂纹阵');
    if (this.shopTryOnEquipped.cyber_circle)  activeNames.push('⚡ 量子科技阵');
    if (this.shopTryOnEquipped.sakura_circle) activeNames.push('🌸 圣樱神道阵');
    if (this.shopTryOnEquipped.fairy) activeNames.push('🧚 小仙子');
    if (this.shopTryOnEquipped.frostfire_skin) {
      activeNames.push('☯️ 冰火双生·极境神龙（羁绊触发）');
    } else {
      if (this.shopTryOnEquipped.chroma_gold) activeNames.push('🏆 黄金龙');
      if (this.shopTryOnEquipped.lava_skin) activeNames.push('🌋 熔岩火龙');
      if (this.shopTryOnEquipped.frost_skin) activeNames.push('❄️ 极寒冰龙');
    }
    if (this.shopTryOnEquipped.angel_skin) activeNames.push('👼 炽天大天使');
    if (this.shopTryOnEquipped.unicorn_skin) activeNames.push('🦄 梦幻独角兽');
    if (this.shopTryOnEquipped.grad_cap) activeNames.push('🎓 博士帽');
    if (this.shopTryOnHasFireworks) activeNames.push('🎇 璀璨烟火');
    if (this.shopTryOnHasDialogue) activeNames.push('💬 专属台词');
    if (this.shopTryOnTitle) activeNames.push(`🏷️ ${this.shopTryOnTitle}`);

    if (summaryEl) {
      if (activeNames.length === 0) {
        summaryEl.innerHTML = `<span class="tryon-empty-hint">当前为基础初始造型（点击右侧试穿）</span>`;
      } else {
        summaryEl.innerHTML = activeNames.map(n => `<span class="tryon-tag">${n}</span>`).join('');
      }
    }
  }

  // View 3: Reward Shop & Fitting Room
  renderShopView() {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;

    this.currentShopCategory = this.currentShopCategory || 'all';

    // Authoritative shop items list
    let items = (typeof DINO_DATA !== 'undefined' && Array.isArray(DINO_DATA.SHOP_ITEMS)) 
      ? JSON.parse(JSON.stringify(DINO_DATA.SHOP_ITEMS)) 
      : (window.storageMgr.data.shopItems || []);

    const SECTIONS = [
      { key: 'privilege', title: '🎟️ 班级荣耀特权区', subtitle: '实用课堂特权与荣誉置顶', icon: '🎟️', class: 'sec-privilege' },
      { key: 'skin',      title: '🐲 神兽终极皮肤馆', subtitle: '全形态恐龙基因幻化，自带专属流光特效', icon: '🐲', class: 'sec-skin' },
      { key: 'accessory', title: '👑 头饰与炫酷装扮区', subtitle: '金冠、黑超墨镜、学霸博士帽与称号勋章', icon: '👑', class: 'sec-accessory' },
      { key: 'fx',        title: '✨ 魔法光环与灵动特效', subtitle: '唯美樱花、星芒魔法阵、小仙子随从与烟火', icon: '✨', class: 'sec-fx' }
    ];

    const renderCard = (item) => {
      const isPrivilege = item.subCategory === 'privilege' || item.category === 'role' || item.category === 'fun';
      const isPerm = item.durationDays === 0;
      const isTriedOn = !isPrivilege && this.isItemCurrentlyTriedOn(item.id);

      let badgeHtml = '';
      if (item.subCategory === 'skin') {
        badgeHtml = `<span class="shop-badge-skin">🐲 神兽皮肤</span>`;
      } else if (item.subCategory === 'accessory') {
        badgeHtml = `<span class="shop-badge-accessory">👑 永久配饰</span>`;
      } else if (item.subCategory === 'fx') {
        badgeHtml = `<span class="shop-badge-fx">✨ 灵动光效</span>`;
      } else if (isPrivilege) {
        let dur = item.durationDays === 1 ? '1天' : (item.durationDays > 1 ? `${item.durationDays}天` : '单次');
        badgeHtml = `<span class="shop-badge-privilege">🎟️ 特权 · ${dur}</span>`;
      } else {
        badgeHtml = isPerm 
          ? `<span class="shop-badge-perm">♾️ 永久装扮</span>` 
          : `<span class="shop-badge-duration">⏳ ${item.durationDays}天</span>`;
      }

      const iconClass = item.subCategory ? `icon-${item.subCategory}` : (isPrivilege ? 'privilege-icon-box' : 'dino-icon-box');

      return `
        <div class="shop-item-card card-${item.subCategory || 'item'} ${isTriedOn ? 'tried-on-active' : ''}">
          <div class="shop-item-top">
            <div class="shop-item-icon-box ${iconClass}">
              <span class="shop-icon-symbol">${item.icon}</span>
            </div>
            <div class="shop-item-info">
              <div class="shop-item-title-row">
                <span class="shop-item-title">${item.title}</span>
                ${badgeHtml}
              </div>
            </div>
          </div>
          <div class="shop-item-bottom">
            <div class="shop-item-cost">🪙 <strong>${item.cost}</strong> 分</div>
            <div class="shop-item-actions">
              ${!isPrivilege ? `
                <button class="btn btn-sm ${isTriedOn ? 'btn-tryon-active' : 'btn-secondary'}" onclick="window.dinoApp.toggleShopItemTryOn('${item.id}')">
                  ${isTriedOn ? '✓ 试穿中' : '👕 试穿'}
                </button>
              ` : ''}
              <button class="btn btn-gold btn-sm" onclick="window.dinoApp.openRedeemModal('${item.id}')">🛒 兑换</button>
            </div>
          </div>
        </div>
      `;
    };

    if (this.currentShopCategory === 'all') {
      // Group by 4 sections cleanly
      let fullHtml = '';
      SECTIONS.forEach(sec => {
        const secItems = items.filter(i => (i.subCategory || (i.category === 'role' || i.category === 'fun' ? 'privilege' : 'accessory')) === sec.key);
        if (secItems.length > 0) {
          fullHtml += `
            <div class="shop-section-container ${sec.class}">
              <div class="shop-section-header">
                <div class="shop-section-title-wrap">
                  <span class="shop-section-title">${sec.title}</span>
                  <span class="shop-section-count">(${secItems.length}件道具)</span>
                </div>
                <span class="shop-section-sub">${sec.subtitle}</span>
              </div>
              <div class="shop-section-grid">
                ${secItems.map(renderCard).join('')}
              </div>
            </div>
          `;
        }
      });
      grid.innerHTML = fullHtml;
    } else {
      // Filter items for single subcategory
      const filtered = items.filter(i => {
        const sub = i.subCategory || (i.category === 'role' || i.category === 'fun' ? 'privilege' : 'accessory');
        return sub === this.currentShopCategory;
      });

      if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:50px; color:var(--text-muted); font-size:1rem;">🛍️ 暂无对应分类的商品</div>`;
      } else {
        const currentSec = SECTIONS.find(s => s.key === this.currentShopCategory);
        grid.innerHTML = `
          <div class="shop-section-container ${currentSec ? currentSec.class : ''}">
            <div class="shop-section-header">
              <div class="shop-section-title-wrap">
                <span class="shop-section-title">${currentSec ? currentSec.title : '商品列表'}</span>
                <span class="shop-section-count">(${filtered.length}件道具)</span>
              </div>
              <span class="shop-section-sub">${currentSec ? currentSec.subtitle : ''}</span>
            </div>
            <div class="shop-section-grid">
              ${filtered.map(renderCard).join('')}
            </div>
          </div>
        `;
      }
    }

    this.renderShopMannequin();
  }

  openRedeemModal(itemId) {
    let item = (typeof DINO_DATA !== 'undefined' && Array.isArray(DINO_DATA.SHOP_ITEMS))
      ? DINO_DATA.SHOP_ITEMS.find(i => i.id === itemId)
      : null;
    if (!item) {
      item = (window.storageMgr.data.shopItems || []).find(i => i.id === itemId);
    }
    if (!item) return;

    // Ensure item is synced in storageMgr.data.shopItems
    if (window.storageMgr && window.storageMgr.data) {
      window.storageMgr.data.shopItems = window.storageMgr.data.shopItems || [];
      if (!window.storageMgr.data.shopItems.some(i => i.id === itemId)) {
        window.storageMgr.data.shopItems.push(JSON.parse(JSON.stringify(item)));
        window.storageMgr.save();
      }
    }

    const allStudents = window.storageMgr.getStudents();
    if (allStudents.length === 0) {
      alert('班级中暂无学生，请先在班级管理中添加学生！');
      return;
    }

    const stateKey = itemId.replace('item_', '').replace('companion_fairy', 'fairy');
    const selectEl = document.getElementById('select-redeem-student');
    if (selectEl) {
      selectEl.innerHTML = allStudents.map(s => {
        const sEarned = s.earned || {};
        const isOwned = (itemId === 'item_crown' && (s.hasCrown || s.earnedCrown)) ||
                        (itemId === 'item_dialogue' && !!s.customDialogue) ||
                        (itemId === 'item_fireworks' && !!sEarned.fireworks) ||
                        !!sEarned[stateKey];
        const canAfford = s.score >= item.cost;
        let tag = '';
        if (isOwned) {
          tag = '【已拥有 · 点击直接换装】';
        } else if (canAfford) {
          tag = `(现有 ${s.score} 分 · 满足兑换)`;
        } else {
          tag = `(现有 ${s.score} 分 · 还差 ${item.cost - s.score} 分)`;
        }
        return `<option value="${s.id}">${s.name} ${tag}</option>`;
      }).join('');
    }

    const titleGroup = document.getElementById('redeem-title-select-group');
    const titleSelect = document.getElementById('select-redeem-title');
    if (itemId === 'item_title') {
      if (titleGroup) titleGroup.style.display = 'block';
      if (titleSelect) {
        titleSelect.innerHTML = DINO_DATA.PRESET_TITLES.map(t => `<option value="${t}">🏷️ ${t}</option>`).join('');
      }
    } else {
      if (titleGroup) titleGroup.style.display = 'none';
    }

    document.getElementById('redeem-item-title').textContent = item.title;
    document.getElementById('redeem-item-cost').textContent = `${item.cost} 分`;
    document.getElementById('modal-redeem').dataset.itemId = item.id;
    document.getElementById('modal-redeem').classList.add('active');
  }

  submitRedeem() {
    const modal = document.getElementById('modal-redeem');
    const itemId = modal.dataset.itemId;
    let item = (typeof DINO_DATA !== 'undefined' && Array.isArray(DINO_DATA.SHOP_ITEMS))
      ? DINO_DATA.SHOP_ITEMS.find(i => i.id === itemId)
      : null;
    if (!item) {
      item = (window.storageMgr.data.shopItems || []).find(i => i.id === itemId);
    }
    const selectEl = document.getElementById('select-redeem-student');
    const studentId = selectEl ? selectEl.value : null;

    if (!item || !studentId) return;

    const student = window.storageMgr.getStudentById(studentId);
    if (!student) return;

    student.equipped = student.equipped || {};
    student.earned = student.earned || {};

    const stateKey = itemId.replace('item_', '').replace('companion_fairy', 'fairy');
    const fullBodySkinKeys = ['chroma_gold', 'lava_skin', 'frost_skin', 'angel_skin', 'unicorn_skin', 'frostfire_skin'];

    // ── CHECK IF PERMANENT ITEM IS ALREADY OWNED (Direct Free Re-equip) ──
    if (item.durationDays === 0) {
      let alreadyOwned = false;
      if (itemId === 'item_crown') alreadyOwned = !!(student.hasCrown || student.earnedCrown);
      else if (itemId === 'item_dialogue') alreadyOwned = !!student.customDialogue;
      else if (itemId === 'item_fireworks') alreadyOwned = !!student.earned.fireworks;
      else alreadyOwned = !!student.earned[stateKey];

      if (alreadyOwned) {
        if (fullBodySkinKeys.includes(stateKey)) {
          fullBodySkinKeys.forEach(k => { student.equipped[k] = false; });
          student.equipped[stateKey] = true;
        } else if (itemId === 'item_crown') {
          student.hasCrown = true;
          student.earnedCrown = true;
        } else if (itemId === 'item_fireworks') {
          student.equipped.fireworks = true;
        } else {
          student.equipped[stateKey] = true;
        }
        window.storageMgr.save();
        modal.classList.remove('active');
        alert(`🎉 换装成功！${student.name} 已拥有【${item.title}】，已直接换上该形态！✨`);
        this.renderAll();
        return;
      }
    }

    // ── IF NOT OWNED, CHECK SCORE ──
    if (student.score < item.cost) {
      alert(`⚠️ ${student.name} 积分不足！现有 ${student.score} 分，兑换【${item.title}】需要 ${item.cost} 分（还差 ${item.cost - student.score} 分）。请继续加油！`);
      return;
    }

    // ── TITLE CARD ──
    if (itemId === 'item_title') {
      const titleSelect = document.getElementById('select-redeem-title');
      const chosenTitle = titleSelect ? titleSelect.value : '';
      if (!chosenTitle) { alert('请选择要兑换的称号！'); return; }

      if (!Array.isArray(student.earnedTitles)) {
        student.earnedTitles = student.titleBadge ? [student.titleBadge] : [];
      }
      if (student.earnedTitles.includes(chosenTitle)) {
        student.titleBadge = chosenTitle;
        window.storageMgr.save();
        modal.classList.remove('active');
        alert(`🎉 称号佩戴成功！${student.name} 已拥有【${chosenTitle}】称号，已为您直接佩戴！`);
        this.renderAll();
        return;
      }
      this.adjustScore(studentId, -item.cost, `兑换专属称号【${chosenTitle}】`);
      student.earnedTitles.push(chosenTitle);
      student.titleBadge = chosenTitle;
      window.storageMgr.save();
      modal.classList.remove('active');
      alert(`🎉 兑换成功！${student.name} 获得了专属称号【${chosenTitle}】！`);
      this.renderAll();
      return;
    }

    // ── DIALOGUE CARD ──
    if (itemId === 'item_dialogue') {
      modal.classList.remove('active');
      document.getElementById('dialogue-student-name').textContent = student.name;
      document.getElementById('dialogue-input').value = student.customDialogue || '';
      document.getElementById('modal-dialogue-input').dataset.studentId = studentId;
      document.getElementById('modal-dialogue-input').dataset.cost = item.cost;
      document.getElementById('modal-dialogue-input').classList.add('active');
      return;
    }

    // ── FIREWORKS CARD ──
    if (itemId === 'item_fireworks') {
      this.adjustScore(studentId, -item.cost, `兑换【${item.title}】`);
      student.earned.fireworks = true;
      student.equipped.fireworks = true;
      window.storageMgr.save();
      modal.classList.remove('active');
      alert(`🎉 兑换成功！${student.name} 的恐龙卡片现在拥有永久烟火特效！🎇`);
      this.renderAll();
      return;
    }

    // ── OTHER VISUAL DINO REWARDS (Skins & Accessories) ──
    const visualRewardIds = ['item_crown', 'item_sunglasses', 'item_cherry_blossom', 'item_magic_circle', 'item_lava_circle', 'item_cyber_circle', 'item_sakura_circle', 'item_companion_fairy', 'item_chroma_gold', 'item_lava_skin', 'item_frost_skin', 'item_angel_skin', 'item_unicorn_skin', 'item_grad_cap'];
    if (visualRewardIds.includes(itemId)) {
      this.adjustScore(studentId, -item.cost, `兑换【${item.title}】`);
      if (itemId === 'item_crown') {
        student.hasCrown = true;
        student.earnedCrown = true;
      } else {
        student.earned[stateKey] = true;
        if (fullBodySkinKeys.includes(stateKey)) {
          fullBodySkinKeys.forEach(k => { student.equipped[k] = false; });
        }
        student.equipped[stateKey] = true;
      }

      // Check FrostFire synergy unlock
      if (itemId === 'item_lava_skin' || itemId === 'item_frost_skin') {
        if (student.earned.lava_skin && student.earned.frost_skin) {
          student.earned.frostfire_skin = true;
          fullBodySkinKeys.forEach(k => { student.equipped[k] = false; });
          student.equipped.frostfire_skin = true;
          window.storageMgr.save();
          modal.classList.remove('active');
          alert(`🎉 恭喜触发神级羁绊！\n${student.name} 同时集齐了【🌋 熔岩火龙】与【❄️ 极寒冰龙】，成功觉醒隐藏神兽【☯️ 冰火双生·极境神龙】！\n已自动为你换上全新冰火形态，也可在装扮衣橱中随时切换！`);
          this.renderAll();
          return;
        }
      }

      window.storageMgr.save();
      modal.classList.remove('active');
      alert(`🎉 兑换成功！${student.name} 已永久解锁并穿戴【${item.title}】！`);
      this.renderAll();
      return;
    }

    // ── PRIVILEGE CARD (time-limited) ──
    this.adjustScore(studentId, -item.cost, `兑换道具卡【${item.title}】`);
    window.storageMgr.addStudentPrivilege(studentId, item);
    modal.classList.remove('active');
    alert(`🎉 兑换成功！${student.name} 获得了【${item.title}】特权！`);
    this.renderAll();
  }

  submitDialogue() {
    const modal = document.getElementById('modal-dialogue-input');
    const studentId = modal.dataset.studentId;
    const cost = parseInt(modal.dataset.cost) || 35;
    const rawText = document.getElementById('dialogue-input').value.trim().slice(0, 20);

    if (!rawText) { alert('请输入台词内容！'); return; }
    const text = window.storageMgr.escapeHTML(rawText);

    const student = window.storageMgr.getStudentById(studentId);
    if (!student) return;

    this.adjustScore(studentId, -cost, `兑换恐龙专属台词卡`);
    student.customDialogue = text;
    window.storageMgr.save();
    modal.classList.remove('active');
    alert(`🎉 兑换成功！${student.name} 的恐龙台词已设置为「${text}」！`);
    this.renderAll();
  }

  // View 4: Score Logs History
  renderHistoryView() {
    const container = document.getElementById('history-list');
    if (!container) return;

    const logs = window.storageMgr.data.logs;
    if (!logs || logs.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">暂无积分变动履历</div>`;
      return;
    }

    container.innerHTML = logs.map(log => `
      <div style="background:var(--bg-card); border:1px solid var(--border-glass); border-radius:var(--radius-md); padding:14px 20px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="font-size:1.05rem;">${log.studentName}</strong>
          <span style="margin-left:12px; color:var(--text-muted); font-size:0.9rem;">${log.reason}</span>
        </div>
        <div style="display:flex; align-items:center; gap:16px;">
          <span style="font-size:0.85rem; color:var(--text-muted);">${log.timestamp}</span>
          <span style="font-weight:800; font-size:1.1rem; color: ${log.delta > 0 ? '#34d399' : '#f87171'};">
            ${log.delta > 0 ? '+' : ''}${log.delta} 分
          </span>
        </div>
      </div>
    `).join('');
  }

  openStudentDetailModal(studentId) {
    const student = window.storageMgr.getStudentById(studentId);
    if (!student) return;

    const modal = document.getElementById('modal-student-detail');
    if (!modal) return;

    document.getElementById('detail-student-name').textContent = student.name;
    document.getElementById('detail-species-select').value = student.speciesKey;
    document.getElementById('detail-score').textContent = `${student.score} 分`;

    // ✅ 关键修复：每次打开弹窗必须清空姓名输入框，防止残留上一个学生的名字误写入
    const nameInputField = document.getElementById('detail-student-name-input');
    if (nameInputField) nameInputField.value = '';
    
    // Wardrobe section
    const wardrobeSection = document.getElementById('detail-wardrobe-section');
    if (wardrobeSection) {
      let hasAny = false;
      student.equipped = student.equipped || {};
      student.earned = student.earned || {};
      
      const setupItem = (id, earned, equipped) => {
        const label = document.getElementById(`wardrobe-${id}`);
        const cb = document.getElementById(`detail-${id}-checkbox`);
        if (label && cb) {
          if (earned) {
            label.style.display = 'flex';
            cb.checked = !!equipped;
            hasAny = true;
          } else {
            label.style.display = 'none';
          }
        }
      };

      setupItem('crown', student.earnedCrown, student.hasCrown);
      setupItem('sunglasses', student.earned.sunglasses, student.equipped.sunglasses);
      setupItem('cherry', student.earned.cherry_blossom, student.equipped.cherry_blossom);
      setupItem('magic',  student.earned.magic_circle,  student.equipped.magic_circle);
      setupItem('lava_c', student.earned.lava_circle,   student.equipped.lava_circle);
      setupItem('cyber_c', student.earned.cyber_circle, student.equipped.cyber_circle);
      setupItem('sakura_c', student.earned.sakura_circle, student.equipped.sakura_circle);
      setupItem('fairy',  student.earned.fairy,          student.equipped.fairy);
      setupItem('chroma', student.earned.chroma_gold, student.equipped.chroma_gold);
      setupItem('lava', student.earned.lava_skin, student.equipped.lava_skin);
      setupItem('frost', student.earned.frost_skin, student.equipped.frost_skin);
      if (student.earned.lava_skin && student.earned.frost_skin) {
        student.earned.frostfire_skin = true;
      }
      setupItem('frostfire', student.earned.frostfire_skin, student.equipped.frostfire_skin);
      setupItem('angel', student.earned.angel_skin, student.equipped.angel_skin);
      setupItem('unicorn', student.earned.unicorn_skin, student.equipped.unicorn_skin);
      setupItem('grad', student.earned.grad_cap, student.equipped.grad_cap);
      setupItem('fireworks', student.earned.fireworks, student.equipped.fireworks);
      setupItem('dialogue', !!student.customDialogue, !!student.customDialogue);

      // Attach mutual exclusion handler on full-body skin checkboxes
      const skinCheckboxIds = ['detail-chroma-checkbox', 'detail-lava-checkbox', 'detail-frost-checkbox', 'detail-frostfire-checkbox', 'detail-angel-checkbox', 'detail-unicorn-checkbox'];
      skinCheckboxIds.forEach(id => {
        const cb = document.getElementById(id);
        if (cb) {
          cb.onchange = () => {
            if (cb.checked) {
              skinCheckboxIds.forEach(otherId => {
                if (otherId !== id) {
                  const otherCb = document.getElementById(otherId);
                  if (otherCb) otherCb.checked = false;
                }
              });
            }
          };
        }
      });

      wardrobeSection.style.display = hasAny ? 'block' : 'none';
    }

    // Render Privileges List inside detail modal
    const privContainer = document.getElementById('detail-privileges-container');
    if (privContainer) {
      if (Array.isArray(student.activePrivileges) && student.activePrivileges.length > 0) {
        privContainer.innerHTML = student.activePrivileges.map(p => {
          let timeText = '永久';
          if (p.expireTimestamp) {
            const diffMs = p.expireTimestamp - Date.now();
            if (diffMs <= 0) return '';
            const mins = Math.floor(diffMs / 60000);
            timeText = `剩余 ${Math.floor(mins / 60)}小时 ${mins % 60}分`;
          }
          return `<div style="font-size:0.82rem; background:rgba(30,41,59,0.7); border:1px solid var(--border-glass); border-radius:6px; padding:4px 10px; display:flex; justify-content:space-between; align-items:center;">
            <span>${p.icon} <strong>${p.title}</strong></span>
            <span style="color:var(--accent-gold); font-weight:700;">[⏳ ${timeText}]</span>
          </div>`;
        }).filter(Boolean).join('') || `<div style="font-size:0.82rem; color:var(--text-muted);">暂无佩戴时效特权卡</div>`;
      } else {
        privContainer.innerHTML = `<div style="font-size:0.82rem; color:var(--text-muted);">暂无佩戴时效特权卡</div>`;
      }
    }

    // Dynamically render title select options based on earned titles
    const titleSel = document.getElementById('detail-title-select');
    if (titleSel) {
      if (!Array.isArray(student.earnedTitles)) {
        student.earnedTitles = student.titleBadge ? [student.titleBadge] : [];
      }

      const earned = student.earnedTitles;
      let optionsHtml = `<option value="">(无称号)</option>`;
      if (earned.length === 0) {
        optionsHtml += `<option value="" disabled style="color:var(--text-muted);">🔒 暂未在商城兑换任何专属称号</option>`;
      } else {
        earned.forEach(t => {
          optionsHtml += `<option value="${t}">🏷️ ${t}</option>`;
        });
      }
      titleSel.innerHTML = optionsHtml;
      titleSel.value = student.titleBadge || '';
    }

    modal.dataset.studentId = student.id;
    modal.classList.add('active');
  }

  submitUpdateStudentDetail() {
    const modal = document.getElementById('modal-student-detail');
    const studentId = modal.dataset.studentId;
    const student = window.storageMgr.getStudentById(studentId);
    if (!student) return;

    const nameInput = document.getElementById('detail-student-name-input');
    const speciesSelect = document.getElementById('detail-species-select');
    const titleSel = document.getElementById('detail-title-select');
    
    if (!Array.isArray(student.earnedTitles)) {
      student.earnedTitles = student.titleBadge ? [student.titleBadge] : [];
    }
    const selectedTitle = titleSel ? titleSel.value : '';
    if (selectedTitle && !student.earnedTitles.includes(selectedTitle)) {
      alert(`⚠️ 该学生尚未在商城兑换【${selectedTitle}】称号！请先在商城兑换后才能佩戴。`);
      return;
    }

    const getCb = (id) => document.getElementById(`detail-${id}-checkbox`);
    const crownCb = getCb('crown');
    const sunglassesCb = getCb('sunglasses');
    const cherryCb = getCb('cherry');
    const magicCb    = getCb('magic');
    const lavaCircleCb   = getCb('lava_c');
    const cyberCircleCb  = getCb('cyber_c');
    const sakuraCircleCb = getCb('sakura_c');
    const fairyCb    = getCb('fairy');
    const chromaCb = getCb('chroma');
    const lavaCb = getCb('lava');
    const frostCb = getCb('frost');
    const frostfireCb = getCb('frostfire');
    const angelCb = getCb('angel');
    const unicornCb = getCb('unicorn');
    const gradCb = getCb('grad');
    const fireworksCb = getCb('fireworks');
    const dialogueCb = getCb('dialogue');

    student.equipped = student.equipped || {};
    student.earned = student.earned || {};

    if (nameInput && nameInput.value.trim()) {
      student.name = window.storageMgr.escapeHTML(nameInput.value.trim());
    }
    if (speciesSelect) student.speciesKey = speciesSelect.value;
    if (titleSel) student.titleBadge = selectedTitle;

    if (crownCb && student.earnedCrown) student.hasCrown = crownCb.checked;
    if (sunglassesCb && student.earned.sunglasses) student.equipped.sunglasses = sunglassesCb.checked;
    if (cherryCb && student.earned.cherry_blossom) student.equipped.cherry_blossom = cherryCb.checked;
    if (magicCb      && student.earned.magic_circle)  student.equipped.magic_circle  = magicCb.checked;
    if (lavaCircleCb && student.earned.lava_circle)   student.equipped.lava_circle   = lavaCircleCb.checked;
    if (cyberCircleCb && student.earned.cyber_circle) student.equipped.cyber_circle  = cyberCircleCb.checked;
    if (sakuraCircleCb && student.earned.sakura_circle) student.equipped.sakura_circle = sakuraCircleCb.checked;
    if (fairyCb      && student.earned.fairy)         student.equipped.fairy         = fairyCb.checked;

    // Full body skins (clean single active skin)
    student.equipped.chroma_gold = chromaCb && student.earned.chroma_gold ? chromaCb.checked : false;
    student.equipped.lava_skin = lavaCb && student.earned.lava_skin ? lavaCb.checked : false;
    student.equipped.frost_skin = frostCb && student.earned.frost_skin ? frostCb.checked : false;
    student.equipped.frostfire_skin = frostfireCb && student.earned.frostfire_skin ? frostfireCb.checked : false;
    student.equipped.angel_skin = angelCb && student.earned.angel_skin ? angelCb.checked : false;
    student.equipped.unicorn_skin = unicornCb && student.earned.unicorn_skin ? unicornCb.checked : false;

    if (gradCb && student.earned.grad_cap) student.equipped.grad_cap = gradCb.checked;
    if (fireworksCb && student.earned.fireworks) student.equipped.fireworks = fireworksCb.checked;
    if (dialogueCb && !dialogueCb.checked) student.customDialogue = '';

    window.storageMgr.save();
    modal.classList.remove('active');
    this.renderAll();
  }

  // Clear all privileges and cosmetics for student
  clearStudentAllPrivileges() {
    const modal = document.getElementById('modal-student-detail');
    const studentId = modal ? modal.dataset.studentId : null;
    if (!studentId) return;

    const student = window.storageMgr.getStudentById(studentId);
    if (!student) return;

    if (!confirm(`确定要一键清除学生【${student.name}】的所有已兑换特权卡、专属称号、台词与外观装扮吗？`)) {
      return;
    }

    student.hasCrown = false;
    student.earnedCrown = false;
    student.equipped = {};
    student.earned = {};
    student.activePrivileges = [];
    student.isSpotlight = false;
    student.customDialogue = '';
    student.titleBadge = '';
    student.earnedTitles = [];

    window.storageMgr.save();
    modal.classList.remove('active');
    alert(`🧹 已成功重置并清除【${student.name}】的所有装扮与特权！`);
    this.renderAll();
  }

  deleteCurrentStudent() {
    const modal = document.getElementById('modal-student-detail');
    const studentId = modal.dataset.studentId;
    if (confirm('确定要从班级中移除该学生吗？')) {
      window.storageMgr.deleteStudent(studentId);
      modal.classList.remove('active');
      this.renderAll();
    }
  }

  resetDemoData() {
    if (confirm('确定要恢复初始示例班级名单吗？现有更改将被重置！')) {
      window.storageMgr.resetToDefault();
      this.selectedStudentIds.clear();
      this.renderAll();
    }
  }

  // Initialize practical tools (stopwatch, timer, calculator)
  initTools() {
    // Stopwatch
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const btnStartStopwatch = document.getElementById('btn-start-stopwatch');
    const btnResetStopwatch = document.getElementById('btn-reset-stopwatch');
    let stopwatchInterval = null;
    let stopwatchStart = null;
    if (btnStartStopwatch) {
      btnStartStopwatch.addEventListener('click', () => {
        if (stopwatchInterval) {
          clearInterval(stopwatchInterval);
          stopwatchInterval = null;
          btnStartStopwatch.textContent = '开始';
        } else {
          stopwatchStart = Date.now();
          btnStartStopwatch.textContent = '暂停';
          stopwatchInterval = setInterval(() => {
            const elapsed = Date.now() - stopwatchStart;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const tenths = Math.floor((elapsed % 1000) / 100);
            const mStr = minutes.toString().padStart(2, '0');
            const sStr = seconds.toString().padStart(2, '0');
            if (stopwatchDisplay) stopwatchDisplay.textContent = `${mStr}:${sStr}.${tenths}`;
          }, 100);
        }
      });
    }
    if (btnResetStopwatch) {
      btnResetStopwatch.addEventListener('click', () => {
        if (stopwatchInterval) clearInterval(stopwatchInterval);
        stopwatchInterval = null;
        if (stopwatchDisplay) stopwatchDisplay.textContent = '00:00.0';
        if (btnStartStopwatch) btnStartStopwatch.textContent = '开始';
      });
    }

    // Countdown Timer with Hours & Minutes Display
    const inputHours = document.getElementById('timer-input-hours');
    const inputMins = document.getElementById('timer-input-mins');
    const timerDisplay = document.getElementById('timer-display');
    const btnStartTimer = document.getElementById('btn-start-timer');
    const btnResetTimer = document.getElementById('btn-reset-timer');
    let timerInterval = null;
    let timerRemainingSeconds = 0;

    function formatTimerText(totalSec) {
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      const hStr = String(h).padStart(2, '0');
      const mStr = String(m).padStart(2, '0');
      const sStr = String(s).padStart(2, '0');
      return `${hStr}时 ${mStr}分 ${sStr}秒`;
    }

    if (btnStartTimer) {
      btnStartTimer.addEventListener('click', () => {
        if (timerInterval) {
          // Pause timer
          clearInterval(timerInterval);
          timerInterval = null;
          btnStartTimer.textContent = '继续';
          return;
        }

        if (timerRemainingSeconds <= 0) {
          const hrs = parseInt(inputHours?.value || '0', 10) || 0;
          const mins = parseInt(inputMins?.value || '0', 10) || 0;
          timerRemainingSeconds = (hrs * 3600) + (mins * 60);

          if (timerRemainingSeconds <= 0) {
            alert('请先输入有效的倒计时时间（小时或分钟）');
            return;
          }
        }

        btnStartTimer.textContent = '暂停';
        if (timerDisplay) timerDisplay.textContent = formatTimerText(timerRemainingSeconds);

        timerInterval = setInterval(() => {
          timerRemainingSeconds--;
          if (timerDisplay) timerDisplay.textContent = formatTimerText(Math.max(0, timerRemainingSeconds));

          if (timerRemainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            btnStartTimer.textContent = '开始';
            window.soundCtrl.playLevelUp();
            alert('⏰ 课堂倒计时结束！');
          }
        }, 1000);
      });
    }

    if (btnResetTimer) {
      btnResetTimer.addEventListener('click', () => {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
        timerRemainingSeconds = 0;
        if (btnStartTimer) btnStartTimer.textContent = '开始';
        if (timerDisplay) timerDisplay.textContent = '00时 00分 00秒';
        if (inputHours) inputHours.value = '';
        if (inputMins) inputMins.value = '';
      });
    }

    // Calculator
    const calcInput = document.getElementById('calc-input');
    const btnCalcEval = document.getElementById('btn-calc-eval');
    const calcResult = document.getElementById('calc-result');
    if (btnCalcEval) {
      btnCalcEval.addEventListener('click', () => {
        const expr = calcInput?.value.trim();
        if (!expr) {
          calcResult.textContent = '请输入表达式';
          return;
        }
        try {
          const result = Function('return ' + expr)();
          calcResult.textContent = `= ${result}`;
        } catch (e) {
          calcResult.textContent = '计算错误';
        }
      });
    }
  }

  triggerImportJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const success = window.storageMgr.importJSON(evt.target.result);
          if (success) {
            alert('🎉 数据备份导入成功！');
            this.renderAll();
          } else {
            alert('❌ JSON 文件格式错误，无法导入。');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  // 🍞 浮动吐司通知 (Toast Notification)
  showToast(msg, duration = 3200) {
    let toast = document.getElementById('dinoclass-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'dinoclass-toast';
      toast.className = 'dinoclass-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = msg;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // 📲 远程数据变动监听响应回调
  onRemoteDataSynced(data, payload) {
    this.renderAll();
    this.showToast('📲 收到远程变动，班级大屏已实时同步更新！');
    if (window.soundCtrl && typeof window.soundCtrl.playCoin === 'function') {
      window.soundCtrl.playCoin();
    }
  }

  // ☁️ 打开 Firebase 配置与遥控中心弹窗
  openFirebaseModal() {
    const modal = document.getElementById('modal-firebase-config');
    if (!modal) return;
    modal.classList.add('active');

    const mgr = window.firebaseSyncMgr;
    const roomInput = document.getElementById('fb-room-id-input');
    const directUrlInput = document.getElementById('fb-direct-url-display');
    const configInput = document.getElementById('fb-config-raw-input');

    if (roomInput && mgr) roomInput.value = mgr.roomId || 'class_3k_24';
    if (directUrlInput && mgr && mgr.config) {
      directUrlInput.value = mgr.generateDirectUrl();
    }
    if (mgr && mgr.config && configInput && !configInput.value) {
      configInput.value = JSON.stringify(mgr.config, null, 2);
    }
    mgr?.updateStatusUI();
  }

  closeFirebaseModal() {
    document.getElementById('modal-firebase-config')?.classList.remove('active');
  }

  // 提交并连接 Firebase 配置
  submitFirebaseConfig() {
    const mgr = window.firebaseSyncMgr;
    if (!mgr) return;

    const rawInput = document.getElementById('fb-config-raw-input')?.value.trim();
    const roomId = document.getElementById('fb-room-id-input')?.value.trim() || 'class_3k_24';

    if (!rawInput && !mgr.config) {
      alert('⚠️ 请先在文本框中粘贴 Firebase 控制台中的配置代码！');
      return;
    }

    let parsedConfig = mgr.config;
    if (rawInput) {
      parsedConfig = mgr.parseRawConfigInput(rawInput);
      if (!parsedConfig) {
        alert('⚠️ 无法识别您输入的 Firebase 配置，请确保包含 apiKey 和 projectId 或 databaseURL！');
        return;
      }
    }

    const ok = mgr.connect(parsedConfig, roomId);
    if (ok) {
      this.showToast('🚀 正在连接 Firebase 实时数据库...');
      const directUrlInput = document.getElementById('fb-direct-url-display');
      if (directUrlInput) directUrlInput.value = mgr.generateDirectUrl();
    }
  }

  // 复制手机遥控免密直连地址
  copyMobileRemoteLink() {
    const mgr = window.firebaseSyncMgr;
    if (!mgr || !mgr.config) {
      alert('⚠️ 请先成功连接 Firebase 后再获取手机遥控链接！');
      return;
    }
    const directUrl = mgr.generateDirectUrl();
    navigator.clipboard.writeText(directUrl).then(() => {
      this.showToast('📋 手机专属直连网址已复制！发送到微信在手机打开即可随堂遥控！');
    }).catch(() => {
      prompt('请手动复制以下手机专属网址：', directUrl);
    });
  }

  // 下载 D 盘极速启动器
  downloadFirebaseLauncher() {
    const mgr = window.firebaseSyncMgr;
    if (!mgr || !mgr.config) {
      alert('⚠️ 请先成功连接 Firebase 后再下载启动器！');
      return;
    }
    mgr.downloadLauncherHtml();
    this.showToast('💾 D 盘启动器已下载！请将它存放在学校电脑的 D 盘或 U 盘');
  }

  // 手动推送与拉取
  manualPushFirebase() {
    const mgr = window.firebaseSyncMgr;
    if (!mgr) return;
    mgr.pushDataImmediately(window.storageMgr.data)
      .then(() => this.showToast('✅ 已成功推送全班数据至 Firebase 云端！'))
      .catch((e) => alert('❌ 上传失败: ' + e.message));
  }

  manualPullFirebase() {
    const mgr = window.firebaseSyncMgr;
    if (!mgr) return;
    mgr.pullDataImmediately()
      .then((hasData) => {
        if (hasData) this.showToast('✅ 已成功从云端恢复全班最新数据！');
        else alert('ℹ️ 云端暂无存档数据');
      })
      .catch((e) => alert('❌ 拉取失败: ' + e.message));
  }

  // 清除配置
  clearFirebaseConfig() {
    if (confirm('确认清除当前 Firebase 云端配置并断开连接吗？（本地学生数据不受影响）')) {
      window.firebaseSyncMgr?.clearConfig();
      const configInput = document.getElementById('fb-config-raw-input');
      if (configInput) configInput.value = '';
      const directUrlInput = document.getElementById('fb-direct-url-display');
      if (directUrlInput) directUrlInput.value = '';
      this.showToast('🧹 已清除 Firebase 配置并切换为纯本地模式');
    }
  }

  // ==========================================================================
  // 🏫 多班级管理与极速切换核心 UI 方法
  // ==========================================================================

  // 渲染顶部班级切换器与下拉菜单
  renderClassSelector() {
    const nameDisplay = document.getElementById('current-class-name-display');
    const dropdownList = document.getElementById('class-dropdown-list');
    const activeId = window.storageMgr.getActiveClassId();
    const activeName = window.storageMgr.getActiveClassName();

    if (nameDisplay) {
      nameDisplay.textContent = activeName;
    }

    if (dropdownList) {
      const list = window.storageMgr.classesList || [];
      const seenIds = new Set();
      const cleanItems = [];
      for (const c of list) {
        if (!c || !c.id || seenIds.has(c.id)) continue;
        seenIds.add(c.id);
        cleanItems.push(c);
      }

      dropdownList.innerHTML = cleanItems.map(c => {
        const isActive = c.id === activeId;
        const count = window.storageMgr.getClassStudentCount(c.id);
        const score = window.storageMgr.getClassTotalScore(c.id);
        return `
          <div class="class-dropdown-item ${isActive ? 'active' : ''}" onclick="window.dinoApp.selectClass('${c.id}')">
            <span class="class-item-icon">${isActive ? '✅' : '🏫'}</span>
            <span class="class-item-name">${c.name}</span>
            <span style="font-size:0.75rem; color:#94a3b8; margin-left:auto; margin-right:6px;">${count}人 · ${score}分</span>
            ${isActive ? '<span class="class-item-badge">当前授课</span>' : ''}
          </div>
        `;
      }).join('');
    }
  }

  // 切换激活班级
  selectClass(classId) {
    document.getElementById('class-dropdown-menu')?.classList.remove('active');
    window.storageMgr.switchClass(classId);
    this.selectedStudentIds.clear();
    this.renderClassSelector();
    this.renderAll();
    this.showToast(`🏫 已切换至【${window.storageMgr.getActiveClassName()}】！数据已就绪`);
  }

  // 一键理顺双班级目录（彻底消除多端重叠加的所有幽灵班级）
  cleanDuplicateClasses() {
    if (!window.storageMgr) return;
    const cleanList = window.storageMgr.sanitizeToStandardClasses();
    this.renderClassSelector();
    this.renderClassManageItems();
    this.renderAll();
    this.showToast('🧹 已彻底理顺双班级目录！多余重叠班级已全部清理并同步云端。');
  }

  // 打开创建新班级视图
  openCreateClassView() {
    const modal = document.getElementById('modal-class-manage');
    if (!modal) return;
    const title = document.getElementById('class-manage-modal-title');
    if (title) title.textContent = '➕ 新建授课班级';
    document.getElementById('class-manage-view-create').style.display = 'block';
    document.getElementById('class-manage-view-list').style.display = 'none';
    const input = document.getElementById('input-new-class-name');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 150);
    }
    modal.classList.add('active');
  }

  // 打开班级管理中心视图
  openClassManageModal() {
    const modal = document.getElementById('modal-class-manage');
    if (!modal) return;
    const title = document.getElementById('class-manage-modal-title');
    if (title) title.textContent = '🏫 班级管理中心';
    document.getElementById('class-manage-view-create').style.display = 'none';
    document.getElementById('class-manage-view-list').style.display = 'block';
    this.renderClassManageItems();
    modal.classList.add('active');
  }

  closeClassManageModal() {
    document.getElementById('modal-class-manage')?.classList.remove('active');
  }

  // 渲染管理中心列表
  renderClassManageItems() {
    const container = document.getElementById('class-manage-items-list');
    if (!container) return;
    const list = window.storageMgr.classesList || [];
    const activeId = window.storageMgr.getActiveClassId();

    const seenIds = new Set();
    const cleanItems = [];
    for (const c of list) {
      if (!c || !c.id || seenIds.has(c.id)) continue;
      seenIds.add(c.id);
      cleanItems.push(c);
    }

    container.innerHTML = cleanItems.map(c => {
      const isActive = c.id === activeId;
      const canDelete = cleanItems.length > 1;
      const count = window.storageMgr.getClassStudentCount(c.id);
      const score = window.storageMgr.getClassTotalScore(c.id);
      return `
        <div class="class-manage-row" style="display:flex; justify-content:space-between; align-items:center; background:rgba(15,23,42,0.6); padding:10px 14px; border-radius:var(--radius-md); border:1px solid var(--border-glass);">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.1rem;">${isActive ? '🌟' : '🏫'}</span>
            <div>
              <strong style="color:#fff; font-size:0.95rem;">${c.name}</strong>
              <span style="font-size:0.78rem; color:#94a3b8; margin-left:6px;">(${count} 人 · ${score} 分)</span>
            </div>
            ${isActive ? '<span style="font-size:0.72rem; background:rgba(245,158,11,0.2); color:#fbbf24; padding:2px 8px; border-radius:10px; font-weight:700;">当前班级</span>' : ''}
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary btn-sm" style="padding:4px 10px; font-size:0.8rem;" onclick="window.dinoApp.promptRenameClass('${c.id}')" title="重命名此班级">✏️ 改名</button>
            <button class="btn btn-secondary btn-sm" style="padding:4px 10px; font-size:0.8rem; color:#38bdf8; border-color:rgba(56,189,248,0.3);" onclick="window.dinoApp.promptResetClass('${c.id}')" title="清空或重置此班级名单">🧹 重置</button>
            ${canDelete ? `<button class="btn btn-secondary btn-sm" style="padding:4px 10px; font-size:0.8rem; color:#f87171; border-color:rgba(248,113,113,0.3);" onclick="window.dinoApp.confirmDeleteClass('${c.id}')" title="删除班级">🗑️</button>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // 独立清空/重置某一班级名单
  promptResetClass(classId) {
    const name = window.storageMgr.getClassNameById(classId);
    const count = window.storageMgr.getClassStudentCount(classId);
    const choice = confirm(
      `⚠️ 班级数据独立重置提示：\n\n` +
      `确定要清空【${name}】（当前 ${count} 名学生）的数据吗？\n\n` +
      `【确定】：清空该班级学生名单（变为空白班级，供录入新学生）\n` +
      `【取消】：放弃操作\n\n` +
      `🛡️ 安全保证：此操作仅重置【${name}】，其他所有班级的数据 100% 独立保留，绝不受影响！`
    );
    if (choice) {
      window.storageMgr.resetClassData(classId, 'empty');
      this.renderClassSelector();
      this.renderClassManageItems();
      if (classId === window.storageMgr.getActiveClassId()) {
        this.selectedStudentIds.clear();
        this.renderAll();
      }
      this.showToast(`🧹 已成功重置并清空【${name}】的学生名单！`);
    }
  }

  // 提交新建班级
  submitCreateClass() {
    const input = document.getElementById('input-new-class-name');
    const name = input?.value.trim();
    if (!name) {
      alert('⚠️ 请输入新班级名称（例如：三(2)班）！');
      return;
    }
    const withSample = !!document.getElementById('checkbox-with-sample-students')?.checked;
    const created = window.storageMgr.createClass(name, withSample);
    if (created) {
      this.closeClassManageModal();
      this.selectedStudentIds.clear();
      this.renderClassSelector();
      this.renderAll();
      this.showToast(`🎉 成功创建并切换至新班级：【${name}】！`);
    }
  }

  // 重命名班级提示框
  promptRenameClass(classId) {
    const currentClass = window.storageMgr.classesList.find(c => c.id === classId);
    if (!currentClass) return;
    const newName = prompt('请输入班级的新名称：', currentClass.name);
    if (newName && newName.trim()) {
      window.storageMgr.renameClass(classId, newName.trim());
      this.renderClassSelector();
      this.renderClassManageItems();
      if (classId === window.storageMgr.getActiveClassId()) {
        this.renderAll();
      }
      this.showToast(`✏️ 班级名称已更新为：【${newName.trim()}】`);
    }
  }

  // 删除班级确认
  confirmDeleteClass(classId) {
    const target = window.storageMgr.classesList.find(c => c.id === classId);
    if (!target) return;
    if (confirm(`⚠️ 确认删除班级【${target.name}】吗？\n删除后该班级的学生和积分将一并移除。`)) {
      window.storageMgr.deleteClass(classId);
      this.selectedStudentIds.clear();
      this.renderClassSelector();
      this.renderClassManageItems();
      this.renderAll();
      this.showToast(`🗑️ 已删除班级：【${target.name}】`);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.dinoApp = new DinoApp();
  window.dinoApp.init();
});
