/* ==========================================================================
   DinoClass (恐龙班级小帮手) - Storage & State Persistence Manager
   ========================================================================== */

const STORAGE_KEY = 'DINOCLASS_APP_DATA_V3';
const CLASSES_META_KEY = 'DINOCLASS_CLASSES_META_V1';
const ACTIVE_CLASS_ID_KEY = 'DINOCLASS_ACTIVE_CLASS_ID_V1';

const CANONICAL_3K_DATA = {"classGoal":{"targetScore":500,"title":"全班看大片/班会庆祝会"},"classId":"class_3k_24","className":"3K班","logs":[],"shopItems":[{"category":"role","cost":30,"desc":"体验担任一日班长，协助老师管理班级秩序","durationDays":1,"icon":"👑","id":"item_leader","stock":5,"subCategory":"privilege","title":"一日小班长卡"},{"category":"role","cost":50,"desc":"经老师许可，与心仪同伴自主选择座位一周","durationDays":7,"icon":"🪑","id":"item_seat","stock":5,"subCategory":"privilege","title":"自选桌位一周卡"},{"category":"role","cost":50,"desc":"免除一次班级日常值日卫生打扫工作","durationDays":1,"icon":"🧹","id":"item_duty_free","stock":8,"subCategory":"privilege","title":"免值日打扫一次卡"},{"category":"role","cost":20,"desc":"全天协助老师收发作业本与整理讲台","durationDays":1,"icon":"👩‍🏫","id":"item_helper","stock":8,"subCategory":"privilege","title":"老师贴身小助手"},{"category":"fun","cost":30,"desc":"恐龙照片在班级大屏及主页置顶特写展示一日","durationDays":1,"icon":"🌟","id":"item_wall","stock":5,"subCategory":"privilege","title":"电子光荣榜置顶卡"},{"category":"dino","cost":80,"desc":"基因重构为黑曜石暗红脉络皮肤，环绕动态上升爆发火山火花粒子","durationDays":0,"icon":"🌋","id":"item_lava_skin","stock":99,"subCategory":"skin","title":"🌋 熔岩火龙皮肤"},{"category":"dino","cost":80,"desc":"基因重构为千年玄冰幽蓝霜雪皮肤，环绕晶莹冰棱碎屑与极寒冰霜雪花粒子","durationDays":0,"icon":"❄️","id":"item_frost_skin","stock":99,"subCategory":"skin","title":"❄️ 极寒冰龙皮肤"},{"category":"dino","cost":80,"desc":"基因重构为纯白圣洁大天使皮肤，展开圣光羽翼并悬浮神圣天使光环","durationDays":0,"icon":"👼","id":"item_angel_skin","stock":99,"subCategory":"skin","title":"👼 炽天大天使皮肤"},{"category":"dino","cost":80,"desc":"基因重构为极光彩虹梦幻皮肤，额前挺立螺旋星芒独角与梦幻星屑","durationDays":0,"icon":"🦄","id":"item_unicorn_skin","stock":99,"subCategory":"skin","title":"🦄 梦幻独角兽皮肤"},{"category":"dino","cost":90,"desc":"改变恐龙基因，使其基础颜色变为璀璨的黄金色","durationDays":0,"icon":"🏆","id":"item_chroma_gold","stock":99,"subCategory":"skin","title":"🏆 耀世黄金龙皮肤"},{"category":"dino","cost":50,"desc":"解锁并穿戴会闪烁流光粒子与炫酷光晕的金冠框","durationDays":0,"icon":"✨","id":"item_crown","stock":99,"subCategory":"accessory","title":"👑 超炫流光金冠框"},{"category":"dino","cost":30,"desc":"给恐龙戴上一副黑超墨镜，瞬间化身班级小霸王","durationDays":0,"icon":"🕶️","id":"item_sunglasses","stock":99,"subCategory":"accessory","title":"🕶️ 酷炫ThugLife墨镜"},{"category":"dino","cost":40,"desc":"穿戴带金黄流苏的学术博士帽与圆框金丝眼镜，散发学霸智慧光晕","durationDays":0,"icon":"🎓","id":"item_grad_cap","stock":99,"subCategory":"accessory","title":"🎓 学霸博士帽"},{"category":"dino","cost":35,"desc":"在恐龙卡面上挂上专属荣耀勋章","durationDays":0,"icon":"🏷️","id":"item_title","stock":99,"subCategory":"accessory","title":"🏷️ 炫酷专属称号"},{"category":"dino","cost":50,"desc":"在恐龙周围环绕飘落粉色樱花瓣的浪漫特效","durationDays":0,"icon":"🌸","id":"item_cherry_blossom","stock":99,"subCategory":"fx","title":"🌸 唯美樱花飘落特效"},{"category":"dino","cost":50,"desc":"在恐龙脚下召唤一个发光且缓慢旋转的星芒魔法阵底座","durationDays":0,"icon":"🔯","id":"item_magic_circle","stock":99,"subCategory":"fx","title":"🔯 星芒魔法阵底座"},{"category":"dino","cost":50,"desc":"召唤炽热岩浆裂纹法阵，大地龟裂、暗焰六芒符文涌动","durationDays":0,"icon":"🌋","id":"item_lava_circle","stock":99,"subCategory":"fx","title":"🌋 熔岩地狱裂纹阵"},{"category":"dino","cost":50,"desc":"召唤六边形科技网格法阵，数字脉冲光弧高速扫描旋转","durationDays":0,"icon":"⚡","id":"item_cyber_circle","stock":99,"subCategory":"fx","title":"⚡ 量子赛博科技阵"},{"category":"dino","cost":50,"desc":"召唤和风樱花神道法阵，鸟居朱红光圈与金色神纹旋转","durationDays":0,"icon":"🌸","id":"item_sakura_circle","stock":99,"subCategory":"fx","title":"🌸 圣樱神道奉纳阵"},{"category":"dino","cost":50,"desc":"召唤一只发光的小仙子精灵在恐龙脑袋旁边悬浮飞舞","durationDays":0,"icon":"🧚","id":"item_companion_fairy","stock":99,"subCategory":"fx","title":"🧚 悬浮小仙子精灵"},{"category":"dino","cost":40,"desc":"恐龙卡片持续绽放绚丽彩色烟火粒子动画","durationDays":0,"icon":"🎇","id":"item_fireworks","stock":99,"subCategory":"fx","title":"🎇 恐龙身后烟火特效"},{"category":"dino","cost":30,"desc":"赋予恐龙一句专属台词，点击恐龙时气泡弹出","durationDays":0,"icon":"💬","id":"item_dialogue","stock":99,"subCategory":"fx","title":"💬 恐龙专属台词卡"}],"students":[{"earned":{"angel_skin":true,"sunglasses":true},"equipped":{"angel_skin":true,"chroma_gold":false,"frost_skin":false,"frostfire_skin":false,"lava_skin":false,"sunglasses":true,"unicorn_skin":false},"hasCrown":false,"history":[{"delta":1,"id":"log_1789443740577_hkuu","reason":"日常表扬","studentId":"s7","studentName":"梁宇丞","timestamp":"11:42"},{"delta":1,"id":"log_1789443739888_trzc","reason":"日常表扬","studentId":"s7","studentName":"梁宇丞","timestamp":"11:42"},{"delta":2,"id":"log_1789443700251_giww","reason":"全勤无迟到","studentId":"s7","studentName":"梁宇丞","timestamp":"11:41"},{"delta":2,"id":"log_1789355358312_1akh","reason":"全勤无迟到","studentId":"s7","studentName":"梁宇丞","timestamp":"11:09"},{"delta":2,"id":"log_1788999310290_se71","reason":"全勤无迟到","studentId":"s7","studentName":"梁宇丞","timestamp":"08:15"}],"id":"s7","isSpotlight":false,"name":"梁宇丞","score":713,"speciesKey":"tri","titleBadge":""},{"earned":{"chroma_gold":true},"equipped":{"chroma_gold":true},"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700272_zfpp","reason":"全勤无迟到","studentId":"s14","studentName":"林微晴","timestamp":"11:41"},{"delta":2,"id":"log_1789355358339_7ak6","reason":"全勤无迟到","studentId":"s14","studentName":"林微晴","timestamp":"11:09"},{"delta":2,"id":"log_1788999310326_tv9v","reason":"全勤无迟到","studentId":"s14","studentName":"林微晴","timestamp":"08:15"},{"delta":2,"id":"log_1788923620008_8dz8","reason":"全勤无迟到","studentId":"s14","studentName":"林微晴","timestamp":"11:13"},{"delta":5,"id":"log_1787891615445_poyy","reason":"优秀表现","studentId":"s14","studentName":"林微晴","timestamp":"12:33"}],"id":"s14","isSpotlight":false,"name":"林微晴","score":675,"speciesKey":"brachio","titleBadge":""},{"customDialogue":"","earned":{"frost_skin":true},"equipped":{"angel_skin":false,"chroma_gold":false,"frost_skin":true,"frostfire_skin":false,"lava_skin":false,"unicorn_skin":false},"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700275_p8gn","reason":"全勤无迟到","studentId":"s19","studentName":"王晨宥","timestamp":"11:41"},{"delta":2,"id":"log_1789355358341_e4kv","reason":"全勤无迟到","studentId":"s19","studentName":"王晨宥","timestamp":"11:09"},{"delta":2,"id":"log_1788999310336_ojsh","reason":"全勤无迟到","studentId":"s19","studentName":"王晨宥","timestamp":"08:15"},{"delta":-80,"id":"log_1788923656129_swkw","reason":"兑换【❄️ 极寒冰龙皮肤】","studentId":"s19","studentName":"王晨宥","timestamp":"11:14"},{"delta":2,"id":"log_1788923620012_27ro","reason":"全勤无迟到","studentId":"s19","studentName":"王晨宥","timestamp":"11:13"}],"id":"s19","isSpotlight":false,"name":"王晨宥","score":476,"speciesKey":"brachio","titleBadge":""},{"customDialogue":"Hello","hasCrown":false,"history":[{"delta":2,"id":"log_1789443700277_aqoc","reason":"全勤无迟到","studentId":"s11","studentName":"连允希","timestamp":"11:41"},{"delta":2,"id":"log_1789355358343_uidp","reason":"全勤无迟到","studentId":"s11","studentName":"连允希","timestamp":"11:09"},{"delta":2,"id":"log_1788999310328_t9tk","reason":"全勤无迟到","studentId":"s11","studentName":"连允希","timestamp":"08:15"},{"delta":2,"id":"log_1788923620010_fh8u","reason":"全勤无迟到","studentId":"s11","studentName":"连允希","timestamp":"11:13"},{"delta":2,"id":"log_1788839115907_5rjz","reason":"全勤无迟到","studentId":"s11","studentName":"连允希","timestamp":"11:45"}],"id":"s11","isSpotlight":false,"name":"连允希","score":557,"speciesKey":"rex","titleBadge":""},{"hasCrown":false,"history":[{"delta":1,"id":"log_1789443748780_hevi","reason":"日常表扬","studentId":"s12","studentName":"林嘉欣","timestamp":"11:42"},{"delta":1,"id":"log_1789443748076_y5c7","reason":"日常表扬","studentId":"s12","studentName":"林嘉欣","timestamp":"11:42"},{"delta":2,"id":"log_1789443700279_clrj","reason":"全勤无迟到","studentId":"s12","studentName":"林嘉欣","timestamp":"11:41"},{"delta":2,"id":"log_1789355358345_lmye","reason":"全勤无迟到","studentId":"s12","studentName":"林嘉欣","timestamp":"11:09"},{"delta":2,"id":"log_1788999310332_3u1l","reason":"全勤无迟到","studentId":"s12","studentName":"林嘉欣","timestamp":"08:15"}],"id":"s12","isSpotlight":false,"name":"林嘉欣","score":498,"speciesKey":"tri","titleBadge":""},{"hasCrown":false,"history":[{"delta":1,"id":"log_1789443744590_pkut","reason":"日常表扬","studentId":"s5","studentName":"曾文泉","timestamp":"11:42"},{"delta":1,"id":"log_1789443743714_u5pj","reason":"日常表扬","studentId":"s5","studentName":"曾文泉","timestamp":"11:42"},{"delta":2,"id":"log_1789443700283_nudc","reason":"全勤无迟到","studentId":"s5","studentName":"曾文泉","timestamp":"11:41"},{"delta":2,"id":"log_1789355358349_bo4n","reason":"全勤无迟到","studentId":"s5","studentName":"曾文泉","timestamp":"11:09"},{"delta":2,"id":"log_1788999310342_gq7r","reason":"全勤无迟到","studentId":"s5","studentName":"曾文泉","timestamp":"08:15"}],"id":"s5","isSpotlight":false,"name":"曾文泉","score":308,"speciesKey":"mythic","titleBadge":""},{"earned":{"fireworks":true},"equipped":{"fireworks":true},"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700286_964l","reason":"全勤无迟到","studentId":"s22","studentName":"卓恩希","timestamp":"11:41"},{"delta":2,"id":"log_1789355358355_nbvz","reason":"全勤无迟到","studentId":"s22","studentName":"卓恩希","timestamp":"11:09"},{"delta":2,"id":"log_1788999310355_gm8u","reason":"全勤无迟到","studentId":"s22","studentName":"卓恩希","timestamp":"08:15"},{"delta":2,"id":"log_1788923620026_lqm9","reason":"全勤无迟到","studentId":"s22","studentName":"卓恩希","timestamp":"11:13"},{"delta":2,"id":"log_1788839115918_snmq","reason":"全勤无迟到","studentId":"s22","studentName":"卓恩希","timestamp":"11:45"}],"id":"s22","isSpotlight":false,"name":"卓恩希","score":181,"speciesKey":"tri","titleBadge":""},{"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700287_scx6","reason":"全勤无迟到","studentId":"s18","studentName":"阿曼达","timestamp":"11:41"},{"delta":2,"id":"log_1789355358358_ebki","reason":"全勤无迟到","studentId":"s18","studentName":"阿曼达","timestamp":"11:09"},{"delta":2,"id":"log_1788999310346_owan","reason":"全勤无迟到","studentId":"s18","studentName":"阿曼达","timestamp":"08:15"},{"delta":2,"id":"log_1788923620020_eiez","reason":"全勤无迟到","studentId":"s18","studentName":"阿曼达","timestamp":"11:13"},{"delta":2,"id":"log_1788839115914_gan5","reason":"全勤无迟到","studentId":"s18","studentName":"阿曼达","timestamp":"11:45"}],"id":"s18","isSpotlight":false,"name":"阿曼达","score":236,"speciesKey":"ptero","titleBadge":""},{"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700288_6c7x","reason":"全勤无迟到","studentId":"s9","studentName":"卡威尼斯","timestamp":"11:41"},{"delta":2,"id":"log_1789355358362_r3rq","reason":"全勤无迟到","studentId":"s9","studentName":"卡威尼斯","timestamp":"11:09"},{"delta":2,"id":"log_1788999310351_5510","reason":"全勤无迟到","studentId":"s9","studentName":"卡威尼斯","timestamp":"08:15"},{"delta":2,"id":"log_1788923620023_rijp","reason":"全勤无迟到","studentId":"s9","studentName":"卡威尼斯","timestamp":"11:13"},{"delta":2,"id":"log_1788839115916_3khs","reason":"全勤无迟到","studentId":"s9","studentName":"卡威尼斯","timestamp":"11:45"}],"id":"s9","isSpotlight":false,"name":"卡威尼斯","score":185,"speciesKey":"brachio","titleBadge":""},{"earned":{"grad_cap":true},"equipped":{"grad_cap":true},"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700289_a93h","reason":"全勤无迟到","studentId":"s3","studentName":"郑安琪","timestamp":"11:41"},{"delta":2,"id":"log_1789355358367_ntw3","reason":"全勤无迟到","studentId":"s3","studentName":"郑安琪","timestamp":"11:09"},{"delta":2,"id":"log_1788999310348_kq5f","reason":"全勤无迟到","studentId":"s3","studentName":"郑安琪","timestamp":"08:15"},{"delta":2,"id":"log_1788923620021_o35c","reason":"全勤无迟到","studentId":"s3","studentName":"郑安琪","timestamp":"11:13"},{"delta":2,"id":"log_1788839115916_xbad","reason":"全勤无迟到","studentId":"s3","studentName":"郑安琪","timestamp":"11:45"}],"id":"s3","isSpotlight":false,"name":"郑安琪","score":196,"speciesKey":"ptero","titleBadge":""},{"earned":{"frost_skin":true,"frostfire_skin":true,"lava_skin":true,"magic_circle":true,"sunglasses":true},"equipped":{"angel_skin":false,"chroma_gold":false,"frost_skin":false,"frostfire_skin":true,"lava_skin":false,"magic_circle":true,"sunglasses":true,"unicorn_skin":false},"hasCrown":false,"history":[{"delta":1,"id":"log_1789443730214_6y1t","reason":"日常表扬","studentId":"s17","studentName":"齐亚","timestamp":"11:42"},{"delta":1,"id":"log_1789443729489_85wx","reason":"日常表扬","studentId":"s17","studentName":"齐亚","timestamp":"11:42"},{"delta":2,"id":"log_1789443700291_62fu","reason":"全勤无迟到","studentId":"s17","studentName":"齐亚","timestamp":"11:41"},{"delta":5,"id":"log_1789355726687_7r4n","reason":"优秀表现","studentId":"s17","studentName":"齐亚","timestamp":"11:15"},{"delta":5,"id":"log_1789355724841_2qzl","reason":"优秀表现","studentId":"s17","studentName":"齐亚","timestamp":"11:15"}],"id":"s17","isSpotlight":false,"name":"齐亚","score":168,"speciesKey":"tri","titleBadge":""},{"customDialogue":"subscribe!","earned":{"lava_skin":true},"earnedCrown":false,"equipped":{"angel_skin":false,"chroma_gold":false,"frost_skin":false,"frostfire_skin":false,"lava_skin":true,"unicorn_skin":false},"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700293_4wmk","reason":"全勤无迟到","studentId":"s4","studentName":"黄宇恒","timestamp":"11:41"},{"delta":2,"id":"log_1789355358372_6v92","reason":"全勤无迟到","studentId":"s4","studentName":"黄宇恒","timestamp":"11:09"},{"delta":2,"id":"log_1788999310367_p50h","reason":"全勤无迟到","studentId":"s4","studentName":"黄宇恒","timestamp":"08:15"},{"delta":-80,"id":"log_1788923785581_fg0d","reason":"兑换【🌋 熔岩火龙皮肤】","studentId":"s4","studentName":"黄宇恒","timestamp":"11:16"},{"delta":2,"id":"log_1788923620028_n75h","reason":"全勤无迟到","studentId":"s4","studentName":"黄宇恒","timestamp":"11:13"}],"id":"s4","isSpotlight":false,"name":"黄宇恒","score":101,"speciesKey":"brachio","titleBadge":""},{"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700295_3yxf","reason":"全勤无迟到","studentId":"s13","studentName":"林芊妤","timestamp":"11:41"},{"delta":2,"id":"log_1789355358374_7c1v","reason":"全勤无迟到","studentId":"s13","studentName":"林芊妤","timestamp":"11:09"},{"delta":2,"id":"log_1788999310359_7aah","reason":"全勤无迟到","studentId":"s13","studentName":"林芊妤","timestamp":"08:15"},{"delta":2,"id":"log_1788923620029_q0eo","reason":"全勤无迟到","studentId":"s13","studentName":"林芊妤","timestamp":"11:13"},{"delta":2,"id":"log_1788839115921_0m09","reason":"全勤无迟到","studentId":"s13","studentName":"林芊妤","timestamp":"11:45"}],"id":"s13","isSpotlight":false,"name":"林芊妤","score":167,"speciesKey":"ptero","titleBadge":""},{"customDialogue":"恭喜发财！","hasCrown":false,"history":[{"delta":2,"id":"log_1789443700298_j406","reason":"全勤无迟到","studentId":"s1","studentName":"马力克","timestamp":"11:41"},{"delta":2,"id":"log_1789355358377_m53f","reason":"全勤无迟到","studentId":"s1","studentName":"马力克","timestamp":"11:09"},{"delta":2,"id":"log_1788999310362_3y3y","reason":"全勤无迟到","studentId":"s1","studentName":"马力克","timestamp":"08:15"},{"delta":2,"id":"log_1788923620031_0g3b","reason":"全勤无迟到","studentId":"s1","studentName":"马力克","timestamp":"11:13"},{"delta":2,"id":"log_1788839115926_kkp7","reason":"全勤无迟到","studentId":"s1","studentName":"马力克","timestamp":"11:45"}],"id":"s1","isSpotlight":false,"name":"马力克","score":137,"speciesKey":"rex","titleBadge":""},{"activePrivileges":[{"expireTimestamp":1787197316622,"icon":"🪑","itemId":"item_seat","title":"自选桌位一周卡"}],"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700300_lwj0","reason":"全勤无迟到","studentId":"s21","studentName":"罗嘉嘉","timestamp":"11:41"},{"delta":2,"id":"log_1789355358378_f0hk","reason":"全勤无迟到","studentId":"s21","studentName":"罗嘉嘉","timestamp":"11:09"},{"delta":2,"id":"log_1788839115923_d4jz","reason":"全勤无迟到","studentId":"s21","studentName":"罗嘉嘉","timestamp":"11:45"},{"delta":5,"id":"log_1787891711690_98d5","reason":"优秀表现","studentId":"s21","studentName":"罗嘉嘉","timestamp":"12:35"},{"delta":5,"id":"log_1787891711481_8yh3","reason":"优秀表现","studentId":"s21","studentName":"罗嘉嘉","timestamp":"12:35"}],"id":"s21","isSpotlight":false,"name":"罗嘉嘉","score":161,"speciesKey":"rex","titleBadge":""},{"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700303_9aw5","reason":"全勤无迟到","studentId":"s6","studentName":"石伟良","timestamp":"11:41"},{"delta":2,"id":"log_1789355358380_4e9k","reason":"全勤无迟到","studentId":"s6","studentName":"石伟良","timestamp":"11:09"},{"delta":2,"id":"log_1788999310370_0sct","reason":"全勤无迟到","studentId":"s6","studentName":"石伟良","timestamp":"08:15"},{"delta":2,"id":"log_1788923620035_w4ra","reason":"全勤无迟到","studentId":"s6","studentName":"石伟良","timestamp":"11:13"},{"delta":2,"id":"log_1788839115930_4u0b","reason":"全勤无迟到","studentId":"s6","studentName":"石伟良","timestamp":"11:45"}],"id":"s6","isSpotlight":false,"name":"石伟良","score":97,"speciesKey":"rex","titleBadge":""},{"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700305_jnxs","reason":"全勤无迟到","studentId":"s15","studentName":"奈之米","timestamp":"11:41"},{"delta":2,"id":"log_1789355358381_oaq3","reason":"全勤无迟到","studentId":"s15","studentName":"奈之米","timestamp":"11:09"},{"delta":2,"id":"log_1788999310373_5eim","reason":"全勤无迟到","studentId":"s15","studentName":"奈之米","timestamp":"08:15"},{"delta":2,"id":"log_1788923620036_vtu3","reason":"全勤无迟到","studentId":"s15","studentName":"奈之米","timestamp":"11:13"},{"delta":5,"id":"log_1787891685582_kl7k","reason":"优秀表现","studentId":"s15","studentName":"奈之米","timestamp":"12:34"}],"id":"s15","isSpotlight":false,"name":"奈之米","score":94,"speciesKey":"mythic","titleBadge":""},{"customDialogue":"","hasCrown":false,"history":[{"delta":2,"id":"log_1789443700308_f4if","reason":"全勤无迟到","studentId":"s8","studentName":"林展延","timestamp":"11:41"},{"delta":2,"id":"log_1789355358382_la4k","reason":"全勤无迟到","studentId":"s8","studentName":"林展延","timestamp":"11:09"},{"delta":2,"id":"log_1788999310363_105b","reason":"全勤无迟到","studentId":"s8","studentName":"林展延","timestamp":"08:15"},{"delta":2,"id":"log_1788923620034_z47x","reason":"全勤无迟到","studentId":"s8","studentName":"林展延","timestamp":"11:13"},{"delta":2,"id":"log_1788839115929_cs9r","reason":"全勤无迟到","studentId":"s8","studentName":"林展延","timestamp":"11:45"}],"id":"s8","isSpotlight":false,"name":"林展延","score":134,"speciesKey":"ptero","titleBadge":""},{"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700311_91fg","reason":"全勤无迟到","studentId":"s24","studentName":"杨浩仟","timestamp":"11:41"},{"delta":2,"id":"log_1789355358385_9bpf","reason":"全勤无迟到","studentId":"s24","studentName":"杨浩仟","timestamp":"11:09"},{"delta":2,"id":"log_1786583592097_hnd0","reason":"全勤无迟到","studentId":"s24","studentName":"杨浩仟","timestamp":"09:13"},{"delta":2,"id":"log_1786493329653_o7j1","reason":"全勤无迟到","studentId":"s24","studentName":"杨浩仟","timestamp":"08:08"},{"delta":2,"id":"log_1785980863377_p1kz","reason":"全勤无迟到","studentId":"s24","studentName":"杨浩仟","timestamp":"09:47"}],"id":"s24","isSpotlight":false,"name":"杨浩仟","score":45,"speciesKey":"brachio","titleBadge":""},{"customDialogue":"你好，我叫卓威洪！","earnedCrown":true,"hasCrown":true,"history":[{"delta":2,"id":"log_1789443700312_31nm","reason":"全勤无迟到","studentId":"s2","studentName":"卓威洪","timestamp":"11:41"},{"delta":2,"id":"log_1789355358388_0mlx","reason":"全勤无迟到","studentId":"s2","studentName":"卓威洪","timestamp":"11:09"},{"delta":2,"id":"log_1788999310379_84ki","reason":"全勤无迟到","studentId":"s2","studentName":"卓威洪","timestamp":"08:15"},{"delta":2,"id":"log_1788923620041_78vc","reason":"全勤无迟到","studentId":"s2","studentName":"卓威洪","timestamp":"11:13"},{"delta":2,"id":"log_1788839115934_bskn","reason":"全勤无迟到","studentId":"s2","studentName":"卓威洪","timestamp":"11:45"}],"id":"s2","isSpotlight":false,"name":"卓威洪","score":51,"speciesKey":"tri","titleBadge":""},{"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700313_d79z","reason":"全勤无迟到","studentId":"s20","studentName":"阿里安","timestamp":"11:41"},{"delta":2,"id":"log_1789355358390_wkn6","reason":"全勤无迟到","studentId":"s20","studentName":"阿里安","timestamp":"11:09"},{"delta":2,"id":"log_1788999310382_9bnb","reason":"全勤无迟到","studentId":"s20","studentName":"阿里安","timestamp":"08:15"},{"delta":2,"id":"log_1788839115937_mt50","reason":"全勤无迟到","studentId":"s20","studentName":"阿里安","timestamp":"11:45"},{"delta":2,"id":"log_1787802927378_z4e9","reason":"全勤无迟到","studentId":"s20","studentName":"阿里安","timestamp":"11:55"}],"id":"s20","isSpotlight":false,"name":"阿里安","score":47,"speciesKey":"mythic","titleBadge":""},{"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700316_dia8","reason":"全勤无迟到","studentId":"s16","studentName":"凯尔哲","timestamp":"11:41"},{"delta":-1,"id":"log_1789355631902_gra6","reason":"提醒改进","studentId":"s16","studentName":"凯尔哲","timestamp":"11:13"},{"delta":-1,"id":"log_1789355631081_zz2j","reason":"提醒改进","studentId":"s16","studentName":"凯尔哲","timestamp":"11:13"},{"delta":-1,"id":"log_1789355630222_mppj","reason":"提醒改进","studentId":"s16","studentName":"凯尔哲","timestamp":"11:13"},{"delta":-1,"id":"log_1789355629337_gnt0","reason":"提醒改进","studentId":"s16","studentName":"凯尔哲","timestamp":"11:13"}],"id":"s16","isSpotlight":false,"name":"凯尔哲","score":49,"speciesKey":"rex","titleBadge":""},{"earned":{"grad_cap":true},"equipped":{"grad_cap":true},"hasCrown":false,"history":[{"delta":2,"id":"log_1789443700320_gkiy","reason":"全勤无迟到","studentId":"s23","studentName":"姚子亮","timestamp":"11:41"},{"delta":2,"id":"log_1789355358396_i3o3","reason":"全勤无迟到","studentId":"s23","studentName":"姚子亮","timestamp":"11:09"},{"delta":2,"id":"log_1788999310376_zwaz","reason":"全勤无迟到","studentId":"s23","studentName":"姚子亮","timestamp":"08:15"},{"delta":2,"id":"log_1788923620038_3nlg","reason":"全勤无迟到","studentId":"s23","studentName":"姚子亮","timestamp":"11:13"},{"delta":2,"id":"log_1788839115932_0sud","reason":"全勤无迟到","studentId":"s23","studentName":"姚子亮","timestamp":"11:45"}],"id":"s23","isSpotlight":false,"name":"姚子亮","score":72,"speciesKey":"ptero","titleBadge":""},{"customDialogue":"你好，我叫许德权！","hasCrown":false,"history":[{"delta":2,"id":"log_1789443700322_6hhl","reason":"全勤无迟到","studentId":"s10","studentName":"许德权","timestamp":"11:41"},{"delta":2,"id":"log_1789355358400_3agc","reason":"全勤无迟到","studentId":"s10","studentName":"许德权","timestamp":"11:09"},{"delta":2,"id":"log_1788999310388_bsly","reason":"全勤无迟到","studentId":"s10","studentName":"许德权","timestamp":"08:15"},{"delta":2,"id":"log_1788923620046_43yk","reason":"全勤无迟到","studentId":"s10","studentName":"许德权","timestamp":"11:13"},{"delta":2,"id":"log_1788839115940_noxp","reason":"全勤无迟到","studentId":"s10","studentName":"许德权","timestamp":"11:45"}],"id":"s10","isSpotlight":false,"name":"许德权","score":31,"speciesKey":"mythic","titleBadge":""}]};

