import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync('web/src/pages/lab/editor/index.astro','utf8');
const lab=readFileSync('web/src/pages/lab/index.astro','utf8');
test('editor uses canonical 365-pattern palette and local persistence',()=>{
 assert.match(page,/catalog\.patterns\.map/);
 assert.match(page,/createIndexedDbProjectStorage/);
 assert.match(page,/validateArchitecture/);
});
test('editor exposes add, connect, save, load, import and export',()=>{
 for(const id of ['editor-add','editor-connect','editor-save','editor-load','editor-import','editor-export','editor-delete','editor-svg'])assert.ok(page.includes(id),id);
});
test('editor is discoverable from lab',()=>assert.match(lab,/lab\/editor\//));
test('diagram labels use textContent, never unsafe HTML',()=>{assert.match(page,/text\.textContent/);assert.doesNotMatch(page,/innerHTML\s*=/)});
