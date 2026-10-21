const {chromium}=require('playwright');const assert=require('node:assert/strict');const path=require('node:path');const fs=require('node:fs');fs.mkdirSync('test-results',{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,headless:true,args:['--no-sandbox']});
for(const width of [1440,390,360]){const page=await browser.newPage({viewport:{width,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('file://'+path.resolve('index.html'));await page.waitForSelector('.word-card');await page.evaluate(()=>Promise.all([...document.images].map(im=>im.decode().catch(()=>{}))));assert.equal(await page.locator('.class-emblem img').count(),8);assert.ok(await page.evaluate(()=>[...document.querySelectorAll('.class-emblem img,.hero-art img')].every(im=>im.naturalWidth>0)));await page.screenshot({path:`test-results/unicorn-${width}.png`});
 await page.evaluate(()=>{state.classId='rogue';state.inventory={S15_Rune_Effect_Tir:3,S15_Rune_Effect_Ral:3};state.weights.rogue=Object.fromEntries(DATA.words.map(w=>[w.id,0]));renderAll();});await page.locator('#optimizeBtn').click();await page.waitForSelector('.plan-result');assert.match(await page.locator('#bestPlan').innerText(),/总分 0/);
 const tir='S15_Rune_Effect_Tir',qty=page.locator(`[data-quantity="${tir}"]`);
 await page.locator('#invSearch').fill('提尔');await qty.fill('5');
 await page.locator(`[data-delta="1"][data-id="${tir}"]`).click();assert.equal(await qty.inputValue(),'6');
 await page.locator(`[data-delta="-1"][data-id="${tir}"]`).click();assert.equal(await qty.inputValue(),'5');
 await qty.fill('3');await qty.focus();
 // Trigger filtering while the edited control still has focus, matching report B.
 await page.evaluate(()=>{const search=document.getElementById('invSearch');search.value='拉';search.dispatchEvent(new Event('input',{bubbles:true}));});
 await page.locator('#invSearch').fill('');assert.equal(await page.locator('.inventory-row').count(),44);assert.equal(await qty.inputValue(),'3');
 assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('d4-s15-runeworkshop-v1')).inventory[id],tir),3);
 for(const tab of ['upgrade','sockets','codex','craft']){await page.locator(`[data-tab=${tab}]`).click();assert.ok(await page.locator('#tab-'+tab).isVisible());}
 await page.locator('#sourceBtn').click();assert.ok(await page.locator('#sourceDialog').isVisible());await page.locator('[data-close=sourceDialog]').click();assert.equal(await page.locator('#sourceDialog').isVisible(),false);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`horizontal overflow at ${width}`);assert.deepEqual(errors,[]);await page.screenshot({path:`test-results/rune-ui-${width}.png`,fullPage:false});console.log('PASS UI',width);await page.close();}
await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
