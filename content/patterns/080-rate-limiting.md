---
patternId: 80
slug: rate-limiting
title: Rate Limiting
summary: Controla la tasa de solicitudes por actor con un algoritmo explícito para proteger capacidad, repartir recursos y comunicar cuándo reintentar.
family: reliability
legacyGroup: 19
level: component
difficulty: intermediate
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_80_rate_limiting.ts
tags: [rate-limit, token-bucket, capacity, fairness]
related: [21, 46, 47]
combinesWith: [78, 92, 77]
antiPatterns:
  - Mantener buckets solo en memoria cuando existen múltiples réplicas.
  - Aplicar la misma cuota a operaciones con costes muy distintos.
  - Ocultar información de reintento al cliente.
references: []
---
# Propósito
Rate Limiting limita tasa sostenida y ráfagas por clave. El token bucket permite bursts hasta capacidad y recarga continua.

## Implementación del repositorio
`src/pattern_80_rate_limiting.ts` implementa un token bucket lazy razonable y aislado por clave. La limitación importante es que los buckets viven en un `Map` de un único proceso; varias instancias no comparten cuota y el mapa no expira claves inactivas.

## Producción
Usa store/coordinación distribuida cuando sea necesario, TTL de identidades, cuotas ponderadas por coste y headers de rate limit/retry. Considera clock behavior y atomicidad.

## Relaciones
**Bulkhead (46)** limita concurrencia; **Token Budget (78)** limita consumo; **Proxy (21)** puede alojar la política.