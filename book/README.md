# Libro — Patrones IA

El libro **no mantiene una copia manual** de las 102 fichas. `scripts/build-book.mjs` ensambla el manuscrito desde `content/patterns/`, usando el orden de `catalog/taxonomy.json` y el material introductorio de `book/frontmatter/`.

```bash
node scripts/validate-editorial.mjs
node scripts/build-evidence-pack.mjs
node scripts/build-book.mjs
```

Los artefactos intermedios se generan en:

- `dist/book/patrones-ia-manuscript.md`
- `dist/book/manifest.json`
- `dist/evidence/evidence-pack.json`
- `dist/evidence/EVIDENCE_REPORT.md`

`dist/` está ignorado por Git. Esto evita que el manuscrito derivado se desincronice del contenido canónico. Los manifests incluyen SHA-256 para identificar exactamente qué corpus produjo una edición.

## Edición distribuible

`.github/workflows/book-artifacts.yml` instala Quarto mediante la acción oficial `quarto-dev/quarto-actions/setup@v2`, renderiza la fuente canónica y publica como artefacto de GitHub Actions:

- `patrones-ia.html`
- `patrones-ia.epub`
- `patrones-ia.pdf`
- `release-manifest.json`
- manuscrito y Evidence Pack asociados

`release-manifest.json` valida la firma real de PDF/EPUB/HTML, registra tamaño y SHA-256 de cada archivo y enlaza esos hashes con el corpus y manuscrito que los originaron.

La renderización pesada vive en un workflow separado de la CI web. Se ejecuta cuando cambia contenido editorial, catálogo, libro o pipeline de publicación, y también puede lanzarse manualmente.
