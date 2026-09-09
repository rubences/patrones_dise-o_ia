---
patternId: 93
slug: speculative-execution
title: Speculative Execution
summary: Lanza simultáneamente un camino rápido y otro más fiable para reducir latencia percibida, tratando el primer resultado como provisional hasta que la ruta verificada confirma o corrige.
family: production-finops
legacyGroup: 21
level: architecture
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_93_speculative_execution.ts
tags: [speculative, latency, parallelism, verification]
related: [39, 43, 79]
combinesWith: [77, 78, 92]
antiPatterns:
  - Llamar ejecución especulativa a una secuencia que empieza la verificación después del draft.
  - Mostrar un draft de alto impacto como si ya estuviera confirmado.
  - Duplicar coste sistemáticamente sin medir tasa de corrección y valor de latencia.
references: []
---
# Propósito
Speculative Execution reduce la latencia percibida iniciando desde el mismo instante un camino rápido y un camino de mayor fidelidad.

## Implementación del repositorio
Tras el hardening P0, `src/pattern_93_speculative_execution.ts` invoca `draftFn()` y `verificadoFn()` **antes de esperar a cualquiera de los dos**. Cuando llega el draft puede notificarse mediante `onDraft`; después, el resultado verificado confirma o reemplaza la salida provisional.

Esto corrige la implementación anterior, que hacía `await draftFn()` y solo entonces comenzaba `verificarFn(draft)`, por lo que las latencias se sumaban y no existía paralelismo real.

El camino verificado ya no depende del draft: ambos calculan una respuesta desde la misma entrada. Esa independencia es precisamente lo que permite la concurrencia real. Si la verificación falla, el error se propaga; el producto debe decidir si un draft puede mantenerse o debe retirarse.

## Producción
Usa este patrón solo cuando una salida provisional sea aceptable y claramente tratada como tal. Mide `time-to-first-useful-output`, latencia final, coste duplicado y tasa/severidad de correcciones. En operaciones irreversibles, nunca ejecutes efectos basándote únicamente en el draft.

## Relaciones
**Cascade (39)** escala secuencialmente y puede ahorrar coste; **Streaming (79)** entrega incrementalmente una sola ejecución; Speculative Execution compra latencia mediante trabajo paralelo.