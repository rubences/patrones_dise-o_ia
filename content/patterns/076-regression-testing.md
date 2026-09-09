---
patternId: 76
slug: regression-testing
title: Regression Testing
summary: Convierte comportamientos esperados en una suite versionada con baselines persistibles y estados explícitos para detectar degradación entre versiones.
family: evaluation-qa
legacyGroup: 17
level: workflow
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_76_regression_testing.ts
tags: [regression, golden-tests, ci, evaluation]
related: [70, 73, 74]
combinesWith: [90, 77, 102]
antiPatterns:
  - Guardar el baseline solo en memoria y llamarlo historial de versiones.
  - Diseñar golden tests que penalizan respuestas correctas por coincidencias léxicas arbitrarias.
  - Imputar un score cuando el juez no devuelve una medición válida.
references: []
---
# Propósito
Regression Testing protege comportamientos que ya funcionaban y convierte incidentes o hallazgos en pruebas que no deben volver a fallar.

## Implementación del repositorio
`BaselineStore` desacopla la suite del almacenamiento. `MemoryBaselineStore` sigue disponible para demos; `JsonFileRegressionBaselineStore` conserva snapshots versionados entre procesos mediante escritura temporal y `rename`.

Cada ejecución puede indicar `compararContra`. Si el baseline solicitado no existe, la suite falla explícitamente. Una transición `pasado → degradado/fallido/invalido` es regresión; también se detecta una caída de score superior a 10 puntos cuando ambas mediciones son válidas.

El evaluador LLM usa parsing numérico estricto. Un output no parseable produce `estado: "invalido"` y `scoreObtenido: null`; ya no se inventa un 60. Los golden checks léxicos siguen siendo pedagógicos y deben evolucionar hacia assertions semánticas o específicas de dominio.

## Producción
Persiste baselines en almacenamiento transaccional o artefactos de CI, conserva modelo/prompt/dataset/configuración y separa invariantes deterministas de métricas estocásticas. Para scores generativos, usa repeticiones e intervalos antes de bloquear releases por cambios pequeños.

## Relaciones
**Red Teaming (74)** produce nuevos casos; **LLM-as-Judge (73)** aporta señales probabilísticas; Regression Testing convierte el aprendizaje en una barrera continua.
