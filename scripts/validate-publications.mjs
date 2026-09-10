import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { projectRoot, readTaxonomy } from './lib/editorial.mjs';

const taxonomy = readTaxonomy();
const paths = [
  join(projectRoot, 'publications', 'research-monograph-en', 'publication.json'),
  join(projectRoot, 'publications', 'teaching-manual-es', 'publication.json'),
];

const allowedStatus = new Set(['concept', 'proposal-development', 'draft', 'review', 'submitted', 'contracted', 'published']);
const requiredShared = new Set(['catalog', 'source-code', 'evidence-registry', 'taxonomy']);
const errors = [];
const publications = [];

for (const path of paths) {
  let publication;
  try {
    publication = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`No se puede leer/parsear ${path}: ${error.message}`);
    continue;
  }
  publications.push(publication);

  if (publication.schemaVersion !== 1) errors.push(`${publication.id ?? path}: schemaVersion debe ser 1`);
  if (typeof publication.id !== 'string' || publication.id.length < 5) errors.push(`${path}: id inválido`);
  if (typeof publication.title !== 'string' || publication.title.length < 20) errors.push(`${publication.id}: title insuficiente`);
  if (!['en', 'es'].includes(publication.language)) errors.push(`${publication.id}: language debe ser en o es`);
  if (!allowedStatus.has(publication.status)) errors.push(`${publication.id}: status no permitido (${publication.status})`);
  if (publication.derivativePolicy !== 'independent-editorial-work') errors.push(`${publication.id}: derivativePolicy debe declarar independencia editorial`);
  if (publication.rightsReview !== 'contract-review-required') errors.push(`${publication.id}: rightsReview debe exigir revisión contractual`);

  const shared = new Set(Array.isArray(publication.sharedSubstrate) ? publication.sharedSubstrate : []);
  for (const requirement of requiredShared) {
    if (!shared.has(requirement)) errors.push(`${publication.id}: sharedSubstrate no contiene ${requirement}`);
  }

  if (!Array.isArray(publication.audience) || publication.audience.length < 2) errors.push(`${publication.id}: audience insuficiente`);
  if (!Array.isArray(publication.publisherCandidates) || publication.publisherCandidates.length < 1) errors.push(`${publication.id}: sin publisherCandidates`);
  if (!Array.isArray(publication.chapters) || publication.chapters.length < 8) {
    errors.push(`${publication.id}: debe definir al menos 8 capítulos/módulos`);
    continue;
  }

  publication.chapters.forEach((chapter, index) => {
    const expected = index + 1;
    if (chapter.number !== expected) errors.push(`${publication.id}: capítulo ${index + 1} debe tener number=${expected}`);
    if (typeof chapter.title !== 'string' || chapter.title.length < 8) errors.push(`${publication.id}: título insuficiente en capítulo ${expected}`);
    if (typeof chapter.originalContribution !== 'string' || chapter.originalContribution.length < 40) errors.push(`${publication.id}: originalContribution insuficiente en capítulo ${expected}`);
    if (!Array.isArray(chapter.patternIds) || chapter.patternIds.length < 1) errors.push(`${publication.id}: capítulo ${expected} sin patternIds`);
    const ids = chapter.patternIds ?? [];
    if (new Set(ids).size !== ids.length) errors.push(`${publication.id}: patternIds duplicados en capítulo ${expected}`);
    for (const id of ids) {
      if (!Number.isInteger(id) || id < 1 || id > taxonomy.catalogSize) errors.push(`${publication.id}: patternId ${id} fuera de 1..${taxonomy.catalogSize}`);
    }
  });
}

if (publications.length === 2) {
  const [a, b] = publications;
  if (a.id === b.id) errors.push('Los IDs de publicación deben ser únicos');
  if (a.language === b.language) errors.push('La estrategia requiere una publicación EN y otra ES');
  if (a.notATranslationOf !== b.id || b.notATranslationOf !== a.id) errors.push('Ambas publicaciones deben declarar recíprocamente que no son traducciones');
  if (a.title.trim().toLowerCase() === b.title.trim().toLowerCase()) errors.push('Los títulos no pueden ser idénticos');

  const normalize = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const titlesA = new Set(a.chapters.map((chapter) => normalize(chapter.title)));
  for (const chapter of b.chapters) {
    if (titlesA.has(normalize(chapter.title))) errors.push(`Título de capítulo idéntico entre obras: ${chapter.title}`);
  }
}

if (errors.length > 0) {
  console.error('Publication architecture: FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

for (const publication of publications) {
  const uniquePatterns = new Set(publication.chapters.flatMap((chapter) => chapter.patternIds));
  console.log(`${publication.id}: ${publication.chapters.length} capítulos/módulos · ${uniquePatterns.size}/${taxonomy.catalogSize} patrones seleccionados · ${publication.status}`);
}
console.log('Publication architecture: PASS');
