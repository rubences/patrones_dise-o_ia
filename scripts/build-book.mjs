import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { demoteHeadings, projectRoot, readCanonicalPatterns, readTaxonomy } from './lib/editorial.mjs';

const config = JSON.parse(readFileSync(join(projectRoot, 'book', 'book.config.json'), 'utf8'));
const taxonomy = readTaxonomy();
const patterns = readCanonicalPatterns();
if (patterns.length !== taxonomy.catalogSize) {
  throw new Error(`El manuscrito exige ${taxonomy.catalogSize} patrones; encontrados ${patterns.length}`);
}

const frontmatterDir = join(projectRoot, 'book', 'frontmatter');
const frontmatter = readdirSync(frontmatterDir)
  .filter((name) => name.endsWith('.md'))
  .sort()
  .map((name) => readFileSync(join(frontmatterDir, name), 'utf8').trim())
  .join('\n\n');

const byFamily = new Map(taxonomy.families.map((family) => [family.id, []]));
for (const pattern of patterns) {
  const bucket = byFamily.get(pattern.data.family);
  if (!bucket) throw new Error(`${pattern.filename}: familia no incluida en taxonomy.json`);
  bucket.push(pattern);
}

const parts = taxonomy.families.map((family, familyIndex) => {
  const chapters = byFamily.get(family.id).map((pattern) => {
    const id = String(pattern.data.patternId).padStart(3, '0');
    const metadata = `> **Familia:** ${family.nameEs} · **Nivel:** ${pattern.data.level} · **Dificultad:** ${pattern.data.difficulty} · **Evidencia:** ${pattern.data.evidenceStatus}`;
    return `## Patrón ${id} — ${pattern.data.title}\n\n${pattern.data.summary}\n\n${metadata}\n\n${demoteHeadings(pattern.body, 2)}\n\n---`;
  }).join('\n\n');
  return `# Parte ${familyIndex + 1} — ${family.nameEs}\n\n${family.description}\n\n${chapters}`;
}).join('\n\n');

const yaml = `---\ntitle: "${config.title}"\nsubtitle: "${config.subtitle}"\nauthor: "${config.author}"\nlang: es\nedition: "${config.edition}"\nformat:\n  html:\n    toc: true\n    toc-depth: 2\n    number-sections: true\n    embed-resources: true\n  epub:\n    toc: true\n    toc-depth: 2\n  typst:\n    toc: true\n    section-numbering: "1.1"\n    papersize: a4\n    margin:\n      x: 2.2cm\n      y: 2.2cm\n---`;
const manuscript = `${yaml}\n\n${frontmatter}\n\n${parts}\n`;
const patternHeadings = manuscript.match(/^## Patrón \d{3} — /gm) ?? [];
if (patternHeadings.length !== taxonomy.catalogSize) {
  throw new Error(`Manuscrito incompleto: ${patternHeadings.length}/${taxonomy.catalogSize} capítulos de patrón`);
}

const sha256 = createHash('sha256').update(manuscript).digest('hex');
const outDir = join(projectRoot, 'dist', 'book');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, config.output), manuscript, 'utf8');
writeFileSync(join(outDir, 'manifest.json'), JSON.stringify({
  schemaVersion: 2,
  output: config.output,
  patternCount: patternHeadings.length,
  familyCount: taxonomy.families.length,
  manuscriptSha256: sha256,
  formats: ['html', 'epub', 'typst'],
  commitSha: process.env.GITHUB_SHA ?? null,
}, null, 2) + '\n', 'utf8');

console.log(`Book manuscript: ${patternHeadings.length} patrones / ${taxonomy.families.length} partes`);
console.log(`Manuscript SHA-256: ${sha256}`);
