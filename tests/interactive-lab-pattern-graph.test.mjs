import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPatternGraph} from '../web/src/lib/lab/pattern-graph.ts';
const main={patternId:1,slug:'main',title:'Main',summary:'Main summary',related:[2,2,999],combinesWith:[2,3]};
const all=[main,{patternId:2,slug:'two',title:'Two',summary:'two',related:[],combinesWith:[]},{patternId:3,slug:'three',title:'Three',summary:'three',related:[],combinesWith:[]}];
test('deduplicates relations, skips missing and retains edge types',()=>{
 const g=buildPatternGraph(main,all);
 assert.equal(g.nodes.length,3);
 assert.equal(g.edges.length,3);
 assert.deepEqual(g.edges.map(x=>x.kind),['related','combines-with','combines-with']);
 assert.equal(g.nodes[0].title,'Main');
});
test('handles isolated pattern',()=>{
 const g=buildPatternGraph({...main,related:[],combinesWith:[]},all);
 assert.equal(g.nodes.length,1);
 assert.deepEqual(g.edges,[]);
});
