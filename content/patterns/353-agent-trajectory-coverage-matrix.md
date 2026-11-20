---
patternId: 353
slug: agent-trajectory-coverage-matrix
title: "Agent Trajectory Coverage Matrix"
summary: "Contrato experimental de integridad de evaluación: Agent Trajectory Coverage Matrix."
family: ai-evaluation-integrity
legacyGroup: 54
level: workflow
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_353_agent_trajectory_coverage_matrix.ts
tags: [evaluation, evidence, integrity]
related: [73, 76, 77]
combinesWith: [98, 329]
antiPatterns:
  - Considerar una comprobación sintáctica como evidencia estadística o garantía de calidad.
references: []
---

## Problema

Agent Trajectory Coverage Matrix aborda un riesgo concreto en la fiabilidad y trazabilidad de la evaluación de sistemas de IA.

## Solución de referencia

La clase `Pattern353Contract` implementa la operación determinista `coverage` y devuelve resultados inspeccionables. La comprobación es limitada y no sustituye evaluaciones empíricas ni auditorías independientes.

## Validación y evidencia

Evidencia `needs-review`. Antes de producción deben añadirse pruebas de propiedades, escenarios reales, límites estadísticos y referencias primarias pertinentes.
