---
patternId: 119
slug: pissa
title: "PiSSA"
summary: "Inicializa adapters low-rank a partir de componentes principales de la matriz base y congela el residual."
family: model-adaptation
legacyGroup: 27
level: component
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_119_pissa.ts
tags: [pissa, svd, peft, initialization]
related: [115, 116, 118, 122]
combinesWith: [76, 92, 115]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [meng-2024-pissa]
---

## Propósito

Usar estructura espectral del peso base para inicializar adaptación low-rank.

## Problema y fuerzas

La inicialización LoRA estándar puede converger lentamente o desaprovechar componentes dominantes.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Aplicar SVD, colocar componentes principales en adapters y conservar residual congelado.

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

Coste SVD, cambios de checkpoint y dependencia de rank.

## Observabilidad y evaluación

Tiempo de init, convergencia, calidad final, error de cuantización y memoria.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `meng-2024-pissa`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 115, 116, 118, 122.  
Composición frecuente: 76, 92, 115.
