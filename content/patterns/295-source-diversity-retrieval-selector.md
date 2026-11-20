---
patternId: 295
slug: source-diversity-retrieval-selector
title: "Source Diversity Retrieval Selector"
summary: "Contrato experimental de ingeniería de contexto para source diversity retrieval selector, con controles de presupuesto y calidad."
family: context-engineering
legacyGroup: 48
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_295_source_diversity_retrieval_selector.ts
tags: [context-engineering, retrieval, safety]
related: [98, 149, 291]
combinesWith: [77, 124]
antiPatterns:
  - Considerar una heurística de contexto como garantía de veracidad o aislamiento.
references: []
---

## Problema y solución

Source Diversity Retrieval Selector define un contrato de selección, composición o verificación de contexto para agentes. Código: `src/pattern_295_source_diversity_retrieval_selector.ts`.

## Pruebas y límites

`tests/p12_context_patterns.test.ts`. Las prioridades, relevancias y etiquetas de confianza requieren validación externa. Marcar contenido como no confiable no impide técnicamente la inyección de instrucciones.

## Evidencia

Estado `needs-review`; exige pruebas adversariales y fuentes primarias.
