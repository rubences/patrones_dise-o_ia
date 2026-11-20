---
patternId: 280
slug: verifier-guided-search-controller
title: "Verifier-Guided Search Controller"
summary: "Contrato experimental de cómputo en inferencia para verifier-guided search controller, con presupuestos y validaciones reproducibles."
family: inference-compute-optimization
legacyGroup: 46
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_280_verifier_guided_search_controller.ts
tags: [inference, reasoning, optimization]
related: [98, 149, 271]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar un umbral heurístico como garantía de corrección del modelo.
references: []
---

## Problema y solución

Verifier-Guided Search Controller ofrece un contrato de control acotado de inferencia. Implementación: `src/pattern_280_verifier_guided_search_controller.ts`.

## Evaluación y límites

Pruebas: `tests/p12_inference_patterns.test.ts`. Los valores de confianza, verificación y presupuesto proceden de entradas externas; no garantizan precisión ni optimización global.

## Evidencia

Estado `needs-review`; pendiente de validación experimental y bibliografía primaria.
