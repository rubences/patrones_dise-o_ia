---
patternId: 94
slug: health-check
title: Health Check
summary: Comprueba proactivamente dependencias y capacidades para exponer readiness y degradación antes de que el tráfico real encuentre una instancia incapaz de servir correctamente.
family: reliability
legacyGroup: 21
level: architecture
difficulty: beginner
maturity: foundational
llmRequired: false
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_94_health_check.ts
tags: [health, readiness, liveness, operations]
related: [45, 77, 90]
combinesWith: [81, 46]
antiPatterns:
  - Usar una misma sonda para liveness y readiness sin distinguir semántica.
  - Ejecutar checks caros o con efectos secundarios.
  - Declarar toda la instancia no disponible por una dependencia opcional.
references: []
---
# Propósito
Health Check expone si una instancia y sus dependencias están listas para aceptar trabajo.

## Implementación del repositorio
`src/pattern_94_health_check.ts` registra checks y los ejecuta **secuencialmente**, agregando como estado global el peor resultado. Una dependencia degradada o caída siempre degrada el global, sin distinguir dependencias críticas/opcionales.

## Producción
Separa liveness, readiness y startup; ejecuta checks con timeouts y, cuando sea seguro, en paralelo. Clasifica dependencias y evita que la sonda dependa de componentes innecesarios. Devuelve contratos compatibles con el orquestador.

## Relaciones
**Circuit Breaker (45)** reacciona a llamadas fallidas; Health Check es proactivo. **Canary Release (90)** consume señales de salud.