/* ==========================================================================
   DinoClass (恐龙班级小帮手) - Firebase 实时云端同步与多端联动核心模块
   ========================================================================== */

const FB_CONFIG_STORAGE_KEY = 'DINOCLASS_FIREBASE_CONFIG_V1';

// 🌟 班级专属内置 Firebase 实时云数据库配置（任何设备开机自连）
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBz-DRpDZ99JLK1W9sXBs9f0lhgECyLNL8",
  authDomain: "dinoclass-fe24a.firebaseapp.com",
  databaseURL: "https://dinoclass-fe24a-default-rtdb.firebaseio.com",
  projectId: "dinoclass-fe24a",
  storageBucket: "dinoclass-fe24a.firebasestorage.app",
  messagingSenderId: "231158299615",
  appId: "1:231158299615:web:f35bf608c308393442a26a"
};

class FirebaseSyncManager {
  constructor() {
    this.config = DEFAULT_FIREBASE_CONFIG;
    this.roomId = 'class_default';
    this.app = null;
    this.database = null;
    this.dataRef = null;
    this.connectedRef = null;
    
    this.status = 'unconfigured'; // 'unconfigured' | 'connecting' | 'connected' | 'syncing' | 'offline' | 'error'
    this.isRemoteUpdating = false;
    this.lastSyncTime = null;
    this.deviceId = 'dev_' + Math.random().toString(36).substr(2, 9);
    this.debounceTimer = null;

    this.init();
  }

  // 1. 初始化并检查 URL Hash 或本地配置
  init() {
    // 检查 URL Hash 中是否含有免密配置 (例如 #fb=BASE64_CONFIG)
    const hashConfig = this.parseHashConfig();
    if (hashConfig) {
      this.config = hashConfig.config;
      this.roomId = hashConfig.roomId || 'class_default';
      this.saveLocalConfig(this.config, this.roomId);
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (e) {}
    } else {
      // 从 LocalStorage 读取，若没有则默认自动使用内置的班级云数据库！
      const saved = this.loadLocalConfig();
      if (saved && saved.config) {
        this.config = saved.config;
        this.roomId = saved.roomId || 'class_default';
      } else {
        this.config = DEFAULT_FIREBASE_CONFIG;
        this.roomId = 'class_default';
        this.saveLocalConfig(this.config, this.roomId);
      }
    }

    // 若已有配置，且 Firebase SDK 已加载，自动连接
    if (this.config && typeof firebase !== 'undefined') {
      this.connect();
    } else {
      this.updateStatusUI();
    }
  }

