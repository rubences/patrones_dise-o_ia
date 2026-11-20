---
patternId: 118
slug: dora
title: "DoRA"
summary: "Separa magnitud y dirección del peso y aplica adaptación low-rank a la dirección para acercar LoRA al fine-tuning completo."
family: model-adaptation
legacyGroup: 27
level: component
difficulty: advanced
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_118_dora.ts
tags: [dora, weight-decomposition, peft, lora]
related: [115, 119]
combinesWith: [76, 77, 115]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [liu-2024-dora]
---

## Propósito

Aumentar capacidad de aprendizaje de adapters low-rank mediante descomposición explícita del peso.

## Problema y fuerzas

LoRA puede mostrar dinámicas distintas de full fine-tuning y dejar brecha de calidad.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Descomponer W en magnitud y dirección, adaptar dirección con LoRA y aprender magnitud separadamente.

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

Merge incorrecto, coste adicional y benchmark cherry-picking.

## Observabilidad y evaluación

Calidad vs LoRA, estabilidad, memoria, tiempo y overhead.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `liu-2024-dora`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 115, 119.  
Composición frecuente: 76, 77, 115.
