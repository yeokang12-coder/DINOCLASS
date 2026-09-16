/* ===========================================================================
   DinoClass (恐龙班级小帮手) - Data, Species & Cute Chibi Dinosaur SVG Engine
   =========================================================================== */

const DINO_DATA = {
  STAGES: [
    { key: 'egg', name: '恐龙蛋', minScore: 0, maxScore: 30, icon: '🥚', badgeClass: 'egg', title: '孵化中' },
    { key: 'baby', name: '破壳幼龙', minScore: 31, maxScore: 150, icon: '🐣', badgeClass: 'baby', title: '萌龙初现' },
    { key: 'teen', name: '酷炫青年龙', minScore: 151, maxScore: 270, icon: '🦖', badgeClass: 'teen', title: '英姿飒爽' },
    { key: 'apex', name: '霸王战龙', minScore: 271, maxScore: 390, icon: '🔥', badgeClass: 'apex', title: '威震班级' },
    { key: 'legend', name: '传说圣龙', minScore: 391, maxScore: 500, icon: '👑', badgeClass: 'legend', title: '班级传奇' }
  ],

  SPECIES: {
    rex:     { name: '霸王龙',   trait: '烈焰暴龙王',   color: '#ff4757', secondaryColor: '#ff6b81', accent: '#ffa502' },
    tri:     { name: '三角龙',   trait: '雷霆巨角金刚', color: '#2ed573', secondaryColor: '#10b981', accent: '#ffa502' },
    ptero:   { name: '翼龙',     trait: '风暴天空霸主', color: '#1e90ff', secondaryColor: '#3742fa', accent: '#a29bfe' },
    brachio: { name: '腕龙',     trait: '泰坦星辰圣兽', color: '#ffa502', secondaryColor: '#f6b93b', accent: '#ff6348' },
    mythic:  { name: '幻彩圣龙', trait: '幻彩极光神龙', color: '#a55eea', secondaryColor: '#8854d0', accent: '#f1c40f' }
  },

  BEHAVIOR_TAGS: [
    { id: 'b1', text: '积极回答问题', score: 2, category: 'positive', icon: '🙋‍♂️' },
    { id: 'b2', text: '作业全优A+', score: 5, category: 'positive', icon: '📝' },
    { id: 'b3', text: '热心帮助同学', score: 3, category: 'positive', icon: '🤝' },
    { id: 'b4', text: '极速破蛋特赏', score: 10, category: 'positive', icon: '🥚' },
    { id: 'b5', text: '光盘行动/爱惜公物', score: 2, category: 'positive', icon: '🍱' },
    { id: 'b6', text: '打扫卫生积极', score: 3, category: 'positive', icon: '🧹' },
    { id: 'b7', text: '单元测试满分', score: 10, category: 'positive', icon: '💯' },
    { id: 'b8', text: '全勤无迟到', score: 2, category: 'positive', icon: '⏰' },
    { id: 'b10', text: '课堂走神/开小差', score: -2, category: 'negative', icon: '😴' },
    { id: 'b11', text: '未按时交作业', score: -3, category: 'negative', icon: '⚠️' },
    { id: 'b12', text: '课间追逐打闹', score: -2, category: 'negative', icon: '🚫' },
    { id: 'b13', text: '忘带课本工具', score: -1, category: 'negative', icon: '🎒' }
  ],

  SHOP_ITEMS: [
    // 🎟️ 1. 班级荣耀特权区 (Classroom Privileges)
    { id: 'item_leader',    title: '一日小班长卡',        desc: '体验担任一日班长，协助老师管理班级秩序',             cost: 30,  category: 'role', subCategory: 'privilege', icon: '👑', stock: 5,  durationDays: 1 },
    { id: 'item_seat',      title: '自选桌位一周卡',       desc: '经老师许可，与心仪同伴自主选择座位一周',             cost: 50,  category: 'role', subCategory: 'privilege', icon: '🪑', stock: 5,  durationDays: 7 },
    { id: 'item_duty_free', title: '免值日打扫一次卡',     desc: '免除一次班级日常值日卫生打扫工作',                   cost: 50,  category: 'role', subCategory: 'privilege', icon: '🧹', stock: 8,  durationDays: 1 },
    { id: 'item_helper',    title: '老师贴身小助手',       desc: '全天协助老师收发作业本与整理讲台',                   cost: 20,  category: 'role', subCategory: 'privilege', icon: '👩‍🏫', stock: 8, durationDays: 1 },
    { id: 'item_wall',      title: '电子光荣榜置顶卡',     desc: '恐龙照片在班级大屏及主页置顶特写展示一日',           cost: 30,  category: 'fun',  subCategory: 'privilege', icon: '🌟', stock: 5,  durationDays: 1 },

    // 🐲 2. 神兽终极皮肤馆 (Mythical Dinosaur Skins)
    { id: 'item_lava_skin',   title: '🌋 熔岩火龙皮肤',     desc: '基因重构为黑曜石暗红脉络皮肤，环绕动态上升爆发火山火花粒子', cost: 80, category: 'dino', subCategory: 'skin', icon: '🌋', stock: 99, durationDays: 0 },
    { id: 'item_frost_skin',  title: '❄️ 极寒冰龙皮肤',     desc: '基因重构为千年玄冰幽蓝霜雪皮肤，环绕晶莹冰棱碎屑与极寒冰霜雪花粒子', cost: 80, category: 'dino', subCategory: 'skin', icon: '❄️', stock: 99, durationDays: 0 },
    { id: 'item_angel_skin',  title: '👼 炽天大天使皮肤',   desc: '基因重构为纯白圣洁大天使皮肤，展开圣光羽翼并悬浮神圣天使光环', cost: 80, category: 'dino', subCategory: 'skin', icon: '👼', stock: 99, durationDays: 0 },
    { id: 'item_unicorn_skin',title: '🦄 梦幻独角兽皮肤',   desc: '基因重构为极光彩虹梦幻皮肤，额前挺立螺旋星芒独角与梦幻星屑', cost: 80, category: 'dino', subCategory: 'skin', icon: '🦄', stock: 99, durationDays: 0 },
    { id: 'item_chroma_gold', title: '🏆 耀世黄金龙皮肤',   desc: '改变恐龙基因，使其基础颜色变为璀璨的黄金色',         cost: 90, category: 'dino', subCategory: 'skin', icon: '🏆', stock: 99, durationDays: 0 },

    // 👑 3. 头饰与炫酷装扮区 (Headwear & Accessories)
    { id: 'item_crown',     title: '👑 超炫流光金冠框',     desc: '解锁并穿戴会闪烁流光粒子与炫酷光晕的金冠框',         cost: 50,  category: 'dino', subCategory: 'accessory', icon: '✨', stock: 99, durationDays: 0 },
    { id: 'item_sunglasses',title: '🕶️ 酷炫ThugLife墨镜',  desc: '给恐龙戴上一副黑超墨镜，瞬间化身班级小霸王',         cost: 30,  category: 'dino', subCategory: 'accessory', icon: '🕶️', stock: 99, durationDays: 0 },
    { id: 'item_grad_cap',    title: '🎓 学霸博士帽',       desc: '穿戴带金黄流苏的学术博士帽与圆框金丝眼镜，散发学霸智慧光晕', cost: 40, category: 'dino', subCategory: 'accessory', icon: '🎓', stock: 99, durationDays: 0 },
    { id: 'item_title',     title: '🏷️ 炫酷专属称号',     desc: '在恐龙卡面上挂上专属荣耀勋章',                       cost: 35,  category: 'dino', subCategory: 'accessory', icon: '🏷️', stock: 99, durationDays: 0 },

    // ✨ 4. 魔法光环与灵动特效 (Auras, Companions & FX)
    { id: 'item_cherry_blossom', title: '🌸 唯美樱花飘落特效', desc: '在恐龙周围环绕飘落粉色樱花瓣的浪漫特效',           cost: 50,  category: 'dino', subCategory: 'fx', icon: '🌸', stock: 99, durationDays: 0 },
    { id: 'item_magic_circle',  title: '🔯 星芒魔法阵底座',    desc: '在恐龙脚下召唤一个发光且缓慢旋转的星芒魔法阵底座',     cost: 50, category: 'dino', subCategory: 'fx', icon: '🔯', stock: 99, durationDays: 0 },
    { id: 'item_lava_circle',   title: '🌋 熔岩地狱裂纹阵',   desc: '召唤炽热岩浆裂纹法阵，大地龟裂、暗焰六芒符文涌动',   cost: 50, category: 'dino', subCategory: 'fx', icon: '🌋', stock: 99, durationDays: 0 },
    { id: 'item_cyber_circle',  title: '⚡ 量子赛博科技阵',   desc: '召唤六边形科技网格法阵，数字脉冲光弧高速扫描旋转',   cost: 50, category: 'dino', subCategory: 'fx', icon: '⚡', stock: 99, durationDays: 0 },
    { id: 'item_sakura_circle', title: '🌸 圣樱神道奉纳阵',   desc: '召唤和风樱花神道法阵，鸟居朱红光圈与金色神纹旋转',   cost: 50, category: 'dino', subCategory: 'fx', icon: '🌸', stock: 99, durationDays: 0 },
    { id: 'item_companion_fairy', title: '🧚 悬浮小仙子精灵', desc: '召唤一只发光的小仙子精灵在恐龙脑袋旁边悬浮飞舞',   cost: 50, category: 'dino', subCategory: 'fx', icon: '🧚', stock: 99, durationDays: 0 },
    { id: 'item_fireworks', title: '🎇 恐龙身后烟火特效',     desc: '恐龙卡片持续绽放绚丽彩色烟火粒子动画',               cost: 40,  category: 'dino', subCategory: 'fx', icon: '🎇', stock: 99, durationDays: 0 },
    { id: 'item_dialogue',  title: '💬 恐龙专属台词卡',       desc: '赋予恐龙一句专属台词，点击恐龙时气泡弹出',           cost: 30,  category: 'dino', subCategory: 'fx', icon: '💬', stock: 99, durationDays: 0 }
  ],

  PRESET_TITLES: [
    '学习小先锋', '答题战神', '纪律标兵', '班级之光',
    '破蛋先锋', '劳动小能手', '全勤达人', '热心助人星'
  ],

  MOOD_QUOTES: [
    '😋 想要加分小零食~',
    '😴 正在打盹中，别吵我',
    '🎵 听课最认真啦！',
    '⚡ 感觉自己充满力量！',
    '❤️ 小主人今天对我真好',
    '✨ 今天又是元气满满的一天',
    '🚀 我要加速进化啦！',
    '🙋‍♂️ 选我选我！积极回答问题！',
    '🥚 破壳倒计时，加油！',
    '👑 我是班级里最酷的恐龙！'
  ],

  INITIAL_STUDENTS: [
    { id: 's1',  name: '马力克',   speciesKey: 'rex',     score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's2',  name: '卓威洪',   speciesKey: 'tri',     score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's3',  name: '郑安琪',   speciesKey: 'ptero',   score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's4',  name: '黄宇恒',   speciesKey: 'brachio', score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's5',  name: '曾文泉',   speciesKey: 'mythic',  score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's6',  name: '石伟良',   speciesKey: 'rex',     score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's7',  name: '梁宇丞',   speciesKey: 'tri',     score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's8',  name: '林晨延',   speciesKey: 'ptero',   score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's9',  name: '卡威尼斯', speciesKey: 'brachio', score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's10', name: '许德权',   speciesKey: 'mythic',  score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's11', name: '连允希',   speciesKey: 'rex',     score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's12', name: '林嘉欣',   speciesKey: 'tri',     score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's13', name: '林芊妤',   speciesKey: 'ptero',   score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's14', name: '林微晴',   speciesKey: 'brachio', score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's15', name: '奈之米',   speciesKey: 'mythic',  score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's16', name: '凯尔哲',   speciesKey: 'rex',     score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's17', name: '齐亚',     speciesKey: 'tri',     score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's18', name: '阿曼达',   speciesKey: 'ptero',   score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's19', name: '王展宥',   speciesKey: 'brachio', score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's20', name: '阿里安',   speciesKey: 'mythic',  score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's21', name: '罗嘉嘉',   speciesKey: 'rex',     score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's22', name: '卓恩希',   speciesKey: 'tri',     score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's23', name: '姚子亮',   speciesKey: 'ptero',   score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] },
    { id: 's24', name: '杨浩仟',   speciesKey: 'brachio', score: 0, hasCrown: false, titleBadge: '', earnedTitles: [], isSpotlight: false, activePrivileges: [], history: [] }
  ]
};

function getStageByScore(score) {
  for (let i = DINO_DATA.STAGES.length - 1; i >= 0; i--) {
    if (score >= DINO_DATA.STAGES[i].minScore) return DINO_DATA.STAGES[i];
  }
  return DINO_DATA.STAGES[0];
}

function getNextStage(currentStageKey) {
  const idx = DINO_DATA.STAGES.findIndex(s => s.key === currentStageKey);
  if (idx !== -1 && idx < DINO_DATA.STAGES.length - 1) return DINO_DATA.STAGES[idx + 1];
  return null;
}

