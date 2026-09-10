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
const sha256 = (text) => createHash('sha256').update(text).digest('hex');

const teachingManifest = JSON.parse(read('teaching-manual-es', 'publication.json'));
const researchManifest = JSON.parse(read('research-monograph-en', 'publication.json'));
const publisherRegistry = JSON.parse(read('common', 'publisher-submission-requirements.json'));

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

const manifest = {
  schemaVersion: 1,
  generatedAt: process.env.SOURCE_DATE_EPOCH ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString() : null,
  commitSha: process.env.GITHUB_SHA ?? null,
  publisherRequirementsVerifiedOn: publisherRegistry.verifiedOn,
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
console.log(`RA-MA: ${teachingSamples.length} samples · source ${manifest.packages[0].sourceSha256}`);
console.log(`Springer Nature: book idea master · source ${manifest.packages[1].sourceSha256}`);
