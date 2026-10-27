import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { projectRoot } from './lib/editorial.mjs';

const root = join(projectRoot, 'publications');
const errors = [];
const publicationIds = ['research-monograph-en', 'teaching-manual-es'];
const severitySet = new Set(['critical', 'major', 'minor']);
const blockerStatusSet = new Set(['open', 'resolved']);
const fieldStatusSet = new Set(['ready', 'open', 'manual-entry']);
const sensitivitySet = new Set(['public', 'manual-private']);
const figureStatusSet = new Set(['planned', 'cleared', 'permission-required']);
const figureSourceSet = new Set(['original', 'repo-derived', 'third-party']);

const readJson = (path) => {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch (error) { errors.push(`No se puede leer ${path}: ${error.message}`); return null; }
};

const requiredDocs = [
  'common/AUTHOR_PROFILE.md',
  'common/SUBMISSION_READINESS_POLICY.md',
  'common/SUBMISSION_DATA_POLICY.md',
  'common/CONTRACT_RIGHTS_GATE.md',
];
for (const relative of requiredDocs) {
  const path = join(root, relative);
  if (!existsSync(path) || readFileSync(path, 'utf8').length < 500) errors.push(`Documento de readiness ausente/insuficiente: ${relative}`);
}

const blockersRegistry = readJson(join(root, 'common', 'submission-blockers.json'));
const figureLedger = readJson(join(root, 'common', 'FIGURE_RIGHTS_LEDGER.json'));
const publications = new Map();
for (const id of publicationIds) publications.set(id, readJson(join(root, id, 'publication.json')));

if (blockersRegistry) {
  if (blockersRegistry.schemaVersion !== 1) errors.push('submission-blockers: schemaVersion debe ser 1');
  const ids = new Set();
  for (const blocker of blockersRegistry.blockers ?? []) {
    if (ids.has(blocker.id)) errors.push(`Blocker duplicado: ${blocker.id}`);
    ids.add(blocker.id);
    if (!publicationIds.includes(blocker.publicationId)) errors.push(`${blocker.id}: publicationId desconocida`);
    if (!severitySet.has(blocker.severity)) errors.push(`${blocker.id}: severity inválida`);
    if (!blockerStatusSet.has(blocker.status)) errors.push(`${blocker.id}: status inválido`);
    if (typeof blocker.field !== 'string' || blocker.field.length < 3) errors.push(`${blocker.id}: field inválido`);
    if (typeof blocker.reason !== 'string' || blocker.reason.length < 30) errors.push(`${blocker.id}: reason insuficiente`);
    if (typeof blocker.resolutionCondition !== 'string' || blocker.resolutionCondition.length < 30) errors.push(`${blocker.id}: resolutionCondition insuficiente`);
    if (blocker.publicSafe !== true) errors.push(`${blocker.id}: blockers versionados deben ser publicSafe=true`);
  }
}

if (figureLedger) {
  if (figureLedger.schemaVersion !== 1) errors.push('FIGURE_RIGHTS_LEDGER: schemaVersion debe ser 1');
  const ids = new Set();
  for (const figure of figureLedger.figures ?? []) {
    if (ids.has(figure.figureId)) errors.push(`Figura duplicada: ${figure.figureId}`);
    ids.add(figure.figureId);
    if (!figureSourceSet.has(figure.sourceType)) errors.push(`${figure.figureId}: sourceType inválido`);
    if (!figureStatusSet.has(figure.status)) errors.push(`${figure.figureId}: status inválido`);
    if (!Array.isArray(figure.publicationIds) || figure.publicationIds.length < 1 || figure.publicationIds.some((id) => !publicationIds.includes(id))) errors.push(`${figure.figureId}: publicationIds inválidas`);
    if (figure.sourceType === 'third-party' && figure.status === 'cleared' && (!figure.license || figure.license.length < 5)) errors.push(`${figure.figureId}: third-party cleared sin licencia documentada`);
  }
}

