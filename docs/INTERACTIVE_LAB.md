# Interactive Lab — Phase 1

Status: implementation candidate on feature branch, pending GitHub CI verification.

The pattern detail pages render an interactive SVG **relationship map** using canonical `related` and `combinesWith` frontmatter. This is not an execution graph or simulation. Users can inspect nodes with mouse or keyboard (Tab, Enter/Space, arrow keys), zoom with buttons and use an accessible text list when JavaScript is unavailable. All text is rendered as text, not untrusted HTML.

The pure graph builder lives in `web/src/lib/lab/pattern-graph.ts`; the Astro viewer is `web/src/components/lab/PatternDiagram.astro`. No accounts, backend or external runtime calls are used. The page retains all original Markdown and source-code links.

Run graph tests: `node --experimental-strip-types --test tests/interactive-lab-pattern-graph.test.mjs` (Node 24 in CI).

Run the full site build: `cd web && npm install && npm run build`.

Limits: Graph nodes use a simple radial layout; large relationship sets may need a more advanced layout. Curated pattern-specific execution diagrams, drag-and-drop composition, simulation, IndexedDB persistence and exports belong to later phases.
