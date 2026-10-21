const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
const data=JSON.parse(scripts[0]);
function engine(withSolver){const ctx={console,setTimeout,clearTimeout};ctx.window=ctx;ctx.self=ctx;vm.createContext(ctx);if(withSolver)vm.runInContext(scripts[4],ctx);vm.runInContext(scripts[5],ctx);return ctx.makeEngine(data);}
const rune=en=>data.runes.find(r=>r.en===en&&r.active).id;
for(const solver of [false,true]){
 const E=engine(solver),inventory={[rune('Tir')]:3,[rune('Ral')]:3};
 const output=E.optimize('rogue',inventory,{},true);
 assert.ok(output.results.length,'zero priorities must yield a plan');
 assert.equal(output.results[0].score,0);assert.ok(output.results[0].chosen.length>0);
 for(const r of output.results){assert.ok(r.plan.ok);for(const n of Object.values(r.plan.remaining))assert.ok(n>=0);}
 assert.equal(E.optimize('rogue',{},{}).results.length,0);
 const rich=Object.fromEntries(data.runes.map(r=>[r.id,100]));for(const g of data.gems)rich[g.id]=100;
 const weights=Object.fromEntries(data.words.map(w=>[w.id,w.id==='insight'?100:0]));
 const preferred=E.optimize('rogue',rich,weights,false,1).results[0];assert.equal(preferred.score,100);assert.equal(preferred.chosen[0].word,'insight');
 for(const cls of data.classes){const result=E.optimize(cls.id,rich,{},false,2).results[0];assert.ok(result);assert.equal(result.chosen.length,2);assert.ok(E.compatible([result.chosen[0]],result.chosen[1],cls.id));}
 for(const w of data.words){const demand=E.needWord(w);assert.ok(E.plan(demand,demand,false).ok);assert.equal(E.maximum(demand,demand,false),1);}
 console.log(`PASS: ${solver?'embedded LP solver':'deterministic fallback'} zero priority, empty stock, explicit priority, all classes, recipes`);
}
