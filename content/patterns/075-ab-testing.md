---
patternId: 75
slug: ab-testing
title: A/B Testing
summary: Compara exactamente dos variantes con asignación controlada, observaciones válidas e incertidumbre explícita antes de recomendar un ganador.
family: evaluation-qa
legacyGroup: 17
level: workflow
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_75_ab_testing.ts
tags: [ab-testing, experimentation, prompts, metrics]
related: [73, 90, 91]
combinesWith: [77, 92, 76]
antiPatterns:
  - Declarar significancia a partir de una diferencia de puntos sin análisis de incertidumbre.
  - Imputar un score medio cuando una evaluación no existe o no se puede parsear.
  - Cambiar asignación de variante para la misma unidad experimental sin intención explícita.
references: []
---
# Propósito
A/B Testing compara variantes bajo condiciones controladas y separa una diferencia observada de evidencia suficiente para actuar.

## Implementación del repositorio
La clase acepta exactamente dos variantes. Puede asignar de forma sticky usando `unidadExperimental`; un ID forzado desconocido falla explícitamente en vez de caer a una variante aleatoria.

Las evaluaciones de calidad inválidas se excluyen como observaciones ausentes: no se reemplazan por 70. `resumirMuestra()` calcula media, desviación, error estándar e IC95 aproximado. `compararMuestrasCalidad()` estima el IC95 de la diferencia A−B y solo devuelve `diferencia_detectada` cuando ese intervalo no contiene 0 y cada brazo tiene al menos dos observaciones válidas.

El intervalo usa una aproximación normal de 1,96×SE. Es útil pedagógicamente y mucho más honesto que un umbral arbitrario, pero para muestras pequeñas o decisiones críticas debe sustituirse por Welch-t, bootstrap u otro análisis previsto en el diseño experimental.

## Producción
Prerregistra hipótesis, unidad experimental, métrica primaria, tamaño de muestra, criterio de parada y análisis. Controla múltiples comparaciones, peeking, efectos de cohorte y guardrails de seguridad/coste.

## Relaciones
**Canary Release (90)** controla riesgo de despliegue; **LLM-as-Judge (73)** puede aportar una métrica de calidad; **Regression Testing (76)** protege el ganador una vez adoptado.