/* ===========================================================================
   CUTE CHIBI DINOSAUR SVG ENGINE
   每只恐龙都是可爱Q版正面视角，大眼睛、圆润身体、鲜明色彩
   =========================================================================== */
function generateDinoSVG(speciesKey, stageKey, equipped = {}) {
  try {
    const spec = DINO_DATA.SPECIES[speciesKey] || DINO_DATA.SPECIES.rex;

    let activeSkin = null;
    if (equipped.frostfire_skin) activeSkin = 'frostfire';
    else if (equipped.unicorn_skin) activeSkin = 'unicorn';
    else if (equipped.angel_skin) activeSkin = 'angel';
    else if (equipped.frost_skin) activeSkin = 'frost';
    else if (equipped.lava_skin) activeSkin = 'lava';
    else if (equipped.chroma_gold) activeSkin = 'gold';

    const isFrostFire = activeSkin === 'frostfire';
    const isUnicorn = activeSkin === 'unicorn';
    const isAngel = activeSkin === 'angel';
    const isFrost = activeSkin === 'frost';
    const isLava = activeSkin === 'lava';
    const isGold = activeSkin === 'gold';

    const c1 = isFrostFire ? '#ff4757' : (isUnicorn ? '#e9d5ff' : (isAngel ? '#e2e8f0' : (isFrost ? '#0284c7' : (isLava ? '#ff4757' : (isGold ? '#fec84d' : spec.color)))));
    const c2 = isFrostFire ? '#00d2ff' : (isUnicorn ? '#c084fc' : (isAngel ? '#94a3b8' : (isFrost ? '#00d2ff' : (isLava ? '#ff3300' : (isGold ? '#e69500' : spec.secondaryColor)))));
    const cA = isFrostFire ? '#fbbf24' : (isUnicorn ? '#38bdf8' : (isAngel ? '#f59e0b' : (isFrost ? '#a8f0ff' : (isLava ? '#ff9f43' : (isGold ? '#fffbeb' : spec.accent)))));
    const id = `d${speciesKey}${stageKey}${Math.floor(Math.random()*9999)}`;

    let effectsHtml = '';
    if (isFrostFire) {
      effectsHtml += `
        <div class="frostfire-skin-aura">
          <span class="frostfire-fire-particle" style="left:10%; bottom:12%; animation-delay:0s;">🔥</span>
          <span class="frostfire-ice-particle" style="right:10%; bottom:16%; animation-delay:0.7s;">❄️</span>
          <span class="frostfire-fire-particle" style="left:26%; bottom:28%; animation-delay:1.4s;">🌋</span>
          <span class="frostfire-ice-particle" style="right:24%; bottom:24%; animation-delay:0.3s;">🧊</span>
          <span class="frostfire-fire-particle" style="left:48%; bottom:8%; animation-delay:1.1s;">✨</span>
          <span class="frostfire-ice-particle" style="right:45%; bottom:28%; animation-delay:1.8s;">💠</span>
        </div>`;
    }
    if (isLava) {
      effectsHtml += `
        <div class="lava-skin-aura">
          <span class="lava-spark" style="left:15%; bottom:10%; animation-delay:0s;">🔥</span>
          <span class="lava-spark" style="right:15%; bottom:18%; animation-delay:0.8s;">✨</span>
          <span class="lava-spark" style="left:48%; bottom:12%; animation-delay:1.6s;">🔥</span>
          <span class="lava-spark" style="right:35%; bottom:25%; animation-delay:0.4s;">✨</span>
        </div>`;
    }
    if (isFrost) {
      effectsHtml += `
        <div class="frost-skin-aura">
          <span class="frost-spark" style="left:12%; bottom:10%; animation-delay:0s;">❄️</span>
          <span class="frost-spark" style="right:12%; bottom:18%; animation-delay:0.8s;">✨</span>
          <span class="frost-spark" style="left:48%; bottom:12%; animation-delay:1.6s;">💠</span>
          <span class="frost-spark" style="right:35%; bottom:25%; animation-delay:0.4s;">❄️</span>
          <span class="frost-spark" style="left:28%; bottom:28%; animation-delay:1.2s;">✧</span>
        </div>`;
    }
    if (isAngel) {
      effectsHtml += `
        <div class="angel-skin-aura">
          <span class="angel-spark" style="left:12%; bottom:15%; animation-delay:0s;">✦</span>
          <span class="angel-spark" style="right:12%; bottom:20%; animation-delay:0.7s;">✨</span>
          <span class="angel-spark" style="left:48%; bottom:8%; animation-delay:1.4s;">⭐</span>
          <span class="angel-spark" style="right:35%; bottom:26%; animation-delay:0.3s;">✦</span>
          <span class="angel-spark" style="left:25%; bottom:30%; animation-delay:1.0s;">✧</span>
          <span class="angel-spark" style="right:20%; bottom:10%; animation-delay:1.8s;">✨</span>
        </div>`;
    }
    if (isUnicorn) {
      effectsHtml += `
        <div class="unicorn-skin-aura">
          <span class="unicorn-spark" style="left:12%; bottom:12%; animation-delay:0s;">🌈</span>
          <span class="unicorn-spark" style="right:10%; bottom:22%; animation-delay:0.7s;">💖</span>
          <span class="unicorn-spark" style="left:48%; bottom:10%; animation-delay:1.5s;">⭐</span>
          <span class="unicorn-spark" style="right:32%; bottom:26%; animation-delay:0.3s;">✨</span>
          <span class="unicorn-spark" style="left:26%; bottom:28%; animation-delay:1.1s;">✧</span>
        </div>`;
    }
  if (equipped.grad_cap) {
    effectsHtml += `
      <div class="grad-wisdom-aura">
        <span class="wisdom-spark" style="left:10%; top:8%; animation-delay:0.2s;">✦</span>
        <span class="wisdom-spark" style="right:10%; top:12%; animation-delay:1.0s;">📚</span>
        <span class="wisdom-spark" style="left:50%; top:2%; animation-delay:1.8s;">✨</span>
      </div>`;
  }
  if (equipped.magic_circle) {
    effectsHtml += `
      <div class="starry-magic-circle-wrap">
        <svg class="starry-magic-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="starmagicgrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#7dd3fc"/>
              <stop offset="50%" stop-color="#fde047"/>
              <stop offset="100%" stop-color="#e879f9"/>
            </linearGradient>
            <radialGradient id="starglowcenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffd700" stop-opacity="0.6"/>
              <stop offset="40%" stop-color="#38bdf8" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="96" fill="url(#starglowcenter)"/>
          <!-- Outer Star Constellation Ring (Clockwise) -->
          <g class="starry-ring-spin-cw">
            <circle cx="100" cy="100" r="90" fill="none" stroke="url(#starmagicgrad)" stroke-width="2.5" stroke-dasharray="6,4" opacity="0.95"/>
            <circle cx="100" cy="100" r="76" fill="none" stroke="#7dd3fc" stroke-width="1.8" opacity="0.85"/>
            <!-- 8 Constellation Stars on Outer Ring -->
            <path d="M100,4 L104,15 L115,18 L104,21 L100,32 L96,21 L85,18 L96,15 Z" fill="#fff" stroke="#fde047" stroke-width="0.8" filter="drop-shadow(0 0 6px #ffd700)"/>
            <path d="M100,168 L104,179 L115,182 L104,185 L100,196 L96,185 L85,182 L96,179 Z" fill="#fff" stroke="#fde047" stroke-width="0.8" filter="drop-shadow(0 0 6px #ffd700)"/>
            <path d="M4,100 L15,104 L18,115 L21,104 L32,100 L21,96 L18,85 L15,96 Z" fill="#fff" stroke="#fde047" stroke-width="0.8" filter="drop-shadow(0 0 6px #ffd700)"/>
            <path d="M168,100 L179,104 L182,115 L185,104 L196,100 L185,96 L182,85 L179,96 Z" fill="#fff" stroke="#fde047" stroke-width="0.8" filter="drop-shadow(0 0 6px #ffd700)"/>
            <circle cx="34" cy="34" r="4" fill="#ffffff" filter="drop-shadow(0 0 6px #38bdf8)"/>
            <circle cx="166" cy="34" r="4" fill="#ffffff" filter="drop-shadow(0 0 6px #38bdf8)"/>
            <circle cx="34" cy="166" r="4" fill="#ffffff" filter="drop-shadow(0 0 6px #38bdf8)"/>
            <circle cx="166" cy="166" r="4" fill="#ffffff" filter="drop-shadow(0 0 6px #38bdf8)"/>
            <circle cx="100" cy="18" r="2.2" fill="#ffffff"/>
            <circle cx="100" cy="182" r="2.2" fill="#ffffff"/>
            <circle cx="18" cy="100" r="2.2" fill="#ffffff"/>
            <circle cx="182" cy="100" r="2.2" fill="#ffffff"/>
          </g>
          <!-- Inner Interlocking Double 8-Point Star Array (Counter-Clockwise) -->
          <g class="starry-ring-spin-ccw">
            <polygon points="100,32 148,148 22,72 178,72 52,148" fill="rgba(56,189,248,0.22)" stroke="#38bdf8" stroke-width="2.4" filter="drop-shadow(0 0 6px #38bdf8)"/>
            <polygon points="100,42 142,142 42,66 158,66 58,142" fill="rgba(250,204,21,0.2)" stroke="#facc15" stroke-width="2.4" transform="rotate(45,100,100)" filter="drop-shadow(0 0 6px #facc15)"/>
            <circle cx="100" cy="100" r="24" fill="none" stroke="#fff7ad" stroke-width="2" stroke-dasharray="4,2"/>
            <polygon points="100,80 105,95 120,100 105,105 100,120 95,105 80,100 95,95" fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 16px #ffd700)"/>
          </g>
        </svg>
        <span class="star-float-particle p1">✦</span>
        <span class="star-float-particle p2">✨</span>
        <span class="star-float-particle p3">★</span>
        <span class="star-float-particle p4">✧</span>
      </div>`;
  }
  // ── 🌋 LAVA CIRCLE ────────────────────────────────────────────────────────
  if (equipped.lava_circle) {
    const lid = `lava${Math.floor(Math.random()*9999)}`;
    effectsHtml += `
      <div class="lava-circle-wrap">
        <svg class="lava-circle-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="lavaGlow${lid}" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stop-color="#fbbf24" stop-opacity="0.7"/>
              <stop offset="45%"  stop-color="#ef4444" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#1a0808" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="lavaRingGrad${lid}" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stop-color="#ff3d00"/>
              <stop offset="50%"  stop-color="#fbbf24"/>
              <stop offset="100%" stop-color="#b91c1c"/>
            </linearGradient>
          </defs>
          <!-- Ambient glow -->
          <circle cx="100" cy="100" r="95" fill="url(#lavaGlow${lid})"/>
          <!-- Outer cracked ring (CW) -->
          <g class="lava-ring-spin-cw">
            <circle cx="100" cy="100" r="90" fill="none" stroke="url(#lavaRingGrad${lid})" stroke-width="3" stroke-dasharray="8,5" opacity="0.95"/>
            <!-- Crack lines radiating outward -->
            <line x1="100" y1="10"  x2="92"  y2="40"  stroke="#ff3d00" stroke-width="2.5" opacity="0.85"/>
            <line x1="100" y1="190" x2="108" y2="160" stroke="#ff3d00" stroke-width="2.5" opacity="0.85"/>
            <line x1="10"  y1="100" x2="40"  y2="92"  stroke="#ff3d00" stroke-width="2.5" opacity="0.85"/>
            <line x1="190" y1="100" x2="160" y2="108" stroke="#ff3d00" stroke-width="2.5" opacity="0.85"/>
            <line x1="29"  y1="29"  x2="52"  y2="52"  stroke="#fbbf24" stroke-width="2"   opacity="0.75"/>
            <line x1="171" y1="29"  x2="148" y2="52"  stroke="#fbbf24" stroke-width="2"   opacity="0.75"/>
            <line x1="29"  y1="171" x2="52"  y2="148" stroke="#fbbf24" stroke-width="2"   opacity="0.75"/>
            <line x1="171" y1="171" x2="148" y2="148" stroke="#fbbf24" stroke-width="2"   opacity="0.75"/>
            <!-- Lava bubble nodes on ring -->
            <circle cx="100" cy="10"  r="5" fill="#ff3d00" filter="drop-shadow(0 0 6px #fbbf24)"/>
            <circle cx="100" cy="190" r="5" fill="#ff3d00" filter="drop-shadow(0 0 6px #fbbf24)"/>
            <circle cx="10"  cy="100" r="5" fill="#ff3d00" filter="drop-shadow(0 0 6px #fbbf24)"/>
            <circle cx="190" cy="100" r="5" fill="#ff3d00" filter="drop-shadow(0 0 6px #fbbf24)"/>
          </g>
          <!-- Inner inverted triangle rune ring (CCW) -->
          <g class="lava-ring-spin-ccw">
            <circle cx="100" cy="100" r="68" fill="none" stroke="#b91c1c" stroke-width="1.8" stroke-dasharray="5,4" opacity="0.8"/>
            <!-- Inverted triangle rune -->
            <polygon points="100,46 148,136 52,136" fill="rgba(185,28,28,0.18)" stroke="#ef4444" stroke-width="2.5" filter="drop-shadow(0 0 8px #ff3d00)"/>
            <!-- Inner dark rune triangle -->
            <polygon points="100,154 52,64 148,64" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2" filter="drop-shadow(0 0 6px #fbbf24)"/>
            <!-- Center 6-point dark flame star -->
            <polygon points="100,76 107,94 125,94 111,106 116,124 100,114 84,124 89,106 75,94 93,94"
              fill="#fbbf24" filter="drop-shadow(0 0 10px #ff3d00) drop-shadow(0 0 20px #fbbf24)"/>
          </g>
        </svg>
        <span class="lava-float-particle lp1">🔥</span>
        <span class="lava-float-particle lp2">✦</span>
        <span class="lava-float-particle lp3">🌋</span>
        <span class="lava-float-particle lp4">✦</span>
      </div>`;
  }
  // ── ⚡ CYBER CIRCLE ────────────────────────────────────────────────────────
  if (equipped.cyber_circle) {
    const cid = `cyber${Math.floor(Math.random()*9999)}`;
    effectsHtml += `
      <div class="cyber-circle-wrap">
        <svg class="cyber-circle-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cyberGlow${cid}" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stop-color="#06b6d4" stop-opacity="0.6"/>
              <stop offset="50%"  stop-color="#6366f1" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#0c1128" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="cyberArcGrad${cid}" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stop-color="#0ea5e9"/>
              <stop offset="100%" stop-color="#6366f1"/>
            </linearGradient>
          </defs>
          <!-- Ambient glow -->
          <circle cx="100" cy="100" r="95" fill="url(#cyberGlow${cid})"/>
          <!-- Outer scan arc ring (CW fast) -->
          <g class="cyber-ring-spin-cw-fast">
            <circle cx="100" cy="100" r="90" fill="none" stroke="url(#cyberArcGrad${cid})" stroke-width="2.5" stroke-dasharray="30,15,10,15" opacity="0.95"/>
            <!-- Arc endpoint arrows -->
            <polygon points="100,5  106,18 94,18"  fill="#0ea5e9" filter="drop-shadow(0 0 5px #06b6d4)"/>
            <polygon points="100,195 94,182 106,182" fill="#0ea5e9" filter="drop-shadow(0 0 5px #06b6d4)"/>
            <polygon points="5,100  18,106  18,94"  fill="#6366f1" filter="drop-shadow(0 0 5px #6366f1)"/>
            <polygon points="195,100 182,94 182,106" fill="#6366f1" filter="drop-shadow(0 0 5px #6366f1)"/>
          </g>
          <!-- Middle hex grid ring (CCW) -->
          <g class="cyber-ring-spin-ccw">
            <circle cx="100" cy="100" r="72" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.7"/>
            <!-- Hexagonal grid lines -->
            <polygon points="100,32 148,62 148,122 100,152 52,122 52,62" fill="none" stroke="#0ea5e9" stroke-width="1.8" opacity="0.6" filter="drop-shadow(0 0 4px #06b6d4)"/>
            <polygon points="100,50 134,70 134,110 100,130 66,110 66,70"  fill="rgba(6,182,212,0.08)" stroke="#6366f1" stroke-width="1.5" opacity="0.7" filter="drop-shadow(0 0 4px #6366f1)"/>
          </g>
          <!-- Inner eye rune + core (CCW slow) -->
          <g class="cyber-ring-spin-ccw-slow">
            <!-- Eye shape -->
            <ellipse cx="100" cy="100" rx="26" ry="16" fill="none" stroke="#06b6d4" stroke-width="2" filter="drop-shadow(0 0 6px #06b6d4)"/>
            <!-- Diamond cross inside eye -->
            <polygon points="100,88 108,100 100,112 92,100"
              fill="#06b6d4" filter="drop-shadow(0 0 10px #0ea5e9) drop-shadow(0 0 20px #6366f1)"/>
          </g>
        </svg>
        <span class="cyber-float-particle cp1">⚡</span>
        <span class="cyber-float-particle cp2">💠</span>
        <span class="cyber-float-particle cp3">⚡</span>
        <span class="cyber-float-particle cp4">🔹</span>
      </div>`;
  }
  // ── 🌸 SAKURA CIRCLE ──────────────────────────────────────────────────────
  if (equipped.sakura_circle) {
    const sid = `sakura${Math.floor(Math.random()*9999)}`;
    effectsHtml += `
      <div class="sakura-circle-wrap">
        <svg class="sakura-circle-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sakuraGlow${sid}" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stop-color="#fdf2f8" stop-opacity="0.8"/>
              <stop offset="50%"  stop-color="#fda4af" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#fdf2f8" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="sakuraRingGrad${sid}" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stop-color="#f43f5e"/>
              <stop offset="50%"  stop-color="#fde68a"/>
              <stop offset="100%" stop-color="#f43f5e"/>
            </linearGradient>
          </defs>
          <!-- Ambient glow -->
          <circle cx="100" cy="100" r="95" fill="url(#sakuraGlow${sid})"/>
          <!-- Outer torii red ring (CW) -->
          <g class="sakura-ring-spin-cw">
            <circle cx="100" cy="100" r="90" fill="none" stroke="url(#sakuraRingGrad${sid})" stroke-width="3.5" opacity="0.9"/>
            <circle cx="100" cy="100" r="84" fill="none" stroke="#fde68a" stroke-width="1" opacity="0.6"/>
            <!-- 8 petal tips on outer ring -->
            <ellipse cx="100" cy="12"  rx="5" ry="8" fill="#f43f5e" transform="rotate(0,100,100)"   filter="drop-shadow(0 0 5px #fde68a)"/>
            <ellipse cx="100" cy="12"  rx="5" ry="8" fill="#f43f5e" transform="rotate(45,100,100)"  filter="drop-shadow(0 0 5px #fde68a)"/>
            <ellipse cx="100" cy="12"  rx="5" ry="8" fill="#f43f5e" transform="rotate(90,100,100)"  filter="drop-shadow(0 0 5px #fde68a)"/>
            <ellipse cx="100" cy="12"  rx="5" ry="8" fill="#f43f5e" transform="rotate(135,100,100)" filter="drop-shadow(0 0 5px #fde68a)"/>
            <ellipse cx="100" cy="12"  rx="5" ry="8" fill="#f43f5e" transform="rotate(180,100,100)" filter="drop-shadow(0 0 5px #fde68a)"/>
            <ellipse cx="100" cy="12"  rx="5" ry="8" fill="#f43f5e" transform="rotate(225,100,100)" filter="drop-shadow(0 0 5px #fde68a)"/>
            <ellipse cx="100" cy="12"  rx="5" ry="8" fill="#f43f5e" transform="rotate(270,100,100)" filter="drop-shadow(0 0 5px #fde68a)"/>
            <ellipse cx="100" cy="12"  rx="5" ry="8" fill="#f43f5e" transform="rotate(315,100,100)" filter="drop-shadow(0 0 5px #fde68a)"/>
          </g>
          <!-- Middle 8-fold octagonal shrine pattern (CCW) -->
          <g class="sakura-ring-spin-ccw">
            <circle cx="100" cy="100" r="65" fill="none" stroke="#fda4af" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.8"/>
            <!-- Octagon -->
            <polygon points="100,40 134,52 152,80 152,120 134,148 100,160 66,148 48,120 48,80 66,52"
              fill="rgba(244,63,94,0.08)" stroke="#f43f5e" stroke-width="2" filter="drop-shadow(0 0 6px #f43f5e)"/>
            <!-- Inner 4-petal shrine motif -->
            <ellipse cx="100" cy="70" rx="8" ry="14" fill="rgba(253,230,138,0.35)" stroke="#fde68a" stroke-width="1.2"/>
            <ellipse cx="100" cy="70" rx="8" ry="14" fill="rgba(253,230,138,0.35)" stroke="#fde68a" stroke-width="1.2" transform="rotate(90,100,100)"/>
            <ellipse cx="100" cy="70" rx="8" ry="14" fill="rgba(253,230,138,0.35)" stroke="#fde68a" stroke-width="1.2" transform="rotate(45,100,100)"/>
            <ellipse cx="100" cy="70" rx="8" ry="14" fill="rgba(253,230,138,0.35)" stroke="#fde68a" stroke-width="1.2" transform="rotate(135,100,100)"/>
          </g>
          <!-- Center sacred seal (slow CW) -->
          <g class="sakura-ring-spin-cw-slow">
            <circle cx="100" cy="100" r="22" fill="none" stroke="#fde68a" stroke-width="1.5" stroke-dasharray="3,2"/>
            <!-- Gold-white 4-fold symmetry star core -->
            <polygon points="100,80 105,95 120,100 105,105 100,120 95,105 80,100 95,95"
              fill="#fff" stroke="#fde68a" stroke-width="1" filter="drop-shadow(0 0 8px #fde68a) drop-shadow(0 0 18px #f43f5e)"/>
          </g>
        </svg>
        <span class="sakura-float-particle sp1">🌸</span>
        <span class="sakura-float-particle sp2">🍃</span>
        <span class="sakura-float-particle sp3">✨</span>
        <span class="sakura-float-particle sp4">🌸</span>
      </div>`;
  }
  if (equipped.cherry_blossom) {
    effectsHtml += `
      <div class="deluxe-cherry-wrap">
        <span class="cherry-petal-deluxe">🌸</span>
        <span class="cherry-petal-deluxe">🌸</span>
        <span class="cherry-petal-deluxe">🌸</span>
        <span class="cherry-petal-deluxe">🌸</span>
        <span class="cherry-petal-deluxe">🌸</span>
      </div>`;
  }
  if (equipped.fairy) {
    effectsHtml += `
      <div class="fairy-swarm-wrap">
        <div class="orbiting-fairy-sprite fairy-1" title="翡翠森林仙子">🧚</div>
        <div class="orbiting-fairy-sprite fairy-2" title="星光粉蝶仙子">🧚‍♀️</div>
        <div class="orbiting-fairy-sprite fairy-3" title="金辉暖阳仙子">🧚‍♂️</div>
        <span class="fairy-dust-spark fd1">✨</span>
        <span class="fairy-dust-spark fd2">✧</span>
        <span class="fairy-dust-spark fd3">✦</span>
      </div>`;
  }
  if (isGold) {
    const gid = `gold${Math.floor(Math.random()*9999)}`;
    effectsHtml += `
      <div class="gold-skin-aura">
        <svg class="gold-mandala-svg" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="goldAuraRadial${gid}" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fffbeb" stop-opacity="0.22"/>
              <stop offset="45%" stop-color="#fbbf24" stop-opacity="0.12"/>
              <stop offset="75%" stop-color="#f59e0b" stop-opacity="0.05"/>
              <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="goldRingGrad${gid}" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fff8e1"/>
              <stop offset="30%" stop-color="#ffd700"/>
              <stop offset="70%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#fffbeb"/>
            </linearGradient>
          </defs>
          <!-- Soft Ambient Golden Mist Behind Dino -->
          <circle cx="110" cy="110" r="105" fill="url(#goldAuraRadial${gid})"/>
          
          <!-- Outer Slender Sun Rays & Filigree Ring (Clockwise Slow Spin) -->
          <g class="gold-rays-spin-cw">
            <!-- 4 Cardinal Slender Rays -->
            <polygon points="110,14 113,26 110,32 107,26" fill="url(#goldRingGrad${gid})" opacity="0.85"/>
            <polygon points="110,206 113,194 110,188 107,194" fill="url(#goldRingGrad${gid})" opacity="0.85"/>
            <polygon points="14,110 26,113 32,110 26,107" fill="url(#goldRingGrad${gid})" opacity="0.85"/>
            <polygon points="206,110 194,113 188,110 194,107" fill="url(#goldRingGrad${gid})" opacity="0.85"/>
            <!-- 4 Diagonal Delicate Diamond Crystals -->
            <polygon points="42,42 49,54 52,52 54,49" fill="url(#goldRingGrad${gid})" opacity="0.8"/>
            <polygon points="178,42 166,49 168,52 171,54" fill="url(#goldRingGrad${gid})" opacity="0.8"/>
            <polygon points="42,178 54,171 52,168 49,166" fill="url(#goldRingGrad${gid})" opacity="0.8"/>
            <polygon points="178,178 171,166 168,168 166,171" fill="url(#goldRingGrad${gid})" opacity="0.8"/>
            <!-- Outer Filigree Ring (Radius 84px) -->
            <circle cx="110" cy="110" r="84" fill="none" stroke="url(#goldRingGrad${gid})" stroke-width="1.2" stroke-dasharray="6,3" opacity="0.8"/>
            <circle cx="110" cy="110" r="89" fill="none" stroke="#fff7ad" stroke-width="0.8" opacity="0.4"/>
            <!-- 8 Subtle Golden Star Nodes -->
            <circle cx="110" cy="26" r="2" fill="#ffffff" filter="drop-shadow(0 0 3px #ffd700)"/>
            <circle cx="110" cy="194" r="2" fill="#ffffff" filter="drop-shadow(0 0 3px #ffd700)"/>
            <circle cx="26" cy="110" r="2" fill="#ffffff" filter="drop-shadow(0 0 3px #ffd700)"/>
            <circle cx="194" cy="110" r="2" fill="#ffffff" filter="drop-shadow(0 0 3px #ffd700)"/>
            <circle cx="51" cy="51" r="1.6" fill="#ffffff" opacity="0.85"/>
            <circle cx="169" cy="51" r="1.6" fill="#ffffff" opacity="0.85"/>
            <circle cx="51" cy="169" r="1.6" fill="#ffffff" opacity="0.85"/>
            <circle cx="169" cy="169" r="1.6" fill="#ffffff" opacity="0.85"/>
          </g>

          <!-- Middle Concentric Sacred Geometry Ring (Counter-Clockwise Spin) -->
          <g class="gold-mandala-spin-ccw">
            <circle cx="110" cy="110" r="74" fill="none" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3,3" opacity="0.65"/>
            <!-- Radiating Mini Notches -->
            <polygon points="110,36 111.5,41 108.5,41" fill="#ffd700" opacity="0.8"/>
            <polygon points="110,184 111.5,179 108.5,179" fill="#ffd700" opacity="0.8"/>
            <polygon points="36,110 41,111.5 41,108.5" fill="#ffd700" opacity="0.8"/>
            <polygon points="184,110 179,111.5 179,108.5" fill="#ffd700" opacity="0.8"/>
            <!-- Inner Octagram Star Web -->
            <polygon points="110,54 124,96 166,110 124,124 110,166 96,124 54,110 96,96" fill="rgba(254,240,138,0.04)" stroke="#ffffff" stroke-width="0.8" opacity="0.5"/>
          </g>
        </svg>
        <span class="gold-particle" style="left:8%; bottom:14%; animation-delay:0s; font-size:0.85rem;">✨</span>
        <span class="gold-particle" style="right:8%; bottom:22%; animation-delay:0.9s; font-size:0.85rem;">✦</span>
        <span class="gold-particle" style="left:50%; top:-4px; animation-delay:1.8s; font-size:0.95rem;">✧</span>
      </div>`;
  }

  if (stageKey === 'apex') {
    effectsHtml += `
      <div class="apex-flame-left">🔥</div>
      <div class="apex-flame-right">🔥</div>`;
  }

  if (stageKey === 'legend') {
    effectsHtml += `
      <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:15;">
        <span class="gold-particle" style="left:8%; top:15%; animation-delay:0.2s;">✨</span>
        <span class="gold-particle" style="right:8%; top:20%; animation-delay:1.5s;">💫</span>
        <span class="gold-particle" style="left:50%; top:5%; animation-delay:0.8s;">✦</span>
      </div>`;
  }

  // 👼 Sacred Angel Halo (High-Elevation Floating Golden Ring)
  const drawAngelHalo = (cx, cy, rx = 18, ry = 5) => isAngel ? `
    <g class="dino-angel-halo" filter="drop-shadow(0 0 10px #ffd700) drop-shadow(0 0 18px #fff59d)">
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#ffd700" stroke-width="2.8"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="4,2"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx*0.88}" ry="${ry*0.75}" fill="rgba(255,249,196,0.35)"/>
      <polygon points="${cx-rx},${cy} ${cx-rx+2.5},${cy-1.5} ${cx-rx+5},${cy} ${cx-rx+2.5},${cy+1.5}" fill="#ffffff"/>
      <polygon points="${cx+rx},${cy} ${cx+rx-2.5},${cy-1.5} ${cx+rx-5},${cy} ${cx+rx-2.5},${cy+1.5}" fill="#ffffff"/>
    </g>` : '';

  // 🪽 Sacred Classical Feathered Angel Wings (Graceful 3-Tier Layered Wings)
  const drawAngelWings = (leftX, rightX, y, scale = 1) => isAngel ? `
    <g class="dino-angel-wings" filter="drop-shadow(0 0 10px rgba(255,255,255,0.95)) drop-shadow(0 0 16px rgba(245,158,11,0.45))">
      <!-- Left Classical Archangel Wing -->
      <g transform="translate(${leftX}, ${y}) scale(${scale})">
        <g class="angel-wing-anim-left" style="transform-origin: 0px 0px;">
          <!-- Soft Depth Shadow Silhouette -->
          <path d="M0,4 C-8,-20 -20,-50 -32,-62 C-38,-56 -30,-32 -18,-18 C-28,-28 -38,-24 -36,-14 C-32,0 -20,6 0,4 Z" fill="#94a3b8" opacity="0.6"/>
          <!-- Tier 1: Long Primary Flight Feather -->
          <path d="M0,0 C-6,-24 -18,-52 -30,-60 C-34,-54 -24,-32 -14,-16 C-8,-8 -3,-2 0,0 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.3"/>
          <!-- Tier 2: Middle Secondary Feather -->
          <path d="M-8,-10 C-18,-28 -30,-36 -34,-34 C-36,-26 -26,-14 -12,-4 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.3"/>
          <!-- Tier 3: Lower Base Covert Feather -->
          <path d="M-8,-2 C-18,-14 -28,-14 -28,-8 C-26,4 -14,6 0,2 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.3"/>
          <!-- Flowing Golden Wing Spine Along Upper Curve -->
          <path d="M0,2 C-6,-20 -16,-46 -28,-56" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" fill="none"/>
          <path d="M0,2 C-6,-20 -16,-46 -28,-56" stroke="#fef08a" stroke-width="1" stroke-linecap="round" fill="none"/>
          <circle cx="-28" cy="-56" r="1.8" fill="#ffffff" filter="drop-shadow(0 0 4px #ffd700)"/>
        </g>
      </g>
      <!-- Right Classical Archangel Wing (Mirrored) -->
      <g transform="translate(${rightX}, ${y}) scale(${-scale}, ${scale})">
        <g class="angel-wing-anim-right" style="transform-origin: 0px 0px;">
          <!-- Soft Depth Shadow Silhouette -->
          <path d="M0,4 C-8,-20 -20,-50 -32,-62 C-38,-56 -30,-32 -18,-18 C-28,-28 -38,-24 -36,-14 C-32,0 -20,6 0,4 Z" fill="#94a3b8" opacity="0.6"/>
          <!-- Tier 1: Long Primary Flight Feather -->
          <path d="M0,0 C-6,-24 -18,-52 -30,-60 C-34,-54 -24,-32 -14,-16 C-8,-8 -3,-2 0,0 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.3"/>
          <!-- Tier 2: Middle Secondary Feather -->
          <path d="M-8,-10 C-18,-28 -30,-36 -34,-34 C-36,-26 -26,-14 -12,-4 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.3"/>
          <!-- Tier 3: Lower Base Covert Feather -->
          <path d="M-8,-2 C-18,-14 -28,-14 -28,-8 C-26,4 -14,6 0,2 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.3"/>
          <!-- Flowing Golden Wing Spine Along Upper Curve -->
          <path d="M0,2 C-6,-20 -16,-46 -28,-56" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" fill="none"/>
          <path d="M0,2 C-6,-20 -16,-46 -28,-56" stroke="#fef08a" stroke-width="1" stroke-linecap="round" fill="none"/>
          <circle cx="-28" cy="-56" r="1.8" fill="#ffffff" filter="drop-shadow(0 0 4px #ffd700)"/>
        </g>
      </g>
    </g>` : '';

  // 🦄 Dreamy Rainbow Spiral Unicorn Horn (Magical Glowing Horn)
  const drawUnicornHorn = (cx, cy, height = 26, w = 8) => isUnicorn ? `
    <g transform="translate(${cx}, ${cy})">
      <g class="dino-unicorn-horn">
        <defs>
          <linearGradient id="unigrad${id}" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#ffd700"/>
            <stop offset="30%" stop-color="#fde047"/>
            <stop offset="65%" stop-color="#f472b6"/>
            <stop offset="100%" stop-color="#38bdf8"/>
          </linearGradient>
        </defs>
        <!-- Spiral Cone Horn with Golden Core and Rainbow Rim -->
        <polygon points="${-w/2},0 ${w/2},0 0,${-height}" fill="url(#unigrad${id})" stroke="#ffd700" stroke-width="1.5" filter="drop-shadow(0 0 10px #fde047) drop-shadow(0 0 16px #38bdf8)"/>
        <!-- Pure White Luminous Spiral Grooves -->
        <path d="M${-w/2+1},${-height*0.22} Q0,${-height*0.28} ${w/2-1.5},${-height*0.18}" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.95"/>
        <path d="M${-w/2+2.2},${-height*0.5} Q0,${-height*0.56} ${w/2-2.5},${-height*0.46}" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.95"/>
        <path d="M${-w/2+3.2},${-height*0.76} Q0,${-height*0.82} ${w/2-3.4},${-height*0.72}" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.95"/>
        <!-- Horn Tip Brilliant Diamond Star -->
        <polygon points="0,${-height-8} 2.5,${-height-2.5} 8,${-height} 2.5,${-height+2.5} 0,${-height+8} -2.5,${-height+2.5} -8,${-height} -2.5,${-height-2.5}" fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 16px #38bdf8)"/>
        <circle cx="0" cy="${-height}" r="2" fill="#ffd700"/>
      </g>
    </g>` : '';

  // 🎓 Graduation Cap + Scholar Spectacles
  const drawGradCap = (cx, cy) => equipped.grad_cap ? `
    <g transform="translate(${cx}, ${cy})">
      <!-- Mortarboard Top -->
      <polygon points="0,-22 26,-14 0,-6 -26,-14" fill="#0f172a" stroke="#ffd700" stroke-width="1.8"/>
      <!-- Cap Base -->
      <path d="M-14,-13 Q0,-6 14,-13 L12,-6 Q0,1 -12,-6 Z" fill="#1e293b"/>
      <!-- Gold Center Button -->
      <circle cx="0" cy="-14" r="2.5" fill="#ffd700"/>
      <!-- Golden Swaying Tassel -->
      <path d="M0,-14 Q16,-10 20,4" stroke="#f1c40f" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="20" cy="5" r="2.2" fill="#f1c40f"/>
      
      <!-- 👓 Scholar Spectacles (Gold Wire Glasses) -->
      ${!equipped.sunglasses ? `
      <circle cx="-12" cy="14" r="7.5" fill="none" stroke="#ffd700" stroke-width="2"/>
      <circle cx="-12" cy="14" r="6" fill="rgba(255,255,255,0.2)"/>
      <circle cx="12" cy="14" r="7.5" fill="none" stroke="#ffd700" stroke-width="2"/>
      <circle cx="12" cy="14" r="6" fill="rgba(255,255,255,0.2)"/>
      <path d="M-4.5,13 Q0,10 4.5,13" stroke="#ffd700" stroke-width="2" fill="none"/>
      <line x1="-15" y1="11" x2="-9" y2="11" stroke="#fff" stroke-width="1.5" opacity="0.85" stroke-linecap="round"/>
      <line x1="9" y1="11" x2="15" y2="11" stroke="#fff" stroke-width="1.5" opacity="0.85" stroke-linecap="round"/>
      ` : ''}
    </g>` : '';

  // 🕶️ Cyber Neon Glare Sunglasses (High-Tech Holographic Shaded Glasses)
  const drawSunglasses = (cx, cy, w, h) => equipped.sunglasses ? `
    <g transform="translate(${cx}, ${cy})">
      <defs>
        <linearGradient id="sgGrad${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#00d2ff"/>
          <stop offset="50%" stop-color="#70a1ff"/>
          <stop offset="100%" stop-color="#a855f7"/>
        </linearGradient>
      </defs>
      <path d="M${-w/2-3},${-h/2-2} Q0,${-h/2-6} ${w/2+3},${-h/2-2} L${w/2+1},${h/2+2} Q0,${h/2+5} ${-w/2-1},${h/2+2} Z" fill="#0f172a" stroke="#38bdf8" stroke-width="1.6" filter="drop-shadow(0 4px 10px rgba(0,210,255,0.4))"/>
      <path d="M${-w/2+1},${-h/2+1} L${-2},${-h/2+1} L${-4},${h/2-1} L${-w/2+4},${h/2-1} Z" fill="url(#sgGrad${id})" opacity="0.92"/>
      <path d="M${2},${-h/2+1} L${w/2-1},${-h/2+1} L${w/2-4},${h/2-1} L${4},${h/2-1} Z" fill="url(#sgGrad${id})" opacity="0.92"/>
      <line x1="${-w/2}" y1="${-h/2}" x2="${w/2}" y2="${-h/2}" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M${-w/2+4},${-h/2+3} L${-8},${-h/2+3}" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.95"/>
      <path d="M${-w/2+7},${-h/2+6} L${-12},${-h/2+6}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.75"/>
      <path d="M${6},${-h/2+3} L${w/2-6},${-h/2+3}" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.95"/>
      <path d="M${10},${-h/2+6} L${w/2-9},${-h/2+6}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.75"/>
    </g>` : '';

  // ── EGG (Front Facing) ──────────────────────────────────────────────────
  if (stageKey === 'egg') {
    const svg = `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" class="dino-svg-vivid dino-anim-wobble ${isGold ? 'gold-skin-aura' : ''}">
  <defs>
    <radialGradient id="eg${id}" cx="42%" cy="32%" r="70%">
      <stop offset="0%" stop-color="${isFrostFire ? '#fff5f5' : (isGold ? '#fff9db' : (isAngel ? '#ffffff' : (isUnicorn ? '#fff0f6' : (isLava ? '#ff9f43' : (isFrost ? '#e0f7fa' : '#fff9f0')))))}"/>
      <stop offset="${isAngel ? '40%' : '50%'}" stop-color="${isFrostFire ? '#ff4757' : (isGold ? '#fec84d' : (isAngel ? '#f1f5f9' : (isLava ? '#ff4757' : (isFrost ? '#38bdf8' : (isUnicorn ? '#f3e8ff' : c1)))))}"/>
      <stop offset="${isAngel ? '75%' : '85%'}" stop-color="${isFrostFire ? '#0284c7' : (isGold ? '#e69500' : (isAngel ? '#cbd5e1' : (isLava ? '#990000' : (isFrost ? '#0284c7' : (isUnicorn ? '#d8b4fe' : c2)))))}"/>
      ${isFrostFire ? `<stop offset="100%" stop-color="#082f49"/>` : (isAngel ? `<stop offset="100%" stop-color="#94a3b8"/>` : (isLava ? `<stop offset="100%" stop-color="#590000"/>` : (isFrost ? `<stop offset="100%" stop-color="#082f49"/>` : (isGold ? `<stop offset="100%" stop-color="#b45309"/>` : ''))))}
    </radialGradient>
  </defs>
  <ellipse cx="50" cy="98" rx="24" ry="5" fill="rgba(0,0,0,0.2)"/>
  ${drawAngelWings(28, 72, 66, 0.45)}
  <ellipse cx="50" cy="58" rx="30" ry="38" fill="url(#eg${id})" stroke="${isAngel ? '#cbd5e1' : 'none'}" stroke-width="1.2"/>
  ${drawUnicornHorn(50, 24, 18, 6)}
  <!-- Front Crack -->
  ${isFrostFire ? `
    <polyline points="38,36 44,44 38,52 46,56" stroke="#ff4500" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="drop-shadow(0 0 4px #ff3300)"/>
    <polyline points="54,34 58,42 62,48 54,58" stroke="#00d2ff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="drop-shadow(0 0 4px #00b4d8)"/>
  ` : `
    <polyline class="egg-crack-line" points="38,36 44,44 38,52 50,56 46,64" stroke="${isLava ? '#ff4500' : (isFrost ? '#00d2ff' : (isAngel ? '#f59e0b' : (isUnicorn ? '#f472b6' : '#f59e0b')))}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${isLava ? `<polyline points="38,36 44,44 38,52 50,56 46,64" stroke="#ff9900" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>` : (isFrost ? `<polyline points="38,36 44,44 38,52 50,56 46,64" stroke="#a8f0ff" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>` : (isAngel ? `<polyline points="38,36 44,44 38,52 50,56 46,64" stroke="#ffd700" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>` : (isUnicorn ? `<polyline points="38,36 44,44 38,52 50,56 46,64" stroke="#38bdf8" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>` : '')))}
  `}
  <!-- Symmetrical Peeking Eyes -->
  <g class="dino-part-eye">
    <ellipse cx="38" cy="48" rx="4.5" ry="5" fill="white"/>
    <ellipse cx="38" cy="48" rx="3" ry="3.5" fill="${isFrostFire ? '#ff3d00' : '#1a1a2e'}"/>
    <circle cx="39.2" cy="46.8" r="1" fill="white"/>

    <ellipse cx="62" cy="48" rx="4.5" ry="5" fill="white"/>
    <ellipse cx="62" cy="48" rx="3" ry="3.5" fill="${isFrostFire ? '#00d2ff' : '#1a1a2e'}"/>
    <circle cx="63.2" cy="46.8" r="1" fill="white"/>
  </g>
  ${drawAngelHalo(50, 10, 16, 4.5)}
  ${drawSunglasses(50, 48, 36, 10)}
  ${drawGradCap(50, 32)}
  <text x="50" y="106" font-size="8" text-anchor="middle" fill="${isFrostFire ? '#ff4757' : (isAngel ? '#d97706' : c1)}" font-weight="bold">30分破壳!</text>
</svg>`;
    return effectsHtml + svg;
  }

  // ── BABY (Front Facing Symmetrical) ─────────────────────────────────────
  if (stageKey === 'baby') {
    const svg = `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" class="dino-svg-vivid dino-anim-bounce ${isGold ? 'gold-skin-aura' : ''}">
  <defs>
    <radialGradient id="bk${id}" cx="42%" cy="26%" r="74%">
      <stop offset="0%" stop-color="${isFrostFire ? '#ff793f' : (isGold ? '#fff9db' : (isAngel ? '#ffffff' : (isUnicorn ? '#fff0f6' : (isLava ? '#ff9f43' : (isFrost ? '#e0f7fa' : c1)))))}"/>
      <stop offset="${isAngel ? '40%' : '50%'}" stop-color="${isFrostFire ? '#ff4757' : (isGold ? '#fec84d' : (isAngel ? '#f1f5f9' : (isLava ? '#ff4757' : (isFrost ? '#38bdf8' : (isUnicorn ? '#f3e8ff' : c1)))))}"/>
      <stop offset="${isAngel ? '75%' : '85%'}" stop-color="${isFrostFire ? '#0284c7' : (isGold ? '#e69500' : (isAngel ? '#cbd5e1' : (isLava ? '#990000' : (isFrost ? '#0284c7' : (isUnicorn ? '#d8b4fe' : c2)))))}"/>
      ${isFrostFire ? `<stop offset="100%" stop-color="#082f49"/>` : (isAngel ? `<stop offset="100%" stop-color="#94a3b8"/>` : (isLava ? `<stop offset="100%" stop-color="#590000"/>` : (isFrost ? `<stop offset="100%" stop-color="#082f49"/>` : (isGold ? `<stop offset="100%" stop-color="#b45309"/>` : ''))))}
    </radialGradient>
  </defs>
  <ellipse cx="50" cy="100" rx="26" ry="5" fill="rgba(0,0,0,0.2)"/>
  <!-- Tail -->
  <g class="dino-part-tail">
    <path d="M26,78 Q12,72 8,62 Q18,60 28,70 Z" fill="url(#bk${id})"/>
  </g>
  ${drawAngelWings(28, 72, 68, 0.55)}
  <!-- Symmetrical Body -->
  <ellipse cx="50" cy="74" rx="26" ry="22" fill="url(#bk${id})" stroke="${isAngel ? '#94a3b8' : 'none'}" stroke-width="1"/>
  <ellipse cx="50" cy="78" rx="16" ry="14" fill="${isFrostFire ? 'rgba(254,240,138,0.5)' : (isAngel ? 'rgba(254,240,138,0.85)' : (isUnicorn ? 'rgba(254,249,195,0.5)' : (isGold ? 'rgba(255,251,235,0.7)' : 'rgba(255,255,255,0.4)')))}" stroke="${isAngel ? '#f59e0b' : 'none'}" stroke-width="${isAngel ? '1.2' : '0'}"/>
  <!-- Symmetrical Arms & Legs -->
  <ellipse cx="28" cy="74" rx="6" ry="5" fill="${isFrostFire ? '#ff4757' : (isAngel ? '#fef08a' : c2)}" stroke="${isAngel ? '#f59e0b' : 'none'}" stroke-width="${isAngel ? '0.8' : '0'}"/>
  <ellipse cx="72" cy="74" rx="6" ry="5" fill="${isFrostFire ? '#00d2ff' : (isAngel ? '#fef08a' : c2)}" stroke="${isAngel ? '#f59e0b' : 'none'}" stroke-width="${isAngel ? '0.8' : '0'}"/>
  <ellipse cx="38" cy="94" rx="8" ry="6" fill="${isFrostFire ? '#ff3300' : c2}"/>
  <ellipse cx="62" cy="94" rx="8" ry="6" fill="${isFrostFire ? '#0284c7' : c2}"/>
  <!-- Holy Angel Chest Cross Star -->
  ${isAngel ? `
    <g class="holy-breastplate">
      <path d="M50,72 L51.5,75.5 L55,77 L51.5,78.5 L50,82 L48.5,78.5 L45,77 L48.5,75.5 Z" fill="#ffd700" stroke="#ffffff" stroke-width="0.8" filter="drop-shadow(0 0 5px #f59e0b)"/>
      <circle cx="50" cy="77" r="1.5" fill="#ffffff"/>
    </g>` : ''}
  <!-- Flowing Veins for Lava / Frost / FrostFire / Unicorn Skin -->
  ${isFrostFire ? `
    <g class="frostfire-flowing-vein" fill="none" stroke-width="2" stroke-linecap="round">
      <path d="M34,68 Q42,74 48,70 M38,78 Q44,84 48,80" stroke="#ff4500"/>
      <path d="M30,36 Q40,30 48,34" stroke="#ff4500"/>
      <path d="M66,68 Q58,74 52,70 M62,78 Q56,84 52,80" stroke="#00d2ff"/>
      <path d="M70,36 Q60,30 52,34" stroke="#00d2ff"/>
    </g>` : (isLava ? `
    <g class="lava-flowing-vein" fill="none" stroke-width="2" stroke-linecap="round">
      <path d="M34,68 Q50,76 66,68 M38,78 Q50,86 62,78" />
      <path d="M30,36 Q50,28 70,36" />
    </g>` : (isFrost ? `
    <g class="frost-flowing-vein" fill="none" stroke-width="2" stroke-linecap="round">
      <path d="M34,68 Q50,76 66,68 M38,78 Q50,86 62,78" />
      <path d="M30,36 Q50,28 70,36" />
    </g>` : (isUnicorn ? `
    <g class="rainbow-flowing-vein" fill="none" stroke-width="2" stroke-linecap="round">
      <path d="M34,68 Q50,76 66,68 M38,78 Q50,86 62,78" />
      <path d="M30,36 Q50,28 70,36" />
    </g>` : '')))}
  <!-- Head Cast Shadow on Body -->
  ${isAngel ? `<ellipse cx="50" cy="62" rx="16" ry="3.5" fill="rgba(15,23,42,0.2)"/>` : ''}
  <!-- Big Front Head -->
  <ellipse cx="50" cy="42" rx="28" ry="26" fill="url(#bk${id})" stroke="${isAngel ? '#cbd5e1' : 'none'}" stroke-width="1.2"/>
  ${drawUnicornHorn(50, 18, 20, 6.5)}
  <!-- Soft Blushing Cheeks -->
  <ellipse cx="28" cy="44" rx="5" ry="3.5" fill="${isFrostFire ? 'rgba(255,80,60,0.45)' : (isAngel ? 'rgba(251,191,36,0.35)' : (isUnicorn ? 'rgba(244,114,182,0.45)' : (isGold ? 'rgba(251,146,60,0.28)' : 'rgba(255,100,100,0.3)')))}"/>
  <ellipse cx="72" cy="44" rx="5" ry="3.5" fill="${isFrostFire ? 'rgba(56,189,248,0.45)' : (isAngel ? 'rgba(251,191,36,0.35)' : (isUnicorn ? 'rgba(244,114,182,0.45)' : (isGold ? 'rgba(251,146,60,0.28)' : 'rgba(255,100,100,0.3)')))}"/>
  <!-- Symmetrical Front Eyes (Heterochromia on FrostFire) -->
  <g class="dino-part-eye">
    <ellipse cx="36" cy="38" rx="8" ry="9" fill="white"/>
    <ellipse cx="36" cy="38" rx="5.5" ry="6.5" fill="${isFrostFire ? '#ff4500' : '#1a1a2e'}"/>
    <circle cx="38" cy="35.5" r="2" fill="white"/>
    <circle cx="34.5" cy="40" r="1" fill="rgba(255,255,255,0.4)"/>

    <ellipse cx="64" cy="38" rx="8" ry="9" fill="white"/>
    <ellipse cx="64" cy="38" rx="5.5" ry="6.5" fill="${isFrostFire ? '#00d2ff' : '#1a1a2e'}"/>
    <circle cx="66" cy="35.5" r="2" fill="white"/>
    <circle cx="62.5" cy="40" r="1" fill="rgba(255,255,255,0.4)"/>
  </g>
  <!-- Subtle Mini Dragon Nostrils -->
  <ellipse cx="48" cy="46" rx="1" ry="1.2" fill="${isAngel ? 'rgba(217,119,6,0.35)' : (isUnicorn ? 'rgba(168,85,247,0.35)' : 'rgba(0,0,0,0.22)')}"/>
  <ellipse cx="52" cy="46" rx="1" ry="1.2" fill="${isAngel ? 'rgba(217,119,6,0.35)' : (isUnicorn ? 'rgba(168,85,247,0.35)' : 'rgba(0,0,0,0.22)')}"/>
  ${drawAngelHalo(50, 6, 17, 5)}
  ${drawSunglasses(50, 38, 42, 14)}
  ${drawGradCap(50, 24)}
  <!-- Front Smile (NO FANGS on Angel) -->
  ${isFrostFire ? `
    <path d="M43,51 Q50,54 57,51" stroke="#fbbf24" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <polygon points="45,51 47,56 49,51" fill="#ffffff" stroke="#ff4500" stroke-width="0.7"/>
    <polygon points="51,51 53,56 55,51" fill="#ffffff" stroke="#00d2ff" stroke-width="0.7"/>
  ` : (isLava ? `
    <path d="M43,51 Q50,54 57,51" stroke="#ea580c" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <polygon points="45,51 47,56 49,51" fill="#ffffff" stroke="#ff5500" stroke-width="0.7"/>
    <polygon points="51,51 53,56 55,51" fill="#ffffff" stroke="#ff5500" stroke-width="0.7"/>
  ` : (isFrost ? `
    <path d="M43,51 Q50,54 57,51" stroke="#00d2ff" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <polygon points="45,51 47,56 49,51" fill="#ffffff" stroke="#00d2ff" stroke-width="0.7"/>
    <polygon points="51,51 53,56 55,51" fill="#ffffff" stroke="#00d2ff" stroke-width="0.7"/>
  ` : (isAngel ? `
    <path d="M44,51 Q50,55.5 56,51" stroke="#d97706" stroke-width="2" fill="none" stroke-linecap="round"/>
  ` : (isUnicorn ? `
    <path d="M44,51 Q50,55.5 56,51" stroke="#c084fc" stroke-width="2" fill="none" stroke-linecap="round"/>
  ` : `
    <path d="M44,51 Q50,56 56,51" stroke="rgba(0,0,0,0.45)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  `))))}
</svg>`;
    return effectsHtml + svg;
  }

  // ── TEEN (Front Facing Symmetrical) ─────────────────────────────────────
  if (stageKey === 'teen') {
    const svg = `<svg viewBox="0 0 110 120" xmlns="http://www.w3.org/2000/svg" class="dino-svg-vivid dino-anim-float ${isGold ? 'gold-skin-aura' : ''}">
  <defs>
    <radialGradient id="tk${id}" cx="42%" cy="26%" r="75%">
      <stop offset="0%" stop-color="${isFrostFire ? '#ff793f' : (isGold ? '#fff9db' : (isAngel ? '#ffffff' : (isUnicorn ? '#fff0f6' : (isLava ? '#ff9f43' : (isFrost ? '#e0f7fa' : c1)))))}"/>
      <stop offset="${isAngel ? '40%' : '50%'}" stop-color="${isFrostFire ? '#ff4757' : (isGold ? '#fec84d' : (isAngel ? '#f1f5f9' : (isLava ? '#ff4757' : (isFrost ? '#38bdf8' : (isUnicorn ? '#f3e8ff' : c1)))))}"/>
      <stop offset="${isAngel ? '75%' : '85%'}" stop-color="${isFrostFire ? '#0284c7' : (isGold ? '#e69500' : (isAngel ? '#cbd5e1' : (isLava ? '#990000' : (isFrost ? '#0284c7' : (isUnicorn ? '#d8b4fe' : c2)))))}"/>
      ${isFrostFire ? `<stop offset="100%" stop-color="#082f49"/>` : (isAngel ? `<stop offset="100%" stop-color="#94a3b8"/>` : (isLava ? `<stop offset="100%" stop-color="#590000"/>` : (isFrost ? `<stop offset="100%" stop-color="#082f49"/>` : (isGold ? `<stop offset="100%" stop-color="#b45309"/>` : ''))))}
    </radialGradient>
  </defs>
  <ellipse cx="55" cy="110" rx="32" ry="6" fill="rgba(0,0,0,0.22)"/>
  <!-- Tail -->
  <g class="dino-part-tail">
    <path d="M25,82 Q10,76 6,64 Q18,62 30,72 Z" fill="url(#tk${id})"/>
  </g>
  ${drawAngelWings(32, 78, 72, 0.8)}
  <!-- Spiked Shoulder Armor & Lean Taller Body -->
  <ellipse cx="55" cy="80" rx="28" ry="24" fill="url(#tk${id})" stroke="${isAngel ? '#94a3b8' : 'none'}" stroke-width="1.2"/>
  <ellipse cx="55" cy="84" rx="17" ry="16" fill="${isFrostFire ? 'rgba(254,240,138,0.5)' : (isAngel ? 'rgba(254,240,138,0.85)' : (isUnicorn ? 'rgba(254,249,195,0.45)' : (isGold ? 'rgba(255,251,235,0.7)' : 'rgba(255,255,255,0.35)')))}" stroke="${isAngel ? '#f59e0b' : 'none'}" stroke-width="${isAngel ? '1.2' : '0'}"/>
  <!-- Shoulder Spikes (Hidden on Angel to avoid piercing wings) -->
  ${!isAngel ? `
  <polygon points="22,70 12,60 25,64" fill="${isFrostFire ? '#ff4757' : c2}"/>
  <polygon points="88,70 98,60 85,64" fill="${isFrostFire ? '#00d2ff' : c2}"/>
  ` : ''}
  <!-- Arms & Legs -->
  <g class="dino-part-arm">
    <ellipse cx="30" cy="78" rx="8" ry="5" fill="${isFrostFire ? '#ff4757' : (isAngel ? '#fef08a' : c1)}" stroke="${isAngel ? '#f59e0b' : 'none'}" stroke-width="${isAngel ? '0.8' : '0'}"/>
    <ellipse cx="80" cy="78" rx="8" ry="5" fill="${isFrostFire ? '#00d2ff' : (isAngel ? '#fef08a' : c1)}" stroke="${isAngel ? '#f59e0b' : 'none'}" stroke-width="${isAngel ? '0.8' : '0'}"/>
  </g>
  <ellipse cx="42" cy="100" rx="9" ry="7" fill="${isFrostFire ? '#ff3300' : c2}"/>
  <ellipse cx="68" cy="100" rx="9" ry="7" fill="${isFrostFire ? '#0284c7' : c2}"/>
  <!-- Holy Angel Chest Cross Star -->
  ${isAngel ? `
    <g class="holy-breastplate">
      <path d="M55,79 L56.5,83 L61,84.5 L56.5,86 L55,90 L53.5,86 L49,84.5 L53.5,83 Z" fill="#ffd700" stroke="#ffffff" stroke-width="0.9" filter="drop-shadow(0 0 6px #f59e0b)"/>
      <circle cx="55" cy="84.5" r="1.8" fill="#ffffff"/>
    </g>` : ''}
  <!-- Flowing Veins for Lava / Frost / FrostFire / Unicorn Skin -->
  ${isFrostFire ? `
    <g class="frostfire-flowing-vein" fill="none" stroke-width="2.2" stroke-linecap="round">
      <path d="M42,68 Q48,74 52,70 M46,82 Q50,88 52,84" stroke="#ff4500"/>
      <path d="M38,26 Q46,20 52,24" stroke="#ff4500"/>
      <path d="M34,80 Q25,88 38,92" stroke="#ff4500"/>
      <path d="M68,68 Q62,74 58,70 M64,82 Q60,88 58,84" stroke="#00d2ff"/>
      <path d="M72,26 Q64,20 58,24" stroke="#00d2ff"/>
      <path d="M76,80 Q85,88 72,92" stroke="#00d2ff"/>
    </g>` : (isLava ? `
    <g class="lava-flowing-vein" fill="none" stroke-width="2.2" stroke-linecap="round">
      <path d="M42,68 Q55,78 68,68 M46,82 Q55,92 64,82" />
      <path d="M38,26 Q55,18 72,26" />
      <path d="M34,80 Q25,88 38,92 M76,80 Q85,88 72,92" />
    </g>` : (isFrost ? `
    <g class="frost-flowing-vein" fill="none" stroke-width="2.2" stroke-linecap="round">
      <path d="M42,68 Q55,78 68,68 M46,82 Q55,92 64,82" />
      <path d="M38,26 Q55,18 72,26" />
      <path d="M34,80 Q25,88 38,92 M76,80 Q85,88 72,92" />
    </g>` : (isUnicorn ? `
    <g class="rainbow-flowing-vein" fill="none" stroke-width="2.2" stroke-linecap="round">
      <path d="M42,68 Q55,78 68,68 M46,82 Q55,92 64,82" />
      <path d="M38,26 Q55,18 72,26" />
      <path d="M34,80 Q25,88 38,92 M76,80 Q85,88 72,92" />
    </g>` : '')))}
  <!-- Head Cast Shadow on Body -->
  <!-- Cool Taller Head -->
  <ellipse cx="55" cy="38" rx="30" ry="28" fill="url(#tk${id})" stroke="${isAngel ? '#cbd5e1' : 'none'}" stroke-width="1.2"/>
  <!-- Spikes Symmetrical (Center spike hidden on Unicorn to never obstruct horn) -->
  ${!isUnicorn ? `<path d="M55,10 L50,0 L60,0 Z" fill="${isFrostFire ? '#ffd700' : (isAngel ? '#f59e0b' : cA)}"/>` : ''}
  <path d="M42,14 L36,4 L46,10 Z" fill="${isFrostFire ? '#ff4500' : (isAngel ? '#f59e0b' : cA)}"/>
  <path d="M68,14 L74,4 L64,10 Z" fill="${isFrostFire ? '#00d2ff' : (isAngel ? '#f59e0b' : cA)}"/>
  ${drawUnicornHorn(55, 12, 24, 7)}
  <!-- Soft Blushing Cheeks -->
  <ellipse cx="32" cy="42" rx="6" ry="4" fill="${isFrostFire ? 'rgba(255,80,60,0.4)' : (isAngel ? 'rgba(251,191,36,0.3)' : (isUnicorn ? 'rgba(244,114,182,0.4)' : (isGold ? 'rgba(251,146,60,0.25)' : 'rgba(255,100,100,0.25)')))}"/>
  <ellipse cx="78" cy="42" rx="6" ry="4" fill="${isFrostFire ? 'rgba(56,189,248,0.4)' : (isAngel ? 'rgba(251,191,36,0.3)' : (isUnicorn ? 'rgba(244,114,182,0.4)' : (isGold ? 'rgba(251,146,60,0.25)' : 'rgba(255,100,100,0.25)')))}"/>
  <!-- Eyes Front (Heterochromia on FrostFire) -->
  <g class="dino-part-eye">
    <ellipse cx="41" cy="34" rx="9.5" ry="10" fill="white"/>
    <ellipse cx="41" cy="34" rx="7" ry="7.5" fill="${isFrostFire ? '#ff4500' : '#1a1a2e'}"/>
    <circle cx="43.5" cy="31.5" r="2.2" fill="white"/>
    <circle cx="39.5" cy="36" r="1.1" fill="rgba(255,255,255,0.4)"/>

    <ellipse cx="69" cy="34" rx="9.5" ry="10" fill="white"/>
    <ellipse cx="69" cy="34" rx="7" ry="7.5" fill="${isFrostFire ? '#00d2ff' : '#1a1a2e'}"/>
    <circle cx="71.5" cy="31.5" r="2.2" fill="white"/>
    <circle cx="67.5" cy="36" r="1.1" fill="rgba(255,255,255,0.4)"/>
  </g>
  <!-- Subtle Mini Nostrils -->
  <ellipse cx="52.5" cy="43.5" rx="1.2" ry="1.4" fill="${isAngel ? 'rgba(217,119,6,0.35)' : (isUnicorn ? 'rgba(168,85,247,0.35)' : 'rgba(0,0,0,0.22)')}"/>
  <ellipse cx="57.5" cy="43.5" rx="1.2" ry="1.4" fill="${isAngel ? 'rgba(217,119,6,0.35)' : (isUnicorn ? 'rgba(168,85,247,0.35)' : 'rgba(0,0,0,0.22)')}"/>
  ${drawAngelHalo(55, 0, 19, 5.5)}
  ${drawSunglasses(55, 34, 46, 15)}
  ${drawGradCap(55, 20)}
  <!-- Confident Teen Smirk (NO FANGS on Angel) -->
  ${isFrostFire ? `
    <path d="M46,49 Q55,53.5 64,49" stroke="#fbbf24" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <polygon points="48,49 50,55 52,49" fill="#ffffff" stroke="#ff4500" stroke-width="0.8"/>
    <polygon points="58,49 60,55 62,49" fill="#ffffff" stroke="#00d2ff" stroke-width="0.8"/>
  ` : (isLava ? `
    <path d="M46,49 Q55,53.5 64,49" stroke="#ea580c" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <polygon points="48,49 50,55 52,49" fill="#ffffff" stroke="#ff5500" stroke-width="0.8"/>
    <polygon points="58,49 60,55 62,49" fill="#ffffff" stroke="#ff5500" stroke-width="0.8"/>
  ` : (isFrost ? `
    <path d="M46,49 Q55,53.5 64,49" stroke="#00d2ff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <polygon points="48,49 50,55 52,49" fill="#ffffff" stroke="#00d2ff" stroke-width="0.8"/>
    <polygon points="58,49 60,55 62,49" fill="#ffffff" stroke="#00d2ff" stroke-width="0.8"/>
  ` : (isAngel ? `
    <path d="M46,49 Q55,54 64,49" stroke="#d97706" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  ` : (isUnicorn ? `
    <path d="M46,49 Q55,54 64,49" stroke="#c084fc" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <polygon points="48,49 50,54 52,49" fill="#ffffff" stroke="#f472b6" stroke-width="0.7"/>
    <polygon points="58,49 60,54 62,49" fill="#ffffff" stroke="#f472b6" stroke-width="0.7"/>
  ` : `
    <path d="M46,49 Q55,54.5 64,49" stroke="rgba(0,0,0,0.5)" stroke-width="2" fill="none" stroke-linecap="round"/>
    <polygon points="49,49 51,53.5 53,49" fill="#ffffff" stroke="rgba(0,0,0,0.3)" stroke-width="0.6"/>
    <polygon points="57,49 59,53.5 61,49" fill="#ffffff" stroke="rgba(0,0,0,0.3)" stroke-width="0.6"/>
  `))))}
</svg>`;
    return effectsHtml + svg;
  }

  // ── APEX (Front Facing Symmetrical) ─────────────────────────────────────
  if (stageKey === 'apex') {
    const svg = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="dino-svg-vivid dino-anim-pulse ${isGold ? 'gold-skin-aura' : ''}">
  <defs>
    <radialGradient id="ak${id}" cx="42%" cy="26%" r="76%">
      <stop offset="0%" stop-color="${isFrostFire ? '#ff793f' : (isGold ? '#fff9db' : (isAngel ? '#ffffff' : (isUnicorn ? '#fff0f6' : (isLava ? '#ff9f43' : (isFrost ? '#e0f7fa' : c1)))))}"/>
      <stop offset="${isAngel ? '40%' : '50%'}" stop-color="${isFrostFire ? '#ff4757' : (isGold ? '#fec84d' : (isAngel ? '#f1f5f9' : (isLava ? '#ff4757' : (isFrost ? '#38bdf8' : (isUnicorn ? '#f3e8ff' : c1)))))}"/>
      <stop offset="${isAngel ? '75%' : '85%'}" stop-color="${isFrostFire ? '#0284c7' : (isGold ? '#e69500' : (isAngel ? '#cbd5e1' : (isLava ? '#990000' : (isFrost ? '#0284c7' : (isUnicorn ? '#d8b4fe' : c2)))))}"/>
      ${isFrostFire ? `<stop offset="100%" stop-color="#082f49"/>` : (isAngel ? `<stop offset="100%" stop-color="#94a3b8"/>` : (isLava ? `<stop offset="100%" stop-color="#590000"/>` : (isFrost ? `<stop offset="100%" stop-color="#082f49"/>` : (isGold ? `<stop offset="100%" stop-color="#b45309"/>` : ''))))}
    </radialGradient>
  </defs>
  <ellipse cx="60" cy="112" rx="38" ry="6" fill="rgba(0,0,0,0.25)"/>
  ${drawAngelWings(36, 84, 70, 0.95)}
  <!-- Symmetrical Body -->
  <ellipse cx="60" cy="78" rx="32" ry="26" fill="url(#ak${id})" stroke="${isAngel ? '#94a3b8' : 'none'}" stroke-width="1.2"/>
  <ellipse cx="60" cy="82" rx="19" ry="17" fill="${isFrostFire ? 'rgba(254,240,138,0.55)' : (isAngel ? 'rgba(254,240,138,0.88)' : (isUnicorn ? 'rgba(254,249,195,0.48)' : (isGold ? 'rgba(255,251,235,0.7)' : 'rgba(255,220,180,0.4)')))}" stroke="${isAngel ? '#f59e0b' : 'none'}" stroke-width="${isAngel ? '1.4' : '0'}"/>
  <!-- Arms & Legs -->
  <ellipse cx="34" cy="76" rx="8" ry="6" fill="${isFrostFire ? '#ff4757' : (isAngel ? '#fef08a' : c1)}" stroke="${isAngel ? '#f59e0b' : 'none'}" stroke-width="${isAngel ? '0.8' : '0'}"/>
  <ellipse cx="86" cy="76" rx="8" ry="6" fill="${isFrostFire ? '#00d2ff' : (isAngel ? '#fef08a' : c1)}" stroke="${isAngel ? '#f59e0b' : 'none'}" stroke-width="${isAngel ? '0.8' : '0'}"/>
  <ellipse cx="46" cy="100" rx="10" ry="8" fill="${isFrostFire ? '#ff3300' : c2}"/>
  <ellipse cx="74" cy="100" rx="10" ry="8" fill="${isFrostFire ? '#0284c7' : c2}"/>
  <!-- Holy Angel Chest Cross Star -->
  ${isAngel ? `
    <g class="holy-breastplate">
      <path d="M60,75 L61.8,80 L67,81.5 L61.8,83 L60,88 L58.2,83 L53,81.5 L58.2,80 Z" fill="#ffd700" stroke="#ffffff" stroke-width="1" filter="drop-shadow(0 0 7px #f59e0b)"/>
      <circle cx="60" cy="81.5" r="2" fill="#ffffff"/>
    </g>` : ''}
  <!-- Flowing Veins for Lava / Frost / FrostFire / Unicorn Skin -->
  ${isFrostFire ? `
    <g class="frostfire-flowing-vein" fill="none" stroke-width="2.2" stroke-linecap="round">
      <path d="M44,72 Q52,78 57,74 M48,88 Q54,93 57,90" stroke="#ff4500"/>
      <path d="M40,30 Q50,24 57,28" stroke="#ff4500"/>
      <path d="M32,80 Q22,90 36,96" stroke="#ff4500"/>
      <path d="M76,72 Q68,78 63,74 M72,88 Q66,93 63,90" stroke="#00d2ff"/>
      <path d="M80,30 Q70,24 63,28" stroke="#00d2ff"/>
      <path d="M88,80 Q98,90 84,96" stroke="#00d2ff"/>
    </g>` : (isLava ? `
    <g class="lava-flowing-vein" fill="none" stroke-width="2.2" stroke-linecap="round">
      <path d="M44,72 Q60,82 76,72 M48,88 Q60,96 72,88" />
      <path d="M40,30 Q60,22 80,30" />
      <path d="M32,80 Q22,90 36,96 M88,80 Q98,90 84,96" />
    </g>` : (isFrost ? `
    <g class="frost-flowing-vein" fill="none" stroke-width="2.2" stroke-linecap="round">
      <path d="M44,72 Q60,82 76,72 M48,88 Q60,96 72,88" />
      <path d="M40,30 Q60,22 80,30" />
      <path d="M32,80 Q22,90 36,96 M88,80 Q98,90 84,96" />
    </g>` : (isUnicorn ? `
    <g class="rainbow-flowing-vein" fill="none" stroke-width="2.2" stroke-linecap="round">
      <path d="M44,72 Q60,82 76,72 M48,88 Q60,96 72,88" />
      <path d="M40,30 Q60,22 80,30" />
      <path d="M32,80 Q22,90 36,96 M88,80 Q98,90 84,96" />
    </g>` : '')))}
  <!-- Big Front Head -->
  <ellipse cx="60" cy="38" rx="32" ry="28" fill="url(#ak${id})" stroke="${isAngel ? '#cbd5e1' : 'none'}" stroke-width="1.2"/>
  ${drawUnicornHorn(60, 10, 27, 8)}
  <!-- Symmetrical Spikes -->
  <polygon points="46,12 40,2 50,8" fill="${isFrostFire ? '#ff4500' : (isAngel ? '#f59e0b' : cA)}"/>
  <polygon points="74,12 80,2 70,8" fill="${isFrostFire ? '#00d2ff' : (isAngel ? '#f59e0b' : cA)}"/>
  <!-- Soft Blushing Cheeks -->
  <ellipse cx="36" cy="42" rx="7" ry="4.5" fill="${isFrostFire ? 'rgba(255,80,60,0.45)' : (isAngel ? 'rgba(251,191,36,0.35)' : (isUnicorn ? 'rgba(244,114,182,0.45)' : (isGold ? 'rgba(251,146,60,0.28)' : 'rgba(255,100,100,0.28)')))}"/>
  <ellipse cx="84" cy="42" rx="7" ry="4.5" fill="${isFrostFire ? 'rgba(56,189,248,0.45)' : (isAngel ? 'rgba(251,191,36,0.35)' : (isUnicorn ? 'rgba(244,114,182,0.45)' : (isGold ? 'rgba(251,146,60,0.28)' : 'rgba(255,100,100,0.28)')))}"/>
  <!-- Symmetrical Eyes (Heterochromia on FrostFire) -->
  <g class="dino-part-eye">
    <ellipse cx="44" cy="32" rx="9" ry="10" fill="white"/>
    <ellipse cx="44" cy="32" rx="6.5" ry="7" fill="${isFrostFire ? '#ff4500' : '#1a1a2e'}"/>
    <circle cx="46" cy="29.5" r="2" fill="white"/>
    <circle cx="42.5" cy="34" r="1" fill="rgba(255,255,255,0.4)"/>

    <ellipse cx="76" cy="32" rx="9" ry="10" fill="white"/>
    <ellipse cx="76" cy="32" rx="6.5" ry="7" fill="${isFrostFire ? '#00d2ff' : '#1a1a2e'}"/>
    <circle cx="78" cy="29.5" r="2" fill="white"/>
    <circle cx="74.5" cy="34" r="1" fill="rgba(255,255,255,0.4)"/>
  </g>
  <!-- Subtle Mini Nostrils -->
  <ellipse cx="57.5" cy="44.5" rx="1.3" ry="1.5" fill="${isAngel ? 'rgba(217,119,6,0.35)' : (isUnicorn ? 'rgba(168,85,247,0.35)' : 'rgba(0,0,0,0.25)')}"/>
  <ellipse cx="62.5" cy="44.5" rx="1.3" ry="1.5" fill="${isAngel ? 'rgba(217,119,6,0.35)' : (isUnicorn ? 'rgba(168,85,247,0.35)' : 'rgba(0,0,0,0.25)')}"/>
  ${drawAngelHalo(60, 0, 21, 6)}
  ${drawSunglasses(60, 32, 48, 16)}
  ${drawGradCap(60, 20)}
  <!-- Warrior Mouth & Smile (NO FANGS on Angel) -->
  ${isFrostFire ? `
    <path d="M49,50 Q60,54.5 71,50" stroke="#fbbf24" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <polygon points="52,50 54,57 56,50" fill="#ffffff" stroke="#ff4500" stroke-width="0.8"/>
    <polygon points="64,50 66,57 68,50" fill="#ffffff" stroke="#00d2ff" stroke-width="0.8"/>
  ` : (isLava ? `
    <path d="M49,50 Q60,54.5 71,50" stroke="#ea580c" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <polygon points="52,50 54,57 56,50" fill="#ffffff" stroke="#ff5500" stroke-width="0.8"/>
    <polygon points="64,50 66,57 68,50" fill="#ffffff" stroke="#ff5500" stroke-width="0.8"/>
  ` : (isFrost ? `
    <path d="M49,50 Q60,54.5 71,50" stroke="#00d2ff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <polygon points="52,50 54,57 56,50" fill="#ffffff" stroke="#00d2ff" stroke-width="0.8"/>
    <polygon points="64,50 66,57 68,50" fill="#ffffff" stroke="#00d2ff" stroke-width="0.8"/>
  ` : (isAngel ? `
    <path d="M49,50 Q60,55 71,50" stroke="#d97706" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  ` : (isUnicorn ? `
    <path d="M49,50 Q60,55 71,50" stroke="#c084fc" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <polygon points="52,50 54,56 56,50" fill="#ffffff" stroke="#f472b6" stroke-width="0.8"/>
    <polygon points="64,50 66,56 68,50" fill="#ffffff" stroke="#f472b6" stroke-width="0.8"/>
  ` : `
    <path d="M49,50 Q60,55 71,50" stroke="rgba(0,0,0,0.55)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <polygon points="52,50 54,55 56,50" fill="#ffffff" stroke="rgba(0,0,0,0.3)" stroke-width="0.7"/>
    <polygon points="64,50 66,55 68,50" fill="#ffffff" stroke="rgba(0,0,0,0.3)" stroke-width="0.7"/>
  `))))}
</svg>`;
    return effectsHtml + svg;
  }

  // ── LEGEND (Epic Majestic Chibi Dragon) ─────────────────────────────────
  const svg = `<svg viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg" class="dino-svg-vivid dino-anim-float ${isGold ? 'gold-skin-aura' : ''}">
  <defs>
    <radialGradient id="lk${id}" cx="42%" cy="24%" r="78%">
      <stop offset="0%" stop-color="${isFrostFire ? '#fff7ed' : (isGold ? '#fff9db' : (isAngel ? '#ffffff' : (isUnicorn ? '#fff0f6' : (isLava ? '#ff9f43' : (isFrost ? '#e0f7fa' : '#fff3a8')))))}"/>
      <stop offset="${isAngel ? '35%' : '35%'}" stop-color="${isFrostFire ? '#ff4757' : (isGold ? '#fec84d' : (isAngel ? '#f1f5f9' : (isLava ? '#ff4757' : (isFrost ? '#38bdf8' : cA))))}"/>
      <stop offset="${isAngel ? '75%' : '75%'}" stop-color="${isFrostFire ? '#0284c7' : (isGold ? '#e69500' : (isAngel ? '#cbd5e1' : (isLava ? '#990000' : (isFrost ? '#0284c7' : c1))))}"/>
      <stop offset="100%" stop-color="${isFrostFire ? '#082f49' : (isGold ? '#b45309' : (isAngel ? '#94a3b8' : (isLava ? '#590000' : (isFrost ? '#082f49' : c2))))}"/>
    </radialGradient>
    <linearGradient id="lwg${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${isAngel ? '#ffffff' : (isGold ? '#fff9db' : '#ffe066')}"/>
      <stop offset="50%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="lwgLava${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffa502"/>
      <stop offset="50%" stop-color="#ff4757"/>
      <stop offset="100%" stop-color="#990000"/>
    </linearGradient>
    <linearGradient id="lwgFrost${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e0f7fa"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <!-- Radiant Aura Backdrop -->
  <circle cx="65" cy="65" r="56" fill="url(#lk${id})" opacity="0.28"/>
  <ellipse cx="65" cy="120" rx="44" ry="7" fill="rgba(0,0,0,0.3)"/>
  <!-- Dragon / Pterodactyl Wings (Hidden if Angel Skin equipped to avoid double-wing overlap) -->
  ${!isAngel ? `
  <g class="dino-wing-left">
    <path d="M35,74 L6,34 L-4,28 L6,38 L-2,54 L14,58 L4,72 L26,72 Z" fill="${isFrostFire ? 'url(#lwgLava' + id + ')' : 'url(#lwg' + id + ')'}" stroke="${isFrostFire ? '#ff4500' : '#ffd700'}" stroke-width="1.8"/>
    <path d="M6,34 L-4,28 L6,38" stroke="${isFrostFire ? '#ffa502' : '#ffd700'}" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M35,74 L6,34 M20,62 L-2,54 M24,68 L4,72" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" fill="none"/>
  </g>
  <g class="dino-wing-right">
    <path d="M95,74 L124,34 L134,28 L124,38 L132,54 L116,58 L126,72 L104,72 Z" fill="${isFrostFire ? 'url(#lwgFrost' + id + ')' : 'url(#lwg' + id + ')'}" stroke="${isFrostFire ? '#00d2ff' : '#ffd700'}" stroke-width="1.8"/>
    <path d="M124,34 L134,28 L124,38" stroke="${isFrostFire ? '#7dd3fc' : '#ffd700'}" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M95,74 L124,34 M110,62 L132,54 M106,68 L126,72" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" fill="none"/>
  </g>
  ` : ''}
  ${drawAngelWings(36, 94, 76, 1.2)}
  <!-- Symmetrical Body -->
  <ellipse cx="65" cy="85" rx="35" ry="29" fill="url(#lk${id})" stroke="${isAngel ? '#94a3b8' : 'none'}" stroke-width="1.4"/>
  <ellipse cx="65" cy="89" rx="21" ry="19" fill="${isFrostFire ? 'rgba(254,240,138,0.6)' : (isAngel ? 'rgba(254,240,138,0.9)' : (isUnicorn ? 'rgba(254,249,195,0.5)' : (isGold ? 'rgba(255,251,235,0.7)' : 'rgba(255,255,255,0.5)')))}" stroke="${isAngel ? '#f59e0b' : 'none'}" stroke-width="${isAngel ? '1.5' : '0'}"/>
  <!-- Star Chest Gem -->
  <polygon points="65,74 68,81 75,84 68,87 65,94 62,87 55,84 62,81" fill="#ffd700" stroke="#fff" stroke-width="1.2" filter="drop-shadow(0 0 8px ${isFrostFire ? '#ff9f43' : '#ffd700'})"/>
  <!-- Arms & Legs -->
  <ellipse cx="38" cy="82" rx="9" ry="6.5" fill="${isFrostFire ? '#ff4757' : (isAngel ? '#fef08a' : c1)}" stroke="${isAngel ? '#f59e0b' : 'none'}" stroke-width="${isAngel ? '0.8' : '0'}"/>
  <ellipse cx="92" cy="82" rx="9" ry="6.5" fill="${isFrostFire ? '#00d2ff' : (isAngel ? '#fef08a' : c1)}" stroke="${isAngel ? '#f59e0b' : 'none'}" stroke-width="${isAngel ? '0.8' : '0'}"/>
  <ellipse cx="48" cy="108" rx="11" ry="8" fill="${isFrostFire ? '#ff3300' : c2}"/>
  <ellipse cx="82" cy="108" rx="11" ry="8" fill="${isFrostFire ? '#0284c7' : c2}"/>
  <!-- Flowing Veins for Lava / Frost / FrostFire / Unicorn Skin -->
  ${isFrostFire ? `
    <g class="frostfire-flowing-vein" fill="none" stroke-width="2.4" stroke-linecap="round">
      <path d="M46,78 Q56,84 62,80 M50,96 Q58,100 62,97" stroke="#ff4500"/>
      <path d="M42,36 Q54,30 62,34" stroke="#ff4500"/>
      <path d="M38,86 Q28,98 44,103" stroke="#ff4500"/>
      <path d="M84,78 Q74,84 68,80 M80,96 Q72,100 68,97" stroke="#00d2ff"/>
      <path d="M88,36 Q76,30 68,34" stroke="#00d2ff"/>
      <path d="M92,86 Q102,98 86,103" stroke="#00d2ff"/>
    </g>` : (isLava ? `
    <g class="lava-flowing-vein" fill="none" stroke-width="2.4" stroke-linecap="round">
      <path d="M46,78 Q65,90 84,78 M50,96 Q65,104 80,96" />
      <path d="M42,36 Q65,28 88,36" />
      <path d="M38,86 Q28,98 44,103 M92,86 Q102,98 86,103" />
    </g>` : (isFrost ? `
    <g class="frost-flowing-vein" fill="none" stroke-width="2.4" stroke-linecap="round">
      <path d="M46,78 Q65,90 84,78 M50,96 Q65,104 80,96" />
      <path d="M42,36 Q65,28 88,36" />
      <path d="M38,86 Q28,98 44,103 M92,86 Q102,98 86,103" />
    </g>` : (isUnicorn ? `
    <g class="rainbow-flowing-vein" fill="none" stroke-width="2.4" stroke-linecap="round">
      <path d="M46,78 Q65,90 84,78 M50,96 Q65,104 80,96" />
      <path d="M42,36 Q65,28 88,36" />
      <path d="M38,86 Q28,98 44,103 M92,86 Q102,98 86,103" />
    </g>` : '')))}
  <!-- Head Cast Shadow on Body -->
  ${isAngel ? `<ellipse cx="65" cy="67" rx="22" ry="5" fill="rgba(15,23,42,0.25)"/>` : ''}
  <!-- Noble Head -->
  <ellipse cx="65" cy="44" rx="35" ry="31" fill="url(#lk${id})" stroke="${isAngel ? '#cbd5e1' : 'none'}" stroke-width="1.4"/>
  <!-- Spinal Crest Spikes -->
  <polygon points="40,24 22,8 46,14" fill="${isFrostFire ? '#ff4500' : '#ffd700'}" stroke="${isFrostFire ? '#ff3300' : '#d97706'}" stroke-width="1.5"/>
  <polygon points="90,24 108,8 84,14" fill="${isFrostFire ? '#00d2ff' : '#ffd700'}" stroke="${isFrostFire ? '#0284c7' : '#d97706'}" stroke-width="1.5"/>
  ${!isUnicorn ? `<polygon points="65,2 57,16 73,16" fill="#ffe066" stroke="#ffd700" stroke-width="1.5"/>` : ''}
  <polygon points="52,10 45,20 58,18" fill="${isFrostFire ? '#ff4500' : (isAngel ? '#f59e0b' : cA)}"/>
  <polygon points="78,10 85,20 72,18" fill="${isFrostFire ? '#00d2ff' : (isAngel ? '#f59e0b' : cA)}"/>
  ${drawUnicornHorn(65, 4, 32, 9)}
  <!-- Soft Blushing Cheeks -->
  <ellipse cx="38" cy="46" rx="7" ry="5" fill="${isFrostFire ? 'rgba(255,80,60,0.45)' : (isAngel ? 'rgba(251,191,36,0.35)' : (isUnicorn ? 'rgba(244,114,182,0.45)' : (isGold ? 'rgba(251,146,60,0.28)' : 'rgba(255,100,100,0.28)')))}"/>
  <ellipse cx="92" cy="46" rx="7" ry="5" fill="${isFrostFire ? 'rgba(56,189,248,0.45)' : (isAngel ? 'rgba(251,191,36,0.35)' : (isUnicorn ? 'rgba(244,114,182,0.45)' : (isGold ? 'rgba(251,146,60,0.28)' : 'rgba(255,100,100,0.28)')))}"/>
  <!-- Symmetrical Cute Glossy Eyes (Heterochromia on FrostFire) -->
  <g class="dino-part-eye">
    <ellipse cx="48" cy="38" rx="10" ry="11" fill="white"/>
    <ellipse cx="48" cy="38" rx="7.5" ry="8" fill="${isFrostFire ? '#ff4500' : '#1a1a2e'}"/>
    <circle cx="50.5" cy="35.5" r="2.2" fill="white"/>
    <circle cx="46.5" cy="40" r="1.1" fill="rgba(255,255,255,0.4)"/>

    <ellipse cx="82" cy="38" rx="10" ry="11" fill="white"/>
    <ellipse cx="82" cy="38" rx="7.5" ry="8" fill="${isFrostFire ? '#00d2ff' : '#1a1a2e'}"/>
    <circle cx="84.5" cy="35.5" r="2.2" fill="white"/>
    <circle cx="80.5" cy="40" r="1.1" fill="rgba(255,255,255,0.4)"/>
  </g>
  <!-- Subtle Mini Nostrils -->
  <ellipse cx="62" cy="47.5" rx="1.3" ry="1.6" fill="${isAngel ? 'rgba(217,119,6,0.35)' : (isUnicorn ? 'rgba(168,85,247,0.35)' : 'rgba(0,0,0,0.25)')}"/>
  <ellipse cx="68" cy="47.5" rx="1.3" ry="1.6" fill="${isAngel ? 'rgba(217,119,6,0.35)' : (isUnicorn ? 'rgba(168,85,247,0.35)' : 'rgba(0,0,0,0.25)')}"/>
  ${drawAngelHalo(65, -10, 26, 7)}
  ${drawSunglasses(65, 38, 50, 16)}
  ${drawGradCap(65, 24)}
  <!-- Cute Regal Smile (NO FANGS on Angel) -->
  ${isFrostFire ? `
    <path d="M53,53 Q65,57.5 77,53" stroke="#fbbf24" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <polygon points="56,53 58,60 60,53" fill="#ffffff" stroke="#ff4500" stroke-width="0.9"/>
    <polygon points="70,53 72,60 74,53" fill="#ffffff" stroke="#00d2ff" stroke-width="0.9"/>
  ` : (isLava ? `
    <path d="M53,53 Q65,57.5 77,53" stroke="#ea580c" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <polygon points="56,53 58,60 60,53" fill="#ffffff" stroke="#ffd700" stroke-width="0.9"/>
    <polygon points="70,53 72,60 74,53" fill="#ffffff" stroke="#ffd700" stroke-width="0.9"/>
  ` : (isFrost ? `
    <path d="M53,53 Q65,57.5 77,53" stroke="#00d2ff" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <polygon points="56,53 58,60 60,53" fill="#ffffff" stroke="#00d2ff" stroke-width="0.9"/>
    <polygon points="70,53 72,60 74,53" fill="#ffffff" stroke="#00d2ff" stroke-width="0.9"/>
  ` : (isAngel ? `
    <path d="M53,53 Q65,58 77,53" stroke="#d97706" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  ` : (isUnicorn ? `
    <path d="M53,53 Q65,58 77,53" stroke="#c084fc" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <polygon points="56,53 58,59 60,53" fill="#ffffff" stroke="#f472b6" stroke-width="0.8"/>
    <polygon points="70,53 72,59 74,53" fill="#ffffff" stroke="#f472b6" stroke-width="0.8"/>
  ` : `
    <path d="M53,53 Q65,58 77,53" stroke="rgba(0,0,0,0.55)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <polygon points="56,53 58,59 60,53" fill="#ffffff" stroke="rgba(0,0,0,0.3)" stroke-width="0.8"/>
    <polygon points="70,53 72,59 74,53" fill="#ffffff" stroke="rgba(0,0,0,0.3)" stroke-width="0.8"/>
  `))))}
</svg>`;
    return effectsHtml + svg;
  } catch (err) {
    console.error('generateDinoSVG safe fallback triggered:', err);
    return `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" class="dino-svg-vivid dino-anim-bounce">
      <ellipse cx="50" cy="58" rx="30" ry="38" fill="#38bdf8"/>
      <ellipse cx="42" cy="48" rx="4" ry="5" fill="#fff"/>
      <ellipse cx="58" cy="48" rx="4" ry="5" fill="#fff"/>
      <circle cx="42" cy="48" r="2" fill="#000"/>
      <circle cx="58" cy="48" r="2" fill="#000"/>
    </svg>`;
  }
}

