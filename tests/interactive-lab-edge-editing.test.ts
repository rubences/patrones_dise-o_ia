import test from 'node:test';
import assert from 'node:assert/strict';
import {newArchitecture,addPatternNode,connectPatternNodes,removePatternEdge} from '../web/src/lib/lab/editor-operations.ts';
import {validateArchitecture} from '../web/src/lib/lab/architecture-validation.ts';
test('removing one connection preserves nodes and other connections',()=>{
 let a=newArchitecture('demo','Ejemplo');a=addPatternNode(a,1,'Pipeline');a=addPatternNode(a,25,'RAG');
 a=connectPatternNodes(a,a.nodes[0].id,a.nodes[1].id,'data');a=connectPatternNodes(a,a.nodes[0].id,a.nodes[1].id,'control');
 const id=a.edges[0].id;a=removePatternEdge(a,id);
 assert.equal(a.nodes.length,2);assert.equal(a.edges.length,1);assert.equal(a.edges[0].kind,'control');
 assert.equal(validateArchitecture(a,new Set([1,25])).ok,true);
});
test('removing nonexistent connection is a no-op',()=>{const a=newArchitecture('demo','Ejemplo');assert.deepEqual(removePatternEdge(a,'missing'),a)});
