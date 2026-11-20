import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const home=readFileSync('web/src/pages/index.astro','utf8');
const catalog=readFileSync('web/src/pages/patterns/index.astro','utf8');
const detail=readFileSync('web/src/pages/patterns/[slug].astro','utf8');
const taxonomy=JSON.parse(readFileSync('catalog/taxonomy.json','utf8'));
test('homepage renders macrofamilies rather than all pattern cards',()=>{
 assert.match(home,/familyCards\.map/);
 assert.match(home,/family\.nameEs/);
 assert.doesNotMatch(home,/patterns\.map\(\(pattern\)/);
});
test('catalog groups every family from canonical taxonomy',()=>{
 assert.equal(taxonomy.families.length,42);
 assert.match(catalog,/taxonomy\.families\.map/);
 assert.match(catalog,/family\.items\.map/);
 assert.match(catalog,/data-family-section/);
});
test('deep links, search and visibility are wired',()=>{
 assert.match(catalog,/URLSearchParams\(window\.location\.search\)/);
 assert.match(catalog,/params\.get\('family'\)/);
 assert.match(catalog,/section\.hidden/);
 assert.match(detail,/encodeURIComponent\(entry\.data\.family\)/);
});
