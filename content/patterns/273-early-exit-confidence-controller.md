---
patternId: 273
slug: early-exit-confidence-controller
title: "Early Exit Confidence Controller"
summary: "Contrato experimental de cómputo en inferencia para early exit confidence controller, con presupuestos y validaciones reproducibles."
family: inference-compute-optimization
legacyGroup: 46
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_273_early_exit_confidence_controller.ts
tags: [inference, reasoning, optimization]
related: [98, 149, 271]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar un umbral heurístico como garantía de corrección del modelo.
references: []
---

## Problema y solución

Early Exit Confidence Controller ofrece un contrato de control acotado de inferencia. Implementación: `src/pattern_273_early_exit_confidence_controller.ts`.

## Evaluación y límites

Pruebas: `tests/p12_inference_patterns.test.ts`. Los valores de confianza, verificación y presupuesto proceden de entradas externas; no garantizan precisión ni optimización global.

## Evidencia

Estado `needs-review`; pendiente de validación experimental y bibliografía primaria.
