import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const viewer=readFileSync('web/src/components/lab/PatternDiagram.astro','utf8');
const page=readFileSync('web/src/pages/patterns/[slug].astro','utf8');
test('viewer retains accessible static fallback',()=>{
 assert.match(viewer,/role="button"/);
 assert.match(viewer,/tabindex="0"/);
 assert.match(viewer,/lab-alternative/);
 assert.match(viewer,/aria-live="polite"/);
});
test('viewer exposes keyboard controls and bounded zoom',()=>{
 assert.match(viewer,/ArrowRight/);
 assert.match(viewer,/ArrowLeft/);
 assert.match(viewer,/Math\.max\(\.75,Math\.min\(2,/);
 assert.match(viewer,/data-zoom="reset"/);
});
test('pattern detail page embeds the viewer',()=>{
 assert.match(page,/<PatternDiagram graph=\{graph\}/);
});
