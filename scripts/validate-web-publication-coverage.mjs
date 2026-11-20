import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const read=p=>JSON.parse(readFileSync(join(root,p),'utf8'));
const catalog=read('catalog/patterns.json');
const taxonomy=read('catalog/taxonomy.json');
const publications=['research-monograph-en','teaching-manual-es'].map(id=>read(`publications/${id}/publication.json`));
const errors=[];
const assert=(value,message)=>{if(!value)errors.push(message)};
assert(catalog.catalogSize===365,'Expected 365 canonical patterns');
assert(catalog.patterns.length===365,'Missing catalog entries');
assert(taxonomy.catalogSize===365,'Taxonomy out of sync');
assert(taxonomy.families.length===42,'Unexpected family count');
const all=new Set(catalog.patterns.map(p=>p.id));
const sheets=new Set(readdirSync(join(root,'content/patterns')).filter(name=>name.endsWith('.md')));
for(const p of catalog.patterns){
 const sheet=p.canonicalContent ?? [...sheets].find(name=>name.startsWith(String(p.id).padStart(3,'0')+'-'))?.replace(/^/,'content/patterns/');
 assert(!!sheet&&existsSync(join(root,sheet)),`Missing sheet ${p.id}`);
 assert(existsSync(join(root,p.sourceFile)),`Missing source ${p.id}`);
}
for(const pub of publications){
 const used=new Set(pub.chapters.flatMap(c=>c.patternIds));
 for(let id=341;id<=365;id++)assert(used.has(id),`${pub.id}: missing new pattern ${id}`);
 for(const id of used)assert(all.has(id),`${pub.id}: unknown pattern ${id}`);
 assert(pub.submissionReadiness.stage!=='submission-ready',`${pub.id}: do not infer submission readiness from catalog coverage`);
}
const page=readFileSync(join(root,'web/src/pages/patterns/index.astro'),'utf8');
assert(page.includes('masterCatalog.patterns'),'Web must derive cards from canonical catalog');
assert(!/122\/122|122 patrones/.test(page),'Stale web catalog count');
const readme=readFileSync(join(root,'README.md'),'utf8');
assert(readme.includes('365/365 implementaciones'),'README out of sync');
console.log(`Web/publications coverage: ${catalog.patterns.length} patterns; ${taxonomy.families.length} families; ${publications.length} publications; errors=${errors.length}`);
for(const error of errors)console.error('ERROR:',error);
if(errors.length)process.exitCode=1;
