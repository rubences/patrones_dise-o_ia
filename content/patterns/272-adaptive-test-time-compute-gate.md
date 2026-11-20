---
patternId: 272
slug: adaptive-test-time-compute-gate
title: "Adaptive Test-Time Compute Gate"
summary: "Contrato experimental de cómputo en inferencia para adaptive test-time compute gate, con presupuestos y validaciones reproducibles."
family: inference-compute-optimization
legacyGroup: 46
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_272_adaptive_test_time_compute_gate.ts
tags: [inference, reasoning, optimization]
related: [98, 149, 271]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar un umbral heurístico como garantía de corrección del modelo.
references: []
---

## Problema y solución

Adaptive Test-Time Compute Gate ofrece un contrato de control acotado de inferencia. Implementación: `src/pattern_272_adaptive_test_time_compute_gate.ts`.

## Evaluación y límites

Pruebas: `tests/p12_inference_patterns.test.ts`. Los valores de confianza, verificación y presupuesto proceden de entradas externas; no garantizan precisión ni optimización global.

## Evidencia

Estado `needs-review`; pendiente de validación experimental y bibliografía primaria.
