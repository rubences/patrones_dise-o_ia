---
patternId: 356
slug: evaluation-evidence-freshness-gate
title: "Evaluation Evidence Freshness Gate"
summary: "Contrato experimental de integridad de evaluación: Evaluation Evidence Freshness Gate."
family: ai-evaluation-integrity
legacyGroup: 54
level: workflow
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_356_evaluation_evidence_freshness_gate.ts
tags: [evaluation, evidence, integrity]
related: [73, 76, 77]
combinesWith: [98, 329]
antiPatterns:
  - Considerar una comprobación sintáctica como evidencia estadística o garantía de calidad.
references: []
---

## Problema

Evaluation Evidence Freshness Gate aborda un riesgo concreto en la fiabilidad y trazabilidad de la evaluación de sistemas de IA.

## Solución de referencia

La clase `Pattern356Contract` implementa la operación determinista `check` y devuelve resultados inspeccionables. La comprobación es limitada y no sustituye evaluaciones empíricas ni auditorías independientes.

## Validación y evidencia

Evidencia `needs-review`. Antes de producción deben añadirse pruebas de propiedades, escenarios reales, límites estadísticos y referencias primarias pertinentes.
