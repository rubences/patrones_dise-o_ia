---
patternId: 277
slug: uncertainty-triggered-deliberation
title: "Uncertainty-Triggered Deliberation"
summary: "Contrato experimental de cómputo en inferencia para uncertainty-triggered deliberation, con presupuestos y validaciones reproducibles."
family: inference-compute-optimization
legacyGroup: 46
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_277_uncertainty_triggered_deliberation.ts
tags: [inference, reasoning, optimization]
related: [98, 149, 271]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar un umbral heurístico como garantía de corrección del modelo.
references: []
---

## Problema y solución

Uncertainty-Triggered Deliberation ofrece un contrato de control acotado de inferencia. Implementación: `src/pattern_277_uncertainty_triggered_deliberation.ts`.

## Evaluación y límites

Pruebas: `tests/p12_inference_patterns.test.ts`. Los valores de confianza, verificación y presupuesto proceden de entradas externas; no garantizan precisión ni optimización global.

## Evidencia

Estado `needs-review`; pendiente de validación experimental y bibliografía primaria.
