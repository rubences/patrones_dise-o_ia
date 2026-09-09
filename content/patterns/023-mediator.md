---
patternId: 23
slug: mediator
title: Mediator
summary: Centraliza reglas de comunicación entre múltiples componentes o agentes para reducir dependencias punto a punto y hacer explícita la coordinación.
family: foundations
legacyGroup: 4
level: architecture
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_23_mediator.ts
tags: [gof, behavioral, mediator, coordination]
related: [7, 18, 60]
combinesWith: [57, 65, 87]
antiPatterns:
  - Convertir el mediador en un monolito con toda la lógica del sistema.
  - Permitir mensajes sin contrato o identidad.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Mediator evita que muchos participantes se conozcan directamente. Un coordinador gestiona interacciones y reglas entre ellos.

## Problema
En un sistema multiagente, conexiones N-a-N generan acoplamiento, ciclos y dificultad para aplicar políticas comunes.

## Solución
Los participantes envían mensajes al mediador; este determina destinatarios, orden y política de interacción.

## Aplicabilidad
Adecuado cuando la coordinación central aporta claridad. Si se necesita autonomía distribuida, un blackboard, event bus o protocolo peer-to-peer puede ser más apropiado.

## Observabilidad
El mediador es un punto privilegiado para trazas, pero también un potencial cuello de botella y single point of failure.

## Implementación del repositorio
`src/pattern_23_mediator.ts` demuestra un hub central entre componentes.

## Relaciones
**Observer (18)** distribuye eventos; **Orchestrator-Workers (60)** coordina trabajo; **Blackboard (87)** coordina mediante estado compartido.