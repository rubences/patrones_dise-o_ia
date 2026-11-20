---
patternId: 174
slug: edge-to-cloud-failover
title: "Edge-to-Cloud Failover"
summary: "Contrato experimental para edge-to-cloud failover con decisiones explícitas de recursos y disponibilidad."
family: edge-distributed-ai
legacyGroup: 33
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_174_edge_to_cloud_failover.ts
tags: [edge, distributed, inference]
related: [39, 45, 81]
combinesWith: [46, 77, 98]
antiPatterns:
  - Extrapolar rendimiento sin medir hardware y red.
references: []
---

## Propósito

Edge-to-Cloud Failover delimita decisiones de ejecución distribuida y recursos.

## Problema y fuerzas

La conectividad, energía, memoria y latencia varían entre nodos y dispositivos.

## Solución

Explicitar precondiciones, propietario y estado; medir degradación y capacidad de recuperación.

## Implementación del repositorio

Selecciona edge o cloud según disponibilidad y latencia máxima; no ejecuta migración real. Contrato TypeScript determinista: `src/pattern_174_edge_to_cloud_failover.ts`; pruebas de regresión: `tests/p9_edge_patterns.test.ts`. No se ha medido rendimiento real en hardware edge ni se implementan servicios distribuidos completos.


## Producción

Requiere benchmarks en hardware y redes representativas, seguridad y rollback.

## Evidencia y alcance

`needs-review`: sin benchmark propio.

## Relaciones

Patrones 39, 45, 46, 77 y 81.
