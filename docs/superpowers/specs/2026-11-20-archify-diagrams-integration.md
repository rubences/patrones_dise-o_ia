# Archify integration — Patrones IA Interactive Lab
Date: 2026-11-20
Status: extension to the approved Interactive Lab v1.0 architecture.
Decision: use Archify 3.2.0 (Apache-2.0) as the renderer for curated, repository-grounded diagrams, retaining the Astro/SVG relationship viewer for uncatalogued diagrams and the planned local XYFlow editor for composition.

## Approach considered
1. Replace all 365 SVG views with automatically inferred Archify flow diagrams: rejected because catalog relationships are not proof of runtime behavior, and Archify generates standalone HTML rather than a direct React diagram component.
2. Curate Archify JSON specifications for real architectures and representative patterns; publish validated self-contained HTML and embed it in isolated frames on matching pages: selected.
3. Use Archify only for downloadable static references: rejected as less useful for interactive learning.

## Goals
- Publish an Interactive Lab overview architecture and an exact pipeline workflow (pattern 001) as the first real Archify artifacts.
- Verify authored diagrams against the pinned upstream Archify v3.2.0 CLI and repository source references.
- Retain fallback relationship SVG and the original pattern Markdown. Never treat an illustrative diagram as empirical evidence.
- Generate in CI and during Pages deployment from source JSON; pin upstream at 208acba8d412335185b2056fedf54b3405df43fb, without remote JS at page view.
- Serve standalone HTML under /archify/ and offer a full-view link plus a sandboxed embedded frame where curated.
- Preserve local-only/no-account architecture for future project persistence.
- Comply with Apache-2.0 license/NOTICE and provide accessible text alternatives.

## Non-goals
- No automatic generation of 365 detailed execution diagrams.
- No account system, LLM API or remote generation at runtime.
- No replacement of the planned graph editor, simulation engine or their validation contracts.

## Data flow
Canonical source -> manual reviewed Archify JSON -> pinned CLI finalize (strict schema, HTML, browser checks) -> copy validated HTML only into Astro dist -> sandboxed iframe / full-page links. Build creates no extra tracked HTML or credentials.

## Security
The iframe must be sandboxed, source paths constrained to known curated IDs, and imports never treated as HTML. Never load CDN scripts at runtime. The generated HTML is self-contained. Source references pinned to the build checkout SHA; validation scripts fail closed on unsupported diagram IDs.

## Rollout gates
- Static tests ensure manifest, candidate JSON, links, fallback and pinned SHA.
- GitHub CI verifies actual Archify deliverable with native CLI.
- Pages deploy re-generates exact artifacts from the same pinned renderer.
- CI and Pages must pass before merging into main.
