---
patternId: 317
slug: model-efficiency-pareto-selector
title: "Model Efficiency Pareto Selector"
summary: "Contrato experimental de sostenibilidad y eficiencia para model efficiency pareto selector, basado en estimaciones de consumo y emisiones."
family: ai-energy-sustainability
legacyGroup: 50
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_317_model_efficiency_pareto_selector.ts
tags: [sustainability, energy, carbon-aware]
related: [98, 149, 311]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar estimaciones externas de carbono como mediciones ambientales certificadas.
references: []
---

## Problema y solución

Model Efficiency Pareto Selector define un control delimitado de eficiencia, planificación o atribución de recursos energéticos en IA. Código: `src/pattern_317_model_efficiency_pareto_selector.ts`.

## Pruebas y límites

`tests/p12_sustainability_patterns.test.ts`. Las intensidades de carbono, consumos y previsiones son entradas externas. No se incluyen emisiones del ciclo de vida ni certificación ambiental.

## Evidencia

Estado `needs-review`; requiere telemetría contrastada y bibliografía primaria.
