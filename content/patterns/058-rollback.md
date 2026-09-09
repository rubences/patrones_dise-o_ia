---
patternId: 58
slug: rollback
title: Rollback
summary: Revierte un flujo multi-paso mediante operaciones compensatorias explícitas para recuperar un estado coherente después de un fallo parcial.
family: reliability
legacyGroup: 13
level: architecture
difficulty: advanced
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_58_rollback.ts
tags: [rollback, compensation, transaction, recovery]
related: [22, 44, 85]
combinesWith: [20, 27, 77]
antiPatterns:
  - Marcar una acción como revertida cuando no existe compensación real.
  - Suponer atomicidad distribuida sin diseñar sagas o transacciones.
  - Compensar en un orden distinto al de dependencias reales.
references: []
---
# Propósito
Rollback registra operaciones y sus compensaciones para deshacer efectos ya ejecutados cuando un paso posterior falla.

## Implementación del repositorio
`src/pattern_58_rollback.ts` mantiene un historial en memoria y ejecuta compensaciones en orden inverso. Si una transacción no tiene compensación, la demo la **marca igualmente como revertida**, aunque no haya revertido ningún efecto.

Ese comportamiento es pedagógico y debe corregirse en producción. Una operación sin compensación debería quedar explícitamente como no reversible o requerir escalado.

## Producción
Define compensaciones idempotentes, estados `compensating/compensated/compensation_failed`, persistencia durable y correlación de saga. Registra la evidencia de cada compensación.

## Relaciones
**Memento (22)** restaura estado local; **Checkpointing (44)** permite reanudar; Rollback gestiona efectos mediante compensaciones.