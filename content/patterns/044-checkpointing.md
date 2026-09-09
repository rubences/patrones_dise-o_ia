---
patternId: 44
slug: checkpointing
title: Checkpointing
summary: Persiste puntos de progreso recuperables para reanudar tareas largas después de fallos sin repetir innecesariamente trabajo ya validado.
family: reliability
legacyGroup: 9
level: architecture
difficulty: intermediate
maturity: established
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_44_checkpointing.ts
tags: [checkpoint, recovery, state, resilience]
related: [22, 27, 58]
combinesWith: [85, 77, 94]
antiPatterns:
  - Guardar solo estado local y llamarlo recuperación durable.
  - Reanudar sin verificar que efectos externos anteriores ya ocurrieron.
  - Persistir prompts/secretos completos sin política de protección.
references: []
---
# Propósito
Checkpointing captura estado suficiente para continuar una ejecución larga desde un punto consistente.

## Implementación del repositorio
`src/pattern_44_checkpointing.ts` usa un `Map` en memoria y realiza una copia JSON del estado. Simula un fallo en el paso 3 y reanuda usando el checkpoint entregado al error.

La demostración no sobrevive al reinicio del proceso y crea un nuevo `tareaId` al reanudar. Por tanto, ilustra el mecanismo conceptual, no persistencia durable ni exactly-once execution.

## Producción
Persistir checkpoints transaccionalmente, versionar schema, asociarlos a run IDs estables y registrar efectos externos/idempotency keys. Define qué estado es seguro almacenar y cuándo un checkpoint es consistente.

## Relaciones
**Memento (22)** captura snapshots de objeto; **Rollback (58)** compensa efectos; **Idempotency Keys (85)** evita duplicar operaciones al reanudar.