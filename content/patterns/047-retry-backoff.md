---
patternId: 47
slug: retry-backoff
title: Retry with Backoff
summary: Reintenta fallos transitorios con pausas crecientes y jitter, limitando presión sobre una dependencia y evitando reintentos sincronizados.
family: reliability
legacyGroup: 9
level: component
difficulty: beginner
maturity: foundational
llmRequired: false
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_47_retry_backoff.ts
tags: [retry, backoff, jitter, resilience]
related: [45, 46, 85]
combinesWith: [80, 81, 77]
antiPatterns:
  - Reintentar errores permanentes o de autorización.
  - Reintentar operaciones no idempotentes sin protección.
  - Multiplicar retries en varias capas y provocar retry storms.
references: []
---
# Propósito
Retry with Backoff recupera fallos transitorios espaciando nuevos intentos y añadiendo jitter para reducir sincronización entre clientes.

## Implementación del repositorio
`src/pattern_47_retry_backoff.ts` configura máximo de intentos, espera inicial, multiplicador, cap y jitter. Decide si un error es reintentable buscando substrings en `error.message`.

La clasificación textual es pedagógica: en producción usa códigos/typed errors, `Retry-After`, políticas por operación y deadlines globales.

## Producción
Exige idempotencia o idempotency keys para operaciones con efectos, limita el tiempo total, respeta señales del servidor y evita retries anidados. Registra intentos y causa final.

## Relaciones
**Circuit Breaker (45)** impide continuar reintentando una dependencia enferma; **Idempotency Keys (85)** protegen efectos; **Rate Limiting (80)** respeta capacidad del servicio.