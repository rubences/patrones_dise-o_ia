---
patternId: 351
slug: evaluation-dataset-contamination-gate
title: "Evaluation Dataset Contamination Gate"
summary: "Contrato experimental de integridad de evaluación: Evaluation Dataset Contamination Gate."
family: ai-evaluation-integrity
legacyGroup: 54
level: workflow
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_351_evaluation_dataset_contamination_gate.ts
tags: [evaluation, evidence, integrity]
related: [73, 76, 77]
combinesWith: [98, 329]
antiPatterns:
  - Considerar una comprobación sintáctica como evidencia estadística o garantía de calidad.
references: []
---

## Problema

Evaluation Dataset Contamination Gate aborda un riesgo concreto en la fiabilidad y trazabilidad de la evaluación de sistemas de IA.

## Solución de referencia

La clase `Pattern351Contract` implementa la operación determinista `detect` y devuelve resultados inspeccionables. La comprobación es limitada y no sustituye evaluaciones empíricas ni auditorías independientes.

## Validación y evidencia

Evidencia `needs-review`. Antes de producción deben añadirse pruebas de propiedades, escenarios reales, límites estadísticos y referencias primarias pertinentes.
