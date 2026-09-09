---
patternId: 95
slug: human-escalation
title: Human Escalation / Handoff
summary: Transfiere una conversación a una persona cuando la política, el usuario o los fallos acumulados lo requieren, entregando contexto accionable y ownership explícito.
family: human-experience
legacyGroup: 22
level: workflow
difficulty: intermediate
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_95_human_escalation.ts
tags: [handoff, escalation, human, support]
related: [8, 44, 96]
combinesWith: [53, 72, 77]
antiPatterns:
  - Calcular prioridad solo por número de intentos e ignorar severidad de categoría.
  - Transferir historial completo sin minimizar secretos o PII.
  - Considerar el handoff completo antes de que exista aceptación/ownership humano.
references: []
---
# Propósito
Human Escalation transfiere ownership cuando el agente no debe o no puede continuar, evitando que el usuario tenga que reconstruir el caso.

## Implementación del repositorio
Tras el hardening P1, `PoliticaEscalacion` combina severidad de categoría con intentos fallidos y conserva la prioridad más alta. `GestorHandoff` modela un lifecycle explícito `queued -> accepted -> resolved`, exige owner al aceptar y rechaza transiciones inválidas.

El agente limita además el historial incorporado al paquete a los últimos seis mensajes. Esto reduce exposición, aunque todavía no sustituye un pipeline de PII/secret redaction.

## Límites
La cola continúa en memoria: modela correctamente los estados pero no constituye un sistema de ticketing durable ni ofrece SLA, notificaciones o asignación multioperador.

## Producción
Integra una cola/ticket system transaccional, routing por skills/severidad, SLA, auditoría, deduplicación y sanitización del paquete antes de transferirlo.

## Relaciones
**Human-in-Loop (8)** aprueba una acción puntual; Handoff transfiere la sesión; **Clarification Loop (96)** intenta resolver ambigüedad antes de escalar.