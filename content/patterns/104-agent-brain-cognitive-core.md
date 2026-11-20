---
patternId: 104
slug: agent-brain-cognitive-core
title: "Agent Brain / Cognitive Core"
summary: "Descompone el núcleo cognitivo de un agente en módulos especializados para memoria, predicción, evaluación, planificación, monitorización y coordinación."
family: ai-platforms
legacyGroup: 24
level: architecture
difficulty: advanced
maturity: emerging
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_104_agent_brain_cognitive_core.ts
tags: [agent-brain, cognitive-core, planning, memory]
related: [3, 6, 27, 51, 60]
combinesWith: [42, 44, 52, 73, 77]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [webb-2025-brain-inspired-planner]
---

## Propósito

Evitar que un único prompt concentre todas las funciones cognitivas y permitir que cada capacidad tenga contrato, estado y evaluación propios.

## Problema y fuerzas

Un LLM puede ejecutar capacidades aisladas y fallar al coordinarlas de forma consistente cuando memoria, planificación, evaluación y restricciones compiten en el mismo contexto.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Coordinar módulos explícitos —monitor, predictor, evaluator, decomposer, planner/coordinator y memory interface— con estados y transiciones observables.

## Estructura

Separar **contrato**, **estado/configuración**, **motor de decisión** y **evidencia observable**. Las integraciones con modelos, stores, motores de datos o frameworks ML quedan detrás de adapters explícitos.

## Flujo

1. Validar precondiciones y configuración.
2. Construir o seleccionar el artefacto requerido.
3. Ejecutar la decisión bajo límites explícitos.
4. Registrar métricas, lineage y errores.
5. Validar el resultado antes de promoción o consumo aguas abajo.

## Implementación del repositorio

La implementación TypeScript es una referencia pedagógica de los invariantes del patrón. No reproduce automáticamente los sistemas, kernels, benchmarks o infraestructuras descritos en la literatura.

## Cuándo utilizarlo

Cuando el problema descrito sea recurrente y exista capacidad para observar sus trade-offs. En sistemas críticos, acompañarlo de autorización, evaluación, regresión y rollback.

## Cuándo no utilizarlo

Cuando una solución más simple ya satisfaga el problema o cuando no exista evidencia/telemetría suficiente para justificar la complejidad adicional.

## Fallos, seguridad y gobierno

Antropomorfismo, módulos con idéntico sesgo, memoria contaminada y loops sin terminación.

## Observabilidad y evaluación

Éxito por tarea y módulo, coste/latencia por transición, ablations y recuperación ante planes inválidos.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `webb-2025-brain-inspired-planner`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 3, 6, 27, 51, 60.  
Composición frecuente: 42, 44, 52, 73, 77.
