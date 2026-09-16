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
    return this.getClassNameById(this.currentClassId);
  }

  getClassNameById(classId) {
    const found = this.classesList.find(c => c.id === classId);
    return found ? found.name : (this.data?.className || '三(1)班');
  }

  getClassStorageKey(classId = null) {
    const id = classId || this.currentClassId || 'class_default';
    // class_default 严格使用原始 STORAGE_KEY，保障已有数据 100% 不受影响
    return id === 'class_default' ? STORAGE_KEY : `${STORAGE_KEY}_${id}`;
  }

  getClassStudentCount(classId) {
    if (classId === this.currentClassId && this.data && Array.isArray(this.data.students)) {
      return this.data.students.length;
    }
    const targetKey = this.getClassStorageKey(classId);
    try {
      const raw = localStorage.getItem(targetKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.students)) return parsed.students.length;
      }
    } catch(e) {}
    return 0;
  }

  getClassTotalScore(classId) {
    if (classId === this.currentClassId && this.data && Array.isArray(this.data.students)) {
      return this.data.students.reduce((acc, s) => acc + (s.score || 0), 0);
    }
    const targetKey = this.getClassStorageKey(classId);
    try {
      const raw = localStorage.getItem(targetKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.students)) {
          return parsed.students.reduce((acc, s) => acc + (s.score || 0), 0);
        }
      }
    } catch(e) {}
    return 0;
  }

  // 2. 班级数据加载与解析
  loadData(classId = null) {
    const effectiveClassId = classId || this.currentClassId || 'class_default';
    const targetKey = this.getClassStorageKey(effectiveClassId);
    try {
      const raw = localStorage.getItem(targetKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.classId = effectiveClassId;
        if (!parsed.className) {
          parsed.className = this.getClassNameById(effectiveClassId);
        }
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

    return this.getDefaultState(this.getClassNameById(effectiveClassId), effectiveClassId);
  }

  // 3. 极速切换班级 (严密隔离，防止数据交叉)
  switchClass(targetClassId) {
    if (!targetClassId || targetClassId === this.currentClassId) return this.data;
    
    // 1. 先保存当前班级，并取消当前班级任何尚未发出的延迟云端推送（严防把老班级数据推到新班级房间）
    const oldClassId = this.currentClassId;
    this.save();
    if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.flushPendingPush === 'function') {
      window.firebaseSyncMgr.flushPendingPush(oldClassId);
    }

    // 2. 切换当前激活班级
    this.currentClassId = targetClassId;
    try {
      localStorage.setItem(ACTIVE_CLASS_ID_KEY, targetClassId);
    } catch (e) {}

    // 3. 严格载入目标班级的独立本地数据
    this.data = this.loadData(targetClassId);

    // 4. 联动 Firebase 切换房间监听
    if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.switchRoom === 'function') {
      window.firebaseSyncMgr.switchRoom(targetClassId);
    }

    return this.data;
  }

  // 4. 创建新班级 (独立存储、独立云端房间)
  createClass(className, withSample = false) {
    const cleanName = (className || '').trim();
    if (!cleanName) return null;

    const newId = 'class_' + Date.now();
    const newClassMeta = { id: newId, name: cleanName };
    this.classesList.push(newClassMeta);
    this.saveClassesList();

    // 初始化新班级专属独立数据
    const newClassState = this.getDefaultState(cleanName, newId);
    if (!withSample) {
      newClassState.students = []; // 纯净空白班级
    }
    const targetKey = this.getClassStorageKey(newId);
    try {
      localStorage.setItem(targetKey, JSON.stringify(newClassState));
    } catch (e) {}

    // 立即向云端该班级的独立房间推送初始化状态
    if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.pushClassData === 'function') {
      window.firebaseSyncMgr.pushClassData(newId, newClassState);
    }

    // 云端同步班级列表目录
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
    } else {
      const key = this.getClassStorageKey(classId);
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.className = cleanName;
          localStorage.setItem(key, JSON.stringify(parsed));
          if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.pushClassData === 'function') {
            window.firebaseSyncMgr.pushClassData(classId, parsed);
          }
        }
      } catch(e) {}
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

  // 7. 独立清空/重置某一指定班级数据（不影响任何其他班级）
  resetClassData(classId, mode = 'empty') {
    if (!classId) return false;
    const name = this.getClassNameById(classId);
    const newState = this.getDefaultState(name, classId);
    if (mode === 'empty') {
      newState.students = [];
    } else {
      newState.students.forEach(s => {
        s.score = 0;
        s.hasCrown = false;
        s.earnedTitles = [];
        s.activePrivileges = [];
        s.history = [];
      });
    }
    newState.logs = [];

    const key = this.getClassStorageKey(classId);
    try {
      localStorage.setItem(key, JSON.stringify(newState));
    } catch(e) {}

    if (classId === this.currentClassId) {
      this.data = newState;
    }

    if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.pushClassData === 'function') {
      window.firebaseSyncMgr.pushClassData(classId, newState);
    }
    return true;
  }

  // 8. 云端漫游合并远程班级列表（实时同步新增班级与班级改名）
  mergeRemoteClassesList(remoteList) {
    if (!Array.isArray(remoteList) || remoteList.length === 0) return;
    let changed = false;
    remoteList.forEach(rc => {
      if (!rc || !rc.id) return;
      const existing = this.classesList.find(lc => lc.id === rc.id);
      if (existing) {
        // 如果云端修改了班级名称，立刻同步更新本地班级名称！
        if (rc.name && existing.name !== rc.name) {
          console.log(`[Storage] 🔄 Class name synced from cloud: [${existing.id}] ${existing.name} -> ${rc.name}`);
          existing.name = rc.name;
          changed = true;
          // 若恰好是当前正在显示的班级，同步更新内存中的名称
          if (existing.id === this.currentClassId && this.data) {
            this.data.className = rc.name;
          }
        }
      } else {
        // 发现云端新增的班级，加入本地列表
        this.classesList.push({ id: rc.id, name: rc.name || '未命名班级' });
        changed = true;
      }
    });
    if (changed) {
      this.saveClassesList();
      if (window.dinoApp && typeof window.dinoApp.renderClassSelector === 'function') {
        window.dinoApp.renderClassSelector();
      }
    }
  }

  // 9. 严格应用远程班级数据（绝对防串班、防覆盖）
  applyRemoteClassData(classId, remoteData) {
    if (!classId || !remoteData || !Array.isArray(remoteData.students)) return false;

    // 严格绑定班级身份
    remoteData.classId = classId;

    // 如果远程数据带有最新班级名称，同步更新本地班级元数据目录
    if (remoteData.className) {
      const foundInList = this.classesList.find(c => c.id === classId);
      if (foundInList && foundInList.name !== remoteData.className) {
        foundInList.name = remoteData.className;
        this.saveClassesList();
        if (window.dinoApp && typeof window.dinoApp.renderClassSelector === 'function') {
          window.dinoApp.renderClassSelector();
        }
      }
    } else {
      remoteData.className = this.getClassNameById(classId);
    }

    // 规范商城与记录上限
    if (typeof DINO_DATA !== 'undefined' && Array.isArray(DINO_DATA.SHOP_ITEMS)) {
      remoteData.shopItems = JSON.parse(JSON.stringify(DINO_DATA.SHOP_ITEMS));
    }
    if (Array.isArray(remoteData.logs) && remoteData.logs.length > 200) {
      remoteData.logs = remoteData.logs.slice(0, 200);
    }
    if (Array.isArray(remoteData.students)) {
      remoteData.students.forEach(s => {
        s.equipped = s.equipped || {};
        s.earned = s.earned || {};
        if (Array.isArray(s.history) && s.history.length > 30) {
          s.history = s.history.slice(0, 30);
        }
      });
    }

    // 1. 始终严格写入该班级专属的本地独立 LocalStorage 键中
    const key = this.getClassStorageKey(classId);
    try {
      localStorage.setItem(key, JSON.stringify(remoteData));
    } catch(e) {
      console.error('LocalStorage write failed for remote class:', key, e);
    }

    // 2. 只有当此班级正是当前屏幕激活显示的班级时，才更新活动内存并刷新页面渲染！
    if (classId === this.currentClassId) {
      this.data = remoteData;
      if (window.dinoApp) {
        if (typeof window.dinoApp.onRemoteDataSynced === 'function') {
          window.dinoApp.onRemoteDataSynced(remoteData);
        } else if (typeof window.dinoApp.renderAll === 'function') {
          window.dinoApp.renderAll();
        }
      }
    } else {
      console.log(`[Storage] Remote data for background class [${classId}] saved to isolated storage.`);
    }
    return true;
  }

  forceSyncShopItems() {
    this.data.shopItems = JSON.parse(JSON.stringify(DINO_DATA.SHOP_ITEMS));
    this.save();
    return this.data.shopItems;
  }

  getDefaultState(className = '三(1)班', classId = 'class_default') {
    return {
      classId: classId,
      className: className,
      students: JSON.parse(JSON.stringify(DINO_DATA.INITIAL_STUDENTS)),
      shopItems: JSON.parse(JSON.stringify(DINO_DATA.SHOP_ITEMS)),
      customTags: [],
      logs: [],
      classGoal: { title: '全班看大片/班会庆祝会', targetScore: 500 }
    };
  }

  save() {
    const classId = this.currentClassId || 'class_default';
    if (!this.data) return;
    this.data.classId = classId;
    this.data.className = this.getActiveClassName();

    const key = this.getClassStorageKey(classId);
    try {
      localStorage.setItem(key, JSON.stringify(this.data));
    } catch (e) {
      console.error('LocalStorage write failed for key:', key, e);
    }
    // 自动同步至云端对应独立房间（严格绑定 classId）
    if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.schedulePush === 'function') {
      window.firebaseSyncMgr.schedulePush(classId, this.data);
    }
  }

  resetToDefault() {
    this.data = this.getDefaultState(this.getActiveClassName(), this.getActiveClassId());
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
