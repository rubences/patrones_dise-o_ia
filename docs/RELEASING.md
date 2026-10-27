# Publicación de ediciones versionadas

Las ediciones permanentes del libro se publican mediante tags con el prefijo `book-v`.

Ejemplo de una futura primera edición estable:

```bash
git tag -a book-v1.0.0 -m "Patrones IA — Primera edición estable"
git push origin book-v1.0.0
```

El push del tag activa `.github/workflows/release-book.yml`. El workflow reconstruye todo desde el commit etiquetado y no reutiliza binarios locales:

1. valida las 102 fichas canónicas;
2. genera el Evidence Pack;
3. ensambla el manuscrito de 102 patrones / 10 macrofamilias;
4. renderiza HTML, EPUB y PDF con Quarto/Typst;
5. genera manifests y notas de release desde los datos del build;
6. ejecuta el hardening suite;
7. crea o actualiza la GitHub Release asociada al tag y adjunta todos los artefactos.

## Convención de versiones

- `book-v1.0.0`: edición estable mayor.
- `book-v1.1.0`: ampliación editorial compatible o nueva funcionalidad de publicación.
- `book-v1.0.1`: correcciones editoriales o técnicas sin cambio de estructura principal.

No se debe mover ni reutilizar un tag publicado para representar contenido diferente. Si una edición cambia, se publica una nueva versión.

## Evidencia de integridad

Cada release incluye `distribution-manifest.json`, que relaciona el SHA-256 del manuscrito fuente con el SHA-256 y tamaño de HTML, EPUB y PDF. `RELEASE_NOTES.md` se deriva de ese manifest y del Evidence Pack, evitando copiar manualmente métricas de cobertura.

## Estado actual

El workflow está preparado, pero fusionarlo a `main` no crea ninguna release. La publicación ocurre únicamente cuando se introduce explícitamente un tag `book-v*`.
