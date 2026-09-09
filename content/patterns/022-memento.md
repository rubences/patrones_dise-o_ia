---
patternId: 22
slug: memento
title: Memento
summary: Captura y restaura snapshots de estado sin exponer la representación interna del objeto, permitiendo recuperación, historial y experimentación controlada.
family: foundations
legacyGroup: 4
level: component
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_22_memento.ts
tags: [gof, behavioral, memento, snapshot]
related: [19, 44, 58]
combinesWith: [20, 27, 77]
antiPatterns:
  - Guardar secretos o PII indiscriminadamente en snapshots.
  - Confundir restauración de estado con reversión de efectos externos.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Memento conserva una representación restaurable del estado de un objeto. En agentes permite volver a una conversación, plan o configuración anterior.

## Problema
Necesitamos recovery o undo sin permitir que consumidores manipulen directamente internals del agente.

## Solución
El originator crea un memento opaco; un caretaker lo conserva y puede solicitar restauración posterior.

## Aplicabilidad
Útil en sesiones, editores asistidos y experimentación. Para procesos largos, combina snapshots con eventos o checkpoints persistentes.

## Seguridad y privacidad
Define retención, cifrado y redacción. Restaurar el estado no deshace automáticamente emails enviados, pagos o escrituras externas.

## Implementación del repositorio
`src/pattern_22_memento.ts` demuestra snapshots de estado e historial.

## Relaciones
**State (19)** modela el lifecycle; **Checkpointing (44)** persiste recuperación; **Rollback (58)** aborda compensación de efectos.