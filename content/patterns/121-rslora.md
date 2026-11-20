---
patternId: 121
slug: rslora
title: "Rank-Stabilized LoRA (rsLoRA)"
summary: "Cambia el escalado del adapter LoRA a una función de la raíz del rango para estabilizar aprendizaje con ranks mayores."
family: model-adaptation
legacyGroup: 27
level: component
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_121_rslora.ts
tags: [rslora, rank-stabilization, peft, scaling]
related: [115, 117, 120]
combinesWith: [76, 115]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [kalajdzievski-2023-rslora]
---

## Propósito

Evitar que el escalado convencional atenúe excesivamente aprendizaje al aumentar rank.

## Problema y fuerzas

La regla tradicional puede producir actualizaciones menos eficaces en ranks altos.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Escalar el adapter con alpha/sqrt(r) y tratar scaling como hiperparámetro explícito.

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

Incompatibilidad con defaults y extrapolación fuera del régimen estudiado.

## Observabilidad y evaluación

Normas de actualización, estabilidad, calidad por rank y sensibilidad a alpha.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `kalajdzievski-2023-rslora`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 115, 117, 120.  
Composición frecuente: 76, 115.
