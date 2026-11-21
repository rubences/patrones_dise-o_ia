import test from 'node:test';
import assert from 'node:assert/strict';
import {simulateArchitecture} from '../web/src/lib/lab/simulation.ts';
import {newArchitecture,addPatternNode,connectPatternNodes} from '../web/src/lib/lab/editor-operations.ts';
const known=new Set([1,25,53]);
const graph=(ids:number[],edges:[number,number][]=[])=>{
 let g=newArchitecture('demo','Simulación');
 for(const id of ids)g=addPatternNode(g,id,'Patrón '+id);
 for(const [a,b] of edges)g=connectPatternNodes(g,g.nodes[a].id,g.nodes[b].id,'data');
 return g;
};
test('empty graph yields reproducible empty trace',()=>{
 const a=simulateArchitecture(graph([]),known);
 assert.equal(a.status,'completed');assert.deepEqual(a.steps,[]);assert.deepEqual(a.waves,[]);
});
test('independent nodes share a wave and are ordered deterministically',()=>{
 const g=graph([53,1,25]);const a=simulateArchitecture(g,known),b=simulateArchitecture(g,known);
 assert.deepEqual(a,b);assert.equal(a.status,'completed');assert.equal(a.waves.length,1);
 assert.deepEqual(a.waves[0].nodeIds,[...g.nodes.map(n=>n.id)].sort());
});
test('dependencies create successive waves with stable trace',()=>{
 const g=graph([1,25,53],[[0,1],[1,2]]);
 const r=simulateArchitecture(g,known);
 assert.equal(r.status,'completed');assert.equal(r.waves.length,3);
 assert.deepEqual(r.steps.map(x=>x.patternId),[1,25,53]);
 assert.deepEqual(r.steps.map(x=>x.kind),['simulated','simulated','simulated']);
});
test('cycle is blocked and lists unresolved nodes',()=>{
 const g=graph([1,25],[[0,1],[1,0]]);
 const r=simulateArchitecture(g,known);
 assert.equal(r.status,'blocked');assert.equal(r.steps.length,0);
 assert.deepEqual(r.blockedNodeIds,[...g.nodes.map(n=>n.id)].sort());
 assert.ok(r.issues.some(x=>x.includes('ciclo')));
});
test('invalid graph fails closed without executing',()=>{
 const g=graph([1]);g.nodes[0].patternId=999;
 const r=simulateArchitecture(g,known);
 assert.equal(r.status,'invalid');assert.equal(r.steps.length,0);
});
test('fan-out and fan-in wait for all predecessors',()=>{
 const g=graph([1,25,53],[[0,2],[1,2]]);
 const r=simulateArchitecture(g,known);
 assert.equal(r.status,'completed');assert.equal(r.waves.length,2);
 assert.equal(r.waves[0].nodeIds.length,2);assert.equal(r.waves[1].nodeIds.length,1);
});
