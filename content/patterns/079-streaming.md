---
patternId: 79
slug: streaming
title: Streaming
summary: Entrega resultados incrementalmente y permite procesar, cancelar o moderar una respuesta antes de que la generación completa haya finalizado.
family: production-finops
legacyGroup: 18
level: architecture
difficulty: intermediate
maturity: established
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_79_streaming.ts
tags: [streaming, latency, ux, incremental]
related: [93, 95]
combinesWith: [53, 77, 78]
antiPatterns:
  - Llamar streaming a dividir una respuesta ya completa.
  - Mostrar contenido sensible antes de que pueda moderarse adecuadamente.
  - Ignorar cancelación y backpressure.
references: []
---
# Propósito
Streaming reduce latencia percibida y permite consumo incremental de una respuesta en generación.

## Implementación del repositorio
`src/pattern_79_streaming.ts` **no usa streaming nativo**. Primero espera `responses.create()` completo, divide `output_text` por espacios y añade delays de 10 ms para simular tokens.

El límite `maxTokens` cuenta palabras simuladas, no tokens de modelo, y detener el `StreamProcessor` no cancela generación porque esta ya terminó.

## Producción
Usa el protocolo de streaming del proveedor, `AbortSignal`/cancelación, backpressure, moderación incremental y métricas TTFT/throughput. Separa chunk de transporte de token real.

## Relaciones
**Speculative Execution (93)** puede ofrecer un draft temprano; Streaming entrega la generación real a medida que llega.