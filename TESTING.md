# Repair validation

## Covered locally

- Planning: the reporter's rogue inventory (Tir ×3, Ral ×3), all priorities zero, produces a valid upgrade-backed plan. Both embedded LP solver and deterministic fallback are exercised.
- Empty inventories still return no plan. Explicit positive priorities remain dominant; slot/class constraints and item limits are checked across all eight classes.
- All 19 crafting recipes, class guides, rune identities, names, icons, effects, active flags and gem data are preserved. Only intended rarity/type display labels changed.
- DOM: initialization, eight class buttons, zero-score result rendering, all four tabs and source dialog.
- Pixel regression: synthetic five-rune strips at three scales check automatic detection, grid matching, quantities and blank-image handling. The reporter's separate actual screenshot also passes both automatic and selected 5×1 grid: 安姆 ×1、艾斯 ×2、伊司 ×2、提尔 ×1、塔尔(S15) ×1. Combined automatic+grid pixel execution is approximately 3 seconds locally (not an end-to-end browser timing).
- All executable inline scripts parse successfully.

## Sources for terminology

- https://cloudstorage.d2core.com/data/d4/73552/rune_zhCN.json
- https://www.d2core.com/assets/index-C7WfUOAq.js
- https://www.d2core.com/assets/runeQuality.DFdZocNe.js
- https://www.d2core.com/assets/d4-data-rune.CDajoxzQ.js

S15 display quality is 「符文」, not inferred 「暗金」. The source's 44 rune IDs match the calculator's active set. Absence of the other 20 from that snapshot is not proof that they are disabled in the game; the UI now states this distinction.

## Browser coverage still required

The real Chromium desktop/mobile test script is included, but could not launch in this execution environment because local IPC socket creation was unavailable and the approved launch path had an infrastructure mount error. DOM checks do not establish rendered visual layout or browser Worker/WASM behavior. Browser retest should cover 1440 px, 390 px and 360 px widths, image upload, automatic/grid recognition, changing images during processing, dialog close/reopen, confirmation and duplicate import prevention.

No production deployment is part of this repair branch.

## Original screenshot regression

The private input is not bundled in this public repository. Supply its local path:

```sh
node tests/vision-regression.cjs /path/to/test_input.png
```

Input SHA-256: `83d62fda3702fcd31aa9bc0a6a6fa0e945fbda8facc92ef3749fafec65649565`. No visible stack digit is presented as a provisional quantity of 1 requiring review, not a confidently read digit. Recognition does not auto-select imports.
