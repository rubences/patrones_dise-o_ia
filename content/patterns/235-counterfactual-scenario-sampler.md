---
patternId: 235
slug: counterfactual-scenario-sampler
title: "Counterfactual Scenario Sampler"
summary: "Contrato experimental para counterfactual scenario sampler y control de procedencia, calidad y riesgos de datos sintéticos."
family: trustworthy-synthetic-simulation
legacyGroup: 41
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_235_counterfactual_scenario_sampler.ts
tags: [synthetic-data, simulation, governance]
related: [98, 191, 205]
combinesWith: [77, 149]
antiPatterns:
  - Considerar una comparación de medias como equivalencia de distribuciones.
references: []
---

## Problema y solución

Counterfactual Scenario Sampler propone un control diferenciado para conjuntos de datos sintéticos. Código: `src/pattern_235_counterfactual_scenario_sampler.ts`.

## Pruebas y límites

`tests/p11_synthetic_patterns.test.ts`. Las coincidencias exactas no descartan ataques de inferencia de pertenencia ni garantizan privacidad. Las métricas resumidas no certifican fidelidad.

## Evidencia

Estado `needs-review`. Exigir pruebas adversariales y fuentes primarias verificadas.
