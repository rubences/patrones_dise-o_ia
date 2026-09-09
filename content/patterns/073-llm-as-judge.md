---
patternId: 73
slug: llm-as-judge
title: LLM-as-Judge
summary: Usa un modelo como evaluador escalable bajo una rúbrica explícita, calibrando sus scores contra evidencia humana o métricas deterministas antes de convertirlos en decisiones.
family: evaluation-qa
legacyGroup: 17
level: workflow
difficulty: advanced
maturity: established
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_73_llm_as_judge.ts
tags: [evaluation, judge, rubric, quality]
related: [4, 43, 76]
combinesWith: [52, 74, 91]
antiPatterns:
  - Interpretar el score del juez como ground truth sin calibración.
  - Rellenar dimensiones no evaluadas con una puntuación favorable por defecto.
  - Usar un juez de la misma familia como única evidencia en dominios críticos.
references: []
---
# Propósito
LLM-as-Judge permite evaluar outputs a escala cuando una rúbrica puede expresarse con claridad y la evaluación humana completa sería demasiado costosa.

## Implementación del repositorio
`src/pattern_73_llm_as_judge.ts` define cinco dimensiones ponderadas y pide al LLM líneas `DIMENSION | SCORE | FEEDBACK`. Después calcula un score ponderado.

Si una dimensión no se parsea, la implementación inserta **7/10 por defecto** con `No evaluado explícitamente`. Esto sesga el resultado hacia una nota favorable en caso de fallo de formato. Además, la respuesta evaluada se trunca a 500 caracteres, lo que puede omitir errores o evidencia relevante.

El comparador ejecuta el mismo juez sobre todas las respuestas y ordena por score. No controla sesgos de posición, longitud, estilo o auto-preferencia del modelo.

## Producción
Usa structured output, marca parsing fallido como `invalid`, calibra contra anotadores humanos y mide acuerdo por dimensión. Para factualidad, prioriza verificadores o fuentes externas; para seguridad, no delegues autorización al juez.

## Relaciones
**Regression Testing (76)** consume métricas repetibles; **A/B Testing (75)** compara variantes; LLM-as-Judge puede ser una señal dentro de ambos.