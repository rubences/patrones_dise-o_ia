---
patternId: 320
slug: energy-rebound-effect-auditor
title: "Energy Rebound Effect Auditor"
summary: "Contrato experimental de sostenibilidad y eficiencia para energy rebound effect auditor, basado en estimaciones de consumo y emisiones."
family: ai-energy-sustainability
legacyGroup: 50
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_320_energy_rebound_effect_auditor.ts
tags: [sustainability, energy, carbon-aware]
related: [98, 149, 311]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar estimaciones externas de carbono como mediciones ambientales certificadas.
references: []
---

## Problema y solución

Energy Rebound Effect Auditor define un control delimitado de eficiencia, planificación o atribución de recursos energéticos en IA. Código: `src/pattern_320_energy_rebound_effect_auditor.ts`.

## Pruebas y límites

`tests/p12_sustainability_patterns.test.ts`. Las intensidades de carbono, consumos y previsiones son entradas externas. No se incluyen emisiones del ciclo de vida ni certificación ambiental.

## Evidencia

Estado `needs-review`; requiere telemetría contrastada y bibliografía primaria.
