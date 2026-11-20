---
patternId: 105
slug: spec-driven-development
title: "Spec-Driven Development (SDD)"
summary: "Trata la especificación versionada como fuente de verdad y deriva de ella planes, tareas, implementación y validación, especialmente en desarrollo asistido por IA."
family: development-governance
legacyGroup: 25
level: workflow
difficulty: intermediate
maturity: emerging
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_105_spec_driven_development.ts
tags: [sdd, specification, ai-coding, contracts]
related: [10, 20, 24, 76]
combinesWith: [59, 77, 90, 106]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [piskala-2026-sdd]
---

## Propósito

Reducir ambigüedad y deriva entre intención, código generado y criterios de aceptación mediante especificaciones verificables.

## Problema y fuerzas

El código asistido por IA puede crecer más rápido que la comprensión compartida; prompts y requisitos dispersos impiden verificar qué debía construirse.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Versionar constitución, especificación, aclaraciones, plan, tareas, implementación y validación; cada transición exige el artefacto anterior.

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

Big-design-up-front, specs obsoletas, falsa precisión y optimizar el texto de la spec en vez de la intención.

## Observabilidad y evaluación

Cobertura requisito→test, drift spec/código, defectos por requisito y tiempo de aclaración.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `piskala-2026-sdd`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 10, 20, 24, 76.  
Composición frecuente: 59, 77, 90, 106.
