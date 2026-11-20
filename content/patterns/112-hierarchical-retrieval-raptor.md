---
patternId: 112
slug: hierarchical-retrieval-raptor
title: "Hierarchical Retrieval (RAPTOR)"
summary: "Construye una jerarquía recursiva de clusters y resúmenes para recuperar contexto a distintos niveles de abstracción en documentos largos."
family: knowledge-context
legacyGroup: 26
level: architecture
difficulty: advanced
maturity: established
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_112_hierarchical_retrieval_raptor.ts
tags: [raptor, hierarchical-retrieval, summarization, rag]
related: [25, 41, 66, 110]
combinesWith: [49, 52, 77, 98]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [sarthi-2024-raptor]
---

## Propósito

Permitir retrieval sobre información local y conceptual de alto nivel sin limitarse a chunks contiguos.

## Problema y fuerzas

Chunking plano pierde relaciones globales y obliga a elegir entre fragmentos pequeños precisos y grandes costosos.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Embeddings, clustering, resúmenes recursivos y un árbol de abstracción consultable por nivel.

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

Resumen que pierde detalles, propagación de errores y coste de reconstrucción.

## Observabilidad y evaluación

Recall multi-hop, faithfulness de resúmenes, coste de indexado y rendimiento por nivel.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `sarthi-2024-raptor`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 25, 41, 66, 110.  
Composición frecuente: 49, 52, 77, 98.
