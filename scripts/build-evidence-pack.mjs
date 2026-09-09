import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { countRequiredSections, projectRoot, readCanonicalPatterns, readTaxonomy } from './lib/editorial.mjs';

const patterns = readCanonicalPatterns();
const taxonomy = readTaxonomy();
if (patterns.length !== taxonomy.catalogSize) {
  throw new Error(`Evidence Pack exige ${taxonomy.catalogSize} fichas; encontradas ${patterns.length}`);
}

const corpusHash = createHash('sha256')
  .update(patterns.map((pattern) => pattern.text.replace(/\r\n/g, '\n')).join('\n\n'))
  .digest('hex');

const byEvidence = Object.fromEntries(taxonomy.evidenceStatus.map((status) => [status, 0]));
const byMaturity = Object.fromEntries(taxonomy.maturity.map((status) => [status, 0]));
const byDifficulty = Object.fromEntries(taxonomy.difficulty.map((status) => [status, 0]));
const familyMap = new Map(taxonomy.families.map((family) => [family.id, {
  id: family.id,
  name: family.nameEs,
  total: 0,
  verified: 0,
  partiallyVerified: 0,
  needsReview: 0,
  withReferences: 0,
}]));

let withReferences = 0;
let totalReferences = 0;
let completeSections = 0;
let sourceFilesPresent = 0;
let relationEdges = 0;

const records = patterns.map((pattern) => {
  const data = pattern.data;
  const references = Array.isArray(data.references) ? data.references : [];
  const related = Array.isArray(data.related) ? data.related : [];
  const combinesWith = Array.isArray(data.combinesWith) ? data.combinesWith : [];
  const sectionCheck = countRequiredSections(pattern.body);
  const sourceExists = typeof data.sourceFile === 'string' && existsSync(join(projectRoot, data.sourceFile));

  byEvidence[data.evidenceStatus] = (byEvidence[data.evidenceStatus] ?? 0) + 1;
  byMaturity[data.maturity] = (byMaturity[data.maturity] ?? 0) + 1;
  byDifficulty[data.difficulty] = (byDifficulty[data.difficulty] ?? 0) + 1;
  if (references.length > 0) withReferences += 1;
  totalReferences += references.length;
  if (sectionCheck.complete) completeSections += 1;
  if (sourceExists) sourceFilesPresent += 1;
  relationEdges += related.length + combinesWith.length;

  const family = familyMap.get(data.family);
  if (!family) throw new Error(`${pattern.filename}: familia desconocida ${data.family}`);
  family.total += 1;
  if (data.evidenceStatus === 'verified') family.verified += 1;
  if (data.evidenceStatus === 'partially-verified') family.partiallyVerified += 1;
  if (data.evidenceStatus === 'needs-review') family.needsReview += 1;
  if (references.length > 0) family.withReferences += 1;

  return {
    id: data.patternId,
    slug: data.slug,
    title: data.title,
    family: data.family,
    evidenceStatus: data.evidenceStatus,
    maturity: data.maturity,
    difficulty: data.difficulty,
    sourceFile: data.sourceFile,
    sourceExists,
    referenceCount: references.length,
    requiredSectionsComplete: sectionCheck.complete,
    sections: sectionCheck.sections,
    relationCount: related.length + combinesWith.length,
  };
});

const pack = {
  schemaVersion: 1,
  catalogSize: taxonomy.catalogSize,
  commitSha: process.env.GITHUB_SHA ?? null,
  generatedAt: process.env.SOURCE_DATE_EPOCH
    ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString()
    : null,
  corpusSha256: corpusHash,
  summary: {
    canonicalSheets: patterns.length,
    sourceFilesPresent,
    requiredSectionsComplete: completeSections,
    patternsWithReferences: withReferences,
    totalReferences,
    relationEdges,
    byEvidence,
    byMaturity,
    byDifficulty,
  },
  families: [...familyMap.values()],
  patterns: records,
};

const outDir = join(projectRoot, 'dist', 'evidence');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'evidence-pack.json'), JSON.stringify(pack, null, 2) + '\n', 'utf8');

const rows = pack.families.map((family) =>
  `| ${family.name} | ${family.total} | ${family.verified} | ${family.partiallyVerified} | ${family.needsReview} | ${family.withReferences} |`,
).join('\n');

const report = `# Evidence Pack — Patrones IA\n\n` +
`**Corpus SHA-256:** \`${pack.corpusSha256}\`  \n` +
`**Fichas canónicas:** ${pack.summary.canonicalSheets}/${pack.catalogSize}  \n` +
`**Implementaciones enlazadas:** ${pack.summary.sourceFilesPresent}/${pack.catalogSize}  \n` +
`**Estructura editorial completa:** ${pack.summary.requiredSectionsComplete}/${pack.catalogSize}  \n` +
`**Fichas con al menos una referencia:** ${pack.summary.patternsWithReferences}/${pack.catalogSize}  \n` +
`**Referencias declaradas:** ${pack.summary.totalReferences}  \n` +
`**Relaciones editoriales:** ${pack.summary.relationEdges}\n\n` +
`## Estado de evidencia\n\n` +
Object.entries(pack.summary.byEvidence).map(([key, value]) => `- **${key}:** ${value}`).join('\n') +
`\n\n## Cobertura por macrofamilia\n\n` +
`| Familia | Total | Verified | Partial | Needs review | Con referencias |\n|---|---:|---:|---:|---:|---:|\n${rows}\n\n` +
`## Interpretación\n\n` +
`Este informe mide cobertura editorial y trazabilidad declarada. No convierte \`verified\` en una garantía universal: cada patrón debe conservar sus límites, entorno de prueba y evidencia reproducible. Una ficha sin referencias permanece visible como deuda editorial, no se rellena con fuentes inventadas.\n`;

writeFileSync(join(outDir, 'EVIDENCE_REPORT.md'), report, 'utf8');
console.log(`Evidence Pack: ${patterns.length}/${taxonomy.catalogSize} fichas; SHA-256 ${corpusHash}`);
console.log(`References: ${withReferences}/${patterns.length} fichas; ${totalReferences} entradas declaradas`);
