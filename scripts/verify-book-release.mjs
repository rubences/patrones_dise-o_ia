import { createHash } from 'node:crypto';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { projectRoot } from './lib/editorial.mjs';

const releaseDir = join(projectRoot, 'dist', 'release');
const required = [
  { name: 'patrones-ia.html', magic: (buf) => /<!doctype html|<html/i.test(buf.toString('utf8', 0, Math.min(buf.length, 4096))) },
  { name: 'patrones-ia.epub', magic: (buf) => buf[0] === 0x50 && buf[1] === 0x4b },
  { name: 'patrones-ia.pdf', magic: (buf) => buf.subarray(0, 5).toString('ascii') === '%PDF-' },
];

const artifacts = required.map(({ name, magic }) => {
  const path = join(releaseDir, name);
  const buffer = readFileSync(path);
  const sizeBytes = statSync(path).size;
  if (sizeBytes < 1024) throw new Error(`${name}: artefacto demasiado pequeño (${sizeBytes} bytes)`);
  if (!magic(buffer)) throw new Error(`${name}: firma de formato inesperada`);
  return {
    name,
    sizeBytes,
    sha256: createHash('sha256').update(buffer).digest('hex'),
  };
});

const bookManifest = JSON.parse(readFileSync(join(projectRoot, 'dist', 'book', 'manifest.json'), 'utf8'));
const evidencePack = JSON.parse(readFileSync(join(projectRoot, 'dist', 'evidence', 'evidence-pack.json'), 'utf8'));

const manifest = {
  schemaVersion: 1,
  commitSha: process.env.GITHUB_SHA ?? null,
  corpusSha256: evidencePack.corpusSha256,
  manuscriptSha256: bookManifest.manuscriptSha256,
  patternCount: bookManifest.patternCount,
  familyCount: bookManifest.familyCount,
  artifacts,
};

if (manifest.patternCount !== 102 || manifest.familyCount !== 10) {
  throw new Error(`Release incompleta: ${manifest.patternCount} patrones / ${manifest.familyCount} familias`);
}

writeFileSync(join(releaseDir, 'release-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`Release verified: ${artifacts.map((a) => `${a.name}=${a.sizeBytes}B`).join(', ')}`);
