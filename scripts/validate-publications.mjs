import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { projectRoot, readTaxonomy } from './lib/editorial.mjs';

const taxonomy = readTaxonomy();
const publicationRoot = join(projectRoot, 'publications');
const paths = [
  join(publicationRoot, 'research-monograph-en', 'publication.json'),
  join(publicationRoot, 'teaching-manual-es', 'publication.json'),
];
const publisherRegistryPath = join(publicationRoot, 'common', 'publisher-submission-requirements.json');

const allowedStatus = new Set(['concept', 'proposal-development', 'draft', 'review', 'submitted', 'contracted', 'published']);
const allowedReadiness = new Set(['not-ready', 'proposal-draft', 'editor-contact-ready', 'submission-ready']);
const requiredShared = new Set(['catalog', 'source-code', 'evidence-registry', 'taxonomy']);
const errors = [];
const warnings = [];
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

  const readiness = publication.submissionReadiness;
  if (!readiness || !allowedReadiness.has(readiness.stage)) {
    errors.push(`${publication.id}: submissionReadiness.stage ausente o inválido`);
  } else {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(readiness.publisherRequirementsVerifiedOn ?? '')) {
      errors.push(`${publication.id}: publisherRequirementsVerifiedOn inválido`);
    }
    if (typeof readiness.dossier !== 'string' || !existsSync(join(publicationRoot, publication.id, readiness.dossier))) {
      errors.push(`${publication.id}: dossier de envío no existe (${readiness.dossier ?? 'missing'})`);
    }
    if (!Array.isArray(readiness.sampleChapters) || readiness.sampleChapters.length !== 2) {
      errors.push(`${publication.id}: deben existir exactamente dos capítulos muestra preparados`);
    } else {
      for (const sample of readiness.sampleChapters) {
        const samplePath = join(publicationRoot, publication.id, sample);
        if (!existsSync(samplePath)) errors.push(`${publication.id}: capítulo muestra inexistente ${sample}`);
        else if (readFileSync(samplePath, 'utf8').length < 4000) errors.push(`${publication.id}: capítulo muestra demasiado corto ${sample}`);
      }
    }
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

let publisherRegistry;
try {
  publisherRegistry = JSON.parse(readFileSync(publisherRegistryPath, 'utf8'));
} catch (error) {
  errors.push(`No se puede leer publisher-submission-requirements.json: ${error.message}`);
}

if (publisherRegistry) {
  if (publisherRegistry.schemaVersion !== 1) errors.push('publisher registry: schemaVersion debe ser 1');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publisherRegistry.verifiedOn ?? '')) errors.push('publisher registry: verifiedOn inválido');
  if (!Array.isArray(publisherRegistry.publishers) || publisherRegistry.publishers.length < 5) errors.push('publisher registry: deben documentarse al menos cinco rutas editoriales');

  const publisherIds = new Set();
  const publicationIds = new Set(publications.map((publication) => publication.id));
  for (const publisher of publisherRegistry.publishers ?? []) {
    if (publisherIds.has(publisher.id)) errors.push(`publisher registry: id duplicado ${publisher.id}`);
    publisherIds.add(publisher.id);
    if (!publicationIds.has(publisher.targetPublication)) errors.push(`${publisher.id}: targetPublication desconocida`);
    if (!Array.isArray(publisher.publiclyVerifiedRequirements) || publisher.publiclyVerifiedRequirements.length < 2) errors.push(`${publisher.id}: requisitos públicos insuficientes`);
    if (!Array.isArray(publisher.sources) || publisher.sources.length < 1 || publisher.sources.some((url) => !url.startsWith('https://'))) errors.push(`${publisher.id}: fuentes HTTPS inválidas`);
  }

  const rama = (publisherRegistry.publishers ?? []).find((publisher) => publisher.id === 'ra-ma');
  if (!rama || rama.sampleChapterRequirement !== '1-or-2-chapters') errors.push('RA-MA: el requisito público debe mantenerse como 1-or-2-chapters');

  const paraninfo = (publisherRegistry.publishers ?? []).find((publisher) => publisher.id === 'paraninfo');
  if (!paraninfo || paraninfo.sampleChapterRequirement !== 'confirm-with-editor-before-submission') errors.push('Paraninfo: no inventar un número público de capítulos muestra');

  if (publisherRegistry.reviewAfter && new Date() > new Date(`${publisherRegistry.reviewAfter}T23:59:59Z`)) {
    warnings.push(`Publisher requirements necesitan reverificación: reviewAfter=${publisherRegistry.reviewAfter}`);
  }
}

const matrixPath = join(publicationRoot, 'common', 'PUBLISHER_SUBMISSION_MATRIX.md');
const rightsPath = join(publicationRoot, 'common', 'CONTRACT_RIGHTS_GATE.md');
for (const requiredPath of [matrixPath, rightsPath]) {
  if (!existsSync(requiredPath) || readFileSync(requiredPath, 'utf8').length < 2500) errors.push(`Documento editorial requerido ausente o insuficiente: ${requiredPath}`);
}

const editorialText = [
  matrixPath,
  rightsPath,
  ...paths.map((path) => join(path, '..')),
].filter(Boolean);
void editorialText;

if (errors.length > 0) {
  console.error('Publication architecture: FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const publication of publications) {
  const uniquePatterns = new Set(publication.chapters.flatMap((chapter) => chapter.patternIds));
  console.log(`${publication.id}: ${publication.chapters.length} capítulos/módulos · ${uniquePatterns.size}/${taxonomy.catalogSize} patrones · ${publication.submissionReadiness.stage}`);
}
console.log(`Publisher routes: ${publisherRegistry?.publishers?.length ?? 0} · verified ${publisherRegistry?.verifiedOn ?? 'unknown'}`);
console.log('Publication architecture: PASS');
