/* ==========================================================================
   DinoClass (恐龙班级小帮手) - Storage & State Persistence Manager
   ========================================================================== */

const STORAGE_KEY = 'DINOCLASS_APP_DATA_V3';
const CLASSES_META_KEY = 'DINOCLASS_CLASSES_META_V1';
const ACTIVE_CLASS_ID_KEY = 'DINOCLASS_ACTIVE_CLASS_ID_V1';

class StorageManager {
  constructor() {
    this.currentClassId = localStorage.getItem(ACTIVE_CLASS_ID_KEY) || 'class_default';
    this.classesList = this.loadClassesList();
    this.data = this.loadData();
  }

  // 1. 多班级元数据管理
  loadClassesList() {
    try {
      const raw = localStorage.getItem(CLASSES_META_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    // 默认班级（无缝承接当前已有的一班数据）
    const initialList = [{ id: 'class_default', name: '三(1)班' }];
    this.saveClassesList(initialList);
    return initialList;
  }

  saveClassesList(list = null) {
    if (list) this.classesList = list;
    try {
      localStorage.setItem(CLASSES_META_KEY, JSON.stringify(this.classesList));
    } catch (e) {}
  }

  getActiveClassId() {
    return this.currentClassId || 'class_default';
  }

  getActiveClassName() {
    const found = this.classesList.find(c => c.id === this.currentClassId);
    return found ? found.name : (this.data?.className || '三(1)班');
  }

  getClassStorageKey(classId = null) {
    const id = classId || this.currentClassId || 'class_default';
    // class_default 严格使用原始 STORAGE_KEY，保障已有数据 100% 不受影响
    return id === 'class_default' ? STORAGE_KEY : `${STORAGE_KEY}_${id}`;
  }

  // 2. 班级数据加载与解析
  loadData(classId = null) {
    const targetKey = this.getClassStorageKey(classId);
    try {
      const raw = localStorage.getItem(targetKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof DINO_DATA !== 'undefined' && Array.isArray(DINO_DATA.SHOP_ITEMS)) {
          parsed.shopItems = JSON.parse(JSON.stringify(DINO_DATA.SHOP_ITEMS));
        }
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
            try { localStorage.setItem(targetKey, JSON.stringify(parsed)); } catch (err) {}
          }
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse localStorage for key:', targetKey, e);
    }

    return this.getDefaultState(this.getActiveClassName());
  }

  // 3. 极速切换班级
  switchClass(targetClassId) {
    if (!targetClassId || targetClassId === this.currentClassId) return this.data;
    
    // 先保存当前班级
    this.save();

    this.currentClassId = targetClassId;
    try {
      localStorage.setItem(ACTIVE_CLASS_ID_KEY, targetClassId);
    } catch (e) {}

    // 加载新班级数据
    this.data = this.loadData(targetClassId);

    // 联动 Firebase 切换房间监听
    if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.switchRoom === 'function') {
      window.firebaseSyncMgr.switchRoom(targetClassId);
    }

    return this.data;
  }

  // 4. 创建新班级
  createClass(className, withSample = false) {
    const cleanName = (className || '').trim();
    if (!cleanName) return null;

    const newId = 'class_' + Date.now();
    const newClassMeta = { id: newId, name: cleanName };
    this.classesList.push(newClassMeta);
    this.saveClassesList();

    // 初始化新班级数据
    const newClassState = this.getDefaultState(cleanName);
    if (!withSample) {
      newClassState.students = []; // 纯净空白班级
    }
    try {
      localStorage.setItem(this.getClassStorageKey(newId), JSON.stringify(newClassState));
    } catch (e) {}

    // 云端同步班级列表
    if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.syncClassesMeta === 'function') {
      window.firebaseSyncMgr.syncClassesMeta(this.classesList);
    }

    // 切换至新班级
    this.switchClass(newId);
    return newClassMeta;
  }

  // 5. 重命名班级
  renameClass(classId, newName) {
    const cleanName = (newName || '').trim();
    if (!cleanName) return false;

    const target = this.classesList.find(c => c.id === classId);
    if (!target) return false;

    target.name = cleanName;
    this.saveClassesList();

    if (classId === this.currentClassId) {
      this.data.className = cleanName;
      this.save();
    }

    if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.syncClassesMeta === 'function') {
      window.firebaseSyncMgr.syncClassesMeta(this.classesList);
    }
    return true;
  }

  // 6. 删除班级（至少保留 1 个班级）
  deleteClass(classId) {
    if (this.classesList.length <= 1) {
      alert('⚠️ 至少需要保留一个班级，无法删除最后一个班级！');
      return false;
    }

    this.classesList = this.classesList.filter(c => c.id !== classId);
    this.saveClassesList();

    try {
      localStorage.removeItem(this.getClassStorageKey(classId));
    } catch (e) {}

    // 云端同步班级列表
    if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.syncClassesMeta === 'function') {
      window.firebaseSyncMgr.syncClassesMeta(this.classesList);
    }

    // 若删除的是当前激活班级，自动回退到第一个班级
    if (classId === this.currentClassId) {
      this.switchClass(this.classesList[0].id);
    }
    return true;
  }

  // 7. 云端漫游合并远程班级列表
  mergeRemoteClassesList(remoteList) {
    if (!Array.isArray(remoteList) || remoteList.length === 0) return;
    let changed = false;
    remoteList.forEach(rc => {
      if (rc && rc.id && !this.classesList.some(lc => lc.id === rc.id)) {
        this.classesList.push(rc);
        changed = true;
      }
    });
    if (changed) {
      this.saveClassesList();
    }
  }

  forceSyncShopItems() {
    this.data.shopItems = JSON.parse(JSON.stringify(DINO_DATA.SHOP_ITEMS));
    this.save();
    return this.data.shopItems;
  }

  getDefaultState(className = '三(1)班') {
    return {
      className: className,
      students: JSON.parse(JSON.stringify(DINO_DATA.INITIAL_STUDENTS)),
      shopItems: JSON.parse(JSON.stringify(DINO_DATA.SHOP_ITEMS)),
      customTags: [],
      logs: [],
      classGoal: { title: '全班看大片/班会庆祝会', targetScore: 500 }
    };
  }

  save() {
    const key = this.getClassStorageKey(this.currentClassId);
    try {
      localStorage.setItem(key, JSON.stringify(this.data));
    } catch (e) {
      console.error('LocalStorage write failed for key:', key, e);
    }
    // Auto-sync to Firebase Realtime Database
    if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.schedulePush === 'function') {
      window.firebaseSyncMgr.schedulePush(this.data, this.currentClassId);
    }
  }

  resetToDefault() {
    this.data = this.getDefaultState(this.getActiveClassName());
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
