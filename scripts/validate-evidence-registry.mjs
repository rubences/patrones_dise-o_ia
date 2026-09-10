import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { projectRoot, readTaxonomy } from './lib/editorial.mjs';

const taxonomy = readTaxonomy();
const registry = JSON.parse(readFileSync(join(projectRoot, 'catalog', 'references.json'), 'utf8'));
const mapping = JSON.parse(readFileSync(join(projectRoot, 'catalog', 'pattern-evidence.json'), 'utf8'));

const errors = [];
const allowedTypes = new Set(['paper', 'standard', 'government-guidance', 'official-documentation']);
const referenceIds = new Set();

if (registry.schemaVersion !== 1) errors.push('references.json: schemaVersion debe ser 1');
if (!/^\d{4}-\d{2}-\d{2}$/.test(registry.verifiedOn ?? '')) errors.push('references.json: verifiedOn inválido');
if (!Array.isArray(registry.references)) errors.push('references.json: references debe ser array');

for (const ref of registry.references ?? []) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(ref.id ?? '')) errors.push(`ID de referencia inválido: ${ref.id}`);
  if (referenceIds.has(ref.id)) errors.push(`Referencia duplicada: ${ref.id}`);
  referenceIds.add(ref.id);
  if (!allowedTypes.has(ref.type)) errors.push(`${ref.id}: type no permitido (${ref.type})`);
  if (typeof ref.title !== 'string' || ref.title.length < 12) errors.push(`${ref.id}: title insuficiente`);
  if (typeof ref.authors !== 'string' || ref.authors.length < 3) errors.push(`${ref.id}: authors ausente`);
  if (!Number.isInteger(ref.year) || ref.year < 1950 || ref.year > 2100) errors.push(`${ref.id}: year inválido`);
  if (typeof ref.venue !== 'string' || ref.venue.length < 2) errors.push(`${ref.id}: venue ausente`);
  if (!/^https:\/\//.test(ref.url ?? '')) errors.push(`${ref.id}: URL debe usar HTTPS`);
  if (ref.primary !== true) errors.push(`${ref.id}: la referencia no está marcada como primaria/oficial`);
}

const patternIds = new Set();
for (const entry of mapping.patterns ?? []) {
  if (!Number.isInteger(entry.patternId) || entry.patternId < 1 || entry.patternId > taxonomy.catalogSize) {
    errors.push(`patternId fuera de catálogo: ${entry.patternId}`);
  }
  if (patternIds.has(entry.patternId)) errors.push(`patternId duplicado en evidence map: ${entry.patternId}`);
  patternIds.add(entry.patternId);
  if (!Array.isArray(entry.references) || entry.references.length === 0) errors.push(`Pattern ${entry.patternId}: sin referencias`);
  if (new Set(entry.references).size !== entry.references.length) errors.push(`Pattern ${entry.patternId}: referencias duplicadas`);
  for (const refId of entry.references ?? []) {
    if (!referenceIds.has(refId)) errors.push(`Pattern ${entry.patternId}: referencia inexistente ${refId}`);
  }
  if (typeof entry.scopeNote !== 'string' || entry.scopeNote.length < 60) errors.push(`Pattern ${entry.patternId}: scopeNote insuficiente`);
}

if (errors.length > 0) {
  console.error('Evidence registry: FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Primary references: ${referenceIds.size}`);
console.log(`Patterns with verified primary evidence: ${patternIds.size}/${taxonomy.catalogSize}`);
console.log('Evidence registry: PASS');
