---
patternId: 111
slug: adaptive-graphrag-router
title: "Adaptive GraphRAG Router"
summary: "Clasifica la complejidad de la consulta y enruta entre RAG denso, GraphRAG o fusión híbrida para evitar pagar siempre el coste del grafo."
family: knowledge-context
legacyGroup: 26
level: workflow
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_111_adaptive_graphrag_router.ts
tags: [adaptive-rag, graphrag, routing, query-complexity]
related: [2, 25, 41, 110]
combinesWith: [39, 40, 77, 92, 110]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [dong-2026-ea-graphrag]
---

## Propósito

Usar recuperación graph-aware solo cuando la estructura de la consulta justifica su coste.

## Problema y fuerzas

Aplicar GraphRAG a todas las consultas puede aumentar latencia y degradar precisión en preguntas simples.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Calcular señales de complejidad y seleccionar dense RAG, GraphRAG o fusión para casos fronterizos.

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

Router mal calibrado, concept drift y optimizar latencia sacrificando cobertura.

## Observabilidad y evaluación

Accuracy por bucket, routing error, latencia, coste y beneficio marginal.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `dong-2026-ea-graphrag`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 2, 25, 41, 110.  
Composición frecuente: 39, 40, 77, 92, 110.
