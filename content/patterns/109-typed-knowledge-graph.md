---
patternId: 109
slug: typed-knowledge-graph
title: "Typed Knowledge Graph"
summary: "Define tipos explícitos para nodos, aristas y propiedades y valida el grafo antes de usarlo como contexto, memoria, especificación o fuente de decisiones."
family: data-graph-foundations
legacyGroup: 26
level: architecture
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_109_typed_knowledge_graph.ts
tags: [typed-graph, knowledge-graph, gql, shacl]
related: [37, 106, 110]
combinesWith: [52, 72, 98, 108, 110]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [iso-gql-39075-2024, w3c-shacl, typedgraph-tgs-0-6]
---

## Propósito

Reducir ambigüedad semántica y relaciones inválidas en grafos consumidos por agentes, RAG o gobierno.

## Problema y fuerzas

Un grafo sin restricciones puede almacenar relaciones sintácticamente válidas pero semánticamente imposibles y propagarlas al razonamiento.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Declarar node types, edge types y reglas; validar cada mutación antes del commit.

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

Schema rigidity, type explosion, migraciones costosas y falsa seguridad si la semántica de los datos es mala.

## Observabilidad y evaluación

Violations por tipo, aristas inválidas, cobertura de shapes, migraciones y precisión de extracción.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `iso-gql-39075-2024`, `w3c-shacl`, `typedgraph-tgs-0-6`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 37, 106, 110.  
Composición frecuente: 52, 72, 98, 108, 110.
