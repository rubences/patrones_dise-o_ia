import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { demoteHeadings, projectRoot } from './lib/editorial.mjs';

const publicationsRoot = join(projectRoot, 'publications');
const outRoot = join(projectRoot, 'dist', 'submissions');
const raMaOut = join(outRoot, 'ra-ma');
const springerOut = join(outRoot, 'springer-nature');
mkdirSync(raMaOut, { recursive: true });
mkdirSync(springerOut, { recursive: true });

const read = (...parts) => readFileSync(join(publicationsRoot, ...parts), 'utf8').trim();
const readJson = (...parts) => JSON.parse(read(...parts));
const sha256 = (text) => createHash('sha256').update(text).digest('hex');

const teachingManifest = readJson('teaching-manual-es', 'publication.json');
const researchManifest = readJson('research-monograph-en', 'publication.json');
const publisherRegistry = readJson('common', 'publisher-submission-requirements.json');
const blockerRegistry = readJson('common', 'submission-blockers.json');
const figureLedger = readJson('common', 'FIGURE_RIGHTS_LEDGER.json');
const springerFields = readJson('research-monograph-en', 'submissions', 'springer-nature', 'form-fields.json');
const raMaFields = readJson('teaching-manual-es', 'submissions', 'ra-ma', 'form-fields.json');

const raMaRequirements = publisherRegistry.publishers.find((publisher) => publisher.id === 'ra-ma');
if (!raMaRequirements || raMaRequirements.sampleChapterRequirement !== '1-or-2-chapters') {
  throw new Error('RA-MA submission requirements are missing or stale');
}

const raMaPackage = read('teaching-manual-es', 'submissions', 'ra-ma', 'PAQUETE_EVALUACION.md');
const teachingSamples = teachingManifest.submissionReadiness.sampleChapters.map((sample) => read('teaching-manual-es', ...sample.split('/')));
if (teachingSamples.length !== 2) throw new Error('RA-MA package requires exactly two prepared samples');

const raMaYaml = `---\ntitle: "${teachingManifest.title}"\nsubtitle: "Paquete de evaluación editorial · RA-MA"\nauthor: "Rubén Juárez Cádiz"\nlang: es\ndate: "2026-09-10"\nformat:\n  typst:\n    toc: true\n    section-numbering: "1.1"\n    papersize: a4\n    margin:\n      x: 2.1cm\n      y: 2.1cm\n---`;

const raMaManuscript = [
  raMaYaml,
  demoteHeadings(raMaPackage, 1),
  '# Anexo I — Capítulo muestra: Tool Use y Function Calling',
  demoteHeadings(teachingSamples[0], 1),
  '# Anexo II — Capítulo muestra: RAG de extremo a extremo',
  demoteHeadings(teachingSamples[1], 1),
].join('\n\n') + '\n';

const raMaMd = join(raMaOut, 'ra-ma-evaluation-package.md');
writeFileSync(raMaMd, raMaManuscript, 'utf8');

const springerBookIdea = read('research-monograph-en', 'submissions', 'springer-nature', 'BOOK_IDEA.md');
const springerMaster = `# Springer Nature — Book Idea submission master\n\n` +
  `> Generated from the publisher-specific source. Re-check the live Submit your Book Idea form before external submission.\n\n` +
  demoteHeadings(springerBookIdea, 1) + '\n';
const springerMd = join(springerOut, 'springer-book-idea-master.md');
writeFileSync(springerMd, springerMaster, 'utf8');

const summarizeFields = (form) => ({
  total: form.fields.length,
  ready: form.fields.filter((field) => field.status === 'ready').length,
  open: form.fields.filter((field) => field.status === 'open').length,
  manualEntry: form.fields.filter((field) => field.status === 'manual-entry').length,
});

