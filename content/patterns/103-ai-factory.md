---
patternId: 103
slug: ai-factory
title: "AI Factory"
summary: "Organiza datos, registros, evaluación, despliegue, gobierno y promoción como una factoría repetible para llevar activos de IA desde experimento hasta producción."
family: ai-platforms
legacyGroup: 24
level: system
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_103_ai_factory.ts
tags: [ai-factory, platform-engineering, mlops, llmops]
related: [9, 60, 65, 77, 90, 107, 108]
combinesWith: [44, 53, 72, 76, 92, 94, 107, 108]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [moreno-vozmediano-2026-ai-factories]
---

## Propósito

Convertir el ciclo de vida de modelos, prompts, agentes y datasets en una plataforma gobernada con contratos explícitos de promoción.

## Problema y fuerzas

Los equipos acumulan notebooks, pipelines, prompts, agentes y modelos desconectados; sin registries, gates y lineage, una demo puede llegar a producción sin reproducibilidad ni ownership.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Separar la factoría en planos de datos, desarrollo, evaluación, registros, serving, observabilidad y gobierno; todo artefacto lleva versión, evidencia, owner y gates, con promoción crítica humana.

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

Registries huérfanos, gates decorativos, lock-in y promoción autónoma sin separación de funciones.

## Observabilidad y evaluación

Lead time experimento→producción, cobertura de lineage, fallos de promoción, rollback y coste por workload.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `moreno-vozmediano-2026-ai-factories`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 9, 60, 65, 77, 90, 107, 108.  
Composición frecuente: 44, 53, 72, 76, 92, 94, 107, 108.
