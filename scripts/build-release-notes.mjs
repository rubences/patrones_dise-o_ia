import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { projectRoot } from './lib/editorial.mjs';

const bookDir = join(projectRoot, 'dist', 'book');
const evidenceDir = join(projectRoot, 'dist', 'evidence');
const distributionPath = join(bookDir, 'distribution-manifest.json');
const evidencePath = join(evidenceDir, 'evidence-pack.json');

if (!existsSync(distributionPath) || !existsSync(evidencePath)) {
  throw new Error('Faltan manifests de publicación. Ejecuta primero Evidence Pack, libro y distribución.');
}

const distribution = JSON.parse(readFileSync(distributionPath, 'utf8'));
const evidence = JSON.parse(readFileSync(evidencePath, 'utf8'));
const tag = process.env.GITHUB_REF_NAME ?? process.argv[2] ?? 'build-local';
const commit = distribution.commitSha ?? evidence.commitSha ?? 'unknown';

const formatRows = distribution.artifacts
  .map((artifact) => `| ${artifact.format.toUpperCase()} | ${artifact.file} | ${artifact.sizeBytes} | \`${artifact.sha256}\` |`)
  .join('\n');

const evidenceRows = Object.entries(evidence.summary.byEvidence)
  .map(([status, count]) => `- **${status}:** ${count}`)
  .join('\n');

const notes = `# Patrones IA — ${tag}\n\n` +
  `Edición generada automáticamente desde el corpus canónico del repositorio.\n\n` +
  `## Identidad de la edición\n\n` +
  `- **Commit:** \`${commit}\`\n` +
  `- **Patrones:** ${distribution.patternCount}\n` +
  `- **Macrofamilias:** ${distribution.familyCount}\n` +
  `- **Corpus SHA-256:** \`${evidence.corpusSha256}\`\n` +
  `- **Manuscrito SHA-256:** \`${distribution.sourceManuscriptSha256}\`\n\n` +
  `## Artefactos\n\n` +
  `| Formato | Archivo | Bytes | SHA-256 |\n|---|---|---:|---|\n${formatRows}\n\n` +
  `## Estado de evidencia\n\n${evidenceRows}\n\n` +
  `- **Fichas con referencias de frontmatter:** ${evidence.summary.patternsWithReferences}/${evidence.catalogSize}\n` +
  `- **Referencias declaradas en frontmatter:** ${evidence.summary.totalReferences}\n` +
  `- **Patrones con evidencia primaria verificada:** ${evidence.summary.patternsWithPrimaryEvidence}/${evidence.catalogSize}\n` +
  `- **Fuentes del registro primario:** ${evidence.primaryRegistry.referenceCount}\n` +
  `- **Registro primario revisado:** ${evidence.primaryRegistry.verifiedOn}\n` +
  `- **Relaciones editoriales:** ${evidence.summary.relationEdges}\n\n` +
  `## Nota de interpretación\n\n` +
  `Los hashes identifican exactamente los artefactos de esta edición. Las referencias libres y la evidencia primaria se contabilizan por separado. Una fuente primaria documenta origen, estándar o evidencia pertinente, pero sus resultados no se extrapolan fuera de su alcance sin validación adicional.\n`;

writeFileSync(join(bookDir, 'RELEASE_NOTES.md'), notes, 'utf8');
console.log(`Release notes: ${tag} · ${distribution.patternCount} patrones · ${distribution.artifacts.length} formatos · ${evidence.summary.patternsWithPrimaryEvidence} con evidencia primaria`);
