# Interactive Lab — Phase 1

Status: implementation candidate on feature branch, pending GitHub CI verification.

The pattern detail pages render an interactive SVG **relationship map** using canonical `related` and `combinesWith` frontmatter. This is not an execution graph or simulation. Users can inspect nodes with mouse or keyboard (Tab, Enter/Space, arrow keys), zoom with buttons and use an accessible text list when JavaScript is unavailable. All text is rendered as text, not untrusted HTML.

The pure graph builder lives in `web/src/lib/lab/pattern-graph.ts`; the Astro viewer is `web/src/components/lab/PatternDiagram.astro`. No accounts, backend or external runtime calls are used. The page retains all original Markdown and source-code links.

Run graph tests: `node --experimental-strip-types --test tests/interactive-lab-pattern-graph.test.mjs` (Node 24 in CI).

Run the full site build: `cd web && npm install && npm run build`.

Limits: Graph nodes use a simple radial layout; large relationship sets may need a more advanced layout. Curated pattern-specific execution diagrams, drag-and-drop composition, simulation, IndexedDB persistence and exports belong to later phases.

## Integración con Archify 3.2.0

La nueva capa Archify convive con el SVG de relaciones de la fase 1. Se generan **diagramas curados** desde JSON conforme a los esquemas oficiales (`architecture` y `workflow`), incluyendo referencias al repositorio y al commit compilado. Los artefactos HTML pasan por `finalize` (validación estructural, entrega y comprobación automatizada en navegador) antes de copiarse al directorio distribuible de la web.

El visor Astro utiliza un `iframe` aislado con enlace de apertura independiente, y conserva el contenido textual de la ficha. Primeros diagramas: arquitectura del Interactive Lab y workflow del patrón 001. No se atribuye a los 365 patrones un flujo de ejecución inferido automáticamente.

Los datos de los usuarios siguen siendo locales, sin cuentas; la generación Archify ocurre en GitHub Actions, **no en el navegador del usuario**. La licencia Apache-2.0 y las atribuciones del proyecto se conservan en `web/public/archify/`. 
