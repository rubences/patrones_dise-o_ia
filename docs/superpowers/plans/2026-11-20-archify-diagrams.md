# Archify Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Use test-first, source evidence, and verify before merging.

**Goal:** Use Archify 3.2.0 for interactive, curated diagrams inside Patrones IA without compromising existing 365-pattern Astro catalog.
**Architecture:** Versioned authored JSON diagrams, pinned Archify CLI in CI, validated standalone HTML copied into site output; isolated iframe for curated patterns and overview, SVG fallback for other patterns.
**Tech Stack:** Astro 7, Node 24, Archify 3.2.0 pinned commit, GitHub Actions and Pages.
**Spec:** docs/superpowers/specs/2026-11-20-archify-diagrams-integration.md

## Global constraints
No accounts, backend or remote JS at viewing time; preserve accessibility and canonical data. Do not conflate curated diagrams and generic relation maps.

## Review focus
- Unsupported IDs must not be iframe URLs.
- Bad or missing generated output must fail the build.
- Archify upstream cannot drift because its SHA is checked.
- Generated HTML and source references must be validated at build.
- Sandbox and readable fallback should remain intact.

### Task 1: Test-first curated diagram definitions
**Files:** tests/archify-diagrams.test.mjs; web/src/data/archify-diagrams.mjs; diagrams/archify/*.json
- [ ] Write tests for two well-formed curated JSON diagrams, source-pinned metadata, source citations, and safe matching.
- [ ] Run node --test tests/archify-diagrams.test.mjs (RED: absent JSON/manifest).
- [ ] Write architecture overview and faithful pattern 001 workflow.
- [ ] Run tests (GREEN); commit.

### Task 2: Pinned offline renderer and CI
**Files:** scripts/build-archify-diagrams.mjs; .github/workflows/web-ci.yml; .github/workflows/deploy-web.yml
- [ ] Add failing tests for pinned upstream CLI path, digest/commit contract and output isolation.
- [ ] Run tests to confirm RED.
- [ ] Implement renderer using pinned Archify checkout at SHA 208acba8d412335185b2056fedf54b3405df43fb. Regenerate repository revision from git HEAD, finalize with --repo-root, copy only final HTML to web/dist/archify.
- [ ] Run tests (GREEN); run native Archify in Actions; no merge until all CI green.

### Task 3: Astro UI integration
**Files:** web/src/components/lab/ArchifyDiagram.astro; web/src/pages/lab/index.astro; web/src/pages/patterns/[slug].astro; web/src/layouts/BaseLayout.astro; README.md
- [ ] Add failing tests asserting curated iframe / source link / fallback.
- [ ] Implement iframe with sandbox, title and full-window link; keep existing SVG fallback.
- [ ] Validate Astro compilation, diagram accessibility, root CI and Pages deployment; commit.
- [ ] Include Apache-2.0 license/NOTICE and generation guide.

## Completion gate
All GitHub Actions checks and Archify finalize evidence must pass before marking the PR merge-ready; deployment separate from source CI.
