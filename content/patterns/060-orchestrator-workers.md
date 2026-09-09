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
  - Registrar una dependencia pendiente y ejecutar igualmente la subtarea.
  - Parsear planes críticos desde texto libre sin schema ni validación.
  - Dejar que el planificador asigne un worker inexistente sin política explícita.
references: []
---
# Propósito
Orchestrator-Workers centraliza la descomposición y coordinación mientras workers especializados ejecutan unidades de trabajo con contratos acotados.

## Solución
El orquestador produce un DAG validado, determina qué nodos están listos, despacha trabajo, recoge resultados y decide si replanificar o sintetizar.

## Implementación del repositorio
`src/pattern_60_orchestrator_workers.ts` pide al LLM un plan textual con líneas `TAREA... | WORKER... | DEPS...` y lo parsea manualmente. Las dependencias se reducen de forma heurística al identificador de la tarea anterior.

El hallazgo principal es funcional: durante ejecución calcula `depsPendientes` y escribe `esperando` en el log, pero **no bloquea ni omite la subtarea**. A continuación cambia su estado a `ejecutando` y la lanza. Por tanto, la demo no garantiza respeto real del DAG.

Además, un worker desconocido cae silenciosamente al worker `analista`, lo que puede ocultar errores de planificación.

## Producción
Valida el plan con schema, comprueba ciclos, ejecuta solo nodos cuyas dependencias estén `completed`, persiste estado y define retry/compensación. La ausencia de worker debe ser un error de routing o activar una política explícita de fallback.

## Observabilidad
Registra plan versionado, dependencia que habilitó cada nodo, worker, intento, latencia, coste y artefactos producidos.

## Relaciones
**Task Delegation (57)** selecciona ejecutor; **Checkpointing (44)** persiste progreso; **Blackboard (87)** ofrece una alternativa sin planificación central top-down.