const formMaps = [
  ['research-monograph-en', 'submissions/springer-nature/form-fields.json'],
  ['teaching-manual-es', 'submissions/ra-ma/form-fields.json'],
];
const fieldStats = new Map();
for (const [publicationId, relative] of formMaps) {
  const form = readJson(join(root, publicationId, relative));
  if (!form) continue;
  if (form.schemaVersion !== 1 || form.publicationId !== publicationId) errors.push(`${relative}: identidad/schema inválidos`);
  const keys = new Set();
  const stats = { ready: 0, open: 0, manual: 0 };
  for (const field of form.fields ?? []) {
    if (keys.has(field.key)) errors.push(`${relative}: field key duplicada ${field.key}`);
    keys.add(field.key);
    if (!fieldStatusSet.has(field.status)) errors.push(`${relative}/${field.key}: status inválido`);
    if (!sensitivitySet.has(field.sensitivity)) errors.push(`${relative}/${field.key}: sensitivity inválida`);
    if (field.status === 'manual-entry') {
      stats.manual += 1;
      if (field.sensitivity !== 'manual-private' || field.sourcePath !== null) errors.push(`${relative}/${field.key}: manual-entry debe ser manual-private y sourcePath=null`);
    } else {
      stats[field.status] += 1;
      if (typeof field.sourcePath !== 'string' || !existsSync(join(projectRoot, field.sourcePath))) errors.push(`${relative}/${field.key}: sourcePath inexistente (${field.sourcePath ?? 'missing'})`);
      if (field.sensitivity !== 'public') errors.push(`${relative}/${field.key}: campo versionado debe ser public`);
    }
  }
  if (stats.ready < 5) errors.push(`${relative}: menos de cinco campos ready`);
  fieldStats.set(publicationId, stats);
}

for (const publicationId of publicationIds) {
  const publication = publications.get(publicationId);
  if (!publication) continue;
  const stage = publication.submissionReadiness?.stage;
  const blockers = (blockersRegistry?.blockers ?? []).filter((b) => b.publicationId === publicationId && b.status === 'open');
  const critical = blockers.filter((b) => b.severity === 'critical');
  const figures = (figureLedger?.figures ?? []).filter((f) => f.publicationIds.includes(publicationId));
  const unclearedFigures = figures.filter((f) => f.status !== 'cleared');
  const stats = fieldStats.get(publicationId) ?? { ready: 0, open: 0, manual: 0 };

  if (stage === 'submission-ready') {
    if (critical.length > 0) errors.push(`${publicationId}: submission-ready con ${critical.length} blockers críticos abiertos`);
    if (stats.open > 0) errors.push(`${publicationId}: submission-ready con ${stats.open} campos públicos abiertos`);
    if (unclearedFigures.length > 0) errors.push(`${publicationId}: submission-ready con ${unclearedFigures.length} figuras no cleared`);
  }
  if (publication.status === 'submitted') {
    const record = join(root, publicationId, 'SUBMISSION_RECORD.json');
    if (!existsSync(record)) errors.push(`${publicationId}: status=submitted requiere SUBMISSION_RECORD.json`);
  }
}

if (errors.length > 0) {
  console.error('Submission readiness: FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

for (const publicationId of publicationIds) {
  const publication = publications.get(publicationId);
  const blockers = (blockersRegistry?.blockers ?? []).filter((b) => b.publicationId === publicationId && b.status === 'open');
  const critical = blockers.filter((b) => b.severity === 'critical').length;
  const major = blockers.filter((b) => b.severity === 'major').length;
  const minor = blockers.filter((b) => b.severity === 'minor').length;
  const stats = fieldStats.get(publicationId) ?? { ready: 0, open: 0, manual: 0 };
  console.log(`${publicationId}: ${publication?.submissionReadiness?.stage} · blockers C/M/m=${critical}/${major}/${minor} · fields ready/open/manual=${stats.ready}/${stats.open}/${stats.manual}`);
}
console.log('Submission readiness: PASS');
