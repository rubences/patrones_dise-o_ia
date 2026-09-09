---
patternId: 6
slug: planning
title: Planning
summary: Descompone un objetivo en subtareas, dependencias y riesgos, evalúa la viabilidad del plan y permite refinarlo antes de ejecutar.
family: agentic-workflows
legacyGroup: 1
level: workflow
difficulty: intermediate
maturity: established
llmRequired: true
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_6_planning.ts
tags:
  - planning
  - decomposition
  - dependencies
  - replanning
related:
  - 27
  - 54
  - 57
  - 60
combinesWith:
  - 5
  - 8
  - 44
  - 77
antiPatterns:
  - Generar un plan y ejecutarlo sin comprobar precondiciones o cambios del entorno.
  - Tratar estimaciones generadas por el modelo como compromisos fiables.
  - Replanificar continuamente sin presupuesto ni criterio de estabilidad.
references: []
---

# Propósito

**Planning** convierte un objetivo de alto nivel en una representación operativa de subtareas, orden, dependencias, riesgos y criterios de revisión. El plan funciona como estado intermedio que puede inspeccionarse antes de actuar.

## El problema

Las tareas largas requieren coordinar decisiones que no deberían tomarse todas a la vez. Sin planificación, un agente puede ejecutar acciones prematuras, ignorar dependencias o perder de vista el objetivo global.

## La solución

Separar deliberación y ejecución:

```text
Objetivo
   |
   v
Generar plan
   |
   v
Evaluar viabilidad
   |
   v
Refinar plan
   |
   v
Ejecutar / replanificar
```

Un plan útil debería ser explícito, modificable y trazable, no solo un párrafo de intención.

## Implementación del repositorio

`src/pattern_6_planning.ts` genera una estrategia con el LLM, pero materializa las subtareas del ejemplo mediante una estructura fija de análisis, diseño, implementación y testing. Después pide al modelo evaluar la viabilidad y refinar la estrategia.

La demo ilustra bien la arquitectura del patrón, aunque las subtareas, riesgos y parte de las mejoras están codificados como ejemplo. La estimación total suma duraciones con `parseInt`, por lo que no modela todavía paralelismo real ni incertidumbre temporal.

## Aplicabilidad

Úsalo cuando:

- el objetivo exige varios pasos coordinados;
- existen dependencias entre acciones;
- algunas acciones tienen coste o riesgo que aconseja revisar antes;
- el entorno puede obligar a replanificar;
- necesitas mostrar al usuario qué pretende hacer el agente.

## Cuándo no utilizarlo

Evítalo en tareas atómicas o cuando la secuencia correcta ya está definida por un workflow determinista. En esos casos, Pipeline o Template Method suelen ser más simples y verificables.

## Failure modes

- **Plan hallucination:** dependencias o recursos inventados.
- **Premature commitment:** el agente se aferra al plan aunque cambie el entorno.
- **Planning overhead:** consume más tiempo planificando que resolviendo.
- **Invalid estimates:** duraciones y riesgos sin datos suficientes.

## Seguridad

El plan no debe autorizar acciones. Cada paso debe pasar sus propios controles de acceso, riesgo y validación. Los planes de alto impacto deberían poder pausarse para revisión humana antes de ejecutar.

## Observabilidad

Versiona planes y replanificaciones. Registra motivo de cada cambio, subtarea activa, dependencias satisfechas, errores, costes y divergencia entre plan previsto y ejecución real.

## Coste y latencia

Añade llamadas previas a la ejecución y puede aumentar el tiempo inicial. En tareas complejas puede compensarlo reduciendo acciones innecesarias y facilitando recuperación tras fallos.

## Evaluación

Mide porcentaje de subtareas realmente necesarias, cumplimiento de dependencias, número de replanificaciones, desviación de coste/tiempo y tasa de objetivos alcanzados. Separa calidad del plan de calidad de la ejecución.

## Patrones relacionados

- **Agentic Loop (27):** ejecuta y observa iterativamente un plan.
- **ReAct (54):** integra razonamiento y acciones de forma más intercalada.
- **Task Delegation (57):** asigna subtareas a agentes especializados.
- **Orchestrator-Workers (60):** coordina ejecución distribuida.
- **Checkpointing (44):** conserva estado para continuar tras interrupciones.

## Estado editorial

La ficha refleja que la demo combina planificación generativa con componentes fijos. Antes de usarla como benchmark deben sustituirse las estimaciones simuladas por datos y criterios verificables.
