# Edición distribuible

La edición pública se deriva del manuscrito canónico generado desde `content/patterns/`.

Formatos de CI:

- HTML autocontenido para lectura offline.
- EPUB para lectores electrónicos.
- PDF generado con Typst a través de Quarto.

Los binarios se generan en `dist/book/` y se publican como artifacts de GitHub Actions. `dist/` permanece fuera de Git para impedir que una copia binaria se convierta en una segunda fuente editorial.

Cada build produce `distribution-manifest.json` con tamaño y SHA-256 de los tres formatos y el SHA-256 del manuscrito fuente.
