---
patternId: 113
slug: self-rag
title: "Self-Reflective RAG (Self-RAG)"
summary: "Permite que el sistema decida cuándo recuperar, critique relevancia y soporte y use señales de reflexión para controlar la generación."
family: knowledge-context
legacyGroup: 26
level: workflow
difficulty: advanced
maturity: established
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_113_self_rag.ts
tags: [self-rag, reflection, retrieval, grounding]
related: [3, 25, 52, 73, 114]
combinesWith: [41, 52, 73, 76, 98]
antiPatterns:
  - Tratar una demo o benchmark aislado como garantía universal.
  - Omitir versionado, observabilidad o límites de autoridad en producción.
references: [asai-2024-self-rag]
---

## Propósito

Evitar retrieval indiscriminado y hacer explícita la crítica del contexto y de la respuesta.

## Problema y fuerzas

Recuperar siempre un número fijo de pasajes puede añadir ruido, coste y evidencia irrelevante.

El patrón debe equilibrar calidad, coste, latencia, gobierno, reproducibilidad, seguridad y capacidad de evolución.

## Solución

Introducir decisiones de retrieval y señales de crítica/relevancia/soporte que condicionan la generación.

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

Autoevaluación sesgada, loops de crítica y mayor latencia.

## Observabilidad y evaluación

Retrieval precision/recall, groundedness, retrieval innecesario y acuerdo externo.

Las métricas deben asociarse a dataset, modelo, hardware, versión y procedimiento reproducible.

## Evidencia y alcance

La evidencia primaria/oficial se registra mediante: `asai-2024-self-rag`. Sus resultados o garantías quedan limitados al alcance de las fuentes.

## Relaciones

Relacionados: 3, 25, 52, 73, 114.  
Composición frecuente: 41, 52, 73, 76, 98.
