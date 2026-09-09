---
patternId: 91
slug: meta-prompting
title: Meta-Prompting
summary: Optimiza prompts reutilizables generando variantes y evaluándolas sobre un conjunto representativo de casos, separando búsqueda de prompts de generación de respuestas.
family: reasoning
legacyGroup: 21
level: workflow
difficulty: advanced
maturity: emerging
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_91_meta_prompting.ts
tags: [meta-prompting, optimization, prompts, evals]
related: [4, 73, 75]
combinesWith: [76, 90, 92]
antiPatterns:
  - Optimizar contra un evaluador que premia literalmente las frases añadidas.
  - Seleccionar prompts con el mismo conjunto usado para reportar calidad final.
  - Auto-promover una variante a producción sin canary ni revisión de seguridad.
references: []
---
# Propósito
Meta-Prompting trata el prompt como un artefacto optimizable. Genera candidatos, los evalúa sobre casos y conserva la variante que mejora una métrica definida.

## Implementación del repositorio
`src/pattern_91_meta_prompting.ts` contiene un optimizador genérico correctamente desacoplado mediante funciones `reescribir` y `evaluar`. Sin embargo, la demo usa ambas funciones **simuladas**: el reescritor concatena tres frases prefijadas y el evaluador suma puntos precisamente cuando detecta esas frases.

Por tanto, la progresión de score demuestra el mecanismo del bucle, no una mejora empírica de calidad del prompt.

## Producción
Usa un dataset separado en train/tuning y holdout, genera varias variantes por generación y combina métricas deterministas con jueces calibrados cuando sea necesario. Conserva coste, latencia, seguridad y robustez como objetivos, no solo una puntuación agregada.

La promoción debe pasar Regression Testing y, para cambios con riesgo, Canary Release. Versiona prompt, dataset, evaluador y modelo usados para que la optimización sea reproducible.

## Relaciones
**Evaluator-Optimizer (4)** optimiza una respuesta concreta; **A/B Testing (75)** compara variantes en tráfico; Meta-Prompting genera y selecciona el prompt reusable.