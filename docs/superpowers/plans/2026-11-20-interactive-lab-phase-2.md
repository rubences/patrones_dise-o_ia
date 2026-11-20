# Interactive Lab Phase 2 — Visual Architecture Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let visitors compose and save typed AI-pattern architectures locally, without accounts or a backend.

**Architecture:** Astro hosts a client-only React island using @xyflow/react. A pure TypeScript domain model validates graph integrity and produces versioned JSON. IndexedDB stores validated projects; the existing 365-pattern catalog supplies palette metadata at build time. Phase 2 does not simulate execution.

**Tech Stack:** Astro 7.3.2, React 19, @astrojs/react, @xyflow/react, TypeScript, IndexedDB, node:test/tsx and Playwright for browser acceptance. Pin exact dependency versions during implementation.

**Spec:** `docs/superpowers/specs/2026-11-20-interactive-lab-design.md`

## Global Constraints
- Static GitHub Pages deployment; no backend, accounts, cloud sync or external LLM calls.
- Canonical metadata comes from `catalog/patterns.json`, `catalog/taxonomy.json` and Markdown sheets.
- Do not execute imported project data; render labels as text.
- Maintain schema version 1 and reject unknown future versions, invalid references and malformed imports.
- Explicit export/erase controls; warn that browser storage can be evicted.
- Existing static pattern pages and phase-1 SVG viewer must remain available without JavaScript.

## Review Focus
- Duplicate node or edge IDs must be rejected (Task 1).
- An edge pointing to a missing node or port must be rejected (Task 1).
- Unknown pattern ID or future schema version must be rejected (Task 1).
- IndexedDB denied/unavailable or quota exceeded must show recoverable errors, not lose the in-memory project (Task 2).
- JSON import with untrusted labels/URLs must never inject HTML or execute code (Task 3).

---

### Task 1: Versioned architecture graph and validation

**Files:**
- Create: `web/src/lib/lab/architecture-schema.ts`
- Create: `web/src/lib/lab/architecture-validation.ts`
- Test: `tests/interactive-lab-architecture-schema.test.ts`

**Interfaces:**
- `ArchitectureDiagram = {schemaVersion:1,id:string,title:string,patternIds:number[],nodes:ArchitectureNode[],edges:ArchitectureEdge[]}`
- `ArchitectureNode = {id:string,patternId:number,label:string,position:{x:number,y:number},ports:{id:string,direction:'input'|'output',kind:'data'|'control'|'tool-call'|'delegation'|'evidence'}[]}`
- `ArchitectureEdge = {id:string,source:string,sourcePort:string,target:string,targetPort:string,kind:'data'|'control'|'tool-call'|'delegation'|'evidence'}`
- `validateArchitecture(value:unknown, knownPatternIds:ReadonlySet<number>): {ok:true;diagram:ArchitectureDiagram}|{ok:false;errors:string[]}`

- [ ] Write failing tests for valid two-node graph, duplicate IDs, missing nodes, wrong port direction, mismatched edge kind, future version, unknown pattern ID and HTML-like labels.
- [ ] Run `npx --yes tsx@4.20.6 --test tests/interactive-lab-architecture-schema.test.ts`; expect RED (module missing).
- [ ] Implement strict pure validation with explicit max nodes/edges, length bounds, finite coordinates and text-only labels.
- [ ] Run the same test; expect PASS.
- [ ] Commit `feat(lab): add versioned architecture graph validation`.

### Task 2: Local persistence and import/export

**Files:**
- Create: `web/src/lib/lab/project-storage.ts`
- Create: `web/src/lib/lab/project-transfer.ts`
- Test: `tests/interactive-lab-storage.test.ts`

**Interfaces:**
- `ProjectStorage = {list():Promise<ArchitectureDiagram[]>;get(id:string):Promise<ArchitectureDiagram|null>;put(diagram:ArchitectureDiagram):Promise<void>;remove(id:string):Promise<void>}`
- `createIndexedDbProjectStorage(dbName?:string):ProjectStorage`
- `parseProjectJson(text:string,knownIds:ReadonlySet<number>): ReturnType<typeof validateArchitecture>`
- `serializeProject(diagram:ArchitectureDiagram):string`

- [ ] Write failing tests for JSON round-trip, malformed import, unsupported version, empty store, overwrite and remove; test storage failure via injected IDB adapter.
- [ ] Run `npx --yes tsx@4.20.6 --test tests/interactive-lab-storage.test.ts`; expect RED.
- [ ] Implement IndexedDB transactions and explicit error mapping; validate before writes and after reads.
- [ ] Run tests; expect PASS.
- [ ] Commit `feat(lab): add local projects and safe JSON transfer`.

### Task 3: React/XYFlow architecture editor

**Files:**
- Create: `web/src/components/lab/ArchitectureEditor.tsx`
- Create: `web/src/pages/lab/index.astro`
- Modify: `web/package.json`
- Modify: `web/astro.config.mjs` (if required by React integration)
- Test: `tests/interactive-lab-editor-smoke.test.mjs`

**Interfaces:**
- Props `{palette:{id:number;title:string;family:string}[]}` from the canonical catalog.
- UI operations: add node, connect compatible typed ports, inspect, undo/redo, save/reopen, import/export JSON, delete with confirmation.

- [ ] Write failing smoke tests for route, palette sourced from canonical catalog, editor controls and no unsafe HTML rendering.
- [ ] Run tests; expect RED.
- [ ] Pin dependencies, implement client-only island and route with explanatory no-JS fallback.
- [ ] Run tests and `cd web && npm ci && npm run build`; expect PASS.
- [ ] Commit `feat(lab): introduce typed local architecture editor`.

### Task 4: Accessibility, integration and release gate

**Files:**
- Modify: `web/src/layouts/BaseLayout.astro`
- Modify: `web/src/pages/index.astro`
- Modify: `.github/workflows/web-ci.yml`
- Modify: `README.md`
- Modify: `docs/INTERACTIVE_LAB.md`
- Test: `tests/interactive-lab-editor-e2e.spec.ts`

**Interfaces:** `/lab/` discoverable from navigation, keyboard-operable controls, descriptive errors, browser persistence and no-JS fallback.

- [ ] Write failing Playwright tests for adding two nodes, connecting them, saving/reloading, JSON import/export, invalid JSON and keyboard-only interaction.
- [ ] Run E2E suite; expect RED.
- [ ] Add navigation, labels, error feedback and responsive layout; implement only missing behavior.
- [ ] Run E2E suite, graph/schema/storage tests, editorial validators, root TypeScript typecheck and Astro build; expect PASS.
- [ ] Add CI jobs and documentation; commit `test(lab): verify editor accessibility and local persistence`.

## Completion gate
Do not merge or claim deployment until all CI checks and GitHub Pages build pass. Phase 3 deterministic simulation is explicitly out of scope.
