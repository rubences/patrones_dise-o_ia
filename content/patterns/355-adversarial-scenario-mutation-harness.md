---
patternId: 355
slug: adversarial-scenario-mutation-harness
title: "Adversarial Scenario Mutation Harness"
summary: "Contrato experimental de integridad de evaluación: Adversarial Scenario Mutation Harness."
family: ai-evaluation-integrity
legacyGroup: 54
level: workflow
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_355_adversarial_scenario_mutation_harness.ts
tags: [evaluation, evidence, integrity]
related: [73, 76, 77]
combinesWith: [98, 329]
antiPatterns:
  - Considerar una comprobación sintáctica como evidencia estadística o garantía de calidad.
references: []
---

## Problema

Adversarial Scenario Mutation Harness aborda un riesgo concreto en la fiabilidad y trazabilidad de la evaluación de sistemas de IA.

## Solución de referencia

La clase `Pattern355Contract` implementa la operación determinista `mutate` y devuelve resultados inspeccionables. La comprobación es limitada y no sustituye evaluaciones empíricas ni auditorías independientes.

## Validación y evidencia

Evidencia `needs-review`. Antes de producción deben añadirse pruebas de propiedades, escenarios reales, límites estadísticos y referencias primarias pertinentes.
