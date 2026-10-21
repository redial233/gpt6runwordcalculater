const {chromium}=require('playwright');const assert=require('node:assert/strict');const path=require('node:path');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
for(const width of [1440,390,360]){const page=await browser.newPage({viewport:{width,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('file://'+path.resolve('index.html'));await page.waitForSelector('.word-card');
 await page.evaluate(()=>{state.classId='rogue';state.inventory={S15_Rune_Effect_Tir:3,S15_Rune_Effect_Ral:3};state.weights.rogue=Object.fromEntries(DATA.words.map(w=>[w.id,0]));renderAll();});await page.locator('#optimizeBtn').click();await page.waitForSelector('.plan-result');assert.match(await page.locator('#bestPlan').innerText(),/总分 0/);
 for(const tab of ['upgrade','sockets','codex','craft']){await page.locator(`[data-tab=${tab}]`).click();assert.ok(await page.locator('#tab-'+tab).isVisible());}
 await page.locator('#sourceBtn').click();assert.ok(await page.locator('#sourceDialog').isVisible());await page.locator('[data-close=sourceDialog]').click();assert.equal(await page.locator('#sourceDialog').isVisible(),false);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`horizontal overflow at ${width}`);assert.deepEqual(errors,[]);await page.screenshot({path:`/tmp/rune-ui-${width}.png`,fullPage:false});console.log('PASS UI',width);await page.close();}
await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
