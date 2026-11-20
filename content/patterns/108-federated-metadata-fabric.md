---
patternId: 108
slug: federated-metadata-fabric
title: "Federated Metadata Fabric"
summary: "Federa catálogos y metadatos de datos, modelos, eventos y archivos para descubrir activos y aplicar políticas sin copiar físicamente sus contenidos."
family: data-graph-foundations
legacyGroup: 26
level: architecture
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_108_federated_metadata_fabric.ts
tags: [metadata-fabric, catalog-federation, lineage, governance]
related: [65, 77, 103, 107]
combinesWith: [72, 89, 94, 107, 109]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [apache-gravitino-catalogs]
---

## Propósito

Dar a humanos y agentes una vista coherente de activos distribuidos conservando ownership y almacenamiento en sistemas fuente.

## Problema y fuerzas

Cada plataforma mantiene su catálogo; copiar metadatos o datos crea stale replicas y políticas inconsistentes.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Registrar conexiones a catálogos, resolver objetos bajo demanda y propagar tags/policies mediante namespaces comunes.

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

Fuentes no disponibles, semánticas incompatibles, permisos amplios y caches de metadata obsoletas.

## Observabilidad y evaluación

Cobertura de activos, freshness, resolución fallida, latencia y consistencia de políticas.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `apache-gravitino-catalogs`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 65, 77, 103, 107.  
Composición frecuente: 72, 89, 94, 107, 109.
