---
patternId: 114
slug: corrective-rag
title: "Corrective RAG (CRAG)"
summary: "Evalúa la calidad del contexto recuperado y activa corrección, refinamiento o fuentes alternativas cuando la evidencia inicial es insuficiente."
family: knowledge-context
legacyGroup: 26
level: workflow
difficulty: advanced
maturity: emerging
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_114_corrective_rag.ts
tags: [crag, corrective-rag, retrieval-quality, agentic-rag]
related: [25, 41, 52, 113]
combinesWith: [2, 5, 52, 73, 98]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [yan-2026-crag]
---

## Propósito

Convertir retrieval defectuoso en señal de control en lugar de pasarlo silenciosamente al generador.

## Problema y fuerzas

Contexto incorrecto puede producir respuestas convincentes pero no soportadas.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Evaluar contexto, decidir accept/refine/fallback y complementar con recuperación interna, búsqueda u otras herramientas.

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

Evaluador defectuoso, fallback no autorizado, poisoning y loops correctivos.

## Observabilidad y evaluación

Error de retrieval detectado, recuperación tras fallo, groundedness, coste y latencia.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `yan-2026-crag`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 25, 41, 52, 113.  
Composición frecuente: 2, 5, 52, 73, 98.
