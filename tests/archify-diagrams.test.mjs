import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.cwd();
const manifest=await import(pathToFileURL(join(root,'web/src/data/archify-diagrams.mjs')).href);
const entries=manifest.curatedDiagrams;
test('pins Archify 3.2.0 to a full commit SHA',()=>{
 assert.equal(manifest.ARCHIFY_RELEASE_SHA,'208acba8d412335185b2056fedf54b3405df43fb');
});
test('curated diagrams are unique and safely named',()=>{
 assert.equal(entries.length,6);
 assert.deepEqual(entries.filter(x=>x.patternId).map(x=>x.patternId).sort((a,b)=>a-b),[1,25,53,60,82]);
 assert.equal(new Set(entries.map(x=>x.id)).size,entries.length);
 for(const item of entries){
  assert.match(item.output,/^[a-z0-9-]+\.html$/);
  assert.match(item.candidate,/^diagrams\/archify\/[a-z0-9.-]+\.json$/);
 }
});
test('authored diagrams cite sources and output portable HTML',()=>{
 for(const item of entries){
  const candidate=JSON.parse(readFileSync(join(root,item.candidate),'utf8'));
  assert.equal(candidate.diagram_type,item.type);
  assert.equal(candidate.meta.output,`dist/archify-build/${item.output}`);
  assert.equal(candidate.meta.locale,'es');
  assert.equal(candidate.meta.quality_profile,'showcase');
  assert.equal(candidate.meta.repository.url,'https://github.com/rubences/patrones_dise-o_ia');
  assert.match(candidate.meta.repository.revision,/^[a-f0-9]{40}$/);
  for(const element of candidate.components??candidate.nodes??[]){
   assert.ok(element.sources?.length>0,`${item.id}:${element.id} lacks source`);
   for(const source of element.sources){
    assert.ok(existsSync(join(root,source.path)),source.path);
    const lineCount=readFileSync(join(root,source.path),'utf8').trimEnd().split(/\r?\n/).length;
    assert.ok(Number.isInteger(source.line)&&source.line>=1,`Invalid source start: ${source.path}`);
    assert.ok(Number.isInteger(source.end_line)&&source.end_line<=lineCount,
      `Source range ${source.path} ends at ${source.end_line} but has ${lineCount} lines`);
   }
  }
 }
});
test('generation, iframe and SVG fallback are wired',()=>{
 const generator=readFileSync('scripts/build-archify-diagrams.mjs','utf8');
 const component=readFileSync('web/src/components/lab/ArchifyDiagram.astro','utf8');
 const page=readFileSync('web/src/pages/patterns/[slug].astro','utf8');
 assert.match(generator,/ARCHIFY_RELEASE_SHA/);
 assert.match(generator,/finalize/);
 assert.match(generator,/copyFileSync/);
 assert.match(component,/sandbox="allow-scripts allow-downloads allow-popups"/);
 assert.match(page,/PatternDiagram/);
 assert.match(page,/ArchifyDiagram/);
});
