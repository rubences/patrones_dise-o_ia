---
patternId: 60
slug: orchestrator-workers
title: Orchestrator-Workers
summary: Separa planificación y síntesis en un orquestador de la ejecución especializada de workers, haciendo explícitos el DAG, los estados y las dependencias del trabajo.
family: multi-agent
legacyGroup: 14
level: architecture
difficulty: advanced
maturity: established
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_60_orchestrator_workers.ts
tags: [orchestration, workers, planning, dag]
related: [27, 57, 65]
combinesWith: [44, 77, 85]
antiPatterns:
  - Parsear planes críticos desde texto libre sin schema ni validación.
  - Dejar que el planificador asigne un worker inexistente y ocultar el error con un fallback silencioso.
  - Ejecutar un DAG sin detectar ciclos o dependencias imposibles.
references: []
---
# Propósito
Orchestrator-Workers centraliza la descomposición y coordinación mientras workers especializados ejecutan unidades de trabajo con contratos acotados.

## Implementación del repositorio
Tras el hardening P0, `src/pattern_60_orchestrator_workers.ts` parsea IDs y dependencias explícitas `DEPS`, valida referencias y despacha únicamente subtareas `pendiente` cuyas dependencias están `completada`.

La ejecución se organiza por **olas**: nodos independientes que están listos pueden ejecutarse en paralelo; la siguiente ola no se libera hasta que sus prerequisitos hayan finalizado. Si quedan tareas pendientes y ninguna está lista, el orquestador falla explícitamente indicando un posible ciclo o dependencia bloqueada. Un worker desconocido también produce error en vez de caer silenciosamente al analista.

Esto corrige el defecto anterior, donde se calculaban `depsPendientes` y se escribía `esperando` en el log, pero la subtarea se ejecutaba igualmente.

## Límites
El plan sigue naciendo de texto libre producido por el LLM. El parser es más fiel, pero en producción conviene structured output, validación formal del DAG y persistencia durable de estado.

## Producción
Añade retries/idempotencia por nodo, checkpoint del plan, cancelación, timeouts, límites de concurrencia y una política explícita para fallo parcial. Si el workflow debe sobrevivir reinicios, el scheduler no puede depender solo de memoria local.

## Relaciones
**Task Delegation (57)** selecciona ejecutor; **Checkpointing (44)** persiste progreso; **Blackboard (87)** ofrece una alternativa reactiva sin planificación top-down.