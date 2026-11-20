---
patternId: 170
slug: energy-aware-model-router
title: "Energy-Aware Model Router"
summary: "Contrato experimental para energy-aware model router con decisiones explícitas de recursos y disponibilidad."
family: edge-distributed-ai
legacyGroup: 35
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_170_energy_aware_model_router.ts
tags: [edge, distributed, inference]
related: [39, 45, 81]
combinesWith: [46, 77, 98]
antiPatterns:
  - Extrapolar rendimiento sin medir hardware y red.
references: []
---

## Propósito

Energy-Aware Model Router delimita decisiones de ejecución distribuida y recursos.

## Problema y fuerzas

La conectividad, energía, memoria y latencia varían entre nodos y dispositivos.

## Solución

Explicitar precondiciones, propietario y estado; medir degradación y capacidad de recuperación.

## Implementación del repositorio

`src/pattern_170_energy_aware_model_router.ts` es un contrato educativo, no ejecuta inferencia edge ni protocolos distribuidos.

## Producción

Requiere benchmarks en hardware y redes representativas, seguridad y rollback.

## Evidencia y alcance

`needs-review`: sin benchmark propio.

## Relaciones

Patrones 39, 45, 46, 77 y 81.
