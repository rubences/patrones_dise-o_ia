import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeArchitecture} from '../web/src/lib/lab/structural-analysis.ts';
import {newArchitecture,addPatternNode,connectPatternNodes} from '../web/src/lib/lab/editor-operations.ts';
const ids=new Set([1,25,53,60]);
const graph=(patterns:number[],links:[number,number][])=>{
 let g=newArchitecture('demo','Prueba');
 for(const p of patterns)g=addPatternNode(g,p,'Patrón '+p);
 for(const [a,b] of links)g=connectPatternNodes(g,g.nodes[a].id,g.nodes[b].id,'data');
 return g;
};
test('empty graph has zero structural depth',()=>{
 const r=analyzeArchitecture(graph([],[]),ids);
 assert.equal(r.status,'completed');assert.equal(r.longestPathLength,0);assert.deepEqual(r.longestPathNodeIds,[]);
});
test('longest dependency chain is deterministic and measured in nodes',()=>{
 const g=graph([1,25,53,60],[[0,1],[1,2],[0,3]]);
 const a=analyzeArchitecture(g,ids),b=analyzeArchitecture(g,ids);
 assert.deepEqual(a,b);assert.equal(a.longestPathLength,3);
 assert.deepEqual(a.longestPathNodeIds,[g.nodes[0].id,g.nodes[1].id,g.nodes[2].id]);
 assert.deepEqual(a.waveSizes,[1,2,1]);
});
test('parallel branches choose stable path on tie',()=>{
 const g=graph([1,25,53],[[0,1],[0,2]]);
 const r=analyzeArchitecture(g,ids);
 assert.equal(r.longestPathLength,2);
 assert.equal(r.longestPathNodeIds[1],[g.nodes[1].id,g.nodes[2].id].sort()[0]);
});
test('cycles are identified separately from downstream blocked nodes',()=>{
 const g=graph([1,25,53,60],[[0,1],[1,0],[1,2]]);
 const r=analyzeArchitecture(g,ids);
 assert.equal(r.status,'blocked');
 assert.deepEqual(r.cyclicNodeIds,[g.nodes[0].id,g.nodes[1].id].sort());
 assert.deepEqual(r.downstreamBlockedNodeIds,[g.nodes[2].id]);
 assert.equal(r.longestPathLength,null);
});
test('self-loop is reported as cyclic',()=>{
 const g=graph([1],[]);
 g.edges.push({id:'self',source:g.nodes[0].id,target:g.nodes[0].id,sourcePort:'out_data',targetPort:'in_data',kind:'data'});
 const r=analyzeArchitecture(g,ids);
 assert.deepEqual(r.cyclicNodeIds,[g.nodes[0].id]);
});
test('invalid graph returns no structural path',()=>{
 const g=graph([1],[]);g.nodes[0].patternId=999;
 const r=analyzeArchitecture(g,ids);
 assert.equal(r.status,'invalid');assert.equal(r.longestPathLength,null);
});
