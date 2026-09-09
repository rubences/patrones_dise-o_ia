---
patternId: 44
slug: checkpointing
title: Checkpointing
summary: Persiste snapshots de progreso para reanudar workflows largos desde un estado conocido sin repetir trabajo completado.
family: reliability
legacyGroup: 9
level: architecture
difficulty: intermediate
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_44_checkpointing.ts
tags: [checkpoint, recovery, persistence, workflow]
related: [22, 58, 85]
combinesWith: [60, 77, 94]
antiPatterns:
  - Guardar checkpoints solo en memoria cuando el objetivo es sobrevivir reinicios.
  - Persistir estado parcial con secretos o PII innecesarios.
  - Reanudar sin versionar workflow, schema o código que produjo el snapshot.
references: []
---
# Propósito
Checkpointing conserva suficiente estado para reanudar un workflow después de un fallo sin empezar desde cero.

## Implementación del repositorio
Tras el hardening P1, `src/pattern_44_checkpointing.ts` separa `GestorCheckpoints` de `CheckpointStore`. Incluye `MemoryCheckpointStore` para demos y `JsonFileCheckpointStore` para demostrar persistencia real entre instancias/procesos secuenciales.

El store JSON serializa timestamps, escribe a un fichero temporal y hace rename, evitando dejar un archivo parcialmente escrito en el caso común. El checkpoint incluye `tareaId`, por lo que una reanudación conserva la identidad del workflow original.

## Límites
El store JSON sigue siendo una implementación local y no resuelve concurrencia multi-proceso, locking distribuido, cifrado, migrations ni HA. Para producción se recomienda una base durable/transaccional o un motor de workflows.

## Producción
Versiona schema/workflow, cifra datos sensibles, añade TTL/retención, ownership y fencing tokens cuando puedan existir múltiples workers. Una reanudación debe validar compatibilidad entre el snapshot y la versión actual del código.

## Relaciones
**Memento (22)** guarda estado local; **Rollback (58)** compensa cambios; Checkpointing permite recuperación de progreso de larga duración.