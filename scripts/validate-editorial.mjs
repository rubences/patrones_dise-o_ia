import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const expectedCatalogSize = 102;
const errors = [];
const warnings = [];

const taxonomy = JSON.parse(readFileSync(join(root, 'catalog', 'taxonomy.json'), 'utf8'));
const masterCatalog = JSON.parse(readFileSync(join(root, 'catalog', 'patterns.json'), 'utf8'));
const familyIds = new Set(taxonomy.families.map((family) => family.id));
const legacyGroupIds = new Set(taxonomy.legacyGroups.map((group) => group.id));

if (taxonomy.catalogSize !== expectedCatalogSize) {
  errors.push(`taxonomy.json catalogSize must be ${expectedCatalogSize}.`);
}
if (masterCatalog.catalogSize !== expectedCatalogSize) {
  errors.push(`patterns.json catalogSize must be ${expectedCatalogSize}.`);
}
if (!Array.isArray(masterCatalog.patterns) || masterCatalog.patterns.length !== expectedCatalogSize) {
  errors.push(`patterns.json must contain exactly ${expectedCatalogSize} pattern records.`);
}

const sourceFiles = readdirSync(join(root, 'src'))
  .filter((name) => /^pattern_\d+_.*\.ts$/.test(name));
const sourceIds = sourceFiles
  .map((name) => Number(name.match(/^pattern_(\d+)_/)?.[1]))
  .sort((a, b) => a - b);

if (sourceFiles.length !== expectedCatalogSize) {
  errors.push(`Expected ${expectedCatalogSize} pattern source files, found ${sourceFiles.length}.`);
}

const duplicateSourceIds = sourceIds.filter((id, index) => sourceIds.indexOf(id) !== index);
if (duplicateSourceIds.length) {
  errors.push(`Duplicate source IDs: ${[...new Set(duplicateSourceIds)].join(', ')}`);
}
for (let id = 1; id <= expectedCatalogSize; id += 1) {
  if (!sourceIds.includes(id)) errors.push(`Missing source pattern ID ${id}.`);
}

const catalogIds = new Set();
const catalogSlugs = new Set();
const catalogById = new Map();

for (const record of masterCatalog.patterns ?? []) {
  if (!Number.isInteger(record.id) || record.id < 1 || record.id > expectedCatalogSize) {
    errors.push(`patterns.json: invalid pattern id ${record.id}.`);
    continue;
  }
  if (catalogIds.has(record.id)) errors.push(`patterns.json: duplicate pattern id ${record.id}.`);
  catalogIds.add(record.id);
  catalogById.set(record.id, record);

  if (!/^[a-z0-9-]+$/.test(record.slug ?? '')) {
    errors.push(`patterns.json pattern ${record.id}: invalid slug ${record.slug}.`);
  } else if (catalogSlugs.has(record.slug)) {
    errors.push(`patterns.json: duplicate slug ${record.slug}.`);
  } else {
    catalogSlugs.add(record.slug);
  }

  if (!familyIds.has(record.family)) {
    errors.push(`patterns.json pattern ${record.id}: unknown family ${record.family}.`);
  }
  if (!legacyGroupIds.has(record.legacyGroup)) {
    errors.push(`patterns.json pattern ${record.id}: unknown legacyGroup ${record.legacyGroup}.`);
  }
  if (record.implementationStatus !== 'implemented') {
    errors.push(`patterns.json pattern ${record.id}: implementationStatus must be implemented.`);
  }
  if (!['catalogued', 'draft', 'review', 'published'].includes(record.editorialStatus)) {
    errors.push(`patterns.json pattern ${record.id}: invalid editorialStatus ${record.editorialStatus}.`);
  }
  if (!['verified', 'partially-verified', 'needs-review'].includes(record.evidenceStatus)) {
    errors.push(`patterns.json pattern ${record.id}: invalid evidenceStatus ${record.evidenceStatus}.`);
  }
  if (!record.sourceFile || !existsSync(join(root, record.sourceFile))) {
    errors.push(`patterns.json pattern ${record.id}: sourceFile does not exist (${record.sourceFile ?? 'missing'}).`);
  } else {
    const sourceId = Number(record.sourceFile.match(/pattern_(\d+)_/)?.[1]);
    if (sourceId !== record.id) {
      errors.push(`patterns.json pattern ${record.id}: sourceFile points to pattern ${sourceId}.`);
    }
  }
}

