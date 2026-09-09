---
patternId: 18
slug: observer
title: Observer
summary: Desacopla productores de eventos y consumidores permitiendo reaccionar a cambios de estado sin introducir dependencias directas entre ellos.
family: foundations
legacyGroup: 3
level: component
difficulty: beginner
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_18_observer.ts
tags: [gof, behavioral, observer, events]
related: [23, 77, 87]
combinesWith: [19, 90, 94]
antiPatterns:
  - Suscriptores con efectos secundarios no idempotentes sin control.
  - Eventos sin versión ni esquema estable.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Observer notifica a múltiples interesados cuando cambia un sujeto. En IA permite alimentar dashboards, auditoría, métricas o automatizaciones desde eventos de agente.

## Problema
Si el agente llama directamente a cada consumidor, añadir uno nuevo exige modificar la lógica central.

## Solución
El sujeto publica cambios; observadores registrados reciben notificaciones a través de un contrato.

## Aplicabilidad
Adecuado para telemetría y UI reactiva. Para sistemas distribuidos con durabilidad, orden o reintentos, usa un broker/event log además del patrón conceptual.

## Riesgos
Eventos duplicados, orden parcial y fallos de consumidores deben asumirse. Diseña handlers idempotentes cuando haya entrega al menos una vez.

## Implementación del repositorio
`src/pattern_18_observer.ts` demuestra suscripción y notificación reactiva.

## Relaciones
**Mediator (23)** centraliza interacciones; **Observability (77)** puede consumir eventos; **State (19)** suele emitirlos.