---
patternId: 250
slug: human-disagreement-escalation
title: "Human Disagreement Escalation"
summary: "Contrato experimental para human disagreement escalation con supervisión, delegación y trazabilidad de colaboración humano-IA."
family: adaptive-human-ai-collaboration
legacyGroup: 43
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_250_human_disagreement_escalation.ts
tags: [human-ai, collaboration, oversight]
related: [8, 98, 197]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar métricas declaradas de carga como diagnósticos psicológicos.
references: []
---

## Problema y solución

Human Disagreement Escalation delimita un mecanismo de cooperación, supervisión o confianza humano-IA. Código: `src/pattern_250_human_disagreement_escalation.ts`.

## Pruebas y límites

`tests/p11_human_ai_patterns.test.ts`. La autorización real, la identidad y la evaluación de sesgos requieren controles y datos externos.

## Evidencia

Estado `needs-review`. Requiere evaluación humana y fuentes primarias verificadas.
