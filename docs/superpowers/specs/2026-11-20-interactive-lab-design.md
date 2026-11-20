# Patrones IA Interactive Lab — Technical Design v1.0

Date: 2026-11-20
Status: proposed — awaiting design approval
Target: `rubences/patrones_dise-o_ia`, Astro 7 static site on GitHub Pages

## Intent
Turn the 365-pattern canonical catalog into an interactive, educational and engineering-oriented laboratory for exploring, composing, simulating and evaluating agentic architectures. Preserve canonical pattern IDs, Markdown sheets and evidence status.

## Decision and alternatives
Selected: **local-only, no accounts**. Alternatives considered: cloud-backed authenticated projects (rejected due to backend, privacy and operational overhead) and hybrid local/cloud sync (deferred as unnecessary for the current goal). The interactive architecture will be static-host-compatible.

## Goals
- Accessible, keyboard-operable interactive diagrams on pattern detail pages.
- Visual architecture composition from typed, versioned pattern nodes and edges.
- Deterministic event-driven simulation, step-through, fault injection and trace inspection.
- Explicitly bounded reference security/evidence checks, not false compliance or safety guarantees.
- IndexedDB project storage with JSON import/export and SVG diagram export.
- Progressive enhancement: canonical static content remains readable without JavaScript.

## Non-goals
- No accounts, cloud sync, multiuser collaboration, external LLM execution or arbitrary code execution.
- No automated claim that all 365 patterns have unique behavior diagrams or production-ready simulations.
- No change to primary evidence baseline or editorial submission readiness.

## Architecture
- Astro 7 for routes, content and static rendering.
- React islands and @xyflow/react for editing and interactive graph navigation (add dependencies only during implementation).
- A framework-independent TypeScript graph schema and pure validation/simulation modules under `web/src/lib/lab/`.
- Browser IndexedDB persistence adapter with schema version, migrations, import validation, project quotas and explicit export/erase controls.
- JSON is the canonical interchange; SVG is a static visual export. No raw HTML injection from imported data.
- Pattern metadata is generated from `catalog/patterns.json`, `catalog/taxonomy.json` and `content/patterns/*.md` at build time.

## Data contracts
`ArchitectureDiagram`: schemaVersion, id, title, patternIds, nodes, edges, optional simulation configuration. Nodes include stable ID, type, position, reference patternId, typed ports, label and sanitized properties. Edges include stable ID, source/target ports and relationship kind (data, control, tool-call, delegation, evidence). Validate referential integrity, unique IDs, allowed ports and version before persistence or simulation.

## Experience
Pattern page: diagram viewer with zoom, pan, keyboard focus, selectable nodes, descriptions and linked patterns. Catalog: launch into architecture editor with template. Editor: palette, canvas, inspector, validation panel, undo/redo, save/export. Simulator: step/run/reset, deterministic seed, virtual clock, fault injection, timeline and trace panel. Evaluation: checks, evidence limits and human approval warnings. Responsive layout, reduced-motion and accessible text alternative for every graph.

## Delivery phases and acceptance
1. **Interactive viewer:** one reusable graph viewer, representative manually curated templates, keyboard navigation, no-JS fallback, smoke tests.
2. **Editor:** typed drag/drop graph, validation, undo/redo, IndexedDB, JSON round-trip, tests for malformed imports.
3. **Simulation:** pure deterministic event engine with fixed seed, step/pause/reset, faults, bounded runtime and replayable trace; golden fixtures.
4. **Assurance:** compositional rules, risk/evidence badges and explicit fail-closed boundaries; regression and adversarial tests.
5. **Teaching & release:** curated labs, rubric hooks, export SVG, performance/accessibility checks, E2E tests and docs.

## Quality gates
- Unit tests for schema, graph validation, storage migration, simulation determinism and failure handling.
- Integration tests for pattern-to-graph mapping and JSON import/export.
- E2E tests for navigation, keyboard access, editing and save/reopen on Chromium.
- Astro build, canonical catalog validation, publication integrity and GitHub Pages workflow.
- Performance target: lazy-load editor; no JS requirement for reading a pattern; avoid rendering 365 interactive canvases on the index page.

## Risks and mitigations
- Browser storage eviction: explicit export and clear warnings; no durability promise.
- Large graph rendering: cap visible graph complexity and use progressive loading.
- Security: no arbitrary user code, no unsafe HTML, validate all imports and external URLs.
- Misleading simulations: label simulated outcomes, separate empirical evidence from deterministic toy models.
- Existing CI may have unrelated failures: diagnose from actual logs before claiming deployment success.

## Open implementation choices
Exact React/XYFlow version, schema validation library and IndexedDB wrapper to be pinned during implementation planning, after approval. First release is intentionally local-only and compatible with GitHub Pages.
