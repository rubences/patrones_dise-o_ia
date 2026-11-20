---
patternId: 110
slug: graphrag
title: "Graph-Augmented Generation (GraphRAG)"
summary: "Construye y consulta un grafo de entidades y relaciones para recuperar contexto estructural y responder preguntas locales o globales sobre un corpus."
family: knowledge-context
legacyGroup: 26
level: architecture
difficulty: advanced
maturity: established
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_110_graphrag.ts
tags: [graphrag, graph-retrieval, knowledge-graph, rag]
related: [25, 37, 41, 109, 111]
combinesWith: [52, 66, 77, 98, 109]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [edge-2024-graphrag]
---

## Propósito

Complementar la recuperación por chunks cuando la respuesta depende de relaciones, comunidades o patrones distribuidos.

## Problema y fuerzas

RAG vectorial recupera pasajes locales y puede fallar en preguntas globales que exigen síntesis sobre todo el corpus.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Extraer entidades/relaciones, construir comunidades o subgrafos, resumir estructura y recuperar contexto graph-aware.

> **RGA:** la investigación no encontró «RGA» como acrónimo normalizado de una técnica única. Se conserva GraphRAG / Graph-Augmented Generation como nombre canónico.

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

Extracción incorrecta, graph drift, coste de indexado, hallucinated edges y exceso de contexto.

## Observabilidad y evaluación

Faithfulness, cobertura de entidades/relaciones, calidad local/global, coste de indexado y latencia.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `edge-2024-graphrag`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 25, 37, 41, 109, 111.  
Composición frecuente: 52, 66, 77, 98, 109.
