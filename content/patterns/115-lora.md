---
patternId: 115
slug: lora
title: "LoRA"
summary: "Adapta un modelo congelado mediante matrices de actualización de bajo rango, reduciendo parámetros entrenables y separando el adapter del checkpoint base."
family: model-adaptation
legacyGroup: 27
level: component
difficulty: advanced
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_115_lora.ts
tags: [lora, peft, fine-tuning, adapters]
related: [116, 117, 118, 119, 120, 121, 122]
combinesWith: [76, 77, 90, 92]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [hu-2022-lora]
---

## Propósito

Personalizar modelos grandes sin replicar ni actualizar todos sus pesos para cada tarea.

## Problema y fuerzas

Full fine-tuning requiere memoria, compute y almacenamiento elevados y complica múltiples variantes.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Congelar pesos base e insertar actualizaciones BA de rango r en matrices seleccionadas; entrenar solo adapters.

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

Rank o target modules inadecuados, overfitting y pérdida de trazabilidad base+adapter.

## Observabilidad y evaluación

Parámetros entrenables, VRAM, tiempo, calidad downstream y reproducibilidad.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `hu-2022-lora`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 116, 117, 118, 119, 120, 121, 122.  
Composición frecuente: 76, 77, 90, 92.
