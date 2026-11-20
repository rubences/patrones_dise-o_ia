---
patternId: 116
slug: qlora
title: "QLoRA"
summary: "Combina un modelo base congelado cuantizado a 4 bits con adapters LoRA entrenables para reducir memoria durante fine-tuning."
family: model-adaptation
legacyGroup: 27
level: component
difficulty: advanced
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_116_qlora.ts
tags: [qlora, quantization, peft, nf4]
related: [115, 119, 122]
combinesWith: [76, 77, 92, 115]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [dettmers-2023-qlora]
---

## Propósito

Hacer viable adaptación de modelos grandes bajo límites estrictos de VRAM.

## Problema y fuerzas

Incluso LoRA conserva el modelo base en precisión alta y puede superar memoria disponible.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Mantener el base cuantizado y entrenar LoRA; documentar tipo de cuantización, double quantization y optimizer.

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

Quantization error, kernels incompatibles y extrapolar cifras de memoria/calidad.

## Observabilidad y evaluación

VRAM pico, throughput, calidad frente a LoRA/full FT y error de cuantización.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `dettmers-2023-qlora`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 115, 119, 122.  
Composición frecuente: 76, 77, 92, 115.
