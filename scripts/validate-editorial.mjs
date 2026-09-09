import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const expectedCatalogSize = 102;
const errors = [];
const warnings = [];

const sourceFiles = readdirSync(join(root, 'src'))
  .filter((name) => /^pattern_\d+_.*\.ts$/.test(name));

const sourceIds = sourceFiles
  .map((name) => Number(name.match(/^pattern_(\d+)_/)?.[1]))
  .sort((a, b) => a - b);

if (sourceFiles.length !== expectedCatalogSize) {
  errors.push(`Expected ${expectedCatalogSize} pattern source files, found ${sourceFiles.length}.`);
}

const duplicates = sourceIds.filter((id, index) => sourceIds.indexOf(id) !== index);
if (duplicates.length) errors.push(`Duplicate source IDs: ${[...new Set(duplicates)].join(', ')}`);

for (let id = 1; id <= expectedCatalogSize; id += 1) {
  if (!sourceIds.includes(id)) errors.push(`Missing source pattern ID ${id}.`);
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
}

const readme = readFileSync(join(root, 'README.md'), 'utf8');
if (/Mapa Completo de 99 Patrones/i.test(readme)) {
  warnings.push('README still contains the stale heading "Mapa Completo de 99 Patrones"; update it to 102 during editorial normalization.');
}

const legacyPlan = join(root, 'RESUMEN_EJECUTIVO_PLAN_ACCION.md');
if (existsSync(legacyPlan)) {
  warnings.push('RESUMEN_EJECUTIVO_PLAN_ACCION.md describes an earlier catalog stage; treat it as historical material, not current publication state.');
}

console.log(`Source implementations: ${sourceFiles.length}/${expectedCatalogSize}`);
console.log(`Canonical editorial sheets: ${markdownFiles.length}/${expectedCatalogSize}`);

for (const warning of warnings) console.warn(`WARN: ${warning}`);

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
} else {
  console.log('Editorial validation: PASS');
}
