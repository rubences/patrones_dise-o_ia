---
patternId: 107
slug: open-data-lakehouse
title: "Open Data Lakehouse"
summary: "Desacopla almacenamiento, metadatos y cómputo mediante formatos abiertos, snapshots y catálogos interoperables para servir analytics y sistemas de IA gobernados."
family: data-graph-foundations
legacyGroup: 26
level: system
difficulty: advanced
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_107_open_data_lakehouse.ts
tags: [lakehouse, iceberg, open-table-format, data-governance]
related: [25, 51, 77, 103, 108]
combinesWith: [52, 72, 89, 98, 108]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [apache-iceberg-spec, google-2026-borderless-lakehouse, apache-gravitino-catalogs]
---

## Propósito

Crear una base de datos abierta, versionada e interoperable para que múltiples motores y agentes trabajen sobre los mismos activos gobernados.

## Problema y fuerzas

Copiar datos entre silos multiplica lineage, coste, latencia y políticas inconsistentes; los agentes necesitan datos confiables y versionados.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Usar almacenamiento abierto, tablas con snapshots, catálogo interoperable/federado, separación compute-storage, políticas y auditoría.

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

Small files, metadata drift, catálogos inconsistentes, permisos divergentes y costes de mantenimiento.

## Observabilidad y evaluación

Freshness, snapshot/rollback, interoperabilidad, lineage, políticas aplicadas y coste por consulta.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `apache-iceberg-spec`, `google-2026-borderless-lakehouse`, `apache-gravitino-catalogs`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 25, 51, 77, 103, 108.  
Composición frecuente: 52, 72, 89, 98, 108.
