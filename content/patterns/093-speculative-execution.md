---
patternId: 93
slug: speculative-execution
title: Speculative Execution
summary: Produce un resultado preliminar rápido mientras una ruta más fiable verifica o mejora el resultado, corrigiendo solo cuando ambas divergen.
family: production-finops
legacyGroup: 21
level: architecture
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_93_speculative_execution.ts
tags: [speculative, latency, verification, parallel]
related: [39, 43, 79]
combinesWith: [73, 77]
antiPatterns:
  - Mostrar un draft de alto impacto antes de verificarlo.
  - Llamar ejecución paralela a una verificación que empieza después de esperar al draft.
  - Corregir silenciosamente contenido que el usuario ya pudo usar.
references: []
---
# Propósito
Speculative Execution busca reducir latencia percibida mostrando una propuesta temprana y reconciliándola después con una ruta más fiable.

## Implementación del repositorio
`src/pattern_93_speculative_execution.ts` espera primero `await draftFn()` y **solo después llama `verificarFn(draft)`**. Por tanto, la demo no lanza ambos caminos en paralelo pese a que el comentario dice que sí; la latencia total es aproximadamente draft + verificación.

Este es un hallazgo editorial importante. Para demostrar ejecución especulativa real, debe iniciarse el trabajo que pueda ejecutarse en paralelo antes de esperar resultados, respetando dependencias del verifier.

## Riesgo de UX
Una corrección posterior no siempre puede ser silenciosa. Para decisiones médicas, financieras o acciones con efectos, no publiques el draft como resultado definitivo.

## Producción
Define equivalencia semántica, estado provisional visible, política de cancelación y métricas de correction rate/TTFT/coste duplicado.

## Relaciones
**Cascade (39)** es secuencial por diseño; Speculative Execution acepta trabajo duplicado para bajar latencia.