  // 2. 从 URL 中解析 Hash 配置
  parseHashConfig() {
    try {
      const hash = window.location.hash || '';
      if (hash.includes('fb=')) {
        const match = hash.match(/fb=([^&]+)/);
        if (match && match[1]) {
          const jsonStr = decodeURIComponent(escape(atob(match[1])));
          const parsed = JSON.parse(jsonStr);
          if (parsed && parsed.config) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('[FirebaseSync] Failed to parse URL hash config:', e);
    }
    return null;
  }

  // 3. 智能解析用户粘贴的 Firebase 配置 (支持整段 JS 代码或纯 JSON)
  parseRawConfigInput(rawInput) {
    if (!rawInput || typeof rawInput !== 'string') return null;
    const str = rawInput.trim();

    // 尝试直接作为 JSON 解析
    try {
      const direct = JSON.parse(str);
      if (direct && direct.apiKey) return direct;
    } catch (e) {}

    // 智能正则提取各字段 (无论用户粘贴 const firebaseConfig = {...} 还是片段)
    const extractField = (key) => {
      const reg = new RegExp(`["']?${key}["']?\\s*:\\s*["']([^"']+)["']`, 'i');
      const m = str.match(reg);
      return m ? m[1].trim() : '';
    };

    const apiKey = extractField('apiKey');
    const authDomain = extractField('authDomain');
    const databaseURL = extractField('databaseURL');
    const projectId = extractField('projectId');
    const storageBucket = extractField('storageBucket');
    const messagingSenderId = extractField('messagingSenderId');
    const appId = extractField('appId');

    if (apiKey && (projectId || databaseURL)) {
      return {
        apiKey,
        authDomain: authDomain || `${projectId}.firebaseapp.com`,
        databaseURL: databaseURL || (projectId ? `https://${projectId}-default-rtdb.firebaseio.com` : ''),
        projectId,
        storageBucket,
        messagingSenderId,
        appId
      };
    }

    return null;
  }

  // 4. 保存配置到 LocalStorage
  saveLocalConfig(config, roomId) {
    try {
      localStorage.setItem(FB_CONFIG_STORAGE_KEY, JSON.stringify({
        config: config,
        roomId: roomId || 'class_default'
      }));
    } catch (e) {}
  }

  loadLocalConfig() {
    try {
      const raw = localStorage.getItem(FB_CONFIG_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  clearConfig() {
    try {
      localStorage.removeItem(FB_CONFIG_STORAGE_KEY);
    } catch (e) {}
    this.disconnect();
    this.config = null;
    this.status = 'unconfigured';
    this.updateStatusUI();
  }

  // 5. 连接并开启实时监听
  connect(configOverride = null, roomIdOverride = null) {
    if (configOverride) this.config = configOverride;
    if (roomIdOverride) this.roomId = roomIdOverride;

    if (!this.config || typeof firebase === 'undefined') {
      this.status = 'unconfigured';
      this.updateStatusUI();
      return false;
    }

    try {
      this.status = 'connecting';
      this.updateStatusUI();

      // 初始化 Firebase App (单例模式)
      if (!firebase.apps || firebase.apps.length === 0) {
        this.app = firebase.initializeApp(this.config);
      } else {
        this.app = firebase.apps[0];
      }

      this.database = firebase.database();
      const safeRoomId = (this.roomId || 'class_default').replace(/[^a-zA-Z0-9_\u4e00-\u9fa5-]/g, '_');
      this.dataRef = this.database.ref(`dinoclass_rooms/${safeRoomId}`);

      // 监听连接健康状态 (.info/connected)
      this.connectedRef = this.database.ref('.info/connected');
      this.connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
          this.status = 'connected';
          console.log('[FirebaseSync] 🟢 Realtime Socket Connected!');
        } else {
          if (this.status !== 'connecting') {
            this.status = 'offline';
            console.log('[FirebaseSync] 🔴 Realtime Socket Disconnected / Offline');
          }
        }
        this.updateStatusUI();
      });

      // 核心：监听远程数据变动 (毫秒级双向长连接推送)
      this.dataRef.on('value', (snapshot) => {
        const payload = snapshot.val();
        if (!payload || !payload.data) {
          // 云端首次为空，自动将本地初始数据推上去
          console.log('[FirebaseSync] Remote is empty, seeding initial local data...');
          this.pushDataImmediately(window.storageMgr.data);
          return;
        }

        // 若是由本设备发出的广播，直接忽略（防回环死循环）
        if (payload.clientDevice === this.deviceId) {
          this.lastSyncTime = new Date(payload.updatedAt || Date.now());
          this.updateStatusUI();
          return;
        }

        // 收到来自手机端或其他设备的远程变动！
        console.log('[FirebaseSync] 📲 Remote update received from:', payload.clientDevice);
        this.isRemoteUpdating = true;
        try {
          const success = window.storageMgr.importJSON(JSON.stringify(payload.data));
          if (success) {
            this.lastSyncTime = new Date(payload.updatedAt || Date.now());
            // 通知前端主应用进行视觉重绘
            if (window.dinoApp && typeof window.dinoApp.onRemoteDataSynced === 'function') {
              window.dinoApp.onRemoteDataSynced(payload.data, payload);
            }
          }
        } catch (err) {
          console.error('[FirebaseSync] Failed to apply remote update:', err);
        } finally {
          this.isRemoteUpdating = false;
          this.updateStatusUI();
        }
      }, (error) => {
        console.error('[FirebaseSync] Listener error:', error);
        this.status = 'error';
        this.updateStatusUI(error.message);
      });

      this.saveLocalConfig(this.config, this.roomId);
      return true;
    } catch (e) {
      console.error('[FirebaseSync] Connection failed:', e);
      this.status = 'error';
      this.updateStatusUI(e.message);
      return false;
    }
  }

  // 6. 断开连接
  disconnect() {
    if (this.dataRef) {
      this.dataRef.off();
      this.dataRef = null;
    }
    if (this.connectedRef) {
      this.connectedRef.off();
      this.connectedRef = null;
    }
    this.status = 'unconfigured';
    this.updateStatusUI();
  }

  // 7. 本地数据变更时自动推送（防频闪去抖动，1 秒延迟）
  schedulePush(data) {
    if (!this.dataRef || this.isRemoteUpdating || this.status === 'unconfigured') return;

    this.status = 'syncing';
    this.updateStatusUI();

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.pushDataImmediately(data);
    }, 1000);
  }

  // 立即推送数据至 Firebase
  pushDataImmediately(data) {
    if (!this.dataRef) return Promise.reject(new Error('未连接 Firebase'));

    const payload = {
      data: data,
      updatedAt: Date.now(),
      clientDevice: this.deviceId
    };

    this.status = 'syncing';
    this.updateStatusUI();

    return this.dataRef.set(payload)
      .then(() => {
        this.status = 'connected';
        this.lastSyncTime = new Date();
        this.updateStatusUI();
        console.log('[FirebaseSync] ✅ Data successfully pushed to cloud!');
      })
      .catch((err) => {
        console.error('[FirebaseSync] Push failed:', err);
        this.status = 'error';
        this.updateStatusUI(err.message);
        throw err;
      });
  }

