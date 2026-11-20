# Interactive Lab Phase 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible, lightweight interactive diagram viewer to canonical pattern detail pages without changing the 365-pattern catalog or requiring accounts.

**Architecture:** Astro renders a static, readable architecture diagram from a typed graph model derived from canonical pattern metadata. A small progressive-enhancement TypeScript controller provides selection, keyboard navigation, pan/zoom and a detail panel. The graph is a relationship overview, explicitly not a faithful execution-flow diagram unless a curated template exists.

**Tech Stack:** Astro 7.3.2, TypeScript, native SVG and browser DOM; Node 24 and built-in node:test. No new client framework in phase 1.

**Spec:** `docs/superpowers/specs/2026-11-20-interactive-lab-design.md`

## Global Constraints

- Static hosting on GitHub Pages; no accounts, backend, external LLM execution or arbitrary code execution.
- Canonical source: `catalog/patterns.json`, `catalog/taxonomy.json`, `content/patterns/*.md`.
- Preserve readable content without JavaScript and accessible text alternatives for graphs.
- Curated diagrams must be marked curated; generated relationship diagrams must not imply real execution behavior.
- Avoid client-side render of all 365 diagrams on the catalog landing page.

## Review Focus

- Pattern with no related nodes: viewer must show the primary node and meaningful empty-state text (Task 1).
- Unknown related pattern ID: skip safely without dead links (Task 1).
- Extremely long node title: truncate visually, retain full accessible name (Task 2).
- Keyboard-only navigation and reduced motion: all nodes selectable and detail panel usable without pointer (Task 3).
- JavaScript disabled: static graph, text list and links remain useful (Task 2).

---

### Task 1: Pure graph model and tests

**Files:**
- Create: `web/src/lib/lab/pattern-graph.ts`
- Create: `tests/interactive-lab-pattern-graph.test.ts`

**Interfaces:**
- Consumes: `PatternRecord = {patternId:number;slug:string;title:string;summary:string;related:number[];combinesWith:number[]}`.
- Produces: `buildPatternGraph(current:PatternRecord, all:PatternRecord[]): PatternGraph` where `PatternGraph={nodes:GraphNode[];edges:GraphEdge[]}`, node IDs are `p-<id>`, edges are deduplicated by source/target/kind.

- [ ] **Step 1:** Write tests asserting main node present, unknown IDs ignored, empty relations handled, duplicated relations deduplicated and titles preserved.
- [ ] **Step 2:** Run `npx --yes tsx@4.20.6 --test tests/interactive-lab-pattern-graph.test.ts`; expected RED because module is missing.
- [ ] **Step 3:** Implement pure graph builder with no DOM dependency, stable order and explicit `related`/`combines-with` edge types.
- [ ] **Step 4:** Run same test; expected PASS.
- [ ] **Step 5:** Commit `feat(lab): add tested pattern relationship graph model`.

### Task 2: Accessible static Astro viewer

**Files:**
- Create: `web/src/components/lab/PatternDiagram.astro`
- Modify: `web/src/pages/patterns/[slug].astro`
- Test: `tests/interactive-lab-pattern-diagram.test.ts`

**Interfaces:**
- Consumes `PatternGraph` from Task 1 and canonical `CollectionEntry<'patterns'>` data.
- Produces static SVG, labeled nodes, typed edges, accessible text relation list and stable node metadata attributes for enhancement.

- [ ] **Step 1:** Add a test for viewer integration, static accessible list, source-derived links and no generic claim of runtime execution.
- [ ] **Step 2:** Run test; expected RED because component is missing.
- [ ] **Step 3:** Implement server-rendered SVG with text alternative and a graceful empty-relations message; add viewer to pattern detail page.
- [ ] **Step 4:** Run test and `cd web && npm run build`; expected PASS and all 365 static pattern routes.
- [ ] **Step 5:** Commit `feat(lab): embed accessible diagram viewer in pattern pages`.

### Task 3: Progressive interaction controller

**Files:**
- Create: `web/src/lib/lab/diagram-interactions.ts`
- Modify: `web/src/components/lab/PatternDiagram.astro`
- Test: `tests/interactive-lab-diagram-interactions.test.ts`

**Interfaces:**
- Produces `createDiagramController(root:HTMLElement): {destroy():void}` with focus/selection, accessible detail updates and bounded zoom; no global listeners after destroy.

- [ ] **Step 1:** Write tests for keyboard selection, bounded zoom, reduced-motion compatibility and missing optional elements.
- [ ] **Step 2:** Run tests; expected RED for missing controller.
- [ ] **Step 3:** Implement event delegation with safe textContent updates and keyboard-accessible controls.
- [ ] **Step 4:** Run tests and Astro build; expected PASS.
- [ ] **Step 5:** Commit `feat(lab): add accessible diagram interactions`.

### Task 4: Quality gates and documentation

**Files:**
- Modify: `.github/workflows/web-ci.yml`
- Modify: `README.md`
- Create: `docs/INTERACTIVE_LAB.md`

**Interfaces:**
- Consumes tests from Tasks 1–3.
- Produces CI test commands and user-facing limitations.

- [ ] **Step 1:** Add CI test commands for graph model and interactions.
- [ ] **Step 2:** Run all new tests, existing editorial validators, `npx tsc --noEmit --project tsconfig.json` and Astro build; expected PASS.
- [ ] **Step 3:** Document phase-1 relationship graph versus curated execution diagrams, accessibility and phase-2 editor roadmap.
- [ ] **Step 4:** Commit `docs(ci): verify and document interactive lab phase 1`.

## Completion gate

Only claim deployed after GitHub Actions CI and Pages deploy are observed successful. If unavailable, report commits and local test output separately. No merge to shared branch until verified; use a feature branch or isolated worktree unless explicitly authorized.
