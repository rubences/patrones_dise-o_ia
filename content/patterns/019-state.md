---
patternId: 19
slug: state
title: State
summary: Modela explícitamente estados y transiciones para que el comportamiento de un agente o workflow dependa de su fase de ciclo de vida sin condicionales dispersos.
family: foundations
legacyGroup: 3
level: component
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_19_state.ts
tags: [gof, behavioral, state-machine, lifecycle]
related: [22, 24, 44]
combinesWith: [8, 27, 77]
antiPatterns:
  - Permitir transiciones implícitas no auditables.
  - Usar texto libre del LLM como autoridad final de transición crítica.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
State encapsula comportamiento dependiente del estado. Para workflows agénticos convierte el lifecycle en una máquina explícita y verificable.

## Problema
Los condicionales `if status === ...` dispersos hacen difícil demostrar qué transiciones están permitidas.

## Solución
Representa cada estado o tabla de transición como política explícita y define eventos válidos.

```text
NEW -> RUNNING -> WAITING_APPROVAL -> COMPLETED
             \-> FAILED
```

## Aplicabilidad
Úsalo cuando el lifecycle tenga reglas, reintentos, aprobación o recuperación. Para procesos distribuidos persistentes puede combinarse con workflow engines o event sourcing.

## Seguridad
Las transiciones sensibles deben validarse determinísticamente. El LLM puede proponer una transición, pero una policy debe autorizarla.

## Implementación del repositorio
`src/pattern_19_state.ts` modela estados de ciclo de vida.

## Relaciones
**Memento (22)** captura snapshots; **Command (20)** representa acciones; **Checkpointing (44)** persiste progreso.