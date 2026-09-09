---
patternId: 87
slug: blackboard
title: Blackboard
summary: Coordina componentes desacoplados mediante un espacio de estado compartido al que reaccionan por suscripción, dejando que el orden emerja de los datos disponibles.
family: multi-agent
legacyGroup: 20
level: architecture
difficulty: advanced
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_87_blackboard.ts
tags: [blackboard, shared-state, events, multi-agent]
related: [23, 56, 60]
combinesWith: [44, 77, 85]
antiPatterns:
  - Usar un Map local como si fuera un bus distribuido durable.
  - Permitir ciclos de suscripción sin protección contra recursión infinita.
  - Sobrescribir claves sin versión, ownership o control de concurrencia.
references: []
---
# Propósito
Blackboard desacopla productores y consumidores mediante claves de estado compartido y suscripciones a cambios.

## Implementación del repositorio
`src/pattern_87_blackboard.ts` implementa una pizarra en memoria con `Map`, historial y callbacks por clave. `escribir()` espera secuencialmente a cada suscriptor, y un callback puede escribir otra clave, formando una cadena reactiva detector → analista → reporte.

A diferencia del Swarm del patrón 56, aquí los componentes no se llaman directamente y el orden sí emerge de los datos publicados. Sin embargo, el estado no es durable, no hay concurrencia entre subscribers, no existe versionado y una cadena cíclica podría provocar recursión no acotada.

## Producción
Usa un store o event log durable, IDs de evento, deduplicación, versionado optimista y límites contra ciclos. Decide qué datos son hechos, hipótesis o resultados y conserva provenance por escritura.

## Seguridad
Aplica ACL por clave o namespace. Un agente no debería poder sobrescribir cualquier parte del estado solo por estar suscrito.

## Relaciones
**Mediator (23)** centraliza mensajes; **Orchestrator-Workers (60)** controla el orden; Blackboard coordina por disponibilidad de información.