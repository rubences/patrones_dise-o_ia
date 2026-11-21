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
 for(const p of catalog.patterns.filter(p=>!curated.has(p.id))){
  const d=patternSourceOverview(p,'a'.repeat(40));
  assert.equal(d.diagram_type,'workflow');
  assert.equal(d.nodes.length,5);
  assert.equal(d.edges.length,4);
  assert.ok(d.cards.some(c=>c.items.some(t=>t.includes('esquemático'))));
  for(const n of d.nodes)assert.equal(n.sources[0].path,p.sourceFile);
 }
});
