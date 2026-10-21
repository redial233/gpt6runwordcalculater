# 暗黑破坏神 IV S15 符文之语计算器

国际服简体中文，适配手机和电脑的单文件网页。

## 使用

通过 GitHub Pages 打开，或下载 `index.html` 后用浏览器打开。计算与截图识别在本机运行，无需服务器或 API Key；图标、OCR 引擎和字库均已内嵌。

支持截图导入与手动库存、八职业推荐、合成路线、缺料清单、组合分配、旧插孔建议及符文图鉴。截图识别结果需手动确认后入库。推荐按可调整的推荐分数与材料消耗计算，不等同于实际 DPS 最优。

数据来源、版本与第三方许可在网页内列出。非暴雪官方产品。


## 修复说明（2026-10-21）

- 独角兽主题：浅紫云水配色与内嵌头像，保留离线单文件。
- 分配计算：0 分为中立优先级，不再排除；同分优先制作件数，再减少合成消耗。
- 数据标签：使用暗黑核「仪祭符文」「S15 地狱馈赠」；S15 符文不臆标暗金；旧符文不再断言为已停用。
- 截图识别：本地模板匹配与数量识别；导入前仍须人工确认。具体识别覆盖与测试限制见 TESTING.md。

## 回归测试

需要 Node.js。无额外依赖的检查：

```sh
node tests/engine.test.cjs
node tests/data.test.cjs
```

浏览器检查脚本 `tests/ui.test.cjs` 使用 Playwright 与 Chromium，可验证桌面/手机尺寸及分配、标签页、弹窗流程。先安装 Playwright，并按本机情况设置 CHROMIUM_PATH。

DOM 检查使用 linkedom 与 @napi-rs/canvas；像素识别回归使用 @napi-rs/canvas：

```sh
npm install --no-save linkedom @napi-rs/canvas
node tests/dom.test.cjs
node tests/vision-regression.cjs
```
