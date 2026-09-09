---
patternId: 90
slug: canary-release
title: Canary Release
summary: Expone una nueva variante a una fracción creciente de tráfico y revierte automáticamente cuando señales de salud predefinidas muestran regresión.
family: production-finops
legacyGroup: 21
level: architecture
difficulty: intermediate
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_90_canary_release.ts
tags: [canary, deployment, rollback, release]
related: [58, 75, 94]
combinesWith: [76, 77]
antiPatterns:
  - Promover con muestras insuficientes o una única métrica.
  - Reiniciar contadores y olvidar regresiones históricas relevantes.
  - Usar asignación aleatoria sin sticky routing cuando la experiencia debe ser consistente.
references: []
---
# Propósito
Canary Release limita blast radius y aumenta tráfico solo si la variante nueva cumple gates de salud.

## Implementación del repositorio
`src/pattern_90_canary_release.ts` asigna tráfico por `Math.random()`, acumula éxito/fallo del canary y, tras `minMuestrasPorPaso`, incrementa porcentaje o hace rollback a cero.

Al avanzar, reinicia las muestras y no distingue métricas de calidad, latencia o segmentos. La demo tampoco implementa persistencia ni sticky assignment.

## Producción
Usa cohortes consistentes, múltiples SLO/evals, intervalos estadísticos, ventanas temporales y rollback coordinado con versión/model/prompt.

## Relaciones
**A/B Testing (75)** aprende qué variante gana; Canary protege el despliegue. **Regression Testing (76)** aporta gates offline.