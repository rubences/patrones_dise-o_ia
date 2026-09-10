import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

export const projectRoot = resolve(import.meta.dirname, '../..');

function stripQuotes(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseInlineArray(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return [];
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];
  return inner.split(',').map((item) => stripQuotes(item)).filter(Boolean);
}

export function parseFrontmatter(text, filename = '<memory>') {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${filename}: frontmatter YAML no encontrado`);
  const raw = match[1];
  const body = match[2].trim();
  const lines = raw.split(/\r?\n/);
  const data = {};

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!keyMatch) continue;
    const [, key, rawValue] = keyMatch;
    const value = rawValue.trim();

    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = parseInlineArray(value);
      continue;
    }
    if (value === '') {
      const list = [];
      let cursor = i + 1;
      while (cursor < lines.length) {
        const item = lines[cursor].match(/^\s+-\s+(.+)$/);
        if (!item) break;
        list.push(stripQuotes(item[1]));
        cursor += 1;
      }
      if (list.length > 0) {
        data[key] = list;
        i = cursor - 1;
        continue;
      }
    }
    if (/^(true|false)$/i.test(value)) data[key] = value.toLowerCase() === 'true';
    else if (/^-?\d+(?:\.\d+)?$/.test(value)) data[key] = Number(value);
    else data[key] = stripQuotes(value);
  }

  return { data, body, rawFrontmatter: raw };
}

export function readCanonicalPatterns(root = projectRoot) {
  const dir = join(root, 'content', 'patterns');
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((filename) => {
      const path = join(dir, filename);
      const text = readFileSync(path, 'utf8');
      const parsed = parseFrontmatter(text, filename);
      return { filename, path, text, ...parsed };
    })
    .sort((a, b) => Number(a.data.patternId) - Number(b.data.patternId));
}

export function readTaxonomy(root = projectRoot) {
  return JSON.parse(readFileSync(join(root, 'catalog', 'taxonomy.json'), 'utf8'));
}

export function readReferenceRegistry(root = projectRoot) {
  return JSON.parse(readFileSync(join(root, 'catalog', 'references.json'), 'utf8'));
}

export function readPatternEvidence(root = projectRoot) {
  return JSON.parse(readFileSync(join(root, 'catalog', 'pattern-evidence.json'), 'utf8'));
}

export function buildEvidenceIndex(root = projectRoot) {
  const registry = readReferenceRegistry(root);
  const mapping = readPatternEvidence(root);
  const referencesById = new Map(registry.references.map((reference) => [reference.id, reference]));
  const evidenceByPatternId = new Map(mapping.patterns.map((entry) => [Number(entry.patternId), {
    ...entry,
    resolvedReferences: entry.references.map((id) => referencesById.get(id)).filter(Boolean),
  }]));
  return { registry, mapping, referencesById, evidenceByPatternId };
}

export function countRequiredSections(body) {
  const sections = {
    purpose: /^#\s+Propósito\s*$/im.test(body),
    implementation: /^##\s+Implementación del repositorio\s*$/im.test(body),
    production: /^##\s+Producción\s*$/im.test(body),
    relations: /^##\s+Relaciones\s*$/im.test(body),
  };
  return { sections, complete: Object.values(sections).every(Boolean) };
}

export function demoteHeadings(markdown, levels = 2) {
  return markdown.replace(/^(#{1,6})\s+/gm, (_, hashes) => `${'#'.repeat(Math.min(6, hashes.length + levels))} `);
}
