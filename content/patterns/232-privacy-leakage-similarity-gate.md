---
patternId: 232
slug: privacy-leakage-similarity-gate
title: "Privacy Leakage Similarity Gate"
summary: "Contrato experimental para privacy leakage similarity gate y control de procedencia, calidad y riesgos de datos sintéticos."
family: trustworthy-synthetic-simulation
legacyGroup: 41
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_232_privacy_leakage_similarity_gate.ts
tags: [synthetic-data, simulation, governance]
related: [98, 191, 205]
combinesWith: [77, 149]
antiPatterns:
  - Considerar una comparación de medias como equivalencia de distribuciones.
references: []
---

## Problema y solución

Privacy Leakage Similarity Gate propone un control diferenciado para conjuntos de datos sintéticos. Código: `src/pattern_232_privacy_leakage_similarity_gate.ts`.

## Pruebas y límites

`tests/p11_synthetic_patterns.test.ts`. Las coincidencias exactas no descartan ataques de inferencia de pertenencia ni garantizan privacidad. Las métricas resumidas no certifican fidelidad.

## Evidencia

Estado `needs-review`. Exigir pruebas adversariales y fuentes primarias verificadas.
