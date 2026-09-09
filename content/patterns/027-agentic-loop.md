---
patternId: 27
slug: agentic-loop
title: Agentic Loop
summary: Organiza un agente como un ciclo limitado de analizar, planificar, actuar, observar y reevaluar hasta alcanzar un criterio explícito de terminación.
family: agentic-workflows
legacyGroup: 5
level: architecture
difficulty: advanced
maturity: established
llmRequired: true
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_27_agentic_loop.ts
tags: [agentic, loop, planning, tools, autonomy]
related: [6, 19, 44, 54]
combinesWith: [8, 28, 53, 77, 78]
antiPatterns:
  - Permitir loops sin límite de iteraciones, coste o tiempo.
  - Declarar éxito solo porque el modelo afirma que la tarea está completa.
  - Ejecutar acciones externas sin validación, autorización e idempotencia.
references: []
---
# Propósito
Agentic Loop convierte una interacción lineal en un proceso iterativo: el agente observa el estado, decide el siguiente paso, actúa y vuelve a evaluar. Es una estructura base para tareas donde no puede conocerse toda la secuencia de acciones de antemano.

## Problema
Los workflows lineales funcionan cuando la secuencia es conocida. En investigación, resolución de incidencias, navegación de herramientas o tareas abiertas, el siguiente paso depende del resultado anterior.

## Solución
Mantén un estado explícito y ejecuta un ciclo gobernado:

```text
Goal
  -> Analyze
  -> Plan
  -> Act
  -> Observe
  -> Evaluate
       | done -> Finish
       | else -> next iteration
```

El patrón requiere **criterios de parada independientes del deseo de continuar del modelo**.

## Invariantes de producción
Un loop autónomo debería imponer como mínimo:
- máximo de iteraciones;
- presupuesto de tokens/dinero/tiempo;
- allowlist de tools y permisos;
- validación de argumentos;
- idempotencia o compensación de efectos;
- criterio verificable de éxito;
- escalado humano para riesgo o incertidumbre;
- trazabilidad por iteración.

## Aplicabilidad
Adecuado cuando la tarea necesita adaptación a observaciones. Para procesos previsibles, un Pipeline o Template Method suele ser más fácil de verificar y más barato.

## Failure modes
- bucles recursivos sin progreso;
- oscilación entre acciones;
- falsa sensación de completitud;
- acumulación de contexto y coste;
- repetición de acciones no idempotentes;
- degradación de objetivos tras muchas iteraciones.

## Implementación del repositorio
`src/pattern_27_agentic_loop.ts` materializa los estados analizar → planear → actuar → observar → reflexionar y limita el loop a cinco iteraciones. Sin embargo, la acción real está **simulada y elegida aleatoriamente**, y la función de reflexión fuerza completitud a partir de la tercera iteración aunque no exista una verificación externa del objetivo. Eso es adecuado para una demo de estructura, pero no para determinar éxito en producción.

## Mejoras necesarias
1. Reemplazar acciones simuladas por Commands/Function Calling validados.
2. Definir un `GoalVerifier` determinista o basado en evidencia.
3. Añadir budget envelope y deadline.
4. Detectar no-progreso y ciclos repetidos.
5. Persistir checkpoints para recuperación.
6. Separar propuesta de acción y autorización.

## Relaciones
**Planning (6)** descompone; **Function Calling (28)** ejecuta tools; **ReAct (54)** especializa el ciclo pensamiento/acción/observación; **HITL (8)** introduce control humano; **Checkpointing (44)** permite recuperación.