import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import catalog from '../catalog/patterns.json' with {type:'json'};
import {patternDiagramRegistry,patternSourceOverview} from '../web/scripts/pattern-archify-registry.mjs';
test('one uniquely named Archify HTML per canonical pattern',()=>{
 const all=patternDiagramRegistry();
 assert.equal(all.length,365);
 assert.equal(new Set(all.map(x=>x.output)).size,365);
 assert.deepEqual(all.map(x=>x.patternId).sort((a,b)=>a-b),catalog.patterns.map(p=>p.id).sort((a,b)=>a-b));
 for(const p of catalog.patterns)assert.ok(existsSync(p.sourceFile),p.sourceFile);
});
test('generated schematic explicitly discloses non-vetted scope and sources',()=>{
 const curated=new Set(patternDiagramRegistry().filter(x=>!x.generated).map(x=>x.patternId));
 for(const p of catalog.patterns.filter(p=>!curated.has(p.id)&&![2,3,4,5].includes(p.id))){
  const d=patternSourceOverview(p,'a'.repeat(40));
  assert.equal(d.diagram_type,'workflow');
  assert.equal(d.nodes.length,5);
  assert.equal(d.edges.length,4);
  assert.ok(d.cards.some(c=>c.items.some(t=>t.includes('esquemático'))));
  for(const n of d.nodes)assert.equal(n.sources[0].path,p.sourceFile);
 }
});

test('four source-reviewed flows reflect distinct code paths and limitations',()=>{
 for(const id of [2,3,4,5]){
  const p=catalog.patterns.find(p=>p.id===id),d=patternSourceOverview(p,'a'.repeat(40));
  assert.ok(d.nodes.length>=5);
  assert.ok(d.edges.length>=4);
  assert.ok(d.cards.some(c=>c.items.some(t=>t.includes(p.sourceFile))));
  assert.ok(d.meta.title.includes('contrastado con código'));
 }
 const router=patternSourceOverview(catalog.patterns.find(p=>p.id===2),'a'.repeat(40));
 assert.ok(router.edges.some(e=>e.to==='human'));
 const reflection=patternSourceOverview(catalog.patterns.find(p=>p.id===3),'a'.repeat(40));
 assert.ok(reflection.cards.some(c=>c.items.some(t=>t.includes('fijadas'))));
 const evaluator=patternSourceOverview(catalog.patterns.find(p=>p.id===4),'a'.repeat(40));
 assert.ok(evaluator.edges.some(e=>e.from==='limit'&&e.to==='critic'));
 const tools=patternSourceOverview(catalog.patterns.find(p=>p.id===5),'a'.repeat(40));
 assert.ok(tools.cards.some(c=>c.items.some(t=>t.includes('simuladas'))));
});
