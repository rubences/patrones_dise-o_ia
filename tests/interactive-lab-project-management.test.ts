import test from 'node:test';
import assert from 'node:assert/strict';
import {newArchitecture,addPatternNode} from '../web/src/lib/lab/editor-operations.ts';
import {duplicateProject,renameProject,projectIsDirty} from '../web/src/lib/lab/project-management.ts';
const original=addPatternNode(newArchitecture('original','Mi arquitectura'),1,'Pipeline');
test('duplicate creates new project ID while preserving graph',()=>{
 const clone=duplicateProject(original,'copy_123','Mi arquitectura (copia)');
 assert.equal(clone.id,'copy_123');
 assert.equal(clone.title,'Mi arquitectura (copia)');
 assert.deepEqual(clone.nodes,original.nodes);
 assert.notEqual(clone.nodes,original.nodes);
 assert.equal(original.id,'original');
});
test('rename preserves graph and validates title',()=>{
 const renamed=renameProject(original,'Nuevo título');
 assert.equal(renamed.title,'Nuevo título');
 assert.equal(renamed.id,'original');
 assert.throws(()=>renameProject(original,'<script>'));
 assert.throws(()=>renameProject(original,' '.repeat(5)));
});
test('dirty check detects title, node and connection changes',()=>{
 assert.equal(projectIsDirty(original,structuredClone(original)),false);
 assert.equal(projectIsDirty(original,{...original,title:'Otro'}),true);
 assert.equal(projectIsDirty(original,{...original,nodes:[]}),true);
 assert.equal(projectIsDirty(null,original),true);
});
