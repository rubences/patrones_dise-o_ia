---
patternId: 57
slug: task-delegation
title: Task Delegation
summary: Asigna tareas a agentes según capacidades, disponibilidad, prioridad y carga observable, separando la decisión de asignación de la ejecución del trabajo.
family: multi-agent
legacyGroup: 14
level: workflow
difficulty: intermediate
maturity: established
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_57_task_delegation.ts
tags: [delegation, scheduling, routing, workload]
related: [38, 60, 65]
combinesWith: [44, 77, 94]
antiPatterns:
  - Llamar óptima a una asignación greedy sin función de optimización global.
  - Representar carga con números locales que no reflejan capacidad real.
  - Perder tareas no asignadas por no disponer de cola durable ni reintento.
references: []
---
# Propósito
Task Delegation decide quién debe ejecutar una tarea y con qué prioridad, manteniendo separadas selección, cola, ejecución y seguimiento.

## Implementación del repositorio
`src/pattern_57_task_delegation.ts` ordena tareas por prioridad, filtra agentes por disponibilidad/carga inferior al 90%, busca coincidencias por substrings de habilidad y elige el candidato con menor carga. Después incrementa la carga en 20 puntos y ejecuta las tareas asignadas mediante `Promise.all`.

La estrategia es **greedy y heurística**, no una asignación óptima. La carga es un valor local artificial y no incorpora latencia, coste, capacidad de modelo, SLA ni afinidad real. Una tarea sin candidato queda pendiente en memoria, sin durable queue ni retry automático.

## Producción
Usa un scheduler con métricas reales, leases, timeouts y requeue. Separa `queued`, `leased`, `running`, `succeeded`, `failed` y `dead-letter`. Para afinidad compleja puede emplearse scoring multicriterio o un solver, pero debe existir una política clara y observable.

## Seguridad
La capacidad para ejecutar una tarea no implica autorización. Antes de delegar acciones con efectos, verifica permisos del agente y del usuario originador.

## Relaciones
**Agent Registry (65)** descubre capacidades; **Orchestrator-Workers (60)** genera y coordina subtareas; Task Delegation decide asignación.