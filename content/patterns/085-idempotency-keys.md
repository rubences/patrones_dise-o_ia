---
patternId: 85
slug: idempotency-keys
title: Idempotency Keys
summary: Asocia una acción con efecto a una clave estable para que reintentos equivalentes recuperen el resultado anterior sin duplicar el efecto externo.
family: reliability
legacyGroup: 20
level: component
difficulty: intermediate
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_85_idempotency_keys.ts
tags: [idempotency, side-effects, retry, exactly-once]
related: [20, 44, 47]
combinesWith: [58, 77]
antiPatterns:
  - Generar una clave nueva para cada retry de la misma acción.
  - Guardar el resultado después del efecto sin resolver carreras concurrentes.
  - Prometer exactly-once distribuido usando solo un Map local.
references: []
---
# Propósito
Idempotency Keys evita repetir efectos cuando un cliente no sabe si una operación previa terminó y reintenta.

## Implementación del repositorio
`src/pattern_85_idempotency_keys.ts` almacena resultados en un `Map` con TTL y demuestra que dos llamadas secuenciales con la misma clave envían un solo email.

La comprobación y la ejecución no son atómicas. Dos solicitudes concurrentes con la misma clave pueden ver ambas un miss y ejecutar dos veces. El registro tampoco es durable ni distribuido.

## Producción
Usa una reserva atómica de key, estados `in_progress/completed/failed`, persistencia y contrato de replay. La clave debe incluir el ámbito de identidad/tenant y una representación estable de la operación.

## Relaciones
Retry y Checkpointing se vuelven más seguros cuando los efectos externos son idempotentes.