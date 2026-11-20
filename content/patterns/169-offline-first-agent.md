---
patternId: 169
slug: offline-first-agent
title: "Offline-First Agent"
summary: "Contrato experimental para offline-first agent con decisiones explícitas de recursos y disponibilidad."
family: edge-distributed-ai
legacyGroup: 33
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_169_offline_first_agent.ts
tags: [edge, distributed, inference]
related: [39, 45, 81]
combinesWith: [46, 77, 98]
antiPatterns:
  - Extrapolar rendimiento sin medir hardware y red.
references: []
---

## Propósito

Offline-First Agent delimita decisiones de ejecución distribuida y recursos.

## Problema y fuerzas

La conectividad, energía, memoria y latencia varían entre nodos y dispositivos.

## Solución

Explicitar precondiciones, propietario y estado; medir degradación y capacidad de recuperación.

## Implementación del repositorio

Mantiene cola local de peticiones y las libera solo cuando hay conectividad, con aislamiento por propietario. Contrato TypeScript determinista: `src/pattern_169_offline_first_agent.ts`; pruebas de regresión: `tests/p9_edge_patterns.test.ts`. No se ha medido rendimiento real en hardware edge ni se implementan servicios distribuidos completos.


## Producción

Requiere benchmarks en hardware y redes representativas, seguridad y rollback.

## Evidencia y alcance

`needs-review`: sin benchmark propio.

## Relaciones

Patrones 39, 45, 46, 77 y 81.
