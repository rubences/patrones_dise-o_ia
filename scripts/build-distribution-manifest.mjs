import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { projectRoot } from './lib/editorial.mjs';

const bookDir = join(projectRoot, 'dist', 'book');
const sourceManifestPath = join(bookDir, 'manifest.json');
if (!existsSync(sourceManifestPath)) {
  throw new Error('Falta dist/book/manifest.json. Ejecuta primero scripts/build-book.mjs');
}

const sourceManifest = JSON.parse(readFileSync(sourceManifestPath, 'utf8'));
const baseName = sourceManifest.output.replace(/\.md$/i, '');
const formats = [
  { format: 'html', file: `${baseName}.html` },
  { format: 'epub', file: `${baseName}.epub` },
  { format: 'pdf', file: `${baseName}.pdf` },
];

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

const artifacts = formats.map(({ format, file }) => {
  const path = join(bookDir, file);
  if (!existsSync(path)) throw new Error(`Falta artefacto distribuible: ${file}`);
  const sizeBytes = statSync(path).size;
  if (sizeBytes < 1024) throw new Error(`Artefacto sospechosamente pequeño: ${file} (${sizeBytes} bytes)`);
  return { format, file, sizeBytes, sha256: sha256(path) };
});

const manifest = {
  schemaVersion: 1,
  title: 'Patrones de Diseño para Sistemas de Inteligencia Artificial',
  sourceManuscript: sourceManifest.output,
  sourceManuscriptSha256: sourceManifest.manuscriptSha256,
  patternCount: sourceManifest.patternCount,
  familyCount: sourceManifest.familyCount,
  commitSha: process.env.GITHUB_SHA ?? sourceManifest.commitSha ?? null,
  renderer: {
    name: 'Quarto',
    version: process.env.QUARTO_VERSION ?? null,
    pdfEngine: 'Typst',
  },
  artifacts,
};

writeFileSync(join(bookDir, 'distribution-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`Distribution artifacts: ${artifacts.map((a) => `${a.format}:${a.sizeBytes}`).join(' | ')}`);
console.log(`Source manuscript SHA-256: ${manifest.sourceManuscriptSha256}`);
