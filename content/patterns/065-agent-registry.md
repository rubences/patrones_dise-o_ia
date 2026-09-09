---
patternId: 65
slug: agent-registry
title: Agent Registry
summary: Mantiene un catálogo consultable de agentes, capacidades y estado operativo para desacoplar descubrimiento de creación e invocación.
family: multi-agent
legacyGroup: 14
level: architecture
difficulty: intermediate
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_65_agent_registry.ts
tags: [registry, discovery, agents, routing]
related: [16, 57, 83]
combinesWith: [72, 77, 94]
antiPatterns:
  - Tratar una variable de estado local como health check real.
  - Descubrir por substring y asumir compatibilidad semántica completa.
  - Conceder permisos por aparecer registrado con una habilidad.
references: []
---
# Propósito
Agent Registry permite localizar agentes existentes por capacidad y estado sin hardcodear cada dependencia en los consumidores.

## Implementación del repositorio
`src/pattern_65_agent_registry.ts` usa un `Map` en memoria. `descubrir()` selecciona agentes `activo` cuya habilidad contenga el texto solicitado y ordena por menor carga. `ping()` solo inspecciona el campo de estado; no contacta al agente ni verifica endpoint, latencia o dependencia alguna.

La invocación cambia el estado a `ocupado`, suma 20 a la carga y al finalizar resta 20. Es útil para explicar el patrón, pero no es service discovery distribuido ni health monitoring real.

## Producción
Registra endpoint/transport, versión de contrato, capacidades estructuradas, heartbeat con TTL y metadata de tenant/región. Usa leases o un backing store consistente si existen varios procesos de registry.

## Seguridad
Discovery y autorización son capas distintas. Filtra qué agentes puede ver/invocar cada principal y aplica policy en el destino aunque el registry ya haya autorizado el routing.

## Relaciones
**Task Delegation (57)** consume capacidades; **Dynamic Tool Discovery (83)** descubre herramientas, no agentes; **Health Check (94)** aporta señales de disponibilidad reales.