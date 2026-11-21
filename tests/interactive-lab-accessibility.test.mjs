import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync('web/src/pages/lab/editor/index.astro','utf8');
test('editor offers an accessible node selector and remove control',()=>{
 for(const token of ['id="editor-selected-node"','id="editor-remove-node"','aria-label="Nodo para seleccionar"'])assert.ok(page.includes(token),token);
});
test('editor includes explicit keyboard and pointer help',()=>{
 assert.match(page,/Flechas/);
 assert.match(page,/Suprimir/);
 assert.match(page,/Arrastra/);
});
test('selection uses textContent and does not inject HTML',()=>{
 assert.match(page,/selectedNode/);
 assert.doesNotMatch(page,/innerHTML\s*=/);
});