const buildReadiness = (publication, form) => {
  const blockers = blockerRegistry.blockers.filter((blocker) => blocker.publicationId === publication.id && blocker.status === 'open');
  const figures = figureLedger.figures.filter((figure) => figure.publicationIds.includes(publication.id));
  return {
    publicationId: publication.id,
    stage: publication.submissionReadiness.stage,
    blockers: {
      totalOpen: blockers.length,
      critical: blockers.filter((blocker) => blocker.severity === 'critical').length,
      major: blockers.filter((blocker) => blocker.severity === 'major').length,
      minor: blockers.filter((blocker) => blocker.severity === 'minor').length,
      items: blockers.map(({ id, field, severity, resolutionCondition }) => ({ id, field, severity, resolutionCondition })),
    },
    formFields: summarizeFields(form),
    figures: {
      total: figures.length,
      cleared: figures.filter((figure) => figure.status === 'cleared').length,
      planned: figures.filter((figure) => figure.status === 'planned').length,
      permissionRequired: figures.filter((figure) => figure.status === 'permission-required').length,
    },
    submissionReady: publication.submissionReadiness.stage === 'submission-ready' &&
      blockers.every((blocker) => blocker.severity !== 'critical') &&
      form.fields.every((field) => field.status !== 'open') &&
      figures.every((figure) => figure.status === 'cleared'),
  };
};

const readinessReport = {
  schemaVersion: 1,
  generatedAt: process.env.SOURCE_DATE_EPOCH ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString() : null,
  commitSha: process.env.GITHUB_SHA ?? null,
  policy: 'fail-closed',
  publicSafe: true,
  publications: [
    buildReadiness(researchManifest, springerFields),
    buildReadiness(teachingManifest, raMaFields),
  ],
};
writeFileSync(join(outRoot, 'submission-readiness-report.json'), JSON.stringify(readinessReport, null, 2) + '\n', 'utf8');

const readinessMd = [
  '# Submission Readiness Report',
  '',
  '> Generated from public-safe metadata. No private contact data is stored in this report.',
  '',
  ...readinessReport.publications.flatMap((entry) => [
    `## ${entry.publicationId}`,
    '',
    `- Stage: **${entry.stage}**`,
    `- Open blockers: ${entry.blockers.totalOpen} (critical ${entry.blockers.critical}, major ${entry.blockers.major}, minor ${entry.blockers.minor})`,
    `- Form fields: ${entry.formFields.ready} ready · ${entry.formFields.open} open · ${entry.formFields.manualEntry} manual-private`,
    `- Figures: ${entry.figures.cleared}/${entry.figures.total} cleared`,
    `- Submission-ready gate: **${entry.submissionReady ? 'PASS' : 'BLOCKED'}**`,
    '',
    ...entry.blockers.items.map((blocker) => `- [${blocker.severity.toUpperCase()}] ${blocker.id} · ${blocker.field}: ${blocker.resolutionCondition}`),
    '',
  ]),
].join('\n');
writeFileSync(join(outRoot, 'SUBMISSION_READINESS_REPORT.md'), readinessMd + '\n', 'utf8');

const manifest = {
  schemaVersion: 2,
  generatedAt: readinessReport.generatedAt,
  commitSha: process.env.GITHUB_SHA ?? null,
  publisherRequirementsVerifiedOn: publisherRegistry.verifiedOn,
  readinessReport: 'dist/submissions/submission-readiness-report.json',
  packages: [
    {
      publisher: 'RA-MA',
      publicationId: teachingManifest.id,
      source: 'publications/teaching-manual-es/submissions/ra-ma/PAQUETE_EVALUACION.md',
      outputMarkdown: 'dist/submissions/ra-ma/ra-ma-evaluation-package.md',
      expectedPdf: 'dist/submissions/ra-ma/ra-ma-evaluation-package.pdf',
      sampleCount: teachingSamples.length,
      maxPdfBytes: 30 * 1024 * 1024,
      sourceSha256: sha256(raMaManuscript),
    },
    {
      publisher: 'Springer Nature',
      publicationId: researchManifest.id,
      source: 'publications/research-monograph-en/submissions/springer-nature/BOOK_IDEA.md',
      outputMarkdown: 'dist/submissions/springer-nature/springer-book-idea-master.md',
      sampleCount: researchManifest.submissionReadiness.sampleChapters.length,
      sourceSha256: sha256(springerMaster),
    },
  ],
};

writeFileSync(join(outRoot, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`Submission packages: ${manifest.packages.length}`);
for (const entry of readinessReport.publications) {
  console.log(`${entry.publicationId}: ${entry.stage} · critical blockers=${entry.blockers.critical} · fields ready/open/manual=${entry.formFields.ready}/${entry.formFields.open}/${entry.formFields.manualEntry}`);
}
console.log(`RA-MA: ${teachingSamples.length} samples · source ${manifest.packages[0].sourceSha256}`);
console.log(`Springer Nature: book idea master · source ${manifest.packages[1].sourceSha256}`);
