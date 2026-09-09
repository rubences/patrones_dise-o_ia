---
patternId: 46
slug: bulkhead
title: Bulkhead
summary: Aísla capacidad y concurrencia por componente o clase de trabajo para impedir que la saturación de un flujo consuma todos los recursos compartidos.
family: reliability
legacyGroup: 9
level: architecture
difficulty: intermediate
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_46_bulkhead.ts
tags: [resilience, bulkhead, concurrency, isolation]
related: [45, 47, 80]
combinesWith: [77, 78, 94]
antiPatterns:
  - Crear cuotas sin observar utilización y rechazo.
  - Confundir límite de promesas locales con aislamiento real de CPU, memoria o conexiones.
  - Reservar toda capacidad a una clase y provocar starvation de otra.
references: []
---
# Propósito
Bulkhead divide recursos en compartimentos independientes para limitar el blast radius de saturación o fallos.

## Implementación del repositorio
`src/pattern_46_bulkhead.ts` mantiene contadores locales de concurrencia y usa `Promise.race` con timeout. La operación subyacente no se cancela necesariamente al ganar el timeout; puede seguir consumiendo recursos.

## Producción
Combina límites de concurrencia con colas, cancelación/AbortSignal, connection pools o cuotas reales de infraestructura. Mide utilización, rechazos, tiempo en cola y starvation por clase.

## Relaciones
**Rate Limiting (80)** regula tasa; Bulkhead regula capacidad concurrente. **Circuit Breaker (45)** aísla una dependencia degradada.