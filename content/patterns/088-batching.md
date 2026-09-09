---
patternId: 88
slug: batching
title: Batching
summary: Agrupa solicitudes compatibles llegadas en una ventana corta para amortizar overhead manteniendo un resultado individual para cada llamador.
family: production-finops
legacyGroup: 20
level: architecture
difficulty: intermediate
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_88_batching.ts
tags: [batching, throughput, latency, cost]
related: [48, 79, 80]
combinesWith: [77, 92]
antiPatterns:
  - Batchear solicitudes con permisos o parámetros incompatibles.
  - No validar que el backend devuelve un resultado por input.
  - Aumentar la ventana hasta deteriorar latencia interactiva.
references: []
---
# Propósito
Batching intercambia una pequeña espera por mayor throughput y menos overhead de request.

## Implementación del repositorio
`src/pattern_88_batching.ts` acumula promesas hasta `maxLote` o `ventanaMs`, llama a un procesador y desmultiplexa por índice. Si el backend devuelve menos resultados que inputs, algunas promesas se resolverán con `undefined` sin validación.

`flush()` procesa toda la cola actual; bajo una ráfaga puede superar conceptualmente el `maxLote` si varias entradas llegan antes de que el flush asíncrono vacíe, por lo que producción debe trocear explícitamente.

## Producción
Valida cardinalidad, límites de payload, aislamiento por configuración/tenant, deadlines individuales y backpressure. Mide throughput frente a p95/p99 latency.

## Relaciones
Semantic Cache elimina trabajo repetido; Batching amortiza trabajo diferente concurrente.