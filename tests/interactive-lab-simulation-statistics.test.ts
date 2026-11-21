import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSimulationStatistics} from '../web/src/lib/lab/simulation-statistics.ts';
import {simulateArchitecture} from '../web/src/lib/lab/simulation.ts';
import {analyzeArchitecture} from '../web/src/lib/lab/structural-analysis.ts';
import {newArchitecture,addPatternNode,connectPatternNodes} from '../web/src/lib/lab/editor-operations.ts';
const ids=new Set([1,25,53]);
const graph=()=>{let a=newArchitecture('demo','Demo');for(const p of [1,25,53])a=addPatternNode(a,p,'Patrón '+p);a=connectPatternNodes(a,a.nodes[0].id,a.nodes[2].id,'data');a=connectPatternNodes(a,a.nodes[1].id,a.nodes[2].id,'control');return a};
test('statistics report wave sizes and edge kinds without time estimates',()=>{
 const g=graph(),s=simulateArchitecture(g,ids),a=analyzeArchitecture(g,ids);
 const r=buildSimulationStatistics(g,s,a);
 assert.deepEqual(r.waveSizes,[2,1]);assert.equal(r.nodeCount,3);assert.equal(r.edgeCount,2);
 assert.deepEqual(r.edgeKinds,[{kind:'control',count:1},{kind:'data',count:1}]);
 assert.equal(r.longestPathLength,2);assert.equal(r.executedModels,false);assert.equal(r.executedTools,false);
 assert.ok(!('latency' in r));assert.ok(!('cost' in r));
});
test('empty graph produces zero totals',()=>{
 const g=newArchitecture('empty','Vacío');const r=buildSimulationStatistics(g,simulateArchitecture(g,ids),analyzeArchitecture(g,ids));
 assert.deepEqual(r.edgeKinds,[]);assert.deepEqual(r.waveSizes,[]);assert.equal(r.nodeCount,0);
});
