---
patternId: 106
slug: graph-driven-development
title: "Graph-Driven Development (GDD)"
summary: "Usa un grafo tipado de requisitos, decisiones, artefactos, dependencias y evidencias como fuente navegable para planificar, validar y evolucionar un sistema."
family: development-governance
legacyGroup: 25
level: workflow
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_106_graph_driven_development.ts
tags: [gdd, typed-graph, requirements, traceability]
related: [37, 105, 109]
combinesWith: [18, 20, 76, 98, 109]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [piskala-2026-sdd, iso-gql-39075-2024, w3c-shacl]
---

## Propósito

Hacer explícitas las relaciones entre requisitos, decisiones, código, tests, datos y evidencia para que humanos y agentes naveguen dependencias.

## Problema y fuerzas

Las specs lineales pierden relaciones cruzadas y provenance al crecer; agentes de desarrollo necesitan contexto estructurado y verificable.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Representar artefactos como nodos tipados y relaciones permitidas como aristas tipadas; validar el grafo antes de derivar trabajo o impacto.

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

Ontología rígida, carga de mantenimiento, inferencias no justificadas y confundir conectividad con causalidad.

## Observabilidad y evaluación

Cobertura requisito→artefacto→test, enlaces huérfanos, violations de esquema, freshness y análisis de impacto.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

GDD es terminología del proyecto Patrones IA. Se apoya en SDD, GQL, SHACL y grafos tipados, pero **no** se presenta como una metodología académica estandarizada.

## Relaciones

Relacionados: 37, 105, 109.  
Composición frecuente: 18, 20, 76, 98, 109.