for (let id = 1; id <= expectedCatalogSize; id += 1) {
  if (!catalogIds.has(id)) errors.push(`patterns.json: missing catalog pattern ID ${id}.`);
}

const contentDir = join(root, 'content', 'patterns');
const markdownFiles = existsSync(contentDir)
  ? readdirSync(contentDir).filter((name) => name.endsWith('.md'))
  : [];
const editorialIds = new Set();
const editorialSlugs = new Set();

for (const filename of markdownFiles) {
  const path = join(contentDir, filename);
  const text = readFileSync(path, 'utf8');
  const patternId = Number(text.match(/^patternId:\s*(\d+)\s*$/m)?.[1]);
  const slug = text.match(/^slug:\s*([a-z0-9-]+)\s*$/m)?.[1];
  const sourceFile = text.match(/^sourceFile:\s*(.+)\s*$/m)?.[1]?.trim();
  const evidenceStatus = text.match(/^evidenceStatus:\s*(.+)\s*$/m)?.[1]?.trim();
  const master = catalogById.get(patternId);

  if (!Number.isInteger(patternId) || patternId < 1 || patternId > expectedCatalogSize) {
    errors.push(`${filename}: invalid or missing patternId.`);
  } else if (editorialIds.has(patternId)) {
    errors.push(`${filename}: duplicate patternId ${patternId}.`);
  } else {
    editorialIds.add(patternId);
  }

  if (!slug) {
    errors.push(`${filename}: invalid or missing slug.`);
  } else if (editorialSlugs.has(slug)) {
    errors.push(`${filename}: duplicate slug ${slug}.`);
  } else {
    editorialSlugs.add(slug);
  }

  if (!sourceFile || !existsSync(join(root, sourceFile))) {
    errors.push(`${filename}: sourceFile does not resolve to an existing file (${sourceFile ?? 'missing'}).`);
  }
  if (!['verified', 'partially-verified', 'needs-review'].includes(evidenceStatus ?? '')) {
    errors.push(`${filename}: invalid or missing evidenceStatus.`);
  }

  if (!master) {
    errors.push(`${filename}: patternId ${patternId} does not exist in patterns.json.`);
  } else {
    if (master.slug !== slug) errors.push(`${filename}: slug does not match patterns.json (${master.slug}).`);
    if (master.sourceFile !== sourceFile) errors.push(`${filename}: sourceFile does not match patterns.json (${master.sourceFile}).`);
  }
}

// Publication status is derived from canonical Markdown presence. This avoids
// duplicating mutable publication state in both patterns.json and content/.
const publishedIds = new Set(editorialIds);
for (const record of masterCatalog.patterns ?? []) {
  if (record.editorialStatus === 'published' && !publishedIds.has(record.id)) {
    errors.push(`patterns.json pattern ${record.id} declares published but has no canonical Markdown sheet.`);
  }
}

const readme = readFileSync(join(root, 'README.md'), 'utf8');
if (/Mapa Completo de 99 Patrones/i.test(readme)) {
  warnings.push('README still contains the stale heading "Mapa Completo de 99 Patrones"; normalize it to 102 before publication release.');
}

const legacyPlan = join(root, 'RESUMEN_EJECUTIVO_PLAN_ACCION.md');
if (existsSync(legacyPlan)) {
  warnings.push('RESUMEN_EJECUTIVO_PLAN_ACCION.md describes an earlier catalog stage; treat it as historical material, not current publication state.');
}

console.log(`Source implementations: ${sourceFiles.length}/${expectedCatalogSize}`);
console.log(`Master catalog records: ${catalogIds.size}/${expectedCatalogSize}`);
console.log(`Canonical editorial sheets: ${markdownFiles.length}/${expectedCatalogSize}`);
console.log(`Published editorial sheets: ${publishedIds.size}`);

for (const warning of warnings) console.warn(`WARN: ${warning}`);

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
} else {
  console.log('Editorial validation: PASS');
}
