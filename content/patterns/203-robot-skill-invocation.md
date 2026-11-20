---
patternId: 203
slug: robot-skill-invocation
title: "Robot Skill Invocation"
summary: "Contrato experimental para robot skill invocation en agentes multimodales y sistemas físicos simulados, con límites y pruebas negativas."
family: multimodal-embodied-ai
legacyGroup: 37
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_203_robot_skill_invocation.ts
tags: [multimodal, embodied, simulation]
related: [50, 168, 174]
combinesWith: [77, 98]
antiPatterns:
  - Usar un prototipo de simulación como controlador físico certificado.
references: []
---

## Propósito y contexto

Robot Skill Invocation delimita decisiones de percepción, control y supervisión para sistemas multimodales y embodied.

## Solución e implementación

Contrato TypeScript en `src/pattern_203_robot_skill_invocation.ts`; pruebas de regresión en `tests/p10_embodied_patterns.test.ts`. Modelo de amenazas y límites en `research/P10_EMBODIED_199_206_IMPLEMENTATION_NOTES.md`.

## Seguridad y límites

Implementación educativa de simulación, sin sensores reales, actuadores, control de seguridad funcional certificado ni validación sim-to-real. Los mecanismos de parada física deben ser independientes.

## Evidencia y evaluación

Estado `needs-review`. Requiere experimentos reproducibles, escenarios adversariales, revisión de literatura primaria y controles físicos antes de uso operativo.
