---
patternId: 120
slug: lora-plus
title: "LoRA+"
summary: "Entrena las dos matrices de LoRA con learning rates distintos para corregir dinámicas subóptimas en modelos de gran anchura."
family: model-adaptation
legacyGroup: 27
level: component
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_120_lora_plus.ts
tags: [lora-plus, learning-rate, peft, optimization]
related: [115, 117, 121]
combinesWith: [76, 77, 115]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [hayou-2024-lora-plus]
---

## Propósito

Mejorar la dinámica de optimización de LoRA sin cambiar su estructura.

## Problema y fuerzas

Usar el mismo learning rate para A y B puede limitar feature learning.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Asignar learning rates diferenciados con una ratio configurada y validada.

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

Ratio no transferible, tuning adicional y confundir speedup experimental con garantía.

## Observabilidad y evaluación

Convergencia, tiempo, calidad y sensibilidad a la ratio.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `hayou-2024-lora-plus`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 115, 117, 121.  
Composición frecuente: 76, 77, 115.
