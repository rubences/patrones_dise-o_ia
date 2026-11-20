import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const taxonomy = JSON.parse(readFileSync(join(root, 'catalog', 'taxonomy.json'), 'utf8'));
const masterCatalog = JSON.parse(readFileSync(join(root, 'catalog', 'patterns.json'), 'utf8'));
const expectedCatalogSize = taxonomy.catalogSize;
const errors = [];
const warnings = [];

const familyIds = new Set(taxonomy.families.map((family) => family.id));
const legacyGroupIds = new Set(taxonomy.legacyGroups.map((group) => group.id));

if (!Number.isInteger(expectedCatalogSize) || expectedCatalogSize < 1) errors.push('taxonomy.json: catalogSize inválido.');
if (masterCatalog.catalogSize !== expectedCatalogSize) errors.push(`patterns.json catalogSize must be ${expectedCatalogSize}.`);
if (!Array.isArray(masterCatalog.patterns) || masterCatalog.patterns.length !== expectedCatalogSize) errors.push(`patterns.json must contain exactly ${expectedCatalogSize} pattern records.`);

const sourceFiles = readdirSync(join(root, 'src')).filter((name) => /^pattern_\d+_.*\.ts$/.test(name));
const sourceIds = sourceFiles.map((name) => Number(name.match(/^pattern_(\d+)_/)?.[1])).sort((a,b)=>a-b);
if (sourceFiles.length !== expectedCatalogSize) errors.push(`Expected ${expectedCatalogSize} pattern source files, found ${sourceFiles.length}.`);
for (let id=1; id<=expectedCatalogSize; id+=1) if (!sourceIds.includes(id)) errors.push(`Missing source pattern ID ${id}.`);
const duplicateSourceIds = sourceIds.filter((id,index)=>sourceIds.indexOf(id)!==index);
if (duplicateSourceIds.length) errors.push(`Duplicate source IDs: ${[...new Set(duplicateSourceIds)].join(', ')}`);

const catalogIds=new Set(), catalogSlugs=new Set(), catalogById=new Map();
for (const record of masterCatalog.patterns ?? []) {
  if (!Number.isInteger(record.id) || record.id<1 || record.id>expectedCatalogSize) { errors.push(`patterns.json: invalid pattern id ${record.id}.`); continue; }
  if (catalogIds.has(record.id)) errors.push(`patterns.json: duplicate pattern id ${record.id}.`);
  catalogIds.add(record.id); catalogById.set(record.id,record);
  if (!/^[a-z0-9-]+$/.test(record.slug ?? '')) errors.push(`patterns.json pattern ${record.id}: invalid slug ${record.slug}.`);
  else if (catalogSlugs.has(record.slug)) errors.push(`patterns.json: duplicate slug ${record.slug}.`); else catalogSlugs.add(record.slug);
  if (!familyIds.has(record.family)) errors.push(`patterns.json pattern ${record.id}: unknown family ${record.family}.`);
  if (!legacyGroupIds.has(record.legacyGroup)) errors.push(`patterns.json pattern ${record.id}: unknown legacyGroup ${record.legacyGroup}.`);
  if (record.implementationStatus !== 'implemented') errors.push(`patterns.json pattern ${record.id}: implementationStatus must be implemented.`);
  if (!['catalogued','draft','review','published'].includes(record.editorialStatus)) errors.push(`patterns.json pattern ${record.id}: invalid editorialStatus ${record.editorialStatus}.`);
  if (!['verified','partially-verified','needs-review'].includes(record.evidenceStatus)) errors.push(`patterns.json pattern ${record.id}: invalid evidenceStatus ${record.evidenceStatus}.`);
  if (!record.sourceFile || !existsSync(join(root,record.sourceFile))) errors.push(`patterns.json pattern ${record.id}: sourceFile does not exist (${record.sourceFile ?? 'missing'}).`);
  else if (Number(record.sourceFile.match(/pattern_(\d+)_/)?.[1]) !== record.id) errors.push(`patterns.json pattern ${record.id}: sourceFile ID mismatch.`);
}
for(let id=1;id<=expectedCatalogSize;id+=1) if(!catalogIds.has(id)) errors.push(`patterns.json: missing catalog pattern ID ${id}.`);

