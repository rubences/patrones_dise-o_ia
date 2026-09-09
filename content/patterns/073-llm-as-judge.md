---
patternId: 73
slug: llm-as-judge
title: LLM-as-Judge
summary: Usa un modelo como evaluador escalable bajo una rúbrica explícita, manteniendo ausencias y fallos de parsing como evidencia inválida en vez de imputar scores favorables.
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
La implementación exige una línea válida por cada dimensión de la rúbrica. `parsearSalidaJuez()` rechaza dimensiones ausentes, duplicadas, desconocidas, scores no numéricos o fuera de 0–10 y feedback ausente.

Un juicio inválido devuelve `estado: "invalido"`, `scorePonderado: null` y errores explícitos. Ya no existe imputación de 7/10, 5/10 u otra nota de conveniencia. La comparación excluye juicios inválidos y evita declarar ganador en empate exacto.

## Producción
El parsing estricto evita el fail-open, pero un juez LLM sigue siendo una medición probabilística. Calibra scores contra anotadores humanos, informa acuerdo inter-evaluador y usa verificadores deterministas o fuentes externas para factualidad y autorización.

Para decisiones relevantes, registra versión de modelo, prompt del juez, rúbrica, dataset y semillas/configuración cuando aplique.

## Relaciones
**Regression Testing (76)** consume métricas repetibles; **A/B Testing (75)** compara variantes. Un Judge puede ser una señal dentro de ambos, no su única fuente de verdad.
