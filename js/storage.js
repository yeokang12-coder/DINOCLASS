/* ==========================================================================
   DinoClass (恐龙班级小帮手) - Storage & State Persistence Manager
   ========================================================================== */

const STORAGE_KEY = 'DINOCLASS_APP_DATA_V3';

class StorageManager {
  constructor() {
    this.data = this.loadData();
  }

  // Load from local storage or initialize with default sample data
  loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Direct Master Sync: Always ensure DINO_DATA.SHOP_ITEMS is authoritative!
        if (typeof DINO_DATA !== 'undefined' && Array.isArray(DINO_DATA.SHOP_ITEMS)) {
          parsed.shopItems = JSON.parse(JSON.stringify(DINO_DATA.SHOP_ITEMS));
        }
        // Auto-Prune history & logs to prevent unbounded localStorage bloat on school machines
        if (Array.isArray(parsed.logs) && parsed.logs.length > 200) {
          parsed.logs = parsed.logs.slice(0, 200);
        }
        if (Array.isArray(parsed.students)) {
          let needsSave = false;
          parsed.students.forEach(s => {
            s.equipped = s.equipped || {};
            s.earned = s.earned || {};
            if (Array.isArray(s.history) && s.history.length > 30) {
              s.history = s.history.slice(0, 30);
            }
            // Auto-heal/migrate any accidental visual items in activePrivileges
            if (Array.isArray(s.activePrivileges)) {
              const visualIds = ['item_lava_skin', 'item_frost_skin', 'item_angel_skin', 'item_unicorn_skin', 'item_chroma_gold', 'item_crown', 'item_sunglasses', 'item_grad_cap', 'item_cherry_blossom', 'item_magic_circle', 'item_lava_circle', 'item_cyber_circle', 'item_sakura_circle', 'item_companion_fairy', 'item_fireworks'];
              for (let i = s.activePrivileges.length - 1; i >= 0; i--) {
                const priv = s.activePrivileges[i];
                if (priv && visualIds.includes(priv.itemId)) {
                  const stateKey = priv.itemId.replace('item_', '').replace('companion_fairy', 'fairy');
                  if (priv.itemId === 'item_crown') {
                    s.hasCrown = true;
                    s.earnedCrown = true;
                  } else {
                    s.earned[stateKey] = true;
                  }
                  s.activePrivileges.splice(i, 1);
                  needsSave = true;
                }
              }
            }
          });
          if (needsSave) {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed)); } catch (err) {}
          }
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse localStorage, resetting to default:', e);
    }

    return this.getDefaultState();
  }

  forceSyncShopItems() {
    this.data.shopItems = JSON.parse(JSON.stringify(DINO_DATA.SHOP_ITEMS));
    this.save();
    return this.data.shopItems;
  }

  getDefaultState() {
    return {
      className: '三(1)班 恐龙精英班',
      students: JSON.parse(JSON.stringify(DINO_DATA.INITIAL_STUDENTS)),
      shopItems: JSON.parse(JSON.stringify(DINO_DATA.SHOP_ITEMS)),
      customTags: [],
      logs: [],
      classGoal: { title: '全班看大片/班会庆祝会', targetScore: 500 }
    };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
    // Auto-sync to Firebase Realtime Database
    if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.schedulePush === 'function') {
      window.firebaseSyncMgr.schedulePush(this.data);
    }
  }

  resetToDefault() {
    this.data = this.getDefaultState();
    this.save();
  }

  // Security Helper: HTML Entity Escaping against XSS attacks
  escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Student CRUD operations
  getStudents() {
    return this.data.students;
  }

  getStudentById(id) {
    return this.data.students.find(s => s.id === id);
  }

  addStudent(name, speciesKey = 'rex') {
    const cleanName = this.escapeHTML(name.trim());
    if (!cleanName) return null;

    const newStudent = {
      id: 's_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: cleanName,
      speciesKey: speciesKey,
      score: 0,
      hasCrown: false,
      titleBadge: '',
      isSpotlight: false,
      activePrivileges: [],
      history: []
    };
    this.data.students.push(newStudent);
    this.save();
    return newStudent;
  }

  updateStudentScore(studentId, delta, reasonTagText = '手动调整') {
    const student = this.getStudentById(studentId);
    if (!student) return null;

    const oldScore = student.score;
    const oldStage = getStageByScore(oldScore);

    student.score = Math.max(0, student.score + delta); // minimum score is 0
    const newStage = getStageByScore(student.score);

    // Record history log
    const logItem = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      studentId: student.id,
      studentName: student.name,
      delta: delta,
      reason: reasonTagText,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    student.history.unshift(logItem);
    if (student.history.length > 30) student.history.length = 30;

    this.data.logs.unshift(logItem);
    if (this.data.logs.length > 200) this.data.logs.length = 200;

    this.save();

    return {
      student,
      oldScore,
      newScore: student.score,
      oldStage,
      newStage,
      hatched: oldStage.key === 'egg' && newStage.key !== 'egg',
      leveledUp: newStage.key !== oldStage.key && delta > 0
    };
  }

  deleteStudent(id) {
    this.data.students = this.data.students.filter(s => s.id !== id);
    this.save();
  }

  // Clean up expired privileges
  cleanExpiredPrivileges() {
    const now = Date.now();
    let modified = false;

    this.data.students.forEach(student => {
      if (Array.isArray(student.activePrivileges)) {
        const initialCount = student.activePrivileges.length;
        student.activePrivileges = student.activePrivileges.filter(p => !p.expireTimestamp || p.expireTimestamp > now);
        if (student.activePrivileges.length !== initialCount) {
          modified = true;
        }
      }
    });

    if (modified) this.save();
  }

  addStudentPrivilege(studentId, item) {
    const student = this.getStudentById(studentId);
    if (!student) return;

    if (!Array.isArray(student.activePrivileges)) {
      student.activePrivileges = [];
    }

    const durationDays = item.durationDays || 0;
    const expireTimestamp = durationDays > 0 ? Date.now() + durationDays * 86400000 : 0;

    // Check if privilege already exists, update expiration
    const existing = student.activePrivileges.find(p => p.itemId === item.id);
    if (existing) {
      existing.expireTimestamp = expireTimestamp;
    } else {
      student.activePrivileges.push({
        itemId: item.id,
        title: item.title,
        icon: item.icon,
        expireTimestamp: expireTimestamp
      });
    }

    this.save();
  }

  removeStudentPrivilege(studentId, itemId) {
    const student = this.getStudentById(studentId);
    if (!student || !Array.isArray(student.activePrivileges)) return;
    student.activePrivileges = student.activePrivileges.filter(p => p.itemId !== itemId);
    this.save();
  }

  toggleStudentCrown(id, forceState = null) {
    const student = this.getStudentById(id);
    if (!student) return false;
    student.hasCrown = forceState !== null ? forceState : !student.hasCrown;
    this.save();
    return student.hasCrown;
  }

  // Export & Import Data Backup
  exportJSON() {
    if (typeof DINO_DATA !== 'undefined' && Array.isArray(DINO_DATA.SHOP_ITEMS)) {
      this.data.shopItems = JSON.parse(JSON.stringify(DINO_DATA.SHOP_ITEMS));
    }
    const jsonStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `恐龙班级数据备份_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.students)) {
        // Master Sync: ALWAYS enforce the complete, latest authoritative shop catalogue!
        if (typeof DINO_DATA !== 'undefined' && Array.isArray(DINO_DATA.SHOP_ITEMS)) {
          parsed.shopItems = JSON.parse(JSON.stringify(DINO_DATA.SHOP_ITEMS));
        }

        // Auto-heal imported students and migrate any legacy activePrivileges visual items
        parsed.students.forEach(s => {
          s.equipped = s.equipped || {};
          s.earned = s.earned || {};
          if (Array.isArray(s.history) && s.history.length > 50) {
            s.history = s.history.slice(0, 50);
          }
          if (Array.isArray(s.activePrivileges)) {
            const visualIds = ['item_lava_skin', 'item_frost_skin', 'item_angel_skin', 'item_unicorn_skin', 'item_chroma_gold', 'item_crown', 'item_sunglasses', 'item_grad_cap', 'item_cherry_blossom', 'item_magic_circle', 'item_lava_circle', 'item_cyber_circle', 'item_sakura_circle', 'item_companion_fairy', 'item_fireworks'];
            for (let i = s.activePrivileges.length - 1; i >= 0; i--) {
              const priv = s.activePrivileges[i];
              if (priv && visualIds.includes(priv.itemId)) {
                const stateKey = priv.itemId.replace('item_', '').replace('companion_fairy', 'fairy');
                if (priv.itemId === 'item_crown') {
                  s.hasCrown = true;
                  s.earnedCrown = true;
                } else {
                  s.earned[stateKey] = true;
                }
                s.activePrivileges.splice(i, 1);
              }
            }
          }
        });

        this.data = parsed;
        this.save();
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON file:', e);
    }
    return false;
  }
}

window.storageMgr = new StorageManager();
