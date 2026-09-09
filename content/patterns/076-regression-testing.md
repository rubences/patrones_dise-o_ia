---
patternId: 76
slug: regression-testing
title: Regression Testing
summary: Convierte comportamientos esperados y vulnerabilidades corregidas en una suite versionada que detecta degradación al cambiar modelos, prompts, herramientas o datos.
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
  - Hacer CI dependiente únicamente de un juez estocástico sin tolerancias ni repetición.
references: []
---
# Propósito
Regression Testing protege comportamientos que ya funcionaban y convierte incidentes o hallazgos de seguridad en pruebas que no deben volver a fallar.

## Implementación del repositorio
`src/pattern_76_regression_testing.ts` combina keywords obligatorias/prohibidas con un score LLM 0–100. Mantiene el score anterior en un `Map` de la instancia y declara regresión si cae más de 10 puntos.

Ese historial **no persiste entre procesos ni builds**, por lo que la comparación `v1.0`/`v1.1` de la demo solo funciona dentro de la misma ejecución. Además, algunos golden son frágiles: el test sobre Observer prohíbe literalmente `observer`, aunque la propia pregunta usa el nombre inglés del patrón.

El juez es estocástico y una segunda ejecución idéntica puede variar sin que el producto haya cambiado.

## Producción
Persiste baselines por versión, usa assertions deterministas para invariantes y repeticiones/intervalos para métricas generativas. Separa tests funcionales, seguridad, groundedness, latencia y coste, y define qué fallos bloquean CI.

## Relaciones
**Red Teaming (74)** produce nuevos casos; **LLM-as-Judge (73)** puede aportar scoring; Regression Testing convierte el aprendizaje en una barrera continua.