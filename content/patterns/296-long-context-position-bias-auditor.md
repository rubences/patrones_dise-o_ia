---
patternId: 296
slug: long-context-position-bias-auditor
title: "Long-Context Position Bias Auditor"
summary: "Contrato experimental de ingeniería de contexto para long-context position bias auditor, con controles de presupuesto y calidad."
family: context-engineering
legacyGroup: 48
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_296_long_context_position_bias_auditor.ts
tags: [context-engineering, retrieval, safety]
related: [98, 149, 291]
combinesWith: [77, 124]
antiPatterns:
  - Considerar una heurística de contexto como garantía de veracidad o aislamiento.
references: []
---

## Problema y solución

Long-Context Position Bias Auditor define un contrato de selección, composición o verificación de contexto para agentes. Código: `src/pattern_296_long_context_position_bias_auditor.ts`.

## Pruebas y límites

`tests/p12_context_patterns.test.ts`. Las prioridades, relevancias y etiquetas de confianza requieren validación externa. Marcar contenido como no confiable no impide técnicamente la inyección de instrucciones.

## Evidencia

Estado `needs-review`; exige pruebas adversariales y fuentes primarias.
