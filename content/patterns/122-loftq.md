---
patternId: 122
slug: loftq
title: "LoftQ"
summary: "Coordina cuantización e inicialización low-rank para reducir discrepancia entre el modelo cuantizado y el de precisión completa antes del fine-tuning."
family: model-adaptation
legacyGroup: 27
level: component
difficulty: advanced
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_122_loftq.ts
tags: [loftq, quantization, initialization, peft]
related: [115, 116, 119]
combinesWith: [76, 92, 115, 116]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [li-2024-loftq]
---

## Propósito

Hacer que la inicialización LoRA tenga en cuenta el error introducido por cuantización.

## Problema y fuerzas

Cuantizar primero y aplicar LoRA después puede dejar una brecha inicial grande.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Optimizar conjuntamente aproximación cuantizada e inicialización low-rank que compense parte del residual.

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

Complejidad de init, costes no contabilizados y sensibilidad al quantizer.

## Observabilidad y evaluación

Error de reconstrucción, calidad downstream, memoria y coste de inicialización.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `li-2024-loftq`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 115, 116, 119.  
Composición frecuente: 76, 92, 115, 116.