  // 手动从云端强制拉取一次
  pullDataImmediately() {
    if (!this.dataRef) return Promise.reject(new Error('未连接 Firebase'));

    this.status = 'syncing';
    this.updateStatusUI();

    return this.dataRef.once('value').then((snapshot) => {
      const payload = snapshot.val();
      if (payload && payload.data) {
        this.isRemoteUpdating = true;
        window.storageMgr.importJSON(JSON.stringify(payload.data));
        if (window.dinoApp && typeof window.dinoApp.onRemoteDataSynced === 'function') {
          window.dinoApp.onRemoteDataSynced(payload.data, payload);
        }
        this.isRemoteUpdating = false;
        this.lastSyncTime = new Date(payload.updatedAt || Date.now());
        this.status = 'connected';
        this.updateStatusUI();
        return true;
      }
      this.status = 'connected';
      this.updateStatusUI();
      return false;
    });
  }

  // 8. 生成免密专属直连 URL (包含 Base64 编码的配置)
  generateDirectUrl() {
    if (!this.config) return window.location.href;
    const payload = {
      config: this.config,
      roomId: this.roomId || 'class_default'
    };
    const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#fb=${b64}`;
  }

  // 9. 下载「D盘一键启动网页（学校电脑防还原神器）」
  downloadLauncherHtml() {
    const directUrl = this.generateDirectUrl();
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>正在启动 DinoClass 恐龙魔法课堂...</title>
  <style>
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      text-align: center;
    }
    .card {
      background: rgba(30, 41, 59, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      padding: 40px;
      max-width: 480px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    h1 { font-size: 1.8rem; color: #f59e0b; margin-bottom: 12px; }
    p { font-size: 1.05rem; color: #94a3b8; line-height: 1.6; }
    .loader {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 4px solid rgba(245, 158, 11, 0.2);
      border-top-color: #f59e0b;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <div class="loader"></div>
    <h1>🦕 DinoClass 恐龙课堂启动中</h1>
    <p>正在连接 Firebase 云端数据库并恢复班级最新数据...</p>
    <p style="font-size:0.85rem; color:#64748b;">（提示：此文件放在学校 D 盘或 U 盘，不受电脑重启还原影响）</p>
  </div>
  <script>
    setTimeout(function() {
      window.location.replace(${JSON.stringify(directUrl)});
    }, 600);
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DinoClass_D盘极速启动器.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 10. 更新 UI 界面指示灯与按钮状态
  updateStatusUI(errorMsg = '') {
    const pillBtn = document.getElementById('btn-cloud-sync-pill');
    const modalStatus = document.getElementById('fb-modal-status-badge');
    const lastSyncElem = document.getElementById('fb-last-sync-time');

    let text = '☁️ Firebase: 未配置';
    let badgeClass = 'status-unconfigured';
    let badgeText = '⚪ 未配置';

    if (this.status === 'connected') {
      text = '🟢 实时云端联动中';
      badgeClass = 'status-connected';
      badgeText = '🟢 毫秒级实时已连接';
    } else if (this.status === 'syncing') {
      text = '🟡 正在同步云端...';
      badgeClass = 'status-syncing';
      badgeText = '🟡 正在双向同步...';
    } else if (this.status === 'connecting') {
      text = '⏳ 正在连接云端...';
      badgeClass = 'status-connecting';
      badgeText = '⏳ 正在建立长连接...';
    } else if (this.status === 'offline') {
      text = '🔴 网络离线';
      badgeClass = 'status-offline';
      badgeText = '🔴 网络断开 (本地可用)';
    } else if (this.status === 'error') {
      text = '⚠️ 云端同步异常';
      badgeClass = 'status-error';
      badgeText = '⚠️ ' + (errorMsg || '连接失败');
    }

    if (pillBtn) {
      pillBtn.innerHTML = `<span class="pulse-dot ${badgeClass}"></span> ${text}`;
      pillBtn.className = `btn btn-sm btn-cloud-pill ${badgeClass}`;
    }

    if (modalStatus) {
      modalStatus.className = `fb-status-badge ${badgeClass}`;
      modalStatus.innerText = badgeText;
    }

    if (lastSyncElem) {
      lastSyncElem.innerText = this.lastSyncTime 
        ? this.lastSyncTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
        : '尚未同步';
    }
  }
}

// 挂载至全局
window.firebaseSyncMgr = new FirebaseSyncManager();
