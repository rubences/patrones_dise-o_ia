import test from 'node:test';
import assert from 'node:assert/strict';
import {createHistory,commitHistory,undoHistory,redoHistory} from '../web/src/lib/lab/editor-history.ts';
import {newArchitecture,addPatternNode} from '../web/src/lib/lab/editor-operations.ts';
const base=newArchitecture('demo','Demo');
test('undo and redo restore complete architecture snapshots',()=>{
 const a=addPatternNode(base,1,'Pipeline');
 let h=commitHistory(createHistory(base),a);
 assert.equal(h.present.nodes.length,1);
 h=undoHistory(h);assert.equal(h.present.nodes.length,0);
 h=redoHistory(h);assert.equal(h.present.nodes.length,1);
});
test('new edit clears redo history',()=>{
 const a=addPatternNode(base,1,'Pipeline');
 let h=undoHistory(commitHistory(createHistory(base),a));
 h=commitHistory(h,addPatternNode(base,25,'RAG'));
 assert.equal(h.future.length,0);
});
test('history caps undo snapshots',()=>{
 let h=createHistory(base);
 for(let i=0;i<75;i++)h=commitHistory(h,{...base,title:'V'+i});
 assert.equal(h.past.length,50);
});