const contentDir=join(root,'content','patterns');
const markdownFiles=existsSync(contentDir)?readdirSync(contentDir).filter(name=>name.endsWith('.md')):[];
const editorialIds=new Set(), editorialSlugs=new Set();
for(const filename of markdownFiles){
  const text=readFileSync(join(contentDir,filename),'utf8');
  const patternId=Number(text.match(/^patternId:\s*(\d+)\s*$/m)?.[1]);
  const slug=text.match(/^slug:\s*([a-z0-9-]+)\s*$/m)?.[1];
  const sourceFile=text.match(/^sourceFile:\s*(.+)\s*$/m)?.[1]?.trim();
  const evidenceStatus=text.match(/^evidenceStatus:\s*(.+)\s*$/m)?.[1]?.trim();
  const master=catalogById.get(patternId);
  if(!Number.isInteger(patternId)||patternId<1||patternId>expectedCatalogSize) errors.push(`${filename}: invalid or missing patternId.`);
  else if(editorialIds.has(patternId)) errors.push(`${filename}: duplicate patternId ${patternId}.`); else editorialIds.add(patternId);
  if(!slug) errors.push(`${filename}: invalid or missing slug.`); else if(editorialSlugs.has(slug)) errors.push(`${filename}: duplicate slug ${slug}.`); else editorialSlugs.add(slug);
  if(!sourceFile||!existsSync(join(root,sourceFile))) errors.push(`${filename}: sourceFile does not resolve (${sourceFile ?? 'missing'}).`);
  if(!['verified','partially-verified','needs-review'].includes(evidenceStatus ?? '')) errors.push(`${filename}: invalid evidenceStatus.`);
  if(!master) errors.push(`${filename}: patternId ${patternId} missing from patterns.json.`);
  else { if(master.slug!==slug) errors.push(`${filename}: slug mismatch (${master.slug}).`); if(master.sourceFile!==sourceFile) errors.push(`${filename}: sourceFile mismatch (${master.sourceFile}).`); }
}
if(markdownFiles.length!==expectedCatalogSize) errors.push(`Expected ${expectedCatalogSize} canonical Markdown sheets, found ${markdownFiles.length}.`);
for(const record of masterCatalog.patterns ?? []) if(record.editorialStatus==='published'&&!editorialIds.has(record.id)) errors.push(`patterns.json pattern ${record.id} declares published but has no canonical sheet.`);

const readme=readFileSync(join(root,'README.md'),'utf8');
if(/Mapa Completo de 99 Patrones/i.test(readme)||/\{1\.\.99\}/.test(readme)) errors.push('README contains stale 99-pattern publication state.');
const stateRe=new RegExp(`${expectedCatalogSize}\\/${expectedCatalogSize}\\s+implementaciones`,'i');
const sheetsRe=new RegExp(`${expectedCatalogSize}\\/${expectedCatalogSize}\\s+fichas canónicas`,'i');
if(!stateRe.test(readme)||!sheetsRe.test(readme)) errors.push(`README must declare ${expectedCatalogSize}/${expectedCatalogSize} implementations and canonical sheets.`);

const summaryPath=join(root,'RESUMEN_EJECUTIVO_PLAN_ACCION.md');
if(!existsSync(summaryPath)) errors.push('RESUMEN_EJECUTIVO_PLAN_ACCION.md is required.');
else {
  const summary=readFileSync(summaryPath,'utf8');
  if(!new RegExp(`${expectedCatalogSize}\\/${expectedCatalogSize}`).test(summary)) errors.push(`Executive summary must reflect ${expectedCatalogSize}/${expectedCatalogSize}.`);
  if(!new RegExp(`Macrofamilias\\s*\\|\\s*\\*\\*${taxonomy.families.length}\\*\\*`,'i').test(summary)) warnings.push('Executive summary macrofamily count could not be verified by table regex.');
}

console.log(`Source implementations: ${sourceFiles.length}/${expectedCatalogSize}`);
console.log(`Master catalog records: ${catalogIds.size}/${expectedCatalogSize}`);
console.log(`Canonical editorial sheets: ${markdownFiles.length}/${expectedCatalogSize}`);
console.log(`Editorial families: ${taxonomy.families.length}`);
for(const warning of warnings) console.warn(`WARN: ${warning}`);
if(errors.length){for(const error of errors)console.error(`ERROR: ${error}`);process.exitCode=1;}else console.log('Editorial validation: PASS');
