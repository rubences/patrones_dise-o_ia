# Libro — Patrones IA

El libro **no mantiene una copia manual** de las 102 fichas. `scripts/build-book.mjs` ensambla el manuscrito desde `content/patterns/`, usando el orden de `catalog/taxonomy.json` y el material introductorio de `book/frontmatter/`.

```bash
node scripts/validate-editorial.mjs
node scripts/build-evidence-pack.mjs
node scripts/build-book.mjs
```

Los artefactos se generan en:

- `dist/book/patrones-ia-manuscript.md`
- `dist/book/manifest.json`
- `dist/evidence/evidence-pack.json`
- `dist/evidence/EVIDENCE_REPORT.md`

`dist/` está ignorado por Git. Esto evita que el manuscrito derivado se desincronice del contenido canónico. El `manifest.json` incluye el SHA-256 del manuscrito para poder identificar exactamente qué corpus produjo una edición.

## Siguiente capa editorial

El Markdown ensamblado está preparado como fuente intermedia para maquetación PDF/EPUB. La conversión tipográfica se mantendrá separada de la generación de contenido para que un cambio de renderer no altere el corpus editorial.
