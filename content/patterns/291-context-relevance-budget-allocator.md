---
patternId: 291
slug: context-relevance-budget-allocator
title: "Context Relevance Budget Allocator"
summary: "Contrato experimental de ingeniería de contexto para context relevance budget allocator, con controles de presupuesto y calidad."
family: context-engineering
legacyGroup: 48
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_291_context_relevance_budget_allocator.ts
tags: [context-engineering, retrieval, safety]
related: [98, 149, 291]
combinesWith: [77, 124]
antiPatterns:
  - Considerar una heurística de contexto como garantía de veracidad o aislamiento.
references: []
---

## Problema y solución

Context Relevance Budget Allocator define un contrato de selección, composición o verificación de contexto para agentes. Código: `src/pattern_291_context_relevance_budget_allocator.ts`.

## Pruebas y límites

`tests/p12_context_patterns.test.ts`. Las prioridades, relevancias y etiquetas de confianza requieren validación externa. Marcar contenido como no confiable no impide técnicamente la inyección de instrucciones.

## Evidencia

Estado `needs-review`; exige pruebas adversariales y fuentes primarias.
