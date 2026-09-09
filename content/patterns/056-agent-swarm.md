---
patternId: 56
slug: agent-swarm
title: Agent Swarm
summary: Coordina múltiples agentes que aportan contribuciones sucesivas sobre un estado compartido, buscando diversidad de especialidades sin convertir una sola respuesta en autoridad final.
family: multi-agent
legacyGroup: 14
level: architecture
difficulty: advanced
maturity: emerging
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_56_agent_swarm.ts
tags: [multi-agent, swarm, coordination, shared-state]
related: [60, 63, 87]
combinesWith: [44, 77, 85]
antiPatterns:
  - Afirmar ausencia de coordinador cuando existe un bucle central que decide turnos.
  - Tratar ausencia de nuevas contribuciones como consenso demostrado.
  - Compartir estado sin control de concurrencia, identidad o provenance.
references: []
---
# Propósito
Agent Swarm explora un problema mediante varios agentes especializados que leen el estado común y añaden contribuciones cuando creen aportar información nueva.

## Idea arquitectónica
Un swarm genuinamente distribuido puede coordinarse por eventos, pizarra o protocolos peer-to-peer. La propiedad importante no es el número de agentes, sino cómo se distribuyen decisión, estado y control.

## Implementación del repositorio
`src/pattern_56_agent_swarm.ts` crea cuatro agentes especializados y un `SwarmCoordinador` que itera sobre ellos **secuencialmente** en cada ronda. Cada agente recibe todas las contribuciones anteriores y decide mediante texto si responde o devuelve `PASA`.

Esto significa que la implementación actual sí tiene un coordinador central y no demuestra ausencia de punto único de fallo ni escalado distribuido. Además, `resuelto=true` se activa cuando una ronda no produce aportaciones nuevas; eso mide estancamiento textual, no consenso ni corrección.

## Producción
Define protocolo de coordinación, ownership del estado, deduplicación, versionado y límites de rondas/coste. Si los agentes trabajan en paralelo, añade control optimista o transaccional sobre el estado compartido y resolución de conflictos.

## Evaluación
Mide diversidad útil, redundancia, cobertura de requisitos, coste por solución y mejora frente a un agente único. El valor del swarm debe demostrarse con evals, no por cantidad de agentes.

## Relaciones
**Blackboard (87)** implementa coordinación reactiva sobre estado compartido; **Orchestrator-Workers (60)** usa control central explícito; **Debate (63)** fuerza posiciones opuestas.