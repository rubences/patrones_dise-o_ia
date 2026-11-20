---
patternId: 352
slug: temporal-holdout-integrity-gate
title: "Temporal Holdout Integrity Gate"
summary: "Contrato experimental de integridad de evaluación: Temporal Holdout Integrity Gate."
family: ai-evaluation-integrity
legacyGroup: 54
level: workflow
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_352_temporal_holdout_integrity_gate.ts
tags: [evaluation, evidence, integrity]
related: [73, 76, 77]
combinesWith: [98, 329]
antiPatterns:
  - Considerar una comprobación sintáctica como evidencia estadística o garantía de calidad.
references: []
---

## Problema

Temporal Holdout Integrity Gate aborda un riesgo concreto en la fiabilidad y trazabilidad de la evaluación de sistemas de IA.

## Solución de referencia

La clase `Pattern352Contract` implementa la operación determinista `check` y devuelve resultados inspeccionables. La comprobación es limitada y no sustituye evaluaciones empíricas ni auditorías independientes.

## Validación y evidencia

Evidencia `needs-review`. Antes de producción deben añadirse pruebas de propiedades, escenarios reales, límites estadísticos y referencias primarias pertinentes.
