// npm install --no-save linkedom @napi-rs/canvas
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {parseHTML}=require('linkedom'),{createCanvas,Image}=require('@napi-rs/canvas');
const html=fs.readFileSync('index.html','utf8'),{window}=parseHTML(html);
const {document}=window;const selectValues=new WeakMap();
Object.defineProperty(window.HTMLSelectElement.prototype,'value',{get(){return selectValues.has(this)?selectValues.get(this):this.querySelector('option[selected]')?.value||this.querySelector('option')?.value||''},set(v){selectValues.set(this,String(v))},configurable:true});
window.HTMLElement.prototype.showModal=function(){this.open=true};window.HTMLElement.prototype.close=function(){this.open=false;this.dispatchEvent(new window.Event('close'))};
const canvases=new WeakMap();window.HTMLCanvasElement.prototype.getContext=function(type){if(!canvases.has(this))canvases.set(this,createCanvas(this.width||300,this.height||150));return canvases.get(this).getContext(type)};
const ctx={document,window,Image,console,setTimeout,clearTimeout,TextDecoder,TextEncoder,URL,Blob,Response,Uint8Array,Uint8ClampedArray,localStorage:{getItem:()=>null,setItem:()=>{}},navigator:{},confirm:()=>false};
ctx.self=ctx;vm.createContext(ctx);const scripts=[...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
for(const i of [4,5,6,7])vm.runInContext(scripts[i],ctx);
(async()=>{
assert.equal(document.querySelectorAll('.class-btn').length,8);assert.ok(document.querySelectorAll('.word-card').length>0);
vm.runInContext("state.classId='rogue';state.inventory={S15_Rune_Effect_Tir:3,S15_Rune_Effect_Ral:3};state.weights.rogue=Object.fromEntries(DATA.words.map(w=>[w.id,0]));renderAll();",ctx);
await document.getElementById('optimizeBtn').onclick();assert.match(document.getElementById('bestPlan').textContent,/总分 0/);
for(const tab of ['upgrade','sockets','codex','craft']){vm.runInContext(`setTab('${tab}')`,ctx);assert.equal(document.getElementById('tab-'+tab).hidden,false);}
// Editing must keep the original row/button alive through blur, so the
// following click is not swallowed and a filter cannot trigger nested render.
const tir='S15_Rune_Effect_Tir';
let input=document.querySelector(`[data-quantity="${tir}"]`),row=input.closest('.inventory-row'),plus=row.querySelector('[data-delta="1"]');
input.value='5';input.dispatchEvent(new window.Event('input',{bubbles:true}));
assert.equal(vm.runInContext(`state.inventory['${tir}']`,ctx),5);
input.dispatchEvent(new window.Event('change',{bubbles:true}));
assert.equal(document.querySelector(`[data-quantity="${tir}"]`),input);
assert.ok(plus.isConnected,'blur commit must not remove the pending click target');
plus.dispatchEvent(new window.Event('click',{bubbles:true}));
assert.equal(vm.runInContext(`state.inventory['${tir}']`,ctx),6);assert.equal(+input.value,6);
row.querySelector('[data-delta="-1"]').dispatchEvent(new window.Event('click',{bubbles:true}));assert.equal(+input.value,5);
// A filter can safely remove the row; an already queued change must not render.
vm.runInContext("let quantityRenderCalls=0;const originalRenderInventory=renderInventory;renderInventory=()=>{quantityRenderCalls++;return originalRenderInventory();};",ctx);
input.dispatchEvent(new window.Event('change',{bubbles:true}));assert.equal(vm.runInContext('quantityRenderCalls',ctx),0);
document.getElementById('invSearch').value='拉';document.getElementById('invSearch').dispatchEvent(new window.Event('input',{bubbles:true}));
assert.equal(vm.runInContext(`state.inventory['${tir}']`,ctx),5);
document.getElementById('invSearch').value='';document.getElementById('invSearch').dispatchEvent(new window.Event('input',{bubbles:true}));
assert.equal(document.querySelectorAll('.inventory-row').length,44);
assert.equal(+document.querySelector(`[data-quantity="${tir}"]`).value,5);
console.log('PASS quantity DOM: live save, stable blur target, +/−, non-rendering change, filter restore');
vm.runInContext('showSources()',ctx);
assert.equal(document.getElementById('sourceDialog').open,true);
console.log('PASS DOM: initialization, 8 classes, zero-priority rendering, all tabs, source dialog');
})().catch(e=>{console.error(e);process.exit(1)});
