---
patternId: 117
slug: adalora
title: "AdaLoRA"
summary: "Distribuye dinámicamente un presupuesto de rango entre matrices según su importancia en lugar de asignar el mismo rango LoRA a todas."
family: model-adaptation
legacyGroup: 27
level: component
difficulty: advanced
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_117_adalora.ts
tags: [adalora, adaptive-rank, peft, budget-allocation]
related: [115, 121]
combinesWith: [76, 77, 92, 115]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [zhang-2023-adalora]
---

## Propósito

Concentrar capacidad de adaptación donde aporta más bajo un presupuesto total.

## Problema y fuerzas

Un rango uniforme ignora importancia distinta de capas y matrices.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Estimar importancia y redistribuir un presupuesto de rank durante entrenamiento.

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

Importancia ruidosa, schedule inestable y comparativas con distinto presupuesto.

## Observabilidad y evaluación

Calidad por parámetro, distribución de rank, estabilidad y coste del allocator.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `zhang-2023-adalora`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 115, 121.  
Composición frecuente: 76, 77, 92, 115.
