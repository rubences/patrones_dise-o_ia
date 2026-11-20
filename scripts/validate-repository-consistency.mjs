import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const errors = [];
const warnings = [];

const read = (...parts) => readFileSync(join(root, ...parts), 'utf8');
const json = (...parts) => JSON.parse(read(...parts));

const taxonomy = json('catalog', 'taxonomy.json');
const baseline = json('catalog', 'evidence-baseline.json');
const evidence = json('catalog', 'pattern-evidence.json');
const references = json('catalog', 'references.json');
const pkg = json('package.json');
const lock = json('package-lock.json');
const webPkg = json('web', 'package.json');

const catalogSize = taxonomy.catalogSize;
const familyCount = taxonomy.families.length;

if (pkg.version !== lock.version) {
  errors.push(`package.json version ${pkg.version} != package-lock.json version ${lock.version}`);
}
if (pkg.version !== lock.packages?.['']?.version) {
  errors.push(`package.json version ${pkg.version} != package-lock root version ${lock.packages?.['']?.version ?? 'missing'}`);
}
if (lock.description || Object.hasOwn(lock, 'private') || Object.hasOwn(lock, 'type')) {
  errors.push('package-lock.json conserva metadatos históricos de proyecto en su cabecera.');
}

const packageDescription = pkg.description ?? '';
if (!packageDescription.includes(String(catalogSize))) {
  errors.push(`package.json description debe reflejar catalogSize=${catalogSize}.`);
}

const sourceIndex = read('src', 'index.ts');
for (let id = 1; id <= catalogSize; id += 1) {
  const script = pkg.scripts?.[`pattern:${id}`];
  if (!script) {
    errors.push(`package.json: falta script pattern:${id}`);
  } else if (!new RegExp(`pattern_${id}_`).test(script)) {
    errors.push(`package.json: pattern:${id} no apunta a su sourceFile esperado (${script})`);
  }

  const exportRe = new RegExp(`from\\s+["']\\.\\/pattern_${id}_[^"']+\\.js["']`);
  if (!exportRe.test(sourceIndex)) {
    errors.push(`src/index.ts: falta export público para pattern ${id}`);
  }
}

const astroVersion = webPkg.dependencies?.astro;
if (typeof astroVersion !== 'string' || /^[~^*]/.test(astroVersion)) {
  errors.push(`web/package.json: Astro debe fijarse a una versión directa exacta (actual: ${astroVersion ?? 'missing'}).`);
}
if (!existsSync(join(root, 'web', 'package-lock.json'))) {
  warnings.push('web/package-lock.json ausente: las dependencias transitivas del subproyecto web todavía no están fijadas.');
}

const readme = read('README.md');
const requiredReadmeFacts = [
  `${catalogSize}/${catalogSize} implementaciones`,
  `${catalogSize}/${catalogSize} fichas canónicas`,
  `${familyCount} macrofamilias`,
  `${baseline.minimumPrimaryPatterns}/${catalogSize} patrones con evidencia primaria/oficial`,
  `${references.references.length} fuentes primarias/oficiales`,
  `v${pkg.version}`,
];
for (const fact of requiredReadmeFacts) {
  if (!readme.includes(fact)) errors.push(`README.md: falta estado vigente «${fact}»`);
}

if (evidence.patterns.length < baseline.minimumPrimaryPatterns) {
  errors.push(`Evidence map: ${evidence.patterns.length} < baseline ${baseline.minimumPrimaryPatterns}`);
}
if (references.references.length < baseline.minimumPrimaryReferences) {
  errors.push(`Reference registry: ${references.references.length} < baseline ${baseline.minimumPrimaryReferences}`);
}

const walk = (dir) => {
  const base = join(root, dir);
  if (!existsSync(base)) return [];
  const out = [];
  for (const entry of readdirSync(base, { withFileTypes: true })) {
    const relative = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(relative));
    else out.push(relative);
  }
  return out;
};

const operationalFiles = [
  'README.md',
  'RESUMEN_EJECUTIVO_PLAN_ACCION.md',
  ...walk('docs').filter((path) => path.endsWith('.md')),
  ...walk('web/src/pages').filter((path) => path.endsWith('.astro')),
  ...walk('publications').filter((path) => path.endsWith('.md')),
];

const staleRules = [
  { re: /\b102[- ]patterns?\b/gi, label: '102-pattern(s)' },
  { re: /\b102 patrones\b/gi, label: '102 patrones' },
  { re: /\b102 implementaciones\b/gi, label: '102 implementaciones' },
  { re: /\b102 fichas\b/gi, label: '102 fichas' },
  { re: /\b102\/102\b/g, label: '102/102' },
  { re: /\b9\/102\b/g, label: '9/102' },
  { re: /\b10 macrofamilias\b/gi, label: '10 macrofamilias' },
  { re: /\b50 fuentes (?:primarias|registradas)/gi, label: '50 fuentes' },
];

if (catalogSize !== 102) {
  for (const relative of operationalFiles) {
    const text = readFileSync(join(root, relative), 'utf8');
    for (const rule of staleRules) {
      rule.re.lastIndex = 0;
      if (rule.re.test(text)) errors.push(`${relative}: referencia operativa obsoleta «${rule.label}»`);
    }
  }
}

const historicalDocs = [
  'INDEX_DOCUMENTOS_INVESTIGACION.md',
  'INVESTIGACION_EXHAUSTIVA_PATRONES.md',
  'PRESENTACION_VISUAL_PATRONES.md',
  'REFERENCIA_RAPIDA_PATRONES.md',
];
for (const relative of historicalDocs) {
  const text = read(relative).slice(0, 1000);
  if (!text.includes('**Documento histórico.**')) {
    errors.push(`${relative}: debe declarar de forma visible que es documentación histórica.`);
  }
}

const summary = read('RESUMEN_EJECUTIVO_PLAN_ACCION.md');
if (!summary.includes(`**${references.references.length}**`)) {
  errors.push('RESUMEN_EJECUTIVO_PLAN_ACCION.md: no refleja el número real de fuentes primarias/oficiales.');
}

console.log(`Repository consistency: ${catalogSize} patterns · ${familyCount} families · ${evidence.patterns.length} evidence mappings · ${references.references.length} primary/official references`);
console.log(`Package: v${pkg.version} · Astro ${astroVersion}`);
for (const warning of warnings) console.warn(`WARN: ${warning}`);

if (errors.length > 0) {
  console.error('Repository consistency: FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Repository consistency: PASS');