class StorageManager {
  constructor() {
    this.classesList = this.loadClassesList();
    this.currentClassId = localStorage.getItem(ACTIVE_CLASS_ID_KEY) || 'class_3k_24';
    this.migrateLegacyClasses();
    this.data = this.loadData(this.currentClassId);
  }

  // 1. 多班级元数据管理 (默认双班级独立永久 ID，彻底消灭 class_default 撞车)
  loadClassesList() {
    try {
      const raw = localStorage.getItem(CLASSES_META_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const clean = [];
          const seenNames = new Set();
          const seenIds = new Set();

          for (const c of parsed) {
            if (!c || !c.id || c.id === 'class_default') continue;
            let name = (c.name || '').trim();
            if (name === '三(1)班' || name === '三（1）班') name = 'ON';
            if (!name) continue;

            // 核心权威规则：3K班的合法 ID 只能是 class_3k_24，拒绝 0人幽灵班
            if ((name === '3K班' || name === '3K') && c.id !== 'class_3k_24') continue;
            // 核心权威规则：ON 的合法 ID 只能是 class_primary_5，拒绝 0人幽灵班
            if (name === 'ON' && c.id !== 'class_primary_5') continue;

            if (seenNames.has(name) || seenIds.has(c.id)) continue;
            seenNames.add(name);
            seenIds.add(c.id);
            clean.push({ id: c.id, name: name });
          }

          if (!clean.some(c => c.id === 'class_3k_24')) {
            clean.unshift({ id: 'class_3k_24', name: '3K班' });
          }
          if (!clean.some(c => c.id === 'class_primary_5')) {
            clean.push({ id: 'class_primary_5', name: 'ON' });
          }

          this.saveClassesList(clean);
          return clean;
        }
      }
    } catch (e) {}
    // 默认初始两班目录（使用永久唯一独立房间 ID）
    const initialList = [
      { id: 'class_3k_24', name: '3K班' },
      { id: 'class_primary_5', name: 'ON' }
    ];
    this.saveClassesList(initialList);
    return initialList;
  }

  // 智能自动理顺历史班级数据（彻底解决电脑与平板共用房间打架、名称跳动）
  migrateLegacyClasses() {
    // 检查是否有历史未分割的旧数据
    const legacyRaw = localStorage.getItem(STORAGE_KEY);
    let legacyData = null;
    try {
      if (legacyRaw) legacyData = JSON.parse(legacyRaw);
    } catch (e) {}

    const isFiveStudents = (data) => {
      if (!data || !Array.isArray(data.students)) return false;
      return data.students.some(s => s.name === 'WYNNIE' || s.name === '杨老师' || s.name === 'STELLEN') || data.students.length <= 10;
    };

    const is24Students = (data) => {
      if (!data || !Array.isArray(data.students)) return false;
      return data.students.some(s => s.name === '梁宇丞' || s.name === '林微晴' || s.name === '连允希') || data.students.length >= 15;
    };

    // 读取或初始化 3K班 (24人，权威 5379分，绝不为 0)
    let class3k = this.loadRawData('class_3k_24');
    const score3k = (class3k && Array.isArray(class3k.students)) ? class3k.students.reduce((a, s) => a + (s.score || 0), 0) : 0;
    if (!class3k || score3k === 0) {
      if (legacyData && is24Students(legacyData) && legacyData.students.reduce((a, s) => a + (s.score || 0), 0) > 0) {
        class3k = legacyData;
      } else {
        for (let c of this.classesList) {
          const d = this.loadRawData(c.id);
          if (is24Students(d) && d.students.reduce((a, s) => a + (s.score || 0), 0) > 0) {
            class3k = d;
            break;
          }
        }
      }
      if (!class3k || class3k.students.reduce((a, s) => a + (s.score || 0), 0) === 0) {
        class3k = JSON.parse(JSON.stringify(CANONICAL_3K_DATA));
      }
      class3k.classId = 'class_3k_24';
      class3k.className = '3K班';
      try { localStorage.setItem(this.getClassStorageKey('class_3k_24'), JSON.stringify(class3k)); } catch(e) {}
    }

    // 读取或初始化 ON (原三(1)班, 5人)
    let classPrimary = this.loadRawData('class_primary_5');
    if (!classPrimary) {
      if (legacyData && isFiveStudents(legacyData)) {
        classPrimary = legacyData;
      } else {
        for (let c of this.classesList) {
          const d = this.loadRawData(c.id);
          if (isFiveStudents(d)) { classPrimary = d; break; }
        }
      }
      if (!classPrimary) {
        classPrimary = this.getDefaultState('ON', 'class_primary_5');
        classPrimary.students = [
          { id: 's_wynnie', name: 'WYNNIE', speciesKey: 'brachio', score: 244, hasCrown: false, earnedTitles: [], activePrivileges: [], history: [] },
          { id: 's_stellen', name: 'STELLEN', speciesKey: 'rex', score: 210, hasCrown: false, earnedTitles: [], activePrivileges: [], history: [] },
          { id: 's_lucas', name: 'LUCAS', speciesKey: 'brachio', score: 100, hasCrown: false, earnedTitles: [], activePrivileges: [], history: [] },
          { id: 's_giselle', name: 'GISELLE', speciesKey: 'mythic', score: 80, hasCrown: false, earnedTitles: [], activePrivileges: [], history: [] },
          { id: 's_teacher', name: '杨老师', speciesKey: 'mythic', score: 61, hasCrown: true, earnedTitles: [], activePrivileges: [], history: [] }
        ];
      }
      classPrimary.classId = 'class_primary_5';
      classPrimary.className = 'ON';
      try { localStorage.setItem(this.getClassStorageKey('class_primary_5'), JSON.stringify(classPrimary)); } catch(e) {}
    } else {
      classPrimary.className = 'ON';
      try { localStorage.setItem(this.getClassStorageKey('class_primary_5'), JSON.stringify(classPrimary)); } catch(e) {}
    }

    // 重构纯净的两班目录（彻底清除历史冲突 class_default 与同名幽灵班级）
    const cleanList = [
      { id: 'class_3k_24', name: '3K班' },
      { id: 'class_primary_5', name: 'ON' }
    ];

    const seenNames = new Set(['3K班', '3K', 'ON', '三(1)班', '三（1）班']);
    const seenIds = new Set(['class_3k_24', 'class_primary_5', 'class_default']);

    // 保留其他真正的自定义班级，同时清理同名幽灵班级本地垃圾
    this.classesList.forEach(c => {
      if (!c || !c.id || seenIds.has(c.id)) return;
      const name = (c.name || '').trim();
      if (!name || seenNames.has(name)) {
        // 清理同名幽灵班级的历史垃圾本地 key
        try { localStorage.removeItem(this.getClassStorageKey(c.id)); } catch(e) {}
        return;
      }
      seenNames.add(name);
      seenIds.add(c.id);
      cleanList.push({ id: c.id, name: name });
    });

    this.classesList = cleanList;
    this.saveClassesList();

    // 纠正当前激活班级
    if (this.currentClassId === 'class_default' || !cleanList.some(c => c.id === this.currentClassId)) {
      this.currentClassId = (legacyData && isFiveStudents(legacyData)) ? 'class_primary_5' : 'class_3k_24';
      try { localStorage.setItem(ACTIVE_CLASS_ID_KEY, this.currentClassId); } catch(e) {}
    }

    // 清理可能引起串流的旧历史键
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
    try { localStorage.removeItem(STORAGE_KEY + '_class_default'); } catch(e) {}

    // 广播到云端
    if (window.firebaseSyncMgr) {
      if (typeof window.firebaseSyncMgr.pushClassData === 'function') {
        window.firebaseSyncMgr.pushClassData('class_3k_24', class3k);
        window.firebaseSyncMgr.pushClassData('class_primary_5', classPrimary);
      }
      if (typeof window.firebaseSyncMgr.syncClassesMeta === 'function') {
        window.firebaseSyncMgr.syncClassesMeta(cleanList);
      }
    }
  }

  loadRawData(classId) {
    if (!classId) return null;
    const key = this.getClassStorageKey(classId);
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return null;
  }

  saveClassesList(list = null) {
    if (list) this.classesList = list;
    try {
      localStorage.setItem(CLASSES_META_KEY, JSON.stringify(this.classesList));
    } catch (e) {}
  }

  getActiveClassId() {
    return this.currentClassId || 'class_3k_24';
  }

  getActiveClassName() {
    return this.getClassNameById(this.currentClassId);
  }

  getClassNameById(classId) {
    const found = this.classesList.find(c => c.id === classId);
    return found ? found.name : (this.data?.className || '3K班');
  }

  getClassStorageKey(classId = null) {
    const id = classId || this.currentClassId || 'class_3k_24';
    return `${STORAGE_KEY}_${id}`;
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

          // 🛡️ class_3k_24 权威自愈：若本地恰好因新设备或历史原因总分为 0，立即恢复为 5379 分权威数据
          if (effectiveClassId === 'class_3k_24') {
            const totalScore = parsed.students.reduce((acc, s) => acc + (s.score || 0), 0);
            if (totalScore === 0 && typeof CANONICAL_3K_DATA !== 'undefined') {
              console.warn('[Storage] class_3k_24 本地为 0 分，立即使用 5379 分权威数据自愈恢复！');
              parsed = JSON.parse(JSON.stringify(CANONICAL_3K_DATA));
              needsSave = true;
            }
          }

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

  // 一键理顺并恢复标准双班级目录（彻底清理所有多端重叠加的垃圾班级）
  sanitizeToStandardClasses() {
    const cleanList = [
      { id: 'class_3k_24', name: '3K班' },
      { id: 'class_primary_5', name: 'ON' }
    ];
    this.classesList = cleanList;
    this.saveClassesList();

    // 确保 class_3k_24 权威 5379 分绝不为 0
    let class3kData = this.loadRawData('class_3k_24');
    const score3k = (class3kData && Array.isArray(class3kData.students)) ? class3kData.students.reduce((a, s) => a + (s.score || 0), 0) : 0;
    if (!class3kData || score3k === 0) {
      class3kData = JSON.parse(JSON.stringify(CANONICAL_3K_DATA));
      try { localStorage.setItem(this.getClassStorageKey('class_3k_24'), JSON.stringify(class3kData)); } catch(e) {}
      if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.pushClassData === 'function') {
        window.firebaseSyncMgr.pushClassData('class_3k_24', class3kData);
      }
    }

    // 确保 class_primary_5 本地数据名称更新为 ON 并同步至云端
    const primaryData = this.loadRawData('class_primary_5');
    if (primaryData) {
      primaryData.className = 'ON';
      try { localStorage.setItem(this.getClassStorageKey('class_primary_5'), JSON.stringify(primaryData)); } catch(e) {}
      if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.pushClassData === 'function') {
        window.firebaseSyncMgr.pushClassData('class_primary_5', primaryData);
      }
    }

    if (this.currentClassId !== 'class_3k_24' && this.currentClassId !== 'class_primary_5') {
      this.currentClassId = 'class_3k_24';
      try { localStorage.setItem(ACTIVE_CLASS_ID_KEY, 'class_3k_24'); } catch (e) {}
    }
    this.data = this.loadData(this.currentClassId);

    // 强行同步至云端，覆盖清除云端堆叠的历史垃圾目录
    if (window.firebaseSyncMgr && typeof window.firebaseSyncMgr.syncClassesMeta === 'function') {
      window.firebaseSyncMgr.syncClassesMeta(cleanList);
    }
    return cleanList;
  }

  // 8. 云端班级目录权威同步（彻底终结多端重叠加与死灰复燃）
  mergeRemoteClassesList(remoteList) {
    if (!Array.isArray(remoteList) || remoteList.length === 0) return;

    // 清洗远程列表：去重、过滤无效 ID、剔除历史冲突 ID class_default、严格按名称和 ID 权威去重
    const sanitized = [];
    const seenIds = new Set();
    const seenNames = new Set();

    remoteList.forEach(rc => {
      if (!rc || !rc.id) return;
      if (rc.id === 'class_default') return;

      let cleanName = (rc.name || '').trim();
      if (cleanName === '三(1)班' || cleanName === '三（1）班') {
        cleanName = 'ON';
      }
      if (!cleanName) return;

      // 核心权威规则：3K班 的唯一合法 ID 只能是 class_3k_24，彻底干掉 0人幽灵班
      if ((cleanName === '3K班' || cleanName === '3K') && rc.id !== 'class_3k_24') return;
      // 核心权威规则：ON 的唯一合法 ID 只能是 class_primary_5，彻底干掉 0人幽灵班
      if (cleanName === 'ON' && rc.id !== 'class_primary_5') return;

      // 严格去重：名称或 ID 出现过一律丢弃
      if (seenIds.has(rc.id) || seenNames.has(cleanName)) return;

      seenIds.add(rc.id);
      seenNames.add(cleanName);
      sanitized.push({ id: rc.id, name: cleanName });
    });

    if (sanitized.length === 0) return;

    // 确保核心双班级必定在列表中
    if (!sanitized.some(c => c.id === 'class_3k_24')) {
      sanitized.unshift({ id: 'class_3k_24', name: '3K班' });
    }
    if (!sanitized.some(c => c.id === 'class_primary_5')) {
      sanitized.push({ id: 'class_primary_5', name: 'ON' });
    }

    // 权威覆盖：直接以清洗后的云端目录为准！绝对不再累加本地已失效的旧班级
    this.classesList = sanitized;
    this.saveClassesList();

    // 如果当前选中的班级已被删除或失效，自动重定向到有效班级
    if (!this.classesList.some(c => c.id === this.currentClassId)) {
      this.currentClassId = this.classesList[0].id;
      try {
        localStorage.setItem(ACTIVE_CLASS_ID_KEY, this.currentClassId);
      } catch (e) {}
      this.data = this.loadData(this.currentClassId);
      if (window.dinoApp && typeof window.dinoApp.renderAll === 'function') {
        window.dinoApp.renderAll();
      }
    } else {
      // 若当前班级改名，同步更新当前内存中的班级名
      const currentMeta = this.classesList.find(c => c.id === this.currentClassId);
      if (currentMeta && this.data && this.data.className !== currentMeta.name) {
        this.data.className = currentMeta.name;
      }
    }

    if (window.dinoApp && typeof window.dinoApp.renderClassSelector === 'function') {
      window.dinoApp.renderClassSelector();
    }
    if (window.dinoApp && typeof window.dinoApp.renderClassManageItems === 'function') {
      window.dinoApp.renderClassManageItems();
    }
  }

  // 9. 严格应用远程班级数据（绝对防串班、防覆盖）
  applyRemoteClassData(classId, remoteData) {
    if (!classId || !remoteData || !Array.isArray(remoteData.students)) return false;

    // 🛡️ 零分防御装甲：若远程推来的是 0 分空壳或异常包，坚决拒绝覆盖本地已有的权威积分！
    const incomingScore = remoteData.students.reduce((a, s) => a + (s.score || 0), 0);
    const currentLocalScore = this.getClassTotalScore(classId);
    if (incomingScore === 0 && currentLocalScore > 0) {
      console.warn(`[Storage] 🛡️ 拦截到班级 [${classId}] 远程 0 分异常数据包，坚决保护本地现有的 ${currentLocalScore} 分权威数据！`);
      return false;
    }
    if (classId === 'class_3k_24' && incomingScore === 0) {
      console.warn('[Storage] 🛡️ 3K班远程数据积分为 0，坚决拒绝应用！保护权威 5379 分！');
      return false;
    }

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

  getDefaultState(className = '3K班', classId = 'class_3k_24') {
    if (classId === 'class_3k_24' || (className && className.includes('3K'))) {
      if (typeof CANONICAL_3K_DATA !== 'undefined') {
        return JSON.parse(JSON.stringify(CANONICAL_3K_DATA));
      }
    }
    if (classId === 'class_primary_5' || className === 'ON') {
      return {
        classId: 'class_primary_5',
        className: 'ON',
        students: [
          { id: 's_wynnie', name: 'WYNNIE', speciesKey: 'brachio', score: 244, hasCrown: false, earnedTitles: [], activePrivileges: [], history: [] },
          { id: 's_stellen', name: 'STELLEN', speciesKey: 'rex', score: 210, hasCrown: false, earnedTitles: [], activePrivileges: [], history: [] },
          { id: 's_lucas', name: 'LUCAS', speciesKey: 'brachio', score: 100, hasCrown: false, earnedTitles: [], activePrivileges: [], history: [] },
          { id: 's_giselle', name: 'GISELLE', speciesKey: 'mythic', score: 80, hasCrown: false, earnedTitles: [], activePrivileges: [], history: [] },
          { id: 's_teacher', name: '杨老师', speciesKey: 'mythic', score: 61, hasCrown: true, earnedTitles: [], activePrivileges: [], history: [] }
        ],
        shopItems: JSON.parse(JSON.stringify(DINO_DATA.SHOP_ITEMS)),
        customTags: [],
        logs: [],
        classGoal: { title: '全班看大片/班会庆祝会', targetScore: 500 }
      };
    }
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
