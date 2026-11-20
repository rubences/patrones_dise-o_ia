---
patternId: 207
slug: hypothesis-registry
title: "Hypothesis Registry"
summary: "Contrato experimental de investigación científica para hypothesis registry, con trazabilidad, controles metodológicos y pruebas reproducibles."
family: ai-scientific-discovery
legacyGroup: 38
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_207_hypothesis_registry.ts
tags: [science, reproducibility, research]
related: [53, 74, 98]
combinesWith: [77, 149]
antiPatterns:
  - Confundir validación de software con validez científica o causal.
references: []
---

## Propósito y contexto

Hypothesis Registry separa las decisiones científicas del flujo de automatización y facilita su inspección.

## Solución e implementación

Contrato TypeScript en `src/pattern_207_hypothesis_registry.ts` y pruebas en `tests/p10_science_patterns.test.ts`. Alcance en `research/P10_SCIENCE_207_214_IMPLEMENTATION_NOTES.md`.

## Límites metodológicos

Los resultados no sustituyen preregistro, control de sesgos, potencia estadística, revisión ética, replicación independiente ni inferencia causal identificada.

## Evidencia y evaluación

Estado `needs-review`. Registrar referencias primarias solo después de verificar su correspondencia específica; no atribuir evidencia empírica a los contratos educativos.
