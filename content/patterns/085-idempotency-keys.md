---
patternId: 85
slug: idempotency-keys
title: Idempotency Keys
summary: Vincula reintentos de una misma operación a una clave estable para que llamadas repetidas o concurrentes converjan en un único efecto observable.
family: reliability
legacyGroup: 20
level: component
difficulty: intermediate
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_85_idempotency_keys.ts
tags: [idempotency, retries, concurrency, side-effects]
related: [44, 47, 101]
combinesWith: [77, 92]
antiPatterns:
  - Generar una clave distinta en cada retry.
  - Considerar un Map local una garantía exactly-once distribuida.
  - Cachear para siempre resultados de operaciones cuyo dominio exige expiración.
references: []
---
# Propósito
Idempotency Keys desacopla «repetir una llamada» de «repetir el efecto». La misma operación lógica conserva una clave estable durante retries y carreras concurrentes.

## Implementación del repositorio
Tras el hardening P1, `src/pattern_85_idempotency_keys.ts` mantiene tanto resultados completados como Promises **en vuelo**. Si llega una segunda llamada con la misma clave mientras la primera ejecuta el side effect, se une a esa Promise y no vuelve a ejecutar la acción. Cuando la operación termina, el resultado entra en el registro con TTL; si falla, la entrada en vuelo se elimina para permitir un retry posterior.

Esto corrige la carrera anterior en la que dos llamadas simultáneas podían observar el Map vacío y ejecutar ambas el efecto.

## Límites
La garantía actual está acotada a **un único proceso**. Dos réplicas distintas no comparten ni `registro` ni `enCurso`. Para sistemas distribuidos se necesita almacenamiento compartido con operación atómica/unique constraint/lease y una estrategia frente a procesos que mueren después del side effect pero antes de persistir el resultado.

## Producción
Deriva la clave de la identidad de la operación, persiste estado durable, define TTL por dominio y combina con outbox/inbox o primitivas transaccionales cuando se necesite robustez fuerte. «Exactly-once» extremo a extremo requiere cooperación del sistema que aplica el efecto.

## Relaciones
**Retry with Backoff (47)** repite llamadas; **Tool Call Validation (101)** valida la acción; Idempotency Keys evita duplicar su efecto.