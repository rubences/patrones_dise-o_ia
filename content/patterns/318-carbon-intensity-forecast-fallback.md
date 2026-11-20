---
patternId: 318
slug: carbon-intensity-forecast-fallback
title: "Carbon Intensity Forecast Fallback"
summary: "Contrato experimental de sostenibilidad y eficiencia para carbon intensity forecast fallback, basado en estimaciones de consumo y emisiones."
family: ai-energy-sustainability
legacyGroup: 50
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_318_carbon_intensity_forecast_fallback.ts
tags: [sustainability, energy, carbon-aware]
related: [98, 149, 311]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar estimaciones externas de carbono como mediciones ambientales certificadas.
references: []
---

## Problema y solución

Carbon Intensity Forecast Fallback define un control delimitado de eficiencia, planificación o atribución de recursos energéticos en IA. Código: `src/pattern_318_carbon_intensity_forecast_fallback.ts`.

## Pruebas y límites

`tests/p12_sustainability_patterns.test.ts`. Las intensidades de carbono, consumos y previsiones son entradas externas. No se incluyen emisiones del ciclo de vida ni certificación ambiental.

## Evidencia

Estado `needs-review`; requiere telemetría contrastada y bibliografía primaria.
