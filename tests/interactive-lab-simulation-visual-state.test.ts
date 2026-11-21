import test from 'node:test';
import assert from 'node:assert/strict';
import {simulationNodeStates} from '../web/src/lib/lab/simulation-visual-state.ts';
import {newArchitecture,addPatternNode,connectPatternNodes} from '../web/src/lib/lab/editor-operations.ts';
import {simulateArchitecture} from '../web/src/lib/lab/simulation.ts';
import {analyzeArchitecture} from '../web/src/lib/lab/structural-analysis.ts';
const ids=new Set([1,25,53]);
const graph=(cyclic=false)=>{let a=newArchitecture('demo','Ejemplo');for(const p of [1,25,53])a=addPatternNode(a,p,'Patrón '+p);a=connectPatternNodes(a,a.nodes[0].id,a.nodes[1].id,'data');a=connectPatternNodes(a,a.nodes[1].id,a.nodes[2].id,'data');if(cyclic)a=connectPatternNodes(a,a.nodes[2].id,a.nodes[1].id,'control');return a};
test('wave selector highlights active nodes and longest structural path',()=>{
 const g=graph(),s=simulateArchitecture(g,ids),a=analyzeArchitecture(g,ids);
 const states=simulationNodeStates(g,s,a,2);
 assert.equal(states.get(g.nodes[0].id),'path');
 assert.equal(states.get(g.nodes[1].id),'active');
 assert.equal(states.get(g.nodes[2].id),'path');
});
test('blocked graph distinguishes cyclic from downstream blocked',()=>{
 const g=graph(true),s=simulateArchitecture(g,ids),a=analyzeArchitecture(g,ids);
 const states=simulationNodeStates(g,s,a,0);
 assert.equal(states.get(g.nodes[1].id),'cyclic');
 assert.equal(states.get(g.nodes[2].id),'cyclic');
});
test('invalid wave selection leaves structural path without active wave',()=>{
 const g=graph(),s=simulateArchitecture(g,ids),a=analyzeArchitecture(g,ids);
 const states=simulationNodeStates(g,s,a,999);
 assert.ok([...states.values()].every(v=>v!=='active'));
});
