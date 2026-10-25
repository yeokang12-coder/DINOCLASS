# Workspace Rules / 项目工作规范

## 核心开发流程规范 (Mandatory Workflow)
- **先出计划，确认后执行**：在进行任何代码修改、文件编辑或功能改动前，必须先向用户提供清晰的 **Planning（改动方案与计划）**。
- **用户同意后方可执行**：只有在用户明确回复“同意”、“确认”或给出进一步修改意见后，才能开始调用工具修改文件或执行改动代码。

## 跨平台双端兼容规范 (Android & iOS/iPadOS Mandatory Compatibility)
以后的所有新功能开发、皮肤设计与代码修改，必须默认同时适配 **Android（如小米平板，Chromium 内核）** 与 **iOS/iPadOS（如 iPad，WebKit 内核）**：
1. **SVG 与弹性布局尺寸规范**：
   - 所有新增或修改的 `<svg>` 标签必须显式声明 `width="100%" height="100%"` 及对应的 CSS 容器宽高约束，严禁省略宽高导致 iPad WebKit 触发 `300px` 默认尺寸撑爆容器。
   - 所有弹窗（`.modal-card`）及内部长列表必须配置 `max-height`、`overflow-y: auto`、`-webkit-overflow-scrolling: touch` 及底部关键操作按钮常驻（Sticky），确保在小米平板与 iPad 横屏/竖屏下均能完整显示与顺滑滑动。
2. **iOS/iPadOS WebKit 性能与图层防坑规范**：
   - 严禁在开启了 `transform-style: preserve-3d` 的容器内对子元素使用 `backdrop-filter`（会导致 iOS 背景渐变丢失变透明及 `z-index` 层级失效）；关键文字标签（如名字牌）必须使用实心不透明保底背景色。
   - 针对多恐龙同屏的滤镜（如 `drop-shadow`、`backdrop-filter`）与高频无限动画，需通过 `window.IS_IPAD_IOS` / `body.is-ipad-device` 对 iOS/iPadOS 进行自动减负保护，既确保 iPad 主线程不卡死、60FPS 流畅运行，又保证安卓平板（小米平板）与 PC 端 100% 保留完整华丽特效。
3. **双端触控零延迟交互**：
   - 所有按钮、页签及可点击元素必须保持 `touch-action: manipulation; -webkit-tap-highlight-color: transparent;` 及快速触控响应，杜绝 iOS 双击缩放延迟或滚动容器吞点击。
4. **缓存版本号同步升级**：
   - 每次修改 CSS 或 JS 文件后，必须同步递增 `index.html` 与 `service-worker.js` 中的资源版本号，确保 Android 与 iOS 双端无需手动清理浏览器数据即可加载最新代码。
